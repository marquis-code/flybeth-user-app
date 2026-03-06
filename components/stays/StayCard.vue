<template>
  <div class="stay-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 mb-6 flex flex-col md:flex-row h-full md:h-[300px] group">
    <!-- Image Section -->
    <div class="md:w-[35%] relative overflow-hidden h-64 md:h-auto bg-gray-100 flex items-center justify-center">
      <img 
        v-if="stay.photos?.[0] || stay.image"
        :src="stay.photos?.[0] || stay.image" 
        :alt="stay.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <!-- Premium Empty State for Image -->
      <div v-else class="flex flex-col items-center justify-center text-gray-400 p-8 text-center group-hover:scale-105 transition-transform duration-500">
        <div class="w-16 h-16 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
             <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
             <circle cx="8.5" cy="8.5" r="1.5"/>
             <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <p class="text-[10px] font-black uppercase tracking-widest opacity-60">No Image Available</p>
      </div>
      <!-- Badge -->
      <div class="absolute top-4 left-4">
        <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-brand-blue text-xs font-bold border border-white/20 shadow-sm">
          <svg class="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          {{ stay.type || 'Stay' }}
        </span>
      </div>
      <!-- Provider Badge -->
      <div class="absolute bottom-4 left-4">
        <span class="px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-tighter">
          Via {{ stay.provider }}
        </span>
      </div>
      <div class="absolute inset-0 bg-black/5 pointer-events-none"></div>
    </div>

    <!-- Info Section -->
    <div class="flex-1 p-6 flex flex-col md:flex-row">
      <!-- Left Info -->
      <div class="flex-1 pr-4 mb-4 md:mb-0">
        <div class="flex justify-between items-start mb-1">
          <h3 class="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-brand-blue transition-colors">
            {{ stay.name }}
          </h3>
        </div>
        
        <div class="flex items-center text-gray-500 text-sm mb-4">
          <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span v-if="stay.location?.address">{{ stay.location?.address }}, </span>{{ stay.location?.city || 'City' }}<span v-if="stay.location?.countryCode">, {{ stay.location.countryCode }}</span>
        </div>

        <div v-if="visibleAmenities.length > 0" class="mb-4">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Highlights & Amenities</p>
          <div class="flex flex-wrap gap-4 text-gray-600">
            <div v-for="amenity in visibleAmenities" :key="amenity.label" class="flex items-center text-sm font-medium">
              <span class="w-5 h-5 flex items-center justify-center mr-1 text-gray-400" v-html="amenity.icon"></span>
              {{ amenity.label }}
            </div>
          </div>
        </div>

        <div v-if="stay.conditions?.length" class="space-y-1.5">
          <div v-for="(condition, idx) in stay.conditions.slice(0, 3)" :key="idx" class="flex items-center text-sm font-bold text-gray-700">
            <svg class="w-4 h-4 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            {{ condition.title }}
          </div>
        </div>
        <div v-else class="space-y-1.5">
          <div class="flex items-center text-sm font-bold text-gray-500">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            Best Available Rate
          </div>
          <div class="flex items-center text-sm font-bold text-gray-500">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            Immediate Confirmation
          </div>
        </div>
      </div>

      <!-- Price & Rating Side -->
      <div class="md:w-[180px] md:border-l border-gray-100 md:pl-6 flex flex-col justify-between items-center md:items-end">
        <div class="flex items-center bg-brand-blue text-white px-3 py-1.5 rounded-lg mb-2">
          <span class="text-xs font-bold mr-2 uppercase tracking-wide">Excellent</span>
          <span class="text-base font-black">{{ (stay.rating || 5.0).toFixed(1) }}</span>
        </div>

        <div class="text-center md:text-right mt-auto mb-4">
          <div class="text-3xl font-black text-gray-900 mb-0.5">
            ${{ Math.round(stay.priceWithCommission) }}
          </div>
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            Includes taxes and charges
          </div>
        </div>

        <button 
          @click="$emit('select', stay)"
          class="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-orange-200 active:scale-[0.98]"
        >
          See Availability
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  stay: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

const amenityIcons: Record<string, string> = {
  WIFI: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  TV: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>',
  AIR_CONDITIONING: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M6 16v-3"/><path d="M10 16v-3"/><path d="M14 16v-3"/><path d="M18 16v-3"/><path d="M12 2v4"/><path d="M12 18v4"/></svg>',
  PARKING: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 16V8h4a2 2 0 0 1 0 4H9"/></svg>',
  GYM: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6.5 6.5 11 11"/><path d="m11.5 6.5 1 1"/><path d="m6.5 11.5 1 1"/><path d="m17.5 11.5 1 1"/><path d="m11.5 16.5 1 1"/><path d="M6.5 17.5 7.5 18.5"/><path d="M16.5 5.5 17.5 6.5"/></svg>',
  BED: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>'
};

const visibleAmenities = computed(() => {
  if (props.stay.amenities && props.stay.amenities.length > 0) {
     return props.stay.amenities.slice(0, 4).map((a: any) => ({
        label: a.description || a.type,
        icon: amenityIcons[a.type] || amenityIcons.BED
     }));
  }
  return [];
});
</script>

<style scoped>
.bg-brand-orange {
  background-color: #ff8a00;
}
.text-brand-blue {
  color: #0084ff;
}
.bg-brand-blue {
  background-color: #0084ff;
}
</style>
