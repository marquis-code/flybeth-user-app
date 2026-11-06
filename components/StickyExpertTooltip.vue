<template>
  <Transition name="slide-up">
    <div
      v-if="show && !isDismissed"
      class="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-2xl"
    >
      <div class="bg-[#00133D] text-white rounded-full px-4 py-3 md:px-5 md:py-4 shadow-2xl flex items-center justify-between gap-3 border border-white/10">

        <!-- Left: Avatar + Content -->
        <div class="flex items-center gap-3 min-w-0">

          <!-- Expert Avatar -->
          <div class="relative flex-shrink-0">
            <div class="h-11 w-11 rounded-full overflow-hidden border-2 border-white/20">
              <img
                src="/images/expert-avatar.png"
                alt="Travel Expert"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-[#00133D] rounded-full"></div>
          </div>

          <!-- Text Content -->
          <div class="flex flex-col min-w-0">
            <p class="text-sm md:text-base font-bold text-white leading-tight truncate">
              Call our Travel Experts 24/7
            </p>
            <p class="text-xs md:text-sm text-white/80 mt-0.5 leading-tight">
              +1 844 FLYBETH (359-2384) 
              <!-- &nbsp;·&nbsp; Say
              <span class="text-orange-400 font-bold ">DIAL10</span>
              to save. -->
              <!-- <span class="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full border border-white/40 text-[9px] text-white/60 ml-0.5 cursor-help align-middle">i</span> -->
            </p>
          </div>
        </div>

        <!-- Right: Call us Button + Dismiss -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            @click="callExpert"
            class="bg-white text-[#00133D] font-bold text-sm md:text-base px-5 py-2.5 rounded-full hover:bg-white/90 active:scale-95 transition-all duration-150 whitespace-nowrap shadow-md"
          >
            Call us
          </button>

          <button
            @click="dismiss"
            class="h-7 w-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <XMarkIcon class="h-4 w-4 text-white/60" />
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  show: boolean
}>()

const isDismissed = ref(false)

// Permanent dismissal. This previously used sessionStorage, so the tooltip
// came back every time the browser was reopened or a new tab was used — which
// is what made it feel like it "shows every time".
const DISMISS_KEY = 'expert_tooltip_dismissed'

const dismiss = () => {
  isDismissed.value = true
  try {
    localStorage.setItem(DISMISS_KEY, 'true')
  } catch { /* private mode */ }
}

const callExpert = () => {
  window.location.href = 'tel:+18443592384'
}

// Read the saved preference on mount. (`process.client` is not defined in
// Nuxt 4, so the previous guard never ran and the bar reappeared every load.)
const restoreDismissed = () => {
  try {
    if (localStorage.getItem(DISMISS_KEY) === 'true') isDismissed.value = true
  } catch { /* private mode */ }
}

restoreDismissed()
onMounted(restoreDismissed)
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 100%);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 100%);
}
</style>