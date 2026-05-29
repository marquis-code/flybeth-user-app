<template>
  <div class="checkout-payment">
    <div class="payment-header flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
      <div class="amount-display">
        <span class="currency-symbol text-xl text-black mr-1">{{ currencySymbol }}</span>
        <span class="amount-value text-2xl lg:text-3xl font-black text-black ">{{ formatAmount(totalAmount) }}</span>
      </div>
      <div class="currency-selector-dropdown">
        <CurrencyDropdown 
          :current-currency="currency" 
          @select="$emit('change-currency', $event)" 
        />
      </div>
    </div>

    <div class="space-y-4">
      <h4 class="text-xs  text-black  mb-4">Choose Payment Method</h4>
      
      <!-- Flybeth Wallet (Prioritized) -->
      <div v-if="isLoggedIn" class="rounded-2xl border transition-all" :class="activeMethod === 'wallet' ? 'border-gray-200 bg-white/30' : 'border-gray-200 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('wallet')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center relative" :class="activeMethod === 'wallet' ? 'bg-black text-white' : 'bg-gray-100 text-black'">
              <Wallet class="w-5 h-5" />
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-black ">Flybeth Wallet</span>
                <span class="px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded  ">Recommended</span>
              </div>
              <span v-if="!isWalletLoading" class="text-sm font-bold text-black  ">
                Balance: {{ currencySymbol }}{{ formatAmount(walletBalance * (currentCurrency?.rate || 1)) }}
              </span>
              <span v-else class="text-sm font-bold text-black   animate-pulse">Loading Balance...</span>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-black transition-transform" :class="{ 'rotate-180': activeMethod === 'wallet' }" />
        </div>
        <div v-if="activeMethod === 'wallet'" class="px-5 pb-5 border-t border-gray-200 pt-5 space-y-4">
            <div v-if="hasSufficientWalletBalance" class="space-y-4">
                <div class="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Check class="w-4 h-4 text-emerald-600" />
                    <span class="text-xs font-bold text-emerald-700  ">Instant Ticketing Available</span>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-black text-black   ml-1">Secure Wallet PIN</label>
                  <input 
                    v-model="walletPin"
                    type="password"
                    maxlength="4"
                    placeholder="Enter 4-digit PIN"
                    class="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm tracking-[0.5em] focus:border-gray-200 focus:ring-0 transition-all text-center outline-none"
                  />
                </div>
            </div>
            <div v-else class="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3">
              <div class="flex items-center gap-3 text-red-600">
                <AlertCircle class="w-4 h-4" />
                <span class="text-xs font-bold">Insufficient wallet balance</span>
              </div>
              <button @click="showFundModal = true" class="w-full text-sm font-black text-white bg-black h-10 rounded-xl   hover:bg-black transition-all">
                Add Funds to Wallet
              </button>
            </div>
        </div>
      </div>

      <!-- Card Payment -->
      <div v-if="showCardPayment" class="rounded-2xl border transition-all" :class="activeMethod === 'card' ? 'border-gray-200 bg-white/30' : 'border-gray-200 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('card')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'card' ? 'bg-black text-white' : 'bg-gray-100 text-black'">
              <CreditCard class="w-5 h-5" />
            </div>
            <span class="text-sm  text-black ">Debit / Credit Card</span>
          </div>
          <ChevronDown class="w-4 h-4 text-black transition-transform" :class="{ 'rotate-180': activeMethod === 'card' }" />
        </div>

        <div v-if="activeMethod === 'card'" class="px-5 pb-5 border-t border-gray-200 pt-5">
          <div v-if="provider === 'duffel'" class="space-y-5">
             <div class="flex items-center justify-between p-4 bg-sky-50/50 border border-sky-100 rounded-xl">
               <div class="flex items-center gap-3">
                 <ShieldCheck class="w-4 h-4 text-sky-600" />
                 <span class="text-sm font-bold text-sky-900  ">Secure Direct Booking</span>
               </div>
               <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                 <Check class="w-3 h-3" />
               </div>
             </div>
             <DuffelCardForm v-model="duffelCardData" />
          </div>

          <div v-else class="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img v-if="provider === 'paystack'" src="https://upload.wikimedia.org/wikipedia/commons/2/22/Paystack_logo.png" class="h-4" />
              <img v-else src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" class="h-4" />
              <span class="text-xs font-bold text-black">Standard Card Processor</span>
            </div>
            <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Check class="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- BNPL Payment -->
      <div class="rounded-2xl border transition-all" :class="activeMethod === 'bnpl' ? 'border-gray-200 bg-white/30' : 'border-gray-200 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('bnpl')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'bnpl' ? 'bg-black text-white' : 'bg-gray-100 text-black'">
              <Clock class="w-5 h-5" />
            </div>
            <div>
              <span class="text-sm font-bold text-black ">Buy Now, Pay Later</span>
              <p class="text-sm text-black font-medium leading-none mt-1">Flexible installment plans</p>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-black transition-transform" :class="{ 'rotate-180': activeMethod === 'bnpl' }" />
        </div>

        <div v-if="activeMethod === 'bnpl'" class="px-5 pb-5 border-t border-gray-200 pt-5 space-y-4">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div 
              v-for="bnpl in bnplProviders" 
              :key="bnpl.id"
              @click="selectedBnpl = bnpl.id"
              class="p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-20 text-center"
              :class="selectedBnpl === bnpl.id ? 'border-gray-200 bg-white shadow-sm ring-1 ring-gray-200' : 'border-gray-200 hover:border-gray-200 bg-white/50'"
            >
              <img :src="bnpl.logo" :alt="bnpl.name" class="h-6 max-w-full object-contain" />
              <span class="text-[8px] font-black  text-black" :class="{ 'text-black': selectedBnpl === bnpl.id }">{{ bnpl.name }}</span>
            </div>
          </div>
          <div v-if="selectedBnpl" class="p-4 bg-sky-50 border border-sky-100 rounded-xl">
             <p class="text-sm text-center text-sky-700 font-bold  tracking-wider">
               Redirecting to {{ bnplProviders.find(b => b.id === selectedBnpl)?.name }} for secure checkout
             </p>
          </div>
        </div>
      </div>

    </div>

      <!-- Digital Wallets -->
      <div class="rounded-2xl border transition-all" :class="activeMethod === 'wallet_payment' ? 'border-gray-200 bg-white/30' : 'border-gray-200 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('wallet_payment')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'wallet_payment' ? 'bg-black text-white' : 'bg-gray-100 text-black'">
              <Wallet class="w-5 h-5" />
            </div>
            <div>
              <span class="text-sm font-bold text-black ">Digital Wallets</span>
              <p class="text-sm text-black font-medium leading-none mt-1">PayPal, Apple Pay, Google Pay</p>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-black transition-transform" :class="{ 'rotate-180': activeMethod === 'wallet_payment' }" />
        </div>

        <div v-if="activeMethod === 'wallet_payment'" class="px-5 pb-5 border-t border-gray-200 pt-5 space-y-4">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div 
              v-for="wallet in digitalWallets" 
              :key="wallet.id"
              @click="selectedWallet = wallet.id"
              class="p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-20 text-center"
              :class="selectedWallet === wallet.id ? 'border-gray-200 bg-white shadow-sm ring-1 ring-gray-200' : 'border-gray-200 hover:border-gray-200 bg-white/50'"
            >
              <img :src="wallet.logo" :alt="wallet.name" class="h-6 max-w-full object-contain" />
              <span class="text-[8px] font-black  text-black" :class="{ 'text-black': selectedWallet === wallet.id }">{{ wallet.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Local Methods -->
      <div class="rounded-2xl border transition-all" :class="activeMethod === 'local' ? 'border-gray-200 bg-white/30' : 'border-gray-200 bg-white'">
        <div class="p-5 flex items-center justify-between cursor-pointer" @click="toggleMethod('local')">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeMethod === 'local' ? 'bg-black text-white' : 'bg-gray-100 text-black'">
              <Coins class="w-5 h-5" />
            </div>
            <div>
              <span class="text-sm font-bold text-black ">Local & Regional</span>
              <p class="text-sm text-black font-medium leading-none mt-1">Paga, Alipay, Verve, etc.</p>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-black transition-transform" :class="{ 'rotate-180': activeMethod === 'local' }" />
        </div>

        <div v-if="activeMethod === 'local'" class="px-5 pb-5 border-t border-gray-200 pt-5 space-y-4">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div 
              v-for="local in localProviders" 
              :key="local.id"
              @click="selectedLocal = local.id"
              class="p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-20 text-center"
              :class="selectedLocal === local.id ? 'border-gray-200 bg-white shadow-sm ring-1 ring-gray-200' : 'border-gray-200 hover:border-gray-200 bg-white/50'"
            >
              <img :src="local.logo" :alt="local.name" class="h-6 max-w-full object-contain" />
              <span class="text-[8px] font-black  text-black" :class="{ 'text-black': selectedLocal === local.id }">{{ local.name }}</span>
            </div>
          </div>
        </div>
      </div>

    <!-- Modals -->
    <WalletAdModal :show="showAdModal" @close="handleAdClose" />
    <FundWalletModal :show="showFundModal" :currency="currency" :current-balance="walletBalance" @close="showFundModal = false" />



      <div class="mt-6 flex items-center justify-center gap-6 grayscale pointer-events-none">
         <img src="@/assets/icons/visa.svg" alt="Visa" class="h-6" />
         <img src="@/assets/icons/master-card.svg" alt="Mastercard" class="h-6" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" class="h-5" />
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CreditCard, Check, ChevronDown, ShieldCheck, Coins, Wallet, AlertCircle, Clock } from 'lucide-vue-next'
import DuffelCardForm from './DuffelCardForm.vue'
import CurrencyDropdown from './CurrencyDropdown.vue'
import WalletAdModal from './WalletAdModal.vue'
import FundWalletModal from './FundWalletModal.vue'
import { useRouter, useRoute } from 'vue-router'
import { financeApi } from '@/api_factory/modules/finance'
import { onMounted } from 'vue'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useSettings } from '~/composables/useSettings'

