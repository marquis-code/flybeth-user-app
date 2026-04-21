<template>
  <div class="relative flex lg:contents" ref="pickerRef">
    <!-- Check-in Trigger -->
    <div 
      @click="openPicker('checkIn')"
      class="w-full lg:w-48 bg-white px-6 py-3 border-r border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
    >
      <div class="flex items-center text-sm font-bold text-gray-500 tracking-wide mb-1.5">
        Check-in 
        <svg class="w-3.5 h-3.5 ml-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" :class="{'rotate-180': isOpen}"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="font-bold text-gray-900 leading-none">
        {{ formatDate(checkInDate) }}
      </div>
    </div>

    <!-- Check-out Trigger -->
    <div 
      @click="openPicker('checkOut')"
      class="w-full lg:w-48 bg-white px-6 py-3 border-r border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
    >
      <div class="flex items-center text-sm font-bold text-gray-500 tracking-wide mb-1.5">
        Check-out
        <svg class="w-3.5 h-3.5 ml-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" :class="{'rotate-180': isOpen}"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="font-bold text-gray-900 leading-none">
        {{ formatDate(checkOutDate) }}
      </div>
    </div>

    <!-- Dropdown Calendar -->
    <div v-if="isOpen" class="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-[200] bg-white rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.15)] border border-gray-100 p-8 w-[92vw] sm:w-[340px] md:min-w-[700px] flex flex-col gap-8 transform origin-top">
        
        <!-- Mobile Close Button -->
        <button @click="isOpen = false" class="md:hidden absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-gray-400 bg-gray-50 rounded-full z-20">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- Controls -->
        <div class="flex justify-between items-center px-2">
           <button @click.stop="previousMonth" class="p-2 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </button>
           <div class="flex gap-4 md:gap-40 text-gray-900  tracking-widest text-[10px] uppercase">
             <span>{{ getMonthName(currentDateLeft) }} {{ currentDateLeft.getFullYear() }}</span>
             <span class="hidden md:inline">{{ getMonthName(currentDateRight) }} {{ currentDateRight.getFullYear() }}</span>
           </div>
           <button @click.stop="nextMonth" class="p-2 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </button>
        </div>

        <div class="flex flex-col md:flex-row gap-10">
          <!-- Left Month -->
          <div class="flex-1">
             <div class="grid grid-cols-7 text-center text-[9px]  text-gray-400 uppercase tracking-widest mb-4">
                <div v-for="d in ['S','M','T','W','T','F','S']" :key="d">{{ d }}</div>
             </div>
             <div class="grid grid-cols-7 gap-1 relative">
                <div 
                   v-for="(day, idx) in leftMonthDays" 
                   :key="idx" 
                   @click.stop="day.date && handleDateClick(day.fullDate)"
                   @mouseenter="day.date && handleDateHover(day.fullDate)"
                   class="aspect-square flex items-center justify-center relative z-10 text-[11px] font-bold cursor-pointer transition-all w-full"
                   :class="getDayCellClass(day)"
                >
                    <div v-if="day.date" class="h-full w-full rounded-xl flex items-center justify-center relative transition-all" :class="getDayClass(day)">
                       {{ day.date }}
                       <div v-if="isStartDate(day.fullDate)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[6px]  px-1.5 py-0.5 rounded-full tracking-widest uppercase z-30">IN</div>
                       <div v-if="isEndDate(day.fullDate)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[6px]  px-1.5 py-0.5 rounded-full tracking-widest uppercase z-30">OUT</div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Right Month (Desktop Only) -->
           <div class="hidden md:block flex-1">
              <div class="grid grid-cols-7 text-center text-[9px]  text-gray-400 uppercase tracking-widest mb-4">
                <div v-for="d in ['S','M','T','W','T','F','S']" :key="d">{{ d }}</div>
              </div>
              <div class="grid grid-cols-7 gap-1 relative">
                 <div 
                    v-for="(day, idx) in rightMonthDays" 
                    :key="idx" 
                    @click.stop="day.date && handleDateClick(day.fullDate)"
                    @mouseenter="day.date && handleDateHover(day.fullDate)"
                    class="aspect-square flex items-center justify-center relative z-10 text-[11px] font-bold cursor-pointer transition-all w-full"
                    :class="getDayCellClass(day)"
                 >
                    <div v-if="day.date" class="h-full w-full rounded-xl flex items-center justify-center relative transition-all" :class="getDayClass(day)">
                       {{ day.date }}
                       <div v-if="isStartDate(day.fullDate)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[6px]  px-1.5 py-0.5 rounded-full tracking-widest uppercase z-30">IN</div>
                       <div v-if="isEndDate(day.fullDate)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[6px]  px-1.5 py-0.5 rounded-full tracking-widest uppercase z-30">OUT</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  checkIn: String,
  checkOut: String
});

