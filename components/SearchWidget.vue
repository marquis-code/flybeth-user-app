<template>
  <div 
    class="bg-white/95 backdrop-blur-xl shadow-2xl shadow-brand-blue/10 border-b border-gray-100 font-body relative transition-all duration-700 ease-in-out"
    :class="[isSticky ? 'rounded-b-[2.5rem] border-x-0 border-t-0 py-1' : 'rounded-[2.5rem] border border-gray-100 py-0']"
  >
    <!-- Redesigned Tabs (Priceline Style: Horizontal, Icon + Text) -->
    <div class="bg-white rounded-t-[2.5rem] border-b border-gray-100 overflow-x-auto no-scrollbar">
      <nav class="flex px-8 gap-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="currentTab = tab.name"
          :class="[
            currentTab === tab.name
              ? 'text-brand-blue border-brand-blue'
              : 'text-brand-gray/60 hover:text-brand-blue border-transparent',
            'flex items-center gap-3 transition-all border-b-2 py-5 relative z-10 whitespace-nowrap px-6',
          ]"
        >
          <div 
            class="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
            :class="[currentTab === tab.name ? 'bg-brand-blue/10' : 'bg-transparent']"
          >
            <component :is="tab.icon" class="h-5 w-5" />
          </div>
          <span class="text-sm font-black tracking-wider uppercase">{{ tab.name }}</span>
          <span v-if="tab.badge" class="ml-1 bg-brand-green/10 text-[10px] text-brand-green px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{{ tab.badge }}</span>
        </button>
      </nav>
    </div>

    <!-- Backdrop Overlay (Dim effect on focus) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isFocused" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" @click="isFocused = false"></div>
      </Transition>
    </Teleport>

    <!-- Redesigned Content Area -->
    <div 
      class="bg-white transition-all duration-700 ease-in-out relative z-[10000]"
      :class="[isSticky ? 'p-2 md:p-4 !space-y-4' : 'p-6 md:p-8 space-y-8', isFocused ? '!rounded-b-[2.5rem]' : '']"
    >
      <!-- Stays (Hotels) Panel -->
      <div v-if="currentTab === 'Hotels'" class="space-y-6">
        <!-- Stay Mode Toggle -->
        <div class="flex items-center space-x-8 pb-2">
          <label 
            v-for="mode in [{label: 'Single Hotel', value: 'single'}, {label: 'Multi Hotel', value: 'multi'}]" 
            :key="mode.value"
            class="flex items-center space-x-3 cursor-pointer group"
          >
            <div class="relative flex items-center">
              <input type="radio" :value="mode.value" v-model="stayMode" class="sr-only" />
              <div 
                class="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                :class="stayMode === mode.value ? 'border-brand-blue' : 'border-gray-200 group-hover:border-brand-blue/50'"
              >
                <div 
                  class="w-2.5 h-2.5 rounded-full bg-brand-blue transition-all duration-300"
                  :class="stayMode === mode.value ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
                ></div>
              </div>
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-brand-gray transition-colors" :class="stayMode === mode.value ? 'text-brand-blue' : 'opacity-60 group-hover:opacity-100'">{{ mode.label }}</span>
          </label>
        </div>

        <!-- Single Hotel — Unified Inline Row -->
        <div v-if="stayMode === 'single'" class="flex flex-col gap-6">
          <div 
            class="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible transition-all duration-300"
            :class="isFocused ? 'ring-4 ring-brand-blue/10 border-brand-blue' : ''"
          >
            <!-- Location -->
            <div class="flex-[1.8] relative border-b md:border-b-0 md:border-r border-gray-100">
              <LocationPicker 
                v-model="searchState.location" 
                label="Going to"
                placeholder="Where are you going?"
                id="stay-location"
                @focus="isFocused = true"
                @close="isFocused = false"
                @select="handleLocationSelect"
              />
            </div>
            
            <!-- Date Range Picker for Check-in / Check-out -->
            <div class="flex-[1.8] border-b md:border-b-0 md:border-r border-gray-100">
              <FlightDateRangePicker
                :departure="searchState.checkIn"
                :return="searchState.checkOut"
                mode="roundtrip"
                @focus="isFocused = true"
                @close="isFocused = false"
                @update:departure="(v: string) => searchState.checkIn = v"
                @update:return="(v: string) => searchState.checkOut = v"
              />
            </div>

            <!-- Rooms & Guests -->
            <div class="flex-1 relative border-gray-100">
               <Occupancypicker
                 v-model:rooms="occupancy.rooms"
                 v-model:adults="occupancy.adults"
                 v-model:children="occupancy.children"
                 @focus="isFocused = true"
                 @close="isFocused = false"
               />
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-gray-50">
            <div class="flex items-center gap-6">
              <div class="flex items-center bg-brand-green/5 px-4 py-2 rounded-xl border border-brand-green/10">
                <span class="text-[10px] font-black text-brand-green uppercase tracking-widest mr-4">Bundle + Save</span>
                <label v-for="opt in [{label: 'Add a flight', model: 'bundleFlight'}, {label: 'Add a car', model: 'bundleCar'}]" :key="opt.label" class="flex items-center text-xs font-bold text-brand-blue cursor-pointer mr-4 last:mr-0">
                  <input type="checkbox" v-model="(bundles as any)[opt.model]" class="mr-2 custom-checkbox" />
                  {{ opt.label }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

       <!-- Flights Panel -->
      <div v-if="currentTab === 'Flights'" class="space-y-4">
        <!-- Flight Mode & Cabin Class -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
           <div class="flex items-center space-x-6">
             <label class="flex items-center space-x-2 cursor-pointer group">
               <input type="radio" value="oneway" v-model="flightMode" class="sr-only" />
               <div class="w-4 h-4 rounded-full border-2 border-brand-blue/30 flex items-center justify-center group-hover:border-brand-blue transition-colors">
                  <div v-if="flightMode === 'oneway'" class="w-2 h-2 rounded-full bg-brand-blue"></div>
               </div>
               <span class="text-xs font-black" :class="flightMode === 'oneway' ? 'text-brand-blue' : 'text-brand-gray/60 group-hover:text-brand-blue'">One Way</span>
             </label>
             <label class="flex items-center space-x-2 cursor-pointer group">
               <input type="radio" value="roundtrip" v-model="flightMode" class="sr-only" />
               <div class="w-4 h-4 rounded-full border-2 border-brand-blue/30 flex items-center justify-center group-hover:border-brand-blue transition-colors">
                  <div v-if="flightMode === 'roundtrip'" class="w-2 h-2 rounded-full bg-brand-blue"></div>
               </div>
               <span class="text-xs font-black" :class="flightMode === 'roundtrip' ? 'text-brand-blue' : 'text-brand-gray/60 group-hover:text-brand-blue'">Round Trip</span>
             </label>
             <label class="flex items-center space-x-2 cursor-pointer group">
               <input type="radio" value="multicity" v-model="flightMode" class="sr-only" />
               <div class="w-4 h-4 rounded-full border-2 border-brand-blue/30 flex items-center justify-center group-hover:border-brand-blue transition-colors">
                  <div v-if="flightMode === 'multicity'" class="w-2 h-2 rounded-full bg-brand-blue"></div>
               </div>
               <span class="text-xs font-black" :class="flightMode === 'multicity' ? 'text-brand-blue' : 'text-brand-gray/60 group-hover:text-brand-blue'">Multi City</span>
             </label>
             <div class="relative flex items-center pr-4" v-if="flightMode === 'multicity'">
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
           </div>
           
           <div class="items-center gap-4 hidden sm:flex">
             <div class="relative flex items-center gap-2 group cursor-pointer">
                <TicketIcon class="h-4 w-4 text-brand-gray/60" />
                <select v-model="flightSearchState.cabinClass" class="text-xs font-black text-brand-gray/80 bg-transparent border-none appearance-none outline-none pr-4 cursor-pointer">
                   <option value="Economy">Economy</option>
                   <option value="Premium Economy">Premium Economy</option>
                   <option value="Business">Business</option>
                   <option value="First">First Class</option>
                </select>
                <ChevronDownIcon class="h-3 w-3 text-brand-gray/60 absolute right-0 pointer-events-none" />
             </div>
             <span class="text-[10px] font-bold text-brand-gray/60 ml-4 hidden md:block">Book International and Domestic Flights</span>
           </div>
        </div>

        <!-- Integrated Search Row -->
        <div class="flex flex-col relative z-[100] gap-4">
           <!-- Leg component logic -->
           <div 
             v-for="(leg, index) in flightMode === 'multicity' ? multiFlightLegs : [flightSearchState]" 
             :key="index"
             class="flex flex-col lg:flex-row w-full bg-white border border-gray-200 rounded-xl lg:rounded-2xl shadow-sm relative transition-all duration-300"
             :class="isFocused ? 'ring-4 ring-brand-blue/10 border-brand-blue' : ''"
           >
              <!-- Origin & Destination -->
              <div class="flex flex-col md:flex-row w-full" :class="flightMode === 'multicity' ? 'lg:w-[65%]' : 'lg:w-[42%]'">
                <div class="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 p-1 relative">
                   <LocationPicker 
                     v-model="leg.origin" 
                     :id="`origin-${index}`" 
                     label="From"
                     @focus="isFocused = true"
                     @close="isFocused = false"
                     @select="flightMode === 'multicity' ? handleMultiFlightOriginSelect($event, index) : handleFlightOriginSelect($event)"
                   />
                   <!-- Toggle Button -->
                   <button 
                     @click.prevent="swapFlightLocations(index)"
                     class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 rounded-full items-center justify-center text-brand-blue/60 z-[110] hover:bg-gray-50 hover:text-brand-blue transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                   >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="currentColor"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                   </button>
                </div>
                
                <div class="w-full md:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 p-1 pl-4">
                   <LocationPicker 
                     v-model="leg.destination" 
                     :id="`destination-${index}`" 
                     label="To"
                     @focus="isFocused = true"
                     @close="isFocused = false"
                     @select="flightMode === 'multicity' ? handleMultiFlightDestSelect($event, index) : handleFlightDestSelect($event)"
                   />
                </div>
              </div>

              <!-- Dates & Passengers -->
              <div class="flex flex-col md:flex-row w-full relative" :class="flightMode === 'multicity' ? 'lg:w-[35%]' : 'lg:w-[58%]'">
                <!-- Roundtrip / Oneway Dates & Passenger -->
                <template v-if="flightMode !== 'multicity'">
                   <div class="w-full md:w-[60%] border-b md:border-b-0 md:border-r border-gray-200 pt-1 relative">
                     <FlightDateRangePicker 
                       :mode="(flightMode as any)"
                       v-model:departure="leg.departureDate"
                       v-model:return="leg.returnDate"
                       @focus="isFocused = true"
                       @close="isFocused = false"
                     />
                   </div>
                                      <div class="w-full md:w-[40%] relative">
                      <Occupancypicker
                        label="Passenger"
                        variant="flight"
                        v-model:adults="flightTravelers.adults"
                        v-model:children="flightTravelers.children"
                        v-model:infantsOnLap="flightTravelers.infantsOnLap"
                        v-model:infantsInSeat="flightTravelers.infantsInSeat"
                        @focus="isFocused = true"
                        @close="isFocused = false"
                      />
                    </div>
                </template>

                <!-- Multi City Dates & Cabin -->
                <template v-else>
                   <div class="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200">
                     <FlightDateRangePicker 
                       mode="oneway"
                       v-model:departure="leg.departureDate"
                       @focus="isFocused = true"
                       @close="isFocused = false"
                     />
                   </div>
                   <!-- Cabin/Class selector per leg or overall. Design shows Economy per block -->
                   <div class="w-full md:w-1/2 py-3 px-4 relative flex items-center">
                     <div class="w-full">
                       <label class="text-[10px] font-black text-brand-gray/40 uppercase tracking-widest mb-1 flex items-center gap-1">Class/Cabin <ChevronDownIcon class="h-3 w-3 inline text-brand-blue/50"/></label>
                       <select v-model="leg.cabinClass" class="text-2xl font-black text-brand-blue bg-transparent border-none appearance-none outline-none w-full cursor-pointer pr-4 hover:text-brand-blue/80 transition-colors">
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">Premium Economy</option>
                          <option value="Business">Business</option>
                          <option value="First">First Class</option>
                       </select>
                     </div>
                     <button v-if="index > 0" @click="removeFlightLeg(index)" class="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                     </button>
                   </div>
                </template>
              </div>
           </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-6 pt-2">
           <div class="flex items-center gap-6">
             <label class="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-blue cursor-pointer group">
               <div class="relative flex items-center mr-3">
                 <input type="checkbox" v-model="flightSearchState.flexibleDates" class="sr-only" />
                 <div 
                   class="w-4 h-4 rounded border-2 transition-all duration-300 flex items-center justify-center"
                   :class="flightSearchState.flexibleDates ? 'bg-brand-blue border-brand-blue' : 'border-gray-200 group-hover:border-brand-blue/50'"
                 >
                   <svg v-if="flightSearchState.flexibleDates" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                   </svg>
                 </div>
               </div>
               My dates are flexible(+/- 3days)
             </label>
             <button v-if="flightMode === 'multicity'" @click="addFlightLeg" class="text-xs font-bold text-[#f27a20] border border-[#f27a20]/30 hover:bg-[#f27a20]/10 px-4 py-2 rounded-lg transition-colors bg-white">
                Add Another Destination
             </button>
           </div>
           
           <!-- Recent Searches Mini Display (Matches Prototype Bottom Right) -->
           <div class="flex items-center gap-3">
               <span class="text-[10px] font-black text-brand-blue uppercase tracking-widest">Recent searches:</span>
               <div class="flex items-center border border-[#f27a20]/30 bg-white rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                 <div class="flex flex-col">
                    <p class="text-[11px] font-black text-brand-blue flex items-center gap-1.5">
                      Abuja <svg width="10" height="10" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="text-gray-400"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" stroke-linecap="round"/></svg> Doha
                    </p>
                    <p class="text-[9px] font-bold text-brand-gray/60">1 traveller &bull; 6 - 18 Mar 26</p>
                 </div>
               </div>
           </div>
        </div>
      </div>

      <!-- Cars / Transfers Panel -->
       <div v-if="currentTab === 'Cars'" class="space-y-6">
          <!-- Airport Pick-up / Drop-off Toggle Tabs -->
          <div class="flex rounded-xl overflow-hidden border border-gray-200">
            <button 
              @click="carMode = 'pickup'" 
              class="flex-1 py-3.5 text-sm font-black uppercase tracking-widest transition-all"
              :class="carMode === 'pickup' ? 'bg-[#3BB4C1] text-white shadow-lg' : 'bg-white text-brand-gray/60 hover:bg-gray-50'"
            >Airport Pick-up</button>
            <button 
              @click="carMode = 'dropoff'" 
              class="flex-1 py-3.5 text-sm font-black uppercase tracking-widest transition-all"
              :class="carMode === 'dropoff' ? 'bg-[#3BB4C1] text-white shadow-lg' : 'bg-white text-brand-gray/60 hover:bg-gray-50'"
            >Airport Drop-off</button>
          </div>

          <!-- Passenger Count -->
          <div class="relative inline-block min-w-[200px]">
            <Occupancypicker
              label="Passengers"
              variant="flight"
              :adults="carPassengers"
              @update:adults="carPassengers = $event"
              @focus="isFocused = true"
              @close="isFocused = false"
            />
          </div>

          <!-- Main Fields — Unified Inline Row -->
          <div 
            class="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible mb-6 transition-all duration-300"
            :class="isFocused ? 'ring-4 ring-brand-blue/10 border-brand-blue' : ''"
          >
            <!-- Pick-up -->
            <div class="flex-[1.5] relative border-b md:border-b-0 md:border-r border-gray-100">
              <LocationPicker 
                :label="carMode === 'pickup' ? 'Pick up from airport' : 'Pick up address'"  
                :placeholder="carMode === 'pickup' ? 'Search airport...' : 'Enter city'"  
                id="car-origin" 
                v-model="carSearchState.origin" 
                @focus="isFocused = true"
                @close="isFocused = false"
              />
            </div>
            
            <!-- Drop-off -->
            <div class="flex-[1.5] relative border-b md:border-b-0 md:border-r border-gray-100">
              <LocationPicker 
                :label="carMode === 'pickup' ? 'Drop-off address' : 'Airport'"  
                :placeholder="carMode === 'pickup' ? 'Enter city' : 'Search airport...'"
                id="car-destination" 
                v-model="carSearchState.destination" 
                @focus="isFocused = true"
                @close="isFocused = false"
              />
            </div>

            <!-- Pick-up Date -->
            <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100">
              <FlightDateRangePicker
                :departure="carSearchState.pickUpDate"
                mode="oneway"
                @focus="isFocused = true"
                @close="isFocused = false"
                @update:departure="(v: string) => carSearchState.pickUpDate = v"
              />
            </div>

            <!-- Pick-up Time -->
            <div class="flex-1 relative p-4" @click="isFocused = true">
              <label class="text-[10px] font-black text-brand-gray/40 uppercase tracking-widest block mb-1">Pick up Time</label>
              <div class="relative">
                <input 
                  type="time" 
                  v-model="carSearchState.pickUpTime" 
                  class="text-2xl font-black text-brand-blue bg-transparent border-none outline-none w-full cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- Bundle Options -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-50">
             <div class="flex items-center gap-6">
                <div class="flex items-center px-4 py-2 bg-brand-green/5 border border-brand-green/10 rounded-xl">
                   <span class="text-[10px] font-black text-brand-green uppercase tracking-widest mr-4 opacity-60">Bundle</span>
                   <label v-for="addon in [{label: 'Hotel', model: 'bundleCarHotel'}, {label: 'Flight', model: 'bundleCarFlight'}]" :key="addon.label" class="flex items-center text-xs font-bold text-brand-blue cursor-pointer mr-4 last:mr-0">
                     <input type="checkbox" v-model="(bundles as any)[addon.model]" class="mr-2 custom-checkbox" />
                     {{ addon.label }}
                   </label>
                </div>
             </div>
          </div>
       </div>

       <!-- Holidays Panel -->
       <div v-if="currentTab === 'Holidays'" class="space-y-8">
          <div class="flex flex-wrap items-center gap-8 pb-4">
            <label 
              v-for="type in [
                { label: 'Hotel + Flight', value: 'hotel+flight' },
                { label: 'Hotel + Flight + Car', value: 'hotel+flight+car' },
                { label: 'Flight + Car', value: 'flight+car' },
                { label: 'Hotel + Car', value: 'hotel+car' }
              ]" 
              :key="type.value" 
              class="flex items-center space-x-3 cursor-pointer group"
            >
              <div class="relative flex items-center">
                <input type="radio" :value="type.value" v-model="packageType" class="sr-only" />
                <div 
                  class="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                  :class="packageType === type.value ? 'border-brand-blue' : 'border-gray-200 group-hover:border-brand-blue/50'"
                >
                  <div 
                    class="w-2.5 h-2.5 rounded-full bg-brand-blue transition-all duration-300"
                    :class="packageType === type.value ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
                  ></div>
                </div>
              </div>
              <span class="text-xs font-black uppercase tracking-widest text-brand-gray transition-colors" :class="packageType === type.value ? 'text-brand-blue' : 'opacity-60 group-hover:opacity-100'">{{ $t(`search.packages.${getPackageKey(type.value)}`) }}</span>
            </label>
          </div>

          <!-- Main Fields — Unified Inline Row -->
          <div class="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible mb-6">
            <div v-if="packageType !== 'hotel+car'" class="flex-1 relative border-b md:border-b-0 md:border-r border-gray-100">
               <LocationPicker 
                 label="Where from?" 
                 id="package-origin" 
                 v-model="packageSearchState.origin" 
                 @focus="isFocused = true"
                 @close="isFocused = false"
               />
            </div>
            
            <div class="relative border-b md:border-b-0 md:border-r border-gray-100" :class="packageType === 'hotel+car' ? 'flex-[2]' : 'flex-1'">
               <LocationPicker 
                 label="Where to?" 
                 id="package-destination" 
                 v-model="packageSearchState.destination" 
                 @focus="isFocused = true"
                 @close="isFocused = false"
               />
            </div>

            <!-- Stay/Travel Dates -->
            <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100">
              <FlightDateRangePicker
                :departure="packageSearchState.departureDate"
                :return="packageSearchState.returnDate"
                mode="roundtrip"
                @focus="isFocused = true"
                @close="isFocused = false"
                @update:departure="(v: string) => packageSearchState.departureDate = v"
                @update:return="(v: string) => packageSearchState.returnDate = v"
              />
            </div>

            <!-- Travelers & Rooms -->
            <div class="flex-1 relative border-gray-100">
               <Occupancypicker
                 v-model:rooms="packageOccupancy.rooms"
                 v-model:adults="packageOccupancy.adults"
                 v-model:children="packageOccupancy.children"
                 variant="package"
                 @focus="isFocused = true"
                 @close="isFocused = false"
               />
            </div>


          </div>

          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-gray-50">
            <div class="flex items-center gap-8">
               <label v-if="packageType.includes('hotel')" class="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-blue cursor-pointer group">
                  <div class="relative flex items-center mr-3">
                    <input type="checkbox" v-model="onlyPartialHotel" class="sr-only" />
                    <div 
                      class="w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center"
                      :class="onlyPartialHotel ? 'bg-brand-blue border-brand-blue' : 'border-gray-200 group-hover:border-brand-blue/50'"
                    >
                      <svg v-if="onlyPartialHotel" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  Partial hotel stay
               </label>
               <label v-if="packageType.includes('car')" class="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-blue cursor-pointer group">
                <div class="relative flex items-center mr-3">
                  <input type="checkbox" v-model="differentCarDropoff" class="sr-only" />
                  <div 
                    class="w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center"
                    :class="differentCarDropoff ? 'bg-brand-blue border-brand-blue' : 'border-gray-200 group-hover:border-brand-blue/50'"
                  >
                    <svg v-if="differentCarDropoff" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                Different car drop-off
               </label>
            </div>
            
            <p class="text-xs font-bold text-brand-green/70 flex items-center bg-brand-green/5 px-6 py-2 rounded-full border border-brand-green/10">
              <GiftIcon class="h-4 w-4 mr-2" /> Save up to $625 by bundling your trip!
            </p>
          </div>
       </div>

       <!-- Cruises Panel -->
       <div v-if="currentTab === 'Cruises'" class="space-y-8">
          <div class="flex items-center justify-between">
            <p class="text-3xl font-black text-brand-blue font-header tracking-tighter">{{ $t('search.cruises.title') }}</p>
            <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-widest border border-gray-100 rounded-full px-6 py-2">Expert Advice: 1-866-403-9848</p>
          </div>
          
          <!-- Main Fields — Unified Inline Row -->
          <div class="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible mb-6">
            <!-- Destination -->
            <div class="flex-1 relative border-b md:border-b-0 md:border-r border-gray-100">
              <UiSelectInput 
                label="Going to" 
                v-model="cruiseSearchState.destination"
                :options="[
                  {label: 'Alaska', value: 'Alaska'},
                  {label: 'Bahamas', value: 'Bahamas'},
                  {label: 'Caribbean', value: 'Caribbean'},
                  {label: 'Europe', value: 'Europe'},
                  {label: 'Mexico', value: 'Mexico'},
                  {label: 'Africa', value: 'Africa'}
                ]"
              />
            </div>

            <!-- Departure Month -->
            <div class="flex-1 relative border-b md:border-b-0 md:border-r border-gray-100">
              <UiSelectInput 
                label="Departing between" 
                v-model="cruiseSearchState.departureMonth"
                :options="[
                  {label: 'March 2026', value: '2026-03'},
                  {label: 'April 2026', value: '2026-04'},
                  {label: 'May 2026', value: '2026-05'},
                  {label: 'June 2026', value: '2026-06'},
                  {label: 'July 2026', value: '2026-07'}
                ]"
              />
            </div>

            <!-- Cruise Line -->
            <div class="flex-1 relative border-b md:border-b-0 border-gray-100">
               <UiSelectInput 
                  label="Cruise Line" 
                  v-model="cruiseSearchState.cruiseLine"
                  :options="[
                    {label: 'Any', value: 'Any'},
                    {label: 'Carnival', value: 'Carnival'},
                    {label: 'Royal Caribbean', value: 'Royal Caribbean'},
                    {label: 'Celebrity', value: 'Celebrity'},
                    {label: 'Disney', value: 'Disney'},
                    {label: 'Norwegian', value: 'Norwegian'}
                  ]"
                />
            </div>
          </div>

          <div class="flex items-center justify-between pt-8 border-t border-gray-50">
             <div class="flex items-center gap-10">
                <button class="text-xs font-black uppercase tracking-widest text-brand-blue/40 hover:text-brand-blue transition-colors pb-1 border-b-2 border-transparent hover:border-brand-blue">View Luxury Suites</button>
                <button class="text-xs font-black uppercase tracking-widest text-brand-blue/40 hover:text-brand-blue transition-colors pb-1 border-b-2 border-transparent hover:border-brand-blue">Family Deals</button>
             </div>
             

          </div>
       </div>
 
       <!-- Transfers Panel -->
       <div v-if="currentTab === 'Transfers'" class="space-y-6">
         <div class="space-y-1">
           <h3 class="text-3xl font-black text-brand-blue tracking-tighter">Airport Transfers</h3>
           <p class="text-brand-gray/60 font-bold text-sm">Professional door-to-door service across 170+ countries.</p>
         </div>
 
         <div class="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible">
            <!-- From -->
            <div class="flex-1 relative border-b md:border-b-0 md:border-r border-gray-100">
              <LocationPicker 
                label="Pick-up Location"  
                placeholder="Search airport or city..."
                id="transfer-pickup" 
                v-model="transferSearchState.from" 
              />
            </div>
            
            <!-- To -->
            <div class="flex-1 relative border-b md:border-b-0 md:border-r border-gray-100">
              <LocationPicker 
                label="Drop-off Location"  
                placeholder="Where are you going?"
                id="transfer-dropoff" 
                v-model="transferSearchState.to" 
              />
            </div>

            <!-- Date -->
            <div class="flex-1 border-b md:border-b-0 border-gray-100">
              <FlightDateRangePicker
                :departure="transferSearchState.date"
                mode="oneway"
                @update:departure="(v: string) => transferSearchState.date = v"
              />
            </div>
          </div>

         <div class="flex items-center justify-between pt-6 border-t border-gray-50">
           <div class="flex items-center gap-6">
             <div class="flex -space-x-2">
               <div v-for="i in 3" :key="i" class="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                 <img :src="`https://i.pravatar.cc/100?img=${i+10}`" class="w-full h-full object-cover" />
               </div>
             </div>
             <p class="text-[10px] font-black text-brand-blue uppercase tracking-widest">Highly rated by 50,000+ travelers</p>
           </div>
         </div>
       </div>
 
       <!-- Activities (Things to Do) Panel -->
       <div v-if="currentTab === 'Activities'" class="space-y-8">
         <div class="flex items-center justify-between">
           <div class="space-y-2">
             <h3 class="text-3xl font-black text-brand-blue tracking-tighter">Things to Do</h3>
             <p class="text-brand-gray/60 font-bold text-sm">Curated experiences, tours, and attraction tickets.</p>
           </div>
           <div class="hidden sm:flex items-center gap-3 px-6 py-2 bg-brand-green/10 rounded-full border border-brand-green/20">
             <SunIcon class="h-4 w-4 text-brand-green" />
             <span class="text-[10px] font-black text-brand-green uppercase tracking-widest">Global Coverage</span>
           </div>
         </div>
 
         <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
           <div class="md:col-span-5">
             <LocationPicker label="Location" id="activity-location" v-model="activitySearchState.location" />
           </div>
            <div class="md:col-span-4 grid grid-cols-2 gap-4">
              <UiAnimatedInput v-model="activitySearchState.fromDate" type="date" label="From" class="!py-0" />
              <UiAnimatedInput v-model="activitySearchState.toDate" type="date" label="To"  class="!py-0" />
            </div>
            <div class="md:col-span-3">
              <!-- Grid placeholder after button removal -->
            </div>
         </div>
 
         <div class="flex flex-wrap gap-3 pt-6 border-t border-gray-50">
            <button v-for="cat in ['Tours', 'Attractions', 'Day Trips', 'Water Sports', 'Food & Drink']" :key="cat" class="px-5 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 text-xs font-bold text-brand-blue hover:bg-brand-blue hover:text-white transition-all">{{ cat }}</button>
         </div>
       </div>
      
      <!-- Bottom Footer Disclaimer (mockup style) -->
      <div v-if="!isSticky" class="border-t border-gray-50/50 py-3 bg-gray-50/30 rounded-b-[2.5rem] flex items-center justify-center">
         <span class="text-[11px] font-bold text-brand-blue/60">
           {{ currentTab }} prices now shown with fees included.
         </span>
      </div>
    </div>

    <!-- Central Search Button (Priceline Style: Wide Blue) -->
    <div 
      class="absolute left-1/2 -translate-x-1/2 -bottom-7 z-20 transition-all duration-500"
      :class="[isSticky ? 'scale-90 -bottom-5' : 'scale-100 -bottom-7']"
    >
      <button 
        @click="handleSearch"
        class="bg-[#006CE4] hover:bg-[#0057b7] text-white px-20 py-4.5 rounded-full font-black text-lg shadow-[0_15px_40px_-10px_rgba(0,108,228,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(0,108,228,0.6)] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-4"
      >
        <span>Find your {{ currentTab === 'Hotels' ? 'Hotel' : currentTab.endsWith('s') ? currentTab.slice(0, -1) : currentTab }}</span>
        <ArrowRightIcon class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMarketInsights } from '@/composables/modules/market-insights/useMarketInsights'
