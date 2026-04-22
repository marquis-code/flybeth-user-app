<template>
  <div class="relative w-full" ref="pickerRef">
    <!-- Trigger -->
    <div
      class="w-full cursor-pointer select-none"
      @click="toggleDropdown"
    >
      <slot :value="modelValue" :displayValue="modelValue">
        <div class="flex items-center gap-2 mt-1">
          <ClockIcon class="w-4 h-4 text-gray-400" />
          <span class="text-sm font-semibold text-gray-900">{{ modelValue || 'Select time' }}</span>
        </div>
      </slot>
    </div>

    <!-- Dropdown -->
    <Teleport to="body">
      <div v-if="isOpen">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 z-[1000010] bg-black/5"
          @click="isOpen = false"
        />

        <!-- Picker Card -->
        <div
          ref="cardRef"
          :style="cardStyle"
          class="fixed z-[1000011] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >

          <div class="flex h-[280px]">
            <!-- Hours Column -->
            <div class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50" ref="hourCol">
              <div class="py-2">
                <button
                  v-for="h in 24"
                  :key="h-1"
                  @click="selectHour(h-1)"
                  class="w-full py-2.5 text-sm font-medium transition-colors"
                  :class="selectedHour === (h-1) ? 'bg-[#0D1DAD] text-white font-bold' : 'text-gray-600 hover:bg-gray-100'"
                >
                  {{ String(h-1).padStart(2, '0') }}
                </button>
              </div>
            </div>

            <!-- Divider -->
            <div class="w-px bg-gray-100 h-full"></div>

            <!-- Minutes Column -->
            <div class="flex-1 overflow-y-auto custom-scrollbar" ref="minCol">
              <div class="py-2">
                <button
                  v-for="m in 60"
                  :key="m-1"
                  @click="selectMinute(m-1)"
                  class="w-full py-2.5 text-sm font-medium transition-colors"
                  :class="selectedMinute === (m-1) ? 'bg-[#0D1DAD] text-white font-bold' : 'text-gray-600 hover:bg-gray-100'"
                >
                  {{ String(m-1).padStart(2, '0') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-3 border-t border-gray-50 bg-white">
            <button
              @click="confirmTime"
              class="w-full py-2 bg-[#0D1DAD] text-white rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ClockIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: { type: String, default: '10:00' },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const pickerRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const hourCol = ref<HTMLElement | null>(null)
const minCol = ref<HTMLElement | null>(null)

const selectedHour = ref(10)
const selectedMinute = ref(0)

// Parse initial value
watch(() => props.modelValue, (val) => {
  if (val && val.includes(':')) {
    const [h, m] = val.split(':').map(Number)
    selectedHour.value = h
    selectedMinute.value = m
  }
}, { immediate: true })

const cardStyle = ref<Record<string, string>>({})

const toggleDropdown = () => {
  if (isOpen.value) {
    isOpen.value = false
    return
  }
  updatePosition()
  isOpen.value = true
  
  nextTick(() => {
    scrollToActive()
  })
}

const updatePosition = () => {
  if (!pickerRef.value) return
  const rect = pickerRef.value.getBoundingClientRect()
  
  // Responsive sizing
  const isMobileView = window.innerWidth < 768
  const cardWidth = isMobileView ? Math.min(280, window.innerWidth - 32) : 220

  // Horizontal anchoring
  let left = rect.left
  if (left + cardWidth > window.innerWidth - 12) {
    left = window.innerWidth - cardWidth - 12
  }
  if (left < 12) left = 12

  // Vertical anchoring
  let top = rect.bottom + 8
  // If no space below, show above
  if (top + 280 > window.innerHeight - 12) {
    top = rect.top - 280 - 8
  }

  cardStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${cardWidth}px`,
    position: 'fixed'
  }
}

const scrollToActive = () => {
  if (hourCol.value) {
    const activeHour = hourCol.value.querySelector('.bg-\\[\\#0D1DAD\\]') as HTMLElement
    if (activeHour) hourCol.value.scrollTop = activeHour.offsetTop - 120
  }
  if (minCol.value) {
    const activeMin = minCol.value.querySelector('.bg-\\[\\#0D1DAD\\]') as HTMLElement
    if (activeMin) minCol.value.scrollTop = activeMin.offsetTop - 120
  }
}

const selectHour = (h: number) => {
  selectedHour.value = h
}

const selectMinute = (m: number) => {
  selectedMinute.value = m
}

const confirmTime = () => {
  const h = String(selectedHour.value).padStart(2, '0')
  const m = String(selectedMinute.value).padStart(2, '0')
  emit('update:modelValue', `${h}:${m}`)
  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
</style>
