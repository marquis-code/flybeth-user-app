<template>
  <div class="bg-white rounded-[2.5rem] p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer flex flex-col md:flex-row gap-6 lg:gap-10">
    
    <!-- Car Image & Quick Badge -->
    <div class="md:w-[320px] lg:w-[380px] h-60 md:h-auto shrink-0 relative flex items-center justify-center rounded-[2rem] bg-[#F8FAFC] border border-gray-100/50 overflow-hidden group-hover:bg-white transition-colors duration-500">
      <img v-if="car.image" :src="car.image" :alt="car.name" class="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-1000 ease-out" />
      <div v-else class="w-20 h-20 bg-gray-100 rounded-full animate-pulse flex items-center justify-center text-gray-500">
         <CarIcon class="h-10 w-10" />
      </div>

      <!-- Provider Badge -->
      <div class="absolute top-4 left-4 flex gap-2">
         <div v-if="car.rating" class="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-white/20">
            <StarIcon class="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
            <span class="text-[11px] font-extrabold text-gray-900">{{ car.rating }}/10</span>
         </div>
      </div>

      <div class="absolute bottom-4 left-4">
         <div class="bg-brand-blue text-white px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-brand-blue/20">
            {{ car.category || 'Rental' }}
         </div>
      </div>
    </div>

    <!-- Details -->
    <div class="flex-1 flex flex-col justify-between py-1">
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors leading-tight">{{ car.name }}</h3>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Or similar · {{ car.transmission }} · {{ car.fuelType || 'Petrol' }}</p>
          </div>
          <div class="flex items-center gap-2">
             <div class="text-right hidden sm:block">
                <p class="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Provider</p>
                <p class="text-[10px] font-extrabold text-gray-500">{{ car.provider || 'Rental Partner' }}</p>
             </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
            <UserIcon class="h-4 w-4 text-brand-blue" />
            <span class="text-xs font-bold text-gray-600">{{ car.seats }} {{ car.seats > 1 ? 'Seats' : 'Seat' }}</span>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
            <BriefcaseIcon class="h-4 w-4 text-brand-blue" />
            <span class="text-xs font-bold text-gray-600">{{ car.bags }} {{ car.bags > 1 ? 'Bags' : 'Bag' }}</span>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
            <CogIcon class="h-4 w-4 text-brand-blue" />
            <span class="text-xs font-bold text-gray-600 truncate">{{ car.transmission }}</span>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
            <CheckCircleIcon class="h-4 w-4 text-brand-green" />
            <span class="text-[11px] font-bold text-brand-green uppercase tracking-wide">Unlimited km</span>
          </div>
        </div>
      </div>

      <!-- Price & CTA -->
      <div class="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div class="flex items-baseline gap-1.5">
           <div class="flex flex-col">
              <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Total Price</span>
              <div class="flex items-baseline gap-1">
                 <span class="text-xs font-bold text-gray-400">USD</span>
                 <span class="text-3xl font-extrabold text-gray-900 tracking-tighter">{{ formatPrice(car.pricing?.basePrice || car.price) }}</span>
              </div>
           </div>
           <span class="text-[11px] font-bold text-gray-400 ml-1">/ trip</span>
        </div>
        
        <button 
          @click.stop="$emit('select', car)"
          class="h-14 px-8 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-blue/90 shadow-xl shadow-brand-blue/20 active:scale-95 transition-all flex items-center gap-2"
        >
          Book Now
          <ArrowRightIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UserIcon, 
  BriefcaseIcon, 
  CogIcon, 
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
  car: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const formatPrice = (p: any) => {
  const num = parseFloat(p)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>
