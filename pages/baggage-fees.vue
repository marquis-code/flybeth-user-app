<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Airline Baggage Fees</h1>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Avoid unexpected fees at the airport. Review the checked and carry-on baggage policies for all major airlines before you pack.</p>
        
        <div class="max-w-md mx-auto">
          <input type="text" placeholder="Search for an airline..." class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-blue mb-4" />
          <button class="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Find Baggage Policy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Airline Baggage Fees & Policies | Flybeth',
  meta: [
    { name: 'description', content: 'Check baggage fees and policies for all major airlines. Learn about weight limits and costs for checked bags.' }
  ]
})
</script>
