<template>
  <div class="tt-root" @mousedown="handleGlobalMousedown">

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="tt-hero">
      <div class="tt-hero-bg">
        <div class="tt-orb tt-orb--a"></div>
        <div class="tt-orb tt-orb--b"></div>
      </div>

      <div class="tt-wrap">

        <!-- Dynamic headline -->
        <div class="tt-headline">
          <span class="tt-eyebrow">✦ Curated Experiences</span>
          <h1 class="tt-h1">
            <template v-if="currentCityName">
              Exploring <em>{{ currentCityName }}</em>
            </template>
            <template v-else>
              Discover<br><em>world wonders.</em>
            </template>
          </h1>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="tt-bar">

          <!-- DESTINATION field -->
          <div class="tt-fld tt-fld--dest" :class="{ 'tt-fld--active': activeField === 'dest' }" ref="destRef">
            <div class="tt-fld-inner" @click="openField('dest')">
              <svg class="tt-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div class="tt-fld-text">
                <span class="tt-fld-lbl">Where to?</span>
                <span class="tt-fld-val" :class="{ 'tt-fld-val--set': searchQuery.destinationIata }">
                  {{ currentCityName || 'Select city' }}
                </span>
              </div>
            </div>
            <!-- Destination dropdown -->
            <Transition name="td">
              <div v-if="activeField === 'dest'" class="tt-drop tt-drop--dest" @mousedown.stop>
                <div class="tt-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="destInputRef" v-model="destQuery" placeholder="Search cities…" class="tt-drop-input" @input="searchCities" />
                  <button v-if="destQuery" class="tt-drop-clear" @click="destQuery = ''; searchQuery.destinationIata = ''">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div v-if="!destQuery" class="tt-drop-section">
                  <span class="tt-drop-sec-label">Popular cities</span>
                  <div class="tt-drop-grid">
                    <button v-for="p in popularCities" :key="p.code" class="tt-pop-item" @click="selectCity(p)">
                      <span class="tt-pop-icon">✨</span>
                      <span class="tt-pop-name">{{ p.name }}</span>
                    </button>
                  </div>
                </div>
                <div v-else class="tt-drop-results">
                  <button v-for="r in cityResults" :key="r.code" class="tt-loc-result" @click="selectCity(r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="tt-loc-name">{{ r.name }}</span>
                  </button>
                  <div v-if="!cityResults.length" class="tt-drop-empty">No results for "{{ destQuery }}"</div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="tt-bar-sep"></div>

          <!-- DATE field -->
          <div class="tt-fld tt-fld--date" :class="{ 'tt-fld--active': activeField === 'date' }" ref="dateRef">
            <div class="tt-fld-inner" @click="openField('date')">
              <svg class="tt-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div class="tt-fld-text">
                <span class="tt-fld-lbl">When?</span>
                <span class="tt-fld-val" :class="{ 'tt-fld-val--set': searchQuery.date }">
                  {{ searchQuery.date ? formatDate(searchQuery.date) : 'Choose date' }}
                </span>
              </div>
            </div>
            <!-- Calendar dropdown -->
            <Transition name="td">
              <div v-if="activeField === 'date'" class="tt-drop tt-drop--cal" @mousedown.stop>
                <div class="tt-cal-nav-row">
                  <button class="tt-cal-arrow" @click="prevMonth">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="tt-cal-title">{{ calMonthLabel }}</span>
                  <button class="tt-cal-arrow" @click="nextMonth">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                <div class="tt-cal-grid">
                  <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="tt-cal-dow">{{ d }}</div>
                  <div v-for="c in calCells" :key="c.key"
                    class="tt-cal-cell"
                    :class="{
                      'tt-cal-cell--blank': !c.date,
                      'tt-cal-cell--past': c.past,
                      'tt-cal-cell--sel': c.selected,
                      'tt-cal-cell--today': c.today
                    }"
                    @click="c.date && !c.past && pickDate(c.date)"
                  >{{ c.day }}</div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- SEARCH BTN -->
          <button class="tt-search-btn" :class="{ 'tt-search-btn--busy': loading }" @click="handleSearch">
            <span class="tt-search-inner">
              <svg v-if="!loading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span v-if="loading" class="tt-spin"></span>
              <span>{{ loading ? 'Finding' : 'Find activities' }}</span>
            </span>
          </button>

        </div><!-- /tt-bar -->
      </div><!-- /tt-wrap -->
    </section>

    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="tt-wrap tt-main">

      <!-- Body grid -->
      <div class="tt-body">

        <!-- Sidebar -->
        <aside class="tt-sidebar" :class="{ 'tt-sidebar--open': mobileFilters }">
          <div class="tt-sbar">
            <div class="tt-sbar-hd">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Refine choices</span>
              <button class="tt-reset" @click="resetFilters">Reset</button>
            </div>

            <div class="tt-sb-block">
              <p class="tt-sb-label">Categories</p>
              <div class="tt-chips">
                <button v-for="c in availableCategories" :key="c" 
                  class="tt-chip" 
                  :class="{ 'tt-chip--on': filters.categories.includes(c) }" 
                  @click="toggleCategory(c)"
                >{{ c }}</button>
              </div>
            </div>

            <div class="tt-sb-block">
              <p class="tt-sb-label">Max price <strong>${{ filters.priceRange[1] }}</strong></p>
              <div class="tt-range-wrap">
                <input type="range" min="0" max="1000" step="10" v-model.number="filters.priceRange[1]" class="tt-range" />
                <div class="tt-range-ends">
                  <span>$0</span>
                  <span>$1,000+</span>
                </div>
              </div>
            </div>

            <div class="tt-sb-block">
              <p class="tt-sb-label">Minimum Rating</p>
              <div class="tt-rating-opts">
                <button v-for="r in [4, 3, 2]" :key="r" 
                  class="tt-rate-opt" 
                  :class="{ 'tt-rate-opt--on': filters.rating === r }" 
                  @click="filters.rating = filters.rating === r ? 0 : r"
                >
                  <div class="tt-stars">
                    <svg v-for="i in 5" :key="i" width="10" height="10" viewBox="0 0 24 24" :fill="i <= r ? '#fbbf24' : '#e5e7eb'"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <span>{{ r }}+ Stars</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="tt-results">

          <!-- Toolbar -->
          <div v-if="filteredActivitiesList.length" class="tt-toolbar">
            <span class="tt-rcount">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              {{ filteredActivitiesList.length }} things found
            </span>
            <div class="tt-toolbar-r">
               <button class="tt-filter-mob" @click="mobileFilters = !mobileFilters">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
              </button>
            </div>
          </div>

          <!-- Loading skeletons -->
          <div v-if="loading" class="tt-grid">
            <div v-for="n in 4" :key="n" class="tt-skel-card">
              <div class="tt-sk tt-sk--img"></div>
              <div class="tt-sk-body">
                <div class="tt-sk tt-sk--lg"></div>
                <div class="tt-sk tt-sk--sm"></div>
                <div class="tt-sk-row">
                   <div class="tt-sk tt-sk--badge"></div>
                   <div class="tt-sk tt-sk--price"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="!filteredActivitiesList.length && !loading" class="tt-empty">
            <div class="tt-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            </div>
            <h3 class="tt-empty-h">No activities found</h3>
            <p class="tt-empty-p">Try adjusting your filters or search for another destination to find exciting things to do.</p>
            <button class="tt-empty-btn" @click="resetFilters">Reset filters</button>
          </div>

          <!-- Grid area -->
          <div v-if="filteredActivitiesList.length && !loading" class="tt-grid">
            <div v-for="activity in filteredActivitiesList" :key="activity.experienceId" 
                 class="tt-card"
                 @click="goToDetail(activity)">
              
              <div class="tt-card-img-wrap">
                <img v-if="activity.photos?.[0]" :src="activity.photos[0]" class="tt-card-img" loading="lazy" />
                <div class="tt-card-badges">
                  <div v-if="activity.rating" class="tt-card-badge tt-card-badge--white">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span>{{ activity.rating }}</span>
                  </div>
                </div>
              </div>

              <div class="tt-card-body">
                <h3 class="tt-card-name">{{ activity.name }}</h3>
                <p class="tt-card-desc">{{ stripHtml(activity.description) }}</p>
                <div class="tt-card-foot">
                  <div class="tt-card-price-grp">
                    <span class="tt-price-lbl">From</span>
                    <span class="tt-price-val">{{ activity.currency || '$' }} {{ formatPrice(activity.price) }}</span>
                  </div>
                  <button class="tt-card-btn">Details →</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Mobile filter overlay -->
    <Transition name="tt-ov">
      <div v-if="mobileFilters" class="tt-overlay" @click.self="mobileFilters = false"></div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, onMounted, reactive, computed, nextTick, watch } from 'vue'