import { 
  HomeIcon, 
  PaperAirplaneIcon, 
  TruckIcon, 
  GiftIcon, 
  LifebuoyIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  TicketIcon,
  SunIcon,
  HomeModernIcon as HotelIcon,
  KeyIcon as CarIcon,
  CursorArrowRaysIcon as CruiseIcon,
  ChevronDownIcon, 
  UserGroupIcon, 
  UserIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isSticky: {
    type: Boolean,
    default: false
  }
})

const { tripPurpose, fetchTripPurpose } = useMarketInsights()
const emit = defineEmits(['update:tab', 'focus-change'])

const isFocused = ref(false)
watch(isFocused, (val) => {
  emit('focus-change', val)
})

const getPackageKey = (value: string) => value.replace(/\+/g, '_')

const tabs = [
  { name: 'Hotels', icon: HotelIcon, badge: null },
  { name: 'Flights', icon: PaperAirplaneIcon, badge: null },
  { name: 'Cars', icon: CarIcon, badge: null },
  { name: 'Cruises', icon: CruiseIcon, badge: null },
  { name: 'Activities', icon: TicketIcon, badge: null },
  { name: 'Transfers', icon: TruckIcon, badge: null },
]

const currentTab = ref('Flights')
const stayMode   = ref('single')

const occupancy = reactive({
  rooms:    1,
  adults:   2,
  children: 0
})

