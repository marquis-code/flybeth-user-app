<template>
  <div class="ep-root" @mousedown="handleGlobalMousedown">

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="ep-hero">
      <div class="ep-hero-bg">
        <div class="ep-orb ep-orb--a"></div>
        <div class="ep-orb ep-orb--b"></div>
      </div>

      <div class="ep-wrap">

        <!-- Dynamic headline -->
        <div class="ep-headline">
          <span class="ep-eyebrow">✦ Global Discovery</span>
          <h1 class="ep-h1">
            <template v-if="exploreState.originLabel && exploreState.destinationLabel">
              {{ exploreState.originLabel }}
              <em>→ {{ exploreState.destinationLabel }}</em>
            </template>
            <template v-else-if="exploreState.destinationLabel">
              Heading to <em>{{ exploreState.destinationLabel }}</em>
            </template>
            <template v-else>
              Explore<br><em>the extraordinary.</em>
            </template>
          </h1>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="ep-bar">

          <!-- FROM field -->
          <div class="ep-fld ep-fld--from" :class="{ 'ep-fld--active': activeField === 'from' }" ref="fromRef">
            <div class="ep-fld-inner" @click="openField('from')">
              <svg class="ep-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              <div class="ep-fld-text">
                <span class="ep-fld-lbl">Origin</span>
                <span class="ep-fld-val" :class="{ 'ep-fld-val--set': exploreState.originLabel }">
                  {{ exploreState.originLabel || 'Anywhere' }}
                </span>
              </div>
            </div>
            <!-- FROM dropdown -->
            <Transition name="fd">
              <div v-if="activeField === 'from'" class="ep-drop ep-drop--loc" @mousedown.stop>
                <div class="ep-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="fromInputRef" v-model="fromQuery" placeholder="Search city or airport…" class="ep-drop-input" @input="searchOrigins" />
                  <button v-if="fromQuery" class="ep-drop-clear" @click="fromQuery=''; exploreState.originLabel=''">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div v-if="!fromQuery" class="ep-drop-section">
                  <span class="ep-drop-sec-label">Popular origins</span>
                  <div class="ep-drop-grid">
                    <button v-for="p in popularOrigins" :key="p.code" class="ep-pop-item" @click="selectOrigin(p)">
                      <span class="ep-pop-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </span>
                      <span class="ep-pop-name">{{ p.city }}</span>
                      <span class="ep-pop-code">{{ p.code }}</span>
                    </button>
                  </div>
                </div>
                <div v-else class="ep-drop-results">
                  <button v-for="r in originResults" :key="r.code" class="ep-loc-result" @click="selectOrigin(r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="ep-loc-city">{{ r.city }}</span>
                    <span class="ep-loc-code">{{ r.code }}</span>
                  </button>
                  <div v-if="!originResults.length" class="ep-drop-empty">No results for "{{ fromQuery }}"</div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- SWAP -->
          <button class="ep-swap" @click="swapLocations" title="Swap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
          </button>

          <!-- TO field -->
          <div class="ep-fld ep-fld--to" :class="{ 'ep-fld--active': activeField === 'to' }" ref="toRef">
            <div class="ep-fld-inner" @click="openField('to')">
              <svg class="ep-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div class="ep-fld-text">
                <span class="ep-fld-lbl">Destination</span>
                <span class="ep-fld-val" :class="{ 'ep-fld-val--set': exploreState.destinationLabel }">
                  {{ exploreState.destinationLabel || 'Everywhere' }}
                </span>
              </div>
            </div>
            <!-- TO dropdown -->
            <Transition name="fd">
              <div v-if="activeField === 'to'" class="ep-drop ep-drop--loc" @mousedown.stop>
                <div class="ep-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="toInputRef" v-model="toQuery" placeholder="Search destination…" class="ep-drop-input" @input="searchDestinations" />
                  <button v-if="toQuery" class="ep-drop-clear" @click="toQuery=''; exploreState.destinationLabel=''">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div v-if="!toQuery" class="ep-drop-section">
                  <span class="ep-drop-sec-label">Trending places</span>
                  <div class="ep-drop-grid">
                    <button v-for="p in popularDestinations" :key="p.name" class="ep-pop-item" @click="selectDestination(p)">
                      <span class="ep-pop-flag">{{ p.flag }}</span>
                      <span class="ep-pop-name">{{ p.name }}</span>
                    </button>
                  </div>
                </div>
                <div v-else class="ep-drop-results">
                  <button v-for="r in destinationResults" :key="r" class="ep-loc-result" @click="selectDestination({ name: r, flag: '🌍' })">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="ep-loc-city">{{ r }}</span>
                  </button>
                  <div v-if="!destinationResults.length" class="ep-drop-empty">No results for "{{ toQuery }}"</div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="ep-bar-sep"></div>

          <!-- WHEN field -->
          <div class="ep-fld ep-fld--when" :class="{ 'ep-fld--active': activeField === 'when' }" ref="whenRef">
            <div class="ep-fld-inner" @click="openField('when')">
              <svg class="ep-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div class="ep-fld-text">
                <span class="ep-fld-lbl">When</span>
                <span class="ep-fld-val" :class="{ 'ep-fld-val--set': exploreState.dateLabel }">
                  {{ exploreState.dateLabel || 'Any time' }}
                </span>
              </div>
            </div>
            <Transition name="fd">
              <div v-if="activeField === 'when'" class="ep-drop ep-drop--when" @mousedown.stop>
                <span class="ep-drop-sec-label" style="padding: 14px 14px 8px; display: block;">Travel window</span>
                <div class="ep-when-grid">
                  <button v-for="w in whenOptions" :key="w.value"
                    class="ep-when-btn"
                    :class="{ 'ep-when-btn--on': exploreState.dateLabel === w.label }"
                    @click="exploreState.dateLabel = w.label; activeField = null">
                    <span class="ep-when-ico">{{ w.icon }}</span>
                    <span class="ep-when-lbl">{{ w.label }}</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- DISCOVER BTN -->
          <button class="ep-search-btn" :class="{ 'ep-search-btn--busy': loading }" @click="handleExplore">
            <span class="ep-search-inner">
              <svg v-if="!loading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span v-if="loading" class="ep-spin"></span>
              <span>{{ loading ? 'Searching' : 'Discover' }}</span>
            </span>
          </button>

        </div><!-- /ep-bar -->
      </div><!-- /ep-wrap -->
    </section>

    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="ep-wrap ep-main">

      <!-- Filter strip -->
      <div class="ep-filter-row">
        <div class="ep-filter-pills">
          <button v-for="f in filterCategories" :key="f.value"
            class="ep-cat"
            :class="{ 'ep-cat--on': activeFilter === f.value }"
            @click="activeFilter = activeFilter === f.value ? '' : f.value">
            <span>{{ f.icon }}</span>
            <span>{{ f.label }}</span>
          </button>
        </div>
        <button class="ep-reset-all" @click="resetFilters">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset
        </button>
      </div>

      <!-- Body grid -->
      <div class="ep-body">

        <!-- Sidebar -->
        <aside class="ep-sidebar" :class="{ 'ep-sidebar--open': mobileFilters }">
          <div class="ep-sbar">
            <div class="ep-sbar-hd">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Refine results</span>
              <button class="ep-reset" @click="resetFilters">Reset</button>
            </div>

            <div class="ep-sb-block">
              <p class="ep-sb-label">Category</p>
              <div class="ep-chips">
                <button v-for="f in filterCategories" :key="f.value"
                  class="ep-chip"
                  :class="{ 'ep-chip--on': activeFilter === f.value }"
                  @click="activeFilter = activeFilter === f.value ? '' : f.value">
                  {{ f.icon }} {{ f.label }}
                </button>
              </div>
            </div>

            <div class="ep-sb-block">
              <p class="ep-sb-label">Max price <strong>${{ maxPriceFilter.toLocaleString() }}</strong></p>
              <div class="ep-range-wrap">
                <input type="range" :min="0" :max="10000" step="50" v-model.number="maxPriceFilter" class="ep-range" />
                <div class="ep-range-ends">
                  <span>$0</span>
                  <span>$10,000</span>
                </div>
              </div>
            </div>

            <div class="ep-sb-block">
              <p class="ep-sb-label">Travel window</p>
              <div class="ep-chips">
                <button v-for="w in whenOptions" :key="w.value"
                  class="ep-chip"
                  :class="{ 'ep-chip--on': exploreState.dateLabel === w.label }"
                  @click="exploreState.dateLabel = exploreState.dateLabel === w.label ? '' : w.label">
                  {{ w.icon }} {{ w.label }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="ep-results">

          <!-- Toolbar -->
          <div class="ep-toolbar">
            <span class="ep-rcount">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {{ displayDeals.length }} deals found
            </span>
            <div class="ep-toolbar-r">
              <div class="ep-sort-wrap" ref="sortRef">
                <button class="ep-sort-btn" @click.stop="sortOpen = !sortOpen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                  {{ currentSort.label }}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="ep-chev" :class="{ 'ep-chev--up': sortOpen }"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <Transition name="fd">
                  <div v-if="sortOpen" class="ep-sort-panel" @mousedown.stop>
                    <button v-for="o in sortOptions" :key="o.value"
                      class="ep-sort-opt"
                      :class="{ 'ep-sort-opt--on': sortBy === o.value }"
                      @click="sortBy = o.value; sortOpen = false">
                      <span class="ep-sort-dot" :class="{ 'ep-sort-dot--on': sortBy === o.value }"></span>
                      {{ o.label }}
                    </button>
                  </div>
                </Transition>
              </div>
              <button class="ep-filter-mob" @click="mobileFilters = !mobileFilters">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="ep-loading">
            <div v-for="n in 6" :key="n" class="ep-skel-card">
              <div class="ep-sk ep-sk--img"></div>
              <div class="ep-sk-body">
                <div class="ep-sk ep-sk--tag"></div>
                <div class="ep-sk ep-sk--lg"></div>
                <div class="ep-sk ep-sk--sm"></div>
                <div class="ep-sk-footer">
                  <div class="ep-sk ep-sk--price"></div>
                  <div class="ep-sk ep-sk--btn"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!displayDeals.length" class="ep-empty">
            <div class="ep-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 class="ep-empty-h">No deals found</h3>
            <p class="ep-empty-p">We're updating our curated deals. Try resetting filters or exploring a different destination.</p>
            <button class="ep-empty-btn" @click="resetFilters(); fetchAllPackages()">Refresh Discovery</button>
          </div>

          <!-- Deal grid -->
          <div v-else class="ep-grid">
            <div v-for="deal in displayDeals" :key="deal.id"
              class="ep-card"
              @click="selectDeal(deal)">
              <!-- Image -->
              <div class="ep-card-img-wrap">
                <img :src="deal.image" :alt="deal.name" class="ep-card-img" />
                <div class="ep-card-overlay"></div>
                <!-- Price badge on image -->
                <div class="ep-card-price-badge">
                  <span class="ep-price-from">from</span>
                  <span class="ep-price-amt">${{ Number(deal.price).toLocaleString() }}</span>
                </div>
                <!-- Category badge -->
                <div v-if="deal.category" class="ep-card-cat-badge">{{ deal.category }}</div>
              </div>

              <!-- Body -->
              <div class="ep-card-body">
                <div class="ep-card-meta">
                  <span class="ep-card-route">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ deal.route }}
                  </span>
                  <span v-if="deal.dates" class="ep-card-dates">{{ deal.dates }}</span>
                </div>
                <h3 class="ep-card-title">{{ deal.name }}</h3>
                <div class="ep-card-footer">
                  <div class="ep-card-tags">
                    <span v-if="deal.stops !== undefined" class="ep-tag">
                      {{ deal.stops === 0 ? 'Non-stop' : deal.stops + ' stop' }}
                    </span>
                    <span v-if="deal.airline" class="ep-tag">{{ deal.airline }}</span>
                  </div>
                  <button class="ep-card-btn">View →</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Mobile filter overlay -->
    <Transition name="ep-ov">
      <div v-if="mobileFilters" class="ep-overlay" @click.self="mobileFilters = false"></div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useFetchAllPackages } from '~/composables/modules/packages/useFetchAllPackages'

