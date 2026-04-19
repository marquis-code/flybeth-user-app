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


  <div v-if="!showBrandedLoader" class="ck-root min-h-screen bg-gray-50/30">
    
    <!-- Premium Header -->
    <header class="bg-neutral-900 border-b border-white/5 py-8 relative overflow-hidden">
      <!-- Orbs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full"></div>
        <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-sky-500/5 blur-[60px] rounded-full"></div>
      </div>

      <div class="ck-wrap relative z-10 flex items-center justify-between">
        <button @click="handleGoBack" class="flex items-center gap-2 group text-white/40 hover:text-white transition-all text-sm font-bold">
          <div class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ChevronLeft class="h-4 w-4" />
          </div>
          <span>Back</span>
        </button>

        <div class="flex flex-col items-center">
          <span class="text-2xl font-black text-white tracking-widest">Flybeth</span>
          <div class="flex items-center gap-1.5 mt-1">
            <Lock class="h-3 w-3 text-primary" />
            <span class="text-[9px] font-black tracking-[0.2em] text-white/30">AES-256 Encrypted</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div v-if="currentStep < 3" class="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span class="text-[10px] font-black text-white/50 tracking-widest whitespace-nowrap">Held for 14:59</span>
          </div>
          <div class="hidden md:flex flex-col items-end">
             <span class="text-[10px] font-black text-white/20 tracking-widest">Support</span>
             <span class="text-sm font-bold text-white/50">+1 800 FLYBETH</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Refined Stepper -->
    <div class="bg-white border-b border-gray-100 py-6">
       <div class="ck-wrap">
          <CheckoutStepper :currentStep="currentStep" />
       </div>
    </div>

    <main class="ck-main py-12 md:py-20">
      <div class="ck-wrap">
        <div class="flex flex-col lg:flex-row gap-12 items-start">
          
          <div class="flex-grow w-full space-y-8">
            <!-- Step 0: Review -->
            <div v-if="currentStep === 0" class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in">
              <div class="p-3 md:p-12 border-b border-gray-50 bg-gray-50/30">
                 <h2 class="text-2xl font-black text-gray-900 tracking-tight">Review selection</h2>
                 <p class="text-gray-400 font-medium text-sm mt-1">Confirm your trip specifics before adding traveler data.</p>
              </div>
              <div class="p-3 md:p-12">
                <CheckoutFlightDetails
                  v-if="bookingDetails.type === 'flight'"
                  :flightOffer="priceDetailed"
                  @continue="goToStep(1)"
                />
                <CheckoutTransferDetails
                  v-if="bookingDetails.type === 'transfer'"
                  :name="bookingDetails.name"
                  :provider="bookingDetails.provider"
                  @continue="goToStep(1)"
                />
                <CheckoutStayDetails
                  v-if="bookingDetails.type === 'stay'"
                  :stay="priceDetailed"
                  :currency-symbol="currencySymbol"
                  @continue="goToStep(1)"
                />
              </div>
            </div>

            <!-- Step 1: Traveler -->
            <div v-if="currentStep === 1" class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in">
              <CheckoutTravellerForm 
                v-model="travellerData" 
                @continue="handleTravellerContinue" 
                @email-blur="handleEmailBlur"
              />
            </div>

            <!-- Step 2: Extras -->
            <div v-if="currentStep === 2" class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in">
              <CheckoutTripCustomization
                :flightOffer="bookingDetails.type === 'flight' ? priceDetailed : null"
                :stay="bookingDetails.type === 'stay' ? priceDetailed : null"
                :traveller="travellerData"
                :totalPrice="displayPrices.total"
                v-model:selectedAddOns="selectedAddOns"
                @continue="goToStep(3)"
              />
            </div>

            <!-- Step 3: Payment -->
            <div v-if="currentStep === 3" class="animate-in space-y-8">
              <div class="flex gap-6 p-6 bg-sky-50 border border-sky-100 rounded-[2rem] items-start">
                  <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-500 shadow-sm flex-shrink-0">
                    <ShieldCheck class="h-7 w-7" />
                  </div>
                  <div class="space-y-1 py-1">
                     <p class="text-xl font-black text-sky-900">Document Verification</p>
                     <p class="text-sky-700/60 font-medium text-sm leading-relaxed">Ensure names match passports exactly. Flybeth is not responsible for corrections after airline issuance.</p>
                  </div>
              </div>

              <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-4 md:p-12">
                <CheckoutPayment 
                  :total-amount="priceDetailed?.priceWithCommission" 
                  :currency-symbol="currencySymbol"
                  :currency="priceDetailed?.currency"
                  :processing="paymentProcessing"
                  @complete-payment="handlePayment"
                  @change-currency="handleCurrencySelect"
                />
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="w-full lg:w-[400px] flex-shrink-0">
            <div class="sticky top-12">
              <CheckoutSidebar
                :flight="bookingDetails.type === 'flight' ? priceDetailed : null"
                :stay="bookingDetails.type === 'stay' ? priceDetailed : null"
                :passengerCount="1"
                :baseFare="displayPrices.base"
                :taxes="displayPrices.tax"
                :discount="0"
                :serviceCharge="displayPrices.serviceCharge"
                :addOns="selectedAddOns"
                :currency="currencySymbol"
                :showPayButton="currentStep === 3"
                :bundledStay="bundledStay"
                @pay-now="handlePayNow"
                @hold-now="handleHold"
                @apply-promo="handleApplyPromo"
              />
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- Footer removed as per request -->
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, Lock, ShieldCheck } from 'lucide-vue-next'
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
import CheckoutPayment from '~/components/checkout/CheckoutPayment.vue'
import CurrencySelectorModal from '~/components/checkout/CurrencySelectorModal.vue'
import CurrencyConversionLoader from '~/components/checkout/CurrencyConversionLoader.vue'
import ManualPaymentDetailsModal from '~/components/checkout/ManualPaymentDetailsModal.vue'
import CheckoutSidebar from '~/components/checkout/CheckoutSidebar.vue'
import CheckoutStayDetails from '~/components/checkout/CheckoutStayDetails.vue'
import { flightsApi } from '~/api_factory/modules/flights'
import { transfersApi } from '~/api_factory/modules/transfers'
import { bookingsApi } from '~/api_factory/modules/bookings'

