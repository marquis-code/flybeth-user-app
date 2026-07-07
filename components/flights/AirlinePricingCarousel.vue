<template>
  <div class="mb-6 mt-4">
    <div class="flex items-center gap-2 mb-3">
      <h3 class="font-bold text-black text-sm">Lowest price by airline</h3>
      <span class="text-xs text-gray-500 font-medium">Includes alternate dates & nearby airports</span>
    </div>
    
    <div class="relative w-full">
      <div class="overflow-x-auto pb-4 custom-scrollbar w-full" ref="scrollContainer">
        <div class="flex items-start gap-4">
          <div 
            v-for="(airline, idx) in sortedAirlines" 
            :key="idx"
            class="flex flex-col items-center justify-center min-w-max cursor-pointer p-2 rounded-xl transition-all"
            :class="activeAirlines.includes(airline.name) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50/50 border border-transparent'"
            @click="emit('toggle', airline.name)"
          >
            <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1.5 mb-2 shadow-sm transition-all"
                 :class="activeAirlines.includes(airline.name) ? 'border-2 border-[#0D1DAD] ring-4 ring-blue-500/10' : 'border border-gray-100'">
              <img v-if="airline.logo" :src="airline.logo" :alt="airline.name" class="max-h-full max-w-full object-contain" />
              <div v-else class="h-full w-full bg-gray-50 rounded-full flex items-center justify-center">
                <span class="text-black font-bold text-[10px] text-center px-1 truncate w-full">{{ (airline.name || 'FL').slice(0, 3).toUpperCase() }}</span>
              </div>
            </div>
            <span class="text-xs font-bold whitespace-nowrap" :class="activeAirlines.includes(airline.name) ? 'text-[#0D1DAD]' : 'text-black'">{{ formatPrice(airline.price) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Gradient masks for scroll indication if needed -->
      <div class="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettings } from '@/composables/useSettings'

const props = defineProps({
  flights: {
    type: Array,
    required: true,
    default: () => []
  },
  activeAirlines: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle'])

const { formatPrice } = useSettings()
const scrollContainer = ref<HTMLElement | null>(null)

// Calculate the lowest price for each airline
const sortedAirlines = computed(() => {
  const airlineMap = new Map()
  
  props.flights.forEach((flight: any) => {
    if (!flight.airline) return
    const price = flight.priceWithCommission || flight.price || flight.total_amount || 0
    if (!airlineMap.has(flight.airline)) {
      airlineMap.set(flight.airline, {
        name: flight.airline,
        logo: flight.airlineLogo,
        price: price
      })
    } else {
      const existing = airlineMap.get(flight.airline)
      if (price < existing.price) {
        existing.price = price
      }
    }
  })
  
  // Convert to array and sort by price
  return Array.from(airlineMap.values()).sort((a, b) => a.price - b.price)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