const { loading, packages, fetchAllPackages } = useFetchAllPackages()

// ── State ─────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const fromRef = ref<HTMLElement | null>(null)
const toRef = ref<HTMLElement | null>(null)
const whenRef = ref<HTMLElement | null>(null)
const sortRef = ref<HTMLElement | null>(null)
const fromInputRef = ref<HTMLInputElement | null>(null)
const toInputRef = ref<HTMLInputElement | null>(null)
const fromQuery = ref('')
const toQuery = ref('')
const originResults = ref<any[]>([])
const destinationResults = ref<string[]>([])
const sortOpen = ref(false)
const mobileFilters = ref(false)
const activeFilter = ref('')
const maxPriceFilter = ref(10000)
const sortBy = ref('recommended')

const exploreState = reactive({
  origin: '', originLabel: '',
  destination: '', destinationLabel: '',
  dateLabel: ''
})

// ── Data ──────────────────────────────────────────────────────────────
const popularOrigins = [
  { city: 'Lagos', code: 'LOS' }, { city: 'Abuja', code: 'ABV' },
  { city: 'London', code: 'LHR' }, { city: 'New York', code: 'JFK' },
  { city: 'Dubai', code: 'DXB' }, { city: 'Nairobi', code: 'NBO' },
]

const popularDestinations = [
  { name: 'London', flag: '🇬🇧' }, { name: 'Paris', flag: '🇫🇷' },
  { name: 'Dubai', flag: '🇦🇪' }, { name: 'Toronto', flag: '🇨🇦' },
  { name: 'Maldives', flag: '🏝️' }, { name: 'Tokyo', flag: '🇯🇵' },
  { name: 'New York', flag: '🗽' }, { name: 'Bali', flag: '🌿' },
]

