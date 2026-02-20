<template>
  <div class="calendar-container bg-white text-gray-900 h-full flex flex-col font-sans select-none overflow-hidden">
    <!-- Calendar Header -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-[60]">
      <div class="flex items-center gap-2">
        <button 
          @click="goToToday"
          class="px-4 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-sm font-semibold transition-colors border border-gray-200"
        >
          Today
        </button>
        <div class="flex items-center bg-white rounded-lg overflow-hidden border border-gray-200 ml-1">
          <button @click="navigate(-1)" class="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft :size="18" />
          </button>
          <div class="relative">
            <button 
              @click.stop="toggleDatePicker" 
              class="px-4 py-1.5 min-w-[150px] text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 border-x border-gray-200 transition-colors"
            >
              {{ formattedCurrentRange }}
              <ChevronDown :size="14" class="transition-transform duration-200" :class="{ 'rotate-180': isDatePickerOpen }" />
            </button>
            
            <!-- Mini Calendar Dropdown -->
            <div 
              v-if="isDatePickerOpen" 
              v-click-outside="() => isDatePickerOpen = false"
              class="absolute top-full left-0 mt-2 w-[520px] bg-white border border-gray-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 z-[100]"
            >
              <div class="flex gap-8">
                <DatePickerPanel 
                  :month-offset="0" 
                  :current-date="currentDate" 
                  @select="selectDate"
                />
                <DatePickerPanel 
                  :month-offset="1" 
                  :current-date="currentDate" 
                  @select="selectDate"
                />
              </div>
              <div class="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                  v-for="shortcut in dateShortcuts" 
                  :key="shortcut.label"
                  @click="useShortcut(shortcut)"
                  class="px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 text-[11px] font-bold text-gray-500 hover:text-gray-900 whitespace-nowrap border border-gray-200 transition-colors"
                >
                  {{ shortcut.label }}
                </button>
                <div class="flex-grow"></div>
              </div>
            </div>
          </div>
          <button @click="navigate(1)" class="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronRight :size="18" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-1 md:gap-3">
        <button 
          @click="$emit('toggle-maximize')" 
          class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          title="Toggle Full Screen"
        >
          <Maximize2 v-if="!isMaximized" :size="18" />
          <Minimize2 v-else :size="18" />
        </button>

        <div class="relative h-9">
          <button 
            @click.stop="isViewSelectorOpen = !isViewSelectorOpen"
            class="h-full px-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-sm font-semibold flex items-center gap-2 min-w-[90px] transition-colors"
          >
            {{ currentViewLabel }} <ChevronDown :size="14" class="text-gray-400" />
          </button>
          
          <div v-if="isViewSelectorOpen" v-click-outside="() => isViewSelectorOpen = false" class="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-1 z-[100]">
            <button 
              v-for="v in views" :key="v.id"
              @click="setView(v.id)"
              class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              :class="{ 'bg-gray-50 text-gray-900 font-bold': currentView === v.id }"
            >
              <component :is="v.icon" :size="16" />
              {{ v.label }}
            </button>
          </div>
        </div>

        <button class="h-9 px-5 rounded-lg bg-[#005967] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#004450] transition-colors shadow-lg active:scale-95">
          Add
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col relative overflow-hidden">
      <!-- Business Header Subtitle -->
      <div class="flex flex-col items-center py-5 bg-white border-b border-gray-100 gap-1 z-10 relative">
        <div class="w-14 h-14 rounded-full border border-gray-100 p-0.5 overflow-hidden flex-shrink-0 bg-white shadow-sm">
           <div class="w-full h-full rounded-full flex items-center justify-center bg-primary p-1 overflow-hidden">
              <img src="@/assets/img/logo.png" alt="Business Logo" class="w-full bg-primary h-full object-contain">
           </div>
        </div>
        <button class="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mt-1">
          Lola April
        </button>
      </div>

      <div class="flex-grow overflow-auto scrollbar-thin relative" ref="mainScroll">
        <!-- Month View -->
        <div v-if="currentView === 'month'" class="h-full flex flex-col min-w-[1000px] bg-white text-gray-900">
           <div class="grid grid-cols-7 border-b border-gray-100 sticky top-0 bg-white z-20">
             <div v-for="d in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="d" class="py-2.5 text-center text-base font-black text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">{{ d }}</div>
           </div>
           <div class="flex-grow grid grid-cols-7 grid-rows-6 min-h-[800px]">
             <div 
               v-for="d in monthDays" :key="d.date.getTime()"
               class="border-r border-b border-gray-100 p-2 flex flex-col gap-1 overflow-hidden transition-all last:border-r-0 hover:bg-gray-50/50 group/day"
               :class="{ 'opacity-30': !d.isCurrentMonth, 'bg-blue-50/30': d.isToday }"
             >
               <div class="flex justify-between items-center mb-1">
                 <span class="text-xs font-bold" :class="{ 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg shadow-blue-600/30': d.isToday }">{{ d.date.getDate() }}</span>
                 <span v-if="d.appointments.length" class="text-base font-bold text-gray-600 group-hover/day:text-gray-400">{{ d.appointments.length }}</span>
               </div>
               <div class="flex flex-col gap-1">
                <div 
                  v-for="apt in d.appointments.slice(0, 4)" :key="apt.id" 
                  class="px-2 py-1 rounded text-base truncate font-bold flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer" 
                  :style="{ backgroundColor: apt.color + '15', color: apt.color, borderLeft: '2px solid ' + apt.color }"
                  @click.stop="$emit('select-appointment', apt)"
                >
                  <span class="opacity-60">{{ apt.startTime }}</span> {{ apt.clientName }}
                </div>
                <div v-if="d.appointments.length > 4" class="text-base text-gray-600 font-bold pl-1 hover:text-gray-400 cursor-default">+{{ d.appointments.length - 4 }} more</div>
               </div>
             </div>
           </div>
        </div>

        <!-- Day/3-Day/Week Grid View -->
        <div v-else class="flex flex-col min-w-full h-full bg-white">
           <!-- Headers -->
           <div class="flex sticky top-0 z-[40] bg-white border-b border-gray-100 pl-16">
              <div 
                v-for="day in visibleDays" :key="day.getTime()"
                class="flex-1 min-w-[200px] border-r border-gray-100 py-3 flex flex-col items-center gap-0.5"
                :class="{ 'bg-blue-50/30': isToday(day) }"
              >
                <span class="text-base font-black text-gray-400 uppercase tracking-widest">{{ formatDayOfWeek(day) }} {{ day.getDate() }} {{ formatMonthShort(day) }}</span>
              </div>
           </div>

           <div class="flex relative flex-grow overflow-visible">
              <!-- Time Sidebar -->
              <div class="w-16 flex-shrink-0 bg-white border-r border-gray-100 z-30">
                <div v-for="hour in 24" :key="hour-1" class="h-24 border-b border-gray-100/50 relative px-2">
                  <span class="text-xl font-black text-gray-400 absolute top-[-7px] leading-none uppercase tracking-tighter">
                    {{ formatHour(hour - 1) }}
                  </span>
                </div>
              </div>

              <!-- Content Columns -->
              <div class="flex flex-grow relative overflow-visible h-fit min-h-full">
                 <!-- Background Lines -->
                 <div class="absolute inset-0 z-0 pointer-events-none">
                    <div v-for="hour in 24" :key="hour-1" class="h-24 border-b border-gray-100/50 relative">
                       <div class="absolute top-1/2 left-0 right-0 border-t border-gray-100/10"></div>
                    </div>
                 </div>

                 <!-- Columns -->
                  <div 
                    v-for="day in visibleDays" :key="day.getTime()"
                    class="flex-1 min-w-[200px] border-r border-gray-100 relative h-[2304px]"
                    :class="{ 'bg-blue-50/[0.05]': isToday(day) }"
                  >
                    <!-- Current Time Line -->
                    <div 
                      v-if="isToday(day)"
                      class="absolute left-0 right-0 z-[45] pointer-events-none flex items-center"
                      :style="{ top: currentTimeOffsetInGrid + 'px' }"
                    >
                      <div class="w-2.5 h-2.5 rounded-full bg-[#EF4444] ml-[-5px] shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                      <div class="h-[1.5px] flex-grow bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    </div>

                    <!-- Appointments -->
                    <div 
                      v-for="apt in getAppointmentsForDay(day)" :key="apt.id"
                      class="appointment-card absolute p-3 rounded-xl border-l-[3.5px] cursor-pointer transition-all z-20 hover:z-[40] animate-in fade-in slide-in-from-top-1 duration-200"
                      :style="getAppointmentStyle(apt)"
                      @click.stop="$emit('select-appointment', apt)"
                    >
                      <div class="flex justify-between items-start mb-1 text-[11px] font-black tracking-tight flex-wrap gap-1">
                        <span class="opacity-80">{{ apt.startTime }} - {{ apt.endTime }}</span>
                        <div class="flex items-center gap-1">
                           <span class="opacity-40 uppercase text-[9px]">{{ apt.status }}</span>
                           <Tag :size="10" class="opacity-40" />
                        </div>
                      </div>
                      <div class="text-[12px] font-black truncate text-gray-900 mb-0.5 uppercase tracking-wide">{{ apt.clientName }}</div>
                      <div class="text-[11px] font-bold opacity-80 leading-tight flex items-center gap-1.5 mt-1 text-gray-700">
                        <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: apt.color }"></span>
                        <span class="truncate">{{ apt.serviceName }}</span>
                      </div>
                    </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  SlidersHorizontal,
  Settings,
  CalendarDays,
  RotateCw,
  Calendar,
  LayoutGrid,
  Columns as Columns2, // Correcting name based on common Lucide imports
  Target,
  Tag,
  Clock,
  User,
  MoreVertical,
  Maximize2,
  Minimize2
} from 'lucide-vue-next'

