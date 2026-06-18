<template>
  <div class="max-w-5xl mx-auto pb-16">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">My Bookings</h1>
        <p class="text-gray-500 font-medium mt-1">Manage and view your flight itineraries and past trips</p>
      </div>
      <button 
        @click="fetchBookings"
        class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-200"
      >
        <RefreshCcw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        Refresh
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-24 bg-white rounded-[24px] border border-gray-100 shadow-sm">
      <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
        <Briefcase class="h-10 w-10 text-brand-blue" />
      </div>
      <h3 class="text-xl font-black text-gray-900 mb-2">No bookings found</h3>
      <p class="text-gray-500 mb-8 font-medium">You haven't made any bookings yet.</p>
      <NuxtLink to="/flights" class="px-8 py-3.5 bg-brand-blue text-white rounded-xl font-bold hover:bg-[#0D1DAD] transition-all shadow-lg shadow-brand-blue/20">
        Explore Flights
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="booking in bookings" 
        :key="booking._id"
        class="bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden flex flex-col"
      >
        <!-- Top Header Banner -->
        <div class="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-6">
            <div>
              <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Booking Reference</p>
              <p class="text-sm font-black text-gray-900 flex items-center gap-2">
                {{ booking.pnr }}
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="{
                    'bg-green-100 text-green-700': ['ticketed', 'confirmed', 'completed'].includes(booking.status),
                    'bg-amber-100 text-amber-700': booking.status === 'pending' || booking.status === 'pending_payment',
                    'bg-red-100 text-red-700': booking.status === 'cancelled'
                  }"
                >
                  {{ booking.status.replace('_', ' ') }}
                </span>
              </p>
            </div>
            <div class="hidden sm:block w-px h-8 bg-gray-200"></div>
            <div class="hidden sm:block">
              <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Booked On</p>
              <p class="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <Calendar class="w-4 h-4 text-gray-400" />
                {{ formatDate(booking.createdAt) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
             <button 
                @click.stop="downloadReceipt(booking)" 
                class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors"
              >
                <Download class="w-3.5 h-3.5" />
                Receipt
              </button>
             <button 
                @click="viewBooking(booking)" 
                class="flex items-center gap-1 px-3 py-1.5 bg-brand-blue text-white hover:bg-[#0D1DAD] text-xs font-bold rounded-lg transition-colors shadow-sm shadow-brand-blue/20"
              >
                Manage
                <ChevronRight class="w-3.5 h-3.5" />
              </button>
          </div>
        </div>

        <!-- Main Content Body -->
        <div class="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center cursor-pointer" @click="viewBooking(booking)">
          
          <!-- Itinerary Visual -->
          <div class="flex-1 w-full">
            <div class="flex items-center justify-between mb-4">
              <span class="px-2.5 py-1 bg-blue-50 text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 w-max">
                <Plane class="w-3.5 h-3.5" />
                {{ booking.isRoundTrip ? 'Round Trip' : 'One Way' }} Flight
              </span>
              <div v-if="booking.remoteOrderId" class="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                <Hash class="w-3.5 h-3.5" />
                Order: {{ booking.remoteOrderId }}
              </div>
            </div>

            <div class="flex items-center justify-between mt-2">
              <div class="flex-1">
                <h3 class="text-2xl font-black text-gray-900 tracking-tight">
                  {{ booking.flights?.[0]?.flight?.departure?.iataCode || 'Origin' }}
                </h3>
                <p class="text-xs font-medium text-gray-500 mt-1 truncate max-w-[120px]">
                  {{ booking.flights?.[0]?.flight?.departure?.city || 'Departure City' }}
                </p>
              </div>

              <div class="flex flex-col items-center flex-1 px-4">
                <p class="text-[10px] font-bold text-gray-400 mb-1 capitalize">{{ booking.flights?.[0]?.class || 'Economy' }} Class</p>
                <div class="w-full flex items-center">
                  <div class="h-0.5 flex-1 bg-gray-200"></div>
                  <Plane class="w-5 h-5 text-brand-blue mx-2" />
                  <div class="h-0.5 flex-1 bg-gray-200"></div>
                </div>
                <p class="text-[10px] font-bold text-gray-400 mt-1">{{ booking.flights?.[0]?.provider || 'Direct' }}</p>
              </div>

              <div class="flex-1 text-right">
                <h3 class="text-2xl font-black text-gray-900 tracking-tight">
                  {{ booking.flights?.[0]?.flight?.arrival?.iataCode || 'Dest' }}
                </h3>
                <p class="text-xs font-medium text-gray-500 mt-1 truncate max-w-[120px] ml-auto">
                  {{ booking.flights?.[0]?.flight?.arrival?.city || 'Arrival City' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="hidden md:block w-px h-24 bg-gray-100"></div>

          <!-- Booking Summary -->
          <div class="w-full md:w-64 shrink-0 flex flex-col justify-center space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Users class="w-4 h-4" />
                Passengers
              </p>
              <p class="text-sm font-black text-gray-900">{{ booking.totalPassengers || 1 }}</p>
            </div>
            
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <span class="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-[10px] font-black text-gray-600">$</span>
                Payment
              </p>
              <p class="text-xs font-black uppercase"
                :class="{
                  'text-green-600': booking.payment?.status === 'success' || booking.payment?.status === 'completed',
                  'text-amber-600': booking.payment?.status === 'pending',
                  'text-red-600': booking.payment?.status === 'failed'
                }"
              >
                {{ booking.payment?.status || 'Pending' }}
              </p>
            </div>

            <div class="pt-4 border-t border-gray-100">
              <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Amount</p>
              <p class="text-2xl font-black text-brand-blue tracking-tight">{{ formatPrice(booking.pricing?.totalAmount, booking.pricing?.currency) }}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- Reusing existing drawer component -->
    <BookingDetailsDrawer 
      :visible="showDrawer" 
      :pnr="selectedPnr" 
      @close="showDrawer = false" 
    />

    <!-- Hidden Receipt Template for PDF Generation -->
    <div v-if="receiptBooking" id="pdf-receipt-template" class="absolute left-[-9999px] top-0 w-[800px] bg-white p-12 font-sans text-gray-900 border border-gray-100">
      <div class="flex justify-between items-center border-b border-gray-200 pb-8 mb-8">
        <div>
          <img src="@/assets/img/logo.png" alt="Flybeth Logo" class="h-10 mb-2" crossorigin="anonymous" />
          <p class="text-sm text-gray-500 font-medium">Your trusted travel partner</p>
        </div>
        <div class="text-right">
          <h2 class="text-4xl font-black text-brand-blue tracking-tight mb-2">RECEIPT</h2>
          <p class="text-lg font-bold text-gray-700">#{{ receiptBooking.pnr }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ formatDate(receiptBooking.createdAt) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Billed To</p>
          <p class="text-base font-bold text-gray-900">{{ receiptBooking.contactDetails?.name || 'Customer' }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ receiptBooking.contactDetails?.email }}</p>
          <p class="text-sm text-gray-600">{{ receiptBooking.contactDetails?.phone }}</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Payment Status</p>
          <p class="text-base font-bold"
            :class="{
              'text-green-600': receiptBooking.payment?.status === 'success' || receiptBooking.payment?.status === 'completed',
              'text-amber-600': receiptBooking.payment?.status === 'pending',
              'text-red-600': receiptBooking.payment?.status === 'failed'
            }"
          >
            {{ (receiptBooking.payment?.status || 'Pending').toUpperCase() }}
          </p>
          <p class="text-sm text-gray-600 mt-1" v-if="receiptBooking.payment?.paidAt">
            Paid: {{ formatDate(receiptBooking.payment.paidAt) }}
          </p>
        </div>
      </div>

      <div class="mb-10">
        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 border-b border-gray-100 pb-2">Itinerary Summary</p>
        <div class="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
          <div>
             <h3 class="text-xl font-black text-gray-900">
               {{ receiptBooking.flights?.[0]?.flight?.departure?.iataCode || 'Origin' }} 
               <ArrowRight class="inline w-4 h-4 mx-2 text-gray-400" /> 
               {{ receiptBooking.flights?.[0]?.flight?.arrival?.iataCode || 'Destination' }}
             </h3>
             <p class="text-sm text-gray-600 mt-1 capitalize">{{ receiptBooking.isRoundTrip ? 'Round Trip' : 'One Way' }} • {{ receiptBooking.flights?.[0]?.class || 'Economy' }} Class</p>
          </div>
          <div class="text-right">
             <p class="text-sm font-bold text-gray-700">{{ receiptBooking.totalPassengers }} Passenger(s)</p>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 border-b border-gray-100 pb-2">Charge Breakdown</p>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 font-medium">Base Fare</span>
            <span class="font-bold text-gray-900">{{ formatPrice(receiptBooking.pricing?.baseFare, receiptBooking.pricing?.currency) }}</span>
          </div>
          <div class="flex justify-between" v-if="receiptBooking.pricing?.taxes">
            <span class="text-gray-600 font-medium">Taxes & Fees</span>
            <span class="font-bold text-gray-900">{{ formatPrice(receiptBooking.pricing?.taxes, receiptBooking.pricing?.currency) }}</span>
          </div>
          <div class="flex justify-between" v-if="receiptBooking.pricing?.insuranceAmount">
            <span class="text-gray-600 font-medium">Travel Insurance</span>
            <span class="font-bold text-gray-900">{{ formatPrice(receiptBooking.pricing?.insuranceAmount, receiptBooking.pricing?.currency) }}</span>
          </div>
          <div class="flex justify-between" v-if="receiptBooking.pricing?.vipSupportAmount">
            <span class="text-gray-600 font-medium">VIP Support</span>
            <span class="font-bold text-gray-900">{{ formatPrice(receiptBooking.pricing?.vipSupportAmount, receiptBooking.pricing?.currency) }}</span>
          </div>
          <div class="flex justify-between pt-4 border-t border-gray-200 mt-4">
            <span class="text-base font-black text-gray-900">Total Amount</span>
            <span class="text-xl font-black text-brand-blue">{{ formatPrice(receiptBooking.pricing?.totalAmount, receiptBooking.pricing?.currency) }}</span>
          </div>
        </div>
      </div>

      <div class="text-center pt-8 border-t border-gray-100 mt-16">
        <p class="text-xs text-gray-400 font-medium">Thank you for booking with Flybeth!</p>
        <p class="text-xs text-gray-400">For support, please contact us at support@flybeth.com</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bookingsApi } from '@/api_factory/modules/bookings'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useSettings } from '~/composables/useSettings'
