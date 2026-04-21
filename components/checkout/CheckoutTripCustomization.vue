<template>
  <div class="trip-customization-step p-3">
    <!-- Info Summary Container -->
    <div class="bg-white rounded-3xl border border-gray-100 p-8 mb-6 shadow-sm">
      <h3 class="text-[10px]  text-gray-400 tracking-[0.2em] mb-6 uppercase">Confirm Itinerary Details</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Flight Breakdown -->
        <div v-if="flightOffer" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <Plane class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold text-gray-400 tracking-widest block mb-1">Flight</span>
            <div class="flex items-center gap-2">
              <span class="text-base  text-gray-900">{{ flightOffer.origin }}</span>
              <ChevronRight class="w-3 h-3 text-gray-300" />
              <span class="text-base  text-gray-900">{{ flightOffer.destination }}</span>
            </div>
            <p class="text-[9px] font-bold text-gray-400 tracking-widest mt-1">{{ flightOffer.airline }}</p>
          </div>
        </div>
        
        <!-- Stay Breakdown -->
        <div v-if="stay" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <Building2 class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold text-gray-400 tracking-widest block mb-1">Accommodation</span>
            <p class="text-base  text-gray-900 leading-tight truncate">{{ stay.hotelName || stay.name }}</p>
            <p class="text-[9px] font-bold text-gray-400 tracking-widest mt-1">Confirmed Room Rate</p>
          </div>
        </div>

        <!-- Traveller Info -->
        <div v-if="traveller" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <User class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold text-gray-400 tracking-widest block mb-1">Traveler</span>
            <p class="text-base  text-gray-900">{{ formatName(traveller.firstName) }} {{ traveller.lastName }}</p>
            <p class="text-[9px] font-bold text-gray-400 tracking-widest mt-1">{{ traveller.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Optional Enhancements Section -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-5 px-1">
         <Sparkles class="w-4 h-4 text-blue-600" />
         <h3 class="text-base  text-gray-900 tracking-tight">Additional Services & Enhancements</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div 
          v-for="addon in allServices" 
          :key="addon.id" 
          class="p-4 rounded-2xl border-2 transition-all cursor-pointer relative group overflow-hidden"
          :class="[
            isAddonSelected(addon.id) 
              ? 'border-blue-600 bg-white ring-4 ring-blue-50' 
              : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white'
          ]"
          @click="toggleAddon(addon)"
        >
          <div class="flex items-center gap-4 relative z-10">
            <div class="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 text-blue-600">
               <component :is="addon.icon" class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h4 class="text-xs font-black text-gray-900 mb-0.5">{{ addon.name }}</h4>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{{ addon.price > 0 ? `+${formatPriceValue(addon.price)}` : 'Included' }}</p>
            </div>
            <div 
              class="w-5 h-5 rounded-full border transition-all flex items-center justify-center flex-shrink-0"
              :class="isAddonSelected(addon.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 bg-white text-gray-200'"
            >
              <Check v-if="isAddonSelected(addon.id)" class="w-3 h-3" />
              <Plus v-else class="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conditional Seat Selection Area -->
    <div v-if="isAddonSelected('seat-selection')" class="mb-10 animate-in slide-in-from-top-4 duration-500">
       <div class="bg-gray-50 rounded-[3rem] p-1 border-2 border-blue-100/50 relative overflow-hidden">

          <SeatSelection
            v-if="flightOffer"
            is-embedded
            :flightOffer="flightOffer"
            :passengers="traveller"
            :modelValue="selectedSeats"
            @update:modelValue="val => $emit('update:selectedSeats', val)"
            @update:totalPrice="val => $emit('update:seatPrice', val)"
            @remove="toggleAddon({id: 'seat-selection'})"
            @continue="$emit('continue')" 
            @back="$emit('back')"
          />
       </div>
    </div>

    <!-- Continue -->
    <div class="mt-12 flex items-center justify-between border-t border-gray-50 pt-10 px-4">
      <button @click="$emit('back')" class="text-[10px]  uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
        Go Back
      </button>
      <button @click="$emit('continue')" class="group relative bg-gray-900 hover:bg-black px-12 h-14 rounded-lg  tracking-[0.2em] text-[11px] text-white transition-all active:scale-[0.98] shadow-2xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 -translate-x-full group-hover:animate-shimmer"></div>
        <span class="relative z-10 flex items-center gap-4">
          Continue to Payment
          <ChevronRight class="w-4 h-4" />
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plane, Building2, User, ChevronRight, Sparkles, ChevronDown, Check, Plus, Minus, Armchair, Briefcase, ShieldCheck } from 'lucide-vue-next'
import SeatSelection from './SeatSelection.vue'

const props = defineProps({
  flightOffer: { type: Object, default: null },
  stay: { type: Object, default: null },
  traveller: { type: Object, default: null },
  totalPrice: { type: Number, default: 0 },
  selectedAddOns: { type: Array as () => any[], default: () => [] },
  selectedSeats: { type: Array as () => any[], default: () => [] }
})

const emit = defineEmits(['continue', 'back', 'update:selectedAddOns', 'update:selectedSeats', 'update:seatPrice'])

const allServices = computed(() => {
  const services = [
    { id: 'insurance', icon: ShieldCheck, name: 'Travel Insurance', price: 12, type: 'static' },
    { id: 'seat-selection', icon: Armchair, name: 'Seat Selection', price: 0, type: 'internal' }
  ]

  const liveServices = props.flightOffer?.rawOffer?.available_services || []
  const baggageServices = liveServices
    .filter((s: any) => s.type === 'baggage')
    .map((s: any) => ({
      id: s.id,
      name: s.metadata?.label || `Extra ${s.metadata?.type || 'Baggage'}`,
      price: parseFloat(s.total_amount),
      icon: Briefcase,
      type: 'duffel',
      raw: s
    }))

  if (baggageServices.length) {
    services.unshift(...baggageServices)
  } else {
    // Only use fallback if no live baggage services were found
    services.unshift({ id: 'extra-baggage', icon: Briefcase, name: 'Extra Baggage', price: 45, type: 'static' })
  }

  return services
})

const isAddonSelected = (id: string) => {
  return props.selectedAddOns.some((a: any) => a.id === id)
}

const toggleAddon = (addon: any) => {
  const current = [...props.selectedAddOns]
  const idx = current.findIndex((a: any) => a.id === addon.id)
  if (idx >= 0) {
    current.splice(idx, 1)
    if (addon.id === 'seat-selection') {
       emit('update:selectedSeats', [])
       emit('update:seatPrice', 0)
    }
  } else {
    current.push({ 
      id: addon.id, 
      name: addon.name, 
      price: addon.price,
      type: addon.type,
      service_id: addon.type === 'duffel' ? addon.id : null
    })
  }
  emit('update:selectedAddOns', current)
}

const formatPriceValue = (price: number) => (price || 0).toLocaleString(undefined, { 
  style: 'currency', 
  currency: props.flightOffer?.currency || 'USD' 
})

const formatName = (name: string) => {
  if (!name) return ''
  // If name contains a URL (http/localhost), strip it and return 'Traveler' or the clean part
  if (name.includes('http') || name.includes('localhost') || name.includes('/')) {
    const parts = name.split(' ')
    const clean = parts.filter(p => !p.includes('http') && !p.includes('/')).join(' ')
    return clean || 'Guest'
  }
  return name
}
</script>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
.group-hover\:animate-shimmer:hover {
  animation: shimmer 2s infinite;
}
</style>
