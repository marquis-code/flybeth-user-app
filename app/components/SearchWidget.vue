<template>
  <div class="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-10 border border-gray-50">
    <!-- Tabs -->
    <div class="mb-10">
      <nav class="flex flex-wrap gap-3 sm:gap-6" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="currentTab = tab.name"
          :class="[
            currentTab === tab.name
              ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20 scale-105'
              : 'bg-gray-50 text-brand-gray/60 hover:bg-brand-blue/5 hover:text-brand-blue hover:scale-105',
            'group flex items-center gap-3 py-3.5 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 transform'
          ]"
        >
          <component :is="tab.icon" class="h-4 w-4" aria-hidden="true" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Panels -->
    <div class="mt-8 font-body">
      <!-- Stays Panel -->
      <div v-if="currentTab === 'Stays'" class="space-y-8">
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

        <!-- Single Hotel Layout -->
        <div v-if="stayMode === 'single'" class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="md:col-span-2">
            <UiBaseInput label="Where to?" placeholder="Lake Buena Vista, FL" id="location" v-model="searchState.location" />
          </div>
          <div>
            <UiCustomDatePicker 
              v-model="searchState.dates" 
              mode="range" 
              label="Check-in - Check-out"
            />
          </div>
          <div class="relative">
            <label class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black mb-2 px-1 opacity-70 font-header block">Travelers & Rooms</label>
            <button 
              @click="showOccupancy = !showOccupancy" 
              class="w-full flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500 group"
              :class="{ 'ring-4 ring-brand-blue/5 border-brand-blue shadow-xl': showOccupancy }"
            >
              <div class="flex items-center gap-4">
                <div class="p-2.5 border border-brand-blue/10 rounded-xl bg-brand-blue/5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                  <ChevronDownIcon class="h-4 w-4" :class="showOccupancy ? 'text-white' : 'text-brand-blue'" />
                </div>
                <span class="text-sm font-bold text-brand-blue tracking-tight">{{ occupancySummary }}</span>
              </div>
            </button>
            
            <div v-if="showOccupancy" class="absolute z-50 mt-4 w-80 bg-white rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(13,29,173,0.2)] border border-gray-50 p-8 space-y-6">
              <div v-for="type in ['Rooms', 'Adults', 'Children']" :key="type" class="flex items-center justify-between">
                <span class="text-sm font-bold text-brand-blue">{{ type }}</span>
                <div class="flex items-center space-x-4">
                  <button @click="updateOccupancy(type, -1)" class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-brand-gray hover:bg-brand-blue hover:text-white transition-all">-</button>
                  <span class="text-sm font-black w-4 text-center text-brand-blue">{{ occupancy[type.toLowerCase()] }}</span>
                  <button @click="updateOccupancy(type, 1)" class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-brand-gray hover:bg-brand-blue hover:text-white transition-all">+</button>
                </div>
              </div>
              <UiBaseButton block variant="green" @click="showOccupancy = false">Apply</UiBaseButton>
            </div>
          </div>
        </div>

        <!-- Multi Hotel Layout -->
        <div v-else class="space-y-6">
          <div v-for="(hotel, index) in multiHotels" :key="index" class="p-8 bg-gray-50/30 rounded-[2rem] border border-gray-50 space-y-6 relative group">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-brand-gray/40 uppercase tracking-[0.2em]">Hotel {{ index + 1 }}</span>
              <button v-if="index > 0" @click="removeHotel(index)" class="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors">Remove</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UiBaseInput label="Where to?" placeholder="City or Property" :id="'hotel-loc-' + index" v-model="hotel.location" />
              <UiCustomDatePicker 
                v-model="hotel.dates" 
                mode="range" 
                label="Check-in - Check-out"
              />
            </div>
          </div>
          <button v-if="multiHotels.length < 5" @click="addHotel" class="px-6 py-3 rounded-full border-2 border-dashed border-brand-blue/20 text-brand-blue text-xs font-black uppercase tracking-widest hover:border-brand-blue hover:bg-brand-blue/5 transition-all text-center w-full block">
            + Add Another Hotel
          </button>
        </div>

        <!-- Bundle Options -->
        <div class="flex flex-wrap items-center gap-6 pt-2">
            <div class="flex items-center px-6 py-3 bg-brand-green/5 border border-brand-green/10 rounded-2xl">
              <span class="text-[10px] font-black text-brand-green uppercase tracking-widest mr-6 opacity-70">Bundle + Save</span>
              <div class="flex flex-wrap items-center gap-6">
                <label v-for="opt in [{label: 'Add a flight', model: 'bundleFlight'}, {label: 'Add a car', model: 'bundleCar'}]" :key="opt.label" class="flex items-center text-xs font-bold text-brand-blue cursor-pointer group">
                  <div class="relative flex items-center mr-3">
                    <input type="checkbox" v-model="bundles[opt.model]" class="sr-only" />
                    <div 
                      class="w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center"
                      :class="bundles[opt.model] ? 'bg-brand-green border-brand-green' : 'border-gray-200 group-hover:border-brand-green/50'"
                    >
                      <svg v-if="bundles[opt.model]" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {{ opt.label }}
                </label>
              </div>
            </div>
        </div>

        <div class="flex justify-end pt-4">
          <UiBaseButton variant="primary" size="lg" class="px-16" @click="handleSearch">
            Find Your Hotel{{ stayMode === 'multi' ? 's' : '' }}
          </UiBaseButton>
        </div>
      </div>

       <!-- Flights Panel -->
      <div v-if="currentTab === 'Flights'" class="space-y-8">
        <!-- Flight Mode Toggle -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
           <div class="flex items-center space-x-8">
             <button 
              v-for="mode in ['roundtrip', 'oneway', 'multicity']" 
              :key="mode"
              @click="flightMode = mode" 
              :class="[flightMode === mode ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-brand-gray/40', 'pb-2 text-xs font-black uppercase tracking-widest transition-all']"
             >
                {{ mode.replace('-', ' ') }}
             </button>
           </div>

           <!-- Multi-Traveler Summary -->
           <button @click="showFlightTravelers = !showFlightTravelers" class="text-xs font-black text-brand-blue uppercase tracking-widest flex items-center group">
              <span class="pb-1 border-b-2 border-brand-blue/10 group-hover:border-brand-blue transition-all">{{ flightTravelersSummary }}</span>
              <ChevronDownIcon class="ml-2 h-4 w-4" />
           </button>
        </div>

        <!-- Roundtrip / One-way Grid -->
        <div v-if="flightMode !== 'multicity'" class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div class="md:col-span-4 relative">
             <UiBaseInput label="Leaving from" placeholder="Lagos (LOS)" id="origin" v-model="flightSearchState.origin" @input="searchAirports($event.target.value, -1, 'origin'); showOriginResults = true" />
             <div v-if="showOriginResults && activeLegIndex === -1 && airportResults.length" class="absolute z-50 mt-3 w-full bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(13,29,173,0.15)] border border-gray-50 p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                <div v-for="airport in airportResults" :key="airport.code" @click="selectOrigin(airport)" class="group p-4 hover:bg-brand-blue/5 rounded-2xl cursor-pointer flex items-center space-x-4 transition-all duration-300">
                  <div class="h-10 w-10 rounded-xl bg-brand-blue/5 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <PaperAirplaneIcon class="h-5 w-5 text-brand-blue rotate-45" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-brand-blue">{{ airport.city }} <span class="text-xs text-brand-blue/40 font-mono">[{{ airport.code }}]</span></p>
                    <p class="text-[10px] text-brand-gray/40 font-bold uppercase tracking-widest">{{ airport.name }}</p>
                  </div>
                </div>
             </div>
          </div>

          <div class="md:col-span-4 relative">
             <UiBaseInput label="Going to" placeholder="City or airport" id="destination" v-model="flightSearchState.destination" @input="searchAirports($event.target.value, -1, 'destination'); showDestResults = true" />
             <div v-if="showDestResults && activeLegIndex === -1 && airportResults.length" class="absolute z-50 mt-3 w-full bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(13,29,173,0.15)] border border-gray-50 p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                <div v-for="airport in airportResults" :key="airport.code" @click="selectDestination(airport)" class="group p-4 hover:bg-brand-blue/5 rounded-2xl cursor-pointer flex items-center space-x-4 transition-all duration-300">
                  <div class="h-10 w-10 rounded-xl bg-brand-blue/5 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <PaperAirplaneIcon class="h-5 w-5 text-brand-blue rotate-45" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-brand-blue">{{ airport.city }} <span class="text-xs text-brand-blue/40 font-mono">[{{ airport.code }}]</span></p>
                    <p class="text-[10px] text-brand-gray/40 font-bold uppercase tracking-widest">{{ airport.name }}</p>
                  </div>
                </div>
             </div>
          </div>

          <div class="md:col-span-4">
             <UiCustomDatePicker 
              v-model="flightSearchState.dates" 
              :mode="flightMode === 'roundtrip' ? 'range' : 'single'" 
              :label="flightMode === 'roundtrip' ? 'Departure - Return' : 'Departure Date'"
            />
          </div>
        </div>

        <!-- Multi-city Layout -->
        <div v-else class="space-y-6">
           <div v-for="(leg, index) in multiFlightLegs" :key="index" class="p-8 bg-gray-50/30 rounded-[2rem] border border-gray-50 relative group">
              <div v-if="index > 1" class="absolute -top-3 -right-3">
                <button @click="removeFlightLeg(index)" class="h-10 w-10 rounded-full bg-white border border-gray-100 text-red-500 flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all transform active:scale-95 text-lg">×</button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div class="md:col-span-4 relative">
                   <UiBaseInput :label="'Flight ' + (index + 1) + ' origin'" placeholder="Origin" :id="'leg-origin-' + index" v-model="leg.origin" @input="searchAirports($event.target.value, index, 'origin'); showOriginResults = true" />
                </div>
                <div class="md:col-span-4 relative">
                   <UiBaseInput label="Destination" placeholder="Destination" :id="'leg-dest-' + index" v-model="leg.destination" @input="searchAirports($event.target.value, index, 'destination'); showDestResults = true" />
                </div>
                <div class="md:col-span-4">
                   <UiCustomDatePicker v-model="leg.date" mode="single" label="Departure Date" />
                </div>
              </div>
           </div>
           
           <button v-if="multiFlightLegs.length < 5" @click="addFlightLeg" class="px-6 py-4 rounded-full border-2 border-dashed border-brand-blue/20 text-brand-blue text-xs font-black uppercase tracking-widest hover:border-brand-blue hover:bg-brand-blue/5 transition-all text-center w-full block">
             + Add another flight
           </button>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-10 pt-8 border-t border-gray-50">
          <!-- Traveler Popover Overlay (Common for all flight modes) -->
          <Transition name="calendar-pop">
            <div v-if="showFlightTravelers" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-blue/10 backdrop-blur-sm">
               <div class="w-full max-w-md bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(13,29,173,0.3)] border border-gray-50 p-10 space-y-10">
                  <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-black text-brand-blue font-header tracking-tighter">Travelers</h3>
                    <button @click="showFlightTravelers = false" class="h-10 w-10 rounded-full bg-gray-50 text-brand-gray hover:text-brand-blue transition-colors text-2xl font-black flex items-center justify-center">×</button>
                  </div>
                  
                  <div class="space-y-8 px-2">
                     <div v-for="type in [
                       { name: 'Adults', key: 'adults', desc: '18+' },
                       { name: 'Children', key: 'children', desc: 'Ages 2 to 17' },
                       { name: 'Infants on lap', key: 'infantsOnLap', desc: 'Under 2' },
                       { name: 'Infants in seat', key: 'infantsInSeat', desc: 'Under 2' }
                     ]" :key="type.key" class="flex items-center justify-between">
                       <div>
                         <p class="text-base font-black text-brand-blue tracking-tight">{{ type.name }}</p>
                         <p class="text-[10px] text-brand-gray/40 font-bold uppercase tracking-widest">{{ type.desc }}</p>
                       </div>
                       <div class="flex items-center space-x-5">
                         <button @click="updateFlightTravelers(type.key, -1)" class="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-brand-gray hover:bg-brand-blue hover:text-white transition-all transform active:scale-90">-</button>
                         <span class="text-xl font-black w-8 text-center text-brand-blue">{{ flightTravelers[type.key] }}</span>
                         <button @click="updateFlightTravelers(type.key, 1)" class="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-brand-gray hover:bg-brand-blue hover:text-white transition-all transform active:scale-90">+</button>
                       </div>
                     </div>
                  </div>

                  <div class="pt-8 border-t border-gray-50">
                     <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-widest mb-6 px-1">Cabin Class</p>
                     <div class="grid grid-cols-2 gap-4">
                       <button v-for="cls in ['Economy', 'Premium Economy', 'Business', 'First']" :key="cls" 
                         @click="flightSearchState.cabinClass = cls"
                         :class="[flightSearchState.cabinClass === cls ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30 scale-105' : 'bg-gray-50 text-brand-gray/60 hover:bg-gray-50 hover:text-brand-blue', 'py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all']">
                         {{ cls }}
                       </button>
                     </div>
                  </div>

                  <UiBaseButton block variant="green" size="lg" @click="showFlightTravelers = false">Done selecting</UiBaseButton>
               </div>
            </div>
          </Transition>

          <!-- Add-ons -->
          <div class="flex flex-wrap items-center gap-10">
             <label v-for="addon in [{label: 'Add a place to stay', model: 'bundleFlightAddStay'}, {label: 'Add a car', model: 'bundleFlightAddCar'}]" :key="addon.label" class="flex items-center text-xs font-black uppercase tracking-widest text-brand-blue cursor-pointer group">
               <div class="relative flex items-center mr-4">
                 <input type="checkbox" v-model="bundles[addon.model]" class="sr-only" />
                 <div 
                   class="w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center"
                   :class="bundles[addon.model] ? 'bg-brand-green border-brand-green shadow-lg shadow-brand-green/20' : 'border-gray-200 group-hover:border-brand-green/50'"
                 >
                   <svg v-if="bundles[addon.model]" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                   </svg>
                 </div>
               </div>
               {{ addon.label }}
             </label>
          </div>

          <UiBaseButton variant="primary" size="lg" class="px-16" @click="handleSearch">Search Flights</UiBaseButton>
        </div>
      </div>

      <!-- Cars Panel -->
       <div v-if="currentTab === 'Cars'" class="space-y-8">
          <!-- Car Mode Toggle -->
          <div class="flex items-center space-x-10 pb-2">
             <button v-for="mode in [{label: 'Rental cars', value: 'rental'}, {label: 'Airport rides', value: 'rides'}]" :key="mode.value" @click="carMode = mode.value" :class="[carMode === mode.value ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-brand-gray/40', 'pb-2 text-xs font-black uppercase tracking-widest transition-all']">{{ mode.label }}</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
             <div :class="[carMode === 'rental' ? 'md:col-span-4' : 'md:col-span-3']">
                <UiBaseInput :label="carMode === 'rental' ? 'Pick-up' : 'Where from'" :placeholder="carMode === 'rental' ? 'City or airport' : 'Address or hotel'" id="car-origin" v-model="carSearchState.origin" />
             </div>

             <div v-if="carMode === 'rides' || showDifferentDropOff" class="md:col-span-3">
                <UiBaseInput label="Where to" placeholder="Drop-off location" id="car-destination" v-model="carSearchState.destination" />
             </div>

             <div :class="[carMode === 'rental' ? 'md:col-span-4' : 'md:col-span-3']">
                <UiCustomDatePicker 
                  v-model="carSearchState.dates" 
                  :mode="carMode === 'rental' ? 'range' : 'single'" 
                  :label="carMode === 'rental' ? 'Rental Dates' : 'Pick-up date'" 
                />
             </div>

             <div class="md:col-span-4">
                <UiBaseTimePicker label="Pick-up Time" v-model="carSearchState.pickUpTime" />
             </div>
          </div>

          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-10 pt-4 border-t border-gray-50">
             <div class="flex items-center gap-10">
                <label v-if="carMode === 'rental'" class="flex items-center text-xs font-black uppercase tracking-widest text-brand-blue cursor-pointer group">
                  <div class="relative flex items-center mr-4">
                    <input type="checkbox" v-model="showDifferentDropOff" class="sr-only" />
                    <div 
                      class="w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center"
                      :class="showDifferentDropOff ? 'bg-brand-blue border-brand-blue shadow-lg shadow-brand-blue/20' : 'border-gray-200 group-hover:border-brand-blue/50'"
                    >
                      <svg v-if="showDifferentDropOff" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  Different drop-off location
                </label>

                <div class="flex items-center px-6 py-3 bg-brand-green/5 border border-brand-green/10 rounded-2xl">
                   <span class="text-[10px] font-black text-brand-green uppercase tracking-widest mr-6 opacity-60">Bundle</span>
                   <label v-for="addon in [{label: 'Hotel', model: 'bundleCarHotel'}, {label: 'Flight', model: 'bundleCarFlight'}]" :key="addon.label" class="flex items-center text-xs font-bold text-brand-blue cursor-pointer group mr-6 last:mr-0">
                     <div class="relative flex items-center mr-3">
                       <input type="checkbox" v-model="bundles[addon.model]" class="sr-only" />
                       <div 
                         class="w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center"
                         :class="bundles[addon.model] ? 'bg-brand-green border-brand-green' : 'border-gray-200 group-hover:border-brand-green/50'"
                       >
                         <svg v-if="bundles[addon.model]" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                           <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                         </svg>
                       </div>
                     </div>
                     {{ addon.label }}
                   </label>
                </div>
             </div>
             
             <UiBaseButton variant="primary" size="lg" class="px-16" @click="handleSearch">Search Cars</UiBaseButton>
          </div>
       </div>

       <!-- Packages Panel -->
       <div v-if="currentTab === 'Packages'" class="space-y-8">
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
              <span class="text-xs font-black uppercase tracking-widest text-brand-gray transition-colors" :class="packageType === type.value ? 'text-brand-blue' : 'opacity-60 group-hover:opacity-100'">{{ type.label }}</span>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div v-if="packageType !== 'hotel+car'" class="md:col-span-4 relative">
              <UiBaseInput label="Where from?" placeholder="City or airport" id="package-origin" v-model="packageSearchState.origin" />
            </div>
            
            <div :class="[packageType === 'hotel+car' ? 'md:col-span-12 lg:col-span-8' : 'md:col-span-8 lg:col-span-4']">
              <UiBaseInput label="Where to?" placeholder="Destination" id="package-destination" v-model="packageSearchState.destination" />
            </div>

            <div class="md:col-span-6 lg:col-span-4">
              <UiCustomDatePicker 
                v-model="packageSearchState.dates" 
                mode="range" 
                :label="packageType.includes('hotel') ? 'Stay Dates' : 'Travel Dates'" 
              />
            </div>

            <div class="md:col-span-6 lg:col-span-4 relative">
               <label class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black mb-2 px-1 opacity-70 font-header block">Travelers & Rooms</label>
               <button 
                @click="showPackageOccupancy = !showPackageOccupancy" 
                class="w-full flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500 group"
                :class="{ 'ring-4 ring-brand-blue/5 border-brand-blue shadow-xl': showPackageOccupancy }"
              >
                <div class="flex items-center gap-4">
                  <div class="p-2.5 border border-brand-blue/10 rounded-xl bg-brand-blue/5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                    <ChevronDownIcon class="h-4 w-4" :class="showPackageOccupancy ? 'text-white' : 'text-brand-blue'" />
                  </div>
                  <span class="text-sm font-bold text-brand-blue tracking-tight">{{ packageOccupancySummary }}</span>
                </div>
              </button>
              
              <div v-if="showPackageOccupancy" class="absolute z-50 mt-4 w-80 bg-white rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(13,29,173,0.2)] border border-gray-50 p-8 space-y-6">
                <div v-for="type in ['Rooms', 'Adults', 'Children']" :key="type" class="flex items-center justify-between">
                  <span class="text-sm font-bold text-brand-blue">{{ type }}</span>
                  <div class="flex items-center space-x-4">
                    <button @click="updatePackageOccupancy(type, -1)" class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-brand-gray hover:bg-brand-blue hover:text-white transition-all">-</button>
                    <span class="text-sm font-black w-4 text-center text-brand-blue">{{ packageOccupancy[type.toLowerCase()] }}</span>
                    <button @click="updatePackageOccupancy(type, 1)" class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-brand-gray hover:bg-brand-blue hover:text-white transition-all">+</button>
                  </div>
                </div>
                <p class="text-[10px] text-brand-gray/40 italic leading-relaxed">Optimization: Multi-room packages are currently limited to 8 travelers total.</p>
                <UiBaseButton block variant="green" @click="showPackageOccupancy = false">Apply</UiBaseButton>
              </div>
            </div>

            <div class="md:col-span-12 lg:col-span-4">
              <UiBaseButton variant="primary" size="lg" block @click="handleSearch">Find Your Trip</UiBaseButton>
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
            <p class="text-3xl font-black text-brand-blue font-header tracking-tighter">Set Sail on Luxury.</p>
            <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-widest border border-gray-100 rounded-full px-6 py-2">Expert Advice: 1-866-403-9848</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div class="md:col-span-4 relative">
              <UiBaseSelect 
                label="Going to" 
                placeholder="Destination (Any)" 
                v-model="cruiseSearchState.destination"
                :options="[
                  {label: 'Alaska', value: 'Alaska'},
                  {label: 'Bahamas', value: 'Bahamas'},
                  {label: 'Caribbean', value: 'Caribbean'},
                  {label: 'Europe', value: 'Europe'},
                  {label: 'Mexico', value: 'Mexico'},
                  {label: 'Africa', value: 'Africa'}
                ]"
                :icon="LifebuoyIcon"
              />
            </div>

            <div class="md:col-span-4 relative">
              <UiBaseSelect 
                label="Departing between" 
                placeholder="Select Month" 
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

            <div class="md:col-span-4">
               <UiBaseSelect 
                  label="Cruise Line" 
                  placeholder="Any Cruise Line" 
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
             
             <UiBaseButton variant="primary" size="lg" class="px-20 shadow-2xl" @click="handleSearch">Search Cruises</UiBaseButton>
          </div>
       </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, PaperAirplaneIcon, TruckIcon, GiftIcon, CalendarIcon, LifebuoyIcon, ChevronDownIcon, PlusIcon } from '@heroicons/vue/24/outline'

