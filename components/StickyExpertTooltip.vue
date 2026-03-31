<template>
  <Transition name="slide-up">
    <div 
      v-if="show && !isDismissed" 
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-2xl"
    >
      <div class="bg-[#001732] text-white rounded-2xl p-3 md:p-4 shadow-2xl flex items-center justify-between border border-white/10">
        <div class="flex items-center gap-3">
          <!-- Expert Avatar -->
          <div class="relative flex-shrink-0">
            <div class="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border-2 border-brand-green/30">
              <img 
                src="/images/expert-avatar.png" 
                alt="Travel Expert" 
                class="h-full w-full object-cover"
              />
            </div>
            <div class="absolute bottom-0 right-0 h-3 w-3 bg-brand-green border-2 border-[#001732] rounded-full"></div>
          </div>

          <!-- Content -->
          <div class="flex flex-col">
            <p class="text-[11px] md:text-xs font-bold text-gray-400 leading-tight">
              Call our Travel Experts 24/7. Say 
              <span class="bg-[#FFC107] text-black px-1.5 py-0.5 rounded-[4px] font-black text-[9px] mx-0.5 scale-95 inline-block">DIAL10</span> 
              to save:
            </p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-sm md:text-base font-black tracking-tight">1-646-738-4832</span>
              <a href="#" class="text-sm md:text-xs font-bold text-brand-blue-light underline decoration-brand-blue-light/30 hover:text-white transition-colors">Learn more</a>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <button 
          @click="dismiss" 
          class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <XMarkIcon class="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  show: boolean
}>()

const isDismissed = ref(false)

const dismiss = () => {
  isDismissed.value = true
  sessionStorage.setItem('expert_tooltip_dismissed', 'true')
}

// Initial check
if (process.client && sessionStorage.getItem('expert_tooltip_dismissed')) {
  isDismissed.value = true
}
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

.text-brand-blue-light {
  color: #3BB4C1;
}
</style>