const searchState = reactive({
  location:  '',
  latitude:  null as number | null,
  longitude: null as number | null,
  checkIn:   new Date().toISOString().split('T')[0],
  checkOut:  new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
})

const handleLocationSelect = (loc: any) => {
  searchState.longitude = loc.longitude
  searchState.latitude  = loc.latitude
}

const multiHotels = ref([
  { location: '', dates: { start: null, end: null } }
])

const bundles = reactive({
  bundleFlight:        false,
  bundleCar:           false,
  bundleFlightAddStay: false,
  bundleFlightAddCar:  false,
  bundleCarHotel:      false,
  bundleCarFlight:     false
})

const occupancySummary = computed(() => {
  return `${occupancy.rooms} Room${occupancy.rooms > 1 ? 's' : ''}, ${occupancy.adults + occupancy.children} Traveler${(occupancy.adults + occupancy.children) > 1 ? 's' : ''}`
})

// Flight State
const flightMode         = ref('roundtrip')
const flightTravelers    = reactive({
  adults:        1,
  children:      0,
  infantsOnLap:  0,
  infantsInSeat: 0
})

const totalFlightTravelers = computed(() => {
  return flightTravelers.adults + flightTravelers.children + flightTravelers.infantsOnLap + flightTravelers.infantsInSeat
})

