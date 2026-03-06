<template>
  <div class="relative" ref="pickerRef">
    <!-- Trigger Inputs -->
    <div class="flex items-center w-full" @click="togglePicker">
      <div class="flex-1 cursor-pointer p-4 group">
        <label class="text-xs font-black text-brand-gray/60 uppercase tracking-widest block mb-1 group-hover:text-brand-blue transition-colors">Departure</label>
        <div class="text-2xl font-black text-brand-blue flex items-center gap-2">
           <span v-if="departureDate">{{ formatDateDay(departureDate) }} <span class="text-sm font-bold text-gray-500">{{ formatDateMonth(departureDate) }}</span></span>
           <span v-else class="text-gray-400 text-lg">Select date</span>
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-brand-blue/40 ml-1"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div v-if="departureDate" class="text-[10px] font-bold text-gray-400 mt-1">{{ formatDayOfWeek(departureDate) }}</div>
      </div>
      
      <div class="w-px h-12 bg-gray-200"></div>

      <div class="flex-1 cursor-pointer p-4 group">
        <label class="text-xs font-black text-brand-gray/60 uppercase tracking-widest block mb-1 group-hover:text-brand-blue transition-colors">Return</label>
        <div class="text-2xl font-black text-brand-blue flex items-center gap-2" :class="{'opacity-50': mode === 'oneway'}">
           <span v-if="returnDate && mode !== 'oneway'">{{ formatDateDay(returnDate) }} <span class="text-sm font-bold text-gray-500">{{ formatDateMonth(returnDate) }}</span></span>
           <span v-else-if="mode === 'oneway'" class="text-gray-400 text-lg">One way</span>
           <span v-else class="text-gray-400 text-lg">Select date</span>
           <svg v-if="mode !== 'oneway'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-brand-blue/40 ml-1"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div v-if="returnDate && mode !== 'oneway'" class="text-[10px] font-bold text-gray-400 mt-1">{{ formatDayOfWeek(returnDate) }}</div>
      </div>
    </div>

    <!-- Dropdown Calendar -->
    <Transition name="fade-up">
      <div v-if="isOpen" class="absolute top-full left-0 mt-3 z-[200] bg-white rounded-3xl shadow-[0_30px_90px_-20px_rgba(13,29,173,0.25)] border border-gray-100 p-6 min-w-[700px] flex flex-col gap-4">
        
        <!-- Selection instruction label -->
        <div class="flex items-center justify-between px-4">
          <div class="flex items-center gap-3">
            <div class="h-6 w-6 rounded-lg flex items-center justify-center text-xs font-black" :class="selectionStep === 'departure' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-400'">1</div>
            <span class="text-xs font-bold" :class="selectionStep === 'departure' ? 'text-brand-blue' : 'text-gray-400'">Select departure</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-300"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <div class="h-6 w-6 rounded-lg flex items-center justify-center text-xs font-black" :class="selectionStep === 'return' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-400'">2</div>
            <span class="text-xs font-bold" :class="selectionStep === 'return' ? 'text-brand-blue' : 'text-gray-400'">Select return</span>
          </div>
          <div class="flex items-center gap-2">
            <button @click.stop="setToday" class="text-[10px] font-black text-brand-blue uppercase tracking-wider bg-brand-blue/5 px-3 py-1.5 rounded-lg hover:bg-brand-blue/10 transition-colors">Today</button>
          </div>
        </div>

        <div class="flex justify-between items-center px-4 mb-1">
           <button @click.stop="previousMonth" class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-600"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </button>
           <button @click.stop="nextMonth" class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-600"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </button>
        </div>

        <div class="flex gap-8">
          <!-- Left Month -->
          <div class="flex-1">
             <div class="text-center font-black text-brand-blue mb-5 bg-gray-50 py-2 rounded-xl text-sm">{{ getMonthName(currentDateLeft) }} {{ currentDateLeft.getFullYear() }}</div>
             <div class="grid grid-cols-7 gap-y-1 text-center text-[10px] font-bold text-gray-400 mb-2">
                <div v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d">{{ d }}</div>
             </div>
             <div class="grid grid-cols-7 gap-y-1 gap-x-0 relative">
                <div 
                  v-for="(day, idx) in leftMonthDays" 
                  :key="idx" 
                  @click.stop="day.date && handleDateClick(day.fullDate)"
                  @mouseenter="day.date && handleDateHover(day.fullDate)"
                  class="h-10 flex items-center justify-center relative z-10 text-sm font-bold cursor-pointer transition-all w-full"
                  :class="getDayCellClass(day)"
                >
                    <!-- Range fill: left half for end date, right half for start date -->
                    <div v-if="isStartDate(day.fullDate) && hasRangeOrPreview" class="absolute right-0 top-0 bottom-0 w-1/2 bg-brand-blue/5 -z-10"></div>
                    <div v-if="(isEndDate(day.fullDate) || isHoverEndDate(day.fullDate)) && departureDate" class="absolute left-0 top-0 bottom-0 w-1/2 bg-brand-blue/5 -z-10"></div>
                    
                    <div v-if="day.date" class="h-10 w-10 rounded-xl flex items-center justify-center relative" :class="getDayClass(day)">
                       {{ day.date }}
                       <div v-if="isStartDate(day.fullDate)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c6e80] text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm z-30 whitespace-nowrap">Depart</div>
                       <div v-if="isEndDate(day.fullDate) || (isHoverEndDate(day.fullDate) && !returnDate)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c6e80]/70 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm z-30 whitespace-nowrap">Return</div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Right Month -->
           <div class="flex-1">
              <div class="text-center font-black text-brand-blue mb-5 bg-gray-50 py-2 rounded-xl text-sm">{{ getMonthName(currentDateRight) }} {{ currentDateRight.getFullYear() }}</div>
              <div class="grid grid-cols-7 gap-y-1 text-center text-[10px] font-bold text-gray-400 mb-2">
                 <div v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d">{{ d }}</div>
              </div>
              <div class="grid grid-cols-7 gap-y-1 gap-x-0 relative">
                 <div 
                   v-for="(day, idx) in rightMonthDays" 
                   :key="idx" 
                   @click.stop="day.date && handleDateClick(day.fullDate)"
                   @mouseenter="day.date && handleDateHover(day.fullDate)"
                   class="h-10 flex items-center justify-center relative z-10 text-sm font-bold cursor-pointer transition-all w-full"
                   :class="getDayCellClass(day)"
                 >
                    <div v-if="isStartDate(day.fullDate) && hasRangeOrPreview && mode !== 'oneway'" class="absolute right-0 top-0 bottom-0 w-1/2 bg-brand-blue/5 -z-10"></div>
                    <div v-if="(isEndDate(day.fullDate) || isHoverEndDate(day.fullDate)) && departureDate" class="absolute left-0 top-0 bottom-0 w-1/2 bg-brand-blue/5 -z-10"></div>
                    
                    <div v-if="day.date" class="h-10 w-10 rounded-xl flex items-center justify-center relative" :class="getDayClass(day)">
                       {{ day.date }}
                       <div v-if="isStartDate(day.fullDate)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c6e80] text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm z-30 whitespace-nowrap">Depart</div>
                       <div v-if="isEndDate(day.fullDate) || (isHoverEndDate(day.fullDate) && !returnDate)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c6e80]/70 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm z-30 whitespace-nowrap">Return</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  departure: String,
  return: String,
  mode: {
    type: String,
    default: 'roundtrip'
  }
})

