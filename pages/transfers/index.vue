<template>
  <div class="tr-root" @mousedown="handleGlobalMousedown">

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
          <div class="tr-fld tr-fld--loc" :class="{ 'tr-fld--active': activeField === 'origin' }" ref="originRef">
            <div class="tr-fld-inner" @click="openField('origin')">
              <svg class="tr-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div class="tr-fld-text">
                <span class="tr-fld-lbl">Pick-up</span>
                <span class="tr-fld-val" :class="{ 'tr-fld-val--set': searchQuery.origin }">
                  {{ searchQuery.origin || 'Airport or city' }}
                </span>
              </div>
            </div>
            <Transition name="td">
              <div v-if="activeField === 'origin'" class="tr-drop tr-drop--loc" @mousedown.stop>
                <div class="tr-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="originInputRef" v-model="originQuery" placeholder="Where from?…" class="tr-drop-input" @input="searchOrigins" />
                </div>
                <div class="tr-drop-results">
                  <button v-for="r in originResults" :key="r" class="tr-loc-result" @click="selectOrigin(r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{{ r }}</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <div class="tr-bar-sep"></div>

          <!-- DESTINATION -->
          <div class="tr-fld tr-fld--loc" :class="{ 'tr-fld--active': activeField === 'dest' }" ref="destRef">
            <div class="tr-fld-inner" @click="openField('dest')">
              <svg class="tr-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <div class="tr-fld-text">
                <span class="tr-fld-lbl">Drop-off</span>
                <span class="tr-fld-val" :class="{ 'tr-fld-val--set': searchQuery.destination }">
                  {{ searchQuery.destination || 'Destination' }}
                </span>
              </div>
            </div>
            <Transition name="td">
              <div v-if="activeField === 'dest'" class="tr-drop tr-drop--loc" @mousedown.stop>
                <div class="tr-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="destInputRef" v-model="destQuery" placeholder="Where to?…" class="tr-drop-input" @input="searchDests" />
                </div>
                <div class="tr-drop-results">
                  <button v-for="r in destResults" :key="r" class="tr-loc-result" @click="selectDest(r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{{ r }}</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <div class="tr-bar-sep"></div>

          <!-- DATE -->
          <div class="tr-fld tr-fld--date" :class="{ 'tr-fld--active': activeField === 'date' }" ref="dateRef">
            <div class="tr-fld-inner" @click="openField('date')">
              <svg class="tr-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div class="tr-fld-text">
                <span class="tr-fld-lbl">Pickup</span>
                <span class="tr-fld-val" :class="{ 'tr-fld-val--set': searchQuery.date }">
                  {{ searchQuery.date ? formatDate(searchQuery.date) : 'Choose date' }}
                </span>
              </div>
            </div>
            <Transition name="td">
              <div v-if="activeField === 'date'" class="tr-drop tr-drop--cal" @mousedown.stop>
                <div class="tr-cal-grid">
                   <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="tr-cal-dow">{{ d }}</div>
                   <div v-for="c in calCells" :key="c.key"
                     class="tr-cal-cell"
                     :class="{ 'tr-cal-cell--blank': !c.date, 'tr-cal-cell--past': c.past, 'tr-cal-cell--sel': c.selected }"
                     @click="c.date && !c.past && pickDate(c.date)"
                   >{{ c.day }}</div>
                </div>
              </div>
            </Transition>
          </div>

          <button class="tr-search-btn" :class="{ 'tr-search-btn--busy': loading }" @click="handleSearch">
            <span v-if="!loading">Search</span>
            <span v-else class="tr-spin"></span>
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
          <div v-if="loading" class="tr-loading">
            <div v-for="i in 3" :key="i" class="tr-skel"></div>
          </div>

          <div v-else-if="!transfers.length" class="tr-empty">
             <div class="tr-empty-ico">🚗</div>
             <h3>No transfers found</h3>
             <p>Try searching different locations or dates.</p>
          </div>

          <div v-else class="tr-list">
             <TransferCard 
               v-for="transfer in transfers" 
               :key="transfer.id" 
               :transfer="transfer"
               @select="selectTransfer" 
             />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, onMounted, nextTick } from 'vue'
