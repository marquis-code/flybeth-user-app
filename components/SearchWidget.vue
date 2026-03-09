<template>
  <div 
    class="bg-white/95 backdrop-blur-xl shadow-2xl shadow-brand-blue/10 border-b border-gray-100 font-body relative transition-all duration-700 ease-in-out"
    :class="[isSticky ? 'rounded-b-[2.5rem] border-x-0 border-t-0 py-1' : 'rounded-[2.5rem] border border-gray-100 py-0']"
  >
    <!-- Redesigned Tabs -->
    <div class="bg-white rounded-t-[2.5rem] border-b border-gray-100 overflow-x-auto no-scrollbar">
      <nav class="flex px-8 gap-1" aria-label="Tabs">
        <button
          v-for="tab in tabs.filter(t => t.name !== 'Activities')"
          :key="tab.name"
          @click="currentTab = tab.name"
          :class="[
            currentTab === tab.name
              ? 'text-brand-blue border-brand-blue'
              : 'text-brand-gray/60 hover:text-brand-blue border-transparent',
            'flex items-center gap-2 transition-all border-b-2 py-5 relative z-10 whitespace-nowrap px-4',
          ]"
        >
          <div 
            class="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
            :class="[currentTab === tab.name ? 'bg-brand-blue/10' : 'bg-transparent']"
          >
            <component :is="tab.icon" class="h-5 w-5" />
          </div>
          <span class="text-sm font-black tracking-tight">{{ tab.name }}</span>
        </button>
      </nav>
    </div>

    <!-- Backdrop Overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isFocused || activeCruiseField" class="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-[9998]" @click="isFocused = false; activeCruiseField = null"></div>
      </Transition>
    </Teleport>

    <!-- Content Area -->
    <div 
      class="bg-white transition-all duration-700 ease-in-out relative z-[10000]"
      :class="[isSticky ? 'p-2 md:p-4 !space-y-4' : 'p-6 md:p-8 space-y-8', isFocused ? '!rounded-b-[2.5rem]' : '']"
    >
       <!-- Stays (Hotels) Panel -->
       <div v-if="currentTab === 'Hotels'" class="space-y-6">
         <h3 class="text-xl font-black text-brand-blue mb-4 leading-tight opacity-90">{{ dynamicTitle }}</h3>
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
         <div v-if="stayMode === 'single'" class="space-y-6">
           <div 
             class="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible transition-all duration-300"
             :class="isFocused ? 'ring-4 ring-brand-blue/10 border-brand-blue' : ''"
           >
             <div class="flex-[1.5] relative border-b md:border-b-0 md:border-r border-gray-100">
               <LocationPicker 
                 v-model="searchState.location" 
                 label="Going to"
                 placeholder="Where are you going?"
                 @focus="isFocused = true"
                 @close="isFocused = false"
               />
             </div>
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
           <div class="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-gray-50">
             <div class="flex items-center gap-6">
               <div class="flex items-center bg-brand-green/5 px-4 py-2 rounded-xl border border-brand-green/10">
                 <span class="text-[10px] font-black text-brand-green uppercase tracking-widest mr-4">Bundle + Save</span>
                 <label class="flex items-center text-xs font-bold text-brand-blue cursor-pointer mr-4">
                   <input type="checkbox" v-model="bundles.bundleFlight" class="mr-2 custom-checkbox" />
                   Add a flight
                 </label>
                 <label class="flex items-center text-xs font-bold text-brand-blue cursor-pointer">
                   <input type="checkbox" v-model="bundles.bundleCar" class="mr-2 custom-checkbox" />
                   Add a car
                 </label>
               </div>
             </div>
             <button @click="handleSearch" class="w-full md:w-auto bg-brand-blue text-white px-10 py-3.5 rounded-full font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
               <span>Find Your Hotel</span>
               <ArrowRightIcon class="h-4 w-4" />
             </button>
           </div>
         </div>

        <!-- Multi Hotel Layout -->
        <div v-else class="space-y-6">
          <div v-for="(hotel, index) in multiHotelLegs" :key="index" class="space-y-2">
            <p class="text-[11px] font-black text-brand-blue uppercase tracking-widest">Hotel {{ index + 1 }}</p>
            <div class="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100">
                <LocationPicker v-model="hotel.location" label="Where to?" />
              </div>
              <div class="flex-1 border-b md:border-b-0 border-gray-100">
                <FlightDateRangePicker :departure="hotel.checkIn" :return="hotel.checkOut" mode="roundtrip" @update:departure="(v: string) => hotel.checkIn = v" @update:return="(v: string) => hotel.checkOut = v" />
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-gray-50">
            <button @click="addHotelLeg" v-if="multiHotelLegs.length < 5" class="bg-brand-blue/5 text-brand-blue px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all">Add Another Hotel</button>
            <button @click="handleSearch" class="bg-brand-blue text-white px-10 py-3.5 rounded-full font-black text-sm shadow-lg flex items-center justify-center gap-2">
              <span>Find Your Hotels</span>
              <ArrowRightIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Flights Panel -->
      <div v-if="currentTab === 'Flights'" class="space-y-4">
        <h3 class="text-xl font-black text-brand-blue mb-4 leading-tight opacity-90">{{ dynamicTitle }}</h3>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
           <div class="flex items-center space-x-6">
              <label v-for="mode in ['oneway', 'roundtrip', 'multicity']" :key="mode" class="flex items-center space-x-2 cursor-pointer group">
                <input type="radio" :value="mode" v-model="flightMode" class="sr-only" />
                <div class="w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center" :class="flightMode === mode ? 'border-brand-blue' : 'border-brand-blue/30'">
                   <div v-if="flightMode === mode" class="w-2 h-2 rounded-full bg-brand-blue"></div>
                </div>
                <span class="text-xs font-black capitalize" :class="flightMode === mode ? 'text-brand-blue' : 'text-brand-gray/60'">{{ mode.replace('multicity', 'Multi City').replace('oneway', 'One Way').replace('roundtrip', 'Round Trip') }}</span>
              </label>
           </div>
        </div>
        <div class="flex flex-col gap-4">
           <div 
             v-for="(leg, index) in flightMode === 'multicity' ? multiFlightLegs : [flightSearchState]" 
             :key="index"
             class="flex flex-col lg:flex-row w-full bg-white border border-gray-200 rounded-xl shadow-sm relative"
           >
              <div class="flex flex-col md:flex-row w-full lg:w-[60%]">
                <div class="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 p-1">
                   <LocationPicker v-model="leg.origin" label="From" />
                </div>
                <div class="w-full md:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 p-1 pl-4">
                   <LocationPicker v-model="leg.destination" label="To" />
                </div>
              </div>
              <div class="flex flex-col md:flex-row w-full lg:w-[40%]">
                <div class="flex-1 border-b md:border-b-0 border-gray-200">
                  <FlightDateRangePicker :mode="flightMode === 'multicity' ? 'oneway' : (flightMode as any)" v-model:departure="leg.departureDate" v-model:return="leg.returnDate" />
                </div>
                <div v-if="index === 0" class="w-full md:w-[120px]">
                  <Occupancypicker label="Paxs" variant="flight" v-model:adults="flightTravelers.adults" v-model:children="flightTravelers.children" />
                </div>
              </div>
           </div>
        </div>
        <div class="flex justify-end pt-4 border-t border-gray-50">
           <button @click="handleSearch" class="bg-brand-blue text-white px-12 py-3.5 rounded-full font-black text-sm shadow-lg flex items-center justify-center gap-2">
             <span>Find Your Flight</span>
             <ArrowRightIcon class="h-4 w-4" />
           </button>
        </div>
      </div>

      <!-- Packages Panel -->
      <div v-if="currentTab === 'Packages'" class="space-y-6">
        <h3 class="text-xl font-black text-brand-blue mb-4 leading-tight opacity-90">{{ dynamicTitle }}</h3>
        <div class="flex flex-wrap items-center gap-6 pb-2">
          <label 
            v-for="mode in [
              {label: 'Hotel + Flight', value: 'Hotel+Flight'}, 
              {label: 'Hotel + Flight + Car', value: 'Hotel+Flight+Car'},
              {label: 'Flight + Car', value: 'Flight+Car'},
              {label: 'Hotel + Car', value: 'Hotel+Car'}
            ]" 
            :key="mode.value"
            class="flex items-center space-x-2 cursor-pointer group"
          >
            <input type="radio" :value="mode.value" v-model="packageType" class="sr-only" />
            <div class="w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center" :class="packageType === mode.value ? 'border-brand-blue' : 'border-gray-200'">
              <div v-if="packageType === mode.value" class="w-2 h-2 rounded-full bg-brand-blue"></div>
            </div>
            <span class="text-[11px] font-bold" :class="packageType === mode.value ? 'text-brand-blue' : 'text-brand-gray/60'">{{ mode.label }}</span>
          </label>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[72px]">
            <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100">
               <LocationPicker v-model="packageSearchState.origin" label="From" />
            </div>
            <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100">
               <LocationPicker v-model="packageSearchState.destination" label="To" />
            </div>
            <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100">
               <FlightDateRangePicker :departure="packageSearchState.departureDate" :return="packageSearchState.returnDate" mode="roundtrip" @update:departure="(v) => packageSearchState.departureDate = v" @update:return="(v) => packageSearchState.returnDate = v" />
            </div>
            <div class="flex-1">
               <Occupancypicker v-model:rooms="packageOccupancy.rooms" v-model:adults="packageOccupancy.adults" />
            </div>
          </div>
          
          <div class="flex flex-wrap items-center gap-6 pt-2">
            <label v-if="packageType.toLowerCase().includes('hotel') && packageType.toLowerCase().includes('flight')" class="flex items-center text-xs font-bold text-brand-blue cursor-pointer">
              <input type="checkbox" v-model="onlyPartialHotel" class="mr-2 custom-checkbox" />
              I only need a hotel for part of my stay
            </label>
            <label v-if="packageType.toLowerCase().includes('car')" class="flex items-center text-xs font-bold text-brand-blue cursor-pointer">
              <input type="checkbox" v-model="differentCarDropoff" class="mr-2 custom-checkbox" />
              I want to pick up my car somewhere else
            </label>
          </div>

          <Transition name="fade">
            <div v-if="onlyPartialHotel" class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2 w-full">
              <p class="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-3">Hotel Stay Dates</p>
              <div class="max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-[68px]">
                 <FlightDateRangePicker :departure="packageSearchState.hotelCheckIn" :return="packageSearchState.hotelCheckOut" mode="roundtrip" @update:departure="(v: string) => packageSearchState.hotelCheckIn = v" @update:return="(v: string) => packageSearchState.hotelCheckOut = v" />
              </div>
            </div>
          </Transition>

          <div class="flex items-center justify-between pt-4 border-t border-gray-50">
             <div class="flex items-center gap-4">
                <a href="#" class="text-[11px] font-black text-brand-blue underline decoration-2 underline-offset-4">Advanced Search (One-Way Flight, Multi-Hotel)</a>
             </div>
             <button @click="handleSearch" class="bg-brand-blue text-white px-12 py-3.5 rounded-full font-black text-sm shadow-lg flex items-center justify-center gap-2">
               <span>Find Your Trip</span>
               <ArrowRightIcon class="h-4 w-4" />
             </button>
          </div>
        </div>
      </div>

      <!-- Cars Panel -->
      <div v-if="currentTab === 'Cars'" class="space-y-6">
        <h3 class="text-xl font-black text-brand-blue mb-4 leading-tight opacity-90">{{ dynamicTitle }}</h3>
        <div class="flex rounded-xl overflow-hidden border border-gray-200">
          <button @click="carMode = 'pickup'" class="flex-1 py-3 text-xs font-black" :class="carMode === 'pickup' ? 'bg-[#3BB4C1] text-white' : 'bg-white text-gray-400'">Airport Pick-up</button>
          <button @click="carMode = 'dropoff'" class="flex-1 py-3 text-xs font-black" :class="carMode === 'dropoff' ? 'bg-[#3BB4C1] text-white' : 'bg-white text-gray-400'">Airport Drop-off</button>
        </div>
        <div class="flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="flex-1 border-r border-gray-100">
            <LocationPicker v-model="carSearchState.origin" label="From" />
          </div>
          <div class="flex-1 border-r border-gray-100">
            <LocationPicker v-model="carSearchState.destination" label="To" />
          </div>
          <div class="flex-1">
             <FlightDateRangePicker :departure="carSearchState.pickUpDate" mode="oneway" @update:departure="(v) => carSearchState.pickUpDate = v" />
          </div>
        </div>
        <div class="flex justify-between pt-4 border-t border-gray-50">
           <label class="flex items-center text-xs font-bold text-brand-blue cursor-pointer">
             <input type="checkbox" v-model="differentCarDropoff" class="mr-2 custom-checkbox" />
             Drop-off at different location
           </label>
           <button @click="handleSearch" class="bg-brand-blue text-white px-12 py-3.5 rounded-full font-black text-sm shadow-lg">Find Your Car</button>
        </div>
      </div>

      <!-- Cruises Panel -->
      <div v-if="currentTab === 'Cruises'" class="space-y-8">
        <h3 class="text-xl font-black text-brand-blue mb-4 leading-tight opacity-90">{{ dynamicTitle }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <!-- Destination Dropdown -->
          <div class="relative group">
            <button 
              @click="activeCruiseField = activeCruiseField === 'destination' ? null : 'destination'"
              class="w-full h-16 pl-14 pr-6 bg-white border border-gray-200 rounded-2xl flex items-center text-left hover:border-brand-blue transition-all relative z-20"
              :class="{ 'ring-4 ring-brand-blue/10 border-brand-blue': activeCruiseField === 'destination' }"
            >
              <div class="absolute left-5 top-1/2 -translate-y-1/2 text-brand-blue/40">
                <MagnifyingGlassIcon class="h-5 w-5" />
              </div>
              <span class="text-sm font-black text-brand-blue line-clamp-1">{{ cruiseSearchState.destinationLabel || 'Destination (Any)' }}</span>
            </button>

            <Transition name="fade">
              <div v-if="activeCruiseField === 'destination'" class="absolute left-0 top-full mt-2 w-full max-h-[400px] overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-2xl z-[50] p-4 scrollbar-hide">
                <div v-for="opt in cruiseDestinations" :key="opt.value" 
                  @click="cruiseSearchState.destination = opt.value; cruiseSearchState.destinationLabel = opt.label; activeCruiseField = null"
                  class="px-4 py-3 hover:bg-brand-blue/5 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                  :class="{ 'bg-brand-blue/5': cruiseSearchState.destination === opt.value, 'opacity-40 pointer-events-none border-b border-gray-50 my-2': opt.disabled }"
                >
                  <span class="text-xs font-bold text-brand-blue/80 group-hover:text-brand-blue">{{ opt.label }}</span>
                  <CheckIcon v-if="cruiseSearchState.destination === opt.value" class="h-4 w-4 text-brand-blue" />
                </div>
              </div>
            </Transition>
          </div>

          <!-- Departing Dropdown -->
          <div class="relative group">
            <button 
              @click="activeCruiseField = activeCruiseField === 'departing' ? null : 'departing'"
              class="w-full h-16 pl-14 pr-6 bg-white border border-gray-200 rounded-2xl flex flex-col justify-center text-left hover:border-brand-blue transition-all relative z-20"
              :class="{ 'ring-4 ring-brand-blue/10 border-brand-blue shadow-lg shadow-brand-blue/20': activeCruiseField === 'departing' }"
            >
              <div class="absolute left-5 top-1/2 -translate-y-1/2 text-brand-blue/40">
                <CalendarIcon class="h-5 w-5" />
              </div>
              <span class="text-[9px] font-black text-brand-blue/30 uppercase tracking-[0.2em] mb-0.5 leading-none">Departing</span>
              <span class="text-sm font-black text-brand-blue leading-tight">{{ cruiseSearchState.departingLabel || 'Select Month' }}</span>
            </button>

            <Transition name="fade">
              <div v-if="activeCruiseField === 'departing'" class="absolute left-0 top-full mt-2 w-full max-h-[300px] overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-2xl z-[50] p-4 scrollbar-hide">
                <div v-for="month in cruiseMonths" :key="month.value" 
                  @click="cruiseSearchState.departingMonth = month.value; cruiseSearchState.departingLabel = month.label; activeCruiseField = null"
                  class="px-4 py-3 hover:bg-brand-blue/5 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                  :class="{ 'bg-brand-blue/5': cruiseSearchState.departingMonth === month.value }"
                >
                  <span class="text-xs font-bold text-brand-blue/80 group-hover:text-brand-blue">{{ month.label }}</span>
                  <CheckIcon v-if="cruiseSearchState.departingMonth === month.value" class="h-4 w-4 text-brand-blue" />
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <!-- Length Dropdown -->
          <div class="relative group">
            <button 
              @click="activeCruiseField = activeCruiseField === 'length' ? null : 'length'"
              class="w-full h-16 pl-14 pr-6 bg-white border border-gray-200 rounded-2xl flex items-center text-left hover:border-brand-blue transition-all relative z-20"
              :class="{ 'ring-4 ring-brand-blue/10 border-brand-blue': activeCruiseField === 'length' }"
            >
              <div class="absolute left-5 top-1/2 -translate-y-1/2 text-brand-blue/40">
                <ClockIcon class="h-5 w-5" />
              </div>
              <span class="text-sm font-black text-brand-blue">{{ cruiseSearchState.lengthLabel || 'Cruise Length (Any)' }}</span>
            </button>

            <Transition name="fade">
              <div v-if="activeCruiseField === 'length'" class="absolute left-0 top-full mt-2 w-full max-h-[300px] overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-2xl z-[50] p-4 scrollbar-hide">
                <div v-for="len in cruiseLengths" :key="len.value" 
                  @click="cruiseSearchState.length = len.value; cruiseSearchState.lengthLabel = len.label; activeCruiseField = null"
                  class="px-4 py-3 hover:bg-brand-blue/5 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                  :class="{ 'bg-brand-blue/5': cruiseSearchState.length === len.value }"
                >
                  <span class="text-xs font-bold text-brand-blue/80 group-hover:text-brand-blue">{{ len.label }}</span>
                  <CheckIcon v-if="cruiseSearchState.length === len.value" class="h-4 w-4 text-brand-blue" />
                </div>
              </div>
            </Transition>
          </div>

          <!-- Cruise Line Dropdown -->
          <div class="relative group">
            <button 
              @click="activeCruiseField = activeCruiseField === 'line' ? null : 'line'"
              class="w-full h-16 pl-14 pr-6 bg-white border border-gray-200 rounded-2xl flex items-center text-left hover:border-brand-blue transition-all relative z-20"
              :class="{ 'ring-4 ring-brand-blue/10 border-brand-blue': activeCruiseField === 'line' }"
            >
              <div class="absolute left-5 top-1/2 -translate-y-1/2 text-brand-blue/40">
                <SparklesIcon class="h-5 w-5" />
              </div>
              <span class="text-sm font-black text-brand-blue line-clamp-1">{{ cruiseSearchState.lineLabel || 'Cruise Line (Any)' }}</span>
            </button>

            <Transition name="fade">
              <div v-if="activeCruiseField === 'line'" class="absolute left-0 top-full mt-2 w-full max-h-[300px] overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-2xl z-[50] p-4 scrollbar-hide">
                <div v-for="line in cruiseLines" :key="line.value" 
                  @click="cruiseSearchState.line = line.value; cruiseSearchState.lineLabel = line.label; activeCruiseField = null"
                  class="px-4 py-3 hover:bg-brand-blue/5 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                  :class="{ 'bg-brand-blue/5': cruiseSearchState.line === line.value }"
                >
                  <span class="text-xs font-bold text-brand-blue/80 group-hover:text-brand-blue">{{ line.label }}</span>
                  <CheckIcon v-if="cruiseSearchState.line === line.value" class="h-4 w-4 text-brand-blue" />
                </div>
              </div>
            </Transition>
          </div>

          <button @click="handleSearch" class="h-16 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center">
            Book Now!
          </button>
        </div>

        <div class="pt-6 border-t border-gray-50 text-center">
          <p class="text-xs font-bold text-brand-gray/60 flex items-center justify-center gap-2">
            <span>Happy Price Cruise deals are always on:</span>
            <a href="#" class="text-brand-blue underline decoration-2 underline-offset-4 font-black">Cruises under $399</a>
          </p>
        </div>
      </div>

      <div v-if="currentTab === 'Transfers'" class="p-8 text-center text-brand-gray/40 font-black uppercase tracking-widest">Transfers Search coming soon</div>
      <div v-if="currentTab === 'Activities'" class="p-8 text-center text-brand-gray/40 font-black uppercase tracking-widest">Activities Search coming soon</div>

      <div v-if="!isSticky" class="border-t border-gray-50/50 py-3 bg-gray-50/30 rounded-b-[2.5rem] flex items-center justify-center">
         <span class="text-[11px] font-bold text-brand-blue/60">{{ currentTab }} prices now shown with fees included.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { 
  PaperAirplaneIcon, 
  TruckIcon, 
  GiftIcon, 
  ArrowRightIcon,
  TicketIcon,
  HomeModernIcon as HotelIcon,
  KeyIcon as CarIcon,
  GlobeAltIcon as CruiseIcon, // Changed to GlobeAlt as a placeholder for Cruises
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  SunIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isSticky: { type: Boolean, default: false }
})

