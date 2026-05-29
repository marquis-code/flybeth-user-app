<template>
  <div class="bg-white rounded-2xl border border-gray-200 transition-all duration-300">
    <!-- Main Collapsed Row -->
    <div 
      class="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 cursor-pointer hover:bg-gray-50/50 rounded-2xl"
      @click="isExpanded = !isExpanded"
    >
      <!-- Airline Logo -->
      <div class="flex items-center gap-3 w-full sm:w-1/4">
        <div class="h-10 w-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
          <img v-if="flight.airlineLogo" :src="flight.airlineLogo" :alt="flight.airline" class="h-full w-full object-contain" />
          <div v-else class="h-full w-full bg-gray-100 rounded flex items-center justify-center">
            <span class="text-black font-bold text-xs">{{ (flight.airline || 'FL').slice(0, 2).toUpperCase() }}</span>
          </div>
        </div>
        <span class="font-bold text-black text-sm line-clamp-1">{{ flight.airline }}</span>
      </div>

      <!-- Departure -->
      <div class="flex flex-col text-center sm:text-left min-w-[60px]">
        <span class="text-lg font-bold text-black leading-none">{{ formatTime(flight.departureTime) }}</span>
        <span class="text-xs font-semibold text-gray-400 mt-1">{{ flight.origin }}</span>
      </div>

      <!-- Duration Line -->
      <div class="flex-grow flex flex-col items-center justify-center min-w-[100px] w-full sm:w-auto px-2">
        <span class="text-xs font-semibold text-gray-500 mb-1.5">{{ formatDuration(flight.duration) }}</span>
        <div class="w-full relative flex items-center h-4">
          <!-- Background line -->
          <div class="absolute left-0 right-0 h-[2px] bg-gray-200 rounded"></div>
          
          <!-- Colored progress-like line -->
          <div class="absolute left-0 right-0 h-[2px] bg-[#0D1DAD] rounded" :class="flight.stops > 0 ? 'bg-opacity-50' : ''"></div>
          
          <!-- Left dot -->
          <div class="absolute left-0 w-1.5 h-1.5 rounded-full bg-[#0D1DAD]"></div>
          <!-- Right dot -->
          <div class="absolute right-0 w-1.5 h-1.5 rounded-full bg-[#0D1DAD]"></div>
          
          <!-- Stops dots -->
          <div v-if="flight.stops > 0" class="absolute inset-0 flex items-center justify-evenly">
            <div v-for="i in flight.stops" :key="i" class="w-2 h-2 rounded-full bg-white border-2 border-[#0D1DAD] z-10"></div>
          </div>
        </div>
        <span class="text-[10px] font-bold mt-1.5 uppercase tracking-wider text-[#0D1DAD]" :class="flight.stops > 0 ? 'text-gray-500' : ''">
          {{ flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}` }}
        </span>
      </div>

      <!-- Arrival -->
      <div class="flex flex-col text-center sm:text-right min-w-[60px]">
        <span class="text-lg font-bold text-black leading-none">{{ formatTime(flight.arrivalTime) }}</span>
        <span class="text-xs font-semibold text-gray-400 mt-1">{{ flight.destination }}</span>
      </div>

      <!-- Details Toggle -->
      <div class="w-full sm:w-auto flex justify-end mt-2 sm:mt-0 ml-auto">
        <button class="flex items-center gap-1 text-sm font-semibold text-brand-gray/60 hover:text-black transition-colors">
          Details
          <ChevronDown class="w-4 h-4 transition-transform duration-300" :class="isExpanded ? 'rotate-180' : ''" />
        </button>
      </div>
    </div>

    <!-- Expanded Details Section -->
    <transition
      enter-active-class="transition-[max-height,opacity] duration-300 ease-in-out"
      leave-active-class="transition-[max-height,opacity] duration-300 ease-in-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[1000px] opacity-100"
      leave-from-class="max-h-[1000px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="isExpanded" class="border-t border-gray-100 bg-gray-50/30 overflow-hidden">
        <div class="p-5 sm:p-6">
          <h4 class="text-sm font-bold text-black mb-4">Flight Details</h4>
          
          <!-- Iterating over slices/segments if available, else showing generic block -->
          <div class="space-y-6 relative">
            <!-- Vertical connecting line if multiple segments -->
            <div v-if="segments.length > 1" class="absolute left-3 top-6 bottom-6 w-0.5 bg-gray-200"></div>

            <div v-for="(segment, idx) in segments" :key="idx" class="relative z-10 pl-8">
              <!-- Node indicator -->
              <div class="absolute left-2.5 top-1.5 w-2 h-2 rounded-full bg-[#0D1DAD] transform -translate-x-1/2 outline outline-4 outline-gray-50"></div>

              <!-- Segment Header -->
              <div class="flex flex-wrap gap-2 items-center mb-3">
                <span class="text-sm font-bold text-black">{{ segment.operating_carrier_name || flight.airline }}</span>
                <span class="text-xs font-medium text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-md">
                  {{ segment.operating_carrier_flight_number || flight.flightNumbers?.[0] || 'Flight' }}
                </span>
                <span class="text-xs font-medium text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-md" v-if="segment.aircraft_name || flight.aircraftType">
                  {{ segment.aircraft_name || flight.aircraftType }}
                </span>
                <span class="text-xs font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-md ml-auto" v-if="flight.cabinClass">
                  {{ flight.cabinClass }}
                </span>
              </div>

              <!-- Segment Times -->
              <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                <div class="flex flex-col items-center w-4 py-1 gap-1">
                  <div class="w-1.5 h-1.5 rounded-full border border-gray-400"></div>
                  <div class="w-0.5 h-full bg-gray-200"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                </div>
                
                <div class="flex flex-col justify-between py-0.5 gap-4">
                  <div>
                    <div class="flex items-baseline gap-2">
                      <span class="text-sm font-bold text-black">{{ formatTime(segment.departing_at || flight.departureTime) }}</span>
                      <span class="text-sm font-medium text-gray-600">{{ segment.origin_name || flight.origin }}</span>
                    </div>
                    <span class="text-xs text-gray-500 mt-0.5 block" v-if="segment.origin_terminal">Terminal {{ segment.origin_terminal }}</span>
                  </div>

                  <div class="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <Clock class="w-3.5 h-3.5" />
                    {{ formatDuration(segment.duration || flight.duration) }}
                  </div>

                  <div>
                    <div class="flex items-baseline gap-2">
                      <span class="text-sm font-bold text-black">{{ formatTime(segment.arriving_at || flight.arrivalTime) }}</span>
                      <span class="text-sm font-medium text-gray-600">{{ segment.destination_name || flight.destination }}</span>
                    </div>
                    <span class="text-xs text-gray-500 mt-0.5 block" v-if="segment.destination_terminal">Terminal {{ segment.destination_terminal }}</span>
                  </div>
                </div>
              </div>

              <!-- Connection Info between segments -->
              <div v-if="idx < segments.length - 1" class="mt-4 mb-2 py-3 px-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-3">
                <Clock class="w-4 h-4 text-orange-600" />
                <span class="text-sm font-bold text-orange-800">
                  Connection in {{ segment.destination_name || segments[idx+1].origin_name || flight.destination }}
                </span>
              </div>
            </div>
          </div>

          <!-- Baggage Info -->
          <div class="mt-6 pt-5 border-t border-gray-200">
            <h4 class="text-sm font-bold text-black mb-3">Included Baggage</h4>
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <Briefcase class="w-4 h-4 text-gray-400" />
                <span class="font-medium">1 Personal item</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-700" :class="flight.conditions?.carryOn ? '' : 'text-gray-400 line-through'">
                <Luggage class="w-4 h-4 text-gray-400" />
                <span class="font-medium">{{ flight.conditions?.carryOn ? '1 Carry-on bag' : 'No Carry-on' }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-700" :class="flight.conditions?.checkedBag ? '' : 'text-gray-400 line-through'">
                <Archive class="w-4 h-4 text-gray-400" />
                <span class="font-medium">{{ flight.conditions?.checkedBag ? '1 Checked bag' : 'No Checked bag' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
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

const isExpanded = ref(false)

const segments = computed(() => {
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
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
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
