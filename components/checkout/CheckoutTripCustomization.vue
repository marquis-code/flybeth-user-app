<template>
  <div class="trip-customization-step">
    <!-- Fare Summary -->
    <div class="fare-summary-card">
      <h3 class="summary-title text-gray-900 uppercase tracking-widest  italic">Fare Summary</h3>
      <div class="fare-routes space-y-4 pt-4">
        <!-- Flight Breakdown -->
        <div v-if="flightOffer" class="fare-route pb-3 border-b border-gray-50 border-dashed">
          <div class="flex items-center gap-2 mb-2">
             <div class="w-6 h-6 rounded bg-brand-blue/5 flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
             </div>
             <span class="text-sm  text-gray-400 uppercase tracking-widest italic">Flight</span>
          </div>
          <div class="route-line">
            <span class="route-origin">{{ flightOffer.origin }}</span>
            <span class="route-arrow">→</span>
            <span class="route-dest">{{ flightOffer.destination }}</span>
            <span class="route-meta ml-3">{{ flightOffer.airline }} • {{ formatDuration(flightOffer.duration) }}</span>
          </div>
        </div>
        
        <!-- Stay Breakdown -->
        <div v-if="stay" class="fare-route">
          <div class="flex items-center gap-2 mb-2">
             <div class="w-6 h-6 rounded bg-brand-blue/5 flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
             </div>
             <span class="text-sm  text-gray-400 uppercase tracking-widest italic">Hotel</span>
          </div>
          <div class="route-line">
            <span class="route-origin">{{ stay.hotelName || stay.name || stay.stay?.name }}</span>
            <span class="route-meta ml-3  text-gray-900">{{ stay.roomName || stay.selectedRoom?.name || 'Selected Room' }}</span>
          </div>
        </div>
      </div>

      <div v-if="traveller" class="traveller-summary pt-6 mt-6 border-t border-gray-100">
        <h4 class="traveller-label text-[9px]  text-gray-400 uppercase tracking-widest mb-3">Traveller Profile</h4>
        <div class="flex items-center justify-between">
           <div>
              <p class="traveller-info text-sm  text-gray-900">{{ traveller.firstName }} {{ traveller.lastName }}</p>
              <p class="traveller-contact text-xs font-bold text-gray-400 opacity-80">{{ traveller.email }} • {{ traveller.phoneCountryCode }}{{ traveller.phone }}</p>
           </div>
           <div class="bg-brand-blue/5 text-gray-900 text-[9px]  px-2 py-1 rounded uppercase tracking-widest">
              ADULT • {{ traveller.gender?.toUpperCase() }}
           </div>
        </div>
      </div>
    </div>

    <div class="payment-toggle-card bg-brand-blue rounded-3xl p-8 border border-blue-400/20 shadow-xl shadow-blue-100/50 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      <h3 class="toggle-title text-sm  text-blue-100 uppercase tracking-widest mb-4 italic">Payment Summary</h3>
      <div class="flex flex-col gap-1 items-start">
        <span class="text-3xl  italic tracking-tighter">${{ formatPrice(totalPrice) }}</span>
        <span class="text-sm font-bold text-blue-100 uppercase tracking-widest opacity-80 mt-1 flex items-center gap-2">
           <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
           Are your travel plans confirmed? Then, go ahead & book.
        </span>
      </div>
    </div>

    <!-- Add-ons List -->
    <div class="addons-list">
      <h3 class="text-[11px]  text-gray-900 uppercase tracking-widest mb-4 pl-1 italic">Trip Add-ons</h3>
      <div v-for="addon in addOnsList" :key="addon.id" class="addon-card hover:border-brand-blue/30 group transition-all">
        <div class="addon-icon w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl group-hover:bg-brand-blue/5 transition-colors">{{ addon.emoji }}</div>
        <div class="addon-info">
          <h4 class="addon-name">{{ addon.name }}</h4>
          <p class="addon-desc">{{ addon.description }}</p>
          <a href="#" class="addon-terms text-gray-900">Terms & Conditions</a>
        </div>
        <div class="addon-action">
          <span class="addon-price">${{ formatPrice(addon.price) }}</span>
          <span v-if="addon.perPassenger" class="addon-per">per passenger</span>
          <button 
            v-if="!isAddonSelected(addon.id)"
            @click="toggleAddon(addon)" 
            class="addon-btn bg-brand-orange text-white"
          >Add</button>
          <button 
            v-else
            @click="toggleAddon(addon)" 
            class="addon-btn bg-green-50 text-green-600 border border-green-100"
          >Added ✓</button>
        </div>
      </div>
    </div>

    <!-- Continue -->
    <div class="step-actions mt-10">
      <button @click="$emit('continue')" class="continue-btn bg-[#f27c22] hover:bg-orange-600 shadow-xl shadow-orange-100 px-12 py-5 rounded-2xl  uppercase tracking-widest text-white transition-all active:scale-[0.98]">
        Continue to Payment
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
</script>

<style scoped>
.text-gray-900 { color: #0084ff; }
.bg-brand-blue { background-color: #0084ff; }
.bg-brand-orange { background-color: #ff8a00; }

.fare-summary-card {
  background: white;
  border-radius: 2rem;
  border: 1px solid #f0f2f5;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.02);
}

.route-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.route-origin, .route-dest {
  font-size: 0.95rem;
  font-weight: 900;
  color: #1a2332;
}

.route-arrow {
  color: #0084ff;
  font-weight: 700;
}

.route-meta {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.addon-card {
  background: white;
  border-radius: 1.5rem;
  border: 1px solid #f0f2f5;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
}

.addon-name {
  font-size: 0.9rem;
  font-weight: 900;
  color: #1a2332;
  margin: 0 0 0.25rem;
}

.addon-desc {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.6;
  font-weight: 500;
  margin: 0 0 0.5rem;
}

.addon-price {
  font-size: 1.25rem;
  font-weight: 900;
  color: #1a2332;
  letter-spacing: -0.02em;
}

.addon-per {
  font-size: 0.6rem;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
}

.addon-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.5rem;
}
</style>
