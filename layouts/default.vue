<template>
  <div class="min-h-screen flex flex-col font-sans">
    <NavBar v-if="showNavBar" />
    <main class="flex-grow" :class="{ 'pt-20': showNavBar && !isHomePage }">
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
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/modules/auth/useAuth'
import { useConfirmation } from '@/composables/core/useConfirmation'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ChatWidget from '@/components/ChatWidget.vue'

const { visible, options, handleConfirm, handleCancel } = useConfirmation()
const { isAuthModalVisible, closeAuthModal } = useAuth()
const route = useRoute()
const showNavBar = computed(() => {
  const path = route.path.toLowerCase()
  return !path.startsWith('/help') && !path.includes('/faq')
})
const isHomePage = computed(() => route.path === '/')
const showSettings = ref(false)

// Provide showSettings to children so NavBar can toggle it
provide('showSettings', showSettings)
</script>
