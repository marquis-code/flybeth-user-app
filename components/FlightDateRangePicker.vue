<template>
  <div class="relative w-full h-full" ref="pickerRef">

    <!-- ── Trigger ── -->
    <div
      @mousedown.prevent="toggleCalendar"
      class="w-full px-4 pt-3 pb-2 cursor-pointer min-h-[68px] flex flex-col justify-center group select-none transition-all rounded-xl"
      :class="showCalendar ? 'bg-blue-50/30 ring-2 ring-gray-900/5' : 'hover:bg-gray-50/60'"
    >
      <p 
        class="text-[10px] font-bold tracking-[0.05em] mb-0.5 transition-colors uppercase"
        :class="showCalendar ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'"
      >
        {{ mode === 'oneway' ? 'Departure' : 'Check-in – Check-out' }}
      </p>
      
      <div class="flex items-center gap-2">
        <CalendarDaysIcon class="h-4 w-4 shrink-0 transition-colors" :class="showCalendar ? 'text-gray-900' : 'text-gray-300'" />
        <div class="flex items-baseline gap-1.5 min-w-0">
          <template v-if="mode === 'oneway'">
            <span class="text-[14px] font-bold truncate" :class="startDate ? 'text-gray-900' : 'text-gray-400'">
              {{ startDate ? formatDisplayCompact(startDate) : 'Select date' }}
            </span>
          </template>
          <template v-else>
            <span class="text-[14px] font-bold truncate" :class="startDate ? 'text-gray-900' : 'text-gray-400'">
              {{ startDate ? formatDisplayCompact(startDate) : 'Check-in' }}
            </span>
            <span class="text-gray-300 font-bold mx-0.5 text-[10px]">–</span>
            <span class="text-[14px] font-bold truncate" :class="endDate ? 'text-gray-900' : 'text-gray-400'">
              {{ endDate ? formatDisplayCompact(endDate) : 'Check-out' }}
            </span>
          </template>
        </div>
      </div>

      <p v-if="startDate && endDate && mode !== 'oneway' && !showCalendar" class="text-[10px] text-gray-400 font-medium mt-0.5">
        {{ nightCount }} night{{ nightCount !== 1 ? 's' : '' }}
      </p>
    </div>

    <!-- ── Calendar Dropdown Panel ── -->
    <Transition name="loc-drop">
      <div
        v-show="showCalendar"
        class="absolute left-0 top-[calc(100%+6px)] z-[2000] bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col"
        :class="[isMobile ? 'fixed inset-x-4 top-1/2 -translate-y-1/2 w-auto' : 'w-[520px]']"
        style="background-color: #ffffff !important;"
        @mousedown.stop
      >
        <!-- Month nav header -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-50/50">
          <button
            @click="prevMonth"
            :disabled="isAtMinMonth"
            class="h-8 w-8 rounded-lg border border-gray-100 flex items-center justify-center transition-all"
            :class="isAtMinMonth ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95'"
          >
            <ChevronLeftIcon class="h-4 w-4 text-gray-500" />
          </button>

          <div class="flex-1 flex items-center justify-center gap-4 text-center">
            <p class="text-[13px] font-bold text-gray-900">{{ monthName(currentYear, currentMonth) }}</p>
            <p v-if="!isMobile" class="text-[13px] font-bold text-gray-900">{{ monthName(nextMonthYear, nextMonthIndex) }}</p>
          </div>

          <button
            @click="nextMonth"
            class="h-8 w-8 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
          >
            <ChevronRightIcon class="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <!-- Two-month grid (Compact) -->
        <div class="overflow-y-auto px-4 py-4 grid gap-8" :class="isMobile ? 'grid-cols-1' : 'grid-cols-2'">
          <!-- Month grid (Reuseable template) -->
          <div v-for="(cells, mIdx) in [leftCells, rightCells].slice(0, isMobile ? 1 : 2)" :key="mIdx">
            <div class="grid grid-cols-7 mb-2">
              <div v-for="d in dayHeaders" :key="d" class="text-center text-[9px] font-black text-gray-300 uppercase tracking-widest py-1">{{ d }}</div>
            </div>
            <div class="grid grid-cols-7">
              <template v-for="(cell, i) in cells" :key="i">
                <div v-if="cell === null" class="h-8" />
                <div
                  v-else
                  class="flex items-center justify-center h-8 relative"
                  :class="rangeWrapClass(cell)"
                  @mouseover="!isPast(cell) && (hoverDate = cell)"
                  @mouseleave="hoverDate = null"
                  @click="selectDate(cell)"
                >
                  <span
                    class="h-8 w-8 flex items-center justify-center rounded-lg text-[12px] font-bold transition-all duration-75"
                    :class="dayClass(cell)"
                  >{{ cellDay(cell) }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between gap-4 px-5 py-4 border-t border-gray-50 bg-gray-50/30">
          <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <span v-if="!startDate">Select Date</span>
            <span v-else-if="mode !== 'oneway' && !endDate">Select Return</span>
            <span v-else class="text-gray-900">{{ mode === 'oneway' ? 'Confirmed' : nightCount + ' Nights' }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button v-if="startDate" @click="clearDates" class="text-[11px] font-bold text-gray-400 hover:text-gray-900 px-3 py-2 transition-colors">Clear</button>
            <button @click="closeCalendar" class="px-5 py-2 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95">Done</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  departure: { type: String, default: '' },
  return:    { type: String, default: '' },
  mode:      { type: String as () => 'oneway' | 'roundtrip', default: 'roundtrip' },
})

