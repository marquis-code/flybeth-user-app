<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Check Flight Status</h1>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Track delays, gate changes, and arrival times in real-time. Enter your flight number or route to get the latest updates.</p>
        
        <div class="max-w-md mx-auto space-y-4">
          <div class="flex gap-2">
            <input type="text" placeholder="Airline (e.g. AA)" class="w-1/3 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-blue" />
            <input type="text" placeholder="Flight Number" class="w-2/3 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-blue" />
          </div>
          <input type="date" class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-blue text-gray-500" />
          <button class="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-2">Track Flight</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Live Flight Status Tracker | Flybeth',
  meta: [
    { name: 'description', content: 'Track your flight status in real time. Get the latest updates on delays, gate changes, and arrival times.' }
  ]
})
</script>