import { useRoute } from '#app'
import { useSearchActivities } from '@/composables/modules/experiences/useSearchActivities'
import { flightsApi } from '@/api_factory/modules/flights'

const route = useRoute()
const { loading, filteredActivitiesList, filters, searchActivities, activitiesList } = useSearchActivities()

// ── Refs ──────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const destRef = ref<HTMLElement | null>(null)
const dateRef = ref<HTMLElement | null>(null)
const destInputRef = ref<HTMLInputElement | null>(null)
const destQuery = ref('')
const cityResults = ref<any[]>([])
const calViewDate = ref(new Date())
const mobileFilters = ref(false)
const currentCityName = ref('')

const searchQuery = reactive({
  destinationIata: (route.query.destination as string) || '',
  date: (route.query.date as string) || '',
})

// ── Constants ─────────────────────────────────────────────────────────
const availableCategories = ['Sightseeing', 'Culture', 'Museums', 'Nature', 'Adventure', 'Food', 'Nightlife']
const popularCities = [
  { name: 'Paris', code: 'PAR' },
  { name: 'Dubai', code: 'DXB' },
  { name: 'London', code: 'LON' },
  { name: 'New York', code: 'NYC' },
  { name: 'Lagos', code: 'LOS' },
  { name: 'Nairobi', code: 'NBO' }
]