const emit = defineEmits(['update:departure', 'update:return', 'focus', 'close'])

const pickerRef    = ref<HTMLElement | null>(null)
const showCalendar = ref(false)
const hoverDate    = ref<string | null>(null)
const isMobile     = ref(false)

const _today = new Date()
_today.setHours(0, 0, 0, 0)
const todayStr = toISO(_today)

const startDate = ref<string | null>(props.departure || null)
const endDate   = ref<string | null>(props.return    || null)

const currentMonth = ref(_today.getMonth())
const currentYear  = ref(_today.getFullYear())

const nextMonthIndex = computed(() => (currentMonth.value + 1) % 12)
const nextMonthYear  = computed(() => currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value)
const leftCells  = computed(() => buildCells(currentYear.value, currentMonth.value))
const rightCells = computed(() => buildCells(nextMonthYear.value, nextMonthIndex.value))

const nightCount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  return Math.round((new Date(endDate.value).getTime() - new Date(startDate.value).getTime()) / 86_400_000)
})

const isAtMinMonth = computed(() => currentYear.value === _today.getFullYear() && currentMonth.value === _today.getMonth())

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function buildCells(year: number, month: number): (string | null)[] {
  const firstDay  = new Date(year, month, 1).getDay()
  const daysCount = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysCount; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return cells
}

const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function monthName(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
}

function formatDisplayCompact(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function cellDay(iso: string): string { return String(parseInt(iso.split('-')[2] || '0', 10)) }
function isPast(iso: string): boolean { return iso < todayStr }

function effectiveEnd(): string | null {
  if (props.mode === 'oneway') return null
  if (endDate.value) return endDate.value
  if (startDate.value && hoverDate.value && hoverDate.value > startDate.value) return hoverDate.value
  return null
}

function isStartDay(iso: string): boolean { return !!startDate.value && iso === startDate.value }
function isEndDay(iso: string): boolean { return !!endDate.value && iso === endDate.value }
function inRange(iso: string): boolean {
  const end = effectiveEnd()
  if (!startDate.value || !end) return false
  return iso > startDate.value && iso < end
}

function rangeWrapClass(iso: string): string {
  if (isPast(iso)) return 'cursor-not-allowed opacity-30'
  const s = isStartDay(iso), e = isEndDay(iso), end = effectiveEnd(), inR = inRange(iso)
  if (s && end && iso < end) return 'bg-gray-100 rounded-l-lg'
  if ((e || (end && iso === end && !s)) && startDate.value && iso > startDate.value) return 'bg-gray-100 rounded-r-lg'
  if (inR) return 'bg-gray-100'
  return ''
}

function dayClass(iso: string): string {
  if (isPast(iso)) return 'text-gray-300'
  if (isStartDay(iso) || isEndDay(iso)) return 'bg-gray-900 text-white shadow-sm'
  if (inRange(iso)) return 'text-gray-900'
  if (iso === todayStr) return 'text-blue-600 border border-blue-100'
  return 'text-gray-600 hover:bg-gray-50'
}

function selectDate(iso: string) {
  if (isPast(iso)) return
  if (props.mode === 'oneway') {
    startDate.value = iso; endDate.value = null
    emit('update:departure', iso); closeCalendar(); return
  }
  if (!startDate.value || (startDate.value && endDate.value) || iso < startDate.value) {
    startDate.value = iso; endDate.value = null; hoverDate.value = null
    emit('update:departure', iso); emit('update:return', ''); return
  }
  if (iso === startDate.value) {
    startDate.value = null; endDate.value = null
    emit('update:departure', ''); emit('update:return', ''); return
  }
  endDate.value = iso
  emit('update:departure', startDate.value); emit('update:return', iso)
  setTimeout(() => closeCalendar(), 150)
}

function prevMonth() {
  if (isAtMinMonth.value) return
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

const toggleCalendar = () => { if (showCalendar.value) closeCalendar(); else openCalendar() }
function openCalendar() { showCalendar.value = true; emit('focus') }
function closeCalendar() { showCalendar.value = false; hoverDate.value = null; emit('close') }
function clearDates() { startDate.value = null; endDate.value = null; hoverDate.value = null; emit('update:departure', ''); emit('update:return', '') }

const handleClickOutside = (e: MouseEvent) => { if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) closeCalendar() }
watch(() => props.departure, v => { startDate.value = v || null })
watch(() => props.return,    v => { endDate.value   = v || null })
const checkMobile = () => { isMobile.value = window.innerWidth < 768 }

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('mousedown', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.loc-drop-enter-active, .loc-drop-leave-active {
  transition: all 0.1s ease-out;
}
.loc-drop-enter-from, .loc-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
" ,Description: