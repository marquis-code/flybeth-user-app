<template>
  <Transition name="fade-scale">
    <div v-if="show" class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden">
      <div class="bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
        <!-- Close Button -->
        <button 
          @click="$emit('close')" 
          class="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-[60]"
        >
          <XMarkIcon class="h-6 w-6 text-gray-400" />
        </button>

        <!-- Scrollable Content -->
        <div class="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-grow">
          <!-- Language Section -->
          <div class="mb-12">
            <h3 class="text-xs font-black text-brand-blue uppercase tracking-[0.3em] mb-8 border-b border-gray-100 pb-4">{{ $t('settings.language') }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button 
                v-for="locale in locales" 
                :key="locale.code"
                @click="changeLocale(locale.code)"
                class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group"
                :class="currentLocale === locale.code ? 'border-brand-green bg-brand-green/5' : 'border-gray-100 hover:border-brand-green/50 hover:bg-gray-50'"
              >
                <img :src="getLocaleFlag(locale.code)" class="h-6 w-8 object-cover rounded shadow-sm" />
                <div class="text-left">
                  <div class="text-sm font-black text-brand-blue">{{ locale.name }}</div>
                  <div class="text-sm text-brand-gray/50 uppercase tracking-widest">{{ locale.iso }}</div>
                </div>
                <!-- Selection Indicator -->
                <div v-if="currentLocale === locale.code" class="ml-auto">
                   <div class="h-6 w-6 rounded-full bg-brand-green flex items-center justify-center text-white ring-4 ring-brand-green/10">
                      <CheckIcon class="h-4 w-4" />
                   </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Currency Section -->
          <div>
            <h3 class="text-xs font-black text-brand-blue uppercase tracking-[0.3em] mb-8 border-b border-gray-100 pb-4">{{ $t('settings.currency') }}</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <button 
                v-for="currency in currencies" 
                :key="currency.code"
                @click="setCurrency(currency.code)"
                class="flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group"
                :class="currentCurrency.code === currency.code ? 'border-brand-green bg-brand-green/5' : 'border-gray-100 hover:border-brand-green/50 hover:bg-gray-50'"
              >
                <img :src="currency.flag" class="h-4 w-6 object-cover rounded shadow-sm mb-3" />
                <div class="text-sm font-black text-brand-blue">{{ currency.code }}</div>
                <div class="text-sm text-brand-gray/40 font-bold">{{ currency.symbol }}</div>
                
                <div v-if="currentCurrency.code === currency.code" class="mt-2 text-brand-green flex items-center justify-center">
                   <CheckIcon class="h-3 w-3" />
                </div>
              </button>
          </div>
        </div>
      </div>

        <!-- Sticky Footer Action -->
        <div class="px-8 md:px-12 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end items-center gap-6">
           <p class="text-sm font-bold text-brand-gray/40 uppercase tracking-widest">Global preferences will be saved</p>
           <UiBaseButton variant="primary" size="lg" @click="$emit('close')" class="!rounded-full px-12 shadow-xl shadow-brand-blue/20">
              {{ $t('settings.applyChanges') }}
           </UiBaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { XMarkIcon, CheckIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'
import { useSettings, localeToCurrency } from '@/composables/useSettings'

defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const { locale: currentLocale, locales, setLocale } = useI18n() as any
const { currentCurrency, currencies, setCurrency } = useSettings()

const changeLocale = async (code: string) => {
  await setLocale(code)
  
  // scalablity fix: automatically set currency based on mapping
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
</style>
