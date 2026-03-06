<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-brand-blue shadow-lg">
      <div class="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
        <NuxtLink to="/" class="text-white/60 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <div>
          <h1 class="text-xl font-black text-white">Booking Details</h1>
          <p class="text-white/60 text-xs font-bold">View your flight booking information</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-10">
      <!-- PNR Search -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <h2 class="text-sm font-black text-brand-blue uppercase tracking-widest mb-4">Find Booking by Reference</h2>
        <div class="flex gap-3">
          <input
            v-model="pnrInput"
            type="text"
            class="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-brand-blue uppercase focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            placeholder="Enter PNR / Booking Reference"
            @keyup.enter="searchByPnr"
          />
          <button
            @click="searchByPnr"
            :disabled="loading || !pnrInput"
            class="px-6 py-3 bg-brand-blue text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-brand-blue/90 disabled:opacity-50 transition-all"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Searching...
            </span>
            <span v-else>Search</span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center py-24 gap-4">
        <div class="w-12 h-12 rounded-full border-4 border-brand-blue/20 border-t-brand-blue animate-spin"></div>
        <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Retrieving booking...</p>
      </div>

      <!-- Not Found -->
      <div v-else-if="notFound" class="bg-white rounded-2xl border border-red-100 p-12 text-center shadow-sm">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-black text-brand-blue mb-2">Booking Not Found</h2>
        <p class="text-gray-400 font-bold text-sm">We could not find a booking with reference <span class="text-brand-blue font-black">{{ route.query.pnr }}</span>. Please check the reference and try again.</p>
      </div>

      <!-- Booking Details -->
      <div v-else-if="booking" class="space-y-4">
        <!-- Status Banner -->
        <div
          :class="[
            'rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm',
            booking.status === 'confirmed' ? 'bg-green-50 border border-green-100' :
            booking.status === 'cancelled' ? 'bg-red-50 border border-red-100' :
            'bg-amber-50 border border-amber-100'
          ]"
        >
          <div class="flex items-center gap-3">
            <div :class="['w-3 h-3 rounded-full', booking.status === 'confirmed' ? 'bg-green-500' : booking.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500 animate-pulse']"></div>
            <span :class="['text-sm font-black uppercase tracking-widest', booking.status === 'confirmed' ? 'text-green-700' : booking.status === 'cancelled' ? 'text-red-700' : 'text-amber-700']">
              {{ booking.status }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Reference</p>
            <p class="text-xl font-black text-brand-blue">{{ booking.pnr }}</p>
          </div>
        </div>

        <!-- Flight Info -->
        <div v-if="booking.flights?.length" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Flight Details</h3>
          <div v-for="(flt, idx) in booking.flights" :key="idx" class="flex items-center justify-between gap-4">
            <div class="text-center">
              <p class="text-2xl font-black text-brand-blue">{{ flt.flight?.departure?.iataCode || '—' }}</p>
              <p class="text-[10px] font-bold text-gray-400">Origin</p>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1">
              <div class="w-full h-[2px] bg-gray-100 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <span class="text-[10px] font-black text-gray-400 uppercase">{{ flt.class || 'Economy' }}</span>
            </div>
            <div class="text-center">
              <p class="text-2xl font-black text-brand-blue">{{ flt.flight?.arrival?.iataCode || '—' }}</p>
              <p class="text-[10px] font-bold text-gray-400">Destination</p>
            </div>
          </div>
        </div>

        <!-- Traveller Info -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Contact Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Full Name</p>
              <p class="font-bold text-brand-blue">{{ booking.contactDetails?.firstName }} {{ booking.contactDetails?.lastName }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Email</p>
              <p class="font-bold text-brand-blue">{{ booking.contactDetails?.email }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Phone</p>
              <p class="font-bold text-brand-blue">{{ booking.contactDetails?.phone }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Booked On</p>
              <p class="font-bold text-brand-blue">{{ formatDate(booking.bookedAt || booking.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Fare Summary</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm font-bold text-gray-600">
              <span>Base Fare</span>
              <span>{{ booking.pricing?.currency }} {{ formatPrice(booking.pricing?.baseFare) }}</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-gray-600">
              <span>Taxes</span>
              <span>{{ booking.pricing?.currency }} {{ formatPrice(booking.pricing?.taxes) }}</span>
            </div>
            <div class="border-t border-dashed border-gray-100 pt-2 flex justify-between font-black text-brand-blue">
              <span>Total</span>
              <span class="text-xl">{{ booking.pricing?.currency }} {{ formatPrice(booking.pricing?.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment CTA (for pending) -->
        <div v-if="booking.payment?.status === 'pending' || booking.status === 'pending'" class="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p class="font-black text-amber-800">Payment Pending</p>
            <p class="text-sm text-amber-700/70 font-bold">Your booking is awaiting payment to be confirmed.</p>
          </div>
          <button
            @click="handlePayment"
            class="px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { bookingsApi } from '@/api_factory/modules/bookings'

const route = useRoute()

const loading = ref(false)
const notFound = ref(false)
const booking = ref<any>(null)
const pnrInput = ref('')

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'
const formatPrice = (p: number) => p?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'

const searchByPnr = async () => {
  if (!pnrInput.value) return
  loading.value = true
  notFound.value = false
  booking.value = null
  try {
    const { data } = await bookingsApi.getByPnr(pnrInput.value.toUpperCase().trim())
    booking.value = data.data || data
    // Update URL
    navigateTo({ query: { pnr: pnrInput.value.toUpperCase().trim() } }, { replace: true })
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

const handlePayment = () => {
  if (!booking.value) return
  navigateTo({
    path: '/checkout',
    query: {
      type: 'flight',
      id: booking.value._id,
      provider: 'amadeus',
    }
  })
}

onMounted(async () => {
  if (route.query.pnr) {
    pnrInput.value = route.query.pnr as string
    await searchByPnr()
  }
})
</script>
