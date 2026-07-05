<template>
  <div class="min-h-screen bg-gray-50 relative overflow-hidden font-sans text-gray-900">
    
    <!-- Background Accents -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A24B]/5 blur-[120px] pointer-events-none"></div>

    <!-- Hero Header -->
    <div class="relative bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white pt-24 pb-32 px-6">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      
      <div class="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 group text-xs font-bold uppercase tracking-wider">
            <div class="bg-white/10 p-1.5 rounded-full group-hover:-translate-x-1 transition-transform">
              <ChevronRight class="w-3 h-3 rotate-180" />
            </div>
            Back to Home
          </NuxtLink>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight mb-2">Manage Booking</h1>
          <p class="text-white/60 text-base font-medium max-w-md">View, manage, and download your flight or transfer details.</p>
        </div>

        <!-- Search Box (Floating on Desktop) -->
        <div class="w-full md:w-[380px] bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl">
          <label class="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-3">Booking Reference</label>
          <div class="relative">
            <input
              v-model="pnrInput"
              type="text"
              class="w-full bg-white/5 border border-white/20 text-white placeholder-white/30 rounded-xl py-3 pl-4 pr-12 text-sm font-bold uppercase tracking-wide focus:outline-none focus:border-[#C9A24B] focus:bg-white/10 transition-all"
              placeholder="e.g., MXT1Q9"
              @keyup.enter="searchByPnr"
            />
            <button 
              @click="searchByPnr"
              :disabled="loading || !pnrInput"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#C9A24B] hover:bg-[#A9822F] text-white rounded-lg disabled:opacity-50 transition-all"
            >
              <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
              <Search v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 pb-24">
      
      <!-- Loading State -->
      <div v-if="loading" class="bg-white/80 backdrop-blur-md rounded-3xl p-16 shadow-xl border border-white flex flex-col items-center justify-center">
        <div class="relative">
          <div class="w-16 h-16 rounded-full border-4 border-gray-100"></div>
          <div class="w-16 h-16 rounded-full border-4 border-[#C9A24B] border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p class="text-sm font-bold text-gray-500 uppercase tracking-widest mt-6">Retrieving Details</p>
      </div>

      <!-- Not Found State -->
      <div v-else-if="notFound" class="bg-white rounded-3xl p-16 shadow-xl border border-gray-100 text-center">
        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-3">Booking Not Found</h2>
        <p class="text-gray-500 max-w-md mx-auto">We couldn't find any reservation matching <span class="font-bold text-gray-900">{{ route.query.pnr }}</span>. Please check your reference code and try again.</p>
      </div>

      <!-- Booking Details -->
      <div v-else-if="booking" class="space-y-6">
        
        <!-- Status Banner & PNR -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center shadow-inner',
              booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
              booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
              'bg-amber-50 text-amber-600'
            ]">
              <CheckCircle2 v-if="booking.status === 'confirmed'" class="w-5 h-5" />
              <XCircle v-else-if="booking.status === 'cancelled'" class="w-5 h-5" />
              <RefreshCw v-else class="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Booking Status</p>
              <h2 :class="[
                'text-lg font-bold capitalize',
                booking.status === 'confirmed' ? 'text-green-700' :
                booking.status === 'cancelled' ? 'text-red-700' :
                'text-amber-700'
              ]">
                {{ booking.status }}
              </h2>
            </div>
          </div>

          <div class="flex flex-col md:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
            <div class="text-center md:text-right w-full md:w-auto">
              <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">PNR</p>
              <p class="text-xl font-black text-gray-900 tracking-wider font-mono">{{ booking.pnr }}</p>
            </div>
            
            <button 
              @click="downloadReceipt" 
              :disabled="downloadingReceipt" 
              class="w-full md:w-auto group flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
            >
              <RefreshCw v-if="downloadingReceipt" class="w-4 h-4 animate-spin" />
              <Download v-else class="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>{{ downloadingReceipt ? 'Generating...' : 'Download Receipt' }}</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column (Flight/Transfer Itinerary) -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Flight Itinerary -->
            <div v-if="booking.flights?.length" class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
              <!-- Decorative Edge -->
              <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C9A24B]"></div>
              
              <div class="p-6 sm:p-8 border-b border-gray-50 flex items-center gap-3">
                <Plane class="w-5 h-5 text-[#C9A24B]" />
                <h3 class="text-sm font-black uppercase text-gray-800 tracking-widest">Flight Itinerary</h3>
              </div>

              <div class="p-6 sm:p-8 space-y-4">
                <!-- Trip Type Header -->
                <div v-if="tripType" class="flex items-center justify-center mb-1">
                  <div class="bg-[#C9A24B] text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                    {{ tripType }}
                  </div>
                </div>

                <div v-for="(slice, idx) in flightSlices" :key="idx" class="relative group">
                  <!-- Slice indicator if multiple -->
                  <div v-if="flightSlices.length > 1" class="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0B1E3D] rounded-r-md z-10 hidden sm:block"></div>
                  
                  <!-- Flight Card -->
                  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-gray-50 group-hover:bg-blue-50/50 transition-colors rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700"></div>
                    
                    <!-- Origin -->
                    <div class="text-center sm:text-left w-full sm:w-1/3 relative z-10">
                      <p class="text-2xl font-black text-gray-900 tracking-tight">{{ getSliceOrigin(slice) }}</p>
                      <p class="text-[10px] font-bold text-gray-500 uppercase mt-1 tracking-wider">Origin</p>
                    </div>

                    <!-- Connection -->
                    <div class="flex-1 flex flex-col items-center relative px-4 w-full sm:min-w-[160px] z-10">
                      <div class="text-[9px] font-black text-[#C9A24B] uppercase mb-2 tracking-[0.15em] text-center">
                        {{ flightSlices.length > 1 ? `Route ${idx + 1}` : 'Direct / Connection' }}
                      </div>
                      <div class="w-full h-px bg-gray-300 relative flex items-center justify-center">
                        <div class="bg-gray-50 group-hover:bg-[#f3f8ff] px-2 text-[#C9A24B] transition-colors">
                          <Plane class="w-4 h-4" />
                        </div>
                      </div>
                      <div class="flex flex-col items-center mt-3 space-y-1">
                        <span class="text-[10px] font-bold text-gray-800 uppercase tracking-widest">{{ getSliceAirline(slice) || 'Airline' }} • {{ getSliceClass(slice) }}</span>
                        <span v-if="getSliceDepartureTime(slice)" class="text-[11px] text-gray-500 font-medium">
                          {{ new Date(getSliceDepartureTime(slice)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                        </span>
                      </div>
                    </div>

                    <!-- Destination -->
                    <div class="text-center sm:text-right w-full sm:w-1/3 relative z-10">
                      <p class="text-2xl font-black text-gray-900 tracking-tight">{{ getSliceDestination(slice) }}</p>
                      <p class="text-[10px] font-bold text-gray-500 uppercase mt-1 tracking-wider">Destination</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transfer Info (if applicable) -->
            <div v-if="booking.type === 'transfer' && booking.status !== 'cancelled'" class="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
               <div class="flex items-center gap-3 border-b border-gray-50 pb-6 mb-6">
                <Info class="w-5 h-5 text-red-500" />
                <h3 class="text-sm font-black uppercase text-gray-800 tracking-widest">Cancel Reservation</h3>
              </div>
              <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p class="text-gray-900 font-medium">Need to cancel your transfer?</p>
                  <p class="text-sm text-gray-500 mt-1">This action is irreversible and may be subject to fees.</p>
                </div>
                <button
                  @click="handleCancelTransfer(booking)"
                  :disabled="cancelling"
                  class="w-full sm:w-auto px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {{ cancelling ? 'Cancelling...' : 'Cancel Transfer' }}
                </button>
              </div>
            </div>
            
            <!-- Pending Payment CTA -->
            <div v-if="booking.payment?.status === 'pending' || booking.status === 'pending'" class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl shadow-lg shadow-orange-500/20 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 class="text-lg font-black mb-1">Payment Pending</h3>
                <p class="text-white/80 font-medium text-sm">Your booking is secured but awaits payment.</p>
              </div>
              <button
                @click="handlePayment"
                class="w-full md:w-auto px-8 py-3.5 bg-white text-orange-600 rounded-xl font-black uppercase tracking-wide hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Complete Payment
              </button>
            </div>

          </div>

          <!-- Right Column (Contact & Fare) -->
          <div class="space-y-6">
            
            <!-- Contact Info -->
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-5">Contact Info</h3>
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="bg-gray-50 p-2 rounded-lg text-gray-400">
                    <Search class="w-4 h-4 hidden" /> <!-- Spacer hack -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                    <p class="text-sm font-bold text-gray-900 mt-0.5">{{ booking.contactDetails?.firstName }} {{ booking.contactDetails?.lastName }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-gray-50 p-2 rounded-lg text-gray-400">
                    <Mail class="w-4 h-4" />
                  </div>
                  <div class="overflow-hidden">
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p class="text-sm font-bold text-gray-900 mt-0.5 truncate">{{ booking.contactDetails?.email }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-gray-50 p-2 rounded-lg text-gray-400">
                    <Phone class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                    <p class="text-sm font-bold text-gray-900 mt-0.5">{{ booking.contactDetails?.phone }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 pt-4 border-t border-gray-100">
                  <div class="bg-gray-50 p-2 rounded-lg text-gray-400">
                    <Calendar class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Booked On</p>
                    <p class="text-sm font-bold text-gray-900 mt-0.5">{{ formatDate(booking.bookedAt || booking.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fare Summary -->
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
               <div class="flex items-center gap-2 mb-5">
                <CreditCard class="w-4 h-4 text-gray-400" />
                <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fare Summary</h3>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500 font-medium">Base Fare</span>
                  <span class="font-bold text-gray-900">{{ formatPrice(booking.pricing?.baseFare) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500 font-medium">Taxes & Fees</span>
                  <span class="font-bold text-gray-900">{{ formatPrice(booking.pricing?.taxes) }}</span>
                </div>
                <div class="pt-3 mt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span class="text-sm font-black uppercase tracking-widest text-gray-900">Total Paid</span>
                  <span class="text-lg font-black text-[#C9A24B]">{{ formatPrice(booking.pricing?.totalAmount) }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, navigateTo } from '#app'
import { bookingsApi } from '@/api_factory/modules/bookings'
import { transfersApi } from '@/api_factory/modules/transfers'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useConfirmation } from '@/composables/core/useConfirmation'
import { useSettings } from '~/composables/useSettings'

import { Search, Download, Plane, Info, Phone, Calendar, Mail, CreditCard, ChevronRight, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-vue-next'

const { confirm } = useConfirmation()
const { showToast } = useCustomToast()
const route = useRoute()

const loading = ref(false)
const notFound = ref(false)
const cancelling = ref(false)
const downloadingReceipt = ref(false)
const booking = ref<any>(null)
const pnrInput = ref('')

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'
const { formatPrice } = useSettings()

const flightSlices = computed(() => {
  if (!booking.value?.flights?.length) return []
  const firstFlight = booking.value.flights[0]
  if (firstFlight?.metadata?.slices?.length) {
    return firstFlight.metadata.slices
  }
  if (firstFlight?.metadata?.itineraries?.length) {
    return firstFlight.metadata.itineraries
  }
  return booking.value.flights
})

const tripType = computed(() => {
  if (!flightSlices.value || flightSlices.value.length === 0) return ''
  if (booking.value?.isRoundTrip) return 'Round Trip'
  if (flightSlices.value.length === 1) return 'One Way'
  if (flightSlices.value.length === 2) return 'Round Trip'
  return 'Multi City'
})

const getSliceOrigin = (slice: any) => {
  const getCode = (val: any) => typeof val === 'object' ? (val?.iata_code || val?.iataCode || val?.code || val?.name || '') : val
  if (slice.origin) return getCode(slice.origin)
  if (slice.segments && slice.segments.length > 0) return getCode(slice.segments[0].departure?.iataCode || slice.segments[0].origin)
  if (slice.flight?.departure?.iataCode) return getCode(slice.flight.departure.iataCode)
  return getCode(slice.metadata?.origin) || '—'
}

const getSliceDestination = (slice: any) => {
  const getCode = (val: any) => typeof val === 'object' ? (val?.iata_code || val?.iataCode || val?.code || val?.name || '') : val
  if (slice.destination) return getCode(slice.destination)
  if (slice.segments && slice.segments.length > 0) return getCode(slice.segments[slice.segments.length - 1].arrival?.iataCode || slice.segments[slice.segments.length - 1].destination)
  if (slice.flight?.arrival?.iataCode) return getCode(slice.flight.arrival.iataCode)
  return getCode(slice.metadata?.destination) || '—'
}

const getSliceAirline = (slice: any) => {
  const getName = (val: any) => typeof val === 'object' ? (val?.name || val?.iata_code || val?.iataCode || val?.code || '') : val
  if (slice.airline) return getName(slice.airline)
  if (slice.segments && slice.segments.length > 0) return getName(slice.segments[0].airline || slice.segments[0].carrierCode)
  return getName(slice.metadata?.airline || slice.flight?.airline) || ''
}

const getSliceClass = (slice: any) => {
  if (slice.class) return slice.class
  return booking.value?.flights?.[0]?.class || 'Economy'
}

const getSliceDepartureTime = (slice: any) => {
  if (slice.departureTime) return slice.departureTime
  if (slice.segments && slice.segments.length > 0) return slice.segments[0].departure?.at || slice.segments[0].departureTime
  return slice.metadata?.departureTime || slice.flight?.departureTime
}

const downloadReceipt = async () => {
  if (typeof window === 'undefined' || !booking.value?.pnr) return;
  downloadingReceipt.value = true;
  
  try {
    const response = await bookingsApi.downloadReceipt(booking.value.pnr);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Receipt_${booking.value.pnr}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast({ title: 'Success', message: 'Receipt downloaded successfully', toastType: 'success' });
  } catch (error: any) {
    showToast({ title: 'Error', message: 'Failed to download receipt', toastType: 'error' });
  } finally {
    downloadingReceipt.value = false;
  }
}

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
      type: booking.value.type || 'flight',
      id: booking.value._id,
      provider: booking.value.provider || 'duffel',
    }
  })
}

const handleCancelTransfer = async (bkg: any) => {
  // Use professional custom confirm if available, otherwise just use toast for now or simple check
  // For now I'll use the showToast to inform the user it's processing if they click. 
  // Actually, I'll assume they want to proceed if they clicked the red button, but usually confirmation is good.
  // The user didn't specify a new modal for this specific case, but I'll stick to Toast for feedback.
  const confirmed = await confirm({
    title: 'Cancel Booking',
    message: 'Are you sure you want to permanently cancel this transfer booking? This action is irreversible and may be subject to cancellation fees.',
    confirmText: 'Yes, Cancel Booking',
    variant: 'danger'
  })
  if (!confirmed) return
  
  cancelling.value = true
  try {
    const payload = {
      orderId: bkg.metadata?.orderId || bkg.orderId || bkg.id || bkg._id,
      confirmNbr: bkg.pnr || bkg.metadata?.confirmationNumber,
      provider: bkg.provider || 'duffel'
    }
    
    await transfersApi.cancel(payload)
    showToast({
      title: "Transfer Cancelled",
      message: "Your transfer booking has been successfully cancelled.",
      toastType: "success",
    });
    booking.value.status = 'cancelled'
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to cancel transfer'
    showToast({
      title: "Cancellation Error",
      message: msg,
      toastType: "error",
    });
  } finally {
    cancelling.value = false
  }
}

onMounted(async () => {
  if (route.query.pnr) {
    pnrInput.value = route.query.pnr as string
    await searchByPnr()
  }
})
</script>