const emit = defineEmits(['focus-change'])
const isFocused = ref(false)
watch(isFocused, (val) => emit('focus-change', val))

const tabs = [
  { name: 'Hotels', icon: BuildingOfficeIcon }, // Use BuildingOffice per UI
  { name: 'Flights', icon: PaperAirplaneIcon },
  { name: 'Packages', icon: SunIcon }, // Use Sun per UI (palm tree substitute)
  { name: 'Cars', icon: CarIcon },
  { name: 'Cruises', icon: CruiseIcon },
  { name: 'Activities', icon: TicketIcon },
  { name: 'Transfers', icon: TruckIcon }
]

const currentTab = ref('Hotels')
const stayMode   = ref('single')
const flightMode = ref('roundtrip')
const carMode    = ref('pickup')

const multiHotelLegs = ref([{ location: '', checkIn: '', checkOut: '' }])
const addHotelLeg = () => { if (multiHotelLegs.value.length < 5) multiHotelLegs.value.push({ location: '', checkIn: '', checkOut: '' }) }

const occupancy = reactive({ rooms: 1, adults: 2, children: 0 })
const searchState = reactive({ location: '', checkIn: '', checkOut: '' })
const bundles = reactive({ bundleFlight: false, bundleCar: false })

const flightTravelers = reactive({ adults: 1, children: 0 })
const flightSearchState = reactive({ origin: '', destination: '', departureDate: '', returnDate: '' })
const multiFlightLegs = ref([{ origin: '', destination: '', departureDate: '', returnDate: '' }])

