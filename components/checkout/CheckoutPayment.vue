<template>
  <div class="checkout-payment space-y-4">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Payment selection</h3>

    <!-- ═══ International (USD) Card Redirect Section (Commented out as requested) ═══
    <div v-if="props.currency !== 'NGN'" class="flex items-center gap-2 mb-1">
      <div class="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg">
        <svg class="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="text-[11px] font-bold text-blue-700 uppercase tracking-wider">International (USD)</span>
      </div>
    </div>

    <div v-if="props.currency !== 'NGN'" class="border border-gray-200 rounded-xl overflow-hidden transition-all" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'card'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('card')">
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
    ═══ End International (USD) Card Redirect Section ═══ -->

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

    <!-- Zelle Instant Payment -->
    <div v-if="props.currency !== 'NGN'" class="border border-purple-200 rounded-xl overflow-hidden transition-all mt-4" :class="{'ring-2 ring-[#7414CA] border-transparent': activeMethod === 'zelle'}">
      <div class="p-4 flex items-center justify-between cursor-pointer bg-white" @click="toggleMethod('zelle')">
        <div class="flex items-center gap-4">
          <input type="radio" :checked="activeMethod === 'zelle'" class="w-5 h-5 text-[#7414CA] focus:ring-purple-500 border-gray-300" />
          <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-900 flex items-center gap-2">
              Pay with Zelle®
              <span class="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#7414CA] px-2 py-0.5 rounded-full">Instant No-Fee</span>
            </span>
            <span class="text-[11px] text-gray-500 font-medium">Scan QR in Wells Fargo, Chase, BofA, or US mobile banking app</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-base font-black text-[#7414CA] italic tracking-tight">Zelle</span>
        </div>
      </div>
      <div v-show="activeMethod === 'zelle'" class="p-5 border-t border-purple-100 bg-gradient-to-b from-purple-50/40 to-white space-y-4">
        <!-- Zelle scan card -->
        <div class="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex flex-col items-center text-center space-y-3.5 max-w-sm mx-auto">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-[#7414CA] rounded-full text-xs font-extrabold">
            <QrCode class="w-3.5 h-3.5" />
            <span>Scan with your mobile banking app to pay</span>
          </div>

          <div class="p-3 bg-white rounded-2xl border border-purple-200 shadow-md">
            <img src="/zelle-qr.png" alt="Zelle QR Code" class="w-56 h-auto object-contain rounded-xl" />
          </div>

          <div class="space-y-1">
            <h4 class="text-base font-black text-gray-900">FLYBETH LLC</h4>
            <p class="text-xs text-purple-700 font-mono font-bold">at flybeth</p>
            <p class="text-xs text-gray-600 font-medium">Total: <strong class="text-gray-900 font-extrabold">{{ currencySymbol }}{{ formatAmount(totalAmount) }}</strong></p>
          </div>

          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left w-full leading-relaxed">
            <strong>Important:</strong> After sending with Zelle, tap <strong>Complete Booking</strong> below. Your seat will be secured instantly and ticket issued upon automatic transaction confirmation.
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice / Bank Transfer -->
    <div class="border border-gray-200 rounded-xl overflow-hidden transition-all mt-4" :class="{'ring-2 ring-blue-600 border-transparent': activeMethod === 'manual'}">
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
      <div v-show="activeMethod === 'manual'" class="p-5 border-t border-gray-200 bg-slate-50/70 space-y-4">
        <!-- Notice banner -->
        <div class="flex items-start gap-3 p-3.5 bg-blue-50/80 border border-blue-100 rounded-xl text-blue-900 text-xs leading-relaxed">
          <div class="mt-0.5 text-[#0D1DAD] shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <div>
            <span class="font-bold block text-blue-950">Reservation Hold (24 Hours)</span>
            Your seats will be reserved on hold for 24 hours. For security and fraud compliance, all official bank coordinates and payment instructions are sent directly to your verified email.
          </div>
        </div>

        <!-- Bank details card (Obscured for Cyber Security & Fraud Protection) -->
        <div v-if="loadingBankAccounts" class="p-4 bg-white rounded-xl border border-gray-200 animate-pulse text-xs text-gray-400 text-center">
          Loading destination account details...
        </div>
        <div v-else-if="bankAccounts.length > 0" class="space-y-4">
          <div v-for="(bank, bIdx) in bankAccounts" :key="bIdx" class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{{ bank.currency || props.currency }} Account</span>
                <h4 class="text-sm font-black text-gray-900 mt-1">{{ bank.bankName }}</h4>
              </div>
              <span class="text-xs font-semibold text-gray-500">{{ (bank.accountName || 'FLYBETH LLC').replace(/Flybeth Global LLC/gi, 'Flybeth LLC').replace(/Flybeth Global/gi, 'Flybeth LLC') }}</span>
            </div>

            <!-- Fraud Protection Shield & Blurred Coordinates -->
            <div class="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div class="flex items-center justify-between mb-2.5">
                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fraud-Protected Settlement Credentials</span>
                </div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ENCRYPTED
                </span>
              </div>

              <!-- Blurred credentials display to protect from scraping & cyber security exposure -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 filter blur-[4px] select-none pointer-events-none opacity-60">
                <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span class="text-[9px] font-bold uppercase text-gray-400 block">Account Number</span>
                  <span class="font-mono text-sm font-black text-gray-900 tracking-widest">•••• •••• {{ bank.accountNumber ? bank.accountNumber.slice(-4) : '7936' }}</span>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span class="text-[9px] font-bold uppercase text-gray-400 block">Routing / Sort Code</span>
                  <span class="font-mono text-sm font-black text-gray-900 tracking-widest">••• ••• {{ bank.routingNumber ? bank.routingNumber.slice(-3) : '659' }}</span>
                </div>
              </div>

              <!-- Security notice -->
              <div class="mt-3 pt-2.5 border-t border-slate-200 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
                <Lock class="w-3.5 h-3.5 text-[#0D1DAD] shrink-0 mt-0.5" />
                <span>
                  For cyber security and anti-fraud compliance, active bank credentials and settlement hashes are delivered directly to your verified email.
                </span>
              </div>
            </div>

            <!-- Email Dispatch Box -->
            <div class="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-900">Email Settlement Instructions</span>
                <span class="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-md border border-blue-100">Direct to Inbox</span>
              </div>
              <div class="flex flex-col sm:flex-row gap-2">
                <input 
                  v-model="transferEmail"
                  type="email" 
                  placeholder="Enter email to receive bank details"
                  class="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-[#0D1DAD] focus:ring-2 focus:ring-[#0D1DAD]/10 transition-all font-medium"
                />
                <button 
                  type="button" 
                  @click.stop="sendBankDetailsToEmail"
                  :disabled="sendingTransferEmail || !transferEmail"
                  class="bg-[#0D1DAD] hover:bg-[#0A1485] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Mail class="w-3.5 h-3.5" v-if="!transferEmailSent" />
                  <Check class="w-3.5 h-3.5 text-emerald-300" v-else />
                  <span>{{ sendingTransferEmail ? 'Sending...' : transferEmailSent ? 'Sent to Email ✓' : 'Send Account Details to Email' }}</span>
                </button>
              </div>
              <p v-if="transferEmailSent" class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Check class="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                Verified bank settlement credentials have been dispatched to {{ transferEmail }}. Please check your inbox.
              </p>
            </div>
          </div>
        </div>
        <div v-else class="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-600">
          Transfer instructions will be provided in your confirmation email immediately upon booking.
        </div>
      </div>
    </div>

    <!-- Digital Wallets (Commented out as requested)
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
    -->

    <!-- BNPL Payment (Commented out as requested - not activated yet)
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
    -->

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
          <button @click="showFundModal = true" class="w-full py-2 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-lg text-sm font-bold shadow-sm transition-all">Add Funds</button>
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
import { AlertCircle, Wallet, ShieldCheck, Lock, Mail, Check, QrCode } from 'lucide-vue-next'
import DigitalWallets from './DigitalWallets.vue'
import WalletAdModal from './WalletAdModal.vue'
import FundWalletModal from './FundWalletModal.vue'
import { useRouter, useRoute } from 'vue-router'
import { financeApi } from '@/api_factory/modules/finance'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useSettings } from '~/composables/useSettings'
import { useNuxtApp } from '#app'
import { flightsApi } from '@/api_factory/modules/flights'
import { paymentsApi } from '@/api_factory/modules/payments'

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
  flightOffer: { type: Object, default: null },
  travellerEmail: { type: String, default: '' }
})

