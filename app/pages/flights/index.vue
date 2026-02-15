<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white shadow-sm border-b border-gray-200 py-4 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <UiBaseInput placeholder="From where?" icon="paper-airplane" class="text-sm" />
             <UiBaseInput placeholder="To where?" icon="location-marker" class="text-sm" />
            <UiBaseInput type="date" placeholder="Dates" class="text-sm" />
            <UiBaseInput placeholder="1 traveler" class="text-sm" />
        </div>
        <UiBaseButton>Search</UiBaseButton>
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
                  <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Nonstop</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">1 Stop</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">2+ Stops</span>
                </label>
              </div>
            </div>

            <!-- Airlines -->
            <div>
              <h4 class="font-medium text-sm text-gray-700 mb-2">Airlines</h4>
                <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Emirates</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">British Airways</span>
                </label>
                 <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Qatar Airways</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
           <h2 class="text-xl font-bold text-gray-900 mb-4">{{ flights.length }} flights found</h2>
           
           <FlightCard 
             v-for="flight in flights" 
             :key="flight.id" 
             :flight="flight"
             @select="selectFlight" 
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const flights = ref([
  {
    id: 1,
    airline: { name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png' },
    price: { amount: 850 },
    departure: { time: '10:00 AM', airport: 'DXB' },
    arrival: { time: '02:00 PM', airport: 'LHR' },
    duration: '7h 00m',
    stops: 0
  },
  {
    id: 2,
    airline: { name: 'British Airways', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/British_Airways_Logo.svg/1200px-British_Airways_Logo.svg.png' },
    price: { amount: 720 },
    departure: { time: '11:30 AM', airport: 'DXB' },
    arrival: { time: '04:00 PM', airport: 'LHR' },
    duration: '7h 30m',
    stops: 0
  },
  {
    id: 3,
    airline: { name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/1200px-Qatar_Airways_Logo.svg.png' },
    price: { amount: 650 },
    departure: { time: '08:00 AM', airport: 'DXB' },
    arrival: { time: '03:30 PM', airport: 'LHR' },
    duration: '9h 30m',
    stops: 1
  }
])

const selectFlight = (id: number) => {
  const flight = flights.value.find(f => f.id === id)
  navigateTo({
    path: '/checkout',
    query: {
      type: 'flight',
      id: flight?.id,
      name: `${flight?.airline.name} to ${flight?.arrival.airport}`,
      price: flight?.price.amount
    }
  })
}
</script>