const carSearchState = reactive({ origin: '', destination: '', pickUpDate: '' })
const differentCarDropoff = ref(false)

const activeCruiseField = ref<string | null>(null)

const cruiseDestinations = [
  { value: '', label: 'Destination (Any)' },
  { value: 'C', label: 'Caribbean' },
  { value: 'M', label: 'Mexico' },
  { value: 'BH', label: 'Bahamas' },
  { value: 'A', label: 'Alaska' },
  { value: 'E', label: 'Europe - All' },
  { value: 'H', label: 'Hawaii' },
  { value: 'BM', label: 'Bermuda' },
  { value: 'NN', label: 'Canada/New England/NY' },
  { value: '_', label: '-------------', disabled: true },
  { value: 'ALL', label: 'All Destinations' },
  { value: 'A', label: 'Alaska - All' },
  { value: 'AG', label: 'Alaska - Gulf of Alaska' },
  { value: 'AR', label: 'Alaska - Inside Passage' },
  { value: 'AB', label: 'Antarctica' },
  { value: 'UN', label: 'Australia/New Zealand' },
  { value: 'BH', label: 'Bahamas' },
  { value: 'BM', label: 'Bermuda' },
  { value: 'NN', label: 'Canada/New England/NY' },
  { value: 'C', label: 'Caribbean - All' },
  { value: 'CE', label: 'Caribbean - Eastern' },
  { value: 'CS', label: 'Caribbean - Southern' },
  { value: 'CW', label: 'Caribbean - Western' },
  { value: 'CN', label: 'Cruise to Nowhere' },
  { value: 'E', label: 'Europe - All' },
  { value: 'EE', label: 'Europe - E. Mediterranean' },
  { value: 'R', label: 'Europe - Mediterranean - All' },
  { value: 'N', label: 'Europe - Northern' },
  { value: 'EW', label: 'Europe - W. Mediterranean' },
  { value: 'W', label: 'Europe - Western' },
  { value: 'O', label: 'Exotic - Asia/Africa/Other' },
  { value: 'H', label: 'Hawaii' },
  { value: 'M', label: 'Mexico' },
  { value: 'L', label: 'Pacific Coast' },
  { value: 'T', label: 'Panama Canal/C. America' },
  { value: 'S', label: 'South America' },
  { value: 'I', label: 'South Pacific - All' },
  { value: 'TH', label: 'South Pacific - Tahiti' },
  { value: 'ET', label: 'Transatlantic' },
  { value: 'NA', label: 'U.S. - All' },
  { value: 'RV', label: 'U.S. - American Rivers' },
  { value: 'WW', label: 'World Cruise' }
]

