<template>
  <div class="tr-root">
    <FullScreenLoader :show="loading" moduleName="Transfers" />

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="tr-hero relative z-30 bg-[#0D1DAD]">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(125%_120%_at_50%_-25%,#1A2ED4_0%,#0D1DAD_46%,#0A1485_100%)]"></div>
        <div
          class="absolute inset-0 opacity-[0.20]"
          style="background-image: radial-gradient(rgba(255,255,255,0.45) 1.5px, transparent 1.5px); background-size: 24px 24px;"
        ></div>
        <div class="absolute -right-24 top-6 h-72 w-72 rounded-full bg-[#EB4405]/20 blur-3xl"></div>
        <div class="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-[#3B82F6]/25 blur-3xl"></div>
      </div>

      <div class="tr-wrap relative z-10">
        <div class="tr-headline">
          <span class="tr-eyebrow text-white/70">✦ Airport Transfers</span>
          <h1 class="tr-h1 text-white">
            <template v-if="searchQuery.origin">
              From <span class="text-[#FF8A00]">{{ searchQuery.origin }}</span>
            </template>
            <template v-else>
              Seamless <span class="text-[#FF8A00]">pickups.</span>
            </template>
          </h1>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="tr-bar">

          <!-- ORIGIN -->
          <div class="tr-fld-wrap">
            <LocationPicker 
              v-model="searchQuery.origin" 
              label="Pick-up" 
              placeholder="Airport or city" 
              @select="onOriginSelect"
            />
          </div>

          <div class="tr-bar-sep"></div>

          <!-- DESTINATION -->
          <div class="tr-fld-wrap">
            <LocationPicker 
              v-model="searchQuery.destination" 
              label="Drop-off" 
              placeholder="Destination" 
              @select="onDestinationSelect"
            />
          </div>

          <div class="tr-bar-sep"></div>

          <!-- DATE -->
          <div class="tr-fld-wrap">
            <FlightDateRangePicker 
              :departure="searchQuery.date" 
              mode="oneway" 
              @update:departure="(v) => searchQuery.date = v"
            />
          </div>

          <div class="tr-bar-actions">
            <button class="tr-search-btn" :class="{ 'tr-search-btn--busy': loading }" @click="handleSearch">
              <span v-if="!loading">Search</span>
              <span v-else class="tr-spin"></span>
            </button>
            <button class="tr-search-btn tr-search-btn--secondary" @click="showEditSearch = true">
              Edit
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════ CONTENT ═══════════════ -->
    <div class="tr-wrap tr-main">
      <div class="tr-body">
        
        <!-- Sidebar filters -->
        <aside class="tr-sidebar">
          <div class="tr-sbar">
            <p class="tr-sb-label">Transfer Type</p>
            <div class="tr-chips">
              <button v-for="type in ['Private', 'Shared', 'Luxury']" :key="type" 
                class="tr-chip" 
                :class="{ 'tr-chip--on': selectedTypes.includes(type) }"
                @click="toggleType(type)"
              >{{ type }}</button>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="tr-results">
          <div v-if="tripType === 'return'" class="mb-6 flex items-center gap-4 border-b border-gray-100 pb-4">
            <div class="flex-1 flex flex-col">
               <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 1</span>
               <span class="text-lg font-bold" :class="step === 1 ? 'text-blue-600' : 'text-gray-900'">Arrival Transfer</span>
            </div>
            <div class="flex-1 flex flex-col">
               <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 2</span>
               <span class="text-lg font-bold" :class="step === 2 ? 'text-blue-600' : 'text-gray-400'">Departure Transfer</span>
            </div>
          </div>

          <div v-if="loading" class="tr-loading">
            <div v-for="i in 3" :key="i" class="tr-skel"></div>
          </div>

          <div v-else-if="step === 1 && !outboundTransfers.length" class="tr-empty">
             <div class="tr-empty-ico"><Car class="w-12 h-12 text-gray-300 mx-auto" /></div>
             <h3>{{ tripType === 'return' ? 'No arrival transfers found' : 'No transfers found' }}</h3>
             <p>Try searching different locations or dates.</p>
          </div>

          <div v-else-if="step === 2 && !returnTransfers.length" class="tr-empty">
             <div class="tr-empty-ico"><Car class="w-12 h-12 text-gray-300 mx-auto" /></div>
             <h3>No departure transfers found</h3>
             <p>Try searching different locations or dates.</p>
          </div>

          <div v-else-if="!displayedTransfers.length" class="tr-empty">
             <div class="tr-empty-ico"><Car class="w-12 h-12 text-gray-300 mx-auto" /></div>
             <h3 class="text-base font-bold text-gray-900 mt-2">No transfers match selected filters</h3>
             <p class="text-sm text-gray-500 mt-1">Try selecting different filter options or reset filters.</p>
             <button 
               @click="selectedTypes = []" 
               class="mt-4 px-6 py-2.5 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all"
             >
               Clear Filters
             </button>
          </div>

          <div v-else class="tr-list space-y-4">
             <TransferCard 
               v-for="transfer in displayedTransfers" 
               :key="transfer.offerId || transfer.id" 
               :transfer="transfer"
               @select="selectTransfer" 
             />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Search Modal -->
    <Teleport to="body">
      <Transition name="tr-modal-fade">
        <div 
          v-if="showEditSearch" 
          class="fixed inset-0 z-[1000005] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          @click.self="showEditSearch = false"
        >
          <div class="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#0D1DAD]/10 flex items-center justify-center text-[#0D1DAD]">
                  <Car class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="text-lg font-black text-gray-900 leading-tight">Edit Transfer Search</h3>
                  <p class="text-xs text-gray-500 font-medium">Modify locations, dates, pickup times or passengers</p>
                </div>
              </div>
              <button 
                type="button"
                @click="showEditSearch = false" 
                class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                aria-label="Close"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Content Form -->
            <div class="p-6 sm:p-8 space-y-6">
              <!-- One-way / Return Mode Selection -->
              <div class="flex items-center gap-4">
                <label 
                  class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border text-sm font-bold transition-all select-none"
                  :class="tripType === 'oneway' ? 'border-[#0D1DAD] bg-blue-50/50 text-[#0D1DAD]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                >
                  <input type="radio" value="oneway" v-model="tripType" class="sr-only" />
                  <span class="w-3.5 h-3.5 rounded-full border flex items-center justify-center" :class="tripType === 'oneway' ? 'border-[#0D1DAD]' : 'border-gray-300'">
                    <span v-if="tripType === 'oneway'" class="w-2 h-2 rounded-full bg-[#0D1DAD]"></span>
                  </span>
                  One-way Transfer
                </label>
                <label 
                  class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border text-sm font-bold transition-all select-none"
                  :class="tripType === 'return' ? 'border-[#0D1DAD] bg-blue-50/50 text-[#0D1DAD]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                >
                  <input type="radio" value="return" v-model="tripType" class="sr-only" />
                  <span class="w-3.5 h-3.5 rounded-full border flex items-center justify-center" :class="tripType === 'return' ? 'border-[#0D1DAD]' : 'border-gray-300'">
                    <span v-if="tripType === 'return'" class="w-2 h-2 rounded-full bg-[#0D1DAD]"></span>
                  </span>
                  Return Transfer
                </label>
              </div>

              <!-- Main Fields Row: Pick-up & Drop-off -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="border border-gray-200 rounded-2xl p-2 bg-gray-50/50 hover:border-gray-300 transition-colors focus-within:border-[#0D1DAD] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0D1DAD]/20">
                  <LocationPicker 
                    v-model="searchQuery.origin" 
                    label="Pick-up Location" 
                    placeholder="Airport or city address" 
                    @select="onOriginSelect"
                  />
                </div>
                <div class="border border-gray-200 rounded-2xl p-2 bg-gray-50/50 hover:border-gray-300 transition-colors focus-within:border-[#0D1DAD] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0D1DAD]/20">
                  <LocationPicker 
                    v-model="searchQuery.destination" 
                    label="Drop-off Destination" 
                    placeholder="Hotel, landmark or address" 
                    @select="onDestinationSelect"
                  />
                </div>
              </div>

              <!-- Dates & Times & Passengers -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div class="border border-gray-200 rounded-2xl p-2 bg-gray-50/50 hover:border-gray-300 transition-colors">
                  <FlightDateRangePicker 
                    :departure="searchQuery.date" 
                    mode="oneway" 
                    departureLabel="Pick-up Date"
                    @update:departure="(v) => searchQuery.date = v"
                  />
                </div>
                <div class="border border-gray-200 rounded-2xl p-3 bg-gray-50/50 flex flex-col justify-center">
                  <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Pick-up Time</span>
                  <CustomTimePicker v-model="searchQuery.time">
                    <template #default="{ value }">
                      <div class="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-900">
                        <Clock class="w-4 h-4 text-gray-400" />
                        <span>{{ value || '12:00' }}</span>
                      </div>
                    </template>
                  </CustomTimePicker>
                </div>
                <div class="border border-gray-200 rounded-2xl p-2 bg-gray-50/50 flex flex-col justify-center">
                  <Occupancypicker 
                    label="Passengers" 
                    variant="flight" 
                    v-model:adults="searchQuery.adults"
                  />
                </div>
              </div>

              <!-- Return Fields (if Return selected) -->
              <div v-if="tripType === 'return'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div class="border border-gray-200 rounded-2xl p-2 bg-gray-50/50">
                  <FlightDateRangePicker 
                    :departure="searchQuery.returnDate" 
                    mode="oneway" 
                    departureLabel="Return Date"
                    @update:departure="(v) => searchQuery.returnDate = v"
                  />
                </div>
                <div class="border border-gray-200 rounded-2xl p-3 bg-gray-50/50 flex flex-col justify-center">
                  <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Return Time</span>
                  <CustomTimePicker v-model="searchQuery.returnTime">
                    <template #default="{ value }">
                      <div class="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-900">
                        <Clock class="w-4 h-4 text-gray-400" />
                        <span>{{ value || '12:00' }}</span>
                      </div>
                    </template>
                  </CustomTimePicker>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                type="button" 
                class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showEditSearch = false"
              >
                Cancel
              </button>
              <button 
                type="button" 
                class="px-6 py-2.5 rounded-xl bg-[#0D1DAD] hover:bg-[#0A1485] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                :class="{ 'opacity-70 cursor-not-allowed': loading }"
                :disabled="loading"
                @click="applyModalSearch"
              >
                <span v-if="!loading">Apply & Search Transfers</span>
                <span v-else class="tr-spin"></span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useSearchTransfers } from '@/composables/modules/transfers/useSearchTransfers'
