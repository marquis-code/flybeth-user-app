<template>
  <div class="cp-root" @mousedown="handleGlobalMousedown">

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="cp-hero">
      <div class="cp-hero-bg">
        <div class="cp-orb cp-orb--a"></div>
        <div class="cp-orb cp-orb--b"></div>
      </div>

      <div class="cp-wrap">

        <!-- Dynamic headline -->
        <div class="cp-headline">
          <span class="cp-eyebrow">✦ Car Rental Search</span>
          <h1 class="cp-h1">
            <template v-if="searchQuery.pickUpLocation">
              Renting in <em>{{ searchQuery.pickUpLocation }}</em>
            </template>
            <template v-else>
              Rent<br><em>any car.</em>
            </template>
          </h1>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="cp-bar">

          <!-- LOCATION field -->
          <div class="cp-fld cp-fld--loc" :class="{ 'cp-fld--active': activeField === 'loc' }" ref="locRef">
            <div class="cp-fld-inner" @click="openField('loc')">
              <svg class="cp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              <div class="cp-fld-text">
                <span class="cp-fld-lbl">Pick-up Location</span>
                <span class="cp-fld-val" :class="{ 'cp-fld-val--set': searchQuery.pickUpLocation }">
                  {{ searchQuery.pickUpLocation || 'City or airport' }}
                </span>
              </div>
            </div>
            <!-- Location dropdown -->
            <Transition name="cd">
              <div v-if="activeField === 'loc'" class="cp-drop cp-drop--loc" @mousedown.stop>
                <div class="cp-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="locInputRef" v-model="locQuery" placeholder="Search city or airport…" class="cp-drop-input" @input="searchLocations" />
                  <button v-if="locQuery" class="cp-drop-clear" @click="locQuery = ''; searchQuery.pickUpLocation = ''">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div v-if="!locQuery" class="cp-drop-section">
                  <span class="cp-drop-sec-label">Popular locations</span>
                  <div class="cp-drop-grid">
                    <button v-for="p in popularLocations" :key="p.code" class="cp-pop-item" @click="selectLocation(p)">
                      <span class="cp-pop-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </span>
                      <span class="cp-pop-name">{{ p.city }}</span>
                      <span class="cp-pop-code">{{ p.code }}</span>
                    </button>
                  </div>
                </div>
                <div v-else class="cp-drop-results">
                  <button v-for="r in locationResults" :key="r.code" class="cp-loc-result" @click="selectLocation(r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="cp-loc-city">{{ r.city }}</span>
                    <span class="cp-loc-code">{{ r.code }}</span>
                  </button>
                  <div v-if="!locationResults.length" class="cp-drop-empty">No results for "{{ locQuery }}"</div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="cp-bar-sep"></div>

          <!-- PICK-UP DATE field -->
          <div class="cp-fld cp-fld--date" :class="{ 'cp-fld--active': activeField === 'pickup' }" ref="pickupRef">
            <div class="cp-fld-inner" @click="openField('pickup')">
              <svg class="cp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div class="cp-fld-text">
                <span class="cp-fld-lbl">Pick-up Date</span>
                <span class="cp-fld-val" :class="{ 'cp-fld-val--set': searchQuery.pickUpDate }">
                  {{ searchQuery.pickUpDate ? formatDate(searchQuery.pickUpDate) : 'Select date' }}
                </span>
              </div>
            </div>
            <Transition name="cd">
              <div v-if="activeField === 'pickup'" class="cp-drop cp-drop--cal" @mousedown.stop>
                <div class="cp-cal-nav-row">
                  <button class="cp-cal-arrow" @click="prevMonth('pickup')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="cp-cal-title">{{ calMonthLabel('pickup') }}</span>
                  <button class="cp-cal-arrow" @click="nextMonth('pickup')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                <div class="cp-cal-grid">
                  <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="cp-cal-dow">{{ d }}</div>
                  <div v-for="c in calCells('pickup')" :key="c.key"
                    class="cp-cal-cell"
                    :class="{
                      'cp-cal-cell--blank': !c.date,
                      'cp-cal-cell--past': c.past,
                      'cp-cal-cell--sel': c.selected,
                      'cp-cal-cell--today': c.today
                    }"
                    @click="c.date && !c.past && pickDate('pickup', c.date)"
                  >{{ c.day }}</div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="cp-bar-sep"></div>

          <!-- RETURN DATE field -->
          <div class="cp-fld cp-fld--date" :class="{ 'cp-fld--active': activeField === 'return' }" ref="returnRef">
            <div class="cp-fld-inner" @click="openField('return')">
              <svg class="cp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div class="cp-fld-text">
                <span class="cp-fld-lbl">Return Date</span>
                <span class="cp-fld-val" :class="{ 'cp-fld-val--set': searchQuery.dropOffDate }">
                  {{ searchQuery.dropOffDate ? formatDate(searchQuery.dropOffDate) : 'Select date' }}
                </span>
              </div>
            </div>
            <Transition name="cd">
              <div v-if="activeField === 'return'" class="cp-drop cp-drop--cal" @mousedown.stop>
                <div class="cp-cal-nav-row">
                  <button class="cp-cal-arrow" @click="prevMonth('return')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="cp-cal-title">{{ calMonthLabel('return') }}</span>
                  <button class="cp-cal-arrow" @click="nextMonth('return')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                <div class="cp-cal-grid">
                  <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="cp-cal-dow">{{ d }}</div>
                  <div v-for="c in calCells('return')" :key="c.key"
                    class="cp-cal-cell"
                    :class="{
                      'cp-cal-cell--blank': !c.date,
                      'cp-cal-cell--past': c.past,
                      'cp-cal-cell--sel': c.selected,
                      'cp-cal-cell--today': c.today
                    }"
                    @click="c.date && !c.past && pickDate('return', c.date)"
                  >{{ c.day }}</div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- SEARCH BTN -->
          <button class="cp-search-btn" :class="{ 'cp-search-btn--busy': loading }" @click="handleSearch">
            <span class="cp-search-inner">
              <svg v-if="!loading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span v-if="loading" class="cp-spin"></span>
              <span>{{ loading ? 'Searching' : 'Search' }}</span>
            </span>
          </button>

        </div><!-- /cp-bar -->
      </div><!-- /cp-wrap -->
    </section>

    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="cp-wrap cp-main">

      <!-- Body grid -->
      <div class="cp-body">

        <!-- Sidebar -->
        <aside class="cp-sidebar" :class="{ 'cp-sidebar--open': mobileFilters }">
          <div class="cp-sbar">
            <div class="cp-sbar-hd">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Refine results</span>
              <button class="cp-reset" @click="clearFilters">Reset</button>
            </div>

            <div class="cp-sb-block">
              <p class="cp-sb-label">Category</p>
              <div class="cp-chips">
                <button v-for="s in categoryOptions" :key="s.value" class="cp-chip" :class="{ 'cp-chip--on': activeCategories.includes(s.value) }" @click="toggleCategory(s.value)">{{ s.label }}</button>
              </div>
            </div>

            <div class="cp-sb-block">
              <p class="cp-sb-label">Transmission</p>
              <div class="cp-chips">
                <button v-for="t in transmissionOptions" :key="t" class="cp-chip" :class="{ 'cp-chip--on': activeTransmissions.includes(t) }" @click="toggleTransmission(t)">{{ t }}</button>
              </div>
            </div>

            <div class="cp-sb-block" v-if="availableFuelTypes.length">
              <p class="cp-sb-label">Fuel type</p>
              <label v-for="ft in availableFuelTypes" :key="ft" class="cp-chk-row">
                <span class="cp-chk" :class="{ 'cp-chk--on': activeFuelTypes.includes(ft) }" @click="toggleFuelType(ft)">
                  <svg v-if="activeFuelTypes.includes(ft)" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="cp-chk-label">{{ ft }}</span>
              </label>
            </div>

            <div class="cp-sb-block">
              <p class="cp-sb-label">Max price <strong>${{ maxPriceFilter }}/day</strong></p>
              <div class="cp-range-wrap">
                <input type="range" :min="minPrice" :max="maxPrice" step="1" v-model.number="maxPriceFilter" class="cp-range" />
                <div class="cp-range-ends">
                  <span>${{ minPrice }}</span>
                  <span>${{ maxPrice }}</span>
                </div>
              </div>
            </div>

            <div class="cp-sb-block">
              <p class="cp-sb-label">Free cancellation</p>
              <label class="cp-chk-row">
                <span class="cp-chk" :class="{ 'cp-chk--on': freeCancelOnly }" @click="freeCancelOnly = !freeCancelOnly">
                  <svg v-if="freeCancelOnly" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="cp-chk-label">Show only free cancellation</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="cp-results">

          <!-- Toolbar -->
          <div v-if="filteredCars.length" class="cp-toolbar">
            <span class="cp-rcount">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
              {{ filteredCars.length }} cars found
            </span>
            <div class="cp-toolbar-r">
              <div class="cp-sort-wrap" ref="sortRef">
                <button class="cp-sort-btn" @click.stop="sortOpen = !sortOpen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                  {{ currentSort.label }}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="cp-chev" :class="{ 'cp-chev--up': sortOpen }"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <Transition name="cd">
                  <div v-if="sortOpen" class="cp-sort-panel" @mousedown.stop>
                    <button v-for="o in sortOptions" :key="o.value" class="cp-sort-opt" :class="{ 'cp-sort-opt--on': sortBy === o.value }" @click="sortBy = o.value; sortOpen = false">
                      <span class="cp-sort-dot" :class="{ 'cp-sort-dot--on': sortBy === o.value }"></span>
                      {{ o.label }}
                    </button>
                  </div>
                </Transition>
              </div>
              <button class="cp-filter-mob" @click="mobileFilters = !mobileFilters">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
                <span v-if="activeFilterCount" class="cp-badge">{{ activeFilterCount }}</span>
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="cp-loading">
            <div v-for="n in 3" :key="n" class="cp-skel-card">
              <div class="cp-sk cp-sk--img"></div>
              <div class="cp-sk-grp">
                <div class="cp-sk cp-sk--lg"></div>
                <div class="cp-sk cp-sk--sm"></div>
                <div class="cp-sk cp-sk--specs"></div>
              </div>
              <div class="cp-sk cp-sk--price"></div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="!filteredCars.length && !loading" class="cp-empty">
            <div class="cp-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
            </div>
            <h3 class="cp-empty-h">No cars found</h3>
            <p class="cp-empty-p">Try different dates or adjust your filters to see available vehicles.</p>
            <button class="cp-empty-btn" @click="clearFilters">Clear filters</button>
          </div>

          <!-- Car cards -->
          <div v-if="filteredCars.length && !loading" class="cp-cards">
            <CarCard
              v-for="car in sortedCars"
              :key="car._id || car.id"
              :car="car"
              @select="selectCar"
            />
          </div>

        </div>
      </div>
    </div>

    <!-- Mobile filter overlay -->
    <Transition name="cp-ov">
      <div v-if="mobileFilters" class="cp-overlay" @click.self="mobileFilters = false"></div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useSearchCars } from '@/composables/modules/cars/useSearchCars'
