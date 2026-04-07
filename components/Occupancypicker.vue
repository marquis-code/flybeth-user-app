<template>
  <div class="relative w-full" ref="pickerRef">
    <!-- Trigger Field -->
    <div
      @click="openPicker"
      class="w-full px-4 pt-3 pb-2 cursor-pointer min-h-[68px] flex flex-col justify-center group select-none"
    >
      <p class="text-[11px]  text-brand-gray/40 uppercase tracking-widest mb-0.5 group-hover:text-gray-900 transition-colors">
        {{ label }}
      </p>
      <div class="flex items-center gap-2">
        <UserGroupIcon class="h-5 w-5 text-gray-400 shrink-0" />
        <span class="text-base  text-gray-900">{{ summary }}</span>
      </div>
    </div>

    <!-- Dark Backdrop -->
    <Teleport to="body">
      <Transition name="fade-overlay">
        <div
          v-if="showPicker"
          class="fixed inset-0 bg-black/50 z-[10010]"
          @click="closePicker"
        />
      </Transition>
    </Teleport>

    <!-- Picker Panel -->
    <Teleport to="body">
      <Transition name="picker-pop">
        <div
          v-if="showPicker"
          :style="panelStyle"
          class="fixed z-[10011] bg-white rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden"
          style="width: 360px; max-width: calc(100vw - 32px);"
          @click.stop
        >
          <div class="px-6 py-5 space-y-5">
            <!-- Rows -->
            <div
              v-for="row in rows"
              :key="row.key"
              class="flex items-center justify-between"
            >
              <div>
                <p class="text-base font-bold text-gray-800">{{ row.label }}</p>
                <p v-if="row.note" class="text-xs text-gray-400">{{ row.note }}</p>
              </div>
              <div class="flex items-center gap-4">
                <button
                  @click="decrement(row.key)"
                  :disabled="local[row.key] <= row.min"
                  class="h-9 w-9 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all"
                  :class="local[row.key] <= row.min
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-red-400 text-red-400 hover:bg-red-50'"
                >
                  −
                </button>
                <span class="w-5 text-center text-base  text-gray-800">{{ local[row.key] }}</span>
                <button
                  @click="increment(row.key)"
                  :disabled="local[row.key] >= row.max"
                  class="h-9 w-9 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all"
                  :class="local[row.key] >= row.max
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-brand-blue text-gray-900 hover:bg-blue-50'"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Children note -->
            <p v-if="showChildNote" class="text-xs text-gray-400 leading-relaxed -mt-2">
              Add your child's age at check-in for the best deals and assistance. Each hotel has unique policies.
            </p>

            <!-- Done Button -->
            <button
              @click="done"
              class="w-full bg-brand-blue text-white py-3 rounded-full  text-sm hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import { UserGroupIcon } from '@heroicons/vue/24/outline'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
  label:    { type: String,  default: 'Guests & Rooms' },
  rooms:    { type: Number,  default: 1 },
  adults:   { type: Number,  default: 2 },
  children: { type: Number,  default: 0 },
  /** 'hotel' | 'flight' | 'package' — controls which rows appear */
  variant:  { type: String,  default: 'hotel' },
  /** flight-specific extras */
  infantsOnLap:  { type: Number, default: 0 },
  infantsInSeat: { type: Number, default: 0 },
})

const emit = defineEmits([
  'update:rooms', 'update:adults', 'update:children',
  'update:infantsOnLap', 'update:infantsInSeat',
  'focus', 'close'
])

// ─── Local copy ───────────────────────────────────────────────────────────────
const local = reactive({
  rooms:         props.rooms,
  adults:        props.adults,
  children:      props.children,
  infantsOnLap:  props.infantsOnLap,
  infantsInSeat: props.infantsInSeat,
})

