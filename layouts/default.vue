<template>
  <div class="min-h-screen flex flex-col font-sans">
    <NavBar />
    <main class="flex-grow pt-20">
      <slot />
    </main>
    <VoiceAssistant />
  </div>
</template>

<script setup lang="ts">
// Components will be auto-imported
</script>