const emit = defineEmits(['update:departure', 'update:return'])

const pickerRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const departureDate = ref<Date | null>(props.departure ? new Date(props.departure) : new Date())
const returnDate = ref<Date | null>(props.return ? new Date(props.return) : new Date(Date.now() + 14 * 86400000))
const hoveredDate = ref<Date | null>(null)

const currentDateLeft = ref(new Date(departureDate.value || new Date()))
const currentDateRight = computed(() => {
  const c = new Date(currentDateLeft.value)
  c.setMonth(c.getMonth() + 1)
  return c
})

watch(() => props.departure, (newVal) => {
   if(newVal) departureDate.value = new Date(newVal);
})
watch(() => props.return, (newVal) => {
   if(newVal) returnDate.value = new Date(newVal);
})

const togglePicker = () => {
  isOpen.value = !isOpen.value
  hoveredDate.value = null
}

const closePicker = (e: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    isOpen.value = false
    hoveredDate.value = null
  }
}

onMounted(() => window.addEventListener('click', closePicker))
onUnmounted(() => window.removeEventListener('click', closePicker))

const previousMonth = () => {
  currentDateLeft.value = new Date(currentDateLeft.value.getFullYear(), currentDateLeft.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDateLeft.value = new Date(currentDateLeft.value.getFullYear(), currentDateLeft.value.getMonth() + 1, 1)
}

const setToday = () => {
  const today = new Date()
  today.setHours(0,0,0,0)
  departureDate.value = today
  emit('update:departure', formatForEmitting(today))
  currentDateLeft.value = new Date(today.getFullYear(), today.getMonth(), 1)
  if (props.mode === 'oneway') {
    isOpen.value = false
  } else {
    selectionStep.value = 'return'
    returnDate.value = null
  }
}

const getMonthName = (date: Date) => {
  return date.toLocaleString('default', { month: 'long' })
}

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  let firstDayIndex = firstDay.getDay() - 1
  if (firstDayIndex === -1) firstDayIndex = 6
  
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ date: null, fullDate: null })
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const fullDate = new Date(year, month, i)
    fullDate.setHours(0,0,0,0)
    days.push({ date: i, fullDate })
  }
  
  return days
}

