<template>
  <div class="regional-settings-panel bg-white border border-gray-200 rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] w-[320px] overflow-hidden flex flex-col">
    <!-- Tab Switcher -->
    <div class="px-5 pt-5 pb-3 bg-gray-50/50 border-b border-gray-100">
      <div class="flex bg-gray-200/50 p-1 rounded-xl">
        <button 
          v-for="tab in ['language', 'currency']" 
          :key="tab"
          @click="currentTab = tab"
          class="flex-1 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-lg transition-all"
          :class="currentTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="p-4 overflow-y-auto max-h-[360px] custom-scrollbar">
      <!-- Language Selection -->
      <div v-if="currentTab === 'language'" class="animate-fade-in grid grid-cols-1 gap-1">
        <button 
          v-for="loc in locales" 
          :key="loc.code"
          @click="changeLocale(loc.code)"
          class="flex items-center gap-3 p-2.5 rounded-xl transition-all group"
          :class="currentLocale === loc.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'"
        >
          <img :src="getLocaleFlag(loc.code)" class="h-4 w-6 object-cover rounded-sm border border-gray-200/50 shadow-sm" />
          <div class="flex flex-col items-start">
             <span class="text-xs font-bold leading-none">{{ loc.name }}</span>
             <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{{ loc.iso }}</span>
          </div>
          <div v-if="currentLocale === loc.code" class="ml-auto">
             <Check class="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      <!-- Currency Selection -->
      <div v-if="currentTab === 'currency'" class="animate-fade-in grid grid-cols-3 gap-2">
        <button 
          v-for="currencyData in currencies" 
          :key="currencyData.code"
          @click="setCurrency(currencyData.code)"
          class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1.5"
          :class="currentCurrency.code === currencyData.code ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-50 hover:border-gray-200 hover:bg-gray-50 text-gray-600'"
        >
          <img :src="currencyData.flag" class="h-3 w-5 object-cover rounded-sm border border-gray-100" />
          <span class="text-[10px] font-black tracking-tight">{{ currencyData.code }}</span>
          <span class="text-[9px] font-medium opacity-60">{{ currencyData.symbol }}</span>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-2">
       <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Global Flybeth</span>
       <div class="w-1 h-1 rounded-full bg-gray-200"></div>
       <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">v2.0</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useSettings, localeToCurrency } from '@/composables/useSettings'

const currentTab = ref('language')
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
    'es': 'https://flagcdn.com/es.svg',
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
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
</style>