import { Car, Clock, X } from 'lucide-vue-next'
import TransferCard from '@/components/TransferCard.vue'
import LocationPicker from '@/components/LocationPicker.vue'
import FlightDateRangePicker from '@/components/FlightDateRangePicker.vue'
import CustomTimePicker from '@/components/ui/CustomTimePicker.vue'
import Occupancypicker from '@/components/Occupancypicker.vue'
import { flightsApi } from '@/api_factory/modules/flights'

const { loading, transfers, outboundTransfers, returnTransfers, searchTransfers } = useSearchTransfers()

const selectedTypes = ref<string[]>([])
const tripType = ref('oneway')
const step = ref(1) // 1: Outbound, 2: Return
const selectedOutbound = ref<any>(null)
const showEditSearch = ref(false)

/** Last locations picked from the LocationPicker dropdown (carry geoCode + city name). */
const selectedOrigin = ref<any>(null)
const selectedDestination = ref<any>(null)

const searchQuery = ref({ origin: '', destination: '', date: '', time: '12:00', returnDate: '', returnTime: '12:00', adults: 2 })

const onOriginSelect = (loc: any) => { selectedOrigin.value = loc }
const onDestinationSelect = (loc: any) => { selectedDestination.value = loc }

const toggleType = (t: string) => {
  const i = selectedTypes.value.indexOf(t)
  if (i >= 0) selectedTypes.value.splice(i, 1); else selectedTypes.value.push(t)
}

