<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <GlobalToastContainer />
    <!--
      The newsletter popup used to be mounted here, so it interrupted every page
      (landing included) for first-time visitors. It is now an inline section on
      the landing page instead — nothing auto-opens over the site any more.
    -->
  </div>
</template>

<script setup lang="ts">
import GlobalToastContainer from '@/components/core/GlobalToastContainer.vue'
</script>
