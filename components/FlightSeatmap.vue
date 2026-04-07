<template>
  <div class="bg-white shadow-sm rounded-[2rem] p-8 border border-gray-100 overflow-hidden">
    <h2 class="text-xl  text-gray-900 mb-6 flex items-center tracking-tighter">
      <UsersIcon class="h-6 w-6 mr-3 text-brand-green" /> Select Your Seats
    </h2>

    <div v-if="loading" class="flex flex-col items-center justify-center py-12 space-y-4">
      <div class="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm font-bold text-brand-gray/60 uppercase tracking-widest italic">Loading aircraft layout...</p>
    </div>

    <div v-else-if="seatmaps && seatmaps.length" class="space-y-12">
      <div v-for="(seatmap, smIdx) in seatmaps" :key="smIdx" class="space-y-8">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 class="text-sm  text-gray-900 uppercase tracking-widest">
              Segment {{ seatmap.segmentId }}
            </h3>
            <p class="text-sm text-brand-gray/40 font-bold uppercase tracking-widest">
              {{ seatmap.carrierCode }}{{ seatmap.number }}
            </p>
          </div>
          <div class="flex space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-brand-blue rounded-sm"></div>
              <span class="text-sm font-bold text-brand-gray/60 uppercase">Selected</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <span class="text-sm font-bold text-brand-gray/60 uppercase">Available</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-gray-300 rounded-sm"></div>
              <span class="text-sm font-bold text-brand-gray/60 uppercase">Occupied</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Aircraft Body -->
        <div class="relative max-w-md mx-auto overflow-x-auto pb-8">
          <div class="min-w-[300px] flex flex-col items-center">
            <!-- Cockpit Area (Styling) -->
            <div class="w-32 h-16 bg-gray-100 rounded-t-full border-x border-t border-gray-200 mb-8 flex items-center justify-center">
              <div class="w-20 h-8 bg-brand-blue/5 rounded-t-full border border-brand-blue/10"></div>
            </div>

            <!-- Cabins -->
            <div v-for="(deck, dIdx) in seatmap.decks" :key="dIdx" class="bg-gray-50/30 rounded-3xl p-6 border border-gray-100 space-y-2">
              <div v-for="(row, rIdx) in deck.seatMap" :key="rIdx" class="flex justify-center space-x-2">
                <div v-for="(seat, sIdx) in row" :key="sIdx" class="relative group">
                  <!-- Aisle Gap -->
                  <div v-if="seat.isAisle" class="w-6"></div>
                  
                  <!-- Seat Component -->
                  <button
                    v-else
                    :disabled="!seat.available || seat.isOccupied"
                    @click="toggleSeat(smIdx, seat.number)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-[8px]  transition-all duration-300"
                    :class="[
                      isSelected(smIdx, seat.number) 
                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-110' 
                        : (seat.isOccupied ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-900 hover:border-brand-blue/50')
                    ]"
                  >
                    {{ seat.number }}
                    
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                      <div class="bg-brand-blue text-white text-sm  py-2 px-3 rounded-xl shadow-xl whitespace-nowrap">
                        {{ seat.number }} - {{ seat.available ? 'Available' : 'Occupied' }}
                        <div v-if="seat.price" class="text-brand-green mt-1">+{{ seat.price }} {{ seat.currency }}</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tail Area -->
            <div class="w-32 h-16 bg-gray-100 rounded-b-3xl border-x border-b border-gray-200 mt-8 relative overflow-hidden">
              <div class="absolute bottom-0 left-0 w-full h-1 bg-brand-blue/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-sm font-bold text-brand-gray/40 uppercase tracking-widest italic">Seatmap not available for this flight.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UsersIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  seatmaps: any[]
  loading: boolean
}>()

const emit = defineEmits(['update:selectedSeats'])

const selectedSeats = ref<Record<string, string[]>>({})

const isSelected = (segmentIdx: number, seatNumber: string) => {
  return selectedSeats.value[segmentIdx]?.includes(seatNumber)
}

const toggleSeat = (segmentIdx: number, seatNumber: string) => {
  if (!selectedSeats.value[segmentIdx]) {
    selectedSeats.value[segmentIdx] = []
  }
  
  const index = selectedSeats.value[segmentIdx].indexOf(seatNumber)
  if (index > -1) {
    selectedSeats.value[segmentIdx].splice(index, 1)
  } else {
    // For now, allow selecting only one seat per segment (simplification)
    selectedSeats.value[segmentIdx] = [seatNumber]
  }
  
  emit('update:selectedSeats', selectedSeats.value)
}
</script>
