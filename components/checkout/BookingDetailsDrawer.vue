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
            class="relative w-full max-w-[500px] max-h-[90vh] bg-white shadow-2xl flex flex-col rounded-[24px] overflow-hidden"
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
            <div class="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
              <div v-if="loading" class="py-12 flex flex-col items-center justify-center space-y-4">
                <div class="w-12 h-12 border-4 border-[#0D1DAD] border-t-transparent rounded-full animate-spin"></div>
                <p class="text-sm text-gray-500 font-medium">Loading booking details...</p>
              </div>
              
              <div v-else-if="error" class="py-8 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p class="text-red-600 font-bold mb-2">Failed to load booking</p>
                <p class="text-gray-500 text-sm">{{ error }}</p>
                <button @click="fetchBooking" class="mt-6 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">Try Again</button>
              </div>
              
              <template v-else-if="booking">
                <!-- Status Banner -->
                <div class="flex items-center gap-4 p-5 rounded-2xl border bg-white shadow-sm" :class="statusStyles.borderClass">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" :class="statusStyles.iconBgClass">
                    <svg v-if="['confirmed', 'completed', 'ticketed'].includes(booking.status)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <svg v-else-if="booking.status === 'pending_payment'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-black uppercase" :class="statusStyles.textClass">Status</p>
                    <p class="text-lg font-black text-gray-900 capitalize">{{ formatStatus(booking.status) }}</p>
                  </div>
                </div>

                <!-- Passengers -->
                <div>
                  <h3 class="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-wider px-1">Travelers</h3>
                  <div class="space-y-3">
                    <div v-for="(p, i) in booking.passengers" :key="i" class="p-4 border border-gray-100 rounded-[20px] bg-white shadow-sm flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-blue-50 text-[#0D1DAD] flex items-center justify-center font-black text-sm shrink-0">
                        {{ p.firstName[0] }}{{ p.lastName[0] }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-bold text-gray-900 truncate text-[15px]">{{ p.title }} {{ p.firstName }} {{ p.lastName }}</p>
                        <p class="text-xs font-semibold text-gray-500 capitalize mt-0.5">{{ p.type }} &bull; {{ p.gender }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contact -->
                <div>
                  <h3 class="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-wider px-1">Contact Information</h3>
                  <div class="p-5 border border-gray-100 rounded-[20px] bg-white shadow-sm">
                    <div class="flex items-center gap-3 mb-4">
                      <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <p class="font-bold text-gray-900 text-sm">{{ booking.contactDetails?.email }}</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <p class="font-bold text-gray-900 text-sm">{{ booking.contactDetails?.phone }}</p>
                    </div>
                  </div>
                </div>

                <!-- Pricing -->
                <div>
                  <h3 class="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-wider px-1">Payment Breakdown</h3>
                  <div class="p-6 border border-gray-100 rounded-[20px] bg-white shadow-sm space-y-4">
                    <div class="flex justify-between items-center text-[13px] font-semibold text-gray-500">
                      <span>Base Fare</span>
                      <span class="text-gray-900">{{ formatMoney(booking.pricing?.baseFare) }}</span>
                    </div>
                    <div class="flex justify-between items-center text-[13px] font-semibold text-gray-500">
                      <span>Taxes & Fees</span>
                      <span class="text-gray-900">{{ formatMoney(booking.pricing?.taxes) }}</span>
                    </div>
                    <div v-if="addonAmount > 0" class="flex justify-between items-center text-[13px] font-semibold text-[#0D1DAD]">
                      <span>Add-ons / Extras</span>
                      <span>+{{ formatMoney(addonAmount) }}</span>
                    </div>
                    <div class="pt-4 border-t border-gray-100 flex justify-between items-end">
                      <div>
                        <span class="font-black text-gray-900 block text-base">Total</span>
                        <span class="text-[10px] font-semibold text-gray-400 uppercase">Includes taxes</span>
                      </div>
                      <span class="text-2xl font-black text-[#0D1DAD] tracking-tight">{{ formatMoney(booking.pricing?.totalAmount) }}</span>
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