import { useDuffelIdentity } from '~/composables/modules/integrations/useDuffelIdentity'
import { useTracking } from '~/composables/core/useTracking'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useCustomToast } from '~/composables/core/useCustomToast'

const { token, isLoggedIn, openAuthModal } = useAuth()
const { showToast } = useCustomToast()
const { ensureDuffelIdentity } = useDuffelIdentity()

definePageMeta({
  layout: 'no-footer'
})
const { trackAction } = useTracking()
const route = useRoute()
const router = useRouter()

// State
const currentStep = ref(0)
const showBrandedLoader = ref(true)
const loaderStatus = ref('Confirming best fare with airline...')
const paymentProcessing = ref(false)
const selectedAddOns = ref<{ id: string; name: string; price: number }[]>([])

const { loading: pricingLoading, pricingDetails, priceFlightOffer } = useFlightCheckout()
const selectedFlight = ref<any>(null)
const priceDetailed = ref<any>(null)
const bundledStay = ref<any>(null)

const travellerData = ref({
  title: 'mr',
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phone: '',
  phoneCountryCode: '+234',
  gender: 'male',
  dateOfBirth: '',
  nationality: 'NG',
  passportNumber: '',
  passportExpiry: '',
  passportCountry: '',
})

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

// Price display
const displayPrices = computed(() => {
  let base = 0
  let total = 0
  let tax = 0
  let serviceCharge = 0
  let currency = 'USD'

  if (priceDetailed.value) {
    total = priceDetailed.value.priceWithCommission || priceDetailed.value.price || 0
    base = priceDetailed.value.price || 0
    tax = priceDetailed.value.tax || (base * 0.12)
    // If total is greater than base + tax, the remainder is service charge/commission
    const remainder = total - base - tax
    serviceCharge = remainder > 0 ? remainder : (base * 0.05)
    currency = priceDetailed.value.currency || 'USD'
  }

  if (bundledStay.value) {
    const stayPrice = bundledStay.value.price || 0
    base += stayPrice
    total += stayPrice
  }

  return {
    base,
    tax,
    serviceCharge,
    total: total
  }
})