const isTransferMatch = (t: any, type: string) => {
  const normType = type.toUpperCase().trim()
  const tCat = String(t.category?.name || t.category || '').toUpperCase()
  const tType = String(t.transferType || '').toUpperCase()
  const vName = String(t.vehicle_name || t.vehicle?.name || t.vehicleDescription || '').toUpperCase()
  const fullText = `${tCat} ${tType} ${vName}`

  if (normType === 'PRIVATE') {
    return fullText.includes('PRIVATE') || fullText.includes('SEDAN') || fullText.includes('SUV') || fullText.includes('MINIVAN') || fullText.includes('STANDARD')
  }
  if (normType === 'SHARED') {
    return fullText.includes('SHARED') || fullText.includes('SHUTTLE') || fullText.includes('BUS') || fullText.includes('COACH')
  }
  if (normType === 'LUXURY') {
    return fullText.includes('LUXURY') || fullText.includes('VIP') || fullText.includes('PREMIUM') || fullText.includes('FIRST') || fullText.includes('BUSINESS') || fullText.includes('MERCEDES') || fullText.includes('BMW') || fullText.includes('AUDI') || fullText.includes('TESLA')
  }
  return true
}

const displayedTransfers = computed(() => {
  const list = step.value === 1 ? outboundTransfers.value : returnTransfers.value
  if (!selectedTypes.value.length) return list
  return list.filter(t => selectedTypes.value.some(type => isTransferMatch(t, type)))
})

