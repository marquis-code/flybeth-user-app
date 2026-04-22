<template>
  <div class="sw-root" :class="isSticky ? 'sw-root--sticky' : ''">

    <!-- ─── Tab Bar ─── -->
    <div class="sw-tabs">
      <!-- Mobile pill scroll -->
      <div class="sw-tabs-mobile">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="currentTab = tab.name"
          class="sw-tab-pill"
          :class="currentTab === tab.name ? 'sw-tab-pill--on' : ''"
        >
          <component :is="tab.icon" class="sw-tab-ico" />
          {{ tab.label }}
        </button>
      </div>
      <!-- Desktop underline nav -->
      <nav class="sw-tabs-desk" aria-label="Search tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="currentTab = tab.name"
          class="sw-tab-btn"
          :class="currentTab === tab.name ? 'sw-tab-btn--on' : ''"
        >
          <component :is="tab.icon" class="sw-tab-ico" />
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Global backdrop -->
    <Teleport to="body">
      <Transition name="sw-fade">
        <div
          v-if="isFocused || activeCruiseField"
          class="sw-backdrop"
          @click="isFocused = false; activeCruiseField = null"
        />
      </Transition>
    </Teleport>

    <!-- ─── Panel ─── -->
    <div class="sw-panel" :class="isSticky ? 'sw-panel--sm' : ''">

      <!-- ════ FLIGHTS ════ -->
      <div v-if="currentTab === 'Flights'" class="sw-section">
        <!-- Mode -->
        <div class="sw-radios">
          <label v-for="m in flightModes" :key="m.value" class="sw-radio">
            <input type="radio" :value="m.value" v-model="flightMode" class="sr-only" />
            <span class="sw-radio-dot" :class="flightMode === m.value ? 'sw-radio-dot--on' : ''" />
            <span class="sw-radio-txt" :class="flightMode === m.value ? 'sw-radio-txt--on' : ''">{{ m.label }}</span>
          </label>
        </div>

        <!-- Fields -->
        <div class="sw-rows">
          <div
            v-for="(leg, idx) in flightMode === 'multicity' ? multiFlightLegs : [flightSearchState]"
            :key="idx"
            class="sw-bar"
          >
            <div class="sw-field sw-field--grow" @click="isFocused = true">
              <LocationPicker v-model="leg.origin" label="From" placeholder="City or airport" @focus="isFocused = true" @close="isFocused = false" />
            </div>
            <!-- Swap button: sits between From and To -->
            <div class="sw-swap-wrap">
              <div class="sw-bar-div" />
              <button
                v-if="flightMode !== 'multicity'"
                class="sw-swap-btn"
                @click.stop="swapFlightLocations(leg)"
                title="Swap locations"
                type="button"
              >
                <ArrowUpDown class="sw-ico-sm" />
              </button>
              <div v-else class="sw-bar-div" />
            </div>
            <div class="sw-field sw-field--grow" @click="isFocused = true">
              <LocationPicker v-model="leg.destination" label="To" placeholder="City or airport" @focus="isFocused = true" @close="isFocused = false" />
            </div>
            <div class="sw-bar-div" />
            <div class="sw-field sw-field--date" @click="isFocused = true">
              <FlightDateRangePicker
                :mode="flightMode === 'multicity' ? 'oneway' : (flightMode as any)"
                v-model:departure="leg.departureDate"
                v-model:return="leg.returnDate"
                @focus="isFocused = true"
                @close="isFocused = false"
              />
            </div>
            <div v-if="idx === 0" class="sw-bar-div" />
            <div v-if="idx === 0" class="sw-field sw-field--pax" @click="isFocused = true">
              <Occupancypicker 
                label="Passengers" 
                variant="flight" 
                v-model:adults="flightTravelers.adults" 
                v-model:children="flightTravelers.children" 
                v-model:infantsOnLap="flightTravelers.infantsOnLap"
                v-model:infantsInSeat="flightTravelers.infantsInSeat"
                @focus="isFocused = true" 
                @close="isFocused = false" 
              />
            </div>
            <div v-if="idx === 0" class="sw-bar-div" />
            <div v-if="idx === 0" class="sw-field sw-field--class" ref="classRef">
              <button 
                type="button"
                @click="isClassOpen = !isClassOpen" 
                class="sw-field-inner w-full text-left bg-transparent border-none p-0 outline-none group"
              >
                <span class="sw-fld-lbl group-hover:text-gray-900 transition-colors">Class</span>
                <div class="flex items-center justify-between gap-1 mt-1">
                  <span class="sw-fld-val sw-fld-val--trunc">{{ currentCabinLabel }}</span>
                  <ChevronDown class="sw-ico-xs sw-ico-muted transition-transform duration-200" :class="isClassOpen ? 'rotate-180' : ''" />
                </div>
              </button>

              <Teleport v-if="isClassOpen" to="body">
                <div class="fixed inset-0 z-[1000000] bg-black/5" @click="isClassOpen = false"></div>
                <Transition name="sw-drop" appear>
                  <div 
                    class="sw-drop" 
                    :style="classDropdownStyle"
                  >
                    <div 
                      v-for="opt in cabinClasses" 
                      :key="opt.value"
                      @click="flightTravelers.cabinClass = opt.value; isClassOpen = false"
                      class="sw-drop-item"
                      :class="flightTravelers.cabinClass === opt.value ? 'sw-drop-item--on' : 'sw-drop-item--idle'"
                    >
                      <span class="text-[14px] font-semibold" :class="flightTravelers.cabinClass === opt.value ? 'text-white' : 'text-gray-900'">{{ opt.label }}</span>
                      <Check v-if="flightTravelers.cabinClass === opt.value" class="sw-ico-sm text-green-500" />
                    </div>
                  </div>
                </Transition>
              </Teleport>
            </div>
          </div>
        </div>

        <button
          v-if="flightMode === 'multicity' && multiFlightLegs.length < 5"
          @click="multiFlightLegs.push({ origin: '', destination: '', departureDate: '', returnDate: '' })"
          class="sw-add-btn"
        >
          <Plus class="sw-ico-xs" /> Add flight
        </button>

        <div class="sw-footer">
          <div class="sw-bundles">
            <span class="sw-bundle-lbl">Bundle + Save</span>
            <label class="sw-chk"><input type="checkbox" v-model="bundles.bundleHotel" class="sr-only" /><span class="sw-chk-box" :class="bundles.bundleHotel ? 'sw-chk-box--on' : ''"><Check v-if="bundles.bundleHotel" class="sw-ico-xs sw-chk-ico" /></span><span class="sw-radio-txt">+ Hotel</span></label>
            <label class="sw-chk"><input type="checkbox" v-model="bundles.bundleCar" class="sr-only" /><span class="sw-chk-box" :class="bundles.bundleCar ? 'sw-chk-box--on' : ''"><Check v-if="bundles.bundleCar" class="sw-ico-xs sw-chk-ico" /></span><span class="sw-radio-txt">+ Car</span></label>
          </div>
          <button @click="handleSearch" class="sw-search-btn"><Search class="sw-ico-sm" /> Search flights</button>
        </div>
      </div>

      <!-- ════ HOTELS ════ -->
      <div v-if="currentTab === 'Hotels'" class="sw-section">
        <div class="sw-radios">
          <label v-for="m in stayModes" :key="m.value" class="sw-radio">
            <input type="radio" :value="m.value" v-model="stayMode" class="sr-only" />
            <span class="sw-radio-dot" :class="stayMode === m.value ? 'sw-radio-dot--on' : ''" />
            <span class="sw-radio-txt" :class="stayMode === m.value ? 'sw-radio-txt--on' : ''">{{ m.label }}</span>
          </label>
        </div>

        <div v-if="stayMode === 'single'" class="sw-bar">
          <div class="sw-field sw-field--grow">
            <LocationPicker v-model="searchState.location" label="Where to" placeholder="City, hotel or area" @focus="isFocused = true" @close="isFocused = false" />
          </div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date">
            <FlightDateRangePicker :departure="searchState.checkIn" :return="searchState.checkOut" mode="roundtrip" @focus="isFocused = true" @close="isFocused = false" @update:departure="(v: string) => searchState.checkIn = v" @update:return="(v: string) => searchState.checkOut = v" />
          </div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--pax">
            <Occupancypicker v-model:rooms="occupancy.rooms" v-model:adults="occupancy.adults" v-model:children="occupancy.children" @focus="isFocused = true" @close="isFocused = false" />
          </div>
        </div>

        <div v-else class="sw-rows">
          <div v-for="(hotel, idx) in multiHotelLegs" :key="idx" class="sw-multi-leg">
            <span class="sw-leg-lbl">Hotel {{ idx + 1 }}</span>
            <div class="sw-bar">
              <div class="sw-field sw-field--grow"><LocationPicker v-model="hotel.location" label="Where to" placeholder="City or area" /></div>
              <div class="sw-bar-div" />
              <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="hotel.checkIn" :return="hotel.checkOut" mode="roundtrip" @update:departure="(v: string) => hotel.checkIn = v" @update:return="(v: string) => hotel.checkOut = v" /></div>
            </div>
          </div>
          <button v-if="multiHotelLegs.length < 5" @click="addHotelLeg" class="sw-add-btn"><Plus class="sw-ico-xs" /> Add hotel</button>
        </div>

        <div class="sw-footer">
          <div class="sw-bundles">
            <span class="sw-bundle-lbl">Bundle + Save</span>
            <label class="sw-chk"><input type="checkbox" v-model="bundles.bundleFlight" class="sr-only" /><span class="sw-chk-box" :class="bundles.bundleFlight ? 'sw-chk-box--on' : ''"><Check v-if="bundles.bundleFlight" class="sw-ico-xs sw-chk-ico" /></span><span class="sw-radio-txt">+ Flight</span></label>
            <label class="sw-chk"><input type="checkbox" v-model="bundles.bundleCar" class="sr-only" /><span class="sw-chk-box" :class="bundles.bundleCar ? 'sw-chk-box--on' : ''"><Check v-if="bundles.bundleCar" class="sw-ico-xs sw-chk-ico" /></span><span class="sw-radio-txt">+ Car</span></label>
          </div>
          <button @click="handleSearch" class="sw-search-btn"><Search class="sw-ico-sm" /> Search hotels</button>
        </div>
      </div>

      <!-- ════ PACKAGES ════ -->
      <div v-if="currentTab === 'Packages'" class="sw-section">
        <div class="sw-radios sw-radios--wrap">
          <label v-for="pt in packageTypes" :key="pt.value" class="sw-radio">
            <input type="radio" :value="pt.value" v-model="packageType" class="sr-only" />
            <span class="sw-radio-dot" :class="packageType === pt.value ? 'sw-radio-dot--on' : ''" />
            <span class="sw-radio-txt" :class="packageType === pt.value ? 'sw-radio-txt--on' : ''">{{ pt.label }}</span>
          </label>
        </div>

        <div class="sw-bar">
          <div class="sw-field sw-field--grow"><LocationPicker v-model="packageSearchState.origin" label="From" placeholder="Origin" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--grow"><LocationPicker v-model="packageSearchState.destination" label="To" placeholder="Destination" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="packageSearchState.departureDate" :return="packageSearchState.returnDate" mode="roundtrip" @update:departure="(v) => packageSearchState.departureDate = v" @update:return="(v) => packageSearchState.returnDate = v" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--pax"><Occupancypicker v-model:rooms="packageOccupancy.rooms" v-model:adults="packageOccupancy.adults" @focus="isFocused = true" @close="isFocused = false" /></div>
        </div>

        <div class="sw-checks">
          <label v-if="packageType.includes('Hotel') && packageType.includes('Flight')" class="sw-chk">
            <input type="checkbox" v-model="onlyPartialHotel" class="sr-only" />
            <span class="sw-chk-box" :class="onlyPartialHotel ? 'sw-chk-box--on' : ''"><Check v-if="onlyPartialHotel" class="sw-ico-xs sw-chk-ico" /></span>
            <span class="sw-radio-txt">Hotel for part of stay only</span>
          </label>
          <label v-if="packageType.includes('Car')" class="sw-chk">
            <input type="checkbox" v-model="differentCarDropoff" class="sr-only" />
            <span class="sw-chk-box" :class="differentCarDropoff ? 'sw-chk-box--on' : ''"><Check v-if="differentCarDropoff" class="sw-ico-xs sw-chk-ico" /></span>
            <span class="sw-radio-txt">Pick up car elsewhere</span>
          </label>
        </div>

        <Transition name="sw-slide">
          <div v-if="onlyPartialHotel" class="sw-extra-dates">
            <span class="sw-leg-lbl">Hotel dates</span>
            <div class="sw-bar sw-bar--compact">
              <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="packageSearchState.hotelCheckIn" :return="packageSearchState.hotelCheckOut" mode="roundtrip" @update:departure="(v: string) => packageSearchState.hotelCheckIn = v" @update:return="(v: string) => packageSearchState.hotelCheckOut = v" /></div>
            </div>
          </div>
        </Transition>

        <div class="sw-footer">
          <a href="#" class="sw-adv-link">Advanced search</a>
          <button @click="handleSearch" class="sw-search-btn"><Search class="sw-ico-sm" /> Search packages</button>
        </div>
      </div>

      <!-- ════ CARS ════ -->
      <div v-if="currentTab === 'Cars'" class="sw-section">
        <div class="sw-seg">
          <button v-for="m in modeModes" :key="m.value" @click="carMode = m.value" class="sw-seg-btn" :class="carMode === m.value ? 'sw-seg-btn--on' : ''">{{ m.label }}</button>
        </div>
        <div class="sw-bar">
          <div class="sw-field sw-field--grow"><LocationPicker v-model="carSearchState.origin" label="Pick-up" placeholder="Location or airport" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--grow"><LocationPicker v-model="carSearchState.destination" label="Drop-off" placeholder="Same as pick-up" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="carSearchState.pickUpDate" mode="oneway" @update:departure="(v) => carSearchState.pickUpDate = v" @focus="isFocused = true" @close="isFocused = false" /></div>
        </div>
        <div class="sw-footer">
          <label class="sw-chk">
            <input type="checkbox" v-model="differentCarDropoff" class="sr-only" />
            <span class="sw-chk-box" :class="differentCarDropoff ? 'sw-chk-box--on' : ''"><Check v-if="differentCarDropoff" class="sw-ico-xs sw-chk-ico" /></span>
            <span class="sw-radio-txt">Return at different location</span>
          </label>
          <button @click="handleSearch" class="sw-search-btn"><Search class="sw-ico-sm" /> Search cars</button>
        </div>
      </div>

      <!-- ════ TRANSFERS ════ -->
      <div v-if="currentTab === 'Transfers'" class="sw-section">
        <div class="sw-seg">
          <button v-for="m in modeModes" :key="m.value" @click="transferMode = m.value" class="sw-seg-btn" :class="transferMode === m.value ? 'sw-seg-btn--on' : ''">{{ m.label }}</button>
        </div>
        <div class="sw-bar">
          <div class="sw-field sw-field--grow"><LocationPicker v-model="transferSearchState.origin" label="From" placeholder="Airport or address" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--grow"><LocationPicker v-model="transferSearchState.destination" label="To" placeholder="Hotel or address" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="transferSearchState.date" mode="oneway" @update:departure="(v) => transferSearchState.date = v" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--time">
            <span class="sw-fld-lbl">Time</span>
            <CustomTimePicker v-model="transferSearchState.time" @focus="isFocused = true" @close="isFocused = false">
              <template #default="{ value }">
                <div class="sw-time-row">
                  <Clock class="sw-ico-sm sw-ico-muted" />
                  <span class="sw-fld-val">{{ value }}</span>
                </div>
              </template>
            </CustomTimePicker>
          </div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--pax"><Occupancypicker label="Passengers" variant="flight" v-model:adults="transferOccupancy.adults" v-model:children="transferOccupancy.children" @focus="isFocused = true" @close="isFocused = false" /></div>
        </div>
        <div class="sw-footer sw-footer--end">
          <button @click="handleSearch" class="sw-search-btn"><Search class="sw-ico-sm" /> Search transfers</button>
        </div>
      </div>

      <!-- ════ ACTIVITIES ════ -->
      <div v-if="currentTab === 'Activities'" class="sw-section">
        <div class="sw-bar">
          <div class="sw-field sw-field--grow"><CityPicker v-model="activitiesSearchState.destination" label="Destination" placeholder="City or region" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="activitiesSearchState.date" mode="oneway" @update:departure="(v) => activitiesSearchState.date = v" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--cat">
            <span class="sw-fld-lbl">Category</span>
            <span class="sw-fld-val">All activities</span>
          </div>
        </div>
        <div class="sw-footer sw-footer--end">
          <button @click="handleSearch" class="sw-search-btn"><Search class="sw-ico-sm" /> Search activities</button>
        </div>
      </div>

      <!-- ════ CRUISES ════ -->
      <div v-if="currentTab === 'Cruises'" class="sw-section">
        <div class="sw-cruise-grid sw-cruise-grid--2">
          <!-- Destination -->
          <div class="sw-cruise-field-wrap" ref="destRef">
            <button @click="toggleCruiseField('destination')" class="sw-cruise-btn" :class="activeCruiseField === 'destination' ? 'sw-cruise-btn--on' : ''">
              <MapPin class="sw-ico-sm sw-ico-muted" />
              <div class="sw-cruise-txt">
                <span class="sw-fld-lbl">Destination</span>
                <span class="sw-fld-val sw-fld-val--trunc">{{ cruiseSearchState.destinationLabel || 'Any destination' }}</span>
              </div>
              <ChevronDown class="sw-ico-sm sw-ico-muted sw-chev" :class="activeCruiseField === 'destination' ? 'sw-chev--up' : ''" />
            </button>
            <Teleport to="body">
              <Transition name="sw-drop">
                <div v-if="activeCruiseField === 'destination'" class="sw-drop" :style="cruiseDropdownStyle('destination')">
                  <div v-for="opt in cruiseDestinations" :key="opt.value + opt.label"
                    @click="!opt.disabled && selectCruise('destination', opt)"
                    class="sw-drop-item"
                    :class="opt.disabled ? 'sw-drop-item--div' : cruiseSearchState.destination === opt.value ? 'sw-drop-item--on' : 'sw-drop-item--idle'"
                  >
                    <span>{{ opt.label }}</span>
                    <Check v-if="!opt.disabled && cruiseSearchState.destination === opt.value" class="sw-ico-xs" />
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>

          <!-- Departing -->
          <div class="sw-cruise-field-wrap" ref="departRef">
            <button @click="toggleCruiseField('departing')" class="sw-cruise-btn" :class="activeCruiseField === 'departing' ? 'sw-cruise-btn--on' : ''">
              <CalendarDays class="sw-ico-sm sw-ico-muted" />
              <div class="sw-cruise-txt">
                <span class="sw-fld-lbl">Departing</span>
                <span class="sw-fld-val">{{ cruiseSearchState.departingLabel || 'Any month' }}</span>
              </div>
              <ChevronDown class="sw-ico-sm sw-ico-muted sw-chev" :class="activeCruiseField === 'departing' ? 'sw-chev--up' : ''" />
            </button>
            <Teleport to="body">
              <Transition name="sw-drop">
                <div v-if="activeCruiseField === 'departing'" class="sw-drop" :style="cruiseDropdownStyle('departing')">
                  <div v-for="m in cruiseMonths" :key="m.value" @click="selectCruise('departing', m)" class="sw-drop-item" :class="cruiseSearchState.departingMonth === m.value ? 'sw-drop-item--on' : 'sw-drop-item--idle'">
                    <span>{{ m.label }}</span>
                    <Check v-if="cruiseSearchState.departingMonth === m.value" class="sw-ico-xs" />
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>
        </div>

        <div class="sw-cruise-grid sw-cruise-grid--3">
          <!-- Length -->
          <div class="sw-cruise-field-wrap" ref="lengthRef">
            <button @click="toggleCruiseField('length')" class="sw-cruise-btn" :class="activeCruiseField === 'length' ? 'sw-cruise-btn--on' : ''">
              <Timer class="sw-ico-sm sw-ico-muted" />
              <div class="sw-cruise-txt">
                <span class="sw-fld-lbl">Duration</span>
                <span class="sw-fld-val">{{ cruiseSearchState.lengthLabel || 'Any length' }}</span>
              </div>
              <ChevronDown class="sw-ico-sm sw-ico-muted sw-chev" :class="activeCruiseField === 'length' ? 'sw-chev--up' : ''" />
            </button>
            <Teleport to="body">
              <Transition name="sw-drop">
                <div v-if="activeCruiseField === 'length'" class="sw-drop" :style="cruiseDropdownStyle('length')">
                  <div v-for="len in cruiseLengths" :key="len.value" @click="selectCruise('length', len)" class="sw-drop-item" :class="cruiseSearchState.length === len.value ? 'sw-drop-item--on' : 'sw-drop-item--idle'">
                    <span>{{ len.label }}</span>
                    <Check v-if="cruiseSearchState.length === len.value" class="sw-ico-xs" />
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>

          <!-- Line -->
          <div class="sw-cruise-field-wrap" ref="lineRef">
            <button @click="toggleCruiseField('line')" class="sw-cruise-btn" :class="activeCruiseField === 'line' ? 'sw-cruise-btn--on' : ''">
              <Anchor class="sw-ico-sm sw-ico-muted" />
              <div class="sw-cruise-txt">
                <span class="sw-fld-lbl">Cruise line</span>
                <span class="sw-fld-val sw-fld-val--trunc">{{ cruiseSearchState.lineLabel || 'Any line' }}</span>
              </div>
              <ChevronDown class="sw-ico-sm sw-ico-muted sw-chev" :class="activeCruiseField === 'line' ? 'sw-chev--up' : ''" />
            </button>
            <Teleport to="body">
              <Transition name="sw-drop">
                <div v-if="activeCruiseField === 'line'" class="sw-drop" :style="cruiseDropdownStyle('line')">
                  <div v-for="line in cruiseLines" :key="line.value" @click="selectCruise('line', line)" class="sw-drop-item" :class="cruiseSearchState.line === line.value ? 'sw-drop-item--on' : 'sw-drop-item--idle'">
                    <span>{{ line.label }}</span>
                    <Check v-if="cruiseSearchState.line === line.value" class="sw-ico-xs" />
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>

          <button @click="handleSearch" class="sw-search-btn sw-search-btn--full"><Search class="sw-ico-sm" /> Search cruises</button>
        </div>
      </div>

    </div><!-- /sw-panel -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, onUnmounted } from 'vue'
