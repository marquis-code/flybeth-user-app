<template>
  <div class="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h2 class="text-2xl  text-black flex items-center gap-3">
          <TruckIcon class="h-8 w-8 text-black" />
          Transfer Details
        </h2>
        <p class="text-sm font-medium text-brand-gray/60 mt-1">Review your transfer selection</p>
      </div>
    </div>

    <div class="bg-white/50 rounded-2xl p-6 border border-gray-200">
      <div class="flex items-center gap-4 mb-4">
        <div class="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-2">
           <TruckIcon class="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 class=" text-black text-lg">{{ name }}</h3>
          <p class="text-sm font-bold text-brand-gray/60">Provider: {{ provider }}</p>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-200">
      <button 
        @click="$emit('continue')"
        class="w-full bg-brand-blue text-white py-4 rounded-xl  text-lg hover:bg-brand-blue/90 transition-colors"
      >
        Continue to Traveller Details
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TruckIcon } from '@heroicons/vue/24/outline'

defineProps<{
  name: string
  provider: string
}>()

defineEmits(['continue'])
</script>
