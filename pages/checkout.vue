<template>
  <BrandedLoader 
    :visible="showBrandedLoader" 
    :statusText="loaderStatus"
    subtitle="Please wait while we prepare your booking"
  />

  <div v-if="!showBrandedLoader" class="checkout-page">
    <CheckoutStepper 
      :currentStep="currentStep" 
      @go-back="handleGoBack" 
    />

    <div class="checkout-body">
      <div class="checkout-grid">
        <div class="checkout-content">
          <!-- Step 0: Flight/Stay/Transfer Details -->
          <CheckoutFlightDetails
            v-if="currentStep === 0 && bookingDetails.type === 'flight'"
            :flightOffer="priceDetailed"
            @continue="goToStep(1)"
            />

          <CheckoutTransferDetails
            v-if="currentStep === 0 && bookingDetails.type === 'transfer'"
            :name="bookingDetails.name"
            :provider="bookingDetails.provider"
            @continue="goToStep(1)"
          />

          <CheckoutStayDetails
            v-if="currentStep === 0 && bookingDetails.type === 'stay'"
            :stay="priceDetailed"
            :currency-symbol="currencySymbol"
            @continue="goToStep(1)"
          />

          <!-- Step 1: Traveller Info -->
          <CheckoutTravellerForm 
            v-if="currentStep === 1" 
            v-model="travellerData" 
            @continue="handleTravellerContinue" 
            @email-blur="handleEmailBlur"
          />

          <!-- Step 2: Trip Customization -->
          <CheckoutTripCustomization
            v-if="currentStep === 2"
            :flightOffer="bookingDetails.type === 'flight' ? priceDetailed : null"
            :stay="bookingDetails.type === 'stay' ? priceDetailed : null"
            :traveller="travellerData"
            :totalPrice="displayPrices.total"
            v-model:selectedAddOns="selectedAddOns"
            @continue="goToStep(3)"
          />

          <!-- Step 3: Overview & Payment -->
          <CheckoutPayment 
            v-if="currentStep === 3" 
            :total-amount="priceDetailed?.priceWithCommission" 
            :currency-symbol="currencySymbol"
            :currency="priceDetailed?.currency"
            :processing="paymentProcessing"
            @complete-payment="handlePayment"
            @change-currency="isCurrencyModalVisible = true"
          />

          <!-- Modals -->
          <CurrencySelectorModal 
            :visible="isCurrencyModalVisible"
            :current-currency="priceDetailed?.currency"
            @close="isCurrencyModalVisible = false"
            @select="handleCurrencySelect"
          />

          <CurrencyConversionLoader :visible="isConversionLoading" />

          <ManualPaymentDetailsModal 
            :visible="isManualDetailsVisible"
            :amount="priceDetailed?.priceWithCommission"
            :currency="priceDetailed?.currency"
            :bank-accounts="bankAccounts"
            @close="isManualDetailsVisible = false"
            @confirm="handleManualConfirm"
          />
        </div>

        <!-- Right Sidebar -->
        <div class="checkout-sidebar-col">
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
            @apply-promo="handleApplyPromo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, navigateTo, useRuntimeConfig } from '#app'
import { staysApi } from '@/api_factory/modules/stays'
import { paymentsApi } from '@/api_factory/modules/payments'
import { useFlightCheckout } from '@/composables/modules/flights/useFlightCheckout'
import BrandedLoader from '~/components/BrandedLoader.vue'
import CheckoutStepper from '@/components/checkout/CheckoutStepper.vue'
import CheckoutFlightDetails from '@/components/checkout/CheckoutFlightDetails.vue'
import CheckoutTransferDetails from '@/components/checkout/CheckoutTransferDetails.vue'
import CheckoutTravellerForm from '@/components/checkout/CheckoutTravellerForm.vue'
import CheckoutTripCustomization from '~/components/checkout/CheckoutTripCustomization.vue'
import CheckoutPayment from '~/components/checkout/CheckoutPayment.vue'
import CurrencySelectorModal from '~/components/checkout/CurrencySelectorModal.vue'
import CurrencyConversionLoader from '~/components/checkout/CurrencyConversionLoader.vue'
import ManualPaymentDetailsModal from '~/components/checkout/ManualPaymentDetailsModal.vue'
import CheckoutSidebar from '@/components/checkout/CheckoutSidebar.vue'
import CheckoutStayDetails from '@/components/checkout/CheckoutStayDetails.vue'
import { flightsApi } from '@/api_factory/modules/flights'
import { transfersApi } from '@/api_factory/modules/transfers'
import { bookingsApi } from '@/api_factory/modules/bookings'

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
  name: (route.query.name as string) || 'Selected Item',
  price: Number(route.query.price) || 0,
  provider: route.query.provider as string,
}))

