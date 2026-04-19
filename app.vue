<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <GlobalToastContainer />
  </div>
</template>

<script setup lang="ts">
import GlobalToastContainer from '@/components/core/GlobalToastContainer.vue'
</script>
