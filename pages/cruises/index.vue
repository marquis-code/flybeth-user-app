<template>
  <div class="cr-root" @mousedown="handleGlobalMousedown">
    <FullScreenLoader :show="loading" moduleName="Cruises" />

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="cr-hero relative z-30 bg-[#0D1DAD]">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(125%_120%_at_50%_-25%,#1A2ED4_0%,#0D1DAD_46%,#0A1485_100%)]"></div>
        <div
          class="absolute inset-0 opacity-[0.20]"
          style="background-image: radial-gradient(rgba(255,255,255,0.45) 1.5px, transparent 1.5px); background-size: 24px 24px;"
        ></div>
        <div class="absolute -right-24 top-6 h-72 w-72 rounded-full bg-[#EB4405]/20 blur-3xl"></div>
        <div class="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-[#3B82F6]/25 blur-3xl"></div>
      </div>

      <div class="cr-wrap relative z-10">
        <!-- Dynamic headline matching stays/cars/transfers -->
        <div class="cr-headline">
          <span class="cr-eyebrow text-white/70">✦ Cruise Search</span>
          <h1 class="cr-h1 text-white">
            <template v-if="searchQuery.destinationLabel">
              Sailing <span class="text-[#FF8A00]">{{ searchQuery.destinationLabel }}</span>
            </template>
            <template v-else>
              Explore the <span class="text-[#FF8A00]">open seas.</span>
            </template>
          </h1>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="cr-bar">
          <!-- DESTINATION field -->
          <div class="cr-fld" :class="{ 'cr-fld--active': activeField === 'dest' }" ref="destRef">
            <div class="cr-fld-inner" @click="openField('dest')">
              <MapPin class="cr-fld-ico h-4 w-4" />
              <div class="cr-fld-text">
                <span class="cr-fld-lbl">Region</span>
                <span class="cr-fld-val" :class="{ 'cr-fld-val--empty': !searchQuery.destination }">
                  {{ searchQuery.destinationLabel || 'Select Destination' }}
                </span>
              </div>
            </div>

            <!-- Destination dropdown -->
            <Transition name="cd">
              <div v-if="activeField === 'dest'" class="cr-drop" @mousedown.stop>
                <div class="p-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5 block">Popular Routes</span>
                  <div class="space-y-0.5">
                    <button v-for="p in cruiseDestinations" :key="p.value" 
                      class="flex items-center justify-between w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition-all text-left"
                      :class="{ 'bg-blue-50 text-[#0D1DAD]': searchQuery.destination === p.value }"
                      @click="selectDestination(p)"
                    >
                      <span class="text-xs font-bold" :class="searchQuery.destination === p.value ? 'text-[#0D1DAD]' : 'text-gray-800'">{{ p.label }}</span>
                      <Check v-if="searchQuery.destination === p.value" class="h-3.5 w-3.5 text-[#0D1DAD]" />
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="cr-bar-sep"></div>

          <!-- MONTH field -->
          <div class="cr-fld" :class="{ 'cr-fld--active': activeField === 'month' }" ref="monthRef">
            <div class="cr-fld-inner" @click="openField('month')">
              <Calendar class="cr-fld-ico h-4 w-4" />
              <div class="cr-fld-text">
                <span class="cr-fld-lbl">Departure</span>
                <span class="cr-fld-val" :class="{ 'cr-fld-val--empty': !searchQuery.departingMonth }">
                  {{ searchQuery.departingLabel || 'Any Month' }}
                </span>
              </div>
            </div>

            <!-- Month dropdown -->
            <Transition name="cd">
              <div v-if="activeField === 'month'" class="cr-drop" @mousedown.stop>
                <div class="p-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5 block">Sailing Schedule</span>
                  <div class="max-h-[260px] overflow-y-auto space-y-0.5">
                    <button v-for="m in cruiseMonths" :key="m.value" 
                      class="flex items-center justify-between w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition-all text-left"
                      :class="{ 'bg-blue-50 text-[#0D1DAD]': searchQuery.departingMonth === m.value }"
                      @click="selectMonth(m)"
                    >
                      <span class="text-xs font-bold" :class="searchQuery.departingMonth === m.value ? 'text-[#0D1DAD]' : 'text-gray-800'">{{ m.label }}</span>
                      <div v-if="searchQuery.departingMonth === m.value" class="w-1.5 h-1.5 rounded-full bg-[#0D1DAD]"></div>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- SEARCH BUTTON -->
          <button class="cr-search-btn" :class="{ 'cr-search-btn--busy': loading }" @click="handleSearch">
            <span class="cr-search-inner">
              <svg v-if="!loading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span v-if="loading" class="cr-spin"></span>
              <span>{{ loading ? 'Searching' : 'Search' }}</span>
            </span>
          </button>
        </div><!-- /cr-bar -->
      </div>
    </section>

    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="cr-wrap cr-main py-12">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Sidebar -->
        <aside class="w-full lg:w-72 flex-shrink-0" :class="{ 'hidden lg:block': !mobileFilters }">
          <div class="sticky top-24 space-y-8 bg-white/50 p-8 rounded-[2rem] border border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Filter class="h-4 w-4 text-black" />
                <span class="text-xs  uppercase  text-black">Refine</span>
              </div>
              <button class="text-sm font-bold text-black hover:text-primary uppercase " @click="resetFilters">Reset</button>
            </div>

            <!-- Lines -->
            <div class="space-y-4">
              <p class="text-sm  uppercase  text-black">Cruise Line</p>
              <div class="flex flex-col gap-1.5">
                <button v-for="l in availableCruiseLines" :key="l.value" 
                  v-show="l.value"
                  class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-left"
                  :class="filters.lines.includes(l.value) ? 'bg-primary text-white' : 'bg-white text-black border border-gray-200 font-medium hover:border-primary/30 hover:bg-white'"
                  @click="toggleLine(l.value)"
                >
                  <span>{{ l.label }}</span>
                  <Check v-if="filters.lines.includes(l.value)" class="h-3 w-3" />
                </button>
              </div>
            </div>

            <!-- Length -->
            <div class="space-y-4">
              <p class="text-sm  uppercase  text-black">Duration</p>
              <div class="flex flex-col gap-1.5">
                <button v-for="d in cruiseLengths" :key="d.value" 
                  v-show="d.value"
                   class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-left"
                  :class="filters.lengths.includes(d.value) ? 'bg-primary text-white' : 'bg-white text-black border border-gray-200 font-medium hover:border-primary/30 hover:bg-white'"
                  @click="toggleDuration(d.value)"
                >
                  <span>{{ d.label }}</span>
                  <Check v-if="filters.lengths.includes(d.value)" class="h-3 w-3" />
                </button>
              </div>
            </div>

            <!-- Price -->
            <div class="space-y-4">
              <div class="flex justify-between items-baseline">
                <p class="text-sm  uppercase  text-black">Budget</p>
                <span class="text-sm  text-primary">{{ formatPrice(filters.priceRange[1]) }}</span>
              </div>
              <input type="range" min="0" max="10000" step="100" v-model.number="filters.priceRange[1]" class="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-primary" />
              <div class="flex justify-between text-sm font-bold text-black">
                <span>{{ formatPrice(0) }}</span>
                <span>{{ formatPrice(10000) }}+</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="flex-grow">
          <!-- Toolbar -->
          <div v-if="filteredCruises.length" class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <span class="text-sm  text-black uppercase  flex items-center gap-2">
              <Ship class="h-4 w-4" />
              {{ filteredCruises.length }} expeditions found
            </span>
            <div class="flex items-center gap-4">
              <div class="relative" ref="sortRef">
                <button class="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs  uppercase  text-black hover:border-primary transition-all" @click.stop="sortOpen = !sortOpen">
                  <span>Sort</span>
                  <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="{ 'rotate-180': sortOpen }" />
                </button>
                <Transition name="cd">
                  <div v-if="sortOpen" class="absolute top-[calc(100%+0.5rem)] right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-[50]" @mousedown.stop>
                    <button class="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/5 text-primary text-xs font-bold transition-all text-left">Recommended</button>
                    <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white text-black text-xs font-bold transition-all text-left">Price: Low to High</button>
                    <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white text-black text-xs font-bold transition-all text-left">Price: High to Low</button>
                  </div>
                </Transition>
              </div>
              <button class="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs  uppercase " @click="mobileFilters = true">
                <Filter class="h-3.5 w-3.5" />
                Filter
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="space-y-4">
            <div v-for="n in 3" :key="n" class="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 sm:gap-6 animate-pulse">
              <div class="w-full md:w-56 lg:w-64 h-40 sm:h-44 bg-gray-100 rounded-xl"></div>
              <div class="flex-grow space-y-3">
                <div class="h-5 bg-gray-100 w-2/3 rounded-lg"></div>
                <div class="h-3 bg-gray-100 w-1/3 rounded-lg"></div>
                <div class="h-10 bg-gray-100 w-full rounded-xl mt-4"></div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="!filteredCruises.length && !loading" class="py-32 flex flex-col items-center text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-black">
              <Waves class="h-8 w-8" />
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl  text-black">No sailings found</h3>
              <p class="text-black max-w-sm">We couldn't find any cruises matching your criteria. Try adjusting your filters or destination.</p>
            </div>
            <button class="bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-md" @click="resetFilters">Reset filters</button>
          </div>

          <!-- Cruise cards -->
          <div v-if="filteredCruises.length && !loading" class="space-y-6">
            <CruiseCard 
              v-for="cruise in filteredCruises" 
              :key="cruise._id || cruise.id" 
              :cruise="cruise"
              @select="selectCruise" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile filter overlay -->
    <Transition name="cr-ov">
      <div v-if="mobileFilters" class="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[1000005] lg:hidden" @click.self="mobileFilters = false">
        <div class="absolute bottom-0 inset-x-0 bg-white rounded-t-[2.5rem] p-8 max-h-[90vh] overflow-y-auto">
          <!-- Replication of sidebar content for mobile -->
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import { Anchor, MapPin, Calendar, Compass, Filter, Ship, ChevronDown, Check, Waves } from 'lucide-vue-next'
import { useRoute } from '#app'
import { useSearchCruises } from '~/composables/modules/cruises/useSearchCruises'
import CruiseCard from '~/components/CruiseCard.vue'
import { useSettings } from '@/composables/useSettings'

const route = useRoute()
const { loading, filteredCruises, filters, searchCruises } = useSearchCruises()
const { formatPrice } = useSettings()

// ── Refs ──────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const destRef = ref<HTMLElement | null>(null)
const monthRef = ref<HTMLElement | null>(null)
const sortRef = ref<HTMLElement | null>(null)
const sortOpen = ref(false)
const mobileFilters = ref(false)

const searchQuery = reactive({
  destination: 'BH',
  destinationLabel: '',
  departingMonth: '03/1/2026',
  departingLabel: '',
  length: '',
  line: '',
})

// ── Constants ─────────────────────────────────────────────────────────
const cruiseDestinations = [
  { value: '', label: 'Destination (Any)' },
  { value: 'C', label: 'Caribbean' },
  { value: 'M', label: 'Mexico' },
  { value: 'BH', label: 'Bahamas' },
  { value: 'A', label: 'Alaska' },
  { value: 'E', label: 'Europe - All' },
  { value: 'H', label: 'Hawaii' },
  { value: 'BM', label: 'Bermuda' },
  { value: 'NN', label: 'Canada/New England/NY' },
  { value: 'ALL', label: 'All Destinations' }
]

const cruiseMonths = [
  { value: '03/1/2026', label: 'March 2026' },
  { value: '04/1/2026', label: 'April 2026' },
  { value: '05/1/2026', label: 'May 2026' },
  { value: '06/1/2026', label: 'June 2026' },
  { value: '07/1/2026', label: 'July 2026' },
  { value: '08/1/2026', label: 'August 2026' },
  { value: '09/1/2026', label: 'September 2026' },
  { value: '10/1/2026', label: 'October 2026' },
  { value: '11/1/2026', label: 'November 2026' },
  { value: '12/1/2026', label: 'December 2026' }
]

const cruiseLengths = [
  { value: '', label: 'Cruise Length (Any)' },
  { value: '1', label: '1-2 Nights' },
  { value: '2', label: '3-5 Nights' },
  { value: '3', label: '6-8 Nights' },
  { value: '4', label: '9-11 Nights' },
  { value: '5', label: '12+ Nights' }
]

const availableCruiseLines = [
  { value: '', label: 'Cruise Line (Any)' },
  { value: '1', label: 'Carnival' },
  { value: '11', label: 'Celebrity' },
  { value: '20', label: 'Disney' },
  { value: '71', label: 'MSC' },
  { value: '34', label: 'Norwegian' },
  { value: '44', label: 'Royal Caribbean' },
  { value: '40', label: 'Princess' }
]

// ── Methods ───────────────────────────────────────────────────────────
const openField = (field: string) => {
  activeField.value = activeField.value === field ? null : field
}

const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { dest: destRef, month: monthRef }
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

const selectDestination = (p: any) => {
  searchQuery.destination = p.value
  searchQuery.destinationLabel = p.label
  activeField.value = null
  nextTick(() => openField('month'))
}

const selectMonth = (m: any) => {
  searchQuery.departingMonth = m.value
  searchQuery.departingLabel = m.label
  activeField.value = null
}

const toggleLine = (val: string) => {
  const idx = filters.value.lines.indexOf(val)
  if (idx >= 0) filters.value.lines.splice(idx, 1)
  else filters.value.lines.push(val)
}

const toggleDuration = (val: string) => {
  const idx = filters.value.lengths.indexOf(val)
  if (idx >= 0) filters.value.lengths.splice(idx, 1)
  else filters.value.lengths.push(val)
}

const resetFilters = () => {
  filters.value.lines = []
  filters.value.lengths = []
  filters.value.priceRange = [0, 10000]
}

const handleSearch = async () => {
  activeField.value = null
  if (!searchQuery.destination) return
  await searchCruises(searchQuery)
}

const selectCruise = (cruise: any) => {
  if (import.meta.client) {
    sessionStorage.setItem('flybeth_checkout_payload', JSON.stringify({
      type: 'cruise',
      id: String(cruise._id || cruise.id),
      name: String(cruise.name),
      price: String(cruise.pricing?.startingPrice || cruise.price)
    }))
  }
  navigateTo({ path: '/checkout' })
}

const resolveLabels = () => {
  const d = cruiseDestinations.find(opt => opt.value === searchQuery.destination)
  if (d) searchQuery.destinationLabel = d.label
  
  const m = cruiseMonths.find(opt => opt.value === searchQuery.departingMonth)
  if (m) searchQuery.departingLabel = m.label
}

// ── Lifecycle ─────────────────────────────────────────────────────────
onMounted(() => {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem('flybeth_last_cruises_search')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.destination) searchQuery.destination = parsed.destination
        if (parsed.departingMonth) searchQuery.departingMonth = parsed.departingMonth
        if (parsed.length) searchQuery.length = parsed.length
        if (parsed.line) searchQuery.line = parsed.line
      }
    } catch(e) {}
  }

  resolveLabels()
  handleSearch()
})