// Currency & Manual Payment State
const isCurrencyModalVisible = ref(false)
const isConversionLoading = ref(false)
const isManualDetailsVisible = ref(false)
const bankAccounts = ref([])

const currencySymbol = computed(() => {
  const map: any = { USD: '$', EUR: '€', GBP: '£', NGN: '₦', GHS: 'GH₵', ZAR: 'R', KES: 'KSh' }
  return map[priceDetailed.value?.currency] || priceDetailed.value?.currency || '$'
})

const addOnsTotal = computed(() => selectedAddOns.value.reduce((sum, a) => sum + a.price, 0))

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

  // If already normalized or custom format
  if (rawFlight.origin && rawFlight.destination && typeof rawFlight.price === 'number' && rawFlight.segments) {
    return rawFlight
  }

  // Duffel Format (slices, total_amount, total_currency)
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

    // Duffel conditions
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
      priceWithCommission: totalPrice, // Assuming commission logic is handled on backend or already factored in
      currency: rawFlight.total_currency || 'USD',
      stops: segments.length - 1,
      segments: normalizedSegments,
      cabinClass: (slice.fare_brand_name || segments[0]?.passengers?.[0]?.cabin_class || 'Economy').toLowerCase(),
      airline: rawFlight.owner?.name || firstSegment?.marketing_carrier?.name || 'Airline',
      airlineLogo: rawFlight.owner?.logo_symbol_url || firstSegment?.marketing_carrier?.logo_symbol_url,
      totalEmissionsKg: rawFlight.total_emissions_kg,
      conditions: {
        refundable: canRefund,
        changeable: canChange
      },
      rawOffer: rawFlight,
    }
  }

  // Amadeus / GDS Format
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
      rawOffer: rawFlight, // Preserve original for backend
    }
  }

  return rawFlight
}

// Step Navigation
const goToStep = (step: number) => {
  currentStep.value = step
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  const steps = ['review', 'passengers', 'customization', 'payment']
  trackAction(`booking_step_${steps[step]}`, { 
    type: bookingDetails.value.type,
    item: bookingDetails.value.name,
    price: displayPrices.value.total
  })
}

const handleGoBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.back()
  }
}

const handleTravellerContinue = async () => {
  if (!isLoggedIn.value) {
    showToast({
      title: "Authentication Required",
      message: "Please sign in or create an account to complete your booking.",
      toastType: "info",
    });
    openAuthModal();
    return
  }

  // Ensure Duffel Identity if using Duffel
  if (bookingDetails.value.provider === 'duffel') {
    showBrandedLoader.value = true
    loaderStatus.value = 'Setting up your secure travel identity...'
    try {
      await ensureDuffelIdentity(travellerData.value)
    } catch (err: any) {
      if (err?.response?.status === 401) {
        showToast({
          title: "Session Expired",
          message: "Please sign in again to continue with your booking.",
          toastType: "info",
        });
        openAuthModal();
        showBrandedLoader.value = false
        return
      }
    }
    showBrandedLoader.value = false
  }

  goToStep(2)
}

// Payment Flow
const handleCurrencySelect = async (newCurrency: string) => {
  isCurrencyModalVisible.value = false
  if (newCurrency === priceDetailed.value?.currency) return

  isConversionLoading.value = true
  try {
    const { data } = await paymentsApi.convertCurrency(
      priceDetailed.value.priceWithCommission,
      priceDetailed.value.currency,
      newCurrency
    )
    
    if (data.success) {
      priceDetailed.value.priceWithCommission = data.data.convertedAmount
      priceDetailed.value.currency = data.data.toCurrency
      const rate = data.data.exchangeRate
      priceDetailed.value.price = Math.round(priceDetailed.value.price * rate * 100) / 100
    }
  } catch (error) {
    console.error('Currency conversion failed:', error)
  } finally {
    setTimeout(() => {
      isConversionLoading.value = false
    }, 1500)
  }
}

