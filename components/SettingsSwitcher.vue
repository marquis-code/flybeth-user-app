<template>
  <SideDrawer :visible="show" title="Preferences" @close="$emit('close')">
    <template #default>
      <!-- Compact Header & Tab Switcher -->
      <div class="px-6 pb-4 pt-4 border-b border-gray-100">
        <div class="flex bg-gray-100 p-1.5 rounded-2xl">
          <button 
            v-for="tab in ['language', 'currency']" 
            :key="tab"
            @click="currentTab = tab"
            class="flex-1 py-3 text-sm uppercase rounded-xl transition-all duration-300 font-bold"
            :class="currentTab === tab ? 'bg-white text-[#0D1DAD] shadow-sm' : 'text-gray-500 hover:text-black'"
          >
            {{ $t(`settings.${tab}`) }}
          </button>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="p-6">
        <!-- Language Tab -->
        <div v-if="currentTab === 'language'" class="animate-in">
          <div class="flex flex-col gap-3">
            <button 
              v-for="locale in locales" 
              :key="locale.code"
              @click="changeLocale(locale.code)"
              class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group"
              :class="currentLocale === locale.code ? 'border-[#0D1DAD] bg-blue-50' : 'border-gray-100 hover:border-blue-100 hover:bg-gray-50'"
            >
              <img :src="getLocaleFlag(locale.code)" class="h-6 w-8 object-cover rounded shadow-sm border border-gray-200" />
              <div class="text-left flex-1">
                <div class="text-sm font-bold text-black">{{ locale.name }}</div>
                <div class="text-xs text-gray-500 uppercase">{{ locale.iso }}</div>
              </div>
              <!-- Selection Indicator -->
              <div v-if="currentLocale === locale.code" class="shrink-0">
                 <div class="h-6 w-6 rounded-full bg-[#0D1DAD] flex items-center justify-center text-white">
                    <CheckIcon class="h-4 w-4" />
                 </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Currency Tab -->
        <div v-if="currentTab === 'currency'" class="animate-in">
          <div class="flex flex-col gap-3">
            <button 
              v-for="currency in currencies" 
              :key="currency.code"
              @click="setCurrency(currency.code)"
              class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group relative"
              :class="currentCurrency.code === currency.code ? 'border-[#0D1DAD] bg-blue-50' : 'border-gray-100 hover:border-blue-100 hover:bg-gray-50'"
            >
              <img :src="currency.flag" class="h-6 w-8 object-cover rounded shadow-sm border border-gray-200" />
              <div class="text-left flex-1">
                <div class="text-sm font-bold text-black">{{ currency.code }}</div>
                <div class="text-xs text-gray-500 font-bold">{{ currency.symbol }}</div>
              </div>
              <div v-if="currentCurrency.code === currency.code" class="shrink-0">
                 <div class="h-6 w-6 rounded-full bg-[#0D1DAD] flex items-center justify-center text-white">
                    <CheckIcon class="h-4 w-4" />
                 </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <!-- Footer Action -->
      <div class="px-6 py-5 bg-white flex flex-col justify-between items-center gap-4">
         <p class="text-[11px] text-gray-500 uppercase text-center font-bold">
           {{ currentTab === 'language' ? 'Settings will update UI strings' : 'Settings will update price data' }}
         </p>
         <button 
           @click="$emit('close')" 
           class="w-full py-4 bg-black text-white text-sm uppercase rounded-xl hover:bg-gray-900 transition-all font-bold"
         >
            {{ $t('settings.applyChanges') }}
         </button>
      </div>
    </template>
  </SideDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'
import { useSettings, localeToCurrency } from '@/composables/useSettings'
import SideDrawer from '@/components/ui/SideDrawer.vue'

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
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.98) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-in {
  animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