/**
 * Maps the sidebar chips onto the backend `transferType` enum.
 * Only Private/Shared exist server-side; "Luxury" is a vehicle class, so it
 * never narrows the search. Nothing (or both) selected => ALL.
 */
const selectedTransferType = computed<'PRIVATE' | 'SHARED' | 'ALL'>(() => {
  const hasPrivate = selectedTypes.value.includes('Private')
  const hasShared = selectedTypes.value.includes('Shared')
  if (hasPrivate && !hasShared) return 'PRIVATE'
  if (hasShared && !hasPrivate) return 'SHARED'
  return 'ALL'
})

/**
 * Best-effort `{ cityName, geo }` resolution for a transfer endpoint.
 * Prefers the LocationPicker selection (it already carries coordinates) and only
 * falls back to `GET /flights/locations` when needed. It never throws and never
 * blocks the search for more than a couple of seconds.
 */
const resolvePlace = async (code: string, selected: any) => {
  const result: { cityName?: string; geo?: string } = {}

  const pickedLat = selected?.geoCode?.latitude ?? selected?.latitude
  const pickedLon = selected?.geoCode?.longitude ?? selected?.longitude
  if (typeof pickedLat === 'number' && typeof pickedLon === 'number') {
    result.geo = `${pickedLat},${pickedLon}`
  }
  const pickedCity = selected?.address?.cityName || selected?.city_name || selected?.cityName
  if (pickedCity && !selected?.isCustom) result.cityName = pickedCity

  if (!code || code.length !== 3 || result.geo) return result

  try {
    const pick = (payload: any) => {
      const list = Array.isArray(payload)
        ? payload
        : (Array.isArray(payload?.results) ? payload.results : [])
      return {
        list,
        match: list.find((item: any) => item?.geoCode?.latitude && item?.geoCode?.longitude)
          || list.find((item: any) => typeof item?.latitude === 'number' && typeof item?.longitude === 'number')
          || null,
      }
    }

    const keyword = pickedCity || code
    const lookup = flightsApi.searchAirports(keyword)
    const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 2500))
    const response: any = await Promise.race([lookup, timeout])
    let { list, match } = pick(response?.data?.data ?? response?.data)

    // A single-airport keyword (LHR, JFK, …) can come back as one city
    // suggestion with an empty geoCode but a city IATA — retry once.
    const cityCode = list[0]?.iataCode
    if (!match && cityCode && String(cityCode).toUpperCase() !== keyword.toUpperCase()) {
      const retry: any = await Promise.race([
        flightsApi.searchAirports(cityCode),
        new Promise((resolve) => setTimeout(() => resolve(null), 2500)),
      ])
      match = pick(retry?.data?.data ?? retry?.data).match
    }

    if (match) {
      const lat = match.geoCode?.latitude ?? match.latitude
      const lon = match.geoCode?.longitude ?? match.longitude
      if (lat && lon) result.geo = `${lat},${lon}`
      if (!result.cityName) result.cityName = match.address?.cityName || match.name
    }
  } catch (e) {
    console.warn('Failed to resolve transfer location', e)
  }

  return result
}

