<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button 
      type="button"
      @click="toggleDropdown"
      class="flex flex-shrink-0 items-center gap-1.5 px-3 h-10 border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all bg-white shadow-2xs group focus:outline-none focus:ring-2 focus:ring-[#0D1DAD]/20"
      :class="{ 'ring-2 ring-[#0D1DAD]/25 border-[#0D1DAD] bg-blue-50/20': isOpen }"
      :aria-expanded="isOpen"
      title="Change language and currency"
    >
      <span class="text-xs font-bold text-gray-800 uppercase tracking-wide">{{ currentLocaleCode }}</span>
      <span class="text-gray-300 text-xs">·</span>
      <span class="text-xs font-bold text-[#0D1DAD] uppercase tracking-wide">{{ effectiveCurrencyCode }}</span>
      <ChevronDown class="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform duration-200" :class="{ 'rotate-180 text-[#0D1DAD]': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown-anim">
      <div 
        v-if="isOpen" 
        class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col"
      >
        <!-- Header & Segmented Tabs -->
        <div class="p-3 pb-2.5 border-b border-gray-100 bg-gray-50/70">
          <div class="flex bg-gray-200/70 p-1 rounded-xl">
            <button 
              type="button"
              @click="activeTab = 'language'; searchQuery = ''"
              class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
              :class="activeTab === 'language' ? 'bg-white text-[#0D1DAD] shadow-xs' : 'text-gray-600 hover:text-black'"
            >
              <Globe class="w-3.5 h-3.5" />
              <span>Language</span>
              <span class="text-[10px] font-semibold text-gray-400 uppercase">({{ currentLocaleCode }})</span>
            </button>
            <button 
              type="button"
              @click="activeTab = 'currency'; searchQuery = ''"
              class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
              :class="activeTab === 'currency' ? 'bg-white text-[#0D1DAD] shadow-xs' : 'text-gray-600 hover:text-black'"
            >
              <Coins class="w-3.5 h-3.5" />
              <span>Currency</span>
              <span class="text-[10px] font-semibold text-[#0D1DAD] uppercase">({{ effectiveCurrencyCode }})</span>
            </button>
          </div>

          <!-- Quick Search -->
          <div class="relative mt-2.5">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="activeTab === 'language' ? 'Search language...' : 'Search currency (e.g. USD, NGN, GBP)...'"
              class="w-full text-xs pl-9 pr-7 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D1DAD] focus:ring-1 focus:ring-[#0D1DAD] transition-all text-gray-900 placeholder:text-gray-400"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Scrollable List Area -->
        <div class="max-h-72 sm:max-h-80 overflow-y-auto custom-scrollbar p-1.5 divide-y divide-gray-50">
          
          <!-- LANGUAGE LIST -->
          <template v-if="activeTab === 'language'">
            <div v-if="filteredLocales.length === 0" class="py-8 text-center text-xs text-gray-400 font-medium">
              No languages matching "{{ searchQuery }}"
            </div>
            <button
              v-for="loc in filteredLocales"
              :key="loc.code"
              type="button"
              @click="selectLanguage(loc.code)"
              class="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 rounded-xl flex items-center justify-between transition-colors group"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-6 h-4 rounded-xs overflow-hidden border border-gray-200 flex-shrink-0">
                  <img 
                    :src="getLocaleFlagUrl(loc.code)" 
                    :alt="loc.name"
                    class="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-gray-900 truncate group-hover:text-[#0D1DAD] transition-colors">
                    {{ loc.name }}
                  </div>
                  <div class="text-[11px] text-gray-500 uppercase font-medium">
                    {{ loc.code }}
                  </div>
                </div>
              </div>

              <!-- Radio Indicator -->
              <div 
                class="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors"
                :class="loc.code === currentLocaleCode ? 'border-[#0D1DAD] bg-[#0D1DAD]' : 'border-gray-300 group-hover:border-gray-400'"
              >
                <div v-if="loc.code === currentLocaleCode" class="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </button>
          </template>

          <!-- CURRENCY LIST -->
          <template v-else>
            <div v-if="filteredCurrencies.length === 0" class="py-8 text-center text-xs text-gray-400 font-medium">
              No currencies matching "{{ searchQuery }}"
            </div>
            <button
              v-for="curr in filteredCurrencies"
              :key="curr.code"
              type="button"
              @click="selectCurrency(curr.code)"
              class="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 rounded-xl flex items-center justify-between transition-colors group"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-6 h-4 rounded-xs overflow-hidden border border-gray-200 flex-shrink-0">
                  <img 
                    :src="curr.flag" 
                    :alt="curr.code"
                    class="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-gray-900 group-hover:text-[#0D1DAD] transition-colors">
                      {{ curr.code }}
                    </span>
                    <span class="px-1.5 py-0.2 rounded-md bg-gray-100 text-[10px] font-bold text-gray-600">
                      {{ curr.symbol }}
                    </span>
                  </div>
                  <div class="text-[11px] text-gray-500 truncate font-medium max-w-[200px]">
                    {{ curr.name }}
                  </div>
                </div>
              </div>

              <!-- Radio Indicator -->
              <div 
                class="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors"
                :class="curr.code === effectiveCurrencyCode ? 'border-[#0D1DAD] bg-[#0D1DAD]' : 'border-gray-300 group-hover:border-gray-400'"
              >
                <div v-if="curr.code === effectiveCurrencyCode" class="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </button>
          </template>

        </div>

        <!-- Footer -->
        <div class="px-4 py-2.5 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span class="flex items-center gap-1.5 font-medium">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure real-time rates</span>
          </span>
          <span class="font-bold text-[#0D1DAD] uppercase">
            {{ effectiveCurrencyCode }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, Coins, Search, X, ChevronDown, ShieldCheck } from 'lucide-vue-next'