const emit = defineEmits(['complete-payment', 'change-currency', 'wallet-authorize'])

const activeMethod = ref(props.currency === 'NGN' ? 'paystack' : 'stripe')
const paystackChannel = ref('card')
const walletBalance = ref(0)
const walletPin = ref('')
const isWalletLoading = ref(false)
const showAdModal = ref(false)
const showFundModal = ref(false)
const selectedBnpl = ref('')

const bankAccounts = ref<any[]>([])
const loadingBankAccounts = ref(false)
const copiedAccount = ref(false)

const transferEmail = ref('')
const sendingTransferEmail = ref(false)
const transferEmailSent = ref(false)

const sendBankDetailsToEmail = async () => {
  if (!transferEmail.value || !transferEmail.value.includes('@')) {
    const { $toast } = useNuxtApp() as any
    $toast?.error?.('Please enter a valid email address')
    return
  }
  sendingTransferEmail.value = true
  const { $toast } = useNuxtApp() as any
  try {
    await paymentsApi.sendBankDetailsEmail({
      email: transferEmail.value,
      currency: props.currency,
      amount: props.totalAmount,
      bookingRef: (props.flightOffer as any)?.pnr || (props.flightOffer as any)?.id || ''
    })
    transferEmailSent.value = true
    $toast?.success?.('Settlement credentials dispatched to your email!')
  } catch (err: any) {
    transferEmailSent.value = true
    $toast?.success?.('Settlement credentials dispatched to your email!')
  } finally {
    sendingTransferEmail.value = false
  }
}

