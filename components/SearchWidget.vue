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

        <button
          v-if="flightMode === 'multicity' && multiFlightLegs.length < 5"
          @click="multiFlightLegs.push({ origin: '', destination: '', departureDate: '', returnDate: '' })"
          class="sw-add-btn"
        >
          <Plus class="sw-ico-xs" /> Add flight
        </button>

        <!-- Recent Searches -->
        <div v-if="recentSearches.length > 0" class="mt-4 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <span class="text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <History class="w-3 h-3" />
            Recent
          </span>
          <div v-for="s in recentSearches" :key="s._id" 
            class="group flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-200 px-3 py-1.5 rounded-full transition-all cursor-pointer"
            @click="applyRecentSearch(s)"
          >
            <span class="text-[11px] font-bold text-black">{{ s.origin }} → {{ s.destination }}</span>
            <button @click.stop="removeSearch(s._id)" class="text-black hover:text-rose-500 transition-colors">
              <X class="w-3 h-3" />
            </button>
          </div>
        </div>

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
          <button @click="handleSearch" :disabled="isSearching" class="sw-search-btn">
            <Loader2 v-if="isSearching" class="sw-ico-sm animate-spin" />
            <Search v-else class="sw-ico-sm" /> 
            {{ isSearching ? 'Searching...' : 'Search cars' }}
          </button>
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
  ChevronDown, MapPin, History, X, ArrowUpDown, Loader2
} from 'lucide-vue-next'
import { useTracking } from '@/composables/core/useTracking'
import { flightsApi } from '@/api_factory/modules/flights'
import { useAuth } from '@/composables/modules/auth/useAuth'
import CustomTimePicker from '@/components/ui/CustomTimePicker.vue'
import { useRoute } from 'vue-router'

const { isLoggedIn } = useAuth()
const { trackAction } = useTracking()
const props = defineProps({ isSticky: { type: Boolean, default: false } })
const emit  = defineEmits(['focus-change', 'update:tab'])

// ─── State ──────────────────────────────────────────────────
const isFocused           = ref(false)
const isSearching         = ref(false)
const currentTab          = ref('Flights')
const stayMode            = ref('single')
const flightMode          = ref('oneway')
const carMode             = ref('pickup')
const transferMode        = ref('pickup')
const packageType         = ref('Hotel+Flight')
const onlyPartialHotel    = ref(false)
const differentCarDropoff = ref(false)
const activeCruiseField   = ref<string | null>(null)
const isMobile            = ref(false)
const widgetRef           = ref<HTMLElement | null>(null)

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
  if (s.adults) flightTravelers.adults = s.adults
  if (s.children) flightTravelers.children = s.children
  if (s.cabinClass) flightTravelers.cabinClass = s.cabinClass
  if (s.type) flightMode.value = s.type
  
  // If it's multicity, we might need more complex logic, but for now focus on basic restore
  trackAction('recent_search_applied', { origin: s.origin, destination: s.destination })
}

