<template>
  <div class="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 relative overflow-hidden text-center">
    
    <!-- Top Brand Accent Line -->
    <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0D1DAD]/20 via-[#0D1DAD] to-[#0D1DAD]/20"></div>

    <!-- Soft Ambient Aura -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-blue-50/70 to-transparent pointer-events-none rounded-full blur-2xl"></div>

    <div class="relative z-10">

      <!-- ── 1. Animated Visual Icon Badge ── -->
      <div class="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
        <!-- Soft pulse wave -->
        <span class="absolute inset-0 rounded-3xl bg-blue-100/60 animate-ping opacity-75"></span>
        <div class="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/80 border-2 border-blue-200/60 shadow-inner flex items-center justify-center text-[#0D1DAD]">
          <component :is="computedIcon" class="w-9 h-9 stroke-[1.8]" />
        </div>
      </div>

      <!-- ── 2. Route / Location Capsule (If provided) ── -->
      <div v-if="origin || destination" class="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 mb-4 shadow-2xs">
        <span class="text-slate-900 font-extrabold">{{ originLabel || origin || 'Departure' }}</span>
        <span class="text-[#0D1DAD]">➔</span>
        <span class="text-slate-900 font-extrabold">{{ destinationLabel || destination || 'Destination' }}</span>
        <span v-if="dates" class="text-slate-400 font-normal">|</span>
        <span v-if="dates" class="text-slate-500 font-medium">{{ dates }}</span>
      </div>

      <!-- ── 3. Eyebrow & Headline ── -->
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0D1DAD] text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
          <span>✦ {{ variantLabel }} Availability</span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {{ title || 'No live results found' }}
        </h3>
        <p class="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-2 leading-relaxed font-medium">
          {{ message || 'Airlines may not operate scheduled flights on this specific route and date combination, or seats are currently sold out.' }}
        </p>
      </div>

      <!-- ── 4. Actionable Troubleshooting Cards ── -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 text-left max-w-2xl mx-auto">
        
        <!-- Card 1: Flexible Dates -->
        <button
          type="button"
          @click="emitTipAction('dates')"
          class="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-[#0D1DAD]/40 transition-all group cursor-pointer text-left flex flex-col justify-between"
        >
          <div>
            <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/80 text-[#0D1DAD] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-2xs">
              <CalendarDaysIcon class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-extrabold text-slate-900 group-hover:text-[#0D1DAD] transition-colors">
              Flexible Dates (±3 Days)
            </h4>
            <p class="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
              Airlines frequently operate alternating schedules throughout the week.
            </p>
          </div>
          <span class="text-[11px] font-bold text-[#0D1DAD] mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Adjust dates →
          </span>
        </button>

        <!-- Card 2: Nearby Hubs -->
        <button
          type="button"
          @click="emitTipAction('airports')"
          class="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-[#0D1DAD]/40 transition-all group cursor-pointer text-left flex flex-col justify-between"
        >
          <div>
            <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/80 text-[#0D1DAD] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-2xs">
              <MapPinIcon class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-extrabold text-slate-900 group-hover:text-[#0D1DAD] transition-colors">
              Nearby Major Hubs
            </h4>
            <p class="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
              Try searching alternative major international airports in the vicinity.
            </p>
          </div>
          <span class="text-[11px] font-bold text-[#0D1DAD] mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Change route →
          </span>
        </button>

        <!-- Card 3: Reset Filters -->
        <button
          type="button"
          @click="emitTipAction('filters')"
          class="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-[#0D1DAD]/40 transition-all group cursor-pointer text-left flex flex-col justify-between"
        >
          <div>
            <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/80 text-[#0D1DAD] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-2xs">
              <ArrowPathIcon class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-extrabold text-slate-900 group-hover:text-[#0D1DAD] transition-colors">
              Reset Filters
            </h4>
            <p class="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
              Remove cabin class, max price, stops, or airline carrier constraints.
            </p>
          </div>
          <span class="text-[11px] font-bold text-[#0D1DAD] mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Reset all →
          </span>
        </button>

      </div>

      <!-- ── 5. Smart Popular Alternative Routes (Flights) ── -->
      <div v-if="variant === 'flights' && popularAlternativeRoutes.length" class="mt-8 pt-6 border-t border-slate-100">
        <p class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
          Popular Alternative Connections
        </p>
        <div class="flex flex-wrap items-center justify-center gap-2">
          <button
            v-for="route in popularAlternativeRoutes"
            :key="route.code"
            type="button"
            @click="$emit('route-select', route)"
            class="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/60 text-xs font-bold text-slate-700 hover:text-[#0D1DAD] transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
          >
            <span>{{ route.label }}</span>
            <ArrowRightIcon class="w-3 h-3 text-slate-400 group-hover:text-[#0D1DAD]" />
          </button>
        </div>
      </div>

      <!-- ── 6. Action Button Bar ── -->
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          v-if="actionLabel"
          type="button"
          @click="$emit('action')"
          class="w-full sm:w-auto h-12 px-7 bg-[#0D1DAD] hover:bg-[#002a66] active:scale-95 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 shrink-0"
        >
          <span>{{ actionLabel }}</span>
          <ArrowRightIcon class="w-4 h-4" />
        </button>

        <button
          v-if="secondaryActionLabel"
          type="button"
          @click="$emit('secondary-action')"
          class="w-full sm:w-auto h-12 px-6 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <ArrowPathIcon class="w-3.5 h-3.5" />
          <span>{{ secondaryActionLabel }}</span>
        </button>
      </div>

      <!-- ── 7. 24/7 Concierge Support Callout ── -->
      <div class="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-blue-50/40 border border-blue-100/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#0D1DAD] text-white flex items-center justify-center shrink-0 shadow-sm">
            <PhoneIcon class="w-4 h-4" />
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-900">Need live assistance with unlisted routes?</h5>
            <p class="text-[11px] text-slate-500 font-medium">Flybeth Flight Specialists can verify offline inventory and multi-airline combinations.</p>
          </div>
        </div>
        <a
          href="tel:1-844-FLYBETH"
          class="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#0D1DAD] rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-2xs transition-colors text-center shrink-0"
        >
          Call 1-844-FLYBETH
        </a>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  MagnifyingGlassIcon, 
  PaperAirplaneIcon, 
  BuildingOfficeIcon,
  TruckIcon, 
  GlobeAltIcon, 
  SparklesIcon, 
  ArrowRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ArrowPathIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

interface Props {
  variant?: 'search' | 'flights' | 'stays' | 'cars' | 'cruises' | 'packages'
  title?: string
  message?: string
  actionLabel?: string
  secondaryActionLabel?: string
  origin?: string
  destination?: string
  originLabel?: string
  destinationLabel?: string
  dates?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'search',
  title: '',
  message: '',
  actionLabel: '',
  secondaryActionLabel: '',
  origin: '',
  destination: '',
  originLabel: '',
  destinationLabel: '',
  dates: ''
})

const emit = defineEmits<{
  (e: 'action'): void
  (e: 'secondary-action'): void
  (e: 'route-select', route: { origin: string; destination: string; label: string; code: string }): void
  (e: 'tip-action', type: 'dates' | 'airports' | 'filters'): void
}>()

const iconMap: Record<string, any> = {
  search: MagnifyingGlassIcon,
  flights: PaperAirplaneIcon,
  stays: BuildingOfficeIcon,
  cars: TruckIcon,
  cruises: GlobeAltIcon,
  packages: SparklesIcon,
}

const labelMap: Record<string, string> = {
  search: 'Search',
  flights: 'Flights',
  stays: 'Stays',
  cars: 'Car Rentals',
  cruises: 'Cruises',
  packages: 'Packages',
}

const computedIcon = computed(() => iconMap[props.variant] ?? MagnifyingGlassIcon)
const variantLabel = computed(() => labelMap[props.variant] ?? 'Search')

const emitTipAction = (type: 'dates' | 'airports' | 'filters') => {
  emit('tip-action', type)
  if (type === 'filters') {
    emit('secondary-action')
  } else {
    emit('action')
  }
}

// Smart popular alternative routes
const popularAlternativeRoutes = computed(() => {
  if (props.variant !== 'flights') return []
  
  const currentOrigin = (props.origin || 'LOS').toUpperCase()
  
  if (currentOrigin === 'LOS') {
    return [
      { origin: 'LOS', destination: 'LHR', label: 'Lagos → London (LHR)', code: 'LOS-LHR' },
      { origin: 'LOS', destination: 'DXB', label: 'Lagos → Dubai (DXB)', code: 'LOS-DXB' },
      { origin: 'LOS', destination: 'JFK', label: 'Lagos → New York (JFK)', code: 'LOS-JFK' },
      { origin: 'LOS', destination: 'YYZ', label: 'Lagos → Toronto (YYZ)', code: 'LOS-YYZ' },
    ]
  }

  return [
    { origin: 'LHR', destination: 'DXB', label: 'London → Dubai', code: 'LHR-DXB' },
    { origin: 'JFK', destination: 'LHR', label: 'New York → London', code: 'JFK-LHR' },
    { origin: 'DXB', destination: 'BOM', label: 'Dubai → Mumbai', code: 'DXB-BOM' },
    { origin: 'LOS', destination: 'LHR', label: 'Lagos → London', code: 'LOS-LHR' },
  ]
})
</script>
