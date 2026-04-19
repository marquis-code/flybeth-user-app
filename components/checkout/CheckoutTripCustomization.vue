<template>
  <div class="trip-customization-step p-3">
    <!-- Info Summary Container -->
    <div class="bg-white rounded-3xl border border-gray-100 p-8 mb-6 shadow-sm">
      <h3 class="text-[10px] font-black text-gray-400 tracking-[0.2em] mb-6 uppercase">Confirm Itinerary Details</h3>
      
      <div class="space-y-6">
        <!-- Flight Breakdown -->
        <div v-if="flightOffer" class="flex items-start gap-4 pb-6 border-b border-gray-100">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <Plane class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold text-gray-400 tracking-widest">Flight Itinerary</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-base font-black text-gray-900">{{ flightOffer.origin }}</span>
              <ChevronRight class="w-4 h-4 text-gray-500" />
              <span class="text-base font-black text-gray-900">{{ flightOffer.destination }}</span>
            </div>
            <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-1">{{ flightOffer.airline }} • {{ formatDuration(flightOffer.duration) }}</p>
          </div>
        </div>
        
        <!-- Stay Breakdown -->
        <div v-if="stay" class="flex items-start gap-4 pb-6 border-b border-gray-100">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <Building2 class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold text-gray-400 tracking-widest block mb-1">Accommodation</span>
            <p class="text-base font-black text-gray-900 leading-tight">{{ stay.hotelName || stay.name || stay.stay?.name }}</p>
            <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-1">{{ stay.roomName || stay.selectedRoom?.name || 'Selected Room' }}</p>
          </div>
        </div>

        <!-- Traveller Info -->
        <div v-if="traveller" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <User class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold text-gray-400 tracking-widest block mb-1">Primary Traveler</span>
            <p class="text-base font-black text-gray-900">{{ traveller.firstName }} {{ traveller.lastName }}</p>
            <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-1">{{ traveller.email }} • {{ traveller.phoneCountryCode }}{{ traveller.phone }}</p>
          </div>
          <div class="bg-gray-100/50 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-lg tracking-widest">
             Adult
          </div>
        </div>
      </div>
    </div>

    <!-- Big Summary Card -->
    <div class="bg-gray-900 rounded-3xl p-8 border border-gray-800 text-white relative overflow-hidden mb-8 shadow-xl">
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
      <h3 class="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4 uppercase">Investment Breakdown</h3>
      <div class="flex flex-col gap-1 items-start">
        <span class="text-4xl font-black tracking-tight">${{ formatPrice(totalPrice) }}</span>
        <span class="text-[11px] font-bold text-gray-400 tracking-widest mt-2 flex items-center gap-2">
           <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
           Guaranteed best price for the selected itinerary
        </span>
      </div>
    </div>

    <!-- Optional Enhancements Toggle -->
    <div class="mb-6">
      <div 
        class="group flex items-center gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 transition-all select-none"
        @click="showEnhancements = !showEnhancements"
      >
        <div 
          class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0"
          :class="showEnhancements ? 'bg-gray-900 border-gray-900' : 'border-gray-200 bg-gray-50'"
        >
          <Check v-if="showEnhancements" class="w-4 h-4 text-white" />
        </div>
        <div class="flex-1">
          <h3 class="text-[13px] font-black text-gray-900">Add Additional Services & Enhancements</h3>
          <p class="text-[11px] font-bold text-gray-400">Lounges, Medical Assistance, Flight Monitoring & more</p>
        </div>
        <div v-if="selectedAddOns.length > 0 && !showEnhancements" class="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase px-2 py-1 rounded-full tracking-tighter">
          {{ selectedAddOns.length }} Selected
        </div>
        <ChevronDown class="w-4 h-4 text-gray-300 transition-transform" :class="{ 'rotate-180': showEnhancements }" />
      </div>

      <!-- Add-ons List (Shown only if toggled) -->
      <div v-if="showEnhancements" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 transition-opacity duration-300">
        <div 
          v-for="addon in addOnsList" 
          :key="addon.id" 
          class="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 transition-all cursor-pointer relative overflow-hidden group"
          :class="{ 'border-gray-900 ring-1 ring-gray-900': isAddonSelected(addon.id) }"
          @click.stop="toggleAddon(addon)"
        >
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{{ addon.emoji }}</div>
          <div class="flex-1 min-w-0">
            <h4 class="text-[12px] font-black text-gray-900 mb-0.5 truncate">{{ addon.name }}</h4>
            <p class="text-[10px] font-bold text-gray-400 capitalize">${{ formatPrice(addon.price) }} • {{ addon.perPassenger ? 'per adult' : 'fixed' }}</p>
          </div>
          <div 
            class="w-6 h-6 rounded-full border flex items-center justify-center transition-all bg-white flex-shrink-0"
            :class="isAddonSelected(addon.id) ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-200 text-gray-300'"
          >
            <Check v-if="isAddonSelected(addon.id)" class="w-3 h-3" />
            <Plus v-else class="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>

    <!-- Continue -->
    <div class="mt-8 flex items-center justify-end">
      <button @click="$emit('continue')" class="w-full md:w-auto bg-gray-900 hover:bg-black px-10 h-16 rounded-2xl font-bold tracking-[0.2em] text-[11px] text-white transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-xl">
        Continue to Payment
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plane, Building2, User, ChevronRight, Sparkles, ChevronDown, Check, Plus } from 'lucide-vue-next'

const props = defineProps({
  flightOffer: { type: Object, default: null },
  stay: { type: Object, default: null },
  traveller: { type: Object, default: null },
  totalPrice: { type: Number, default: 0 },
  selectedAddOns: { type: Array as () => any[], default: () => [] }
})

const emit = defineEmits(['continue', 'update:selectedAddOns'])

const showEnhancements = ref(false)

const addOnsList = [
  { id: 'lounge', emoji: '🛋️', name: 'Airport Lounge Access', description: 'Priority lounge access with refreshments.', price: 19, perPassenger: true },
  { id: 'business-lounge', emoji: '🍸', name: 'Business Lounge', description: '5-star business lounge with charging ports.', price: 27, perPassenger: false },
  { id: 'call-reminder', emoji: '📞', name: 'Call Reminder', description: 'SMS and Call updates for flight changes.', price: 2, perPassenger: false },
  { id: 'medical-cancellation', emoji: '🏥', name: 'Medical Protection', description: 'Full refund for airfare due to illness.', price: 7, perPassenger: false },
  { id: 'wheelchair', emoji: '♿', name: 'Wheelchair Service', description: 'Personal assistance for mobility needs.', price: 6, perPassenger: false },
]

const isAddonSelected = (id: string) => {
  return props.selectedAddOns.some((a: any) => a.id === id)
}

const toggleAddon = (addon: any) => {
  const current = [...props.selectedAddOns]
  const idx = current.findIndex((a: any) => a.id === addon.id)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push({ id: addon.id, name: addon.name, price: addon.price })
  }
  emit('update:selectedAddOns', current)
}

const formatPrice = (price: number) => (price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDuration = (minutes: number) => {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}
</script>
