<template>
  <div class="checkout-sidebar">
    <h2 class="sidebar-title">My cart</h2>

    <!-- Flight Info -->
    <div v-if="flight" class="sidebar-section">
      <h3 class="section-label">Flight details</h3>
      <div class="flight-routes">
        <div class="route-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="route-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
          <div>
            <p class="route-text">{{ flight.originName || flight.origin }} to {{ flight.destinationName || flight.destination }}</p>
            <p class="route-meta">{{ flight.origin }} ➔ {{ flight.destination }} • {{ capitalize(flight.cabinClass || 'economy') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stay Info -->
    <div v-if="currentStay" class="sidebar-section mt-4">
      <h3 class="section-label">Hotel details</h3>
      <div class="flight-routes">
        <div class="route-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="route-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          <div>
            <p class="route-text">{{ currentStay.hotelName || currentStay.name || currentStay.stay?.name }}</p>
            <p class="route-meta">{{ currentStay.roomName || currentStay.selectedRoom?.name || 'Selected Room' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <!-- Fare Summary -->
    <div class="sidebar-section">
      <h3 class="section-label">Fare summary</h3>
      <div class="fare-rows space-y-4">
        <!-- Flight Breakdown -->
        <div v-if="flight" class="space-y-1">
           <div class="text-[9px] font-bold text-gray-400 tracking-widest mb-2 italic">Flight</div>
           <div class="fare-row">
             <span>Flights × {{ passengerCount }} Traveller{{ passengerCount > 1 ? 's' : '' }}</span>
             <span>{{ currency }}{{ formatPrice(flightBasePrice) }}</span>
           </div>
        </div>

        <!-- Stay Breakdown -->
        <div v-if="currentStay" class="space-y-1">
           <div class="text-[9px] font-bold text-gray-400 tracking-widest mb-2 italic">Hotel</div>
           <div class="fare-row">
             <span>Accommodation</span>
             <span>{{ currency }}{{ formatPrice(stayPrice) }}</span>
           </div>
        </div>

        <div class="sidebar-divider !my-2 opacity-50"></div>

        <div v-show="showBreakdown" class="space-y-3 pt-3 border-t border-gray-50 mt-3">
          <div v-if="discount > 0" class="fare-row discount text-[11px]">
            <span class="text-gray-500">Discount applied</span>
            <span class="text-red-600 font-bold">-{{ currency }}{{ formatPrice(discount) }}</span>
          </div>
          <div class="fare-row text-[11px]">
            <span class="text-gray-500">Taxes & fees</span>
            <span class="text-gray-900 font-bold">{{ currency }}{{ formatPrice(taxes) }}</span>
          </div>
          <div class="fare-row text-[11px]">
            <span class="text-gray-500">Service charge</span>
            <span class="text-gray-900 font-bold">{{ currency }}{{ formatPrice(serviceCharge) }}</span>
          </div>
        </div>
      </div>
      <button @click="showBreakdown = !showBreakdown" class="breakdown-link mt-4 flex items-center gap-1.5 text-brand-blue hover:text-brand-blue/80 transition-colors">
        <span class="text-[10px] font-bold tracking-widest italic">{{ showBreakdown ? 'Hide' : 'View' }} breakdown</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform duration-300" :class="{ 'rotate-180': showBreakdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
    </div>

    <div class="sidebar-divider"></div>

    <!-- Add-ons -->
    <div v-if="addOns.length > 0" class="sidebar-section">
      <h3 class="section-label">Add-ons</h3>
      <div class="fare-rows">
        <div v-for="addon in addOns" :key="addon.name" class="fare-row">
          <span>{{ addon.name }}</span>
          <span>{{ currency }}{{ formatPrice(addon.price) }}</span>
        </div>
      </div>
      <div class="sidebar-divider"></div>
    </div>

    <!-- Trip Total -->
    <div class="sidebar-section total-section border-t-2 border-dashed border-gray-100 pt-6 mt-6">
      <div class="total-row flex justify-between items-center px-1">
        <span class="total-label text-base font-bold text-gray-900">Trip total</span>
        <span class="total-amount text-2xl font-header text-gray-900 tracking-tight">{{ currency }}{{ formatPrice(tripTotal) }}</span>
      </div>
    </div>

    <!-- Pay Now Button (only at payment step) -->
    <button v-if="showPayButton" @click="$emit('pay-now')" class="pay-now-btn w-full mt-6 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-3.5 rounded-2xl transition-all tracking-widest text-[11px] active:scale-[0.98] shadow-lg shadow-brand-blue/20">
      Complete payment
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  flight: { type: Object, default: null },
  stay: { type: Object, default: null },
  bundledStay: { type: Object, default: null },
  passengerCount: { type: Number, default: 1 },
  baseFare: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  serviceCharge: { type: Number, default: 0 },
  addOns: { type: Array as () => { name: string; price: number }[], default: () => [] },
  currency: { type: String, default: '$' },
  showPayButton: { type: Boolean, default: false },
})

defineEmits(['apply-promo', 'pay-now'])

const showBreakdown = ref(false)

const currentStay = computed(() => props.bundledStay || props.stay)

const stayPrice = computed(() => {
    if (props.bundledStay) return props.bundledStay.price || 0
    if (props.stay && !props.flight) return props.baseFare
    return 0
})

const flightBasePrice = computed(() => {
    if (props.flight) {
        if (props.bundledStay) return props.baseFare - stayPrice.value
        return props.baseFare
    }
    return 0
})

const tripTotal = computed(() => {
  const addOnTotal = props.addOns.reduce((sum, a) => sum + a.price, 0)
  return props.baseFare + props.taxes + props.serviceCharge - props.discount + addOnTotal
})

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const formatPrice = (price: number) => {
  return (price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped>
.checkout-sidebar {
  background: white;
  border-radius: 1.5rem;
  border: 1px solid #f1f5f9;
  padding: 1.5rem;
  position: sticky;
  top: 6rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}

.sidebar-title {
  font-family: 'Spectral', serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2332;
  margin-bottom: 2rem;
  letter-spacing: -0.01em;
}

.sidebar-section {
  margin-bottom: 1.5rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.flight-routes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.route-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;
}

.route-icon {
  width: 16px;
  height: 16px;
  color: #0D1DAD;
  flex-shrink: 0;
  margin-top: 2px;
}

.route-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.route-meta {
  font-size: 0.65rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 2px;
}

.sidebar-divider {
  border-bottom: 1px dashed #e2e8f0;
  margin: 1.25rem 0;
}

.fare-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.fare-row.discount span:last-child {
  color: #dc2626;
}

.breakdown-link {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0D1DAD;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.breakdown-link:hover {
  opacity: 1;
}
</style>
