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

  <BookingExpiredModal :visible="isBookingExpired" />

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
                  {{ priceDetailed.originName || priceDetailed.origin }} <span class="text-gray-400 font-normal">→</span> {{ priceDetailed.destinationName || priceDetailed.destination }}
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
      <div class="w-full max-w-3xl mx-auto space-y-8 pb-32 pt-8">
        <!-- Step 0: Details (Flight Details + Contact Details + Passenger Details) -->
        <div v-if="currentStep === 0" class="space-y-6 animate-in">
          
          <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-4 md:p-6">
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
            <h2 class="text-[28px] font-bold text-[#111827]">Customise your booking</h2>
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
            <h2 class="text-[28px] font-bold text-[#111827]">Protect your booking</h2>
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
            :flightOffer="priceDetailed"
            :travellerData="travellerData"
            :selectedSeats="selectedSeats"
            :seatPrice="seatPrice"
            :selectedAddOns="selectedAddOns"
            :currencySymbol="currencySymbol"
            @edit="goToStep"
          />

          <div class="flex flex-col lg:flex-row gap-6 mt-6">
            <!-- Payment Section -->
            <div class="flex-1 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
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

            <!-- Price Breakdown -->
            <div class="w-full lg:w-[360px] flex-shrink-0">
              <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Price breakdown</h3>
                
                <div class="space-y-3 mb-6 text-sm text-gray-600">
                  <div class="flex justify-between items-center">
                    <span>Flight Fare</span>
                    <span class="font-medium text-gray-900">{{ currencySymbol }}{{ displayPrices.base.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>Taxes & Fees</span>
                    <span class="font-medium text-gray-900">{{ currencySymbol }}{{ displayPrices.tax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                  </div>
                  
                  <div v-if="seatPrice > 0" class="flex justify-between items-center text-blue-600">
                    <span>Seat Selection</span>
                    <span class="font-medium">+{{ currencySymbol }}{{ (seatPrice * (currentCurrency.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                  </div>

                  <template v-if="selectedAddOns.length > 0">
                    <div v-for="addon in selectedAddOns.filter(a => a.id !== 'seat-selection')" :key="addon.id" class="flex justify-between items-center text-blue-600">
                      <span>{{ addon.name }}</span>
                      <span class="font-medium">+{{ currencySymbol }}{{ (addon.price * (currentCurrency.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>
                  </template>
                </div>

                <div class="pt-4 border-t border-gray-200">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-base font-bold text-gray-900">Total</span>
                    <span class="text-2xl font-black text-gray-900">{{ currencySymbol }}{{ displayPrices.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                  </div>
                  <p class="text-xs text-gray-500 mb-6">Includes taxes and charges</p>

                  <button @click="handlePayNow" :disabled="paymentProcessing" class="w-full h-14 bg-[#0D1DAD] hover:bg-[#0A1485] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    <template v-if="!paymentProcessing">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                      Pay Securely
                    </template>
                    <span v-else class="animate-pulse">Processing...</span>
                  </button>

                  <div class="flex items-center justify-center gap-1.5 mt-4 text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span class="text-[10px] font-semibold uppercase ">AES-256 Encrypted</span>
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
import ManualPaymentDetailsModal from '~/components/checkout/ManualPaymentDetailsModal.vue'
import CheckoutSidebar from '~/components/checkout/CheckoutSidebar.vue'
import SeatSelection from '~/components/checkout/SeatSelection.vue'
import CheckoutStayDetails from '~/components/checkout/CheckoutStayDetails.vue'
import BookingExpiredModal from '~/components/checkout/BookingExpiredModal.vue'
import { flightsApi } from '~/api_factory/modules/flights'
import { transfersApi } from '~/api_factory/modules/transfers'
import { bookingsApi } from '~/api_factory/modules/bookings'
import { useDuffelIdentity } from '~/composables/modules/integrations/useDuffelIdentity'
import { useTracking } from '~/composables/core/useTracking'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useUser } from '~/composables/modules/auth/user'
import { useCustomToast } from '~/composables/core/useCustomToast'
import { useSettings } from '~/composables/useSettings'

const { token, isLoggedIn, openAuthModal } = useAuth()
const { showToast } = useCustomToast()
const { ensureDuffelIdentity } = useDuffelIdentity()
const { currentCurrency } = useSettings()

definePageMeta({
  layout: 'checkout'
})
const { trackAction } = useTracking()
const route = useRoute()
const router = useRouter()

// State
const currentStep = ref(0)
const showBrandedLoader = ref(false)
const isBookingExpired = ref(false)
const loaderStatus = ref('Confirming best fare with airline...')
const paymentProcessing = ref(false)
const selectedAddOns = ref<{ id: string; name: string; price: number }[]>([])
const selectedSeats = ref<any[]>([])
const seatPrice = ref(0)

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

// Booking details from query
const bookingDetails = computed(() => ({
  type: route.query.type as string,
  id: route.query.id as string,
  roomId: route.query.roomId as string,
  name: (route.query.hotelName as string) || (route.query.name as string) || 'Selected trip',
  provider: route.query.provider as string,
  price: route.query.price ? Number(route.query.price) : 0,
  currency: (route.query.currency as string) || 'USD',
  quoteId: route.query.quoteId as string,
  checkIn: route.query.checkIn as string,
  checkOut: route.query.checkOut as string,
  adults: route.query.adults ? Number(route.query.adults) : 2,
  children: route.query.children ? Number(route.query.children) : 0,
  rooms: route.query.rooms ? Number(route.query.rooms) : 1,
}))

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
    total = priceDetailed.value.priceWithCommission || priceDetailed.value.price || 0
    base = priceDetailed.value.price || 0
    
    // Split the flight/stay total into components that always sum to 'total'
    tax = priceDetailed.value.tax || (total * 0.08) 
    serviceCharge = total - base - tax
    if (serviceCharge < 0) {
        serviceCharge = 0
        tax = total - base
    }
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
    total: finalTotal * rate
  }
})

// Currency & Manual Payment State
const isCurrencyModalVisible = ref(false)
const isConversionLoading = ref(false)
const isManualDetailsVisible = ref(false)
const bankAccounts = ref([])
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
    const slice = rawFlight.slices[0]
    const segments = slice.segments || []
    const firstSegment = segments[0]
    const lastSegment = segments[segments.length - 1]
    const basePrice = Number(rawFlight.base_amount || 0)
    const totalPrice = Number(rawFlight.total_amount || 0)
    const taxPrice = Number(rawFlight.tax_amount || 0)

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
      duration: totalDuration,
      price: basePrice,
      tax: taxPrice,
      priceWithCommission: totalPrice,
      currency: rawFlight.total_currency || 'USD',
      stops: segments.length - 1,
      segments: normalizedSegments,
      cabinClass: (slice.fare_brand_name || segments[0]?.passengers?.[0]?.cabin_class || 'Economy').toLowerCase(),
      airline: rawFlight.owner?.name || firstSegment?.marketing_carrier?.name || 'Airline',
      airlineLogo: rawFlight.owner?.logo_symbol_url || firstSegment?.marketing_carrier?.logo_symbol_url,
      totalEmissionsKg: rawFlight.total_emissions_kg,
      conditions: { refundable: canRefund, changeable: canChange },
      rawOffer: rawFlight,
    }
  }

  if (rawFlight.itineraries && rawFlight.itineraries.length > 0) {
    const itinerary = rawFlight.itineraries[0]
    const segments = itinerary.segments || []
    const firstSegment = segments[0]
    const lastSegment = segments[segments.length - 1]
    const basePrice = Number(rawFlight.price?.base || rawFlight.price?.total || 0)
    const totalPrice = Number(rawFlight.price?.total || rawFlight.price?.grandTotal || 0)
    const cabin = (rawFlight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY').toLowerCase()

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
      ...rawFlight,
      origin: firstSegment?.departure?.iataCode || 'N/A',
      destination: lastSegment?.arrival?.iataCode || 'N/A',
      departureTime: firstSegment?.departure?.at,
      arrivalTime: lastSegment?.arrival?.at,
      duration: totalDuration,
      price: basePrice,
      priceWithCommission: totalPrice,
      currency: rawFlight.price?.currency || 'USD',
      stops: segments.length - 1,
      segments: normalizedSegments,
      cabinClass: cabin,
      airline: rawFlight.validatingAirlineCodes?.[0] || firstSegment?.carrierCode || 'Airline',
      airlineLogo: `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${rawFlight.validatingAirlineCodes?.[0] || firstSegment?.carrierCode}.svg`,
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

const handleWalletAuthorize = async (paymentInfo: any) => {
  if (paymentInfo.channel === 'applepay' || paymentInfo.channel === 'googlepay') {
    // 1. We create the booking silently
    paymentProcessing.value = true
    showBrandedLoader.value = true
    loaderStatus.value = 'Preparing secure wallet...'

    try {
      const payload: any = {
        contactDetails: {
          email: travellerData.value.contact.email,
          phone: travellerData.value.contact.phone,
          name: `${travellerData.value.travelers[0].firstName} ${travellerData.value.travelers[0].lastName}`,
          state: travellerData.value.travelers[0].nationality
        },
        currency: currentCurrency.value.code,
        paymentModel: 'pay_now',
        paymentProvider: 'paypal',
        paymentMetadata: { provider: 'paypal', channel: paymentInfo.channel },
        passengerDetails: travellerData.value.travelers.map(t => ({
          ...t,
          email: travellerData.value.contact.email || '',
          phone: travellerData.value.contact.phone || '',
          gender: (t.gender || 'male').toLowerCase(),
          title: (t.title || 'mr').toLowerCase(),
          type: 'adult'
        })),
        pricing: {
          baseFare: displayPrices.value.base,
          taxes: displayPrices.value.tax,
          fees: displayPrices.value.total - displayPrices.value.base - displayPrices.value.tax
        },
        hasInsurance: selectedAddOns.value.some(a => a.id === 'insurance'),
        hasVipSupport: selectedAddOns.value.some(a => a.id === 'vip-support'),
        extraBaggageCount: selectedAddOns.value.filter(a => a.id.startsWith('bag-')).length,
        premiumSeatCount: selectedSeats.value.length
      }

      if (bookingDetails.value.type === 'flight') {
        payload.flights = [{
          flightId: bookingDetails.value.id,
          class: (priceDetailed.value?.cabinClass || 'economy').toLowerCase(),
          offerId: priceDetailed.value?.offerId || bookingDetails.value.quoteId || priceDetailed.value?.id || bookingDetails.value.id,
          provider: bookingDetails.value.provider,
          passengerIds: []
        }]
      } else if (bookingDetails.value.type === 'stay') {
        payload.stays = [{
          hotelId: bookingDetails.value.id,
          roomId: bookingDetails.value.roomId,
          checkIn: bookingDetails.value.checkIn,
          checkOut: bookingDetails.value.checkOut,
          occupancy: {
            rooms: bookingDetails.value.rooms,
            adults: bookingDetails.value.adults,
            children: bookingDetails.value.children
          }
        }]
      }

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
      showToast({ title: "Wallet Error", message: err.message || "Failed to initialize wallet", toastType: "error" })
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
    const payload: any = {
      contactDetails: {
        email: travellerData.value.contact.email,
        phone: travellerData.value.contact.phone,
        name: `${travellerData.value.travelers[0].firstName} ${travellerData.value.travelers[0].lastName}`,
        state: travellerData.value.travelers[0].nationality
      },
      currency: currentCurrency.value.code,
      paymentModel: paymentInfo.paymentModel || 'pay_now',
      paymentProvider: paymentInfo.provider,
      paymentMetadata: paymentInfo,
      passengerDetails: travellerData.value.travelers.map(t => ({
        ...t,
        email: travellerData.value.contact.email || '',
        phone: travellerData.value.contact.phone || '',
        gender: (t.gender || 'male').toLowerCase(),
        title: (t.title || 'mr').toLowerCase(),
        type: 'adult'
      })),
      pricing: {
        baseFare: displayPrices.value.base,
        taxes: displayPrices.value.tax,
        fees: displayPrices.value.total - displayPrices.value.base - displayPrices.value.tax
      },
      hasInsurance: selectedAddOns.value.some(a => a.id === 'insurance'),
      hasVipSupport: selectedAddOns.value.some(a => a.id === 'vip-support'),
      extraBaggageCount: selectedAddOns.value.filter(a => a.id.startsWith('bag-')).length,
      premiumSeatCount: selectedSeats.value.length,
      tenantId: bookingDetails.value.provider === 'duffel' ? undefined : undefined // Add if needed
    }

    if (bookingDetails.value.type === 'flight') {
      payload.flights = [{
        flightId: bookingDetails.value.id,
        class: (priceDetailed.value?.cabinClass || 'economy').toLowerCase(),
        offerId: priceDetailed.value?.offerId || bookingDetails.value.quoteId || priceDetailed.value?.id || bookingDetails.value.id,
        provider: bookingDetails.value.provider,
        passengerIds: []
      }]
    } else if (bookingDetails.value.type === 'stay') {
      payload.stays = [{
        hotelId: bookingDetails.value.id,
        roomId: bookingDetails.value.roomId,
        checkIn: bookingDetails.value.checkIn,
        checkOut: bookingDetails.value.checkOut,
        occupancy: {
          rooms: bookingDetails.value.rooms,
          adults: bookingDetails.value.adults,
          children: bookingDetails.value.children
        }
      }]
    }

    const { data: rawData } = await bookingsApi.create(payload)
    const booking = rawData?.data || rawData;
    
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
          "paystack"
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
            if (responseData.url === 'klarna_sdk' && responseData.reference) {
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
      router.push(`/confirmation?pnr=${booking.pnr}`)
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

    showToast({ 
      title: "Booking Error", 
      message: err.response?.data?.message || err.message || "Failed to process booking", 
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
  }
  loadCheckoutState()
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
    padding-left: 1rem;
    padding-right: 1rem;
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
