<template>
  <div class="space-y-6 font-sans">
    
    <!-- Header -->
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D1DAD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1.3 1.3c-.2.2-.1.6.2.8L9 12l-4 4-2.2-.6c-.3-.1-.6 0-.8.2L1 16.5c-.2.2-.1.5.2.6L5 19l2 3.8c.1.3.4.4.6.2l.9-1c.2-.2.3-.5.2-.8L8 19l4-4 3.2 6.4c.2.3.6.4.8.2l1.3-1.3c.3-.2.6-.6.5-1.1z"/>
        </svg>
      </div>
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">Flight details</h2>
        <p class="text-sm text-gray-500 mt-1">Review your selected flights</p>
      </div>
    </div>

    <!-- Flight Itinerary Card -->
    <div v-if="flightOffer" class="bg-white border border-gray-100 rounded-[20px] overflow-hidden">
      <!-- Summary Header -->
      <div 
        @click="expanded = !expanded" 
        class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-4">
          <img v-if="flightOffer.airlineLogo" :src="flightOffer.airlineLogo" :alt="flightOffer.airline" class="w-8 h-8 object-contain" />
          <div class="flex flex-col">
            <div class="flex items-center gap-2 text-base font-bold text-gray-900">
              <span>{{ flightOffer.origin }} {{ formatTime(flightOffer.departureTime) }}</span>
              <span class="text-gray-400">➔</span>
              <span>{{ flightOffer.destination }} {{ formatTime(flightOffer.arrivalTime) }}</span>
            </div>
            <div class="text-[13px] text-gray-500 mt-1">
              {{ formatDate(flightOffer.departureTime) }} • {{ formatDuration(flightOffer.duration) }} • {{ flightOffer.stops === 0 ? 'Direct' : `${flightOffer.stops} Stop${flightOffer.stops > 1 ? 's' : ''}` }}
            </div>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-transform duration-300" :class="{ 'rotate-180': expanded }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>

      <!-- Expanded Timeline Details -->
      <div v-show="expanded" class="border-t border-gray-100 p-6 bg-[#fafafa]">
        <div v-for="(segment, idx) in flightOffer.segments" :key="idx" class="relative">
          
          <!-- Layover -->
          <div v-if="idx > 0" class="flex gap-6 my-4 relative z-10">
            <div class="w-3 flex justify-center">
              <div class="w-[30px] h-[30px] bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
            </div>
            <div class="flex flex-col pt-1">
              <span class="text-sm font-semibold text-gray-900">Transfer in {{ segment.originName || segment.origin }}</span>
              <span class="text-xs text-gray-500">{{ calcLayover(flightOffer.segments[idx - 1], segment) }}</span>
            </div>
          </div>

          <!-- Timeline Segment -->
          <div class="flex gap-6 relative group">
            <!-- Timeline connector line -->
            <div class="absolute left-[5.5px] top-4 bottom-[-16px] w-[2px] bg-gray-200 group-last:hidden"></div>
            
            <div class="flex flex-col items-center relative z-10 mt-1.5">
              <div class="w-3 h-3 bg-blue-600 rounded-full ring-4 ring-white"></div>
            </div>

            <div class="flex-1 pb-6">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-sm font-bold text-gray-900">{{ formatTime(segment.departureTime) }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(segment.departureTime) }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold text-gray-900">{{ segment.originName || segment.origin }}</div>
                  <div class="text-xs text-gray-500">{{ segment.originTerminal ? `Terminal ${segment.originTerminal}` : 'Main Terminal' }} • {{ segment.origin }}</div>
                </div>
                <div class="text-right font-semibold text-blue-600 text-sm w-12">{{ segment.origin }}</div>
              </div>

              <!-- Airline info block -->
              <div class="my-3 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 w-fit">
                <img v-if="segment.airlineLogo" :src="segment.airlineLogo" :alt="segment.airline" class="w-4 h-4 object-contain" />
                <span class="text-xs font-semibold text-gray-700">{{ segment.airline }}</span>
                <span class="text-xs text-gray-400 border-l pl-2">{{ segment.flightNumber }}</span>
                <span class="text-xs text-gray-400 border-l pl-2">{{ formatDuration(segment.duration) }}</span>
              </div>

              <div class="flex justify-between items-start mt-3">
                <div>
                  <div class="text-sm font-bold text-gray-900">{{ formatTime(segment.arrivalTime) }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(segment.arrivalTime) }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold text-gray-900">{{ segment.destinationName || segment.destination }}</div>
                  <div class="text-xs text-gray-500">{{ segment.destinationTerminal ? `Terminal ${segment.destinationTerminal}` : 'Main Terminal' }} • {{ segment.destination }}</div>
                </div>
                <div class="text-right font-semibold text-blue-600 text-sm w-12">{{ segment.destination }}</div>
              </div>
            </div>
            
            <div class="absolute left-[5.5px] bottom-0 w-[2px] h-4 bg-gray-200 group-last:hidden"></div>
            <div class="absolute left-[5.5px] bottom-[-2px] w-[2px] h-2 bg-gray-200 group-last:hidden z-0"></div>
            <!-- Bottom dot -->
            <div class="absolute left-[-2px] bottom-0 w-3 h-3 bg-white border-2 border-gray-300 rounded-full z-10 group-last:block hidden"></div>
            
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="!hideContinue" class="flex justify-end pt-4">
       <button @click="$emit('continue')" class="px-8 py-3 bg-[#0D1DAD] hover:bg-[#0A1485] text-white rounded-[12px] font-bold transition-all text-sm">
          Continue
       </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  flightOffer: { type: Object, default: null },
  hideContinue: { type: Boolean, default: false }
})

defineEmits(['continue'])

const expanded = ref(true)

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''

const formatTime = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatDuration = (minutes: number) => {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

const calcLayover = (seg1: any, seg2: any) => {
  if (!seg1?.arrivalTime || !seg2?.departureTime) return '—'
  const diff = new Date(seg2.departureTime).getTime() - new Date(seg1.arrivalTime).getTime()
  return formatDuration(Math.round(diff / 60000))
}
</script>
