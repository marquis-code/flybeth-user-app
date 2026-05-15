<template>
  <div class="regional-settings-panel bg-white border border-gray-200 rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] w-[800px] overflow-hidden flex flex-col p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
    
    <!-- Language Section -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-black mb-4">{{ $t('language') || 'Language' }}</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <button 
          v-for="loc in locales" 
          :key="loc.code"
          @click="changeLocale(loc.code)"
          class="flex items-center gap-3 p-3 rounded-xl transition-all group border text-left"
          :class="currentLocale === loc.code ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-sm' : 'border-transparent hover:bg-gray-50 text-black'"
        >
          <img :src="getLocaleFlag(loc.code)" class="h-5 w-7 object-cover rounded shadow-sm border border-gray-200" />
          <div class="flex flex-col">
             <span class="text-sm font-medium leading-none">{{ getLocalizedCountryName(loc.code) }} - {{ loc.name }}</span>
          </div>
          <div v-if="currentLocale === loc.code" class="ml-auto">
             <Check class="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>

    <hr class="border-gray-200 mb-8" />

    <!-- Currency Section -->
    <div>
      <h3 class="text-lg font-semibold text-black mb-4">{{ $t('currency') || 'Currency' }}</h3>
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        <button 
          v-for="currencyData in currencies" 
          :key="currencyData.code"
          @click="setCurrency(currencyData.code)"
          class="flex items-center gap-2 p-2 rounded-xl transition-all border group"
          :class="currentCurrency.code === currencyData.code ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-sm' : 'border-transparent hover:bg-gray-50 text-black'"
        >
          <img :src="currencyData.flag" class="h-3.5 w-5 object-cover rounded-sm border border-gray-200 shrink-0" />
          <span class="text-[13px] font-medium">{{ currencyData.code }}</span>
          <span class="text-[11px] font-medium text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5 ml-auto group-hover:bg-gray-200 transition-colors" :class="currentCurrency.code === currencyData.code ? 'bg-blue-100 text-brand-blue' : ''">{{ currencyData.symbol }}</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useSettings, localeToCurrency } from '@/composables/useSettings'

const { locale: currentLocale, locales, setLocale } = useI18n() as any
const { currentCurrency, currencies, setCurrency } = useSettings()

const changeLocale = async (code: string) => {
  await setLocale(code)
  const suggestedCurrencyCode = localeToCurrency[code]
  if (suggestedCurrencyCode) {
    setCurrency(suggestedCurrencyCode)
  }
}

const getLocaleFlag = (code: string) => {
  const flags: Record<string, string> = {
    'en': 'https://flagcdn.com/us.svg',
    'es': 'https://flagcdn.com/us.svg', // Based on image: 'Estados Unidos - Español'
    'fr': 'https://flagcdn.com/fr.svg',
    'de': 'https://flagcdn.com/de.svg',
    'ar': 'https://flagcdn.com/sa.svg',
    'zh': 'https://flagcdn.com/cn.svg',
    'ja': 'https://flagcdn.com/jp.svg',
    'pt': 'https://flagcdn.com/br.svg',
    'it': 'https://flagcdn.com/it.svg',
    'ko': 'https://flagcdn.com/kr.svg',
    'tr': 'https://flagcdn.com/tr.svg',
    'hi': 'https://flagcdn.com/in.svg'
  }
  return flags[code] || flags['en']
}

const getLocalizedCountryName = (code: string) => {
  const names: Record<string, string> = {
    'en': 'United States',
    'es': 'Estados Unidos', // As seen in image
    'fr': 'France',
    'de': 'Deutschland',
    'ar': 'المملكة العربية السعودية',
    'zh': '中国',
    'ja': '日本',
    'pt': 'Brasil',
    'it': 'Italia',
    'ko': '대한민국',
    'tr': 'Türkiye',
    'hi': 'भारत'
  }
  return names[code] || 'United States'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>
