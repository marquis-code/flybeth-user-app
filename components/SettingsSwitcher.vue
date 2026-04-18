<template>
  <Transition name="fade-scale">
    <div v-if="show" class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden" @click.self="$emit('close')">
      <div class="bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] w-full max-w-lg flex flex-col relative overflow-hidden transition-all duration-500">
        <!-- Close Button -->
        <button 
          @click="$emit('close')" 
          class="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors z-[60] group"
        >
          <XMarkIcon class="h-5 w-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
        </button>

        <!-- Compact Header & Tab Switcher -->
        <div class="pt-8 px-8 pb-4 border-b border-gray-50">
          <h2 class="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Preferences</h2>
          <div class="flex bg-gray-100 p-1.5 rounded-2xl">
            <button 
              v-for="tab in ['language', 'currency']" 
              :key="tab"
              @click="currentTab = tab"
              class="flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500"
              :class="currentTab === tab ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            >
              {{ $t(`settings.${tab}`) }}
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-grow min-h-[300px] max-h-[50vh]">
          <!-- Language Tab -->
          <div v-if="currentTab === 'language'" class="animate-in">
            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="locale in locales" 
                :key="locale.code"
                @click="changeLocale(locale.code)"
                class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all relative group"
                :class="currentLocale === locale.code ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-100 hover:border-brand-blue/50 hover:bg-gray-50'"
              >
                <img :src="getLocaleFlag(locale.code)" class="h-6 w-8 object-cover rounded shadow-sm border border-gray-100" />
                <div class="text-left overflow-hidden">
                  <div class="text-[11px] font-bold text-gray-900 truncate">{{ locale.name }}</div>
                  <div class="text-[9px] text-gray-400 uppercase tracking-widest">{{ locale.iso }}</div>
                </div>
                <!-- Selection Indicator -->
                <div v-if="currentLocale === locale.code" class="ml-auto shrink-0">
                   <div class="h-5 w-5 rounded-full bg-brand-blue flex items-center justify-center text-white scale-110 shadow-lg shadow-brand-blue/20">
                      <CheckIcon class="h-3 w-3" />
                   </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Currency Tab -->
          <div v-if="currentTab === 'currency'" class="animate-in">
            <div class="grid grid-cols-3 gap-3">
              <button 
                v-for="currency in currencies" 
                :key="currency.code"
                @click="setCurrency(currency.code)"
                class="flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group relative"
                :class="currentCurrency.code === currency.code ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-100 hover:border-brand-blue/50 hover:bg-gray-50'"
              >
                <img :src="currency.flag" class="h-4 w-6 object-cover rounded shadow-sm mb-2 border border-gray-100" />
                <div class="text-[11px] font-bold text-gray-900">{{ currency.code }}</div>
                <div class="text-[10px] text-gray-400 font-bold tracking-widest">{{ currency.symbol }}</div>
                
                <div v-if="currentCurrency.code === currency.code" class="absolute top-2 right-2">
                   <CheckIcon class="h-3 w-3 text-brand-blue" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Compact Footer Action -->
        <div class="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
           <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center sm:text-left">
             {{ currentTab === 'language' ? 'Settings will update UI strings' : 'Settings will update price data' }}
           </p>
           <button 
             @click="$emit('close')" 
             class="w-full sm:w-auto px-10 py-3 bg-brand-blue text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all "
           >
              {{ $t('settings.applyChanges') }}
           </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon, CheckIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'
import { useSettings, localeToCurrency } from '@/composables/useSettings'

defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const currentTab = ref('language')
const { locale: currentLocale, locales, setLocale } = useI18n() as any
const { currentCurrency, currencies, setCurrency } = useSettings()

const changeLocale = async (code: string) => {
  await setLocale(code)
  
  // Suggested currency logic
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
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.98) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-in {
  animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
