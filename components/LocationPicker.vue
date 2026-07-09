<template>
  <div class="relative w-full" ref="pickerRef">

    <!-- ── Trigger row ── -->
    <div
      class="w-full px-4 pt-3 pb-2 cursor-pointer min-h-[68px] flex flex-col justify-center group select-none transition-all rounded-xl relative overflow-hidden"
      :class="showDropdown ? 'bg-blue-50/30 ring-2 ring-gray-200' : 'hover:bg-white/60'"
      @click="toggleDropdown"
    >
      <p
        class="text-xs font-medium text-gray-500 mb-0.5 transition-colors"
        :class="showDropdown ? 'text-black' : 'text-black group-hover:text-black'"
      >
        {{ label }}
      </p>

      <!-- Display when closed -->
      <div v-show="!showDropdown" class="flex items-center gap-2 min-w-0 transition-opacity duration-75 w-full mt-0.5">
        <MapPinIcon class="h-4 w-4 shrink-0 text-gray-500" />
        <template v-if="selectedLocationName">
          <span class="text-[14px] sm:text-[15px] text-black leading-tight truncate font-bold flex-1">
            {{ selectedLocationName }}
          </span>
          <span v-if="modelValue && modelValue !== selectedLocationName" class="text-[10px] font-bold text-[#0D1DAD] bg-blue-50 px-2 py-1 rounded-md shrink-0">
            {{ modelValue }}
          </span>
        </template>
        <template v-else>
          <span class="text-[14px] sm:text-[15px] text-gray-400 font-medium flex-1 truncate">
            {{ placeholder || 'Select' }}
          </span>
        </template>
      </div>
      
      <!-- Input when open (v-show for instant focus/appearance) -->
      <div v-show="showDropdown" class="flex items-center gap-2 transition-opacity duration-75">
        <MagnifyingGlassIcon class="h-4 w-4 text-black shrink-0" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          :placeholder="placeholder || 'Where to?'"
          class="flex-1 bg-transparent outline-none text-[13px] font-bold text-black placeholder:text-black placeholder:font-normal"
          @input="onSearchInput"
          @keydown.escape="closeDropdown"
        />
      </div>

      <p v-show="selectedLocationSub && !showDropdown" class="text-sm text-black font-medium mt-0.5 truncate">
        {{ selectedLocationSub }}
      </p>
    </div>

    <!-- ── Dropdown Panel (v-show for instant appearance) ── -->
    <Teleport to="body" :disabled="!isMobile">
      <Transition name="loc-drop">
        <div
          ref="dropdownRef"
          v-show="showDropdown"
          class="z-[100000] bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col"
          :class="[isMobile ? 'fixed inset-0 rounded-none w-full h-[100dvh] pt-4' : 'absolute left-0 top-[calc(100%+6px)] w-[360px] rounded-2xl']"
          style="background-color: #ffffff !important;"
        >
        <!-- Mobile Header with Close Button -->
        <div v-if="isMobile" class="flex items-center justify-between px-4 pb-3 mb-2 border-b border-gray-100 shrink-0">
          <h3 class="text-base font-bold text-black">Select Location</h3>
          <button @click="closeDropdown" class="p-2 -mr-2 text-black hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Mobile Input -->
        <div v-if="isMobile" class="px-4 pb-4 border-b border-gray-100 shrink-0">
          <div class="flex items-center gap-2 bg-gray-50 px-3 py-3 rounded-xl border border-gray-200">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-500 shrink-0" />
            <input
              ref="mobileSearchInputRef"
              v-model="searchQuery"
              :placeholder="placeholder || 'Where to?'"
              class="flex-1 bg-transparent outline-none text-[15px] font-medium text-black placeholder:text-gray-500"
              @input="onSearchInput"
              @keydown.escape="closeDropdown"
            />
          </div>
        </div>

        <div class="overflow-y-auto flex-1">
        <!-- Detect location (Compact) -->
        <div
          @click="detectLocation"
          class="flex items-center gap-3 m-3 px-3 py-2 rounded-xl hover:bg-blue-50 cursor-pointer transition-all group/detect border border-gray-200 hover:border-blue-200"
        >
          <div class="h-7 w-7 rounded-lg bg-green-50 group-hover/detect:bg-green-100 flex items-center justify-center shrink-0 border border-green-200 transition-colors">
            <svg class="h-3.5 w-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[12px] font-bold text-gray-900">Detect my location</p>
            <p class="text-[11px] text-gray-500 font-medium">Find nearby airports</p>
          </div>
        </div>

        <div class="h-px bg-white mx-4" />

        <!-- ── Results ── -->
        <div v-show="results.length" class="py-1" :class="{ 'max-h-[280px] overflow-y-auto': !isMobile }">
          <p class="px-5 py-2 text-xs font-black text-black">
            Results
          </p>
          <div
            v-for="res in results"
            :key="res.iataCode"
            @click="selectAmadeusResult(res)"
            class="flex items-center gap-3 px-5 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors group/item"
          >
            <div 
              class="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors"
              :class="res.subType === 'CITY' 
                ? 'bg-purple-50 border-purple-200 group-hover/item:bg-purple-100' 
                : 'bg-blue-50 border-blue-200 group-hover/item:bg-blue-100'"
            >
              <!-- Airport icon -->
              <svg v-if="res.subType !== 'CITY'" width="12" height="12" viewBox="0 0 24 24" fill="none" class="text-blue-600">
                <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
              </svg>
              <!-- City icon -->
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" class="text-purple-600">
                <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" fill="currentColor"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-bold text-gray-900 truncate">{{ res.address?.cityName || res.name }}</p>
              <p class="text-[11px] text-gray-500 truncate">{{ res.name }}{{ res.iata_country_code ? `, ${res.iata_country_code}` : '' }}</p>
            </div>
            <span class="text-xs font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{{ res.iataCode }}</span>
          </div>
        </div>

        <!-- Empty State / Free Text Option -->
        <div v-show="!isLoading && searchQuery.length >= 2 && results.length === 0" class="py-8 px-5 text-center flex flex-col items-center justify-center">
          <template v-if="allowFreeText">
            <div @click="selectFreeText" class="w-full p-4 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer transition-colors flex items-center gap-3">
              <div class="h-10 w-10 bg-white rounded-full flex items-center justify-center shrink-0">
                <MapPinIcon class="w-5 h-5 text-blue-600" />
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-gray-900">Use "{{ searchQuery }}"</p>
                <p class="text-[12px] text-gray-500 mt-0.5">Set as exact address</p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p class="text-sm font-bold text-black">No locations found</p>
            <p class="text-[12px] text-gray-500 mt-0.5">Try searching for a different city or airport</p>
          </template>
        </div>

        <!-- Initial Prompt State (Cute empty state) -->
        <div v-show="!isLoading && !searchQuery && results.length === 0" class="py-12 px-5 text-center flex flex-col items-center justify-center">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-[15px] font-bold text-gray-800">Where are we flying?</p>
          <p class="text-[13px] text-gray-500 mt-1 max-w-[200px] leading-relaxed">Search for a city or airport to start your journey.</p>
        </div>

        <!-- Loading -->
        <div v-show="isLoading" class="py-10 text-center">
          <div class="animate-spin h-4 w-4 border-2 border-gray-200 border-t-gray-900 rounded-full mx-auto mb-2" />
        </div>
        </div> <!-- End overflow-y-auto -->
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { MapPinIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAmadeusLocations } from '@/composables/modules/flights/useAmadeusLocations'
import { useMapboxGeolocation } from '@/composables/useMapboxGeolocation'
import { flightsApi } from '@/api_factory/modules/flights'