const flightSearchState = reactive({
  origin:        '',
  originLat:     null as number | null,
  originLng:     null as number | null,
  destination:   '',
  destLat:       null as number | null,
  destLng:       null as number | null,
  departureDate: new Date().toISOString().split('T')[0],
  returnDate:    new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
  cabinClass:    'Economy',
  flexibleDates: false
})

const handleFlightOriginSelect = (loc: any) => {
  flightSearchState.originLat = loc.latitude
  flightSearchState.originLng = loc.longitude
  flightSearchState.origin    = loc.iataCode 
}

const handleFlightDestSelect = (loc: any) => {
  flightSearchState.destLat     = loc.latitude
  flightSearchState.destLng     = loc.longitude
  flightSearchState.destination = loc.iataCode 
}

// Watch for trip purpose prediction
watch([
  () => flightSearchState.origin,
  () => flightSearchState.destination,
  () => flightSearchState.departureDate,
  () => flightSearchState.returnDate
], ([origin, dest, dep, ret]) => {
  if (origin && dest && dep && (flightMode.value === 'oneway' || ret)) {
    const originStr = origin as string
    const destStr   = dest   as string
    const depStr    = dep    as string
    const retStr    = ret    as string | undefined
    
    // Only call if we have codes (3 letters usually)
    const originCode = originStr.match(/[A-Z]{3}/)?.[0] || originStr
    const destCode   = destStr.match(/[A-Z]{3}/)?.[0]   || destStr
    
    if (originCode.length === 3 && destCode.length === 3) {
      fetchTripPurpose({
        originLocationCode:      originCode,
        destinationLocationCode: destCode,
        departureDate:           depStr,
        returnDate:              retStr || depStr
      })
    }
  }
})

