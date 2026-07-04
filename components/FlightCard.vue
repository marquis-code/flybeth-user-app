<template>
  <div class="w-full relative group bg-white">
    <div class="flex items-start gap-2 sm:gap-4 w-full">
      <!-- Airline Logo -->
      <div class="w-8 h-8 sm:w-10 sm:h-10 rounded bg-white flex items-center justify-center flex-shrink-0 border border-gray-100 p-0.5 mt-0.5">
        <img v-if="flight.airlineLogo" :src="flight.airlineLogo" :alt="flight.airline" class="h-full w-full object-contain" />
        <div v-else class="h-full w-full bg-gray-100 rounded flex items-center justify-center">
          <span class="text-black font-bold text-[10px] sm:text-xs">{{ (flight.airline || 'FL').slice(0, 2).toUpperCase() }}</span>
        </div>
      </div>
      
      <!-- Flight Times & Details -->
      <div class="flex-grow flex flex-col min-w-0">
        <!-- Times & Route Line -->
        <div class="flex items-center w-full justify-between">
           <!-- Departure -->
           <div class="flex flex-col text-left flex-shrink-0">
             <span class="text-[15px] sm:text-[17px] font-extrabold text-black leading-none">{{ formatTime(flight.departureTime) }}</span>
             <span class="text-[10px] sm:text-xs font-semibold text-gray-500 mt-1 uppercase">{{ flight.origin }}</span>
           </div>
           
           <!-- Line & Stops -->
           <div class="flex-grow flex flex-col items-center justify-center px-2 sm:px-4 relative mb-3 min-w-[30px]">
              <div class="w-full h-[1.5px] bg-gray-300 relative flex items-center justify-center">
                <!-- Center dot for stops or plain dot -->
                <div class="absolute w-1.5 h-1.5 rounded-full bg-gray-500"></div>
              </div>
           </div>
           
           <!-- Arrival -->
           <div class="flex flex-col text-right flex-shrink-0">
             <span class="text-[15px] sm:text-[17px] font-extrabold text-black leading-none">{{ formatTime(flight.arrivalTime) }}</span>
             <span class="text-[10px] sm:text-xs font-semibold text-gray-500 mt-1 uppercase">{{ flight.destination }}</span>
           </div>
        </div>
        
        <!-- Duration and Stops Text -->
        <div class="mt-1 text-[11px] sm:text-[12px] text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          <span class="font-bold text-gray-700">{{ formatDuration(flight.duration) }} &bull; {{ flight.stops === 0 ? 'Nonstop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}` }}</span>
        </div>
        
        <!-- Airline Name -->
        <div class="mt-0.5 text-[10px] sm:text-[11px] text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
          {{ flight.airline }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Clock, Briefcase, Luggage, Archive } from 'lucide-vue-next'

const props = defineProps({
  flight: {
    type: Object,
    required: true
  }
})

defineEmits(['show-details'])

const segments = computed(() => {
  if (props.flight.segments && Array.isArray(props.flight.segments)) {
    return props.flight.segments
  }
  // If we have actual Duffel/Amadeus slices array, use it
  if (props.flight.slices && props.flight.slices[0] && props.flight.slices[0].segments) {
    return props.flight.slices[0].segments
  }
  // Fallback to a dummy array of length 1 representing the main flight
  return [{}] 
})

const formatTime = (isoString: string) => {
  if (!isoString) return '—'
  try {
    const date = new Date(isoString)
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
    return timeStr.replace(' ', '').toLowerCase()
  } catch (e) {
    // If it's just a time string like "14:30", return it
    if (typeof isoString === 'string' && isoString.includes(':')) {
      return isoString.split(':').slice(0, 2).join(':')
    }
    return isoString
  }
}

const formatDuration = (val: any) => {
  if (!val) return '—'
  // Handle PT2H30M format
  if (typeof val === 'string' && val.startsWith('PT')) {
    const match = val.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (match) {
      const h = match[1] ? `${match[1]}h` : ''
      const m = match[2] ? ` ${match[2]}m` : ''
      return (h + m).trim() || '—'
    }
  }
  // Handle minutes number
  const minutes = parseInt(val)
  if (!isNaN(minutes)) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m}m`
    return `${h}h ${m}m`
  }
  return String(val)
}
</script>
