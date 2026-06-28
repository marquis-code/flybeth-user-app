<template>
  <div class="bg-white rounded-[20px] overflow-hidden mb-6 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
    <!-- Header: Price and Recommended Badge -->
    <div class="bg-white px-6 sm:px-8 py-5 sm:py-6 flex flex-wrap items-center justify-between border-b border-gray-100 gap-4">
      <div class="flex items-center gap-3">
        <div v-if="isRecommended" class="bg-brand-green/10 text-brand-green text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase ">
          <Star class="w-3.5 h-3.5 fill-current" />
          Recommended
        </div>
        <div v-else class="text-sm font-semibold text-gray-500 flex items-center gap-2">
          <Plane class="w-4 h-4 text-gray-400" />
          Flight Offer
        </div>
      </div>
      
      <div class="flex items-center gap-3 ml-auto">
        <span class="text-xs font-bold text-gray-400 uppercase ">Total Price</span>
        <span class="text-2xl font-bold text-black">{{ formattedPrice }}</span>
      </div>
    </div>

    <!-- Slices (Outbound, Return, etc.) rendered as FlightCards -->
    <div class="p-4 sm:p-5 space-y-3 bg-gray-50/50">
      <FlightCard 
        v-for="(slice, index) in slices" 
        :key="index"
        :flight="slice" 
      />
    </div>

    <!-- Footer: Baggage & Next Step -->
    <div class="bg-white px-6 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 gap-4">
      <!-- Summary / Baggage -->
      <div class="flex items-center gap-5 w-full sm:w-auto">
        <div class="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Luggage class="w-4 h-4 text-gray-400" />
          <span class="hidden sm:inline">Carry-on included</span>
          <span class="sm:hidden">Carry-on</span>
        </div>
        <div class="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Users class="w-4 h-4 text-gray-400" />
          <span class="hidden sm:inline">{{ passengersCount }} Passengers</span>
          <span class="sm:hidden">{{ passengersCount }} Pax</span>
        </div>
      </div>

      <!-- Action Button -->
      <button 
        @click="$emit('select', flight)"
        class="w-full sm:w-auto bg-[#0D1DAD] hover:bg-[#002a66] text-white px-10 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
      >
        Next step
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star, Plane, Luggage, Users, ArrowRight } from 'lucide-vue-next'
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
