<template>
  <div class="flat-date-picker relative w-full" v-bind="$attrs" ref="containerRef">
    <!-- Trigger input box -->
    <div
      class="relative"
      @click="toggleOpen"
    >
      <label
        :class="[
          'absolute transition-all duration-200 pointer-events-none z-10 font-bold',
          (open || rawInput || modelValue)
            ? 'text-xs text-gray-500 left-4 top-2'
            : 'text-sm text-gray-400 left-11 top-1/2 -translate-y-1/2'
        ]"
      >{{ label }}</label>

      <div
        :class="[
          'w-full px-4 bg-white border border-gray-200 rounded-2xl cursor-pointer transition-all duration-200 min-h-[64px] sm:min-h-[68px] flex items-center justify-between',
          open ? 'ring-2 ring-[#0D1DAD] border-[#0D1DAD]' : 'hover:border-gray-300',
          hasError ? 'ring-2 ring-red-500 border-red-500' : ''
        ]"
      >
        <div class="flex items-center gap-3 w-full pr-2">
          <Calendar class="h-4 w-4 text-[#0D1DAD] shrink-0" />
          
          <!-- Direct editable input so users can type or click -->
          <input
            ref="inputElement"
            type="text"
            :value="displayDate"
            :placeholder="placeholder || ''"
            @input="handleDirectInput"
            @focus="open = true"
            @keydown.enter.prevent="open = false"
            class="w-full bg-transparent font-semibold text-black text-sm outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal pt-3.5"
          />
        </div>

        <!-- Success checkmark icon when a valid date is picked -->
        <div v-if="modelValue && !hasError" class="text-[#0D1DAD] shrink-0 pointer-events-none transition-all duration-200">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Calendar Popover -->
    <Transition name="fade-overlay">
      <div
        v-if="open"
        class="absolute top-[calc(100%+8px)] left-0 z-[10011] w-full min-w-[320px] max-w-[360px]"
      >
        <!-- Invisible backdrop for click-outside -->
        <div
          class="fixed inset-0 z-[-1]"
          @click.stop="open = false"
        ></div>

        <!-- Calendar Card -->
        <div
          class="bg-white rounded-2xl border border-gray-200 overflow-hidden select-none transition-all duration-200 shadow-2xl flex flex-col w-full"
          @click.stop
        >
          <!-- Navigation View Switcher (Tabs) -->
          <div class="px-5 pt-4 pb-2 border-b border-gray-100 flex items-center justify-between gap-2 bg-gray-50/70">
            <div class="flex items-center gap-1.5 p-1 bg-gray-200/60 rounded-xl text-xs font-bold w-full">
              <button
                type="button"
                @click="viewMode = 'calendar'"
                :class="[
                  'flex-1 py-1.5 rounded-lg transition-all text-center',
                  viewMode === 'calendar' ? 'bg-white text-[#0D1DAD] shadow-sm' : 'text-gray-600 hover:text-black'
                ]"
              >
                Day
              </button>
              <button
                type="button"
                @click="viewMode = 'month'"
                :class="[
                  'flex-1 py-1.5 rounded-lg transition-all text-center',
                  viewMode === 'month' ? 'bg-white text-[#0D1DAD] shadow-sm' : 'text-gray-600 hover:text-black'
                ]"
              >
                Month ({{ monthShortNames[leftMonth] }})
              </button>
              <button
                type="button"
                @click="viewMode = 'year'"
                :class="[
                  'flex-1 py-1.5 rounded-lg transition-all text-center',
                  viewMode === 'year' ? 'bg-white text-[#0D1DAD] shadow-sm' : 'text-gray-600 hover:text-black'
                ]"
              >
                Year ({{ leftYear }})
              </button>
            </div>
          </div>

          <!-- Header with Month & Year Selectors and Prev/Next Chevrons -->
          <div class="flex items-center justify-between px-5 pt-3 pb-2">
            <button
              type="button"
              @click="prevStep"
              class="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-colors"
              title="Previous"
            >
              <ChevronLeft class="h-4 w-4 text-black" />
            </button>

            <!-- Direct Click to Change Month or Year -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="viewMode = viewMode === 'month' ? 'calendar' : 'month'"
                class="px-2.5 py-1 text-sm font-bold text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
              >
                {{ monthLabels[leftMonth] }}
                <ChevronDown class="h-3.5 w-3.5 text-gray-500" :class="{ 'rotate-180': viewMode === 'month' }" />
              </button>

              <button
                type="button"
                @click="viewMode = viewMode === 'year' ? 'calendar' : 'year'"
                class="px-2.5 py-1 text-sm font-bold text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
              >
                {{ leftYear }}
                <ChevronDown class="h-3.5 w-3.5 text-gray-500" :class="{ 'rotate-180': viewMode === 'year' }" />
              </button>
            </div>

            <button
              type="button"
              @click="nextStep"
              class="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-colors"
              title="Next"
            >
              <ChevronRight class="h-4 w-4 text-black" />
            </button>
          </div>

          <!-- Body Views -->
          <div class="px-5 pb-4 min-h-[260px] flex flex-col justify-center">
            <!-- 1. MONTH VIEW (Grid of 12 Months) -->
            <div v-if="viewMode === 'month'" class="grid grid-cols-3 gap-2 py-2">
              <button
                v-for="(mName, mIdx) in monthLabels"
                :key="mName"
                type="button"
                @click="selectMonth(mIdx)"
                :class="[
                  'py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center',
                  mIdx === leftMonth
                    ? 'bg-[#0D1DAD] text-white border-[#0D1DAD] shadow-sm'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-[#0D1DAD] hover:bg-blue-50/40'
                ]"
              >
                {{ mName }}
              </button>
            </div>

            <!-- 2. YEAR VIEW (Decade Pills + Year Grid) -->
            <div v-else-if="viewMode === 'year'" class="py-2">
              <!-- Decade Jump Pills -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2.5 custom-scrollbar">
                <button
                  v-for="dec in decades"
                  :key="dec"
                  type="button"
                  @click="activeDecade = dec"
                  :class="[
                    'px-2.5 py-1 text-[11px] font-bold rounded-full whitespace-nowrap transition-colors shrink-0',
                    activeDecade === dec
                      ? 'bg-[#0D1DAD] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ dec }}s
                </button>
              </div>

              <!-- Years in current decade -->
              <div class="grid grid-cols-4 gap-2 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar">
                <button
                  v-for="yr in decadeYears"
                  :key="yr"
                  type="button"
                  @click="selectYear(yr)"
                  :class="[
                    'py-2 text-xs font-bold rounded-xl transition-all border text-center',
                    yr === leftYear
                      ? 'bg-[#0D1DAD] text-white border-[#0D1DAD] shadow-sm'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-[#0D1DAD] hover:bg-blue-50/40'
                  ]"
                >
                  {{ yr }}
                </button>
              </div>
            </div>

            <!-- 3. DAY / CALENDAR VIEW -->
            <div v-else class="py-1">
              <!-- Day names -->
              <div class="grid grid-cols-7 mb-2 text-center">
                <span
                  v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
                  :key="d"
                  class="text-[11px] font-bold text-gray-400 py-1"
                >
                  {{ d }}
                </span>
              </div>

              <!-- Day cells -->
              <div class="grid grid-cols-7 gap-y-1">
                <template v-for="(day, i) in leftDays" :key="i">
                  <div v-if="!day.inMonth" class="h-9"></div>
                  <div
                    v-else
                    class="flex items-center justify-center h-9"
                  >
                    <button
                      type="button"
                      :disabled="day.isDisabled"
                      @click="selectDay(day)"
                      :class="[
                        'h-8 w-8 sm:h-8 sm:w-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-150',
                        day.isSelected
                          ? 'bg-[#0D1DAD] text-white shadow-md font-bold'
                          : day.isToday
                          ? 'text-[#0D1DAD] border border-[#0D1DAD]/30 font-bold hover:bg-blue-50'
                          : day.isDisabled
                          ? 'text-gray-300 cursor-not-allowed opacity-50'
                          : 'text-gray-800 hover:bg-gray-100'
                      ]"
                    >
                      {{ day.date }}
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-between gap-3 px-5 py-3 border-t border-gray-200 bg-gray-50/80 mt-auto">
            <button
              v-if="modelValue"
              type="button"
              @click="clearValue"
              class="text-xs font-bold text-gray-600 hover:text-red-600 transition-colors px-2 py-1.5"
            >
              Clear
            </button>
            <div v-else></div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="open = false"
                class="px-6 py-2 bg-[#0D1DAD] text-white rounded-xl text-xs font-bold hover:bg-[#0A1485] transition-colors active:scale-95 shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-vue-next'
