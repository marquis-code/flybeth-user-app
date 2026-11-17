<template>
  <div class="relative w-full h-full" ref="pickerRef">

    <!-- ── Trigger ── -->
    <div
      @click="toggleCalendar"
      class="w-full cursor-pointer min-h-[48px] flex flex-row items-stretch group select-none transition-all rounded-lg"
      :class="showCalendar
        ? (isCo ? 'bg-[#EAF2FB]/60 ring-2 ring-[#0450A0]/20' : 'bg-blue-50/30 ring-2 ring-gray-200')
        : 'hover:bg-white/60'"
    >
      <template v-if="mode === 'oneway'">
        <div class="flex-1 px-3.5 py-1.5 flex flex-col justify-center text-left">
          <p class="text-[11px] font-bold text-gray-500 mb-0 transition-colors uppercase tracking-wider" :class="showCalendar ? 'text-black' : 'text-gray-500 group-hover:text-black'">
            {{ departureLabel }}
          </p>
          <div class="flex items-baseline gap-1.5 min-w-0">
            <span class="text-[13px] font-bold text-black leading-tight truncate">
              {{ startDate ? formatDisplayCompact(startDate) : 'Select date' }}
            </span>
            <span class="text-xs text-gray-500 font-bold shrink-0" v-if="startDate">
              ({{ formatDayOfWeek(startDate) }})
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- Two halves for Check-in and Check-out -->
        <div class="flex-1 px-3.5 py-1.5 flex flex-col justify-center text-left">
          <p class="text-[11px] font-bold text-gray-500 mb-0 transition-colors uppercase tracking-wider" :class="showCalendar ? 'text-black' : 'text-gray-500 group-hover:text-black'">
            {{ departureLabel }}
          </p>
          <div class="flex items-baseline gap-1.5 min-w-0">
            <span class="text-[13px] font-bold text-black leading-tight truncate">
              {{ startDate ? formatDisplayCompact(startDate) : 'Select date' }}
            </span>
            <span class="text-xs text-gray-500 font-bold shrink-0" v-if="startDate">
              ({{ formatDayOfWeek(startDate) }})
            </span>
          </div>
        </div>
        
        <div class="w-[1px] bg-[#D1D5DB] my-2 flex-shrink-0"></div>
        
        <div class="flex-1 px-3.5 py-1.5 flex flex-col justify-center text-left">
          <p class="text-[11px] font-bold text-gray-500 mb-0 transition-colors uppercase tracking-wider" :class="showCalendar ? 'text-black' : 'text-gray-500 group-hover:text-black'">
            {{ returnLabel }}
          </p>
          <div class="flex items-baseline gap-1.5 min-w-0">
            <span class="text-[13px] font-bold text-black leading-tight truncate">
              {{ endDate ? formatDisplayCompact(endDate) : 'Select date' }}
            </span>
            <span class="text-xs text-gray-500 font-bold shrink-0" v-if="endDate">
              ({{ formatDayOfWeek(endDate) }})
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- ── Calendar Dropdown Panel ── -->
    <Teleport to="body" :disabled="!isMobile">
      <Transition name="loc-drop">
        <div
          ref="dropdownRef"
          v-show="showCalendar"
          class="z-[100000] bg-white border shadow-2xl overflow-hidden flex flex-col"
          :class="[
            isCo ? 'border-[#DBE2EA]' : 'border-gray-200',
            isMobile
              ? 'fixed inset-0 rounded-none w-full h-[100dvh] pt-4'
              : (isCo ? 'absolute left-0 top-[calc(100%+6px)] w-[520px] rounded-lg' : 'absolute left-0 top-[calc(100%+6px)] w-[520px] rounded-2xl'),
          ]"
          style="background-color: #ffffff !important;"
      >
        <!-- Mobile Header with Close Button -->
        <div v-if="isMobile" class="flex items-center justify-between px-4 pb-3 mb-2 border-b border-gray-100 shrink-0">
          <h3 class="text-base font-bold text-black">{{ mode === 'oneway' ? 'Departure' : 'Check-in – Check-out' }}</h3>
          <button @click="closeCalendar" class="p-2 -mr-2 text-black hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto flex flex-col">
        <!-- Month nav header -->
        <div class="flex items-center justify-between px-4 py-4 border-b shrink-0" :class="isCo ? 'border-[#E6EBF2]' : 'border-gray-200'">
          <button
            @click="prevMonth"
            :disabled="isAtMinMonth"
            class="h-8 w-8 border flex items-center justify-center transition-all"
            :class="[
              isCo ? 'rounded-md border-[#DBE2EA]' : 'rounded-lg border-gray-200',
              isAtMinMonth ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white active:scale-95',
            ]"
          >
            <ChevronLeftIcon class="h-4 w-4" :class="isCo ? 'text-[#0450A0]' : 'text-black'" />
          </button>

          <div class="flex-1 flex items-center justify-center gap-4 text-center">
            <p class="text-[13px] font-bold" :class="isCo ? 'text-[#0B1B33]' : 'text-black'">{{ monthName(currentYear, currentMonth) }}</p>
            <p v-if="!isMobile" class="text-[13px] font-bold" :class="isCo ? 'text-[#0B1B33]' : 'text-black'">{{ monthName(nextMonthYear, nextMonthIndex) }}</p>
          </div>

          <button
            @click="nextMonth"
            class="h-8 w-8 border flex items-center justify-center hover:bg-white active:scale-95 transition-all"
            :class="isCo ? 'rounded-md border-[#DBE2EA]' : 'rounded-lg border-gray-200'"
          >
            <ChevronRightIcon class="h-4 w-4" :class="isCo ? 'text-[#0450A0]' : 'text-black'" />
          </button>
        </div>

        <!-- Two-month grid (Compact) -->
        <div class="overflow-y-auto px-4 py-4 grid gap-8" :class="isMobile ? 'grid-cols-1' : 'grid-cols-2'">
          <!-- Month grid (Reuseable template) -->
          <div v-for="(cells, mIdx) in [leftCells, rightCells].slice(0, isMobile ? 1 : 2)" :key="mIdx">
            <div class="grid grid-cols-7 mb-2">
              <div
                v-for="d in dayHeaders"
                :key="d"
                class="text-center text-[10px] font-bold py-1"
                :class="isCo ? 'uppercase tracking-[0.08em] text-[#8A97A8]' : 'text-gray-500'"
              >{{ d }}</div>
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
                    class="h-8 w-8 flex items-center justify-center text-[12px] font-bold transition-all duration-75"
                    :class="[isCo ? 'rounded-full' : 'rounded-lg', dayClass(cell)]"
                  >{{ cellDay(cell) }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between gap-4 px-5 py-4 border-t shrink-0" :class="isCo ? 'border-[#E6EBF2] bg-white' : 'border-gray-200 bg-white/30'">
          <div class="text-[11px] font-bold" :class="isCo ? 'text-[#5F7185]' : 'text-black'">
            <span v-if="!startDate">Select Date</span>
            <span v-else-if="mode !== 'oneway' && !endDate">Select Return</span>
            <span v-else :class="isCo ? 'text-[#0B1B33]' : 'text-black'">{{ mode === 'oneway' ? 'Confirmed' : nightCount + ' Nights' }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="startDate"
              @click="clearDates"
              class="text-[11px] font-bold px-3 py-2 transition-colors"
              :class="isCo ? 'text-[#0450A0] hover:text-[#03396F]' : 'text-black hover:text-black'"
            >Clear</button>
            <button
              @click="closeCalendar"
              class="px-5 py-2 text-white text-[12px] font-bold transition-all active:scale-95"
              :class="isCo ? 'bg-[#0D1DAD] hover:bg-[#081485] rounded-md' : 'bg-[#0D1DAD] hover:bg-[#081485] rounded-xl'"
            >Done</button>
          </div>
        </div>
        <!-- Flexible Dates Toggle -->
        <div class="px-5 py-3 border-t flex items-center gap-2 shrink-0" :class="isCo ? 'border-[#E6EBF2] bg-[#F4F7FB]' : 'border-gray-200 bg-gray-50'">
          <input type="checkbox" id="flexibleDates" v-model="isFlexible" @change="$emit('update:flexible', isFlexible)" class="w-4 h-4 rounded border-gray-300" :class="isCo ? 'accent-[#0450A0]' : 'text-blue-600'" />
          <label for="flexibleDates" class="text-xs font-bold cursor-pointer select-none" :class="isCo ? 'text-[#44546A]' : 'text-gray-700'">My dates are flexible (+/- 3 days) - Find cheaper prices</label>
        </div>
      </div>
      </Transition>
    </Teleport>

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
  flexible:  { type: Boolean, default: false },
  mode:      { type: String as () => 'oneway' | 'roundtrip', default: 'roundtrip' },
  departureLabel: { type: String, default: 'Departure' },
  returnLabel:    { type: String, default: 'Return' },
  // Default to 'cheapoair' to match the hero search widget theme.
  theme:     { type: String, default: 'cheapoair' },
})