const props = defineProps({
  appointments: {
    type: Array as () => any[],
    default: () => []
  },
  isMaximized: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Date,
    default: () => new Date()
  }
})

const emit = defineEmits(['select-appointment', 'update:modelValue', 'toggle-maximize'])

// State
const currentDate = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const currentView = ref('day') // day, 3day, week, month
const isDatePickerOpen = ref(false)
const isViewSelectorOpen = ref(false)
const currentTime = ref(new Date())
const mainScroll = ref<HTMLElement | null>(null)

// Views configuration
const views = [
  { id: 'day', label: 'Day view', icon: Calendar },
  { id: '3day', label: '3 day view', icon: Columns2 },
  { id: 'week', label: 'Week view', icon: LayoutGrid },
  { id: 'month', label: 'Month view', icon: Target },
]

const currentViewLabel = computed(() => views.find(v => v.id === currentView.value)?.label || 'View')

// Logic for visible days
const visibleDays = computed(() => {
  const days = []
  const start = new Date(currentDate.value)
  start.setHours(0,0,0,0)
  
  if (currentView.value === 'day') {
    days.push(new Date(start))
  } else if (currentView.value === '3day') {
    for (let i = 0; i < 3; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
  } else if (currentView.value === 'week') {
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(start)
    monday.setDate(diff)
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      days.push(d)
    }
  }
  return days
})