import CarCard from '@/components/CarCard.vue'

const { loading, filteredCars, searchCars } = useSearchCars()

// ── Refs ──────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const locRef = ref<HTMLElement | null>(null)
const pickupRef = ref<HTMLElement | null>(null)
const returnRef = ref<HTMLElement | null>(null)
const sortRef = ref<HTMLElement | null>(null)
const locInputRef = ref<HTMLInputElement | null>(null)
const locQuery = ref('')
const locationResults = ref<any[]>([])
const sortOpen = ref(false)
const mobileFilters = ref(false)
const activeCategories = ref<string[]>([])
const activeTransmissions = ref<string[]>([])
const activeFuelTypes = ref<string[]>([])
const maxPriceFilter = ref(99999)
const freeCancelOnly = ref(false)
const sortBy = ref('price')

const calViewDates = ref<Record<string, Date>>({
  pickup: new Date(),
  return: new Date(),
})

const searchQuery = ref({
  pickUpLocation: '',
  pickUpDate: '',
  dropOffDate: '',
  type: 'rental',
})

// Popular locations list
const popularLocations = [
  { city: 'Dubai', code: 'DXB', country: 'UAE' },
  { city: 'Lagos', code: 'LOS', country: 'Nigeria' },
  { city: 'London', code: 'LHR', country: 'UK' },
  { city: 'Abuja', code: 'ABV', country: 'Nigeria' },
  { city: 'Accra', code: 'ACC', country: 'Ghana' },
  { city: 'Nairobi', code: 'NBO', country: 'Kenya' },
  { city: 'New York', code: 'JFK', country: 'USA' },
  { city: 'Paris', code: 'CDG', country: 'France' },
]