// ── Methods ───────────────────────────────────────────────────────────
const openField = (field: string) => {
  activeField.value = activeField.value === field ? null : field
  if (field === 'dest') nextTick(() => destInputRef.value?.focus())
}

const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { dest: destRef, date: dateRef }
  if (activeField.value) {
    const cur = refs[activeField.value]?.value
    if (cur && !cur.contains(e.target as Node)) activeField.value = null
  }
}

const searchCities = async () => {
  if (!destQuery.value) { cityResults.value = []; return }
  try {
    const res = await flightsApi.searchAirports(destQuery.value)
    const data = res.data?.data || res.data || []
    cityResults.value = data.map((item: any) => ({
      name: item.name || item.address?.cityName,
      code: item.iataCode || item.id,
      lat: item.geoCode?.latitude,
      lon: item.geoCode?.longitude
    })).slice(0, 5)
  } catch (e) {
    cityResults.value = []
  }
}

const selectCity = async (city: any) => {
  searchQuery.destinationIata = city.code
  currentCityName.value = city.name
  destQuery.value = city.name
  activeField.value = null
  nextTick(() => openField('date'))
}

const formatPrice = (p: any) => {
  const num = parseFloat(p); if (isNaN(num)) return '0.00'
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const stripHtml = (html: string) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').slice(0, 80) + '...'
}

const toggleCategory = (c: string) => {
  const idx = filters.value.categories.indexOf(c)
  if (idx >= 0) filters.value.categories.splice(idx, 1)
  else filters.value.categories.push(c)
}