watch(() => searchQuery.destination, (val) => {
  const d = cruiseDestinations.find(opt => opt.value === val)
  if (d) searchQuery.destinationLabel = d.label
})
watch(() => searchQuery.departingMonth, (val) => {
  const m = cruiseMonths.find(opt => opt.value === val)
  if (m) searchQuery.departingLabel = m.label
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');

.cr-root {
  min-height: 100vh;
  background: #fff;
  font-family: 'Satoshi', sans-serif;
  color: #111;
}

.cr-wrap {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.cr-hero {
  background: #0D1DAD;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 44px 0 56px;
  position: relative;
  overflow: visible;
}

.cr-headline { margin-bottom: 28px; position: relative; z-index: 10; }
.cr-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.7); display: block; margin-bottom: 10px; }
.cr-h1 { font-family: 'Satoshi', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 800; line-height: 1.12; color: #ffffff; letter-spacing: -0.03em; }
.cr-h1 em, .cr-h1 span { font-style: normal; color: #FF8A00; }

/* ── Search bar ────────────────────────────────────────────────────── */
.cr-bar {
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

.cr-fld {
  position: relative;
  flex: 1;
  min-width: 0;
}

.cr-fld-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  height: 100%;
  cursor: pointer;
  border-radius: 14px;
  transition: background 0.15s;
  min-width: 0;
}
.cr-fld-inner:hover { background: #f5f5f0; }

.cr-fld-ico { color: #94a3b8; flex-shrink: 0; }
.cr-fld-text { display: flex; flex-direction: column; min-width: 0; }
.cr-fld-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
.cr-fld-val { font-family: 'Satoshi', sans-serif; font-size: 14px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cr-fld-val--empty { color: #94a3b8; font-weight: 500; }

.cr-bar-sep {
  width: 1px;
  background: #e2e8f0;
  margin: 10px 0;
  flex-shrink: 0;
}

.cr-search-btn {
  background: #111;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0 24px;
  font-family: 'Satoshi', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 6px;
  transition: all 0.16s ease;
  flex-shrink: 0;
}
.cr-search-btn:hover { background: #0D1DAD; }

.cr-search-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cr-spin {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.cr-drop {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 16px 36px rgba(0,0,0,0.12);
  z-index: 100;
  min-width: 280px;
  overflow: hidden;
}

.cd-enter-active, .cd-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.cd-enter-from { opacity: 0; transform: translateY(-12px) scale(0.98); }
.cd-leave-to { opacity: 0; transform: translateY(-8px) scale(0.99); }

.cr-ov-enter-active, .cr-ov-leave-active { transition: opacity 0.3s ease; }
.cr-ov-enter-from, .cr-ov-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .cr-hero { padding: 28px 0 40px; }
  .cr-bar { flex-direction: column; border-radius: 16px; }
  .cr-bar-sep { height: 1px; width: 100%; margin: 0; }
  .cr-search-btn { margin: 8px; padding: 14px 20px; }
  .cr-drop { width: 100%; min-width: auto; }
}

@media (max-width: 640px) {
  .cr-wrap { padding: 0 20px; }
}
</style>
