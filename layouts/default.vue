<template>
  <div class="min-h-screen flex flex-col font-sans">
    <NavBar />
    <main class="flex-grow pt-20">
      <slot />
    </main>
    <SettingsSwitcher 
      v-model:show="showSettings" 
      @close="showSettings = false"
    />
    <VoiceAssistant />
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
const showSettings = ref(false)

// Provide showSettings to children so NavBar can toggle it
provide('showSettings', showSettings)
</script>