const router = useRouter()
const route = useRoute()
const { currentCurrency } = useSettings()

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
const selectedBnpl = ref('')
const selectedLocal = ref('')
const selectedWallet = ref('')

const bnplProviders = [
  { id: 'credpal', name: 'CredPal', logo: 'https://credpal.com/assets/img/logo.png' },
  { id: 'affirm', name: 'Affirm', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Affirm_logo.svg' },
  { id: 'klarna', name: 'Klarna', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Klarna_Logo_black.svg' },
  { id: 'afterpay', name: 'Afterpay', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Afterpay_logo.png' },
  { id: 'sezzle', name: 'Sezzle', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sezzle_logo.svg/1200px-Sezzle_logo.svg.png' },
]

const localProviders = [
  { id: 'paga', name: 'Paga', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Paga_logo.jpg' },
  { id: 'alipay', name: 'Alipay', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Alipay_logo.svg' },
  { id: 'link_money', name: 'Link Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Link_logo.svg/200px-Link_logo.svg.png' },
  { id: 'verve', name: 'Verve', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Verve_Logo.svg' }
]

const digitalWallets = [
  { id: 'paypal', name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
  { id: 'google_pay', name: 'Google Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
  { id: 'apple_pay', name: 'Apple Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg' }
]

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
  return 'paypal'
})

const showCardPayment = computed(() => true) // Always show card

const hasSufficientWalletBalance = computed(() => {
  // Compare wallet balance (converted) against the already-converted totalAmount
  return (walletBalance.value * (currentCurrency.value.rate || 1)) >= props.totalAmount
})

const canHold = computed(() => {
  // Check if flight offer explicitly supports hold
  if (props.flightOffer?.paymentRequirements) {
    return props.flightOffer.paymentRequirements.requiresInstantPayment === false
  }
  // Generic hold support could be added here for other providers
  return false
})

const { openAuthModal, isLoggedIn } = useAuth()

const fetchWalletBalance = async () => {
  if (!isLoggedIn.value) return; // Don't fetch for guests
  isWalletLoading.value = true
  try {
    const { data } = await financeApi.getWalletBalance()
    if (data.success) {
      walletBalance.value = data.data.balance || 0
    }
  } catch (error: any) {
    console.error('Failed to fetch wallet balance', error)
    if (error.response?.status === 401 && isLoggedIn.value) {
      openAuthModal()
    }
  } finally {
    isWalletLoading.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) {
    fetchWalletBalance()
    activeMethod.value = 'wallet'
  } else {
    activeMethod.value = 'card' // Default to card for guests
  }
  
  // Show Ad Modal with a slight delay only if not previously dismissed
  const isDismissed = localStorage.getItem('flybeth_wallet_ad_dismissed')
  if (!isDismissed && isLoggedIn.value) {
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
  try {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val)
  } catch {
    return val.toFixed(2)
  }
}



const handlePay = () => {
  const { $toast } = useNuxtApp()
  if (activeMethod.value === 'bank') {
    emit('complete-payment', { provider: 'manual', channel: 'transfer' })
  } else if (activeMethod.value === 'wallet') {
    if (!hasSufficientWalletBalance.value) {
      $toast.error('Insufficient wallet balance. Please add funds or use another method.', { position: 'top-right' })
      return
    }
    emit('complete-payment', { 
      provider: 'wallet', 
      channel: 'wallet',
      pin: walletPin.value 
    })
  } else if (activeMethod.value === 'bnpl') {
    if (!selectedBnpl.value) {
      $toast.error('Please select a Buy Now, Pay Later provider', { position: 'top-right' })
      return
    }
    emit('complete-payment', { 
      provider: selectedBnpl.value, 
      channel: 'bnpl'
    })
  } else if (activeMethod.value === 'local') {
    if (!selectedLocal.value) {
      $toast.error('Please select a local payment provider', { position: 'top-right' })
      return
    }
    emit('complete-payment', { 
      provider: selectedLocal.value, 
      channel: 'local'
    })
  } else if (activeMethod.value === 'wallet_payment') {
    if (!selectedWallet.value) {
      $toast.error('Please select a digital wallet provider', { position: 'top-right' })
      return
    }
    emit('complete-payment', { 
      provider: 'paypal', // Route through PayPal backend for wallets
      channel: selectedWallet.value
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