import { Briefcase, Plane, ArrowRight, ChevronRight, Download, Users, Calendar, Hash, RefreshCcw } from 'lucide-vue-next'
import BookingDetailsDrawer from '@/components/checkout/BookingDetailsDrawer.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

definePageMeta({
  layout: 'profile'
})

const { showToast } = useCustomToast()

const formatPrice = (amount: number, currency: string = 'USD') => {
  if (amount === undefined || amount === null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

const formatDate = (dateString: string) => {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const loading = ref(false)
const bookings = ref<any[]>([])

const showDrawer = ref(false)
const selectedPnr = ref('')

const receiptBooking = ref<any>(null)
const isDownloading = ref(false)

const fetchBookings = async () => {
  loading.value = true
  try {
    const { data } = await bookingsApi.getMyBookings({})
    bookings.value = data.data || data
  } catch (err: any) {
    showToast({
      title: "Error",
      message: err.response?.data?.message || "Failed to fetch bookings",
      toastType: "error",
    })
  } finally {
    loading.value = false
  }
}

const viewBooking = (booking: any) => {
  selectedPnr.value = booking.pnr
  showDrawer.value = true
}

const downloadReceipt = async (booking: any) => {
  if (isDownloading.value) return;
  isDownloading.value = true;
  receiptBooking.value = booking;
  
  showToast({
    title: "Generating Receipt",
    message: `PDF receipt for ${booking.pnr} is being generated...`,
    toastType: "info"
  });

  // Wait for Vue to render the hidden template
  setTimeout(async () => {
    try {
      const element = document.getElementById('pdf-receipt-template');
      if (!element) throw new Error("Receipt template not found");

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Flybeth_Receipt_${booking.pnr}.pdf`);
      
      showToast({
        title: "Success",
        message: "Receipt downloaded successfully",
        toastType: "success"
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      showToast({
        title: "Error",
        message: "Failed to generate receipt",
        toastType: "error"
      });
    } finally {
      receiptBooking.value = null;
      isDownloading.value = false;
    }
  }, 500);
}

onMounted(() => {
  fetchBookings()
})
</script>