const handleSearch = async () => {
  const extractIata = (str: string) => {
    if (!str) return '';
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1].toUpperCase() : str.toUpperCase();
  }
  const fromCode = extractIata(searchQuery.value.origin);
  const toCode = extractIata(searchQuery.value.destination);
  
  step.value = 1
  selectedOutbound.value = null

  // Dynamically resolve the drop-off (and pick-up for return trips) so the
  // suppliers that filter by geography get usable coordinates + a city name.
  const destPlace = await resolvePlace(toCode, selectedDestination.value)
  const originPlace = tripType.value === 'return' ? await resolvePlace(fromCode, selectedOrigin.value) : null

  const passengers = Number(searchQuery.value.adults) || 1
  const transferType = selectedTransferType.value
  const promises = []
  
  // 1. Outbound Search
  promises.push(searchTransfers({
    startLocationCode: fromCode || 'DXB',
    endCityName: destPlace.cityName || toCode || 'Dubai',
    ...(destPlace.geo && { endGeoCode: destPlace.geo }),
    startDateTime: `${searchQuery.value.date}T${searchQuery.value.time}:00`,
    passengers,
    transferType,
  }, false))

  // 2. Return Search
  if (tripType.value === 'return') {
    promises.push(searchTransfers({
      // Swap for return
      startLocationCode: toCode || 'DXB', 
      endCityName: originPlace?.cityName || fromCode || 'Dubai',
      ...(originPlace?.geo && { endGeoCode: originPlace.geo }),
      startDateTime: `${searchQuery.value.returnDate}T${searchQuery.value.returnTime}:00`,
      passengers,
      transferType,
    }, true))
  }

  await Promise.all(promises)
}

const selectTransfer = (t: any) => {
  if (tripType.value === 'return' && step.value === 1) {
    selectedOutbound.value = t
    step.value = 2 // Move to return selection
    return
  }

  const query: any = {
    type: 'transfer',
    id: t.offerId || t.id,
    provider: t.provider,
    name: t.vehicleDescription,
    // `price` stays the NET supplier rate (the backend adds commission to it);
    // `priceWithCommission` is the customer-facing amount.
    price: Number(t.price) || 0,
    priceWithCommission: Number(t.priceWithCommission ?? t.price) || 0,
    currency: t.currency || 'USD',
  }
  
  if (tripType.value === 'return') {
    query.returnId = t.offerId || t.id
    query.returnProvider = t.provider
    query.returnName = t.vehicleDescription
    query.returnPrice = Number(t.price) || 0
    query.returnPriceWithCommission = Number(t.priceWithCommission ?? t.price) || 0
    query.id = selectedOutbound.value?.offerId || selectedOutbound.value?.id
    query.provider = selectedOutbound.value?.provider
    query.name = selectedOutbound.value?.vehicleDescription
    query.price = Number(selectedOutbound.value?.price) || 0
    query.priceWithCommission = Number(
      selectedOutbound.value?.priceWithCommission ?? selectedOutbound.value?.price
    ) || 0
  }

  if (import.meta.client) {
    sessionStorage.setItem('flybeth_checkout_payload', JSON.stringify(query))
  }
  navigateTo({ path: '/checkout' })
}

const applyModalSearch = () => {
  if (import.meta.client) {
    try {
      localStorage.setItem('flybeth_last_transfers_search', JSON.stringify({
        origin: searchQuery.value.origin,
        destination: searchQuery.value.destination,
        date: searchQuery.value.date,
        time: searchQuery.value.time,
        returnDate: searchQuery.value.returnDate,
        returnTime: searchQuery.value.returnTime,
        adults: Number(searchQuery.value.adults) || 1,
        tripType: tripType.value
      }))
    } catch (e) {}
  }
  showEditSearch.value = false
  handleSearch()
}

const handleExternalTransferSearch = (e: any) => {
  const detail = e.detail
  if (detail) {
    if (detail.origin) searchQuery.value.origin = detail.origin
    if (detail.destination) searchQuery.value.destination = detail.destination
    if (detail.date) searchQuery.value.date = detail.date
    if (detail.time) searchQuery.value.time = detail.time
    if (detail.returnDate) searchQuery.value.returnDate = detail.returnDate
    if (detail.returnTime) searchQuery.value.returnTime = detail.returnTime
    if (detail.adults) searchQuery.value.adults = Number(detail.adults)
    if (detail.tripType) tripType.value = detail.tripType
  }
  showEditSearch.value = false
  handleSearch()
}

onMounted(() => {
  tripType.value = 'oneway'
  searchQuery.value.origin = 'DXB'
  searchQuery.value.destination = 'Dubai Marina'
  searchQuery.value.date = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem('flybeth_last_transfers_search')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.tripType) tripType.value = parsed.tripType
        if (parsed.origin) searchQuery.value.origin = parsed.origin
        if (parsed.destination) searchQuery.value.destination = parsed.destination
        if (parsed.date) searchQuery.value.date = parsed.date
        if (parsed.time) searchQuery.value.time = parsed.time
        if (parsed.returnDate) searchQuery.value.returnDate = parsed.returnDate
        if (parsed.returnTime) searchQuery.value.returnTime = parsed.returnTime
        if (parsed.adults) searchQuery.value.adults = Number(parsed.adults)
      }
    } catch(e) {}
    window.addEventListener('flybeth:transfer-search', handleExternalTransferSearch)
  }
  
  handleSearch()
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('flybeth:transfer-search', handleExternalTransferSearch)
  }
})
</script>

