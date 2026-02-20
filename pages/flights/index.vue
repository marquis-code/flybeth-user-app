<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-6 sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-end">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <LocationPicker v-model="searchQuery.origin" placeholder="From where?" id="flights-origin" class="text-sm" />
            <LocationPicker v-model="searchQuery.destination" placeholder="To where?" id="flights-dest" class="text-sm" />
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black px-1 opacity-70 font-header block">Dates</label>
              <UiBaseInput v-model="searchQuery.departureDate" type="date" placeholder="Dates" class="text-sm !py-5 !rounded-[1.5rem]" />
            </div>
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black px-1 opacity-70 font-header block">Travelers</label>
              <UiBaseInput v-model="searchQuery.passengers" type="number" placeholder="1 traveler" class="text-sm !py-5 !rounded-[1.5rem]" />
            </div>
        </div>
        <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-10 mb-1">Search</UiBaseButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 class="font-bold text-gray-900 mb-4">Filter by</h3>
            
            <!-- Stops -->
            <div class="mb-6">
              <h4 class="font-medium text-sm text-gray-700 mb-2">Stops</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Nonstop</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">1 Stop</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">2+ Stops</span>
                </label>
              </div>
            </div>

            <!-- Airlines -->
            <div>
              <h4 class="font-medium text-sm text-gray-700 mb-2">Airlines</h4>
                <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Emirates</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">British Airways</span>
                </label>
                 <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Qatar Airways</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
           <h2 v-if="flights.length" class="text-xl font-bold text-gray-900 mb-4">{{ flights.length }} flights found</h2>
           
           <div v-if="loading" class="space-y-4">
             <div v-for="i in 3" :key="i" class="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
           </div>

           <EmptyState 
             v-else-if="!flights.length"
             variant="flights"
             title="No flights found"
             message="We couldn't find flights matching your search. Try different airports or dates to discover amazing routes."
             actionLabel="Explore Popular Routes"
             @action="searchQuery.origin = 'LHR'; searchQuery.destination = 'DXB'; handleSearch();"
           />

           <FlightCard 
             v-for="flight in displayedFlights" 
             :key="flight._id || flight.id" 
             :flight="flight"
             @select="selectFlight" 
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSearchFlights } from '@/composables/modules/flights/useSearchFlights';
import { useFetchPopularFlights } from '@/composables/modules/flights/useFetchPopularFlights';

const { loading, flights, searchFlights } = useSearchFlights();
const { popularFlights, fetchPopularFlights } = useFetchPopularFlights();

const displayedFlights = computed(() => {
  const source = flights.value?.length ? flights.value : (popularFlights.value || []);
  return source.filter((f: any) => f != null);
});

const searchQuery = ref({
  origin: '',
  destination: '',
  departureDate: '',
  passengers: 1
});

const handleSearch = () => {
  searchFlights(searchQuery.value);
};

const selectFlight = (flight: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'flight',
      id: flight._id || flight.id,
      name: flight.flightNumber || `${flight.airline?.name} flight`,
      price: flight.pricing?.baseRate || flight.price?.amount
    }
  });
}

onMounted(() => {
  const route = useRoute();
  // If no search params are in the URL, provide creative defaults
  if (!route.query.origin && !route.query.destination) {
    searchQuery.value = {
      origin: 'LHR', // London Heathrow
      destination: 'DXB', // Dubai International
      departureDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
      passengers: 1
    };
    handleSearch();
  } else {
    // Sync query params to state if they exist
    if (route.query.origin) searchQuery.value.origin = String(route.query.origin);
    if (route.query.destination) searchQuery.value.destination = String(route.query.destination);
    if (route.query.departureDate) searchQuery.value.departureDate = String(route.query.departureDate);
    if (route.query.passengers) searchQuery.value.passengers = parseInt(String(route.query.passengers)) || 1;
    handleSearch();
  }
  fetchPopularFlights();
});
</script>