const multiFlightLegs = ref([
  { origin: '', destination: '', departureDate: new Date().toISOString().split('T')[0], returnDate: '', cabinClass: 'Economy' },
  { origin: '', destination: '', departureDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], returnDate: '', cabinClass: 'Economy' }
])

const handleMultiFlightOriginSelect = (loc: any, index: number) => {
  if (multiFlightLegs.value[index]) {
    multiFlightLegs.value[index]!.origin = loc.iataCode;
  }
}
const handleMultiFlightDestSelect = (loc: any, index: number) => {
  if (multiFlightLegs.value[index]) {
    multiFlightLegs.value[index]!.destination = loc.iataCode;
  }
}

const swapFlightLocations = (index?: number) => {
  if (index !== undefined && flightMode.value === 'multicity' && multiFlightLegs.value[index]) {
    const temp = multiFlightLegs.value[index]!.origin;
    multiFlightLegs.value[index]!.origin = multiFlightLegs.value[index]!.destination;
    multiFlightLegs.value[index]!.destination = temp;
  } else {
    const temp = flightSearchState.origin;
    flightSearchState.origin = flightSearchState.destination;
    flightSearchState.destination = temp;
  }
}

const flightTravelersSummary = computed(() => {
  const total = totalFlightTravelers.value
  return `${total} traveler${total > 1 ? 's' : ''}, ${flightSearchState.cabinClass}`
})