const cruiseMonths = [
  { value: '03/1/2026', label: 'March 2026' },
  { value: '04/1/2026', label: 'April 2026' },
  { value: '05/1/2026', label: 'May 2026' },
  { value: '06/1/2026', label: 'June 2026' },
  { value: '07/1/2026', label: 'July 2026' },
  { value: '08/1/2026', label: 'August 2026' },
  { value: '09/1/2026', label: 'September 2026' },
  { value: '10/1/2026', label: 'October 2026' },
  { value: '11/1/2026', label: 'November 2026' },
  { value: '12/1/2026', label: 'December 2026' },
  { value: '01/1/2027', label: 'January 2027' },
  { value: '02/1/2027', label: 'February 2027' },
  { value: '03/1/2027', label: 'March 2027' },
  { value: '04/1/2027', label: 'April 2027' },
  { value: '05/1/2027', label: 'May 2027' },
  { value: '06/1/2027', label: 'June 2027' },
  { value: '07/1/2027', label: 'July 2027' },
  { value: '08/1/2027', label: 'August 2027' },
  { value: '09/1/2027', label: 'September 2027' },
  { value: '10/1/2027', label: 'October 2027' },
  { value: '11/1/2027', label: 'November 2027' },
  { value: '12/1/2027', label: 'December 2027' },
  { value: '01/1/2028', label: 'January 2028' },
  { value: '02/1/2028', label: 'February 2028' },
  { value: '03/1/2028', label: 'March 2028' },
  { value: '04/1/2028', label: 'April 2028' },
  { value: '05/1/2028', label: 'May 2028' },
  { value: '06/1/2028', label: 'June 2028' },
  { value: '07/1/2028', label: 'July 2028' },
  { value: '08/1/2028', label: 'August 2028' },
  { value: '09/1/2028', label: 'September 2028' },
  { value: '10/1/2028', label: 'October 2028' },
  { value: '11/1/2028', label: 'November 2028' },
  { value: '12/1/2028', label: 'December 2028' },
  { value: '01/1/2029', label: 'January 2029' },
  { value: '02/1/2029', label: 'February 2029' }
]

