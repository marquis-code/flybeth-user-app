<template>
  <div class="relative w-full h-full" ref="pickerRef">
    <!-- Trigger Field -->
    <div
      @mousedown.prevent="togglePicker"
      class="w-full px-4 pt-3 pb-2 cursor-pointer min-h-[68px] flex flex-col justify-center group select-none transition-all rounded-xl"
      :class="showPicker ? 'bg-blue-50/30 ring-2 ring-gray-900/5' : 'hover:bg-gray-50/60'"
    >
      <p 
        class="text-[10px] font-bold tracking-[0.05em] mb-0.5 transition-colors uppercase"
        :class="showPicker ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'"
      >
        {{ label }}
      </p>
      <div class="flex items-center gap-2">
        <UserGroupIcon class="h-4 w-4 shrink-0 transition-colors" :class="showPicker ? 'text-gray-900' : 'text-gray-300'" />
        <span class="text-[14px] font-bold truncate" :class="summary ? 'text-gray-900' : 'text-gray-400'">
          {{ summary }}
        </span>
      </div>
    </div>

    <!-- Picker Dropdown Panel -->
    <Transition name="loc-drop">
      <div
        v-show="showPicker"
        class="absolute right-0 top-[calc(100%+6px)] z-[2000] bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden"
        :class="[isMobile ? 'fixed inset-x-4 top-1/2 -translate-y-1/2 w-auto' : 'w-[320px]']"
        style="background-color: #ffffff !important;"
        @mousedown.stop
      >
        <div class="px-5 py-5 space-y-5">
          <!-- Rows -->
          <div
            v-for="row in rows"
            :key="row.key"
            class="flex items-center justify-between"
          >
            <div>
              <p class="text-[13px] font-bold text-gray-900">{{ row.label }}</p>
              <p v-if="row.note" class="text-[10px] text-gray-400 font-medium">{{ row.note }}</p>
            </div>
            <div class="flex items-center gap-4">
              <button
                @mousedown.prevent="decrement(row.key)"
                :disabled="local[row.key] <= row.min"
                class="h-8 w-8 rounded-lg border border-gray-100 flex items-center justify-center text-sm font-bold transition-all"
                :class="local[row.key] <= row.min
                  ? 'opacity-20 cursor-not-allowed'
                  : 'text-gray-900 hover:bg-gray-50 active:scale-90'"
              >
                −
              </button>
              <span class="w-4 text-center text-[13px] font-bold text-gray-900">{{ local[row.key] }}</span>
              <button
                @mousedown.prevent="increment(row.key)"
                :disabled="local[row.key] >= row.max"
                class="h-8 w-8 rounded-lg border border-gray-100 flex items-center justify-center text-sm font-bold transition-all"
                :class="local[row.key] >= row.max
                  ? 'opacity-20 cursor-not-allowed'
                  : 'text-gray-900 hover:bg-gray-50 active:scale-90'"
              >
                +
              </button>
            </div>
          </div>

          <!-- Children note -->
          <p v-if="showChildNote" class="text-[10px] text-gray-400 font-medium leading-relaxed -mt-2">
            Each hotel has unique child policies. Ages at check-in ensure best deals.
          </p>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 pt-2 border-t border-gray-50">
             <button @click="closePicker" class="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95">Done</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import { UserGroupIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  label:    { type: String,  default: 'Guests & Rooms' },
  rooms:    { type: Number,  default: 1 },
  adults:   { type: Number,  default: 2 },
  children: { type: Number,  default: 0 },
  variant:  { type: String,  default: 'hotel' },
  infantsOnLap:  { type: Number, default: 0 },
  infantsInSeat: { type: Number, default: 0 },
})

const emit = defineEmits([
  'update:rooms', 'update:adults', 'update:children',
  'update:infantsOnLap', 'update:infantsInSeat',
  'focus', 'close'
])

const local = reactive({
  rooms:         props.rooms,
  adults:        props.adults,
  children:      props.children,
  infantsOnLap:  props.infantsOnLap,
  infantsInSeat: props.infantsInSeat,
})

const rows = computed(() => {
  if (props.variant === 'flight') {
    return [
      { key: 'adults',        label: 'Adults',            note: '',              min: 1, max: 9 },
      { key: 'children',      label: 'Children',          note: 'Ages 2–17',     min: 0, max: 8 },
      { key: 'infantsOnLap',  label: 'Infants on Lap',    note: 'Under 2',       min: 0, max: 4 },
      { key: 'infantsInSeat', label: 'Infants in Seat',   note: 'Under 2',       min: 0, max: 4 },
    ]
  }
  return [
    { key: 'rooms',    label: 'Rooms',    note: '',          min: 1, max: 8 },
    { key: 'adults',   label: 'Adults',   note: '',          min: 1, max: 8 },
    { key: 'children', label: 'Children', note: 'Ages 0–17', min: 0, max: 8 },
  ]
})

const showChildNote = computed(() => props.variant === 'hotel' && local.children > 0)

const summary = computed(() => {
  if (props.variant === 'flight') {
    const total = local.adults + local.children + local.infantsOnLap + local.infantsInSeat
    return `${total} Passenger${total > 1 ? 's' : ''}`
  }
  const guests = local.adults + local.children
  return `${local.adults} Adult${local.adults > 1 ? 's' : ''}, ${local.rooms} Room${local.rooms > 1 ? 's' : ''}`
})

const increment = (key: string) => { if ((local as any)[key] < 10) (local as any)[key]++ }
const decrement = (key: string) => { if ((local as any)[key] > 0) (local as any)[key]-- }

const pickerRef  = ref<HTMLElement | null>(null)
const showPicker = ref(false)
const isMobile   = ref(false)

const togglePicker = () => { if (showPicker.value) closePicker(); else openPicker() }
const openPicker = () => { checkMobile(); showPicker.value = true; emit('focus') }
const closePicker = () => {
  showPicker.value = false
  emit('update:rooms',    local.rooms)
  emit('update:adults',   local.adults)
  emit('update:children', local.children)
  if (props.variant === 'flight') {
    emit('update:infantsOnLap',  local.infantsOnLap)
    emit('update:infantsInSeat', local.infantsInSeat)
  }
  emit('close')
}

const handleClickOutside = (e: MouseEvent) => { if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) closePicker() }
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