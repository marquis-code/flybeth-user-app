<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section with Purple Background -->
    <div class="bg-[#d5ccfa] pt-28 pb-20 px-4 relative flex justify-center w-full">
      <div class="max-w-5xl w-full mx-auto relative z-10 flex flex-col items-center">
        <!-- Re-using SearchWidget here configured to search across everything -->
        <SearchWidget ref="searchWidgetRef" class="w-full shadow-2xl rounded-2xl bg-white overflow-hidden border border-white/50" />
        <p class="text-white text-sm font-medium mt-6  opacity-90">22,042 reviews on Flybeth</p>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <!-- Titles -->
      <div class="text-center mb-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-[#111827] mb-3" style="font-family: 'Plus Jakarta Sans', sans-serif;">
          Explore the world, one city at a time
        </h1>
        <p class="text-sm text-[#4B5563] max-w-3xl mx-auto leading-relaxed">
          Whether you're seeking an urban escape, adrenaline-pumping adventure or a romantic getaway, you can find a city below that ticks all of your boxes!
        </p>
      </div>

      <!-- Alphabet Filter -->
      <div class="flex flex-wrap justify-center items-center gap-1 sm:gap-3 mb-10 text-[13px] font-medium text-[#6B7280]">
        <button 
          @click="activeLetter = ''" 
          :class="['px-2 py-1 transition-colors hover:text-[#1a6cf0]', activeLetter === '' ? 'text-[#1a6cf0] font-bold' : '']"
        >
          All
        </button>
        <span class="text-gray-300">·</span>
        <template v-for="(letter, idx) in alphabet" :key="letter">
          <button 
            @click="activeLetter = letter" 
            :class="['px-2 py-1 transition-colors hover:text-[#1a6cf0]', activeLetter === letter ? 'text-[#1a6cf0] font-bold' : '']"
          >
            {{ letter }}
          </button>
          <span v-if="idx !== alphabet.length - 1" class="text-gray-300">·</span>
        </template>
      </div>

      <!-- Countries Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
          v-for="country in filteredCountries" 
          :key="country.code"
          @click="handleSelectCountry(country)"
          class="bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-transparent hover:border-gray-200 transition-all rounded-xl px-4 py-3 flex items-center gap-4 cursor-pointer"
        >
          <div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-gray-100 flex items-center justify-center">
            <img :src="`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`" :alt="`${country.name} flag`" class="w-full h-full object-cover" />
          </div>
          <span class="text-[13px] text-[#374151] font-medium truncate">{{ country.name }}</span>
        </div>
      </div>

      <!-- Empty State for filters -->
      <div v-if="filteredCountries.length === 0" class="text-center py-20 text-gray-500">
        No destinations found for the letter "{{ activeLetter }}".
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SearchWidget from '@/components/SearchWidget.vue'

// Basic alphabet
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
const activeLetter = ref('')
const searchWidgetRef = ref<InstanceType<typeof SearchWidget> | null>(null)
const route = useRoute()

// We'll load the generated JSON from the public directory
const countries = ref<{ name: string; code: string }[]>([])

onMounted(async () => {
  try {
    const res = await fetch('/countries.json')
    if (res.ok) {
      countries.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to load countries:', error)
  }

  // If there's a pre-selected country in query, handle it
  if (route.query.country && searchWidgetRef.value) {
    searchWidgetRef.value.handleExternalDeal({ type: 'Flights', to: route.query.country })
  }
})

const filteredCountries = computed(() => {
  if (!activeLetter.value) return countries.value
  return countries.value.filter(c => c.name.toUpperCase().startsWith(activeLetter.value))
})

const handleSelectCountry = (country: { name: string; code: string }) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (searchWidgetRef.value) {
    // "widget should be for everything please" -> it remains on its tabs but we populate destination
    searchWidgetRef.value.handleExternalDeal({ type: 'Flights', to: country.name })
  }
}

useHead({
  title: 'Explore All Destinations | Flybeth',
  meta: [
    { name: 'description', content: 'Discover your next dream destination from our global list of countries.' }
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
</style>
