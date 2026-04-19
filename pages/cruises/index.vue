<template>
  <div class="cr-root" @mousedown="handleGlobalMousedown">

    <!-- ═══════════════ PREMIUM HERO ═══════════════ -->
    <section class="cr-hero relative overflow-hidden bg-neutral-900 py-20 lg:py-28">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full"></div>
      </div>

      <div class="cr-wrap relative z-10">
        <div class="max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
            <Anchor class="h-3.5 w-3.5 text-primary" />
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Ultra-Luxury Sailings</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
            <template v-if="searchQuery.destinationLabel">
              Sailing <span class="text-primary italic">{{ searchQuery.destinationLabel }}</span>
            </template>
            <template v-else>
              Explore the<br><span class="text-primary">Open Seas.</span>
            </template>
          </h1>
          
          <p class="text-xl text-white/50 font-medium leading-relaxed max-w-xl">
            From the Caribbean to the Mediterranean, discover handpicked expeditions on the world's most elite cruise lines.
          </p>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="cr-bar mt-12 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-3 flex flex-col md:flex-row gap-2 shadow-2xl">
          <!-- DESTINATION field -->
          <div class="cr-fld flex-[1.5] group relative" :class="{ 'cr-fld--active': activeField === 'dest' }" ref="destRef">
            <div class="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] hover:bg-white/5 transition-all cursor-pointer" @click="openField('dest')">
              <MapPin class="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
              <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase tracking-widest text-white/30">Region</span>
                <span class="text-white font-bold text-lg truncate" :class="{ 'opacity-40': !searchQuery.destination }">
                  {{ searchQuery.destinationLabel || 'Select Destination' }}
                </span>
              </div>
            </div>
            <!-- Destination dropdown -->
            <Transition name="cd">
              <div v-if="activeField === 'dest'" class="cr-drop absolute top-[calc(100%+0.5rem)] left-0 w-full min-w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 z-[100]" @mousedown.stop>
                <div class="p-3">
                  <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 p-2 block">Popular Routes</span>
                  <div class="grid grid-cols-1 gap-1">
                    <button v-for="p in cruiseDestinations" :key="p.value" 
                      class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left group/item"
                      :class="{ 'bg-primary/5 text-primary': searchQuery.destination === p.value }"
                      @click="selectDestination(p)"
                    >
                      <span class="text-sm font-bold" :class="searchQuery.destination === p.value ? 'text-primary' : 'text-gray-800'">{{ p.label }}</span>
                      <Check v-if="searchQuery.destination === p.value" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="w-px bg-white/10 my-4 hidden md:block"></div>

          <!-- MONTH field -->
          <div class="cr-fld flex-grow group relative" :class="{ 'cr-fld--active': activeField === 'month' }" ref="monthRef">
            <div class="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] hover:bg-white/5 transition-all cursor-pointer" @click="openField('month')">
              <Calendar class="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
              <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase tracking-widest text-white/30">Departure</span>
                <span class="text-white font-bold text-lg truncate" :class="{ 'opacity-40': !searchQuery.departingMonth }">
                  {{ searchQuery.departingLabel || 'Any Month' }}
                </span>
              </div>
            </div>
            <Transition name="cd">
              <div v-if="activeField === 'month'" class="cr-drop absolute top-[calc(100%+0.5rem)] left-0 w-full min-w-[240px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 z-[100]" @mousedown.stop>
                <div class="p-3">
                  <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 p-2 block">Sailing Schedule</span>
                  <div class="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto no-scrollbar">
                    <button v-for="m in cruiseMonths" :key="m.value" 
                      class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left"
                      :class="{ 'bg-primary/5 text-primary': searchQuery.departingMonth === m.value }"
                      @click="selectMonth(m)"
                    >
                      <span class="text-sm font-bold">{{ m.label }}</span>
                      <div v-if="searchQuery.departingMonth === m.value" class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <button class="bg-primary text-white font-black px-10 py-5 rounded-[1.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20" :disabled="loading" @click="handleSearch">
            <template v-if="!loading">
              <Compass class="h-5 w-5" />
              <span>Search Cruises</span>
            </template>
            <span v-else class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="cr-wrap cr-main py-12">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Sidebar -->
        <aside class="w-full lg:w-72 flex-shrink-0" :class="{ 'hidden lg:block': !mobileFilters }">
          <div class="sticky top-24 space-y-8 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Filter class="h-4 w-4 text-gray-400" />
                <span class="text-xs font-black uppercase tracking-widest text-gray-900">Refine</span>
              </div>
              <button class="text-[10px] font-bold text-gray-400 hover:text-primary uppercase tracking-widest" @click="resetFilters">Reset</button>
            </div>

            <!-- Lines -->
            <div class="space-y-4">
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Cruise Line</p>
              <div class="flex flex-col gap-1.5">
                <button v-for="l in availableCruiseLines" :key="l.value" 
                  v-show="l.value"
                  class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-left"
                  :class="filters.lines.includes(l.value) ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-100 font-medium hover:border-primary/30 hover:bg-gray-50'"
                  @click="toggleLine(l.value)"
                >
                  <span>{{ l.label }}</span>
                  <Check v-if="filters.lines.includes(l.value)" class="h-3 w-3" />
                </button>
              </div>
            </div>

            <!-- Length -->
            <div class="space-y-4">
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</p>
              <div class="flex flex-col gap-1.5">
                <button v-for="d in cruiseLengths" :key="d.value" 
                  v-show="d.value"
                   class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-left"
                  :class="filters.lengths.includes(d.value) ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-100 font-medium hover:border-primary/30 hover:bg-gray-50'"
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
                <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget</p>
                <span class="text-sm font-black text-primary">${{ filters.priceRange[1] }}</span>
              </div>
              <input type="range" min="0" max="10000" step="100" v-model.number="filters.priceRange[1]" class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
              <div class="flex justify-between text-[10px] font-bold text-gray-400">
                <span>$0</span>
                <span>$10k+</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="flex-grow">
          <!-- Toolbar -->
          <div v-if="filteredCruises.length" class="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
            <span class="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Ship class="h-4 w-4" />
              {{ filteredCruises.length }} expeditions found
            </span>
            <div class="flex items-center gap-4">
              <div class="relative" ref="sortRef">
                <button class="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 hover:border-primary transition-all" @click.stop="sortOpen = !sortOpen">
                  <span>Sort</span>
                  <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="{ 'rotate-180': sortOpen }" />
                </button>
                <Transition name="cd">
                  <div v-if="sortOpen" class="absolute top-[calc(100%+0.5rem)] right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[50]" @mousedown.stop>
                    <button class="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/5 text-primary text-xs font-bold transition-all text-left">Recommended</button>
                    <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all text-left">Price: Low to High</button>
                    <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all text-left">Price: High to Low</button>
                  </div>
                </Transition>
              </div>
              <button class="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest" @click="mobileFilters = true">
                <Filter class="h-3.5 w-3.5" />
                Filter
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="space-y-6">
            <div v-for="n in 3" :key="n" class="bg-white border border-gray-100 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 animate-pulse">
              <div class="w-full md:w-64 h-48 bg-gray-100 rounded-2xl"></div>
              <div class="flex-grow space-y-4">
                <div class="h-8 bg-gray-100 w-2/3 rounded-lg"></div>
                <div class="h-4 bg-gray-100 w-1/2 rounded-lg"></div>
                <div class="h-12 bg-gray-100 w-full rounded-xl"></div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="!filteredCruises.length && !loading" class="py-32 flex flex-col items-center text-center space-y-6 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300">
              <Waves class="h-8 w-8" />
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-black text-gray-900">No sailings found</h3>
              <p class="text-gray-500 max-w-sm">We couldn't find any cruises matching your criteria. Try adjusting your filters or destination.</p>
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
      <div v-if="mobileFilters" class="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[150] lg:hidden" @click.self="mobileFilters = false">
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

