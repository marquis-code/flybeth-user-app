<template>
  <div class="py-20 max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row gap-12">
      <!-- Sidebar Categories -->
      <aside class="w-full md:w-64 shrink-0 space-y-2">
        <h3 class="text-[10px]  uppercase  text-neutral-400 mb-6">Categories</h3>
        <button v-for="cat in categories" :key="cat" 
          @click="activeCategory = cat"
          class="w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all"
          :class="activeCategory === cat ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-neutral-500 hover:bg-neutral-50'"
        >
          {{ cat }}
        </button>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 space-y-12">
        <div class="space-y-4 text-center md:text-left">
           <h1 class="text-4xl  text-neutral-900 tracking-tight">{{ activeCategory }} Guides</h1>
           <p class="text-neutral-500 font-medium">Explore detailed articles and step-by-step instructions for {{ activeCategory.toLowerCase() }}.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div v-for="article in filteredArticles" :key="article.title" class="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-sm hover:shadow-xl hover:border-brand-blue/20 transition-all group cursor-pointer">
              <div class="flex items-center gap-4 mb-6">
                 <div class="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-brand-blue/5 transition-colors">
                    <BookOpenIcon class="h-5 w-5 text-neutral-400 group-hover:text-brand-blue" />
                 </div>
                 <span class="text-[10px]  uppercase tracking-widest text-neutral-300">5 min read</span>
              </div>
              <h4 class="text-lg  text-neutral-900 mb-2 group-hover:text-brand-blue transition-colors">{{ article.title }}</h4>
              <p class="text-[13px] font-semibold text-neutral-400 mb-8 leading-relaxed">{{ article.excerpt }}</p>
              <div class="flex items-center gap-2 text-brand-blue font-bold text-xs">
                 Read Article
                 <ArrowLongRightIcon class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BookOpenIcon, ArrowLongRightIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'Knowledgebase | Flybeth Support'
})

const activeCategory = ref('Booking')
const categories = ['Booking', 'Payments', 'Cancellations', 'Rewards', 'Travel Protocols']

const articles = [
  { category: 'Booking', title: 'How to manage multi-city bookings', excerpt: 'Learn how to easily organize and manage complex travel itineraries spanning multiple cities.' },
  { category: 'Booking', title: 'Adding special requests to your stay', excerpt: 'Instructions on how to request late check-outs, room preferences, or dietary requirements.' },
  { category: 'Payments', title: 'Cryptocurrency payment options', excerpt: 'A guide to using Bitcoin and Ethereum for booking flights and hotels on Flybeth.' },
  { category: 'Cancellations', title: 'Understanding non-refundable fares', excerpt: 'Important details on airline policies regarding low-cost and promotional tickets.' },
  { category: 'Rewards', title: 'How to redeem Flybeth points', excerpt: 'Step-by-step guide to applying your earned points towards service fees or discounts.' }
]

const filteredArticles = computed(() => {
  return articles.filter(a => a.category === activeCategory.value)
})
</script>
