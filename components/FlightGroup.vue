<template>
  <div class="bg-white rounded-xl overflow-hidden mb-4 border border-gray-200 transition-all duration-300 hover:shadow-md relative p-3 sm:p-4 pb-3">
    
    <!-- Top left Badge if recommended -->
    <div v-if="isRecommended" class="absolute top-0 left-0 bg-brand-green/10 text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-br-lg flex items-center gap-1 uppercase z-10">
      <Star class="w-3 h-3 fill-current" />
      Best
    </div>

    <div class="flex items-start justify-between">
      <!-- Slices wrapper -->
      <div class="flex-grow space-y-4 w-full min-w-0">
        <FlightCard 
          v-for="(slice, index) in slices" 
          :key="index"
          :flight="slice" 
        />
      </div>
    </div>
    
    <!-- Footer -->
    <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-[20px] sm:text-[24px] font-extrabold text-black leading-none mb-1.5">{{ formattedPrice }}</span>
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-500">{{ slices.length > 2 ? 'Multi-city' : (slices.length > 1 ? 'Round-trip' : 'One-way') }}</span>
          <span class="text-gray-300 text-xs">•</span>
          <button 
            @click.stop="$emit('select', flight)" 
            class="text-xs font-bold text-[#0D1DAD] hover:underline whitespace-nowrap"
          >
            Flight Details
          </button>
        </div>
      </div>

      <div class="flex items-center flex-shrink-0">
        <button 
          @click.stop="$emit('select', flight)"
          class="bg-[#0D1DAD] hover:bg-[#002a66] text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
        >
          Select <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'
import { useSettings } from '@/composables/useSettings'
import FlightCard from './FlightCard.vue'

const props = defineProps({
  flight: { type: Object, required: true },
  isRecommended: { type: Boolean, default: false },
  passengersCount: { type: Number, default: 1 }
})

defineEmits(['select'])

const { formatPrice } = useSettings()

const formattedPrice = computed(() => {
  const price = props.flight.priceWithCommission || props.flight.price || props.flight.total_amount
  return formatPrice(price)
})

const slices = computed(() => {
  // If flight has 'itineraries' (our new unified format), map them
  if (props.flight.itineraries && Array.isArray(props.flight.itineraries)) {
    return props.flight.itineraries.map(itin => ({
      ...itin,
      airline: itin.segments?.[0]?.airline || props.flight.airline,
      airlineLogo: itin.segments?.[0]?.airlineLogo || props.flight.airlineLogo,
      departureTime: itin.departureTime,
      arrivalTime: itin.arrivalTime,
      origin: itin.origin,
      destination: itin.destination,
      duration: itin.duration,
      stops: itin.stops,
      cabinClass: props.flight.cabinClass,
      conditions: props.flight.conditions
    }))
  }
  
  // Fallback to old behavior for backward compatibility
  if (props.flight.slices && Array.isArray(props.flight.slices)) {
    return props.flight.slices.map(slice => ({
      ...slice,
      airline: slice.segments?.[0]?.operating_carrier_name || props.flight.airline,
      airlineLogo: props.flight.airlineLogo,
      departureTime: slice.segments?.[0]?.departing_at,
      arrivalTime: slice.segments?.[slice.segments.length - 1]?.arriving_at,
      origin: slice.segments?.[0]?.origin_name,
      destination: slice.segments?.[slice.segments.length - 1]?.destination_name,
      duration: slice.duration,
      stops: slice.segments ? slice.segments.length - 1 : 0,
      cabinClass: props.flight.cabinClass,
      conditions: props.flight.conditions
    }))
  }
  
  // If it's a flat object, just return an array with the flight itself
  return [props.flight]
})
</script>
