<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="visible" class="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <transition name="fade">
          <div 
            v-if="visible"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            @click="$emit('close')"
          ></div>
        </transition>

        <!-- Modal Content -->
        <transition name="modal">
          <div 
            v-if="visible"
            class="relative w-full h-full md:h-[90vh] md:max-h-[900px] max-w-[1000px] bg-white shadow-2xl flex flex-col md:rounded-[24px] overflow-hidden"
          >
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <h2 class="text-lg font-black text-gray-900 tracking-tight">Booking Reference: {{ pnr }}</h2>
              <button 
                @click="$emit('close')" 
                class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
              <div v-if="loading" class="py-24 flex flex-col items-center justify-center space-y-4">
                <div class="w-12 h-12 border-4 border-[#0D1DAD] border-t-transparent rounded-full animate-spin"></div>
                <p class="text-sm text-gray-500 font-medium">Loading booking details...</p>
              </div>
              
              <div v-else-if="error" class="py-24 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p class="text-red-600 font-bold mb-2">Failed to load booking</p>
                <p class="text-gray-500 text-sm">{{ error }}</p>
                <button @click="fetchBooking" class="mt-6 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">Try Again</button>
              </div>
              
              <template v-else-if="booking">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  
                  <!-- Left Column: Primary Details -->
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Status Banner -->
                    <div class="flex items-center gap-4 p-5 rounded-2xl border bg-white shadow-sm" :class="statusStyles.borderClass">
                      <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" :class="statusStyles.iconBgClass">
                        <svg v-if="['confirmed', 'completed', 'ticketed'].includes(booking.status)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <svg v-else-if="booking.status === 'pending_payment'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                      <div>
                        <p class="text-[11px] font-black uppercase tracking-wider" :class="statusStyles.textClass">Status</p>
                        <p class="text-xl font-black text-gray-900 capitalize">{{ formatStatus(booking.status) }}</p>
                      </div>
                    </div>

                    <!-- Flight Details -->
                    <div v-if="booking.flights && booking.flights.length">
                      <h3 class="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-wider px-1">Flight Details</h3>
                      <div class="space-y-4">
                        <div v-for="(flt, idx) in booking.flights" :key="idx" class="p-6 border border-gray-100 rounded-[20px] bg-white shadow-sm">
                          <div class="flex items-center justify-between gap-4">
                            <div class="text-center">
                              <p class="text-3xl font-black text-gray-900">{{ flt.flight?.departure?.iataCode || flt.metadata?.origin || '—' }}</p>
                              <p class="text-sm font-bold text-gray-500 mt-1">Origin</p>
                            </div>
                            <div class="flex-1 flex flex-col items-center justify-center relative px-4">
                              <div class="w-full h-[2px] bg-gray-200 relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 bg-white px-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                              <span class="text-[11px] font-black text-[#0D1DAD] uppercase tracking-wider mt-3">{{ flt.metadata?.airline ? flt.metadata.airline + ' • ' : '' }}{{ flt.class || 'Economy' }}</span>
                            </div>
                            <div class="text-center">
                              <p class="text-3xl font-black text-gray-900">{{ flt.flight?.arrival?.iataCode || flt.metadata?.destination || '—' }}</p>
                              <p class="text-sm font-bold text-gray-500 mt-1">Destination</p>
                            </div>
                          </div>
                          
                          <!-- Additional Flight Info (Date/Time) -->
                          <div v-if="flt.metadata?.departureTime || flt.flight?.departureTime" class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Departure Date</p>
                              <p class="text-sm font-bold text-gray-900 mt-0.5">{{ new Date(flt.metadata?.departureTime || flt.flight?.departureTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }}</p>
                            </div>
                            <div class="text-right">
                              <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Time</p>
                              <p class="text-sm font-bold text-gray-900 mt-0.5">{{ new Date(flt.metadata?.departureTime || flt.flight?.departureTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Passengers -->
                    <div>
                      <h3 class="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-wider px-1">Travelers ({{ booking.totalPassengers || booking.passengers?.length }})</h3>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div v-for="(p, i) in booking.passengers" :key="i" class="p-5 border border-gray-100 rounded-[20px] bg-white shadow-sm flex items-start gap-4">
                          <div class="w-12 h-12 rounded-full bg-blue-50 text-[#0D1DAD] flex items-center justify-center font-black text-lg shrink-0">
                            {{ p.firstName[0] }}{{ p.lastName[0] }}
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="font-bold text-gray-900 truncate text-[16px]">{{ p.title }} {{ p.firstName }} {{ p.lastName }}</p>
                            <p class="text-xs font-semibold text-gray-500 capitalize mt-1">{{ p.type }} &bull; {{ p.gender }}</p>
                            <p class="text-xs text-gray-400 mt-1" v-if="p.nationality">Nationality: <span class="font-medium text-gray-600">{{ p.nationality }}</span></p>
                            <p class="text-xs text-gray-400 mt-0.5" v-if="p.passportNumber">Passport: <span class="font-medium text-gray-600">{{ p.passportNumber }}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column: Secondary Details -->
                  <div class="space-y-6">
                    <!-- Contact Information -->
                    <div>
                      <h3 class="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-wider px-1">Contact Details</h3>
                      <div class="p-6 border border-gray-100 rounded-[20px] bg-white shadow-sm space-y-4">
                        <div v-if="booking.contactDetails?.name">
                          <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Name</p>
                          <p class="font-bold text-gray-900 text-sm mt-0.5">{{ booking.contactDetails.name }}</p>
                        </div>
                        <div>
                          <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email Address</p>
                          <p class="font-bold text-gray-900 text-sm mt-0.5 break-all">{{ booking.contactDetails?.email }}</p>
                        </div>
                        <div>
                          <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Phone Number</p>
                          <p class="font-bold text-gray-900 text-sm mt-0.5">{{ booking.contactDetails?.phone }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Payment Breakdown -->
                    <div>
                      <h3 class="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-wider px-1">Payment Breakdown</h3>
                      <div class="p-6 border border-gray-100 rounded-[20px] bg-white shadow-sm space-y-4">
                        <div class="flex justify-between items-center text-sm font-semibold text-gray-500">
                          <span>Base Fare</span>
                          <span class="text-gray-900">{{ formatMoney(booking.pricing?.baseFare) }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm font-semibold text-gray-500">
                          <span>Taxes</span>
                          <span class="text-gray-900">{{ formatMoney(booking.pricing?.taxes) }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm font-semibold text-gray-500">
                          <span>Fees</span>
                          <span class="text-gray-900">{{ formatMoney(booking.pricing?.fees) }}</span>
                        </div>
                        
                        <div v-if="addonAmount > 0" class="flex justify-between items-center text-sm font-bold text-[#0D1DAD]">
                          <span>Extras & Services</span>
                          <span>+{{ formatMoney(addonAmount) }}</span>
                        </div>
                        
                        <div class="pt-5 border-t border-gray-100 flex justify-between items-end">
                          <div>
                            <span class="font-black text-gray-900 block text-lg">Total</span>
                            <span class="text-[10px] font-semibold text-gray-400 uppercase">Includes taxes</span>
                          </div>
                          <span class="text-3xl font-black text-[#0D1DAD] tracking-tight">{{ formatMoney(booking.pricing?.totalAmount) }}</span>
                        </div>
                        
                        <!-- Payment Status -->
                        <div class="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                          <span class="text-gray-500 font-medium">Payment Status</span>
                          <span class="font-bold uppercase" :class="booking.payment?.status === 'success' ? 'text-green-600' : 'text-amber-600'">
                            {{ booking.payment?.status || 'Pending' }}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Booking Dates -->
                    <div>
                      <h3 class="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-wider px-1">Booking Info</h3>
                      <div class="p-5 border border-gray-100 rounded-[20px] bg-white shadow-sm text-sm space-y-3">
                        <div class="flex justify-between items-center">
                          <span class="text-gray-500 font-medium">Booked On</span>
                          <span class="font-bold text-gray-900">{{ new Date(booking.bookedAt || booking.createdAt).toLocaleDateString() }}</span>
                        </div>
                        <div class="flex justify-between items-center" v-if="booking.expiresAt && booking.status !== 'ticketed' && booking.status !== 'confirmed'">
                          <span class="text-gray-500 font-medium">Expires On</span>
                          <span class="font-bold text-amber-600">{{ new Date(booking.expiresAt).toLocaleDateString() }}</span>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </template>
            </div>
          </div>
        </transition>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { bookingsApi } from '@/api_factory/modules/bookings'

const props = defineProps({
  visible: { type: Boolean, default: false },
  pnr: { type: String, required: true }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const error = ref('')
const booking = ref<any>(null)

const addonAmount = computed(() => {
  if (!booking.value?.pricing) return 0;
  return (booking.value.pricing.insuranceAmount || 0) + (booking.value.pricing.fees || 0) + (booking.value.pricing.agentServiceFee || 0);
})

const fetchBooking = async () => {
  if (!props.pnr) return
  loading.value = true
  error.value = ''
  try {
    const { data } = await bookingsApi.getByPnr(props.pnr)
    booking.value = data?.data || data
  } catch (err: any) {
    console.error('Failed to fetch booking details:', err)
    error.value = err.response?.data?.message || 'Could not retrieve booking details. Please try again later.'
  } finally {
    loading.value = false
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    // If we open it, we want to close ChatWidget if it was open
    // We can dispatch a custom event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('close-chat-bot')
      window.dispatchEvent(event)
    }

    if (!booking.value || booking.value.pnr !== props.pnr) {
      fetchBooking()
    }
  }
})

const formatMoney = (amount: number) => {
  const currency = booking.value?.pricing?.currency || 'USD'
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0)
  } catch {
    return `${currency} ${amount || 0}`
  }
}

const formatStatus = (status: string) => {
  if (!status) return ''
  return status.replace(/_/g, ' ')
}

const statusStyles = computed(() => {
  const status = booking.value?.status || ''
  if (status === 'confirmed' || status === 'completed' || status === 'ticketed') {
    return {
      borderClass: 'border-[#DCFCE7]',
      iconBgClass: 'bg-[#22C55E] text-white',
      textClass: 'text-[#166534]'
    }
  } else if (status === 'pending_payment' || status === 'booked' || status === 'pending') {
    return {
      borderClass: 'border-[#FEF3C7]',
      iconBgClass: 'bg-[#F59E0B] text-white',
      textClass: 'text-[#B45309]'
    }
  } else {
    return {
      borderClass: 'border-[#FEE2E2]',
      iconBgClass: 'bg-[#EF4444] text-white',
      textClass: 'text-[#991B1B]'
    }
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