const tabs = [
  { name: 'Stays', icon: HomeIcon },
  { name: 'Flights', icon: PaperAirplaneIcon },
  { name: 'Cars', icon: TruckIcon },
  { name: 'Packages', icon: GiftIcon },
  { name: 'Cruises', icon: LifebuoyIcon },
]

const currentTab = ref('Stays')
const stayMode = ref('single')
const showOccupancy = ref(false)

const occupancy = reactive({
  rooms: 1,
  adults: 2,
  children: 0
})

const searchState = reactive({
  location: '',
  dates: { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 7)) }
})

const multiHotels = ref([
  { location: '', dates: { start: null, end: null } }
])

const bundles = reactive({
  bundleFlight: false,
  bundleCar: false,
  bundleFlightAddStay: false,
  bundleFlightAddCar: false,
  bundleCarHotel: false,
  bundleCarFlight: false
})

const occupancySummary = computed(() => {
  return `${occupancy.rooms} Room${occupancy.rooms > 1 ? 's' : ''}, ${occupancy.adults + occupancy.children} Traveler${(occupancy.adults + occupancy.children) > 1 ? 's' : ''}`
})

const updateOccupancy = (type: string, change: number) => {
  const key = type.toLowerCase()
  const min = key === 'rooms' || key === 'adults' ? 1 : 0
  occupancy[key] = Math.max(min, occupancy[key] + change)
}

