<template>
  <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 group cursor-pointer flex flex-col md:flex-row gap-4 sm:gap-6">
    
    <!-- Car Image & Quick Badge -->
    <div class="w-full md:w-56 lg:w-64 h-48 sm:h-52 md:h-auto shrink-0 relative flex items-center justify-center rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden group-hover:bg-slate-100/50 transition-colors duration-300">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="carName"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />
      <div v-else class="w-16 h-16 bg-slate-100 rounded-full animate-pulse flex items-center justify-center text-slate-400">
         <TruckIcon class="h-8 w-8" />
      </div>

      <!-- Badges on Image -->
      <div class="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        <span class="bg-[#0D1DAD] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
          {{ carCategory || 'Rental' }}
        </span>
        <div v-if="car.rating" class="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-slate-200/60">
          <StarIcon class="h-3 w-3 text-amber-500 fill-amber-500" />
          <span class="text-[10px] font-bold text-slate-800">{{ car.rating }}/10</span>
        </div>
      </div>
    </div>

    <!-- Details -->
    <div class="flex-1 flex flex-col justify-between min-w-0">
      <div>
        <div class="flex flex-row items-start justify-between gap-2 mb-2">
          <div class="min-w-0 flex-1">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0D1DAD] transition-colors leading-snug truncate">{{ carName }}</h3>
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Or similar · {{ transmission || 'Automatic' }} · {{ fuelType || 'Petrol' }}</p>
          </div>
          <div class="shrink-0 text-right">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#0D1DAD] text-[10px] font-bold tracking-wide border border-blue-100">
              <span class="w-1.5 h-1.5 rounded-full bg-[#0D1DAD]"></span>
              Flybeth Verified
            </span>
          </div>
        </div>

        <!-- Features Grid on mobile, wrap on sm+ -->
        <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
            <UserIcon class="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span class="text-xs font-semibold truncate">{{ seats }} {{ seats > 1 ? 'Seats' : 'Seat' }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
            <BriefcaseIcon class="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span class="text-xs font-semibold truncate">{{ bags }} {{ bags > 1 ? 'Bags' : 'Bag' }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
            <CogIcon class="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span class="text-xs font-semibold truncate">{{ transmission || 'Automatic' }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
            <CheckCircleIcon class="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span class="text-[10px] font-bold uppercase tracking-wider truncate">Unlimited km</span>
          </div>
        </div>
      </div>

      <!-- Price & CTA -->
      <div class="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div class="flex flex-col">
           <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Price</span>
           <div class="flex items-baseline gap-1">
              <span class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{{ formatCarPrice(totalPrice) }}</span>
              <span class="text-[11px] font-medium text-slate-500">/ trip</span>
           </div>
        </div>
        
        <button 
          @click.stop="$emit('select', car)"
          class="h-10 sm:h-11 px-5 sm:px-6 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Book Now</span>
          <ArrowRightIcon class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  UserIcon, 
  BriefcaseIcon, 
  CogIcon, 
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  TruckIcon
} from '@heroicons/vue/24/solid'
import { useSettings } from '@/composables/useSettings'
import {
  carTotalPrice,
  carName as readCarName,
  carCategory as readCarCategory,
  carTransmission,
  carFuelType,
  carImage,
  carSeats,
  carBags,
} from '@/composables/modules/cars/carFields'

const { formatPrice } = useSettings()

const props = defineProps({
  car: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

// Every field is normalised so platform cars (flat `name` / `transmission`,
// `pricing.total`) and live provider cars (`vehicle.*`, `price.totalAmount`)
// both render, and never as `undefined` / `NaN` / `$0`.
const carName = computed(() => readCarName(props.car))
const carCategory = computed(() => readCarCategory(props.car))
const transmission = computed(() => carTransmission(props.car))
const fuelType = computed(() => carFuelType(props.car))
const imageUrl = computed(() => carImage(props.car))
const seats = computed(() => carSeats(props.car))
const bags = computed(() => carBags(props.car))
const totalPrice = computed(() => carTotalPrice(props.car))

const formatCarPrice = (p: any) => {
  const num = Number(p)
  if (!Number.isFinite(num) || num <= 0) return 'Price on request'
  return formatPrice(num)
}
</script>