const leftMonthDays = computed(() => getDaysInMonth(currentDateLeft.value))
const rightMonthDays = computed(() => getDaysInMonth(currentDateRight.value))

const isSelectable = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    return date.getTime() >= today.getTime();
}

const isStartDate = (date: Date | null) => {
    if (!date || !departureDate.value) return false;
    return date.getTime() === departureDate.value.getTime();
}

const isEndDate = (date: Date | null) => {
    if (props.mode === 'oneway') return false;
    if (!date || !returnDate.value) return false;
    return date.getTime() === returnDate.value.getTime();
}

const isHoverEndDate = (date: Date | null) => {
    if (props.mode === 'oneway') return false;
    if (!date || !hoveredDate.value || returnDate.value) return false;
    if (selectionStep.value !== 'return') return false;
    return date.getTime() === hoveredDate.value.getTime();
}

const isDateInRange = (date: Date | null) => {
    if (props.mode === 'oneway') return false;
    if (!date || !departureDate.value) return false;
    
    const endDate = returnDate.value || (selectionStep.value === 'return' ? hoveredDate.value : null);
    if (!endDate) return false;
    
    return date.getTime() >= departureDate.value.getTime() && date.getTime() <= endDate.getTime();
}

const hasRangeOrPreview = computed(() => {
    if (props.mode === 'oneway') return false;
    return !!returnDate.value || (selectionStep.value === 'return' && !!hoveredDate.value);
})

// ============================================
// Day cell styling helpers
// ============================================
const getDayCellClass = (day: any) => [
    day.date ? 'hover:bg-brand-blue/5' : '',
    isDateInRange(day.fullDate) && !isStartDate(day.fullDate) && !isEndDate(day.fullDate) && !isHoverEndDate(day.fullDate) ? 'bg-brand-blue/5' : '',
    isStartDate(day.fullDate) || isEndDate(day.fullDate) || isHoverEndDate(day.fullDate) ? 'z-20' : '',
    !day.date ? 'pointer-events-none' : ''
]

const getDayClass = (day: any) => [
    isStartDate(day.fullDate) || isEndDate(day.fullDate) ? 'bg-[#5c6e80] text-white shadow-md border-2 border-[#5c6e80]' : '',
    isHoverEndDate(day.fullDate) && !isEndDate(day.fullDate) ? 'bg-[#5c6e80]/60 text-white shadow-sm border-2 border-[#5c6e80]/60' : '',
    !isStartDate(day.fullDate) && !isEndDate(day.fullDate) && !isHoverEndDate(day.fullDate) ? 'text-gray-700' : '',
    !isSelectable(day.fullDate) ? 'text-gray-300 pointer-events-none' : ''
]

// Interactive Selection State
const selectionStep = ref<'departure' | 'return'>('departure')

const handleDateHover = (date: Date | null) => {
    if (!date || !isSelectable(date)) return;
    if (props.mode === 'oneway') return;
    if (selectionStep.value === 'return' && departureDate.value) {
        // Only hover dates after departure
        if (date.getTime() >= departureDate.value.getTime()) {
            hoveredDate.value = date;
        }
    }
}

const handleDateClick = (date: Date | null) => {
    if (!date || !isSelectable(date)) return;

    if (props.mode === 'oneway') {
        departureDate.value = date;
        emit('update:departure', formatForEmitting(date));
        isOpen.value = false;
        return;
    }

    if (selectionStep.value === 'departure') {
        departureDate.value = date;
        returnDate.value = null;
        hoveredDate.value = null;
        emit('update:departure', formatForEmitting(date));
        selectionStep.value = 'return';
    } else {
        // If clicking a date before departure, reset departure
        if (date.getTime() < departureDate.value!.getTime()) {
            departureDate.value = date;
            returnDate.value = null;
            hoveredDate.value = null;
            emit('update:departure', formatForEmitting(date));
            selectionStep.value = 'return';
        } else {
            returnDate.value = date;
            hoveredDate.value = null;
            emit('update:return', formatForEmitting(date));
            selectionStep.value = 'departure';
            isOpen.value = false;
        }
    }
}

// Formatter Helpers
const formatForEmitting = (d: Date) => d.toISOString().split('T')[0]
const formatDateDay = (d: Date) => d.getDate()
const formatDateMonth = (d: Date) => d.toLocaleString('default', { month: 'short' }) + "'" + d.getFullYear().toString().slice(2)
const formatDayOfWeek = (d: Date) => d.toLocaleString('default', { weekday: 'long' })

</script>

<style scoped>
.fade-up-enter-active, .fade-up-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
