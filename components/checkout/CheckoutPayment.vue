<template>
  <div class="checkout-payment">
    <div class="payment-header flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
      <div class="amount-display">
        <span class="currency-symbol text-2xl font-black text-gray-400 mr-2">{{ currencySymbol }}</span>
        <span class="amount-value text-2xl lg:text-4xl font-black text-gray-900 tracking-tight">{{ formatAmount(totalAmount) }}</span>
      </div>
      <div class="currency-selector-dropdown">
        <CurrencyDropdown 
          :current-currency="currency" 
          @select="$emit('change-currency', $event)" 
        />
      </div>
    </div>

    <div class="space-y-4">
      <h4 class="text-xs font-black text-gray-400 tracking-widest mb-4">Choose Payment Method</h4>
      
      <!-- Card Payment -->
      <div v-if="showCardPayment" class="rounded-2xl border transition-all" :class="activeMethod === 'card' ? 'border-gray-100 bg-gray-50/30' : 'border-gray-100 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('card')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'card' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'">
              <CreditCard class="w-5 h-5" />
            </div>
            <span class="text-sm font-black text-gray-900 tracking-tight">Debit / Credit Card</span>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': activeMethod === 'card' }" />
        </div>

        <div v-if="activeMethod === 'card'" class="px-5 pb-5 border-t border-gray-100 pt-5">
          <div v-if="provider === 'duffel'" class="space-y-5">
             <div class="flex items-center justify-between p-4 bg-sky-50/50 border border-sky-100 rounded-xl">
               <div class="flex items-center gap-3">
                 <ShieldCheck class="w-4 h-4 text-sky-600" />
                 <span class="text-[10px] font-bold text-sky-900 tracking-widest uppercase">Secure Direct Booking</span>
               </div>
               <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                 <Check class="w-3 h-3" />
               </div>
             </div>
             <DuffelCardForm v-model="duffelCardData" />
          </div>

          <div v-else class="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img v-if="provider === 'paystack'" src="https://upload.wikimedia.org/wikipedia/commons/2/22/Paystack_logo.png" class="h-4" />
              <img v-else src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" class="h-4" />
              <span class="text-xs font-bold text-gray-600">Standard Card Processor</span>
            </div>
            <div class="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center text-white">
              <Check class="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Bank Transfer -->
      <div v-if="showBankTransfer" class="rounded-2xl border transition-all" :class="activeMethod === 'bank' ? 'border-gray-900 bg-gray-50/30' : 'border-gray-100 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('bank')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'bank' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'">
              <Building2 class="w-5 h-5" />
            </div>
            <div>
              <span class="text-sm font-black text-gray-900 tracking-tight block">Bank Transfer</span>
              <span class="text-[9px] font-bold text-brand-green tracking-widest">Instant Ticketing Available</span>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': activeMethod === 'bank' }" />
        </div>
        <div v-if="activeMethod === 'bank'" class="px-5 pb-5 border-t border-gray-100 pt-5">
            <div class="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Globe class="w-5 h-5 text-gray-400" />
                <span class="text-xs font-bold text-gray-600">Manual Bank Transfer / Wire</span>
              </div>
              <div class="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center text-white">
                <Check class="w-3 h-3" />
              </div>
            </div>
        </div>
      </div>
    </div>

      <!-- Apple Pay -->
      <div v-if="provider === 'stripe'" class="apple-pay-section space-y-2 mt-4">
        <label class="block text-sm  tracking-wider text-gray-400 mb-2">Or Pay with Apple Pay</label>
        <ApplePayButton 
          :amount="totalAmount"
          :currency="currency"
          :bookingId="($route.query.orderId as string) || ''"
          label="Flybeth Flight Booking"
          @success="handleApplePaySuccess"
          @error="handleApplePayError"
        />
      </div>

    <!-- Complete Payment Button -->
    <div class="pt-10">
      <button 
        @click="handlePay" 
        :disabled="processing"
        class="w-full h-14 rounded-2xl text-white font-bold tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-4 bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!processing">Authorize & Pay {{ currencySymbol }}{{ formatAmount(totalAmount) }}</span>
        <div v-else class="flex items-center gap-3">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Authorizing...
        </div>
      </button>
      <div class="mt-6 flex items-center justify-center gap-6 grayscale pointer-events-none">
         <img src="@/assets/icons/visa.svg" alt="Visa" class="h-6" />
         <img src="@/assets/icons/master-card.svg" alt="Mastercard" class="h-6" />
         <img src="@/assets/icons/stripe.svg" alt="Stripe" class="h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CreditCard, Building2, Globe, Check, ChevronDown, ShieldCheck, Coins } from 'lucide-vue-next'
import ApplePayButton from './ApplePayButton.vue'
import DuffelCardForm from './DuffelCardForm.vue'
import CurrencyDropdown from './CurrencyDropdown.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  totalAmount: {
    type: Number,
    required: true
  },
  currencySymbol: {
    type: String,
    default: '$'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  processing: Boolean
})

const emit = defineEmits(['complete-payment', 'change-currency'])

const activeMethod = ref('card')
const paystackChannel = ref('card')
const duffelCardData = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: '',
  multi_use: false,
  address_line_1: '',
  address_line_2: '',
  address_city: '',
  address_region: '',
  address_country_code: '',
  address_postal_code: ''
})

const provider = computed(() => {
  // If the booking route already specifies a provider, use it (e.g. from checkout.vue)
  const queryProvider = route.query.provider as string
  if (queryProvider === 'duffel') return 'duffel'
  
  const c = props.currency.toUpperCase()
  if (['NGN', 'GHS', 'KES', 'ZAR'].includes(c)) return 'paystack'
  return 'stripe'
})

const showCardPayment = computed(() => true) // Always show card
const showBankTransfer = computed(() => {
  return ['NGN', 'USD'].includes(props.currency.toUpperCase())
})

const toggleMethod = (method: string) => {
  activeMethod.value = method
}

const formatAmount = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val)
}

const handleApplePaySuccess = (paymentIntentId: string) => {
  emit('complete-payment', { 
    provider: 'stripe', 
    channel: 'apple_pay',
    paymentIntentId
  })
}

const handleApplePayError = (message: string) => {
  console.error('Apple Pay Error:', message)
}

const handlePay = () => {
  if (activeMethod.value === 'bank') {
    emit('complete-payment', { provider: 'manual', channel: 'transfer' })
  } else {
    emit('complete-payment', { 
      provider: provider.value, 
      channel: provider.value === 'paystack' ? paystackChannel.value : 'card',
      cardData: provider.value === 'duffel' ? duffelCardData.value : null 
    })
  }
}
</script>

<style scoped>
.checkout-payment {
  background: white;
}
</style>