const addHotel = () => {
  if (multiHotels.value.length < 5) {
    multiHotels.value.push({ location: '', dates: { start: null, end: null } })
  }
}

const removeHotel = (index: number) => {
  multiHotels.value.splice(index, 1)
}

// Flight State
const flightMode = ref('roundtrip')
const showFlightTravelers = ref(false)
const flightSearchState = reactive({
  origin: '',
  destination: '',
  dates: { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 14)) },
  cabinClass: 'Economy'
})

const multiFlightLegs = ref([
  { origin: '', destination: '', date: null },
  { origin: '', destination: '', date: null }
])

const flightTravelers = reactive({
  adults: 1,
  children: 0,
  infantsOnLap: 0,
  infantsInSeat: 0
})

const flightTravelersSummary = computed(() => {
  const total = flightTravelers.adults + flightTravelers.children + flightTravelers.infantsOnLap + flightTravelers.infantsInSeat
  return `${total} traveler${total > 1 ? 's' : ''}, ${flightSearchState.cabinClass}`
})

const updateFlightTravelers = (type: string, change: number) => {
  const min = type === 'adults' ? 1 : 0
  flightTravelers[type] = Math.max(min, flightTravelers[type] + change)
}

// Car State
const carMode = ref('rental')
const showDifferentDropOff = ref(false)
const carSearchState = reactive({
  origin: '',
  destination: '',
  dates: { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 3)) },
  pickUpTime: 'Noon'
})

