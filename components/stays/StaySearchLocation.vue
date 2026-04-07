<template>
  <div class="relative flex-1" ref="pickerRef">
    <div 
      @click="isOpen = !isOpen"
      class="flex-1 min-w-[280px] bg-white rounded-l-[1.75rem] px-8 py-4 group hover:bg-gray-50 transition-all cursor-pointer"
    >
      <p class="text-[10px] text-gray-500 font-bold tracking-wide mb-2 opacity-50 group-hover:opacity-100 transition-opacity">Destination</p>
      <div class="flex items-center text-sm font-black text-gray-900 leading-none truncate">
        {{ modelValue || 'Where are you going?' }}
      </div>
    </div>

    <div v-if="isOpen" class="absolute top-full left-0 mt-4 z-[200] bg-white rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.15)] border border-gray-100 w-[92vw] sm:w-[380px] p-8">
        <!-- Mobile Close Button -->
        <button @click="isOpen = false" class="md:hidden absolute top-4 right-4 h-9 w-9 flex items-center justify-center text-gray-400 bg-gray-50 rounded-full z-10 hover:text-gray-900 transition-colors">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <!-- Search Input in Dropdown -->
        <div class="mb-6">
          <div class="relative group">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input 
              ref="searchInput"
              type="text" 
              v-model="searchQuery"
              placeholder="Search city or hotel..."
              class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900/10 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
              @click.stop
            />
          </div>
        </div>

        <div class="max-h-[380px] overflow-y-auto custom-scrollbar -mx-2 px-2">
          <!-- Recent Searches -->
          <div v-if="!searchQuery && recentSearches.length > 0" class="mb-6">
            <h3 class="px-4 py-2 text-[10px] font-black text-gray-400 tracking-wide opacity-40">Previous searches</h3>
            <div 
              v-for="item in recentSearches" 
              :key="item.name"
              @click="selectResult(item)"
              class="px-4 py-3.5 hover:bg-gray-50 cursor-pointer flex items-center gap-4 group transition-all rounded-2xl"
            >
              <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <span class="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{{ item.name }}</span>
            </div>
          </div>

          <!-- Popular Sections -->
          <div v-if="!searchQuery" class="mb-6">
             <h3 class="px-4 py-2 text-[10px] font-black text-gray-400 tracking-wide opacity-40">Top destinations</h3>
             <div 
              v-for="city in popularCities" 
              :key="city.name"
              @click="selectResult(city)"
              class="px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-all flex items-center gap-4 group rounded-2xl"
            >
               <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <div class="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{{ city.name }}</div>
            </div>
          </div>

          <!-- API Search Results -->
          <div v-if="searchQuery && results.length" class="space-y-1">
             <div 
              v-for="res in results" 
              :key="res.id"
              @click="selectAmadeusResult(res)"
              class="px-4 py-3.5 hover:bg-gray-50 cursor-pointer flex items-center gap-4 group transition-all rounded-2xl"
            >
               <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all text-gray-400">
                <svg v-if="res.subType === 'CITY'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div class="flex-grow min-w-0">
                <p class="text-sm font-black text-gray-900 group-hover:text-gray-600 transition-colors truncate">
                  {{ res.address?.cityName || res.name }}
                </p>
                <p class="text-[10px] font-bold text-gray-400 truncate tracking-wide mt-0.5 opacity-60">
                   {{ res.address?.countryName || res.address?.countryCode }} <span v-if="res.name !== res.address?.cityName">&middot; {{ res.name }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="px-6 py-16 text-center">
            <div class="inline-block animate-spin h-10 w-10 border-4 border-gray-100 border-t-gray-900 rounded-full mb-6"></div>
            <p class="text-[10px] font-black text-gray-400 tracking-wide opacity-40">Searching</p>
          </div>
        </div>
    </div>
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
  background: #11182720;
  border-radius: 10px;
}
</style>
