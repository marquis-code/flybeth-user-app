<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="visible"
        class="modal-backdrop"
        @click.self="handleCancel"
        aria-modal="true"
        role="dialog"
      />
    </Transition>
 
    <!-- Desktop: centered card -->
    <Transition name="modal-desktop">
      <div
        v-if="visible"
        class="modal-desktop-wrapper"
        @click.self="handleCancel"
      >
        <div class="modal-card" :class="`variant-${variant}`">
          <!-- Icon -->
          <div class="modal-icon-wrap" :class="`icon-${variant}`">
            <component :is="variantConfig.icon" class="h-5 w-5" />
          </div>
 
          <!-- Content -->
          <div class="modal-body">
            <h2 class="modal-title">{{ title }}</h2>
            <p class="modal-message">{{ message }}</p>
          </div>
 
          <!-- Actions -->
          <div class="modal-actions">
            <button class="btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button
              class="btn-confirm"
              :class="`confirm-${variant}`"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
 
    <!-- Mobile: bottom sheet -->
    <Transition name="sheet">
      <div
        v-if="visible"
        class="modal-sheet-wrapper"
        @click.self="handleCancel"
      >
        <div class="modal-sheet" :class="`variant-${variant}`">
          <!-- Handle -->
          <div class="sheet-handle" />
 
          <!-- Icon + Content -->
          <div class="sheet-header">
            <div class="sheet-icon-wrap" :class="`icon-${variant}`">
              <component :is="variantConfig.icon" class="h-5 w-5" />
            </div>
            <div class="sheet-text">
              <h2 class="modal-title">{{ title }}</h2>
              <p class="modal-message">{{ message }}</p>
            </div>
          </div>
 
          <!-- Actions -->
          <div class="sheet-actions">
            <button
              class="sheet-btn-confirm"
              :class="`confirm-${variant}`"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
            <button class="sheet-btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
 
<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { LogOut, X, AlertTriangle, DoorOpen } from 'lucide-vue-next'
 
const props = defineProps<{
  visible: boolean
  variant?: 'logout' | 'exit' | 'danger' | 'info'
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>()
 
const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()
 
const variantMap = {
  logout: { icon: LogOut },
  exit:   { icon: DoorOpen },
  danger: { icon: AlertTriangle },
  info:   { icon: X },
}
 
const variantConfig = computed(() => variantMap[props.variant ?? 'logout'])
 
const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}
 
const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
 
// Lock body scroll while open
const lockScroll = () => { document.body.style.overflow = 'hidden' }
const unlockScroll = () => { document.body.style.overflow = '' }
 
watch(() => props.visible, (val) => {
  val ? lockScroll() : unlockScroll()
}, { immediate: true })
 
// Escape key
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.visible) handleCancel()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => { window.removeEventListener('keydown', onKeydown); unlockScroll() })
</script>
 
<style scoped>
/* ─── Backdrop ─── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99990;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
 
/* ─── Desktop wrapper (hidden on mobile) ─── */
.modal-desktop-wrapper {
  display: none;
}
@media (min-width: 640px) {
  .modal-desktop-wrapper {
    display: flex;
    position: fixed;
    inset: 0;
    z-index: 99991;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }
}
 
/* ─── Desktop card ─── */
.modal-card {
  background: #fff;
  border-radius: 1.25rem;
  border: 1px solid #e5e7eb;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}
 
.modal-icon-wrap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
 
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
 
.modal-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
 
.modal-message {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.55;
  font-weight: 400;
}
 
.modal-actions {
  display: flex;
  gap: 0.625rem;
  padding-top: 0.25rem;
}
 
.btn-cancel {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.btn-cancel:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}
 
.btn-confirm {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid transparent;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.btn-confirm:hover { opacity: 0.88; }
 
/* ─── Mobile: bottom sheet (hidden on desktop) ─── */
.modal-sheet-wrapper {
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 99991;
  align-items: flex-end;
}
@media (min-width: 640px) {
  .modal-sheet-wrapper { display: none; }
}
 
.modal-sheet {
  width: 100%;
  background: #fff;
  border-radius: 1.5rem 1.5rem 0 0;
  border: 1px solid #e5e7eb;
  border-bottom: none;
  padding: 1rem 1.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
 
.sheet-handle {
  width: 2.5rem;
  height: 0.25rem;
  background: #e5e7eb;
  border-radius: 99px;
  margin: 0 auto 0.25rem;
}
 
.sheet-header {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}
 
.sheet-icon-wrap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
}
 
.sheet-text {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}
 
.sheet-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
 
.sheet-btn-confirm {
  width: 100%;
  padding: 0.8125rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.sheet-btn-confirm:hover { opacity: 0.88; }
 
.sheet-btn-cancel {
  width: 100%;
  padding: 0.8125rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}
.sheet-btn-cancel:hover { background: #f3f4f6; }
 
/* ─── Variant colors ─── */
.icon-logout  { background: #fef3c7; color: #d97706; }
.icon-exit    { background: #fee2e2; color: #dc2626; }
.icon-danger  { background: #fee2e2; color: #dc2626; }
.icon-info    { background: #eff6ff; color: #2563eb; }
 
.confirm-logout { background: #111827; }
.confirm-exit   { background: #dc2626; }
.confirm-danger { background: #dc2626; }
.confirm-info   { background: #2563eb; }
 
/* ─── Backdrop transition ─── */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.22s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
 
/* ─── Desktop modal transition ─── */
.modal-desktop-enter-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.modal-desktop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.modal-desktop-enter-from,
.modal-desktop-leave-to {
  opacity: 0;
}
.modal-desktop-enter-from .modal-card {
  transform: scale(0.94) translateY(8px);
}
.modal-desktop-leave-to .modal-card {
  transform: scale(0.96) translateY(4px);
}
 
/* ─── Bottom sheet transition ─── */
.sheet-enter-active {
  transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-leave-active {
  transition: opacity 0.18s ease, transform 0.2s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .modal-sheet,
.sheet-leave-to .modal-sheet {
  transform: translateY(100%);
}
</style>