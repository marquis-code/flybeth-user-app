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

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60 mb-2">✦ Travel Together</p>
        <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white mb-4">
          Group Travel <span class="text-[#FF8A00]">Deals & Discounts</span>
        </h1>
        <p class="text-sm text-white/75 max-w-2xl mx-auto mb-8">
          Planning a trip for 10 or more people? Get access to discounted group rates for flights, hotels, and vacation packages. Contact our experts today.
        </p>
        
        <div class="max-w-md mx-auto">
          <NuxtLink to="/contact" class="inline-block w-full bg-[#0D1DAD] hover:bg-[#081485] text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-950/20">
            Request a Group Quote
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Group Travel Deals & Discounts | Flybeth',
  meta: [
    { name: 'description', content: 'Book group travel for 10 or more people and save with exclusive discounted rates on flights and hotels.' }
  ]
})
</script>