// Car State
const carMode          = ref('pickup')
const carPassengers    = ref(1)
const carSearchState = reactive({
  origin:      '',
  destination: '',
  pickUpDate:  new Date().toISOString().split('T')[0],
  pickUpTime:  '10:00'
})

// Cruise State
const cruiseSearchState = reactive({
  destination:    '',
  departureMonth: '',
  cruiseLine:     'Any'
})

// Package State
const packageType         = ref('hotel+flight')
const onlyPartialHotel    = ref(false)
const differentCarDropoff = ref(false)
const packageOccupancy    = reactive({
  rooms:    1,
  adults:   2,
  children: 0
})
const packageSearchState = reactive({
  origin:        '',
  destination:   '',
  departureDate: new Date().toISOString().split('T')[0],
  returnDate:    new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
})

// Transfer State
const transferSearchState = reactive({
  from: '',
  to:   '',
  date: new Date().toISOString().split('T')[0]
})

// Activity State
const activitySearchState = reactive({
  location: '',
  fromDate: new Date().toISOString().split('T')[0],
  toDate:   new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]
})

const addFlightLeg = () => {
  if (multiFlightLegs.value.length < 5) {
    multiFlightLegs.value.push({ origin: '', destination: '', departureDate: new Date().toISOString().split('T')[0], returnDate: '', cabinClass: 'Economy' })
  }
}

