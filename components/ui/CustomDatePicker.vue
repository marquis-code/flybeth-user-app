<template>
  <div class="relative w-full font-body" ref="calendarRef">
    <!-- Trigger Input -->
    <div 
      @click="toggleCalendar"
      class="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500 group"
      :class="{ 'ring-4 ring-brand-blue/5 border-brand-blue shadow-xl': isOpen }"
    >
      <div class="p-3 border border-brand-blue/10 rounded-2xl bg-brand-blue/5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isOpen ? 'text-white' : 'text-gray-900 transition-colors group-hover:text-white'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="flex flex-col">
        <span class="text-[11px] uppercase tracking-[0.15em] text-brand-gray  mb-0.5 opacity-70">{{ label }}</span>
        <span class="text-base font-bold text-gray-900 tracking-tight">
          {{ formattedValue }}
        </span>
      </div>
    </div>

    <!-- Calendar Popover -->
    <Transition name="calendar-pop">
      <div 
        v-if="isOpen"
        class="absolute z-[100] mt-4 bg-white rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.15)] border border-gray-100 p-8 min-w-[320px] lg:min-w-[700px] transform origin-top-left"
        :class="popoverPosition"
      >
        <div class="flex flex-col lg:flex-row gap-12">
          <!-- Calendar Month -->
          <div class="flex-1">
             <div class="flex items-center justify-between mb-8">
                <button @click="prevMonth" class="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 class="text-sm  text-gray-900 uppercase tracking-widest">{{ formatMonthYear(currentMonth) }}</h3>
                <button v-if="!isDesktop" @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div v-else class="w-8"></div>
             </div>

             <div class="grid grid-cols-7 mb-4">
                <span v-for="day in ['S','M','T','W','T','F','S']" :key="day" class="text-[9px]  text-gray-400 uppercase tracking-widest text-center">{{ day }}</span>
             </div>

             <div class="grid grid-cols-7 gap-1 relative">
                <div v-for="empty in firstDayOfMonth(currentMonth)" :key="'empty-'+empty" class="aspect-square"></div>
                
                <div 
                  v-for="day in daysInMonth(currentMonth)" 
                  :key="day"
                  class="relative group aspect-square flex items-center justify-center cursor-pointer z-10"
                  @mouseenter="onDateMouseEnter(getDateObj(currentMonth, day))"
                  @click="onDateClick(getDateObj(currentMonth, day))"
                >
                  <!-- Range Background -->
                  <div 
                    v-if="isInRange(getDateObj(currentMonth, day))"
                    class="absolute inset-y-1 bg-gray-100"
                    :class="getRangeBgClasses(getDateObj(currentMonth, day))"
                  ></div>

                  <!-- Day Text -->
                  <div 
                    class="relative z-10 w-full h-full flex items-center justify-center rounded-xl text-[11px] font-bold transition-all duration-300 transform group-hover:scale-110"
                    :class="getDayClasses(getDateObj(currentMonth, day))"
                  >
                    {{ day }}
                  </div>
                </div>
             </div>
          </div>

          <!-- Second Month (Desktop Only) -->
          <div v-if="isDesktop" class="flex-1">
             <div class="flex items-center justify-between mb-8">
                <div class="w-8"></div>
                <h3 class="text-sm  text-gray-900 uppercase tracking-widest">{{ formatMonthYear(nextMonthDate) }}</h3>
                <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
             </div>

             <div class="grid grid-cols-7 mb-4">
                <span v-for="day in ['S','M','T','W','T','F','S']" :key="day" class="text-[9px]  text-gray-400 uppercase tracking-widest text-center">{{ day }}</span>
             </div>

             <div class="grid grid-cols-7 gap-1 relative">
                <div v-for="empty in firstDayOfMonth(nextMonthDate)" :key="'empty-next-'+empty" class="aspect-square"></div>
                
                <div 
                  v-for="day in daysInMonth(nextMonthDate)" 
                  :key="day"
                  class="relative group aspect-square flex items-center justify-center cursor-pointer z-10"
                  @mouseenter="onDateMouseEnter(getDateObj(nextMonthDate, day))"
                  @click="onDateClick(getDateObj(nextMonthDate, day))"
                >
                  <!-- Range Background -->
                  <div 
                    v-if="isInRange(getDateObj(nextMonthDate, day))"
                    class="absolute inset-y-1 bg-gray-100"
                    :class="getRangeBgClasses(getDateObj(nextMonthDate, day))"
                  ></div>

                  <!-- Day Text -->
                  <div 
                    class="relative z-10 w-full h-full flex items-center justify-center rounded-xl text-[11px] font-bold transition-all duration-300 transform group-hover:scale-110"
                    :class="getDayClasses(getDateObj(nextMonthDate, day))"
                  >
                    {{ day }}
                  </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Compact Footer -->
        <div class="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <button 
            @click="isOpen = false"
            class="px-8 py-3 bg-gray-900 text-white text-[10px]  uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-200"
          >
            Apply Selection
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  label?: string
  modelValue: any
  mode?: 'single' | 'range'
  popoverPosition?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select Date',
  mode: 'range',
  popoverPosition: 'left-0'
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const calendarRef = ref<HTMLElement | null>(null)
const currentMonth = ref(new Date())
const hoverDate = ref<Date | null>(null)
const isDesktop = ref(true)

