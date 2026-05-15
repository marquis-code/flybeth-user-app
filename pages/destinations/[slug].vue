<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 capitalize">Flights to {{ formatSlug(route.params.slug) }}</h1>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Compare and book the cheapest flights to {{ formatSlug(route.params.slug) }}. Enter your travel dates below to find exclusive deals.</p>
        
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
  title: `Cheap Flights to ${formatSlug(route.params.slug)} | Flybeth`,
  meta: [
    { name: 'description', content: `Find cheap flights to ${formatSlug(route.params.slug)}. Compare prices and book your next trip with Flybeth.` }
  ]
})
</script>
