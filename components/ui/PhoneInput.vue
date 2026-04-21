<template>
  <div class="relative" ref="phoneRef">
    <label v-if="label" class="text-[11px] uppercase tracking-[0.15em] text-brand-gray  mb-2 px-1 opacity-70  block">
      {{ label }}
    </label>

    <div class="flex items-stretch">
      <!-- Country Code Selector -->
      <button 
        type="button" 
        @click="showDropdown = !showDropdown"
        class="flex items-center gap-2 px-4 bg-white border border-gray-300 border-r-0 rounded-l-2xl hover:bg-gray-50 transition-all text-sm font-bold text-gray-900 min-w-[100px] justify-center"
      >
        <span class="text-lg">{{ selectedCountry.flag }}</span>
        <span class="text-xs  text-gray-900">{{ selectedCountry.dialCode }}</span>
        <svg class="h-3 w-3 text-brand-gray/40 transition-transform" :class="{ 'rotate-180': showDropdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Phone Number Input -->
      <input
        type="tel"
        :placeholder="placeholder || '812 345 6789'"
        :value="phoneNumber"
        @input="onPhoneInput"
        class="flex-grow px-5 py-4 bg-white border border-gray-300 border-l-0 rounded-r-2xl focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all duration-500 font-bold text-gray-900 placeholder-brand-gray/30"
      />
    </div>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="showDropdown" class="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(13,29,173,0.2)] border border-gray-50 overflow-hidden">
        <!-- Search -->
        <div class="p-3 border-b border-gray-50">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search countries..." 
            class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 placeholder-brand-gray/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
          />
        </div>
        <!-- Country List -->
        <div class="max-h-[250px] overflow-y-auto">
          <button
            v-for="country in filteredCountries"
            :key="country.code"
            type="button"
            @click="selectCountry(country)"
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-blue/5 transition-colors text-left"
            :class="{ 'bg-brand-blue/5': selectedCountry.code === country.code }"
          >
            <span class="text-lg">{{ country.flag }}</span>
            <span class="flex-grow text-sm font-bold text-gray-900">{{ country.name }}</span>
            <span class="text-xs  text-brand-gray/40">{{ country.dialCode }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'country-change'])

const phoneRef = ref<HTMLElement | null>(null)
const showDropdown = ref(false)
const searchQuery = ref('')

const countries = [
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', currency: 'NGN', maxLength: 10 },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', currency: 'USD', maxLength: 10 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', currency: 'GBP', maxLength: 10 },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪', currency: 'AED', maxLength: 9 },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', currency: 'CAD', maxLength: 10 },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', currency: 'AUD', maxLength: 9 },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', currency: 'EUR', maxLength: 11 },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', currency: 'EUR', maxLength: 9 },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', currency: 'INR', maxLength: 10 },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', currency: 'CNY', maxLength: 11 },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', currency: 'JPY', maxLength: 10 },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', currency: 'ZAR', maxLength: 9 },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', currency: 'BRL', maxLength: 11 },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', currency: 'KES', maxLength: 9 },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', currency: 'GHS', maxLength: 9 },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', currency: 'EGP', maxLength: 10 },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', currency: 'SAR', maxLength: 9 },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', currency: 'SGD', maxLength: 8 },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', currency: 'EUR', maxLength: 10 },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', currency: 'EUR', maxLength: 9 },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', currency: 'MXN', maxLength: 10 },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', currency: 'TRY', maxLength: 10 },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', currency: 'THB', maxLength: 9 },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', currency: 'MYR', maxLength: 9 },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', currency: 'PHP', maxLength: 10 },
]

const selectedCountry = ref(countries[0]) // Default to Nigeria
const phoneNumber = ref('')

// Update internal phoneNumber when props change
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    phoneNumber.value = ''
    return
  }
  
  // Update state without infinite loop
  const match = countries.find(c => newVal.startsWith(c.dialCode))
  if (match) {
    selectedCountry.value = match
    const cleanNum = newVal.slice(match.dialCode.length).replace(/\D/g, '')
    if (cleanNum !== phoneNumber.value) {
      phoneNumber.value = cleanNum.slice(0, match.maxLength)
    }
  }
}, { immediate: true })

const filteredCountries = computed(() => {
  if (!searchQuery.value) return countries
  const q = searchQuery.value.toLowerCase()
  return countries.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.dialCode.includes(q) || 
    c.code.toLowerCase().includes(q)
  )
})

const selectCountry = (country: typeof countries[0]) => {
  selectedCountry.value = country
  showDropdown.value = false
  searchQuery.value = ''
  // Truncate existing number if it exceeds new country's limit
  phoneNumber.value = phoneNumber.value.slice(0, country.maxLength)
  emitValue()
  emit('country-change', { 
    code: country.code, 
    currency: country.currency, 
    dialCode: country.dialCode,
    name: country.name 
  })
}

const onPhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  // Remove non-digits and leading zeros (E.164 usually doesn't want leading zeros)
  let val = input.value.replace(/\D/g, '')
  if (val.startsWith('0')) val = val.substring(1)
  
  // Truncate to country max length
  phoneNumber.value = val.slice(0, selectedCountry.value.maxLength)
  input.value = phoneNumber.value // Update UI immediately
  emitValue()
}

const emitValue = () => {
  const fullNumber = `${selectedCountry.value.dialCode}${phoneNumber.value}`
  emit('update:modelValue', fullNumber)
}

// Click outside to close
const handleClickOutside = (e: MouseEvent) => {
  if (phoneRef.value && !phoneRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(async () => {
  window.addEventListener('click', handleClickOutside)
  
  // Auto-detect location if no phone number is provided
  if (!props.modelValue) {
    try {
      const { data } = await axios.get('https://ipapi.co/json/')
      if (data && data.country_code) {
        const match = countries.find(c => c.code === data.country_code)
        if (match) {
          selectedCountry.value = match
          emitValue()
        }
      }
    } catch (e) {
      console.warn('Geolocation failed', e)
    }
  }
})

onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>

<script lang="ts">
import axios from 'axios'
export default {}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