// Navigation Days
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const updateResponsive = () => {
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 1024
  }
}

onMounted(() => {
  updateResponsive()
  window.addEventListener('resize', updateResponsive)
  document.addEventListener('click', handleClickOutside)
  
  if (props.modelValue) {
    if (props.mode === 'single' && props.modelValue instanceof Date) {
      currentMonth.value = new Date(props.modelValue)
    } else if (props.mode === 'range' && props.modelValue.start) {
      currentMonth.value = new Date(props.modelValue.start)
    }
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateResponsive)
    document.removeEventListener('click', handleClickOutside)
  }
})

const handleClickOutside = (event: MouseEvent) => {
  if (calendarRef.value && !calendarRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const toggleCalendar = () => isOpen.value = !isOpen.value

const nextMonthDate = computed(() => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + 1)
  return d
})

const formatMonthYear = (date: Date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}

const daysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

const firstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

const getDateObj = (baseDate: Date, day: number) => {
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), day)
}

const isSameDate = (d1: Date | null, d2: Date | null) => {
  if (!d1 || !d2) return false
  return d1.getFullYear() === d2.getFullYear() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getDate() === d2.getDate()
}

const isInRange = (date: Date) => {
  if (props.mode !== 'range' || !props.modelValue) return false
  const { start, end } = props.modelValue
  
  if (start && end) {
    const s = start < end ? start : end
    const e = start < end ? end : start
    return date >= s && date <= e
  }
  
  if (start && hoverDate.value) {
    const s = start < hoverDate.value ? start : hoverDate.value
    const e = start < hoverDate.value ? hoverDate.value : start
    return date >= s && date <= e
  }
  
  return false
}

const getRangeBgClasses = (date: Date) => {
  if (props.mode !== 'range' || !props.modelValue) return ''
  const { start, end } = props.modelValue
  const targetEnd = end || hoverDate.value
  
  if (!start || !targetEnd) return ''

  const s = start < targetEnd ? start : targetEnd
  const e = start < targetEnd ? targetEnd : start

  if (isSameDate(date, s) && isSameDate(date, e)) return 'invisible'
  if (isSameDate(date, s)) return 'rounded-l-full left-1/2 right-0'
  if (isSameDate(date, e)) return 'rounded-r-full left-0 right-1/2'
  if (date > s && date < e) return 'left-0 right-0'
  
  return ''
}

const getDayClasses = (date: Date) => {
  const classes = []
  
  const isStart = props.mode === 'range' && isSameDate(date, props.modelValue?.start || null)
  const isEnd = props.mode === 'range' && isSameDate(date, props.modelValue?.end || null)
  const isSelectedSingle = props.mode === 'single' && isSameDate(date, props.modelValue as Date)

  if (isStart || isEnd || isSelectedSingle) {
    classes.push('bg-gray-900 text-white shadow-lg scale-105')
  } else if (isInRange(date)) {
    classes.push('text-gray-900')
  } else {
    classes.push('text-gray-900 hover:bg-gray-50')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) {
    classes.push('opacity-10 cursor-not-allowed pointer-events-none')
  }

  return classes.join(' ')
}

const formattedValue = computed(() => {
  if (!props.modelValue) return 'Select date'
  
  if (props.mode === 'single') {
    if (!(props.modelValue instanceof Date)) return 'Select date'
    return props.modelValue.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const { start, end } = props.modelValue
  if (start && end) {
    return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
  }
  if (start) return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ...`
  
  return 'Select dates'
})

const onDateClick = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) return

  if (props.mode === 'single') {
    emit('update:modelValue', date)
    isOpen.value = false
  } else {
    const val = props.modelValue || { start: null, end: null }
    
    if (!val.start || (val.start && val.end)) {
      emit('update:modelValue', { start: date, end: null })
    } else {
      if (date < val.start) {
        emit('update:modelValue', { start: date, end: val.start })
      } else if (isSameDate(date, val.start)) {
        emit('update:modelValue', { start: null, end: null })
      } else {
        emit('update:modelValue', { start: val.start, end: date })
        // High quality UX: Auto-close after full range selection on mobile, or just keep open for fine-tuning?
        // Let's keep it open for "Apply Dates" click, but provide visual confirmation.
      }
    }
  }
}

const onDateMouseEnter = (date: Date) => {
  if (props.mode === 'range' && props.modelValue?.start && !props.modelValue?.end) {
    hoverDate.value = date
  } else {
    hoverDate.value = null
  }
}

const prevMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() - 1)
  currentMonth.value = d
}

const nextMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + 1)
  currentMonth.value = d
}
</script>

<style scoped>
.calendar-pop-enter-active,
.calendar-pop-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.calendar-pop-enter-from,
.calendar-pop-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.grid-cols-7 > div > .bg-gray-100 {
  height: 2.25rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>
