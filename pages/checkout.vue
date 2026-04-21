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
          <span class="text-2xl  text-white tracking-widest">Flybeth</span>
          <div class="flex items-center gap-1.5 mt-1">
            <Lock class="h-3 w-3 text-primary" />
            <span class="text-[9px]  tracking-[0.2em] text-white/30">AES-256 Encrypted</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div v-if="currentStep < 3" class="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span class="text-[10px]  text-white/50 tracking-widest whitespace-nowrap">Held for 14:59</span>
          </div>
          <div class="hidden md:flex flex-col items-end">
             <span class="text-[10px]  text-white/20 tracking-widest">Support</span>
             <span class="text-sm font-bold text-white/50">+1 800 FLYBETH</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Refined Stepper -->
    <div class="bg-white border-b border-gray-100 py-6">
       <div class="ck-wrap">
          <CheckoutStepper :currentStep="currentStep" :steps="['Review', 'Travelers', 'Extras', 'Payment']" />
       </div>
    </div>

    <main class="ck-main py-10">
      <div class="ck-wrap">
        <div class="flex flex-col lg:flex-row gap-8 items-start">
          
          <div class="flex-grow w-full space-y-8">
            <!-- Step 0: Review -->
            <div v-if="currentStep === 0" class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in">
              <div class="p-3 md:p-12 border-b border-gray-50 bg-gray-50/30">
                 <h2 class="text-2xl  text-gray-900 tracking-tight">Review selection</h2>
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
                v-model:selectedSeats="selectedSeats"
                @update:seatPrice="val => seatPrice = val"
                @continue="goToStep(3)"
                @back="goToStep(1)"
              />
            </div>

                <div v-if="currentStep === 3" class="animate-in space-y-6">
                  <div class="flex gap-4 p-4 bg-sky-50 border border-sky-100 rounded-2xl items-center max-w-xl">
                      <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-500 shadow-sm flex-shrink-0">
                        <ShieldCheck class="h-5 w-5" />
                      </div>
                      <div class="space-y-0.5">
                         <p class="text-sm font-black text-sky-900 tracking-tight">Security Verification</p>
                         <p class="text-[10px] text-sky-700/60 font-bold leading-none">Your transaction is protected by multi-layer encryption.</p>
                      </div>
                  </div>

                  <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
                <CheckoutPayment 
                  ref="paymentRef"
                  :total-amount="displayPrices.total" 
                  :currency-symbol="currencySymbol"
                  :currency="priceDetailed?.currency"
                  :processing="paymentProcessing"
                  :flight-offer="priceDetailed"
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
                :selectedSeats="selectedSeats"
                :seatPrice="seatPrice"
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
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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
import ManualPaymentDetailsModal from '~/components/checkout/ManualPaymentDetailsModal.vue'
import CheckoutSidebar from '~/components/checkout/CheckoutSidebar.vue'
import SeatSelection from '~/components/checkout/SeatSelection.vue'
import CheckoutStayDetails from '~/components/checkout/CheckoutStayDetails.vue'
import { flightsApi } from '~/api_factory/modules/flights'
import { transfersApi } from '~/api_factory/modules/transfers'
import { bookingsApi } from '~/api_factory/modules/bookings'
import { useDuffelIdentity } from '~/composables/modules/integrations/useDuffelIdentity'
import { useTracking } from '~/composables/core/useTracking'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useUser } from '~/composables/modules/auth/user'
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
const selectedSeats = ref<any[]>([])
const seatPrice = ref(0)

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
  saveForFuture: false,
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
    if (u && !travellerData.value.firstName) {
        travellerData.value.firstName = u.firstName || ''
        travellerData.value.lastName = u.lastName || ''
        travellerData.value.email = u.email || ''
        travellerData.value.phone = u.phone || ''
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
    
    // Split the flight/stay total into components that always sum to 'total'
    tax = priceDetailed.value.tax || (total * 0.08) 
    serviceCharge = total - base - tax
    if (serviceCharge < 0) {
        serviceCharge = 0
        tax = total - base
    }
    currency = priceDetailed.value.currency || 'USD'
  }

  if (bundledStay.value) {
    const stayPrice = bundledStay.value.price || 0
    base += stayPrice
    total += stayPrice
  }

  // Calculate final aggregated total once
  const finalTotal = total + seatPrice.value + addOnsTotal.value

  return {
    base,
    tax,
    serviceCharge,
    total: finalTotal
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
  const steps = ['review', 'passengers', 'customization', 'payment']
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
  if (!isLoggedIn.value) {
    showToast({ title: "Authentication Required", message: "Please sign in or create an account to continue.", toastType: "info" });
    openAuthModal();
    return
  }
  if (bookingDetails.value.provider === 'duffel') {
    showBrandedLoader.value = true
    loaderStatus.value = 'Setting up travel identity...'
    try {
      await ensureDuffelIdentity(travellerData.value)
    } catch (err: any) {
      if (err?.response?.status === 401) { openAuthModal(); return }
    }
    showBrandedLoader.value = false
  }
  goToStep(2)
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

const handlePayment = async (paymentInfo: any) => {
  paymentProcessing.value = true
  showBrandedLoader.value = true
  loaderStatus.value = paymentInfo.paymentModel === 'on_hold' ? 'Securing reservation...' : 'Finalizing booking...'
  
  try {
    const payload: any = {
      contactDetails: {
        email: travellerData.value.email,
        phone: travellerData.value.phone,
        name: `${travellerData.value.firstName} ${travellerData.value.lastName}`,
        state: travellerData.value.nationality
      },
      currency: priceDetailed.value?.currency || 'USD',
      paymentModel: paymentInfo.paymentModel || 'pay_now',
      paymentProvider: paymentInfo.provider,
      paymentMetadata: paymentInfo,
      passengerDetails: [{
        ...travellerData.value,
        gender: (travellerData.value.gender || 'male').toLowerCase(),
        title: (travellerData.value.title || 'mr').toLowerCase(),
        type: 'adult'
      }],
      pricing: {
        baseFare: priceDetailed.value?.price || bookingDetails.value.price || 0,
        taxes: (priceDetailed.value?.price || bookingDetails.value.price || 0) * 0.12, // Standard flight tax estimation
        fees: 0
      },
      tenantId: bookingDetails.value.provider === 'duffel' ? undefined : undefined // Add if needed
    }

    if (bookingDetails.value.type === 'flight') {
      payload.flights = [{
        flightId: bookingDetails.value.id,
        class: (priceDetailed.value?.cabinClass || 'economy').toLowerCase(),
        offerId: priceDetailed.value?.offerId || bookingDetails.value.quoteId,
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

    const { data } = await bookingsApi.create(payload)
    
    if (data && data.pnr) {
      clearCheckoutState()
      router.push(`/booking-confirmation?pnr=${data.pnr}`)
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
          showToast({ 
            title: "Offer Expired", 
            message: "This flight offer has expired. Please go back and select it again to get the latest pricing.", 
            toastType: "info" 
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
</style>