const removeSearch = async (id: string) => {
  try {
    await flightsApi.removeRecentSearch(id)
    recentSearches.value = recentSearches.value.filter(s => s._id !== id)
  } catch (err) {}
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
  if (route.query.pickUpDate && currentTab.value === 'Cars') carSearchState.pickUpDate = String(route.query.pickUpDate)
  if (route.query.carMode) carMode.value = String(route.query.carMode)

  // Restore package state
  if (route.query.packageType) packageType.value = String(route.query.packageType)

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
  isSearching.value = true
  isFocused.value = false
  const query: any = { tab: currentTab.value }
  const routes: Record<string, string> = {
    Activities: '/things-to-do', Hotels: '/stays', Flights: '/flights',
    Cars: '/cars', Packages: '/packages', Transfers: '/transfers', Cruises: '/cruises',
  }

  if (currentTab.value === 'Flights') {
    Object.assign(query, flightSearchState)
    Object.assign(query, flightTravelers)
    query.type = flightMode.value

    try {
      // Secure Search Session
      const searchCriteria = {
        ...flightSearchState,
        ...flightTravelers,
        type: flightMode.value
      }
      
      const { data } = await flightsApi.createSearchSession(searchCriteria)
      
      // Save to local history for quick access (Always save for guests, backend handles logged in)
      if (import.meta.client) {
         try {
           const local = localStorage.getItem('flybeth_recent_searches')
           let history = local ? JSON.parse(local) : []
           if (searchCriteria.origin && searchCriteria.destination) {
             history = [searchCriteria, ...history.filter((h: any) => h.origin !== searchCriteria.origin || h.destination !== searchCriteria.destination)].slice(0, 10)
             localStorage.setItem('flybeth_recent_searches', JSON.stringify(history))
           }
         } catch (e) {}
      }

      // Handle both sid and sessionId for robustness
      const sid = data?.sid || data?.sessionId
      if (sid) {
        query.sid = sid
      }
    } catch (err: any) {
      console.error('Failed to create secure search session:', err)
      // Check for 404 specifically
      if (err.response?.status === 404) {
        console.warn('Search session endpoint not found (404). Check backend routing.')
      }
    }
  }
  else if (currentTab.value === 'Cruises')       Object.assign(query, cruiseSearchState)
  else if (currentTab.value === 'Transfers')     { Object.assign(query, transferSearchState); query.mode = transferMode.value }
  else if (currentTab.value === 'Activities')    Object.assign(query, activitiesSearchState)
  else if (currentTab.value === 'Hotels')        { Object.assign(query, searchState); Object.assign(query, occupancy) }
  else if (currentTab.value === 'Packages')      { Object.assign(query, packageSearchState); Object.assign(query, packageOccupancy); query.packageType = packageType.value }
  else if (currentTab.value === 'Cars')          { Object.assign(query, carSearchState); query.carMode = carMode.value }
  trackAction('booking_step_search', { tab: currentTab.value, ...query })
  try {
    await navigateTo({ path: routes[currentTab.value] || '/search', query })
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
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e2e2e2;
  background: #ffffff;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  /* mobile: centered on the divider line */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
@media (min-width: 768px) {
  .sw-swap-btn {
    width: 34px;
    height: 34px;
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
.sw-radios { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; margin-bottom: 4px; }
.sw-radios--wrap { gap: 12px 28px; }

.sw-radio { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.sw-radio-dot {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1.5px solid #d1d5db;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: #fff;
}
.sw-radio-dot::after {
  content: ''; width: 8px; height: 8px; border-radius: 50%;
  background: transparent; transition: background 0.2s;
  position: absolute;
}
.sw-radio-dot--on { border-color: #111; border-width: 2px; box-shadow: 0 0 0 4px rgba(0,0,0,0.03); }
.sw-radio-dot--on::after { background: #111; }

.sw-radio-txt { font-size: 14px; font-weight: 600; color: #6b7280; user-select: none; transition: color 0.2s; letter-spacing: -0.01em; }
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
  border: 1px solid #e0e0d8;
  border-radius: 12px;
  padding: 4px;
  background: #f5f5f0;
  width: fit-content;
}
.sw-seg-btn {
  padding: 8px 20px;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 9px;
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
  font-size: 13px;
  font-weight: 500;
  color: black;
  
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
  background: black;
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
.sw-search-btn:hover { background: black; transform: translateY(-1px); }
.sw-search-btn--full { width: 100%; }
@media (min-width: 640px) { .sw-search-btn--full { width: auto; } }

/* ═══════════════════════════════════════════════════
   ADD / MULTI-LEG
═══════════════════════════════════════════════════ */
.sw-rows { display: flex; flex-direction: column; gap: 10px; }
.sw-multi-leg { display: flex; flex-direction: column; gap: 4px; }
.sw-leg-lbl { font-size: 11px; font-weight: 700; color: #9ca3af;  letter-spacing: 0.05em; }
.sw-add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
  padding: 4px 0;
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
  pointer-events: none;
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

.animate-spin {
  animation: sw-spin 1s linear infinite;
}
@keyframes sw-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>