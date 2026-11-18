<template>
  <div class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 group cursor-pointer flex flex-col md:flex-row gap-6 sm:gap-7 md:gap-8">
    
    <!-- Car Image & Quick Badge -->
    <div class="w-full md:w-60 lg:w-72 h-52 sm:h-56 md:h-auto min-h-[190px] shrink-0 relative flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden group-hover:bg-slate-100/50 transition-colors duration-300">
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
    <div class="flex-1 flex flex-col justify-between min-w-0 py-1 sm:py-2 px-2 sm:px-3">
      <div>
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2.5 flex-wrap mb-1">
              <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0D1DAD] transition-colors leading-snug">{{ carName }}</h3>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0D1DAD] text-[10px] font-bold tracking-wide border border-blue-100 shrink-0">
                <span class="w-1.5 h-1.5 rounded-full bg-[#0D1DAD]"></span>
                Flybeth Verified
              </span>
            </div>
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Or similar · {{ transmission || 'Automatic' }} · {{ fuelType || 'Petrol' }}</p>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 mt-3 pt-3.5 border-t border-slate-100">
          <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50/90 border border-slate-100 text-slate-700">
            <UserIcon class="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span class="text-xs font-semibold truncate">{{ seats }} {{ seats > 1 ? 'Seats' : 'Seat' }}</span>
          </div>
          <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50/90 border border-slate-100 text-slate-700">
            <BriefcaseIcon class="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span class="text-xs font-semibold truncate">{{ bags }} {{ bags > 1 ? 'Bags' : 'Bag' }}</span>
          </div>
          <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50/90 border border-slate-100 text-slate-700">
            <CogIcon class="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span class="text-xs font-semibold truncate">{{ transmission || 'Automatic' }}</span>
          </div>
          <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50/90 border border-emerald-100 text-emerald-700">
            <CheckCircleIcon class="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span class="text-[10px] font-bold uppercase tracking-wider truncate">Unlimited km</span>
          </div>
        </div>
      </div>

      <!-- Price & CTA -->
      <div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
        <div class="flex flex-col">
           <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Price</span>
           <div class="flex items-baseline gap-1">
              <span class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{{ formatCarPrice(totalPrice) }}</span>
              <span class="text-xs font-medium text-slate-500">/ trip</span>
           </div>
        </div>
        
        <button 
          @click.stop="$emit('select', car)"
          class="h-10 sm:h-11 px-6 sm:px-7 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2 shrink-0"
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
