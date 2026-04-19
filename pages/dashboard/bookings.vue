<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm  text-gray-400 uppercase tracking-[0.25em] mb-1">My Account</p>
            <h1 class="text-3xl  text-gray-900">My Bookings</h1>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="activeFilter = ''"
              :class="['px-4 py-2 rounded-xl text-xs  uppercase tracking-widest transition-all', !activeFilter ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:border-brand-blue/30']"
            >All</button>
            <button
              @click="activeFilter = 'pending'"
              :class="['px-4 py-2 rounded-xl text-xs  uppercase tracking-widest transition-all', activeFilter === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:border-amber-200']"
            >Pending</button>
            <button
              @click="activeFilter = 'confirmed'"
              :class="['px-4 py-2 rounded-xl text-xs  uppercase tracking-widest transition-all', activeFilter === 'confirmed' ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:border-green-200']"
            >Confirmed</button>
            <button
              @click="activeFilter = 'cancelled'"
              :class="['px-4 py-2 rounded-xl text-xs  uppercase tracking-widest transition-all', activeFilter === 'cancelled' ? 'bg-red-500 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:border-red-200']"
            >Cancelled</button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 gap-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-40"></div>
      </div>

      <!-- No Bookings -->
      <div v-else-if="!filteredBookings.length" class="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </div>
        <h2 class="text-xl  text-gray-900 mb-2">No Bookings Found</h2>
        <p class="text-gray-400 font-bold text-sm mb-8">
          {{ activeFilter ? `You have no ${activeFilter} bookings.` : 'You haven\'t made any bookings yet.' }}
        </p>
        <NuxtLink to="/flights" class="inline-flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-xl  text-sm uppercase tracking-widest hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Flights
        </NuxtLink>
      </div>

      <!-- Bookings List -->
      <div v-else class="grid grid-cols-1 gap-4">
        <div
          v-for="booking in filteredBookings"
          :key="booking._id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-blue/20 transition-all duration-300 overflow-hidden"
        >
          <!-- Top Status Bar -->
          <div :class="['h-1.5 w-full', booking.status === 'confirmed' ? 'bg-green-400' : booking.status === 'cancelled' ? 'bg-red-400' : 'bg-amber-400']"></div>

          <div class="p-6">
            <div class="flex items-start justify-between mb-5">
              <div class="flex items-center gap-3">
                <div :class="['w-2.5 h-2.5 rounded-full mt-1', booking.status === 'confirmed' ? 'bg-green-400' : booking.status === 'cancelled' ? 'bg-red-400' : 'bg-amber-400 animate-pulse']"></div>
                <div>
                  <p class="text-sm  text-gray-400 uppercase tracking-widest">Reference</p>
                  <p class="text-xl  text-gray-900">{{ booking.pnr }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm  text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <span :class="[
                  'px-3 py-1 rounded-full text-sm  uppercase tracking-widest',
                  booking.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                  booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                  'bg-amber-50 text-amber-700'
                ]">{{ booking.status }}</span>
              </div>
            </div>

            <!-- Flight Route: based on flights -->
            <div v-if="booking.flights?.length" class="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
              <div class="text-center">
                <p class="text-xl  text-gray-900">{{ booking.flights[0]?.flight?.departure?.iataCode || '—' }}</p>
                <p class="text-[9px] font-bold text-gray-400">Origin</p>
              </div>
              <div class="flex flex-col items-center gap-1 flex-1">
                <div class="w-full flex items-center gap-1">
                  <div class="flex-1 h-[1px] bg-gray-200"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <div class="flex-1 h-[1px] bg-gray-200"></div>
                </div>
                <span class="text-[9px]  text-gray-400 uppercase">{{ booking.flights[0]?.class || 'Economy' }}</span>
              </div>
              <div class="text-center">
                <p class="text-xl  text-gray-900">{{ booking.flights[0]?.flight?.arrival?.iataCode || '—' }}</p>
                <p class="text-[9px] font-bold text-gray-400">Destination</p>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm  text-gray-400 uppercase tracking-wider">Booked on</p>
                <p class="text-sm font-bold text-gray-600">{{ formatDate(booking.bookedAt || booking.createdAt) }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm  text-gray-400 uppercase tracking-wider">Total</p>
                <p class="text-xl  text-gray-900">{{ booking.pricing?.currency }} {{ formatPrice(booking.pricing?.totalAmount) }}</p>
              </div>
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/bookings?pnr=${booking.pnr}`"
                  class="px-4 py-2 bg-gray-50 text-gray-900 rounded-xl text-xs  uppercase tracking-widest hover:bg-gray-100 border border-gray-100 transition-all"
                >
                  View Details
                </NuxtLink>
                <button
                  v-if="booking.payment?.status !== 'success' && booking.status !== 'cancelled' && booking.status !== 'confirmed'"
                  @click="handlePayment(booking)"
                  class="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs  uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useFetchMyBookings } from '@/composables/modules/bookings/useFetchMyBookings'

definePageMeta({ middleware: 'auth' })

const { loading, bookings, fetchMyBookings } = useFetchMyBookings()
const activeFilter = ref('')

const filteredBookings = computed(() => {
  if (!bookings.value?.length) return []
  if (!activeFilter.value) return bookings.value
  return bookings.value.filter((b: any) => b.status === activeFilter.value)
})

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const formatPrice = (p: number) => p?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'

const handlePayment = (booking: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'flight',
      id: booking._id,
      pnr: booking.pnr,
      provider: 'amadeus',
    }
  })
}

onMounted(() => {
  fetchMyBookings({ limit: 20 })
})
</script>
