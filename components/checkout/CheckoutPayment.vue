<template>
  <div class="checkout-payment">
    <div class="payment-header flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
      <div class="amount-display">
        <span class="currency-symbol text-xl text-gray-400 mr-1">{{ currencySymbol }}</span>
        <span class="amount-value text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">{{ formatAmount(totalAmount) }}</span>
      </div>
      <div class="currency-selector-dropdown">
        <CurrencyDropdown 
          :current-currency="currency" 
          @select="$emit('change-currency', $event)" 
        />
      </div>
    </div>

    <div class="space-y-4">
      <h4 class="text-xs  text-gray-400 tracking-widest mb-4">Choose Payment Method</h4>
      
      <!-- Flybeth Wallet (Prioritized) -->
      <div class="rounded-2xl border transition-all" :class="activeMethod === 'wallet' ? 'border-gray-900 bg-gray-50/30' : 'border-gray-100 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('wallet')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center relative" :class="activeMethod === 'wallet' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'">
              <Wallet class="w-5 h-5" />
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-gray-900 tracking-tight">Flybeth Wallet</span>
                <span class="px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded uppercase tracking-widest">Recommended</span>
              </div>
              <span v-if="!isWalletLoading" class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                Balance: {{ currencySymbol }}{{ formatAmount(walletBalance) }}
              </span>
              <span v-else class="text-[10px] font-bold text-gray-300 tracking-widest uppercase animate-pulse">Loading Balance...</span>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': activeMethod === 'wallet' }" />
        </div>
        <div v-if="activeMethod === 'wallet'" class="px-5 pb-5 border-t border-gray-100 pt-5 space-y-4">
            <div v-if="hasSufficientWalletBalance" class="space-y-4">
                <div class="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Check class="w-4 h-4 text-emerald-600" />
                    <span class="text-xs font-bold text-emerald-700 uppercase tracking-widest">Instant Ticketing Available</span>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Wallet PIN</label>
                  <input 
                    v-model="walletPin"
                    type="password"
                    maxlength="4"
                    placeholder="Enter 4-digit PIN"
                    class="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm tracking-[0.5em] focus:border-gray-900 focus:ring-0 transition-all text-center outline-none"
                  />
                </div>
            </div>
            <div v-else class="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3">
              <div class="flex items-center gap-3 text-red-600">
                <AlertCircle class="w-4 h-4" />
                <span class="text-xs font-bold">Insufficient wallet balance</span>
              </div>
              <button @click="showFundModal = true" class="w-full text-[10px] font-black text-white bg-gray-900 h-10 rounded-xl uppercase tracking-widest hover:bg-black transition-all">
                Add Funds to Wallet
              </button>
            </div>
        </div>
      </div>

      <!-- Card Payment -->
      <div v-if="showCardPayment" class="rounded-2xl border transition-all" :class="activeMethod === 'card' ? 'border-gray-100 bg-gray-50/30' : 'border-gray-100 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('card')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'card' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'">
              <CreditCard class="w-5 h-5" />
            </div>
            <span class="text-sm  text-gray-900 tracking-tight">Debit / Credit Card</span>
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
            <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Check class="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modals -->
    <WalletAdModal :show="showAdModal" @close="handleAdClose" />
    <FundWalletModal :show="showFundModal" :currency="currency" :current-balance="walletBalance" @close="showFundModal = false" />

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

      <div class="mt-6 flex items-center justify-center gap-6 grayscale pointer-events-none">
         <img src="@/assets/icons/visa.svg" alt="Visa" class="h-6" />
         <img src="@/assets/icons/master-card.svg" alt="Mastercard" class="h-6" />
         <img src="@/assets/icons/stripe.svg" alt="Stripe" class="h-6" />
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CreditCard, Check, ChevronDown, ShieldCheck, Coins, Wallet, AlertCircle, Clock } from 'lucide-vue-next'
import ApplePayButton from './ApplePayButton.vue'
import DuffelCardForm from './DuffelCardForm.vue'
import CurrencyDropdown from './CurrencyDropdown.vue'
import WalletAdModal from './WalletAdModal.vue'
import FundWalletModal from './FundWalletModal.vue'
import { useRouter, useRoute } from 'vue-router'
import { financeApi } from '@/api_factory/modules/finance'
import { onMounted } from 'vue'
import { useAuth } from '~/composables/modules/auth/useAuth'

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
  processing: Boolean,
  flightOffer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['complete-payment', 'change-currency'])

const activeMethod = ref('wallet') // Prioritize Wallet
const paystackChannel = ref('card')
const walletBalance = ref(0)
const walletPin = ref('')
const isWalletLoading = ref(false)
const showAdModal = ref(false)
const showFundModal = ref(false)

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

const hasSufficientWalletBalance = computed(() => {
  return walletBalance.value >= props.totalAmount
})

const canHold = computed(() => {
  // Check if flight offer explicitly supports hold
  if (props.flightOffer?.paymentRequirements) {
    return props.flightOffer.paymentRequirements.requiresInstantPayment === false
  }
  // Generic hold support could be added here for other providers
  return false
})

const { openAuthModal } = useAuth()

const fetchWalletBalance = async () => {
  isWalletLoading.value = true
  try {
    const { data } = await financeApi.getWalletBalance()
    if (data.success) {
      walletBalance.value = data.data.balance || 0
    }
  } catch (error: any) {
    console.error('Failed to fetch wallet balance', error)
    if (error.response?.status === 401) {
      openAuthModal()
    }
  } finally {
    isWalletLoading.value = false
  }
}

onMounted(() => {
  fetchWalletBalance()
  // Show Ad Modal with a slight delay only if not previously dismissed
  const isDismissed = localStorage.getItem('flybeth_wallet_ad_dismissed')
  if (!isDismissed) {
    setTimeout(() => {
      showAdModal.value = true
    }, 1000)
  }
})

const handleAdClose = () => {
  showAdModal.value = false
  localStorage.setItem('flybeth_wallet_ad_dismissed', 'true')
}

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
  } else if (activeMethod.value === 'wallet') {
    if (!hasSufficientWalletBalance.value) return
    emit('complete-payment', { 
      provider: 'wallet', 
      channel: 'wallet',
      pin: walletPin.value 
    })
  } else {
    emit('complete-payment', { 
      provider: provider.value, 
      channel: provider.value === 'paystack' ? paystackChannel.value : 'card',
      cardData: provider.value === 'duffel' ? duffelCardData.value : null 
    })
  }
}

const handleHold = () => {
  emit('complete-payment', { 
    provider: 'manual', 
    channel: 'hold', 
    paymentModel: 'on_hold' 
  })
}

defineExpose({
  handlePay,
  handleHold
})
</script>

<style scoped>
.checkout-payment {
  background: white;
}
</style>
