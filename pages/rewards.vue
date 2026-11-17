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
        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60 mb-2">✦ Member Benefits</p>
        <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white mb-4">
          Flybeth Rewards — <span class="text-[#FF8A00]">Save & Earn</span>
        </h1>
        <p class="text-sm text-white/75 max-w-2xl mx-auto mb-8">
          Join the Flybeth Rewards program to earn points on every flight, hotel, and car rental. Redeem points for future travel and unlock exclusive member discounts.
        </p>
        
        <div class="max-w-md mx-auto flex gap-4">
          <NuxtLink to="/auth/register" class="flex-1 bg-[#EB4405] hover:bg-[#C93A04] text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-orange-950/20 text-center">
            Join for Free
          </NuxtLink>
          <NuxtLink to="/auth/login" class="flex-1 bg-white/10 hover:bg-white/15 border border-white/30 text-white py-3.5 rounded-xl font-bold transition-colors text-center">
            Sign In
          </NuxtLink>
        </div>
      </div>
    </section>
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