// Price display
const displayPrices = computed(() => {
  let base = 0
  let total = 0
  let currency = 'USD'

  if (priceDetailed.value) {
    total += priceDetailed.value.priceWithCommission || priceDetailed.value.price || 0
    base += priceDetailed.value.price || 0
    currency = priceDetailed.value.currency || 'USD'
  } else if (bookingDetails.value.price) {
    base += bookingDetails.value.price
    total += bookingDetails.value.price * 1.17
  }

  if (bundledStay.value) {
    const stayPrice = bundledStay.value.price || 0
    base += stayPrice
    total += stayPrice // Stay price usually already includes commission from backend
  }

  return {
    base,
    tax: base * 0.12,
    serviceCharge: base * 0.05,
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

  // If already normalized or Duffel format
  if (rawFlight.origin && rawFlight.destination && typeof rawFlight.price === 'number') {
    return rawFlight
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
}

const handleGoBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.back()
  }
}

const handleTravellerContinue = () => {
  if (!localStorage.getItem('token')) {
    alert('Please sign in or create an account to complete your booking.')
    navigateTo('/?requireLogin=true')
    return
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

const handlePayment = async (paymentInfo: { provider: string; channel: string }) => {
  paymentProcessing.value = true
  showBrandedLoader.value = true
  loaderStatus.value = 'Preparing for payment...'
  
  try {
    if (bookingDetails.value.type === 'stay') {
      const stayPayload = {
        quoteId: priceDetailed.value?.quoteId || bookingDetails.value.roomId,
        provider: bookingDetails.value.provider,
        guestDetails: {
          email: travellerData.value.email,
          phoneNumber: travellerData.value.phone,
          guests: [
            {
              firstName: travellerData.value.firstName,
              lastName: travellerData.value.lastName,
            }
          ],
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

    loaderStatus.value = 'Booking your flight with the airline...'
    
    // Validate DOB - must be in the past
    const dob = travellerData.value.dateOfBirth
    if (!dob || new Date(dob) >= new Date()) {
      showBrandedLoader.value = false
      paymentProcessing.value = false
      alert('Please enter a valid Date of Birth. The date must be in the past.')
      return
    }
    
    const bookResponse = await flightsApi.book(bookPayload)
    const bookData = bookResponse.data?.data || bookResponse.data
    
    if (bookData?.bookingId || bookData?.orderId) {
      loaderStatus.value = 'Initializing secure payment...'
      
      const bookingId = bookData.bookingId || bookData.orderId
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
        // Aggressive feedback as requested
        alert(`Payment initialization failed: ${paymentErr.response?.data?.message || paymentErr.message}. You can still view your booking details below.`)
      }
      
      navigateTo({
        path: '/confirmation',
        query: {
          pnr: bookData.pnr || bookData.reference,
          orderId: bookData.orderId || bookData.bookingId,
          status: 'pending_payment'
        }
      })
    }
  } catch (error: any) {
    console.error('Booking failed:', error)
    showBrandedLoader.value = false
    paymentProcessing.value = false
    const msg = error.response?.data?.message || error.message || 'An unexpected error occurred'
    alert(`Booking failed: ${msg}`)
  } finally {
    paymentProcessing.value = false
  }
}

const handlePayNow = () => {
  if (currentStep.value === 3) {
    handlePayment({ provider: 'stripe', channel: 'card' })
  } else {
    goToStep(3)
  }
}

const handleApplyPromo = (code: string) => {
  console.log('Apply promo code:', code)
}

onMounted(async () => {
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
        price: bookingDetails.value.price,
        priceWithCommission: bookingDetails.value.price,
        currency: 'USD',
        segments: [],
        conditions: {},
      }
    }
  } else if (bookingDetails.value.type === 'stay') {
    loaderStatus.value = 'Finalizing property rates...'
    try {
      const response = await staysApi.createQuote(bookingDetails.value.roomId, bookingDetails.value.provider)
      priceDetailed.value = response.data?.data || response.data
    } catch (err) {
      console.error('Stay quote failed:', err)
      // If quote fails, try to use basic info as fallback
      priceDetailed.value = {
        hotelName: bookingDetails.value.name,
        currency: 'USD',
        price: bookingDetails.value.price,
        priceWithCommission: bookingDetails.value.price
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
    alert(`Manual booking failed: ${error.response?.data?.message || error.message}`)
  } finally {
    paymentProcessing.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #f0f2f5;
}

.checkout-body {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

.checkout-content {
  min-width: 0;
}

.checkout-sidebar-col {
  min-width: 0;
}

@media (max-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
  .checkout-sidebar-col {
    order: -1;
  }
}
</style>