const props = defineProps({
  modelValue:    { type: String, default: '' },
  label:         { type: String, default: '' },
  placeholder:   { type: String, default: '' },
  allowFreeText: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'select', 'focus', 'close'])

const { locations: results, loading: isLoading, searchLocations, detectNearestAirports } = useAmadeusLocations()
const { detectUserLocation, location: userGeoLocation } = useMapboxGeolocation()

const pickerRef       = ref<HTMLElement | null>(null)
const searchInputRef  = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const mobileSearchInputRef = ref<HTMLInputElement | null>(null)
const showDropdown    = ref(false)
const isMobile        = ref(false)

const searchQuery          = ref('')
const selectedLocationName = ref('')
const selectedLocationSub  = ref('')
const detectedCountryAirports = ref<any[]>([])
const userCountryName = ref('')

const locationCache = new Map<string, { name: string; sub: string }>()


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
  nextTick(() => {
    if (isMobile.value) {
      mobileSearchInputRef.value?.focus()
    } else {
      searchInputRef.value?.focus()
    }
  })
}

const closeDropdown = () => {
  showDropdown.value = false
  searchQuery.value  = ''
  results.value      = []
  emit('close')
}

const selectAmadeusResult = (location: any) => {
  const iataCode = location.iataCode || location.address?.cityCode || location.id || location.code
  if (!iataCode) return // Prevent selecting invalid locations

  const cityName = location.address?.cityName || location.name || location.detailedName
  let sub = location.name || ''
  if (location.subType === 'AIRPORT' && !sub.toLowerCase().includes('airport')) {
    sub += ' Airport'
  }
  sub = sub.trim()
  
  locationCache.set(iataCode, { name: cityName, sub })
  selectedLocationName.value = cityName
  selectedLocationSub.value  = sub
  emit('update:modelValue', iataCode)
  emit('select', location)
  closeDropdown()
}

