<template>
  <div class="min-h-screen bg-white pt-24 font-body">
    <!-- Search Header Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="bg-white border-b border-gray-100 pb-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1 flex bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div class="flex-1 border-r border-gray-100">
               <LocationPicker v-model="exploreState.origin" label="From" />
            </div>
            <div class="flex-1">
               <LocationPicker v-model="exploreState.destination" label="To" placeholder="Country, state, or region" />
            </div>
          </div>
          
          <div class="w-full lg:w-72 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
             <FlightDateRangePicker 
               :departure="exploreState.date" 
               mode="oneway" 
               label="When"
               placeholder="Any Time, 1-14 days"
               @update:departure="(v) => exploreState.date = v" 
             />
          </div>
          
          <button class="bg-[#FF4F01] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            Explore Deals
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sticky top-24 z-[150] bg-white/95 backdrop-blur-xl py-6 border-b border-gray-50 flex flex-wrap items-center gap-4">
      <h2 class="text-3xl font-black text-brand-blue mr-6 mb-2">Explore <span class="text-brand-blue/40 inline-block rotate-45 transform">✈️</span> Deals from <span class="text-brand-green">Lagos</span></h2>
      
      <div class="flex flex-wrap items-center gap-3">
        <div v-for="filter in filters" :key="filter.id" class="relative">
          <button 
            @click="activeFilter = activeFilter === filter.id ? null : filter.id"
            class="flex items-center gap-2 px-6 py-3 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all relative z-20"
            :class="activeFilter === filter.id ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20' : 'bg-white border-gray-100 text-brand-blue/60 hover:border-brand-blue/40'"
          >
            {{ filter.label }}
            <ChevronDownIcon class="h-3 w-3 transition-transform" :class="{ 'rotate-180': activeFilter === filter.id }" />
          </button>

          <!-- Filter Popovers -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-2 opacity-0"
          >
            <div v-if="activeFilter === filter.id" class="absolute left-0 mt-4 w-72 bg-white border border-gray-100 rounded-[2rem] shadow-2xl z-[200] p-8 origin-top">
              <div v-if="filter.id === 'price'" class="space-y-8">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-black uppercase tracking-[0.2em] text-brand-blue">Price Range</span>
                </div>
                <div class="space-y-6">
                  <div class="flex justify-between text-[11px] font-bold text-brand-gray/40 italic">
                    <span>$50</span>
                    <span class="bg-brand-blue text-white px-3 py-1 rounded-xl shadow-md shadow-brand-blue/20">Up to $2000</span>
                  </div>
                  <input type="range" min="50" max="2000" class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                </div>
                <div class="pt-6 border-t border-gray-50 flex justify-end">
                  <button @click="activeFilter = null" class="bg-brand-blue text-white text-sm font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">Done</button>
                </div>
              </div>

              <div v-if="filter.id === 'stops'" class="space-y-6">
                <h4 class="text-sm font-black uppercase tracking-[0.2em] text-brand-blue border-b border-gray-50 pb-2">Number of Stops</h4>
                <div class="space-y-4">
                  <div v-for="stop in ['Any Stops', 'Non-stop', '1 stop', '2 stops']" :key="stop" class="flex items-center gap-3 group/opt cursor-pointer" @click="filterState.stops = stop">
                    <div class="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center transition-all group-hover/opt:border-brand-blue" :class="{ 'border-brand-blue bg-brand-blue': filterState.stops === stop }">
                      <div class="w-2 h-2 rounded-full bg-white shadow-sm" v-if="filterState.stops === stop"></div>
                    </div>
                    <span class="text-xs font-bold text-brand-gray/60 group-hover/opt:text-brand-blue transition-colors">{{ stop }}</span>
                  </div>
                </div>
                <div class="pt-6 border-t border-gray-50 flex justify-end">
                  <button @click="activeFilter = null" class="bg-brand-blue text-white text-sm font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">Done</button>
                </div>
              </div>

              <div v-if="filter.id === 'duration'" class="space-y-8 text-left">
                <h4 class="text-sm font-black uppercase tracking-[0.2em] text-brand-blue border-b border-gray-50 pb-2">Flight Duration</h4>
                <div class="space-y-6">
                  <div class="flex justify-between text-[11px] font-bold text-brand-gray/40 italic">
                    <span>Any</span>
                    <span class="bg-brand-blue text-white px-3 py-1 rounded-xl shadow-md shadow-brand-blue/20">Up to {{ filterState.duration }}h</span>
                  </div>
                  <input type="range" min="2" max="30" v-model="filterState.duration" class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                </div>
                <div class="pt-6 border-t border-gray-50 flex justify-end">
                  <button @click="activeFilter = null" class="bg-brand-blue text-white text-sm font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">Done</button>
                </div>
              </div>

              <div v-if="filter.id === 'layover'" class="space-y-8 text-left">
                <h4 class="text-sm font-black uppercase tracking-[0.2em] text-brand-blue border-b border-gray-50 pb-2">Layover Duration</h4>
                <div class="space-y-6">
                  <div class="flex justify-between text-[11px] font-bold text-brand-gray/40 italic">
                    <span>Any</span>
                    <span class="bg-brand-blue text-white px-3 py-1 rounded-xl shadow-md shadow-brand-blue/20">Max {{ filterState.layover }}h</span>
                  </div>
                  <input type="range" min="0" max="24" v-model="filterState.layover" class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                </div>
                <div class="pt-6 border-t border-gray-50 flex justify-end">
                  <button @click="activeFilter = null" class="bg-brand-blue text-white text-sm font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">Done</button>
                </div>
              </div>

              <div v-if="filter.id === 'interest'" class="space-y-6 text-left">
                <h4 class="text-sm font-black uppercase tracking-[0.2em] text-brand-blue border-b border-gray-50 pb-2">Travel Interest</h4>
                <div class="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                  <div v-for="interest in ['Anything', 'City', 'Skiing', 'Beach', 'Foodie', 'Night Life', 'Romantic', 'National Parks']" :key="interest" class="flex items-center gap-3 group/opt cursor-pointer" @click="filterState.interest = interest">
                    <div class="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center transition-all group-hover/opt:border-brand-blue" :class="{ 'border-brand-blue bg-brand-blue': filterState.interest === interest }">
                      <div class="w-2 h-2 rounded-full bg-white shadow-sm" v-if="filterState.interest === interest"></div>
                    </div>
                    <span class="text-xs font-bold text-brand-gray/60 group-hover/opt:text-brand-blue transition-colors">{{ interest }}</span>
                  </div>
                </div>
                <div class="pt-6 border-t border-gray-50 flex justify-end">
                  <button @click="activeFilter = null" class="bg-brand-blue text-white text-sm font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">Done</button>
                </div>
              </div>

              <div v-if="filter.id === 'weekend'" class="space-y-6">
                <h4 class="text-sm font-black uppercase tracking-[0.2em] text-brand-blue border-b border-gray-50 pb-2">Weekend Getaways</h4>
                <div class="space-y-4">
                  <div v-for="opt in ['Any', 'This Weekend', 'Next Weekend', 'Last Weekend']" :key="opt" class="flex items-center gap-3 group/opt cursor-pointer" @click="filterState.weekend = opt">
                    <div class="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center transition-all group-hover/opt:border-brand-blue" :class="{ 'border-brand-blue bg-brand-blue': filterState.weekend === opt }">
                      <div class="w-2 h-2 rounded-full bg-white shadow-sm" v-if="filterState.weekend === opt"></div>
                    </div>
                    <span class="text-xs font-bold text-brand-gray/60 group-hover/opt:text-brand-blue transition-colors">{{ opt }}</span>
                  </div>
                </div>
                <div class="pt-6 border-t border-gray-50 flex justify-end">
                  <button @click="activeFilter = null" class="bg-brand-blue text-white text-sm font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">Done</button>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <button @click="resetFilters" class="ml-auto text-xs font-black text-brand-blue/40 hover:text-brand-blue transition-colors">Reset</button>
      </div>
    </div>

    <!-- Deals Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="deal in deals" :key="deal.id" class="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div class="relative h-48 overflow-hidden">
            <img :src="deal.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" :alt="deal.name" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <button class="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-colors group/heart">
              <HeartIcon class="h-5 w-5 text-white group-hover/heart:text-red-500 transition-colors" />
            </button>
          </div>
          <div class="p-6">
            <h3 class="text-sm font-black text-brand-blue mb-1">{{ deal.name }}</h3>
            <div class="flex items-baseline gap-1 mb-4">
              <span class="text-2xl font-black text-brand-green">${{ deal.price.toLocaleString() }}</span>
              <span class="text-sm font-bold text-brand-gray/40">.80 *</span>
            </div>
            
            <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div class="flex flex-col">
                 <span class="text-sm font-black text-brand-blue uppercase tracking-widest">{{ deal.route }}</span>
                 <span class="text-sm font-bold text-brand-gray/40">{{ deal.dates }}</span>
               </div>
               <button class="w-8 h-8 rounded-full border border-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue transition-all">
                 <ChevronRightIcon class="h-4 w-4 text-brand-blue group-hover:text-white" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  HeartIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const exploreState = reactive({
  origin: 'LOS - Lagos, Nigeria',
  destination: '',
  date: ''
})

