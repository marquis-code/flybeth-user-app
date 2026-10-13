<template>
  <BrandedLoader 
    :visible="showBrandedLoader" 
    :statusText="loaderStatus"
    subtitle="Please wait while we prepare your booking"
  />

  <CurrencyConversionLoader :visible="isConversionLoading" />

  <ManualPaymentDetailsModal
    v-model="isManualDetailsVisible"
    :accounts="bankAccounts"
    @confirm="handleManualConfirm"
  />

  <BookingExpiredModal :visible="isBookingExpired" :title="bookingErrorTitle" :message="bookingErrorMsg" />

  
  <!-- Cash App Widget Modal -->
  <div v-if="showCashAppWidget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-white/50">
        <h3 class="text-xl font-bold text-black flex items-center gap-2">
           <span class="text-green-500 italic text-2xl">Cash App</span> Pay
        </h3>
        <button @click="closeCashAppWidget" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <XIcon class="w-5 h-5 text-black" />
        </button>
      </div>
      <div class="p-12 overflow-y-auto flex flex-col items-center justify-center">
        <p class="text-center text-gray-500 mb-8 font-medium">Click the button below to authorize the payment via Cash App.</p>
        <div id="cash-app-pay" class="w-full max-w-[280px]"></div>
      </div>
    </div>
  </div>

  <!-- Klarna Widget Modal -->
  <div v-if="showKlarnaWidget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div class="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-white/50">
        <h3 class="text-xl font-bold text-black">Complete with Klarna</h3>
        <button @click="closeKlarnaWidget" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <XIcon class="w-5 h-5 text-black" />
        </button>
      </div>
      <div class="p-6 overflow-y-auto">
        <div id="klarna-payments-container"></div>
      </div>
      <div class="p-6 border-t border-gray-200 bg-white/50 flex justify-end">
        <button @click="authorizeKlarnaPayment" class="btn-primary" :disabled="isAuthorizingKlarna">
          {{ isAuthorizingKlarna ? 'Authorizing...' : 'Confirm Order' }}
        </button>
      </div>
    </div>
  </div>


  <div v-if="!showBrandedLoader" class="ck-root min-h-screen bg-white/30 overflow-x-hidden">
    
    <!-- Premium Header -->
    <header class="bg-white border-b border-gray-200 py-6">
      <div class="ck-wrap mx-auto relative z-10 flex flex-wrap xl:flex-nowrap items-center justify-between gap-4 xl:gap-8">
        <!-- Left: Flight Details -->
        <div class="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          <button @click="handleGoBack" class="flex-shrink-0 flex items-center justify-center hover:bg-gray-100 rounded-full w-10 h-10 transition-colors">
            <ChevronLeft class="h-6 w-6 text-gray-700" />
          </button>
          
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-2 truncate">
              <span class="text-[14px] lg:text-[15px] font-bold text-gray-900 truncate">
                <template v-if="bookingDetails.type === 'flight' && priceDetailed">
                  <span v-if="priceDetailed.tripType === 'Multi-city'">Multi-city Itinerary</span>
                  <span v-else>{{ priceDetailed.originName || priceDetailed.origin }} <span class="text-gray-400 font-normal">→</span> {{ priceDetailed.destinationName || priceDetailed.destination }}</span>
                </template>
                <template v-else>
                  {{ bookingDetails.name }}
                </template>
              </span>
            </div>
            <span class="text-[12px] lg:text-[13px] text-gray-500 mt-0.5 truncate">
              <template v-if="bookingDetails.type === 'flight' && priceDetailed">
                {{ new Date(priceDetailed.departureTime).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) }}
              </template>
            </span>
          </div>
        </div>

        <!-- Center: Stepper -->
        <div class="flex items-center justify-center w-full xl:w-auto order-last xl:order-none mt-4 xl:mt-0 flex-shrink-0">
          <CheckoutStepper :currentStep="currentStep" :steps="['Details', 'Customise', 'Protect', 'Summary']" />
        </div>

        <!-- Right: Price & Actions -->
        <div class="flex items-center justify-end gap-4 lg:gap-6 flex-1 flex-shrink-0 min-w-max">
          <div class="flex flex-col items-end flex-shrink-0">
             <span class="text-[14px] lg:text-[15px] font-bold text-gray-900">{{ currencySymbol }}{{ displayPrices.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
             <span class="text-[11px] lg:text-[12px] text-gray-500">Total price</span>
          </div>
          
          <button @click="currentStep = 3" class="px-4 py-2 lg:px-5 lg:py-2.5 bg-blue-50 text-blue-600 rounded-full text-xs lg:text-sm font-semibold hover:bg-blue-100 transition-colors hidden md:block whitespace-nowrap">
            View Summary
          </button>

          <div class="hidden md:flex flex-shrink-0 items-center justify-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>

   <main class="ck-main">
  <div class="ck-wrap mx-auto">
    <!-- Replace the flex div and its two children's class attributes -->
      <!-- Main column: center aligned without sidebar -->
      <div class="w-full max-w-3xl mx-auto space-y-8 pb-32 pt-0">
        <!-- Step 0: Details (Flight Details + Contact Details + Passenger Details) -->
        <div v-if="currentStep === 0" class="space-y-6 animate-in">
          
          <div class="bg-white rounded-3xl sm:rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-3 sm:p-4 md:p-6">
              <CheckoutFlightDetails
                v-if="bookingDetails.type === 'flight'"
                :flightOffer="priceDetailed"
                hideContinue
              />
              <CheckoutStayDetails
                v-if="bookingDetails.type === 'stay'"
                :stay="priceDetailed"
                :currency-symbol="currencySymbol"
                hideContinue
              />
              <CheckoutTransferDetails
                v-if="bookingDetails.type === 'transfer'"
                :name="priceDetailed?.name"
                :provider="priceDetailed?.provider"
                :hideContinue="true"
              />
              <template v-if="bookingDetails.type === 'package'">
                <CheckoutPackageDetails
                  v-if="!priceDetailed?.flightDetails && !priceDetailed?.stayDetails"
                  :name="bookingDetails.name"
                  :packageDetails="priceDetailed"
                />
                <CheckoutFlightDetails
                  v-if="priceDetailed?.flightDetails"
                  :flightOffer="priceDetailed.flightDetails"
                  hideContinue
                />
                <hr v-if="priceDetailed?.flightDetails && priceDetailed?.stayDetails" class="my-6 border-gray-200" />
                <CheckoutStayDetails
                  v-if="priceDetailed?.stayDetails"
                  :stay="priceDetailed.stayDetails"
                  :currency-symbol="currencySymbol"
                  hideContinue
                />
              </template>

              <!-- Car rental summary -->
              <div v-if="bookingDetails.type === 'car'" class="space-y-3">
                <div>
                  <span class="inline-block text-[11px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 rounded-full px-3 py-1">Car rental</span>
                  <h3 class="mt-2 text-[18px] font-bold text-gray-900">{{ priceDetailed?.name || bookingDetails.name }}</h3>
                  <p v-if="priceDetailed?.vendor" class="text-[13px] text-gray-500">{{ priceDetailed.vendor }}</p>
                </div>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div v-if="bookingDetails.pickUpDate" class="bg-gray-50 rounded-xl p-3">
                    <dt class="text-gray-500">Pick-up</dt>
                    <dd class="font-semibold text-gray-900">{{ bookingDetails.pickUpDate }}<span v-if="bookingDetails.pickUpLocation"> · {{ bookingDetails.pickUpLocation }}</span></dd>
                  </div>
                  <div v-if="bookingDetails.dropOffDate" class="bg-gray-50 rounded-xl p-3">
                    <dt class="text-gray-500">Drop-off</dt>
                    <dd class="font-semibold text-gray-900">{{ bookingDetails.dropOffDate }}<span v-if="bookingDetails.dropOffLocation"> · {{ bookingDetails.dropOffLocation }}</span></dd>
                  </div>
                </dl>
              </div>

              <!-- Activity / experience summary -->
              <div v-if="bookingDetails.type === 'activity'" class="space-y-3">
                <div>
                  <span class="inline-block text-[11px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">Activity</span>
                  <h3 class="mt-2 text-[18px] font-bold text-gray-900">{{ priceDetailed?.name || bookingDetails.name }}</h3>
                  <p v-if="priceDetailed?.city" class="text-[13px] text-gray-500">{{ priceDetailed.city }}</p>
                </div>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div v-if="bookingDetails.date" class="bg-gray-50 rounded-xl p-3">
                    <dt class="text-gray-500">Date</dt>
                    <dd class="font-semibold text-gray-900">{{ bookingDetails.date }}</dd>
                  </div>
                  <div v-if="priceDetailed?.minimumDuration" class="bg-gray-50 rounded-xl p-3">
                    <dt class="text-gray-500">Duration</dt>
                    <dd class="font-semibold text-gray-900">{{ priceDetailed.minimumDuration }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <CheckoutTravellerForm 
            v-model="travellerData" 
            @email-blur="handleEmailBlur"
            @continue="goToStep(1)"
          />
        </div>

        <!-- Step 1: Customise (Seats & Baggage) -->
        <div v-if="currentStep === 1" class="animate-in space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-[20px] font-bold text-[#111827]">Customise your booking</h2>
          </div>
          <CheckoutTripCustomization
            :flightOffer="bookingDetails.type === 'flight' ? priceDetailed : null"
            :stay="bookingDetails.type === 'stay' ? priceDetailed : null"
            :traveller="travellerData"
            :totalPrice="displayPrices.total"
            v-model:selectedAddOns="selectedAddOns"
            v-model:selectedSeats="selectedSeats"
            @update:seatPrice="val => seatPrice = val"
            @continue="goToStep(2)"
            @back="goToStep(0)"
          />
        </div>

        <!-- Step 2: Protect (Cancellation & Baggage Protection) -->
        <div v-if="currentStep === 2" class="animate-in space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-[20px] font-bold text-[#111827]">Protect your booking</h2>
          </div>
          <CheckoutProtection 
            :flightOffer="priceDetailed"
            :currencySymbol="currencySymbol"
            v-model:selectedAddOns="selectedAddOns"
            @continue="goToStep(3)"
            @back="goToStep(1)"
          />
        </div>

        <!-- Step 3: Summary & Payment -->
        <div v-if="currentStep === 3" class="animate-in space-y-6">
          
          <!-- Summary Modules (Read-only views) -->
          <CheckoutSummary 
            :bookingType="bookingDetails.type"
            :flightOffer="priceDetailed"
            :travellerData="travellerData"
            :selectedSeats="selectedSeats"
            :seatPrice="seatPrice"
            :selectedAddOns="selectedAddOns"
            :currencySymbol="currencySymbol"
            @edit="goToStep"
          />

          <div class="flex flex-col gap-8 mt-6">
            <!-- Payment Section -->
            <div class="w-full bg-white rounded-3xl sm:rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8">
              <CheckoutPayment 
                ref="paymentRef"
                :total-amount="displayPrices.total" 
                :currency-symbol="currencySymbol"
                :currency="currentCurrency.code"
                :processing="paymentProcessing"
                :flight-offer="priceDetailed"
                @complete-payment="handlePayment"
                @wallet-authorize="handleWalletAuthorize"
                @change-currency="handleCurrencySelect"
              />
            </div>

            <!-- Price Breakdown (Full Width Redesign) -->
            <div class="w-full bg-white rounded-3xl sm:rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-6">Price breakdown</h3>
                  <div class="space-y-4 text-sm text-gray-600">
                    <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span class="font-medium text-gray-500">Flight Fare</span>
                      <span class="font-bold text-gray-900">{{ currencySymbol }}{{ displayPrices.base.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>
                    <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span class="font-medium text-gray-500">Taxes & Fees</span>
                      <span class="font-bold text-gray-900">{{ currencySymbol }}{{ displayPrices.tax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>
                    
                    <div v-if="seatPrice > 0" class="flex justify-between items-center pb-3 border-b border-gray-100 text-blue-600">
                      <span class="font-medium">Seat Selection</span>
                      <span class="font-bold">+{{ currencySymbol }}{{ (seatPrice * (currentCurrency.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>

                    <template v-if="selectedAddOns.length > 0">
                      <div v-for="addon in selectedAddOns.filter(a => a.id !== 'seat-selection')" :key="addon.id" class="flex justify-between items-center pb-3 border-b border-gray-100 text-blue-600">
                        <span class="font-medium">{{ addon.name }}</span>
                        <span class="font-bold">+{{ currencySymbol }}{{ (addon.price * (currentCurrency.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Total & Action Area -->
                <div class="flex flex-col justify-end">
                  <div class="bg-gray-50 rounded-2xl p-6">
                    <div class="flex justify-between items-end mb-2">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount</span>
                        <p class="text-xs text-gray-400">Includes taxes and charges</p>
                      </div>
                      <span class="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">{{ currencySymbol }}{{ displayPrices.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>
                    
                    <div class="mt-6" v-show="!paymentRef || paymentRef.requiresExternalSubmit">
                      <button @click="handlePayNow" :disabled="paymentProcessing" class="w-full h-12 bg-[#0D1DAD] hover:bg-[#0A1485] text-white rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                        <template v-if="!paymentProcessing">
                          <Lock class="w-5 h-5 opacity-80" />
                          Complete Booking
                        </template>
                        <span v-else class="animate-pulse flex items-center gap-2">
                          <span class="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                          Processing Securely...
                        </span>
                      </button>
                      <div class="flex items-center justify-center gap-2 mt-4 text-gray-400">
                        <ShieldCheck class="w-4 h-4" />
                        <span class="text-xs font-semibold uppercase tracking-wider">AES-256 Bank-Level Encryption</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</main>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronLeft, Lock, ShieldCheck, X as XIcon } from 'lucide-vue-next'
import { useRoute, useRouter, navigateTo, useRuntimeConfig } from '#app'
import { staysApi } from '~/api_factory/modules/stays'
import { paymentsApi } from '~/api_factory/modules/payments'
import { useFlightCheckout } from '~/composables/modules/flights/useFlightCheckout'
import BrandedLoader from '~/components/BrandedLoader.vue'
import CheckoutStepper from '~/components/checkout/CheckoutStepper.vue'
import CheckoutFlightDetails from '~/components/checkout/CheckoutFlightDetails.vue'
import CheckoutTransferDetails from '~/components/checkout/CheckoutTransferDetails.vue'
import CheckoutTravellerForm from '~/components/checkout/CheckoutTravellerForm.vue'
import CheckoutTripCustomization from '~/components/checkout/CheckoutTripCustomization.vue'
import CheckoutProtection from '~/components/checkout/CheckoutProtection.vue'
import CheckoutSummary from '~/components/checkout/CheckoutSummary.vue'
import CheckoutPayment from '~/components/checkout/CheckoutPayment.vue'
import CurrencySelectorModal from '~/components/checkout/CurrencySelectorModal.vue'
import CurrencyConversionLoader from '~/components/checkout/CurrencyConversionLoader.vue'
import ManualPaymentDetailsModal from '~/components/checkout/ManualPaymentDetailsModal.vue'
import CheckoutSidebar from '~/components/checkout/CheckoutSidebar.vue'
import SeatSelection from '~/components/checkout/SeatSelection.vue'
import CheckoutStayDetails from '~/components/checkout/CheckoutStayDetails.vue'
import CheckoutPackageDetails from '~/components/checkout/CheckoutPackageDetails.vue'
import BookingExpiredModal from '~/components/checkout/BookingExpiredModal.vue'
import { flightsApi } from '~/api_factory/modules/flights'
import { transfersApi } from '~/api_factory/modules/transfers'
import { bookingsApi } from '~/api_factory/modules/bookings'
import { useTracking } from '~/composables/core/useTracking'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useUser } from '~/composables/modules/auth/user'
import { useCustomToast } from '~/composables/core/useCustomToast'
import { useSettings } from '~/composables/useSettings'

const { token, isLoggedIn, openAuthModal } = useAuth()
const { showToast } = useCustomToast()
const { currentCurrency } = useSettings()

definePageMeta({
  layout: 'checkout'
})
const { trackAction } = useTracking()
const route = useRoute()
const router = useRouter()

// State
const currentStep = ref(0)
const showBrandedLoader = ref(true)
const isBookingExpired = ref(false)
const bookingErrorTitle = ref('Booking expired')
const bookingErrorMsg = ref('This booking has expired. Please start a new search to continue.')
const loaderStatus = ref('Confirming best fare with airline...')
const paymentProcessing = ref(false)
const selectedAddOns = ref<{ id: string; name: string; price: number }[]>([])
const selectedSeats = ref<any[]>([])
const seatPrice = ref(0)



// Afterpay Integration State
const isAuthorizingAfterpay = ref(false)
const afterpayOrderId = ref('')
const afterpayPnr = ref('')
const userCountryCode = ref('US')

const loadAfterpaySdk = (token) => {
  return new Promise((resolve, reject) => {
    if ((window as any).AfterPay) {
      initAfterpay(token)
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://portal.sandbox.afterpay.com/afterpay.js'
    script.async = true
    script.onload = () => {
      initAfterpay(token)
      resolve(true)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initAfterpay = (token) => {
  const AfterPay = (window as any).AfterPay
  if (!AfterPay) {
    showToast({ title: 'Error', message: 'Afterpay SDK not found', toastType: 'error' })
    return
  }
  
  // Dynamically set country code based on browser locale
  const locale = navigator.language
  if (locale && locale.includes('-')) {
    userCountryCode.value = locale.split('-')[1].toUpperCase()
  }

  AfterPay.initialize({ countryCode: userCountryCode.value })
  
  AfterPay.onComplete = async (event) => {
    if (event.data.status === "SUCCESS") {
      isAuthorizingAfterpay.value = true
      try {
        await paymentsApi.authorizeBnpl({
          bookingId: afterpayOrderId.value,
          provider: 'afterpay',
          checkoutToken: token,
        })
        router.push(`/confirmation?pnr=${afterpayPnr.value}&status=success`)
      } catch (err) {
        showToast({ title: 'Payment Failed', message: 'Afterpay authorization failed on backend', toastType: 'error' })
        isAuthorizingAfterpay.value = false
      }
    } else {
      isAuthorizingAfterpay.value = false
      showToast({ title: 'Payment Cancelled', message: 'Afterpay checkout was cancelled', toastType: 'error' })
    }
  }

  AfterPay.open()
  AfterPay.transfer({ token: token })
}

// Cash App Integration State
const showCashAppWidget = ref(false)
const isAuthorizingCashApp = ref(false)
const cashAppOrderId = ref('')
const cashAppPnr = ref('')
const cashAppAmount = ref(0)
const cashAppCurrency = ref('USD')
const cashAppClientId = 'client_id_placeholder'

const closeCashAppWidget = () => {
  showCashAppWidget.value = false
}

const loadCashAppSdk = () => {
  return new Promise((resolve, reject) => {
    if ((window as any).CashApp) {
      initCashApp()
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://sandbox.paykit.cash.app/paykit.js'
    script.async = true
    script.onload = () => {
      initCashApp()
      resolve(true)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initCashApp = async () => {
  try {
    const PayKit = (window as any).CashApp.PayKit
    const paykit = await PayKit(cashAppClientId, { environment: 'sandbox' })
    const elements = paykit.elements({ button: { theme: 'dark', shape: 'semicircle' } })
    await elements.mount('#cash-app-pay')
    
    // Create customer request
    paykit.customerRequest({
      actions: {
        payment: {
          amount: Math.round(cashAppAmount.value * 100),
          currency: cashAppCurrency.value,
          scope_id: 'merchant_id_placeholder' 
        }
      },
      redirect_url: window.location.href
    }).addEventListener('DELEGATE_REQUEST_APPROVED', async (event) => {
      const grantId = event.detail.grant.id
      isAuthorizingCashApp.value = true
      try {
        await paymentsApi.processCashAppPayment({
          bookingId: cashAppOrderId.value,
          grantId: grantId
        })
        router.push(`/confirmation?pnr=${cashAppPnr.value}&status=success`)
      } catch (err) {
        showToast({ title: 'Payment Failed', message: 'Cash App authorization failed on backend', toastType: 'error' })
        isAuthorizingCashApp.value = false
      }
    }).addEventListener('DELEGATE_REQUEST_DECLINED', () => {
      showToast({ title: 'Payment Declined', message: 'Cash App declined the payment', toastType: 'error' })
    })
  } catch(e) {
    console.error('PayKit Initialization Error', e)
  }
}

// Klarna Integration State
const showKlarnaWidget = ref(false)
const isAuthorizingKlarna = ref(false)
const klarnaClientToken = ref('')
const klarnaOrderId = ref('')
const klarnaPnr = ref('')

const closeKlarnaWidget = () => {
  showKlarnaWidget.value = false
}

const loadKlarnaSdk = (client_token: string) => {
  return new Promise((resolve, reject) => {
    if ((window as any).Klarna) {
      initKlarna(client_token)
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js'
    script.async = true
    script.onload = () => {
      initKlarna(client_token)
      resolve(true)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initKlarna = (client_token: string) => {
  const Klarna = (window as any).Klarna
  Klarna.Payments.init({ client_token })
  Klarna.Payments.load({ container: '#klarna-payments-container', payment_method_category: 'pay_over_time' }, (res: any) => {
    console.log('Klarna widget loaded', res)
  })
}

const authorizeKlarnaPayment = () => {
  isAuthorizingKlarna.value = true
  const Klarna = (window as any).Klarna
  if (!Klarna) {
    showToast({ title: 'Error', message: 'Klarna SDK not found', toastType: 'error' })
    isAuthorizingKlarna.value = false
    return
  }

  Klarna.Payments.authorize({ payment_method_category: 'pay_over_time' }, async (res: any) => {
    if (res.approved && res.authorization_token) {
      try {
         await paymentsApi.authorizeBnpl({
           bookingId: klarnaOrderId.value,
           provider: 'klarna',
           checkoutToken: res.authorization_token
         })
         router.push(`/confirmation?pnr=${klarnaPnr.value}&status=success`)
      } catch (err) {
         showToast({ title: 'Payment Failed', message: 'Klarna authorization failed on backend', toastType: 'error' })
         isAuthorizingKlarna.value = false
      }
    } else {
      isAuthorizingKlarna.value = false
      showToast({ title: 'Payment Not Approved', message: res.error?.message || 'Klarna declined the payment', toastType: 'error' })
    }
  })
}

const { loading: pricingLoading, pricingDetails, priceFlightOffer } = useFlightCheckout()
const selectedFlight = ref<any>(null)
const priceDetailed = ref<any>(null)
const bundledStay = ref<any>(null)

const travellerData = ref({
  travelers: [{
    title: 'Mr',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    nationality: 'Nigeria',
    passportNumber: '',
    passportExpiry: '',
  }],
  contact: {
    email: '',
    phone: '',
    phoneCountryCode: '+234',
  }
})

// Persistence Key
const PERSISTENCE_KEY = computed(() => `flybeth_checkout_${bookingDetails.value.id}`)

const saveCheckoutState = () => {
    const state = {
        currentStep: currentStep.value,
        travellerData: travellerData.value,
        selectedSeats: selectedSeats.value,
        seatPrice: seatPrice.value,
        selectedAddOns: selectedAddOns.value
    }
    localStorage.setItem(PERSISTENCE_KEY.value, JSON.stringify(state))
}

const loadCheckoutState = () => {
    const saved = localStorage.getItem(PERSISTENCE_KEY.value)
    if (saved) {
        try {
            const state = JSON.parse(saved)
            currentStep.value = state.currentStep || 0
            travellerData.value = { ...travellerData.value, ...state.travellerData }
            selectedSeats.value = state.selectedSeats || []
            seatPrice.value = state.seatPrice || 0
            selectedAddOns.value = state.selectedAddOns || []
        } catch (e) {
            console.warn('Failed to load checkout state', e)
        }
    }
}

const clearCheckoutState = () => {
    localStorage.removeItem(PERSISTENCE_KEY.value)
    // Clear the parked hotel from the "add a flight to my hotel" bundle so a
    // later, unrelated flight booking cannot silently re-attach it.
    try {
        sessionStorage.removeItem('pendingStayBooking')
        sessionStorage.removeItem('flybeth_checkout_payload')
    } catch {}
}

/**
 * "Add a flight to my hotel" bundle.
 *
 * `SecuredHotelModal` parks the chosen room in `pendingStayBooking`, then sends
 * the traveller to the flight search. When they reach checkout with a flight we
 * merge that stay back in so both products are booked and charged together.
 */
const loadBundledStay = () => {
    if (!import.meta.client) return
    if (bookingDetails.value.type !== 'flight') return

    try {
        const raw = sessionStorage.getItem('pendingStayBooking')
        if (!raw) return
        const stay = JSON.parse(raw)
        if (!stay || (!stay.roomId && !stay.id)) return

        bundledStay.value = {
            ...stay,
            // `price` must be the customer-facing total so the summary matches
            // the amount the backend will charge for the stay.
            price: Number(stay.priceWithCommission ?? stay.price ?? 0),
            provider: stay.provider || 'flybeth',
        }
    } catch (e) {
        console.warn('Could not restore the bundled hotel', e)
    }
}

// Prefill from user profile if logged in and empty
const prefillFromUser = () => {
    const u = useUser().user.value
    if (u && travellerData.value.travelers.length === 1 && !travellerData.value.travelers[0].firstName) {
        travellerData.value.travelers[0].firstName = u.firstName || ''
        travellerData.value.travelers[0].lastName = u.lastName || ''
        travellerData.value.contact.email = u.email || ''
        travellerData.value.contact.phone = u.phone || ''
    }
}

// Booking details from secure session storage instead of URL
const checkoutPayload = ref<any>({})
onMounted(() => {
  if (import.meta.client) {
    const payloadStr = sessionStorage.getItem('flybeth_checkout_payload')
    if (payloadStr) {
      try {
        checkoutPayload.value = JSON.parse(payloadStr)
      } catch (e) {
        console.error('Failed to parse checkout payload', e)
      }
    }
  }
})

const bookingDetails = computed(() => {
  const p = checkoutPayload.value || {}
  return {
    type: p.type as string,
    id: p.id as string,
    roomId: p.roomId as string,
    name: p.hotelName || p.name || 'Selected trip',
    provider: p.provider as string,
    price: p.price ? Number(p.price) : 0,
    priceWithCommission: p.priceWithCommission
      ? Number(p.priceWithCommission)
      : (p.price ? Number(p.price) : 0),
    currency: p.currency || 'USD',
    quoteId: p.quoteId as string,
    checkIn: p.checkIn as string,
    checkOut: p.checkOut as string,
    adults: p.adults ? Number(p.adults) : 2,
    children: p.children ? Number(p.children) : 0,
    rooms: p.rooms ? Number(p.rooms) : 1,
    returnId: p.returnId as string,
    returnName: p.returnName as string,
    returnPrice: p.returnPrice ? Number(p.returnPrice) : 0,
    returnProvider: (p.returnProvider || p.provider) as string,
    returnPriceWithCommission: p.returnPriceWithCommission
      ? Number(p.returnPriceWithCommission)
      : (p.returnPrice ? Number(p.returnPrice) : 0),
    // Car rentals
    carId: (p.carId || p.id) as string,
    rateKey: p.rateKey as string,
    vendor: p.vendor as string,
    pickUpDate: p.pickUpDate as string,
    dropOffDate: p.dropOffDate as string,
    pickUpLocation: p.pickUpLocation as string,
    dropOffLocation: p.dropOffLocation as string,
    // Activities / experiences
    experienceId: (p.experienceId || p.id) as string,
    date: p.date as string,
    dateTo: p.dateTo as string,
    duration: p.duration as string,
  }
})

/**
 * Minimum number of travellers for the vertical being booked. Stays, transfers,
 * cars and activities do not ask for a full passenger manifest, so the
 * traveller form is pre-seeded with the party size the user already chose.
 */
const requiredTravelers = computed(() => {
  const t = bookingDetails.value
  if (t.type === 'stay') return Math.max(1, (t.adults || 1) + (t.children || 0))
  if (t.type === 'transfer') return Math.max(1, t.adults || 1)
  return 1
})

/** Makes sure the traveller form has a row for every guest in the party. */
const ensureTravelers = () => {
  const needed = requiredTravelers.value
  const seed = travellerData.value.travelers[0]
  while (travellerData.value.travelers.length < needed) {
    travellerData.value.travelers.push({
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      nationality: seed?.nationality || 'Nigeria',
      passportNumber: '',
      passportExpiry: '',
    } as any)
  }
}

const currencySymbol = computed(() => {
  return currentCurrency.value.symbol || '$'
})

const addOnsTotal = computed(() => selectedAddOns.value.reduce((sum, a) => sum + (a.price * (currentCurrency.value.rate || 1)), 0))

// Price display
const displayPrices = computed(() => {
  let base = 0
  let total = 0
  let tax = 0
  let serviceCharge = 0
  const rate = currentCurrency.value.rate || 1

  if (priceDetailed.value) {
    // `price` is the NET supplier rate; `priceWithCommission` is what the
    // traveller actually pays. The backend charges the net rate plus the
    // platform commission, so these two numbers are the display contract.
    const net = Number(priceDetailed.value.price || 0)
    const gross = Number(
      priceDetailed.value.priceWithCommission ??
        priceDetailed.value.price ??
        0,
    )
    base = net
    total = gross
    tax = Math.max(0, gross - net)
    serviceCharge = 0
  }

  if (bundledStay.value) {
    const stayPrice = bundledStay.value.price || 0
    base += stayPrice
    total += stayPrice
  }

  // Calculate final aggregated total once
  let finalTotal = total + (seatPrice.value) + (selectedAddOns.value.reduce((sum, a) => sum + a.price, 0))

  return {
    base: base * rate,
    tax: tax * rate,
    serviceCharge: serviceCharge * rate,
    fees: (seatPrice.value + selectedAddOns.value.reduce((sum, a) => sum + a.price, 0)) * rate,
    total: finalTotal * rate
  }
})

// Currency & Manual Payment State
const isCurrencyModalVisible = ref(false)
const isConversionLoading = ref(false)
const isManualDetailsVisible = ref(false)
const bankAccounts = ref([])

/**
 * Confirms the manual bank-transfer instructions.
 *
 * The booking and its payment record already exist by this point; the transfer
 * stays in `awaiting_transfer` until finance reconciles it, so we simply close
 * the modal and move the traveller to the confirmation page.
 */
const handleManualConfirm = () => {
  isManualDetailsVisible.value = false
  const pnr = sessionStorage.getItem('walletBookingPnr')
  const bookingId = sessionStorage.getItem('walletBookingId')
  if (pnr) {
    router.push(
      `/confirmation?pnr=${pnr}${bookingId ? `&orderId=${bookingId}` : ''}&status=pending_payment`,
    )
  }
}
// Normalization Helpers
const parseDuration = (durationStr: string) => {
  if (!durationStr) return 0
  if (typeof durationStr === 'number') return durationStr
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  return hours * 60 + minutes
}

const normalizeFlightData = (rawFlight: any) => {
  if (!rawFlight) return null
  if (rawFlight.origin && rawFlight.destination && typeof rawFlight.price === 'number' && rawFlight.segments) {
    return rawFlight
  }

  if (rawFlight.slices && rawFlight.slices.length > 0) {
    const basePrice = Number(rawFlight.base_amount || 0)
    const totalPrice = Number(rawFlight.total_amount || 0)
    const taxPrice = Number(rawFlight.tax_amount || 0)
    
    const itineraries = rawFlight.slices.map((slice: any) => {
      const segments = slice.segments || []
      const normalizedSegments = segments.map((s: any) => ({
        flightNumber: s.marketing_carrier_flight_number || s.operating_carrier_flight_number || 'N/A',
        airline: s.marketing_carrier?.name || s.operating_carrier?.name || 'Airline',
        airlineLogo: s.marketing_carrier?.logo_symbol_url || s.operating_carrier?.logo_symbol_url || `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${s.marketing_carrier?.iata_code || s.operating_carrier?.iata_code}.svg`,
        origin: s.origin?.iata_code || s.origin?.iata_city_code || 'N/A',
        originName: s.origin?.name || s.origin?.city_name || 'N/A',
        destination: s.destination?.iata_code || s.destination?.iata_city_code || 'N/A',
        destinationName: s.destination?.name || s.destination?.city_name || 'N/A',
        departureTime: s.departing_at,
        arrivalTime: s.arriving_at,
        duration: parseDuration(s.duration),
        originTerminal: s.origin_terminal,
        destinationTerminal: s.destination_terminal,
        aircraft: s.aircraft?.name || s.aircraft?.code || 'Aircraft',
      }))
      const totalDuration = normalizedSegments.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
      return {
        origin: normalizedSegments[0]?.origin || 'N/A',
        destination: normalizedSegments[normalizedSegments.length - 1]?.destination || 'N/A',
        departureTime: normalizedSegments[0]?.departureTime,
        arrivalTime: normalizedSegments[normalizedSegments.length - 1]?.arrivalTime,
        duration: totalDuration,
        stops: segments.length - 1,
        segments: normalizedSegments,
        cabinClass: (slice.fare_brand_name || segments[0]?.passengers?.[0]?.cabin_class || 'Economy').toLowerCase(),
      }
    })

    const firstSegment = rawFlight.slices[0]?.segments?.[0]
    const lastSegment = rawFlight.slices[rawFlight.slices.length - 1]?.segments?.slice(-1)[0]
    
    let tripType = 'One Way'
    if (rawFlight.slices.length > 2) {
      tripType = 'Multi-city'
    } else if (rawFlight.slices.length === 2) {
      tripType = 'Round Trip'
    }

    const canChange = rawFlight.conditions?.change_before_departure?.allowed || false
    const canRefund = rawFlight.conditions?.refund_before_departure?.allowed || false

    return {
      ...rawFlight,
      origin: firstSegment?.origin?.iata_code || firstSegment?.origin?.iata_city_code || 'N/A',
      originName: firstSegment?.origin?.city_name || 'N/A',
      destination: lastSegment?.destination?.iata_code || lastSegment?.destination?.iata_city_code || 'N/A',
      destinationName: lastSegment?.destination?.city_name || 'N/A',
      departureTime: firstSegment?.departing_at,
      arrivalTime: lastSegment?.arriving_at,
      duration: itineraries.reduce((sum: number, it: any) => sum + it.duration, 0),
      price: basePrice,
      tax: taxPrice,
      priceWithCommission: totalPrice,
      currency: rawFlight.total_currency || 'USD',
      itineraries,
      segments: itineraries[0].segments, // Keep for backward compatibility with simple views
      cabinClass: itineraries[0].cabinClass,
      airline: rawFlight.owner?.name || firstSegment?.marketing_carrier?.name || 'Airline',
      airlineLogo: rawFlight.owner?.logo_symbol_url || firstSegment?.marketing_carrier?.logo_symbol_url,
      totalEmissionsKg: rawFlight.total_emissions_kg,
      conditions: { refundable: canRefund, changeable: canChange },
      isRoundTrip: rawFlight.slices ? rawFlight.slices.length > 1 : false,
      tripType,
      rawOffer: rawFlight,
    }
  }

  if (rawFlight.itineraries && rawFlight.itineraries.length > 0) {
    const basePrice = Number(rawFlight.price?.base || rawFlight.price?.total || 0)
    const totalPrice = Number(rawFlight.price?.total || rawFlight.price?.grandTotal || 0)
    const cabin = (rawFlight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY').toLowerCase()

    const itineraries = rawFlight.itineraries.map((itinerary: any) => {
      const segments = itinerary.segments || []
      const normalizedSegments = segments.map((s: any) => ({
        flightNumber: `${s.carrierCode}${s.number}`,
        airline: s.carrierCode,
        airlineLogo: `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${s.carrierCode}.svg`,
        origin: s.departure?.iataCode,
        destination: s.arrival?.iataCode,
        departureTime: s.departure?.at,
        arrivalTime: s.arrival?.at,
        duration: parseDuration(s.duration),
        originTerminal: s.departure?.terminal,
        destinationTerminal: s.arrival?.terminal,
        aircraft: s.aircraft?.code,
      }))
      const totalDuration = normalizedSegments.reduce((sum: number, s: any) => sum + s.duration, 0)
      return {
        origin: normalizedSegments[0]?.origin || 'N/A',
        destination: normalizedSegments[normalizedSegments.length - 1]?.destination || 'N/A',
        departureTime: normalizedSegments[0]?.departureTime,
        arrivalTime: normalizedSegments[normalizedSegments.length - 1]?.arrivalTime,
        duration: totalDuration,
        stops: segments.length - 1,
        segments: normalizedSegments,
        cabinClass: cabin,
      }
    })

    const firstSegment = rawFlight.itineraries[0]?.segments?.[0]
    const lastSegment = rawFlight.itineraries[rawFlight.itineraries.length - 1]?.segments?.slice(-1)[0]
    
    let tripType = 'One Way'
    if (rawFlight.itineraries.length > 2) {
      tripType = 'Multi-city'
    } else if (rawFlight.itineraries.length === 2) {
      tripType = 'Round Trip'
    }

    return {
      ...rawFlight,
      origin: firstSegment?.departure?.iataCode || 'N/A',
      destination: lastSegment?.arrival?.iataCode || 'N/A',
      departureTime: firstSegment?.departure?.at,
      arrivalTime: lastSegment?.arrival?.at,
      duration: itineraries.reduce((sum: number, it: any) => sum + it.duration, 0),
      price: basePrice,
      priceWithCommission: totalPrice,
      currency: rawFlight.price?.currency || 'USD',
      itineraries,
      segments: itineraries[0].segments, // Keep for backward compatibility
      cabinClass: cabin,
      airline: rawFlight.validatingAirlineCodes?.[0] || firstSegment?.carrierCode || 'Airline',
      airlineLogo: `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${rawFlight.validatingAirlineCodes?.[0] || firstSegment?.carrierCode}.svg`,
      tripType,
      isRoundTrip: rawFlight.itineraries.length > 1,
      rawOffer: rawFlight,
    }
  }
  return rawFlight
}

const goToStep = (step: number) => {
  currentStep.value = step
  saveCheckoutState()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const steps = ['details', 'customise', 'protect', 'summary']
  trackAction(`booking_step_${steps[step]}`, { type: bookingDetails.value.type, item: bookingDetails.value.name, price: displayPrices.value.total })
}

const handleGoBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    saveCheckoutState()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.back()
  }
}

const handleTravellerContinue = async () => {
  // Guest booking enabled: we don't block if not logged in.
  // We just proceed to the next step.
  
  // Duffel Identity is ONLY required if using the official @duffel/components Card Payment flow 
  // which requires a component client token. Since we are using our custom checkout UI and paying 
  // directly via the backend using Duffel Balance, we can entirely skip this 500-error prone step!
  goToStep(2)
}

const handleEmailBlur = async () => {
  if (!travellerData.value.contact.email) return
  try {
    await bookingsApi.emailCapture({
      email: travellerData.value.contact.email,
      firstName: travellerData.value.travelers[0]?.firstName || 'Guest',
      destination: bookingDetails.value.name,
      checkoutUrl: window.location.href,
      tenantId: bookingDetails.value.provider === 'duffel' ? undefined : undefined
    })
  } catch (err) {
    console.warn('Email capture failed (silent):', err)
  }
}

const paymentRef = ref<any>(null)

const handleHold = () => {
  if (paymentRef.value) {
    paymentRef.value.handleHold()
  } else {
    handlePayment({ provider: 'manual', paymentModel: 'on_hold' })
  }
}

const handlePayNow = () => {
  if (paymentRef.value) {
    paymentRef.value.handlePay()
  }
}

/**
 * Builds the POST /bookings payload for every product type.
 *
 * Both the wallet (Apple/Google Pay) handler and the standard payment handler
 * must produce an identical payload, so the logic lives here exactly once.
 */
const buildBookingPayload = (paymentInfo: any) => {
  const details = bookingDetails.value
  const travelers = travellerData.value.travelers || []
  const lead = travelers[0] || {}
  const contact = travellerData.value.contact || {}

  const payload: any = {
    contactDetails: {
      email: contact.email,
      phone: contact.phone,
      name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Guest',
      state: lead.nationality,
    },
    currency: currentCurrency.value.code,
    paymentModel: paymentInfo?.paymentModel || 'pay_now',
    paymentProvider: paymentInfo?.provider,
    paymentMetadata: paymentInfo,
    passengerDetails: travelers.map((t: any) => ({
      ...t,
      email: contact.email || '',
      phone: contact.phone || '',
      gender: (t.gender || 'male').toLowerCase(),
      title: (t.title || 'mr').toLowerCase(),
      type: t.type || 'adult',
    })),
    pricing: {
      // The backend applies the platform commission to this NET base fare, so
      // the final charge equals the `priceWithCommission` shown to the user.
      // When a hotel is bundled in, the stay is priced separately by the
      // backend from `stays[]`, so only the flight's own net fare may go here —
      // otherwise the stay would be charged twice.
      baseFare: bundledStay.value
        ? Number(priceDetailed.value?.price || 0)
        : displayPrices.value.base,
      taxes: 0,
      // Extras the traveller explicitly selected (seats, bags, insurance…).
      fees: displayPrices.value.fees,
    },
    hasInsurance: selectedAddOns.value.some((a) => a.id === 'insurance'),
    hasVipSupport: selectedAddOns.value.some((a) => a.id === 'vip-support'),
    extraBaggageCount: selectedAddOns.value.filter((a) => a.id.startsWith('bag-')).length,
    premiumSeatCount: selectedSeats.value.length,
  }

  if (details.type === 'flight') {
    payload.isRoundTrip = priceDetailed.value?.isRoundTrip || false
    payload.flights = [
      {
        flightId: details.id,
        class: (priceDetailed.value?.cabinClass || 'economy').toLowerCase(),
        offerId:
          priceDetailed.value?.offerId ||
          details.quoteId ||
          priceDetailed.value?.id ||
          details.id,
        provider: details.provider,
        passengerIds: [],
        metadata: {
          origin: priceDetailed.value?.origin || priceDetailed.value?.originName,
          destination: priceDetailed.value?.destination || priceDetailed.value?.destinationName,
          airline: priceDetailed.value?.airline,
          departureTime: priceDetailed.value?.departureTime,
          slices: priceDetailed.value?.slices || priceDetailed.value?.segments || [],
        },
      },
    ]

    // Bundle: book the parked hotel alongside the flight.
    const stay = bundledStay.value
    if (stay && (stay.roomId || stay.id)) {
      payload.stays = [
        {
          hotelId: stay.id || stay.hotelId,
          roomId: stay.roomId || stay.id,
          provider: stay.provider || 'flybeth',
          quoteId: stay.quoteId,
          checkIn: stay.checkIn,
          checkOut: stay.checkOut,
          occupancy: {
            rooms: Number(stay.rooms) || 1,
            adults: Number(stay.adults) || 1,
            children: Number(stay.children) || 0,
          },
        },
      ]
    }
  } else if (details.type === 'stay') {
    payload.stays = [
      {
        hotelId: details.id,
        roomId: details.roomId,
        provider: details.provider,
        quoteId: details.quoteId,
        checkIn: details.checkIn,
        checkOut: details.checkOut,
        occupancy: {
          rooms: details.rooms || 1,
          adults: details.adults || 2,
          children: details.children || 0,
        },
      },
    ]
  } else if (details.type === 'transfer') {
    payload.transfers = [
      {
        offerId: details.id,
        provider: details.provider,
        name: details.name,
        // NET price — the backend adds the platform commission.
        price: details.price,
        priceWithCommission: details.priceWithCommission,
        currency: details.currency,
      },
    ]
    if (details.returnId) {
      payload.transfers.push({
        offerId: details.returnId,
        provider: details.returnProvider || details.provider,
        name: details.returnName,
        price: details.returnPrice,
        priceWithCommission: details.returnPriceWithCommission,
        currency: details.currency,
      })
    }
  } else if (details.type === 'car') {
    payload.cars = [
      {
        carId: details.carId,
        pickUpDate: details.pickUpDate,
        dropOffDate: details.dropOffDate,
        pickUpLocation: details.pickUpLocation,
        dropOffLocation: details.dropOffLocation,
      },
    ]
  } else if (details.type === 'activity') {
    payload.experiences = [
      {
        experienceId: details.experienceId,
        provider: details.provider,
        name: details.name,
        // NET price — the backend adds the platform commission.
        price: details.price,
        priceWithCommission: details.priceWithCommission,
        currency: details.currency,
        date: details.date,
      },
    ]
  } else if (details.type === 'package') {
    payload.packageId = details.id
    const pkgDetails = priceDetailed.value
    if (pkgDetails?.flightDetails) {
      payload.flights = [
        {
          flightId: pkgDetails.flightDetails.id,
          class: (pkgDetails.flightDetails.cabinClass || 'economy').toLowerCase(),
          offerId: pkgDetails.flightDetails.id,
          provider: 'duffel',
          passengerIds: [],
        },
      ]
    }
    if (pkgDetails?.stayDetails) {
      payload.stays = [
        {
          hotelId: pkgDetails.stayDetails.id || pkgDetails.stayDetails.hotelId,
          roomId: pkgDetails.stayDetails.roomId || pkgDetails.stayDetails.rateId,
          provider: pkgDetails.stayDetails.provider,
          quoteId: pkgDetails.stayDetails.quoteId,
          checkIn: pkgDetails.stayDetails.checkIn || details.checkIn,
          checkOut: pkgDetails.stayDetails.checkOut || details.checkOut,
          occupancy: {
            rooms: 1,
            adults: details.adults,
            children: details.children,
          },
        },
      ]
    }
  }

  return payload
}

/**
 * Confirms the reservation with third-party suppliers when the booking was not
 * fulfilled against our own inventory.
 */
const syncSupplierBooking = async () => {
  const details = bookingDetails.value
  if (details.type !== 'transfer') return

  const contact = travellerData.value.contact || {}
  const lead = (travellerData.value.travelers || [])[0] || {}
  const passengerDetails = {
    firstName: lead.firstName || 'Guest',
    lastName: lead.lastName || 'Traveller',
    email: contact.email || 'guest@flybeth.com',
    phone: contact.phone || '+10000000000',
    remarks: 'Booked via Flybeth',
  }

  const offers = [
    { id: details.id, provider: details.provider },
    ...(details.returnId
      ? [{ id: details.returnId, provider: details.returnProvider || details.provider }]
      : []),
  ].filter((o) => o.id && o.provider && o.provider !== 'flybeth-transfers')

  for (const offer of offers) {
    try {
      await transfersApi.book({
        offerId: offer.id,
        provider: offer.provider,
        passengerDetails,
      })
    } catch (e) {
      console.error('Failed to book transfer with provider', e)
      showToast({
        title: 'Warning',
        message: 'Transfer booking recorded but provider sync failed.',
        toastType: 'warning',
      })
    }
  }
}

const handleWalletAuthorize = async (paymentInfo: any) => {
  if (paymentInfo.channel === 'applepay' || paymentInfo.channel === 'googlepay') {
    // 1. We create the booking silently
    paymentProcessing.value = true
    showBrandedLoader.value = true
    loaderStatus.value = 'Preparing secure wallet...'

    try {
      const payload = buildBookingPayload({
        provider: 'paypal',
        paymentModel: 'pay_now',
        channel: paymentInfo.channel,
      })

      const { data: rawData } = await bookingsApi.create(payload)
      const booking = rawData?.data || rawData;

      if (booking && booking.pnr) {
        // Save these for the capture step
        sessionStorage.setItem('walletBookingId', booking._id)
        sessionStorage.setItem('walletBookingPnr', booking.pnr)

        const initResponse = await paymentsApi.initialize({
          bookingId: booking._id,
          provider: 'paypal',
          callbackUrl: `${window.location.origin}/confirmation?pnr=${booking.pnr}&orderId=${booking._id}&status=success&provider=paypal`,
        });

        const responseData = initResponse.data?.data || initResponse.data;
        if (responseData && responseData.orderId) {
          // Resolve the orderId back to PayPal SDK
          paymentInfo.resolveOrder(responseData.orderId)
          showBrandedLoader.value = false;
        } else {
          throw new Error('No order ID returned from payment init')
        }
      }
    } catch (err: any) {
      if (paymentInfo.rejectOrder) {
        paymentInfo.rejectOrder(err)
      }
      const errMsg = err.response?.data?.message || err.message || "Failed to complete booking";
      if (errMsg.toLowerCase().includes('no longer available') || errMsg.toLowerCase().includes('booking failed')) {
        bookingErrorTitle.value = "Offer Unavailable";
        bookingErrorMsg.value = "The requested offer is no longer available. Prices and availability can change quickly.";
        isBookingExpired.value = true;
      } else {
        showToast({ title: "Booking Error", message: errMsg, toastType: "error" })
      }
    } finally {
      paymentProcessing.value = false
      showBrandedLoader.value = false
    }

  } else if (paymentInfo.channel.endsWith('_approve')) {
    // 2. Capture the authorized order
    paymentProcessing.value = true
    showBrandedLoader.value = true
    loaderStatus.value = 'Capturing payment...'

    try {
      const orderId = paymentInfo.data.orderID
      const bookingId = sessionStorage.getItem('walletBookingId')
      const pnr = sessionStorage.getItem('walletBookingPnr')

      if (!bookingId) throw new Error('Booking ID lost in session')

      await paymentsApi.verifyPayment({
        bookingId: bookingId,
        provider: 'paypal',
        checkoutToken: orderId
      })

      clearCheckoutState()
      router.push(`/confirmation?pnr=${pnr}&status=success`)

    } catch (err: any) {
      showToast({ title: "Capture Failed", message: err.message || "Failed to capture payment", toastType: "error" })
    } finally {
      paymentProcessing.value = false
      showBrandedLoader.value = false
    }
  }
}

const handlePayment = async (paymentInfo: any) => {
  paymentProcessing.value = true
  showBrandedLoader.value = true
  loaderStatus.value = paymentInfo.paymentModel === 'on_hold' ? 'Securing reservation...' : 'Finalizing booking...'
  
  try {
    const payload = buildBookingPayload(paymentInfo)

    const { data: rawData } = await bookingsApi.create(payload)
    const booking = rawData?.data || rawData;

    // Third-party suppliers that are not fulfilled by our own inventory are
    // confirmed separately (platform inventory is fulfilled by POST /bookings).
    await syncSupplierBooking()

    if (booking && booking.pnr) {
      // Handle BNPL or any payment that requires redirection
      if (
        [
          "credpal",
          "affirm",
          "klarna",
          "paypal_four",
          "afterpay",
          "paypal",
          "paystack",
          "stripe",
          "cashapp"
        ].includes(paymentInfo.provider)
      ) {
        loaderStatus.value = "Redirecting to payment gateway...";
        try {
          const initResponse = await paymentsApi.initialize({
            bookingId: booking._id,
            provider: paymentInfo.provider,
            callbackUrl: `${window.location.origin}/confirmation?pnr=${booking.pnr}&orderId=${booking._id}&status=success&provider=${paymentInfo.provider}`,
          });
          
          const responseData = initResponse.data?.data || initResponse.data;
          
          if (responseData && responseData.url) {
            clearCheckoutState(); // Only clear state when initialization succeeds
            if (paymentInfo.provider === 'cashapp') {
              showBrandedLoader.value = false;
              cashAppOrderId.value = booking._id;
              cashAppPnr.value = booking.pnr;
              cashAppAmount.value = booking.pricing.totalAmount;
              cashAppCurrency.value = booking.pricing.currency || 'USD';
              showCashAppWidget.value = true;
              
              await loadCashAppSdk();
              return;
            } else if (responseData.url === 'afterpay_sdk' && responseData.reference) {
              showBrandedLoader.value = false;
              afterpayOrderId.value = booking._id;
              afterpayPnr.value = booking.pnr;
              await loadAfterpaySdk(responseData.reference);
              return;
            } else if (responseData.url === 'klarna_sdk' && responseData.reference) {
              // Handle Klarna SDK flow
              showBrandedLoader.value = false;
              klarnaClientToken.value = responseData.reference;
              klarnaOrderId.value = booking._id;
              klarnaPnr.value = booking.pnr;
              showKlarnaWidget.value = true;
              
              await loadKlarnaSdk(klarnaClientToken.value);
              return;
            } else {
              // Standard redirect flow
              window.location.href = responseData.url;
              return;
            }
          }
        } catch (initErr: any) {
          console.error("Payment initialization failed:", initErr);
          showToast({
            title: "Payment Error",
            message: initErr.response?.data?.message || "Failed to initialize payment gateway. Please try again.",
            toastType: "error",
          });
          // DO NOT redirect to confirmation page on payment init failure
          // User stays on checkout page with cart intact to try again
          return;
        }
      }

      // For payments that don't require redirection
      clearCheckoutState();
      const finalStatus = (booking.payment?.status === 'success' || booking.status === 'ticketed') ? 'success' : 'booked';
      router.push(`/confirmation?pnr=${booking.pnr}&status=${finalStatus}`);
    } else {
      throw new Error('Booking response was invalid')
    }
  } catch (err: any) {
    console.error('Payment/Booking error:', err)
    
    // Aggressive session recovery: automatically show auth modal if unauthorized
    if (err.response?.status === 401) {
      showToast({ 
        title: "Session Expired", 
        message: "Please sign in again to complete your booking.", 
        toastType: "info" 
      })
      openAuthModal()
      return
    }

    const errorMessage = err.response?.data?.message || err.message || "Failed to process booking";
    const lowerMsg = errorMessage.toLowerCase();
    
    // Trigger the existing BookingExpiredModal if the offer expired, was already booked, or is no longer available
    if (lowerMsg.includes('expired') || lowerMsg.includes('already been booked') || lowerMsg.includes('no longer available') || lowerMsg.includes('booking failed')) {
      bookingErrorTitle.value = lowerMsg.includes('no longer available') || lowerMsg.includes('booking failed') ? "Offer Unavailable" : "Booking Expired";
      bookingErrorMsg.value = lowerMsg.includes('no longer available') || lowerMsg.includes('booking failed')
        ? "The requested offer is no longer available. Prices and availability can change quickly."
        : "This booking has expired. Please start a new search to continue.";
      isBookingExpired.value = true;
      return;
    }

    showToast({ 
      title: "Booking Error", 
      message: errorMessage, 
      toastType: "error" 
    })
  } finally {
    paymentProcessing.value = false
    showBrandedLoader.value = false
  }
}

const handleCurrencySelect = async (newCurrency: string) => {
  if (!priceDetailed.value || priceDetailed.value.currency === newCurrency) return
  
  const currentAmount = priceDetailed.value.priceWithCommission || priceDetailed.value.price || 0
  const currentCurrency = priceDetailed.value.currency || 'USD'
  
  isConversionLoading.value = true
  try {
    const { data } = await paymentsApi.convertCurrency(
      currentAmount,
      currentCurrency,
      newCurrency
    )
    
    if (data && data.success) {
      // Re-normalize pricing fields with new converted value
      const convertedVal = data.data.convertedAmount || data.data.amount
      const conversionFactor = convertedVal / currentAmount
      
      priceDetailed.value.currency = newCurrency
      priceDetailed.value.price = (priceDetailed.value.price || 0) * conversionFactor
      priceDetailed.value.priceWithCommission = convertedVal
      if (priceDetailed.value.tax) {
        priceDetailed.value.tax = priceDetailed.value.tax * conversionFactor
      }
      
      showToast({ title: "Currency Updated", message: `Pricing switched to ${newCurrency} successfully.`, toastType: "success" })
    }
  } catch (err: any) {
    console.error('Currency conversion failed:', err)
    showToast({ 
      title: "Conversion Error", 
      message: "We couldn't update the pricing to your selected currency at this time.", 
      toastType: "error" 
    })
  } finally {
    isConversionLoading.value = false
  }
}

onMounted(async () => {
  trackAction('booking_step_review', { type: bookingDetails.value.type, item: bookingDetails.value.name })
  if (bookingDetails.value.type === 'flight') {
    const saved = sessionStorage.getItem('selectedFlight')
    if (saved) {
      selectedFlight.value = JSON.parse(saved)
      try {
        const pricedData = await priceFlightOffer(selectedFlight.value, bookingDetails.value.provider)
        priceDetailed.value = { ...normalizeFlightData(pricedData?.flightOffers?.[0] || selectedFlight.value), provider: bookingDetails.value.provider }
      } catch (err: any) { 
        console.error('Pricing failed:', err)
        if (err.response?.status === 404) {
          isBookingExpired.value = true
        } else {
          showToast({ 
            title: "Pricing Error", 
            message: "We couldn't confirm the latest price. Please try again.", 
            toastType: "error" 
          })
        }
        priceDetailed.value = { ...selectedFlight.value, provider: bookingDetails.value.provider } 
      }
    }
  } else if (bookingDetails.value.type === 'stay') {
    // Populate priceDetailed from URL query parameters so the Stay Summary renders
    priceDetailed.value = {
      ...bookingDetails.value,
      hotelName: bookingDetails.value.name,
      checkInDate: bookingDetails.value.checkIn,
      checkOutDate: bookingDetails.value.checkOut,
      priceWithCommission: bookingDetails.value.price,
      price: bookingDetails.value.price
    }

    // Attempt to merge more detailed data if available in session storage (e.g. from bundle flow)
    const pendingStayStr = sessionStorage.getItem('pendingStayBooking')
    if (pendingStayStr) {
      try {
        const pendingStay = JSON.parse(pendingStayStr)
        if (pendingStay.id === bookingDetails.value.id) {
          priceDetailed.value = { ...priceDetailed.value, ...pendingStay }
          if (pendingStay.stay?.name) {
             priceDetailed.value.hotelName = pendingStay.stay.name
          }
        }
      } catch (e) {
        console.error('Failed to parse pendingStayBooking', e)
      }
    }
  } else if (bookingDetails.value.type === 'transfer') {
    const totalTransferNet = bookingDetails.value.price + (bookingDetails.value.returnPrice || 0)
    const totalTransferGross =
      bookingDetails.value.priceWithCommission +
      (bookingDetails.value.returnPriceWithCommission || 0)
    priceDetailed.value = {
      ...bookingDetails.value,
      name: bookingDetails.value.name + (bookingDetails.value.returnName ? ` + ${bookingDetails.value.returnName}` : ''),
      provider: bookingDetails.value.provider,
      price: totalTransferNet,
      priceWithCommission: totalTransferGross,
      currency: bookingDetails.value.currency
    }
  } else if (bookingDetails.value.type === 'package') {
    const saved = sessionStorage.getItem('selectedPackage')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        priceDetailed.value = {
          ...parsed,
          priceWithCommission: parsed.totalPrice || parsed.basePrice || 0,
          price: parsed.totalPrice || parsed.basePrice || 0,
          currency: 'USD'
        }
      } catch (e) {
        console.error('Failed to parse selectedPackage', e)
      }
    } else if (bookingDetails.value.price) {
      // Fall back to the stored payload so the summary still renders.
      priceDetailed.value = {
        ...bookingDetails.value,
        priceWithCommission: bookingDetails.value.price,
        price: bookingDetails.value.price,
      }
    }
  } else if (bookingDetails.value.type === 'activity') {
    const saved = sessionStorage.getItem('selectedActivity')
    let parsed: any = null
    if (saved) {
      try {
        parsed = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse selectedActivity', e)
      }
    }
    priceDetailed.value = {
      ...(parsed || {}),
      ...bookingDetails.value,
      name: parsed?.name || bookingDetails.value.name,
      provider: parsed?.provider || bookingDetails.value.provider,
      price: bookingDetails.value.price || parsed?.price || 0,
      priceWithCommission:
        bookingDetails.value.priceWithCommission ||
        parsed?.priceWithCommission ||
        bookingDetails.value.price ||
        parsed?.price ||
        0,
      currency: bookingDetails.value.currency || parsed?.currency || 'USD',
    }
  } else if (bookingDetails.value.type === 'car') {
    const saved = sessionStorage.getItem('selectedCar')
    let parsed: any = null
    if (saved) {
      try {
        parsed = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse selectedCar', e)
      }
    }
    // Customer-facing total for the whole rental period.
    const carPrice =
      bookingDetails.value.priceWithCommission ||
      bookingDetails.value.price ||
      (typeof parsed?.priceWithCommission === 'number' ? parsed.priceWithCommission : 0) ||
      (typeof parsed?.price === 'number' ? parsed.price : 0) ||
      parsed?.pricing?.total ||
      0
    priceDetailed.value = {
      ...(parsed || {}),
      ...bookingDetails.value,
      name: parsed?.name || bookingDetails.value.name,
      provider: parsed?.provider || bookingDetails.value.provider || 'flybeth',
      priceWithCommission: carPrice,
      price: carPrice,
      currency: parsed?.pricing?.currency || bookingDetails.value.currency || 'USD',
    }
  }
  loadCheckoutState()
  loadBundledStay()
  ensureTravelers()
  showBrandedLoader.value = false
})

watch([currentStep, travellerData, selectedSeats, selectedAddOns], () => { saveCheckoutState() }, { deep: true })
</script>

<style scoped>
.ck-wrap {
  width: 100%;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

@media (max-width: 640px) {
  .ck-wrap {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}


/* ADD these to <style scoped> */
.ck-main {
  width: 100%;
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

/* Ensure the inner flex row is fully constrained */
.ck-content-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  width: 100%;
}

@media (min-width: 1024px) {
  .ck-content-row {
    flex-direction: row;
  }
}

.ck-main-col {
  flex: 1 1 0%;
  min-width: 0;          /* ← THE critical fix: prevents flex child overflow */
  width: 100%;
}

.ck-sidebar-col {
  width: 100%;
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .ck-sidebar-col {
    width: 340px;        /* ← slightly narrower so main content breathes */
  }
}
</style>