const emit = defineEmits(['update:departure', 'update:return', 'update:flexible', 'focus', 'close'])

/** Cheapoair palette: brand blue for selection, action orange for the primary CTA. */
const isCo = computed(() => props.theme === 'cheapoair')

const pickerRef    = ref<HTMLElement | null>(null)
const dropdownRef  = ref<HTMLElement | null>(null)
const showCalendar = ref(false)
const hoverDate    = ref<string | null>(null)
const isFlexible   = ref(props.flexible)
const isMobile     = ref(false)

const _today = new Date()
_today.setHours(0, 0, 0, 0)
const todayStr = toISO(_today)

const startDate = ref<string | null>(props.departure || null)
const endDate   = ref<string | null>(props.return    || null)

watch(() => props.departure, (val) => { startDate.value = val || null })
watch(() => props.return, (val) => { endDate.value = val || null })

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

function formatDayOfWeek(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('en-US', { weekday: 'short' })
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

  const band = isCo.value ? 'bg-[#EAF2FB]' : 'bg-gray-100'
  let classes = 'cursor-pointer'
  if (s && end && iso < end) classes += ` ${band} rounded-l-full`
  else if ((e || (end && iso === end && !s)) && startDate.value && iso > startDate.value) classes += ` ${band} rounded-r-full`
  else if (inR) classes += ` ${band}`

  return classes
}