import { useSettings } from '~/composables/useSettings'

const props = defineProps({
  currentCurrency: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change-currency', 'select-currency'])

const { locale, locales, setLocale } = useI18n()
const { currentCurrency: globalCurrency, currencies: settingsCurrencies, setCurrency: setGlobalCurrency } = useSettings()

const isOpen = ref(false)
const activeTab = ref<'language' | 'currency'>('language')
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement | null>(null)

const currentLocaleCode = computed(() => (locale.value || 'en').toLowerCase())
const availableLocales = computed(() => locales.value as { code: string, name: string }[])

const effectiveCurrencyCode = computed(() => {
  return (props.currentCurrency || globalCurrency.value?.code || 'USD').toUpperCase()
})

const localeFlags: Record<string, string> = {
  en: 'us',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ar: 'sa',
  zh: 'cn',
  ja: 'jp',
  pt: 'br',
  it: 'it',
  ko: 'kr',
  tr: 'tr',
  hi: 'in'
}

const getLocaleFlagUrl = (code: string) => {
  const country = localeFlags[code.toLowerCase()] || 'us'
  return `https://flagcdn.com/w40/${country}.png`
}

// Currencies database with high coverage
const baseCurrencies = [
  { code: 'NGN', countryCode: 'ng', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'USD', countryCode: 'us', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', countryCode: 'gb', name: 'British Pound', symbol: '£' },
  { code: 'EUR', countryCode: 'eu', name: 'Euro', symbol: '€' },
  { code: 'CAD', countryCode: 'ca', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', countryCode: 'au', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'AED', countryCode: 'ae', name: 'Emirati Dirham', symbol: 'AED' },
  { code: 'GHS', countryCode: 'gh', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'KES', countryCode: 'ke', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'ZAR', countryCode: 'za', name: 'South African Rand', symbol: 'R' },
  { code: 'JPY', countryCode: 'jp', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', countryCode: 'cn', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', countryCode: 'in', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', countryCode: 'br', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'CHF', countryCode: 'ch', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SGD', countryCode: 'sg', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'SAR', countryCode: 'sa', name: 'Saudi Riyal', symbol: 'SR' },
  { code: 'QAR', countryCode: 'qa', name: 'Qatari Riyal', symbol: 'QR' },
  { code: 'EGP', countryCode: 'eg', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'MAD', countryCode: 'ma', name: 'Moroccan Dirham', symbol: 'MAD' },
  { code: 'TZS', countryCode: 'tz', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'UGX', countryCode: 'ug', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'RWF', countryCode: 'rw', name: 'Rwandan Franc', symbol: 'RF' },
  { code: 'NZD', countryCode: 'nz', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'MXN', countryCode: 'mx', name: 'Mexican Peso', symbol: 'Mex$' },
  { code: 'TRY', countryCode: 'tr', name: 'Turkish Lira', symbol: '₺' },
  { code: 'KRW', countryCode: 'kr', name: 'South Korean Won', symbol: '₩' }
]

const allCurrencies = computed(() => {
  const map = new Map<string, any>()
  for (const c of baseCurrencies) {
    map.set(c.code, {
      ...c,
      flag: `https://flagcdn.com/w40/${c.countryCode.toLowerCase()}.png`
    })
  }

  // Merge any backend exchange rate currencies
  if (settingsCurrencies.value && settingsCurrencies.value.length > 0) {
    for (const sc of settingsCurrencies.value) {
      const existing = map.get(sc.code) || {}
      map.set(sc.code, {
        code: sc.code,
        name: sc.name || existing.name || sc.code,
        symbol: sc.symbol || existing.symbol || sc.code,
        countryCode: existing.countryCode || sc.code.slice(0, 2).toLowerCase(),
        flag: sc.flag || existing.flag || `https://flagcdn.com/w40/${sc.code.slice(0, 2).toLowerCase()}.png`
      })
    }
  }

  return Array.from(map.values())
})

// Filtered lists
const filteredLocales = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return availableLocales.value
  return availableLocales.value.filter(
    (l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q)
  )
})

const filteredCurrencies = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allCurrencies.value
  return allCurrencies.value.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const selectLanguage = (code: string) => {
  setLocale(code)
  isOpen.value = false
}

const selectCurrency = (code: string) => {
  setGlobalCurrency(code)
  emit('change-currency', code)
  emit('select-currency', code)
  isOpen.value = false
}

// Click outside & Escape handling
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.dropdown-anim-enter-active,
.dropdown-anim-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-anim-enter-from,
.dropdown-anim-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
