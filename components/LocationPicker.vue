<!-- <template>
  <div class="relative w-full group" ref="pickerRef">
    
    <div class="relative min-h-[72px] flex items-center">
      <div 
        v-if="modelValue && !focused" 
        @click="onFocus"
        class="w-full px-4 py-3 cursor-pointer group/selected"
      >
        <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-widest mb-0.5 group-hover/selected:text-brand-blue transition-colors">{{ label }}</p>
        <div class="text-2xl font-black text-brand-blue leading-tight truncate">
          {{ selectedLocationName }}
        </div>
        <div class="text-[11px] font-bold text-brand-gray/60 flex items-center gap-1.5 mt-0.5">
          <span class="uppercase">{{ modelValue }}</span>
          <span v-if="selectedLocationSub" class="truncate opacity-60">• {{ selectedLocationSub }}</span>
        </div>
      </div>

      <UiAnimatedInput
        v-else
        :id="id"
        :label="label"
        :placeholder="placeholder"
        :model-value="displayValue"
        @input="onInput"
        @focus="onFocus"
        class="!mb-0 w-full"
      >
        <template #right>
          <div 
            class="p-2 border border-brand-blue/10 rounded-xl bg-brand-blue/5 text-brand-blue"
            :class="{ 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20': focused }"
          >
            <MapPinIcon class="h-4 w-4" />
          </div>
        </template>
      </UiAnimatedInput>

      <div v-if="isLoading" class="absolute right-14 top-1/2 -translate-y-1/2 z-20">
        <div class="animate-spin h-5 w-5 border-2 border-brand-blue/20 border-t-brand-blue rounded-full"></div>
      </div>
    </div>


    <Transition name="dropdown">
      <div v-if="showDropdown" class="absolute z-[200] mt-3 w-full md:w-[440px] bg-white rounded-3xl shadow-[0_30px_90px_-20px_rgba(13,29,173,0.3)] border border-gray-50 overflow-hidden py-3 animate-fade-in">

        <div 
          @click="detectLocation" 
          class="px-6 py-3 hover:bg-brand-blue/5 cursor-pointer group/detect flex items-center gap-4 transition-all duration-300"
        >
          <div class="h-9 w-9 rounded-xl bg-brand-green/10 flex items-center justify-center group-hover/detect:bg-brand-green group-hover/detect:text-white transition-all">
            <PaperAirplaneIcon class="h-4 w-4 text-brand-green group-hover/detect:text-white" />
          </div>
          <div>
            <p class="text-sm font-black text-brand-blue">Detect my location</p>
            <p class="text-[10px] text-brand-gray/40 font-black uppercase tracking-widest">Find nearby airports</p>
          </div>
        </div>

        <div class="h-px bg-gray-50 mx-6 my-1"></div>


        <div v-if="!results.length && !isLoading && searchQuery.length < 2" class="px-6 py-4">
          <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-[0.2em] mb-4 text-center md:text-left">Popular Destinations</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div 
              v-for="dest in suggestions" 
              :key="dest.iataCode"
              @click="selectSuggestion(dest)"
              class="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-brand-blue/5 cursor-pointer transition-all border border-gray-50 hover:border-brand-blue/10 group/suggestion"
            >
              <div class="text-sm font-bold text-brand-blue group-hover/suggestion:text-brand-blue transition-colors">{{ dest.city }}</div>
              <div class="text-[9px] text-brand-gray/40 font-black mt-1 uppercase tracking-tighter">{{ dest.iataCode }}</div>
            </div>
          </div>
        </div>

        <div v-else-if="results.length" class="max-h-[440px] overflow-y-auto custom-scrollbar">
          <div 
            v-for="res in results" 
            :key="res.id || res.iataCode"
            @click="selectAmadeusResult(res)"
            class="group/item px-6 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-all duration-200 border-b border-gray-50 last:border-0"
          >

            <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover/item:bg-brand-blue/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-brand-blue/60 group-hover/item:text-brand-blue transition-colors">
                <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
              </svg>
            </div>


            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-base font-black text-brand-blue truncate">
                  {{ res.address?.cityName || res.name }}, {{ res.address?.countryName || res.address?.countryCode }}
                </p>
                <span class="text-sm font-black text-brand-gray/30 group-hover/item:text-brand-blue/40 transition-colors shrink-0 ml-4">{{ res.iataCode }}</span>
              </div>
              <p class="text-xs font-bold text-brand-gray/40 truncate mt-0.5">
                {{ res.name }} {{ res.subType === 'AIRPORT' ? 'Airport' : '' }} ({{ res.iataCode }})
              </p>
            </div>
          </div>
        </div>


        <div v-else-if="isLoading" class="px-6 py-8 text-center">
          <div class="animate-spin h-6 w-6 border-2 border-brand-blue/20 border-t-brand-blue rounded-full mx-auto mb-3"></div>
          <p class="text-xs text-brand-gray/40 font-bold">Searching airports & cities...</p>
        </div>

        <div v-else-if="!isLoading && searchQuery.length >= 2" class="px-6 py-6 text-center">
          <p class="text-sm text-brand-gray/40 font-bold">No airports found for "{{ searchQuery }}"</p>
          <p class="text-[10px] text-brand-gray/30 mt-1">Try a different city or airport name</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon, PaperAirplaneIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'
