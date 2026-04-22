<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse flex flex-col h-full">
    <!-- Image Skeleton -->
    <div class="h-48 bg-gray-200 relative mb-4">
      <div class="absolute top-4 right-4 h-5 w-16 bg-gray-300 rounded-full"></div>
    </div>
    
    <!-- Content Skeleton -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <div class="h-3 w-1/4 bg-gray-200 rounded mb-2"></div>
        <div class="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
        <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
      
      <div class="flex items-end justify-between mt-6">
        <div class="flex flex-col gap-2">
          <div class="h-2 w-8 bg-gray-100 rounded"></div>
          <div class="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div class="h-9 w-24 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
