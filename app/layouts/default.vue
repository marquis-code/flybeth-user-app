<template>
  <div class="min-h-screen flex flex-col font-sans">
    <NavBar />
    <main class="flex-grow">
      <slot />
    </main>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
// Components will be auto-imported
</script>
