<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200 group">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Vehicle Image/Icon -->
      <div class="md:w-48 h-32 bg-white rounded-2xl flex items-center justify-center p-4 overflow-hidden relative">
        <img v-if="vehicleImage" :src="vehicleImage" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
        <Car v-else class="h-12 w-12 text-gray-400 stroke-[1.5]" />
        <div class="absolute top-2 left-2 bg-brand-green text-white text-[8px]  px-2 py-0.5 rounded-full uppercase ">
          {{ transfer.category?.name || transfer.category || transfer.transferType || 'Standard' }}
        </div>
      </div>

      <!-- Details -->
      <div class="flex-grow space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-gray-900">{{ vehicleName }}</h3>
            <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wide mt-0.5">{{ providerLabel }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">{{ displayPrice }}</p>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total for 2 pax</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3 border-b border-gray-100">
          <div class="flex items-center gap-1.5">
            <UserIcon class="h-3.5 w-3.5 text-gray-400" />
            <span class="text-xs font-semibold text-gray-700">{{ capacity }} Pax</span>
          </div>
          <div class="flex items-center gap-1.5">
            <BriefcaseIcon class="h-3.5 w-3.5 text-gray-400" />
            <span class="text-xs font-semibold text-gray-700">{{ luggage }} Bags</span>
          </div>
          <div class="flex items-center gap-1.5">
            <ClockIcon class="h-3.5 w-3.5 text-gray-400" />
            <span class="text-xs font-semibold text-gray-700">{{ duration }}</span>
          </div>
          <div class="flex items-center gap-1.5">
             <ShieldCheckIcon class="h-3.5 w-3.5 text-emerald-600" />
             <span class="text-xs font-bold text-emerald-700">Free Cancellation</span>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <div class="flex items-center gap-1.5 text-emerald-700">
            <CheckCircleIcon class="h-3.5 w-3.5 text-emerald-600" />
            <span class="text-xs font-bold uppercase tracking-wider">Meet & Greet Included</span>
          </div>
          <button 
            @click="$emit('select', transfer)" 
            class="h-9 sm:h-10 px-5 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, BriefcaseIcon, ClockIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { Car } from 'lucide-vue-next'
import { useSettings } from '~/composables/useSettings'

const { formatPrice, currentCurrency } = useSettings()

const props = defineProps<{
  transfer: any
}>()

const emit = defineEmits(['select'])

// ── Computed Mappings for Robustness (Hotelbeds vs Amadeus) ───────────────────
const vehicleName = computed(() => {
  return props.transfer.vehicle_name || 
         props.transfer.vehicle?.name || 
         props.transfer.vehicleDescription || 
         'Airport Transfer'
})

const vehicleImage = computed(() => {
  return props.transfer.vehicle_image || 
         props.transfer.content?.images?.[0]?.url || 
         (Array.isArray(props.transfer.images) ? props.transfer.images[0] : null) ||
         null
})

const providerLabel = computed(() => {
  return 'Flybeth Verified Transfer'
})

const displayPrice = computed(() => {
  // `price` is the NET supplier rate; `priceWithCommission` is the customer price.
  const p = props.transfer.priceWithCommission ?? props.transfer.price
  let amount = 0
  if (typeof p === 'number') amount = p
  else if (p?.totalAmount) amount = Number(p.totalAmount)
  else if (p?.amount || p?.total) amount = Number(p.amount || p.total)
  else return 'Check Price'
  return formatPrice(amount)
})

const capacity = computed(() => {
  return props.transfer.capacity || 
         props.transfer.maxPaxCapacity || 
         props.transfer.maxPassengers || 
         4
})

const luggage = computed(() => {
  const hbLuggage = props.transfer.transferDetailInfo?.find((i: any) => i.id === 'LUGGAGE')?.value
  return props.transfer.luggage_limit || hbLuggage || props.transfer.maxLuggage || 2
})

const duration = computed(() => {
  const hbDuration = props.transfer.transferDetailInfo?.find((i: any) => i.id === 'TRFTIME')?.value
  return props.transfer.duration || (hbDuration ? `${hbDuration} mins` : '45 mins')
})
</script>
