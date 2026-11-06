<template>
  <div 
    ref="widgetRef"
    class="sw-root transition-all duration-300" 
    :class="[
      isSticky ? 'sw-root--sticky' : '', 
      isFocused ? 'z-[10002] relative shadow-2xl' : 'z-10 relative'
    ]"
  >

    <!-- ─── Tab Bar ─── -->
    <div class="sw-tabs">
      <nav class="sw-tabs-nav" aria-label="Search tabs">
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

    <!-- Global backdrop (visual only — pointer-events: none) -->
    <Teleport to="body">
      <Transition name="sw-fade">
        <div
          v-if="isFocused || activeCruiseField"
          class="sw-backdrop"
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
            class="sw-multi-leg-wrapper"
          >
            <!-- Flight Header for Multi-city -->
            <div v-if="flightMode === 'multicity'" class="flex items-center justify-between mb-2 px-4 pt-4 pb-1">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Flight {{ idx + 1 }}</span>
              <button 
                v-if="multiFlightLegs.length > 1"
                @click="multiFlightLegs.splice(idx, 1)" 
                class="text-gray-400 hover:text-red-500 flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                type="button"
              >
                <Trash2 class="w-3.5 h-3.5" /> Remove
              </button>
            </div>

            <div class="sw-bar">
              <div class="sw-loc-group">
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
              </div>
              <div class="sw-bar-div" />
              <div class="sw-field sw-field--date" @click="isFocused = true">
                <FlightDateRangePicker
                  :mode="flightMode === 'multicity' ? 'oneway' : (flightMode as any)"
                  v-model:departure="leg.departureDate"
                  v-model:return="leg.returnDate"
                  v-model:flexible="leg.flexibleDates"
                  @focus="isFocused = true"
                  @close="isFocused = false"
                />
              </div>
              <div v-if="idx === 0" class="sw-bar-div" />
              <div v-if="idx === 0" class="sw-field sw-field--pax-class" @click="isFocused = true">
                <Occupancypicker 
                  label="Passengers & Class" 
                  variant="flight" 
                  v-model:adults="flightTravelers.adults" 
                  v-model:children="flightTravelers.children" 
                  v-model:infantsOnLap="flightTravelers.infantsOnLap"
                  v-model:infantsInSeat="flightTravelers.infantsInSeat"
                  v-model:cabinClass="flightTravelers.cabinClass"
                  @focus="isFocused = true" 
                  @close="isFocused = false" 
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="flightMode === 'multicity' && multiFlightLegs.length < 5" class="pt-4 px-4 pb-2">
          <button
            @click="multiFlightLegs.push({ origin: '', destination: '', departureDate: '', returnDate: '' })"
            class="bg-blue-50 hover:bg-blue-100 text-[#0D1DAD] border border-blue-200 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
            type="button"
          >
            <Plus class="w-4 h-4" /> Add another flight
          </button>
        </div>

        <!-- Recent Searches -->
        <!-- <div v-if="recentSearches.length > 0" class="mt-4 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <span class="text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <History class="w-3 h-3" />
            Recent
          </span>
          <div v-for="s in recentSearches" :key="s._id || `${s.origin}-${s.destination}`" 
            class="group flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-200 px-3 py-1.5 rounded-full transition-all cursor-pointer"
            @click="applyRecentSearch(s)"
          >
            <span class="text-[11px] font-bold text-black">{{ s.origin }} → {{ s.destination }}</span>
            <button @click.stop="removeSearch(s)" class="text-black hover:text-rose-500 transition-colors">
              <X class="w-3 h-3" />
            </button>
          </div>
        </div> -->

        <div class="sw-footer">
          <div class="sw-bundles">
            <span class="sw-bundle-lbl">Bundle + Save</span>
            <label class="sw-chk"><input type="checkbox" v-model="bundles.bundleHotel" class="sr-only" /><span class="sw-chk-box" :class="bundles.bundleHotel ? 'sw-chk-box--on' : ''"><Check v-if="bundles.bundleHotel" class="sw-ico-xs sw-chk-ico" /></span><span class="sw-radio-txt">+ Hotel</span></label>
            <label class="sw-chk"><input type="checkbox" v-model="bundles.bundleCar" class="sr-only" /><span class="sw-chk-box" :class="bundles.bundleCar ? 'sw-chk-box--on' : ''"><Check v-if="bundles.bundleCar" class="sw-ico-xs sw-chk-ico" /></span><span class="sw-radio-txt">+ Car</span></label>
          </div>
          <button @click="handleSearch" :disabled="isSearching" class="sw-search-btn">
            <Loader2 v-if="isSearching" class="sw-ico-sm animate-spin" />
            <Search v-else class="sw-ico-sm" /> 
            {{ isSearching ? 'Searching...' : 'Search flights' }}
          </button>
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
          <div class="sw-loc-group">
            <div class="sw-field sw-field--grow">
              <LocationPicker v-model="searchState.location" label="Where to" placeholder="City, hotel or area" @focus="isFocused = true" @close="isFocused = false" />
            </div>
          </div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date">
            <FlightDateRangePicker :departure="searchState.checkIn" :return="searchState.checkOut" mode="roundtrip" departureLabel="Check-in" returnLabel="Check-out" @focus="isFocused = true" @close="isFocused = false" @update:departure="(v: string) => searchState.checkIn = v" @update:return="(v: string) => searchState.checkOut = v" />
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
              <div class="sw-loc-group">
                <div class="sw-field sw-field--grow"><LocationPicker v-model="hotel.location" label="Where to" placeholder="City or area" /></div>
              </div>
              <div class="sw-bar-div" />
              <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="hotel.checkIn" :return="hotel.checkOut" mode="roundtrip" departureLabel="Check-in" returnLabel="Check-out" @update:departure="(v: string) => hotel.checkIn = v" @update:return="(v: string) => hotel.checkOut = v" /></div>
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
          <button @click="handleSearch" :disabled="isSearching" class="sw-search-btn">
            <Loader2 v-if="isSearching" class="sw-ico-sm animate-spin" />
            <Search v-else class="sw-ico-sm" /> 
            {{ isSearching ? 'Searching...' : 'Search hotels' }}
          </button>
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
          <div class="sw-loc-group">
            <div class="sw-field sw-field--grow"><LocationPicker v-model="packageSearchState.origin" label="From" placeholder="City or airport" @focus="isFocused = true" @close="isFocused = false" /></div>
            <div class="sw-bar-div sw-bar-div--vert" />
            <div class="sw-field sw-field--grow"><LocationPicker v-model="packageSearchState.destination" label="To" placeholder="City or airport" @focus="isFocused = true" @close="isFocused = false" /></div>
          </div>
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
              <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="packageSearchState.hotelCheckIn" :return="packageSearchState.hotelCheckOut" mode="roundtrip" departureLabel="Check-in" returnLabel="Check-out" @update:departure="(v: string) => packageSearchState.hotelCheckIn = v" @update:return="(v: string) => packageSearchState.hotelCheckOut = v" /></div>
            </div>
          </div>
        </Transition>

        <div class="sw-footer">
          <a href="#" class="sw-adv-link">Advanced search</a>
          <button @click="handleSearch" :disabled="isSearching" class="sw-search-btn">
            <Loader2 v-if="isSearching" class="sw-ico-sm animate-spin" />
            <Search v-else class="sw-ico-sm" /> 
            {{ isSearching ? 'Searching...' : 'Search packages' }}
          </button>
        </div>
      </div>

      <!-- ════ CARS ════ -->
      <div v-if="currentTab === 'Cars'" class="sw-section">
        <div class="sw-seg">
          <button v-for="m in modeModes" :key="m.value" @click="carMode = m.value" class="sw-seg-btn" :class="carMode === m.value ? 'sw-seg-btn--on' : ''">{{ m.label }}</button>
        </div>
        <div class="sw-bar">
          <div class="sw-loc-group">
            <div class="sw-field sw-field--grow"><LocationPicker v-model="carSearchState.origin" label="Pick-up" placeholder="City or airport" @focus="isFocused = true" @close="isFocused = false" /></div>
            <template v-if="carMode === 'different'">
              <div class="sw-bar-div sw-bar-div--vert" />
              <div class="sw-field sw-field--grow"><LocationPicker v-model="carSearchState.destination" label="Drop-off" placeholder="City or airport" @focus="isFocused = true" @close="isFocused = false" /></div>
            </template>
          </div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date"><FlightDateRangePicker v-model:departure="carSearchState.pickUpDate" v-model:return="carSearchState.dropOffDate" label="Dates" /></div>
        </div>
        <div class="sw-footer">
          <label class="sw-chk">
            <input type="checkbox" v-model="differentCarDropoff" class="sr-only" />
            <span class="sw-chk-box" :class="differentCarDropoff ? 'sw-chk-box--on' : ''"><Check v-if="differentCarDropoff" class="sw-ico-xs sw-chk-ico" /></span>
            <span class="sw-radio-txt">Return at different location</span>
          </label>
          <button @click="handleSearch" :disabled="isSearching" class="sw-search-btn">
            <Loader2 v-if="isSearching" class="sw-ico-sm animate-spin" />
            <Search v-else class="sw-ico-sm" /> 
            {{ isSearching ? 'Searching...' : 'Search cars' }}
          </button>
        </div>
      </div>

      <!-- ════ TRANSFERS ════ -->
      <div v-if="currentTab === 'Transfers'" class="sw-section">
        <div class="sw-radios" style="margin-bottom: 16px;">
          <label class="sw-radio">
            <input type="radio" value="oneway" v-model="transferTripType" class="sr-only" />
            <span class="sw-radio-dot" :class="transferTripType === 'oneway' ? 'sw-radio-dot--on' : ''" />
            <span class="sw-radio-txt" :class="transferTripType === 'oneway' ? 'sw-radio-txt--on' : ''">One-way</span>
          </label>
          <label class="sw-radio">
            <input type="radio" value="return" v-model="transferTripType" class="sr-only" />
            <span class="sw-radio-dot" :class="transferTripType === 'return' ? 'sw-radio-dot--on' : ''" />
            <span class="sw-radio-txt" :class="transferTripType === 'return' ? 'sw-radio-txt--on' : ''">Return</span>
          </label>
        </div>
        <div class="sw-bar">
          <div class="sw-field sw-field--grow"><LocationPicker v-model="transferSearchState.origin" label="From" placeholder="Airport or address" allowFreeText @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--grow"><LocationPicker v-model="transferSearchState.destination" label="To" placeholder="Hotel or address" allowFreeText @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="transferSearchState.date" mode="oneway" departureLabel="Date" @update:departure="(v) => transferSearchState.date = v" @focus="isFocused = true" @close="isFocused = false" /></div>
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

          <!-- Return Date/Time -->
          <template v-if="transferTripType === 'return'">
            <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="transferSearchState.returnDate" mode="oneway" departureLabel="Return Date" @update:departure="(v) => transferSearchState.returnDate = v" @focus="isFocused = true" @close="isFocused = false" /></div>
            <div class="sw-bar-div" />
            <div class="sw-field sw-field--time">
              <span class="sw-fld-lbl">Return Time</span>
              <CustomTimePicker v-model="transferSearchState.returnTime" @focus="isFocused = true" @close="isFocused = false">
                <template #default="{ value }">
                  <div class="sw-time-row">
                    <Clock class="sw-ico-sm sw-ico-muted" />
                    <span class="sw-fld-val">{{ value }}</span>
                  </div>
                </template>
              </CustomTimePicker>
            </div>
            <div class="sw-bar-div" />
          </template>
          <div class="sw-field sw-field--pax"><Occupancypicker label="Passengers" variant="flight" v-model:adults="transferOccupancy.adults" v-model:children="transferOccupancy.children" @focus="isFocused = true" @close="isFocused = false" /></div>
        </div>
        <div class="sw-footer sw-footer--end">
          <button @click="handleSearch" :disabled="isSearching" class="sw-search-btn">
            <Loader2 v-if="isSearching" class="sw-ico-sm animate-spin" />
            <Search v-else class="sw-ico-sm" /> 
            {{ isSearching ? 'Searching...' : 'Search transfers' }}
          </button>
        </div>
      </div>

      <!-- ════ ACTIVITIES ════ -->
      <div v-if="currentTab === 'Activities'" class="sw-section">
        <div class="sw-bar">
          <div class="sw-field sw-field--grow"><LocationPicker v-model="activitiesSearchState.destination" label="Destination" placeholder="City or region" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--date"><FlightDateRangePicker :departure="activitiesSearchState.date" mode="oneway" departureLabel="Date" @update:departure="(v) => activitiesSearchState.date = v" @focus="isFocused = true" @close="isFocused = false" /></div>
          <div class="sw-bar-div" />
          <div class="sw-field sw-field--cat">
            <span class="sw-fld-lbl">Category</span>
            <span class="sw-fld-val">All activities</span>
          </div>
        </div>
        <div class="sw-footer sw-footer--end">
          <button @click="handleSearch" :disabled="isSearching" class="sw-search-btn">
            <Loader2 v-if="isSearching" class="sw-ico-sm animate-spin" />
            <Search v-else class="sw-ico-sm" /> 
            {{ isSearching ? 'Searching...' : 'Search activities' }}
          </button>
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

          <button @click="handleSearch" :disabled="isSearching" class="sw-search-btn sw-search-btn--full">
            <Loader2 v-if="isSearching" class="sw-ico-sm animate-spin" />
            <Search v-else class="sw-ico-sm" /> 
            {{ isSearching ? 'Searching...' : 'Search cruises' }}
          </button>
        </div>
      </div>

    </div><!-- /sw-panel -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Plane, Bed, Car, Package, Anchor, Ticket, Truck,
  Search, CalendarDays, Clock, Timer, Check, Plus,
  ChevronDown, MapPin, History, X, ArrowUpDown, Loader2, Trash2
} from 'lucide-vue-next'
import { useTracking } from '@/composables/core/useTracking'
import { flightsApi } from '@/api_factory/modules/flights'
import { useAuth } from '@/composables/modules/auth/useAuth'
import CustomTimePicker from '@/components/ui/CustomTimePicker.vue'
import { useRoute } from 'vue-router'
import { useAmadeusLocations } from '@/composables/modules/flights/useAmadeusLocations'

