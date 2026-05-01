<template>
  <div class="relative w-full" ref="pickerRef">

    <!-- ── Trigger row ── -->
    <div
      class="w-full px-4 pt-3 pb-2 cursor-pointer min-h-[68px] flex flex-col justify-center group select-none transition-all rounded-xl relative overflow-hidden"
      :class="showDropdown ? 'bg-blue-50/30 ring-2 ring-gray-900/5' : 'hover:bg-gray-50/60'"
      @mousedown.prevent="toggleDropdown"
    >
      <p
        class="text-[10px] font-bold tracking-[0.05em] mb-0.5 transition-colors uppercase"
        :class="showDropdown ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'"
      >
        {{ label }}
      </p>

      <!-- Display when closed -->
      <div v-show="!showDropdown" class="flex items-baseline gap-1.5 min-w-0 transition-opacity duration-75">
        <template v-if="selectedLocationName">
          <span class="text-[14px] text-gray-900 leading-tight truncate font-bold">
            {{ selectedLocationName }}
          </span>
          <span class="text-[10px] text-gray-400 font-bold uppercase shrink-0">{{ modelValue }}</span>
        </template>
        <template v-else>
          <MapPinIcon class="h-4 w-4 shrink-0 text-gray-300" />
          <span class="text-[14px] text-gray-400 font-medium">
            {{ placeholder || 'Select' }}
          </span>
        </template>
      </div>
      
      <!-- Input when open (v-show for instant focus/appearance) -->
      <div v-show="showDropdown" class="flex items-center gap-2 transition-opacity duration-75">
        <MagnifyingGlassIcon class="h-4 w-4 text-gray-900 shrink-0" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          :placeholder="placeholder || 'Where to?'"
          class="flex-1 bg-transparent outline-none text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
          @input="onSearchInput"
          @keydown.escape="closeDropdown"
          @mousedown.stop
        />
      </div>

      <p v-show="selectedLocationSub && !showDropdown" class="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
        {{ selectedLocationSub }}
      </p>
    </div>

    <!-- ── Dropdown Panel (v-show for instant appearance) ── -->
    <Transition name="loc-drop">
      <div
        v-show="showDropdown"
        class="absolute left-0 top-[calc(100%+6px)] z-[2000] bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden"
        :class="[isMobile ? 'fixed inset-x-4 top-1/2 -translate-y-1/2 w-auto' : 'w-[360px]']"
        style="background-color: #ffffff !important;"
        @mousedown.stop
      >
        <!-- Detect location (Compact) -->
        <div
          @click="detectLocation"
          class="flex items-center gap-3 m-3 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group/detect border border-gray-50 hover:border-gray-200"
        >
          <div class="h-7 w-7 rounded-lg bg-gray-100 group-hover/detect:bg-gray-900 flex items-center justify-center shrink-0 transition-colors">
            <svg class="h-3.5 w-3.5 text-gray-400 group-hover/detect:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[12px] font-bold text-gray-900">Detect my location</p>
            <p class="text-[10px] text-gray-400 font-medium truncate">Find nearby airports</p>
          </div>
        </div>

        <div class="h-px bg-gray-50 mx-4" />

        <!-- ── Results ── -->
        <div v-show="results.length" class="max-h-[280px] overflow-y-auto py-1">
          <p class="px-5 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Results
          </p>
          <div
            v-for="res in results"
            :key="res.iataCode"
            @click="selectAmadeusResult(res)"
            class="flex items-center gap-3 px-5 py-2 hover:bg-gray-50 cursor-pointer transition-colors group/item"
          >
            <div class="h-7 w-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-transparent group-hover/item:border-gray-100">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="text-gray-400 group-hover/item:text-gray-900">
                <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[12px] font-bold text-gray-900 truncate">{{ res.address?.cityName || res.name }}</p>
              <p class="text-[10px] text-gray-400 truncate">{{ res.name }}</p>
            </div>
            <span class="text-[10px] font-black text-gray-400">{{ res.iataCode }}</span>
          </div>
        </div>

        <!-- Popular destinations (Grid) -->
        <div v-show="!isLoading && !searchQuery" class="pb-2">
          <p class="px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Popular
          </p>
          <div class="grid grid-cols-2 gap-px bg-gray-50">
            <div
              v-for="dest in suggestions"
              :key="dest.iataCode"
              @click="selectSuggestion(dest)"
              class="flex items-center gap-2.5 px-4 py-2.5 bg-white hover:bg-gray-50 cursor-pointer transition-all group/sug"
            >
              <div class="h-6 w-6 rounded bg-gray-50 group-hover/sug:bg-white flex items-center justify-center shrink-0 border border-transparent group-hover/sug:border-gray-100">
                <MapPinIcon class="h-3.5 w-3.5 text-gray-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[11px] font-bold text-gray-700 group-hover/sug:text-gray-900 truncate">
                  {{ dest.city }}
                </p>
                <p class="text-[9px] text-gray-400 font-bold uppercase">{{ dest.iataCode }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-show="isLoading" class="py-10 text-center">
          <div class="animate-spin h-4 w-4 border-2 border-gray-100 border-t-gray-900 rounded-full mx-auto mb-2" />
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { MapPinIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAmadeusLocations } from '@/composables/modules/flights/useAmadeusLocations'

const props = defineProps({
  modelValue:  { type: String, default: '' },
  label:       { type: String, default: '' },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'select', 'focus', 'close'])

const { locations: results, loading: isLoading, searchLocations, detectNearestAirports } = useAmadeusLocations()

const pickerRef       = ref<HTMLElement | null>(null)
const searchInputRef  = ref<HTMLInputElement | null>(null)
const showDropdown    = ref(false)
const isMobile        = ref(false)

const searchQuery          = ref('')
const selectedLocationName = ref('')
const selectedLocationSub  = ref('')

const locationCache = new Map<string, { name: string; sub: string }>()

const suggestions = [
  { city: 'Lagos',        iataCode: 'LOS', name: 'Murtala Muhammed Int\'l' },
  { city: 'Abuja',        iataCode: 'ABV', name: 'Nnamdi Azikiwe Int\'l' },
  { city: 'Dubai',        iataCode: 'DXB', name: 'Dubai International' },
  { city: 'London',       iataCode: 'LON', name: 'All London Airports' },
  { city: 'Portharcourt', iataCode: 'PHC', name: 'Port Harcourt Int\'l' },
  { city: 'Johannesburg', iataCode: 'JNB', name: 'OR Tambo Int\'l' },
]

let debounceTimer: any = null
const onSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!searchQuery.value || searchQuery.value.length < 2) {
    results.value = []
    return
  }
  debounceTimer = setTimeout(() => searchLocations(searchQuery.value), 280)
}

