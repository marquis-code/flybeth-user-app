<template>
  <div class="stays-sidebar bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 p-8 sticky top-24">
    <div class="flex items-center justify-between mb-10 border-b border-gray-50 pb-8">
      <h2 class="text-xs font-black tracking-wide text-gray-900">Filters</h2>
      <button @click="Object.assign(filters, {name: '', maxPrice: maxPrice, ratings: [], amenities: [], types: []})" class="text-[9px] font-black text-gray-500 tracking-wide hover:text-black transition-colors">Reset all</button>
    </div>

    <!-- Search by Name -->
    <div class="mb-12">
      <div class="relative group">
        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </span>
        <input 
          type="text" 
          v-model="filters.name"
          placeholder="Property name..."
          class="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900/10 transition-all text-xs font-bold text-gray-900 placeholder:text-gray-400"
        />
      </div>
    </div>

    <!-- Budget Range -->
    <div class="mb-12">
      <h3 class="text-[10px] font-black text-gray-900 tracking-wide mb-8">Price range</h3>
      <div class="px-2">
        <input 
          type="range" 
          v-model.number="filters.maxPrice"
          :min="minPrice" 
          :max="maxPrice"
          class="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900"
        />
        <div class="flex justify-between mt-6 text-[10px] font-black text-gray-900 tracking-wide">
          <span class="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">${{ minPrice }}</span>
          <span class="bg-gray-900 text-white px-3 py-1.5 rounded-lg">${{ filters.maxPrice }}</span>
        </div>
      </div>
    </div>

    <!-- Property Rating -->
    <div class="mb-12">
      <h3 class="text-[10px] font-black text-gray-900 tracking-wide mb-8">Star rating</h3>
      <div class="grid grid-cols-1 gap-4">
        <label v-for="star in [5, 4, 3]" :key="star" class="flex items-center group cursor-pointer">
          <div class="relative flex items-center justify-center w-6 h-6 border-2 border-gray-100 rounded-xl mr-4 group-hover:border-gray-900 transition-all" :class="{'bg-gray-900 border-gray-900 shadow-xl shadow-gray-900/10': filters.ratings.includes(star)}">
            <input type="checkbox" :value="star" v-model="filters.ratings" class="absolute inset-0 opacity-0 cursor-pointer" />
            <svg v-if="filters.ratings.includes(star)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="flex items-center">
            <span class="text-xs font-black text-gray-900 mr-3">{{ star }} Stars</span>
            <div class="flex gap-0.5">
              <svg v-for="i in star" :key="i" class="w-2.5 h-2.5 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Amenities -->
    <div class="mb-12">
      <h3 class="text-[10px] font-black text-gray-900 tracking-wide mb-8">Amenities</h3>
      <div class="space-y-5">
        <label v-for="amenity in commonAmenities" :key="amenity.id" class="flex items-center justify-between group cursor-pointer">
          <div class="flex items-center">
            <div class="relative flex items-center justify-center w-6 h-6 border-2 border-gray-100 rounded-xl mr-4 group-hover:border-gray-900 transition-all" :class="{'bg-gray-900 border-gray-900 shadow-xl shadow-gray-900/10': filters.amenities.includes(amenity.id)}">
              <input type="checkbox" :value="amenity.id" v-model="filters.amenities" class="absolute inset-0 opacity-0 cursor-pointer" />
              <svg v-if="filters.amenities.includes(amenity.id)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span class="text-[11px] font-black text-gray-900 tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">{{ amenity.label }}</span>
          </div>
          <span class="text-[9px] font-black text-gray-300 bg-gray-50 px-2.5 py-0.5 rounded-lg" v-if="counts[amenity.id]">{{ counts[amenity.id] }}</span>
        </label>
      </div>
    </div>

    <!-- Accommodation Types -->
    <div>
      <h3 class="text-[10px] font-black text-gray-900 tracking-wide mb-8">Accommodation types</h3>
      <div class="space-y-5">
        <label v-for="type in accommodationTypes" :key="type" class="flex items-center group cursor-pointer">
          <div class="relative flex items-center justify-center w-6 h-6 border-2 border-gray-100 rounded-xl mr-4 group-hover:border-gray-900 transition-all" :class="{'bg-gray-900 border-gray-900 shadow-xl shadow-gray-900/10': filters.types.includes(type)}">
            <input type="checkbox" :value="type" v-model="filters.types" class="absolute inset-0 opacity-0 cursor-pointer" />
            <svg v-if="filters.types.includes(type)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="text-[11px] font-black text-gray-900 tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">{{ type }}</span>
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
  { id: 'WIFI', label: 'Wireless internet' },
];

const accommodationTypes = ['Hotel', 'Apartment'];

// Sync price if props change
watch(() => props.maxPrice, (newVal) => {
  if (filters.maxPrice > newVal) filters.maxPrice = newVal;
});
</script>

<style scoped>
.accent-gray-900 {
  accent-color: #111827;
}
</style>
