<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <GlobalToastContainer />
    <NewsletterModal />
  </div>
</template>

<script setup lang="ts">
import GlobalToastContainer from '@/components/core/GlobalToastContainer.vue'
import NewsletterModal from '@/components/NewsletterModal.vue'
</script>