import { useAmadeusLocations } from '@/composables/modules/flights/useAmadeusLocations'

const { locations: results, loading: isLoading, searchLocations, detectNearestAirports } = useAmadeusLocations()

const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    default: ''
  },
  placeholder: String,
  id: String
})

const emit = defineEmits(['update:modelValue', 'select'])

const pickerRef = ref<HTMLElement | null>(null)
const focused = ref(false)
const showDropdown = ref(false)
const searchQuery = ref('')
const displayValue = ref('')
const selectedLocationName = ref('')
const selectedLocationSub = ref('')

// Separate cities from airports for grouped display
const cityResults = computed(() => results.value.filter((r: any) => r.subType === 'CITY'))
const airportResults = computed(() => results.value.filter((r: any) => r.subType === 'AIRPORT'))

const suggestions = [
  { city: 'Lagos', iataCode: 'LOS', name: 'Murtala Muhammed', subType: 'AIRPORT' },
  { city: 'Abuja', iataCode: 'ABV', name: 'Nnamdi Azikiwe', subType: 'AIRPORT' },
  { city: 'Dubai', iataCode: 'DXB', name: 'Dubai International', subType: 'AIRPORT' },
  { city: 'London', iataCode: 'LON', name: 'All London Airports', subType: 'CITY' },
  { city: 'Owerri', iataCode: 'QOW', name: 'Sam Mbakwe Airport', subType: 'AIRPORT' },
  { city: 'Portharcourt', iataCode: 'PHC', name: 'Port Harcourt International', subType: 'AIRPORT' },
  { city: 'Johannesbu...', iataCode: 'JNB', name: 'OR Tambo International', subType: 'AIRPORT' },
  { city: 'Asaba', iataCode: 'ABB', name: 'Asaba International', subType: 'AIRPORT' },
  { city: 'Benin', iataCode: 'BNI', name: 'Benin Airport', subType: 'AIRPORT' },
  { city: 'Istanbul', iataCode: 'IST', name: 'Istanbul Airport', subType: 'AIRPORT' },
]

// Cache for resolving IATA codes to names (e.g. after a swap)
const locationCache = new Map<string, { name: string, sub: string }>()

// Watch for external modelValue changes (e.g. from swap button)
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    displayValue.value = ''
    selectedLocationName.value = ''
    selectedLocationSub.value = ''
    return
  }

  // Try to resolve from cache or suggestions
  const cached = locationCache.get(newVal) || suggestions.find(s => s.iataCode === newVal)
  if (cached) {
    const name = 'city' in cached ? cached.city : cached.name
    const sub = 'sub' in cached ? cached.sub : cached.name
    selectedLocationName.value = name
    selectedLocationSub.value = sub
    displayValue.value = name
  } else if (newVal.length === 3) {
    // Fallback if we only have the code and no name yet
    selectedLocationName.value = newVal
    selectedLocationSub.value = 'Loading...'
    displayValue.value = newVal
  }
}, { immediate: true })