// Cruise State
const cruiseSearchState = reactive({
  destination: '',
  departureMonth: '',
  minNights: 3,
  maxNights: 9,
  cruiseLine: 'Any'
})

// Package State
const packageType = ref('hotel+flight')
const showPackageOccupancy = ref(false)
const onlyPartialHotel = ref(false)
const differentCarDropoff = ref(false)
const packageOccupancy = reactive({
  rooms: 1,
  adults: 2,
  children: 0
})
const packageSearchState = reactive({
  origin: '',
  destination: '',
  dates: { start: null, end: null }
})

const packageOccupancySummary = computed(() => {
  return `${packageOccupancy.rooms} Room${packageOccupancy.rooms > 1 ? 's' : ''}, ${packageOccupancy.adults + packageOccupancy.children} Traveler${(packageOccupancy.adults + packageOccupancy.children) > 1 ? 's' : ''}`
})

const updatePackageOccupancy = (type: string, change: number) => {
  const key = type.toLowerCase()
  const min = key === 'rooms' || key === 'adults' ? 1 : 0
  const max = 8 
  if (change > 0 && (packageOccupancy.adults + packageOccupancy.children) >= max && key !== 'rooms') return
  packageOccupancy[key] = Math.max(min, packageOccupancy[key] + change)
}