// Month View Data
const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  
  // Start from the last Monday
  let start = new Date(firstDay)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  start.setDate(diff)
  
  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push({
      date: d,
      isCurrentMonth: d.getMonth() === month,
      isToday: isToday(d),
      appointments: getAppointmentsForDay(d)
    })
  }
  return days
})

// Date picker shortcuts
const dateShortcuts = [
  { label: 'In 1 week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
  { label: 'In 3 weeks', days: 21 },
  { label: 'In 4 weeks', days: 28 },
  { label: 'In 5 weeks', days: 35 },
]

// Formatting helpers
const formattedCurrentRange = computed(() => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  if (currentView.value === 'day') {
    return currentDate.value.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'short' })
  }
  const end = new Date(visibleDays.value[visibleDays.value.length - 1])
  if (visibleDays.value[0].getMonth() === end.getMonth()) {
    return `${visibleDays.value[0].getDate()} - ${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'short' })}`
  }
  return `${visibleDays.value[0].toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
})

const formatHour = (h: number) => h.toString().padStart(2, '0') + ':00'
const formatDayOfWeek = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short' })
const formatMonthShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' })
const isToday = (d: Date) => {
  const today = new Date()
  return d.getDate() === today.getDate() && 
         d.getMonth() === today.getMonth() && 
         d.getFullYear() === today.getFullYear()
}

// Appointment Logic
const getLocalYMD = (d: Date) => {
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - (offset * 60 * 1000))
  return local.toISOString().split('T')[0]
}

const getAppointmentsForDay = (day: Date) => {
  const dateStr = getLocalYMD(day)
  const dayAppointments = props.appointments.filter(a => {
    // Try to find a matching date string
    const aptDateRaw = a.selectedDate || a.appointmentDetails?.date || ''
    const aptDate = aptDateRaw.includes('T') ? aptDateRaw.split('T')[0] : aptDateRaw
    return aptDate === dateStr
  })

  // Group by time to handle overlaps
  const processed = dayAppointments.map(a => {
     const startTime = a.selectedTime || a.appointmentDetails?.startTime || '09:00'
     const [h, m] = startTime.split(':').map(Number)
     const duration = (a.totalDuration?.hours || 1) * 60 + (a.totalDuration?.minutes || 30)
     const endH = h + Math.floor((m + duration) / 60)
     const endM = (m + duration) % 60
     
     return {
        id: a.id || a._id,
        clientName: (a.clientId?.profile?.firstName && a.clientId?.profile?.lastName) 
          ? `${a.clientId.profile.firstName} ${a.clientId.profile.lastName}` : (a.customerName || a.customer?.fullName || 'Client'),
        serviceName: a.selectedServices?.[0]?.serviceName || a.serviceDetails?.serviceName || 'Service',
        startTime,
        endTime: formatTime(endH, endM),
        startMinutes: h * 60 + m,
        duration,
        color: getStatusColor(a.status),
        status: a.status || 'pending',
        ...a
     }
  })

  // Simple overlap detection (could be more advanced)
  processed.sort((a, b) => a.startMinutes - b.startMinutes)
  
  return processed.map((apt, idx) => {
     // Check how many overlap with this one
     const overlaps = processed.filter(other => 
       other.id !== apt.id && 
       ((other.startMinutes >= apt.startMinutes && other.startMinutes < apt.startMinutes + apt.duration) ||
        (apt.startMinutes >= other.startMinutes && apt.startMinutes < other.startMinutes + other.duration))
     )
     
     const widthPercent = 100 / (overlaps.length + 1)
     const myIdx = processed.findIndex(a => a.id === apt.id) // This is not correct for nested width, but okay for MVP
     
     return {
        ...apt,
        startOffset: (apt.startMinutes / 60) * 96, // 96px per hour
        height: (apt.duration / 60) * 96,
        width: 100 - (idx % 2 === 0 ? 0 : 20), // Placeholder logic for offset
        left: (idx % 2 === 0 ? 0 : 5) 
     }
  })
}

const formatTime = (h: number, m: number) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`