const allDestinations = [
  'London', 'Paris', 'Dubai', 'Toronto', 'Maldives', 'Tokyo', 'New York', 'Bali',
  'Amsterdam', 'Rome', 'Barcelona', 'Istanbul', 'Singapore', 'Nairobi', 'Cape Town',
  'Accra', 'Marrakech', 'Cairo', 'Lisbon', 'Zanzibar', 'Bangkok', 'Sydney',
]

const filterCategories = [
  { value: 'beach', label: 'Beach', icon: '🏖️' },
  { value: 'city', label: 'City Break', icon: '🏙️' },
  { value: 'safari', label: 'Safari', icon: '🦁' },
  { value: 'luxury', label: 'Luxury', icon: '💎' },
  { value: 'adventure', label: 'Adventure', icon: '🧗' },
  { value: 'honeymoon', label: 'Honeymoon', icon: '💕' },
]

const whenOptions = [
  { value: 'weekend', label: 'This weekend', icon: '📅' },
  { value: 'month', label: 'This month', icon: '🗓️' },
  { value: 'summer', label: 'Summer', icon: '☀️' },
  { value: 'flexible', label: 'Flexible', icon: '✈️' },
]

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price — low to high' },
  { value: 'price_desc', label: 'Price — high to low' },
]
const currentSort = computed(() => sortOptions.find(o => o.value === sortBy.value)!)

