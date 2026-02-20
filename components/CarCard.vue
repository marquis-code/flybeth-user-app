<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6">
    <!-- Car Image -->
    <div class="md:w-1/3 flex items-center justify-center bg-gray-50 rounded-lg p-4">
      <img :src="car.image" :alt="car.name" class="max-h-32 object-contain" />
    </div>

    <!-- Details -->
    <div class="flex-grow flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start">
           <div>
              <h3 class="text-lg font-bold text-gray-900">{{ car.name }}</h3>
              <p class="text-sm text-gray-500">or similar {{ car.category }}</p>
           </div>
           <div class="flex items-center space-x-2">
              <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-bold">{{ car.rating }}/10</span>
              <span class="text-sm text-gray-500">{{ car.reviews }} reviews</span>
           </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-y-2 text-sm text-gray-600">
          <div class="flex items-center">
            <UserIcon class="h-4 w-4 mr-2" />
            {{ car.seats }} Passengers
          </div>
          <div class="flex items-center">
            <BriefcaseIcon class="h-4 w-4 mr-2" />
            {{ car.bags }} Bags
          </div>
          <div class="flex items-center">
            <CogIcon class="h-4 w-4 mr-2" />
            {{ car.transmission }}
          </div>
          <div class="flex items-center">
             <CheckCircleIcon class="h-4 w-4 mr-2 text-green-500" />
             Free Cancellation
          </div>
        </div>
      </div>
      
      <div class="mt-4 md:mt-0 pt-4 flex items-end justify-between border-t border-gray-100 md:border-t-0">
          <div>
            <p class="text-xs text-gray-500">Total Price</p>
            <p class="text-2xl font-bold text-gray-900">${{ car.price }}</p>
          </div>
          <UiBaseButton @click="$emit('select', car.id)">View Deal</UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, BriefcaseIcon, CogIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

defineProps({
  car: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
</script>
