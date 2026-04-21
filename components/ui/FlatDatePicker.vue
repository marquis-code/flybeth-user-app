<template>
  <div class="flat-date-picker" v-bind="$attrs">
    <!-- Trigger input -->
    <div
      class="relative"
      @click="open = true"
    >
      <label
        :class="[
          'absolute transition-all duration-300 ease-in-out pointer-events-none z-10 text-brand-gray/40 font-bold tracking-widest',
          open || modelValue ? 'text-[10px] left-4 top-2' : 'text-sm left-11 top-1/2 -translate-y-1/2'
        ]"
      >{{ label }}</label>
      <div
        :class="[
          'w-full px-4 bg-white border border-gray-300 rounded-2xl cursor-pointer transition-all duration-300 min-h-[68px] flex items-center',
          open ? 'ring-2 ring-gray-900 border-gray-900' : 'hover:border-gray-300',
          hasError ? 'ring-red-500 border-red-500' : ''
        ]"
      >
        <div class="flex items-center gap-3">
           <Calendar class="h-4 w-4 text-brand-blue/60 shrink-0" />
           <span v-if="modelValue" class="font-semibold text-gray-900 text-sm tracking-tight">{{ displayDate }}</span>
           <span v-else-if="open" class="text-gray-400 text-sm font-semibold tracking-tight">Select date</span>
        </div>
      </div>
    </div>

    <!-- Calendar Overlay (Matching FlightDateRangePicker) -->
    <Teleport to="body">
      <Transition name="fade-overlay">
        <div v-if="open">
          
          <!-- Dark backdrop -->
          <div
            class="fixed inset-0 z-[10010] bg-black/50 backdrop-blur-[3px]"
            @click="open = false"
          />

          <!-- Calendar card -->
          <div
            class="fixed z-[10011] bg-white rounded-2xl overflow-hidden select-none transition-all duration-300 shadow-2xl inset-x-4 top-1/2 -translate-y-1/2 w-auto sm:max-w-[400px] sm:left-1/2 sm:-translate-x-1/2"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 pt-5 pb-3">
              <button
                @click="prevMonth"
                class="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft class="h-4 w-4 text-gray-500" />
              </button>

              <div class="flex-1 text-center">
                <button 
                  @click="viewMode = viewMode === 'year' ? 'calendar' : 'year'"
                  class="text-base font-bold text-gray-900 hover:text-brand-blue transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                  {{ monthLabels[leftMonth] }} {{ leftYear }}
                  <ChevronDown class="h-4 w-4" :class="{ 'rotate-180': viewMode === 'year' }" />
                </button>
              </div>

              <button
                @click="nextMonth"
                class="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight class="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <!-- View Modes -->
            <div class="px-6 pb-4">
              <!-- Year Selection Grid -->
              <div v-if="viewMode === 'year'">
                <div class="grid grid-cols-3 gap-2 h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                   <button 
                    v-for="year in years" 
                    :key="year"
                    type="button"
                    @click="selectYear(year)"
                    class="py-3 text-[13px] font-bold rounded-xl transition-all border"
                    :class="year === leftYear ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-900'"
                   >
                     {{ year }}
                   </button>
                </div>
              </div>

              <!-- Days Grid -->
              <div v-else>
                <div class="grid grid-cols-7 mb-2">
                  <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="text-center text-[11px] font-bold text-gray-400 py-1">{{ d }}</div>
                </div>
                <div class="grid grid-cols-7">
                  <template v-for="(day, i) in leftDays" :key="i">
                    <div v-if="!day.inMonth" class="h-10" />
                    <div
                      v-else
                      class="flex items-center justify-center h-10"
                      @click="selectDay(day)"
                    >
                      <span
                        class="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-100 cursor-pointer"
                        :class="[
                          day.isSelected ? 'bg-gray-900 text-white shadow-md' : 
                          day.isToday ? 'text-gray-900 border-2 border-gray-900/10 hover:bg-gray-100' : 
                          'text-gray-700 hover:bg-gray-100'
                        ]"
                      >
                        {{ day.date }}
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
               <button
                  v-if="modelValue"
                  @click="clearValue"
                  class="text-sm font-bold text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl transition-colors"
                >
                  Clear
                </button>
                <div v-else />

                <button
                  @click="open = false"
                  class="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors active:scale-95 shadow-sm"
                >
                  Done
                </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-vue-next'

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

const leftYear = ref(props.modelValue ? new Date(props.modelValue).getFullYear() : today.getFullYear())
const leftMonth = ref(props.modelValue ? new Date(props.modelValue).getMonth() : today.getMonth())
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

const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const selectedDateStr = computed(() => props.modelValue || '')

const displayDate = computed(() => {
  if (!props.modelValue) return ''
  const d = new Date(props.modelValue + 'T12:00:00')
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
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

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: CalDay[] = []

  for (let i = 0; i < startDow; i++) {
    cells.push({ date: null, inMonth: false, isToday: false, isSelected: false, dateObj: new Date(0) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d)
    dt.setHours(0, 0, 0, 0)
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      date: d,
      inMonth: true,
      isToday: dt.getTime() === today.getTime(),
      isSelected: selectedDateStr.value === iso,
      dateObj: dt,
    })
  }
  return cells
}

const leftDays = computed(() => buildMonthDays(leftYear.value, leftMonth.value))

function selectDay(day: CalDay) {
  if (!day.inMonth) return
  const iso = `${day.dateObj.getFullYear()}-${String(day.dateObj.getMonth() + 1).padStart(2, '0')}-${String(day.dateObj.getDate()).padStart(2, '0')}`
  emit('update:modelValue', iso)
  setTimeout(() => { open.value = false }, 150)
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
.fade-overlay-enter-active, .fade-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.fade-overlay-enter-from, .fade-overlay-leave-to {
  opacity: 0;
}

.fade-overlay-enter-active .fixed.z-\[10011\] {
  transition: transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.fade-overlay-enter-from .fixed.z-\[10011\] {
  transform: translateY(-10px) scale(0.97);
  opacity: 0;
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