import { useTracking } from '@/composables/core/useTracking'

defineOptions({ inheritAttrs: false })

interface Props {
  modelValue?: string
  label: string
  placeholder?: string
  maxDate?: Date
  minDate?: Date
  hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  hasError: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const containerRef = ref<HTMLElement | null>(null)
const inputElement = ref<HTMLInputElement | null>(null)
const open = ref(false)
const rawInput = ref('')

const today = new Date()
today.setHours(0, 0, 0, 0)

// Initial values
function parseModelValue(val?: string): Date | null {
  if (!val) return null
  const parts = val.split('-')
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const d = parseInt(parts[2], 10)
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d)
    }
  }
  const parsed = new Date(val)
  return isNaN(parsed.getTime()) ? null : parsed
}

const initialDate = parseModelValue(props.modelValue) || (props.maxDate && props.maxDate < today ? props.maxDate : today)
const leftYear = ref(initialDate.getFullYear())
const leftMonth = ref(initialDate.getMonth())
const viewMode = ref<'calendar' | 'month' | 'year'>('calendar')

// Decade calculation
const activeDecade = ref(Math.floor(leftYear.value / 10) * 10)

watch(() => props.modelValue, (newVal) => {
  const d = parseModelValue(newVal)
  if (d) {
    leftYear.value = d.getFullYear()
    leftMonth.value = d.getMonth()
    activeDecade.value = Math.floor(d.getFullYear() / 10) * 10
  }
})

function toggleOpen() {
  open.value = !open.value
  if (open.value && inputElement.value) {
    inputElement.value.focus()
  }
}

