<template>
  <div class="relative w-full max-w-2xl mx-auto rounded-[2.5rem] overflow-hidden p-1 sm:p-1.5 shadow-2xl shadow-indigo-900/5 group">
    
    <!-- Animated Gradient Border & Background Mesh -->
    <div class="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-indigo-100 to-purple-200 opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
    <div class="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-r from-blue-300/40 to-cyan-300/40 blur-3xl opacity-50 animate-pulse" style="animation-duration: 4s;"></div>
    <div class="absolute -bottom-1/4 -right-1/4 w-full h-full bg-gradient-to-l from-purple-300/40 to-indigo-300/40 blur-3xl opacity-50 animate-pulse" style="animation-duration: 6s;"></div>

    <!-- Inner Glass Card -->
    <div class="relative w-full h-full bg-white/85 backdrop-blur-2xl border border-white/60 rounded-[2.3rem] px-6 py-12 sm:p-14 flex flex-col items-center text-center z-10 transition-colors duration-500 group-hover:bg-white/95">
      
      <!-- Sophisticated Animated Icon Container -->
      <div class="relative mb-10 mt-2">
        <!-- Pulsing Rings -->
        <div class="absolute inset-0 rounded-full border-2 border-indigo-300 animate-ping opacity-20" style="animation-duration: 2.5s;"></div>
        <div class="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-10" style="animation-duration: 3.5s; animation-delay: 0.5s;"></div>
        
        <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-white to-indigo-50 border border-white shadow-xl shadow-indigo-900/10 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-[-5deg]">
          <component :is="computedIcon" class="h-10 w-10 sm:h-12 sm:w-12 text-[#0b1686] drop-shadow-sm transition-colors duration-500 group-hover:text-indigo-600" />
        </div>
        
        <!-- Floating Contextual Emojis -->
        <div class="absolute -top-3 -right-5 text-2xl animate-bounce drop-shadow-md select-none" style="animation-duration: 2.5s;">✨</div>
        <div class="absolute -bottom-1 -left-5 text-2xl animate-bounce drop-shadow-md select-none" style="animation-duration: 3s; animation-delay: 0.5s;">{{ computedEmoji }}</div>
      </div>

      <!-- Text Content -->
      <h3 class="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight drop-shadow-sm leading-tight">
        {{ title || 'No Results Found' }}
      </h3>
      <p class="text-gray-500 text-[15px] sm:text-[16px] font-medium max-w-sm sm:max-w-md mx-auto leading-relaxed mb-10">
        {{ message || 'Try adjusting your filters or destination to discover new adventures and exclusive deals.' }}
      </p>

      <!-- Action Button -->
      <div v-if="actionLabel" class="relative w-full sm:w-auto">
        <button 
          @click="$emit('action')" 
          class="relative w-full sm:w-auto overflow-hidden px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-[15px] tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-xl shadow-gray-900/20 hover:shadow-gray-900/30 flex items-center justify-center gap-3 group/btn"
        >
          <span>{{ actionLabel }}</span>
          <ArrowRightIcon class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon, 
  BuildingOfficeIcon, 
  TruckIcon,
  GlobeAltIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: String,
  message: String,
  actionLabel: String,
  variant: {
    type: String,
    default: 'search',
    validator: (val: string) => ['search', 'flights', 'stays', 'cars', 'cruises', 'packages'].includes(val)
  }
})

defineEmits(['action'])

const iconMap: Record<string, any> = {
  search: MagnifyingGlassIcon,
  flights: PaperAirplaneIcon,
  stays: BuildingOfficeIcon,
  cars: TruckIcon,
  cruises: GlobeAltIcon,
  packages: SparklesIcon,
}

// Contextual emojis to give it a playful, premium feel
const emojiMap: Record<string, string> = {
  search: '🔍',
  flights: '☁️',
  stays: '🌴',
  cars: '🛣️',
  cruises: '🌊',
  packages: '🎒',
}

const computedIcon = computed(() => iconMap[props.variant || 'search'] || MagnifyingGlassIcon)
const computedEmoji = computed(() => emojiMap[props.variant || 'search'] || '☁️')
</script>

<style scoped>
/* Smooth rendering for shadows and transforms */
div, button {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