const removeFlightLeg = (index: number) => {
  multiFlightLegs.value.splice(index, 1)
}

const handleSearch = () => {
    isFocused.value = false
    console.log('Searching for:', currentTab.value, searchState)

    if (currentTab.value === 'Flights') {
        if (flightMode.value === 'multicity') {
            const query = {
                legs: JSON.stringify(multiFlightLegs.value.map(leg => ({
                    origin:        leg.origin,
                    destination:   leg.destination,
                    departureDate: leg.departureDate
                }))),
                passengers: totalFlightTravelers.value,
                cabinClass: multiFlightLegs.value[0]?.cabinClass || 'Economy'
            }
            navigateTo({ path: '/flights/multi', query })
            return
        }

        const query: any = {
            origin:        flightSearchState.origin,
            destination:   flightSearchState.destination,
            departureDate: flightSearchState.departureDate,
            passengers:    totalFlightTravelers.value,
            cabinClass:    flightSearchState.cabinClass,
            originLat:     flightSearchState.originLat,
            originLng:     flightSearchState.originLng,
            destLat:       flightSearchState.destLat,
            destLng:       flightSearchState.destLng
        }
        if (flightMode.value === 'roundtrip' && flightSearchState.returnDate) {
            query.returnDate = flightSearchState.returnDate
        }
        navigateTo({ path: '/flights', query })
    } else if (currentTab.value === 'Hotels') {
        const query: any = {
            location: searchState.location,
            lat:      searchState.latitude,
            lng:      searchState.longitude,
            checkIn:  searchState.checkIn,
            checkOut: searchState.checkOut,
            guests:   occupancy.adults + occupancy.children
        }
        navigateTo({ path: '/stays', query })
    } else if (currentTab.value === 'Transfers') {
        const query = {
            from: transferSearchState.from,
            to:   transferSearchState.to,
            date: transferSearchState.date
        }
        navigateTo({ path: '/transfers', query })
    } else if (currentTab.value === 'Activities') {
        const query = {
            location: activitySearchState.location,
            fromDate: activitySearchState.fromDate,
            toDate:   activitySearchState.toDate
        }
        navigateTo({ path: '/things-to-do', query })
    } else {
        alert('Search for ' + currentTab.value + ' is coming soon!')
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(13, 29, 173, 0.1);
  border-radius: 10px;
}

.calendar-pop-enter-active,
.calendar-pop-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.calendar-pop-enter-from,
.calendar-pop-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.animate-bounce-subtle {
  animation: bounce-subtle 3s infinite;
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -4px);
  }
}
</style>
