<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-pulse flex flex-col h-full">
    <!-- Image Skeleton -->
    <div class="h-48 bg-black relative mb-4">
      <div class="absolute top-4 right-4 h-5 w-16 bg-black rounded-full"></div>
    </div>
    
    <!-- Content Skeleton -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <div class="h-3 w-1/4 bg-black rounded mb-2"></div>
        <div class="h-4 w-3/4 bg-black rounded mb-1"></div>
        <div class="h-4 w-1/2 bg-black rounded"></div>
      </div>
      
      <div class="flex items-end justify-between mt-6">
        <div class="flex flex-col gap-2">
          <div class="h-2 w-8 bg-black rounded"></div>
          <div class="h-4 w-16 bg-black rounded"></div>
        </div>
        <div class="h-9 w-24 bg-black rounded-xl"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
