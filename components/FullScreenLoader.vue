<template>
  <Teleport to="body" v-if="isMounted">
    <Transition name="glass-loader">
      <div 
        v-if="show" 
        class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 select-none overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Loading content"
      >
        <!-- ── Glassy Frosted Backdrop ── -->
        <div class="absolute inset-0 bg-slate-900/35 backdrop-blur-2xl transition-all duration-500"></div>
        <div class="absolute inset-0 bg-gradient-to-tr from-[#0D1DAD]/20 via-sky-500/10 to-indigo-900/20 backdrop-blur-xl"></div>

        <!-- ── Cute Ambient Floating Glow Orbs ── -->
        <div class="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/25 rounded-full blur-[110px] pointer-events-none animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/25 rounded-full blur-[120px] pointer-events-none animate-pulse-slower"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-400/20 rounded-full blur-[90px] pointer-events-none"></div>

        <!-- ── Cute Frosted Glass Card ── -->
        <div class="relative flex flex-col items-center justify-center p-8 sm:p-10 bg-white/80 backdrop-blur-3xl border border-white/80 shadow-[0_30px_90px_-20px_rgba(13,29,173,0.32),inset_0_1px_2px_rgba(255,255,255,0.95)] rounded-[2.5rem] max-w-sm sm:max-w-md w-full mx-4 text-center transform scale-100 animate-cute-pop">
          
          <!-- Cute Pill Badge -->
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-[#0D1DAD] bg-blue-50/90 border border-blue-100/90 mb-6 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-[#0D1DAD] animate-ping"></span>
            <span>Live Travel Engine ✨</span>
          </div>

          <!-- Cute Animated Plane & Orbiting Radar Rings -->
          <div class="relative w-28 h-28 mb-6 flex items-center justify-center">
            <!-- Pulsing aura -->
            <div class="absolute inset-0 bg-gradient-to-tr from-[#0D1DAD]/20 via-indigo-500/20 to-sky-400/25 rounded-full blur-xl animate-pulse"></div>
            
            <!-- Outer soft track -->
            <div class="absolute inset-0 rounded-full border-[3px] border-blue-100/60 shadow-[inset_0_0_12px_rgba(13,29,173,0.05)]"></div>
            
            <!-- Fast spinning gradient ring -->
            <div class="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#0D1DAD] border-r-indigo-500 animate-spin"></div>
            
            <!-- Counter spinning inner ring -->
            <div class="absolute inset-2 rounded-full border-[2px] border-dashed border-sky-400/70 animate-spin-reverse"></div>

            <!-- Orbiting mini travel star -->
            <div class="absolute inset-0 animate-orbit pointer-events-none">
              <span class="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">✨</span>
            </div>

            <!-- Floating Cute Airplane in center -->
            <div class="relative flex items-center justify-center text-[#0D1DAD] animate-cute-float">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-blue-50/90 border border-white/90 shadow-md flex items-center justify-center">
                <svg 
                  class="w-7 h-7 text-[#0D1DAD] transform -rotate-45" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Cute Headings -->
          <h3 class="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            Hold on tight! 🚀
          </h3>
          <p class="text-[13.5px] text-gray-600 font-medium leading-relaxed max-w-xs">
            We're fetching the very best 
            <span class="font-extrabold text-[#0D1DAD] bg-blue-50 px-1.5 py-0.5 rounded-md">{{ moduleName }}</span> 
            just for you.
          </p>

          <!-- Dynamic Status Ticker -->
          <div class="h-6 flex items-center justify-center mt-3">
            <Transition name="fade-slide" mode="out-in">
              <span :key="currentStatusIndex" class="text-xs font-semibold text-gray-400">
                {{ activeStatusText }}
              </span>
            </Transition>
          </div>

          <!-- Cute Progress Shimmer Bar -->
          <div class="mt-4 w-full max-w-[200px] h-2 bg-gray-100/90 rounded-full overflow-hidden p-0.5 border border-white/80 shadow-inner">
            <div class="h-full bg-gradient-to-r from-[#0D1DAD] via-indigo-500 to-sky-400 rounded-full animate-shimmer-slide"></div>
          </div>

          <!-- Micro footer note -->
          <div class="flex items-center gap-2 mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <span>Real-time availability</span>
            <span class="inline-block w-1 h-1 rounded-full bg-emerald-500"></span>
            <span>Best price guarantee</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  moduleName: {
    type: String,
    default: 'Flights'
  }
})

const isMounted = ref(false)
const currentStatusIndex = ref(0)
let tickerTimer: any = null

const statusMessages = computed(() => [
  `Scanning 500+ ${props.moduleName} routes...`,
  'Checking direct airline availability...',
  'Applying exclusive platform discounts...',
  'Locking in lowest fares for you...'
])

const activeStatusText = computed(() => {
  return statusMessages.value[currentStatusIndex.value % statusMessages.value.length]
})

onMounted(() => {
  isMounted.value = true
  tickerTimer = setInterval(() => {
    currentStatusIndex.value++
  }, 2400)

  if (props.show && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  if (tickerTimer) clearInterval(tickerTimer)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

watch(() => props.show, (val) => {
  if (typeof document !== 'undefined') {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>

<style scoped>
/* ── Animations ── */
@keyframes cute-pop {
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-cute-pop {
  animation: cute-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cute-float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-4px) scale(1.05);
  }
}
.animate-cute-float {
  animation: cute-float 2.2s ease-in-out infinite;
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.animate-spin-reverse {
  animation: spin-reverse 5s linear infinite;
}

@keyframes orbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-orbit {
  animation: orbit 3.5s linear infinite;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.55;
    transform: scale(1.1);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 5s ease-in-out infinite;
}

@keyframes pulse-slower {
  0%, 100% {
    opacity: 0.25;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.15);
  }
}
.animate-pulse-slower {
  animation: pulse-slower 7s ease-in-out infinite;
}

@keyframes shimmer-slide {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
.animate-shimmer-slide {
  animation: shimmer-slide 2.4s ease-in-out infinite;
}

/* ── Vue Transitions ── */
.glass-loader-enter-active,
.glass-loader-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.glass-loader-enter-from,
.glass-loader-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