const cruiseLengths = [
  { value: '', label: 'Cruise Length (Any)' },
  { value: 'ALL', label: 'All' },
  { value: '1', label: '1-2 Nights' },
  { value: '2', label: '3-5 Nights' },
  { value: '3', label: '6-8 Nights' },
  { value: '4', label: '9-11 Nights' },
  { value: '5', label: '12+ Nights' }
]

const cruiseLines = [
  { value: '', label: 'Cruise Line (Any)' },
  { value: 'ALL', label: 'All Cruise Lines' },
  { value: '92', label: 'AmaWaterways' },
  { value: '323', label: 'American Cruise Lines' },
  { value: '329', label: 'Avalon Waterways' },
  { value: '325', label: 'Azamara Cruises' },
  { value: '1', label: 'Carnival Cruise Lines' },
  { value: '11', label: 'Celebrity Cruises' },
  { value: '14', label: 'Costa Cruises' },
  { value: '369', label: 'Crystal Cruises' },
  { value: '18', label: 'Cunard' },
  { value: '20', label: 'Disney Cruise Line' },
  { value: '368', label: 'Explora Journeys' },
  { value: '24', label: 'Holland America Line' },
  { value: '71', label: 'MSC Cruises' },
  { value: '34', label: 'Norwegian Cruise Line' },
  { value: '67', label: 'Oceania Cruises' },
  { value: '344', label: 'Ponant' },
  { value: '40', label: 'Princess Cruises' },
  { value: '41', label: 'Regent Seven Seas Cruises' },
  { value: '44', label: 'Royal Caribbean' },
  { value: '375', label: 'Scenic Ocean Cruises' },
  { value: '50', label: 'Silversea Cruises' },
  { value: '48', label: 'The Yachts of Seabourn' },
  { value: '66', label: 'Uniworld River Cruises' },
  { value: '354', label: 'Viking Ocean Cruises' },
  { value: '78', label: 'Viking River Cruises' },
  { value: '364', label: 'Virgin Voyages' },
  { value: '64', label: 'Windstar Cruises' }
]