const getAppointmentStyle = (apt: any) => ({
  top: apt.startOffset + 'px',
  height: apt.height + 'px',
  backgroundColor: apt.color + '25', // More transparent background
  borderColor: apt.color,
  color: apt.color,
  width: `calc(${apt.width}% - 12px)`,
  left: `${apt.left}%`
})

const getStatusColor = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'confirmed': return '#3B82F6' // Blue-500
    case 'completed': return '#10B981' // Emerald-500
    case 'pending': return '#F59E0B'   // Amber-500
    case 'cancelled': return '#EF4444' // Red-500
    default: return '#8B5CF6'          // Violet-500
  }
}

// Navigation Actions
const goToToday = () => {
  currentDate.value = new Date()
  emit('update-date', currentDate.value)
  scrollToCurrentTime()
}

const navigate = (dir: number) => {
  const newDate = new Date(currentDate.value)
  if (currentView.value === 'day') newDate.setDate(newDate.getDate() + dir)
  else if (currentView.value === '3day') newDate.setDate(newDate.getDate() + dir * 3)
  else if (currentView.value === 'week') newDate.setDate(newDate.getDate() + dir * 7)
  else if (currentView.value === 'month') newDate.setMonth(newDate.getMonth() + dir)
  currentDate.value = newDate
}

const setView = (v: string) => {
  currentView.value = v
  isViewSelectorOpen.value = false
  if (v !== 'month') {
    nextTick(scrollToCurrentTime)
  }
}

const toggleDatePicker = () => {
  isDatePickerOpen.value = !isDatePickerOpen.value
}

