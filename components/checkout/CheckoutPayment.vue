<template>
  <div class="checkout-payment space-y-4">
    <h3 class="text-xl font-bold text-gray-900 mb-6">Payment selection</h3>

    <!-- Card Payment (Commented out as requested)
    <div class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'card'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('card')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'card'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <span class="text-sm font-bold text-gray-900">Debit / Credit card</span>
        </div>
        <div class="flex gap-2">
          <img src="@/assets/icons/visa.svg" alt="Visa" class="h-5" />
          <img src="@/assets/icons/master-card.svg" alt="Mastercard" class="h-5" />
        </div>
      </div>
      <div v-show="activeMethod === 'card'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <div v-if="provider === 'duffel'">
           <DuffelCardForm v-model="duffelCardData" />
        </div>
        <div v-else class="text-sm text-gray-600 p-2">
          You will be redirected to our secure payment partner ({{ provider === 'paystack' ? 'Paystack' : 'PayPal' }}) to complete your purchase safely.
        </div>
      </div>
    </div>
    -->

    <!-- Paystack Payment -->
    <div class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'paystack'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('paystack')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'paystack'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <span class="text-sm font-bold text-gray-900">Paystack</span>
        </div>
        <img src="@/assets/img/paystack.png" alt="PayPal" class="h-4" />
      </div>
      <div v-show="activeMethod === 'paystack'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <div class="text-sm text-gray-600 p-2">
          You will be redirected to Paystack to complete your purchase securely.
        </div>
      </div>
    </div>

    <!-- PayPal Payment -->
    <div class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'paypal'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('paypal')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'paypal'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <span class="text-sm font-bold text-gray-900">PayPal</span>
        </div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" class="h-4" />
      </div>
      <div v-show="activeMethod === 'paypal'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <div class="text-sm text-gray-600 p-2">
          You will be redirected to PayPal to complete your purchase securely.
        </div>
      </div>
    </div>

    <!-- Digital Wallets -->
    <div class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'wallet'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('wallet')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'wallet'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <span class="text-sm font-bold text-gray-900">Digital Wallets (Apple Pay / Google Pay)</span>
        </div>
      </div>
      <div v-show="activeMethod === 'wallet'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <DigitalWallets :amount="totalAmount" :currency="currency" @authorize="$emit('wallet-authorize', $event)" />
      </div>
    </div>

    <!-- BNPL Payment -->
    <div class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'bnpl'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('bnpl')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'bnpl'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <span class="text-sm font-bold text-gray-900">Buy Now, Pay Later</span>
        </div>
        <div class="flex gap-2 items-center">
          <img src="@/assets/img/klarna.png" class="h-3 opacity-60" />
          <img src="@/assets/img/affirm.svg" class="h-4 opacity-60" />
        </div>
      </div>
      <div v-show="activeMethod === 'bnpl'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <div class="grid grid-cols-2 gap-3">
          <div v-for="bnpl in bnplProviders" :key="bnpl.id" @click="selectedBnpl = bnpl.id"
               class="p-4 border rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 h-16 bg-white"
               :class="selectedBnpl === bnpl.id ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'">
            <img :src="bnpl.logo" :alt="bnpl.name" class="h-5 object-contain" />
          </div>
        </div>
      </div>
    </div>

    <!-- Flybeth Wallet (Commented out as requested)
    <div v-if="isLoggedIn" class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'wallet'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('wallet')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'wallet'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-900">Flybeth Wallet</span>
            <span v-if="!isWalletLoading" class="text-xs text-gray-500">Balance: {{ currencySymbol }}{{ formatAmount(walletBalance * (currentCurrency?.rate || 1)) }}</span>
          </div>
        </div>
        <Wallet class="w-5 h-5 text-gray-400" />
      </div>
      <div v-show="activeMethod === 'wallet'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <div v-if="hasSufficientWalletBalance" class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-900">Secure Wallet PIN</label>
              <input v-model="walletPin" type="password" maxlength="4" placeholder="••••"
                class="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-center tracking-[1em] focus:border-blue-500 focus:ring-blue-500" />
            </div>
        </div>
        <div v-else class="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3">
          <div class="flex items-center gap-2 text-red-600 text-sm font-bold">
            <AlertCircle class="w-4 h-4" /> Insufficient wallet balance
          </div>
          <button @click="showFundModal = true" class="w-full py-2 bg-black text-white rounded-lg text-sm font-bold">Add Funds</button>
        </div>
      </div>
    </div>
    -->

    <WalletAdModal :show="showAdModal" @close="handleAdClose" />
    <FundWalletModal :show="showFundModal" :currency="currency" :current-balance="walletBalance" @close="showFundModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AlertCircle, Wallet } from 'lucide-vue-next'
