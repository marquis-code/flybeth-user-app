<template>
  <main class="min-h-screen py-16 bg-[#F8FAFC]">
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
              <h1 class="text-lg font-bold text-gray-900 truncate">Car Rentals</h1>
            </div>
          </div>

          <!-- Glass Search Bar -->
          <div class="flex-1 w-full bg-white rounded-2xl p-1.5 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div class="flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div class="w-full sm:flex-1">
                <CityPicker v-model="searchQuery.pickUpLocation" label="Pick-up Location" placeholder="Where to pick up?" class="!bg-transparent" />
              </div>
              <div class="w-full sm:w-56">
                <div class="p-3">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Pick-up Date</label>
                  <input type="date" v-model="searchQuery.pickUpDate" class="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 focus:ring-0" />
                </div>
              </div>
              <div class="w-full sm:w-56">
                <div class="p-3">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Return Date</label>
                  <input type="date" v-model="searchQuery.dropOffDate" class="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 focus:ring-0" />
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
                Filter by
              </h2>
              <button @click="resetFilters" class="text-[11px] font-bold text-brand-blue hover:text-brand-blue/80 uppercase tracking-wider transition-colors">Reset all</button>
           </div>

           <!-- Category Filter -->
           <div class="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 mb-5">Vehicle Category</h3>
              <div class="space-y-3.5">
                 <label v-for="cat in availableCategories" :key="cat" class="flex items-center justify-between cursor-pointer group">
                    <div class="flex items-center gap-3">
                       <input type="checkbox" v-model="filters.categories" :value="cat" class="peer h-5 w-5 rounded-md border-gray-200 text-brand-blue focus:ring-brand-blue/20 transition-all cursor-pointer" />
                       <span class="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{{ cat }}</span>
                    </div>
                 </label>
              </div>
           </div>

           <!-- Transmission Filter -->
           <div class="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 mb-5">Transmission</h3>
              <div class="space-y-3.5">
                 <label v-for="type in ['Automatic', 'Manual']" :key="type" class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" v-model="filters.transmission" :value="type" class="h-5 w-5 rounded-md border-gray-200 text-brand-blue focus:ring-brand-blue/20 transition-all cursor-pointer" />
                    <span class="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{{ type }}</span>
                 </label>
              </div>
           </div>

           <!-- Fuel Type Filter -->
           <div class="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 mb-5">Fuel Type</h3>
              <div class="space-y-3.5">
                 <label v-for="fuel in ['Petrol', 'Electric', 'Diesel', 'Hybrid']" :key="fuel" class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" v-model="filters.fuelTypes" :value="fuel" class="h-5 w-5 rounded-md border-gray-200 text-brand-blue focus:ring-brand-blue/20 transition-all cursor-pointer" />
                    <span class="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{{ fuel }}</span>
                 </label>
              </div>
           </div>

           <!-- Price Range Filter -->
           <div class="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
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
        </aside>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <!-- Results Header -->
          <div class="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 tracking-tight leading-none mb-3">Available Vehicles</h1>
              <p class="text-sm font-medium text-gray-400">Found <span class="text-gray-900 font-bold">{{ filteredCars.length }}</span> rentals in the area.</p>
            </div>
            <div class="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
               <button class="px-4 py-2 bg-gray-50 text-gray-900 rounded-lg text-xs font-bold uppercase tracking-widest">Sort by: Recommended</button>
            </div>
          </div>

          <!-- Car List -->
          <div class="space-y-6 relative min-h-[400px]">
            <TransitionGroup name="car-list">
              <!-- Loading Skeleton -->
              <template v-if="loading">
                <div v-for="i in 3" :key="`skeleton-${i}`" class="bg-white rounded-[2.5rem] p-6 border border-gray-100 h-64 animate-pulse">
                  <div class="flex flex-col md:flex-row gap-8 h-full">
                    <div class="w-full md:w-80 h-full bg-gray-50 rounded-[2rem]" />
                    <div class="flex-1 space-y-4 py-2">
                       <div class="h-8 w-1/3 bg-gray-50 rounded-lg" />
                       <div class="h-4 w-1/4 bg-gray-50 rounded-lg" />
                       <div class="grid grid-cols-4 gap-4 mt-8">
                          <div v-for="j in 4" :key="j" class="h-10 bg-gray-50 rounded-xl" />
                       </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Results -->
              <template v-else-if="filteredCars.length > 0">
                <CarCard 
                  v-for="car in filteredCars" 
                  :key="car._id || car.id" 
                  :car="car"
                  @select="selectCar" 
                />
              </template>

              <!-- Empty State -->
              <template v-else>
                 <div class="py-24 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                    <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                       <FaceFrownIcon class="h-12 w-12" />
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">No cars found</h2>
                    <p class="text-sm font-medium text-gray-400 max-w-sm mx-auto">Try adjusting your filters or search for another location to find available vehicles.</p>
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
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from '#app'
import { 
  ChevronLeftIcon, 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  FaceFrownIcon
} from '@heroicons/vue/24/solid'
import { useSearchCars } from '@/composables/modules/cars/useSearchCars'

const route = useRoute()
const { loading, filteredCars, filters, searchCars } = useSearchCars()

const searchQuery = reactive({
  pickUpLocation: (route.query.pickUpLocation || route.query.location) as string || '',
  pickUpDate: (route.query.pickUpDate || route.query.date) as string || '',
  dropOffDate: (route.query.dropOffDate) as string || '',
  type: 'rental'
})

const availableCategories = ['Economy', 'Compact', 'Intermediate', 'SUV', 'Luxury', 'Van']

const resetFilters = () => {
  filters.value.categories = []
  filters.value.transmission = []
  filters.value.fuelTypes = []
  filters.value.priceRange = [0, 1000]
}

const handleSearch = async () => {
  if (!searchQuery.pickUpLocation) return
  await searchCars(searchQuery)
}

const selectCar = (car: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'car',
      id: car._id || car.id,
      name: `${car.name} (${car.category})`,
      price: car.pricing?.basePrice || car.price
    }
  })
}

onMounted(() => {
  if (!searchQuery.pickUpLocation) {
    const today = new Date()
    const futureDate = new Date(today.setDate(today.getDate() + 14)).toISOString().split('T')[0]
    const dropOffDate = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0]
    
    searchQuery.pickUpLocation = 'Dubai International Airport (DXB)'
    searchQuery.pickUpDate = futureDate
    searchQuery.dropOffDate = dropOffDate
  } else if (!searchQuery.dropOffDate && searchQuery.pickUpDate) {
    const d = new Date(searchQuery.pickUpDate)
    d.setDate(d.getDate() + 2)
    searchQuery.dropOffDate = d.toISOString().split('T')[0]
  }
  
  handleSearch()
})
</script>

<style scoped>
.car-list-enter-active,
.car-list-leave-active {
  transition: all 0.5s ease;
}
.car-list-enter-from,
.car-list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.car-list-move {
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

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