import {
  Plane, Bed, Car, Package, Anchor, Ticket, Truck,
  Search, CalendarDays, Clock, Timer, Check, Plus,
  ChevronDown, MapPin, ArrowUpDown
} from 'lucide-vue-next'
import { useTracking } from '@/composables/core/useTracking'
import CustomTimePicker from '@/components/ui/CustomTimePicker.vue'

const { trackAction } = useTracking()
const props = defineProps({ isSticky: { type: Boolean, default: false } })
const emit  = defineEmits(['focus-change', 'update:tab'])

// ─── State ──────────────────────────────────────────────────
const isFocused           = ref(false)
const currentTab          = ref('Flights')
const stayMode            = ref('single')
const flightMode          = ref('roundtrip')
const carMode             = ref('pickup')
const transferMode        = ref('pickup')
const packageType         = ref('Hotel+Flight')
const onlyPartialHotel    = ref(false)
const differentCarDropoff = ref(false)
const activeCruiseField   = ref<string | null>(null)
const isClassOpen         = ref(false)
const classRef            = ref<HTMLElement | null>(null)
const isMobile            = ref(false)

const checkMobile = () => {
  if (typeof window !== 'undefined') isMobile.value = window.innerWidth < 768
}

const destRef   = ref<HTMLElement | null>(null)
const departRef = ref<HTMLElement | null>(null)
const lengthRef = ref<HTMLElement | null>(null)
const lineRef   = ref<HTMLElement | null>(null)
const cruiseRefs: Record<string, typeof destRef> = {
  destination: destRef, departing: departRef, length: lengthRef, line: lineRef
}

