<template>
  <div class="checkout-payment">
    <div class="payment-header flex justify-between items-center mb-6">
      <div class="amount-display">
        <span class="currency-symbol text-2xl font-bold text-gray-500 mr-1">{{ currencySymbol }}</span>
        <span class="amount-value text-3xl font-black text-gray-900">{{ formatAmount(totalAmount) }}</span>
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

    <div class="payment-methods space-y-4">
      <h4 class="methods-title text-gray-800 font-bold mb-2">Please choose your preferred payment method.</h4>
      
      <!-- Card Payment (Stripe or Paystack) -->
      <div v-if="showCardPayment" class="method-card border rounded-xl overflow-hidden transition-all" :class="{ 'border-blue-500 ring-1 ring-blue-500': activeMethod === 'card', 'border-gray-200': activeMethod !== 'card' }">
        <div class="method-header p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" @click="toggleMethod('card')">
          <div class="method-info flex items-center gap-3">
            <div class="method-icon w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="method-name font-bold text-gray-800">Card Payment</span>
          </div>
          <div class="flex items-center gap-2">
            <img v-if="provider === 'paystack'" src="https://upload.wikimedia.org/wikipedia/commons/2/22/Paystack_logo.png" class="h-3 opacity-60" />
            <img v-else src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png" class="h-3 opacity-60" />
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': activeMethod === 'card' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div v-if="activeMethod === 'card'" class="method-details px-4 pb-4 border-t border-gray-100 pt-4 bg-blue-50/30">
          <label class="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3">Select your preferred payment channel</label>
          <div v-if="provider === 'stripe'" class="provider-option flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg shadow-sm">
            <div class="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png" class="h-4" />
              <span class="text-sm font-bold text-gray-700">Stripe Cards</span>
            </div>
            <div class="check-icon w-5 h-5 flex items-center justify-center rounded-full bg-blue-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div v-else class="provider-selector space-y-2">
             <div class="provider-option flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg shadow-sm">
              <div class="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/22/Paystack_logo.png" class="h-4" />
                <span class="text-sm font-bold text-gray-700">Paystack Cards</span>
              </div>
               <div class="check-icon w-5 h-5 flex items-center justify-center rounded-full bg-blue-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bank Transfer (Manual) -->
      <div v-if="showBankTransfer" class="method-card border rounded-xl overflow-hidden transition-all" :class="{ 'border-blue-500 ring-1 ring-blue-500': activeMethod === 'bank', 'border-gray-200': activeMethod !== 'bank' }">
        <div class="method-header p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" @click="toggleMethod('bank')">
          <div class="method-info flex items-center gap-3">
            <div class="method-icon w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477 6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.789l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.134.418C4.545 10.962 4.285 11 4 11c-.285 0-.545-.038-.766-.108l.134-.418H5zm10 0l-.134.418C14.545 10.962 14.285 11 14 11c-.285 0-.545-.038-.766-.108l.134-.418H15z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="method-name font-bold text-gray-800">Bank Transfer Payment</span>
              <span class="text-[10px] text-green-600 font-bold uppercase tracking-tight">Instant ticketing</span>
            </div>
          </div>
           <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': activeMethod === 'bank' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div v-if="activeMethod === 'bank'" class="method-details px-4 pb-4 border-t border-gray-100 pt-4 bg-green-50/30">
           <label class="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3">Select your preferred payment channel</label>
           <div class="provider-option flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span class="text-sm font-bold text-gray-700">Manual Bank Transfers</span>
              </div>
               <div class="check-icon w-5 h-5 flex items-center justify-center rounded-full bg-green-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
        </div>
      </div>

      <!-- Apple Pay -->
      <div v-if="provider === 'stripe'" class="apple-pay-section space-y-2 mt-4">
        <label class="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Or Pay with Apple Pay</label>
        <ApplePayButton 
          :amount="totalAmount"
          :currency="currency"
          :bookingId="($route.query.orderId as string) || ''"
          label="Flybeth Flight Booking"
          @success="handleApplePaySuccess"
          @error="handleApplePayError"
        />
      </div>
    </div>

    <!-- Complete Payment Button -->
    <div class="pt-8">
      <button 
        @click="handlePay" 
        :disabled="processing"
        class="w-full h-14 rounded-xl font-black text-white uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-200"
        :class="processing ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 hover:scale-[1.01] active:scale-[0.99]'"
      >
        <span v-if="!processing">Complete Payment</span>
        <div v-else class="flex items-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      </button>
      <p class="text-center text-[10px] text-gray-400 font-bold mt-4 px-8">
        By clicking Complete Payment, you agree to Flybeth's Terms of Service and Privacy Policy.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ApplePayButton from './ApplePayButton.vue'
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

const provider = computed(() => {
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
      channel: provider.value === 'paystack' ? paystackChannel.value : 'card' 
    })
  }
}
</script>

<style scoped>
.checkout-payment {
  background: white;
}
</style>
