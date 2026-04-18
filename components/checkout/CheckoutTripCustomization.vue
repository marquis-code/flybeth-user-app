<template>
  <div class="trip-customization-step">
    <!-- Info Summary Container -->
    <div class="bg-white rounded-3xl border border-gray-300 p-8 mb-6">
      <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Confirmed Details</h3>
      
      <div class="space-y-6">
        <!-- Flight Breakdown -->
        <div v-if="flightOffer" class="flex items-start gap-4 pb-6 border-b border-gray-300">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <Plane class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Flight Itinerary</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-base font-black text-gray-900">{{ flightOffer.origin }}</span>
              <ChevronRight class="w-4 h-4 text-gray-300" />
              <span class="text-base font-black text-gray-900">{{ flightOffer.destination }}</span>
            </div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{{ flightOffer.airline }} • {{ formatDuration(flightOffer.duration) }}</p>
          </div>
        </div>
        
        <!-- Stay Breakdown -->
        <div v-if="stay" class="flex items-start gap-4 pb-6 border-b border-gray-300">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <Building2 class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Accommodation</span>
            <p class="text-base font-black text-gray-900 leading-tight">{{ stay.hotelName || stay.name || stay.stay?.name }}</p>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{{ stay.roomName || stay.selectedRoom?.name || 'Selected Room' }}</p>
          </div>
        </div>

        <!-- Traveller Info -->
        <div v-if="traveller" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <User class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Primary Traveler</span>
            <p class="text-base font-black text-gray-900">{{ traveller.firstName }} {{ traveller.lastName }}</p>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{{ traveller.email }} • {{ traveller.phoneCountryCode }}{{ traveller.phone }}</p>
          </div>
          <div class="bg-gray-100/50 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest">
             Adult
          </div>
        </div>
      </div>
    </div>

    <!-- Big Summary Card -->
    <div class="bg-gray-900 rounded-3xl p-8 border border-gray-800 text-white relative overflow-hidden mb-8">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Total Investment</h3>
      <div class="flex flex-col gap-1 items-start">
        <span class="text-4xl font-black tracking-tighter">${{ formatPrice(totalPrice) }}</span>
        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
           <svg class="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
           Guaranteed best price for the selected itinerary
        </span>
      </div>
    </div>

    <!-- Add-ons List -->
    <div>
      <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 pl-1">Enhance your trip</h3>
      <div v-for="addon in addOnsList" :key="addon.id" class="p-6 bg-white rounded-3xl border border-gray-300 hover:border-gray-900 transition-all mb-4 flex items-start gap-6 group">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-gray-100 transition-all">{{ addon.emoji }}</div>
        <div class="flex-1">
          <h4 class="text-sm font-black text-gray-900 mb-1">{{ addon.name }}</h4>
          <p class="text-xs text-gray-500 leading-relaxed font-medium mb-3">{{ addon.description }}</p>
          <a href="#" class="text-[10px] font-bold text-gray-900 uppercase tracking-widest hover:underline">Conditions Apply</a>
        </div>
        <div class="text-right flex flex-col items-end">
          <span class="text-xl font-black text-gray-900">${{ formatPrice(addon.price) }}</span>
          <span v-if="addon.perPassenger" class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">per adult</span>
          <button 
            v-if="!isAddonSelected(addon.id)"
            @click="toggleAddon(addon)" 
            class="mt-4 px-6 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
          >Add Service</button>
          <button 
            v-else
            @click="toggleAddon(addon)" 
            class="mt-4 px-6 py-2 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-xl text-[10px] font-bold uppercase tracking-widest"
          >Added ✓</button>
        </div>
      </div>
    </div>

    <!-- Continue -->
    <div class="mt-12">
      <button @click="$emit('continue')" class="w-full md:w-auto bg-gray-900 hover:bg-black px-12 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] text-white transition-all active:scale-[0.98] flex items-center justify-center gap-4">
        Save & Continue to Payment
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  flightOffer: { type: Object, default: null },
  stay: { type: Object, default: null },
  traveller: { type: Object, default: null },
  totalPrice: { type: Number, default: 0 },
  selectedAddOns: { type: Array as () => any[], default: () => [] }
})

const emit = defineEmits(['continue', 'update:selectedAddOns'])

const addOnsList = [
  { id: 'lounge', emoji: '🛋️', name: 'Airport Lounge Access', description: 'Regardless of whether you are traveling for business or leisure, relax before the stress of flight check-in and airport rush.', price: 19, perPassenger: true },
  { id: 'business-lounge', emoji: '🍸', name: 'Business Lounge', description: 'Seat and recharge in a 5-star business lounge with comfortable seating, refreshments, and a quiet atmosphere for relaxation.', price: 27, perPassenger: false },
  { id: 'call-reminder', emoji: '📞', name: 'Call Reminder', description: 'Get a call reminder for your flights and stay updated with your flight information and any changes to your flight time or dates.', price: 2, perPassenger: false },
  { id: 'medical-cancellation', emoji: '🏥', name: 'Medical Cancellation Refund', description: 'Get a full refund of airfare in case of sudden illness, death or hospitalization of yourself, a travel companion, or a close family member.', price: 7, perPassenger: false },
  { id: 'wheelchair', emoji: '♿', name: 'Wheelchair Assistance', description: 'With this service, an agent will assist in processing your requests at the airline for wheelchair assistance.', price: 6, perPassenger: false },
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
import { Plane, Building2, User, ChevronRight } from 'lucide-vue-next'
</script>
