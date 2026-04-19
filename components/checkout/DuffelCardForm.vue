<template>
  <div class="duffel-card-form space-y-4 lg:p-4 bg-white rounded-xl lg:border lg:border-gray-100 animate-fade-in">
    <div class="flex items-center gap-2 mb-2">
      <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
        <Lock class="w-4 h-4" />
      </div>
      <h3 class="text-sm font-bold text-gray-800 tracking-wider">Secure Payment Card</h3>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="space-y-1">
        <label class="text-[10px] font-bold text-gray-400 tracking-widest pl-1">Cardholder Name</label>
        <input 
          v-model="cardData.name"
          type="text" 
          placeholder="AS WRITTEN ON CARD"
          class="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue transition-all outline-none text-sm font-medium"
        />
      </div>

      <div class="space-y-1">
        <label class="text-[10px] font-bold text-gray-400 tracking-widest pl-1">Card Number</label>
        <div class="relative">
          <input 
            v-model="cardData.number"
            type="text" 
            placeholder="0000 0000 0000 0000"
            maxlength="19"
            @input="formatCardNumber"
            class="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue transition-all outline-none text-sm font-medium tracking-widest"
          />
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
             <img src="@/assets/icons/master-card.svg" class="h-4" />
             <img src="@/assets/icons/visa.svg" class="h-4 self-center" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-gray-400 tracking-widest pl-1">Expiry Date</label>
          <input 
            v-model="cardData.expiry"
            type="text" 
            placeholder="MM / YY"
            maxlength="7"
            @input="formatExpiry"
            class="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue transition-all outline-none text-sm font-medium text-center"
          />
        </div>
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-gray-400 tracking-widest pl-1">CVV / CVC</label>
          <input 
            v-model="cardData.cvv"
            type="text" 
            placeholder="•••"
            maxlength="4"
            autocomplete="cc-csc"
            class="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue transition-all outline-none text-sm font-bold text-center tracking-widest"
          />
        </div>
      </div>

      <!-- Billing Address -->
      <div class="space-y-3 pt-2">
        <p class="text-[10px] font-black text-gray-400 tracking-widest uppercase pl-1">Billing Address</p>
        
        <div class="grid grid-cols-1 gap-3">
          <input 
            ref="address1Ref"
            v-model="cardData.address_line_1" 
            type="text" 
            placeholder="Address Line 1 (Google Autocomplete)" 
            class="w-full h-11 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue transition-all outline-none text-sm" 
          />
          <input 
            ref="address2Ref"
            v-model="cardData.address_line_2" 
            type="text" 
            placeholder="Address Line 2 (Optional)" 
            class="w-full h-11 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue transition-all outline-none text-sm" 
          />
        </div>

        <div class="space-y-1">
           <SelectInput 
              v-model="cardData.address_country_code"
              label="Country"
              :options="countryOptions"
              @update:modelValue="handleCountryChange"
           />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <SelectInput 
              v-model="cardData.address_region"
              label="State / Region"
              :options="stateOptions"
              :disabled="!cardData.address_country_code || loadingStates"
              @update:modelValue="handleStateChange"
           />
           <SelectInput 
              v-model="cardData.address_city"
              label="City"
              :options="cityOptions"
              :disabled="!cardData.address_region || loadingCities"
           />
        </div>

        <div class="space-y-1">
          <input 
            v-model="cardData.address_postal_code" 
            type="text" 
            placeholder="Postal / Zip Code" 
            class="w-full h-11 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue transition-all outline-none text-sm" 
          />
        </div>
      </div>

      <div class="pt-4 border-t border-gray-50 flex items-center gap-3">
         <label class="flex items-center gap-3 cursor-pointer group">
           <input 
             type="checkbox" 
             v-model="cardData.multi_use"
             class="custom-checkbox"
           />
           <span class="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Remember this card for future use</span>
         </label>
      </div>
    </div>

    <div class="flex items-center gap-2 pt-2 opacity-50">
      <Lock class="w-3 h-3 text-gray-400" />
      <span class="text-[9px] font-bold text-gray-400 tracking-tighter uppercase">PCI-DSS Secure Vault | 256-bit Encryption</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Lock } from 'lucide-vue-next'
import SelectInput from '@/components/ui/SelectInput.vue'
import axios from 'axios'

