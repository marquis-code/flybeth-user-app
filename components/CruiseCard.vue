<template>
  <div class="bg-white rounded-[2.5rem] p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer flex flex-col md:flex-row gap-6 lg:gap-10">
    
    <!-- Ship Image & Quick Badges -->
    <div class="md:w-[320px] lg:w-[380px] h-60 md:h-auto shrink-0 relative flex items-center justify-center rounded-[2rem] bg-[#F8FAFC] border border-gray-100/50 overflow-hidden group-hover:bg-white transition-colors duration-500">
      <img v-if="cruise.image" :src="cruise.image" :alt="cruise.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
      <div v-else class="w-full h-full bg-gray-100/50 flex items-center justify-center text-gray-300">
         <GlobeAltIcon class="h-16 w-16 opacity-20" />
      </div>

      <!-- Rating & Nights Badge -->
      <div class="absolute top-4 left-4 flex flex-col gap-2">
         <div v-if="cruise.rating" class="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-white/20">
            <StarIcon class="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
            <span class="text-[11px] font-extrabold text-gray-900">{{ cruise.rating }}/5</span>
         </div>
         <div class="bg-brand-blue text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-blue/20">
            {{ cruise.duration }} Nights
         </div>
      </div>

      <!-- Line Badge -->
      <div class="absolute bottom-4 left-4">
         <div class="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md border border-white/20">
            <span class="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{{ cruise.cruiseLineName || 'Cruise Line' }}</span>
         </div>
      </div>
    </div>

    <!-- Details -->
    <div class="flex-1 flex flex-col justify-between py-1">
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors leading-tight">{{ cruise.name }}</h3>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
               <MapPinIcon class="h-3 w-3" />
               {{ cruise.itinerarySummary || 'Multiple Destinations' }}
            </p>
          </div>
          <div class="flex items-center gap-2">
             <div class="text-right hidden sm:block">
                <p class="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Ship</p>
                <p class="text-[11px] font-extrabold text-gray-500">{{ cruise.shipName || 'Luxury Vessel' }}</p>
             </div>
          </div>
        </div>

        <!-- Itinerary Quick Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
            <CalendarIcon class="h-4 w-4 text-brand-blue" />
            <div class="flex flex-col">
               <span class="text-[9px] font-bold text-gray-300 uppercase">Departure</span>
               <span class="text-[11px] font-bold text-gray-600 truncate">{{ formatDate(cruise.departureDate) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
            <UserIcon class="h-4 w-4 text-brand-blue" />
            <div class="flex flex-col">
               <span class="text-[9px] font-bold text-gray-300 uppercase">Guests</span>
               <span class="text-[11px] font-bold text-gray-600">Up to 4</span>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
            <SparklesIcon class="h-4 w-4 text-brand-blue" />
            <div class="flex flex-col">
               <span class="text-[9px] font-bold text-gray-300 uppercase">Service</span>
               <span class="text-[11px] font-bold text-gray-600">Premium</span>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-brand-green/5 border border-brand-green/10">
            <CheckCircleIcon class="h-4 w-4 text-brand-green" />
            <span class="text-[10px] font-bold text-brand-green uppercase tracking-wide">All Inclusive</span>
          </div>
        </div>
      </div>

      <!-- Price & CTA -->
      <div class="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div class="flex flex-col">
           <span class="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">Starting from</span>
           <div class="flex items-baseline gap-1.5">
              <span class="text-xs font-bold text-gray-400">USD</span>
              <span class="text-3xl font-extrabold text-gray-900 tracking-tighter">{{ formatPrice(cruise.pricing?.startingPrice || cruise.price) }}</span>
              <span class="text-[11px] font-bold text-gray-400 ml-1">/ person</span>
           </div>
        </div>
        
        <button 
          @click.stop="$emit('select', cruise)"
          class="h-14 px-8 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-blue/90 shadow-xl shadow-brand-blue/20 active:scale-95 transition-all flex items-center gap-2"
        >
          View Deal
          <ArrowRightIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UserIcon, 
  MapPinIcon,
  CalendarIcon,
  SparklesIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
  cruise: {
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

const formatDate = (d: string) => {
  if (!d) return 'TBA'
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return d
  }
}
</script>
