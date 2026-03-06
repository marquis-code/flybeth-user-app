<template>
  <div class="stays-sidebar bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
    <h2 class="text-xl font-bold mb-6">Filter By:</h2>

    <!-- Search by Name -->
    <div class="mb-8">
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </span>
        <input 
          type="text" 
          v-model="filters.name"
          placeholder="Search for locality/hotel name"
          class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-brand-blue/20 transition-all text-sm"
        />
      </div>
    </div>

    <!-- Budget Range -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-gray-900">Your budget (per night)</h3>
      </div>
      <div class="px-2">
        <input 
          type="range" 
          v-model.number="filters.maxPrice"
          :min="minPrice" 
          :max="maxPrice"
          class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
        />
        <div class="flex justify-between mt-3 text-sm font-bold text-gray-900">
          <span>${{ minPrice }}</span>
          <span>${{ filters.maxPrice }}</span>
        </div>
      </div>
    </div>

    <!-- Property Rating -->
    <div class="mb-8">
      <h3 class="font-bold text-gray-900 mb-4">Property Rating</h3>
      <div class="space-y-3">
        <label v-for="star in [3, 4, 5]" :key="star" class="flex items-center group cursor-pointer">
          <div class="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded mr-3 group-hover:border-brand-blue transition-colors" :class="{'bg-brand-blue border-brand-blue': filters.ratings.includes(star)}">
            <input type="checkbox" :value="star" v-model="filters.ratings" class="absolute opacity-0 cursor-pointer w-full h-full" />
            <svg v-if="filters.ratings.includes(star)" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="text-sm text-gray-700 font-medium">{{ star }} star</span>
        </label>
      </div>
    </div>

    <!-- Amenities -->
    <div class="mb-8">
      <h3 class="font-bold text-gray-900 mb-4">Amenities</h3>
      <div class="space-y-3">
        <label v-for="amenity in commonAmenities" :key="amenity.id" class="flex items-center justify-between group cursor-pointer">
          <div class="flex items-center">
            <div class="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded mr-3 group-hover:border-brand-blue transition-colors" :class="{'bg-brand-blue border-brand-blue': filters.amenities.includes(amenity.id)}">
              <input type="checkbox" :value="amenity.id" v-model="filters.amenities" class="absolute opacity-0 cursor-pointer w-full h-full" />
              <svg v-if="filters.amenities.includes(amenity.id)" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span class="text-sm text-gray-700 font-medium">{{ amenity.label }}</span>
          </div>
          <span class="text-xs text-gray-400 font-bold" v-if="counts[amenity.id]">{{ counts[amenity.id] }}</span>
        </label>
      </div>
      <button class="text-brand-blue text-xs font-bold mt-4 hover:underline">More options</button>
    </div>

    <!-- Accomodation Types -->
    <div>
      <h3 class="font-bold text-gray-900 mb-4">Accomodation Types</h3>
      <div class="space-y-3">
        <label v-for="type in accommodationTypes" :key="type" class="flex items-center group cursor-pointer">
          <div class="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded mr-3 group-hover:border-brand-blue transition-colors" :class="{'bg-brand-blue border-brand-blue': filters.types.includes(type)}">
            <input type="checkbox" :value="type" v-model="filters.types" class="absolute opacity-0 cursor-pointer w-full h-full" />
            <svg v-if="filters.types.includes(type)" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="text-sm text-gray-700 font-medium">{{ type }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps({
  minPrice: { type: Number, default: 0 },
  maxPrice: { type: Number, default: 1000 },
  counts: { type: Object, default: () => ({}) },
  filters: { 
    type: Object, 
    required: true
  }
});

const filters = props.filters as any;

const commonAmenities = [
  { id: 'HOTEL', label: 'Hotel' },
  { id: 'RESTAURANT', label: 'Restaurant(s)' },
  { id: 'BAR', label: 'Bar/Lounge' },
  { id: 'SECURITY', label: 'Security' },
  { id: 'WIFI', label: 'Wireless Internet' },
];

const accommodationTypes = ['Hotel', 'Apartment'];

// Sync price if props change
watch(() => props.maxPrice, (newVal) => {
  if (filters.maxPrice > newVal) filters.maxPrice = newVal;
});
</script>

<style scoped>
.accent-brand-blue {
  accent-color: #0084ff;
}
</style>