const handleEmailBlur = async (email: string) => {
  if (!email || !email.includes('@')) return
  
  const config = useRuntimeConfig()
  const checkoutUrl = `${window.location.origin}/checkout/${route.params.pnr || ''}`
  
  try {
    await bookingsApi.emailCapture({
      email,
      firstName: travellerData.value.firstName || 'Traveler',
      destination: priceDetailed.value?.segments?.[0]?.destination?.name || 'your destination',
      checkoutUrl,
      tenantId: route.query.tenantId as string
    })
    console.log('Email captured and draft nudge sent')
  } catch (err) {
    console.error('Email capture failed', err)
  }
}

const handlePayment = async (paymentInfo: { provider: string; channel: string; cardData?: any }) => {
  paymentProcessing.value = true
  showBrandedLoader.value = true
  loaderStatus.value = 'Preparing for payment...'
  
  try {
    if (bookingDetails.value.type === 'stay') {
      const guestsList = [];
      const numAdults = bookingDetails.value.adults || 1;
      const numChildren = bookingDetails.value.children || 0;
      
      for (let i = 0; i < numAdults; i++) {
        guestsList.push({
          type: 'AD',
          firstName: i === 0 ? travellerData.value.firstName : `Adult ${i + 1}`,
          lastName: travellerData.value.lastName
        });
      }
      for (let i = 0; i < numChildren; i++) {
        guestsList.push({
          type: 'CH',
          firstName: `Child ${i + 1}`,
          lastName: travellerData.value.lastName,
          age: 7
        });
      }

      const stayPayload = {
        quoteId: priceDetailed.value?.quoteId || bookingDetails.value.roomId,
        provider: bookingDetails.value.provider,
        guestDetails: {
          email: travellerData.value.email,
          phoneNumber: travellerData.value.phone,
          guests: guestsList,
        }
      }

      loaderStatus.value = 'Reserving your room with the property...'
      const response = await staysApi.book(stayPayload)
      const bookData = response.data?.data || response.data

      if (bookData?.bookingId || bookData?.id) {
         const bookingId = bookData.bookingId || bookData.id
         const callbackUrl = `${window.location.origin}/confirmation?type=stay&provider=${bookingDetails.value.provider}&orderId=${bookingId}`
         
         const paymentResponse = await paymentsApi.initialize({
            bookingId: bookingId,
            provider: paymentInfo.provider,
            callbackUrl
         })
         
         const paymentData = paymentResponse.data?.data || paymentResponse.data
         if (paymentData?.url || paymentData?.authorization_url) {
           window.location.href = paymentData.url || paymentData.authorization_url
           return
         }

         navigateTo({
           path: '/confirmation',
           query: {
             type: 'stay',
             orderId: bookingId,
             status: 'pending_payment'
           }
         })
      }
      return
    }

    if (bookingDetails.value.type === 'transfer') {
      const transferPayload = {
        offerId: bookingDetails.value.id,
        provider: bookingDetails.value.provider,
        passengerDetails: {
          firstName: travellerData.value.firstName,
          lastName: travellerData.value.lastName,
          title: travellerData.value.title.toUpperCase(),
          email: travellerData.value.email,
          phone: travellerData.value.phoneCountryCode.replace('+', '') + travellerData.value.phone,
          payment: {
            methodOfPayment: 'CREDIT_CARD',
            creditCard: {
              number: "4111111111111111",
              holderName: `${travellerData.value.firstName} ${travellerData.value.lastName}`.toUpperCase(),
              vendorCode: "VI",
              expiryDate: "1225",
              cvv: "111"
            }
          }
        }
      }

      loaderStatus.value = 'Booking your transfer...'
      const response = await transfersApi.book(transferPayload)
      const bookData = response.data?.data || response.data

      if (bookData?.orderId || bookData?.bookingId || bookData?.id) {
         const bookingId = bookData.orderId || bookData.bookingId || bookData.id
         const pnr = bookData.confirmationNumber || bookData.orderId
         navigateTo({
           path: '/confirmation',
           query: {
             type: 'transfer',
             orderId: bookingId,
             pnr: pnr,
             status: 'confirmed'
           }
         })
      }
      return
    }

    if (paymentInfo.provider === 'manual') {
      const { data } = await paymentsApi.getBankAccounts(priceDetailed.value.currency || 'USD')
      if (data.success) {
        bankAccounts.value = data.data
        isManualDetailsVisible.value = true
      }
      paymentProcessing.value = false
      showBrandedLoader.value = false
      return
    }

    let paymentPayload: any = null

    // Specialized Duffel Card Flow
    if (paymentInfo.provider === 'duffel' && paymentInfo.cardData) {
      loaderStatus.value = 'Securing your card details...'
      try {
        const cardResponse = await flightsApi.createDuffelCard({
          provider: 'duffel',
          cardData: {
            number: paymentInfo.cardData.number.replace(/\s/g, ''),
            expiry_month: paymentInfo.cardData.expiry_month,
            expiry_year: paymentInfo.cardData.expiry_year,
            cvc: paymentInfo.cardData.cvv,
            name: paymentInfo.cardData.name,
            multi_use: paymentInfo.cardData.multi_use,
            address_line_1: paymentInfo.cardData.address_line_1,
            address_line_2: paymentInfo.cardData.address_line_2,
            address_city: paymentInfo.cardData.address_city,
            address_region: paymentInfo.cardData.address_region,
            address_country_code: paymentInfo.cardData.address_country_code,
            address_postal_code: paymentInfo.cardData.address_postal_code,
          }
        })
        
        const card = cardResponse.data?.data || cardResponse.data
        if (!card?.id) throw new Error('Failed to secure card details')

        paymentPayload = {
          type: 'card',
          cardId: card.id
        }
      } catch (err: any) {
        throw new Error(`Payment security failed: ${err.response?.data?.message || err.message}`)
      }
    }

    const flightOffer = priceDetailed.value
    const bookPayload = {
      offerId: bookingDetails.value.id,
      provider: bookingDetails.value.provider,
      offer: flightOffer,
      payment: paymentPayload,
      ipAddress: 'detect-on-backend',
      userAgent: navigator.userAgent,
      deviceFingerprint: btoa(navigator.userAgent + screen.width + screen.height),
      passengers: [{
        title: travellerData.value.title,
        firstName: travellerData.value.firstName,
        lastName: travellerData.value.lastName,
        email: travellerData.value.email,
        phone: travellerData.value.phone,
        phoneCountryCode: travellerData.value.phoneCountryCode.replace('+', ''),
        gender: travellerData.value.gender,
        dateOfBirth: travellerData.value.dateOfBirth,
        passportNumber: travellerData.value.passportNumber || undefined,
        passportExpiry: travellerData.value.passportExpiry || undefined,
        passportCountry: travellerData.value.passportCountry || undefined,
        nationality: travellerData.value.nationality || undefined,
      }]
    }

    // Validate DOB - must be in the past
    const dob = travellerData.value.dateOfBirth
    if (!dob || new Date(dob) >= new Date()) {
      showBrandedLoader.value = false
      paymentProcessing.value = false
      showToast({
        title: "Invalid Date of Birth",
        message: "Please enter a valid Date of Birth. The date must be in the past.",
        toastType: "error",
      });
      return
    }

    loaderStatus.value = 'Booking your flight with the airline...'
    const bookResponse = await flightsApi.book(bookPayload)
    const bookData = bookResponse.data?.data || bookResponse.data
    
    if (bookData?.bookingId || bookData?.orderId) {
      const bookingId = bookData.bookingId || bookData.orderId
      
      // If payment was already handled by Duffel card, we don't need to initialize another payment
      if (paymentPayload?.cardId) {
        navigateTo({
          path: '/confirmation',
          query: {
            pnr: bookData.pnr || bookData.reference,
            orderId: bookingId,
            status: 'confirmed'
          }
        })
        return
      }

      loaderStatus.value = 'Initializing secure payment...'
      const callbackUrl = `${window.location.origin}/confirmation?type=flight&provider=${bookingDetails.value.provider}&orderId=${bookingId}`
      
      try {
        const paymentResponse = await paymentsApi.initialize({
          bookingId: bookingId,
          provider: paymentInfo.provider,
          callbackUrl
        })
        
        const paymentData = paymentResponse.data?.data || paymentResponse.data
        if (paymentData?.url || paymentData?.authorization_url) {
          window.location.href = paymentData.url || paymentData.authorization_url
          return
        }
      } catch (paymentErr: any) {
        console.warn('Payment initialization failed:', paymentErr)
        showToast({
          title: "Payment Error",
          message: `Payment initialization failed: ${paymentErr.response?.data?.message || paymentErr.message}.`,
          toastType: "error",
        });
      }
      
      navigateTo({
        path: '/confirmation',
        query: {
          pnr: bookData.pnr || bookData.reference,
          orderId: bookingId,
          status: 'pending_payment'
        }
      })
    }
  } catch (error: any) {
    console.error('Booking failed:', error)
    showBrandedLoader.value = false
    paymentProcessing.value = false
    const msg = error.response?.data?.message || error.message || 'An unexpected error occurred'
    showToast({
      title: "Booking Failed",
      message: msg,
      toastType: "error",
    });
  } finally {
    paymentProcessing.value = false
  }
}

