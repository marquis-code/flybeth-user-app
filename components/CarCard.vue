<template>
  <div class="bg-white rounded-[2.5rem] p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer flex flex-col md:flex-row gap-6 lg:gap-10">
    
    <!-- Car Image & Quick Badge -->
    <div class="md:w-[320px] lg:w-[380px] h-60 md:h-auto shrink-0 relative flex items-center justify-center rounded-[2rem] bg-[#F8FAFC] border border-gray-200 overflow-hidden group-hover:bg-white transition-colors duration-500">
      <img v-if="imageUrl" :src="imageUrl" :alt="carName" class="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-1000 ease-out" />
      <div v-else class="w-20 h-20 bg-gray-100 rounded-full animate-pulse flex items-center justify-center text-black">
         <TruckIcon class="h-10 w-10" />
      </div>

      <!-- Provider Badge -->
      <div class="absolute top-4 left-4 flex gap-2">
         <div v-if="car.rating" class="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-white/20">
            <StarIcon class="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
            <span class="text-[11px] font-extrabold text-black">{{ car.rating }}/10</span>
         </div>
      </div>

      <div class="absolute bottom-4 left-4">
         <div class="bg-brand-blue text-white px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase  shadow-lg shadow-brand-blue/20">
            {{ carCategory || 'Rental' }}
         </div>
      </div>
    </div>

    <!-- Details -->
    <div class="flex-1 flex flex-col justify-between py-1">
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 class="text-2xl font-bold text-black group-hover:text-brand-blue transition-colors leading-tight">{{ carName }}</h3>
            <p class="text-xs font-bold text-black uppercase  mt-1">Or similar · {{ transmission || 'Automatic' }} · {{ fuelType || 'Petrol' }}</p>
          </div>
          <div class="flex items-center gap-2">
             <div class="text-right hidden sm:block">
                <p class="text-[9px] font-bold text-black uppercase ">Provider</p>
                <p class="text-sm font-extrabold text-black">{{ car.provider || 'Rental Partner' }}</p>
             </div>
          </div>
        </div>

        <!-- Features List -->
        <div class="flex flex-wrap items-center gap-2 mt-2">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-gray-100">
            <UserIcon class="h-3.5 w-3.5 text-[#64748B]" />
            <span class="text-[11px] font-bold text-[#334155]">{{ seats }} {{ seats > 1 ? 'Seats' : 'Seat' }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-gray-100">
            <BriefcaseIcon class="h-3.5 w-3.5 text-[#64748B]" />
            <span class="text-[11px] font-bold text-[#334155]">{{ bags }} {{ bags > 1 ? 'Bags' : 'Bag' }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-gray-100">
            <CogIcon class="h-3.5 w-3.5 text-[#64748B]" />
            <span class="text-[11px] font-bold text-[#334155] truncate">{{ transmission || 'Automatic' }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-green/10 border border-brand-green/20">
            <CheckCircleIcon class="h-3.5 w-3.5 text-brand-green" />
            <span class="text-[10px] font-bold text-brand-green uppercase tracking-wide">Unlimited km</span>
          </div>
        </div>
      </div>

      <!-- Price & CTA -->
      <div class="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
        <div class="flex items-baseline gap-1.5">
           <div class="flex flex-col">
              <span class="text-sm font-bold text-black uppercase  mb-0.5">Total Price</span>
              <div class="flex items-baseline gap-1">
                 <span class="text-3xl font-extrabold text-black er">{{ formatCarPrice(totalPrice) }}</span>
              </div>
           </div>
           <span class="text-[11px] font-bold text-black ml-1">/ trip</span>
        </div>
        
        <button 
          @click.stop="$emit('select', car)"
          class="h-14 px-8 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase  hover:bg-brand-blue/90 shadow-xl shadow-brand-blue/20 active:scale-95 transition-all flex items-center gap-2"
        >
          Book Now
          <ArrowRightIcon class="h-4 w-4" />
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
