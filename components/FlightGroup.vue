<template>
  <div class="bg-white rounded-2xl overflow-hidden mb-4 border border-gray-100 transition-all duration-500 hover:border-gray-900">
    <!-- Group Header (Airline Info) -->
    <div class="bg-gray-50/30 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="h-9 w-9 rounded-lg bg-white p-1.5 border border-gray-100">
          <img v-if="airlineLogo" :src="airlineLogo" :alt="airlineName" class="h-full w-full object-contain" />
          <div v-else class="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
             <span class="text-gray-900 font-bold text-xs">{{ airlineName.slice(0, 2) }}</span>
          </div>
        </div>
        <h3 class="font-bold text-gray-900 tracking-widest text-sm">{{ airlineName }}</h3>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm font-bold text-brand-gray/30 tracking-widest">Starting from</span>
        <span class="text-xl font-black text-gray-900">${{ cheapestPrice }}</span>
      </div>
    </div>

    <!-- Main Offer (Cheapest/Best) -->
    <div class="p-2">
      <FlightCard 
        :flight="bestOffer" 
        class=" !border-none !rounded-2xl"
        @select="$emit('select', $event)"
      />
    </div>

    <!-- Multi-Offer Toggle -->
    <button 
      v-if="otherOffers.length > 0"
      @click="isExpanded = !isExpanded"
      class="w-full py-3.5 bg-gray-50/40 hover:bg-gray-50/80 transition-colors flex items-center justify-center gap-3 group"
    >
      <div class="flex -space-x-2">
         <div v-for="i in Math.min(3, otherOffers.length)" :key="i" class="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
            <img v-if="airlineLogo" :src="airlineLogo" class="w-full h-full object-cover opacity-60" />
         </div>
      </div>
      <span class="text-sm  text-brand-gray/60 tracking-widest group-hover:text-gray-900 transition-colors">
        {{ isExpanded ? 'Hide' : `+${otherOffers.length}` }} {{ airlineName }} flights
      </span>
      <ChevronDown 
        class="h-4 w-4 text-brand-gray/40 transition-transform duration-500"
        :class="isExpanded ? 'rotate-180' : ''"
      />
    </button>

    <!-- Expanded Offers -->
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      leave-active-class="transition-all duration-500 ease-in"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[2000px] opacity-100"
      leave-from-class="max-h-[2000px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="isExpanded" class="px-4 pb-4 space-y-2 overflow-hidden">
       <div v-for="offer in otherOffers" :key="offer.offerId" class="pt-2">
          <FlightCard 
            :flight="offer" 
            class=" !border-none !rounded-xl !p-4"
            @select="$emit('select', $event)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  airlineName: { type: String, required: true },
  airlineLogo: { type: String },
  flights: { type: Array, required: true }
})

defineEmits(['select'])

const isExpanded = ref(false)

const bestOffer = computed(() => {
  const flights = props.flights as any[]
  if (!flights || !flights.length) return null
  return [...flights].sort((a: any, b: any) => (a.priceWithCommission || a.price) - (b.priceWithCommission || b.price))[0]
})

const otherOffers = computed(() => {
  const best = bestOffer.value
  const flights = props.flights as any[]
  return flights.filter((f: any) => f !== best)
})

const cheapestPrice = computed(() => {
  const best = bestOffer.value as any
  if (!best) return '—'
  const price = best.priceWithCommission || best.price
  return typeof price === 'number' ? price.toLocaleString() : price
})
</script>
