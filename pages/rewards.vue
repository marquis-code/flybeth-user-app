<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Flybeth Rewards - Save & Earn</h1>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Join the Flybeth Rewards program to earn points on every flight, hotel, and car rental. Redeem points for future travel and unlock exclusive member discounts.</p>
        
        <div class="max-w-md mx-auto flex gap-4">
          <button class="flex-1 bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Join for Free</button>
          <button class="flex-1 bg-white border-2 border-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">Sign In</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Flybeth Rewards | Save & Earn Points on Travel',
  meta: [
    { name: 'description', content: 'Earn points on every booking with Flybeth Rewards. Redeem for free flights, hotels, and exclusive travel discounts.' }
  ]
})
</script>
