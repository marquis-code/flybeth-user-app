<template>
  <div class="apple-pay-wrapper">
    <!-- Not available message -->
    <div v-if="!isSupported && !loading" class="text-center text-xs text-gray-400 py-3 font-bold">
      Apple Pay is not available on this device or browser.
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="h-12 bg-gray-100 animate-pulse rounded-xl"></div>

    <!-- Apple Pay Button -->
    <div v-else-if="isSupported">
      <button
        id="apple-pay-btn"
        type="button"
        @click="requestPayment"
        :disabled="processing"
        :class="['w-full h-14 rounded-xl flex items-center justify-center gap-3 transition-all font-bold tracking-wide', processing ? 'bg-gray-800 cursor-not-allowed opacity-70' : 'bg-black hover:bg-gray-900 active:scale-[0.98]']"
      >
        <span v-if="!processing" class="flex items-center gap-2 text-white text-base font-semibold">
          <!-- Apple Pay logo SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165.52 105.965" class="h-5" fill="white">
            <path d="M150.688 0H14.832C14.154 0 13.48.007 12.802.02c-.573.01-1.142.024-1.716.05A25.09 25.09 0 007.42.5a12.647 12.647 0 00-3.58 1.18A12.059 12.059 0 001.18 3.84 12.24 12.24 0 00.5 7.42 24.79 24.79 0 00.07 11.09C.025 11.663.01 12.232 0 12.804V93.16c.01.576.025 1.143.07 1.718a24.79 24.79 0 00.43 3.67 12.24 12.24 0 00.68 3.58 12.059 12.059 0 002.66 2.66 12.54 12.54 0 003.58 1.18 25.09 25.09 0 003.666.43c.574.025 1.143.04 1.716.05.678.013 1.352.02 2.03.02H150.688c.676 0 1.352-.007 2.028-.02.572-.01 1.143-.025 1.716-.05a24.84 24.84 0 003.674-.43 12.647 12.647 0 003.58-1.18 12.059 12.059 0 002.66-2.66 12.24 12.24 0 00.68-3.58 25.09 25.09 0 00.43-3.67c.044-.575.058-1.142.068-1.718V12.804c-.01-.572-.024-1.14-.068-1.714a25.09 25.09 0 00-.43-3.67 12.24 12.24 0 00-.68-3.58 12.059 12.059 0 00-2.66-2.66 12.647 12.647 0 00-3.58-1.18A24.84 24.84 0 00154.432.07c-.573-.026-1.144-.04-1.716-.05C152.04.007 151.364 0 150.688 0z"/>
            <path fill="#000" d="M150.688 3.532l2-.006c.552.007 1.103.02 1.656.046a21.26 21.26 0 013.164.37 9.108 9.108 0 012.58.851 8.531 8.531 0 011.878 1.879 8.78 8.78 0 01.852 2.58 21.26 21.26 0 01.37 3.164c.04.554.055 1.107.063 1.66l.003 1.443v78.98l-.003 1.36c-.008.56-.022 1.113-.063 1.67a21.26 21.26 0 01-.37 3.163 8.78 8.78 0 01-.852 2.58 8.531 8.531 0 01-1.878 1.879 9.025 9.025 0 01-2.58.85 21.26 21.26 0 01-3.164.37c-.553.027-1.104.04-1.657.047l-2 .005H14.832l-1.96-.005c-.55-.006-1.1-.02-1.65-.046a21.26 21.26 0 01-3.163-.37 9.025 9.025 0 01-2.58-.851 8.531 8.531 0 01-1.88-1.879 8.78 8.78 0 01-.85-2.58 21.26 21.26 0 01-.37-3.164c-.028-.555-.042-1.11-.05-1.665l-.007-1.37V12.802l.006-1.44c.008-.556.022-1.11.05-1.663a21.26 21.26 0 01.37-3.164 8.78 8.78 0 01.85-2.58 8.531 8.531 0 011.88-1.88 9.108 9.108 0 012.58-.85 21.26 21.26 0 013.164-.37c.55-.028 1.1-.04 1.652-.047l2.004-.006z"/>
            <g fill="white">
              <path d="M43.508 35.77c1.494-1.832 2.507-4.332 2.24-6.87-2.174.094-4.84 1.42-6.388 3.254-1.38 1.584-2.61 4.18-2.28 6.63 2.44.2 4.86-1.222 6.428-3.014zM45.73 39.144c-3.549-.206-6.57 1.986-8.27 1.986-1.7 0-4.33-1.88-7.18-1.832-3.696.055-7.12 2.132-9.02 5.46-3.84 6.67-.99 16.546 2.75 21.968 1.832 2.66 4.02 5.6 6.92 5.49 2.75-.11 3.79-1.77 7.13-1.77 3.34 0 4.27 1.77 7.18 1.72 2.99-.055 4.88-2.66 6.71-5.34 2.1-3.06 2.96-6.01 3.01-6.17-.066-.027-5.77-2.2-5.826-8.75-.055-5.46 4.44-8.08 4.66-8.19-2.55-3.73-6.52-4.16-7.08-4.17z"/>
              <path d="M78.27 32.8c7.57 0 12.84 5.22 12.84 12.82 0 7.62-5.38 12.87-13.04 12.87H70.1V71.5h-6.04V32.8zm-8.17 20.63h5.65c5.27 0 8.26-2.84 8.26-7.78 0-4.95-2.99-7.76-8.23-7.76H70.1z"/>
              <path d="M93.8 63.27c0-5.01 3.86-8.12 10.7-8.5l7.9-.46v-2.2c0-3.2-2.15-5.07-5.75-5.07-3.42 0-5.53 1.64-6.04 4.18h-5.49c.32-5.19 4.67-9.02 11.74-9.02 6.9 0 11.25 3.64 11.25 9.4v19.7h-5.59v-4.71h-.13c-1.64 3.2-5.27 5.26-8.98 5.26-5.57 0-9.57-3.4-9.57-8.58zm18.6-2.59v-2.23l-7.1.44c-3.56.23-5.57 1.79-5.57 4.26 0 2.52 2.08 4.17 5.24 4.17 4.1 0 7.43-2.78 7.43-6.64z"/>
              <path d="M120.88 82.81v-4.68c.43.12 1.4.12 1.87.12 2.67 0 4.1-1.11 4.98-3.96l.53-1.66-10.08-27.96h6.28l6.95 22.33h.1l6.95-22.33H143l-10.4 29.3c-2.38 6.73-5.1 8.9-10.85 8.9-.47 0-1.41-.05-1.87-.16z"/>
            </g>
          </svg>
          Pay
        </span>
        <span v-else class="flex items-center gap-2 text-white text-sm">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Processing...
        </span>
      </button>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-xs text-red-500 font-bold text-center mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  amount: number        // in the currency's smallest unit (cents for USD)
  currency: string      // e.g. 'usd'
  label: string         // e.g. 'Flybeth - LOS → CDG'
  bookingId: string
}>()

