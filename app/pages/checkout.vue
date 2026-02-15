<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Booking Details Column -->
        <div class="md:col-span-2 space-y-6">
          
          <!-- Traveler Details -->
          <div class="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
               <UserIcon class="h-6 w-6 mr-2 text-indigo-600" /> Traveler Details
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiBaseInput label="First Name" />
              <UiBaseInput label="Last Name" />
              <UiBaseInput label="Email Address" type="email" class="md:col-span-2" />
              <UiBaseInput label="Phone Number" type="tel" class="md:col-span-2" />
            </div>
          </div>

          <!-- Payment Details -->
           <div class="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
               <CreditCardIcon class="h-6 w-6 mr-2 text-indigo-600" /> Payment Information
            </h2>
            <div class="grid grid-cols-1 gap-4">
              <UiBaseInput label="Cardholder Name" />
              <UiBaseInput label="Card Number" placeholder="0000 0000 0000 0000" />
              <div class="grid grid-cols-2 gap-4">
                 <UiBaseInput label="Expiration Date" placeholder="MM/YY" />
                 <UiBaseInput label="CVV" placeholder="123" />
              </div>
            </div>
          </div>

           <UiBaseButton size="lg" block @click="completeBooking">Complete Booking</UiBaseButton>
           <p class="text-xs text-gray-500 text-center mt-2">By checking out you agree to our Terms and Conditions.</p>

        </div>

        <!-- Order Summary Column -->
        <div class="md:col-span-1">
          <div class="bg-white shadow-sm rounded-lg p-6 border border-gray-200 sticky top-4">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div class="border-b border-gray-200 pb-4 mb-4">
              <p class="font-medium text-gray-900">{{ bookingDetails.name }}</p>
              <p class="text-sm text-gray-500">Details (Dates, etc.)</p>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Base Price</span>
                <span class="font-medium text-gray-900">${{ bookingDetails.price.toFixed(2) }}</span>
              </div>
               <div class="flex justify-between text-sm">
                <span class="text-gray-600">Taxes & Fees</span>
                <span class="font-medium text-gray-900">${{ bookingDetails.tax.toFixed(2) }}</span>
              </div>
               <div class="flex justify-between text-base font-bold text-gray-900 pt-4 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>${{ bookingDetails.total.toFixed(2) }}</span>
              </div>
            </div>

             <div class="mt-6 bg-indigo-50 p-4 rounded-md">
                <p class="text-sm text-indigo-700">Free cancellation within 24 hours!</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, CreditCardIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const bookingDetails = computed(() => ({
  name: route.query.name || 'Selected Item',
  price: Number(route.query.price) || 0,
  tax: (Number(route.query.price) || 0) * 0.15,
  total: (Number(route.query.price) || 0) * 1.15
}))

const completeBooking = () => {
  navigateTo('/confirmation')
}
</script>
