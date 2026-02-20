<template>
  <div class="relative w-full font-body" ref="selectRef">
    <label 
      v-if="label" 
      class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black mb-2 px-1 opacity-70 font-header block"
    >
      {{ label }}
    </label>
    
    <!-- Trigger -->
    <div 
      @click="toggleDropdown"
      class="flex items-center justify-between gap-4 p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500 group"
      :class="{ 'ring-4 ring-brand-blue/5 border-brand-blue shadow-xl': isOpen }"
    >
      <div class="flex items-center gap-4">
        <div v-if="icon" class="p-2.5 border border-brand-blue/10 rounded-xl bg-brand-blue/5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
          <component :is="icon" class="h-5 w-5" :class="isOpen ? 'text-white' : 'text-brand-blue'" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-brand-blue tracking-tight">
            {{ selectedOptionLabel || placeholder }}
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

    <!-- Dropdown Menu -->
    <Transition name="select-pop">
      <div 
        v-if="isOpen"
        class="absolute z-[110] mt-3 w-full bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(13,29,173,0.15)] border border-gray-50 p-4 transform origin-top overflow-hidden"
      >
        <div class="max-h-[300px] overflow-y-auto custom-scrollbar">
          <div 
            v-for="option in options" 
            :key="option.value"
            @click="selectOption(option)"
            class="group flex items-center justify-between px-6 py-4 rounded-2xl cursor-pointer hover:bg-brand-blue/5 transition-all duration-300 mb-1 last:mb-0"
            :class="{ 'bg-brand-blue/5': modelValue === option.value }"
          >
            <span 
              class="text-sm font-bold transition-all duration-300"
              :class="modelValue === option.value ? 'text-brand-blue' : 'text-brand-gray/80 group-hover:text-brand-blue'"
            >
              {{ option.label }}
            </span>
            <div 
              v-if="modelValue === option.value"
              class="w-2.5 h-2.5 rounded-full bg-brand-green shadow-[0_0_10px_rgba(50,180,4,0.5)]"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  label: string
  value: any
}

const props = defineProps<{
  label?: string
  placeholder?: string
  options: Option[]
  modelValue: any
  icon?: any
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => isOpen.value = !isOpen.value

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const selectedOptionLabel = computed(() => {
  const option = props.options.find(o => o.value === props.modelValue)
  return option ? option.label : null
})

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}
</script>

<style scoped>
.select-pop-enter-active,
.select-pop-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.select-pop-enter-from,
.select-pop-leave-to {
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

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(13, 29, 173, 0.2);
}
</style>
