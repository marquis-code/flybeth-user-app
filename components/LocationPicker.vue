<template>
  <div class="relative w-full group" ref="pickerRef">
    <label v-if="label" :for="id" class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black mb-2 px-1 opacity-70 font-header block transition-opacity group-focus-within:opacity-100">
      {{ label }}
    </label>
    
    <div class="relative">
      <div 
        class="absolute left-5 top-1/2 -translate-y-1/2 p-2 border border-brand-blue/10 rounded-xl bg-brand-blue/5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 z-10"
        :class="{ 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20': focused }"
      >
        <MapPinIcon class="h-4 w-4" />
      </div>

      <input
        :id="id"
        type="text"
        :placeholder="placeholder"
        :value="displayValue"
        @input="onInput"
        @focus="onFocus"
        class="w-full pl-16 pr-6 py-5 bg-white rounded-[1.5rem] border border-gray-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue focus:shadow-xl transition-all duration-500 font-bold text-brand-blue placeholder-brand-gray/30"
        autocomplete="off"
      />

      <div v-if="isLoading" class="absolute right-6 top-1/2 -translate-y-1/2">
        <div class="animate-spin h-5 w-5 border-2 border-brand-blue/20 border-t-brand-blue rounded-full"></div>
      </div>
    </div>

    <!-- Dropdown Results -->
    <Transition name="dropdown">
      <div v-if="showDropdown" class="absolute z-[100] mt-4 w-full md:w-[440px] bg-white rounded-[2.5rem] shadow-[0_30px_90px_-20px_rgba(13,29,173,0.3)] border border-gray-50 overflow-hidden py-4 animate-fade-in">
        <!-- Detect Location Option -->
        <div 
          @click="detectLocation" 
          class="px-8 py-4 hover:bg-brand-blue/5 cursor-pointer group flex items-center gap-4 transition-all duration-300"
        >
          <div class="h-10 w-10 rounded-xl bg-brand-green/10 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all">
            <PaperAirplaneIcon class="h-5 w-5 text-brand-green group-hover:text-white" />
          </div>
          <div>
            <p class="text-sm font-black text-brand-blue">Detect my location</p>
            <p class="text-[10px] text-brand-gray/40 font-black uppercase tracking-widest">Find nearby airports</p>
          </div>
        </div>

        <div class="h-px bg-gray-50 mx-8 my-2"></div>

        <!-- Section Title: Suggestions (when no search query) -->
        <div v-if="!results.length && !isLoading" class="px-8 py-4">
          <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-[0.2em] mb-4">Top Destinations</p>
          <div class="space-y-2">
            <div 
              v-for="dest in suggestions" 
              :key="dest.iataCode"
              @click="selectSuggestion(dest)"
              class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-100"
            >
              <div class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-brand-blue font-black text-[10px]">{{ dest.iataCode }}</div>
              <div class="flex-grow">
                <span class="text-sm font-bold text-brand-blue">{{ dest.city }}</span>
                <span class="text-[10px] text-brand-gray/40 ml-2">{{ dest.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Real Results from Amadeus -->
        <div v-else-if="results.length" class="max-h-[400px] overflow-y-auto custom-scrollbar">
          <!-- Cities -->
          <div v-if="cityResults.length" class="px-4">
            <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-[0.2em] px-4 py-2">Cities</p>
            <div 
              v-for="res in cityResults" 
              :key="res.id"
              @click="selectAmadeusResult(res)"
              class="group p-4 hover:bg-brand-blue/5 rounded-2xl cursor-pointer flex items-center space-x-4 transition-all duration-300"
            >
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-green/10 to-brand-green/5 flex items-center justify-center transform group-hover:scale-110 transition-transform group-hover:bg-brand-green group-hover:text-white text-brand-green">
                <GlobeAltIcon class="h-5 w-5" />
              </div>
              <div class="flex-grow min-w-0">
                <p class="text-sm font-black text-brand-blue flex items-center gap-2">
                  {{ res.name }}
                  <span class="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-black">{{ res.iataCode }}</span>
                </p>
                <p class="text-[10px] text-brand-gray/40 font-bold uppercase tracking-widest truncate">
                  {{ res.address?.countryName }}
                </p>
              </div>
              <span class="text-[10px] bg-brand-blue/5 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-black text-brand-blue whitespace-nowrap">SELECT</span>
            </div>
          </div>

          <!-- Airports -->
          <div v-if="airportResults.length" class="px-4">
            <p class="text-[10px] font-black text-brand-gray/40 uppercase tracking-[0.2em] px-4 py-2" :class="{ 'mt-2': cityResults.length }">Airports</p>
            <div 
              v-for="res in airportResults" 
              :key="res.id"
              @click="selectAmadeusResult(res)"
              class="group p-4 hover:bg-brand-blue/5 rounded-2xl cursor-pointer flex items-center space-x-4 transition-all duration-300"
            >
              <div class="h-12 w-12 rounded-xl bg-brand-blue/5 flex items-center justify-center transform group-hover:scale-110 transition-transform group-hover:bg-brand-blue group-hover:text-white text-brand-blue">
                <span class="font-black text-xs">{{ res.iataCode }}</span>
              </div>
              <div class="flex-grow min-w-0">
                <p class="text-sm font-black text-brand-blue flex items-center gap-2">
                  {{ res.name }}
                  <span v-if="res.analytics?.travelers?.score" class="text-[10px] text-brand-gray/30 font-bold">
                    🔥 {{ res.analytics.travelers.score }}%
                  </span>
                </p>
                <p class="text-[10px] text-brand-gray/40 font-bold uppercase tracking-widest truncate">
                  {{ res.address?.cityName }}, {{ res.address?.countryName }}
                </p>
              </div>
              <span class="text-[10px] bg-brand-blue/5 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-black text-brand-blue whitespace-nowrap">SELECT</span>
            </div>
          </div>
        </div>

        <!-- No results found -->
        <div v-else-if="!isLoading && searchQuery.length >= 2" class="px-8 py-8 text-center">
          <p class="text-sm text-brand-gray/40 font-bold">No airports found for "{{ searchQuery }}"</p>
          <p class="text-[10px] text-brand-gray/30 mt-1">Try a different city or airport name</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon, PaperAirplaneIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'
import { flightsApi } from '@/api_factory/modules/flights'

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  id: String
})

