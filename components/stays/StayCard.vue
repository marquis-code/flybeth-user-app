<template>
  <div 
    class="stay-card bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-700 mb-6 flex flex-col md:flex-row h-full md:h-[280px] group cursor-pointer"
    @click="$emit('select', stay)"
  >
    <!-- Image Section -->
    <div class="md:w-[32%] relative overflow-hidden h-64 md:h-auto bg-gray-50 flex items-center justify-center shrink-0">
      <img 
        v-if="stay.photos?.[0] || stay.image"
        :src="stay.photos?.[0] || stay.image" 
        :alt="stay.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
      />
      <!-- Premium Empty State -->
      <div v-else class="flex flex-col items-center justify-center text-gray-200 p-8 text-center bg-gray-50 h-full w-full">
        <svg class="w-12 h-12 mb-3 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
           <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <p class="text-xs  tracking-wide opacity-50">No preview available</p>
      </div>
      <!-- Type Badge (Minimalist) -->
      <div class="absolute top-5 left-5">
        <span class="inline-flex items-center px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md text-gray-900 text-xs  border border-gray-100 shadow-xl tracking-wide">
          {{ stay.type || 'Hotel' }}
        </span>
      </div>
    </div>

    <!-- Info Section -->
    <div class="flex-1 p-8 flex flex-col md:flex-row gap-8">
      <!-- Left Info -->
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="mb-6">
          <h3 class="text-2xl  text-gray-900 leading-tight mb-2 group-hover:text-gray-600 transition-colors line-clamp-2 tracking-tight">
            {{ stay.name }}
          </h3>
          
          <div class="flex items-center text-gray-400 mt-2">
            <svg class="w-4 h-4 mr-2 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="text-sm font-bold tracking-wide line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
              <span v-if="stay.location?.address">{{ stay.location?.address }}, </span>{{ stay.location?.city || 'City' }}
            </span>
          </div>
        </div>

        <div v-if="visibleAmenities.length > 0" class="mb-6">
          <div class="flex flex-wrap gap-2.5">
            <div v-for="amenity in visibleAmenities" :key="amenity.label" class="flex items-center text-xs  text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 tracking-wide">
              <span class="w-4 h-4 flex items-center justify-center mr-2 text-gray-400 group-hover:text-gray-600 transition-colors" v-html="amenity.icon"></span>
              {{ amenity.label }}
            </div>
          </div>
        </div>

        <div class="mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-gray-50">
          <div class="flex items-center text-xs  text-gray-900 tracking-wide">
            <svg class="w-4 h-4 mr-2 text-emerald-500 stroke-[4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Instant confirm
          </div>
          <div class="flex items-center text-xs  text-gray-900 tracking-wide opacity-50">
            <svg class="w-4 h-4 mr-2 text-gray-500 stroke-[4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Best price match
          </div>
        </div>
      </div>

      <!-- Price & Rating Side -->
      <div class="md:w-[220px] md:border-l border-gray-50 md:pl-8 flex flex-col justify-between items-center md:items-end">
        <div class="w-full flex md:flex-col justify-between items-center md:items-end gap-4 mb-6">
          <div class="flex items-center bg-gray-50 text-gray-900 px-4 py-2.5 rounded-xl border border-gray-100">
            <span class="text-sm  mr-2">{{ (stay.rating || 5.0).toFixed(1) }}</span>
            <span class="text-xs  tracking-wide opacity-60">Rating</span>
          </div>
          <div class="flex flex-col items-end">
            <div class="text-xs text-gray-500  tracking-wide mb-2">Price from</div>
            <div class="text-4xl  text-gray-900 leading-none tracking-tighter">
              ${{ Math.round(stay.priceWithCommission || stay.cheapestPrice || 0) }}
            </div>
          </div>
        </div>

        <button 
          @click.stop="$emit('select', stay)"
          class="w-full bg-gray-900 hover:bg-gray-700 text-white  h-16 rounded-2xl transition-all duration-300 shadow-xl shadow-gray-900/10 active:scale-[0.98] text-sm tracking-wide flex items-center justify-center gap-3 group/btn"
        >
          View details
          <svg class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
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
