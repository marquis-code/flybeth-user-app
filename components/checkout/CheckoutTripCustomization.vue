<template>
  <div class="trip-customization-step p-4 md:p-8 space-y-10">
    <!-- Premium Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight mb-2">Enhance your trip</h2>
      <p class="text-sm text-gray-500">Pick the perfect extras for a tailored travel experience.</p>
    </div>

    <!-- Info Summary Container -->
    <div class="bg-gray-50/50 rounded-3xl border border-gray-100 p-6 md:p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Flight Breakdown -->
        <div v-if="flightOffer" class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
             <Plane class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <span class="text-[10px] font-bold text-gray-400 tracking-widest block mb-1 uppercase">Flight Route</span>
            <div class="flex items-center gap-2">
              <span class="text-base font-bold text-gray-900">{{ flightOffer.origin }}</span>
              <ChevronRight class="w-4 h-4 text-gray-300" />
              <span class="text-base font-bold text-gray-900">{{ flightOffer.destination }}</span>
            </div>
            <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-1">{{ flightOffer.airline }}</p>
          </div>
        </div>
        
        <!-- Stay Breakdown -->
        <div v-if="stay" class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
             <Building2 class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <span class="text-[10px] font-bold text-gray-400 tracking-widest block mb-1 uppercase">Accommodation</span>
            <p class="text-base font-bold text-gray-900 leading-tight truncate">{{ stay.hotelName || stay.name }}</p>
            <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-1">Confirmed Room</p>
          </div>
        </div>

        <!-- Traveller Info -->
        <div v-if="traveller" class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
             <User class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <span class="text-[10px] font-bold text-gray-400 tracking-widest block mb-1 uppercase">Traveler</span>
            <p class="text-base font-bold text-gray-900">{{ formatName(traveller.firstName) }} {{ traveller.lastName }}</p>
            <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-1 truncate">{{ traveller.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Optional Enhancements Section -->
    <div>
      <div class="flex items-center gap-3 mb-6">
         <Sparkles class="w-5 h-5 text-[#0D1DAD]" />
         <h3 class="text-lg font-bold text-gray-900 tracking-tight">Personalize your journey</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="addon in allServices" 
          :key="addon.id" 
          class="p-5 rounded-2xl border transition-all cursor-pointer relative group bg-white shadow-sm hover:translate-y-[-2px] hover:shadow-md"
          :class="[
            isAddonSelected(addon.id) 
              ? 'border-[#0D1DAD] ring-1 ring-[#0D1DAD]' 
              : 'border-gray-100'
          ]"
          @click="toggleAddon(addon)"
        >
          <div class="flex items-center gap-4 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 text-[#0D1DAD]">
               <component :is="addon.icon" class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-900 mb-0.5">{{ addon.name }}</h4>
              <p class="text-[10px] font-bold text-[#0D1DAD] uppercase tracking-widest">{{ addon.price > 0 ? `+${formatPriceValue(addon.price)}` : 'Included' }}</p>
            </div>
            <div 
              class="w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0"
              :class="isAddonSelected(addon.id) ? 'bg-[#0D1DAD] border-[#0D1DAD] text-white' : 'border-gray-200 bg-white'"
            >
              <Check v-if="isAddonSelected(addon.id)" class="w-4 h-4 shadow-sm" />
              <Plus v-else class="w-3 h-3 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conditional Seat Selection Area -->
    <div v-if="isAddonSelected('seat-selection')" class="animate-in slide-in-from-top-4 duration-500">
       <div class="bg-gray-900 rounded-3xl p-1 relative overflow-hidden">
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
    <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-100">
      <button @click="$emit('back')" class="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
        Go Back
      </button>
      <button @click="$emit('continue')" class="w-full sm:w-auto bg-[#0D1DAD] hover:bg-[#0D1DAD] px-12 h-14 rounded-2xl font-bold tracking-widest text-[11px] text-white transition-all active:scale-[0.98] shadow-lg shadow-[#0D1DAD]/20 flex items-center justify-center gap-4 uppercase">
        Continue to Payment
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plane, Building2, User, ChevronRight, Sparkles, ChevronDown, Check, Plus, Minus, Armchair, Briefcase, ShieldCheck } from 'lucide-vue-next'
import { useSettings } from '~/composables/useSettings'
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

const { ancillaryPrices } = useSettings()

const allServices = computed(() => {
  const services = [
    { id: 'insurance', icon: ShieldCheck, name: 'Travel Insurance', price: 12, type: 'static' },
    { id: 'seat-selection', icon: Armchair, name: 'Seat Selection', price: ancillaryPrices.value.seats || 0, type: 'internal' }
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
    // Use admin-configured price for fallback baggage
    services.unshift({ 
      id: 'extra-baggage', 
      icon: Briefcase, 
      name: 'Extra Baggage', 
      price: ancillaryPrices.value.bags || 45, 
      type: 'static' 
    })
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
