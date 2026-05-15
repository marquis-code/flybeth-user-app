<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center mb-16">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 capitalize">Cheap Flights to {{ formatSlug(route.params.slug) }}</h1>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Explore amazing deals and cheap flights to {{ formatSlug(route.params.slug) }}. Compare options below to get the best prices.</p>
        
        <div class="w-full max-w-6xl mx-auto">
          <SearchWidget defaultTab="Flights" />
        </div>
      </div>

      <!-- Other Flights Available Section -->
      <div class="mt-16">
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
                   <p class="text-xs text-gray-500 line-through mb-0.5">$650</p>
                   <p class="font-black text-brand-blue text-xl leading-none">$420</p>
                 </div>
               </div>
               <div class="mt-auto">
                 <button class="w-full bg-[#Eef2ff] hover:bg-[#e0e7ff] text-[#4F46E5] font-bold py-3 rounded-xl text-sm transition-colors">Select Deal</button>
               </div>
            </div>
          </div>
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
  title: `Cheap Flights & Deals to ${formatSlug(route.params.slug)} | Flybeth`,
  meta: [
    { name: 'description', content: `Find cheap flights to ${formatSlug(route.params.slug)}. Compare deals and book your next trip with Flybeth.` }
  ]
})
</script>