<style scoped>
.tr-root { min-height: 100vh; background: #fff; font-family: 'Satoshi', sans-serif; color: #111; }
.tr-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.tr-hero { background: #0D1DAD; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 40px 0 52px; position: relative; z-index: 30; }
.tr-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.tr-headline { margin-bottom: 24px; position: relative; z-index: 10; }
.tr-eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; color: rgba(255, 255, 255, 0.7); letter-spacing: 0.2em; }
.tr-h1 { font-size: clamp(24px, 4vw, 38px); font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
.tr-h1 em, .tr-h1 span { font-style: normal; color: #FF8A00; }

.tr-bar { 
  background: #fff; 
  border: 1.5px solid #eaeaea; 
  border-radius: 9999px; 
  display: flex; 
  align-items: center; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.06); 
  position: relative; 
  z-index: 50; 
  padding: 6px 8px;
}
.tr-fld-wrap { 
  flex: 1; 
  min-width: 0; 
}
.tr-bar-sep { width: 1px; height: 36px; background: #f0f0ea; margin: 0 4px; flex-shrink: 0; }
.tr-bar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  flex-shrink: 0;
}
.tr-search-btn { 
  background: #0D1DAD; 
  color: #fff; 
  border: none; 
  padding: 0 24px; 
  height: 46px; 
  border-radius: 9999px; 
  font-weight: 700; 
  font-size: 13px;
  cursor: pointer; 
  transition: all 0.2s ease; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.tr-search-btn:hover { background: #002a66; }
.tr-search-btn--secondary { 
  background: #f1f5f9; 
  color: #1e293b; 
}
.tr-search-btn--secondary:hover { background: #e2e8f0; color: #0f172a; }

.tr-main { padding-top: 36px; padding-bottom: 80px; }
.tr-body { display: grid; grid-template-columns: 220px 1fr; gap: 36px; }
.tr-sbar { position: sticky; top: 20px; }
.tr-sb-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
.tr-chips { display: flex; flex-direction: column; gap: 8px; }
.tr-chip { 
  padding: 10px 16px; 
  border: 1.5px solid #e2e8f0; 
  background: #fff; 
  border-radius: 9999px; 
  font-size: 13px; 
  font-weight: 600;
  color: #334155;
  cursor: pointer; 
  text-align: center; 
  transition: all 0.2s ease;
}
.tr-chip:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}
.tr-chip--on { 
  border-color: #0D1DAD; 
  background: #0D1DAD; 
  color: #fff; 
  box-shadow: 0 4px 12px rgba(13, 29, 173, 0.2); 
}
.tr-skel { height: 120px; background: #f9f9f9; border-radius: 20px; margin-bottom: 20px; }
.tr-empty { text-align: center; padding: 60px 20px; background: #f8fafc; border-radius: 24px; border: 1.5px dashed #e2e8f0; }
.tr-empty-ico { margin-bottom: 12px; }
.tr-spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive styles */
@media (max-width: 860px) {
  .tr-wrap { padding: 0 16px; }
  .tr-hero { padding: 24px 0 32px; }
  .tr-headline { margin-bottom: 18px; }
  .tr-bar {
    flex-direction: column;
    align-items: stretch;
    border-radius: 24px;
    padding: 14px;
    gap: 8px;
  }
  .tr-bar-sep {
    display: none;
  }
  .tr-fld-wrap {
    width: 100%;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 6px;
  }
  .tr-bar-actions {
    margin-left: 0;
    margin-top: 6px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;
  }
  .tr-search-btn {
    width: 100%;
    height: 48px;
  }
  .tr-main { padding-top: 24px; padding-bottom: 48px; }
  .tr-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .tr-sidebar {
    width: 100%;
  }
  .tr-sbar {
    position: static;
  }
  .tr-chips {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  .tr-chip {
    padding: 8px 18px;
    border-radius: 9999px;
    font-size: 13px;
  }
}

/* Modal Styles */
.tr-modal-fade-enter-active, .tr-modal-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.tr-modal-fade-enter-from, .tr-modal-fade-leave-to { opacity: 0; transform: scale(0.98); }
</style>
