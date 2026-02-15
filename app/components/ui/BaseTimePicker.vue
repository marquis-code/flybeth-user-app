<template>
  <div class="relative w-full font-body" ref="timePickerRef">
    <label 
      v-if="label" 
      class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black mb-2 px-1 opacity-70 font-header block"
    >
      {{ label }}
    </label>
    
    <!-- Trigger -->
    <div 
      @click="togglePicker"
      class="flex items-center justify-between gap-4 p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500 group"
      :class="{ 'ring-4 ring-brand-blue/5 border-brand-blue shadow-xl': isOpen }"
    >
      <div class="flex items-center gap-4">
        <div class="p-2.5 border border-brand-blue/10 rounded-xl bg-brand-blue/5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="isOpen ? 'text-white' : 'text-brand-blue transition-colors group-hover:text-white'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-brand-blue tracking-tight">
            {{ modelValue || 'Select time' }}
          </span>
        </div>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-5 w-5 text-brand-blue/40 group-hover:text-brand-blue transition-all duration-300" 
        :class="{ 'rotate-180 text-brand-blue': isOpen }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Time Selection Popover -->
    <Transition name="time-pop">
      <div 
        v-if="isOpen"
        class="absolute z-[110] mt-3 w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(13,29,173,0.15)] border border-gray-50 p-8 transform origin-top"
      >
        <!-- Quick Options -->
        <h4 class="text-[10px] font-black text-brand-gray/50 uppercase tracking-widest mb-4 px-2">Quick Select</h4>
        <div class="grid grid-cols-2 gap-3 mb-6">
          <button 
            v-for="quick in quickTimes" 
            :key="quick"
            @click="selectTime(quick)"
            class="py-3 px-4 rounded-2xl border border-gray-50 bg-gray-50/50 text-xs font-black text-brand-blue hover:bg-brand-blue hover:text-white hover:shadow-lg transition-all duration-300"
          >
            {{ quick }}
          </button>
        </div>

        <!-- Custom Selector (Simplified Slider/Grid) -->
        <h4 class="text-[10px] font-black text-brand-gray/50 uppercase tracking-widest mb-4 px-2">Every Hour</h4>
        <div class="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar px-1">
          <button 
            v-for="hour in 24" 
            :key="hour"
            @click="selectTime(`${(hour-1).toString().padStart(2, '0')}:00`)"
            class="py-2.5 rounded-xl text-[10px] font-bold text-brand-gray hover:bg-brand-blue/5 hover:text-brand-blue transition-all"
            :class="{ 'bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue/10': modelValue === `${(hour-1).toString().padStart(2, '0')}:00` }"
          >
            {{ (hour-1).toString().padStart(2, '0') }}:00
          </button>
        </div>
        
        <!-- Done Button -->
        <button 
          @click="isOpen = false"
          class="w-full mt-6 py-3 bg-brand-green text-white text-[10px] font-black rounded-full hover:bg-brand-green/90 transition-all shadow-lg uppercase tracking-widest"
        >
          Close
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  label?: string
  modelValue: string | null
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const timePickerRef = ref<HTMLElement | null>(null)

const quickTimes = ['Morning', 'Noon', 'Evening', 'Midnight']

const togglePicker = () => isOpen.value = !isOpen.value

const selectTime = (time: string) => {
  emit('update:modelValue', time)
  // Auto-close on quick selection for better UX
  if (quickTimes.includes(time)) {
    isOpen.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (timePickerRef.value && !timePickerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.time-pop-enter-active,
.time-pop-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.time-pop-enter-from,
.time-pop-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(13, 29, 173, 0.1);
  border-radius: 10px;
}
</style>
