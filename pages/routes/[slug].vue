<template>
  <div class="min-h-screen bg-white">
    <!-- Brand #0D1DAD Hero Section -->
    <section class="relative bg-[#0D1DAD] overflow-hidden pt-28 pb-16">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(125%_120%_at_50%_-25%,#1A2ED4_0%,#0D1DAD_46%,#0A1485_100%)]"></div>
        <div
          class="absolute inset-0 opacity-[0.14]"
          style="background-image: radial-gradient(rgba(255,255,255,0.45) 1.2px, transparent 1.2px), linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 24px 24px, 56px 56px, 56px 56px;"
        ></div>
        <div class="absolute -right-24 top-6 h-72 w-72 rounded-full bg-[#EB4405]/20 blur-3xl"></div>
        <div class="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-[#3B82F6]/25 blur-3xl"></div>
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-5 text-center">
        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60 mb-2">✦ Popular Flight Route</p>
        <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white capitalize mb-3">
          Flights from <span class="text-[#FF8A00]">{{ origin }}</span> to <span class="text-[#FF8A00]">{{ destination }}</span>
        </h1>
        <p class="text-sm text-white/75 max-w-xl mx-auto mb-8">
          Find the best flight deals from {{ origin }} to {{ destination }}. Search your dates below to compare prices and book your tickets.
        </p>

        <div class="relative z-20">
          <SearchWidget theme="cheapoair" defaultTab="Flights" />
        </div>
      </div>
    </section>
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