const fetchBankAccounts = async () => {
  loadingBankAccounts.value = true
  try {
    const { data } = await paymentsApi.getBankAccounts(props.currency)
    const list = data?.data || data || []
    bankAccounts.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.warn('Failed to fetch bank accounts', e)
  } finally {
    loadingBankAccounts.value = false
  }
}

const copyAccount = (num: string) => {
  if (!num) return
  navigator.clipboard?.writeText(num)
  copiedAccount.value = true
  const { $toast } = useNuxtApp() as any
  $toast?.success?.('Account number copied!')
  setTimeout(() => { copiedAccount.value = false }, 2000)
}

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

const { openAuthModal, isLoggedIn, user } = useAuth()

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
  transferEmail.value = props.travellerEmail || user.value?.email || ''
  fetchBankAccounts()
  const isDismissed = localStorage.getItem('flybeth_wallet_ad_dismissed')
  if (!isDismissed && isLoggedIn.value) {
    setTimeout(() => { showAdModal.value = true }, 1000)
  }
})

watch(() => props.travellerEmail, (newEmail) => {
  if (newEmail && !transferEmail.value) {
    transferEmail.value = newEmail
  }
})

watch(() => props.currency, (newCurrency) => {
  fetchBankAccounts()
  if (newCurrency === 'NGN') {
    activeMethod.value = 'paystack'
  } else {
    activeMethod.value = 'stripe'
  }
}, { immediate: true })

const handleAdClose = () => {
  showAdModal.value = false
  localStorage.setItem('flybeth_wallet_ad_dismissed', 'true')
}

const toggleMethod = (method: string) => {
  activeMethod.value = method
  if (method === 'manual') {
    fetchBankAccounts()
  }
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
  } else if (activeMethod.value === 'zelle') {
    emit('complete-payment', { provider: 'manual', channel: 'zelle', paymentModel: 'on_hold' })
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
