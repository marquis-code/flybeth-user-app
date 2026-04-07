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
              <h1 class="text-lg font-bold text-gray-900 truncate">Things to do</h1>
            </div>
          </div>

          <!-- Glass Search Bar -->
          <div class="flex-1 w-full bg-white rounded-2xl p-1.5 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div class="flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div class="w-full sm:flex-1">
                <CityPicker v-model="searchQuery.destinationIata" label="Destination" placeholder="Where to go?" class="!bg-transparent" />
              </div>
              <div class="w-full sm:w-64">
                <FlightDateRangePicker :departure="searchQuery.date" mode="oneway" label="Date" @update:departure="(v) => searchQuery.date = v" />
              </div>
              <div class="w-full sm:w-auto p-1.5">
                <button
                  @click="handleSearch"
                  :disabled="loading"
                  class="w-full sm:px-8 py-3.5 bg-brand-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-blue/90 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-70"
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
                Filter by
              </h2>
              <button @click="resetFilters" class="text-[11px] font-bold text-brand-blue hover:text-brand-blue/80 uppercase tracking-wider transition-colors">Reset all</button>
           </div>

           <!-- Category Filter -->
           <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 mb-5">Categories</h3>
              <div class="space-y-3.5">
                 <label v-for="cat in availableCategories" :key="cat" class="flex items-center justify-between cursor-pointer group">
                    <div class="flex items-center gap-3">
                       <div class="relative flex items-center justify-center">
                          <input type="checkbox" v-model="filters.categories" :value="cat" class="peer h-5 w-5 rounded-md border-gray-200 text-brand-blue focus:ring-brand-blue/20 transition-all cursor-pointer" />
                       </div>
                       <span class="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{{ cat }}</span>
                    </div>
                 </label>
              </div>
           </div>

           <!-- Price Filter -->
           <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between mb-5">
                 <h3 class="text-sm font-bold text-gray-900">Price range</h3>
                 <span class="text-xs font-bold text-brand-blue">${{ filters.priceRange[0] }} - ${{ filters.priceRange[1] }}</span>
              </div>
              <input type="range" min="0" max="1000" v-model.number="filters.priceRange[1]" class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
              <div class="flex justify-between mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 <span>$0</span>
                 <span>$1000+</span>
              </div>
           </div>

           <!-- Rating Filter -->
           <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 mb-5">Minimum Rating</h3>
              <div class="space-y-3.5">
                 <label v-for="rate in [4, 3, 2]" :key="rate" class="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" v-model="filters.rating" :value="rate" class="h-4 w-4 text-brand-blue border-gray-200 focus:ring-brand-blue/20" />
                    <div class="flex items-center gap-1">
                       <StarIcon v-for="i in rate" :key="i" class="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
                       <StarIcon v-for="i in (5 - rate)" :key="i" class="h-3.5 w-3.5 text-gray-200 fill-gray-200" />
                       <span class="text-xs font-bold text-gray-600 ml-1 mt-0.5">{{ rate }}+ Stars</span>
                    </div>
                 </label>
              </div>
           </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 tracking-tight leading-none mb-3">Things to do in <span class="text-brand-blue">{{ currentCityName || 'the area' }}</span></h1>
            <p class="text-sm font-medium text-gray-400">Discover and book curated experiences, tours, and activities.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <TransitionGroup name="activity-list">
              <!-- Loading Skeleton -->
              <template v-if="loading">
                <div v-for="i in 4" :key="`skeleton-${i}`" class="bg-white rounded-3xl p-5 border border-gray-100 h-[420px] animate-pulse">
                  <div class="w-full h-56 bg-gray-50 rounded-2xl mb-5" />
                  <div class="space-y-3">
                     <div class="h-6 w-3/4 bg-gray-50 rounded-lg" />
                     <div class="h-4 w-1/4 bg-gray-50 rounded-lg" />
                     <div class="h-10 w-full bg-gray-50 rounded-xl mt-6" />
                  </div>
                </div>
              </template>

              <!-- Results -->
              <template v-else-if="filteredActivitiesList.length > 0">
                <div v-for="activity in filteredActivitiesList" :key="activity.experienceId" 
                     class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer flex flex-col"
                     @click="goToDetail(activity)">
                  
                  <!-- Image & Badges -->
                  <div class="relative h-56 rounded-2xl overflow-hidden mb-5 shrink-0 bg-gray-100">
                    <img v-if="activity.photos?.[0]" :src="activity.photos[0]" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                    
                    <!-- Top Badges -->
                    <div class="absolute top-4 left-4 flex gap-2">
                      <div v-if="activity.rating" class="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                        <StarIcon class="h-3 w-3 text-orange-400 fill-orange-400" />
                        <span class="text-[11px] font-bold text-gray-900">{{ activity.rating }}</span>
                      </div>
                      <div class="bg-brand-blue text-white px-2.5 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-md">
                         {{ activity.provider === 'hotelbeds-activities' ? 'Hotelbeds' : 'Amadeus' }}
                      </div>
                    </div>

                    <!-- Duration Badge -->
                    <div v-if="activity.minimumDuration" class="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                       <ClockIcon class="h-3 w-3 text-white" />
                       <span class="text-[10px] font-bold text-white uppercase tracking-wider">{{ activity.minimumDuration }}</span>
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 leading-tight group-hover:text-brand-blue transition-colors line-clamp-1 mb-2">{{ activity.name }}</h3>
                      <p class="text-sm font-medium text-gray-400 line-clamp-2 leading-relaxed">{{ stripHtml(activity.description) }}</p>
                    </div>

                    <div class="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between">
                       <div>
                         <p class="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-0.5">Starting from</p>
                         <p class="text-2xl font-bold text-gray-900 tracking-tighter">
                            <span class="text-sm font-medium text-gray-400 mr-1">{{ activity.currency || 'EUR' }}</span>
                            {{ formatPrice(activity.price) }}
                         </p>
                       </div>
                       <button class="h-12 px-6 bg-brand-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2">
                          View details
                          <ArrowRightIcon class="h-3.5 w-3.5" />
                       </button>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Empty State -->
              <template v-else>
                 <div class="col-span-full py-24 text-center">
                    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                       <FaceFrownIcon class="h-12 w-12" />
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">No activities found</h2>
                    <p class="text-sm font-medium text-gray-400 max-w-sm mx-auto">Try adjusting your filters or search for another destination to find exciting things to do.</p>
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
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute } from '#app'
import { 
  ChevronLeftIcon, 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  AdjustmentsHorizontalIcon,
  StarIcon,
  ClockIcon,
  FaceFrownIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/solid'
import { useSearchActivities } from '@/composables/modules/experiences/useSearchActivities'
import { flightsApi } from '@/api_factory/modules/flights'

const route = useRoute()
const { loading, filteredActivitiesList, filters, searchActivities, activitiesList } = useSearchActivities()

const searchQuery = reactive({
  destinationIata: (route.query.destination as string) || '',
  date: (route.query.date as string) || '',
})

const currentCityName = ref('')
const availableCategories = ['Sightseeing', 'Culture', 'Museums', 'Nature', 'Adventure', 'Food', 'Nightlife']

const formatPrice = (p: any) => {
  const num = parseFloat(p)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const stripHtml = (html: string) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').slice(0, 120)
}

const resetFilters = () => {
  filters.value.categories = []
  filters.value.priceRange = [0, 1000]
  filters.value.rating = 0
}

const goToDetail = (activity: any) => {
  sessionStorage.setItem('selectedActivity', JSON.stringify(activity))
  navigateTo({
    path: `/things-to-do/${activity.experienceId}`,
    query: { provider: activity.provider }
  })
}

const handleSearch = async () => {
    if (!searchQuery.destinationIata) return
    
    loading.value = true
    try {
        // Fix 404: Use flightsApi.searchAirports which is robust
        const response = await flightsApi.searchAirports(searchQuery.destinationIata)
        const data = response.data?.data || response.data || []
        
        if (data?.length > 0) {
           const topHit = data[0]
           currentCityName.value = topHit.name || topHit.address?.cityName
           const lat = topHit.geoCode?.latitude
           const lon = topHit.geoCode?.longitude
           if (lat && lon) {
             await searchActivities({ latitude: lat, longitude: lon, date: searchQuery.date })
             return
           }
        }
        activitiesList.value = []
    } catch (err) {
        console.error('Search failed:', err)
        activitiesList.value = []
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
  if (searchQuery.destinationIata) {
    handleSearch()
  } else {
    // Default fetch for Paris
    currentCityName.value = 'Paris'
    await searchActivities({ latitude: 48.8566, longitude: 2.3522, radius: 30 })
  }
})
</script>

<style scoped>
.activity-list-enter-active,
.activity-list-leave-active {
  transition: all 0.5s ease;
}
.activity-list-enter-from,
.activity-list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.activity-list-move {
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
</style>
