<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-brand-blue/20 transition-all duration-500 group">
    <!-- Flight Header -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <div class="h-12 w-12 rounded-xl bg-gray-50 p-2 flex items-center justify-center border border-gray-100 group-hover:border-brand-blue/10 transition-colors">
          <img v-if="flight.airlineLogo" :src="flight.airlineLogo" :alt="flight.airline" class="h-full w-full object-contain" />
          <div v-else class="h-full w-full rounded-lg bg-brand-blue/10 flex items-center justify-center">
            <span class="text-gray-900  text-xs">{{ (flight.airline || 'FL').slice(0, 2).toUpperCase() }}</span>
          </div>
        </div>
        <div>
          <span class="block  text-gray-900 text-lg leading-tight">{{ flight.airline }}</span>
          <span class="text-sm  text-brand-gray/40 uppercase tracking-widest">{{ flight.flightNumbers?.join(' • ') || flight.flightNumber }}</span>
        </div>
      </div>
      <div class="text-right">
        <div class="flex items-center justify-end gap-1">
          <span class="text-sm  text-brand-gray/40 uppercase tracking-widest">From</span>
          <p class="text-2xl  text-gray-900">${{ formatPrice(flight.priceWithCommission || flight.price) }}</p>
        </div>
        <p class="text-sm  text-brand-green uppercase tracking-widest mt-0.5">{{ flight.cabinClass }}</p>
      </div>
    </div>

    <!-- Flight Details -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <!-- Departure -->
      <div class="text-center md:text-left min-w-[80px]">
        <p class="text-xl  text-gray-900">{{ formatTime(flight.departureTime) }}</p>
        <p class="text-xs  text-brand-gray/40 uppercase tracking-widest mt-1">{{ flight.origin }}</p>
      </div>

      <!-- Duration & Stops -->
      <div class="flex flex-col items-center flex-grow px-4 md:px-12 w-full md:w-auto">
        <div class="flex items-center gap-2 mb-2">
          <ClockIcon class="h-3.5 w-3.5 text-brand-gray/40" />
          <p class="text-[11px]  text-brand-gray/60 uppercase tracking-widest">{{ formatDuration(flight.duration) }}</p>
        </div>
        <div class="w-full h-[2px] bg-gray-100 relative flex items-center justify-center">
           <div class="absolute w-2 h-2 bg-gray-200 rounded-full left-0 border-2 border-white"></div>
           <div class="absolute w-2 h-2 bg-gray-200 rounded-full right-0 border-2 border-white"></div>
           
           <!-- Stop Markers -->
           <div v-if="flight.stops > 0" class="absolute inset-0 flex items-center justify-evenly">
              <div v-for="i in flight.stops" :key="i" class="w-1.5 h-1.5 bg-brand-orange rounded-full border border-white shadow-sm"></div>
           </div>

           <div class="absolute left-1/2 -translate-x-1/2 bg-white px-3">
             <PaperAirplaneIcon class="h-4 w-4 text-gray-900 transform rotate-90" />
           </div>
        </div>
        <p class="text-sm  mt-3 uppercase tracking-widest" :class="flight.stops === 0 ? 'text-brand-green' : 'text-brand-orange'">
          {{ flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}` }}
        </p>
      </div>

      <!-- Arrival -->
      <div class="text-center md:text-right min-w-[80px]">
        <p class="text-xl  text-gray-900">{{ formatTime(flight.arrivalTime) }}</p>
        <p class="text-xs  text-brand-gray/40 uppercase tracking-widest mt-1">{{ flight.destination }}</p>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <p v-if="flight.seatsAvailable" class="text-sm  text-brand-orange/60 uppercase tracking-widest">
           {{ flight.seatsAvailable }} Seats left
        </p>
        <div v-if="flight.conditions?.refundable" class="flex items-center gap-1.5">
           <div class="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
           <span class="text-sm  text-brand-green uppercase tracking-widest">Refundable</span>
        </div>
      </div>
      <button 
        @click="$emit('select', flight)"
        class="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3 rounded-xl  text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/10 transition-all hover:scale-105 active:scale-95"
      >
        Select Flight
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PaperAirplaneIcon, ClockIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  flight: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const formatTime = (isoString: string) => {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

const formatDuration = (minutes: number) => {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

const formatPrice = (price: any) => {
  if (typeof price === 'number') return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (typeof price === 'string') return parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return '—'
}
</script>
