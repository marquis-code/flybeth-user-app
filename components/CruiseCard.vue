<template>
  <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col md:flex-row gap-4 sm:gap-6">
    
    <!-- Ship Image & Quick Badges -->
    <div class="md:w-56 lg:w-64 h-40 sm:h-44 md:h-auto shrink-0 relative flex items-center justify-center rounded-xl bg-[#F8FAFC] border border-gray-100 overflow-hidden group-hover:bg-white transition-colors duration-300">
      <img v-if="cruise.image" :src="cruise.image" :alt="cruise.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
         <GlobeAltIcon class="h-12 w-12 opacity-30" />
      </div>

      <!-- Rating & Nights Badge -->
      <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
         <div v-if="cruise.rating" class="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100">
            <StarIcon class="h-3 w-3 text-amber-500 fill-amber-500" />
            <span class="text-[10px] font-bold text-gray-800">{{ cruise.rating }}/5</span>
         </div>
         <div class="bg-[#0D1DAD] text-white px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm">
            {{ cruise.duration }} Nights
         </div>
      </div>

      <!-- Line Badge -->
      <div class="absolute bottom-2.5 left-2.5">
         <div class="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-gray-100">
            <span class="text-[10px] font-bold text-gray-800 uppercase tracking-wider">{{ cruise.cruiseLineName || 'Cruise Line' }}</span>
         </div>
      </div>
    </div>

    <!-- Details -->
    <div class="flex-1 flex flex-col justify-between py-0.5 min-w-0">
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0D1DAD] transition-colors leading-snug truncate">{{ cruise.name }}</h3>
            <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wide mt-0.5 flex items-center gap-1">
               <MapPinIcon class="h-3 w-3 text-gray-400 shrink-0" />
               <span class="truncate">{{ cruise.itinerarySummary || 'Multiple Destinations' }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
             <div class="text-left sm:text-right">
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Ship</p>
                <p class="text-xs font-bold text-[#0D1DAD]">{{ cruise.shipName || 'Luxury Vessel' }}</p>
             </div>
          </div>
        </div>

        <!-- Itinerary Quick Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
          <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
            <CalendarIcon class="h-3.5 w-3.5 text-[#0D1DAD]" />
            <div class="flex flex-col min-w-0">
               <span class="text-[8px] font-bold text-gray-400 uppercase">Departure</span>
               <span class="text-[11px] font-semibold text-gray-700 truncate">{{ formatDate(cruise.departureDate) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
            <UserIcon class="h-3.5 w-3.5 text-[#0D1DAD]" />
            <div class="flex flex-col min-w-0">
               <span class="text-[8px] font-bold text-gray-400 uppercase">Guests</span>
               <span class="text-[11px] font-semibold text-gray-700">Up to 4</span>
            </div>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
            <SparklesIcon class="h-3.5 w-3.5 text-[#0D1DAD]" />
            <div class="flex flex-col min-w-0">
               <span class="text-[8px] font-bold text-gray-400 uppercase">Service</span>
               <span class="text-[11px] font-semibold text-gray-700">Premium</span>
            </div>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
            <CheckCircleIcon class="h-3.5 w-3.5 text-emerald-600" />
            <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">All Inclusive</span>
          </div>
        </div>
      </div>

      <!-- Price & CTA -->
      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div class="flex flex-col">
           <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Starting from</span>
           <div class="flex items-baseline gap-1">
              <span class="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">{{ formatCruisePrice(cruise.pricing?.startingPrice || cruise.price) }}</span>
              <span class="text-[11px] font-medium text-gray-500">/ person</span>
           </div>
        </div>
        
        <button 
          @click.stop="$emit('select', cruise)"
          class="h-9 sm:h-10 px-5 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>View Deal</span>
          <ArrowRightIcon class="h-3.5 w-3.5" />
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
import { useSettings } from '@/composables/useSettings'

const { formatPrice } = useSettings()

const props = defineProps({
  cruise: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const formatCruisePrice = (p: any) => {
  const num = parseFloat(p)
  if (isNaN(num)) return formatPrice(0)
  return formatPrice(num)
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