const handleHold = async () => {
  paymentProcessing.value = true
  showBrandedLoader.value = true
  loaderStatus.value = 'Reserving your seats without payment...'
  
  try {
    const bookPayload = {
      offerId: bookingDetails.value.id,
      provider: bookingDetails.value.provider,
      passengers: [{
        title: travellerData.value.title,
        firstName: travellerData.value.firstName,
        lastName: travellerData.value.lastName,
        email: travellerData.value.email,
        phone: travellerData.value.phone,
        phoneCountryCode: travellerData.value.phoneCountryCode.replace('+', ''),
        gender: travellerData.value.gender,
        dateOfBirth: travellerData.value.dateOfBirth,
        passportNumber: travellerData.value.passportNumber || undefined,
        passportExpiry: travellerData.value.passportExpiry || undefined,
        passportCountry: travellerData.value.passportCountry || undefined,
        nationality: travellerData.value.nationality || undefined,
      }]
    }

    const response = await flightsApi.hold(bookPayload)
    const data = response.data?.data || response.data
    
    if (data?.bookingId || data?.id) {
       navigateTo({
         path: '/confirmation',
         query: {
           pnr: data.pnr || data.reference,
           orderId: data.bookingId || data.id,
           status: 'held'
         }
       })
    }
  } catch (error: any) {
    console.error('Hold failed:', error)
    showBrandedLoader.value = false
    const msg = error.response?.data?.message || error.message || 'An unexpected error occurred'
    showToast({
       title: "Reservation Failed",
       message: msg,
       toastType: "error",
    })
  } finally {
    paymentProcessing.value = false
  }
}
const handlePayNow = () => {
  if (currentStep.value === 3) {
    const p = bookingDetails.value.provider === 'duffel' ? 'duffel' : 'stripe'
    handlePayment({ provider: p, channel: 'card' })
  } else {
    goToStep(3)
  }
}