const { isLoggedIn } = useAuth()
const { trackAction } = useTracking()
const props = defineProps({ 
  isSticky: { type: Boolean, default: false },
  defaultTab: { type: String, default: 'Flights' }
})
const emit  = defineEmits(['focus-change', 'update:tab'])

// ─── State ──────────────────────────────────────────────────
const isFocused           = ref(false)
const isSearching         = ref(false)
const currentTab          = ref(props.defaultTab)
const stayMode            = ref('single')
const flightMode          = ref('oneway')
const carMode             = ref('pickup')
const transferTripType        = ref('oneway')
const packageType         = ref('Hotel+Flight')
const onlyPartialHotel    = ref(false)
const differentCarDropoff = ref(false)
const activeCruiseField   = ref<string | null>(null)
const isMobile            = ref(false)
const widgetRef           = ref<HTMLElement | null>(null)
const { detectNearestAirports } = useAmadeusLocations()

const checkMobile = () => {
  if (typeof window !== 'undefined') isMobile.value = window.innerWidth < 1024
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
  // Cruise Fields
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

watch([activeCruiseField], () => {
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
const flightSearchState     = reactive({ origin: '', destination: '', departureDate: '', returnDate: '', flexibleDates: false })
const multiFlightLegs       = ref([{ origin: '', destination: '', departureDate: '', returnDate: '' }])
const multiHotelLegs        = ref([{ location: '', checkIn: '', checkOut: '' }])
const carSearchState        = reactive({ origin: '', destination: '', pickUpDate: '', dropOffDate: '' })
const transferSearchState   = reactive({ origin: '', destination: '', date: '', time: '10:00', returnDate: '', returnTime: '10:00' })
const transferOccupancy     = reactive({ adults: 1, children: 0 })
const activitiesSearchState = reactive({ destination: '', date: '' })
const packageOccupancy      = reactive({ rooms: 1, adults: 2, children: 0 })
const packageSearchState    = reactive({ origin: '', destination: '', departureDate: '', returnDate: '', hotelCheckIn: '', hotelCheckOut: '' })
const cruiseSearchState     = reactive({ destination: '', destinationLabel: '', departingMonth: '04/1/2026', departingLabel: 'April 2026', length: '', lengthLabel: '', line: '', lineLabel: '' })

const addHotelLeg = () => { if (multiHotelLegs.value.length < 5) multiHotelLegs.value.push({ location: '', checkIn: '', checkOut: '' }) }



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
watch(isLoggedIn, (val) => { if (val) fetchRecentSearches() })

// ─── Recent Searches (Restore) ──────────────────────────────
const recentSearches = ref<any[]>([])

const fetchRecentSearches = async () => {
  if (!isLoggedIn.value) return
  try {
    const res = await flightsApi.getRecentSearches()
    const rawData = res.data?.data || res.data || []
    recentSearches.value = Array.isArray(rawData) ? rawData : []
    
    // Auto-prefill if empty
    if (recentSearches.value.length > 0 && !flightSearchState.origin && !flightSearchState.destination) {
       applyRecentSearch(recentSearches.value[0])
    }
  } catch (err) {
    console.error('Failed to fetch recent searches:', err)
  }
}

const applyRecentSearch = (s: any) => {
  if (s.origin) flightSearchState.origin = s.origin
  if (s.destination) flightSearchState.destination = s.destination
  if (s.departureDate) flightSearchState.departureDate = s.departureDate
  if (s.returnDate) flightSearchState.returnDate = s.returnDate
  if (s.flexibleDates !== undefined) flightSearchState.flexibleDates = s.flexibleDates
  if (s.adults) flightTravelers.adults = s.adults
  if (s.children) flightTravelers.children = s.children
  if (s.cabinClass) flightTravelers.cabinClass = s.cabinClass
  if (s.type) flightMode.value = s.type
  
  // If it's multicity, we might need more complex logic, but for now focus on basic restore
  trackAction('recent_search_applied', { origin: s.origin, destination: s.destination })
}

const removeSearch = async (s: any) => {
  if (isLoggedIn.value && s._id) {
    try {
      await flightsApi.removeRecentSearch(s._id)
      recentSearches.value = recentSearches.value.filter(item => item._id !== s._id)
    } catch (err) {
      console.error('Failed to remove recent search:', err)
    }
  } else {
    // Guest flow: delete locally from state & localStorage
    recentSearches.value = recentSearches.value.filter(
      item => item.origin !== s.origin || item.destination !== s.destination
    )
    if (import.meta.client) {
      try {
        localStorage.setItem('flybeth_recent_searches', JSON.stringify(recentSearches.value))
      } catch (e) {
        console.error('Failed to update local recent searches:', e)
      }
    }
  }
}

// ─── Click-outside handler (replaces backdrop click) ──────
const handleWidgetClickOutside = (e: MouseEvent) => {
  if (!isFocused.value && !activeCruiseField.value) return
  if (widgetRef.value && widgetRef.value.contains(e.target as Node)) return
  isFocused.value = false
  activeCruiseField.value = null
}

onMounted(() => {
  const route = useRoute()
  
  if (route.query.tab) {
    const matchedTab = tabs.find(t => t.name === String(route.query.tab))
    if (matchedTab) currentTab.value = matchedTab.name
  }

  // Restore flight state
  if (route.query.origin) flightSearchState.origin = String(route.query.origin)
  if (route.query.destination) flightSearchState.destination = String(route.query.destination)
  if (route.query.departureDate) flightSearchState.departureDate = String(route.query.departureDate)
  if (route.query.returnDate) flightSearchState.returnDate = String(route.query.returnDate)
  if (route.query.flexibleDates) flightSearchState.flexibleDates = String(route.query.flexibleDates) === 'true'
  if (route.query.type) flightMode.value = String(route.query.type)
  if (route.query.adults) flightTravelers.adults = Number(route.query.adults)
  if (route.query.children) flightTravelers.children = Number(route.query.children)
  if (route.query.infantsOnLap) flightTravelers.infantsOnLap = Number(route.query.infantsOnLap)
  if (route.query.infantsInSeat) flightTravelers.infantsInSeat = Number(route.query.infantsInSeat)
  if (route.query.cabinClass) flightTravelers.cabinClass = String(route.query.cabinClass)

  // Restore hotel state
  if (route.query.location) searchState.location = String(route.query.location)
  if (route.query.checkIn) searchState.checkIn = String(route.query.checkIn)
  if (route.query.checkOut) searchState.checkOut = String(route.query.checkOut)
  if (route.query.rooms) occupancy.rooms = Number(route.query.rooms)
  if (route.query.adults && currentTab.value === 'Hotels') occupancy.adults = Number(route.query.adults)

  // Restore car state
  if (route.query.origin && currentTab.value === 'Cars') carSearchState.origin = String(route.query.origin)
  if (route.query.destination && currentTab.value === 'Cars') carSearchState.destination = String(route.query.destination)
  if (route.query.pickUpDate && currentTab.value === 'Cars') carSearchState.pickUpDate = String(route.query.pickUpDate)
  if (route.query.dropOffDate && currentTab.value === 'Cars') carSearchState.dropOffDate = String(route.query.dropOffDate)
  if (route.query.carMode) carMode.value = String(route.query.carMode)

  // Restore transfer state
  if (route.query.origin && currentTab.value === 'Transfers') transferSearchState.origin = String(route.query.origin)
  if (route.query.destination && currentTab.value === 'Transfers') transferSearchState.destination = String(route.query.destination)
  if (route.query.date && currentTab.value === 'Transfers') transferSearchState.date = String(route.query.date)
  if (route.query.time && currentTab.value === 'Transfers') transferSearchState.time = String(route.query.time)
  if (route.query.returnDate && currentTab.value === 'Transfers') transferSearchState.returnDate = String(route.query.returnDate)
  if (route.query.returnTime && currentTab.value === 'Transfers') transferSearchState.returnTime = String(route.query.returnTime)
  if (route.query.adults && currentTab.value === 'Transfers') transferOccupancy.adults = Number(route.query.adults)
  if (route.query.children && currentTab.value === 'Transfers') transferOccupancy.children = Number(route.query.children)
  if (route.query.tripType && currentTab.value === 'Transfers') transferTripType.value = String(route.query.tripType)

  // Restore package state
  if (route.query.packageType) packageType.value = String(route.query.packageType)

  // Default the departure date two weeks out. It used to default to *today*,
  // which meant a page opened just after midnight — or a restored search from
  // a previous visit — could show a date already in the past and be rejected
  // by submit validation.
  const isoDay = (d: Date) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    return local.toISOString().split('T')[0]
  }
  const today = isoDay(new Date())
  const twoWeeksOut = isoDay(new Date(Date.now() + 14 * 86400000))

  const isPast = (value?: string) => !!value && value < today

  if (!flightSearchState.departureDate && !route.query.departureDate) {
    flightSearchState.departureDate = twoWeeksOut
  }
  // Never keep a stale/past date from localStorage or a saved search.
  if (isPast(flightSearchState.departureDate)) flightSearchState.departureDate = twoWeeksOut
  if (isPast(flightSearchState.returnDate)) flightSearchState.returnDate = ''
  if (!searchState.checkIn) searchState.checkIn = twoWeeksOut
  if (isPast(searchState.checkIn)) searchState.checkIn = twoWeeksOut
  if (isPast(searchState.checkOut)) searchState.checkOut = ''
  if (!transferSearchState.date) transferSearchState.date = twoWeeksOut
  if (isPast(transferSearchState.date)) transferSearchState.date = twoWeeksOut
  if (!activitiesSearchState.date) activitiesSearchState.date = twoWeeksOut
  if (isPast(activitiesSearchState.date)) activitiesSearchState.date = twoWeeksOut
  if (!carSearchState.pickUpDate) carSearchState.pickUpDate = twoWeeksOut
  if (isPast(carSearchState.pickUpDate)) carSearchState.pickUpDate = twoWeeksOut
  if (!packageSearchState.departureDate) packageSearchState.departureDate = twoWeeksOut
  if (isPast(packageSearchState.departureDate)) packageSearchState.departureDate = twoWeeksOut

  checkMobile()
  fetchRecentSearches()
  
  // Also check localStorage for guest search history if not logged in
  if (!isLoggedIn.value) {
    const local = localStorage.getItem('flybeth_recent_searches')
    if (local) {
      try { 
        recentSearches.value = JSON.parse(local).slice(0, 5)
        // Auto-prefill for guest if not already prefilled by route
        if (recentSearches.value.length > 0 && !flightSearchState.origin && !flightSearchState.destination) {
           applyRecentSearch(recentSearches.value[0])
        }
      } catch(e) {}
    }
  }

  window.addEventListener('resize', checkMobile)
  window.addEventListener('scroll', updateDropdownPositions, true)
  window.addEventListener('resize', updateDropdownPositions)
  window.addEventListener('click', handleWidgetClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', updateDropdownPositions, true)
  window.removeEventListener('resize', updateDropdownPositions)
  window.removeEventListener('click', handleWidgetClickOutside)
})

const handleSearch = async () => {
  if (isSearching.value) return
  
  if (currentTab.value === 'Flights' && flightMode.value !== 'multicity') {
    if (!flightSearchState.origin || !flightSearchState.destination) {
      alert("Please select both origin and destination to search for flights.")
      return
    }
  }

  isSearching.value = true
  isFocused.value = false
  const query: any = { tab: currentTab.value }
  const routes: Record<string, string> = {
    Activities: '/things-to-do', Hotels: '/stays', Flights: '/flights',
    Cars: '/cars', Packages: '/packages', Transfers: '/transfers', Cruises: '/cruises',
  }

  if (currentTab.value === 'Flights') {
    // Build search criteria for backend session
    const searchCriteria: any = {
      ...flightSearchState,
      ...flightTravelers,
      type: flightMode.value
    }
    
    if (flightMode.value === 'multicity') {
      const validLegs = multiFlightLegs.value.filter(leg => leg.origin && leg.destination && leg.departureDate)
      searchCriteria.slices = JSON.stringify(validLegs)
    }

    try {
      if (import.meta.client) {
        // Save search criteria directly to localStorage to avoid passing IDs in the URL
        localStorage.setItem('flybeth_last_flight_search', JSON.stringify(searchCriteria))

        try {
          const local = localStorage.getItem('flybeth_recent_searches')
          let history = local ? JSON.parse(local) : []
          if (searchCriteria.origin && searchCriteria.destination) {
            history = [searchCriteria, ...history.filter((h: any) => h.origin !== searchCriteria.origin || h.destination !== searchCriteria.destination)].slice(0, 10)
            localStorage.setItem('flybeth_recent_searches', JSON.stringify(history))
          }
        } catch (e) {}
      }
    } catch (err: any) {
      console.error('Failed to save search session:', err)
      // Fallback: pass params directly if session creation fails
      Object.assign(query, flightSearchState)
      Object.assign(query, flightTravelers)
      query.type = flightMode.value
    }
  }
  else if (currentTab.value === 'Cruises') {
    if (import.meta.client) localStorage.setItem('flybeth_last_cruises_search', JSON.stringify(cruiseSearchState))
  }
  else if (currentTab.value === 'Transfers') {
    if (import.meta.client) localStorage.setItem('flybeth_last_transfers_search', JSON.stringify({ ...transferSearchState, ...transferOccupancy, tripType: transferTripType.value }))
  }
  else if (currentTab.value === 'Activities') {
    // The activities page consumes `destinationIata` (an IATA code) + `date`,
    // so persist both the stable key and the page's expected alias.
    if (import.meta.client) localStorage.setItem('flybeth_last_things-to-do_search', JSON.stringify({ ...activitiesSearchState, destinationIata: activitiesSearchState.destination }))
  }
  else if (currentTab.value === 'Hotels') {
    if (import.meta.client) localStorage.setItem('flybeth_last_stays_search', JSON.stringify({ ...searchState, ...occupancy }))
  }
  else if (currentTab.value === 'Packages') {
    if (import.meta.client) localStorage.setItem('flybeth_last_packages_search', JSON.stringify({ ...packageSearchState, ...packageOccupancy, packageType: packageType.value }))
  }
  else if (currentTab.value === 'Cars') {
    if (import.meta.client) localStorage.setItem('flybeth_last_cars_search', JSON.stringify({ ...carSearchState, carMode: carMode.value }))
  }
  
  trackAction('booking_step_search', { tab: currentTab.value })
  try {
    // Navigate with clean URL (only sid and tab, no raw params)
    await navigateTo({ path: routes[currentTab.value] || '/search', query: currentTab.value === 'Flights' ? query : undefined })
    
    // Emit a custom event so the flights page (if already mounted) immediately picks up the new search
    if (import.meta.client && currentTab.value === 'Flights') {
      const searchCriteria: any = {
        ...flightSearchState,
        ...flightTravelers,
        type: flightMode.value,
      }
      if (flightMode.value === 'multicity') {
        const validLegs = multiFlightLegs.value.filter(leg => leg.origin && leg.destination && leg.departureDate)
        searchCriteria.slices = validLegs
      }
      window.dispatchEvent(new CustomEvent('flybeth:flight-search', { detail: searchCriteria }))
    }
  } finally {
    isSearching.value = false
  }
}

const handleExternalDeal = (deal: any) => {
  currentTab.value = deal.type || 'Flights'
  if (deal.type === 'Flights') {
    flightSearchState.origin = deal.from || ''
    flightSearchState.destination = deal.to || ''
  } else if (deal.type === 'Hotels') {
    searchState.location = deal.to || ''
  } else if (deal.type === 'Cars') {
    carSearchState.destination = deal.to || ''
  }
  handleSearch()
}
defineExpose({ handleExternalDeal })

const swapFlightLocations = (leg: { origin: string; destination: string }) => {
  const tmp = leg.origin
  leg.origin = leg.destination
  leg.destination = tmp
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   Flybeth search widget
   Self-contained white card: tab bar → panel → action footer.
   ═══════════════════════════════════════════════════════════════════════════ */

.sw-root {
  --navy: #0a1b3d;
  --navy-soft: #152b57;
  --green: #0f7b52;
  --gold: #c9a24b;
  --ink: #0f172a;
  --slate: #475569;
  --muted: #64748b;
  --line: #e6eaf2;
  --surface: #f8fafc;
  --tint: #f1f5fd;

  position: relative;
  z-index: 10;
  display: block;
  width: 100%;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 24px 60px -28px rgba(10, 27, 61, 0.35);
  font-family: inherit;
  overflow: visible;
  transition: box-shadow .2s ease, transform .2s ease;
}

.sw-root--sticky { border-radius: 0 0 18px 18px; box-shadow: 0 18px 40px -26px rgba(10,27,61,.35); }

/* ── Tab bar ───────────────────────────────────────────────────────────── */
.sw-tabs { position: relative; border-bottom: 1px solid var(--line); }

.sw-tabs-nav {
  display: flex;
  align-items: stretch;
  gap: 4px;
  padding: 8px 10px 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.sw-tabs-nav::-webkit-scrollbar { display: none; }

.sw-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  padding: 12px 16px 13px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--muted);
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: color .15s ease, border-color .15s ease, background .15s ease;
}
.sw-tab-btn:hover { color: var(--navy); background: var(--tint); }
.sw-tab-btn--on {
  color: var(--navy);
  border-bottom-color: var(--navy);
}
.sw-tab-btn--on .sw-tab-ico { color: var(--navy); }

.sw-tab-ico { width: 17px; height: 17px; color: var(--muted); transition: color .15s ease; flex: 0 0 auto; }

/* ── Panel ─────────────────────────────────────────────────────────────── */
.sw-panel {
  padding: 18px;
  background: #fff;
  border-radius: 0 0 20px 20px;
}
.sw-panel--sm { padding: 14px; }

.sw-section { display: block; }
.sw-rows { display: flex; flex-direction: column; gap: 10px; }

/* ── Trip type / mode pills ────────────────────────────────────────────── */
.sw-radios {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  margin-bottom: 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 999px;
}
.sw-radios--wrap { flex-wrap: wrap; border-radius: 16px; }

.sw-radio {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background .15s ease, box-shadow .15s ease;
}
.sw-radio:hover { background: #fff; }

.sw-radio-dot {
  width: 15px; height: 15px;
  border-radius: 999px;
  border: 2px solid #c7cfdf;
  background: #fff;
  flex: 0 0 auto;
  position: relative;
  transition: border-color .15s ease;
}
.sw-radio-dot--on { border-color: var(--navy); }
.sw-radio-dot--on::after {
  content: "";
  position: absolute; inset: 2px;
  border-radius: 999px;
  background: var(--navy);
}

.sw-radio-txt { font-size: 13px; font-weight: 600; color: var(--muted); white-space: nowrap; }
.sw-radio-txt--on { color: var(--navy); }

/* ── Field bar ─────────────────────────────────────────────────────────── */
.sw-bar {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 4px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.sw-bar:focus-within { border-color: #b9c6e6; box-shadow: 0 0 0 3px rgba(13, 29, 173, .08); }
.sw-bar--compact { border-radius: 14px; }

.sw-bar-div { width: 1px; background: var(--line); margin: 8px 0; flex: 0 0 1px; }
.sw-bar-div--vert { width: 1px; height: auto; margin: 8px 0; }

.sw-loc-group { display: flex; align-items: stretch; flex: 1 1 auto; min-width: 0; }

.sw-field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  min-width: 0;
  border-radius: 12px;
  cursor: pointer;
  transition: background .15s ease;
}
.sw-field:hover { background: var(--tint); }
.sw-field--grow { flex: 1 1 0; min-width: 0; }
.sw-field--date { flex: 0 0 auto; min-width: 190px; }
.sw-field--pax, .sw-field--pax-class { flex: 1 1 0; min-width: 230px; }
.sw-field--time { flex: 0 0 auto; min-width: 130px; }
.sw-field--cat, .sw-field--class { flex: 0 0 auto; min-width: 150px; }

.sw-field-inner { display: flex; flex-direction: column; gap: 2px; min-width: 0; width: 100%; }

.sw-fld-lbl {
  display: block;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--muted);
  line-height: 1.3;
}
.sw-fld-val {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sw-fld-val--trunc { max-width: 100%; }

/* The traveller summary is long ("1 Passenger, Economy"), so let it size to the
   content instead of truncating mid-word. */
.sw-field--pax .sw-fld-val,
.sw-field--pax-class .sw-fld-val { font-size: 14px; }

/* swap button sits on the divider between From and To */
.sw-swap-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1px;
}
.sw-swap-btn {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px; height: 34px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--navy);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(10, 27, 61, .08);
  transition: transform .15s ease, border-color .15s ease, background .15s ease;
}
.sw-swap-btn:hover { background: var(--tint); border-color: #b9c6e6; transform: rotate(180deg); }

/* ── Icons ─────────────────────────────────────────────────────────────── */
.sw-ico-sm { width: 17px; height: 17px; flex: 0 0 auto; }
.sw-ico-xs { width: 13px; height: 13px; flex: 0 0 auto; }
.sw-ico-muted { color: var(--muted); }

/* ── Segmented control (cars) ──────────────────────────────────────────── */
.sw-seg {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 999px;
}
.sw-seg-btn {
  padding: 8px 16px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}
.sw-seg-btn:hover { color: var(--navy); }
.sw-seg-btn--on { background: #fff; color: var(--navy); box-shadow: 0 1px 3px rgba(10,27,61,.12); }

/* ── Multi-leg ─────────────────────────────────────────────────────────── */
.sw-multi-leg-wrapper { margin-bottom: 10px; }
.sw-multi-leg { margin-bottom: 10px; }
.sw-leg-lbl {
  display: block;
  margin-bottom: 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--muted);
}
.sw-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 9px 14px;
  border: 1px dashed #c3cee6;
  border-radius: 10px;
  background: #fff;
  color: var(--navy);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s ease, border-color .15s ease;
}
.sw-add-btn:hover { background: var(--tint); border-color: #a9b8dc; }

.sw-extra-dates { margin-top: 14px; }

/* ── Footer / actions ──────────────────────────────────────────────────── */
.sw-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}
.sw-footer--end { justify-content: flex-end; }

.sw-bundles { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.sw-bundle-lbl {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted);
}

.sw-checks { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px; }

.sw-chk {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 8px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease;
}
.sw-chk:hover { background: var(--tint); border-color: #b9c6e6; }

.sw-chk-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px; height: 17px;
  border: 1.5px solid #c7cfdf;
  border-radius: 5px;
  background: #fff;
  color: #fff;
  flex: 0 0 auto;
  transition: background .15s ease, border-color .15s ease;
}
.sw-chk-box--on { background: var(--navy); border-color: var(--navy); }
.sw-chk-ico { color: #fff; }

/* Primary action */
.sw-search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 50px;
  padding: 0 30px;
  border: 0;
  border-radius: 14px;
  background: var(--navy);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .01em;
  cursor: pointer;
  transition: background .15s ease, transform .1s ease, box-shadow .15s ease;
  box-shadow: 0 10px 22px -12px rgba(10, 27, 61, .65);
}
.sw-search-btn:hover { background: var(--navy-soft); }
.sw-search-btn:active { transform: translateY(1px); }
.sw-search-btn:disabled { opacity: .65; cursor: progress; }
.sw-search-btn--full { width: 100%; }

.sw-adv-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── Time field ────────────────────────────────────────────────────────── */
.sw-time-row { display: flex; align-items: center; gap: 8px; width: 100%; }
.sw-time-input {
  width: 100%;
  border: 0;
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  outline: none;
}

/* ── Cruise pickers + dropdowns ────────────────────────────────────────── */
.sw-cruise-grid { display: grid; gap: 10px; }
.sw-cruise-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.sw-cruise-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sw-cruise-field-wrap { position: relative; min-width: 0; }

.sw-cruise-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease;
}
.sw-cruise-btn:hover { background: var(--tint); }
.sw-cruise-btn--on { border-color: #b9c6e6; box-shadow: 0 0 0 3px rgba(13,29,173,.08); }

.sw-cruise-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1 1 auto; }
.sw-chev { transition: transform .15s ease; }
.sw-chev--up { transform: rotate(180deg); }

.sw-drop {
  position: fixed;
  z-index: 10050;
  min-width: 220px;
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 20px 44px -18px rgba(10, 27, 61, .35);
}
.sw-drop-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 9px;
  font-size: 13.5px;
  cursor: pointer;
}
.sw-drop-item--idle { color: var(--slate); }
.sw-drop-item--idle:hover { background: var(--tint); color: var(--navy); }
.sw-drop-item--on { background: var(--tint); color: var(--navy); font-weight: 700; }
.sw-drop-item--div {
  cursor: default;
  color: var(--muted);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  padding-top: 14px;
}

/* ── Backdrop ──────────────────────────────────────────────────────────── */
.sw-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(6, 10, 36, .28);
  backdrop-filter: blur(2px);
  pointer-events: none;
}

