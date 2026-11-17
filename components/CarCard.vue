<template>
  <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col md:flex-row gap-4 sm:gap-6">
    
    <!-- Car Image & Quick Badge -->
    <div class="md:w-56 lg:w-64 h-40 sm:h-44 md:h-auto shrink-0 relative flex items-center justify-center rounded-xl bg-[#F8FAFC] border border-gray-100 overflow-hidden group-hover:bg-white transition-colors duration-300">
      <img v-if="imageUrl" :src="imageUrl" :alt="carName" class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out" />
      <div v-else class="w-16 h-16 bg-gray-100 rounded-full animate-pulse flex items-center justify-center text-gray-400">
         <TruckIcon class="h-8 w-8" />
      </div>

      <!-- Provider Badge -->
      <div class="absolute top-2.5 left-2.5 flex gap-1.5">
         <div v-if="car.rating" class="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100">
            <StarIcon class="h-3 w-3 text-amber-500 fill-amber-500" />
            <span class="text-[10px] font-bold text-gray-800">{{ car.rating }}/10</span>
         </div>
      </div>

      <div class="absolute bottom-2.5 left-2.5">
         <div class="bg-[#0D1DAD] text-white px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm">
            {{ carCategory || 'Rental' }}
         </div>
      </div>
    </div>

    <!-- Details -->
    <div class="flex-1 flex flex-col justify-between py-0.5 min-w-0">
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0D1DAD] transition-colors leading-snug truncate">{{ carName }}</h3>
            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mt-0.5">Or similar · {{ transmission || 'Automatic' }} · {{ fuelType || 'Petrol' }}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
             <div class="text-left sm:text-right">
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Partner</p>
                <p class="text-xs font-bold text-[#0D1DAD]">Flybeth Verified</p>
             </div>
          </div>
        </div>

        <!-- Features List -->
        <div class="flex flex-wrap items-center gap-1.5 mt-2">
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-600">
            <UserIcon class="h-3.5 w-3.5 text-gray-400" />
            <span class="text-[11px] font-semibold">{{ seats }} {{ seats > 1 ? 'Seats' : 'Seat' }}</span>
          </div>
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-600">
            <BriefcaseIcon class="h-3.5 w-3.5 text-gray-400" />
            <span class="text-[11px] font-semibold">{{ bags }} {{ bags > 1 ? 'Bags' : 'Bag' }}</span>
          </div>
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-600">
            <CogIcon class="h-3.5 w-3.5 text-gray-400" />
            <span class="text-[11px] font-semibold truncate">{{ transmission || 'Automatic' }}</span>
          </div>
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700">
            <CheckCircleIcon class="h-3.5 w-3.5 text-emerald-600" />
            <span class="text-[10px] font-bold uppercase tracking-wider">Unlimited km</span>
          </div>
        </div>
      </div>

      <!-- Price & CTA -->
      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div class="flex flex-col">
           <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Price</span>
           <div class="flex items-baseline gap-1">
              <span class="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">{{ formatCarPrice(totalPrice) }}</span>
              <span class="text-[11px] font-medium text-gray-500">/ trip</span>
           </div>
        </div>
        
        <button 
          @click.stop="$emit('select', car)"
          class="h-9 sm:h-10 px-5 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
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
