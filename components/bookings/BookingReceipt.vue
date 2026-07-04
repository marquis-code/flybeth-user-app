<template>
  <div id="booking-receipt-container" class="bg-white text-gray-900 w-[800px] p-10 font-sans mx-auto relative hidden-receipt shadow-xl overflow-hidden">
    <!-- Header -->
    <div class="flex justify-between items-start border-b-2 border-gray-100 pb-6 mb-8 relative z-10">
      <div>
        <h1 class="text-3xl font-black text-brand-blue flex items-center gap-2">
          <span class="text-4xl">✈</span> Flybeth
        </h1>
        <p class="text-sm font-medium text-gray-500 mt-1">Your trusted travel partner</p>
      </div>
      <div class="text-right">
        <h2 class="text-2xl font-bold uppercase text-gray-800">Booking Receipt</h2>
        <p class="text-sm text-gray-500 mt-1 font-medium">Issue Date: {{ formatDate(new Date()) }}</p>
      </div>
    </div>

    <!-- PNR and Status -->
    <div class="bg-brand-blue/5 rounded-2xl p-6 mb-8 flex justify-between items-center border border-brand-blue/10">
      <div>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Booking Reference</p>
        <p class="text-3xl font-black text-brand-blue tracking-tight">{{ booking?.pnr }}</p>
      </div>
      <div class="text-right">
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold uppercase" 
          :class="booking?.status === 'confirmed' ? 'bg-green-100 text-green-700' : (booking?.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')">
          <div class="w-2 h-2 rounded-full" :class="booking?.status === 'confirmed' ? 'bg-green-500' : (booking?.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500')"></div>
          {{ booking?.status }}
        </div>
      </div>
    </div>

    <!-- Flight Details -->
    <div v-if="booking?.flights?.length" class="mb-8">
      <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Flight Itinerary</h3>
      <div v-for="(flight, idx) in booking.flights" :key="idx" class="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-100 flex items-center justify-between">
        <div class="text-center w-1/3">
          <p class="text-3xl font-black text-gray-900">{{ flight.flight?.departure?.iataCode || flight.metadata?.origin || '—' }}</p>
          <p class="text-sm font-bold text-gray-500 mt-1">Origin</p>
        </div>
        <div class="flex-1 px-4 relative flex flex-col items-center">
          <div class="w-full h-px bg-gray-300 relative">
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-4 4-2.8-.9c-.4-.1-.8.1-1 .5L1 17l4 2 2 4c.4-.2.6-.6.5-1l-.9-2.8 4-4 4 6c.4-.2.7-.6.6-1.1z"/></svg>
            </div>
          </div>
          <p class="text-xs font-bold text-gray-400 mt-4">{{ flight.class || 'Economy' }}</p>
        </div>
        <div class="text-center w-1/3">
          <p class="text-3xl font-black text-gray-900">{{ flight.flight?.arrival?.iataCode || flight.metadata?.destination || '—' }}</p>
          <p class="text-sm font-bold text-gray-500 mt-1">Destination</p>
        </div>
      </div>
    </div>

    <div class="flex gap-8 mb-8">
      <!-- Passenger Details -->
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Traveler Details</h3>
        <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100 h-[120px]">
          <p class="text-sm font-bold text-gray-500 mb-1">Lead Passenger</p>
          <p class="text-lg font-black text-gray-900 mb-1">{{ booking?.contactDetails?.name || '—' }}</p>
          <p class="text-sm text-gray-600 font-medium">{{ booking?.contactDetails?.email || '—' }}</p>
          <p class="text-sm text-gray-600 font-medium">{{ booking?.contactDetails?.phone || '—' }}</p>
        </div>
      </div>

      <!-- Payment Summary -->
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Payment Breakdown</h3>
        <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100 h-[120px] flex flex-col justify-center">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-gray-500">Base Fare</span>
            <span class="text-sm font-bold text-gray-900">{{ formatPrice(booking?.pricing?.baseFare) }}</span>
          </div>
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-bold text-gray-500">Taxes & Fees</span>
            <span class="text-sm font-bold text-gray-900">{{ formatPrice(booking?.pricing?.taxes + booking?.pricing?.fees) }}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-gray-200">
            <span class="text-sm font-black text-gray-800 uppercase tracking-wide">Total Paid</span>
            <span class="text-lg font-black text-brand-blue">{{ formatPrice(booking?.pricing?.totalAmount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 text-center border-t border-gray-100 pt-8 pb-4">
      <p class="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Thank you for booking with Flybeth</p>
      <p class="text-xs text-gray-400">If you have any questions about your booking, please contact our support team.</p>
    </div>
    
    <!-- Watermark Background -->
    <div class="absolute inset-0 z-[-1] flex items-center justify-center opacity-[0.02] pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettings } from '~/composables/useSettings'

const props = defineProps({
  booking: { type: Object, required: true }
})

const { formatPrice } = useSettings()

const formatDate = (date: Date | string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
/* We make it position absolute and visually hidden off-screen, so html2canvas can still render it */
.hidden-receipt {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 800px; /* Fixed width for consistent PDF generation */
  background: white;
}
</style>
