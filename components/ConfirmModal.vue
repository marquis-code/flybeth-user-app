<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div v-if="visible" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="onBackdropClick">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-brand-blue/30 backdrop-blur-sm"></div>

        <!-- Modal -->
        <Transition name="modal-content" appear>
          <div v-if="visible" class="relative bg-white rounded-[2rem] shadow-[0_40px_120px_-20px_rgba(13,29,173,0.3)] max-w-md w-full overflow-hidden">
            <!-- Top Accent -->
            <div class="h-1.5 w-full" :class="accentClass"></div>

            <div class="p-10 text-center">
              <!-- Animated Icon -->
              <div class="mb-8 flex justify-center">
                <div class="relative">
                  <div class="h-20 w-20 rounded-full flex items-center justify-center animate-icon-entrance" :class="iconBgClass">
                    <component :is="computedIcon" class="h-10 w-10 animate-icon-pop" :class="iconColorClass" />
                  </div>
                  <!-- Pulse ring -->
                  <div class="absolute inset-0 rounded-full animate-icon-ring" :class="ringClass"></div>
                </div>
              </div>

              <!-- Title -->
              <h3 class="text-2xl font-black text-brand-blue font-header tracking-tight mb-3 animate-text-up">
                {{ title }}
              </h3>

              <!-- Message -->
              <p class="text-sm text-brand-gray/60 font-bold leading-relaxed mb-10 animate-text-up-delay">
                {{ message }}
              </p>

              <!-- Actions -->
              <div class="flex gap-4 animate-buttons-up">
                <button 
                  @click="onCancel" 
                  class="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-100 text-brand-blue text-xs font-black uppercase tracking-[0.15em] hover:bg-gray-50 hover:border-gray-200 active:scale-95 transition-all duration-300"
                >
                  {{ cancelText || 'Cancel' }}
                </button>
                <button 
                  @click="onConfirm" 
                  class="flex-1 py-4 px-6 rounded-2xl text-white text-xs font-black uppercase tracking-[0.15em] active:scale-95 transition-all duration-300 shadow-lg hover:scale-[1.02]"
                  :class="confirmBtnClass"
                >
                  {{ confirmText || 'Confirm' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  variant: {
    type: String,
    default: 'warning',
    validator: (v: string) => ['warning', 'danger', 'logout', 'info', 'exit'].includes(v)
  },
  closeOnBackdrop: { type: Boolean, default: true }
})

const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

const iconMap: Record<string, any> = {
  warning: ExclamationTriangleIcon,
  danger: TrashIcon,
  logout: ArrowRightOnRectangleIcon,
  info: QuestionMarkCircleIcon,
  exit: XCircleIcon,
}

const computedIcon = computed(() => iconMap[props.variant] || ExclamationTriangleIcon)

const accentClass = computed(() => {
  const map: Record<string, string> = {
    warning: 'bg-gradient-to-r from-amber-400 to-orange-400',
    danger: 'bg-gradient-to-r from-red-400 to-rose-500',
    logout: 'bg-gradient-to-r from-brand-blue to-brand-green',
    info: 'bg-gradient-to-r from-brand-blue to-sky-400',
    exit: 'bg-gradient-to-r from-orange-400 to-red-400',
  }
  return map[props.variant] || map.warning
})

const iconBgClass = computed(() => {
  const map: Record<string, string> = {
    warning: 'bg-amber-50',
    danger: 'bg-red-50',
    logout: 'bg-brand-blue/5',
    info: 'bg-sky-50',
    exit: 'bg-orange-50',
  }
  return map[props.variant] || map.warning
})

const iconColorClass = computed(() => {
  const map: Record<string, string> = {
    warning: 'text-amber-500',
    danger: 'text-red-500',
    logout: 'text-brand-blue',
    info: 'text-sky-500',
    exit: 'text-orange-500',
  }
  return map[props.variant] || map.warning
})

const ringClass = computed(() => {
  const map: Record<string, string> = {
    warning: 'border-2 border-amber-200',
    danger: 'border-2 border-red-200',
    logout: 'border-2 border-brand-blue/20',
    info: 'border-2 border-sky-200',
    exit: 'border-2 border-orange-200',
  }
  return map[props.variant] || map.warning
})

const confirmBtnClass = computed(() => {
  const map: Record<string, string> = {
    warning: 'bg-amber-500 shadow-amber-500/30 hover:shadow-amber-500/40',
    danger: 'bg-red-500 shadow-red-500/30 hover:shadow-red-500/40',
    logout: 'bg-brand-blue shadow-brand-blue/30 hover:shadow-brand-blue/40',
    info: 'bg-brand-blue shadow-brand-blue/30 hover:shadow-brand-blue/40',
    exit: 'bg-orange-500 shadow-orange-500/30 hover:shadow-orange-500/40',
  }
  return map[props.variant] || map.warning
})

const onConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const onCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const onBackdropClick = () => {
  if (props.closeOnBackdrop) onCancel()
}
</script>

<style scoped>
/* Backdrop */
.modal-backdrop-enter-active { transition: opacity 0.4s ease; }
.modal-backdrop-leave-active { transition: opacity 0.3s ease; }
.modal-backdrop-enter-from,
.modal-backdrop-leave-to { opacity: 0; }

/* Content */
.modal-content-enter-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-content-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 1, 1); }
.modal-content-enter-from { opacity: 0; transform: scale(0.9) translateY(30px); }
.modal-content-leave-to { opacity: 0; transform: scale(0.95) translateY(-10px); }

/* Icon entrance */
@keyframes icon-entrance {
  from { transform: scale(0) rotate(-30deg); opacity: 0; }
  to { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes icon-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
@keyframes icon-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
@keyframes text-up {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-icon-entrance { animation: icon-entrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; }
.animate-icon-pop { animation: icon-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; transform: scale(0); }
.animate-icon-ring { animation: icon-ring 1s ease-out 0.3s forwards; opacity: 0; }
.animate-text-up { animation: text-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
.animate-text-up-delay { animation: text-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
.animate-buttons-up { animation: text-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
</style>