/* ── Transitions ───────────────────────────────────────────────────────── */
.sw-fade-enter-active, .sw-fade-leave-active { transition: opacity .18s ease; }
.sw-fade-enter-from, .sw-fade-leave-to { opacity: 0; }

.sw-slide-enter-active, .sw-slide-leave-active { transition: opacity .18s ease, transform .18s ease; }
.sw-slide-enter-from, .sw-slide-leave-to { opacity: 0; transform: translateY(-6px); }

.sw-drop-enter-active, .sw-drop-leave-active { transition: opacity .14s ease, transform .14s ease; }
.sw-drop-enter-from, .sw-drop-leave-to { opacity: 0; transform: translateY(-4px); }

@keyframes sw-spin { to { transform: rotate(360deg); } }
.sw-spin { animation: sw-spin .8s linear infinite; }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .sw-field--date { min-width: 160px; }
  .sw-field--pax, .sw-field--pax-class { min-width: 200px; }
}

@media (max-width: 900px) {
  .sw-panel { padding: 14px; }

  /* Fields stack; dividers become horizontal hairlines */
  .sw-bar { flex-direction: column; align-items: stretch; }
  .sw-loc-group { flex-direction: column; }
  .sw-bar-div, .sw-bar-div--vert { width: auto; height: 1px; margin: 2px 12px; }
  .sw-field { width: 100%; min-width: 0; padding: 13px 14px; }
  .sw-field--date, .sw-field--pax, .sw-field--pax-class,
  .sw-field--time, .sw-field--cat, .sw-field--class { flex: 1 1 100%; min-width: 0; }

  /* Stacked fields: a floating swap button just adds empty space, and the
     fields are easy to retype — so hide it and drop its wrapper row. */
  .sw-swap-wrap { display: none; }

  .sw-cruise-grid--2, .sw-cruise-grid--3 { grid-template-columns: 1fr; }

  .sw-footer { flex-direction: column-reverse; align-items: stretch; gap: 12px; }
  .sw-footer--end { flex-direction: column; }
  .sw-search-btn { width: 100%; }
  .sw-bundles { justify-content: center; }
}

@media (max-width: 900px) {
  .sw-tabs::after {
    content: "";
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 34px;
    background: linear-gradient(90deg, rgba(255,255,255,0), #ffffff 78%);
    pointer-events: none;
    border-radius: 0 20px 0 0;
  }
}

@media (max-width: 560px) {
  .sw-tabs-nav { padding: 6px 6px 0; gap: 2px; }
  .sw-tab-btn { padding: 10px 12px 11px; font-size: 12.5px; }
  .sw-tab-btn .sw-tab-ico { width: 15px; height: 15px; }
  .sw-panel { padding: 12px; }
  .sw-radios { width: 100%; justify-content: space-between; }
  .sw-radio { padding: 8px 10px; }
  .sw-radio-txt { font-size: 12px; }
}
</style>