const allLocations = [
  { city: 'Dubai', code: 'DXB' }, { city: 'Lagos', code: 'LOS' },
  { city: 'London', code: 'LHR' }, { city: 'London Gatwick', code: 'LGW' },
  { city: 'Abuja', code: 'ABV' }, { city: 'Accra', code: 'ACC' },
  { city: 'Nairobi', code: 'NBO' }, { city: 'New York JFK', code: 'JFK' },
  { city: 'Paris CDG', code: 'CDG' }, { city: 'Amsterdam', code: 'AMS' },
  { city: 'Frankfurt', code: 'FRA' }, { city: 'Istanbul', code: 'IST' },
  { city: 'Cairo', code: 'CAI' }, { city: 'Johannesburg', code: 'JNB' },
  { city: 'Cape Town', code: 'CPT' }, { city: 'Addis Ababa', code: 'ADD' },
  { city: 'Doha', code: 'DOH' }, { city: 'Toronto', code: 'YYZ' },
  { city: 'Singapore', code: 'SIN' }, { city: 'Mumbai', code: 'BOM' },
  { city: 'Kigali', code: 'KGL' }, { city: 'Port Harcourt', code: 'PHC' },
]

// ── Location search ───────────────────────────────────────────────────
const searchLocations = () => {
  const q = locQuery.value
  if (!q) { locationResults.value = []; return }
  const lq = q.toLowerCase()
  locationResults.value = allLocations.filter(a =>
    a.city.toLowerCase().includes(lq) || a.code.toLowerCase().includes(lq)
  ).slice(0, 6)
}

