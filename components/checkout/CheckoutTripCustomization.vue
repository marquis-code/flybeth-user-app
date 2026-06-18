<template>
  <div class="space-y-6">
    <!-- Seat Preference Card -->
    <div class="relative bg-white rounded-[24px] border border-gray-200 shadow-sm p-6 overflow-visible mt-8">
      <div class="absolute -top-3 left-6 px-3 py-1 bg-[#E2FCA4] text-[#2F4F2F] text-[10px] font-bold rounded-full ">
        Recommended
      </div>
      <div class="flex items-start gap-4 mb-6">
        <div class="w-10 h-10 bg-[#F0F4FF] rounded-xl flex items-center justify-center flex-shrink-0 text-[#0D1DAD]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18v3"/><path d="M20 18v3"/><path d="M12 18v3"/><path d="M4 8v10"/><path d="M20 8v10"/><path d="M12 8v10"/><path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4"/><path d="M4 14h16"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900">Seat preference</h3>
          <p class="text-sm text-gray-500 mt-1">Select seats together or pick your own</p>
        </div>
      </div>

      <div v-if="loadingSeats" class="py-12 flex flex-col items-center justify-center space-y-4">
        <div class="w-10 h-10 border-4 border-gray-200 border-t-[#0D1DAD] rounded-full animate-spin"></div>
        <p class="text-sm text-gray-500 font-bold">Analyzing flight seat map...</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Window Seat -->
          <button 
            @click="openDrawer('window')"
            :disabled="!windowSeats.length"
            class="text-left border rounded-2xl p-4 cursor-pointer flex flex-col transition-all duration-300 relative focus:outline-none"
            :class="[
              seatPreference === 'window' ? 'border-[#0D1DAD] bg-white ring-1 ring-[#0D1DAD]' : 'border-gray-200 bg-white hover:border-[#0D1DAD]',
              !windowSeats.length ? 'opacity-50 cursor-not-allowed hover:border-gray-200' : ''
            ]"
          >
            <div class="text-[#0D1DAD] font-bold text-base mb-1">
              {{ windowSeats.length ? formatPriceValue(windowSeatPrice) : 'Unavailable' }}
            </div>
            <div class="text-[11px] text-gray-500 mb-4">/seat</div>
            <div class="font-bold text-gray-900 mt-auto w-full flex items-center justify-between text-sm">
              Window seat
              <div 
                class="w-[22px] h-[22px] rounded border flex items-center justify-center transition-colors"
                :class="seatPreference === 'window' ? 'bg-[#0D1DAD] border-[#0D1DAD]' : 'border-gray-200 bg-[#FAFAFA]'"
              >
                <svg v-if="seatPreference === 'window'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
          </button>

          <!-- Aisle Seat -->
          <button 
            @click="openDrawer('aisle')"
            :disabled="!aisleSeats.length"
            class="text-left border rounded-2xl p-4 cursor-pointer flex flex-col transition-all duration-300 relative focus:outline-none"
            :class="[
              seatPreference === 'aisle' ? 'border-[#0D1DAD] bg-white ring-1 ring-[#0D1DAD]' : 'border-gray-200 bg-white hover:border-[#0D1DAD]',
              !aisleSeats.length ? 'opacity-50 cursor-not-allowed hover:border-gray-200' : ''
            ]"
          >
            <div class="text-[#0D1DAD] font-bold text-base mb-1">
              {{ aisleSeats.length ? formatPriceValue(aisleSeatPrice) : 'Unavailable' }}
            </div>
            <div class="text-[11px] text-gray-500 mb-4">/seat</div>
            <div class="font-bold text-gray-900 mt-auto w-full flex items-center justify-between text-sm">
              Aisle seat
              <div 
                class="w-[22px] h-[22px] rounded border flex items-center justify-center transition-colors"
                :class="seatPreference === 'aisle' ? 'bg-[#0D1DAD] border-[#0D1DAD]' : 'border-gray-200 bg-[#FAFAFA]'"
              >
                <svg v-if="seatPreference === 'aisle'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
          </button>

          <!-- Random Seats -->
          <button 
            @click="openDrawer('random')"
            class="text-left border rounded-2xl p-4 cursor-pointer flex flex-col transition-all duration-300 relative focus:outline-none"
            :class="seatPreference === 'random' ? 'border-[#0D1DAD] bg-white ring-1 ring-[#0D1DAD]' : 'border-gray-200 bg-white hover:border-[#0D1DAD]'"
          >
            <div class="text-[#0D1DAD] font-bold text-base mb-1">{{ formatPriceValue(0) }}</div>
            <div class="text-[11px] text-gray-500 mb-4">/seat</div>
            <div class="font-bold text-gray-900 mt-auto w-full flex items-center justify-between text-sm">
              Random seats
              <div 
                class="w-[22px] h-[22px] rounded border flex items-center justify-center transition-colors"
                :class="seatPreference === 'random' ? 'bg-[#0D1DAD] border-[#0D1DAD]' : 'border-gray-200 bg-[#FAFAFA]'"
              >
                <svg v-if="seatPreference === 'random'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
          </button>
        </div>

        <!-- Side Drawer will be teleported to body -->
      </div>
    </div>

    <!-- Baggage Card -->
    <div class="relative bg-white rounded-[24px] border border-gray-200 shadow-sm p-6 mt-6">
      <div class="flex items-start gap-4 mb-6">
        <div class="w-10 h-10 bg-[#F0F4FF] rounded-xl flex items-center justify-center flex-shrink-0 text-[#0D1DAD]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900">Baggage</h3>
          <p class="text-sm text-gray-500 mt-1">Travel your style and bring what matters to you the most</p>
        </div>
      </div>

      <div v-if="baggageServices.length > 0" class="space-y-3">
        <div v-for="bag in baggageServices" :key="bag.id" class="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-gray-900">{{ bag.name }}</h4>
            <p class="text-sm text-gray-500 mt-0.5">+{{ formatPriceValue(bag.price) }}</p>
          </div>
          <button 
            @click="toggleAddon(bag)"
            class="px-6 py-2.5 rounded-full border text-sm font-bold transition-colors shrink-0"
            :class="isAddonSelected(bag.id) ? 'bg-[#0D1DAD] border-[#0D1DAD] text-white' : 'border-[#0D1DAD] text-[#0D1DAD] hover:bg-[#F0F4FF]'"
          >
            {{ isAddonSelected(bag.id) ? 'Remove baggage' : 'Select baggage' }}
          </button>
        </div>
      </div>
      <div v-else class="text-sm text-gray-500 p-4 bg-gray-50 rounded-xl">
        No extra baggage options confirmed available from the provider (<span class="capitalize font-bold">{{ providerName }}</span>) for this flight. Please check your ticket for included baggage allowance.
      </div>
    </div>

    <!-- VIP Priority Support Card -->
    <div class="relative bg-white rounded-[24px] border border-gray-200 shadow-sm p-6 mt-6 overflow-hidden">
      <div class="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 text-[10px] font-bold rounded-bl-xl ">
        Most Popular
      </div>
      <div class="flex items-start gap-4 mb-6">
        <div class="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-700 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900">VIP Priority Support</h3>
          <p class="text-sm text-gray-500 mt-1">Skip the queue. Get dedicated 24/7 priority phone support and expedited handling for modifications.</p>
        </div>
      </div>

      <div class="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
           :class="isAddonSelected('vip-support') ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-300' : ''">
        <div>
          <h4 class="font-bold text-gray-900">Priority Assistance</h4>
          <p class="text-sm text-gray-500 mt-0.5">+{{ formatPriceValue(ancillaryPrices.vipSupport) }} <span class="text-xs text-gray-400 font-normal">/ booking</span></p>
        </div>
        <button 
          @click="toggleVipSupport()"
          class="px-6 py-2.5 rounded-full border text-sm font-bold transition-all shrink-0 shadow-sm"
          :class="isAddonSelected('vip-support') ? 'bg-amber-500 border-amber-500 text-white' : 'border-amber-500 text-amber-600 hover:bg-amber-50'"
        >
          {{ isAddonSelected('vip-support') ? 'Added to booking' : 'Add VIP Support' }}
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end pt-4 gap-4">
       <button @click="$emit('back')" class="px-8 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[12px] font-bold transition-all text-sm">
          Go Back
       </button>
       <button @click="$emit('continue')" class="px-8 py-3 bg-[#0D1DAD] hover:bg-[#0A1485] text-white rounded-[12px] font-bold transition-all text-sm">
          Continue
       </button>
    </div>

    <!-- Teleport Side Drawer -->
    <Teleport to="body">
      <div v-if="isDrawerOpen" class="fixed inset-0 z-[100] flex justify-end p-4 sm:p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in" @click="closeDrawer"></div>
        
        <!-- Drawer Panel -->
        <div class="relative w-full max-w-md bg-white rounded-[24px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
          <!-- Header -->
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900 capitalize">{{ activeCategory }} Seat</h3>
            <button @click="closeDrawer" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <!-- Explanation -->
            <div class="mb-6 p-4 bg-[#F0F4FF] rounded-2xl border border-[#0D1DAD]/10 shadow-sm">
              <div class="flex items-center gap-2 mb-2 text-[#0D1DAD]">
                <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0D1DAD]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                <h4 class="font-bold text-sm">{{ $t('what_is_this', 'What is this?') }}</h4>
              </div>
              <p class="text-[13px] text-gray-600 leading-relaxed font-medium">
                {{ getDrawerDescription() }}
              </p>
            </div>

            <!-- Specific Seat Selection Grid (if Window or Aisle) -->
            <div v-if="activeCategory !== 'random'">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-bold text-sm text-gray-900">{{ $t('available_seats', 'Available') }} {{ activeCategory }} {{ $t('seats', 'seats') }}</h4>
                <span class="text-[10px] font-bold text-[#0D1DAD] bg-[#F0F4FF] px-2.5 py-0.5 rounded-full uppercase ">
                  {{ $t('traveler', 'Traveler') }} 1
                </span>
              </div>
              
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pb-4">
                  <button 
                      v-for="seat in currentCategorySeats" 
                      :key="seat.id"
                      @click="tempSelectedSeat = seat"
                      class="px-3 py-3 rounded-xl border flex flex-col items-center justify-center transition-all text-center focus:outline-none"
                      :class="tempSelectedSeat?.id === seat.id 
                        ? 'bg-[#0D1DAD] border-[#0D1DAD] text-white shadow-sm scale-105' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#0D1DAD]/40 hover:bg-[#F0F4FF] hover:text-[#0D1DAD]'"
                    >
                      <span class="font-bold text-sm mb-0.5">{{ seat.designator }}</span>
                      <span class="text-[10px] font-bold" :class="tempSelectedSeat?.id === seat.id ? 'text-white/90' : 'text-gray-500'">+{{ formatPriceValue(seat.price) }}</span>
                  </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-5 border-t border-gray-100 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.02)]">
            <div v-if="activeCategory !== 'random' && tempSelectedSeat" class="flex justify-between items-center mb-3">
              <span class="text-[13px] font-bold text-gray-500">{{ $t('selected_seat', 'Selected Seat:') }}</span>
              <span class="text-base font-bold text-gray-900">{{ tempSelectedSeat.designator }} (+{{ formatPriceValue(tempSelectedSeat.price) }})</span>
            </div>
            <button 
              @click="confirmSelection"
              :disabled="activeCategory !== 'random' && !tempSelectedSeat"
              class="w-full py-3.5 bg-[#0D1DAD] text-white rounded-xl font-bold text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0A1485] transition-colors shadow-md shadow-[#0D1DAD]/20"
            >
              {{ activeCategory === 'random' ? $t('confirm_preference', 'Confirm Preference') : $t('confirm_seat_selection', 'Confirm Seat Selection') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettings } from '~/composables/useSettings'
import { useTracking } from '@/composables/core/useTracking'
import { flightsApi } from '~/api_factory/modules/flights'

const props = defineProps({
  flightOffer: { type: Object, default: null },
  stay: { type: Object, default: null },
  traveller: { type: Object, default: null },
  totalPrice: { type: Number, default: 0 },
  selectedAddOns: { type: Array as () => any[], default: () => [] },
  selectedSeats: { type: Array as () => any[], default: () => [] }
})

const emit = defineEmits(['continue', 'back', 'update:selectedAddOns', 'update:selectedSeats', 'update:seatPrice'])

const { formatPrice, ancillaryPrices } = useSettings()
const tracking = useTracking()

const seatPreference = ref(props.selectedSeats.length > 0 ? 'handpick' : 'random')
const loadingSeats = ref(false)

const windowSeats = ref<any[]>([])
const aisleSeats = ref<any[]>([])
const middleSeats = ref<any[]>([])
const seatmaps = ref<any[]>([])

const windowSeatPrice = computed(() => windowSeats.value.length ? Math.min(...windowSeats.value.map(s => s.price)) : 0)
const aisleSeatPrice = computed(() => aisleSeats.value.length ? Math.min(...aisleSeats.value.map(s => s.price)) : 0)

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Drawer State
const isDrawerOpen = ref(false)
const activeCategory = ref('random') // 'window', 'aisle', or 'random'
const tempSelectedSeat = ref<any>(null)

const currentCategorySeats = computed(() => {
  if (activeCategory.value === 'window') return windowSeats.value
  if (activeCategory.value === 'aisle') return aisleSeats.value
  return []
})

const getDrawerDescription = () => {
  switch (activeCategory.value) {
    case 'window':
      return t('seat_window_desc', 'Window seats are perfect for taking in the view outside and resting comfortably. You can lean against the cabin wall and won\'t be disturbed by other passengers or crew moving around the aisles.')
    case 'aisle':
      return t('seat_aisle_desc', 'Aisle seats are ideal for quick and easy access. You can stretch your legs into the aisle and move around the cabin freely without having to climb over anyone else.')
    case 'random':
      return t('seat_random_desc', 'Let us handle the seating for you at no extra cost! Your seat will be assigned automatically before your flight departs. You may be seated in a window, aisle, or middle seat.')
    default:
      return ''
  }
}

const openDrawer = (category: string) => {
  activeCategory.value = category
  
  // Pre-select if they already chose one in this category
  if (category !== 'random' && props.selectedSeats.length > 0) {
    const existing = currentCategorySeats.value.find(s => s.id === props.selectedSeats[0].id)
    tempSelectedSeat.value = existing || null
  } else {
    tempSelectedSeat.value = null
  }

  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  setTimeout(() => {
    tempSelectedSeat.value = null
  }, 300) // Clear after animation
}

const confirmSelection = () => {
  seatPreference.value = activeCategory.value
  tracking.trackAction('seat_preference_changed', { preference: seatPreference.value })

  if (activeCategory.value === 'random') {
    emit('update:selectedSeats', [])
    emit('update:seatPrice', 0)
    
    // remove seat selection from addons
    let current = [...props.selectedAddOns].filter(a => a.id !== 'seat-selection-map')
    emit('update:selectedAddOns', current)
  } else if (tempSelectedSeat.value) {
    const seat = tempSelectedSeat.value
    const serviceId = seat.available_services[0].id
    const payload = [{
      id: seat.id,
      designator: seat.designator,
      price: seat.price,
      serviceId: serviceId
    }]
    
    emit('update:selectedSeats', payload)
    emit('update:seatPrice', seat.price)

    const current = [...props.selectedAddOns].filter(a => a.id !== 'seat-selection-map')
    current.push({
      id: 'seat-selection-map',
      name: `Seat Selection (${seat.designator})`,
      price: seat.price,
      type: 'internal'
    })
    emit('update:selectedAddOns', current)
  }
  
  closeDrawer()
}

const fetchSeatmap = async () => {
  loadingSeats.value = true
  try {
    const rawOffer = props.flightOffer?.rawOffer || props.flightOffer
    let provider = props.flightOffer?.provider
    if (!provider) {
      if (rawOffer?.slices) provider = 'duffel'
      else if (rawOffer?.itineraries) provider = 'amadeus'
    }
    const res = await flightsApi.getSeatmaps({ flightOffer: rawOffer, provider })
    if (res.data?.data) {
      seatmaps.value = res.data.data
      categorizeSeats(seatmaps.value[0])
    }
  } catch (err) {
    console.error('Failed to fetch seatmap', err)
  } finally {
    loadingSeats.value = false
  }
}

const categorizeSeats = (mapData: any) => {
  const wSeats: any[] = []
  const aSeats: any[] = []
  const mSeats: any[] = []

  if (!mapData || !mapData.cabins) return

  mapData.cabins.forEach((cabin: any) => {
    cabin.rows.forEach((row: any) => {
      const numSections = row.sections.length
      row.sections.forEach((section: any, sIdx: number) => {
        const elements = section.elements
        elements.forEach((element: any, eIdx: number) => {
          if (element.type === 'seat' && element.available_services?.length > 0) {
            const isLeftmost = (sIdx === 0 && eIdx === 0)
            const isRightmost = (sIdx === numSections - 1 && eIdx === elements.length - 1)
            const isWindow = isLeftmost || isRightmost

            const isAisleLeft = (sIdx > 0 && eIdx === 0)
            const isAisleRight = (sIdx < numSections - 1 && eIdx === elements.length - 1)
            const isAisle = isAisleLeft || isAisleRight

            const price = parseFloat(element.available_services[0].total_amount)
            const seatObj = { ...element, price, rowNumber: row.number }

            if (isWindow) wSeats.push(seatObj)
            else if (isAisle) aSeats.push(seatObj)
            else mSeats.push(seatObj)
          }
        })
      })
    })
  })

  windowSeats.value = wSeats
  aisleSeats.value = aSeats
  middleSeats.value = mSeats
}

onMounted(() => {
  if (props.selectedSeats.length > 0) {
    seatPreference.value = 'handpick'
  }
  fetchSeatmap()
})

const handleSeatPreferenceChange = () => {
  // Logic is now moved to confirmSelection in the drawer
}

const isSeatSpecificallySelected = (seat: any) => {
  return props.selectedSeats.some(s => s.id === seat.id)
}

const selectSpecificSeat = (seat: any) => {
  // Logic is now moved to confirmSelection in the drawer
}

const providerName = computed(() => {
  const p = props.flightOffer?.provider
  if (!p) {
    if (props.flightOffer?.rawOffer?.slices) return 'duffel'
    if (props.flightOffer?.rawOffer?.itineraries) return 'amadeus'
  }
  return p || 'unknown'
})

const baggageServices = computed(() => {
  const liveServices = props.flightOffer?.rawOffer?.available_services || []
  const bags = liveServices
    .filter((s: any) => s.type === 'baggage')
    .map((s: any) => ({
      id: s.id,
      name: s.metadata?.label || `Extra ${s.metadata?.type || 'Baggage'}`,
      price: parseFloat(s.total_amount),
      type: 'duffel',
      raw: s
    }))

  return bags
})

const isAddonSelected = (id: string) => {
  return props.selectedAddOns.some((a: any) => a.id === id)
}

const toggleAddon = (addon: any) => {
  const current = [...props.selectedAddOns]
  const idx = current.findIndex((a: any) => a.id === addon.id)
  
  if (idx >= 0) {
    current.splice(idx, 1)
    tracking.trackAction('addon_removed', { addonId: addon.id, addonName: addon.name })
  } else {
    current.push({ 
      id: addon.id, 
      name: addon.name, 
      price: addon.price,
      type: addon.type,
      service_id: addon.type === 'duffel' ? addon.id : null
    })
    tracking.trackAction('addon_selected', { addonId: addon.id, addonName: addon.name })
  }
  emit('update:selectedAddOns', current)
}

const toggleVipSupport = () => {
  const current = [...props.selectedAddOns]
  const idx = current.findIndex((a: any) => a.id === 'vip-support')
  
  if (idx >= 0) {
    current.splice(idx, 1)
    tracking.trackAction('addon_removed', { addonId: 'vip-support', addonName: 'VIP Priority Support' })
  } else {
    current.push({ 
      id: 'vip-support', 
      name: 'VIP Priority Support', 
      price: ancillaryPrices.value.vipSupport || 15,
      type: 'internal',
      service_id: null
    })
    tracking.trackAction('addon_selected', { addonId: 'vip-support', addonName: 'VIP Priority Support' })
  }
  emit('update:selectedAddOns', current)
}

const formatPriceValue = (price: number) => {
  return formatPrice(price || 0)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
