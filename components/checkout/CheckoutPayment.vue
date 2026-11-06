<template>
  <div class="checkout-payment space-y-4">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Payment selection</h3>

    <!-- ═══ International (USD) Section ═══ -->
    <div v-if="props.currency !== 'NGN'" class="flex items-center gap-2 mb-1">
      <div class="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg">
        <svg class="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="text-[11px] font-bold text-blue-700 uppercase tracking-wider">International (USD)</span>
      </div>
    </div>

    <!-- Card Payment (Always Visible) -->
    <div v-if="props.currency !== 'NGN'" class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'card'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('card')">
        <!-- <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'card'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-900">Debit / Credit card (Duffel Payment)</span>
            <span class="text-[11px] text-amber-600 font-medium">USD transactions only · Dollar card required</span>
          </div>
        </div> -->
        <div class="flex gap-2">
          <img src="@/assets/icons/visa.svg" alt="Visa" class="h-5" />
          <img src="@/assets/icons/master-card.svg" alt="Mastercard" class="h-5" />
        </div>
      </div>
      <div v-show="activeMethod === 'card'" class="py-4 px-0 sm:px-4 border-t border-gray-200 bg-gray-50/50 w-full overflow-hidden box-border">
        <div class="text-sm text-gray-600 p-2 text-center font-medium">
          You will be redirected to complete your secure card payment upon confirming the booking.
        </div>
      </div>
    </div>

    <!-- ═══ Local Currency Section ═══ -->
    <div v-if="props.currency === 'NGN'" class="flex items-center gap-2 mt-6 mb-1">
      <div class="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-lg">
        <svg class="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span class="text-[11px] font-bold text-green-700 uppercase tracking-wider">Local Currency (NGN)</span>
      </div>
    </div>

    <!-- Paystack Payment -->
    <div v-if="props.currency === 'NGN'" class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'paystack'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('paystack')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'paystack'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <span class="text-sm font-bold text-gray-900">Paystack</span>
        </div>
        <img src="@/assets/img/paystack.png" alt="Paystack" class="h-4" />
      </div>
      <div v-show="activeMethod === 'paystack'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <div class="text-sm text-gray-600 p-2">
          You will be redirected to Paystack to complete your purchase securely.
        </div>
      </div>
    </div>

    <!-- Stripe Payment -->
    <div v-if="props.currency !== 'NGN'" class="border border-gray-200 rounded-xl overflow-hidden transition-all mt-4" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'stripe'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('stripe')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'stripe'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-900">Stripe</span>
            <span class="text-[11px] text-gray-500 font-medium">Pay securely with Stripe</span>
          </div>
        </div>
        <div class="flex gap-2 text-blue-600 font-bold italic text-lg tracking-tighter">
          stripe
        </div>
      </div>
      <div v-show="activeMethod === 'stripe'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <div class="text-sm text-gray-600 p-2">
          You will be redirected to Stripe to complete your payment securely.
        </div>
      </div>
    </div>

    <!-- Invoice / Bank Transfer -->
    <div v-if="props.currency !== 'NGN'" class="border border-gray-200 rounded-xl overflow-hidden transition-all mt-4" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'manual'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('manual')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'manual'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-900">Invoice / Bank Transfer</span>
            <span class="text-[11px] text-gray-500 font-medium">Receive payment instructions via email</span>
          </div>
        </div>
        <div class="flex gap-2 text-gray-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
      </div>
      <div v-show="activeMethod === 'manual'" class="p-4 border-t border-gray-200 bg-blue-50/50">
        <div class="flex items-start gap-3 p-2">
          <div class="mt-0.5 text-blue-600">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <div class="text-sm text-blue-800">
            Your booking will be held temporarily. Secure payment instructions (Zelle / Bank Transfer) will be sent to your email.
          </div>
        </div>
      </div>
    </div>

    <!-- Digital Wallets -->
    <div v-if="props.currency !== 'NGN'" class="border border-gray-200 rounded-xl overflow-hidden transition-all mt-4" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'wallet'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('wallet')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'wallet'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <span class="text-sm font-bold text-gray-900">Digital Wallets (Apple Pay / Google Pay / PayPal)</span>
        </div>
      </div>
      <div v-show="activeMethod === 'wallet'" class="p-4 border-t border-gray-200 bg-gray-50/50">
        <DigitalWallets :amount="totalAmount" :currency="currency" @authorize="$emit('wallet-authorize', $event)" />
      </div>
    </div>

    <!-- BNPL Payment -->
    <div v-if="props.currency !== 'NGN'" class="border border-gray-200 rounded-xl overflow-hidden transition-all mt-4" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'bnpl'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('bnpl')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'bnpl'" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
          <span class="text-sm font-bold text-gray-900">Buy Now, Pay Later (Affirm / Klarna / Afterpay / CreditPal)</span>
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
import { ref, computed, onMounted, watch } from 'vue'
import { AlertCircle, Wallet } from 'lucide-vue-next'
import DigitalWallets from './DigitalWallets.vue'
import WalletAdModal from './WalletAdModal.vue'
import FundWalletModal from './FundWalletModal.vue'
import { useRouter, useRoute } from 'vue-router'
import { financeApi } from '@/api_factory/modules/finance'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useSettings } from '~/composables/useSettings'
import { useNuxtApp } from '#app'
import { flightsApi } from '@/api_factory/modules/flights'

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

const activeMethod = ref('card')
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
  { id: 'creditpal', name: 'CreditPal', logo: 'https://via.placeholder.com/80x30?text=CreditPal' },
])



const provider = computed(() => {
  const c = props.currency.toUpperCase()
  if (['NGN'].includes(c)) return 'paystack'
  return 'stripe'
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

watch(() => props.currency, (newCurrency) => {
  if (newCurrency === 'NGN') {
    activeMethod.value = 'paystack'
  } else {
    activeMethod.value = 'card'
  }
}, { immediate: true })

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
  if (activeMethod.value === 'card') {
    emit('complete-payment', { 
      provider: provider.value, 
      channel: provider.value === 'paystack' ? paystackChannel.value : 'card'
    })
    return
  }
  
  if (activeMethod.value === 'wallet') {
    $toast.info('Please tap the Apple Pay or Google Pay button above to authorize your payment.', { position: 'top-center' })
    return
  } else if (activeMethod.value === 'bnpl') {
    if (!selectedBnpl.value) {
      $toast.error('Please select a Buy Now, Pay Later provider', { position: 'top-right' })
      return
    }
    emit('complete-payment', { provider: selectedBnpl.value, channel: 'bnpl' })
  } else if (activeMethod.value === 'stripe') {
    emit('complete-payment', { provider: 'stripe', channel: 'card' })
  } else if (activeMethod.value === 'paystack') {
    emit('complete-payment', { provider: 'paystack', channel: 'card' })
  } else if (activeMethod.value === 'manual') {
    emit('complete-payment', { provider: 'manual', channel: 'transfer', paymentModel: 'on_hold' })
  } else {
    emit('complete-payment', { 
      provider: provider.value, 
      channel: provider.value === 'paystack' ? paystackChannel.value : 'card'
    })
  }
}

const handleHold = () => {
  emit('complete-payment', { provider: 'manual', channel: 'hold', paymentModel: 'on_hold' })
}

const requiresExternalSubmit = computed(() => {
  if (activeMethod.value === 'wallet') return false;
  if (activeMethod.value === 'card') return false;
  return true;
})

defineExpose({ handlePay, handleHold, requiresExternalSubmit, activeMethod })
</script>
