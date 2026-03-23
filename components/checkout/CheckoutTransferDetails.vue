<template>
  <div class="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h2 class="text-2xl font-black text-brand-blue flex items-center gap-3">
          <TruckIcon class="h-8 w-8 text-brand-blue/60" />
          Transfer Details
        </h2>
        <p class="text-sm font-medium text-brand-gray/60 mt-1">Review your transfer selection</p>
      </div>
    </div>

    <div class="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
      <div class="flex items-center gap-4 mb-4">
        <div class="h-12 w-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm">
           <TruckIcon class="w-6 h-6 text-brand-blue" />
        </div>
        <div>
          <h3 class="font-black text-brand-blue text-lg">{{ name }}</h3>
          <p class="text-sm font-bold text-brand-gray/60">Provider: {{ provider }}</p>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-100">
      <button 
        @click="$emit('continue')"
        class="w-full bg-brand-blue text-white py-4 rounded-xl font-black text-lg hover:bg-brand-blue/90 transition-colors shadow-lg shadow-brand-blue/20"
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
