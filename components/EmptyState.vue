<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center select-none bg-white rounded-3xl border border-gray-50 max-w-2xl mx-auto shadow-sm">
    <!-- Sophisticated Icon Container -->
    <div class="relative mb-8">
      <div class="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center relative z-10 border border-gray-100">
        <component :is="computedIcon" class="h-8 w-8 text-gray-900 opacity-80" />
      </div>
      <!-- Subtle Decorative Element -->
      <div class="absolute -inset-4 bg-gradient-to-tr from-brand-blue/5 to-transparent rounded-full blur-xl -z-0"></div>
    </div>

    <!-- Text Content -->
    <div class="space-y-3 max-w-sm">
      <h3 class="text-lg  text-gray-900  tracking-[0.2em]">
        {{ title || 'No Results' }}
      </h3>
      <p class="text-[11px] font-bold text-gray-400 leading-relaxed  tracking-widest">
        {{ message || 'Try adjusting your filters for better results.' }}
      </p>
    </div>

    <!-- Action Button -->
    <div v-if="actionLabel" class="mt-8">
      <button 
        @click="$emit('action')" 
        class="px-8 py-3 bg-gray-900 text-white rounded-xl text-[10px]  tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
      >
        {{ actionLabel }}
      </button>
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
  SparklesIcon
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

const computedIcon = computed(() => iconMap[props.variant || 'search'] || MagnifyingGlassIcon)
</script>

<style scoped>
/* Removed complex animations for a cleaner look */
</style>