const selectDate = (date: Date) => {
  currentDate.value = date
  isDatePickerOpen.value = false
  emit('update-date', date)
}

const useShortcut = (shortcut: any) => {
  const d = new Date()
  d.setDate(d.getDate() + shortcut.days)
  selectDate(d)
}

const scrollToCurrentTime = () => {
  if (mainScroll.value && currentView.value !== 'month') {
    const h = new Date().getHours()
    const offset = Math.max(0, (h - 2) * 96) // Scroll to 2 hours before current time
    mainScroll.value.scrollTop = offset
  }
}

// Real-time updates
let timer: any
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)
  nextTick(scrollToToday)
})

const scrollToToday = () => {
  if (currentView.value !== 'month') {
    scrollToCurrentTime()
  }
}

onUnmounted(() => {
  clearInterval(timer)
})

const currentTimeOffsetInGrid = computed(() => {
  const h = currentTime.value.getHours()
  const m = currentTime.value.getMinutes()
  return (h * 60 + m) * (96 / 60)
})

// Directives
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      // Check if click was outside element AND its descendants
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    // Use capture phase to ensure it works even if other elements prevent propagation
    document.addEventListener('click', el.clickOutsideEvent, true)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent, true)
  },
}
</script>

<script lang="ts">
// Internal DatePickerPanel Component for cleaner logic
const DatePickerPanel = {
  props: ['monthOffset', 'currentDate'],
  emits: ['select'],
  template: `
    <div class="flex-1 select-none">
      <div class="flex items-center justify-center mb-6">
        <h4 class="font-black text-[13px] uppercase tracking-widest text-gray-900">{{ monthName }} {{ year }}</h4>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <div v-for="d in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="d" class="text-base font-black text-gray-400 text-center py-2">{{ d }}</div>
        <button 
          v-for="day in days" :key="day.getTime()"
          @click="$emit('select', day)"
          class="w-10 h-10 flex items-center justify-center rounded-xl text-[12px] font-bold transition-all hover:bg-gray-50 relative"
          :class="{
            'text-gray-300 pointer-events-none': !isSameMonth(day),
            'text-gray-700': isSameMonth(day) && !isToday(day) && !isSelected(day),
            'bg-[#005967] text-white shadow-lg shadow-[#005967]/30': isToday(day),
            'ring-2 ring-[#005967]/50 text-[#005967]': isSelected(day) && !isToday(day)
          }"
        >
          {{ day.getDate() }}
          <div v-if="hasAppointments(day) && !isToday(day) && !isSelected(day)" class="absolute bottom-1.5 w-1 h-1 rounded-full bg-gray-300"></div>
        </button>
      </div>
    </div>
  `,
  setup(props, { emit }) {
    const targetDate = computed(() => {
      const d = new Date(props.currentDate)
      d.setMonth(d.getMonth() + props.monthOffset)
      return d
    })
    
    const monthName = computed(() => targetDate.value.toLocaleDateString('en-US', { month: 'long' }))
    const year = computed(() => targetDate.value.getFullYear())
    
    const days = computed(() => {
      const startOfMo = new Date(targetDate.value.getFullYear(), targetDate.value.getMonth(), 1)
      let day = startOfMo.getDay()
      let diff = startOfMo.getDate() - day + (day === 0 ? -6 : 1)
      const start = new Date(startOfMo)
      start.setDate(diff)
      
      const result = []
      for (let i = 0; i < 35; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        result.push(d)
      }
      return result
    })
    
    const isSameMonth = (d: Date) => d.getMonth() === targetDate.value.getMonth()
    const isToday = (d: Date) => {
      const today = new Date()
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    }
    const isSelected = (d: Date) => {
      return d.getDate() === props.currentDate.getDate() && 
             d.getMonth() === props.currentDate.getMonth() && 
             d.getFullYear() === props.currentDate.getFullYear()
    }
    const hasAppointments = (d: Date) => false // Would need inject/props, but for visual it's fine
    
    return { monthName, year, days, isSameMonth, isToday, isSelected, hasAppointments }
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #E4E4E5;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.appointment-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}
.appointment-card:hover {
  filter: brightness(1.2);
  transform: scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

header {
  backdrop-filter: blur(10px);
}
</style>