const selectLocation = (loc: any) => {
  searchQuery.value.pickUpLocation = `${loc.city} (${loc.code})`
  locQuery.value = `${loc.city} (${loc.code})`
  activeField.value = null
  nextTick(() => { activeField.value = 'pickup' })
}

// ── Field management ──────────────────────────────────────────────────
const openField = (field: string) => {
  activeField.value = activeField.value === field ? null : field
  if (field === 'loc') nextTick(() => locInputRef.value?.focus())
}

const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { loc: locRef, pickup: pickupRef, return: returnRef }
  if (activeField.value) {
    const currentRef = refs[activeField.value]?.value
    if (currentRef && !currentRef.contains(e.target as Node)) {
      activeField.value = null
    }
  }
  if (sortRef.value && !sortRef.value.contains(e.target as Node)) {
    sortOpen.value = false
  }
}

// ── Calendar ──────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const calMonthLabel = (which: string) => {
  const d = calViewDates.value[which]
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

const calCells = (which: string) => {
  const view = calViewDates.value[which]
  const y = view.getFullYear()
  const m = view.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const selectedIso = which === 'pickup' ? searchQuery.value.pickUpDate : searchQuery.value.dropOffDate
  const cells: any[] = []
  for (let i = 0; i < firstDay; i++) cells.push({ key: `b${i}`, date: null, day: '', past: false, selected: false, today: false })
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d)
    const iso = dt.toISOString().split('T')[0]
    cells.push({ key: iso, date: iso, day: d, past: dt < today, selected: selectedIso === iso, today: dt.getTime() === today.getTime() })
  }
  return cells
}

const prevMonth = (which: string) => {
  const d = new Date(calViewDates.value[which])
  d.setMonth(d.getMonth() - 1)
  calViewDates.value[which] = d
}
const nextMonth = (which: string) => {
  const d = new Date(calViewDates.value[which])
  d.setMonth(d.getMonth() + 1)
  calViewDates.value[which] = d
}

