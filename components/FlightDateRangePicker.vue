<template>
  <div class="relative w-full" ref="pickerRef">

    <!-- ── Trigger ─────────────────────────────────────────────────────────── -->
    <div
      @click="openCalendar"
      class="w-full px-4 pt-3 pb-2 cursor-pointer min-h-[68px] flex flex-col justify-center group select-none whitespace-nowrap"
    >
      <p class="text-[11px] font-bold text-brand-gray/40 tracking-wide mb-0.5 group-hover:text-gray-900 transition-colors ">
        {{ mode === 'oneway' ? 'Departure date' : 'Check-in – Check-out' }}
      </p>
      <div class="flex items-center gap-2">
        <CalendarDaysIcon class="h-4 w-4 text-brand-blue/60 shrink-0" />
        <span class="text-sm font-semibold tracking-tight">
          <template v-if="mode === 'oneway'">
            <span :class="startDate ? 'text-gray-900' : 'text-gray-500'">
              {{ startDate ? formatDisplay(startDate) : 'Select date' }}
            </span>
          </template>
          <template v-else>
            <span :class="startDate ? 'text-gray-900' : 'text-gray-500'">
              {{ startDate ? formatDisplay(startDate) : 'Check-in' }}
            </span>
            <span class="text-gray-500 mx-1.5">–</span>
            <span :class="endDate ? 'text-gray-900' : 'text-gray-500'">
              {{ endDate ? formatDisplay(endDate) : 'Check-out' }}
            </span>
          </template>
        </span>
      </div>
      <p v-if="startDate && endDate && mode !== 'oneway'" class="text-[11px] text-gray-400 font-medium mt-0.5">
        {{ nightCount }} night{{ nightCount !== 1 ? 's' : '' }}
      </p>
    </div>

    <!-- ── Single Teleport: backdrop + card as SIBLINGS so backdrop-blur cannot bleed into the card ── -->
    <Teleport to="body">
      <Transition name="fade-overlay">
        <div v-if="showCalendar">

          <!-- Dark backdrop — z-[100010], click to dismiss -->
          <div
            class="fixed inset-0 z-[100010] bg-black/60 backdrop-blur-[4px]"
            @click="closeCalendar"
          />

          <!-- Calendar card — z-[100011], sibling of backdrop so blur cannot reach it -->
          <div
            :style="panelStyle"
            class="fixed z-[100011] bg-white overflow-hidden select-none transition-all duration-300 shadow-2xl flex flex-col"
            :class="[
              isMobile ? 'inset-0 w-full h-full rounded-none' : 'inset-x-0 w-[580px] rounded-2xl'
            ]"
            @click.stop
          >

            <!-- Mobile Header (Close/Back) -->
            <div v-if="isMobile" class="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-50 mb-2">
              <button @click="closeCalendar" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronLeftIcon class="h-6 w-6 text-gray-900" />
              </button>
              <div class="text-center">
                 <h2 class="text-base font-bold text-gray-900 leading-none">Select dates</h2>
                 <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-1 uppercase">{{ mode === 'oneway' ? 'One-way' : 'Round-trip' }}</p>
              </div>
              <div class="w-10"></div>
            </div>

            <!-- ── Month nav header ──────────────────────────────────────── -->
            <div class="flex items-center justify-between px-4 sm:px-6 py-4">
              <button
                @click="prevMonth"
                :disabled="isAtMinMonth"
                class="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center transition-colors"
                :class="isAtMinMonth ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'"
              >
                <ChevronLeftIcon v-if="!isMobile" class="h-4 w-4 text-gray-500" />
                <span v-else class="text-xs font-bold text-gray-500">Prev</span>
              </button>

              <div class="flex-1 grid gap-4 text-center" :class="isMobile ? 'grid-cols-1' : 'grid-cols-2'">
                <p class="text-base font-bold text-gray-900">{{ monthName(currentYear, currentMonth) }}</p>
                <p v-if="!isMobile" class="text-base font-bold text-gray-900">{{ monthName(nextMonthYear, nextMonthIndex) }}</p>
              </div>

              <button
                @click="nextMonth"
                class="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRightIcon v-if="!isMobile" class="h-4 w-4 text-gray-500" />
                <span v-else class="text-xs font-bold text-gray-500">Next</span>
              </button>
            </div>

            <!-- ── Two-month grid ────────────────────────────────────────── -->
            <div class="flex-1 overflow-y-auto px-4 pb-4 grid gap-0" :class="isMobile ? 'grid-cols-1' : 'grid-cols-2'">

              <!-- Left month -->
              <div :class="!isMobile ? 'pr-4 border-r border-gray-100' : ''">
                <div class="grid grid-cols-7 mb-2">
                  <div
                    v-for="d in dayHeaders" :key="`lh-${d}`"
                    class="text-center text-[11px] font-bold text-gray-400 py-1"
                  >{{ d }}</div>
                </div>
                <div class="grid grid-cols-7">
                  <template v-for="(cell, i) in leftCells" :key="`l-${i}`">
                    <!-- Empty filler for offset -->
                    <div v-if="cell === null" class="h-9" />

                    <!-- Day wrapper (carries the range-strip bg) -->
                    <div
                      v-else
                      class="flex items-center justify-center h-9"
                      :class="rangeWrapClass(cell)"
                      @mouseover="!isPast(cell) && (hoverDate = cell)"
                      @mouseleave="hoverDate = null"
                      @click="selectDate(cell)"
                    >
                      <span
                        class="h-9 w-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-100"
                        :class="dayClass(cell)"
                      >{{ cellDay(cell) }}</span>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Right month (Hidden on mobile) -->
              <div v-if="!isMobile" class="pl-4">
                <div class="grid grid-cols-7 mb-2">
                  <div
                    v-for="d in dayHeaders" :key="`rh-${d}`"
                    class="text-center text-[11px] font-bold text-gray-400 py-1"
                  >{{ d }}</div>
                </div>
                <div class="grid grid-cols-7">
                  <template v-for="(cell, i) in rightCells" :key="`r-${i}`">
                    <div v-if="cell === null" class="h-9" />

                    <div
                      v-else
                      class="flex items-center justify-center h-9"
                      :class="rangeWrapClass(cell)"
                      @mouseover="!isPast(cell) && (hoverDate = cell)"
                      @mouseleave="hoverDate = null"
                      @click="selectDate(cell)"
                    >
                      <span
                        class="h-9 w-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-100"
                        :class="dayClass(cell)"
                      >{{ cellDay(cell) }}</span>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Extra month for mobile if they want to scroll more -->
              <div v-if="isMobile" class="mt-8">
                <div class="text-center mb-4">
                  <p class="text-base font-bold text-gray-900">{{ monthName(nextMonthYear, nextMonthIndex) }}</p>
                </div>
                <div class="grid grid-cols-7 mb-2">
                  <div
                    v-for="d in dayHeaders" :key="`mh-${d}`"
                    class="text-center text-[11px] font-bold text-gray-400 py-1"
                  >{{ d }}</div>
                </div>
                <div class="grid grid-cols-7">
                  <template v-for="(cell, i) in rightCells" :key="`m-${i}`">
                    <div v-if="cell === null" class="h-9" />
                    <div
                      v-else
                      class="flex items-center justify-center h-9"
                      :class="rangeWrapClass(cell)"
                      @mouseover="!isPast(cell) && (hoverDate = cell)"
                      @mouseleave="hoverDate = null"
                      @click="selectDate(cell)"
                    >
                      <span
                        class="h-9 w-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-100"
                        :class="dayClass(cell)"
                      >{{ cellDay(cell) }}</span>
                    </div>
                  </template>
                </div>
              </div>

            </div>

            <!-- ── Footer ────────────────────────────────────────────────── -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6 sm:py-4 border-t border-gray-100 bg-white sticky bottom-0">
              <div class="flex items-center gap-2 text-sm text-gray-500 font-medium text-center sm:text-left">
                <InformationCircleIcon class="h-4 w-4 shrink-0 hidden sm:block" />
                <span v-if="!startDate">
                  Select {{ mode === 'oneway' ? 'departure' : 'check-in' }}
                </span>
                <span v-else-if="mode !== 'oneway' && !endDate">
                  Select check-out
                </span>
                <span v-else class="text-gray-900 text-xs sm:text-sm font-bold">
                  {{ mode === 'oneway' ? formatDisplay(startDate) : `${formatDisplay(startDate)} – ${formatDisplay(endDate!)}` }}
                </span>
              </div>

              <div class="flex items-center gap-3 w-full sm:w-auto">
                <button
                  v-if="startDate"
                  @click="clearDates"
                  class="flex-1 sm:flex-none text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-700 px-3 py-3 sm:py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
                <button
                  @click="done"
                  :disabled="!startDate || (mode !== 'oneway' && !endDate)"
                  class="flex-[2] sm:flex-none px-6 sm:px-8 py-4 sm:py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-black transition-colors active:scale-95 shadow-sm"
                >
                  Confirm {{ mode === 'roundtrip' && startDate && endDate ? nightCount + ' nights' : '' }}
                </button>
              </div>
            </div>

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
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

