<template>
  <div class="checkout-sidebar">
    <h2 class="sidebar-title">My Cart</h2>

    <!-- Flight Info -->
    <div v-if="flight" class="sidebar-section">
      <h3 class="section-label">Flight</h3>
      <div class="flight-routes">
        <div class="route-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="route-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
          <div>
            <p class="route-text">{{ flight.origin }} ({{ flight.origin }}) to {{ flight.destination }} ({{ flight.destination }})</p>
            <p class="route-meta">{{ capitalize(flight.cabinClass || 'economy') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stay Info -->
    <div v-if="currentStay" class="sidebar-section mt-4">
      <h3 class="section-label">Hotel</h3>
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
      <h3 class="section-label">Fare Summary</h3>
      <div class="fare-rows space-y-4">
        <!-- Flight Breakdown -->
        <div v-if="flight" class="space-y-1">
           <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Flight</div>
           <div class="fare-row">
             <span>Flights × {{ passengerCount }} Traveller{{ passengerCount > 1 ? 's' : '' }}</span>
             <span>{{ currency }}{{ formatPrice(flightBasePrice) }}</span>
           </div>
        </div>

        <!-- Stay Breakdown -->
        <div v-if="currentStay" class="space-y-1">
           <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Hotel</div>
           <div class="fare-row">
             <span>Accommodation</span>
             <span>{{ currency }}{{ formatPrice(stayPrice) }}</span>
           </div>
        </div>

        <div class="sidebar-divider !my-2 opacity-50"></div>

        <div class="fare-row">
          <span>Taxes</span>
          <span>{{ currency }}{{ formatPrice(taxes) }}</span>
        </div>
        <div v-if="discount > 0" class="fare-row discount">
          <span>Discount</span>
          <span>-{{ currency }}{{ formatPrice(discount) }}</span>
        </div>
        <div class="fare-row">
          <span>Service Charge</span>
          <span>{{ currency }}{{ formatPrice(serviceCharge) }}</span>
        </div>
      </div>
      <button @click="showBreakdown = !showBreakdown" class="breakdown-link mt-4">
        {{ showBreakdown ? 'Hide' : 'View' }} breakdown
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1 transition-transform" :class="{ 'rotate-180': showBreakdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
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
    <div class="sidebar-section total-section border-t border-brand-blue/10 pt-4 mt-4">
      <div class="total-row flex justify-between items-center">
        <span class="total-label text-base font-black text-gray-900">Trip Total</span>
        <span class="total-amount text-2xl font-black text-gray-900 tracking-tighter">{{ currency }}{{ formatPrice(tripTotal) }}</span>
      </div>
    </div>

    <!-- Pay Now Button (only at payment step) -->
    <button v-if="showPayButton" @click="$emit('pay-now')" class="pay-now-btn w-full mt-6 bg-[#f27c22] hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-xl shadow-orange-100 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
      Pay Now
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
  border: 1px solid #f0f2f5;
  padding: 1.5rem;
  position: sticky;
  top: 6rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: #1a2332;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.sidebar-section {
  margin-bottom: 1rem;
}

.section-label {
  font-size: 0.85rem;
  font-weight: 900;
  color: #1a2332;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.flight-routes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.route-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 0.75rem;
}

.route-icon {
  width: 14px;
  height: 14px;
  color: #0084ff;
  flex-shrink: 0;
  margin-top: 2px;
}

.route-text {
  font-size: 0.75rem;
  font-weight: 800;
  color: #1a2332;
  line-height: 1.3;
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
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.fare-row.discount span:last-child {
  color: #ef4444;
}

.breakdown-link {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 900;
  color: #0084ff;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