const route = useRoute()
const { loading, filteredCruises, filters, searchCruises } = useSearchCruises()

// ── Refs ──────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const destRef = ref<HTMLElement | null>(null)
const monthRef = ref<HTMLElement | null>(null)
const sortRef = ref<HTMLElement | null>(null)
const sortOpen = ref(false)
const mobileFilters = ref(false)

const searchQuery = reactive({
  destination: String(route.query.destination || 'BH'),
  destinationLabel: '',
  departingMonth: String(route.query.departingMonth || '03/1/2026'),
  departingLabel: '',
  length: String(route.query.length || ''),
  line: String(route.query.line || ''),
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
  navigateTo({
    path: '/checkout',
    query: {
      type: 'cruise',
      id: String(cruise._id || cruise.id),
      name: String(cruise.name),
      price: String(cruise.pricing?.startingPrice || cruise.price)
    }
  })
}

const resolveLabels = () => {
  const d = cruiseDestinations.find(opt => opt.value === searchQuery.destination)
  if (d) searchQuery.destinationLabel = d.label
  
  const m = cruiseMonths.find(opt => opt.value === searchQuery.departingMonth)
  if (m) searchQuery.departingLabel = m.label
}

// ── Lifecycle ─────────────────────────────────────────────────────────
onMounted(() => {
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
  font-family: 'Sora', sans-serif;
  color: #111;
}

.cr-wrap {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.cd-enter-active, .cd-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.cd-enter-from { opacity: 0; transform: translateY(-12px) scale(0.98); }
.cd-leave-to { opacity: 0; transform: translateY(-8px) scale(0.99); }

.cr-ov-enter-active, .cr-ov-leave-active { transition: opacity 0.3s ease; }
.cr-ov-enter-from, .cr-ov-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .cr-wrap { padding: 0 20px; }
}
</style>
