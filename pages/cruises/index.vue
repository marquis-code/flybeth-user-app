<template>
  <main class="min-h-screen bg-[#F8FAFC]">
    <!-- ── Premium Floating Header ─────────────────────────────────────────── -->
    <div class="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div class="flex flex-col md:flex-row items-center gap-4">
          <!-- Back Button & Title -->
          <div class="flex items-center gap-4 w-full md:w-auto">
            <NuxtLink to="/" class="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all border border-gray-100 shrink-0">
              <ChevronLeftIcon class="h-5 w-5" />
            </NuxtLink>
            <div class="md:hidden flex-1">
              <h1 class="text-lg font-bold text-gray-900 truncate">Luxury Cruises</h1>
            </div>
          </div>

          <!-- Glass Search Bar -->
          <div class="flex-1 w-full bg-white rounded-2xl p-1.5 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div class="flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div class="w-full sm:flex-1 relative flex items-center">
                <!-- Syncing with SearchWidget logic: we use a destination dropdown or CityPicker -->
                <button 
                  @click="isSearchingDestination = !isSearchingDestination"
                  class="w-full h-14 pl-12 pr-6 flex flex-col justify-center text-left hover:bg-gray-50 transition-all rounded-xl"
                >
                   <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                   <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Destination</span>
                   <span class="text-sm font-bold text-gray-900 truncate">{{ searchQuery.destinationLabel || 'Select Destination' }}</span>
                </button>
                <!-- destination Dropdown -->
                <div v-if="isSearchingDestination" class="absolute left-0 top-full mt-2 w-full max-h-[400px] overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-4 no-scrollbar">
                  <div v-for="opt in cruiseDestinations" :key="opt.value" 
                    @click="searchQuery.destination = opt.value; searchQuery.destinationLabel = opt.label; isSearchingDestination = false"
                    class="px-4 py-3 hover:bg-brand-blue/5 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                    :class="{ 'bg-brand-blue/5': searchQuery.destination === opt.value, 'opacity-40 pointer-events-none border-b border-gray-50 my-2': opt.disabled }"
                  >
                    <span class="text-sm font-semibold text-gray-600 group-hover:text-gray-900">{{ opt.label }}</span>
                    <CheckIcon v-if="searchQuery.destination === opt.value" class="h-4 w-4 text-brand-blue" />
                  </div>
                </div>
              </div>
              <div class="w-full sm:w-56 shrink-0 relative">
                <button 
                  @click="isSearchingMonth = !isSearchingMonth"
                  class="w-full h-14 pl-12 pr-6 flex flex-col justify-center text-left hover:bg-gray-50 transition-all"
                >
                   <CalendarIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                   <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Departing</span>
                   <span class="text-sm font-bold text-gray-900">{{ searchQuery.departingLabel || 'Any Month' }}</span>
                </button>
                <!-- Month Dropdown -->
                <div v-if="isSearchingMonth" class="absolute left-0 top-full mt-2 w-full max-h-[300px] overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-4 no-scrollbar">
                  <div v-for="month in cruiseMonths" :key="month.value" 
                    @click="searchQuery.departingMonth = month.value; searchQuery.departingLabel = month.label; isSearchingMonth = false"
                    class="px-4 py-3 hover:bg-brand-blue/5 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <span class="text-sm font-semibold text-gray-600 group-hover:text-gray-900">{{ month.label }}</span>
                    <CheckIcon v-if="searchQuery.departingMonth === month.value" class="h-4 w-4 text-brand-blue" />
                  </div>
                </div>
              </div>
              <div class="w-full sm:w-auto p-1.5">
                <button
                  @click="handleSearch"
                  :disabled="loading"
                  class="w-full sm:px-10 py-3.5 bg-brand-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-blue/90 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-70"
                >
                  <div v-if="loading" class="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full"></div>
                  <MagnifyingGlassIcon v-else class="h-4 w-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Main Content Area ──────────────────────────────────────────────── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col lg:flex-row gap-10">
        
        <!-- Sidebar: Functional Filters -->
        <aside class="lg:w-80 shrink-0 space-y-8">
           <!-- Filters Header -->
           <div class="flex items-center justify-between">
              <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <AdjustmentsHorizontalIcon class="h-4 w-4" />
                Filter results
              </h2>
              <button @click="resetFilters" class="text-[11px] font-bold text-brand-blue hover:text-brand-blue/80 uppercase tracking-wider transition-colors">Reset all</button>
           </div>

           <!-- Duration Filter -->
           <div class="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 mb-5">Cruise Duration</h3>
              <div class="space-y-3.5">
                 <label v-for="len in cruiseLengths" :key="len.value" v-if="len.value" class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" v-model="filters.lengths" :value="len.value" class="h-5 w-5 rounded-md border-gray-200 text-brand-blue focus:ring-brand-blue/20 transition-all cursor-pointer" />
                    <span class="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{{ len.label }}</span>
                 </label>
              </div>
           </div>

           <!-- Cruise Line Filter -->
           <div class="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm max-h-[400px] overflow-y-auto no-scrollbar">
              <h3 class="text-sm font-bold text-gray-900 mb-5">Cruise Line</h3>
              <div class="space-y-3.5">
                 <label v-for="line in availableCruiseLines" :key="line.value" v-if="line.value" class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" v-model="filters.lines" :value="line.value" class="h-5 w-5 rounded-md border-gray-200 text-brand-blue focus:ring-brand-blue/20 transition-all cursor-pointer" />
                    <span class="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{{ line.label }}</span>
                 </label>
              </div>
           </div>

           <!-- Price Filter -->
           <div class="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between mb-5">
                 <h3 class="text-sm font-bold text-gray-900">Price range</h3>
                 <span class="text-xs font-bold text-brand-blue">${{ filters.priceRange[1] }}</span>
              </div>
              <input type="range" min="0" max="8000" step="100" v-model.number="filters.priceRange[1]" class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
              <div class="flex justify-between mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 <span>$0</span>
                 <span>$8000+</span>
              </div>
           </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <!-- Results Header -->
          <div class="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 tracking-tight leading-none mb-3">Sailing Expeditions</h1>
              <p class="text-sm font-medium text-gray-400">Showing <span class="text-gray-900 font-bold">{{ filteredCruises.length }}</span> luxury cruises for your selection.</p>
            </div>
            <div class="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
               <button class="px-4 py-2 bg-gray-50 text-gray-900 rounded-lg text-xs font-bold uppercase tracking-widest">Sort: Lowest Price</button>
            </div>
          </div>

          <!-- List Area -->
          <div class="space-y-6 relative min-h-[400px]">
            <TransitionGroup name="list">
              <!-- Loading Skeleton -->
              <template v-if="loading">
                <div v-for="i in 3" :key="`skeleton-${i}`" class="bg-white rounded-[2.5rem] p-6 border border-gray-100 h-64 animate-pulse">
                  <div class="flex flex-col md:flex-row gap-8 h-full">
                    <div class="w-full md:w-80 h-full bg-gray-50 rounded-[2rem]" />
                    <div class="flex-1 space-y-4 py-2">
                       <div class="h-8 w-1/2 bg-gray-50 rounded-lg" />
                       <div class="h-4 w-1/4 bg-gray-50 rounded-lg" />
                       <div class="grid grid-cols-4 gap-4 mt-8">
                          <div v-for="j in 4" :key="j" class="h-10 bg-gray-50 rounded-xl" />
                       </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Results -->
              <template v-else-if="filteredCruises.length > 0">
                <CruiseCard 
                  v-for="cruise in filteredCruises" 
                  :key="cruise._id || cruise.id" 
                  :cruise="cruise"
                  @select="selectCruise" 
                />
              </template>

              <!-- Empty State -->
              <template v-else>
                 <div class="py-24 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                    <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                       <GlobeAltIcon class="h-12 w-12" />
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">No sailings found</h2>
                    <p class="text-sm font-medium text-gray-400 max-w-sm mx-auto">We couldn't find any cruises matching your criteria. Try adjusting your filters or destination.</p>
                    <button @click="resetFilters" class="mt-8 px-8 py-3 bg-white text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest border border-gray-100 shadow-sm hover:bg-gray-50 transition-all">Clear all filters</button>
                 </div>
              </template>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRoute } from '#app'
