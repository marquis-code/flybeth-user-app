<template>
  <div class="checkout-package-details relative">
    <div class="flex flex-col md:flex-row gap-6">
      
      <!-- Package Image (Placeholder if none) -->
      <div class="w-full md:w-48 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-[#f0f7f3] flex items-center justify-center relative">
        <img v-if="coverImage" :src="coverImage" alt="Package preview" class="w-full h-full object-cover" />
        <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="text-[#1d7a4f] opacity-50"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>

      <!-- Package Info -->
      <div class="flex-1 flex flex-col justify-center">
        <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {{ name || 'Exclusive Vacation Package' }}
        </h3>
        
        <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 mb-4">
          <div v-if="packageDetails?.duration" class="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span class="font-medium">{{ packageDetails.duration }} Nights</span>
          </div>
          <div v-if="packageDetails?.destination" class="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span class="font-medium">{{ packageDetails.destination }}</span>
          </div>
          <div v-if="!packageDetails?.duration && !packageDetails?.destination" class="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span class="font-medium">Multi-Day Experience</span>
          </div>
        </div>
        
        <div class="text-sm text-gray-600 line-clamp-2 mb-3">
          {{ packageDetails?.description || 'Experience the ultimate getaway with our hand-picked curated package. Complete your traveler details below to finalize your reservation.' }}
        </div>

        <div v-if="packageDetails?.inclusions?.length" class="flex flex-wrap gap-2">
          <span v-for="inc in packageDetails.inclusions.slice(0,3)" :key="inc" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
            ✓ {{ inc }}
          </span>
          <span v-if="packageDetails.inclusions.length > 3" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500">
            +{{ packageDetails.inclusions.length - 3 }} more
          </span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'Vacation Package'
  },
  packageDetails: {
    type: Object,
    default: () => ({})
  }
})

const coverImage = computed(() => {
  const pkg = props.packageDetails;
  if (!pkg) return null;
  return pkg.image || pkg.thumbnail || pkg.images?.[0] || null;
})
</script>
