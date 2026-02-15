<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
    <!-- Flight Header -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-3">
        <img :src="flight.airline.logo" :alt="flight.airline.name" class="h-8 w-8 object-contain" />
        <span class="font-medium text-gray-900">{{ flight.airline.name }}</span>
      </div>
      <div class="text-right">
        <p class="text-xl font-bold text-gray-900">${{ flight.price.amount }}</p>
        <p class="text-xs text-gray-500">per traveler</p>
      </div>
    </div>

    <!-- Flight Details -->
    <div class="flex flex-col md:flex-row justify-between items-center text-sm">
      <!-- Departure -->
      <div class="text-center md:text-left">
        <p class="font-bold text-gray-900">{{ flight.departure.time }}</p>
        <p class="text-gray-500">{{ flight.departure.airport }}</p>
      </div>

      <!-- Duration & Stops -->
      <div class="flex flex-col items-center flex-grow px-4 md:px-8 w-full md:w-auto my-4 md:my-0">
        <p class="text-gray-500 mb-1">{{ flight.duration }}</p>
        <div class="w-full h-px bg-gray-300 relative flex items-center justify-center">
           <div class="absolute w-2 h-2 bg-gray-300 rounded-full left-0"></div>
           <div class="absolute w-2 h-2 bg-gray-300 rounded-full right-0"></div>
           <component :is="PaperAirplaneIcon" class="h-4 w-4 text-gray-400 transform rotate-90" />
        </div>
        <p class="text-green-600 mt-1" v-if="flight.stops === 0">Nonstop</p>
        <p class="text-gray-500 mt-1" v-else>{{ flight.stops }} stop(s)</p>
      </div>

      <!-- Arrival -->
      <div class="text-center md:text-right">
        <p class="font-bold text-gray-900">{{ flight.arrival.time }}</p>
        <p class="text-gray-500">{{ flight.arrival.airport }}</p>
      </div>
    </div>

    <!-- Action -->
    <div class="mt-6 flex justify-end">
       <UiBaseButton size="sm" @click="$emit('select', flight.id)">
          Select Flight
        </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

defineProps({
  flight: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
</script>