// ─── Dropdown Positioning logic ──────────────────────────────
const dynamicStyles = reactive<Record<string, any>>({})

const updateDropdownPositions = () => {
  // 1. Cabin Class
  if (isClassOpen.value && classRef.value) {
    let el = classRef.value as any
    if (Array.isArray(el)) el = el[0]
    if (!el || !el.getBoundingClientRect) return

    const rect = el.getBoundingClientRect()
    const isMob = window.innerWidth < 768
    const w = isMob ? Math.min(280, window.innerWidth - 32) : rect.width
    let left = rect.left
    if (left + w > window.innerWidth - 12) left = window.innerWidth - w - 12
    if (left < 12) left = 12

    dynamicStyles.class = {
      position: 'fixed',
      top: `${rect.bottom + 6}px`,
      left: `${left}px`,
      width: `${w}px`,
      minWidth: isMob ? 'none' : '200px',
      zIndex: 1000001
    }
  }

  // 2. Cruise Fields
  if (activeCruiseField.value) {
    const el = cruiseRefs[activeCruiseField.value]?.value as HTMLElement | null
    if (el) {
      const rect = el.getBoundingClientRect()
      const w = Math.max(rect.width, 220)
      dynamicStyles.cruise = {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.bottom + 6}px`,
        width: `${w}px`,
        zIndex: 1000001
      }
    }
  }
}

watch([isClassOpen, activeCruiseField], () => {
  nextTick(updateDropdownPositions)
})

const cruiseDropdownStyle = (field: string) => {
  return dynamicStyles.cruise || {}
}

const toggleCruiseField = (field: string) => {
  activeCruiseField.value = activeCruiseField.value === field ? null : field
}
const selectCruise = (field: string, opt: { value: string; label: string }) => {
  if (field === 'destination')  { cruiseSearchState.destination = opt.value; cruiseSearchState.destinationLabel = opt.label }
  else if (field === 'departing') { cruiseSearchState.departingMonth = opt.value; cruiseSearchState.departingLabel = opt.label }
  else if (field === 'length')  { cruiseSearchState.length = opt.value; cruiseSearchState.lengthLabel = opt.label }
  else if (field === 'line')    { cruiseSearchState.line = opt.value; cruiseSearchState.lineLabel = opt.label }
  activeCruiseField.value = null
}

// ─── Tabs & Options ──────────────────────────────────────────
const tabs = [
  { name: 'Flights',    label: 'Flights',     icon: Plane },
  { name: 'Hotels',     label: 'Hotels',      icon: Bed },
  { name: 'Transfers',  label: 'Transfers',   icon: Truck },
  { name: 'Activities', label: 'Activities',  icon: Ticket },
  { name: 'Cars',       label: 'Car rentals', icon: Car },
  { name: 'Packages',   label: 'Packages',    icon: Package },
  { name: 'Cruises',    label: 'Cruises',     icon: Anchor },
]

const flightModes  = [{ label: 'One way', value: 'oneway' }, { label: 'Round trip', value: 'roundtrip' }, { label: 'Multi-city', value: 'multicity' }]
const stayModes    = [{ label: 'Single hotel', value: 'single' }, { label: 'Multi hotel', value: 'multi' }]
const modeModes    = [{ label: 'Airport pick-up', value: 'pickup' }, { label: 'Airport drop-off', value: 'dropoff' }]
const packageTypes = [
  { label: 'Hotel + Flight', value: 'Hotel+Flight' },
  { label: 'Hotel + Flight + Car', value: 'Hotel+Flight+Car' },
  { label: 'Flight + Car', value: 'Flight+Car' },
  { label: 'Hotel + Car', value: 'Hotel+Car' },
]

const cabinClasses = [
  { value: 'economy',         label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business',        label: 'Business' },
  { value: 'first',           label: 'First' },
]

// ─── Search state ────────────────────────────────────────────
const occupancy             = reactive({ rooms: 1, adults: 2, children: 0 })
const searchState           = reactive({ location: '', checkIn: '', checkOut: '' })
const bundles               = reactive({ bundleFlight: false, bundleHotel: false, bundleCar: false })
const flightTravelers       = reactive({ adults: 1, children: 0, infantsOnLap: 0, infantsInSeat: 0, cabinClass: 'economy' })
const flightSearchState     = reactive({ origin: '', destination: '', departureDate: '', returnDate: '' })
const multiFlightLegs       = ref([{ origin: '', destination: '', departureDate: '', returnDate: '' }])
const multiHotelLegs        = ref([{ location: '', checkIn: '', checkOut: '' }])
const carSearchState        = reactive({ origin: '', destination: '', pickUpDate: '' })
const transferSearchState   = reactive({ origin: '', destination: '', date: '', time: '10:00' })
const transferOccupancy     = reactive({ adults: 1, children: 0 })
const activitiesSearchState = reactive({ destination: '', date: '' })
const packageOccupancy      = reactive({ rooms: 1, adults: 2, children: 0 })
const packageSearchState    = reactive({ origin: '', destination: '', departureDate: '', returnDate: '', hotelCheckIn: '', hotelCheckOut: '' })
const cruiseSearchState     = reactive({ destination: '', destinationLabel: '', departingMonth: '04/1/2026', departingLabel: 'April 2026', length: '', lengthLabel: '', line: '', lineLabel: '' })

const addHotelLeg = () => { if (multiHotelLegs.value.length < 5) multiHotelLegs.value.push({ location: '', checkIn: '', checkOut: '' }) }

const currentCabinLabel = computed(() => {
  return cabinClasses.find(c => c.value === flightTravelers.cabinClass)?.label || 'Economy'
})

const classDropdownStyle = computed(() => {
  return dynamicStyles.class || {}
})

// ─── Cruise data ─────────────────────────────────────────────
const cruiseDestinations = [
  { value: '', label: 'Any destination' }, { value: 'C', label: 'Caribbean' }, { value: 'M', label: 'Mexico' },
  { value: 'BH', label: 'Bahamas' }, { value: 'A', label: 'Alaska' }, { value: 'E', label: 'Europe' },
  { value: 'H', label: 'Hawaii' }, { value: 'BM', label: 'Bermuda' }, { value: 'NN', label: 'Canada / New England' },
  { value: '_', label: '──────────', disabled: true },
  { value: 'ALL', label: 'All destinations' }, { value: 'AG', label: 'Alaska — Gulf' }, { value: 'AR', label: 'Alaska — Inside Passage' },
  { value: 'AB', label: 'Antarctica' }, { value: 'UN', label: 'Australia / NZ' }, { value: 'CE', label: 'Caribbean — Eastern' },
  { value: 'CS', label: 'Caribbean — Southern' }, { value: 'CW', label: 'Caribbean — Western' },
  { value: 'EE', label: 'Mediterranean — Eastern' }, { value: 'R', label: 'Mediterranean — All' },
  { value: 'N', label: 'Northern Europe' }, { value: 'O', label: 'Asia / Africa / Other' },
  { value: 'L', label: 'Pacific Coast' }, { value: 'T', label: 'Panama Canal' },
  { value: 'S', label: 'South America' }, { value: 'ET', label: 'Transatlantic' }, { value: 'WW', label: 'World Cruise' },
]

const cruiseMonths = [
  { value: '04/1/2026', label: 'April 2026' }, { value: '05/1/2026', label: 'May 2026' }, { value: '06/1/2026', label: 'June 2026' },
  { value: '07/1/2026', label: 'July 2026' }, { value: '08/1/2026', label: 'August 2026' }, { value: '09/1/2026', label: 'September 2026' },
  { value: '10/1/2026', label: 'October 2026' }, { value: '11/1/2026', label: 'November 2026' }, { value: '12/1/2026', label: 'December 2026' },
  { value: '01/1/2027', label: 'January 2027' }, { value: '02/1/2027', label: 'February 2027' }, { value: '03/1/2027', label: 'March 2027' },
  { value: '04/1/2027', label: 'April 2027' }, { value: '05/1/2027', label: 'May 2027' }, { value: '06/1/2027', label: 'June 2027' },
  { value: '07/1/2027', label: 'July 2027' }, { value: '01/1/2028', label: 'January 2028' }, { value: '02/1/2028', label: 'February 2028' },
]

const cruiseLengths = [
  { value: '', label: 'Any length' }, { value: 'ALL', label: 'All' }, { value: '1', label: '1–2 nights' },
  { value: '2', label: '3–5 nights' }, { value: '3', label: '6–8 nights' }, { value: '4', label: '9–11 nights' }, { value: '5', label: '12+ nights' },
]

const cruiseLines = [
  { value: '', label: 'Any cruise line' }, { value: 'ALL', label: 'All cruise lines' },
  { value: '1', label: 'Carnival Cruise Lines' }, { value: '11', label: 'Celebrity Cruises' },
  { value: '14', label: 'Costa Cruises' }, { value: '20', label: 'Disney Cruise Line' },
  { value: '24', label: 'Holland America Line' }, { value: '71', label: 'MSC Cruises' },
  { value: '34', label: 'Norwegian Cruise Line' }, { value: '67', label: 'Oceania Cruises' },
  { value: '40', label: 'Princess Cruises' }, { value: '44', label: 'Royal Caribbean' },
  { value: '50', label: 'Silversea Cruises' }, { value: '48', label: 'Seabourn' },
  { value: '66', label: 'Uniworld River Cruises' }, { value: '354', label: 'Viking Ocean Cruises' },
  { value: '78', label: 'Viking River Cruises' }, { value: '364', label: 'Virgin Voyages' },
  { value: '64', label: 'Windstar Cruises' }, { value: '41', label: 'Regent Seven Seas' },
]

// ─── Watchers & Search ──────────────────────────────────────
watch(isFocused, (val) => emit('focus-change', val))
watch(currentTab, (val) => emit('update:tab', val), { immediate: true })

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('scroll', updateDropdownPositions, true)
  window.addEventListener('resize', updateDropdownPositions)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', updateDropdownPositions, true)
  window.removeEventListener('resize', updateDropdownPositions)
})

const handleSearch = () => {
  isFocused.value = false
  const query: any = { tab: currentTab.value }
  const routes: Record<string, string> = {
    Activities: '/things-to-do', Hotels: '/stays', Flights: '/flights',
    Cars: '/cars', Packages: '/packages', Transfers: '/transfers', Cruises: '/cruises',
  }
  if (currentTab.value === 'Cruises')       Object.assign(query, cruiseSearchState)
  else if (currentTab.value === 'Flights') {
    Object.assign(query, flightSearchState);
    Object.assign(query, flightTravelers);
  }
  else if (currentTab.value === 'Transfers') { Object.assign(query, transferSearchState); query.mode = transferMode.value }
  else if (currentTab.value === 'Activities') Object.assign(query, activitiesSearchState)
  else if (currentTab.value === 'Hotels')   { Object.assign(query, searchState); Object.assign(query, occupancy) }
  trackAction('booking_step_search', { tab: currentTab.value, ...query })
  navigateTo({ path: routes[currentTab.value] || '/search', query })
}

const handleExternalDeal = (deal: any) => {
  currentTab.value = deal.type || 'Flights'
  if (deal.type === 'Flights')     flightSearchState.origin = deal.from || ''
  else if (deal.type === 'Hotels') searchState.location = deal.to || ''
  else if (deal.type === 'Cars')   carSearchState.destination = deal.to || ''
}
defineExpose({ handleExternalDeal })

const swapFlightLocations = (leg: { origin: string; destination: string }) => {
  const tmp = leg.origin
  leg.origin = leg.destination
  leg.destination = tmp
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════ */
.sw-root {
  background: #fff;
  border: 0.5px solid #e0e0d8;
  border-radius: 16px;
  overflow: visible;
}
.sw-root--sticky {
  border-radius: 0 0 14px 14px;
  border-top: none;
}

/* ═══════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════ */
.sw-tabs {
  border-bottom: 0.5px solid #ebebE3;
}

/* Mobile pills */
.sw-tabs-mobile {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  overflow-x: auto;
  scrollbar-width: none;
}
.sw-tabs-mobile::-webkit-scrollbar { display: none; }

/* Desktop underline */
.sw-tabs-desk {
  display: none;
  align-items: center;
  padding: 0 16px;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.sw-tabs-desk::-webkit-scrollbar { display: none; }

@media (min-width: 768px) {
  .sw-tabs-mobile { display: none; }
  .sw-tabs-desk   { display: flex; }
}

.sw-tab-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  border: 0.5px solid #e0e0d8;
  background: #fff;
  color: #888;
  cursor: pointer;
  transition: all 0.15s ease;
}
.sw-tab-pill--on { background: #111; color: #fff; border-color: #111; }
.sw-tab-pill:not(.sw-tab-pill--on):hover { border-color: #aaa; color: #333; }

.sw-tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 22px;
  font-size: 14.5px;
  font-weight: 600;
  white-space: nowrap;
  border-bottom: 2.5px solid transparent;
  color: #888;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.sw-tab-btn--on  { color: #111; border-bottom-color: #111; }
.sw-tab-btn:not(.sw-tab-btn--on):hover { color: #555; }

.sw-tab-ico { width: 17px; height: 17px; flex-shrink: 0; }

/* ═══════════════════════════════════════════════════
   PANEL
═══════════════════════════════════════════════════ */
.sw-panel { padding: 16px; }
.sw-panel--sm { padding: 12px; }
@media (min-width: 768px) { .sw-panel { padding: 20px; } }

.sw-section { display: flex; flex-direction: column; gap: 12px; }

/* ═══════════════════════════════════════════════════
   SEARCH BAR — the horizontal field row
   On mobile: each field becomes a FULL-WIDTH stacked block
   On desktop: fields sit side-by-side inside the bar
═══════════════════════════════════════════════════ */
.sw-bar {
  display: flex;
  flex-direction: column;       /* MOBILE: vertical stack */
  border: 0.5px solid #e0e0d8;
  border-radius: 12px;
  overflow: visible;
  background: #e0e0d8;          /* gap color via bg trick */
  gap: 0.5px;
}

@media (min-width: 768px) {
  .sw-bar {
    flex-direction: row;        /* DESKTOP: horizontal */
    align-items: stretch;
  }
}

/* Divider — horizontal line on mobile, vertical on desktop */
.sw-bar-div {
  background: #e0e0d8;
  flex-shrink: 0;
  /* mobile: 0.5px horizontal */
  height: 0.5px;
  width: 100%;
}
@media (min-width: 768px) {
  .sw-bar-div {
    height: auto;
    width: 0.5px;
  }
}

/* ── Swap button wrapper ── */
.sw-swap-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* mobile: horizontal divider context */
  width: 100%;
  height: 0;
}
@media (min-width: 768px) {
  .sw-swap-wrap {
    width: 0;
    height: auto;
  }
}

.sw-swap-btn {
  position: absolute;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e0e0d8;
  background: #fff;
  color: #888;
  cursor: pointer;
  transition: all 0.2s ease;
  /* mobile: position to the right edge */
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}
@media (min-width: 768px) {
  .sw-swap-btn {
    right: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.sw-swap-btn:hover {
  background: #111;
  color: #fff;
  border-color: #111;
  transform: translateY(-50%) rotate(180deg);
}
@media (min-width: 768px) {
  .sw-swap-btn:hover {
    transform: translate(-50%, -50%) rotate(180deg);
  }
}
.sw-swap-btn:active {
  transform: translateY(-50%) scale(0.9);
}
@media (min-width: 768px) {
  .sw-swap-btn:active {
    transform: translate(-50%, -50%) scale(0.9);
  }
}


/* Individual field cell */
.sw-field {
  background: #fff;
  overflow: visible;
  min-height: 56px;
}

/* First cell: rounded top on mobile, left on desktop */
.sw-bar .sw-field:first-child {
  border-radius: 10.5px 10.5px 0 0;
}
@media (min-width: 768px) {
  .sw-bar .sw-field:first-child {
    border-radius: 10.5px 0 0 10.5px;
  }
}

/* Last field cell */
.sw-bar .sw-field:last-child {
  border-radius: 0 0 10.5px 10.5px;
}
@media (min-width: 768px) {
  .sw-bar .sw-field:last-child {
    border-radius: 0 10.5px 10.5px 0;
  }
}

/* Flex widths — only apply on desktop */
@media (min-width: 768px) {
  .sw-field--grow  { flex: 1; }
  .sw-field--date  { flex: 1.3; }
  .sw-field--pax   { flex: 0.8; min-width: 120px; }
  .sw-field--time  { flex: 0; min-width: 110px; }
  .sw-field--cat   { flex: 0.7; min-width: 110px; }
}

/* On mobile ALL fields are full-width naturally (flex-direction: column) */

/* ── Field label/value (for non-component fields) ── */
.sw-fld-lbl {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #aaa;
  
  letter-spacing: 0.07em;
  line-height: 1;
}
.sw-fld-val {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111;
  margin-top: 3px;
  line-height: 1.3;
}
.sw-fld-val--trunc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Time field interior */
.sw-field--time { padding: 12px 14px; display: flex; flex-direction: column; justify-content: center; }
.sw-time-row { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
.sw-time-input { background: transparent; border: none; outline: none; font-size: 12px; font-weight: 400; color: #222; width: 100%; }

/* Category field interior */
.sw-field--cat { padding: 12px 14px; display: flex; flex-direction: column; justify-content: center; }

/* Class field interior */
.sw-field--class { padding: 12px 14px; display: flex; flex-direction: column; justify-content: center; position: relative; min-width: 185px; }
.sw-field-inner { display: flex; flex-direction: column; }

/* ═══════════════════════════════════════════════════
   RADIOS & CHECKBOXES
═══════════════════════════════════════════════════ */
.sw-radios { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.sw-radios--wrap { gap: 12px 20px; }

.sw-radio { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.sw-radio-dot {
  width: 14px; height: 14px; border-radius: 50%;
  border: 0.5px solid #d1d5db;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: border-color 0.15s;
  position: relative;
}
.sw-radio-dot::after {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: transparent; transition: background 0.15s;
  position: absolute;
}
.sw-radio-dot--on { border-color: #111; }
.sw-radio-dot--on::after { background: #111; }

.sw-radio-txt { font-size: 10.5px; font-weight: 500; color: #888; user-select: none; }
.sw-radio-txt--on { color: #111; }

.sw-chk  { display: flex; align-items: center; gap: 7px; cursor: pointer; }
.sw-chk-box {
  width: 14px; height: 14px; border-radius: 3px;
  border: 0.5px solid #d1d5db;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.15s;
}
.sw-chk-box--on { background: #111; border-color: #111; }
.sw-chk-ico { color: #fff; }
.sw-checks { display: flex; flex-wrap: wrap; gap: 12px; }

/* ═══════════════════════════════════════════════════
   SEGMENTED CONTROL
═══════════════════════════════════════════════════ */
.sw-seg {
  display: flex;
  border: 0.5px solid #e0e0d8;
  border-radius: 9px;
  padding: 2px;
  background: #f5f5f0;
  width: fit-content;
}
.sw-seg-btn {
  padding: 6px 14px;
  font-size: 10.5px;
  font-weight: 500;
  border-radius: 7px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.sw-seg-btn:hover { color: #333; }
.sw-seg-btn--on { background: #fff; color: #111; box-shadow: 0 0.5px 4px rgba(0,0,0,0.07); }

/* ═══════════════════════════════════════════════════
   BUNDLES
═══════════════════════════════════════════════════ */
.sw-bundles {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: #fafaf7;
  border: 0.5px solid #eeeee8;
  border-radius: 8px;
  flex-wrap: wrap;
}
.sw-bundle-lbl {
  font-size: 9px;
  font-weight: 600;
  color: #bbb;
  
  letter-spacing: 0.1em;
  white-space: nowrap;
}

/* ═══════════════════════════════════════════════════
   FOOTER ROW
═══════════════════════════════════════════════════ */
.sw-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 0.5px solid #f0f0ea;
}
@media (min-width: 640px) {
  .sw-footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.sw-footer--end { align-items: flex-end; }
@media (min-width: 640px) { .sw-footer--end { justify-content: flex-end; } }

/* ═══════════════════════════════════════════════════
   SEARCH BUTTON
═══════════════════════════════════════════════════ */
.sw-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #0D1DAD;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 10.5px 22px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;
  font-family: 'Onest', sans-serif;
  /* On mobile: full width */
  width: 100%;
}
@media (min-width: 640px) {
  .sw-search-btn { width: auto; }
}
.sw-search-btn:hover { background: #0D1DAD; transform: translateY(-1px); }
.sw-search-btn--full { width: 100%; }
@media (min-width: 640px) { .sw-search-btn--full { width: auto; } }

/* ═══════════════════════════════════════════════════
   ADD / MULTI-LEG
═══════════════════════════════════════════════════ */
.sw-rows { display: flex; flex-direction: column; gap: 10px; }
.sw-multi-leg { display: flex; flex-direction: column; gap: 4px; }
.sw-leg-lbl { font-size: 10px; font-weight: 500; color: #aaa;  letter-spacing: 0.07em; }
.sw-add-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 500;
  color: #aaa;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  align-self: flex-start;
  padding: 0;
}
.sw-add-btn:hover { color: #333; }

/* ═══════════════════════════════════════════════════
   EXTRA DATES (partial hotel)
═══════════════════════════════════════════════════ */
.sw-extra-dates {
  background: #fafaf7;
  border: 0.5px solid #eeeee8;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sw-bar--compact { max-width: 420px; }

/* ═══════════════════════════════════════════════════
   MISC LINKS
═══════════════════════════════════════════════════ */
.sw-adv-link {
  font-size: 10.5px;
  font-weight: 500;
  color: #aaa;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.15s;
}
.sw-adv-link:hover { color: #555; }

/* ═══════════════════════════════════════════════════
   CRUISE FIELDS
═══════════════════════════════════════════════════ */
.sw-cruise-grid { display: grid; gap: 10px; }
.sw-cruise-grid--2 { grid-template-columns: 1fr; }
.sw-cruise-grid--3 { grid-template-columns: 1fr; }

@media (min-width: 640px) {
  .sw-cruise-grid--2 { grid-template-columns: 1fr 1fr; }
  .sw-cruise-grid--3 { grid-template-columns: 1fr 1fr auto; align-items: start; }
}

.sw-cruise-field-wrap { position: relative; }

.sw-cruise-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  background: #fff;
  border: 0.5px solid #e0e0d8;
  border-radius: 10.5px;
  cursor: pointer;
  transition: border-color 0.15s;
  text-align: left;
}
.sw-cruise-btn:hover { border-color: #aaa; }
.sw-cruise-btn--on { border-color: #111; box-shadow: 0 0 0 3px rgba(17,24,39,0.06); }

.sw-cruise-txt { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }

.sw-chev { transition: transform 0.2s ease; flex-shrink: 0; }
.sw-chev--up { transform: rotate(180deg); }

/* ═══════════════════════════════════════════════════
   CRUISE DROPDOWN (Teleport'd to body, position: fixed)
═══════════════════════════════════════════════════ */
.sw-drop {
  background: #fff;
  border: 0.5px solid #e0e0d8;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
  z-index: 99999;
  max-height: 17rem;
  overflow-y: auto;
  padding: 4px;
  scrollbar-width: none;
}
.sw-drop::-webkit-scrollbar { display: none; }

.sw-drop-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.12s;
}
.sw-drop-item--idle { color: #333; cursor: pointer; }
.sw-drop-item--idle:hover { background: #f5f5f0; }
.sw-drop-item--on { background: #111; color: #fff; cursor: pointer; }
.sw-drop-item--div { color: #ddd; cursor: default; border-top: 0.5px solid #f0f0ea; margin: 3px 0; pointer-events: none; font-size: 10px; }

/* ═══════════════════════════════════════════════════
   GLOBAL BACKDROP
═══════════════════════════════════════════════════ */
.sw-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.08);
  z-index: 9990;
}

/* ═══════════════════════════════════════════════════
   ICON HELPERS
═══════════════════════════════════════════════════ */
.sw-ico-xs { width: 10px; height: 10px; flex-shrink: 0; }
.sw-ico-sm { width: 16px; height: 16px; flex-shrink: 0; }
.sw-ico-muted { color: #bbb; }

/* ═══════════════════════════════════════════════════
   TRANSITIONS
═══════════════════════════════════════════════════ */
.sw-fade-enter-active, .sw-fade-leave-active { transition: opacity 0.18s ease; }
.sw-fade-enter-from, .sw-fade-leave-to { opacity: 0; }

.sw-drop-enter-active { transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1); }
.sw-drop-leave-active { transition: opacity 0.1s ease; }
.sw-drop-enter-from, .sw-drop-leave-to { opacity: 0; transform: translateY(-4px); }

.sw-slide-enter-active { transition: all 0.2s ease; }
.sw-slide-leave-active { transition: all 0.15s ease; }
.sw-slide-enter-from, .sw-slide-leave-to { opacity: 0; transform: translateY(-6px); }
</style>