// Autocomplete State (Mocked for UI feel)
const airportResults = ref([
  { city: 'London', country: 'United Kingdom', code: 'LHR', name: 'Heathrow Airport' },
  { city: 'New York', country: 'USA', code: 'JFK', name: 'John F. Kennedy Intl' },
  { city: 'Nairobi', country: 'Kenya', code: 'NBO', name: 'Jomo Kenyatta Intl' }
])
const showOriginResults = ref(false)
const showDestResults = ref(false)
const activeLegIndex = ref(-1)
const activeLegField = ref('')

const searchAirports = (query: string, index = -1, field = '') => {
  activeLegIndex.value = index
  activeLegField.value = field
  // Mock results display
  if (query.length > 0) {
    showOriginResults.value = field === 'origin'
    showDestResults.value = field === 'destination'
  }
}

const selectOrigin = (airport: any) => {
  const value = `${airport.city} (${airport.code})`
  if (activeLegIndex.value === -1) {
    flightSearchState.origin = value
  } else {
    multiFlightLegs.value[activeLegIndex.value].origin = value
  }
  showOriginResults.value = false
}

const selectDestination = (airport: any) => {
  const value = `${airport.city} (${airport.code})`
  if (activeLegIndex.value === -1) {
    flightSearchState.destination = value
  } else {
    multiFlightLegs.value[activeLegIndex.value].destination = value
  }
  showDestResults.value = false
}

const addFlightLeg = () => {
  if (multiFlightLegs.value.length < 5) {
    multiFlightLegs.value.push({ origin: '', destination: '', date: null })
  }
}

const removeFlightLeg = (index: number) => {
  multiFlightLegs.value.splice(index, 1)
}

const handleSearch = () => {
    alert('Search initiated with premium UI parameters!')
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
</style>