// ==========================================
// Controlled watcher on searchQuery with debounce
// ==========================================
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (newQuery) => {
  // Clear any pending debounce
  if (debounceTimer) clearTimeout(debounceTimer)
  
  if (!newQuery || newQuery.length < 2) {
    results.value = []
    return
  }

  debounceTimer = setTimeout(() => {
    fetchAirports(newQuery)
  }, 250)
})

const onFocus = () => {
  focused.value = true
  showDropdown.value = true
  // Auto-detect location if not already set (user request)
  if (!props.modelValue && !displayValue.value) {
    detectLocation()
  }
}

const onInput = (e: Event) => {
  const query = (e.target as HTMLInputElement).value
  displayValue.value = query
  searchQuery.value = query
}

const fetchAirports = async (query: string) => {
  if (query.length < 2) return
  await searchLocations(query)
}

const selectAmadeusResult = (location: any) => {
  const iataCode = location.iataCode
  const cityName = location.address?.cityName || location.name
  const sub = `${location.name || ''} ${location.subType === 'AIRPORT' ? 'Airport' : ''}`.trim()
  
  // Update cache for future lookups (e.g. after a swap)
  locationCache.set(iataCode, { name: cityName, sub })
  
  displayValue.value = cityName
  selectedLocationName.value = cityName
  selectedLocationSub.value = sub
  
  emit('update:modelValue', iataCode)
  emit('select', {
    iataCode,
    cityName,
    name: location.name,
    subType: location.subType,
    countryCode: location.address?.countryCode,
    countryName: location.address?.countryName,
    latitude: location.geoCode?.latitude,
    longitude: location.geoCode?.longitude
  })
  showDropdown.value = false
  searchQuery.value = ''
  results.value = []
}

const selectSuggestion = (dest: any) => {
  // Update cache
  locationCache.set(dest.iataCode, { name: dest.city, sub: dest.name })
  
  displayValue.value = dest.city
  selectedLocationName.value = dest.city
  selectedLocationSub.value = dest.name
  
  emit('update:modelValue', dest.iataCode)
  emit('select', {
    iataCode: dest.iataCode,
    cityName: dest.city,
    name: dest.name,
    subType: dest.subType
  })
  showDropdown.value = false
}

const detectLocation = () => {
  if ("geolocation" in navigator) {
    isLoading.value = true
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await detectNearestAirports(
            position.coords.latitude,
            position.coords.longitude
          )
          if (data && data.length) {
            selectAmadeusResult(data[0])
          }
        } catch (e) {
          console.error('Location detection failed', e)
        } finally {
          isLoading.value = false
        }
      },
      (error) => {
        console.error('Geolocation permission denied or failed', error)
        isLoading.value = false
      }
    )
  }
}