const props = defineProps<{
  modelValue: {
    name: string;
    number: string;
    expiry: string;
    expiry_month?: string;
    expiry_year?: string;
    cvv: string;
    address_line_1: string;
    address_line_2: string;
    address_city: string;
    address_region: string;
    address_country_code: string;
    address_postal_code: string;
    multi_use: boolean;
  }
}>()

const emit = defineEmits(['update:modelValue'])

const cardData = ref({ ...props.modelValue })
const address1Ref = ref<HTMLInputElement | null>(null)
const address2Ref = ref<HTMLInputElement | null>(null)

const countryOptions = ref<{ label: string, value: string }[]>([])
const stateOptions = ref<string[]>([])
const cityOptions = ref<string[]>([])
const loadingStates = ref(false)
const loadingCities = ref(false)

// Fetch countries on mount
onMounted(async () => {
  try {
    const { data } = await axios.get('https://countriesnow.space/api/v0.1/countries/iso')
    countryOptions.value = data.data.map((c: any) => ({
      label: c.name,
      value: c.Iso2
    }))

    // Initialize Google Autocomplete if script loaded
    if (window.google) {
      if (address1Ref.value) initAutocomplete(address1Ref.value)
      if (address2Ref.value) initAutocomplete(address2Ref.value, true)
    }
  } catch (e) {
    console.error('Failed to fetch countries', e)
  }
})

const initAutocomplete = (el: HTMLInputElement, isLine2 = false) => {
  const autocomplete = new google.maps.places.Autocomplete(el, {
    types: ['address'],
    fields: ['address_components', 'formatted_address']
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (!place.address_components) return

    if (isLine2) {
      cardData.value.address_line_2 = place.formatted_address || ''
    } else {
      cardData.value.address_line_1 = place.formatted_address || ''
    }
    
    // Parse components
    place.address_components.forEach(comp => {
      const type = comp.types[0]
      if (type === 'country') {
        cardData.value.address_country_code = comp.short_name
        handleCountryChange(comp.short_name, comp.long_name)
      }
      if (type === 'postal_code') {
        cardData.value.address_postal_code = comp.long_name
      }
      if (type === 'locality' || type === 'postal_town') {
        cardData.value.address_city = comp.long_name
      }
      if (type === 'administrative_area_level_1') {
        cardData.value.address_region = comp.long_name
      }
    })
  })
}

const handleCountryChange = async (val: string, label?: string) => {
  const countryName = label || countryOptions.value.find(c => c.value === val)?.label
  if (!countryName) return

  loadingStates.value = true
  stateOptions.value = []
  cardData.value.address_region = ''
  cardData.value.address_city = ''
  
  try {
    const { data } = await axios.post('https://countriesnow.space/api/v0.1/countries/states', { country: countryName })
    stateOptions.value = data.data.states.map((s: any) => s.name)
  } catch (e) {
    console.error('Failed to fetch states', e)
  } finally {
    loadingStates.value = false
  }
}

const handleStateChange = async (stateName: string) => {
  const countryName = countryOptions.value.find(c => c.value === cardData.value.address_country_code)?.label
  if (!countryName || !stateName) return

  loadingCities.value = true
  cityOptions.value = []
  cardData.value.address_city = ''

  try {
    const { data } = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', { country: countryName, state: stateName })
    cityOptions.value = data.data
  } catch (e) {
    console.error('Failed to fetch cities', e)
  } finally {
    loadingCities.value = false
  }
}

watch(cardData, (val) => {
  emit('update:modelValue', val)
}, { deep: true })

const formatCardNumber = (e: any) => {
  let value = e.target.value.replace(/\D/g, '')
  let formatted = value.match(/.{1,4}/g)?.join(' ') || value
  cardData.value.number = formatted.substring(0, 19)
}

const formatExpiry = (e: any) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 2) {
    value = value.substring(0, 2) + ' / ' + value.substring(2, 4)
  }
  cardData.value.expiry = value
  
  if (value.length === 7) {
    const parts = value.split(' / ')
    cardData.value.expiry_month = parts[0]
    cardData.value.expiry_year = parts[1]
  }
}
</script>

<style scoped>
.duffel-card-form {
  font-family: 'Onest', sans-serif;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
