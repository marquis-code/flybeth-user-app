<template>
  <div class="relative currency-dropdown-wrap" ref="dropdownRef">
    <button 
      type="button"
      class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-xs hover:bg-blue-100 transition-all active:scale-95" 
      @click="isOpen = !isOpen"
    >
      <div class="w-5 h-3.5 overflow-hidden rounded-sm border border-blue-200/50 flex-shrink-0">
        <img :src="`https://flagcdn.com/w40/${currentCurrencyInfo?.countryCode.toLowerCase()}.png`" class="w-full h-full object-cover" />
      </div>
      <span>{{ currentCurrency }}</span>
      <ChevronDown class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <Transition name="slide-up">
      <div v-if="isOpen" class="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[500] origin-top-right">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50">
          <p class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Select Currency</p>
        </div>
        
        <div class="max-h-80 overflow-y-auto custom-scrollbar p-2 grid grid-cols-2 gap-1">
          <button
            v-for="currency in currencies"
            :key="currency.code"
            @click="select(currency.code)"
            class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group group-hover:shadow-sm"
            :class="currentCurrency === currency.code ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'"
          >
            <div class="w-6 h-4 overflow-hidden rounded-sm border border-gray-100 flex-shrink-0">
              <img :src="`https://flagcdn.com/w40/${currency.countryCode.toLowerCase()}.png`" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col items-start leading-tight">
               <span class="text-xs font-bold tracking-tight">{{ currency.code }}</span>
               <span class="text-[9px] font-medium opacity-60 truncate max-w-[80px]">{{ currency.name }}</span>
            </div>
          </button>
        </div>

        <div class="p-4 bg-gray-50/80 flex items-center justify-center gap-2">
           <ShieldCheck class="w-3 h-3 text-emerald-600" />
           <span class="text-[9px] font-bold text-gray-400 tracking-tighter uppercase">100% Secure Conversion</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  currentCurrency: { type: String, default: 'USD' }
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const currencies = [
  { code: 'GBP', countryCode: 'GB', name: 'Pound' },
  { code: 'KES', countryCode: 'KE', name: 'Shilling' },
  { code: 'GHS', countryCode: 'GH', name: 'Cedi' },
  { code: 'USD', countryCode: 'US', name: 'Dollar' },
  { code: 'NGN', countryCode: 'NG', name: 'Naira' },
  { code: 'AED', countryCode: 'AE', name: 'Dirham' },
  { code: 'ZAR', countryCode: 'ZA', name: 'Rand' },
  { code: 'CAD', countryCode: 'CA', name: 'Dollar' },
  { code: 'EUR', countryCode: 'EU', name: 'Euro' },
  { code: 'MAD', countryCode: 'MA', name: 'Dirham' },
  { code: 'EGP', countryCode: 'EG', name: 'Pound' },
  { code: 'TZS', countryCode: 'TZ', name: 'Shilling' },
  { code: 'UGX', countryCode: 'UG', name: 'Shilling' },
  { code: 'RWF', countryCode: 'RW', name: 'Franc' },
]

const currentCurrencyInfo = computed(() => {
  return currencies.find(c => c.code === props.currentCurrency) || currencies[3]
})

const select = (code: string) => {
  emit('select', code)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
</style>
