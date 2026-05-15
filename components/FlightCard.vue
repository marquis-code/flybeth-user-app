<template>
  <div 
    @click="$emit('select', flight)"
    class="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-200 transition-all duration-500 group cursor-pointer"
  >
    <!-- Flight Header -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <div class="h-12 w-12 rounded-xl bg-white p-2 flex items-center justify-center border border-gray-200 group-hover:bg-black transition-colors">
          <img v-if="flight.airlineLogo" :src="flight.airlineLogo" :alt="flight.airline" class="h-full w-full object-contain" />
          <div v-else class="h-full w-full rounded-lg bg-black flex items-center justify-center">
            <span class="text-black font-bold text-sm">{{ (flight.airline || 'FL').slice(0, 2).toUpperCase() }}</span>
          </div>
        </div>
        <div>
          <span class="block font-bold text-black text-lg leading-tight">{{ flight.airline }}</span>
          <span class="text-sm font-medium text-brand-gray/40 tracking-[0.2em]">{{ flight.flightNumbers?.join(' • ') || flight.flightNumber }}</span>
        </div>
      </div>
      <div class="text-right">
        <div class="flex items-center justify-end gap-1">
          <span class="text-sm font-bold text-brand-gray/30 ">From</span>
          <p class="text-2xl  text-black">${{ formatPrice(flight.priceWithCommission || flight.price) }}</p>
        </div>
        <p class="text-sm font-bold text-black  mt-0.5">{{ flight.cabinClass }}</p>
      </div>
    </div>

    <!-- Flight Details -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <!-- Departure -->
      <div class="text-center md:text-left min-w-[80px]">
        <p class="text-xl  text-black">{{ formatTime(flight.departureTime) }}</p>
        <p class="text-sm font-bold text-brand-gray/40  mt-1">{{ flight.origin }}</p>
      </div>

      <!-- Duration & Stops -->
      <div class="flex flex-col items-center flex-grow px-4 md:px-12 w-full md:w-auto">
        <div class="flex items-center gap-2 mb-2">
          <ClockIcon class="h-3 w-3 text-brand-gray/30" />
          <p class="text-sm font-bold text-brand-gray/60 ">{{ formatDuration(flight.duration) }}</p>
        </div>
        <div class="w-full h-[1px] bg-black relative flex items-center justify-center">
           <div class="absolute w-1.5 h-1.5 bg-black rounded-full left-0"></div>
           <div class="absolute w-1.5 h-1.5 bg-black rounded-full right-0"></div>
           
           <!-- Stop Markers -->
           <div v-if="flight.stops > 0" class="absolute inset-0 flex items-center justify-evenly">
              <div v-for="i in flight.stops" :key="i" class="w-1.5 h-1.5 bg-black rounded-full border border-white"></div>
           </div>

           <div class="absolute left-1/2 -translate-x-1/2 bg-white px-3">
             <PlaneIcon class="h-4 w-4 text-black transform rotate-90" />
           </div>
        </div>
        <p class="text-sm font-bold mt-4 tracking-[0.2em] text-black">
          {{ flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}` }}
        </p>
      </div>

      <!-- Arrival -->
      <div class="text-center md:text-right min-w-[80px]">
        <p class="text-xl  text-black">{{ formatTime(flight.arrivalTime) }}</p>
        <p class="text-sm font-bold text-brand-gray/40  mt-1">{{ flight.destination }}</p>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <p v-if="flight.seatsAvailable" class="text-sm font-bold text-brand-orange/60 ">
           {{ flight.seatsAvailable }} Seats left
        </p>
        <div v-if="flight.conditions?.refundable" class="flex items-center gap-1.5">
           <div class="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
           <span class="text-sm font-bold text-brand-green ">Refundable</span>
        </div>
      </div>
      <button 
        @click.stop="$emit('select', flight)"
        class="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm  transition-all hover:bg-black active:scale-95"
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