// ── Search logic ──────────────────────────────────────────────────────
const searchOrigins = () => {
  const q = fromQuery.value.toLowerCase()
  if (!q) { originResults.value = []; return }
  originResults.value = popularOrigins.filter(p =>
    p.city.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
  )
}

const searchDestinations = () => {
  const q = toQuery.value.toLowerCase()
  if (!q) { destinationResults.value = []; return }
  destinationResults.value = allDestinations.filter(d => d.toLowerCase().includes(q)).slice(0, 7)
}

const selectOrigin = (p: any) => {
  exploreState.origin = p.code
  exploreState.originLabel = `${p.city} (${p.code})`
  fromQuery.value = exploreState.originLabel
  activeField.value = null
  nextTick(() => { activeField.value = 'to'; nextTick(() => toInputRef.value?.focus()) })
}

const selectDestination = (p: any) => {
  exploreState.destination = p.name
  exploreState.destinationLabel = p.name
  toQuery.value = p.name
  activeField.value = null
}

const swapLocations = () => {
  const ol = exploreState.originLabel, dl = exploreState.destinationLabel
  const oc = exploreState.origin, dc = exploreState.destination
  exploreState.originLabel = dl; exploreState.destinationLabel = ol
  exploreState.origin = dc; exploreState.destination = oc
  fromQuery.value = dl; toQuery.value = ol
}

// ── Field management ──────────────────────────────────────────────────
const openField = (field: string) => {
  activeField.value = activeField.value === field ? null : field
  if (field === 'from') nextTick(() => fromInputRef.value?.focus())
  if (field === 'to') nextTick(() => toInputRef.value?.focus())
}