const handleApplyPromo = (code: string) => {
  console.log('Apply promo code:', code)
}

onMounted(async () => {
  // Initial tracking for landing on checkout
  trackAction('booking_step_review', { 
    type: bookingDetails.value.type,
    item: bookingDetails.value.name 
  })

  if (bookingDetails.value.type === 'flight') {
    const saved = sessionStorage.getItem('selectedFlight')
    if (saved) {
      selectedFlight.value = JSON.parse(saved)
      try {
        loaderStatus.value = 'Confirming best fare with airline...'
        const pricedData = await priceFlightOffer(selectedFlight.value, bookingDetails.value.provider)
        
        if (pricedData?.flightOffers?.[0]) {
          priceDetailed.value = normalizeFlightData(pricedData.flightOffers[0])
        } else {
          priceDetailed.value = normalizeFlightData(selectedFlight.value)
        }
      } catch (err) {
        console.error('Pricing failed:', err)
        priceDetailed.value = selectedFlight.value
      }
    } else {
      priceDetailed.value = {
        airline: bookingDetails.value.name,
        origin: 'N/A',
        destination: 'N/A',
        price: 0,
        priceWithCommission: 0,
        currency: 'USD',
        segments: [],
        conditions: {},
      }
    }
  } else if (bookingDetails.value.type === 'stay') {
    loaderStatus.value = 'Finalizing property rates...'
    try {
      // Use quoteId if available, otherwise create a new quote
      const quoteId = bookingDetails.value.quoteId || bookingDetails.value.roomId
      const response = await staysApi.createQuote(quoteId, bookingDetails.value.provider)
      const quoteResult = response.data?.data || response.data
      
      // Merge query param data with quote result
      priceDetailed.value = {
        ...quoteResult,
        hotelName: quoteResult?.hotelName || bookingDetails.value.name,
        quoteId: quoteResult?.id || quoteId,
        checkIn: bookingDetails.value.checkIn,
        checkOut: bookingDetails.value.checkOut,
      }
    } catch (err) {
      console.error('Stay quote failed, using fallback from query params:', err)
      // Use query param data as fallback so user can still proceed
      priceDetailed.value = {
        hotelName: bookingDetails.value.name,
        currency: bookingDetails.value.currency || 'USD',
        price: bookingDetails.value.price || 0,
        priceWithCommission: bookingDetails.value.price || 0,
        quoteId: bookingDetails.value.quoteId || bookingDetails.value.roomId,
        checkIn: bookingDetails.value.checkIn,
        checkOut: bookingDetails.value.checkOut,
        rooms: bookingDetails.value.rooms,
        adults: bookingDetails.value.adults,
      }
    }
  }
  showBrandedLoader.value = false
})

