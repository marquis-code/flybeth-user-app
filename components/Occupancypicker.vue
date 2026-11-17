<template>
  <div class="relative w-full h-full" ref="pickerRef">
    <div
      @click="togglePicker"
      class="w-full px-3.5 py-1.5 cursor-pointer min-h-[48px] flex flex-col justify-center group select-none transition-all rounded-lg"
      :class="showPicker
        ? (isCo ? 'bg-[#EAF2FB]/60 ring-2 ring-[#0450A0]/20' : 'bg-blue-50/30 ring-2 ring-gray-200')
        : 'hover:bg-white/60'"
    >
      <p 
        class="text-[11px] font-bold text-gray-500 mb-0 transition-colors uppercase tracking-wider"
        :class="showPicker ? 'text-black' : 'text-gray-500 group-hover:text-black'"
      >
        {{ label }}
      </p>
      <div class="flex items-center gap-1.5">
        <UserGroupIcon class="h-3.5 w-3.5 shrink-0 transition-colors" :class="showPicker ? 'text-black' : 'text-gray-500'" />
        <span class="text-[13px] font-bold truncate text-black">
          {{ summary }}
        </span>
      </div>
    </div>

    <!-- Picker Dropdown Panel -->
    <Teleport to="body" :disabled="!isMobile">
      <Transition name="loc-drop">
        <div
          ref="dropdownRef"
          v-show="showPicker"
          class="z-[100000] bg-white border shadow-2xl overflow-hidden flex flex-col"
          :class="[
            isCo ? 'border-[#DBE2EA]' : 'border-gray-200',
            isMobile
              ? 'fixed inset-0 rounded-none w-full h-[100dvh] pt-4'
              : (isCo ? 'absolute right-0 top-[calc(100%+6px)] w-[320px] rounded-lg' : 'absolute right-0 top-[calc(100%+6px)] w-[320px] rounded-2xl'),
          ]"
          style="background-color: #ffffff !important;"
        >
        <!-- Mobile Header with Close Button -->
        <div v-if="isMobile" class="flex items-center justify-between px-4 pb-3 mb-2 border-b border-gray-100 shrink-0">
          <h3 class="text-base font-bold text-black">{{ label }}</h3>
          <button @click="closePicker" class="p-2 -mr-2 text-black hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="px-5 py-5 space-y-5 overflow-y-auto flex-1">
          <!-- Rows -->
          <div
            v-for="row in rows"
            :key="row.key"
            class="flex items-center justify-between"
          >
            <div>
              <p class="text-[13px] font-bold text-black">{{ row.label }}</p>
              <p v-if="row.note" class="text-sm text-black font-medium">{{ row.note }}</p>
            </div>
            <div class="flex items-center gap-4">
              <button
                @mousedown.prevent="decrement(row.key)"
                :disabled="local[row.key] <= row.min"
                class="h-8 w-8 border flex items-center justify-center text-sm font-bold transition-all"
                :class="[
                  isCo ? 'rounded-md border-[#DBE2EA]' : 'rounded-lg border-gray-200',
                  local[row.key] <= row.min ? 'opacity-20 cursor-not-allowed' : 'text-black hover:bg-white active:scale-90',
                ]"
              >
                −
              </button>
              <span class="w-4 text-center text-[13px] font-bold text-black">{{ local[row.key] }}</span>
              <button
                @mousedown.prevent="increment(row.key)"
                :disabled="local[row.key] >= row.max"
                class="h-8 w-8 border flex items-center justify-center text-sm font-bold transition-all"
                :class="[
                  isCo ? 'rounded-md border-[#DBE2EA]' : 'rounded-lg border-gray-200',
                  local[row.key] >= row.max ? 'opacity-20 cursor-not-allowed' : 'text-black hover:bg-white active:scale-90',
                ]"
              >
                +
              </button>
            </div>
          </div>

          <!-- Children note -->
          <p v-if="showChildNote" class="text-sm text-black font-medium leading-relaxed -mt-2">
            Each hotel has unique child policies. Ages at check-in ensure best deals.
          </p>

          <!-- Cabin Class Selection -->
          <div v-if="variant === 'flight'" class="pt-4 border-t border-gray-200">
            <p class="text-[13px] font-bold text-black mb-3">Cabin Class</p>
            <div class="flex flex-col gap-2">
              <label v-for="c in cabinClasses" :key="c.value" class="flex items-center gap-3 cursor-pointer group">
                <div class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
                  :class="localCabinClass === c.value
                    ? (isCo ? 'border-[#0450A0] bg-[#0450A0]' : 'border-black bg-black')
                    : (isCo ? 'border-[#DBE2EA] group-hover:border-[#0450A0]' : 'border-gray-300 group-hover:border-black')">
                  <div class="w-2 h-2 rounded-full bg-white transition-opacity" :class="localCabinClass === c.value ? 'opacity-100' : 'opacity-0'"></div>
                </div>
                <span class="text-[14px] font-medium" :class="localCabinClass === c.value ? 'text-black font-bold' : 'text-gray-700'">{{ c.label }}</span>
                <input type="radio" :value="c.value" v-model="localCabinClass" class="sr-only" />
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 pt-2 border-t border-gray-200">
             <button @click="closePicker" class="flex-1 py-3 text-white text-[12px] font-bold transition-all active:scale-95" :class="isCo ? 'bg-[#0D1DAD] hover:bg-[#081485] rounded-md' : 'bg-[#0D1DAD] hover:bg-[#081485] rounded-xl'">Done</button>
          </div>
        </div>
      </div>
      </Transition>
    </Teleport>
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
  cabinClass: { type: String, default: 'economy' },
  // Default to 'cheapoair' to match the hero search widget theme.
  theme:     { type: String, default: 'cheapoair' },
})

/** Cheapoair palette: brand blue for selection, action orange for the primary CTA. */
const isCo = computed(() => props.theme === 'cheapoair')

const emit = defineEmits([
  'update:rooms', 'update:adults', 'update:children',
  'update:infantsOnLap', 'update:infantsInSeat', 'update:cabinClass',
  'focus', 'close'
])

const local = reactive({
  rooms:         props.rooms,
  adults:        props.adults,
  children:      props.children,
  infantsOnLap:  props.infantsOnLap,
  infantsInSeat: props.infantsInSeat,
})
const localCabinClass = ref(props.cabinClass)

const cabinClasses = [
  { value: 'economy',         label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business',        label: 'Business' },
  { value: 'first',           label: 'First' },
]

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
    const cabinLabel = cabinClasses.find(c => c.value === localCabinClass.value)?.label || 'Economy'
    return `${total} Passenger${total > 1 ? 's' : ''}, ${cabinLabel}`
  }
  const guests = local.adults + local.children
  return `${local.adults} Adult${local.adults > 1 ? 's' : ''}, ${local.rooms} Room${local.rooms > 1 ? 's' : ''}`
})

const increment = (key: string) => { if ((local as any)[key] < 10) (local as any)[key]++ }
const decrement = (key: string) => { if ((local as any)[key] > 0) (local as any)[key]-- }

const pickerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
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
    emit('update:cabinClass', localCabinClass.value)
  }
  emit('close')
}

const handleClickOutside = (e: MouseEvent) => { 
  if (showPicker.value) {
    const isOutsidePicker = pickerRef.value && !pickerRef.value.contains(e.target as Node)
    const isOutsideDropdown = dropdownRef.value && !dropdownRef.value.contains(e.target as Node)
    if (isOutsidePicker && isOutsideDropdown) {
      closePicker()
    }
  }
}
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