const emit = defineEmits(['update:checkIn', 'update:checkOut']);

const pickerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const selectionStep = ref<'checkIn' | 'checkOut'>('checkIn');

const checkInDate = ref<Date | null>(props.checkIn ? new Date(props.checkIn) : null);
const checkOutDate = ref<Date | null>(props.checkOut ? new Date(props.checkOut) : null);
const hoveredDate = ref<Date | null>(null);

const currentDateLeft = ref(new Date());
const currentDateRight = computed(() => {
  const c = new Date(currentDateLeft.value);
  c.setMonth(c.getMonth() + 1);
  return c;
});

const openPicker = (step: 'checkIn' | 'checkOut') => {
  isOpen.value = true;
  selectionStep.value = step;
};

const formatDate = (date: Date | string | null) => {
  if (!date) return 'Select date';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit' }).replace(/,/g, '');
};

const getMonthName = (date: Date) => date.toLocaleString('default', { month: 'long' });

const previousMonth = () => {
  currentDateLeft.value = new Date(currentDateLeft.value.getFullYear(), currentDateLeft.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDateLeft.value = new Date(currentDateLeft.value.getFullYear(), currentDateLeft.value.getMonth() + 1, 1);
};

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days = [];
  let firstDayIndex = firstDay.getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6;
  
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ date: null, fullDate: null });
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const fullDate = new Date(year, month, i);
    fullDate.setHours(0,0,0,0);
    days.push({ date: i, fullDate });
  }
  
  return days;
};

const leftMonthDays = computed(() => getDaysInMonth(currentDateLeft.value));
const rightMonthDays = computed(() => getDaysInMonth(currentDateRight.value));

const isSelectable = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    return date.getTime() >= today.getTime();
};

const isStartDate = (date: Date | null) => {
    if (!date || !checkInDate.value) return false;
    return date.getTime() === checkInDate.value.getTime();
};

const isEndDate = (date: Date | null) => {
    if (!date || !checkOutDate.value) return false;
    return date.getTime() === checkOutDate.value.getTime();
};

const isHoverEndDate = (date: Date | null) => {
    if (!date || !hoveredDate.value || checkOutDate.value) return false;
    if (selectionStep.value !== 'checkOut') return false;
    return date.getTime() === hoveredDate.value.getTime();
};

const isDateInRange = (date: Date | null) => {
    if (!date || !checkInDate.value) return false;
    const endDate = checkOutDate.value || (selectionStep.value === 'checkOut' ? hoveredDate.value : null);
    if (!endDate) return false;
    return date.getTime() >= checkInDate.value.getTime() && date.getTime() <= endDate.getTime();
};

const getDayCellClass = (day: any) => [
    isDateInRange(day.fullDate) ? 'bg-gray-900/5' : '',
    !day.date ? 'pointer-events-none' : ''
];

const getDayClass = (day: any) => [
    isStartDate(day.fullDate) || isEndDate(day.fullDate) ? 'bg-gray-900 text-white shadow-lg scale-110' : '',
    isHoverEndDate(day.fullDate) && !checkOutDate.value ? 'bg-gray-900/40 text-white' : '',
    !isStartDate(day.fullDate) && !isEndDate(day.fullDate) && !isHoverEndDate(day.fullDate) ? 'text-gray-900 ' : '',
    !isSelectable(day.fullDate) ? 'text-gray-200 pointer-events-none' : 'hover:bg-gray-100'
];

const handleDateHover = (date: Date | null) => {
    if (!date || !isSelectable(date)) return;
    if (selectionStep.value === 'checkOut' && checkInDate.value) {
        if (date.getTime() >= checkInDate.value.getTime()) {
            hoveredDate.value = date;
        }
    }
};

const handleDateClick = (date: Date | null) => {
    if (!date || !isSelectable(date)) return;

    if (selectionStep.value === 'checkIn') {
        checkInDate.value = date;
        checkOutDate.value = null;
        emit('update:checkIn', date.toISOString().split('T')[0]);
        selectionStep.value = 'checkOut';
    } else {
        if (date.getTime() < checkInDate.value!.getTime()) {
            checkInDate.value = date;
            checkOutDate.value = null;
            emit('update:checkIn', date.toISOString().split('T')[0]);
        } else {
            checkOutDate.value = date;
            emit('update:checkOut', date.toISOString().split('T')[0]);
            isOpen.value = false;
        }
    }
};

const closePicker = (e: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener('click', closePicker));
onUnmounted(() => window.removeEventListener('click', closePicker));
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