const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { from: fromRef, to: toRef, when: whenRef }
  if (activeField.value) {
    const r = refs[activeField.value]?.value
    if (r && !r.contains(e.target as Node)) activeField.value = null
  }
  if (sortRef.value && !sortRef.value.contains(e.target as Node)) sortOpen.value = false
}

// ── Computed deals ────────────────────────────────────────────────────
const displayDeals = computed(() => {
  let deals = (packages.value || []).map((pkg: any) => ({
    id: pkg.id || pkg._id,
    name: pkg.name,
    price: pkg.price?.total || pkg.price?.amount || pkg.price || 0,
    route: pkg.location || pkg.destination || 'Global Package',
    dates: pkg.duration ? `${pkg.duration} nights` : 'Flexible',
    image: pkg.image || pkg.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    category: pkg.category || '',
    airline: pkg.airline || '',
    stops: pkg.stops,
  }))

  if (activeFilter.value) deals = deals.filter((d: any) => d.category === activeFilter.value)
  deals = deals.filter((d: any) => d.price <= maxPriceFilter.value)

  if (sortBy.value === 'price_asc') deals.sort((a: any, b: any) => a.price - b.price)
  else if (sortBy.value === 'price_desc') deals.sort((a: any, b: any) => b.price - a.price)

  return deals
})

// ── Actions ───────────────────────────────────────────────────────────
const handleExplore = () => {
  activeField.value = null
  fetchAllPackages({ q: exploreState.destination || toQuery.value })
}

const resetFilters = () => {
  activeFilter.value = ''
  maxPriceFilter.value = 10000
  exploreState.dateLabel = ''
}

const selectDeal = (deal: any) => {
  navigateTo(`/packages/${deal.id}`)
}