onMounted(() => {
  // Check for bundled stay
  const savedStay = sessionStorage.getItem('pendingStayBooking')
  if (savedStay) {
    bundledStay.value = JSON.parse(savedStay)
  }
})

const handleManualConfirm = async (account: any) => {
  isManualDetailsVisible.value = false
  paymentProcessing.value = true
  showBrandedLoader.value = true
  loaderStatus.value = 'Processing your booking for manual payment...'
  
  try {
    const flightOffer = priceDetailed.value
    const bookPayload = {
      offerId: bookingDetails.value.id,
      provider: bookingDetails.value.provider,
      offer: flightOffer,
      passengers: [{
        title: travellerData.value.title,
        firstName: travellerData.value.firstName,
        lastName: travellerData.value.lastName,
        email: travellerData.value.email,
        phone: travellerData.value.phone,
        phoneCountryCode: travellerData.value.phoneCountryCode.replace('+', ''),
        gender: travellerData.value.gender,
        dateOfBirth: travellerData.value.dateOfBirth,
        passportNumber: travellerData.value.passportNumber || undefined,
        passportExpiry: travellerData.value.passportExpiry || undefined,
        passportCountry: travellerData.value.passportCountry || undefined,
        nationality: travellerData.value.nationality || undefined,
      }]
    }

    const bookResponse = await flightsApi.book(bookPayload)
    const bookData = bookResponse.data?.data || bookResponse.data
    if (!bookData?.bookingId && !bookData?.orderId) throw new Error('Booking failed to return ID')

    const bookingId = bookData.bookingId || bookData.orderId
    const pnr = bookData.pnr || bookData.reference

    await paymentsApi.initialize({
      bookingId: bookingId,
      provider: 'manual',
      callbackUrl: `${window.location.origin}/confirmation?orderId=${bookingId}&pnr=${pnr}&status=pending_payment`
    })

    navigateTo(`/confirmation?orderId=${bookingId}&pnr=${pnr}&status=pending_payment`)
  } catch (error: any) {
    console.error('Manual booking failed:', error)
    showBrandedLoader.value = false
    showToast({
      title: "Manual Booking Error",
      message: error.response?.data?.message || error.message,
      toastType: "error",
    });
  } finally {
    paymentProcessing.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');

.ck-root {
  min-height: 100vh;
  background: #fbfbf9;
  font-family: 'Sora', sans-serif;
  color: #111;
  display: flex;
  flex-direction: column;
}

.ck-wrap {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.animate-in {
  animation: ckIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes ckIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .ck-wrap { padding: 0 20px; }
}
</style>
