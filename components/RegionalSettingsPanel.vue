<template>
  <SideDrawer :visible="visible" @close="$emit('close')">
    <template #title>Select Region & Currency</template>
    <template #default>
      <div class="flex flex-col h-full">
        <!-- Header Tabs -->
        <div class="p-4 pb-0">
          <div class="flex bg-[#F3F4F6] rounded-full p-1">
            <button
              @click="activeSection = 'language'"
              :class="['flex-1 py-2.5 text-[13px] font-semibold rounded-full transition-all', activeSection === 'language' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]']"
            >Language</button>
            <button
              @click="activeSection = 'currency'"
              :class="['flex-1 py-2.5 text-[13px] font-semibold rounded-full transition-all', activeSection === 'currency' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]']"
            >Currency</button>
          </div>
        </div>

        <!-- Search -->
        <div class="px-4 py-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#1A2ED4] focus:ring-1 focus:ring-[#1A2ED4] transition-colors"
          />
        </div>

        <!-- Scrollable List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">

          <!-- Language List -->
          <template v-if="activeSection === 'language'">
            <div
              v-for="loc in filteredLocales"
              :key="loc.code"
              @click="changeLocale(loc.code)"
              class="flex items-center gap-4 py-3.5 border-b border-[#F3F4F6] last:border-b-0 cursor-pointer group"
            >
              <div class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#E5E7EB] bg-[#F9FAFB]">
                <img :src="getLocaleFlag(loc.code)" :alt="loc.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[14px] font-semibold text-[#111827] leading-tight">{{ getLocalizedCountryName(loc.code) }}</p>
                <p class="text-[12px] text-[#9CA3AF] font-medium mt-0.5">{{ loc.name }}</p>
              </div>
              <div class="flex-shrink-0">
                <div v-if="currentLocale === loc.code" class="w-6 h-6 rounded-full bg-[#1A2ED4] flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else class="w-6 h-6 rounded-full border-2 border-[#D1D5DB] group-hover:border-[#9CA3AF] transition-colors"></div>
              </div>
            </div>
          </template>

          <!-- Currency List -->
          <template v-else>
            <div
              v-for="currencyData in filteredCurrencies"
              :key="currencyData.code"
              @click="setCurrency(currencyData.code)"
              class="flex items-center gap-4 py-3.5 border-b border-[#F3F4F6] last:border-b-0 cursor-pointer group"
            >
              <div class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#E5E7EB] bg-[#F9FAFB]">
                <img :src="currencyData.flag" :alt="currencyData.code" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[14px] font-semibold text-[#111827] leading-tight">{{ currencyData.name || currencyData.code }}</p>
                <p class="text-[12px] text-[#9CA3AF] font-medium mt-0.5">{{ currencyData.code }} · {{ currencyData.symbol }}</p>
              </div>
              <div class="flex-shrink-0">
                <div v-if="currentCurrency.code === currencyData.code" class="w-6 h-6 rounded-full bg-[#1A2ED4] flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else class="w-6 h-6 rounded-full border-2 border-[#D1D5DB] group-hover:border-[#9CA3AF] transition-colors"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </SideDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings, localeToCurrency } from '@/composables/useSettings'
import SideDrawer from '@/components/ui/SideDrawer.vue'

defineProps({
  visible: { type: Boolean, default: false }
})

defineEmits(['close'])

const { locale: currentLocale, locales, setLocale } = useI18n() as any
const { currentCurrency, currencies, setCurrency } = useSettings()

const activeSection = ref<'language' | 'currency'>('language')
const searchQuery = ref('')

const changeLocale = async (code: string) => {
  await setLocale(code)
  const suggestedCurrencyCode = localeToCurrency[code]
  if (suggestedCurrencyCode) {
    setCurrency(suggestedCurrencyCode)
  }
}

const filteredLocales = computed(() => {
  if (!searchQuery.value) return locales.value || locales
  const q = searchQuery.value.toLowerCase()
  const list = locales.value || locales
  return list.filter((loc: any) =>
    loc.name?.toLowerCase().includes(q) || loc.code?.toLowerCase().includes(q) || getLocalizedCountryName(loc.code).toLowerCase().includes(q)
  )
})

const filteredCurrencies = computed(() => {
  if (!searchQuery.value) return currencies.value || currencies
  const q = searchQuery.value.toLowerCase()
  const list = currencies.value || currencies
  return list.filter((c: any) =>
    (c.name || c.code).toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  )
})

const getLocaleFlag = (code: string) => {
  const flags: Record<string, string> = {
    'en': 'https://flagcdn.com/w80/us.png',
    'es': 'https://flagcdn.com/w80/us.png',
    'fr': 'https://flagcdn.com/w80/fr.png',
    'de': 'https://flagcdn.com/w80/de.png',
    'ar': 'https://flagcdn.com/w80/sa.png',
    'zh': 'https://flagcdn.com/w80/cn.png',
    'ja': 'https://flagcdn.com/w80/jp.png',
    'pt': 'https://flagcdn.com/w80/br.png',
    'it': 'https://flagcdn.com/w80/it.png',
    'ko': 'https://flagcdn.com/w80/kr.png',
    'tr': 'https://flagcdn.com/w80/tr.png',
    'hi': 'https://flagcdn.com/w80/in.png'
  }
  return flags[code] || flags['en']
}

const getLocalizedCountryName = (code: string) => {
  const names: Record<string, string> = {
    'en': 'United States',
    'es': 'Estados Unidos',
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
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>