const activeFilter = ref<string | null>(null)
const filterState = reactive({
  stops: 'Any Stops',
  interest: 'Anything',
  weekend: 'Any',
  duration: 15,
  layover: 8
})

const filters = [
  { id: 'price', label: 'Price' },
  { id: 'stops', label: 'Stops' },
  { id: 'duration', label: 'Flight Duration' },
  { id: 'layover', label: 'Layover Duration' },
  { id: 'interest', label: 'Travel Interest' },
  { id: 'weekend', label: 'Weekend Getaways' },
]

const resetFilters = () => {
  filterState.stops = 'Any Stops'
  filterState.interest = 'Anything'
  filterState.weekend = 'Any'
  filterState.duration = 15
  filterState.layover = 8
  activeFilter.value = null
}

const deals = ref([
  { id: 1, name: 'Toronto, ON', price: 730, route: 'LOS ⇆ YTO', dates: 'May 01 - May 07', image: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'New York City, NY', price: 1091, route: 'LOS ⇆ NYC', dates: 'Apr 13 - Apr 22', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Indianapolis, IN', price: 1316, route: 'LOS ⇆ IND', dates: 'Mar 29 - Apr 04', image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Houston, TX', price: 1379, route: 'LOS ⇆ HOU', dates: 'Aug 30 - Sep 09', image: 'https://images.unsplash.com/photo-1530089711124-9ca31fb9e8c3?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'Orlando, FL', price: 1395, route: 'LOS ⇆ ORL', dates: 'May 05 - May 16', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'Seattle, WA', price: 1400, route: 'LOS ⇆ SEA', dates: 'Apr 10 - Apr 14', image: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=600&q=80' },
  { id: 7, name: 'Washington DC, DC', price: 1424, route: 'LOS ⇆ WAS', dates: 'Jul 30 - Aug 08', image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=600&q=80' },
  { id: 8, name: 'Los Angeles, CA', price: 1481, route: 'LOS ⇆ LAX', dates: 'May 22 - May 25', image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=600&q=80' },
])
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
