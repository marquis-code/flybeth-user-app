<template>
  <div class="fixed top-6 right-6 z-[1000000] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast-list">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-4 p-4 pr-6 bg-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 min-w-[320px] max-w-[440px] animate-in"
      >
        <div 
          class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="variantClasses[toast.toastType]"
        >
          <component :is="variantIcons[toast.toastType]" class="h-5 w-5" />
        </div>
        
        <div class="flex-1 pt-0.5">
          <h3 class="text-sm font-black text-gray-900 leading-tight mb-1">{{ toast.title }}</h3>
          <p class="text-[13px] font-medium text-gray-500 leading-relaxed">{{ toast.message }}</p>
        </div>

        <button @click="removeToast(toast.id)" class="text-gray-300 hover:text-gray-500 transition-colors pt-0.5">
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { toasts, removeToast } = useCustomToast()

const variantClasses = {
  success: 'bg-emerald-50 text-emerald-600',
  error: 'bg-rose-50 text-rose-600',
  info: 'bg-sky-50 text-sky-600',
  warning: 'bg-amber-50 text-amber-600'
}

const variantIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
}
</script>

<style scoped>
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.animate-in {
  animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
