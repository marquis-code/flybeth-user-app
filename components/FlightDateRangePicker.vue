<template>
  <div class="relative w-full" ref="pickerRef">

    <!-- ── Trigger ─────────────────────────────────────────────────────────── -->
    <div
      @click="openCalendar"
      class="w-full px-4 pt-3 pb-2 cursor-pointer min-h-[68px] flex flex-col justify-center group select-none"
    >
      <p class="text-[11px] font-black text-brand-gray/40 uppercase tracking-widest mb-0.5 group-hover:text-brand-blue transition-colors">
        {{ mode === 'oneway' ? 'Departure Date' : 'Check-in – Check-out' }}
      </p>
      <div class="flex items-center gap-2">
        <CalendarDaysIcon class="h-5 w-5 text-gray-400 shrink-0" />
        <span class="text-base font-black">
          <template v-if="mode === 'oneway'">
            <span :class="startDate ? 'text-brand-blue' : 'text-gray-300'">
              {{ startDate ? formatDisplay(startDate) : 'Select date' }}
            </span>
          </template>
          <template v-else>
            <span :class="startDate ? 'text-brand-blue' : 'text-gray-300'">
              {{ startDate ? formatDisplay(startDate) : 'Check-in' }}
            </span>
            <span class="text-gray-300 mx-2">–</span>
            <span :class="endDate ? 'text-brand-blue' : 'text-gray-300'">
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

          <!-- Dark backdrop — z-[10010], click to dismiss -->
          <div
            class="fixed inset-0 z-[10010] bg-black/50 backdrop-blur-[3px]"
            @click="closeCalendar"
          />

          <!-- Calendar card — z-[10011], sibling of backdrop so blur cannot reach it -->
          <div
            :style="panelStyle"
            class="fixed z-[10011] bg-white rounded-2xl overflow-hidden select-none"
            style="
              min-width: 660px;
              max-width: calc(100vw - 32px);
              box-shadow: 0 8px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08);
            "
            @click.stop
          >

            <!-- ── Month nav header ──────────────────────────────────────── -->
            <div class="flex items-center justify-between px-6 pt-5 pb-3">
              <button
                @click="prevMonth"
                :disabled="isAtMinMonth"
                class="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center transition-colors"
                :class="isAtMinMonth ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'"
              >
                <ChevronLeftIcon class="h-4 w-4 text-gray-500" />
              </button>

              <div class="flex-1 grid grid-cols-2 text-center gap-4">
                <p class="text-base font-black text-gray-800">{{ monthName(currentYear, currentMonth) }}</p>
                <p class="text-base font-black text-gray-800">{{ monthName(nextMonthYear, nextMonthIndex) }}</p>
              </div>

              <button
                @click="nextMonth"
                class="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRightIcon class="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <!-- ── Two-month grid ────────────────────────────────────────── -->
            <div class="grid grid-cols-2 px-4 pb-4 gap-0">

              <!-- Left month -->
              <div class="pr-4 border-r border-gray-100">
                <div class="grid grid-cols-7 mb-2">
                  <div
                    v-for="d in dayHeaders" :key="`lh-${d}`"
                    class="text-center text-[11px] font-black text-gray-400 py-1"
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
                        class="h-9 w-9 flex items-center justify-center rounded-full text-sm transition-all duration-100"
                        :class="dayClass(cell)"
                      >{{ cellDay(cell) }}</span>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Right month -->
              <div class="pl-4">
                <div class="grid grid-cols-7 mb-2">
                  <div
                    v-for="d in dayHeaders" :key="`rh-${d}`"
                    class="text-center text-[11px] font-black text-gray-400 py-1"
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
                        class="h-9 w-9 flex items-center justify-center rounded-full text-sm transition-all duration-100"
                        :class="dayClass(cell)"
                      >{{ cellDay(cell) }}</span>
                    </div>
                  </template>
                </div>
              </div>

            </div>

            <!-- ── Footer ────────────────────────────────────────────────── -->
            <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <div class="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <InformationCircleIcon class="h-4 w-4 shrink-0" />
                <span v-if="!startDate">
                  Select {{ mode === 'oneway' ? 'a departure date' : 'a check-in date' }}
                </span>
                <span v-else-if="mode !== 'oneway' && !endDate">
                  Now select your check-out date
                </span>
                <span v-else class="font-black text-brand-blue">
                  {{ mode === 'oneway' ? formatDisplay(startDate) : `${formatDisplay(startDate)} – ${formatDisplay(endDate!)}` }}
                  <template v-if="mode !== 'oneway' && nightCount > 0">
                    &nbsp;·&nbsp;{{ nightCount }} night{{ nightCount !== 1 ? 's' : '' }}
                  </template>
                </span>
              </div>

              <div class="flex items-center gap-3">
                <button
                  v-if="startDate"
                  @click="clearDates"
                  class="text-sm font-semibold text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
                <button
                  @click="done"
                  :disabled="!startDate || (mode !== 'oneway' && !endDate)"
                  class="px-8 py-2.5 bg-brand-blue text-white rounded-full font-black text-sm
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-blue-700 transition-colors active:scale-95"
                >
                  Done
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
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function cellDay(iso: string): string {
  return String(parseInt(iso.split('-')[2], 10))
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
    return 'bg-blue-50 rounded-l-full cursor-pointer'
  }
  if ((e || (end && iso === end && !s)) && startDate.value && iso > startDate.value) {
    return 'bg-blue-50 rounded-r-full cursor-pointer'
  }
  if (inR) {
    return 'bg-blue-50 cursor-pointer'
  }
  return 'cursor-pointer'
}

/**
 * Inner span class — the filled circle for selected, ring for today, etc.
 */
function dayClass(iso: string): string {
  if (isPast(iso)) return 'text-gray-200 cursor-not-allowed'

  if (isStartDay(iso) || isEndDay(iso)) {
    return 'bg-brand-blue text-white font-black shadow-md'
  }
  if (inRange(iso)) {
    return 'text-brand-blue font-semibold hover:bg-brand-blue/10'
  }
  if (iso === todayStr) {
    return 'font-black text-brand-blue border-2 border-brand-blue/30 hover:bg-brand-blue hover:text-white'
  }
  return 'text-gray-700 font-semibold hover:bg-gray-100 hover:text-brand-blue'
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
  const el = pickerRef.value
  if (!el) return
  const rect       = el.getBoundingClientRect()
  const panelWidth = 660
  let   left       = rect.left
  if (left + panelWidth > window.innerWidth - 8) left = window.innerWidth - panelWidth - 8
  panelStyle.value = {
    top:  `${rect.bottom + 8}px`,
    left: `${Math.max(8, left)}px`,
  }
}

function openCalendar() {
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
onMounted(()  => window.addEventListener('scroll', updatePosition, true))
onUnmounted(() => window.removeEventListener('scroll', updatePosition, true))
</script>

<style scoped>
/*
  Transition targets the wrapper <div v-if="showCalendar">.
  Backdrop (z-[9990]) and card (z-[9991]) are siblings — backdrop-blur
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

/* Card pops up on entry */
.fade-overlay-enter-active .fixed.z-\[9991\] {
  transition: transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.fade-overlay-enter-from .fixed.z-\[9991\] {
  transform: translateY(-10px) scale(0.97);
  opacity: 0;
}
</style>