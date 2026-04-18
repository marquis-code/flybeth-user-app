<template>
  <div class="bg-[#F8FAFC] min-h-screen py-12">
    <!-- Search Bar - Scrolls with page (not sticky) -->
    <div class="bg-white py-6 ">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-grow grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
              <LocationPicker v-model="searchQuery.origin" placeholder="From where?" id="flights-origin" class="text-xs font-medium rounded-xl border border-gray-100 bg-gray-50/50" />
              <LocationPicker v-model="searchQuery.destination" placeholder="To where?" id="flights-dest" class="text-xs font-medium rounded-xl border border-gray-100 bg-gray-50/50" />
              <div>
                <UiAnimatedInput v-model="searchQuery.departureDate" type="date" label="Departure" placeholder="Select Date" class="!py-0 border border-gray-100 bg-gray-50/50 rounded-xl" />
              </div>
              <div>
                <UiAnimatedInput v-model="searchQuery.passengers" type="number" label="Travelers" placeholder="1 traveler" class="!py-0 border border-gray-100 bg-gray-50/50 rounded-xl" />
              </div>
          </div>
          <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-10 mb-0.5 font-bold rounded-xl tracking-widest text-[10px]  whitespace-nowrap bg-gray-900 hover:bg-black">Search</UiBaseButton>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Trip Purpose Prediction Badge -->
      <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 translateY(-10px)" enter-to-class="opacity-100 translateY(0)" leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100 translateY(0)" leave-to-class="opacity-0 translateY(-10px)">
        <div v-if="prediction && !purposeLoading" class="mb-8 rounded-2xl p-5 flex items-center justify-between bg-gray-100/60">
          <div class="flex items-center gap-5">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gray-900">
               <BriefcaseIcon v-if="prediction.result === 'BUSINESS'" class="w-5 h-5" />
               <SunIcon v-else class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[11px] font-bold mt-4  tracking-[0.2em] text-gray-500">
                {{ prediction.result === 'BUSINESS' ? 'Business Intelligence' : 'Leisure Mode' }}
              </p>
              <p class="text-[11px] font-bold mt-0.5 opacity-60 text-gray-800">
                 {{ prediction.result === 'BUSINESS' ? 'Optimizing results for corporate efficiency and comfort.' : 'Discovering the best vacation routes and local experiences.' }}
              </p>
            </div>
          </div>
          <div class="hidden sm:block">
             <NuxtLink v-if="prediction.result !== 'BUSINESS'" to="/things-to-do" class="text-[10px] font-black  tracking-widest px-5 py-2.5 bg-white rounded-xl hover:bg-gray-50 transition-all text-gray-600 ">
               Explore Experiences
             </NuxtLink>
             <span v-else class="text-[10px] font-black tracking-widest  text-gray-400 opacity-60 px-4 py-2 rounded-xl bg-white ">Smart Match</span>
          </div>
        </div>
      </transition>

      <!-- Best Fares Quick View -->
      <div v-if="displayedFlights.length" class="mb-10 overflow-x-auto pb-2">
        <div class="flex gap-4 min-w-max">
          <div v-for="type in ['Cheapest', 'Fastest', 'Recommended']" :key="type" 
            class="flex-1 bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-900 transition-all duration-500 min-w-[240px] cursor-pointer group">
            <p class="text-[10px] font-bold text-gray-400  tracking-widest">{{ type }} Fare</p>
            <div class="flex items-end justify-between mt-2">
              <span class="text-2xl font-black text-gray-900 tracking-tighter">${{ getMatrixPrice(type) }}</span>
              <div :class="getMatrixColor(type)" class="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-all">
                 <component :is="getMatrixIcon(type)" class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Airline vs Stops Matrix -->
      <div v-if="displayedFlights.length && airlineMeta.length" class="mb-10 bg-white rounded-2xl  overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/60">
                <th class="p-5 min-w-[120px]"></th>
                <th v-for="airline in airlineMeta" :key="airline.name" class="p-5 min-w-[150px] text-center">
                  <div class="h-9 w-9 rounded-lg bg-white p-1.5 ">
                    <img v-if="airline.logo" :src="airline.logo" :alt="airline.name" class="h-full w-full object-contain" />
                    <div v-else class="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                       <span class="text-gray-900 font-bold text-xs ">{{ airline.name.slice(0, 2) }}</span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stopLabel in ['Non stop', '1 Stop', '1+ Stops']" :key="stopLabel" class="hover:bg-gray-50/40 transition-colors">
                <td class="p-5 font-black text-gray-400  tracking-widest text-[10px]">
                  {{ stopLabel }}
                </td>
                <td v-for="airline in airlineMeta" :key="airline.name" class="p-5 text-center cursor-pointer hover:bg-gray-100 transition-colors rounded-lg" @click="filterByMatrix(airline.name, stopLabel)">
                  <span v-if="getMatrixPriceFor(airline.name, stopLabel)" class="text-xs font-black text-gray-900 tracking-wider">
                    ${{ getMatrixPriceFor(airline.name, stopLabel) }}
                  </span>
                  <span v-else class="text-gray-200">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
             <div class="bg-white p-8 rounded-2xl border border-gray-100 sticky top-24 lg:h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
            <h3 class="font-bold text-gray-900  tracking-widest text-[10px] mb-8 pb-3 border-b border-gray-100">Filter Results</h3>
            
            <!-- Stops -->
            <div class="mb-8">
              <h4 class="font-bold text-sm text-gray-400  tracking-widest mb-5 ">Stops</h4>
              <div class="space-y-3.5">
                <label v-for="stop in ['Nonstop', '1 Stop', '2+ Stops']" :key="stop" class="flex items-center group cursor-pointer">
                  <div class="w-4.5 h-4.5 rounded-md border border-gray-200 group-hover:border-gray-900 transition-all flex items-center justify-center">
                     <div class="w-2 h-2 bg-gray-900 rounded-sm scale-0 transition-transform"></div>
                  </div>
                  <span class="ml-3 text-[11px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors  tracking-wider">{{ stop }}</span>
                </label>
              </div>
            </div>

            <!-- Airlines -->
            <div>
              <h4 class="font-bold text-sm text-gray-400  tracking-widest mb-5 ">Airlines</h4>
                <div class="space-y-3.5">
                <label v-for="airline in ['Emirates', 'British Airways', 'Qatar Airways', 'Turkish Airlines']" :key="airline" class="flex items-center group cursor-pointer">
                  <div class="w-4.5 h-4.5 rounded-md border border-gray-200 group-hover:border-gray-900 transition-all flex items-center justify-center">
                     <div class="w-2 h-2 bg-gray-900 rounded-sm scale-0 transition-transform"></div>
                  </div>
                  <span class="ml-3 text-[11px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors  tracking-wider">{{ airline }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
           <div class="flex items-center justify-between mb-6 px-1">
             <h2 v-if="flights.length" class="text-[10px] font-bold text-gray-400  tracking-[0.2em] ">{{ flights.length }} flights found</h2>
             <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold text-gray-400  tracking-widest ">Sort by:</span>
                <select class="bg-gray-50/50 rounded-xl px-4 py-2 text-[10px] font-bold text-gray-600 focus:ring-1 focus:ring-gray-900 border border-gray-100">
                  <option>Price (Low to High)</option>
                  <option>Duration (Shortest)</option>
                </select>
             </div>
           </div>
           
           <div v-if="loading" class="py-12">
             <LoadingState />
           </div>

           <EmptyState 
             v-else-if="!flights.length"
             variant="flights"
             title="No flights found"
             message="We couldn't find flights matching your search. Try different airports or dates to discover amazing routes."
             actionLabel="Explore Popular Routes"
             @action="searchQuery.origin = 'LHR'; searchQuery.destination = 'DXB'; handleSearch();"
           />

           <div v-if="Object.keys(groupedFlights).length" class="space-y-5">
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
definePageMeta({
  layout: 'no-footer'
})
import { ref, onMounted, computed } from 'vue';
import { useSearchFlights } from '@/composables/modules/flights/useSearchFlights';
import { useFetchPopularFlights } from '@/composables/modules/flights/useFetchPopularFlights';
import { useTripPurpose } from '@/composables/modules/flights/useTripPurpose';
import { Banknote as BanknotesIcon, Zap as BoltIcon, Star as StarIcon, Briefcase as BriefcaseIcon, Sun as SunIcon } from 'lucide-vue-next';
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
  if (type === 'Cheapest') return 'bg-gray-400'
  if (type === 'Fastest') return 'bg-gray-600'
  return 'bg-gray-900'
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
  const element = document.getElementById(`group-${airline}`)
  if (element) {
    window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' })
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
  if (!flight) return;

  // Safely store the flight offer for the checkout pricing step
  try {
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
  } catch (e) {
    console.warn('Could not store flight in session:', e);
  }

  // Determine provider: check the flight object, fallback to 'duffel'
  const provider = flight.provider || flight.source || (flight.slices ? 'duffel' : (flight.itineraries ? 'amadeus' : 'duffel'));

  navigateTo({
    path: '/checkout',
    query: {
      type: 'flight',
      id: String(flight.offerId || flight._id || flight.id || 'unknown'),
      name: String((flight.flightNumbers && flight.flightNumbers[0]) || flight.flightNumber || `${flight.airline || 'Unknown'} flight`),
      price: String(flight.priceWithCommission || flight.price || 0),
      provider: provider
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
