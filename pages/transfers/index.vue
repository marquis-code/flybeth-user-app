<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-6 sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-end">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <LocationPicker v-model="searchQuery.origin" label="From" placeholder="Airport, City, etc." id="transfer-from" class="text-sm" />
            <LocationPicker v-model="searchQuery.destination" label="To" placeholder="Destination" id="transfer-to" class="text-sm" />
            <div class="space-y-2">
              <UiAnimatedInput v-model="searchQuery.date" type="date" label="Pickup Date" class="!py-0" />
            </div>
            <div class="space-y-2">
              <UiAnimatedInput v-model="searchQuery.time" type="time" label="Pickup Time" class="!py-0" />
            </div>
        </div>
        <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-10 mb-1">Search</UiBaseButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters (Simplified for now) -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 class="font-black text-brand-blue mb-4">Transfer Type</h3>
            <div class="space-y-3">
              <label v-for="type in ['Private', 'Shared', 'Luxury']" :key="type" class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" class="custom-checkbox" />
                <span class="text-sm font-bold text-brand-gray group-hover:text-brand-blue transition-colors">{{ type }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
          <div v-if="transfers.length" class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-black text-brand-blue tracking-tighter">{{ transfers.length }} transfers available</h2>
            <div class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-brand-gray/40">
              SORT BY: <span class="text-brand-blue">RECOMMENDED</span>
            </div>
          </div>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-48 bg-white animate-pulse rounded-3xl border border-gray-100"></div>
          </div>

          <EmptyState 
            v-else-if="!transfers.length"
            variant="transfers"
            title="No transfers found"
            message="We couldn't find transfers for this route. Try searching for a different pickup or drop-off location."
            actionLabel="Back to Home"
            @action="navigateTo('/')"
          />

          <TransferCard 
            v-for="transfer in transfers" 
            :key="transfer.id" 
            :transfer="transfer"
            @select="selectTransfer" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSearchTransfers } from '@/composables/modules/transfers/useSearchTransfers'
import TransferCard from '@/components/TransferCard.vue'

const { loading, transfers, searchTransfers } = useSearchTransfers()

const searchQuery = ref({
  origin: '',
  destination: '',
  date: '',
  time: '',
  adults: 1
})

const handleSearch = () => {
  // Construct payload expected by Amadeus transfers
  const [lat, lng] = searchQuery.value.destination.split(',').map(s => s.trim())
  
  const payload: any = {
    startLocationCode: searchQuery.value.origin.includes('(') 
      ? (searchQuery.value.origin.split('(')[1]?.replace(')', '') || searchQuery.value.origin)
      : searchQuery.value.origin,
    endCityName: searchQuery.value.destination,
    startDateTime: `${searchQuery.value.date}T${searchQuery.value.time || '10:00'}:00`,
    passengers: Number(searchQuery.value.adults) || 1,
    transferType: 'PRIVATE'
  }

  // If destination is a coord fallback
  if (lat && lng && !isNaN(Number(lat))) {
    payload.endGeoCode = `${lat},${lng}`
    // If we only have coordinates, fake a city name so API has something printable
    payload.endCityName = 'Destination'
  }

  searchTransfers(payload)
}

const selectTransfer = (transfer: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'transfer',
      id: transfer.offerId || transfer.id,
      name: `${transfer.vehicleDescription || transfer.vehicle_name} - ${transfer.provider}`,
      price: String(transfer.price || 0),
      currency: String(transfer.currency || 'USD'),
      provider: transfer.provider
    }
  })
}

onMounted(() => {
  const route = useRoute()
  if (route.query.origin) searchQuery.value.origin = String(route.query.origin)
  if (route.query.destination) searchQuery.value.destination = String(route.query.destination)
  if (route.query.date) searchQuery.value.date = String(route.query.date)
  if (route.query.time) searchQuery.value.time = String(route.query.time)
  if (route.query.adults) searchQuery.value.adults = Number(route.query.adults)
  
  if (searchQuery.value.origin && searchQuery.value.destination) {
    handleSearch()
  } else {
    // Provide defaults for Demo
    searchQuery.value = {
      origin: 'CDG',
      destination: 'Paris',
      date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0] || '',
      time: '12:00',
      adults: 2
    }
    handleSearch()
  }
})
</script>
