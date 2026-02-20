<template>
  <div class="relative" ref="phoneRef">
    <label v-if="label" class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black mb-2 px-1 opacity-70 font-header block">
      {{ label }}
    </label>

    <div class="flex items-stretch">
      <!-- Country Code Selector -->
      <button 
        type="button" 
        @click="showDropdown = !showDropdown"
        class="flex items-center gap-2 px-4 bg-white border border-gray-100 border-r-0 rounded-l-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:bg-gray-50 transition-all text-sm font-bold text-brand-blue min-w-[100px] justify-center"
      >
        <span class="text-lg">{{ selectedCountry.flag }}</span>
        <span class="text-xs font-black text-brand-blue/70">{{ selectedCountry.dialCode }}</span>
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
        class="flex-grow px-5 py-4 bg-white border border-gray-100 border-l-0 rounded-r-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue focus:shadow-xl transition-all duration-500 font-bold text-brand-blue placeholder-brand-gray/30"
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
            class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold text-brand-blue placeholder-brand-gray/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
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
            <span class="flex-grow text-sm font-bold text-brand-blue">{{ country.name }}</span>
            <span class="text-xs font-black text-brand-gray/40">{{ country.dialCode }}</span>
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
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', currency: 'NGN' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', currency: 'GBP' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪', currency: 'AED' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', currency: 'CAD' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', currency: 'AUD' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', currency: 'EUR' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', currency: 'EUR' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', currency: 'INR' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', currency: 'CNY' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', currency: 'JPY' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', currency: 'ZAR' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', currency: 'BRL' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', currency: 'KES' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', currency: 'GHS' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', currency: 'EGP' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', currency: 'SAR' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', currency: 'SGD' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', currency: 'EUR' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', currency: 'EUR' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', currency: 'MXN' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', currency: 'TRY' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', currency: 'THB' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', currency: 'MYR' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', currency: 'PHP' },
]

const selectedCountry = ref(countries[0]) // Default to Nigeria
const phoneNumber = ref('')

// Parse initial value
if (props.modelValue) {
  const match = countries.find(c => props.modelValue.startsWith(c.dialCode))
  if (match) {
    selectedCountry.value = match
    phoneNumber.value = props.modelValue.slice(match.dialCode.length)
  } else {
    phoneNumber.value = props.modelValue
  }
}

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
  emitValue()
  emit('country-change', { 
    code: country.code, 
    currency: country.currency, 
    dialCode: country.dialCode,
    name: country.name 
  })
}

const onPhoneInput = (e: Event) => {
  phoneNumber.value = (e.target as HTMLInputElement).value
  emitValue()
}

const emitValue = () => {
  emit('update:modelValue', `${selectedCountry.value.dialCode}${phoneNumber.value}`)
}

// Click outside to close
const handleClickOutside = (e: MouseEvent) => {
  if (phoneRef.value && !phoneRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
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
