<template>
  <div class="min-h-screen flex flex-col font-sans">
    <NavBar />
    <main class="flex-grow pt-20">
      <slot />
    </main>
    <MainFooter />
    <SettingsSwitcher 
      v-model:show="showSettings" 
      @close="showSettings = false"
    />
    <AuthModal :is-open="isAuthModalVisible" @close="closeAuthModal" @success="closeAuthModal" />
    <ConfirmModal 
      :visible="visible"
      :title="options.title"
      :message="options.message"
      :confirm-text="options.confirmText"
      :cancel-text="options.cancelText"
      :variant="options.variant || 'warning'"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { useAuth } from '@/composables/modules/auth/useAuth'
import { useConfirmation } from '@/composables/core/useConfirmation'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ChatWidget from '@/components/ChatWidget.vue'

const { visible, options, handleConfirm, handleCancel } = useConfirmation()
const { isAuthModalVisible, closeAuthModal } = useAuth()
const showSettings = ref(false)

// Provide showSettings to children so NavBar can toggle it
provide('showSettings', showSettings)
</script>
