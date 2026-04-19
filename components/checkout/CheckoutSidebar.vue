<template>
  <div class="ck-sb">
    <div class="ck-sb-hd">
      <h2 class="ck-sb-title">Trip Summary</h2>
      <div v-if="passengerCount" class="ck-sb-tag">{{ passengerCount }} Guest{{ passengerCount > 1 ? 's' : '' }}</div>
    </div>

    <!-- Flight Info -->
    <div v-if="flight" class="ck-sb-sec">
      <div class="ck-sb-item">
        <div class="ck-sb-ico">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 21 4s-2 0-3.5 1.5L14 9l-8.2-1.8L3 10l8.2 2.8L11 15.2l-3 3.3V20l4.5-1.5 4.5 1.5v-1.5l-3-3.3 2.4-2.4 8.2 2.8-1.3 2.8z"/></svg>
        </div>
        <div class="ck-sb-info">
          <p class="ck-sb-lbl">Flight</p>
          <p class="ck-sb-val">{{ flight.origin }} ➔ {{ flight.destination }}</p>
          <p class="ck-sb-sub">{{ capitalize(flight.cabinClass || 'economy') }} • {{ flight.airline }}</p>
        </div>
      </div>
    </div>

    <!-- Stay Info -->
    <div v-if="currentStay" class="ck-sb-sec">
      <div class="ck-sb-item">
        <div class="ck-sb-ico">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="ck-sb-info">
          <p class="ck-sb-lbl">Accommodation</p>
          <p class="ck-sb-val">{{ currentStay.hotelName || currentStay.name || currentStay.stay?.name }}</p>
          <p class="ck-sb-sub">{{ currentStay.roomName || currentStay.selectedRoom?.name || 'Standard Room' }}</p>
        </div>
      </div>
    </div>

    <div class="ck-sb-divider"></div>

    <!-- Fare Summary -->
    <div class="ck-sb-sec">
      <div class="ck-sb-fares">
        <div class="ck-sb-fare">
          <span>Base Fare</span>
          <span>{{ currency }}{{ formatPrice(baseFare) }}</span>
        </div>
        
        <div v-if="showBreakdown" class="ck-sb-breakdown animate-in">
           <div v-if="discount > 0" class="ck-sb-fare ck-sb-fare--disc">
             <span>Promo Discount</span>
             <span>-{{ currency }}{{ formatPrice(discount) }}</span>
           </div>
           <div class="ck-sb-fare ck-sb-fare--sub">
             <span>Taxes & Fees</span>
             <span>{{ currency }}{{ formatPrice(taxes) }}</span>
           </div>
           <div class="ck-sb-fare ck-sb-fare--sub">
             <span>Service Charge</span>
             <span>{{ currency }}{{ formatPrice(serviceCharge) }}</span>
           </div>
           <div v-for="addon in addOns" :key="addon.name" class="ck-sb-fare ck-sb-fare--sub">
             <span>{{ addon.name }}</span>
             <span>{{ currency }}{{ formatPrice(addon.price) }}</span>
           </div>
        </div>

        <button @click="showBreakdown = !showBreakdown" class="ck-sb-toggle">
          {{ showBreakdown ? 'Hide' : 'Show' }} breakdown 
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" :class="{ 'rotate-180': showBreakdown }"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
    </div>

    <div class="ck-sb-divider !border-solid border-gray-100"></div>

    <!-- Total -->
    <div class="ck-sb-total-wrap">
       <span class="ck-sb-total-lbl">Total Amount</span>
       <div class="ck-sb-total-price">
          <span class="ck-sb-total-cur">{{ currency }}</span>
          <span class="ck-sb-total-val">{{ formatPrice(tripTotal) }}</span>
       </div>
    </div>

    <!-- Actions -->
    <div v-if="showPayButton" class="ck-sb-actions">
        <button @click="$emit('pay-now')" class="ck-sb-btn ck-sb-btn--primary">
          Confirm & Pay Securely
        </button>

        <button 
          v-if="flight?.rawOffer?.provider === 'duffel' || $route.query.provider === 'duffel'" 
          @click="$emit('hold-now')" 
          class="ck-sb-btn ck-sb-btn--second"
        >
          Hold Reservation
        </button>
    </div>
    <div v-else class="ck-sb-meta">
       <p>Taxes and fees are calculated based on your final selection.</p>
    </div>
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

defineEmits(['apply-promo', 'pay-now', 'hold-now'])

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
.ck-sb {
  background: #fff;
  border: 1px solid #eaeaef;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.ck-sb-hd {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
}
.ck-sb-title { font-size: 15px; font-weight: 700; color: #111; }
.ck-sb-tag { font-size: 10px; font-weight: 700; background: #f0f7f3; color: #1d7a4f; padding: 4px 10px; border-radius: 100px; }

.ck-sb-sec { margin-bottom: 16px; }

.ck-sb-item { display: flex; gap: 12px; background: #fafaf8; border-radius: 16px; padding: 12px; border: 1px solid #f0f0ea; }
.ck-sb-ico { color: #111; background: #fff; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #eee; flex-shrink: 0; }
.ck-sb-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; color: #aaa; margin-bottom: 2px; }
.ck-sb-val { font-size: 13px; font-weight: 700; color: #111; line-height: 1.3; margin-bottom: 2px; }
.ck-sb-sub { font-size: 11px; color: #888; }

.ck-sb-divider { border-bottom: 1px dashed #eee; margin: 20px 0; }

.ck-sb-fares { display: flex; flex-direction: column; gap: 10px; }
.ck-sb-fare { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #111; }
.ck-sb-fare--sub { font-size: 12px; font-weight: 500; color: #888; }
.ck-sb-fare--disc { color: #d00; }

.ck-sb-toggle {
  background: none; border: none; cursor: pointer; padding: 0;
  display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700;
  color: #111; margin-top: 4px;
}

.ck-sb-total-wrap {
  display: flex; align-items: center; justify-content: space-between; padding: 8px 0;
}
.ck-sb-total-lbl { font-size: 14px; font-weight: 700; color: #111; }
.ck-sb-total-price { display: flex; align-items: baseline; gap: 2px; color: #1d7a4f; }
.ck-sb-total-cur { font-size: 14px; font-weight: 700; }
.ck-sb-total-val { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }

.ck-sb-actions { margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
.ck-sb-btn {
  width: 100%; height: 52px; border-radius: 14px; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); border: none;
}
.ck-sb-btn:active { transform: scale(0.98); }

.ck-sb-btn--primary { background: #111; color: #fff; }
.ck-sb-btn--primary:hover { background: #1d7a4f; }

.ck-sb-btn--second { background: #fdf2e9; color: #c2410c; border: 1px solid #fed7aa; }
.ck-sb-btn--second:hover { background: #ffedd5; }

.ck-sb-meta { font-size: 11px; color: #aaa; text-align: center; margin-top: 16px; line-height: 1.5; }

/* Animation */
.animate-in { animation: ckFadeIn 0.3s ease both; }
@keyframes ckFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
</style>
