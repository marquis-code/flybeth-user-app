<template>
  <div class="seat-selection-step p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 group/header">
      <div class="flex items-center gap-3 whitespace-nowrap">
        <Armchair class="w-6 h-6 text-blue-600" />
        <h3 class="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">
          Select Your Seat
        </h3>
      </div>

      <!-- Legend (Compact) -->
      <div class="flex items-center gap-4 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
          <span class="text-[9px] font-black text-gray-400 tracking-widest uppercase">Available</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span class="text-[9px] font-black text-gray-400 tracking-widest uppercase">Selected</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
          <span class="text-[9px] font-black text-gray-400 tracking-widest uppercase">Occupied</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-6">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <div class="text-center">
        <p class="text-sm  text-gray-900 tracking-[0.2em]">Mapping Aircraft Cabin</p>
        <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-2">Retrieving real-time availability...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="seatmaps.length" class="space-y-6">
      <!-- Main Selection Bar -->
      <div class="w-full flex items-center justify-between p-6 bg-gray-900 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <!-- Selection Info -->
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10">
            <User class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-[9px]  text-white/40  tracking-[0.2em] mb-1">Traveler Selection</p>
            <div class="flex items-center gap-2">
              <span class="text-base  truncate">{{ passengers.firstName }} {{ passengers.lastName }}</span>
              <div v-if="selectedSeats[0]" class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px]  rounded-lg border border-emerald-500/30 tracking-widest">
                SEAT {{ selectedSeats[0].designator }}
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="text-right relative z-10">
          <p class="text-[9px]  text-white/40  tracking-[0.2em] mb-1">Seat Surcharge</p>
          <span class="text-2xl  text-white tracking-tight">{{ formatPrice(totalSeatPrice) }}</span>
        </div>
      </div>

      <!-- Bottom Section: Full Width Aircraft Cabin -->
      <div class="w-full">
        <div class="w-full  mx-auto bg-white rounded-[3rem] border-2 border-gray-100 shadow-2xl shadow-blue-50/50 overflow-hidden flex flex-col items-center">




          <!-- Scrollable Area Wrapper -->
          <div class="relative w-full overflow-hidden">
            <!-- Scrollable Seat Map Area -->
            <div class="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar" style="max-height: min(75vh, 700px); min-height: 400px;">
              <div v-if="currentMap" class="pb-24 px-2">
                <div v-for="(cabin, cIdx) in currentMap.cabins" :key="cIdx">

                  <!-- Cabin Header -->
                  <div class="flex items-center gap-4 justify-center sticky top-0 bg-white/95 backdrop-blur-md py-6 z-20">
                    <div class="h-[2px] flex-1 bg-gradient-to-r from-transparent via-gray-100 to-blue-100"></div>
                    <span class="px-8 py-3 bg-blue-600 rounded-xl text-xs sm:text-sm  text-white   shadow-xl shadow-blue-200 whitespace-nowrap">
                      {{ cabin.name || 'Main Cabin' }}
                    </span>
                    <div class="h-[2px] flex-1 bg-gradient-to-l from-transparent via-gray-100 to-blue-100"></div>
                  </div>

                  <!-- Rows -->
                  <div class="flex flex-col items-center gap-2 mt-4">
                    <div
                      v-for="(row, rIdx) in cabin.rows"
                      :key="rIdx"
                      class="flex items-center justify-center gap-1 sm:gap-2 group w-full"
                    >
                      <!-- Row Number Left -->
                      <div class="w-8 sm:w-10 flex-shrink-0 text-right pr-1">
                        <span class="text-xs sm:text-sm  text-gray-300 group-hover:text-blue-500 transition-colors">{{ row.number }}</span>
                      </div>

                      <!-- Sections with Aisle Gap -->
                      <div class="flex items-center gap-1 sm:gap-2">
                        <template v-for="(section, sIdx) in row.sections" :key="sIdx">
                          <!-- Aisle spacer between sections -->
                          <div v-if="sIdx > 0" class="w-6 sm:w-10 flex-shrink-0"></div>

                          <div class="flex items-center gap-1 sm:gap-2">
                            <div v-for="(element, eIdx) in section.elements" :key="eIdx">
                              <template v-if="element.type === 'seat'">
                                <button
                                  @click="handleSeatClick(element)"
                                  :disabled="!isSeatAvailable(element)"
                                  class="w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group/seat border-2 touch-manipulation"
                                  :class="[
                                    isSeatSelectedByActivePlayer(element)
                                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-200 scale-110 -translate-y-0.5 z-10'
                                      : isSeatAvailable(element)
                                        ? 'bg-white border-blue-100 text-blue-600 hover:border-blue-600 hover:scale-105 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100/50 active:scale-95'
                                        : 'bg-gray-50 border-gray-100 text-gray-200 cursor-not-allowed'
                                  ]"
                                >
                                  <Armchair class="h-5 w-5 sm:h-6 sm:w-6 mb-0.5" />
                                  <span class="text-[10px] sm:text-xs  leading-none tracking-tighter">{{ element.designator }}</span>

                                  <!-- Price tooltip -->
                                  <div
                                    v-if="isSeatAvailable(element) && !isSeatSelectedByActivePlayer(element)"
                                    class="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[8px]  rounded-lg shadow-2xl opacity-0 group-hover/seat:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30"
                                  >
                                    +{{ formatPrice(parseFloat(element.available_services[0].total_amount)) }}
                                  </div>
                                </button>
                              </template>

                              <div v-else-if="element.type === 'empty'" class="w-10 h-10 sm:w-12 sm:h-12"></div>

                              <div v-else class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-200">
                                <Info v-if="element.type !== 'empty'" class="h-4 w-4 opacity-20" />
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>

                      <!-- Row Number Right (mirror) -->
                      <div class="w-8 sm:w-10 flex-shrink-0 text-left pl-1">
                        <span class="text-xs sm:text-sm  text-gray-300 group-hover:text-blue-500 transition-colors">{{ row.number }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Gradient Fade & Scroll Indicator -->
            <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-10 flex flex-col items-center justify-end pb-8">
               <div class="flex flex-col items-center gap-2 animate-bounce transition-opacity duration-500 group-hover:opacity-10">
                  <span class="text-xs   tracking-[0.4em] text-gray-300">Scroll for more</span>
                  <div class="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                    <ChevronDown class="w-4 h-4 text-gray-400" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50">
      <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
        <Armchair class="w-8 h-8 text-gray-300" />
      </div>
      <p class="text-xs font-black text-gray-900 tracking-tight">No Seat Map Available</p>
      <p class="text-[9px] font-bold text-gray-400 tracking-widest mt-1 text-center px-4">Seat selection is not supported for this flight.</p>
      <button @click="$emit('continue')" class="mt-6 px-6 h-10 bg-gray-900 text-white rounded-xl text-[9px] font-black tracking-widest uppercase">Skip Selection</button>
    </div>

    <!-- Navigation -->
    <div v-if="!isEmbedded" class="mt-10 flex items-center justify-between border-t border-gray-100 pt-8">
      <button @click="$emit('back')" class="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 h-12 sm:h-14 rounded-2xl hover:bg-gray-50 transition-all">
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-gray-200 group-hover:border-gray-900 transition-colors flex-shrink-0">
          <ChevronRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
        </div>
        <span class="text-[9px] sm:text-[10px]   tracking-[0.2em] text-gray-400 group-hover:text-gray-900 hidden xs:block">Previous Review</span>
      </button>

      <button @click="$emit('continue')" class="group relative bg-gray-900 text-white px-8 sm:px-12 py-3.5 rounded-lg text-[10px] sm:text-[11px]   tracking-[0.2em] shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 -translate-x-full group-hover:animate-shimmer"></div>
        <span class="relative z-10 flex items-center gap-2 sm:gap-3">
          Finalize Selection
          <ChevronRight class="w-4 h-4" />
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Armchair, Info, ChevronRight, Minus, User, ChevronDown } from 'lucide-vue-next'
import { flightsApi } from '~/api_factory/modules/flights'

