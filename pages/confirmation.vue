<template>
  <div class="confirmation-page">
    <!-- Branded Header -->
    <div class="confirmation-header">
      <img src="@/assets/img/logo.png" alt="Flybeth" class="header-logo" />
    </div>

    <div class="confirmation-content">
      <!-- Success Card -->
      <div class="success-card">
        <div class="success-icon-wrapper">
          <div class="success-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="success-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="success-ring ring-1"></div>
          <div class="success-ring ring-2"></div>
        </div>

        <h1 class="success-title">{{ statusTitle }}</h1>
        <p class="success-subtitle">{{ statusMessage }}</p>

        <!-- Booking Details -->
        <div class="booking-details">
          <div v-if="bookingRef" class="detail-row">
            <span class="detail-label">Booking Reference</span>
            <span class="detail-value highlight">{{ bookingRef }}</span>
          </div>
          <div v-if="orderId" class="detail-row">
            <span class="detail-label">Order ID</span>
            <span class="detail-value">{{ orderId }}</span>
          </div>
          <div v-if="paymentStatus" class="detail-row">
            <span class="detail-label">Payment Status</span>
            <span class="detail-value" :class="statusClass">{{ displayPaymentStatus }}</span>
          </div>
        </div>

        <p class="email-notice">
          We've sent a confirmation email with your booking details. Please check your inbox.
        </p>

        <!-- Actions -->
        <div class="action-buttons">
          <button @click="goHome" class="btn-primary">Back to Home</button>
          <button v-if="bookingRef" @click="viewBooking" class="btn-secondary">View Booking</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTracking } from '@/composables/core/useTracking'

const route = useRoute()
const { trackAction } = useTracking()

const bookingRef = computed(() => (route.query.pnr as string) || '')
const orderId = computed(() => (route.query.orderId as string) || '')
const paymentStatus = computed(() => (route.query.status as string) || 'booked')

onMounted(() => {
  trackAction('booking_completed', {
    pnr: bookingRef.value,
    orderId: orderId.value,
    status: paymentStatus.value
  })
})

const statusTitle = computed(() => {
  switch (paymentStatus.value) {
    case 'pending_payment': return 'Booking Created!'
    case 'booked': return 'Booking Confirmed! 🎉'
    case 'success': return 'Payment Successful! 🎉'
    default: return 'Booking Confirmed!'
  }
})

const statusMessage = computed(() => {
  switch (paymentStatus.value) {
    case 'pending_payment': return 'Your booking has been created. Complete payment to confirm your reservation.'
    case 'booked': return 'Your flight has been successfully booked with the airline.'
    case 'success': return 'Payment received! Your booking is fully confirmed.'
    default: return 'Your booking is confirmed. Have a great trip!'
  }
})

const displayPaymentStatus = computed(() => {
  switch (paymentStatus.value) {
    case 'pending_payment': return 'Pending Payment'
    case 'booked': return 'Booked'
    case 'success': return 'Paid'
    default: return paymentStatus.value
  }
})

const statusClass = computed(() => ({
  'status-pending': paymentStatus.value === 'pending_payment',
  'status-success': paymentStatus.value === 'success' || paymentStatus.value === 'booked',
}))

const goHome = () => navigateTo('/')
const viewBooking = () => {
  // Navigate to booking details if available
  if (bookingRef.value && bookingRef.value !== 'N/A') {
    navigateTo(`/bookings?pnr=${bookingRef.value}`)
  }
}
</script>

<style scoped>
.confirmation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f2f5 0%, #e8ecf2 100%);
}

.confirmation-header {
  display: flex;
  justify-content: center;
  padding: 2rem 0 1rem;
}

.header-logo {
  height: 48px;
  width: auto;
}

.confirmation-content {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.success-card {
  background: white;
  border-radius: 1.5rem;
  padding: 3rem 2.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.success-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0D1DAD 0%, #28a003 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  animation: pop-in 0.5s ease-out;
}

.success-check {
  width: 28px;
  height: 28px;
  color: white;
}

.success-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(50, 180, 4, 0.2);
}

.ring-1 {
  width: 80px;
  height: 80px;
  animation: ring-pulse 2s ease-out infinite;
}

.ring-2 {
  width: 100px;
  height: 100px;
  animation: ring-pulse 2s ease-out 0.5s infinite;
}

@keyframes pop-in {
  0% { transform: scale(0); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes ring-pulse {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.3); opacity: 0; }
}

.success-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: #1a2332;
  margin-bottom: 0.5rem;
}

.success-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.booking-details {
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.detail-row:not(:last-child) {
  border-bottom: 1px dashed #e5e7eb;
}

.detail-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 800;
  color: #1a2332;
}

.detail-value.highlight {
  color: #0D1DAD;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
}

.status-pending {
  color: #f59e0b !important;
}

.status-success {
  color: #0D1DAD !important;
}

.email-notice {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: #0D1DAD;
  color: white;
  border: none;
  padding: 0.85rem 2.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #0a1488;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 29, 173, 0.25);
}

.btn-secondary {
  background: white;
  color: #0D1DAD;
  border: 2px solid #0D1DAD;
  padding: 0.85rem 2.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(13, 29, 173, 0.05);
}
</style>