// Display date string for input
const displayDate = computed(() => {
  if (rawInput.value) return rawInput.value
  if (!props.modelValue) return ''
  const d = parseModelValue(props.modelValue)
  if (!d) return props.modelValue
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
})

// Direct input handling (typing)
function handleDirectInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  rawInput.value = val

  // Try parsing ISO (YYYY-MM-DD) or (DD/MM/YYYY) or (MM/DD/YYYY)
  const isoMatch = val.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10)
    const m = parseInt(isoMatch[2], 10)
    const d = parseInt(isoMatch[3], 10)
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      applyIso(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
      return
    }
  }

  const slashMatch = val.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/)
  if (slashMatch) {
    const part1 = parseInt(slashMatch[1], 10)
    const part2 = parseInt(slashMatch[2], 10)
    const y = parseInt(slashMatch[3], 10)
    
    // Default to day/month if part1 > 12, else month/day
    let d = part1
    let m = part2
    if (part1 <= 12 && part2 > 12) {
      m = part1
      d = part2
    }
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      applyIso(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
    }
  }
}

function applyIso(iso: string) {
  rawInput.value = ''
  emit('update:modelValue', iso)
  const d = parseModelValue(iso)
  if (d) {
    leftYear.value = d.getFullYear()
    leftMonth.value = d.getMonth()
    activeDecade.value = Math.floor(d.getFullYear() / 10) * 10
  }
}

// Labels
const monthLabels = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Decades list
const decades = computed(() => {
  const currentDecade = Math.floor(today.getFullYear() / 10) * 10
  const startDecade = props.minDate ? Math.floor(props.minDate.getFullYear() / 10) * 10 : currentDecade - 100
  const endDecade = props.maxDate ? Math.floor(props.maxDate.getFullYear() / 10) * 10 : currentDecade + 20
  const list: number[] = []
  for (let d = endDecade; d >= startDecade; d -= 10) {
    list.push(d)
  }
  return list
})

// Years within the active decade
const decadeYears = computed(() => {
  const base = activeDecade.value
  const list: number[] = []
  for (let i = 0; i < 10; i++) {
    const yr = base + i
    if (props.minDate && yr < props.minDate.getFullYear()) continue
    if (props.maxDate && yr > props.maxDate.getFullYear()) continue
    list.push(yr)
  }
  return list
})

function selectMonth(mIdx: number) {
  leftMonth.value = mIdx
  viewMode.value = 'calendar'
}

function selectYear(year: number) {
  leftYear.value = year
  viewMode.value = 'calendar'
}

function prevStep() {
  if (viewMode.value === 'year') {
    activeDecade.value -= 10
  } else if (viewMode.value === 'month') {
    leftYear.value--
  } else {
    if (leftMonth.value === 0) {
      leftMonth.value = 11
      leftYear.value--
    } else {
      leftMonth.value--
    }
  }
}

function nextStep() {
  if (viewMode.value === 'year') {
    activeDecade.value += 10
  } else if (viewMode.value === 'month') {
    leftYear.value++
  } else {
    if (leftMonth.value === 11) {
      leftMonth.value = 0
      leftYear.value++
    } else {
      leftMonth.value++
    }
  }
}

interface CalDay {
  date: number | null
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
  dateObj: Date
}

function buildMonthDays(year: number, month: number): CalDay[] {
  const first = new Date(year, month, 1)
  const startDow = first.getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: CalDay[] = []

  for (let i = 0; i < startDow; i++) {
    cells.push({
      date: null,
      inMonth: false,
      isToday: false,
      isSelected: false,
      isDisabled: true,
      dateObj: new Date(0)
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d)
    dt.setHours(0, 0, 0, 0)
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

    let isDisabled = false
    if (props.maxDate) {
      const mx = new Date(props.maxDate)
      mx.setHours(23, 59, 59, 999)
      if (dt > mx) isDisabled = true
    }
    if (props.minDate) {
      const mn = new Date(props.minDate)
      mn.setHours(0, 0, 0, 0)
      if (dt < mn) isDisabled = true
    }

    cells.push({
      date: d,
      inMonth: true,
      isToday: dt.getTime() === today.getTime(),
      isSelected: props.modelValue === iso,
      isDisabled,
      dateObj: dt,
    })
  }
  return cells
}

const leftDays = computed(() => buildMonthDays(leftYear.value, leftMonth.value))

function selectDay(day: CalDay) {
  if (!day.inMonth || day.isDisabled) return
  const iso = `${day.dateObj.getFullYear()}-${String(day.dateObj.getMonth() + 1).padStart(2, '0')}-${String(day.dateObj.getDate()).padStart(2, '0')}`
  rawInput.value = ''
  emit('update:modelValue', iso)
  setTimeout(() => { open.value = false }, 180)

  try {
    useTracking().trackAction('date_selected', { field: props.label, date: iso })
  } catch (e) {}
}

function clearValue() {
  rawInput.value = ''
  emit('update:modelValue', '')
  try {
    useTracking().trackAction('date_cleared', { field: props.label })
  } catch (e) {}
}
</script>

<style scoped>
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
