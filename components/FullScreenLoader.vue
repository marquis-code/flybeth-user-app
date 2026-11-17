<template>
  <Teleport to="body" v-if="isMounted">
    <Transition name="modal-fade">
      <div 
        v-if="show" 
        class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 select-none overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Loading content"
      >
        <!-- ── Clean Neutral Backdrop (no blue cast) ── -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"></div>

        <!-- ── Simple, Clean White Card ── -->
        <div class="relative flex flex-col items-center justify-center p-8 sm:p-10 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm sm:max-w-md w-full mx-4 text-center animate-modal-pop">
          
          <!-- Simple Minimal Spinner with Airplane Icon -->
          <div class="relative w-20 h-20 mb-5 flex items-center justify-center">
            <!-- Light track -->
            <div class="absolute inset-0 rounded-full border-[3px] border-gray-100"></div>
            <!-- Smooth rotating spinner in brand color -->
            <div class="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#0D1DAD] border-r-[#0D1DAD] animate-spin"></div>
            
            <!-- Centered soft plane badge -->
            <div class="w-11 h-11 rounded-full bg-blue-50/80 flex items-center justify-center text-[#0D1DAD]">
              <svg 
                class="w-5 h-5 text-[#0D1DAD] transform -rotate-45" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
          </div>
          
          <!-- Headings -->
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">
            Hold on tight! 🚀
          </h3>
          <p class="text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
            We're fetching the very best 
            <span class="font-bold text-[#0D1DAD]">{{ moduleName }}</span> 
            just for you.
          </p>

          <!-- Status Ticker -->
          <div class="h-6 flex items-center justify-center mt-3">
            <Transition name="fade-slide" mode="out-in">
              <span :key="currentStatusIndex" class="text-xs font-medium text-gray-400">
                {{ activeStatusText }}
              </span>
            </Transition>
          </div>

          <!-- Subtle Progress Bar -->
          <div class="mt-3.5 w-44 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-[#0D1DAD] rounded-full animate-shimmer-slide"></div>
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
  'Checking airline availability...',
  'Finding the lowest fares for you...'
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
@keyframes modal-pop {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-modal-pop {
  animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
  animation: shimmer-slide 2.2s ease-in-out infinite;
}

/* ── Vue Transitions ── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
