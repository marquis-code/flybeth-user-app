<template>
  <section class="py-24 bg-[#F8FAFC]">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-[32px] md:text-[40px] font-bold text-[#111827]  mb-4" style="font-family: 'Plus Jakarta Sans', sans-serif;">
          Ready to explore?
        </h2>
        <p class="text-[15px] text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
          Discover destinations around the world, from beach escapes to city adventures, and book your next trip today.
        </p>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <div v-for="i in 9" :key="i" class="bg-gray-100 animate-pulse rounded-[24px] h-36"></div>
      </div>
      <div v-else class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <div 
          v-for="city in topCities" 
          :key="city.iata_code || city.name"
          @click="$router.push(`/destinations?city=${encodeURIComponent(city.name)}`)"
          class="bg-white rounded-[24px] p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-start border border-gray-100"
        >
          <h3 class="text-xl font-bold text-[#111827] mb-1" style="font-family: 'Plus Jakarta Sans', sans-serif;">{{ city.name }}</h3>
          <p class="text-[13px] text-[#6B7280] mb-5">Flights to {{ city.name }} {{ city.iata_code ? `(${city.iata_code})` : '' }}</p>
          <button class="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] px-5 py-2 rounded-full text-[13px] font-medium transition-colors">
            Explore
          </button>
        </div>
      </div>

      <!-- CTA -->
      <button 
        @click="$router.push('/destinations')" 
        class="bg-[#1A2ED4] hover:bg-[#0D1DAD] text-white px-8 py-3.5 rounded-full text-[15px] font-medium transition-colors shadow-sm"
      >
        Explore all destinations
      </button>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { flightsApi } from '@/api_factory/modules/flights'

const router = useRouter()
const topCities = ref<any[]>([])
const loading = ref(true)

const fetchCities = async () => {
  try {
    loading.value = true
    const { data } = await flightsApi.getDuffelCities({ limit: 9 })
    if (data?.data) {
      topCities.value = data.data
    }
  } catch (error) {
    console.error('Failed to fetch Duffel cities:', error)
    // Fallback to a default set
    topCities.value = [
      { name: 'Paris', iata_code: 'PAR' },
      { name: 'London', iata_code: 'LON' },
      { name: 'New York', iata_code: 'NYC' },
      { name: 'Dubai', iata_code: 'DXB' },
      { name: 'Tokyo', iata_code: 'TYO' },
      { name: 'Rome', iata_code: 'ROM' },
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCities()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
</style>