const emit = defineEmits<{
  success: [paymentIntentId: string]
  error: [message: string]
}>()

const config = useRuntimeConfig()
const isSupported = ref(false)
const loading = ref(true)
const processing = ref(false)
const error = ref('')

let stripe: any = null
let paymentRequest: any = null

const loadStripe = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).Stripe) {
      resolve((window as any).Stripe)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload = () => resolve((window as any).Stripe)
    script.onerror = () => reject(new Error('Stripe.js failed to load'))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  try {
    const StripeLib = await loadStripe()
    stripe = StripeLib(config.public.stripePublishableKey)

    // Amount in cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(props.amount * 100)

    paymentRequest = stripe.paymentRequest({
      country: 'NG',
      currency: props.currency.toLowerCase(),
      total: {
        label: props.label || 'Flybeth Flight Booking',
        amount: amountInCents,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    // Check if Apple Pay / browser wallet is available
    const result = await paymentRequest.canMakePayment()
    isSupported.value = !!result?.applePay || !!result

    paymentRequest.on('paymentmethod', async (ev: any) => {
      processing.value = true
      error.value = ''

      try {
        // 1. Create a PaymentIntent on the backend
        const res = await fetch(`${config.public.apiBase}/api/v1/payments/create-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
          body: JSON.stringify({ bookingId: props.bookingId, currency: props.currency.toLowerCase() }),
        })
        const { clientSecret } = await res.json()

        if (!clientSecret) throw new Error('Could not get payment intent from server')

        // 2. Confirm the PaymentIntent using the Apple Pay payment method
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        )

        if (confirmError) {
          ev.complete('fail')
          throw new Error(confirmError.message)
        }

        ev.complete('success')

        if (paymentIntent.status === 'requires_action') {
          // Handle 3DS (rare for Apple Pay)
          const { error: actionError } = await stripe.confirmCardPayment(clientSecret)
          if (actionError) throw new Error(actionError.message)
        }

        emit('success', paymentIntent.id)
      } catch (err: any) {
        ev.complete('fail')
        error.value = err.message
        emit('error', err.message)
      } finally {
        processing.value = false
      }
    })
  } catch (err: any) {
    console.error('Apple Pay init error:', err)
    isSupported.value = false
  } finally {
    loading.value = false
  }
})

const requestPayment = () => {
  if (paymentRequest) {
    paymentRequest.show()
  }
}
</script>