const pickDate = (which: string, iso: string) => {
  if (which === 'pickup') {
    searchQuery.value.pickUpDate = iso
    activeField.value = null
    nextTick(() => { activeField.value = 'return' })
  } else {
    searchQuery.value.dropOffDate = iso
    activeField.value = null
  }
}

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`
}

// ── Filters ───────────────────────────────────────────────────────────
const categoryOptions = [
  { label: 'Economy', value: 'Economy' },
  { label: 'Compact', value: 'Compact' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Luxury', value: 'Luxury' },
  { label: 'Van', value: 'Van' },
]
const transmissionOptions = ['Automatic', 'Manual']

const availableFuelTypes = computed(() =>
  [...new Set((filteredCars.value || []).map((c: any) => c.fuelType).filter(Boolean))]
)

const minPrice = computed(() => {
  const cars = filteredCars.value || []
  if (!cars.length) return 0
  return Math.floor(Math.min(...cars.map((c: any) => c.pricing?.basePrice || c.price || 0)))
})
const maxPrice = computed(() => {
  const cars = filteredCars.value || []
  if (!cars.length) return 1000
  return Math.ceil(Math.max(...cars.map((c: any) => c.pricing?.basePrice || c.price || 0)))
})
watch(maxPrice, v => { maxPriceFilter.value = v }, { immediate: true })

const carsFiltered = computed(() =>
  (filteredCars.value || []).filter((c: any) => {
    const price = c.pricing?.basePrice || c.price || 0
    if (price > maxPriceFilter.value) return false
    if (activeCategories.value.length && !activeCategories.value.includes(c.category)) return false
    if (activeTransmissions.value.length && !activeTransmissions.value.includes(c.transmission)) return false
    if (activeFuelTypes.value.length && !activeFuelTypes.value.includes(c.fuelType)) return false
    if (freeCancelOnly.value && !c.freeCancellation) return false
    return true
  })
)

const sortedCars = computed(() =>
  [...carsFiltered.value].sort((a: any, b: any) => {
    const pa = a.pricing?.basePrice || a.price || 0
    const pb = b.pricing?.basePrice || b.price || 0
    if (sortBy.value === 'price') return pa - pb
    if (sortBy.value === 'price_desc') return pb - pa
    if (sortBy.value === 'name') return (a.name || '').localeCompare(b.name || '')
    return 0
  })
)

const activeFilterCount = computed(() =>
  activeCategories.value.length + activeTransmissions.value.length + activeFuelTypes.value.length +
  (maxPriceFilter.value < maxPrice.value ? 1 : 0) + (freeCancelOnly.value ? 1 : 0)
)

const sortOptions = [
  { value: 'price', label: 'Price — low to high' },
  { value: 'price_desc', label: 'Price — high to low' },
  { value: 'name', label: 'Name — A to Z' },
]
const currentSort = computed(() => sortOptions.find(o => o.value === sortBy.value)!)

// ── Actions ───────────────────────────────────────────────────────────
const handleSearch = () => {
  activeField.value = null
  if (!searchQuery.value.pickUpLocation) return
  searchCars(searchQuery.value)
}

const toggleCategory = (v: string) => {
  const i = activeCategories.value.indexOf(v)
  if (i >= 0) activeCategories.value.splice(i, 1); else activeCategories.value.push(v)
}
const toggleTransmission = (v: string) => {
  const i = activeTransmissions.value.indexOf(v)
  if (i >= 0) activeTransmissions.value.splice(i, 1); else activeTransmissions.value.push(v)
}
const toggleFuelType = (v: string) => {
  const i = activeFuelTypes.value.indexOf(v)
  if (i >= 0) activeFuelTypes.value.splice(i, 1); else activeFuelTypes.value.push(v)
}
const clearFilters = () => {
  activeCategories.value = []
  activeTransmissions.value = []
  activeFuelTypes.value = []
  freeCancelOnly.value = false
  maxPriceFilter.value = maxPrice.value
}

const selectCar = (car: any) => {
  if (!car) return
  try { sessionStorage.setItem('selectedCar', JSON.stringify(car)) } catch {}
  navigateTo({
    path: '/checkout',
    query: {
      type: 'car',
      id: String(car._id || car.id || 'unknown'),
      name: String(car.name || `${car.category} car`),
      price: String(car.pricing?.basePrice || car.price || 0),
    }
  })
}

onMounted(() => {
  const route = useRoute()
  const today = new Date()
  const defaultPickup = new Date(today)
  defaultPickup.setDate(today.getDate() + 14)
  const defaultReturn = new Date(defaultPickup)
  defaultReturn.setDate(defaultPickup.getDate() + 3)

  if (route.query.pickUpLocation || route.query.location) {
    searchQuery.value.pickUpLocation = String(route.query.pickUpLocation || route.query.location)
    locQuery.value = searchQuery.value.pickUpLocation
  } else {
    searchQuery.value.pickUpLocation = 'Dubai International Airport (DXB)'
    locQuery.value = 'Dubai International Airport (DXB)'
  }

  if (route.query.pickUpDate || route.query.date) {
    searchQuery.value.pickUpDate = String(route.query.pickUpDate || route.query.date)
  } else {
    searchQuery.value.pickUpDate = defaultPickup.toISOString().split('T')[0]
  }

  if (route.query.dropOffDate) {
    searchQuery.value.dropOffDate = String(route.query.dropOffDate)
  } else if (searchQuery.value.pickUpDate) {
    const d = new Date(searchQuery.value.pickUpDate)
    d.setDate(d.getDate() + 3)
    searchQuery.value.dropOffDate = d.toISOString().split('T')[0]
  }

  handleSearch()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.cp-root {
  min-height: 100vh;
  background: #fff;
  font-family: 'Sora', system-ui, sans-serif;
  color: #111;
}

.cp-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.cp-hero {
  background: #f8f9f7;
  border-bottom: 1px solid #e8e8e2;
  padding: 40px 0 56px;
  position: relative;
  overflow: visible;
}

.cp-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.cp-orb { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.28; }
.cp-orb--a { width: 420px; height: 420px; background: radial-gradient(circle, #b8e8cc, transparent); top: -180px; right: -60px; }
.cp-orb--b { width: 300px; height: 300px; background: radial-gradient(circle, #d4e6ff, transparent); bottom: -100px; left: 8%; }

.cp-headline { margin-bottom: 28px; }
.cp-eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #999; display: block; margin-bottom: 10px; }
.cp-h1 { font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.12; color: #111; letter-spacing: -0.03em; }
.cp-h1 em { font-style: normal; color: #1d7a4f; }

/* ── Search bar ────────────────────────────────────────────────────── */
.cp-bar {
  background: #fff;
  border: 1.5px solid #e0e0d8;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 50;
  overflow: visible;
}

.cp-fld {
  position: relative;
  flex: 1;
  min-width: 0;
}

.cp-fld--loc { flex: 1.6; }
.cp-fld--date { flex: 1.1; }

.cp-fld-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  height: 100%;
  cursor: pointer;
  border-radius: 14px;
  transition: background 0.15s;
  min-width: 0;
}
.cp-fld-inner:hover { background: #f5f5f0; }
.cp-fld--active .cp-fld-inner { background: #f0f7f3; }

.cp-fld-ico { color: #aaa; flex-shrink: 0; }

.cp-fld-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  overflow: hidden;
}
.cp-fld-lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; white-space: nowrap; }
.cp-fld-val { font-size: 13px; font-weight: 500; color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cp-fld-val--set { color: #111; }

.cp-bar-sep { width: 1px; background: #ebebe5; flex-shrink: 0; margin: 10px 0; }

.cp-search-btn {
  flex-shrink: 0;
  background: #111;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0 24px;
  margin: 6px;
  min-width: 100px;
  transition: background 0.2s;
  align-self: stretch;
}
.cp-search-btn:hover { background: #1d7a4f; }
.cp-search-btn--busy { opacity: 0.75; cursor: wait; }
.cp-search-inner { display: flex; align-items: center; justify-content: center; gap: 7px; white-space: nowrap; }
.cp-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Dropdowns ─────────────────────────────────────────────────────── */
.cp-drop {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border: 1px solid #e0e0d8;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
  z-index: 999;
  overflow: hidden;
}

.cp-drop--loc {
  width: max(300px, 100%);
  min-width: 300px;
  max-width: 380px;
}

.cp-drop-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0ea;
  background: #fafaf8;
  color: #aaa;
}
.cp-drop-input { flex: 1; border: none; background: transparent; font-family: 'Sora', sans-serif; font-size: 13px; color: #111; outline: none; min-width: 0; }
.cp-drop-input::placeholder { color: #ccc; }
.cp-drop-clear { background: none; border: none; color: #bbb; cursor: pointer; padding: 2px; display: flex; align-items: center; transition: color 0.15s; }
.cp-drop-clear:hover { color: #111; }

.cp-drop-section { padding: 14px; }
.cp-drop-sec-label { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 10px; }

.cp-drop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.cp-pop-item {
  display: flex; align-items: center; gap: 8px; padding: 9px 10px;
  background: #f8f8f5; border: none; border-radius: 10px; cursor: pointer;
  transition: background 0.12s; text-align: left;
}
.cp-pop-item:hover { background: #edf5f1; }
.cp-pop-icon { width: 28px; height: 28px; border-radius: 8px; background: #fff; border: 1px solid #e8e8e0; display: flex; align-items: center; justify-content: center; color: #888; flex-shrink: 0; }
.cp-pop-name { font-size: 12px; font-weight: 600; color: #111; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cp-pop-code { font-size: 10px; font-weight: 600; color: #999; background: #f0f0ea; padding: 1px 5px; border-radius: 4px; }

.cp-drop-results { padding: 8px; }
.cp-loc-result { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; background: none; border: none; border-radius: 8px; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.12s; color: #555; text-align: left; }
.cp-loc-result:hover { background: #f5f5f0; }
.cp-loc-city { font-size: 13px; font-weight: 500; color: #111; flex: 1; text-align: left; }
.cp-loc-code { font-size: 10px; font-weight: 700; color: #1d7a4f; background: #edf5f1; padding: 2px 6px; border-radius: 5px; }
.cp-drop-empty { padding: 16px; text-align: center; font-size: 12px; color: #bbb; }

/* Calendar dropdown */
.cp-drop--cal { width: 300px; padding: 16px; }
.cp-cal-nav-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.cp-cal-title { font-size: 13px; font-weight: 600; color: #111; }
.cp-cal-arrow { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e8e8e0; background: #fff; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.14s; }
.cp-cal-arrow:hover { background: #111; color: #fff; border-color: #111; }

.cp-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cp-cal-dow { font-size: 9px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #bbb; text-align: center; padding: 4px 0 8px; }
.cp-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: #333; border-radius: 7px; cursor: pointer; transition: all 0.1s; }
.cp-cal-cell:not(.cp-cal-cell--blank):not(.cp-cal-cell--past):hover { background: #edf5f1; color: #1d7a4f; }
.cp-cal-cell--blank { pointer-events: none; }
.cp-cal-cell--past { color: #ddd; cursor: not-allowed; }
.cp-cal-cell--today { font-weight: 700; color: #1d7a4f; }
.cp-cal-cell--sel { background: #1d7a4f !important; color: #fff !important; font-weight: 700; }

/* ── Main content ──────────────────────────────────────────────────── */
.cp-main { padding-top: 36px; padding-bottom: 60px; }

/* Body grid */
.cp-body { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start; }

/* Sidebar */
.cp-sidebar { position: sticky; top: 20px; }
.cp-sbar { background: #fff; border: 1px solid #eaeae3; border-radius: 14px; padding: 18px; max-height: calc(100vh - 100px); overflow-y: auto; }
.cp-sbar-hd { display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #111; padding-bottom: 14px; border-bottom: 1px solid #f0f0ea; margin-bottom: 18px; }
.cp-reset { margin-left: auto; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; background: none; border: none; cursor: pointer; transition: color 0.15s; }
.cp-reset:hover { color: #1d7a4f; }

.cp-sb-block { margin-bottom: 20px; }
.cp-sb-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 10px; }
.cp-sb-label strong { color: #111; text-transform: none; letter-spacing: 0; font-size: 12px; }

.cp-chips { display: flex; flex-direction: column; gap: 5px; }
.cp-chip { padding: 8px 12px; background: #fafaf7; border: 1.5px solid transparent; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; color: #555; cursor: pointer; text-align: left; transition: all 0.14s; }
.cp-chip:hover { border-color: #cce8d8; color: #1d7a4f; }
.cp-chip--on { background: #edf5f1; border-color: #1d7a4f; color: #1d7a4f; font-weight: 600; }

.cp-chk-row { display: flex; align-items: center; gap: 9px; padding: 6px 0; cursor: pointer; }
.cp-chk { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #d8d8d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; transition: all 0.14s; cursor: pointer; }
.cp-chk--on { background: #1d7a4f; border-color: #1d7a4f; }
.cp-chk-label { font-size: 12px; color: #333; }

.cp-range-wrap { display: flex; flex-direction: column; gap: 7px; }
.cp-range { width: 100%; -webkit-appearance: none; height: 3px; background: #e8e8e0; border-radius: 2px; outline: none; cursor: pointer; accent-color: #1d7a4f; }
.cp-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border: 2px solid #1d7a4f; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 6px rgba(29,122,79,0.2); }
.cp-range-ends { display: flex; justify-content: space-between; font-size: 10px; color: #bbb; }

/* Toolbar */
.cp-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.cp-rcount { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #aaa; }
.cp-toolbar-r { display: flex; align-items: center; gap: 8px; }

.cp-sort-wrap { position: relative; }
.cp-sort-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #fff; border: 1px solid #e0e0d8; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 500; color: #333; cursor: pointer; white-space: nowrap; transition: border-color 0.14s; }
.cp-sort-btn:hover { border-color: #aaa; }
.cp-chev { transition: transform 0.18s; color: #aaa; }
.cp-chev--up { transform: rotate(180deg); }

.cp-sort-panel { position: absolute; right: 0; top: calc(100% + 5px); background: #fff; border: 1px solid #e0e0d8; border-radius: 12px; padding: 5px; min-width: 200px; z-index: 100; box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.cp-sort-opt { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px; border: none; border-radius: 7px; background: none; font-family: 'Sora', sans-serif; font-size: 12px; color: #333; cursor: pointer; text-align: left; transition: background 0.12s; }
.cp-sort-opt:hover { background: #f5f5f0; }
.cp-sort-opt--on { font-weight: 600; color: #1d7a4f; }
.cp-sort-dot { width: 5px; height: 5px; border-radius: 50%; background: #d8d8d0; flex-shrink: 0; }
.cp-sort-dot--on { background: #1d7a4f; }

.cp-filter-mob { display: none; align-items: center; gap: 6px; padding: 7px 12px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; position: relative; }
.cp-badge { position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background: #1d7a4f; border-radius: 50%; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* Loading skeletons */
.cp-loading { display: flex; flex-direction: column; gap: 10px; }
.cp-skel-card { background: #fff; border: 1px solid #eaeae3; border-radius: 12px; padding: 18px; display: flex; align-items: flex-start; gap: 14px; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
.cp-sk { background: #f0f0ea; border-radius: 5px; }
.cp-sk--img { width: 120px; height: 80px; border-radius: 10px; flex-shrink: 0; }
.cp-sk-grp { flex: 1; display: flex; flex-direction: column; gap: 7px; }
.cp-sk--lg { height: 14px; width: 55%; }
.cp-sk--sm { height: 11px; width: 35%; }
.cp-sk--specs { height: 28px; width: 80%; border-radius: 8px; }
.cp-sk--price { width: 60px; height: 22px; }

/* Empty */
.cp-empty { display: flex; flex-direction: column; align-items: center; padding: 72px 24px; gap: 10px; text-align: center; background: #fff; border: 1px solid #eaeae3; border-radius: 14px; }
.cp-empty-ico { width: 56px; height: 56px; border-radius: 14px; background: #edf5f1; display: flex; align-items: center; justify-content: center; color: #1d7a4f; margin-bottom: 4px; }
.cp-empty-h { font-size: 20px; font-weight: 700; color: #111; }
.cp-empty-p { font-size: 13px; color: #aaa; max-width: 300px; line-height: 1.6; }
.cp-empty-btn { margin-top: 6px; padding: 10px 22px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.18s; }
.cp-empty-btn:hover { background: #1d7a4f; }

.cp-cards { display: flex; flex-direction: column; gap: 10px; }

/* Overlay */
.cp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.38); z-index: 150; backdrop-filter: blur(2px); }

/* ── Transitions ───────────────────────────────────────────────────── */
.cd-enter-active, .cd-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.cd-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.cd-leave-to { opacity: 0; transform: translateY(-3px) scale(0.99); }
.cp-ov-enter-active, .cp-ov-leave-active { transition: opacity 0.22s ease; }
.cp-ov-enter-from, .cp-ov-leave-to { opacity: 0; }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .cp-body { grid-template-columns: 1fr; }
  .cp-sidebar { position: static; }
  .cp-sbar { display: none; }
  .cp-sidebar--open .cp-sbar {
    display: block;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    border-radius: 18px 18px 0 0;
    z-index: 200;
    max-height: 85vh;
    overflow-y: auto;
  }
  .cp-filter-mob { display: flex; }
}

@media (max-width: 860px) {
  .cp-bar { flex-wrap: wrap; border-radius: 14px; padding: 6px; }
  .cp-fld--loc { flex: 1 0 100%; }
  .cp-fld--date { flex: 1 0 calc(50% - 4px); }
  .cp-bar-sep:first-of-type { height: 1px; width: 100%; margin: 0; }
  .cp-bar-sep { height: 1px; width: 100%; margin: 0; }
  .cp-search-btn { flex: 1 0 100%; margin: 4px 0 0; border-radius: 10px; min-height: 46px; }
}

@media (max-width: 580px) {
  .cp-wrap { padding: 0 14px; }
  .cp-hero { padding: 28px 0 44px; }
  .cp-fld--date { flex: 1 0 100%; }
  .cp-drop--loc { max-width: calc(100vw - 28px); left: 0; }
  .cp-drop--cal { width: calc(100vw - 28px); left: 0; }
}
</style>