const selectFreeText = () => {
  const text = searchQuery.value.trim()
  if (!text) return
  
  locationCache.set(text, { name: text, sub: 'Custom Location' })
  selectedLocationName.value = text
  selectedLocationSub.value = 'Custom Location'
  emit('update:modelValue', text)
  emit('select', { name: text, isCustom: true })
  closeDropdown()
}


const detectLocation = async () => {
  isLoading.value = true
  try {
    const geo = await detectUserLocation()
    if (geo && geo.latitude && geo.longitude) {
      let data = await detectNearestAirports(geo.latitude, geo.longitude)
      
      if (!data || data.length === 0) {
        if (geo.city) {
          await searchLocations(geo.city, geo.countryCode)
          data = results.value
        }
      }
      
      if (!data || data.length === 0) {
        if (geo.region && geo.region !== geo.city) {
          await searchLocations(geo.region, geo.countryCode)
          data = results.value
        }
      }
      
      if (!data || data.length === 0) {
        if (geo.countryName) {
          await searchLocations(geo.countryName, geo.countryCode)
          data = results.value
        }
      }

      if (data?.length) {
        results.value = data
      }
    }
  } catch (e) {
    console.warn('[LocationPicker] Location detection failed:', e)
  } finally {
    isLoading.value = false
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (showDropdown.value) {
    const isOutsidePicker = pickerRef.value && !pickerRef.value.contains(e.target as Node)
    const isOutsideDropdown = dropdownRef.value && !dropdownRef.value.contains(e.target as Node)
    if (isOutsidePicker && isOutsideDropdown) {
      closeDropdown()
    }
  }
}

/**
 * Use Mapbox to detect user's location and load nearby airports for their country
 */
const autoDetectWithMapbox = async () => {
  try {
    const geo = await detectUserLocation()
    
    if (geo && geo.latitude && geo.longitude) {
      // Get nearest airports from the detected coordinates
      let airports = await detectNearestAirports(geo.latitude, geo.longitude)
      
      if (!airports || airports.length === 0) {
        if (geo.city) {
          await searchLocations(geo.city, geo.countryCode)
          airports = results.value
        }
      }
      
      if (!airports || airports.length === 0) {
        if (geo.region && geo.region !== geo.city) {
          await searchLocations(geo.region, geo.countryCode)
          airports = results.value
        }
      }
      
      if (!airports || airports.length === 0) {
        if (geo.countryName) {
          await searchLocations(geo.countryName, geo.countryCode)
          airports = results.value
        }
      }
      
      if (airports && airports.length > 0) {
        // Store country airports for the dropdown suggestions
        detectedCountryAirports.value = airports
        userCountryName.value = geo.countryName || geo.city || ''
        
        // Auto-select the closest airport for the 'From' field
        if (props.label === 'From' && !props.modelValue) {
          selectAmadeusResult(airports[0])
        }
      }
    }
  } catch (e) {
    console.warn('[LocationPicker] Mapbox auto-detect failed, using defaults:', e)
  }
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    selectedLocationName.value = ''
    selectedLocationSub.value  = ''
    return
  }
  const cached = locationCache.get(val)
  if (cached) { 
    selectedLocationName.value = cached.name
    selectedLocationSub.value = cached.sub 
  } else { 
    // Show code temporarily
    selectedLocationName.value = val
    selectedLocationSub.value = ''
    
    // Fetch full name dynamically if it's a 3-letter IATA code
    if (val.length === 3) {
      flightsApi.getDuffelAirport(`arp_${val.toLowerCase()}_`).then(res => {
        const data = res.data?.data || res.data
        if (data && (data.iata_code || data.iataCode)) {
          const name = data.city_name || data.cityName || data.name || val
          let subName = data.name || ''
          if ((data.type === 'airport' || data.subType === 'AIRPORT') && !subName.toLowerCase().includes('airport')) {
            subName += ' Airport'
          }
          const sub = subName.trim()
          locationCache.set(val, { name, sub })
          // Only update if the modelValue hasn't changed since the request started
          if (props.modelValue === val) {
            selectedLocationName.value = name
            selectedLocationSub.value = sub
          }
        }
      }).catch(e => {
        console.warn('[LocationPicker] Failed to resolve initial IATA code', e)
      })
    }
  }
}, { immediate: true })

const checkMobile = () => { isMobile.value = window.innerWidth < 768 }

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('click', handleClickOutside)

  // Auto-detect user's location using Mapbox if it's the 'From' field and no value is pre-selected
  if (props.label === 'From' && !props.modelValue) {
    autoDetectWithMapbox()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('click', handleClickOutside)
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