// ── Props & Emits ─────────────────────────────────────────────────────────────
const props = defineProps({
  departure: { type: String, default: '' },
  return:    { type: String, default: '' },
  mode:      { type: String as () => 'oneway' | 'roundtrip', default: 'roundtrip' },
})

const emit = defineEmits<{
  'update:departure': [v: string]
  'update:return':    [v: string]
  focus: []
  close: []
}>()

// ── Refs ──────────────────────────────────────────────────────────────────────
const pickerRef    = ref<HTMLElement | null>(null)
const showCalendar = ref(false)
const panelStyle   = ref<Record<string, string>>({})
const hoverDate    = ref<string | null>(null)
const isMobile     = ref(false)

const checkMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) {
      panelStyle.value = {}
    }
  }
}

// Today as ISO string 'YYYY-MM-DD'
const _today = new Date()
_today.setHours(0, 0, 0, 0)
const todayStr = toISO(_today)

// Internal state (ISO strings)
const startDate = ref<string | null>(props.departure || null)
const endDate   = ref<string | null>(props.return    || null)

// Month navigation — starts at current month
const currentMonth = ref(_today.getMonth())
const currentYear  = ref(_today.getFullYear())

// ── Computed ──────────────────────────────────────────────────────────────────
const nextMonthIndex = computed(() => (currentMonth.value + 1) % 12)
const nextMonthYear  = computed(() =>
  currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value
)