// ─── Row definitions ──────────────────────────────────────────────────────────
const rows = computed(() => {
  if (props.variant === 'flight') {
    return [
      { key: 'adults',        label: 'Adults',            note: '',              min: 1, max: 9 },
      { key: 'children',      label: 'Children',          note: 'Ages 2–17',     min: 0, max: 8 },
      { key: 'infantsOnLap',  label: 'Infants on Lap',    note: 'Under 2',       min: 0, max: 4 },
      { key: 'infantsInSeat', label: 'Infants in Seat',   note: 'Under 2',       min: 0, max: 4 },
    ]
  }
  if (props.variant === 'package') {
    return [
      { key: 'rooms',    label: 'Rooms',    note: '',          min: 1, max: 8 },
      { key: 'adults',   label: 'Adults',   note: '',          min: 1, max: 8 },
      { key: 'children', label: 'Children', note: 'Ages 0–17', min: 0, max: 8 },
    ]
  }
  // hotel (default)
  return [
    { key: 'rooms',    label: 'Rooms',    note: '',          min: 1, max: 8 },
    { key: 'adults',   label: 'Adults',   note: '',          min: 1, max: 8 },
    { key: 'children', label: 'Children', note: 'Ages 0–17', min: 0, max: 8 },
  ]
})

const showChildNote = computed(() =>
  props.variant === 'hotel' && local.children > 0
)

// ─── Summary text ─────────────────────────────────────────────────────────────
const summary = computed(() => {
  if (props.variant === 'flight') {
    const total = local.adults + local.children + local.infantsOnLap + local.infantsInSeat
    return `${total} Passenger${total > 1 ? 's' : ''}`
  }
  const guests = local.adults + local.children
  if (props.variant === 'package') return `${local.rooms} Room${local.rooms > 1 ? 's' : ''}, ${guests} Guest${guests > 1 ? 's' : ''}`
  return `${local.adults} Adult${local.adults > 1 ? 's' : ''}${local.rooms > 1 ? `, ${local.rooms} Rooms` : ', 1 Room'}`
})

// ─── Counter actions ──────────────────────────────────────────────────────────
const increment = (key: string) => {
  const row = rows.value.find(r => r.key === key)
  if (!row) return
  if ((local as any)[key] < row.max) (local as any)[key]++
}

const decrement = (key: string) => {
  const row = rows.value.find(r => r.key === key)
  if (!row) return
  if ((local as any)[key] > row.min) (local as any)[key]--
}

// ─── Panel state & position ───────────────────────────────────────────────────
const pickerRef  = ref<HTMLElement | null>(null)
const showPicker = ref(false)
const panelStyle = ref<Record<string, string>>({})

const updatePosition = () => {
  const el = pickerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  let left = rect.right - 360
  if (left < 8) left = 8
  panelStyle.value = {
    top:  `${rect.bottom + 8}px`,
    left: `${left}px`,
  }
}

const openPicker = () => {
  updatePosition()
  showPicker.value = true
  emit('focus')
}

const closePicker = () => { 
  showPicker.value = false 
  emit('close')
}

const done = () => {
  emit('update:rooms',    local.rooms)
  emit('update:adults',   local.adults)
  emit('update:children', local.children)
  if (props.variant === 'flight') {
    emit('update:infantsOnLap',  local.infantsOnLap)
    emit('update:infantsInSeat', local.infantsInSeat)
  }
  closePicker()
}

// ─── Sync props → local ───────────────────────────────────────────────────────
watch(() => props.rooms,         v => { local.rooms         = v })
watch(() => props.adults,        v => { local.adults        = v })
watch(() => props.children,      v => { local.children      = v })
watch(() => props.infantsOnLap,  v => { local.infantsOnLap  = v })
watch(() => props.infantsInSeat, v => { local.infantsInSeat = v })

onMounted(() => window.addEventListener('scroll', updatePosition, true))
onUnmounted(() => window.removeEventListener('scroll', updatePosition, true))
</script>

<style scoped>
.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.2s ease; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

.picker-pop-enter-active { transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
.picker-pop-leave-active { transition: all 0.15s ease; }
.picker-pop-enter-from { opacity: 0; transform: translateY(-6px) scale(0.97); }
.picker-pop-leave-to   { opacity: 0; transform: translateY(-4px) scale(0.99); }
</style>