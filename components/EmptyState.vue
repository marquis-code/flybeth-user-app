<template>
  <div class="flex flex-col items-center justify-center py-24 px-6 text-center select-none">
    <!-- Animated Illustration -->
    <div class="relative w-48 h-48 mb-10">
      <!-- Outer pulsing ring -->
      <div class="absolute inset-0 rounded-full bg-brand-blue/5 animate-ping-slow"></div>
      <!-- Middle ring -->
      <div class="absolute inset-4 rounded-full bg-brand-blue/5 animate-ping-slower"></div>
      <!-- Icon container -->
      <div class="absolute inset-8 rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-green/10 flex items-center justify-center animate-float">
        <div class="relative">
          <component :is="computedIcon" class="h-16 w-16 text-brand-blue/30" />
          <!-- Sparkle accents -->
          <div class="absolute -top-2 -right-2 h-3 w-3 bg-brand-green rounded-full animate-sparkle"></div>
          <div class="absolute -bottom-1 -left-3 h-2 w-2 bg-brand-blue/40 rounded-full animate-sparkle-delayed"></div>
          <div class="absolute top-1/2 -right-5 h-1.5 w-1.5 bg-brand-green/60 rounded-full animate-sparkle-slow"></div>
        </div>
      </div>
      <!-- Orbiting dot -->
      <div class="absolute inset-0 animate-orbit">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 bg-brand-green rounded-full shadow-lg shadow-brand-green/30"></div>
      </div>
    </div>

    <!-- Text Content -->
    <div class="space-y-4 max-w-md animate-fade-in-up">
      <h3 class="text-2xl font-black text-brand-blue tracking-tight font-header">
        {{ title || 'Nothing here yet' }}
      </h3>
      <p class="text-brand-gray/50 font-bold text-sm leading-relaxed">
        {{ message || 'Try adjusting your search filters or explore our popular recommendations below.' }}
      </p>
    </div>

    <!-- Action Button -->
    <div v-if="actionLabel" class="mt-10 animate-fade-in-up" style="animation-delay: 0.3s;">
      <button 
        @click="$emit('action')" 
        class="group relative px-10 py-4 bg-brand-blue text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-all duration-500 overflow-hidden"
      >
        <span class="relative z-10">{{ actionLabel }}</span>
        <div class="absolute inset-0 bg-brand-green translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
      </button>
    </div>

    <!-- Decorative background lines -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      <div class="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent"></div>
      <div class="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent"></div>
      <div class="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.15); opacity: 0; }
  100% { transform: scale(1); opacity: 0.4; }
}

@keyframes ping-slower {
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(1); opacity: 0.3; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping-slower {
  animation: ping-slower 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  animation-delay: 0.5s;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

.animate-sparkle-delayed {
  animation: sparkle 2s ease-in-out infinite;
  animation-delay: 0.7s;
}

.animate-sparkle-slow {
  animation: sparkle 3s ease-in-out infinite;
  animation-delay: 1.2s;
}

.animate-orbit {
  animation: orbit 8s linear infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
</style>
