<template>
  <div class="relative flex-1" ref="pickerRef">
    <div 
      @click="isOpen = !isOpen"
      class="flex-1 min-w-[280px] bg-white rounded-l-lg px-6 py-3 border-r border-gray-100 group hover:bg-gray-50 transition-all cursor-pointer"
    >
      <p class="text-sm font-black text-gray-400 uppercase tracking-widest mb-1.5 opacity-60">City, Property Name or Location</p>
      <div class="flex items-center font-black text-gray-900 leading-none truncate">
        {{ modelValue || 'Select Location' }}
      </div>
    </div>

    <Transition name="fade-up">
      <div v-if="isOpen" class="absolute top-full left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 mt-3 z-[99999] bg-white rounded-2xl shadow-[0_30px_90px_-20px_rgba(13,29,173,0.2)] border border-gray-50 w-[92vw] sm:w-[320px] p-6 animate-fade-in">
        <!-- Mobile Close Button -->
        <button @click="isOpen = false" class="md:hidden absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-gray-400 bg-gray-50 rounded-full z-10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <!-- Search Input in Dropdown -->
        <div class="px-5 mb-4">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input 
              ref="searchInput"
              type="text" 
              v-model="searchQuery"
              placeholder="Where are you going?"
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-brand-blue/20 transition-all text-sm font-bold"
              @click.stop
            />
          </div>
        </div>

        <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
          <!-- Recent Searches -->
          <div v-if="!searchQuery && recentSearches.length > 0" class="mb-4">
            <h3 class="px-6 py-2 text-sm font-black text-gray-400 uppercase tracking-widest">Recent searches</h3>
            <div 
              v-for="item in recentSearches" 
              :key="item.name"
              @click="selectResult(item)"
              class="px-6 py-3 hover:bg-brand-blue/5 cursor-pointer flex items-center gap-3 group transition-all"
            >
              <div class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <span class="text-sm font-bold text-gray-700 group-hover:text-brand-blue transition-colors">{{ item.name }}</span>
            </div>
          </div>

          <!-- Popular Sections -->
          <div v-if="!searchQuery" class="mb-4">
             <h3 class="px-6 py-2 text-sm font-black text-gray-400 uppercase tracking-widest">Popular cities</h3>
             <div 
              v-for="city in popularCities" 
              :key="city.name"
              @click="selectResult(city)"
              class="px-6 py-3 hover:bg-brand-blue/5 cursor-pointer transition-all flex items-center gap-3 group"
            >
               <div class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <div class="text-sm font-bold text-gray-700 group-hover:text-brand-blue transition-colors">{{ city.name }}</div>
            </div>
          </div>

          <!-- API Search Results -->
          <div v-if="searchQuery && results.length" class="max-h-[300px] overflow-y-auto custom-scrollbar">
             <div 
              v-for="res in results" 
              :key="res.id"
              @click="selectAmadeusResult(res)"
              class="px-6 py-3 hover:bg-brand-blue/5 cursor-pointer flex items-center gap-3 group transition-all rounded-lg"
            >
               <div class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all text-gray-400">
                <svg v-if="res.subType === 'CITY'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div class="flex-grow min-w-0">
                <p class="text-sm font-bold text-gray-700 group-hover:text-brand-blue transition-colors truncate">
                  {{ res.address?.cityName || res.name }}, {{ res.address?.countryName || res.address?.countryCode }}
                </p>
                <p class="text-sm font-bold text-gray-400 truncate uppercase opacity-60">
                  {{ res.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="px-6 py-8 text-center">
            <div class="animate-spin h-6 w-6 border-2 border-brand-blue/20 border-t-brand-blue rounded-full mx-auto mb-3"></div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest opacity-60">Searching destinations...</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useAmadeusLocations } from '@/composables/modules/flights/useAmadeusLocations';

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue', 'select']);

const { locations: results, loading: isLoading, searchLocations } = useAmadeusLocations();

const pickerRef = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref('');

const recentSearches = ref([
  { name: 'Lagos Island, Lagos, Nigeria', lat: 6.4541, lng: 3.4247 },
  { name: 'Abuja, Nigeria', lat: 9.0579, lng: 7.4951 }
]);

const popularCities = [
  { name: 'Lagos', lat: 6.5244, lng: 3.3792 },
  { name: 'Abuja', lat: 9.0579, lng: 7.4951 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'London', lat: 51.5074, lng: -0.1278 }
];

let debounceTimer: any = null;
watch(searchQuery, (newQuery) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (newQuery.length >= 2) {
    debounceTimer = setTimeout(() => searchLocations(newQuery), 300);
  }
});

watch(isOpen, (newVal) => {
  if (newVal) {
    setTimeout(() => searchInput.value?.focus(), 100);
  }
});

const selectResult = (loc: any) => {
  emit('update:modelValue', loc.name);
  emit('select', loc);
  isOpen.value = false;
  searchQuery.value = '';
};

const selectAmadeusResult = (location: any) => {
  const cityName = location.address?.cityName || location.name;
  const fullLoc = `${cityName}, ${location.address?.countryName || location.address?.countryCode}`;
  
  selectResult({
    name: fullLoc,
    lat: location.geoCode?.latitude,
    lng: location.geoCode?.longitude
  });
};

const closePicker = (e: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener('click', closePicker));
onUnmounted(() => window.removeEventListener('click', closePicker));
</script>

<style scoped>
.fade-up-enter-active, .fade-up-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #0084ff20;
  border-radius: 10px;
}
</style>
