<template>
  <div class="flat-date-picker" v-bind="$attrs">
    <!-- Trigger input -->
    <div
      class="relative"
      @click="open = true"
    >
      <label
        :class="[
          'absolute transition-all duration-300 ease-in-out pointer-events-none z-10 text-gray-500',
          open || modelValue ? 'text-xs left-3 top-2' : 'text-base left-3 top-1/2 -translate-y-1/2'
        ]"
      >{{ label }}</label>
      <div
        :class="[
          'w-full py-3 pt-6 px-3 bg-[#1A1A1B09] border-[0.5px] border-transparent rounded-2xl cursor-pointer transition-all duration-300 min-h-[58px] flex items-end',
          open ? 'ring-1 ring-[#033958] border-[#033958]' : '',
          hasError ? 'ring-red-500 border-red-500' : ''
        ]"
      >
        <span v-if="modelValue" class="font-medium text-gray-800 text-sm">{{ displayDate }}</span>
        <span v-else class="text-transparent select-none text-sm">–</span>
      </div>
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Calendar Overlay -->
    <Teleport to="body">
      <Transition name="picker-drop">
        <div
          v-if="open"
          class="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/10"
          @click.self="open = false"
        >
          <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-[640px]" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 pt-5 pb-2">
              <button type="button" @click="prevMonth" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div class="flex gap-12">
                <span class="text-base font-bold text-gray-800">{{ monthLabels[leftMonth] }} {{ leftYear }}</span>
                <span class="text-base font-bold text-gray-800">{{ monthLabels[rightMonth] }} {{ rightYear }}</span>
              </div>

              <button type="button" @click="nextMonth" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7 7 7" />
                </svg>
              </button>
            </div>

            <!-- Two-month grid -->
            <div class="grid grid-cols-2 divide-x divide-gray-100 px-4 pb-5 pt-2">
              <!-- Left month -->
              <div class="pr-4">
                <div class="grid grid-cols-7 mb-2">
                  <div v-for="d in weekdays" :key="d" class="text-center text-xs font-semibold text-gray-400 py-2">{{ d }}</div>
                </div>
                <div class="grid grid-cols-7 gap-y-1">
                  <button
                    v-for="(day, i) in leftDays"
                    :key="'l'+i"
                    type="button"
                    :disabled="!day.inMonth || (maxDate && day.dateObj > maxDate) || (minDate && day.dateObj < minDate)"
                    @click="day.inMonth && selectDay(day)"
                    :class="getDayClass(day)"
                  >
                    <span v-if="day.isSelected && day.inMonth" class="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-600 whitespace-nowrap">{{ label }}</span>
                    {{ day.date || '' }}
                  </button>
                </div>
              </div>

              <!-- Right month -->
              <div class="pl-4">
                <div class="grid grid-cols-7 mb-2">
                  <div v-for="d in weekdays" :key="d" class="text-center text-xs font-semibold text-gray-400 py-2">{{ d }}</div>
                </div>
                <div class="grid grid-cols-7 gap-y-1">
                  <button
                    v-for="(day, i) in rightDays"
                    :key="'r'+i"
                    type="button"
                    :disabled="!day.inMonth || (maxDate && day.dateObj > maxDate) || (minDate && day.dateObj < minDate)"
                    @click="day.inMonth && selectDay(day)"
                    :class="getDayClass(day)"
                  >
                    <span v-if="day.isSelected && day.inMonth" class="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-600 whitespace-nowrap">{{ label }}</span>
                    {{ day.date || '' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-3">
              <button type="button" @click="clearValue" class="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Clear</button>
              <button type="button" @click="open = false" class="px-5 py-2 bg-[#033958] text-white rounded-xl text-sm font-bold hover:bg-[#022f42] transition-colors">Done</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  modelValue?: string
  label: string
  maxDate?: Date
  minDate?: Date
  hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  hasError: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)
const today = new Date()
today.setHours(0, 0, 0, 0)

const leftYear = ref(today.getFullYear())
const leftMonth = ref(today.getMonth())

const rightMonth = computed(() => (leftMonth.value + 1) % 12)
const rightYear = computed(() => leftMonth.value === 11 ? leftYear.value + 1 : leftYear.value)

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const selectedDate = computed(() => props.modelValue ? new Date(props.modelValue + 'T12:00:00') : null)

const displayDate = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
})

interface CalDay {
  date: number | null
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  dateObj: Date
}

function buildMonthDays(year: number, month: number): CalDay[] {
  const first = new Date(year, month, 1)
  let startDow = first.getDay() // 0=Sun
  startDow = startDow === 0 ? 6 : startDow - 1 // convert to Mon-start

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: CalDay[] = []

  for (let i = 0; i < startDow; i++) {
    cells.push({ date: null, inMonth: false, isToday: false, isSelected: false, dateObj: new Date(0) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d)
    dt.setHours(0, 0, 0, 0)
    cells.push({
      date: d,
      inMonth: true,
      isToday: dt.getTime() === today.getTime(),
      isSelected: selectedDate.value ? dt.getTime() === selectedDate.value.setHours(0,0,0,0) : false,
      dateObj: dt,
    })
  }
  return cells
}

const leftDays = computed(() => buildMonthDays(leftYear.value, leftMonth.value))
const rightDays = computed(() => buildMonthDays(rightYear.value, rightMonth.value))

function getDayClass(day: CalDay) {
  const base = 'relative w-8 h-8 mx-auto flex items-center justify-center text-sm rounded-full transition-all duration-150'
  if (!day.inMonth) return base + ' invisible'
  if (day.isSelected) return base + ' bg-[#1a3a5c] text-white font-bold shadow'
  if (day.isToday) return base + ' border-2 border-[#1a3a5c] text-[#1a3a5c] font-bold'
  return base + ' text-gray-700 hover:bg-gray-100 cursor-pointer'
}

function selectDay(day: CalDay) {
  if (!day.inMonth) return
  const iso = `${day.dateObj.getFullYear()}-${String(day.dateObj.getMonth() + 1).padStart(2, '0')}-${String(day.dateObj.getDate()).padStart(2, '0')}`
  emit('update:modelValue', iso)
  open.value = false
}

function clearValue() {
  emit('update:modelValue', '')
}

function prevMonth() {
  if (leftMonth.value === 0) {
    leftMonth.value = 11
    leftYear.value--
  } else {
    leftMonth.value--
  }
}

function nextMonth() {
  if (leftMonth.value === 11) {
    leftMonth.value = 0
    leftYear.value++
  } else {
    leftMonth.value++
  }
}
</script>

<style scoped>
.picker-drop-enter-active, .picker-drop-leave-active {
  transition: all 0.2s ease;
}
.picker-drop-enter-from, .picker-drop-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
button:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}
</style>
