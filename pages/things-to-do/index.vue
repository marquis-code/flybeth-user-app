<template>
  <main class="min-h-screen bg-gray-50/50">
    <!-- Header Map / Search -->
    <div class="bg-brand-blue sticky top-0 z-40 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <NuxtLink to="/" class="shrink-0 text-white/60 hover:text-white transition-colors p-2 -ml-2 self-start sm:self-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div class="flex-1 w-full bg-white/10 rounded-2xl p-2 sm:p-3 backdrop-blur-md border border-white/20">
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1 min-w-0">
                <CityPicker v-model="searchQuery.destinationIata" :label="'Destination'" />
              </div>
              <div class="w-full sm:w-64 shrink-0">
                <FlightDateRangePicker :departure="searchQuery.date" mode="oneway" @update:departure="(v) => searchQuery.date = v" />
              </div>
              <button
                @click="handleSearch"
                :disabled="loading"
                class="w-full sm:w-auto px-8 py-3 bg-white text-brand-blue rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-50 flex items-center justify-center gap-2 transition-all disabled:opacity-80"
              >
                <div v-if="loading" class="animate-spin h-4 w-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full"></div>
                <span>{{ loading ? 'Searching...' : 'Search' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row gap-8">
      
      <!-- Filters Sidebar (Placeholder for future) -->
      <div class="lg:w-72 shrink-0 hidden lg:block">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-[140px]">
           <h3 class="font-black text-brand-blue uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand-blue/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
             </svg>
             Filters
           </h3>
           <p class="text-xs text-brand-gray/60 font-medium">Coming soon</p>
        </div>
      </div>

      <!-- Main Results Column -->
      <div class="flex-1 min-w-0">
        
        <div v-if="!loading && activitiesList.length > 0" class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black text-brand-blue">Things to do</h2>
            <p class="text-sm font-medium text-brand-gray/60 mt-1">Found {{ activitiesList.length }} activities</p>
          </div>
        </div>

        <!-- Layout for Results -->
        <div class="space-y-4">
          
          <template v-if="loading">
             <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-gray-100 p-4 h-[200px] animate-pulse">
               <div class="flex flex-col sm:flex-row gap-6 h-full">
                 <div class="w-full sm:w-[240px] h-48 sm:h-full bg-gray-100 rounded-xl shrink-0" />
                 <div class="flex-1 py-2 flex flex-col justify-between">
                    <div class="space-y-3">
                       <div class="h-6 w-3/4 bg-gray-100 rounded-lg" />
                       <div class="h-4 w-1/4 bg-gray-100 rounded-lg" />
                       <div class="h-3 w-1/2 bg-gray-100 rounded-lg" />
                    </div>
                 </div>
               </div>
             </div>
          </template>

          <template v-else-if="activitiesList.length > 0">
             <div v-for="(activity, idx) in activitiesList" :key="activity.experienceId || idx" 
                  class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group">
                
                <!-- Activity Image -->
                <div class="sm:w-[280px] h-[200px] sm:h-auto shrink-0 relative overflow-hidden bg-gray-100">
                  <div class="absolute inset-0 bg-brand-blue/5 animate-pulse" v-if="!activity.photos?.[0]"></div>
                  <img v-if="activity.photos?.[0]" :src="activity.photos[0]" alt="" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  
                  <div v-if="activity.rating" class="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="text-xs font-black text-brand-blue">{{ activity.rating }}</span>
                  </div>
                </div>

                <!-- Activity Details -->
                <div class="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
                   <div>
                     <p class="text-sm font-black uppercase tracking-widest text-brand-gray/40 mb-2">Amadeus Activity</p>
                     <h3 class="text-lg sm:text-xl font-black text-brand-blue leading-tight mb-2 group-hover:text-brand-blue/80 transition-colors">
                        {{ activity.name }}
                     </h3>
                     <p class="text-sm font-medium text-brand-gray/70 leading-relaxed line-clamp-2">
                        {{ activity.shortDescription || activity.description || 'No description available for this activity.' }}
                     </p>
                   </div>
                   
                   <div class="mt-6 pt-5 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                       <p class="text-sm font-black uppercase tracking-widest text-brand-gray/40">From</p>
                       <div class="flex items-baseline gap-1">
                         <span class="text-xs font-bold text-brand-blue/60">{{ activity.currency || 'USD' }}</span>
                         <span class="text-2xl font-black text-brand-blue">{{ formatPrice(activity.price) }}</span>
                       </div>
                     </div>
                     <a v-if="activity.bookingLink" :href="activity.bookingLink" target="_blank" class="px-8 py-3.5 bg-brand-blue text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-brand-blue/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center">
                       Book Now
                     </a>
                     <button v-else disabled class="px-8 py-3.5 bg-gray-100 text-gray-400 rounded-xl font-black text-sm uppercase tracking-wider cursor-not-allowed">
                       Unavailable
                     </button>
                   </div>
                </div>

             </div>
          </template>

          <template v-else>
             <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-brand-blue/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <h3 class="text-xl font-black text-brand-blue mb-2">No things to do found</h3>
                <p class="text-sm font-medium text-brand-gray/60 max-w-sm mx-auto">
                  We couldn't find any activities or tours for this destination. Try searching for a different city or removing filters.
                </p>
             </div>
          </template>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRoute } from '#app'
import { useSearchActivities } from '@/composables/modules/experiences/useSearchActivities'
import { useCitySearch } from '@/composables/modules/experiences/useCitySearch'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

const route = useRoute()
const { loading, activitiesList, searchActivities } = useSearchActivities()

const rawRouteDest = (route.query.destination as string) || ''
const searchQuery = reactive({
  destinationIata: rawRouteDest,
  date: (route.query.date as string) || '',
  // Default parsing for city lookup happens in setup
})

const formatPrice = (p: any) => {
  const num = parseFloat(p)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleSearch = async () => {
    // If we have an IATA/Keyword from CityPicker but need coordinates:
    // the backend requires latitude/longitude.
    // If the widget passes "PAR" we must query /cities/search, get lat/lon, and then proxy to activities
    if (!searchQuery.destinationIata) return
    
    loading.value = true
    try {
        const { data } = await GATEWAY_ENDPOINT.get('/airports/cities/search', {
            params: {
                q: searchQuery.destinationIata,
                limit: 1
            }
        })
        
        if (data?.length > 0) {
           const topHit = data[0]
           const lat = topHit.geoCode?.latitude
           const lon = topHit.geoCode?.longitude
           if (lat && lon) {
             await searchActivities({ latitude: lat, longitude: lon, date: searchQuery.date })
             return
           }
        }
        
        // Fallback or empty if not found
        activitiesList.value = []
    } catch (err) {
        console.error('Search failed mapping city to coordinates:', err)
        activitiesList.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => {
  if (searchQuery.destinationIata) {
    handleSearch()
  }
})
</script>
