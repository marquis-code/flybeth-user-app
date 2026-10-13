<template>
  <div class="tr-root">
    <FullScreenLoader :show="loading" moduleName="Transfers" />

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="tr-hero">
      <div class="tr-hero-bg">
        <div class="tr-orb tr-orb--a"></div>
        <div class="tr-orb tr-orb--b"></div>
      </div>

      <div class="tr-wrap">
        <div class="tr-headline">
          <span class="tr-eyebrow">✦ Airport Transfers</span>
          <h1 class="tr-h1">
            <template v-if="searchQuery.origin">
              From <em>{{ searchQuery.origin }}</em>
            </template>
            <template v-else>
              Seamless<br><em>pickups.</em>
            </template>
          </h1>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="tr-bar">

          <!-- ORIGIN -->
          <div class="tr-fld-wrap" style="flex: 1; border-right: 1px solid #e2e8f0;">
            <LocationPicker 
              v-model="searchQuery.origin" 
              label="Pick-up" 
              placeholder="Airport or city" 
              @select="onOriginSelect"
            />
          </div>

          <div class="tr-bar-sep"></div>

          <!-- DESTINATION -->
          <div class="tr-fld-wrap" style="flex: 1; border-right: 1px solid #e2e8f0;">
            <LocationPicker 
              v-model="searchQuery.destination" 
              label="Drop-off" 
              placeholder="Destination" 
              @select="onDestinationSelect"
            />
          </div>

          <div class="tr-bar-sep"></div>

          <!-- DATE -->
          <div class="tr-fld-wrap" style="flex: 1; border-right: 1px solid #e2e8f0;">
            <FlightDateRangePicker 
              :departure="searchQuery.date" 
              mode="oneway" 
              @update:departure="(v) => searchQuery.date = v"
            />
          </div>

          <button class="tr-search-btn" :class="{ 'tr-search-btn--busy': loading }" @click="handleSearch">
            <span v-if="!loading">Search</span>
            <span v-else class="tr-spin"></span>
          </button>
          <button class="tr-search-btn tr-search-btn--secondary" @click="showEditSearch = true">
            Edit
          </button>
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

          <div v-else class="tr-list">
             <TransferCard 
               v-for="transfer in (step === 1 ? outboundTransfers : returnTransfers)" 
               :key="transfer.offerId || transfer.id" 
               :transfer="transfer"
               @select="selectTransfer" 
             />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Search Modal -->
    <div v-if="showEditSearch" class="tr-modal-overlay" @click.self="showEditSearch = false">
      <div class="tr-modal-content">
        <button class="tr-modal-close" @click="showEditSearch = false">&times;</button>
        <SearchWidget defaultTab="Transfers" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, computed, onMounted, nextTick } from 'vue'
import { useSearchTransfers } from '@/composables/modules/transfers/useSearchTransfers'
import { Car } from 'lucide-vue-next'
import TransferCard from '@/components/TransferCard.vue'
import LocationPicker from '@/components/LocationPicker.vue'
import FlightDateRangePicker from '@/components/FlightDateRangePicker.vue'
import SearchWidget from '@/components/SearchWidget.vue'
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
  }
  
  handleSearch()
})
</script>

<style scoped>
.tr-root { min-height: 100vh; background: #fff; font-family: 'Satoshi', sans-serif; color: #111; }
.tr-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.tr-hero { background: #fdfdfb; border-bottom: 1px solid #f0f0ea; padding: 60px 0 80px; position: relative; }
.tr-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.tr-orb { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.15; }
.tr-orb--a { width: 300px; height: 300px; background: #93c5fd; top: -50px; right: 10%; }
.tr-orb--b { width: 200px; height: 200px; background: #c4b5fd; bottom: -20px; left: 5%; }
.tr-headline { margin-bottom: 30px; }
.tr-eyebrow { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #bbb; letter-spacing: 0.1em; }
.tr-h1 { font-size: 40px; font-weight: 700; color: #111; letter-spacing: -0.02em; }
.tr-h1 em { font-style: normal; color: #3b82f6; }
.tr-bar { background: #fff; border: 1.5px solid #eaeaea; border-radius: 20px; display: flex; align-items: stretch; box-shadow: 0 4px 20px rgba(0,0,0,0.04); position: relative; z-index: 50; }
.tr-fld { flex: 1; position: relative; cursor: pointer; }
.tr-fld-inner { padding: 15px 20px; display: flex; align-items: center; gap: 12px; }
.tr-fld-inner:hover { background: #f9f9f9; border-radius: 18px; }
.tr-fld-ico { color: #ccc; }
.tr-fld-lbl { font-size: 9px; font-weight: 700; color: #bbb; text-transform: uppercase; display: block; }
.tr-fld-val { font-size: 13px; font-weight: 500; color: #444; }
.tr-fld-val--set { color: #111; }
.tr-bar-sep { width: 1px; background: #f0f0ea; margin: 12px 0; }
.tr-search-btn { background: #111; color: #fff; border: none; padding: 0 18px; border-radius: 14px; margin: 6px; font-weight: 600; cursor: pointer; }
.tr-search-btn:hover { background: #3b82f6; }
.tr-search-btn--secondary { background: #f0f0ea; color: #111; }
.tr-search-btn--secondary:hover { background: #e2e8f0; color: #111; }
.tr-drop { position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); width: 280px; z-index: 100; padding: 8px; }
.tr-drop-search { padding: 8px; border-bottom: 1px solid #f5f5f5; margin-bottom: 8px; }
.tr-drop-input { width: 100%; border: none; outline: none; font-size: 13px; }
.tr-loc-result { width: 100%; text-align: left; padding: 10px; border: none; background: none; font-size: 13px; cursor: pointer; border-radius: 8px; }
.tr-loc-result:hover { background: #f0f7ff; }
.tr-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; padding: 10px; }
.tr-cal-dow { font-size: 10px; color: #bbb; text-align: center; }
.tr-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 11px; cursor: pointer; border-radius: 4px; }
.tr-cal-cell--sel { background: #3b82f6; color: #fff; }
.tr-main { padding-top: 40px; padding-bottom: 80px; }
.tr-body { display: grid; grid-template-columns: 200px 1fr; gap: 40px; }
.tr-sbar { position: sticky; top: 20px; }
.tr-sb-label { font-size: 10px; font-weight: 700; color: #bbb; text-transform: uppercase; margin-bottom: 15px; }
.tr-chips { display: flex; flex-direction: column; gap: 8px; }
.tr-chip { padding: 8px 12px; border: 1px solid #eee; background: #fff; border-radius: 10px; font-size: 12px; cursor: pointer; text-align: left; }
.tr-chip--on { border-color: #3b82f6; background: #f0f7ff; color: #3b82f6; font-weight: 600; }
.tr-skel { height: 120px; background: #f9f9f9; border-radius: 15px; margin-bottom: 20px; }
.tr-empty { text-align: center; padding: 100px 0; }
.tr-empty-ico { font-size: 40px; margin-bottom: 20px; }
.tr-spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal Styles */
.tr-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-start; justify-content: center; z-index: 9999; padding: 60px 20px; backdrop-filter: blur(4px); overflow-y: auto; }
.tr-modal-content { background: #fff; border-radius: 24px; padding: 20px; max-width: 1200px; width: 100%; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.2); overflow: visible; }
.tr-modal-close { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #888; z-index: 999999; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #f5f5f5; }
.tr-modal-close:hover { background: #eee; color: #111; }
</style>
