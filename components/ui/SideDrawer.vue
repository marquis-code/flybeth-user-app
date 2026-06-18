<template>
  <Teleport to="body">
    <div :class="['fixed inset-0 z-[1000000] transition-all duration-300', visible ? 'visible' : 'invisible']">
      <!-- Backdrop -->
      <div 
        :class="['absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300', visible ? 'opacity-100' : 'opacity-0']" 
        @click="$emit('close')"
      ></div>

      <!-- Drawer Panel -->
      <div 
        :class="['absolute right-3 top-3 bottom-3 max-w-[calc(100%-1.5rem)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]', visible ? 'translate-x-0' : 'translate-x-[calc(100%+1.5rem)]', widthClass]"
      >
        <!-- Header -->
        <div class="flex justify-between items-center px-8 py-6 border-b border-gray-100 shrink-0">
          <h2 class="text-[18px] font-bold text-[#111827]" style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
            <slot name="title">{{ title }}</slot>
          </h2>
          <button @click="$emit('close')" class="w-9 h-9 flex items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <slot></slot>
        </div>
        
        <!-- Optional Footer -->
        <div v-if="$slots.footer" class="shrink-0 border-t border-gray-100">
           <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  widthClass: { type: String, default: 'w-[440px]' },
})

const emit = defineEmits(['close'])

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.visible) {
    emit('close')
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}
</style>
