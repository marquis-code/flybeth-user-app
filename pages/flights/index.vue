<template>
  <div class="fp-root" @mousedown="handleGlobalMousedown">

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="fp-hero" :class="{'fp-hero--dest': searchQuery.destination}">
      <div class="fp-hero-bg">
        <template v-if="searchQuery.destination">
          <div class="fp-hero-image" :style="{ backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop)' }"></div>
          <div class="fp-hero-overlay"></div>
        </template>
        <template v-else>
          <div class="fp-orb fp-orb--a"></div>
          <div class="fp-orb fp-orb--b"></div>
        </template>
      </div>

      <div class="fp-wrap">

        <!-- Dynamic headline -->
        <div class="fp-headline" :class="{'fp-headline--dest': searchQuery.destination}">
          <template v-if="searchQuery.destination">
            <h1 class="fp-h1 fp-h1--dest">Flights to {{ lookupCity(searchQuery.destination).split(' (')[0] }}</h1>
          </template>
          <template v-else>
            <span class="fp-eyebrow">✦ Flight Search</span>
            <h1 class="fp-h1">
              <template v-if="searchQuery.origin && !searchQuery.destination">
                Flying from <em>{{ searchQuery.origin }}</em>
              </template>
              <template v-else>
                Search<br><em>any flight.</em>
              </template>
            </h1>
          </template>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="fp-bar">

          <!-- FROM field -->
          <div class="fp-fld fp-fld--from">
            <LocationPicker
              v-model="searchQuery.origin"
              label="From"
              placeholder="City or airport"
            />
          </div>

          <!-- SWAP -->
          <button class="fp-swap" @click="swapLocations" title="Swap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
          </button>

          <!-- TO field -->
          <div class="fp-fld fp-fld--to">
            <LocationPicker
              v-model="searchQuery.destination"
              label="To"
              placeholder="City or airport"
            />
          </div>

          <div class="fp-bar-sep"></div>

          <!-- DATE field -->
          <div class="fp-fld fp-fld--date" :class="{ 'fp-fld--active': activeField === 'date' }" ref="dateRef">
            <FlightDateRangePicker 
              :departure="searchQuery.departureDate" 
              :return="searchQuery.returnDate" 
              :mode="searchQuery.type === 'roundtrip' ? 'roundtrip' : 'oneway'" 
              @update:departure="(v) => searchQuery.departureDate = v" 
              @update:return="(v) => searchQuery.returnDate = v" 
              @focus="activeField = 'date'" 
              @close="activeField = null" 
            />
          </div>

          <div class="fp-bar-sep"></div>

          <!-- TRAVELERS field -->
          <div class="fp-fld fp-fld--pax">
            <Occupancypicker
              label="Travelers"
              variant="flight"
              v-model:adults="searchQuery.adults"
              v-model:children="searchQuery.children"
              v-model:infantsOnLap="searchQuery.infantsOnLap"
              v-model:infantsInSeat="searchQuery.infantsInSeat"
              v-model:cabinClass="searchQuery.cabinClass"
            />
          </div>

          <!-- SEARCH BTN -->
          <button class="fp-search-btn" :class="{ 'fp-search-btn--busy': loading }" @click="handleSearch">
            <span class="fp-search-inner">
              <svg v-if="!loading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span v-if="loading" class="fp-spin"></span>
              <span>{{ loading ? 'Searching' : 'Search' }}</span>
            </span>
          </button>

        </div><!-- /fp-bar -->
      </div><!-- /fp-wrap -->
    </section>

    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="fp-wrap fp-main">

      <!-- Purpose strip -->
      <Transition name="fp-fade">
        <div v-if="prediction && !purposeLoading" class="fp-purpose">
          <span class="fp-purpose-pip" :class="prediction.result === 'BUSINESS' ? 'pip--biz' : 'pip--lei'"></span>
          <span class="fp-purpose-copy">
            <strong>{{ prediction.result === 'BUSINESS' ? 'Business trip detected' : 'Leisure mode' }}</strong>
            · {{ prediction.result === 'BUSINESS' ? 'Prioritising comfort and schedule reliability.' : 'Curating best-value routes and local experiences.' }}
          </span>
          <NuxtLink v-if="prediction.result !== 'BUSINESS'" to="/things-to-do" class="fp-purpose-cta">Explore →</NuxtLink>
        </div>
      </Transition>

      <!-- Destination Info Blocks moved down to bottom -->



      <!-- Body grid -->
      <div class="fp-body">

        <!-- Sidebar -->
        <aside class="fp-sidebar" :class="{ 'fp-sidebar--open': mobileFilters }">
          <div class="fp-sbar">
            <div class="fp-sbar-hd">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Refine results</span>
              <button class="fp-reset" @click="clearFilters">Reset</button>
            </div>

            <div class="fp-sb-block">
              <p class="fp-sb-label">Stops</p>
              <div class="fp-chips">
                <button v-for="s in stopOptions" :key="s.value" class="fp-chip" :class="{ 'fp-chip--on': activeStops.includes(s.value) }" @click="toggleStop(s.value)">{{ s.label }}</button>
              </div>
            </div>

            <div class="fp-sb-block" v-if="availableAirlines.length">
              <p class="fp-sb-label">Airlines</p>
              <label v-for="al in availableAirlines" :key="al" class="fp-chk-row">
                <span class="fp-chk" :class="{ 'fp-chk--on': activeAirlines.includes(al) }" @click="toggleAirline(al)">
                  <svg v-if="activeAirlines.includes(al)" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="fp-chk-label">{{ al }}</span>
              </label>
            </div>

            <div class="fp-sb-block">
              <p class="fp-sb-label">Max price <strong>{{ formatPrice(maxPriceFilter) }}</strong></p>
              <div class="fp-range-wrap">
                <input type="range" :min="minPrice" :max="maxPrice" step="1" v-model.number="maxPriceFilter" class="fp-range" />
                <div class="fp-range-ends">
                  <span>{{ formatPrice(minPrice) }}</span>
                  <span>{{ formatPrice(maxPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="fp-results">

          <!-- Toolbar -->
          <div v-if="displayedFlights.length" class="fp-toolbar">
            <span class="fp-rcount">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.61 6.61l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
              {{ sortedFlights.length }} flights found
            </span>
            <div class="fp-toolbar-r">
              <div class="fp-sort-wrap" ref="sortRef">
                <button class="fp-sort-btn" @click.stop="sortOpen = !sortOpen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                  {{ currentSort.label }}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="fp-chev" :class="{ 'fp-chev--up': sortOpen }"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <Transition name="fd">
                  <div v-if="sortOpen" class="fp-sort-panel" @mousedown.stop>
                    <button v-for="o in sortOptions" :key="o.value" class="fp-sort-opt" :class="{ 'fp-sort-opt--on': sortBy === o.value }" @click="sortBy = o.value; sortOpen = false">
                      <span class="fp-sort-dot" :class="{ 'fp-sort-dot--on': sortBy === o.value }"></span>
                      {{ o.label }}
                    </button>
                  </div>
                </Transition>
              </div>
              <button class="fp-filter-mob" @click="mobileFilters = !mobileFilters">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
                <span v-if="activeFilterCount" class="fp-badge">{{ activeFilterCount }}</span>
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="fp-loading">
            <div v-for="n in 4" :key="n" class="fp-skel-card">
              <div class="fp-sk fp-sk--logo"></div>
              <div class="fp-sk-grp">
                <div class="fp-sk fp-sk--lg"></div>
                <div class="fp-sk fp-sk--sm"></div>
              </div>
              <div class="fp-sk fp-sk--price"></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!displayedFlights.length" class="fp-empty mb-3">
            <div class="fp-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </div>
            <h3 class="fp-empty-h">No flights found</h3>
            <p class="fp-empty-p">Try different airports or dates to unlock better options.</p>
            <button class="fp-empty-btn" @click="searchQuery.origin='LHR'; searchQuery.destination='DXB'; handleSearch()">Try London → Dubai</button>
          </div>

          <!-- No filter match -->
          <div v-else-if="!loading && displayedFlights.length && sortedFlights.length === 0" class="fp-empty">
            <div class="fp-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </div>
            <h3 class="fp-empty-h">No matches</h3>
            <p class="fp-empty-p">Your filters returned nothing. Try widening the criteria.</p>
            <button class="fp-empty-btn" @click="clearFilters">Clear filters</button>
          </div>

          <!-- Results -->
          <div v-if="sortedFlights.length" class="fp-groups">
            <template v-for="(flight, index) in sortedFlights" :key="flight.id || index">
              <FlightGroup
                :id="`group-${(flight.airline || '').replace(/\\s+/g, '-')}`"
                :flight="flight"
                :isRecommended="index === 0 && sortBy === 'price'"
                :passengersCount="searchQuery.adults + searchQuery.children + searchQuery.infantsOnLap + searchQuery.infantsInSeat"
                @select="openVariantsDrawer"
              />
              <FlightAdCarousel v-if="(index + 1) % 2 === 0 && index < sortedFlights.length - 1" class="my-4 h-32" />
            </template>
          </div>
        </div>

      </div>

      <!-- Destination Info Blocks (Moved from top) -->
      <div v-if="searchQuery.destination" class="fp-dest-features mt-8">
        <div class="fp-df-grid">
          <div class="fp-df-item">
            <svg class="fp-df-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.61 6.61l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
            <h4 class="fp-df-h">Over 600 airlines</h4>
            <p class="fp-df-p">Search and compare flights from over 600 global airlines to find the best deal.</p>
          </div>
          <div class="fp-df-item">
            <svg class="fp-df-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <h4 class="fp-df-h">Fly now, pay later</h4>
            <p class="fp-df-p">Spread the cost of your flights to {{ lookupCity(searchQuery.destination).split(' (')[0] }} with flexible payment options.</p>
          </div>
          <div class="fp-df-item">
            <svg class="fp-df-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <h4 class="fp-df-h">Book with confidence</h4>
            <p class="fp-df-p">Secure your booking with ease, top-tier encryption, and 24/7 dedicated support.</p>
          </div>
        </div>

        <div class="fp-df-paylater">
          <div class="fp-df-pl-content">
            <h2 class="fp-df-pl-h2">Buy flights to {{ lookupCity(searchQuery.destination).split(' (')[0] }} and pay later</h2>
            <p class="fp-df-pl-p">At Flybeth, you can book your flights and pay for them in flexible installments. Choose from Klarna, Afterpay, Affirm and more at checkout.</p>
            <div class="fp-df-pl-badges">
              <span class="fp-pl-badge" style="background:#FFA8B6;color:#000;">Klarna.</span>
              <span class="fp-pl-badge" style="background:#B2FCE4;color:#000;">afterpay</span>
              <span class="fp-pl-badge" style="background:#004CFF;color:#fff;">Affirm</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Mobile filter overlay -->
    <Transition name="fp-ov">
      <div v-if="mobileFilters" class="fp-overlay" @click.self="mobileFilters = false"></div>
    </Transition>

    <!-- Availability Check Modal -->
    <AvailabilityCheckModal :visible="checkingAvailability" />

    <!-- Flight Variants Side Drawer -->
    <SideDrawer 
      :visible="showVariantsDrawer" 
      @close="showVariantsDrawer = false"
      widthClass="w-[760px]"
    >
      <template #title>
        Select fare to {{ lookupCity(searchQuery.destination).split(' (')[0] }}
      </template>
      <template #default>
        <div class="fd-drawer-content" v-if="selectedFlightSchedule">
          <!-- Outbound details header card -->
          <div class="fd-flight-summary-card">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                  <img v-if="selectedFlightSchedule.airlineLogo" :src="selectedFlightSchedule.airlineLogo" :alt="selectedFlightSchedule.airline" class="h-full w-full object-contain" />
                  <div v-else class="h-full w-full bg-gray-100 rounded flex items-center justify-center">
                    <span class="text-black font-bold text-xs">{{ (selectedFlightSchedule.airline || 'FL').slice(0, 2).toUpperCase() }}</span>
                  </div>
                </div>
                <div>
                  <h4 class="font-bold text-black text-sm leading-tight">{{ selectedFlightSchedule.airline }}</h4>
                  <span class="text-xs text-gray-500 font-semibold mt-1 block">
                    {{ formatTime(selectedFlightSchedule.departureTime) }} - {{ formatTime(selectedFlightSchedule.arrivalTime) }} 
                    ({{ formatDuration(selectedFlightSchedule.duration) }}, {{ selectedFlightSchedule.stops === 0 ? 'nonstop' : `${selectedFlightSchedule.stops} stop${selectedFlightSchedule.stops > 1 ? 's' : ''}` }})
                  </span>
                </div>
              </div>
              <button 
                @click="showDrawerFlightDetails = !showDrawerFlightDetails" 
                class="text-xs font-bold text-[#0D1DAD] hover:text-[#002a66] flex items-center gap-1 transition-colors"
              >
                {{ showDrawerFlightDetails ? 'Hide details' : 'Show details' }}
                <ChevronDown class="w-3.5 h-3.5 transition-transform duration-300" :class="showDrawerFlightDetails ? 'rotate-180' : ''" />
              </button>
            </div>

            <!-- Segment timeline (collapsible) -->
            <div v-if="showDrawerFlightDetails" class="mt-5 pt-5 border-t border-gray-200/60">
              <div class="space-y-6 relative border-l border-gray-200 ml-4 pl-6">
                <div v-for="(segment, idx) in selectedFlightSchedule.segments" :key="idx" class="relative">
                  <!-- Node indicator -->
                  <div class="absolute -left-[29.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0D1DAD] outline outline-4 outline-gray-50"></div>

                  <!-- Segment Header -->
                  <div class="flex flex-wrap gap-2 items-center mb-2">
                    <span class="text-xs font-bold text-black">{{ segment.operatingCarrier || segment.airline || selectedFlightSchedule.airline }}</span>
                    <span class="text-[10px] font-semibold text-gray-500 bg-gray-200/60 px-1.5 py-0.5 rounded">
                      {{ segment.flightNumber }}
                    </span>
                    <span class="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded" v-if="segment.aircraft">
                      {{ segment.aircraft }}
                    </span>
                  </div>

                  <!-- Times & Airports -->
                  <div class="text-[13px] space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-black">{{ formatTime(segment.departureTime) }}</span>
                      <span class="text-gray-600 font-medium">{{ segment.origin }}</span>
                      <span class="text-xs text-gray-400" v-if="segment.originTerminal">(Terminal {{ segment.originTerminal }})</span>
                    </div>
                    <div class="text-[11px] text-gray-400 flex items-center gap-1 pl-1 py-0.5">
                      <Clock class="w-3 h-3 text-gray-300" /> {{ formatDuration(segment.duration) }}
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-black">{{ formatTime(segment.arrivalTime) }}</span>
                      <span class="text-gray-600 font-medium">{{ segment.destination }}</span>
                      <span class="text-xs text-gray-400" v-if="segment.destinationTerminal">(Terminal {{ segment.destinationTerminal }})</span>
                    </div>
                  </div>

                  <!-- Connection Info if multiple segments -->
                  <div v-if="Number(idx) < selectedFlightSchedule.segments.length - 1" class="mt-4 mb-2 -ml-2 py-2 px-3 bg-orange-50/50 rounded-xl border border-orange-100/30 flex items-center gap-2 text-xs">
                    <Clock class="w-3.5 h-3.5 text-orange-600" />
                    <span class="font-bold text-orange-800">
                      Connection layover in {{ segment.destination }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Variants grid -->
          <div class="fd-variant-grid pb-8 overflow-y-auto">
            <div 
              v-for="variant in activeFlightVariants" 
              :key="variant.offerId || variant.id"
              class="fd-variant-card"
            >
              <div>
                <!-- Brand & Cabin -->
                <div class="fd-variant-card-header">
                  <div>
                    <h4 class="fd-variant-title">{{ getFareVariantDetails(variant).brandName }}</h4>
                    <span class="fd-variant-cabin">{{ getFareVariantDetails(variant).cabinLabel }}</span>
                  </div>
                  <span class="fd-variant-price">{{ formatPrice(variant.priceWithCommission || variant.price || 0) }}</span>
                </div>
                
                <p class="fd-variant-price-info">
                  {{ formatPrice(variant.priceWithCommission || variant.price || 0) }} one way for 1 traveler
                </p>

                <!-- Features list -->
                <ul class="fd-variant-features">
                  <!-- Seat -->
                  <li class="fd-variant-feature-item">
                    <Check class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" v-if="getFareVariantDetails(variant).seatText.includes('included')" />
                    <svg class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" v-else>
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                    </svg>
                    <span>{{ getFareVariantDetails(variant).seatText }}</span>
                  </li>
                  <!-- Carry-on -->
                  <li class="fd-variant-feature-item">
                    <Check class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{{ getFareVariantDetails(variant).carryOn }}</span>
                  </li>
                  <!-- Checked bags -->
                  <li class="fd-variant-feature-item">
                    <Check class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" v-if="getFareVariantDetails(variant).checkedBags.includes('included')" />
                    <svg class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" v-else>
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                    </svg>
                    <span>{{ getFareVariantDetails(variant).checkedBags }}</span>
                  </li>
                  <!-- Refundability -->
                  <li class="fd-variant-feature-item">
                    <Check class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" v-if="getFareVariantDetails(variant).refundText.includes('Fully') || getFareVariantDetails(variant).refundText.includes('Refundable')" />
                    <svg class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" v-else>
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    <span>{{ getFareVariantDetails(variant).refundText }}</span>
                  </li>
                  <!-- Changeability -->
                  <li class="fd-variant-feature-item">
                    <Check class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" v-if="getFareVariantDetails(variant).changeText.includes('included')" />
                    <svg class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" v-else>
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                    </svg>
                    <span>{{ getFareVariantDetails(variant).changeText }}</span>
                  </li>
                </ul>
              </div>

              <!-- Select Button -->
              <button 
                @click="selectVariant(variant)"
                class="fd-variant-select-btn"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </template>
    </SideDrawer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import SideDrawer from '@/components/ui/SideDrawer.vue'
import { Plane, Star, Luggage, Users, Clock, Briefcase, Archive, Check, X, ArrowRight, ChevronDown, Info } from 'lucide-vue-next'
import { useSearchFlights } from '@/composables/modules/flights/useSearchFlights'
import { useFetchPopularFlights } from '@/composables/modules/flights/useFetchPopularFlights'
import { useTripPurpose } from '@/composables/modules/flights/useTripPurpose'
import { flightsApi } from '@/api_factory/modules/flights'
import FlightGroup from '@/components/FlightGroup.vue'
import FlightAdCarousel from '@/components/FlightAdCarousel.vue'
import AvailabilityCheckModal from '@/components/AvailabilityCheckModal.vue'
import { useSettings, localeToCurrency } from '@/composables/useSettings'
import LocationPicker from '@/components/LocationPicker.vue'
import Occupancypicker from '@/components/Occupancypicker.vue'
import { useAmadeusLocations } from '@/composables/modules/flights/useAmadeusLocations'

const { loading, flights, searchFlights } = useSearchFlights()
const { popularFlights, fetchPopularFlights } = useFetchPopularFlights()
const { loading: purposeLoading, prediction, predictTripPurpose } = useTripPurpose()
const { setCurrency, formatPrice } = useSettings()
const { detectNearestAirports } = useAmadeusLocations()

// ── Refs ──────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const openField = (field: string) => {
  activeField.value = field
}
const dateRef = ref<HTMLElement | null>(null)
const sortRef = ref<HTMLElement | null>(null)

// ── Fare Variants side drawer Refs ────────────────────────────────────
const showVariantsDrawer = ref(false)
const selectedFlightSchedule = ref<any>(null)
const activeFlightVariants = ref<any[]>([])
const showDrawerFlightDetails = ref(false)
const calViewDate = ref(new Date())
const sortOpen = ref(false)
const mobileFilters = ref(false)
const activeStops = ref<number[]>([])
const activeAirlines = ref<string[]>([])
const maxPriceFilter = ref(99999)
const activeFare = ref('cheapest')
const sortBy = ref('price')
const checkingAvailability = ref(false)

const searchQuery = ref({
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  type: 'oneway',
  adults: 1,
  children: 0,
  infantsOnLap: 0,
  infantsInSeat: 0,
  cabinClass: 'economy'
})

const cabinClasses = [
  { value: 'economy',         label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business',        label: 'Business' },
  { value: 'first',           label: 'First' },
]

const summary = computed(() => {
  const t = searchQuery.value.adults + searchQuery.value.children + searchQuery.value.infantsOnLap + searchQuery.value.infantsInSeat
  const cabinLabel = cabinClasses.find(c => c.value === searchQuery.value.cabinClass)?.label || 'Economy'
  return `${t} Passenger${t > 1 ? 's' : ''}, ${cabinLabel}`
})

// All airports for search & city lookup (preserve dictionary)
const allAirports = [
  { city: 'Lagos', code: 'LOS' }, { city: 'Abuja', code: 'ABV' },
  { city: 'Dubai', code: 'DXB' }, { city: 'London', code: 'LHR' },
  { city: 'London Gatwick', code: 'LGW' }, { city: 'Accra', code: 'ACC' },
  { city: 'Nairobi', code: 'NBO' }, { city: 'New York JFK', code: 'JFK' },
  { city: 'New York Newark', code: 'EWR' }, { city: 'Paris CDG', code: 'CDG' },
  { city: 'Amsterdam', code: 'AMS' }, { city: 'Frankfurt', code: 'FRA' },
  { city: 'Istanbul', code: 'IST' }, { city: 'Cairo', code: 'CAI' },
  { city: 'Johannesburg', code: 'JNB' }, { city: 'Cape Town', code: 'CPT' },
  { city: 'Addis Ababa', code: 'ADD' }, { city: 'Doha', code: 'DOH' },
  { city: 'Toronto', code: 'YYZ' }, { city: 'Singapore', code: 'SIN' },
  { city: 'Hong Kong', code: 'HKG' }, { city: 'Mumbai', code: 'BOM' },
  { city: 'Kigali', code: 'KGL' }, { city: 'Dar es Salaam', code: 'DAR' },
  { city: 'Port Harcourt', code: 'PHC' }, { city: 'Enugu', code: 'ENU' },
]

const handleGlobalMousedown = (e: MouseEvent) => {
  if (activeField.value === 'date') {
    if (dateRef.value && !dateRef.value.contains(e.target as Node)) {
      activeField.value = null
    }
  }
  if (sortRef.value && !sortRef.value.contains(e.target as Node)) {
    sortOpen.value = false
  }
}

// ── Calendar ──────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const calMonthLabel = computed(() =>
  `${MONTHS[calViewDate.value.getMonth()]} ${calViewDate.value.getFullYear()}`
)

const calCells = computed(() => {
  const y = calViewDate.value.getFullYear()
  const m = calViewDate.value.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const today = new Date(); today.setHours(0,0,0,0)
  const cells: any[] = []
  for (let i = 0; i < firstDay; i++) cells.push({ key: `b${i}`, date: null, day: '', past: false, selected: false, today: false })
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d)
    const iso = dt.toISOString().split('T')[0]
    cells.push({ key: iso, date: iso, day: d, past: dt < today, selected: searchQuery.value.departureDate === iso, today: dt.getTime() === today.getTime() })
  }
  return cells
})

const prevMonth = () => { const d = new Date(calViewDate.value); d.setMonth(d.getMonth()-1); calViewDate.value = d }
const nextMonth = () => { const d = new Date(calViewDate.value); d.setMonth(d.getMonth()+1); calViewDate.value = d }
const pickDate = (iso: string) => {
  searchQuery.value.departureDate = iso
  activeField.value = null
  nextTick(() => { activeField.value = 'pax' })
}

const formatDate = (iso: string) => {
  const parts = iso.split('-').map(Number)
  if (parts.length < 3) return iso
  const y = parts[0]
  const m = parts[1]
  const d = parts[2]
  if (y === undefined || m === undefined || d === undefined) return iso
  const monthName = MONTHS[m - 1]
  const monthAbbr = monthName ? monthName.slice(0, 3) : ''
  return `${d} ${monthAbbr} ${y}`
}

// ── Flight data ───────────────────────────────────────────────────────
const displayedFlights = computed(() => {
  const src = flights.value?.length ? flights.value : (popularFlights.value || [])
  return Array.isArray(src) ? src.filter(Boolean) : []
})

const availableAirlines = computed(() =>
  [...new Set(displayedFlights.value.map((f: any) => f.airline).filter(Boolean))]
)

const minPrice = computed(() => {
  if (!displayedFlights.value.length) return 0
  return Math.floor(Math.min(...displayedFlights.value.map((f: any) => f.priceWithCommission || f.price || 0)))
})
const maxPrice = computed(() => {
  if (!displayedFlights.value.length) return 10000
  return Math.ceil(Math.max(...displayedFlights.value.map((f: any) => f.priceWithCommission || f.price || 0)))
})
watch(maxPrice, v => { maxPriceFilter.value = v }, { immediate: true })

const filteredFlights = computed(() =>
  displayedFlights.value.filter((f: any) => {
    const price = f.priceWithCommission || f.price || 0
    if (price > maxPriceFilter.value) return false
    if (activeStops.value.length) {
      const stops = f.stops ?? 0
      const ns = stops >= 2 ? 2 : stops
      if (!activeStops.value.includes(ns)) return false
    }
    if (activeAirlines.value.length && !activeAirlines.value.includes(f.airline)) return false
    return true
  })
)

const getScheduleKey = (flight: any) => {
  if (!flight || !Array.isArray(flight.segments)) return flight?.offerId || String(Math.random())
  return flight.segments.map((s: any) => `${s.flightNumber || ''}-${s.departureTime || ''}`).join('|')
}

// Groups all filtered flights by schedule
const groupedSchedules = computed(() => {
  const groups: Record<string, any[]> = {}
  
  filteredFlights.value.forEach((flight: any) => {
    const key = getScheduleKey(flight)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(flight)
  })
  
  return groups
})

const sortedFlights = computed(() => {
  const primaries = Object.keys(groupedSchedules.value).map(key => {
    const group = groupedSchedules.value[key] || []
    // Sort group variants by price (cheapest first)
    const sortedGroup = [...group].sort((a: any, b: any) => {
      const priceA = a.priceWithCommission || a.price || 0
      const priceB = b.priceWithCommission || b.price || 0
      return priceA - priceB
    })
    // The first one is the representative cheapest offer
    return sortedGroup[0]
  })
  
  return primaries.sort((a: any, b: any) => {
    if (sortBy.value === 'price') return (a.priceWithCommission||a.price||0) - (b.priceWithCommission||b.price||0)
    if (sortBy.value === 'duration') return (a.duration||9999) - (b.duration||9999)
    return 0
  })
})

const openVariantsDrawer = (flight: any) => {
  const key = getScheduleKey(flight)
  const variants = groupedSchedules.value[key] || [flight]
  activeFlightVariants.value = [...variants].sort((a: any, b: any) => {
    const priceA = a.priceWithCommission || a.price || 0
    const priceB = b.priceWithCommission || b.price || 0
    return priceA - priceB
  })
  selectedFlightSchedule.value = flight
  showDrawerFlightDetails.value = false
  showVariantsDrawer.value = true
}

const selectVariant = async (variant: any) => {
  showVariantsDrawer.value = false
  await selectFlight(variant)
}

const getFareVariantDetails = (variant: any) => {
  const cabin = variant.cabinClass || 'economy'
  const isDuffel = variant.provider === 'duffel'
  
  let brandName = ''
  if (variant.rawOffer?.fare_brand_name) {
    brandName = variant.rawOffer.fare_brand_name
  } else if (variant.rawOffer?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.brandedFare) {
    brandName = variant.rawOffer.travelerPricings[0].fareDetailsBySegment[0].brandedFare
  }
  
  if (!brandName) {
    if (cabin === 'economy') {
      if (variant.conditions?.refundable) brandName = 'Plus Select'
      else if (variant.conditions?.changeable) brandName = 'Plus'
      else brandName = 'Basic'
    } else if (cabin === 'premium_economy') {
      brandName = 'Premium Select'
    } else if (cabin === 'business') {
      brandName = 'Club Plus'
    } else {
      brandName = 'First Elite'
    }
  }
  
  brandName = brandName.split('_').join(' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')

  let carryOn = 'Carry-on bag included'
  let checkedBags = '1st checked bag: fee applies'
  
  if (isDuffel) {
    const allowances = variant.rawOffer?.slices?.[0]?.segments?.[0]?.passengers?.[0]?.baggage_allowances || []
    let checkedCount = 0
    allowances.forEach((allowance: any) => {
      if (allowance.type === 'checked') checkedCount += allowance.quantity || 0
    })
    if (checkedCount > 0) {
      checkedBags = `${checkedCount} checked bag${checkedCount > 1 ? 's' : ''} included`
    } else {
      checkedBags = '1st checked bag: for a fee'
    }
  } else {
    const baggage = variant.baggageIncluded || variant.rawOffer?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags
    if (baggage) {
      const quantity = baggage.quantity !== undefined ? baggage.quantity : (typeof baggage === 'object' ? 1 : parseInt(String(baggage)))
      if (quantity > 0) {
        checkedBags = `${quantity} checked bag${quantity > 1 ? 's' : ''} included`
      } else {
        checkedBags = '1st checked bag: for a fee'
      }
    } else {
      checkedBags = '1st checked bag: for a fee'
    }
  }

  let refundText = 'Non-refundable'
  let changeText = 'Changes for a fee'
  
  if (variant.conditions?.refundable) {
    const penalty = variant.conditions.refundPenalty
    refundText = penalty ? `Refundable (fee: ${formatPrice(Number(penalty))})` : 'Fully refundable'
  }
  
  if (variant.conditions?.changeable) {
    const penalty = variant.conditions.changePenalty
    changeText = penalty ? `Changes for a fee (from ${formatPrice(Number(penalty))})` : 'Changes included, only pay fare difference'
  } else {
    changeText = 'Non-changeable'
  }

  let seatText = 'Seat choice for a fee'
  if (cabin === 'business' || cabin === 'first' || brandName.includes('Select') || brandName.includes('Elite')) {
    seatText = 'Seat choice included'
  }

  return {
    brandName,
    cabinLabel: cabin.split('_').join(' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
    seatText,
    carryOn,
    checkedBags,
    refundText,
    changeText
  }
}

const formatTime = (isoString: string) => {
  if (!isoString) return '—'
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  } catch (e) {
    if (typeof isoString === 'string' && isoString.includes(':')) {
      return isoString.split(':').slice(0, 2).join(':')
    }
    return isoString
  }
}

const formatDuration = (val: any) => {
  if (!val) return '—'
  if (typeof val === 'string' && val.startsWith('PT')) {
    const match = val.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (match) {
      const h = match[1] ? `${match[1]}h` : ''
      const m = match[2] ? ` ${match[2]}m` : ''
      return (h + m).trim() || '—'
    }
  }
  const minutes = parseInt(val)
  if (!isNaN(minutes)) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m}m`
    return `${h}h ${m}m`
  }
  return String(val)
}

const filteredGrouped = computed(() =>
  sortedFlights.value.reduce((acc: any, f: any) => {
    const k = f.airline || 'Other'
    if (!acc[k]) acc[k] = []
    acc[k].push(f)
    return acc
  }, {})
)

const airlineMeta = computed(() =>
  Object.keys(filteredGrouped.value).slice(0,5).map(name => ({
    name, logo: filteredGrouped.value[name][0]?.airlineLogo
  }))
)

const activeFilterCount = computed(() =>
  activeStops.value.length + activeAirlines.value.length + (maxPriceFilter.value < maxPrice.value ? 1 : 0)
)

// ── Fare matrix ───────────────────────────────────────────────────────
const stopLabels = ['Non-stop', '1 Stop', '1+ Stops']
const stopOptions = [{ label: 'Non-stop', value: 0 }, { label: '1 stop', value: 1 }, { label: '2+ stops', value: 2 }]
const fareTypes = [
  { key: 'cheapest', label: 'Cheapest fare', badge: 'Best price' },
  { key: 'fastest', label: 'Fastest route', badge: 'Quickest' },
  { key: 'recommended', label: 'Top pick', badge: 'Recommended' },
]
const sortOptions = [
  { value: 'price', label: 'Price — low to high' },
  { value: 'duration', label: 'Duration — shortest' },
  { value: 'recommended', label: 'Recommended' },
]
const currentSort = computed(() => sortOptions.find(o => o.value === sortBy.value)!)

const getMatrixPrice = (type: string) => {
  const fl = displayedFlights.value
  if (!fl.length) return '—'
  const prices = fl.map((f: any) => f.priceWithCommission || f.price || 0)
  if (type === 'cheapest') return Math.min(...prices)
  if (type === 'fastest') {
    const f = [...fl].sort((a: any, b: any) => (a.duration||9999)-(b.duration||9999))[0]
    return (f.priceWithCommission || f.price || 0)
  }
  return (fl[0].priceWithCommission || fl[0].price || 0)
}

const getMatrixPriceFor = (airline: string, sl: string) => {
  const sc = sl === 'Non-stop' ? 0 : sl === '1 Stop' ? 1 : 2
  const fl = filteredGrouped.value[airline] || []
  const f2 = fl.filter((f: any) => sc === 2 ? (f.stops||0) >= 2 : (f.stops||0) === sc)
  if (!f2.length) return null
  return Math.min(...f2.map((f: any) => f.priceWithCommission || f.price || 0))
}

const jumpTo = (airline: string) => {
  const el = document.getElementById(`group-${airline.replace(/\s+/g, '-')}`)
  if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' })
}

// ── Actions ───────────────────────────────────────────────────────────
const handleSearch = () => {
  activeField.value = null
  searchFlights(searchQuery.value)
  predictTripPurpose({ origin: searchQuery.value.origin, destination: searchQuery.value.destination, departureDate: searchQuery.value.departureDate })
}

const swapLocations = () => {
  const t = searchQuery.value.origin; searchQuery.value.origin = searchQuery.value.destination; searchQuery.value.destination = t
}



const toggleStop = (v: number) => {
  const i = activeStops.value.indexOf(v)
  if (i >= 0) activeStops.value.splice(i, 1); else activeStops.value.push(v)
}
const toggleAirline = (al: string) => {
  const i = activeAirlines.value.indexOf(al)
  if (i >= 0) activeAirlines.value.splice(i, 1); else activeAirlines.value.push(al)
}
const clearFilters = () => { activeStops.value = []; activeAirlines.value = []; maxPriceFilter.value = maxPrice.value }

const selectFlight = async (flight: any) => {
  if (!flight) return
  
  // Show availability checking modal
  checkingAvailability.value = true
  
  try {
    // In a real flow, we might call an API here to re-validate the fare.
    // For now we simulate the delay to show the nice Alternative Airlines loading state.
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight))
    const provider = flight.provider || 'duffel'
    navigateTo({ path: '/checkout', query: { type: 'flight', id: String(flight.offerId||flight._id||flight.id||'unknown'), name: String(flight.flightNumbers?.[0]||`${flight.airline} flight`), price: String(flight.priceWithCommission||flight.price||0), provider } })
  } catch (error) {
    console.error('Fare validation failed', error)
  } finally {
    checkingAvailability.value = false
  }
}

const loadFromQuery = (route: any) => {
  if (route.query.origin) { searchQuery.value.origin = String(route.query.origin) }
  if (route.query.destination) { searchQuery.value.destination = String(route.query.destination) }
  if (route.query.departureDate) searchQuery.value.departureDate = String(route.query.departureDate)
  if (route.query.returnDate) searchQuery.value.returnDate = String(route.query.returnDate)
  if (route.query.type) searchQuery.value.type = String(route.query.type)
  
  // Support both old 'passengers' and new granular props
  if (route.query.adults) searchQuery.value.adults = parseInt(String(route.query.adults)) || 1
  else if (route.query.passengers) searchQuery.value.adults = parseInt(String(route.query.passengers)) || 1
  
  if (route.query.children) searchQuery.value.children = parseInt(String(route.query.children)) || 0
  
  if (route.query.infantsOnLap) searchQuery.value.infantsOnLap = parseInt(String(route.query.infantsOnLap)) || 0
  if (route.query.infantsInSeat) searchQuery.value.infantsInSeat = parseInt(String(route.query.infantsInSeat)) || 0
  if (route.query.infants && !route.query.infantsOnLap && !route.query.infantsInSeat) {
    searchQuery.value.infantsOnLap = parseInt(String(route.query.infants)) || 0
  }
  
  if (route.query.cabinClass) searchQuery.value.cabinClass = String(route.query.cabinClass)
  else if (route.query.class) searchQuery.value.cabinClass = String(route.query.class)
}

const lookupCity = (code: string) => {
  const ap = allAirports.find(a => a.code === code)
  return ap ? `${ap.city} (${ap.code})` : code
}

onMounted(async () => {
  const route = useRoute()
  const router = useRouter()
  
  // Aggressively load parameters from URL first to prevent blank states
  loadFromQuery(route)

  let hasRestoredFromLocal = false
  if (!route.query.origin && !route.query.destination && !route.query.sid && import.meta.client) {
    try {
      const saved = localStorage.getItem('flybeth_last_flight_search')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.origin || parsed.destination) {
           searchQuery.value = { ...searchQuery.value, ...parsed }
           hasRestoredFromLocal = true
        }
      }
    } catch(e) {}
  }

  // Auto-set today's date if departureDate is empty
  if (!searchQuery.value.departureDate) {
    searchQuery.value.departureDate = new Date().toISOString().split('T')[0]
  }

  // Aggressive tracking: keep URL and localStorage perfectly in sync
  watch(searchQuery, (newVal) => {
    if (import.meta.client) {
      localStorage.setItem('flybeth_last_flight_search', JSON.stringify(newVal))
    }
    const currentQuery = route.query
    router.replace({ 
      query: { 
        ...currentQuery, 
        origin: newVal.origin || undefined,
        destination: newVal.destination || undefined,
        departureDate: newVal.departureDate || undefined,
        adults: newVal.adults > 1 ? String(newVal.adults) : undefined,
        children: newVal.children > 0 ? String(newVal.children) : undefined,
        infantsOnLap: newVal.infantsOnLap > 0 ? String(newVal.infantsOnLap) : undefined,
        infantsInSeat: newVal.infantsInSeat > 0 ? String(newVal.infantsInSeat) : undefined,
        cabinClass: newVal.cabinClass !== 'economy' ? newVal.cabinClass : undefined
      } 
    })
  }, { deep: true })

  if (route.query.sid) {
    try {
      loading.value = true
      const { data } = await flightsApi.getSearchSession(route.query.sid as string)
      if (data?.searchQuery) {
        searchQuery.value = { ...searchQuery.value, ...data.searchQuery }
        if (data.searchQuery.infants && !data.searchQuery.infantsOnLap) {
          searchQuery.value.infantsOnLap = data.searchQuery.infants
        }
      }
    } catch (err) {
      console.error('Failed to load search session:', err)
      // Fallback: URL params are already loaded!
    } finally {
      loading.value = false
      handleSearch()
    }
  } else if (!route.query.origin && !hasRestoredFromLocal) {
    try {
      loading.value = true
      const ipRes = await fetch('https://ipapi.co/json/')
      const ipData = await ipRes.json()
      
      let autoOrigin = 'LHR' 
      
      if (ipData.country_code === 'NG') autoOrigin = 'LOS'
      else if (ipData.country_code === 'US') autoOrigin = 'JFK'
      else if (ipData.country_code === 'AE') autoOrigin = 'DXB'
      else if (ipData.country_code === 'GH') autoOrigin = 'ACC'
      else if (ipData.country_code === 'KE') autoOrigin = 'NBO'
      else if (ipData.country_code === 'FR') autoOrigin = 'CDG'
 
      searchQuery.value.origin = autoOrigin
      
      if (!searchQuery.value.departureDate) {
         searchQuery.value.departureDate = new Date(Date.now() + 14*86400000).toISOString().split('T')[0] || ''
      }
    } catch (e) {
      searchQuery.value.origin = 'LHR'
    } finally {
      loading.value = false
      if (searchQuery.value.destination) {
        handleSearch()
      }
    }
  } else {
    handleSearch()
  }
  fetchPopularFlights()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.fp-root {
  min-height: 100vh;
  background: #fff;
  font-family: 'Onest', system-ui, sans-serif;
  color: #111;
  overflow-x: clip;
  max-width: 100vw;
}

.fp-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.fp-hero {
  background: #f8f9f7;
  border-bottom: 1px solid #e8e8e2;
  padding: 40px 0 56px;
  position: relative;
  overflow: visible;
}

.fp-hero--dest {
  padding: 120px 0 100px;
  background: #111;
  border-bottom: none;
}

.fp-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

.fp-hero-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.fp-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
  z-index: 2;
}

.fp-orb { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.28; }
.fp-orb--a { width: 420px; height: 420px; background: radial-gradient(circle, #b8e8cc, transparent); top: -180px; right: -60px; }
.fp-orb--b { width: 300px; height: 300px; background: radial-gradient(circle, #d4e6ff, transparent); bottom: -100px; left: 8%; }

/* Headline */
.fp-headline { margin-bottom: 28px; position: relative; z-index: 10; }
.fp-eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.18em; color: #999; display: block; margin-bottom: 10px; }
.fp-h1 { font-family: 'Onest', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.12; color: #111; letter-spacing: -0.03em; }
.fp-h1 em { font-style: normal; color: #0D1DAD; }
.fp-h1--dest { color: #fff; text-shadow: 0 4px 16px rgba(0,0,0,0.3); font-size: clamp(32px, 5vw, 56px); }

/* ── Destination Features ──────────────────────────────────────────── */
.fp-dest-features {
  margin: 40px 0;
}
.fp-df-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}
.fp-df-item {
  background: #f8f9f7;
  padding: 32px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.fp-df-icon {
  margin-bottom: 20px;
  color: #0D1DAD;
}
.fp-df-h {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}
.fp-df-p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
.fp-df-paylater {
  background: #F0F4FF;
  border-radius: 24px;
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 40px;
}
.fp-df-pl-content {
  flex: 1;
}
.fp-df-pl-h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111;
}
.fp-df-pl-p {
  font-size: 16px;
  color: #444;
  margin-bottom: 24px;
  max-width: 500px;
  line-height: 1.5;
}
.fp-df-pl-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.fp-pl-badge {
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 700;
  font-family: sans-serif;
}

/* ── Search bar ────────────────────────────────────────────────────── */
.fp-bar {
  background: #fff;
  border: 1.5px solid #e0e0d8;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 50;
  overflow: visible;
  gap: 0;
}

/* Fields */
.fp-fld {
  position: relative;
  flex: 1;
  min-width: 0;
}

.fp-fld--from { flex: 1.4; }
.fp-fld--to { flex: 1.4; }
.fp-fld--date { flex: 1.1; }
.fp-fld--pax { flex: 0 0 auto; }

.fp-fld-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  height: 100%;
  cursor: pointer;
  border-radius: 14px;
  transition: background 0.15s;
  min-width: 0;
}

.fp-fld-inner:hover { background: #f5f5f0; }
.fp-fld--active .fp-fld-inner { background: #f0f7f3; }

.fp-fld-ico { color: #aaa; flex-shrink: 0; }

.fp-fld-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  overflow: hidden;
}

.fp-fld-lbl {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: #bbb;
  white-space: nowrap;
}

.fp-fld-val {
  font-size: 14px;
  font-weight: 500;
  color: #bbb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fp-fld-val--set { color: #111; }

.fp-bar-sep {
  width: 1px;
  background: #D1D5DB;
  flex-shrink: 0;
  margin: 10px 0;
}

/* Swap button */
.fp-swap {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #e0e0d8;
  background: #fff;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: center;
  margin: 0 4px;
  transition: all 0.2s;
  z-index: 10;
}

@media (max-width: 860px) {
  .fp-swap {
    position: absolute;
    right: 12px;
    top: 54px; /* Positioned between From and To field on mobile */
    margin: 0;
  }
}
@media (max-width: 580px) {
  .fp-swap {
    top: 66px; /* Slightly adjusted for mobile stack */
  }
}
.fp-swap:hover { background: #111; color: #fff; border-color: #111; transform: rotate(180deg); }

/* Search button — compact */
.fp-search-btn {
  flex-shrink: 0;
  background: #0D1DAD;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: 'Onest', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 0 24px;
  margin: 6px;
  min-width: 100px;
  transition: all 0.2s;
  align-self: stretch;
}
.fp-search-btn:hover { background: #0D1DAD; transform: translateY(-1px); }
.fp-search-btn--busy { opacity: 0.75; cursor: wait; }
.fp-search-inner { display: flex; align-items: center; justify-content: center; gap: 7px; white-space: nowrap; }
.fp-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Dropdowns — attached to parent field ──────────────────────────── */
.fp-drop {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border: 1px solid #e0e0d8;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
  z-index: 999;
  overflow: hidden;
}

/* Location dropdown */
.fp-drop--loc {
  width: max(280px, 100%);
  min-width: 280px;
  max-width: 360px;
}

.fp-drop-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0ea;
  background: #fafaf8;
  color: #aaa;
}

.fp-drop-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Onest', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #111;
  outline: none;
  min-width: 0;
}
.fp-drop-input::placeholder { color: #ccc; }

.fp-drop-clear {
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.fp-drop-clear:hover { color: #111; }

.fp-drop-section { padding: 14px; }
.fp-drop-sec-label { font-size: 14px; font-weight: 600; letter-spacing: 0.14em; color: #bbb; display: block; margin-bottom: 10px; }

.fp-drop-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.fp-pop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  background: #f8f8f5;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.12s;
  text-align: left;
}
.fp-pop-item:hover { background: #edf5f1; }

.fp-pop-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e8e8e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  flex-shrink: 0;
}

.fp-pop-name { font-size: 14px; font-weight: 600; color: #111; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fp-pop-code { font-size: 12px; font-weight: 600; color: #999; background: #f0f0ea; padding: 2px 6px; border-radius: 4px; }

.fp-drop-results { padding: 8px; }
.fp-loc-result {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Onest', sans-serif;
  transition: background 0.12s;
  color: #555;
  text-align: left;
}
.fp-loc-result:hover { background: #f5f5f0; }
.fp-loc-city { font-size: 14px; font-weight: 500; color: #111; flex: 1; text-align: left; }
.fp-loc-code { font-size: 12px; font-weight: 700; color: #0D1DAD; background: #edf5f1; padding: 3px 7px; border-radius: 5px; }
.fp-drop-empty { padding: 16px; text-align: center; font-size: 12px; color: #bbb; }

/* Calendar dropdown */
.fp-drop--cal {
  width: 300px;
  padding: 16px;
}

.fp-cal-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.fp-cal-title { font-size: 13px; font-weight: 600; color: #111; }

.fp-cal-arrow {
  width: 30px; height: 30px;
  border-radius: 8px;
  border: 1px solid #e8e8e0;
  background: #fff;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.14s;
}
.fp-cal-arrow:hover { background: #111; color: #fff; border-color: #111; }

.fp-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.fp-cal-dow { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; color: #bbb; text-align: center; padding: 4px 0 8px; }

.fp-cal-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.1s;
}
.fp-cal-cell:not(.fp-cal-cell--blank):not(.fp-cal-cell--past):hover { background: #edf5f1; color: #0D1DAD; }
.fp-cal-cell--blank { pointer-events: none; }
.fp-cal-cell--past { color: #ddd; cursor: not-allowed; }
.fp-cal-cell--today { font-weight: 700; color: #0D1DAD; }
.fp-cal-cell--sel { background: #0D1DAD !important; color: #fff !important; font-weight: 700; }

/* Pax dropdown */
.fp-drop--pax {
  width: 320px;
  right: 0;
  left: auto;
  padding: 24px;
}

.fp-pax-rows { display: flex; flex-direction: column; gap: 20px; }
.fp-pax-item { display: flex; align-items: center; justify-content: space-between; }
.fp-pax-divider { height: 1.5px; background: #f4f4f0; margin: 24px 0; }
.fp-pax-class-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.fp-class-chip {
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid #e8e8e0;
  background: #f8f8f5;
  font-family: 'Onest', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
}
.fp-class-chip:hover { border-color: #ccc; color: #555; background: #fff; }
.fp-class-chip--on { background: #fff; border-color: #0D1DAD; color: #0D1DAD; shadow: 0 4px 12px rgba(50, 180, 4, 0.1); }

.fp-pax-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.fp-pax-info { display: flex; flex-direction: column; gap: 2px; }
.fp-pax-type { font-size: 14px; font-weight: 600; color: #111; }
.fp-pax-sub { font-size: 13px; color: #aaa; }

.fp-pax-ctrl { display: flex; align-items: center; gap: 12px; }

.fp-pax-btn {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1.5px solid #e0e0d8;
  background: #fff;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.14s;
}
.fp-pax-btn:hover:not(:disabled) { border-color: #111; color: #111; }
.fp-pax-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.fp-pax-num { font-size: 16px; font-weight: 700; color: #111; min-width: 20px; text-align: center; }

.fp-pax-done {
  width: 100%;
  margin-top: 28px;
  padding: 14px;
  background: #111;
  border: none;
  border-radius: 12px;
  font-family: 'Onest', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.fp-pax-done:hover { background: #0D1DAD; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(50, 180, 4, 0.2); }

/* ── Main content ──────────────────────────────────────────────────── */
.fp-main { padding-top: 44px; padding-bottom: 72px; }

/* Purpose strip */
.fp-purpose {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  background: #f5fbf7;
  border: 1px solid #cce8d8;
  border-radius: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.fp-purpose-pip { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.pip--biz { background: #111; }
.pip--lei { background: #0D1DAD; }
.fp-purpose-copy { font-size: 12px; color: #555; flex: 1; }
.fp-purpose-copy strong { color: #111; }
.fp-purpose-cta { font-size: 12px; font-weight: 600; color: #0D1DAD; text-decoration: none; white-space: nowrap; }

/* Fare cards */
.fp-fares {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 14px;
  margin-bottom: 28px;
}

.fp-fare {
  background: #fff;
  border: 1.5px solid #eaeae3;
  border-radius: 16px;
  padding: 22px 24px;
  cursor: pointer;
  transition: all 0.18s;
}
.fp-fare:hover { border-color: #0D1DAD; }
.fp-fare--on { border-color: #0D1DAD; background: #f5fbf7; }

.fp-fare-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 10px;
}
.fp-fare-tag--cheapest { background: #e8f5ef; color: #0D1DAD; }
.fp-fare-tag--fastest { background: #fef3e8; color: #c06010; }
.fp-fare-tag--recommended { background: #eef0ff; color: #4050c0; }

.fp-fare-price {
  font-size: 24px;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.03em;
  margin-bottom: 3px;
}
.fp-fare-label { font-size: 11px; color: #aaa; }

/* Matrix */
.fp-matrix { background: #fff; border: 1px solid #eaeae3; border-radius: 16px; overflow: hidden; margin-bottom: 32px; }
.fp-matrix-hd { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; border-bottom: 1px solid #f0f0ea; }
.fp-sec-label { font-size: 14px; font-weight: 700; letter-spacing: 0.1em; color: #111; }
.fp-sec-hint { font-size: 11px; color: #000; font-weight: 600; }
.fp-matrix-scroll { overflow-x: auto; }
.fp-mtable { width: 100%; border-collapse: collapse; }
.fp-mth { padding: 14px 16px; background: #fafaf8; text-align: center; border-bottom: 1px solid #f0f0ea; }
.fp-mth--first { min-width: 90px; text-align: left; }
.fp-al-box { width: 28px; height: 28px; border-radius: 7px; background: #fff; border: 1px solid #eaeae3; display: flex; align-items: center; justify-content: center; margin: 0 auto 3px; overflow: hidden; }
.fp-al-img { width: 20px; height: 20px; object-fit: contain; }
.fp-al-abbr { font-size: 12px; font-weight: 700; color: #000; }
.fp-al-nm { display: block; font-size: 12px; color: #000; font-weight: 700; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fp-mstop { padding: 14px 18px; font-size: 11px; color: #000; border-bottom: 1px solid #f8f8f5; font-weight: 700; }
.fp-mcell { padding: 14px 18px; text-align: center; border-bottom: 1px solid #f8f8f5; cursor: pointer; transition: background 0.12s; }
.fp-mcell:hover { background: #f0f7f3; }
.fp-mprice { font-size: 12px; font-weight: 700; color: #000; }
.fp-mdash { font-size: 13px; color: #000; font-weight: 700; }

/* Body grid */
.fp-body { display: grid; grid-template-columns: 240px 1fr; gap: 28px; align-items: start; }

/* Sidebar */
.fp-sidebar { position: sticky; top: 20px; }
.fp-sbar {
  background: #fff;
  border: 1px solid #eaeae3;
  border-radius: 16px;
  padding: 22px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.fp-sbar-hd {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #111;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f0ea;
  margin-bottom: 18px;
}
.fp-reset { margin-left: auto; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; color: #bbb; background: none; border: none; cursor: pointer; transition: color 0.15s; }
.fp-reset:hover { color: #0D1DAD; }

.fp-sb-block { margin-bottom: 24px; }
.fp-sb-label { font-size: 14px; font-weight: 700; letter-spacing: 0.14em; color: #bbb; display: block; margin-bottom: 12px; }
.fp-sb-label strong { color: #111;  letter-spacing: 0; font-size: 12px; }

.fp-chips { display: flex; flex-direction: column; gap: 5px; }
.fp-chip {
  padding: 8px 12px;
  background: #fafaf7;
  border: 1.5px solid transparent;
  border-radius: 8px;
  font-family: 'Onest', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  text-align: left;
  transition: all 0.14s;
}
.fp-chip:hover { border-color: #cce8d8; color: #0D1DAD; }
.fp-chip--on { background: #edf5f1; border-color: #0D1DAD; color: #0D1DAD; font-weight: 600; }

.fp-chk-row { display: flex; align-items: center; gap: 9px; padding: 6px 0; cursor: pointer; }
.fp-chk { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #d8d8d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; transition: all 0.14s; cursor: pointer; }
.fp-chk--on { background: #0D1DAD; border-color: #0D1DAD; }
.fp-chk-label { font-size: 12px; color: #333; }

.fp-range-wrap { display: flex; flex-direction: column; gap: 7px; }
.fp-range { width: 100%; -webkit-appearance: none; height: 3px; background: #e8e8e0; border-radius: 2px; outline: none; cursor: pointer; accent-color: #0D1DAD; }
.fp-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border: 2px solid #0D1DAD; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 6px rgba(29,122,79,0.2); }
.fp-range-ends { display: flex; justify-content: space-between; font-size: 10px; color: #bbb; }

/* Toolbar */
.fp-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.fp-rcount { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #aaa; }
.fp-toolbar-r { display: flex; align-items: center; gap: 8px; }

.fp-sort-wrap { position: relative; }
.fp-sort-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #fff; border: 1px solid #e0e0d8; border-radius: 9px; font-family: 'Onest', sans-serif; font-size: 14px; font-weight: 500; color: #333; cursor: pointer; white-space: nowrap; transition: border-color 0.14s; }
.fp-sort-btn:hover { border-color: #aaa; }
.fp-chev { transition: transform 0.18s; color: #aaa; }
.fp-chev--up { transform: rotate(180deg); }

.fp-sort-panel { position: absolute; right: 0; top: calc(100% + 5px); background: #fff; border: 1px solid #e0e0d8; border-radius: 12px; padding: 5px; min-width: 210px; z-index: 100; box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.fp-sort-opt { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px; border: none; border-radius: 7px; background: none; font-family: 'Onest', sans-serif; font-size: 14px; color: #333; cursor: pointer; text-align: left; transition: background 0.12s; }
.fp-sort-opt:hover { background: #f5f5f0; }
.fp-sort-opt--on { font-weight: 600; color: #0D1DAD; }
.fp-sort-dot { width: 5px; height: 5px; border-radius: 50%; background: #d8d8d0; flex-shrink: 0; }
.fp-sort-dot--on { background: #0D1DAD; }

.fp-filter-mob { display: none; align-items: center; gap: 6px; padding: 7px 12px; background: #111; border: none; border-radius: 9px; font-family: 'Onest', sans-serif; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; position: relative; }
.fp-badge { position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background: #0D1DAD; border-radius: 50%; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* Loading */
.fp-loading { display: flex; flex-direction: column; gap: 10px; }
.fp-skel-card { background: #fff; border: 1px solid #eaeae3; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
.fp-sk { background: #f0f0ea; border-radius: 5px; }
.fp-sk--logo { width: 40px; height: 40px; border-radius: 9px; flex-shrink: 0; }
.fp-sk-grp { flex: 1; display: flex; flex-direction: column; gap: 7px; }
.fp-sk--lg { height: 13px; width: 65%; }
.fp-sk--sm { height: 11px; width: 38%; }
.fp-sk--price { width: 65px; height: 20px; }

/* Empty */
.fp-empty { display: flex; flex-direction: column; align-items: center; padding: 80px 32px; gap: 12px; text-align: center; background: #fff; border: 1px solid #eaeae3; border-radius: 16px; }
.fp-empty-ico { width: 56px; height: 56px; border-radius: 14px; background: #f5fbf7; display: flex; align-items: center; justify-content: center; color: #0D1DAD; margin-bottom: 4px; }
.fp-empty-h { font-size: 20px; font-weight: 700; color: #111; }
.fp-empty-p { font-size: 13px; color: #aaa; max-width: 300px; line-height: 1.6; }
.fp-empty-btn { margin-top: 6px; padding: 10px 22px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.18s; }
.fp-empty-btn:hover { background: #0D1DAD; }

.fp-groups { display: flex; flex-direction: column; gap: 16px; }

/* Overlay */
.fp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.38); z-index: 150; backdrop-filter: blur(2px); }

/* ── Transitions ───────────────────────────────────────────────────── */
.fd-enter-active, .fd-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.fd-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.fd-leave-to { opacity: 0; transform: translateY(-3px) scale(0.99); }

.fp-fade-enter-active, .fp-fade-leave-active { transition: opacity 0.28s ease; }
.fp-fade-enter-from, .fp-fade-leave-to { opacity: 0; }

.fp-ov-enter-active, .fp-ov-leave-active { transition: opacity 0.22s ease; }
.fp-ov-enter-from, .fp-ov-leave-to { opacity: 0; }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .fp-body { grid-template-columns: 1fr; }
  .fp-sidebar { position: static; }
  .fp-sbar { display: none; }
  .fp-sidebar--open .fp-sbar {
    display: block;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    border-radius: 18px 18px 0 0;
    z-index: 200;
    max-height: 85vh;
    overflow-y: auto;
  }
  .fp-filter-mob { display: flex; }
}

@media (max-width: 860px) {
  /* Compact bar on tablet — wrap fields into 2 rows */
  .fp-bar {
    flex-wrap: wrap;
    border-radius: 14px;
    padding: 6px;
    gap: 0;
  }
  .fp-fld--from, .fp-fld--to {
    flex: 1 0 calc(50% - 20px);
    min-width: 0;
  }
  .fp-bar { position: relative; }
  .fp-bar-sep:first-of-type { display: none; }
  .fp-bar-sep { height: 1px; width: 100%; margin: 0; background: #D1D5DB; }
  .fp-fld--date { flex: 1 0 50%; }
  .fp-fld--pax { flex: 1 0 40%; }
  .fp-search-btn { flex: 1 0 100%; margin: 4px 0 0; border-radius: 10px; min-height: 46px; }
  .fp-fares { grid-template-columns: 1fr 1fr; }
  .fp-fares > :last-child { grid-column: 1 / -1; }
}

@media (max-width: 580px) {
  .fp-wrap { padding: 0 14px; }
  .fp-hero { padding: 28px 0 44px; }
  .fp-fld--from, .fp-fld--to, .fp-fld--date { flex: 1 0 100%; border-bottom: 1px solid #D1D5DB; }
  .fp-fld--pax { flex: 1 0 100%; border-bottom: none; }
  /* Removed order based swap positioning */
  .fp-bar-sep { display: none; }
  /* Keep dropdowns inside viewport on mobile */
  .fp-drop--loc { max-width: calc(100vw - 28px); left: 0; }
  .fp-drop--cal { width: calc(100vw - 28px); left: 0; }
  .fp-drop--pax { left: 0; right: auto; width: calc(100vw - 28px); }
  .fp-fares { grid-template-columns: 1fr; }
  .fp-df-paylater {
    flex-direction: column;
    padding: 24px;
    gap: 20px;
    text-align: center;
  }
  .fp-df-pl-badges {
    justify-content: center;
  }
}

/* --- Premium Flight Variant Side Drawer Custom Styles --- */
.fd-drawer-content {
  padding: 28px 36px 36px 36px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fd-flight-summary-card {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 28px;
}

.fd-variant-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding-bottom: 36px;
}

@media (min-width: 640px) {
  .fd-variant-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.fd-variant-card {
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 28px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fd-variant-card:hover {
  border-color: #0D1DAD;
  box-shadow: 0 10px 25px -5px rgba(13, 29, 173, 0.08), 0 8px 10px -6px rgba(13, 29, 173, 0.08);
  transform: translateY(-2px);
}

.fd-variant-card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.fd-variant-title {
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  line-height: 1.25;
}

.fd-variant-cabin {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
  display: block;
}

.fd-variant-price {
  font-size: 24px;
  font-weight: 900;
  color: #111827;
  line-height: 1;
}

.fd-variant-price-info {
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 24px;
}

.fd-variant-features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fd-variant-feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.fd-variant-select-btn {
  width: 100%;
  padding: 16px;
  background-color: #0D1DAD;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  margin-top: 12px;
}

.fd-variant-select-btn:hover {
  background-color: #002a66;
}

.fd-variant-select-btn:active {
  transform: scale(0.98);
}
</style>