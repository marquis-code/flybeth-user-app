<template>
  <div class="w-full overflow-x-auto pb-4 custom-scrollbar">
    <div class="flex items-center gap-3">
      <button 
        v-for="(item, idx) in dateOptions" 
        :key="idx"
        @click="selectDate(item, idx)"
        class="flex flex-col items-center justify-center min-w-max px-5 py-2.5 rounded-full border transition-colors whitespace-nowrap flex-shrink-0"
        :class="selectedIndex === idx 
          ? 'border-[#0D1DAD] bg-blue-50/30' 
          : 'border-gray-200 hover:border-gray-300 bg-white'"
      >
        <span class="text-xs font-medium text-gray-600 mb-0.5">{{ item.label }}</span>
        <span class="text-sm font-bold" :class="selectedIndex === idx ? 'text-[#0D1DAD]' : 'text-brand-green'">
          {{ formatPrice(item.price) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettings } from '@/composables/useSettings'

const props = defineProps({
  basePrice: {
    type: Number,
    default: 500
  },
  departureDate: {
    type: String,
    default: ''
  },
  returnDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])

const { formatPrice } = useSettings()

const selectedIndex = ref(3) // 4th item is active (middle)

const selectDate = (item: any, idx: number) => {
  selectedIndex.value = idx
  emit('select', { departureDate: item.departureDate, returnDate: item.returnDate })
}

// Mock 7 days surrounding the selected date
const dateOptions = computed(() => {
  const options = []
  
  // Use today as fallback if no dates provided
  const baseDep = props.departureDate ? new Date(props.departureDate) : new Date()
  const baseRet = props.returnDate ? new Date(props.returnDate) : new Date(baseDep.getTime() + 7 * 24 * 60 * 60 * 1000)

  for (let i = -3; i <= 3; i++) {
    const depDate = new Date(baseDep)
    depDate.setDate(depDate.getDate() + i)
    
    const retDate = new Date(baseRet)
    retDate.setDate(retDate.getDate() + i)
    
    const depStr = depDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const retStr = props.returnDate ? ` - ${retDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''
    
    // Vary the price slightly
    const variation = (Math.random() - 0.5) * (props.basePrice * 0.3) 
    // Always make the selected index (i=0) the actual base price if possible, or close to it
    const price = i === 0 ? props.basePrice : Math.round(props.basePrice + variation)
    
    options.push({
      label: `${depStr}${retStr}`,
      price: price > 0 ? price : props.basePrice, // Ensure no negative prices
      departureDate: depDate.toISOString().split('T')[0],
      returnDate: props.returnDate ? retDate.toISOString().split('T')[0] : null
    })
  }
  
  return options
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