interface Seat {
  id: string;
  designator: string;
  price: number;
  serviceId: string;
  mapIdx: number;
}

const props = defineProps({
  flightOffer: { type: Object, required: true },
  passengers: { type: Object, required: true },
  modelValue: { type: Array as () => any[], default: () => [] },
  isEmbedded: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'update:totalPrice', 'continue', 'back', 'remove'])

const loading = ref(false)
const seatmaps = ref<any[]>([])
const activeMapIdx = ref(0)
const activePassengerIdx = ref(0)
const selectedSeats = ref<Record<number, Seat>>({})

const currentMap = computed(() => seatmaps.value[activeMapIdx.value])

const totalSeatPrice = computed(() => {
  return Object.values(selectedSeats.value).reduce((sum, s) => sum + (s.price || 0), 0)
})

watch(totalSeatPrice, (val) => {
  emit('update:totalPrice', val)
})

const fetchSeatmap = async () => {
  loading.value = true
  try {
    const rawOffer = props.flightOffer.rawOffer || props.flightOffer
    let provider = props.flightOffer.provider
    if (!provider) {
      if (rawOffer.slices) provider = 'duffel'
      else if (rawOffer.itineraries) provider = 'amadeus'
    }
    const res = await flightsApi.getSeatmaps({ flightOffer: rawOffer, provider })
    if (res.data?.data) {
      seatmaps.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to fetch seatmap', err)
  } finally {
    loading.value = false
  }
}

const isSeatAvailable = (element: any) => {
  return element.type === 'seat' && element.available_services?.length > 0
}

const isSeatSelectedByActivePlayer = (element: any) => {
  const seat = selectedSeats.value[activePassengerIdx.value]
  return seat && seat.designator === element.designator && seat.mapIdx === activeMapIdx.value
}

const handleSeatClick = (element: any) => {
  if (!isSeatAvailable(element)) return
  const service = element.available_services[0]
  if (isSeatSelectedByActivePlayer(element)) {
    delete selectedSeats.value[activePassengerIdx.value]
  } else {
    selectedSeats.value[activePassengerIdx.value] = {
      id: element.id,
      designator: element.designator,
      price: parseFloat(service.total_amount),
      serviceId: service.id,
      mapIdx: activeMapIdx.value
    }
  }
  const services: any[] = []
  Object.values(selectedSeats.value).forEach(seat => {
    services.push({ id: seat.serviceId, quantity: 1 })
  })
  emit('update:modelValue', services)
}

const formatPrice = (price: number) => (price || 0).toLocaleString(undefined, {
  style: 'currency',
  currency: props.flightOffer.currency || 'USD'
})

onMounted(fetchSeatmap)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Ensure touch targets are comfortable on mobile */
@media (max-width: 640px) {
  .touch-manipulation {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>