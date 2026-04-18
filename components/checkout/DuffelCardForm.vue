<template>
  <div class="duffel-card-form space-y-4 p-4 bg-white rounded-xl border border-gray-300 animate-fade-in">
    <div class="flex items-center gap-2 mb-2">
      <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
      </div>
      <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Secure Payment Card</h3>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="space-y-1">
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Cardholder Name</label>
        <input 
          v-model="cardData.name"
          type="text" 
          placeholder="AS WRITTEN ON CARD"
          class="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none text-sm font-medium"
        />
      </div>

      <div class="space-y-1">
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Card Number</label>
        <div class="relative">
          <input 
            v-model="cardData.number"
            type="text" 
            placeholder="0000 0000 0000 0000"
            maxlength="19"
            @input="formatCardNumber"
            class="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none text-sm font-medium tracking-widest"
          />
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" class="h-4 opacity-40" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" class="h-3 opacity-40 self-center" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Expiry Date</label>
          <input 
            v-model="cardData.expiry"
            type="text" 
            placeholder="MM / YY"
            maxlength="7"
            @input="formatExpiry"
            class="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none text-sm font-medium text-center"
          />
        </div>
        <div class="space-y-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">CVV / CVC</label>
          <input 
            v-model="cardData.cvv"
            type="text" 
            placeholder="•••"
            maxlength="4"
            autocomplete="cc-csc"
            class="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none text-sm font-bold text-center tracking-widest"
          />
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 pt-2 grayscale opacity-50">
      <img src="https://assets.duffel.com/img/duffel-logo-black.svg" class="h-3" />
      <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">PCI-DSS Secure Vault</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: {
    name: string;
    number: string;
    expiry: string;
    expiry_month?: string;
    expiry_year?: string;
    cvv: string;
  }
}>()

const emit = defineEmits(['update:modelValue'])

const cardData = ref({ ...props.modelValue })

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
    cardData.value.expiry_year = '20' + parts[1]
  }
}
</script>
