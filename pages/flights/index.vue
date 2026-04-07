<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-6 sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-end">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <LocationPicker v-model="searchQuery.origin" placeholder="From where?" id="flights-origin" class="text-sm" />
            <LocationPicker v-model="searchQuery.destination" placeholder="To where?" id="flights-dest" class="text-sm" />
            <div class="space-y-2">
              <UiAnimatedInput v-model="searchQuery.departureDate" type="date" label="Departure Date" placeholder="Select Date" class="!py-0" />
            </div>
            <div class="space-y-2">
              <UiAnimatedInput v-model="searchQuery.passengers" type="number" label="Travelers" placeholder="1 traveler" class="!py-0" />
            </div>
        </div>
        <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-10 mb-1">Search</UiBaseButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Trip Purpose Prediction Badge -->
      <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 translateY(-10px)" enter-to-class="opacity-100 translateY(0)" leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100 translateY(0)" leave-to-class="opacity-0 translateY(-10px)">
        <div v-if="prediction && !purposeLoading" class="mb-6 rounded-2xl p-4 flex items-center justify-between shadow-sm border" :class="prediction.result === 'BUSINESS' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md" :class="prediction.result === 'BUSINESS' ? 'bg-indigo-500' : 'bg-orange-500'">
               <BriefcaseIcon v-if="prediction.result === 'BUSINESS'" class="w-5 h-5" />
               <SunIcon v-else class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-bold" :class="prediction.result === 'BUSINESS' ? 'text-indigo-900' : 'text-orange-900'">
                 {{ prediction.result === 'BUSINESS' ? 'Looks like a Business Trip!' : 'Planning a Leisure Getaway?' }}
              </p>
              <p class="text-xs mt-0.5 opacity-80" :class="prediction.result === 'BUSINESS' ? 'text-indigo-800' : 'text-orange-800'">
                 {{ prediction.result === 'BUSINESS' ? 'Check out our Premium and Business class fares for maximum comfort.' : 'Don\'t forget to book some unforgettable Activities and Experiences!' }}
              </p>
            </div>
          </div>
          <div class="hidden sm:block">
             <NuxtLink v-if="prediction.result !== 'BUSINESS'" to="/things-to-do" class="text-xs font-bold px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition-all" :class="'text-orange-600'">
               Explore Activities
             </NuxtLink>
             <span v-else class="text-sm  tracking-widest uppercase text-indigo-400 opacity-60 px-2 py-1 bg-white/50 rounded-md">Smart Prediction</span>
          </div>
        </div>
      </transition>

      <!-- Airline vs Stops Matrix -->
      <div v-if="displayedFlights.length && airlineMeta.length" class="mb-10 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="p-6 border-b border-gray-100 min-w-[140px]"></th>
                <th v-for="airline in airlineMeta" :key="airline.name" class="p-6 border-b border-gray-100 min-w-[160px] text-center">
                  <div class="flex flex-col items-center gap-2">
                    <img v-if="airline.logo" :src="airline.logo" :alt="airline.name" class="h-8 w-8 object-contain" />
                    <span class="text-sm  text-gray-900 uppercase tracking-widest">{{ airline.name }}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stopLabel in ['Non stop', '1 Stop', '1+ Stops']" :key="stopLabel">
                <td class="p-6 border-b border-gray-50  text-gray-900 uppercase tracking-widest text-sm bg-gray-50/20">
                  {{ stopLabel }}
                </td>
                <td v-for="airline in airlineMeta" :key="airline.name" class="p-6 border-b border-gray-50 text-center group cursor-pointer hover:bg-brand-blue/5 transition-colors" @click="filterByMatrix(airline.name, stopLabel)">
                  <span v-if="getMatrixPriceFor(airline.name, stopLabel)" class="text-sm  text-brand-gray/60 group-hover:text-gray-900 transition-colors">
                    ${{ getMatrixPriceFor(airline.name, stopLabel) }}
                  </span>
                  <span v-else class="text-gray-200">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Best Fares Matrix (Quick view) -->
      <div v-if="displayedFlights.length" class="mb-10 overflow-x-auto pb-4">
        <div class="flex gap-4 min-w-max">
          <div v-for="type in ['Cheapest', 'Fastest', 'Recommended']" :key="type" 
            class="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 min-w-[240px]">
            <p class="text-sm  text-brand-gray/40 uppercase tracking-widest mb-1">{{ type }} Fare</p>
            <div class="flex items-end justify-between">
              <span class="text-2xl  text-gray-900">${{ getMatrixPrice(type) }}</span>
              <div :class="getMatrixColor(type)" class="w-8 h-8 rounded-full flex items-center justify-center">
                 <component :is="getMatrixIcon(type)" class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32 lg:h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
            <h3 class=" text-gray-900 uppercase tracking-widest text-xs mb-8">Filter Results</h3>
            
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

           <div v-if="Object.keys(groupedFlights).length" class="space-y-6">
             <FlightGroup 
               v-for="(group, airlineName) in groupedFlights" 
               :key="airlineName"
               :id="`group-${airlineName}`"
               :airlineName="String(airlineName)"
               :airlineLogo="group[0].airlineLogo"
               :flights="group"
               @select="selectFlight"
             />
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSearchFlights } from '@/composables/modules/flights/useSearchFlights';
import { useFetchPopularFlights } from '@/composables/modules/flights/useFetchPopularFlights';
import { useTripPurpose } from '@/composables/modules/flights/useTripPurpose';
import { BanknotesIcon, BoltIcon, StarIcon, BriefcaseIcon, SunIcon } from '@heroicons/vue/24/solid';
import FlightGroup from '@/components/FlightGroup.vue';

