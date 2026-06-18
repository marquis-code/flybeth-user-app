<template>
  <div class="seat-selection-step p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 group/header">
      <div class="flex items-center gap-3 whitespace-nowrap">
        <Armchair class="w-6 h-6 text-blue-600" />
        <h3 class="text-xl md:text-2xl font-black text-black">
          Select Your Seat
        </h3>
      </div>

      <!-- Legend (Compact) -->
      <div class="flex flex-wrap items-center gap-4 px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-md bg-[#F0F4FF] border border-[#0D1DAD]/30"></div>
          <span class="text-[10px] font-bold text-gray-700 uppercase">Available</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-md bg-[#0D1DAD] border border-[#0D1DAD]"></div>
          <span class="text-[10px] font-bold text-gray-700 uppercase">Selected</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-md bg-gray-100 border border-gray-200 relative overflow-hidden">
             <div class="absolute inset-0 flex items-center justify-center text-gray-300">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
             </div>
          </div>
          <span class="text-[10px] font-bold text-gray-700 uppercase">Occupied</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-6">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-[#0D1DAD] rounded-full animate-spin"></div>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Mapping Aircraft Cabin</p>
        <p class="text-sm font-bold text-gray-900 mt-2">Retrieving real-time availability...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="seatmaps.length" class="space-y-6">
      <!-- Main Selection Bar -->
      <div class="w-full flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-gray-200 rounded-[24px] shadow-sm relative overflow-hidden group gap-4">
        <div class="absolute inset-0 bg-[#0D1DAD]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <!-- Selection Info -->
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-12 h-12 rounded-full bg-[#F0F4FF] flex items-center justify-center text-[#0D1DAD]">
            <User class="w-6 h-6" />
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold text-gray-500 uppercase mb-1">Traveler Selection</p>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-gray-900 truncate">{{ passengers.firstName || 'Traveler' }} {{ passengers.lastName || '1' }}</span>
              <div v-if="selectedSeats[0]" class="px-3 py-1 bg-[#E2FCA4] text-[#2F4F2F] text-[10px] font-bold rounded-md uppercase ">
                SEAT {{ selectedSeats[0].designator }}
              </div>
            </div>
          </div>
        </div>
 
        <!-- Pricing -->
        <div class="md:text-right relative z-10">
          <p class="text-[10px] font-bold text-gray-500 uppercase mb-1">Seat Surcharge</p>
          <span class="text-2xl font-black text-[#0D1DAD]">{{ formatPrice(totalSeatPrice) }}</span>
        </div>
      </div>

      <!-- Aircraft Cabin UI -->
      <div class="w-full mt-8 bg-white border border-gray-200 rounded-[24px] shadow-sm p-4 md:p-8">
        
        <div class="overflow-x-auto custom-scrollbar pb-8">
          <div v-if="currentMap" class="min-w-max mx-auto">
            <div v-for="(cabin, cIdx) in currentMap.cabins" :key="cIdx" class="mb-12">

              <!-- Cabin Header -->
              <div class="mb-8">
                <h4 class="text-lg font-black text-gray-900 capitalize">{{ cabin.cabin_class || cabin.name || 'Cabin' }}</h4>
              </div>

              <!-- Column Labels -->
              <div class="flex items-center gap-2 sm:gap-4 mb-4">
                 <!-- Left spacer for row number -->
                 <div class="w-8 sm:w-10 flex-shrink-0"></div>
                 
                 <div class="flex items-center gap-4 sm:gap-6 flex-1">
                   <template v-for="(section, sIdx) in cabin.rows[0]?.sections" :key="`col-sec-${sIdx}`">
                     <div v-if="sIdx > 0" class="w-6 sm:w-8 flex-shrink-0"></div> <!-- Aisle -->
                     <div class="flex items-center gap-2 sm:gap-3">
                       <div v-for="(element, eIdx) in section.elements" :key="`col-${eIdx}`" class="w-20 sm:w-24 text-center text-sm font-black text-gray-400">
                         {{ element.designator ? element.designator.replace(/^[0-9]+/, '') : '' }}
                       </div>
                     </div>
                   </template>
                 </div>
              </div>

              <!-- Rows -->
              <div class="flex flex-col gap-3">
                <div
                  v-for="(row, rIdx) in cabin.rows"
                  :key="rIdx"
                  class="flex items-center gap-2 sm:gap-4 w-full"
                >
                  <!-- Row Number Left -->
                  <div class="w-8 sm:w-10 flex-shrink-0 text-left">
                    <span class="text-sm font-bold text-gray-900">{{ row.number || row.sections[0]?.elements?.find(e => e.designator)?.designator?.replace(/[A-Za-z]+$/, '') }}</span>
                  </div>

                  <!-- Sections -->
                  <div class="flex items-center gap-4 sm:gap-6 flex-1">
                    <template v-for="(section, sIdx) in row.sections" :key="sIdx">
                      <!-- Aisle spacer between sections -->
                      <div v-if="sIdx > 0" class="w-6 sm:w-8 flex-shrink-0"></div>

                      <div class="flex items-center gap-2 sm:gap-3">
                        <div v-for="(element, eIdx) in section.elements" :key="eIdx">
                          <template v-if="element.type === 'seat'">
                            <button
                              @click="handleSeatClick(element)"
                              :disabled="!isSeatAvailable(element)"
                              class="w-20 h-12 sm:w-24 sm:h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-200 border touch-manipulation font-bold text-xs sm:text-[13px]"
                              :class="[
                                isSeatSelectedByActivePlayer(element)
                                  ? 'bg-[#0D1DAD] border-[#0D1DAD] text-white shadow-md'
                                  : isSeatAvailable(element)
                                    ? 'bg-white border-[#0D1DAD]/40 text-[#0D1DAD] hover:bg-[#F0F4FF] hover:border-[#0D1DAD]'
                                    : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                              ]"
                            >
                              <template v-if="isSeatSelectedByActivePlayer(element)">
                                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </template>
                              <template v-else-if="!isSeatAvailable(element)">
                                <svg class="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                              </template>
                              <template v-else>
                                <span>{{ formatPrice(parseFloat(element.available_services[0].total_amount)) }}</span>
                              </template>
                            </button>
                          </template>

                          <div v-else-if="element.type === 'empty'" class="w-20 h-12 sm:w-24 sm:h-14"></div>

                          <div v-else class="w-20 h-12 sm:w-24 sm:h-14 flex items-center justify-center text-gray-300">
                            <!-- Bassinet or other non-seat elements -->
                            <div class="w-2 h-2 rounded-full bg-gray-200"></div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-gray-200 bg-white">
      <div class="w-16 h-16 rounded-2xl bg-[#F0F4FF] flex items-center justify-center shadow-sm mb-4 text-[#0D1DAD]">
        <Armchair class="w-8 h-8" />
      </div>
      <p class="text-lg font-black text-gray-900">No Seat Map Available</p>
      <p class="text-sm font-medium text-gray-500 mt-1 text-center px-4">Seat selection is not supported for this flight.</p>
    </div>

    <!-- Navigation -->
    <div v-if="!isEmbedded" class="mt-10 flex items-center justify-between border-t border-gray-200 pt-8">
      <button @click="$emit('back')" class="group flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
        <ChevronRight class="w-4 h-4 rotate-180" />
        Back
      </button>

      <button @click="$emit('continue')" class="group flex items-center gap-2 px-8 py-3 bg-[#0D1DAD] text-white rounded-xl hover:bg-[#0A1485] transition-colors font-bold shadow-md hover:shadow-lg">
        Confirm Selection
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Armchair, Info, ChevronRight, Minus, User, ChevronDown } from 'lucide-vue-next'
import { flightsApi } from '~/api_factory/modules/flights'
import { useSettings } from '~/composables/useSettings'

const { formatPrice, currentCurrency } = useSettings()

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