function dayClass(iso: string): string {
  if (isPast(iso)) return isCo.value ? 'text-[#B8C2CF]' : 'text-black'
  if (isStartDay(iso) || isEndDay(iso)) {
    return isCo.value
      ? 'bg-[#0450A0] text-white shadow-sm'
      : 'bg-black text-white shadow-sm'
  }
  if (inRange(iso)) return isCo.value ? 'text-[#0450A0]' : 'text-black'
  if (iso === todayStr) {
    return isCo.value
      ? 'text-[#0450A0] ring-1 ring-[#0450A0]/30'
      : 'text-blue-600 border border-blue-100'
  }
  return isCo.value ? 'text-[#0B1B33] hover:bg-[#EAF2FB]' : 'text-black hover:bg-white'
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

const handleClickOutside = (e: MouseEvent) => { 
  if (showCalendar.value) {
    const isOutsidePicker = pickerRef.value && !pickerRef.value.contains(e.target as Node)
    const isOutsideDropdown = dropdownRef.value && !dropdownRef.value.contains(e.target as Node)
    if (isOutsidePicker && isOutsideDropdown) {
      closeCalendar()
    }
  }
}
watch(() => props.departure, v => { startDate.value = v || null })
watch(() => props.return,    v => { endDate.value   = v || null })
watch(() => props.flexible,  v => { isFlexible.value = v })
const checkMobile = () => { isMobile.value = window.innerWidth < 768 }

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('click', handleClickOutside, true)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('click', handleClickOutside, true)
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