const toggleDropdown = (e: MouseEvent) => {
  // Prevent double firing if click also bubbles
  e.preventDefault()
  if (showDropdown.value) closeDropdown()
  else openDropdown()
}

const openDropdown = () => {
  showDropdown.value = true
  emit('focus')
  // With v-show, the element is already in DOM, so we can focus immediately
  searchInputRef.value?.focus()
}

const closeDropdown = () => {
  showDropdown.value = false
  searchQuery.value  = ''
  results.value      = []
  emit('close')
}

const selectAmadeusResult = (location: any) => {
  const iataCode = location.iataCode || location.address?.cityCode
  const cityName = location.address?.cityName || location.name
  const sub      = `${location.name || ''}${location.subType === 'AIRPORT' ? ' Airport' : ''}`.trim()
  locationCache.set(iataCode, { name: cityName, sub })
  selectedLocationName.value = cityName
  selectedLocationSub.value  = sub
  emit('update:modelValue', iataCode)
  emit('select', location)
  closeDropdown()
}

const selectSuggestion = (dest: any) => {
  locationCache.set(dest.iataCode, { name: dest.city, sub: dest.name })
  selectedLocationName.value = dest.city
  selectedLocationSub.value  = dest.name
  emit('update:modelValue', dest.iataCode)
  emit('select', dest)
  closeDropdown()
}

const detectLocation = () => {
  if (!('geolocation' in navigator)) return
  isLoading.value = true
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const data = await detectNearestAirports(pos.coords.latitude, pos.coords.longitude)
        if (data?.length) selectAmadeusResult(data[0])
      } finally { isLoading.value = false }
    },
    () => { isLoading.value = false }
  )
}

const handleClickOutside = (e: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    closeDropdown()
  }
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    selectedLocationName.value = ''
    selectedLocationSub.value  = ''
    return
  }
  const cached = locationCache.get(val)
  const sug    = suggestions.find(s => s.iataCode === val)
  if (cached)   { selectedLocationName.value = cached.name; selectedLocationSub.value = cached.sub }
  else if (sug) { selectedLocationName.value = sug.city;    selectedLocationSub.value = sug.name   }
  else          { selectedLocationName.value = val;         selectedLocationSub.value = '' }
}, { immediate: true })

const checkMobile = () => { isMobile.value = window.innerWidth < 768 }

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.loc-drop-enter-active, .loc-drop-leave-active {
  transition: all 0.1s ease-out;
}
.loc-drop-enter-from, .loc-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
" ,Description: