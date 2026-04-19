<template>
  <div class="pk-root" @mousedown="handleGlobalMousedown">

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="pk-hero">
      <div class="pk-hero-bg">
        <div class="pk-orb pk-orb--a"></div>
        <div class="pk-orb pk-orb--b"></div>
      </div>

      <div class="pk-wrap">

        <!-- Dynamic headline -->
        <div class="pk-headline">
          <span class="pk-eyebrow">✦ Vacation Packages</span>
          <h1 class="pk-h1">
            <template v-if="searchQuery.destination">
              Escaping to<br><em>{{ searchQuery.destination }}</em>
            </template>
            <template v-else>
              Discover<br><em>dream getaways.</em>
            </template>
          </h1>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="pk-bar">

          <!-- DESTINATION field -->
          <div class="pk-fld pk-fld--dest" :class="{ 'pk-fld--active': activeField === 'dest' }" ref="destRef">
            <div class="pk-fld-inner" @click="openField('dest')">
              <svg class="pk-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div class="pk-fld-text">
                <span class="pk-fld-lbl">Destination</span>
                <span class="pk-fld-val" :class="{ 'pk-fld-val--set': searchQuery.destination }">
                  {{ searchQuery.destination || 'Where to?' }}
                </span>
              </div>
            </div>
            <!-- Destination dropdown -->
            <Transition name="fd">
              <div v-if="activeField === 'dest'" class="pk-drop pk-drop--dest" @mousedown.stop>
                <div class="pk-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="destInputRef" v-model="destQuery" placeholder="Search destination…" class="pk-drop-input" @input="searchDestinations" />
                  <button v-if="destQuery" class="pk-drop-clear" @click="destQuery=''; searchQuery.destination=''">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div v-if="!destQuery" class="pk-drop-section">
                  <span class="pk-drop-sec-label">Popular escapes</span>
                  <div class="pk-drop-grid">
                    <button v-for="p in popularDestinations" :key="p.name" class="pk-pop-item" @click="selectDestination(p.name)">
                      <span class="pk-pop-flag">{{ p.flag }}</span>
                      <span class="pk-pop-name">{{ p.name }}</span>
                    </button>
                  </div>
                </div>
                <div v-else class="pk-drop-results">
                  <button v-for="r in destinationResults" :key="r" class="pk-loc-result" @click="selectDestination(r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="pk-loc-city">{{ r }}</span>
                  </button>
                  <div v-if="!destinationResults.length" class="pk-drop-empty">No results for "{{ destQuery }}"</div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="pk-bar-sep"></div>

          <!-- DURATION field -->
          <div class="pk-fld pk-fld--dur" :class="{ 'pk-fld--active': activeField === 'dur' }" ref="durRef">
            <div class="pk-fld-inner" @click="openField('dur')">
              <svg class="pk-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div class="pk-fld-text">
                <span class="pk-fld-lbl">Duration</span>
                <span class="pk-fld-val" :class="{ 'pk-fld-val--set': searchQuery.duration }">
                  {{ searchQuery.duration ? searchQuery.duration + ' nights' : 'Any length' }}
                </span>
              </div>
            </div>
            <Transition name="fd">
              <div v-if="activeField === 'dur'" class="pk-drop pk-drop--dur" @mousedown.stop>
                <span class="pk-drop-sec-label" style="padding: 14px 14px 8px; display: block;">Nights away</span>
                <div class="pk-dur-grid">
                  <button v-for="d in durationOptions" :key="d.value"
                    class="pk-dur-btn"
                    :class="{ 'pk-dur-btn--on': searchQuery.duration === d.value }"
                    @click="searchQuery.duration = d.value; activeField = null">
                    <span class="pk-dur-num">{{ d.label }}</span>
                    <span class="pk-dur-sub">{{ d.sub }}</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <div class="pk-bar-sep"></div>

          <!-- BUDGET field -->
          <div class="pk-fld pk-fld--bud" :class="{ 'pk-fld--active': activeField === 'bud' }" ref="budRef">
            <div class="pk-fld-inner" @click="openField('bud')">
              <svg class="pk-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              <div class="pk-fld-text">
                <span class="pk-fld-lbl">Budget</span>
                <span class="pk-fld-val" :class="{ 'pk-fld-val--set': searchQuery.budget }">
                  {{ searchQuery.budget ? searchQuery.budget : 'Any budget' }}
                </span>
              </div>
            </div>
            <Transition name="fd">
              <div v-if="activeField === 'bud'" class="pk-drop pk-drop--bud" @mousedown.stop>
                <span class="pk-drop-sec-label" style="padding: 14px 14px 8px; display: block;">Price range</span>
                <div class="pk-bud-list">
                  <button v-for="b in budgetOptions" :key="b.value"
                    class="pk-bud-btn"
                    :class="{ 'pk-bud-btn--on': searchQuery.budget === b.value }"
                    @click="searchQuery.budget = b.value; activeField = null">
                    <span class="pk-bud-dot" :class="`pk-bud-dot--${b.tier}`"></span>
                    {{ b.label }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- SEARCH BTN -->
          <button class="pk-search-btn" :class="{ 'pk-search-btn--busy': loading }" @click="handleSearch">
            <span class="pk-search-inner">
              <svg v-if="!loading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span v-if="loading" class="pk-spin"></span>
              <span>{{ loading ? 'Searching' : 'Search' }}</span>
            </span>
          </button>

        </div><!-- /pk-bar -->
      </div><!-- /pk-wrap -->
    </section>

    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="pk-wrap pk-main">

      <!-- Category pills -->
      <div class="pk-cats">
        <button v-for="c in categories" :key="c.value"
          class="pk-cat"
          :class="{ 'pk-cat--on': activeCategory === c.value }"
          @click="activeCategory = activeCategory === c.value ? '' : c.value">
          <span>{{ c.icon }}</span>
          <span>{{ c.label }}</span>
        </button>
      </div>

      <!-- Featured packages -->
      <Transition name="pk-fade">
        <div v-if="featuredPackages.length && !loading" class="pk-featured-section">
          <div class="pk-sec-hd">
            <div>
              <span class="pk-sec-label">Hand-Picked</span>
              <h2 class="pk-sec-title">Elite Curations</h2>
            </div>
            <span class="pk-sec-hint">{{ featuredPackages.length }} featured deals</span>
          </div>
          <div class="pk-featured-grid">
            <div v-for="pkg in featuredPackages.slice(0, 3)" :key="pkg._id || pkg.id"
              class="pk-featured-card"
              @click="selectPackage(pkg)">
              <div class="pk-fc-img-wrap">
                <img v-if="pkg.image || pkg.thumbnail" :src="pkg.image || pkg.thumbnail" :alt="pkg.name" class="pk-fc-img" />
                <div v-else class="pk-fc-img-ph">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div class="pk-fc-badge">✦ Featured</div>
                <div class="pk-fc-overlay"></div>
              </div>
              <div class="pk-fc-body">
                <div class="pk-fc-meta">
                  <span class="pk-fc-dest">{{ pkg.destination || pkg.name }}</span>
                  <span v-if="pkg.duration" class="pk-fc-dur">{{ pkg.duration }} nights</span>
                </div>
                <h3 class="pk-fc-title">{{ pkg.name }}</h3>
                <p v-if="pkg.description" class="pk-fc-desc">{{ pkg.description }}</p>
                <div class="pk-fc-footer">
                  <div class="pk-fc-price">
                    <span class="pk-fc-from">from</span>
                    <span class="pk-fc-amt">${{ (pkg.price?.total || pkg.price?.amount || pkg.price || 0).toLocaleString() }}</span>
                    <span class="pk-fc-per">/ person</span>
                  </div>
                  <button class="pk-fc-btn">View deal →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Body grid -->
      <div class="pk-body">

        <!-- Sidebar -->
        <aside class="pk-sidebar" :class="{ 'pk-sidebar--open': mobileFilters }">
          <div class="pk-sbar">
            <div class="pk-sbar-hd">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Refine results</span>
              <button class="pk-reset" @click="clearFilters">Reset</button>
            </div>

            <div class="pk-sb-block">
              <p class="pk-sb-label">Category</p>
              <div class="pk-chips">
                <button v-for="c in categories" :key="c.value"
                  class="pk-chip"
                  :class="{ 'pk-chip--on': activeCategory === c.value }"
                  @click="activeCategory = activeCategory === c.value ? '' : c.value">
                  {{ c.icon }} {{ c.label }}
                </button>
              </div>
            </div>

            <div class="pk-sb-block">
              <p class="pk-sb-label">Duration</p>
              <div class="pk-chips">
                <button v-for="d in durationOptions" :key="d.value"
                  class="pk-chip"
                  :class="{ 'pk-chip--on': searchQuery.duration === d.value }"
                  @click="searchQuery.duration = searchQuery.duration === d.value ? null : d.value">
                  {{ d.label }}
                </button>
              </div>
            </div>

            <div class="pk-sb-block">
              <p class="pk-sb-label">Max price <strong>${{ maxPriceFilter.toLocaleString() }}</strong></p>
              <div class="pk-range-wrap">
                <input type="range" :min="minPrice" :max="maxPrice" step="50" v-model.number="maxPriceFilter" class="pk-range" />
                <div class="pk-range-ends">
                  <span>${{ minPrice.toLocaleString() }}</span>
                  <span>${{ maxPrice.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="pk-sb-block">
              <p class="pk-sb-label">Star rating</p>
              <div class="pk-chips">
                <button v-for="s in [5, 4, 3]" :key="s"
                  class="pk-chip"
                  :class="{ 'pk-chip--on': activeStars.includes(s) }"
                  @click="toggleStar(s)">
                  {{ '★'.repeat(s) }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="pk-results">

          <!-- Toolbar -->
          <div v-if="filteredPackages.length || loading" class="pk-toolbar">
            <span class="pk-rcount">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              {{ filteredPackages.length }} packages found
            </span>
            <div class="pk-toolbar-r">
              <div class="pk-sort-wrap" ref="sortRef">
                <button class="pk-sort-btn" @click.stop="sortOpen = !sortOpen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                  {{ currentSort.label }}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="pk-chev" :class="{ 'pk-chev--up': sortOpen }"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <Transition name="fd">
                  <div v-if="sortOpen" class="pk-sort-panel" @mousedown.stop>
                    <button v-for="o in sortOptions" :key="o.value"
                      class="pk-sort-opt"
                      :class="{ 'pk-sort-opt--on': sortBy === o.value }"
                      @click="sortBy = o.value; sortOpen = false">
                      <span class="pk-sort-dot" :class="{ 'pk-sort-dot--on': sortBy === o.value }"></span>
                      {{ o.label }}
                    </button>
                  </div>
                </Transition>
              </div>
              <button class="pk-filter-mob" @click="mobileFilters = !mobileFilters">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
                <span v-if="activeFilterCount" class="pk-badge">{{ activeFilterCount }}</span>
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="pk-loading">
            <div v-for="n in 6" :key="n" class="pk-skel-card">
              <div class="pk-sk pk-sk--img"></div>
              <div class="pk-sk-body">
                <div class="pk-sk pk-sk--tag"></div>
                <div class="pk-sk pk-sk--lg"></div>
                <div class="pk-sk pk-sk--sm"></div>
                <div class="pk-sk-footer">
                  <div class="pk-sk pk-sk--price"></div>
                  <div class="pk-sk pk-sk--btn"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!filteredPackages.length" class="pk-empty">
            <div class="pk-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h3 class="pk-empty-h">No packages found</h3>
            <p class="pk-empty-p">Try a different destination or widen your filters to see more options.</p>
            <button class="pk-empty-btn" @click="clearFilters(); searchQuery.destination = 'Maldives'; handleSearch()">Explore Maldives</button>
          </div>

          <!-- Package grid -->
          <div v-else class="pk-grid">
            <div v-for="pkg in sortedPackages" :key="pkg._id || pkg.id"
              class="pk-card"
              @click="selectPackage(pkg)">
              <!-- Image -->
              <div class="pk-card-img-wrap">
                <img v-if="pkg.image || pkg.thumbnail" :src="pkg.image || pkg.thumbnail" :alt="pkg.name" class="pk-card-img" />
                <div v-else class="pk-card-img-ph">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                </div>
                <!-- Badges -->
                <div class="pk-card-badges">
                  <span v-if="pkg.featured" class="pk-badge-tag pk-badge-tag--feat">✦ Featured</span>
                  <span v-if="pkg.discount" class="pk-badge-tag pk-badge-tag--disc">{{ pkg.discount }}% off</span>
                </div>
                <!-- Star rating -->
                <div v-if="pkg.stars" class="pk-card-stars">
                  <span v-for="s in pkg.stars" :key="s">★</span>
                </div>
              </div>

              <!-- Body -->
              <div class="pk-card-body">
                <div class="pk-card-meta">
                  <span class="pk-card-dest">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ pkg.destination || pkg.name }}
                  </span>
                  <span v-if="pkg.duration" class="pk-card-dur">{{ pkg.duration }}N</span>
                </div>

                <h3 class="pk-card-title">{{ pkg.name }}</h3>

                <p v-if="pkg.description" class="pk-card-desc">{{ pkg.description }}</p>

                <!-- Inclusions -->
                <div v-if="pkg.inclusions?.length" class="pk-incl">
                  <span v-for="inc in pkg.inclusions.slice(0,3)" :key="inc" class="pk-incl-chip">{{ inc }}</span>
                </div>

                <div class="pk-card-footer">
                  <div class="pk-card-price">
                    <span class="pk-card-from">from</span>
                    <span class="pk-card-amt">${{ (pkg.price?.total || pkg.price?.amount || pkg.price || 0).toLocaleString() }}</span>
                    <span class="pk-card-per">/ person</span>
                  </div>
                  <button class="pk-card-btn" @click.stop="selectPackage(pkg)">View →</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Mobile filter overlay -->
    <Transition name="pk-ov">
      <div v-if="mobileFilters" class="pk-overlay" @click.self="mobileFilters = false"></div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useFetchAllPackages } from '~/composables/modules/packages/useFetchAllPackages'
import { useFetchFeaturedPackages } from '~/composables/modules/packages/useFetchFeaturedPackages'

const { loading, packages, fetchAllPackages } = useFetchAllPackages()
const { featuredPackages, fetchFeaturedPackages } = useFetchFeaturedPackages()

// ── Refs ──────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const destRef = ref<HTMLElement | null>(null)
const durRef = ref<HTMLElement | null>(null)
const budRef = ref<HTMLElement | null>(null)
const sortRef = ref<HTMLElement | null>(null)
const destInputRef = ref<HTMLInputElement | null>(null)
const destQuery = ref('')
const destinationResults = ref<string[]>([])
const sortOpen = ref(false)
const mobileFilters = ref(false)
const activeCategory = ref('')
const activeStars = ref<number[]>([])
const maxPriceFilter = ref(99999)
const sortBy = ref('recommended')

const searchQuery = ref({ destination: '', duration: null as number | null, budget: '' })

// ── Data ─────────────────────────────────────────────────────────────
const popularDestinations = [
  { name: 'Maldives', flag: '🏝️' },
  { name: 'Dubai', flag: '🏙️' },
  { name: 'Paris', flag: '🗼' },
  { name: 'Bali', flag: '🌿' },
  { name: 'New York', flag: '🗽' },
  { name: 'Tokyo', flag: '⛩️' },
  { name: 'Santorini', flag: '🌊' },
  { name: 'Cape Town', flag: '🦁' },
]

const allDestinations = [
  'Maldives', 'Dubai', 'Paris', 'Bali', 'New York', 'Tokyo', 'Santorini', 'Cape Town',
  'London', 'Rome', 'Barcelona', 'Amsterdam', 'Istanbul', 'Singapore', 'Sydney',
  'Nairobi', 'Lagos', 'Accra', 'Marrakech', 'Cairo', 'Lisbon', 'Vienna', 'Prague',
  'Bangkok', 'Phuket', 'Cancun', 'Miami', 'Los Angeles', 'Las Vegas', 'Zanzibar',
]

const categories = [
  { value: 'beach', label: 'Beach', icon: '🏖️' },
  { value: 'city', label: 'City Break', icon: '🏙️' },
  { value: 'safari', label: 'Safari', icon: '🦁' },
  { value: 'luxury', label: 'Luxury', icon: '💎' },
  { value: 'adventure', label: 'Adventure', icon: '🧗' },
  { value: 'honeymoon', label: 'Honeymoon', icon: '💕' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { value: 'cultural', label: 'Cultural', icon: '🏛️' },
]

const durationOptions = [
  { value: 3, label: '3 nights', sub: 'Weekend' },
  { value: 5, label: '5 nights', sub: 'Short break' },
  { value: 7, label: '7 nights', sub: 'Classic' },
  { value: 10, label: '10 nights', sub: 'Extended' },
  { value: 14, label: '14 nights', sub: 'Fortnight' },
]

const budgetOptions = [
  { value: 'Economy', label: 'Economy (under $1,000)', tier: 'eco' },
  { value: 'Standard', label: 'Standard ($1,000 – $2,500)', tier: 'std' },
  { value: 'Premium', label: 'Premium ($2,500 – $5,000)', tier: 'pre' },
  { value: 'Luxury', label: 'Luxury ($5,000+)', tier: 'lux' },
]

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price — low to high' },
  { value: 'price_desc', label: 'Price — high to low' },
  { value: 'duration', label: 'Duration — shortest' },
]

const currentSort = computed(() => sortOptions.find(o => o.value === sortBy.value)!)

// ── Destination search ────────────────────────────────────────────────
const searchDestinations = () => {
  const q = destQuery.value
  if (!q) { destinationResults.value = []; return }
  const lq = q.toLowerCase()
  destinationResults.value = allDestinations.filter(d => d.toLowerCase().includes(lq)).slice(0, 8)
}

const selectDestination = (name: string) => {
  searchQuery.value.destination = name
  destQuery.value = name
  activeField.value = null
  nextTick(() => { activeField.value = 'dur' })
}

// ── Field management ──────────────────────────────────────────────────
const openField = (field: string) => {
  activeField.value = activeField.value === field ? null : field
  if (field === 'dest') nextTick(() => destInputRef.value?.focus())
}

const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { dest: destRef, dur: durRef, bud: budRef }
  if (activeField.value) {
    const r = refs[activeField.value]?.value
    if (r && !r.contains(e.target as Node)) activeField.value = null
  }
  if (sortRef.value && !sortRef.value.contains(e.target as Node)) sortOpen.value = false
}

// ── Filters & computed ────────────────────────────────────────────────
const minPrice = computed(() => {
  if (!packages.value?.length) return 0
  return Math.floor(Math.min(...packages.value.map((p: any) => p.price?.total || p.price?.amount || p.price || 0)))
})
const maxPrice = computed(() => {
  if (!packages.value?.length) return 10000
  return Math.ceil(Math.max(...packages.value.map((p: any) => p.price?.total || p.price?.amount || p.price || 0)))
})
watch(maxPrice, v => { maxPriceFilter.value = v }, { immediate: true })

const filteredPackages = computed(() => {
  if (!packages.value) return []
  return packages.value.filter((p: any) => {
    const price = p.price?.total || p.price?.amount || p.price || 0
    if (price > maxPriceFilter.value) return false
    if (activeCategory.value && p.category !== activeCategory.value) return false
    if (activeStars.value.length && !activeStars.value.includes(p.stars)) return false
    return true
  })
})

const sortedPackages = computed(() =>
  [...filteredPackages.value].sort((a: any, b: any) => {
    const pa = a.price?.total || a.price?.amount || a.price || 0
    const pb = b.price?.total || b.price?.amount || b.price || 0
    if (sortBy.value === 'price_asc') return pa - pb
    if (sortBy.value === 'price_desc') return pb - pa
    if (sortBy.value === 'duration') return (a.duration || 99) - (b.duration || 99)
    return 0
  })
)

const activeFilterCount = computed(() =>
  (activeCategory.value ? 1 : 0) + activeStars.value.length + (maxPriceFilter.value < maxPrice.value ? 1 : 0)
)

// ── Actions ───────────────────────────────────────────────────────────
const handleSearch = () => {
  activeField.value = null
  fetchAllPackages({ q: searchQuery.value.destination, duration: searchQuery.value.duration })
}

const selectPackage = (pkg: any) => {
  if (!pkg) return
  try { sessionStorage.setItem('selectedPackage', JSON.stringify(pkg)) } catch {}
  navigateTo({
    path: '/checkout',
    query: {
      type: 'package',
      id: String(pkg._id || pkg.id || 'unknown'),
      name: String(pkg.name),
      price: String(pkg.price?.total || pkg.price?.amount || pkg.price || 0),
    }
  })
}

const toggleStar = (s: number) => {
  const i = activeStars.value.indexOf(s)
  if (i >= 0) activeStars.value.splice(i, 1); else activeStars.value.push(s)
}

const clearFilters = () => {
  activeCategory.value = ''
  activeStars.value = []
  maxPriceFilter.value = maxPrice.value
  searchQuery.value.duration = null
}

onMounted(() => {
  const route = useRoute()
  if (route.query.q) {
    searchQuery.value.destination = String(route.query.q)
    destQuery.value = String(route.query.q)
  }
  fetchFeaturedPackages()
  handleSearch()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.pk-root {
  min-height: 100vh;
  background: #fff;
  font-family: 'Sora', system-ui, sans-serif;
  color: #111;
}

.pk-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.pk-hero {
  background: #f8f9f7;
  border-bottom: 1px solid #e8e8e2;
  padding: 40px 0 56px;
  position: relative;
  overflow: visible;
}

.pk-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.pk-orb { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.28; }
.pk-orb--a { width: 420px; height: 420px; background: radial-gradient(circle, #b8e8cc, transparent); top: -180px; right: -60px; }
.pk-orb--b { width: 300px; height: 300px; background: radial-gradient(circle, #d4e6ff, transparent); bottom: -100px; left: 8%; }

.pk-headline { margin-bottom: 28px; }
.pk-eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #999; display: block; margin-bottom: 10px; }
.pk-h1 { font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.12; color: #111; letter-spacing: -0.03em; }
.pk-h1 em { font-style: normal; color: #1d7a4f; }

/* ── Search bar ────────────────────────────────────────────────────── */
.pk-bar {
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

.pk-fld { position: relative; flex: 1; min-width: 0; }
.pk-fld--dest { flex: 2; }
.pk-fld--dur { flex: 1.2; }
.pk-fld--bud { flex: 1.4; }

.pk-fld-inner {
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
.pk-fld-inner:hover { background: #f5f5f0; }
.pk-fld--active .pk-fld-inner { background: #f0f7f3; }

.pk-fld-ico { color: #aaa; flex-shrink: 0; }
.pk-fld-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; overflow: hidden; }
.pk-fld-lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; white-space: nowrap; }
.pk-fld-val { font-size: 13px; font-weight: 500; color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pk-fld-val--set { color: #111; }

.pk-bar-sep { width: 1px; background: #ebebe5; flex-shrink: 0; margin: 10px 0; }

/* Search button */
.pk-search-btn {
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
.pk-search-btn:hover { background: #1d7a4f; }
.pk-search-btn--busy { opacity: 0.75; cursor: wait; }
.pk-search-inner { display: flex; align-items: center; justify-content: center; gap: 7px; white-space: nowrap; }
.pk-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Dropdowns ─────────────────────────────────────────────────────── */
.pk-drop {
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

.pk-drop--dest { width: max(300px, 100%); min-width: 300px; max-width: 400px; }
.pk-drop--dur { width: 260px; }
.pk-drop--bud { width: 280px; }

.pk-drop-search {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0ea;
  background: #fafaf8;
  color: #aaa;
}
.pk-drop-input { flex: 1; border: none; background: transparent; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 400; color: #111; outline: none; min-width: 0; }
.pk-drop-input::placeholder { color: #ccc; }
.pk-drop-clear { background: none; border: none; color: #bbb; cursor: pointer; padding: 2px; display: flex; align-items: center; transition: color 0.15s; }
.pk-drop-clear:hover { color: #111; }

.pk-drop-section { padding: 14px; }
.pk-drop-sec-label { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 10px; }

.pk-drop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
.pk-pop-item {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 10px;
  background: #f8f8f5;
  border: none; border-radius: 10px;
  cursor: pointer;
  transition: background 0.12s;
  text-align: left;
}
.pk-pop-item:hover { background: #edf5f1; }
.pk-pop-flag { font-size: 16px; line-height: 1; }
.pk-pop-name { font-size: 12px; font-weight: 600; color: #111; }

.pk-drop-results { padding: 8px; }
.pk-loc-result {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 10px;
  background: none; border: none; border-radius: 8px;
  cursor: pointer; font-family: 'Sora', sans-serif;
  transition: background 0.12s; color: #555; text-align: left;
}
.pk-loc-result:hover { background: #f5f5f0; }
.pk-loc-city { font-size: 13px; font-weight: 500; color: #111; flex: 1; text-align: left; }
.pk-drop-empty { padding: 16px; text-align: center; font-size: 12px; color: #bbb; }

/* Duration grid */
.pk-dur-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 10px 14px 14px; }
.pk-dur-btn {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 10px 8px;
  background: #fafaf7; border: 1.5px solid transparent;
  border-radius: 10px; cursor: pointer;
  transition: all 0.14s; text-align: center;
}
.pk-dur-btn:hover { border-color: #cce8d8; }
.pk-dur-btn--on { background: #edf5f1; border-color: #1d7a4f; }
.pk-dur-num { font-size: 12px; font-weight: 600; color: #111; }
.pk-dur-sub { font-size: 9px; color: #bbb; font-weight: 500; }
.pk-dur-btn--on .pk-dur-num { color: #1d7a4f; }

/* Budget list */
.pk-bud-list { padding: 8px 8px 12px; }
.pk-bud-btn {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 11px;
  background: none; border: none; border-radius: 8px;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
  color: #333; cursor: pointer; text-align: left;
  transition: background 0.12s;
}
.pk-bud-btn:hover { background: #f5f5f0; }
.pk-bud-btn--on { font-weight: 600; color: #1d7a4f; background: #f0f7f3; }
.pk-bud-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.pk-bud-dot--eco { background: #aaa; }
.pk-bud-dot--std { background: #60a5fa; }
.pk-bud-dot--pre { background: #f59e0b; }
.pk-bud-dot--lux { background: #1d7a4f; }

/* ── Main content ──────────────────────────────────────────────────── */
.pk-main { padding-top: 36px; padding-bottom: 60px; }

/* Category pills */
.pk-cats {
  display: flex; flex-wrap: wrap; gap: 6px;
  margin-bottom: 32px;
}
.pk-cat {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  background: #fff; border: 1.5px solid #e8e8e0;
  border-radius: 99px;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
  color: #555; cursor: pointer;
  transition: all 0.15s;
}
.pk-cat:hover { border-color: #1d7a4f; color: #1d7a4f; }
.pk-cat--on { background: #edf5f1; border-color: #1d7a4f; color: #1d7a4f; font-weight: 600; }

/* Featured section */
.pk-featured-section { margin-bottom: 40px; }
.pk-sec-hd {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 20px; gap: 10px;
}
.pk-sec-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #1d7a4f; display: block; margin-bottom: 4px; }
.pk-sec-title { font-size: 24px; font-weight: 700; color: #111; letter-spacing: -0.02em; }
.pk-sec-hint { font-size: 11px; color: #bbb; white-space: nowrap; }

.pk-featured-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

/* Featured card */
.pk-featured-card {
  background: #fff; border: 1.5px solid #eaeae3;
  border-radius: 16px; overflow: hidden;
  cursor: pointer; transition: all 0.2s;
}
.pk-featured-card:hover { border-color: #1d7a4f; box-shadow: 0 8px 28px rgba(29,122,79,0.08); transform: translateY(-2px); }

.pk-fc-img-wrap { position: relative; height: 200px; overflow: hidden; }
.pk-fc-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.pk-featured-card:hover .pk-fc-img { transform: scale(1.04); }
.pk-fc-img-ph { width: 100%; height: 100%; background: #f0f7f3; display: flex; align-items: center; justify-content: center; color: #1d7a4f; }
.pk-fc-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%); }
.pk-fc-badge { position: absolute; top: 12px; left: 12px; background: #1d7a4f; color: #fff; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }

.pk-fc-body { padding: 16px; }
.pk-fc-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.pk-fc-dest { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #1d7a4f; }
.pk-fc-dur { font-size: 10px; font-weight: 600; color: #bbb; background: #f5f5f0; padding: 2px 7px; border-radius: 4px; }
.pk-fc-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 6px; letter-spacing: -0.01em; }
.pk-fc-desc { font-size: 11px; color: #888; line-height: 1.6; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pk-fc-footer { display: flex; align-items: center; justify-content: space-between; }
.pk-fc-price { display: flex; align-items: baseline; gap: 3px; }
.pk-fc-from { font-size: 10px; color: #aaa; }
.pk-fc-amt { font-size: 20px; font-weight: 700; color: #111; letter-spacing: -0.03em; }
.pk-fc-per { font-size: 10px; color: #aaa; }
.pk-fc-btn { font-size: 11px; font-weight: 600; color: #1d7a4f; background: none; border: none; cursor: pointer; transition: opacity 0.15s; }
.pk-fc-btn:hover { opacity: 0.7; }

/* ── Body grid ─────────────────────────────────────────────────────── */
.pk-body { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start; }

/* Sidebar */
.pk-sidebar { position: sticky; top: 20px; }
.pk-sbar {
  background: #fff; border: 1px solid #eaeae3;
  border-radius: 14px; padding: 18px;
  max-height: calc(100vh - 100px); overflow-y: auto;
}
.pk-sbar-hd { display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #111; padding-bottom: 14px; border-bottom: 1px solid #f0f0ea; margin-bottom: 18px; }
.pk-reset { margin-left: auto; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; background: none; border: none; cursor: pointer; transition: color 0.15s; }
.pk-reset:hover { color: #1d7a4f; }

.pk-sb-block { margin-bottom: 20px; }
.pk-sb-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 10px; }
.pk-sb-label strong { color: #111; text-transform: none; letter-spacing: 0; font-size: 12px; }

.pk-chips { display: flex; flex-direction: column; gap: 5px; }
.pk-chip {
  padding: 8px 12px; background: #fafaf7;
  border: 1.5px solid transparent; border-radius: 8px;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; color: #555;
  cursor: pointer; text-align: left; transition: all 0.14s;
}
.pk-chip:hover { border-color: #cce8d8; color: #1d7a4f; }
.pk-chip--on { background: #edf5f1; border-color: #1d7a4f; color: #1d7a4f; font-weight: 600; }

.pk-range-wrap { display: flex; flex-direction: column; gap: 7px; }
.pk-range { width: 100%; -webkit-appearance: none; height: 3px; background: #e8e8e0; border-radius: 2px; outline: none; cursor: pointer; accent-color: #1d7a4f; }
.pk-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border: 2px solid #1d7a4f; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 6px rgba(29,122,79,0.2); }
.pk-range-ends { display: flex; justify-content: space-between; font-size: 10px; color: #bbb; }

/* Toolbar */
.pk-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.pk-rcount { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #aaa; }
.pk-toolbar-r { display: flex; align-items: center; gap: 8px; }

.pk-sort-wrap { position: relative; }
.pk-sort-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #fff; border: 1px solid #e0e0d8; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 500; color: #333; cursor: pointer; white-space: nowrap; transition: border-color 0.14s; }
.pk-sort-btn:hover { border-color: #aaa; }
.pk-chev { transition: transform 0.18s; color: #aaa; }
.pk-chev--up { transform: rotate(180deg); }

.pk-sort-panel { position: absolute; right: 0; top: calc(100% + 5px); background: #fff; border: 1px solid #e0e0d8; border-radius: 12px; padding: 5px; min-width: 210px; z-index: 100; box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.pk-sort-opt { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px; border: none; border-radius: 7px; background: none; font-family: 'Sora', sans-serif; font-size: 12px; color: #333; cursor: pointer; text-align: left; transition: background 0.12s; }
.pk-sort-opt:hover { background: #f5f5f0; }
.pk-sort-opt--on { font-weight: 600; color: #1d7a4f; }
.pk-sort-dot { width: 5px; height: 5px; border-radius: 50%; background: #d8d8d0; flex-shrink: 0; }
.pk-sort-dot--on { background: #1d7a4f; }

.pk-filter-mob { display: none; align-items: center; gap: 6px; padding: 7px 12px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; position: relative; }
.pk-badge { position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background: #1d7a4f; border-radius: 50%; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* Loading */
.pk-loading { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.pk-skel-card { background: #fff; border: 1px solid #eaeae3; border-radius: 14px; overflow: hidden; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
.pk-sk { background: #f0f0ea; border-radius: 5px; }
.pk-sk--img { height: 180px; border-radius: 0; }
.pk-sk-body { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.pk-sk--tag { height: 16px; width: 60px; border-radius: 4px; }
.pk-sk--lg { height: 14px; width: 80%; }
.pk-sk--sm { height: 11px; width: 55%; }
.pk-sk-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
.pk-sk--price { height: 20px; width: 80px; }
.pk-sk--btn { height: 32px; width: 80px; border-radius: 8px; }

/* Empty */
.pk-empty { display: flex; flex-direction: column; align-items: center; padding: 72px 24px; gap: 10px; text-align: center; background: #fff; border: 1px solid #eaeae3; border-radius: 14px; }
.pk-empty-ico { width: 56px; height: 56px; border-radius: 14px; background: #f5fbf7; display: flex; align-items: center; justify-content: center; color: #1d7a4f; margin-bottom: 4px; }
.pk-empty-h { font-size: 20px; font-weight: 700; color: #111; }
.pk-empty-p { font-size: 13px; color: #aaa; max-width: 300px; line-height: 1.6; }
.pk-empty-btn { margin-top: 6px; padding: 10px 22px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.18s; }
.pk-empty-btn:hover { background: #1d7a4f; }

/* Package grid */
.pk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }

/* Package card */
.pk-card {
  background: #fff; border: 1.5px solid #eaeae3;
  border-radius: 14px; overflow: hidden;
  cursor: pointer; transition: all 0.2s;
}
.pk-card:hover { border-color: #1d7a4f; box-shadow: 0 6px 24px rgba(29,122,79,0.07); transform: translateY(-2px); }

.pk-card-img-wrap { position: relative; height: 160px; overflow: hidden; }
.pk-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.pk-card:hover .pk-card-img { transform: scale(1.04); }
.pk-card-img-ph { width: 100%; height: 100%; background: #f0f7f3; display: flex; align-items: center; justify-content: center; color: #1d7a4f; opacity: 0.5; }

.pk-card-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; }
.pk-badge-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.06em; padding: 3px 7px; border-radius: 4px; }
.pk-badge-tag--feat { background: #1d7a4f; color: #fff; }
.pk-badge-tag--disc { background: #fff3e0; color: #c06010; }

.pk-card-stars { position: absolute; bottom: 10px; right: 10px; color: #f59e0b; font-size: 10px; background: rgba(0,0,0,0.45); padding: 2px 7px; border-radius: 4px; letter-spacing: 1px; }

.pk-card-body { padding: 14px; }
.pk-card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.pk-card-dest { display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #1d7a4f; }
.pk-card-dur { font-size: 9px; font-weight: 700; color: #bbb; background: #f5f5f0; padding: 2px 6px; border-radius: 4px; }

.pk-card-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; letter-spacing: -0.01em; }
.pk-card-desc { font-size: 11px; color: #888; line-height: 1.55; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.pk-incl { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px; }
.pk-incl-chip { font-size: 9px; font-weight: 600; color: #555; background: #f5f5f0; padding: 2px 7px; border-radius: 4px; }

.pk-card-footer { display: flex; align-items: center; justify-content: space-between; }
.pk-card-price { display: flex; align-items: baseline; gap: 3px; }
.pk-card-from { font-size: 10px; color: #aaa; }
.pk-card-amt { font-size: 18px; font-weight: 700; color: #111; letter-spacing: -0.03em; }
.pk-card-per { font-size: 10px; color: #aaa; }
.pk-card-btn { padding: 7px 14px; background: #111; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.15s; }
.pk-card-btn:hover { background: #1d7a4f; }

/* Overlay */
.pk-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.38); z-index: 150; backdrop-filter: blur(2px); }

/* ── Transitions ───────────────────────────────────────────────────── */
.fd-enter-active, .fd-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.fd-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.fd-leave-to { opacity: 0; transform: translateY(-3px) scale(0.99); }

.pk-fade-enter-active, .pk-fade-leave-active { transition: opacity 0.28s ease; }
.pk-fade-enter-from, .pk-fade-leave-to { opacity: 0; }

.pk-ov-enter-active, .pk-ov-leave-active { transition: opacity 0.22s ease; }
.pk-ov-enter-from, .pk-ov-leave-to { opacity: 0; }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .pk-body { grid-template-columns: 1fr; }
  .pk-sidebar { position: static; }
  .pk-sbar { display: none; }
  .pk-sidebar--open .pk-sbar {
    display: block; position: fixed;
    bottom: 0; left: 0; right: 0;
    border-radius: 18px 18px 0 0;
    z-index: 200; max-height: 85vh; overflow-y: auto;
  }
  .pk-filter-mob { display: flex; }
  .pk-featured-grid { grid-template-columns: repeat(2, 1fr); }
  .pk-featured-grid > :last-child { grid-column: 1 / -1; }
}

@media (max-width: 860px) {
  .pk-bar { flex-wrap: wrap; border-radius: 14px; padding: 6px; }
  .pk-fld--dest { flex: 1 0 100%; }
  .pk-fld--dur { flex: 1 0 calc(50% - 6px); }
  .pk-fld--bud { flex: 1 0 calc(50% - 6px); }
  .pk-bar-sep:first-of-type { display: none; }
  .pk-bar-sep { height: 1px; width: 100%; margin: 0; }
  .pk-search-btn { flex: 1 0 100%; margin: 4px 0 0; border-radius: 10px; min-height: 46px; }
}

@media (max-width: 640px) {
  .pk-wrap { padding: 0 14px; }
  .pk-hero { padding: 28px 0 44px; }
  .pk-fld--dur, .pk-fld--bud { flex: 1 0 100%; }
  .pk-bar-sep { display: none; }
  .pk-drop--dest { max-width: calc(100vw - 28px); }
  .pk-drop--dur, .pk-drop--bud { width: calc(100vw - 28px); }
  .pk-featured-grid { grid-template-columns: 1fr; }
  .pk-grid { grid-template-columns: 1fr; }
}
</style>