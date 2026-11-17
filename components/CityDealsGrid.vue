<template>
  <div class="w-full">
    <!-- Compact Grid -->
    <div v-if="loading" class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <div v-for="i in 6" :key="i" class="bg-white/80 animate-pulse rounded-xl h-20 border border-gray-100"></div>
    </div>
    <div v-else class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <div 
        v-for="city in topCities.slice(0, 6)" 
        :key="city.iata_code || city.name"
        @click="$router.push(`/destinations?city=${encodeURIComponent(city.name)}`)"
        class="group bg-white rounded-xl p-3.5 sm:p-4 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between border border-slate-200/80 hover:border-[#0D1DAD]/40 hover:-translate-y-0.5"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="h-9 w-9 shrink-0 rounded-lg bg-[#0D1DAD]/[0.07] text-[#0D1DAD] flex items-center justify-center font-black text-xs group-hover:bg-[#0D1DAD] group-hover:text-white transition-colors">
            {{ city.iata_code || city.name.slice(0, 3).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-[#0B1B33] truncate group-hover:text-[#0D1DAD] transition-colors">{{ city.name }}</h3>
            <p class="text-[11px] text-[#5F7185] truncate">Flights to {{ city.name }} {{ city.iata_code ? `(${city.iata_code})` : '' }}</p>
          </div>
        </div>
        <span class="shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#0D1DAD]/10 group-hover:text-[#0D1DAD] text-xs font-bold transition-all">
          →
        </span>
      </div>
    </div>
  </div>
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