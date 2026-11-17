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
        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60 mb-2">✦ Popular Destination</p>
        <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white capitalize mb-3">
          Flights to <span class="text-[#FF8A00]">{{ formatSlug(route.params.slug) }}</span>
        </h1>
        <p class="text-sm text-white/75 max-w-xl mx-auto mb-8">
          Compare and book the cheapest flights to {{ formatSlug(route.params.slug) }}. Enter your travel dates below to find exclusive deals.
        </p>

        <div class="relative z-20">
          <SearchWidget theme="cheapoair" defaultTab="Flights" />
        </div>
      </div>
    </section>
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
