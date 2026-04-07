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
          open ? 'ring-1 ring-[#0D1DAD] border-[#0D1DAD]' : '',
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
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <div class="flex items-center gap-4">
                <button type="button" @click="viewMode = 'calendar'" class="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all" :class="viewMode === 'calendar' ? 'bg-brand-blue/5 border-2 border-brand-blue/10' : 'hover:bg-gray-100'">
                  <span class="text-brand-blue font-bold tracking-tight text-lg">{{ monthLabels[leftMonth] }}</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-brand-blue/30 mx-1"></span>
                  <span class="text-brand-blue font-header text-2xl tracking-tighter" @click.stop="viewMode = 'year'">{{ leftYear }}</span>
                </button>
                <div class="ml-auto flex items-center gap-3">
                  <button type="button" @click="toggleYearView" class="px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all shadow-sm border" :class="viewMode === 'year' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-500 hover:text-gray-900 border-gray-100'">
                    {{ viewMode === 'year' ? 'Back to calendar' : 'Jump to year' }}
                  </button>
                </div>
              </div>

              <div class="flex gap-2">
                <button v-if="viewMode === 'calendar'" type="button" @click="prevMonth" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button v-if="viewMode === 'calendar'" type="button" @click="nextMonth" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7 7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- View Modes -->
            <div class="min-h-[340px]">
              <!-- Year Selection Grid -->
              <div v-if="viewMode === 'year'" class="p-6 text-center">
                <h4 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 italic">Select Year</h4>
                <div class="grid grid-cols-4 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                   <button 
                    v-for="year in years" 
                    :key="year"
                    type="button"
                    @click="selectYear(year)"
                    class="py-3 text-sm font-bold rounded-xl transition-all border"
                    :class="year === leftYear ? 'bg-brand-blue text-white border-brand-blue shadow-lg' : 'bg-white text-gray-600 border-gray-100 hover:border-brand-blue/30'"
                   >
                     {{ year }}
                   </button>
                </div>
              </div>

              <!-- Two-month calendar grid -->
              <div v-else class="grid grid-cols-2 divide-x divide-gray-50 p-4">
                <!-- Left month -->
                <div class="px-4">
                  <div class="grid grid-cols-7 mb-2">
                    <div v-for="d in weekdays" :key="d" class="text-center text-[10px] uppercase font-bold text-gray-400 py-3">{{ d }}</div>
                  </div>
                  <div class="grid grid-cols-7 gap-1">
                    <button
                      v-for="(day, i) in leftDays"
                      :key="'l'+i"
                      type="button"
                      :disabled="!day.inMonth || (maxDate && day.dateObj > maxDate) || (minDate && day.dateObj < minDate)"
                      @click="day.inMonth && selectDay(day)"
                      :class="getDayClass(day)"
                    >
                      <span v-if="day.isSelected && day.inMonth" class="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px]  text-brand-blue/50 whitespace-nowrap">{{ label }}</span>
                      {{ day.date || '' }}
                    </button>
                  </div>
                </div>

                <!-- Right month -->
                <div class="px-4">
                  <div class="grid grid-cols-7 mb-2">
                    <div v-for="d in weekdays" :key="d" class="text-center text-[10px] uppercase font-bold text-gray-400 py-3">{{ d }}</div>
                  </div>
                  <div class="grid grid-cols-7 gap-1">
                    <button
                      v-for="(day, i) in rightDays"
                      :key="'r'+i"
                      type="button"
                      :disabled="!day.inMonth || (maxDate && day.dateObj > maxDate) || (minDate && day.dateObj < minDate)"
                      @click="day.inMonth && selectDay(day)"
                      :class="getDayClass(day)"
                    >
                      <span v-if="day.isSelected && day.inMonth" class="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px]  text-brand-blue/50 whitespace-nowrap">{{ label }}</span>
                      {{ day.date || '' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/30">
              <button type="button" @click="clearValue" class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Clear</button>
              <button type="button" @click="open = false" class="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#0a168a] transition-colors shadow-lg shadow-brand-blue/10">Done</button>
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
const viewMode = ref<'calendar' | 'year'>('calendar')

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const start = props.minDate ? props.minDate.getFullYear() : currentYear - 100
  const end = props.maxDate ? props.maxDate.getFullYear() : currentYear + 20
  const list = []
  for (let i = end; i >= start; i--) {
    list.push(i)
  }
  return list
})

function selectYear(year: number) {
  leftYear.value = year
  viewMode.value = 'calendar'
}

function toggleYearView() {
  viewMode.value = viewMode.value === 'year' ? 'calendar' : 'year'
}

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
  const base = 'relative w-9 h-9 mx-auto flex items-center justify-center text-xs font-bold rounded-xl transition-all duration-150'
  if (!day.inMonth) return base + ' invisible'
  if (day.isSelected) return base + ' bg-brand-blue text-white shadow-lg'
  if (day.isToday) return base + ' border-2 border-brand-blue text-brand-blue'
  return base + ' text-gray-700 hover:bg-gray-50 cursor-pointer'
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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.picker-drop-enter-from, .picker-drop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
button:disabled {
  opacity: 0.1;
  cursor: not-allowed;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