const onClickOutside = (e: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    showDropdown.value = false
    focused.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', onClickOutside)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(13, 29, 173, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(13, 29, 173, 0.2);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style> -->


<template>
  <div class="relative w-full group" ref="pickerRef">
    
    <div class="relative min-h-[72px] flex items-center">
      <!-- Selected State -->
      <div 
        v-if="modelValue && !focused" 
        @click="onFocus"
        class="w-full px-4 py-3 cursor-pointer group/selected"
      >
        <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-widest mb-0.5 group-hover/selected:text-brand-blue transition-colors">{{ label }}</p>
        <div class="text-2xl font-black text-brand-blue leading-tight truncate">
          {{ selectedLocationName }}
        </div>
        <div class="text-[11px] font-bold text-brand-gray/60 flex items-center gap-1.5 mt-0.5">
          <span class="uppercase">{{ modelValue }}</span>
          <span v-if="selectedLocationSub" class="truncate opacity-60">• {{ selectedLocationSub }}</span>
        </div>
      </div>

      <!-- Search State -->
     <section v-else class="w-full">
          <UiAnimatedInput
        :id="id"
        :label="label"
        :placeholder="placeholder"
        :model-value="displayValue"
        @input="onInput"
        @focus="onFocus"
        class="!mb-0 w-full"
      >
        <template #right>
          <div 
            class="p-2 border border-brand-blue/10 rounded-xl bg-brand-blue/5 text-brand-blue"
            :class="{ 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20': focused }"
          >
            <MapPinIcon class="h-4 w-4" />
          </div>
        </template>
      </UiAnimatedInput>
     </section>

      <div v-if="isLoading" class="absolute right-14 top-1/2 -translate-y-1/2 z-20">
        <div class="animate-spin h-5 w-5 border-2 border-brand-blue/20 border-t-brand-blue rounded-full"></div>
      </div>
    </div>

    <!-- Dropdown Results -->
    <Transition name="dropdown">
      <div v-if="showDropdown" class="absolute z-[200] mt-3 w-full md:w-[440px] bg-white rounded-3xl shadow-[0_30px_90px_-20px_rgba(13,29,173,0.3)] border border-gray-50 overflow-hidden py-3 animate-fade-in">
        <!-- Detect Location Option -->
        <div 
          @click="detectLocation" 
          class="px-6 py-3 hover:bg-brand-blue/5 cursor-pointer group/detect flex items-center gap-4 transition-all duration-300"
        >
          <div class="h-9 w-9 rounded-xl bg-brand-green/10 flex items-center justify-center group-hover/detect:bg-brand-green group-hover/detect:text-white transition-all">
            <PaperAirplaneIcon class="h-4 w-4 text-brand-green group-hover/detect:text-white" />
          </div>
          <div>
            <p class="text-sm font-black text-brand-blue">Detect my location</p>
            <p class="text-[10px] text-brand-gray/40 font-black uppercase tracking-widest">Find nearby airports</p>
          </div>
        </div>

        <div class="h-px bg-gray-50 mx-6 my-1"></div>

        <!-- Popular Suggestions (shown when query is short) -->
        <div v-if="!results.length && !isLoading && searchQuery.length < 2" class="px-6 py-4">
          <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-[0.2em] mb-4 text-center md:text-left">Popular Destinations</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div 
              v-for="dest in suggestions" 
              :key="dest.iataCode"
              @click="selectSuggestion(dest)"
              class="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-brand-blue/5 cursor-pointer transition-all border border-gray-50 hover:border-brand-blue/10 group/suggestion"
            >
              <div class="text-sm font-bold text-brand-blue group-hover/suggestion:text-brand-blue transition-colors">{{ dest.city }}</div>
              <div class="text-[9px] text-brand-gray/40 font-black mt-1 uppercase tracking-tighter">{{ dest.iataCode }}</div>
            </div>
          </div>
        </div>

        <!-- API Results -->
        <div v-else-if="results.length" class="max-h-[440px] overflow-y-auto custom-scrollbar">
          <div 
            v-for="res in results" 
            :key="res.id || res.iataCode"
            @click="selectAmadeusResult(res)"
            class="group/item px-6 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-all duration-200 border-b border-gray-50 last:border-0"
          >
            <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover/item:bg-brand-blue/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-brand-blue/60 group-hover/item:text-brand-blue transition-colors">
                <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-base font-black text-brand-blue truncate">
                  {{ res.address?.cityName || res.name }}, {{ res.address?.countryName || res.address?.countryCode }}
                </p>
                <span class="text-sm font-black text-brand-gray/30 group-hover/item:text-brand-blue/40 transition-colors shrink-0 ml-4">{{ res.iataCode }}</span>
              </div>
              <p class="text-xs font-bold text-brand-gray/40 truncate mt-0.5">
                {{ res.name }} {{ res.subType === 'AIRPORT' ? 'Airport' : '' }} ({{ res.iataCode }})
              </p>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-else-if="isLoading" class="px-6 py-8 text-center">
          <div class="animate-spin h-6 w-6 border-2 border-brand-blue/20 border-t-brand-blue rounded-full mx-auto mb-3"></div>
          <p class="text-xs text-brand-gray/40 font-bold">Searching airports & cities...</p>
        </div>

        <!-- No results -->
        <div v-else-if="!isLoading && searchQuery.length >= 2" class="px-6 py-6 text-center">
          <p class="text-sm text-brand-gray/40 font-bold">No airports found for "{{ searchQuery }}"</p>
          <p class="text-[10px] text-brand-gray/30 mt-1">Try a different city or airport name</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { MapPinIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { useAmadeusLocations } from '@/composables/modules/flights/useAmadeusLocations'

const LOG_PREFIX = '[LocationPicker]'

const { locations: results, loading: isLoading, searchLocations, detectNearestAirports } = useAmadeusLocations()

const props = defineProps({
  modelValue: String,
  label: { type: String, default: '' },
  placeholder: String,
  id: String
})

const emit = defineEmits(['update:modelValue', 'select'])

const pickerRef = ref<HTMLElement | null>(null)
const focused = ref(false)
const showDropdown = ref(false)
const searchQuery = ref('')
const displayValue = ref('')
const selectedLocationName = ref('')
const selectedLocationSub = ref('')

const locationCache = new Map<string, { name: string, sub: string }>()

const suggestions = [
  { city: 'Lagos',        iataCode: 'LOS', name: 'Murtala Muhammed',            subType: 'AIRPORT' },
  { city: 'Abuja',        iataCode: 'ABV', name: 'Nnamdi Azikiwe',               subType: 'AIRPORT' },
  { city: 'Dubai',        iataCode: 'DXB', name: 'Dubai International',          subType: 'AIRPORT' },
  { city: 'London',       iataCode: 'LON', name: 'All London Airports',          subType: 'CITY'    },
  { city: 'Owerri',       iataCode: 'QOW', name: 'Sam Mbakwe Airport',           subType: 'AIRPORT' },
  { city: 'Portharcourt', iataCode: 'PHC', name: 'Port Harcourt International',  subType: 'AIRPORT' },
  { city: 'Johannesburg', iataCode: 'JNB', name: 'OR Tambo International',       subType: 'AIRPORT' },
  { city: 'Asaba',        iataCode: 'ABB', name: 'Asaba International',          subType: 'AIRPORT' },
  { city: 'Benin',        iataCode: 'BNI', name: 'Benin Airport',                subType: 'AIRPORT' },
  { city: 'Istanbul',     iataCode: 'IST', name: 'Istanbul Airport',             subType: 'AIRPORT' },
]

// ─── Debounce timer ───────────────────────────────────────────────────────────
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// ─── AGGRESSIVE WATCHER: fires immediately, no lazy ──────────────────────────
watch(
  searchQuery,
  (newQuery, oldQuery) => {
    console.log(`${LOG_PREFIX} 🔍 searchQuery changed: "${oldQuery}" → "${newQuery}"`)

    // Cancel any pending debounce
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    if (!newQuery || newQuery.length < 2) {
      console.log(`${LOG_PREFIX} Query too short — clearing results (length=${newQuery?.length ?? 0})`)
      // Clear via the composable's ref directly (don't mutate aliased ref)
      results.value = []
      return
    }

    console.log(`${LOG_PREFIX} Scheduling API call in 250ms for query="${newQuery}"`)
    debounceTimer = setTimeout(() => {
      console.log(`${LOG_PREFIX} ⏱ Debounce fired — calling searchLocations("${newQuery}")`)
      searchLocations(newQuery)
    }, 250)
  },
  { immediate: true, flush: 'sync' }  // immediate + sync flush = most aggressive
)

// ─── Watch external modelValue (e.g. swap button changes it) ─────────────────
watch(
  () => props.modelValue,
  (newVal) => {
    console.log(`${LOG_PREFIX} modelValue changed externally → "${newVal}"`)
    if (!newVal) {
      displayValue.value = ''
      selectedLocationName.value = ''
      selectedLocationSub.value = ''
      return
    }
    const cached = locationCache.get(newVal) || suggestions.find(s => s.iataCode === newVal)
    if (cached) {
      const name = 'city' in cached ? (cached as any).city : cached.name
      const sub  = 'sub'  in cached ? (cached as any).sub  : (cached as any).name
      selectedLocationName.value = name
      selectedLocationSub.value  = sub
      displayValue.value         = name
      console.log(`${LOG_PREFIX} Resolved from cache/suggestions: name="${name}"`)
    } else {
      console.warn(`${LOG_PREFIX} ⚠️  No cache entry for code="${newVal}" — showing raw code`)
      selectedLocationName.value = newVal
      selectedLocationSub.value  = ''
      displayValue.value         = newVal
    }
  },
  { immediate: true }
)

// ─── Event handlers ───────────────────────────────────────────────────────────
const onFocus = () => {
  console.log(`${LOG_PREFIX} onFocus — focused=true, showDropdown=true`)
  focused.value      = true
  showDropdown.value = true
}

const onInput = (e: Event) => {
  const query = (e.target as HTMLInputElement).value
  console.log(`${LOG_PREFIX} onInput: "${query}"`)
  displayValue.value = query
  searchQuery.value  = query   // This triggers the watcher above
}

// ─── Selection handlers ───────────────────────────────────────────────────────
const selectAmadeusResult = (location: any) => {
  const iataCode  = location.iataCode || location.address?.cityCode || location.address?.iataCode
  const cityName  = location.address?.cityName || location.name
  const sub       = `${location.name || ''} ${location.subType === 'AIRPORT' ? 'Airport' : ''}`.trim()

  console.log(`${LOG_PREFIX} selectAmadeusResult: code="${iataCode}", city="${cityName}"`)
  locationCache.set(iataCode, { name: cityName, sub })

  displayValue.value       = cityName
  selectedLocationName.value = cityName
  selectedLocationSub.value  = sub

  emit('update:modelValue', iataCode)
  emit('select', {
    iataCode,
    cityName,
    name:        location.name,
    subType:     location.subType,
    countryCode: location.address?.countryCode,
    countryName: location.address?.countryName,
    latitude:    location.geoCode?.latitude,
    longitude:   location.geoCode?.longitude
  })

  showDropdown.value = false
  searchQuery.value  = ''
  results.value      = []
  console.log(`${LOG_PREFIX} ✅ Location selected and dropdown closed`)
}

const selectSuggestion = (dest: any) => {
  console.log(`${LOG_PREFIX} selectSuggestion: code="${dest.iataCode}", city="${dest.city}"`)
  locationCache.set(dest.iataCode, { name: dest.city, sub: dest.name })

  displayValue.value         = dest.city
  selectedLocationName.value = dest.city
  selectedLocationSub.value  = dest.name

  emit('update:modelValue', dest.iataCode)
  emit('select', { iataCode: dest.iataCode, cityName: dest.city, name: dest.name, subType: dest.subType })

  showDropdown.value = false
}

// ─── Geolocation ──────────────────────────────────────────────────────────────
const detectLocation = () => {
  console.log(`${LOG_PREFIX} detectLocation called`)
  if (!('geolocation' in navigator)) {
    console.warn(`${LOG_PREFIX} Geolocation not available in this browser`)
    return
  }
  isLoading.value = true
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      console.log(`${LOG_PREFIX} Got coords: lat=${position.coords.latitude}, lng=${position.coords.longitude}`)
      try {
        const data = await detectNearestAirports(position.coords.latitude, position.coords.longitude)
        if (data && data.length) {
          console.log(`${LOG_PREFIX} Auto-selecting nearest airport:`, data[0])
          selectAmadeusResult(data[0])
        } else {
          console.warn(`${LOG_PREFIX} No nearest airports found`)
        }
      } catch (e) {
        console.error(`${LOG_PREFIX} detectNearestAirports threw:`, e)
      } finally {
        isLoading.value = false
      }
    },
    (err) => {
      console.error(`${LOG_PREFIX} Geolocation denied/failed: code=${err.code}, message="${err.message}"`)
      isLoading.value = false
    }
  )
}

// ─── Click outside ────────────────────────────────────────────────────────────
const onClickOutside = (e: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    showDropdown.value = false
    focused.value      = false
  }
}

onMounted(()  => window.addEventListener('click', onClickOutside))
onUnmounted(() => {
  window.removeEventListener('click', onClickOutside)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(13,29,173,0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(13,29,173,0.2); }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-10px) scale(0.98); }
</style>