<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 capitalize">Flights from {{ origin }} to {{ destination }}</h1>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Find the best flight deals from {{ origin }} to {{ destination }}. Search your dates below to compare prices and book your tickets.</p>
        
        <div class="max-w-4xl mx-auto">
          <SearchWidget defaultTab="Flights" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const route = useRoute()
const formatSlug = (slug) => {
  if (!slug) return '';
  return slug.toString().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const parts = computed(() => {
  const slug = route.params.slug || ''
  const split = slug.split('-to-')
  if (split.length === 2) {
    return { origin: formatSlug(split[0]), destination: formatSlug(split[1]) }
  }
  return { origin: '', destination: formatSlug(slug) }
})

const origin = computed(() => parts.value.origin || 'City')
const destination = computed(() => parts.value.destination || 'City')

useHead({
  title: `Flights from ${origin.value} to ${destination.value} | Flybeth`,
  meta: [
    { name: 'description', content: `Book flights from ${origin.value} to ${destination.value}. Compare prices and save on your next trip with Flybeth.` }
  ]
})
</script>