import DuffelCardForm from './DuffelCardForm.vue'
import DigitalWallets from './DigitalWallets.vue'
import WalletAdModal from './WalletAdModal.vue'
import FundWalletModal from './FundWalletModal.vue'
import { useRouter, useRoute } from 'vue-router'
import { financeApi } from '@/api_factory/modules/finance'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useSettings } from '~/composables/useSettings'
import { useNuxtApp } from '#app'

import affirm from '@/assets/img/affirm.svg'
import klarna from '@/assets/img/klarna.png'
import afterpay from '@/assets/img/afterpay.png'

const router = useRouter()
const route = useRoute()
const { currentCurrency } = useSettings()

const props = defineProps({
  totalAmount: { type: Number, required: true },
  currencySymbol: { type: String, default: '$' },
  currency: { type: String, default: 'USD' },
  processing: Boolean,
  flightOffer: { type: Object, default: null }
})

const emit = defineEmits(['complete-payment', 'change-currency', 'wallet-authorize'])

const activeMethod = ref('wallet')
const paystackChannel = ref('card')
const walletBalance = ref(0)
const walletPin = ref('')
const isWalletLoading = ref(false)
const showAdModal = ref(false)
const showFundModal = ref(false)
const selectedBnpl = ref('')

const bnplProviders = ref([
  { id: 'affirm', name: 'Affirm', logo: affirm },
  { id: 'klarna', name: 'Klarna', logo: klarna },
  { id: 'afterpay', name: 'Afterpay', logo: afterpay },
])

const duffelCardData = ref({
  name: '', number: '', expiry: '', cvv: '', multi_use: false,
  address_line_1: '', address_line_2: '', address_city: '', address_region: '', address_country_code: '', address_postal_code: ''
})

const provider = computed(() => {
  const queryProvider = route.query.provider as string
  if (queryProvider === 'duffel') return 'duffel'
  
  const c = props.currency.toUpperCase()
  if (['NGN', 'GHS', 'KES', 'ZAR'].includes(c)) return 'paystack'
  return 'paypal'
})

const hasSufficientWalletBalance = computed(() => {
  return (walletBalance.value * (currentCurrency.value.rate || 1)) >= props.totalAmount
})

const { openAuthModal, isLoggedIn } = useAuth()

const fetchWalletBalance = async () => {
  if (!isLoggedIn.value) return;
  isWalletLoading.value = true
  try {
    const { data } = await financeApi.getWalletBalance()
    if (data.success) {
      walletBalance.value = data.data.balance || 0
    }
  } catch (error: any) {
    if (error.response?.status === 401 && isLoggedIn.value) openAuthModal()
  } finally {
    isWalletLoading.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) fetchWalletBalance()
  const isDismissed = localStorage.getItem('flybeth_wallet_ad_dismissed')
  if (!isDismissed && isLoggedIn.value) {
    setTimeout(() => { showAdModal.value = true }, 1000)
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
    return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
  } catch {
    return val.toFixed(2)
  }
}

const handlePay = () => {
  const { $toast } = useNuxtApp()
  if (activeMethod.value === 'wallet') {
    $toast.info('Please tap the Apple Pay or Google Pay button above to authorize your payment.', { position: 'top-center' })
    return
  } else if (activeMethod.value === 'bnpl') {
    if (!selectedBnpl.value) {
      $toast.error('Please select a Buy Now, Pay Later provider', { position: 'top-right' })
      return
    }
    emit('complete-payment', { provider: selectedBnpl.value, channel: 'bnpl' })
  } else if (activeMethod.value === 'paypal') {
    emit('complete-payment', { provider: 'paypal', channel: 'paypal' })
  } else if (activeMethod.value === 'paystack') {
    emit('complete-payment', { provider: 'paystack', channel: 'card' })
  } else {
    emit('complete-payment', { 
      provider: provider.value, 
      channel: provider.value === 'paystack' ? paystackChannel.value : 'card',
      cardData: provider.value === 'duffel' ? duffelCardData.value : null 
    })
  }
}

const handleHold = () => {
  emit('complete-payment', { provider: 'manual', channel: 'hold', paymentModel: 'on_hold' })
}

defineExpose({ handlePay, handleHold })
</script>
