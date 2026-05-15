<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 capitalize">Flights with {{ formatSlug(route.params.slug) }}</h1>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Book your next flight with {{ formatSlug(route.params.slug) }}. Compare prices, find exclusive deals, and manage your booking seamlessly with Flybeth.</p>
        
        <div class="max-w-4xl mx-auto">
          <SearchWidget defaultTab="Flights" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const formatSlug = (slug) => {
  if (!slug) return '';
  return slug.toString().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

useHead({
  title: `${formatSlug(route.params.slug)} Flights & Tickets | Flybeth`,
  meta: [
    { name: 'description', content: `Find and book cheap flights with ${formatSlug(route.params.slug)}. Compare prices and save on your next trip with Flybeth.` }
  ]
})
</script>