import { 
  ChevronLeftIcon, 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckIcon
} from '@heroicons/vue/24/solid'
import { useSearchCruises } from '@/composables/modules/cruises/useSearchCruises'

const route = useRoute()
const { loading, filteredCruises, filters, searchCruises } = useSearchCruises()

const searchQuery = reactive({
  destination: String(route.query.destination || 'BH'),
  destinationLabel: '',
  departingMonth: String(route.query.departingMonth || '03/1/2026'),
  departingLabel: '',
  length: String(route.query.length || ''),
  line: String(route.query.line || ''),
})

const isSearchingDestination = ref(false)
const isSearchingMonth = ref(false)

// Constants from SearchWidget.vue
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
  { value: 'ALL', label: 'All Destinations' }
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
  { value: '12/1/2026', label: 'December 2026' }
]

const cruiseLengths = [
  { value: '', label: 'Cruise Length (Any)' },
  { value: '1', label: '1-2 Nights' },
  { value: '2', label: '3-5 Nights' },
  { value: '3', label: '6-8 Nights' },
  { value: '4', label: '9-11 Nights' },
  { value: '5', label: '12+ Nights' }
]

const availableCruiseLines = [
  { value: '', label: 'Cruise Line (Any)' },
  { value: '1', label: 'Carnival Cruise Lines' },
  { value: '11', label: 'Celebrity Cruises' },
  { value: '20', label: 'Disney Cruise Line' },
  { value: '71', label: 'MSC Cruises' },
  { value: '34', label: 'Norwegian Cruise Line' },
  { value: '44', label: 'Royal Caribbean' },
  { value: '40', label: 'Princess Cruises' }
]

const resetFilters = () => {
  filters.value.lines = []
  filters.value.lengths = []
  filters.value.priceRange = [0, 8000]
}

const handleSearch = async () => {
  if (!searchQuery.destination) return
  await searchCruises(searchQuery)
}

const selectCruise = (cruise: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'cruise',
      id: cruise._id || cruise.id,
      name: cruise.name,
      price: cruise.pricing?.startingPrice || cruise.price
    }
  })
}

// Initial label resolution
const resolveLabels = () => {
  const d = cruiseDestinations.find(opt => opt.value === searchQuery.destination)
  if (d) searchQuery.destinationLabel = d.label
  
  const m = cruiseMonths.find(opt => opt.value === searchQuery.departingMonth)
  if (m) searchQuery.departingLabel = m.label
}

onMounted(() => {
  resolveLabels()
  handleSearch()
})

// Watchers for labels
watch(() => searchQuery.destination, (val) => {
  const d = cruiseDestinations.find(opt => opt.value === val)
  if (d) searchQuery.destinationLabel = d.label
})
watch(() => searchQuery.departingMonth, (val) => {
  const m = cruiseMonths.find(opt => opt.value === val)
  if (m) searchQuery.departingLabel = m.label
})

</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.list-move {
  transition: transform 0.5s ease;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  border: 4px solid #0D1DAD;
  @apply transition-all active:scale-110;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