const resetFilters = () => {
  filters.value.categories = []
  filters.value.priceRange = [0, 1000]
  filters.value.rating = 0
}

const handleSearch = async () => {
  activeField.value = null
  if (!searchQuery.destinationIata) return
  
  loading.value = true
  try {
    const response = await flightsApi.searchAirports(searchQuery.destinationIata)
    const data = response.data?.data || response.data || []
    if (data?.length > 0) {
      const top = data[0]
      currentCityName.value = top.name || top.address?.cityName
      const lat = top.geoCode?.latitude
      const lon = top.geoCode?.longitude
      if (lat && lon) {
        await searchActivities({ latitude: lat, longitude: lon, date: searchQuery.date })
        return
      }
    }
  } catch (err) {
    activitiesList.value = []
  } finally {
    loading.value = false
  }
}

const goToDetail = (activity: any) => {
  sessionStorage.setItem('selectedActivity', JSON.stringify(activity))
  navigateTo({ path: `/things-to-do/${activity.experienceId}`, query: { provider: activity.provider } })
}

// ── Calendar ──────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const calMonthLabel = computed(() => `${MONTHS[calViewDate.value.getMonth()]} ${calViewDate.value.getFullYear()}`)
const calCells = computed(() => {
  const y = calViewDate.value.getFullYear(), m = calViewDate.value.getMonth()
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate()
  const today = new Date(); today.setHours(0,0,0,0)
  const cells = []
  for (let i = 0; i < first; i++) cells.push({ key: `b${i}`, date: null, day: '', past: false, selected: false, today: false })
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d), iso = dt.toISOString().split('T')[0]
    cells.push({ key: iso, date: iso, day: d, past: dt < today, selected: searchQuery.date === iso, today: dt.getTime() === today.getTime() })
  }
  return cells
})
const prevMonth = () => { const d = new Date(calViewDate.value); d.setMonth(d.getMonth()-1); calViewDate.value = d }
const nextMonth = () => { const d = new Date(calViewDate.value); d.setMonth(d.getMonth()+1); calViewDate.value = d }
const pickDate = (iso: string) => { searchQuery.date = iso; activeField.value = null }
const formatDate = (iso: string) => {
  const [y,m,d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m-1].slice(0,3)} ${y}`
}

onMounted(() => {
  if (searchQuery.destinationIata) handleSearch()
  else {
    currentCityName.value = 'Paris'
    searchActivities({ latitude: 48.8566, longitude: 2.3522, radius: 30 })
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

.tt-root { min-height: 100vh; background: #fff; font-family: 'Sora', sans-serif; color: #111; }
.tt-wrap { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

/* ── Hero ──────────────────────────────────────────────────────────── */
.tt-hero { background: #f8f9f7; border-bottom: 1px solid #e8e8e2; padding: 40px 0 56px; position: relative; }
.tt-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.tt-orb { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.28; }
.tt-orb--a { width: 420px; height: 420px; background: radial-gradient(circle, #fde68a, transparent); top: -180px; right: -60px; }
.tt-orb--b { width: 300px; height: 300px; background: radial-gradient(circle, #bfdbfe, transparent); bottom: -100px; left: 8%; }

.tt-headline { margin-bottom: 28px; }
.tt-eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #999; display: block; margin-bottom: 10px; }
.tt-h1 { font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.12; letter-spacing: -0.03em; }
.tt-h1 em { font-style: normal; color: #0d66d0; }

/* ── Bar ───────────────────────────────────────────────────────────── */
.tt-bar { background: #fff; border: 1.5px solid #e0e0d8; border-radius: 16px; box-shadow: 0 2px 16px rgba(0,0,0,0.06); display: flex; align-items: stretch; position: relative; z-index: 50; }
.tt-fld { position: relative; flex: 1; min-width: 0; }
.tt-fld--dest { flex: 1.8; }
.tt-fld-inner { display: flex; align-items: center; gap: 10px; padding: 14px 16px; height: 100%; cursor: pointer; border-radius: 14px; transition: background 0.15s; }
.tt-fld-inner:hover { background: #f5f5f0; }
.tt-fld--active .tt-fld-inner { background: #f0f4f7; }
.tt-fld-ico { color: #aaa; flex-shrink: 0; }
.tt-fld-text { display: flex; flex-direction: column; min-width: 0; }
.tt-fld-lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; }
.tt-fld-val { font-size: 13px; font-weight: 500; color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tt-fld-val--set { color: #111; }
.tt-bar-sep { width: 1px; background: #ebebe5; margin: 10px 0; }
.tt-search-btn { background: #111; border: none; border-radius: 12px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; padding: 0 24px; margin: 6px; min-width: 140px; transition: background 0.2s; }
.tt-search-btn:hover { background: #0d66d0; }
.tt-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Dropdowns ─────────────────────────────────────────────────────── */
.tt-drop { position: absolute; top: calc(100% + 6px); left: 0; background: #fff; border: 1px solid #e0e0d8; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); z-index: 999; overflow: hidden; }
.tt-drop--dest { width: max(320px, 100%); }
.tt-drop-search { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid #f0f0ea; background: #fafaf8; }
.tt-drop-input { flex: 1; border: none; background: transparent; font-size: 13px; outline: none; }
.tt-drop-clear { cursor: pointer; color: #bbb; border: none; background: none; }
.tt-drop-section { padding: 14px; }
.tt-drop-sec-label { font-size: 9px; font-weight: 700; color: #bbb; text-transform: uppercase; display: block; margin-bottom: 8px; }
.tt-drop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.tt-pop-item { display: flex; align-items: center; gap: 8px; padding: 10px; background: #f8f8f5; border: none; border-radius: 10px; cursor: pointer; text-align: left; }
.tt-pop-item:hover { background: #f0f4f7; }
.tt-pop-name { font-size: 12px; font-weight: 600; }
.tt-drop-results { padding: 8px; }
.tt-loc-result { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px; border-radius: 8px; border: none; background: none; cursor: pointer; text-align: left; }
.tt-loc-result:hover { background: #f5f5f0; }
.tt-loc-name { font-size: 13px; font-weight: 500; }
.tt-drop--cal { width: 300px; padding: 16px; }
.tt-cal-nav-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.tt-cal-title { font-size: 13px; font-weight: 600; }
.tt-cal-arrow { width: 28px; height: 28px; border: 1px solid #e8e8e0; border-radius: 8px; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.tt-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.tt-cal-dow { font-size: 9px; font-weight: 600; color: #bbb; text-align: center; padding: 4px 0; }
.tt-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 6px; cursor: pointer; }
.tt-cal-cell:hover:not(.tt-cal-cell--blank) { background: #f0f4f7; }
.tt-cal-cell--past { color: #ddd; pointer-events: none; }
.tt-cal-cell--sel { background: #0d66d0 !important; color: #fff !important; font-weight: 600; }

/* ── Main body ─────────────────────────────────────────────────────── */
.tt-main { padding-top: 36px; padding-bottom: 60px; }
.tt-body { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
.tt-sidebar { position: sticky; top: 20px; }
.tt-sbar { background: #fff; border: 1px solid #eaeae3; border-radius: 14px; padding: 18px; }
.tt-sbar-hd { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; padding-bottom: 12px; border-bottom: 1px solid #f0f0ea; margin-bottom: 18px; }
.tt-reset { margin-left: auto; font-size: 9px; color: #bbb; border: none; background: none; cursor: pointer; }
.tt-sb-block { margin-bottom: 24px; }
.tt-sb-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #bbb; margin-bottom: 10px; display: block; }
.tt-sb-label strong { color: #111; font-size: 12px; }
.tt-chips { display: flex; flex-direction: column; gap: 5px; }
.tt-chip { padding: 8px 12px; background: #fafaf7; border-radius: 8px; font-size: 12px; font-weight: 500; color: #555; border: 1.5px solid transparent; text-align: left; cursor: pointer; }
.tt-chip--on { background: #f0f4f7; border-color: #0d66d0; color: #0d66d0; font-weight: 600; }
.tt-range { width: 100%; accent-color: #0d66d0; }
.tt-range-ends { display: flex; justify-content: space-between; font-size: 10px; color: #bbb; }
.tt-rating-opts { display: flex; flex-direction: column; gap: 6px; }
.tt-rate-opt { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #fafaf7; border-radius: 8px; border: 1.5px solid transparent; cursor: pointer; border: none; }
.tt-rate-opt--on { background: #f0f4f7; border: 1.5px solid #0d66d0; }
.tt-stars { display: flex; gap: 2px; }

/* ── Results ───────────────────────────────────────────────────────── */
.tt-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.tt-rcount { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #aaa; }
.tt-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.tt-card { background: #fff; border: 1px solid #eaeae3; border-radius: 16px; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
.tt-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
.tt-card-img-wrap { height: 180px; position: relative; background: #f0f0ea; }
.tt-card-img { width: 100%; height: 100%; object-cover: cover; }
.tt-card-badges { position: absolute; top: 10px; left: 10px; }
.tt-card-badge { background: #fff; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.tt-card-body { padding: 18px; flex: 1; display: flex; flex-direction: column; }
.tt-card-name { font-size: 17px; font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
.tt-card-desc { font-size: 13px; color: #888; margin-bottom: 18px; line-height: 1.5; flex: 1; }
.tt-card-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid #f0f0ea; }
.tt-card-price-grp { display: flex; flex-direction: column; }
.tt-price-lbl { font-size: 9px; font-weight: 700; color: #bbb; text-transform: uppercase; }
.tt-price-val { font-size: 18px; font-weight: 700; color: #111; }
.tt-card-btn { padding: 8px 16px; background: #111; color: #fff; border-radius: 10px; font-size: 11px; font-weight: 600; border: none; cursor: pointer; }

/* ── Skeletons ─────────────────────────────────────────────────────── */
.tt-skel-card { background: #fff; border: 1px solid #eaeae3; border-radius: 16px; overflow: hidden; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.tt-sk { background: #f0f0ea; border-radius: 4px; }
.tt-sk--img { width: 100%; height: 180px; }
.tt-sk-body { padding: 18px; }
.tt-sk--lg { height: 16px; width: 70%; margin-bottom: 10px; }
.tt-sk--sm { height: 12px; width: 40%; margin-bottom: 16px; }
.tt-sk-row { display: flex; justify-content: space-between; }
.tt-sk--badge { width: 60px; height: 24px; }
.tt-sk--price { width: 80px; height: 24px; }

.tt-empty { display: flex; flex-direction: column; align-items: center; padding: 60px 24px; text-align: center; }
.tt-empty-ico { width: 60px; height: 60px; border-radius: 50%; background: #f0f4f7; display: flex; align-items: center; justify-content: center; color: #0d66d0; margin-bottom: 16px; }
.tt-empty-h { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.tt-empty-p { color: #aaa; font-size: 14px; margin-bottom: 24px; max-width: 320px; }
.tt-empty-btn { padding: 10px 24px; background: #111; color: #fff; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; }

/* Mobile */
@media (max-width: 1024px) {
  .tt-body { grid-template-columns: 1fr; }
  .tt-sbar { display: none; }
  .tt-filter-mob { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #111; color: #fff; border-radius: 10px; font-size: 12px; cursor: pointer; border: none; }
}
@media (max-width: 640px) {
  .tt-grid { grid-template-columns: 1fr; }
  .tt-bar { flex-direction: column; }
  .tt-bar-sep { display: none; }
  .tt-search-btn { margin: 4px; }
}
</style>
