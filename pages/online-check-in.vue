<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Online Check-in</h1>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Check in to your flight quickly and securely. Please enter your airline confirmation code and last name to retrieve your boarding pass.</p>
        
        <div class="max-w-md mx-auto space-y-4">
          <input type="text" placeholder="Confirmation Code (PNR)" class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-blue" />
          <input type="text" placeholder="Last Name" class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-blue" />
          <button class="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-2">Check In Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Online Flight Check-in | Flybeth',
  meta: [
    { name: 'description', content: 'Check in for your flight online. Retrieve your boarding pass quickly using your confirmation code and last name.' }
  ]
})
</script>
