<template>
  <div 
    @click="$emit('select', flight)"
    class="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-900 transition-all duration-500 group cursor-pointer"
  >
    <!-- Flight Header -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <div class="h-12 w-12 rounded-xl bg-gray-50 p-2 flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-colors">
          <img v-if="flight.airlineLogo" :src="flight.airlineLogo" :alt="flight.airline" class="h-full w-full object-contain" />
          <div v-else class="h-full w-full rounded-lg bg-gray-100 flex items-center justify-center">
            <span class="text-gray-900 font-bold text-xs">{{ (flight.airline || 'FL').slice(0, 2).toUpperCase() }}</span>
          </div>
        </div>
        <div>
          <span class="block font-bold text-gray-900 text-lg leading-tight">{{ flight.airline }}</span>
          <span class="text-xs font-medium text-brand-gray/40 uppercase tracking-[0.2em]">{{ flight.flightNumbers?.join(' • ') || flight.flightNumber }}</span>
        </div>
      </div>
      <div class="text-right">
        <div class="flex items-center justify-end gap-1">
          <span class="text-[10px] font-bold text-brand-gray/30 uppercase tracking-widest">From</span>
          <p class="text-2xl font-black text-gray-900">${{ formatPrice(flight.priceWithCommission || flight.price) }}</p>
        </div>
        <p class="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{{ flight.cabinClass }}</p>
      </div>
    </div>

    <!-- Flight Details -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <!-- Departure -->
      <div class="text-center md:text-left min-w-[80px]">
        <p class="text-xl font-black text-gray-900">{{ formatTime(flight.departureTime) }}</p>
        <p class="text-[11px] font-bold text-brand-gray/40 uppercase tracking-widest mt-1">{{ flight.origin }}</p>
      </div>

      <!-- Duration & Stops -->
      <div class="flex flex-col items-center flex-grow px-4 md:px-12 w-full md:w-auto">
        <div class="flex items-center gap-2 mb-2">
          <ClockIcon class="h-3 w-3 text-brand-gray/30" />
          <p class="text-[9px] font-bold text-brand-gray/60 uppercase tracking-[0.1em]">{{ formatDuration(flight.duration) }}</p>
        </div>
        <div class="w-full h-[1px] bg-gray-100 relative flex items-center justify-center">
           <div class="absolute w-1.5 h-1.5 bg-gray-200 rounded-full left-0"></div>
           <div class="absolute w-1.5 h-1.5 bg-gray-200 rounded-full right-0"></div>
           
           <!-- Stop Markers -->
           <div v-if="flight.stops > 0" class="absolute inset-0 flex items-center justify-evenly">
              <div v-for="i in flight.stops" :key="i" class="w-1.5 h-1.5 bg-gray-900 rounded-full border border-white"></div>
           </div>

           <div class="absolute left-1/2 -translate-x-1/2 bg-white px-3">
             <PlaneIcon class="h-4 w-4 text-gray-300 transform rotate-90" />
           </div>
        </div>
        <p class="text-[11px] font-bold mt-4 uppercase tracking-[0.2em] text-gray-800">
          {{ flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}` }}
        </p>
      </div>

      <!-- Arrival -->
      <div class="text-center md:text-right min-w-[80px]">
        <p class="text-xl font-black text-gray-900">{{ formatTime(flight.arrivalTime) }}</p>
        <p class="text-[11px] font-bold text-brand-gray/40 uppercase tracking-widest mt-1">{{ flight.destination }}</p>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <p v-if="flight.seatsAvailable" class="text-[10px] font-bold text-brand-orange/60 uppercase tracking-widest">
           {{ flight.seatsAvailable }} Seats left
        </p>
        <div v-if="flight.conditions?.refundable" class="flex items-center gap-1.5">
           <div class="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
           <span class="text-[10px] font-bold text-brand-green uppercase tracking-widest">Refundable</span>
        </div>
      </div>
      <button 
        @click.stop="$emit('select', flight)"
        class="bg-gray-900 text-white px-10 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all hover:bg-black active:scale-95"
      >
        Select Flight
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plane as PlaneIcon, Clock as ClockIcon } from 'lucide-vue-next'

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