import { useSearchTransfers } from '@/composables/modules/transfers/useSearchTransfers'
import TransferCard from '@/components/TransferCard.vue'

const { loading, transfers, searchTransfers } = useSearchTransfers()

const activeField = ref<string | null>(null)
const originRef = ref(null), destRef = ref(null), dateRef = ref(null)
const originInputRef = ref(null), destInputRef = ref(null)
const originQuery = ref(''), destQuery = ref('')
const originResults = ref(['DXB - Dubai Intl', 'LOS - Murtala Muhammed', 'LHR - Heathrow'])
const destResults = ref(['Downtown', 'Marina', 'Palm Jumeirah'])
const selectedTypes = ref<string[]>([])

const searchQuery = ref({ origin: '', destination: '', date: '', time: '12:00', adults: 2 })

const openField = (f: string) => { 
  activeField.value = activeField.value === f ? null : f
  if (f === 'origin') nextTick(() => originInputRef.value?.focus())
  if (f === 'dest') nextTick(() => destInputRef.value?.focus())
}

const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { origin: originRef, dest: destRef, date: dateRef }
  if (activeField.value) {
    const cur = refs[activeField.value]?.value
    if (cur && !cur.contains(e.target as Node)) activeField.value = null
  }
}

const selectOrigin = (r: string) => { searchQuery.value.origin = r; activeField.value = null; nextTick(() => openField('dest')) }
const selectDest = (r: string) => { searchQuery.value.destination = r; activeField.value = null; nextTick(() => openField('date')) }

const pickDate = (iso: string) => { searchQuery.value.date = iso; activeField.value = null }
const formatDate = (iso: string) => iso

const toggleType = (t: string) => {
  const i = selectedTypes.value.indexOf(t)
  if (i >= 0) selectedTypes.value.splice(i, 1); else selectedTypes.value.push(t)
}

const handleSearch = () => {
  const extractIata = (str: string) => {
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1].toUpperCase() : str.toUpperCase();
  }
  const fromCode = extractIata(searchQuery.value.origin);
  const toCode = extractIata(searchQuery.value.destination);
  
  searchTransfers({
    fromCode, fromType: 'IATA', toCode, toType: 'ATLAS',
    outbound: `${searchQuery.value.date}T${searchQuery.value.time}:00`,
    adults: Number(searchQuery.value.adults), children: 0, infants: 0, language: 'en'
  })
}

const selectTransfer = (t: any) => {
  navigateTo({
    path: '/checkout',
    query: { type: 'transfer', id: t.offerId || t.id, name: t.vehicleDescription, price: t.price, currency: t.currency }
  })
}

const calCells = computed(() => {
  const cells = []
  const today = new Date(); today.setHours(0,0,0,0)
  for (let d = 1; d <= 30; d++) {
    const dt = new Date(); dt.setDate(today.getDate() + d)
    const iso = dt.toISOString().split('T')[0]
    cells.push({ key: iso, date: iso, day: dt.getDate(), past: false, selected: searchQuery.value.date === iso })
  }
  return cells
})

onMounted(() => {
  searchQuery.value.origin = 'DXB'
  searchQuery.value.destination = 'Dubai Marina'
  searchQuery.value.date = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  handleSearch()
})
</script>

<style scoped>
.tr-root { min-height: 100vh; background: #fff; font-family: 'Sora', sans-serif; color: #111; }
.tr-wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
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
.tr-search-btn { background: #111; color: #fff; border: none; padding: 0 30px; border-radius: 14px; margin: 6px; font-weight: 600; cursor: pointer; }
.tr-search-btn:hover { background: #3b82f6; }
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
</style>