const leftCells  = computed(() => buildCells(currentYear.value, currentMonth.value))
const rightCells = computed(() => buildCells(nextMonthYear.value, nextMonthIndex.value))

const nightCount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  return Math.round(
    (new Date(endDate.value).getTime() - new Date(startDate.value).getTime()) / 86_400_000
  )
})

const isAtMinMonth = computed(() =>
  currentYear.value === _today.getFullYear() && currentMonth.value === _today.getMonth()
)

// ── Pure helper functions ─────────────────────────────────────────────────────
function toISO(d: Date): string {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function buildCells(year: number, month: number): (string | null)[] {
  const firstDay  = new Date(year, month, 1).getDay()     // 0–6
  const daysCount = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysCount; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return cells
}

const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function monthName(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
}

function formatDisplay(iso: string): string {
  if (!iso) return ''
  const parts = iso.split('-').map(Number)
  if (parts.length !== 3) return ''
  const [y, m, d] = parts
  return new Date(y!, m! - 1, d!).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function cellDay(iso: string): string {
  const parts = iso.split('-')
  return String(parseInt(parts[2] || '0', 10))
}

function isPast(iso: string): boolean {
  return iso < todayStr
}

// ── Range / selection state helpers ──────────────────────────────────────────
function effectiveEnd(): string | null {
  if (props.mode === 'oneway') return null
  if (endDate.value) return endDate.value
  // Preview end via hover when user has picked start and is hovering a future date
  if (startDate.value && hoverDate.value && hoverDate.value > startDate.value) {
    return hoverDate.value
  }
  return null
}

function isStartDay(iso: string): boolean {
  return !!startDate.value && iso === startDate.value
}

function isEndDay(iso: string): boolean {
  return !!endDate.value && iso === endDate.value
}

function inRange(iso: string): boolean {
  if (props.mode === 'oneway') return false
  const end = effectiveEnd()
  if (!startDate.value || !end) return false
  return iso > startDate.value && iso < end
}

// ── CSS class builders ────────────────────────────────────────────────────────

/**
 * Wrapper div class — provides the blue-50 strip between start and end.
 * The wrapper is full-width within the grid cell so the strip is seamless.
 */
function rangeWrapClass(iso: string): string {
  if (isPast(iso)) return 'cursor-not-allowed'

  const s   = isStartDay(iso)
  const e   = isEndDay(iso)
  const end = effectiveEnd()
  const inR = inRange(iso)

  if (s && end && iso < end) {
    return 'bg-gray-100 rounded-l-full cursor-pointer'
  }
  if ((e || (end && iso === end && !s)) && startDate.value && iso > startDate.value) {
    return 'bg-gray-100 rounded-r-full cursor-pointer'
  }
  if (inR) {
    return 'bg-gray-100 cursor-pointer'
  }
  return 'cursor-pointer'
}

/**
 * Inner span class — the filled circle for selected, ring for today, etc.
 */
function dayClass(iso: string): string {
  if (isPast(iso)) return 'text-gray-200 cursor-not-allowed'

  if (isStartDay(iso) || isEndDay(iso)) {
    return 'bg-gray-900 text-white shadow-md'
  }
  if (inRange(iso)) {
    return 'text-gray-900 font-semibold hover:bg-gray-200'
  }
  if (iso === todayStr) {
    return 'text-gray-900 border-2 border-gray-900/30 hover:bg-gray-900 hover:text-white'
  }
  return 'text-gray-700 font-semibold hover:bg-gray-100 hover:text-gray-900'
}

// ── Date selection logic ──────────────────────────────────────────────────────
function selectDate(iso: string) {
  if (isPast(iso)) return

  if (props.mode === 'oneway') {
    startDate.value = iso
    endDate.value   = null
    emit('update:departure', iso)
    closeCalendar()
    return
  }

  // Roundtrip: two-click flow
  // Reset if: nothing selected yet, both already selected, or clicking before start
  if (!startDate.value || (startDate.value && endDate.value) || iso < startDate.value) {
    startDate.value = iso
    endDate.value   = null
    hoverDate.value = null
    emit('update:departure', iso)
    emit('update:return', '')
    return
  }

  // Clicking same date as start — treat as reset
  if (iso === startDate.value) {
    startDate.value = null
    endDate.value   = null
    emit('update:departure', '')
    emit('update:return', '')
    return
  }

  // Second click: confirm end date
  endDate.value = iso
  emit('update:departure', startDate.value)
  emit('update:return', iso)
  // Brief delay so the user sees the completed range, then close
  setTimeout(() => closeCalendar(), 200)
}

// ── Month navigation ──────────────────────────────────────────────────────────
function prevMonth() {
  if (isAtMinMonth.value) return
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

// ── Open / Close ──────────────────────────────────────────────────────────────
function updatePosition() {
  if (isMobile.value) return
  const el = pickerRef.value
  if (!el) return
  const rect       = el.getBoundingClientRect()
  const panelWidth = 580
  let   left       = rect.left
  if (left + panelWidth > window.innerWidth - 8) left = window.innerWidth - panelWidth - 8
  panelStyle.value = {
    top:  `${rect.bottom + 8}px`,
    left: `${Math.max(8, left)}px`,
  }
}

function openCalendar() {
  checkMobile()
  updatePosition()
  showCalendar.value = true
  emit('focus')
}

function closeCalendar() {
  showCalendar.value = false
  hoverDate.value    = null
  emit('close')
}

function clearDates() {
  startDate.value = null
  endDate.value   = null
  hoverDate.value = null
  emit('update:departure', '')
  emit('update:return', '')
}

function done() {
  emit('update:departure', startDate.value ?? '')
  if (props.mode !== 'oneway') emit('update:return', endDate.value ?? '')
  closeCalendar()
}

// ── Sync external prop changes ────────────────────────────────────────────────
watch(() => props.departure, v => { startDate.value = v || null })
watch(() => props.return,    v => { endDate.value   = v || null })

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(()  => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('scroll', updatePosition, true)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', updatePosition, true)
})
</script>

<style scoped>
/*
  Transition targets the wrapper <div v-if="showCalendar">.
  Backdrop (z-[10010]) and card (z-[10011]) are siblings — backdrop-blur
  is isolated to the backdrop element and cannot bleed into the card.
*/
.fade-overlay-enter-active {
  transition: opacity 0.2s ease;
}
.fade-overlay-leave-active {
  transition: opacity 0.18s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* Card slide up on mobile, pop on desktop */
.fade-overlay-enter-active .fixed.z-\[10011\] {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.fade-overlay-enter-from .fixed.z-\[10011\] {
  transform: translateY(100%);
  opacity: 0;
}
@media (min-width: 768px) {
  .fade-overlay-enter-from .fixed.z-\[10011\] {
    transform: translateY(-10px) scale(0.97);
    opacity: 0;
  }
}
</style>