const { loading, flights, searchFlights } = useSearchFlights();
const { popularFlights, fetchPopularFlights } = useFetchPopularFlights();
const { loading: purposeLoading, prediction, predictTripPurpose } = useTripPurpose();

const displayedFlights = computed(() => {
  const source = flights.value?.length ? flights.value : (popularFlights.value || []);
  if (!Array.isArray(source)) return [];
  return source.filter((f: any) => f != null);
});

const groupedFlights = computed(() => {
  const source = displayedFlights.value;
  if (!Array.isArray(source)) return {};
  
  return source.reduce((groups: any, flight: any) => {
    const airline = flight.airline || 'Other';
    if (!groups[airline]) {
      groups[airline] = [];
    }
    groups[airline].push(flight);
    return groups;
  }, {});
});

const getMatrixPrice = (type: string) => {
  if (!displayedFlights.value.length) return '—'
  if (type === 'Cheapest') {
    return Math.min(...displayedFlights.value.map((f: any) => f.priceWithCommission || f.price)).toLocaleString()
  }
  if (type === 'Fastest') {
    const fastest = [...displayedFlights.value].sort((a: any, b: any) => (a.duration || 9999) - (b.duration || 9999))[0]
    return (fastest.priceWithCommission || fastest.price).toLocaleString()
  }
  return (displayedFlights.value[0].priceWithCommission || displayedFlights.value[0].price).toLocaleString()
}

const getMatrixIcon = (type: string) => {
  if (type === 'Cheapest') return BanknotesIcon
  if (type === 'Fastest') return BoltIcon
  return StarIcon
}

const getMatrixColor = (type: string) => {
  if (type === 'Cheapest') return 'bg-brand-green'
  if (type === 'Fastest') return 'bg-brand-orange'
  return 'bg-brand-blue'
}

const airlineMeta = computed(() => {
  const airlines = Object.keys(groupedFlights.value)
  return airlines.slice(0, 5).map(name => ({
    name,
    logo: groupedFlights.value[name][0].airlineLogo
  }))
})

const getMatrixPriceFor = (airline: string, stopsLabel: string) => {
  const stopCount = stopsLabel === 'Non stop' ? 0 : (stopsLabel === '1 Stop' ? 1 : 2)
  const flights = groupedFlights.value[airline] || []
  const filtered = flights.filter((f: any) => {
    if (stopCount === 2) return (f.stops || 0) >= 2
    return (f.stops || 0) === stopCount
  })
  if (!filtered.length) return null
  return Math.min(...filtered.map((f: any) => f.priceWithCommission || f.price)).toLocaleString()
}

const filterByMatrix = (airline: string, stopsLabel: string) => {
  // Logic to filter the list or scroll to the group
  const element = document.getElementById(`group-${airline}`)
  if (element) {
    window.scrollTo({ top: element.offsetTop - 150, behavior: 'smooth' })
  }
}

const searchQuery = ref({
  origin: '',
  destination: '',
  departureDate: '',
  passengers: 1
});

const handleSearch = () => {
  searchFlights(searchQuery.value);
  predictTripPurpose({
    origin: searchQuery.value.origin,
    destination: searchQuery.value.destination,
    departureDate: searchQuery.value.departureDate
  });
};

const selectFlight = (flight: any) => {
  // Save the full offer for the pricing step
  sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
  
  navigateTo({
    path: '/checkout',
    query: {
      type: 'flight',
      id: flight.offerId || flight._id || flight.id,
      name: (flight.flightNumbers && flight.flightNumbers[0]) || flight.flightNumber || `${flight.airline || 'Unknown'} flight`,
      price: flight.priceWithCommission || flight.price,
      provider: flight.provider
    }
  });
}

onMounted(() => {
  const route = useRoute();
  // If no search params are in the URL, provide creative defaults
  if (!route.query.origin && !route.query.destination) {
    searchQuery.value = {
      origin: 'LHR',
      destination: 'DXB',
      departureDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
      passengers: 1
    };
    handleSearch();
  } else {
  if (route.query.origin) searchQuery.value.origin = String(route.query.origin);
  if (route.query.destination) searchQuery.value.destination = String(route.query.destination);
  if (route.query.departureDate) searchQuery.value.departureDate = String(route.query.departureDate);
  if (route.query.passengers) searchQuery.value.passengers = parseInt(String(route.query.passengers)) || 1;
  handleSearch();
  }
  fetchPopularFlights();
});
</script>