onMounted(() => {
  fetchAllPackages()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ep-root {
  min-height: 100vh;
  background: #fff;
  font-family: 'Sora', system-ui, sans-serif;
  color: #111;
}

.ep-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.ep-hero {
  background: #f8f9f7;
  border-bottom: 1px solid #e8e8e2;
  padding: 40px 0 56px;
  position: relative;
  overflow: visible;
}

.ep-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.ep-orb { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.28; }
.ep-orb--a { width: 420px; height: 420px; background: radial-gradient(circle, #b8e8cc, transparent); top: -180px; right: -60px; }
.ep-orb--b { width: 300px; height: 300px; background: radial-gradient(circle, #d4e6ff, transparent); bottom: -100px; left: 8%; }

.ep-headline { margin-bottom: 28px; }
.ep-eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #999; display: block; margin-bottom: 10px; }
.ep-h1 { font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.12; color: #111; letter-spacing: -0.03em; }
.ep-h1 em { font-style: normal; color: #1d7a4f; }

/* ── Search bar ────────────────────────────────────────────────────── */
.ep-bar {
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

.ep-fld { position: relative; flex: 1; min-width: 0; }
.ep-fld--from { flex: 1.4; }
.ep-fld--to { flex: 1.4; }
.ep-fld--when { flex: 1.1; }

.ep-fld-inner {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; height: 100%;
  cursor: pointer; border-radius: 14px;
  transition: background 0.15s; min-width: 0;
}
.ep-fld-inner:hover { background: #f5f5f0; }
.ep-fld--active .ep-fld-inner { background: #f0f7f3; }

.ep-fld-ico { color: #aaa; flex-shrink: 0; }
.ep-fld-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; overflow: hidden; }
.ep-fld-lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; white-space: nowrap; }
.ep-fld-val { font-size: 13px; font-weight: 500; color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ep-fld-val--set { color: #111; }

.ep-bar-sep { width: 1px; background: #ebebe5; flex-shrink: 0; margin: 10px 0; }

/* Swap */
.ep-swap {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1.5px solid #e0e0d8; background: #fff; color: #888;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; align-self: center; margin: 0 4px; transition: all 0.2s; z-index: 2;
}
.ep-swap:hover { background: #111; color: #fff; border-color: #111; transform: rotate(180deg); }

/* Search button */
.ep-search-btn {
  flex-shrink: 0; background: #111; border: none; border-radius: 12px;
  color: #fff; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; padding: 0 24px; margin: 6px; min-width: 110px;
  transition: background 0.2s; align-self: stretch;
}
.ep-search-btn:hover { background: #1d7a4f; }
.ep-search-btn--busy { opacity: 0.75; cursor: wait; }
.ep-search-inner { display: flex; align-items: center; justify-content: center; gap: 7px; white-space: nowrap; }
.ep-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Dropdowns ─────────────────────────────────────────────────────── */
.ep-drop {
  position: absolute; top: calc(100% + 6px); left: 0;
  background: #fff; border: 1px solid #e0e0d8; border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
  z-index: 999; overflow: hidden;
}
.ep-drop--loc { width: max(280px, 100%); min-width: 280px; max-width: 360px; }
.ep-drop--when { width: 280px; }

.ep-drop-search {
  display: flex; align-items: center; gap: 8px; padding: 12px 14px;
  border-bottom: 1px solid #f0f0ea; background: #fafaf8; color: #aaa;
}
.ep-drop-input { flex: 1; border: none; background: transparent; font-family: 'Sora', sans-serif; font-size: 13px; color: #111; outline: none; min-width: 0; }
.ep-drop-input::placeholder { color: #ccc; }
.ep-drop-clear { background: none; border: none; color: #bbb; cursor: pointer; padding: 2px; display: flex; align-items: center; }
.ep-drop-clear:hover { color: #111; }

.ep-drop-section { padding: 14px; }
.ep-drop-sec-label { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 10px; }

.ep-drop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
.ep-pop-item {
  display: flex; align-items: center; gap: 8px; padding: 9px 10px;
  background: #f8f8f5; border: none; border-radius: 10px;
  cursor: pointer; transition: background 0.12s; text-align: left;
}
.ep-pop-item:hover { background: #edf5f1; }
.ep-pop-icon { width: 28px; height: 28px; border-radius: 8px; background: #fff; border: 1px solid #e8e8e0; display: flex; align-items: center; justify-content: center; color: #888; flex-shrink: 0; }
.ep-pop-flag { font-size: 16px; line-height: 1; }
.ep-pop-name { font-size: 12px; font-weight: 600; color: #111; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ep-pop-code { font-size: 10px; font-weight: 600; color: #999; background: #f0f0ea; padding: 1px 5px; border-radius: 4px; }

.ep-drop-results { padding: 8px; }
.ep-loc-result { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; background: none; border: none; border-radius: 8px; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.12s; color: #555; text-align: left; }
.ep-loc-result:hover { background: #f5f5f0; }
.ep-loc-city { font-size: 13px; font-weight: 500; color: #111; flex: 1; }
.ep-loc-code { font-size: 10px; font-weight: 700; color: #1d7a4f; background: #edf5f1; padding: 2px 6px; border-radius: 5px; }
.ep-drop-empty { padding: 16px; text-align: center; font-size: 12px; color: #bbb; }

/* When picker */
.ep-when-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 10px 14px 14px; }
.ep-when-btn {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 10px 8px; background: #fafaf7;
  border: 1.5px solid transparent; border-radius: 10px;
  cursor: pointer; transition: all 0.14s;
}
.ep-when-btn:hover { border-color: #cce8d8; }
.ep-when-btn--on { background: #edf5f1; border-color: #1d7a4f; }
.ep-when-ico { font-size: 16px; }
.ep-when-lbl { font-size: 10px; font-weight: 600; color: #333; }
.ep-when-btn--on .ep-when-lbl { color: #1d7a4f; }

/* ── Main ──────────────────────────────────────────────────────────── */
.ep-main { padding-top: 32px; padding-bottom: 60px; }

/* Filter strip */
.ep-filter-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px; margin-bottom: 28px; flex-wrap: wrap;
}
.ep-filter-pills { display: flex; flex-wrap: wrap; gap: 6px; }
.ep-cat {
  display: flex; align-items: center; gap: 6px; padding: 7px 14px;
  background: #fff; border: 1.5px solid #e8e8e0; border-radius: 99px;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; color: #555;
  cursor: pointer; transition: all 0.15s;
}
.ep-cat:hover { border-color: #1d7a4f; color: #1d7a4f; }
.ep-cat--on { background: #edf5f1; border-color: #1d7a4f; color: #1d7a4f; font-weight: 600; }

.ep-reset-all {
  display: flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: #bbb; background: none; border: none; cursor: pointer; transition: color 0.15s;
}
.ep-reset-all:hover { color: #1d7a4f; }

/* Body grid */
.ep-body { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start; }

/* Sidebar */
.ep-sidebar { position: sticky; top: 20px; }
.ep-sbar { background: #fff; border: 1px solid #eaeae3; border-radius: 14px; padding: 18px; max-height: calc(100vh - 100px); overflow-y: auto; }
.ep-sbar-hd { display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #111; padding-bottom: 14px; border-bottom: 1px solid #f0f0ea; margin-bottom: 18px; }
.ep-reset { margin-left: auto; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; background: none; border: none; cursor: pointer; }
.ep-reset:hover { color: #1d7a4f; }

.ep-sb-block { margin-bottom: 20px; }
.ep-sb-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 10px; }
.ep-sb-label strong { color: #111; text-transform: none; letter-spacing: 0; font-size: 12px; }

.ep-chips { display: flex; flex-direction: column; gap: 5px; }
.ep-chip { padding: 8px 12px; background: #fafaf7; border: 1.5px solid transparent; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; color: #555; cursor: pointer; text-align: left; transition: all 0.14s; }
.ep-chip:hover { border-color: #cce8d8; color: #1d7a4f; }
.ep-chip--on { background: #edf5f1; border-color: #1d7a4f; color: #1d7a4f; font-weight: 600; }

.ep-range-wrap { display: flex; flex-direction: column; gap: 7px; }
.ep-range { width: 100%; -webkit-appearance: none; height: 3px; background: #e8e8e0; border-radius: 2px; outline: none; cursor: pointer; accent-color: #1d7a4f; }
.ep-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border: 2px solid #1d7a4f; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 6px rgba(29,122,79,0.2); }
.ep-range-ends { display: flex; justify-content: space-between; font-size: 10px; color: #bbb; }

/* Toolbar */
.ep-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.ep-rcount { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #aaa; }
.ep-toolbar-r { display: flex; align-items: center; gap: 8px; }

.ep-sort-wrap { position: relative; }
.ep-sort-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #fff; border: 1px solid #e0e0d8; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 500; color: #333; cursor: pointer; white-space: nowrap; }
.ep-sort-btn:hover { border-color: #aaa; }
.ep-chev { transition: transform 0.18s; color: #aaa; }
.ep-chev--up { transform: rotate(180deg); }

.ep-sort-panel { position: absolute; right: 0; top: calc(100% + 5px); background: #fff; border: 1px solid #e0e0d8; border-radius: 12px; padding: 5px; min-width: 200px; z-index: 100; box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.ep-sort-opt { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px; border: none; border-radius: 7px; background: none; font-family: 'Sora', sans-serif; font-size: 12px; color: #333; cursor: pointer; text-align: left; transition: background 0.12s; }
.ep-sort-opt:hover { background: #f5f5f0; }
.ep-sort-opt--on { font-weight: 600; color: #1d7a4f; }
.ep-sort-dot { width: 5px; height: 5px; border-radius: 50%; background: #d8d8d0; flex-shrink: 0; }
.ep-sort-dot--on { background: #1d7a4f; }

.ep-filter-mob { display: none; align-items: center; gap: 6px; padding: 7px 12px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; }

/* Loading */
.ep-loading { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.ep-skel-card { background: #fff; border: 1px solid #eaeae3; border-radius: 14px; overflow: hidden; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
.ep-sk { background: #f0f0ea; border-radius: 5px; }
.ep-sk--img { height: 180px; border-radius: 0; }
.ep-sk-body { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.ep-sk--tag { height: 14px; width: 50px; border-radius: 4px; }
.ep-sk--lg { height: 14px; width: 80%; }
.ep-sk--sm { height: 11px; width: 50%; }
.ep-sk-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
.ep-sk--price { height: 20px; width: 70px; }
.ep-sk--btn { height: 30px; width: 70px; border-radius: 8px; }

/* Empty */
.ep-empty { display: flex; flex-direction: column; align-items: center; padding: 72px 24px; gap: 10px; text-align: center; background: #fff; border: 1px solid #eaeae3; border-radius: 14px; }
.ep-empty-ico { width: 56px; height: 56px; border-radius: 14px; background: #f5fbf7; display: flex; align-items: center; justify-content: center; color: #1d7a4f; margin-bottom: 4px; }
.ep-empty-h { font-size: 20px; font-weight: 700; color: #111; }
.ep-empty-p { font-size: 13px; color: #aaa; max-width: 300px; line-height: 1.6; }
.ep-empty-btn { margin-top: 6px; padding: 10px 22px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.18s; }
.ep-empty-btn:hover { background: #1d7a4f; }

/* Deal grid */
.ep-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }

/* Deal card */
.ep-card { background: #fff; border: 1.5px solid #eaeae3; border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
.ep-card:hover { border-color: #1d7a4f; box-shadow: 0 6px 24px rgba(29,122,79,0.07); transform: translateY(-2px); }

.ep-card-img-wrap { position: relative; height: 180px; overflow: hidden; }
.ep-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.ep-card:hover .ep-card-img { transform: scale(1.05); }
.ep-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%); }

.ep-card-price-badge {
  position: absolute; bottom: 12px; left: 12px;
  background: #1d7a4f; border-radius: 9px;
  padding: 6px 10px; display: flex; flex-direction: column; gap: 1px;
}
.ep-price-from { font-size: 8px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.08em; text-transform: uppercase; }
.ep-price-amt { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.02em; line-height: 1; }

.ep-card-cat-badge {
  position: absolute; top: 10px; right: 10px;
  background: rgba(255,255,255,0.92); border-radius: 5px;
  font-size: 9px; font-weight: 700; color: #333;
  padding: 3px 8px; letter-spacing: 0.06em; text-transform: uppercase;
}

.ep-card-body { padding: 14px; }
.ep-card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.ep-card-route { display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #1d7a4f; }
.ep-card-dates { font-size: 9px; font-weight: 600; color: #bbb; background: #f5f5f0; padding: 2px 6px; border-radius: 4px; }
.ep-card-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 10px; letter-spacing: -0.01em; }

.ep-card-footer { display: flex; align-items: center; justify-content: space-between; }
.ep-card-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.ep-tag { font-size: 9px; font-weight: 600; color: #555; background: #f5f5f0; padding: 2px 7px; border-radius: 4px; }
.ep-card-btn { padding: 7px 14px; background: #111; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.15s; flex-shrink: 0; }
.ep-card-btn:hover { background: #1d7a4f; }

/* Overlay */
.ep-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.38); z-index: 150; backdrop-filter: blur(2px); }

/* ── Transitions ───────────────────────────────────────────────────── */
.fd-enter-active, .fd-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.fd-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.fd-leave-to { opacity: 0; transform: translateY(-3px) scale(0.99); }

.ep-ov-enter-active, .ep-ov-leave-active { transition: opacity 0.22s ease; }
.ep-ov-enter-from, .ep-ov-leave-to { opacity: 0; }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .ep-body { grid-template-columns: 1fr; }
  .ep-sidebar { position: static; }
  .ep-sbar { display: none; }
  .ep-sidebar--open .ep-sbar { display: block; position: fixed; bottom: 0; left: 0; right: 0; border-radius: 18px 18px 0 0; z-index: 200; max-height: 85vh; overflow-y: auto; }
  .ep-filter-mob { display: flex; }
}

@media (max-width: 860px) {
  .ep-bar { flex-wrap: wrap; border-radius: 14px; padding: 6px; }
  .ep-fld--from, .ep-fld--to { flex: 1 0 calc(50% - 20px); }
  .ep-swap { order: 3; align-self: flex-start; margin: 6px 2px; }
  .ep-bar-sep { height: 1px; width: 100%; margin: 0; }
  .ep-fld--when { flex: 1 0 100%; }
  .ep-search-btn { flex: 1 0 100%; margin: 4px 0 0; border-radius: 10px; min-height: 46px; }
}

@media (max-width: 580px) {
  .ep-wrap { padding: 0 14px; }
  .ep-hero { padding: 28px 0 44px; }
  .ep-fld--from, .ep-fld--to, .ep-fld--when { flex: 1 0 100%; }
  .ep-swap { order: 2; margin: 2px 0; }
  .ep-bar-sep { display: none; }
  .ep-drop--loc { max-width: calc(100vw - 28px); }
  .ep-drop--when { width: calc(100vw - 28px); }
  .ep-grid { grid-template-columns: 1fr; }
}
</style>