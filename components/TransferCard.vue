<template>
  <div class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200/90 group">
    <div class="flex flex-col md:flex-row gap-5 sm:gap-6 md:gap-7">
      <!-- Vehicle Image/Icon -->
      <div class="w-full md:w-56 lg:w-64 h-40 sm:h-44 md:h-auto min-h-[160px] bg-slate-50/90 rounded-2xl border border-slate-100 flex items-center justify-center p-5 overflow-hidden relative shrink-0">
        <img v-if="vehicleImage" :src="vehicleImage" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
        <Car v-else class="h-12 w-12 text-gray-400 stroke-[1.5]" />
        <div class="absolute top-3 left-3 bg-[#0D1DAD] text-white text-[9px] px-2.5 py-1 rounded-lg uppercase font-bold tracking-wider shadow-sm">
          {{ transfer.category?.name || transfer.category || transfer.transferType || 'Standard' }}
        </div>
      </div>

      <!-- Details -->
      <div class="flex-grow flex flex-col justify-between py-1 min-w-0 space-y-4">
        <div class="flex justify-between items-start gap-4">
          <div class="min-w-0 flex-1">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0D1DAD] transition-colors leading-snug">{{ vehicleName }}</h3>
            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mt-1">{{ providerLabel }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">{{ displayPrice }}</p>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Total for {{ transfer.passengers || transfer.pax || 2 }} pax</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-gray-100">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <UserIcon class="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span class="text-xs font-semibold text-gray-700 truncate">{{ capacity }} Pax</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <BriefcaseIcon class="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span class="text-xs font-semibold text-gray-700 truncate">{{ luggage }} Bags</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <ClockIcon class="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span class="text-xs font-semibold text-gray-700 truncate">{{ duration }}</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
             <ShieldCheckIcon class="h-3.5 w-3.5 text-emerald-600 shrink-0" />
             <span class="text-xs font-bold text-emerald-700 truncate">Free Cancel</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
          <div class="flex items-center gap-2 text-emerald-700">
            <CheckCircleIcon class="h-4 w-4 text-emerald-600 shrink-0" />
            <span class="text-xs font-bold uppercase tracking-wider">Meet & Greet Included</span>
          </div>
          <button 
            @click="$emit('select', transfer)" 
            class="h-10 sm:h-11 px-7 w-full sm:w-auto bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
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
