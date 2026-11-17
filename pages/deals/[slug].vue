<template>
  <div class="min-h-screen bg-gray-50">
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

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60 mb-2">✦ Exclusive Flight Deals</p>
        <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white capitalize mb-3">
          Cheap Flights to <span class="text-[#FF8A00]">{{ formatSlug(route.params.slug) }}</span>
        </h1>
        <p class="text-sm text-white/75 max-w-xl mx-auto mb-8">
          Explore amazing deals and cheap flights to {{ formatSlug(route.params.slug) }}. Compare options below to get the best prices.
        </p>

        <div class="relative z-20">
          <SearchWidget theme="cheapoair" defaultTab="Flights" />
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Other Flights Available Section -->
      <div>
        <h2 class="text-2xl font-bold text-black mb-8">Other flights available</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden group h-[320px] flex flex-col cursor-pointer">
            <div class="h-28 relative overflow-hidden flex-shrink-0">
               <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div class="absolute bottom-3 left-5 right-5 flex justify-between items-end">
                  <div class="text-white font-bold">Featured Deal</div>
               </div>
            </div>
            <div class="p-5 flex flex-col flex-1">
               <div class="flex justify-between items-start mb-2">
                 <div>
                   <h3 class="font-bold text-black text-lg leading-tight">London (LON)</h3>
                   <p class="text-xs text-gray-500">Economy • Round Trip</p>
                 </div>
                 <div class="text-right">
                   <p class="text-xs text-gray-500 line-through mb-0.5">{{ formatPrice(650) }}</p>
                   <p class="font-black text-brand-blue text-xl leading-none">{{ formatPrice(420) }}</p>
                 </div>
               </div>
               <div class="mt-auto">
                 <button class="w-full bg-[#F0F4FF] hover:bg-[#E0E7FF] text-[#0D1DAD] font-bold py-3 rounded-xl text-sm transition-colors">Select Deal</button>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useSettings } from '@/composables/useSettings'

const { formatPrice } = useSettings()

const route = useRoute()
const formatSlug = (slug) => {
  if (!slug) return '';
  return slug.toString().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

useHead({
  title: `Cheap Flights & Deals to ${formatSlug(route.params.slug)} | Flybeth`,
  meta: [
    { name: 'description', content: `Find cheap flights to ${formatSlug(route.params.slug)}. Compare deals and book your next trip with Flybeth.` }
  ]
})
</script>
