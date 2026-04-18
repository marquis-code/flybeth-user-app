<template>
  <div class="checkout-payment">
    <div class="payment-header flex justify-between items-center mb-6">
      <div class="amount-display">
        <span class="currency-symbol text-2xl font-bold text-gray-500 mr-1">{{ currencySymbol }}</span>
        <span class="amount-value text-3xl  text-gray-900">{{ formatAmount(totalAmount) }}</span>
      </div>
      <button 
        type="button"
        class="change-currency-btn text-blue-600 font-bold text-sm hover:underline flex items-center gap-1" 
        @click="$emit('change-currency')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Change Currency
      </button>
    </div>

    <div class="space-y-4">
      <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Choose Payment Method</h4>
      
      <!-- Card Payment -->
      <div v-if="showCardPayment" class="rounded-2xl border transition-all overflow-hidden" :class="activeMethod === 'card' ? 'border-gray-900 bg-gray-50/30' : 'border-gray-100 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('card')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'card' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'">
              <CreditCard class="w-5 h-5" />
            </div>
            <span class="text-sm font-black text-gray-900 uppercase tracking-tight">Debit / Credit Card</span>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-300 transition-transform" :class="{ 'rotate-180': activeMethod === 'card' }" />
        </div>

        <div v-if="activeMethod === 'card'" class="px-5 pb-5 border-t border-gray-100 pt-5">
          <div v-if="provider === 'duffel'" class="space-y-5">
             <div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
               <div class="flex items-center gap-3">
                 <img src="https://assets.duffel.com/img/duffel-logo-black.svg" class="h-3" />
                 <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secure Direct Booking</span>
               </div>
               <div class="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center text-white">
                 <Check class="w-3 h-3" />
               </div>
             </div>
             <DuffelCardForm v-model="duffelCardData" />
          </div>

          <div v-else class="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img v-if="provider === 'paystack'" src="https://upload.wikimedia.org/wikipedia/commons/2/22/Paystack_logo.png" class="h-4" />
              <img v-else src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png" class="h-4" />
              <span class="text-xs font-bold text-gray-600">Standard Card Processor</span>
            </div>
            <div class="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center text-white">
              <Check class="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Bank Transfer -->
      <div v-if="showBankTransfer" class="rounded-2xl border transition-all overflow-hidden" :class="activeMethod === 'bank' ? 'border-gray-900 bg-gray-50/30' : 'border-gray-100 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('bank')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'bank' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'">
              <Building2 class="w-5 h-5" />
            </div>
            <div>
              <span class="text-sm font-black text-gray-900 uppercase tracking-tight block">Bank Transfer</span>
              <span class="text-[9px] font-bold text-brand-green uppercase tracking-widest">Instant Ticketing Available</span>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-300 transition-transform" :class="{ 'rotate-180': activeMethod === 'bank' }" />
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
        <label class="block text-sm  uppercase tracking-wider text-gray-400 mb-2">Or Pay with Apple Pay</label>
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
        class="w-full h-16 rounded-2xl text-white font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-4 bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div class="mt-6 flex items-center justify-center gap-6 opacity-40 grayscale pointer-events-none">
         <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" class="h-3" @error="$event.target.style.display='none'" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-4" @error="$event.target.style.display='none'" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" class="h-3.5" @error="$event.target.style.display='none'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CreditCard, Building2, Globe, Check, ChevronDown } from 'lucide-vue-next'
import ApplePayButton from './ApplePayButton.vue'
import DuffelCardForm from './DuffelCardForm.vue'
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
  cvv: ''
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
