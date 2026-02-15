<template>
  <div class="flex flex-col md:flex-row bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <!-- Image -->
    <div class="md:w-1/3 relative h-48 md:h-auto">
      <img :src="stay.image" :alt="stay.name" class="w-full h-full object-cover" />
      <div class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
        {{ stay.rating }} / 5
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 md:w-2/3 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ stay.name }}</h3>
            <p class="text-sm text-gray-500 location-text">{{ stay.location }}</p>
          </div>
          <div v-if="stay.price && stay.price.discount" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {{ stay.price.discount }}% OFF
          </div>
        </div>
        
        <div class="mt-2 text-sm text-gray-600 line-clamp-2">
          {{ stay.description }}
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="amenity in stay.amenities" :key="amenity" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {{ amenity }}
          </span>
        </div>
      </div>

      <div class="mt-4 flex items-end justify-between">
        <div>
          <p class="text-xs text-gray-500">Nightly avg.</p>
          <p class="text-xl font-bold text-gray-900">${{ stay.price.amount }}</p>
          <p class="text-xs text-gray-500">Total ${{ stay.price.total }} includes taxes & fees</p>
        </div>
        <UiBaseButton size="sm" @click="$emit('select', stay.id)">
          View Deal
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  stay: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
</script>
