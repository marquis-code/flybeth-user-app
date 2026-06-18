<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative overflow-hidden">
    
    <!-- Ambient Background Elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <!-- Minimal Header -->
    <header class="w-full py-6 px-8 flex justify-center z-10 relative">
      <img src="@/assets/img/logo.png" alt="Flybeth" class="h-10 cursor-pointer" @click="goHome" />
    </header>

    <main class="flex-1 flex items-center justify-center p-6 z-10 relative">
      
      <!-- Processing State -->
      <div v-if="isAuthorizing" class="bg-white/80 backdrop-blur-xl border border-white p-12 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] w-full max-w-[500px] text-center">
        <div class="relative w-24 h-24 mx-auto mb-8">
          <div class="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-[#0D1DAD] border-t-transparent rounded-full animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#0D1DAD] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
        </div>
        <h1 class="text-2xl font-black text-gray-900 mb-3 tracking-tight">Authorizing Payment...</h1>
        <p class="text-gray-500 font-medium">Please wait while we securely confirm your transaction with the payment provider.</p>
      </div>

      <!-- Result Card -->
      <div v-else class="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[32px] w-full max-w-[500px] text-center transform transition-all duration-700">
        
        <!-- Animated Icon Container -->
        <div class="relative mx-auto w-20 h-20 mb-10 flex items-center justify-center group">
          <div class="absolute inset-0 rounded-full transition-transform duration-700 group-hover:scale-110" :class="statusTheme.ringClass"></div>
          <div class="absolute inset-2 rounded-full opacity-50" :class="statusTheme.ringClass"></div>
          
          <div class="relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg" :class="statusTheme.iconBgClass">
            <svg v-if="paymentStatus === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="paymentStatus === 'pending_payment'" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h1 class="text-2xl font-black text-gray-900 mb-3">{{ statusTheme.title }}</h1>
        <p class="text-gray-500 font-medium text-sm mb-8">{{ statusTheme.subtitle }}</p>

        <!-- Dynamic Reference Block -->
        <div v-if="bookingRef" class="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 mb-8 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
           <div class="flex-1 py-2 sm:py-0 text-center">
             <p class="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Booking Reference</p>
             <p class="text-lg font-black text-[#0D1DAD]">{{ bookingRef }}</p>
           </div>
           <div class="flex-1 py-2 sm:py-0 text-center pt-3 sm:pt-0">
             <p class="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Status</p>
             <p class="text-sm font-bold mt-1" :class="statusTheme.textClass">{{ statusTheme.badgeText }}</p>
           </div>
        </div>

        <!-- Call to Action -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="goHome" class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm rounded-xl transition-colors duration-300">
            Back to Home
          </button>
          <button v-if="bookingRef" @click="goToManageBookings" class="px-6 py-3 bg-[#0D1DAD] hover:bg-[#0A1485] text-white font-bold text-sm rounded-xl transition-all duration-300 transform hover:-translate-y-0.5">
            Manage Booking
          </button>
        </div>

      </div>
    </main>

    <BookingDetailsDrawer 
      :visible="showDrawer" 
      :pnr="bookingRef" 
      @close="showDrawer = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTracking } from '@/composables/core/useTracking'
import { paymentsApi } from '@/api_factory/modules/payments'
import BookingDetailsDrawer from '@/components/checkout/BookingDetailsDrawer.vue'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const { trackAction } = useTracking()

const bookingRef = computed(() => (route.query.pnr as string) || '')
const orderId = computed(() => (route.query.orderId as string) || '')
const paymentStatus = ref((route.query.status as string) || 'booked')
const checkoutToken = computed(() => (route.query.checkout_token as string) || (route.query.token as string) || (route.query.reference as string) || '')
const provider = computed(() => (route.query.provider as string) || '')
const isAuthorizing = ref(false)

const showDrawer = ref(false)

onMounted(async () => {
  if (paymentStatus.value === 'success' && checkoutToken.value && provider.value) {
    isAuthorizing.value = true
    try {
      await paymentsApi.verifyPayment({
        bookingId: orderId.value,
        provider: provider.value,
        checkoutToken: checkoutToken.value
      })
      paymentStatus.value = 'success'
    } catch (error) {
      console.error('Failed to verify payment:', error)
      paymentStatus.value = 'pending_payment'
    } finally {
      isAuthorizing.value = false
    }
  }

  trackAction('booking_completed', {
    pnr: bookingRef.value,
    orderId: orderId.value,
    status: paymentStatus.value
  })
})

const statusTheme = computed(() => {
  if (paymentStatus.value === 'success') {
    return {
      title: 'Booking Confirmed!',
      subtitle: 'Your payment was successful and your reservation is secured.',
      ringClass: 'bg-green-100 animate-pulse',
      iconBgClass: 'bg-green-500',
      textClass: 'text-green-600',
      badgeText: 'Confirmed'
    }
  } else if (paymentStatus.value === 'pending_payment' || paymentStatus.value === 'booked') {
    return {
      title: 'Booking Reserved',
      subtitle: 'Your booking has been created. Complete payment to confirm your reservation.',
      ringClass: 'bg-amber-100',
      iconBgClass: 'bg-amber-500',
      textClass: 'text-amber-600',
      badgeText: 'Pending Payment'
    }
  } else {
    return {
      title: 'Booking Failed',
      subtitle: 'There was an issue processing your booking. Please try again.',
      ringClass: 'bg-red-100',
      iconBgClass: 'bg-red-500',
      textClass: 'text-red-600',
      badgeText: 'Failed'
    }
  }
})

const goHome = () => {
  router.push('/')
}

const goToManageBookings = () => {
  router.push({ path: '/bookings', query: { pnr: bookingRef.value } })
}
</script>
