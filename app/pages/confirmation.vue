<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Booking Confirmed!</h2>
      <p class="mt-2 text-sm text-gray-600">
        Your booking reference is <span class="font-bold text-gray-900">#FB-829304</span>.
        We've sent a confirmation email to your inbox.
      </p>
      
      <div class="mt-8">
        <UiBaseButton size="lg" block @click="goHome">Back to Home</UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'

const goHome = () => {
  navigateTo('/')
}
</script>