const cruiseSearchState = reactive({ 
  destination: '', 
  destinationLabel: '',
  departingMonth: '03/1/2026',
  departingLabel: 'March 2026',
  length: '',
  lengthLabel: '',
  line: '',
  lineLabel: ''
})

const dynamicTitle = computed(() => {
  switch (currentTab.value) {
    case 'Hotels': return 'Save big on your next stay'
    case 'Flights': return 'Save big on your next flight'
    case 'Packages': return 'Save big on your next package'
    case 'Cars': return 'Save big on your next rental'
    case 'Cruises': return 'Save big on your next cruise'
    default: return 'Save big on your next trip'
  }
})

const packageType = ref('Hotel+Flight')
const onlyPartialHotel = ref(false)
const packageOccupancy = reactive({ rooms: 1, adults: 2, children: 0 })
const packageSearchState = reactive({ 
  origin: '', destination: '', departureDate: '', returnDate: '', hotelCheckIn: '', hotelCheckOut: ''
})

const handleExternalDeal = (deal: any) => {
  currentTab.value = deal.type || 'Flights'
  if (deal.type === 'Flights') {
    flightSearchState.origin = deal.from || 'Lagos'
    flightSearchState.destination = deal.to || ''
  } else if (deal.type === 'Hotels') {
    searchState.location = deal.to || ''
  } else if (deal.type === 'Cars') {
    carSearchState.destination = deal.to || ''
  }
}

defineExpose({ handleExternalDeal })

const handleSearch = () => {
  isFocused.value = false
  const query: any = { tab: currentTab.value }
  
  if (currentTab.value === 'Cruises') {
    Object.assign(query, cruiseSearchState)
  } else if (currentTab.value === 'Flights') {
    Object.assign(query, flightSearchState)
  }
  
  navigateTo({ path: '/' + currentTab.value.toLowerCase(), query })
}
</script>

<style scoped>
.custom-checkbox {
  @apply rounded border-gray-300 text-brand-blue focus:ring-brand-blue;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
