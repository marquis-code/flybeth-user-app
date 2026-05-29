<template>
  <SideDrawer :visible="visible" @close="$emit('close')">
    <template #title>Select a Currency</template>
    <template #default>
      <div class="flex flex-col h-full">

        <!-- Tabs: Currency / Crypto -->
        <div class="px-6 pt-5 pb-4">
          <div class="flex bg-[#F3F4F6] rounded-full p-1">
            <button
              @click="activeTab = 'currency'"
              :class="['flex-1 py-2.5 text-[13px] font-semibold rounded-full transition-all', activeTab === 'currency' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]']"
            >Currency</button>
            <button
              @click="activeTab = 'crypto'"
              :class="['flex-1 py-2.5 text-[13px] font-semibold rounded-full transition-all', activeTab === 'crypto' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]']"
            >Crypto</button>
          </div>
        </div>

        <!-- Search -->
        <div class="px-6 pb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
            />
          </div>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          <!-- Currency Tab -->
          <template v-if="activeTab === 'currency'">
            <div
              v-for="currency in filteredCurrencies"
              :key="currency.code"
              @click="selectCurrency(currency.code)"
              class="flex items-center gap-4 py-4 border-b border-[#F3F4F6] last:border-b-0 cursor-pointer group"
            >
              <!-- Flag Circle -->
              <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#E5E7EB] bg-[#F9FAFB]">
                <img :src="`https://flagcdn.com/w80/${currency.countryCode.toLowerCase()}.png`" :alt="currency.name" class="w-full h-full object-cover" />
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-[15px] font-semibold text-[#111827] leading-tight">{{ currency.name }}</p>
                <p class="text-[13px] text-[#9CA3AF] font-medium mt-0.5">{{ currency.code }}</p>
              </div>

              <!-- Radio -->
              <div class="flex-shrink-0">
                <div v-if="selectedCode === currency.code" class="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else class="w-6 h-6 rounded-full border-2 border-[#D1D5DB] group-hover:border-[#9CA3AF] transition-colors"></div>
              </div>
            </div>

            <div v-if="filteredCurrencies.length === 0" class="py-12 text-center text-sm text-[#9CA3AF]">
              No currencies found for "{{ searchQuery }}"
            </div>
          </template>

          <!-- Crypto Tab -->
          <template v-else>
            <div
              v-for="crypto in filteredCryptos"
              :key="crypto.code"
              @click="selectCurrency(crypto.code)"
              class="flex items-center gap-4 py-4 border-b border-[#F3F4F6] last:border-b-0 cursor-pointer group"
            >
              <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-center text-lg font-bold">
                {{ crypto.symbol }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[15px] font-semibold text-[#111827] leading-tight">{{ crypto.name }}</p>
                <p class="text-[13px] text-[#9CA3AF] font-medium mt-0.5">{{ crypto.code }}</p>
              </div>
              <div class="flex-shrink-0">
                <div v-if="selectedCode === crypto.code" class="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else class="w-6 h-6 rounded-full border-2 border-[#D1D5DB] group-hover:border-[#9CA3AF] transition-colors"></div>
              </div>
            </div>

            <div v-if="filteredCryptos.length === 0" class="py-12 text-center text-sm text-[#9CA3AF]">
              No cryptocurrencies found for "{{ searchQuery }}"
            </div>
          </template>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="px-6 py-5 bg-white border-t border-gray-100 flex flex-col gap-4">
        <button class="w-full py-4 bg-[#6366F1] text-white text-sm font-bold rounded-xl hover:bg-[#4F46E5] transition-colors" @click="handleContinue">
          Continue
        </button>
        
        <div class="flex flex-col gap-2 items-center">
          <div class="flex items-center gap-2 text-xs font-bold text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            This booking is 100% protected
          </div>
          <div class="flex items-center gap-4 text-[10px] text-gray-500 font-medium">
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Secure transmission
            </span>
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Encrypted storage
            </span>
          </div>
        </div>
      </div>
    </template>
  </SideDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SideDrawer from '@/components/ui/SideDrawer.vue'

const props = defineProps({
  visible: Boolean,
  currentCurrency: String
})

const emit = defineEmits(['close', 'select'])

const selectedCode = ref(props.currentCurrency)
const searchQuery = ref('')
const activeTab = ref<'currency' | 'crypto'>('currency')

watch(() => props.currentCurrency, (val) => { selectedCode.value = val })
watch(() => props.visible, (val) => { if (val) searchQuery.value = '' })

const currencies = [
  { code: 'NGN', countryCode: 'NG', name: 'Nigerian Naira' },
  { code: 'USD', countryCode: 'US', name: 'US Dollar' },
  { code: 'EUR', countryCode: 'EU', name: 'Euro' },
  { code: 'GBP', countryCode: 'GB', name: 'British Pound' },
  { code: 'AED', countryCode: 'AE', name: 'Emirati Dirham' },
  { code: 'AFN', countryCode: 'AF', name: 'Afghan Afghani' },
  { code: 'ALL', countryCode: 'AL', name: 'Albanian Lek' },
  { code: 'AMD', countryCode: 'AM', name: 'Armenian Dram' },
  { code: 'ANG', countryCode: 'CW', name: 'Netherlands Antilles Guilder' },
  { code: 'AOA', countryCode: 'AO', name: 'Angolan Kwanza' },
  { code: 'ARS', countryCode: 'AR', name: 'Argentine Peso' },
  { code: 'AUD', countryCode: 'AU', name: 'Australian Dollar' },
  { code: 'CAD', countryCode: 'CA', name: 'Canadian Dollar' },
  { code: 'CHF', countryCode: 'CH', name: 'Swiss Franc' },
  { code: 'CNY', countryCode: 'CN', name: 'Chinese Yuan' },
  { code: 'COP', countryCode: 'CO', name: 'Colombian Peso' },
  { code: 'DZD', countryCode: 'DZ', name: 'Algerian Dinar' },
  { code: 'EGP', countryCode: 'EG', name: 'Egyptian Pound' },
  { code: 'GHS', countryCode: 'GH', name: 'Ghanaian Cedi' },
  { code: 'GMD', countryCode: 'GM', name: 'Gambian Dalasi' },
  { code: 'INR', countryCode: 'IN', name: 'Indian Rupee' },
  { code: 'JPY', countryCode: 'JP', name: 'Japanese Yen' },
  { code: 'KES', countryCode: 'KE', name: 'Kenyan Shilling' },
  { code: 'KRW', countryCode: 'KR', name: 'South Korean Won' },
  { code: 'MAD', countryCode: 'MA', name: 'Moroccan Dirham' },
  { code: 'MXN', countryCode: 'MX', name: 'Mexican Peso' },
  { code: 'MYR', countryCode: 'MY', name: 'Malaysian Ringgit' },
  { code: 'NLE', countryCode: 'SL', name: 'Sierra Leonean Leone' },
  { code: 'NZD', countryCode: 'NZ', name: 'New Zealand Dollar' },
  { code: 'RWF', countryCode: 'RW', name: 'Rwandan Franc' },
  { code: 'SAR', countryCode: 'SA', name: 'Saudi Riyal' },
  { code: 'SEK', countryCode: 'SE', name: 'Swedish Krona' },
  { code: 'SGD', countryCode: 'SG', name: 'Singapore Dollar' },
  { code: 'THB', countryCode: 'TH', name: 'Thai Baht' },
  { code: 'TND', countryCode: 'TN', name: 'Tunisian Dinar' },
  { code: 'TZS', countryCode: 'TZ', name: 'Tanzanian Shilling' },
  { code: 'UGX', countryCode: 'UG', name: 'Ugandan Shilling' },
  { code: 'XAF', countryCode: 'CM', name: 'CFA Franc BEAC' },
  { code: 'XOF', countryCode: 'SN', name: 'CFA Franc BCEAO' },
  { code: 'ZAR', countryCode: 'ZA', name: 'South African Rand' },
]

const cryptos = [
  { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' },
  { code: 'USDT', symbol: '₮', name: 'Tether' },
  { code: 'USDC', symbol: '$', name: 'USD Coin' },
  { code: 'BNB', symbol: 'B', name: 'BNB' },
  { code: 'SOL', symbol: 'S', name: 'Solana' },
]

const filteredCurrencies = computed(() => {
  if (!searchQuery.value) return currencies
  const q = searchQuery.value.toLowerCase()
  return currencies.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
})

const filteredCryptos = computed(() => {
  if (!searchQuery.value) return cryptos
  const q = searchQuery.value.toLowerCase()
  return cryptos.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
})

const selectCurrency = (code: string) => {
  selectedCode.value = code
}

const handleContinue = () => {
  if (selectedCode.value) {
    emit('select', selectedCode.value)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
</style>
