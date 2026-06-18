<template>
  <div class="relative" ref="dropdownRef">
    <button 
      @click="isOpen = !isOpen"
      class="flex flex-shrink-0 items-center justify-center w-10 h-10 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
    >
      <span class="text-xs font-semibold text-gray-600 uppercase">{{ currentLocaleCode }}</span>
    </button>

    <div 
      v-if="isOpen" 
      class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2"
    >
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="selectLanguage(locale.code)"
        class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
      >
        <div>
          <div class="text-sm font-bold text-gray-900">{{ locale.name }}</div>
          <div class="text-xs text-gray-500 uppercase">{{ locale.code }}</div>
        </div>
        <div 
          class="w-5 h-5 rounded-full border flex items-center justify-center"
          :class="locale.code === currentLocaleCode ? 'border-[#0D1DAD] bg-[#0D1DAD]' : 'border-gray-300'"
        >
          <div v-if="locale.code === currentLocaleCode" class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale } = useI18n()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const currentLocaleCode = computed(() => locale.value)
const availableLocales = computed(() => locales.value as { code: string, name: string }[])

const selectLanguage = (code: string) => {
  setLocale(code)
  isOpen.value = false
}

// Close on click outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