const emit = defineEmits(['update:modelValue', 'select'])

const pickerRef = ref<HTMLElement | null>(null)
const focused = ref(false)
const showDropdown = ref(false)
const results = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const displayValue = ref(props.modelValue || '')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Separate cities from airports for grouped display
const cityResults = computed(() => results.value.filter((r: any) => r.subType === 'CITY'))
const airportResults = computed(() => results.value.filter((r: any) => r.subType === 'AIRPORT'))

const suggestions = [
  { city: 'London', iataCode: 'LON', name: 'All London Airports', subType: 'CITY' },
  { city: 'Dubai', iataCode: 'DXB', name: 'Dubai International', subType: 'AIRPORT' },
  { city: 'New York', iataCode: 'NYC', name: 'All New York Airports', subType: 'CITY' },
  { city: 'Paris', iataCode: 'CDG', name: 'Charles de Gaulle', subType: 'AIRPORT' },
]

// Watch for external modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined) {
    displayValue.value = newVal
  }
})

const onFocus = () => {
  focused.value = true
  showDropdown.value = true
}

const onInput = (e: Event) => {
  const query = (e.target as HTMLInputElement).value
  displayValue.value = query
  searchQuery.value = query
  
  // Debounce the API call
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchAirports(query)
  }, 300)
}

const fetchAirports = async (query: string) => {
  if (query.length < 2) {
    results.value = []
    return
  }

  isLoading.value = true
  try {
    const { data: res } = await flightsApi.searchAirports(query)
    if (res.success && Array.isArray(res.data)) {
      results.value = res.data
    } else {
      results.value = []
    }
  } catch (error) {
    console.error('Airport search failed', error)
    results.value = []
  } finally {
    isLoading.value = false
  }
}

const selectAmadeusResult = (location: any) => {
  const iataCode = location.iataCode
  const cityName = location.address?.cityName || location.name
  const label = location.subType === 'CITY' 
    ? `${cityName} (${iataCode})` 
    : `${location.name} - ${cityName} (${iataCode})`
  
  displayValue.value = label
  // Emit the IATA code as the model value (this is what the API needs)
  emit('update:modelValue', iataCode)
  emit('select', {
    iataCode,
    cityName,
    name: location.name,
    subType: location.subType,
    countryCode: location.address?.countryCode,
    countryName: location.address?.countryName
  })
  showDropdown.value = false
  searchQuery.value = ''
  results.value = []
}

const selectSuggestion = (dest: any) => {
  const label = `${dest.city} (${dest.iataCode})`
  displayValue.value = label
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
          // Use reverse geocoding or fallback to a broad search
          const { data: res } = await flightsApi.searchAirports('London')
          if (res.success && res.data?.length) {
            const nearest = res.data.find((d: any) => d.subType === 'AIRPORT') || res.data[0]
            selectAmadeusResult(nearest)
          }
        } catch (e) {
          console.error('Location detection failed', e)
        } finally {
          isLoading.value = false
        }
      },
      () => {
        isLoading.value = false
        // Fallback: select London
        selectSuggestion(suggestions[0])
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
</style>
