<template>
  <div class="ck-fd">
    <!-- Flight Itinerary -->
    <div v-if="flightOffer" class="ck-fd-card">
      <div class="ck-fd-hdr">
        <div class="ck-fd-route-wrap">
          <h2 class="ck-fd-h">{{ flightOffer.originName || flightOffer.origin }} ➔ {{ flightOffer.destinationName || flightOffer.destination }}</h2>
          <div class="ck-fd-sub">
             <span>{{ formatDate(flightOffer.departureTime) }}</span>
             <span class="ck-fd-dot"></span>
             <span>{{ flightOffer.stops === 0 ? 'Non-stop' : `${flightOffer.stops} Stop${flightOffer.stops > 1 ? 's' : ''}` }}</span>
             <span class="ck-fd-dot"></span>
             <span>{{ formatDuration(flightOffer.duration) }}</span>
          </div>
        </div>
        <button @click="expanded = !expanded" class="ck-fd-toggle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" :class="{ 'rotate-180': expanded }"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      <Transition name="fade">
        <div v-show="expanded" class="ck-fd-body">
          <div v-for="(segment, idx) in flightOffer.segments" :key="idx" class="ck-fd-seg-group">
            
            <!-- Segment Card -->
            <div class="ck-fd-seg">
              <div class="ck-fd-seg-hd">
                <div class="ck-fd-airline">
                  <img v-if="segment.airlineLogo" :src="segment.airlineLogo" :alt="segment.airline" class="ck-fd-logo" />
                  <span class="ck-fd-seg-name">{{ segment.airline }} • {{ segment.flightNumber }}</span>
                </div>
                <span class="ck-fd-cabin">{{ capitalize(flightOffer.cabinClass || 'economy') }}</span>
              </div>

              <div class="ck-fd-time-grid">
                <div class="ck-fd-point">
                  <span class="ck-fd-time">{{ formatTime(segment.departureTime) }}</span>
                  <div class="ck-fd-loc">
                    <span class="ck-fd-iata">{{ segment.origin }}</span>
                    <span class="ck-fd-term">{{ segment.originTerminal ? `Terminal ${segment.originTerminal}` : 'Main Terminal' }}</span>
                  </div>
                </div>

                <div class="ck-fd-path">
                  <div class="ck-fd-path-line"></div>
                  <span class="ck-fd-path-dur">{{ formatDuration(segment.duration) }}</span>
                </div>

                <div class="ck-fd-point ck-fd-point--end">
                  <span class="ck-fd-time">{{ formatTime(segment.arrivalTime) }}</span>
                  <div class="ck-fd-loc">
                    <span class="ck-fd-iata">{{ segment.destination }}</span>
                    <span class="ck-fd-term">{{ segment.destinationTerminal ? `Terminal ${segment.destinationTerminal}` : 'Main Terminal' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Layover -->
            <div v-if="idx < flightOffer.segments.length - 1" class="ck-fd-layover">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>{{ calcLayover(segment, flightOffer.segments[idx + 1]) }} Layover in {{ segment.destinationName || segment.destination }}</span>
            </div>
          </div>

          <!-- Bag Info -->
          <div class="ck-fd-bags">
             <div class="ck-fd-bag-item">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
               <span>Check-in: 2 × 23kg</span>
             </div>
             <div class="ck-fd-bag-item">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
               <span>Cabin: 1 × 7kg</span>
             </div>
          </div>
        </div>
      </Transition>

      <!-- Footer Tags -->
      <div class="ck-fd-ft">
        <div class="ck-fd-tags">
          <span :class="flightOffer.conditions?.refundable ? 'ck-tag--pos' : 'ck-tag--neg'">
            {{ flightOffer.conditions?.refundable ? 'Refundable' : 'Non-refundable' }}
          </span>
          <span :class="flightOffer.conditions?.changeable ? 'ck-tag--pos' : 'ck-tag--neu'">
             {{ flightOffer.conditions?.changeable ? 'Changeable' : 'Fixed Date' }}
          </span>
        </div>
        <div v-if="flightOffer.totalEmissionsKg" class="ck-fd-co2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"/><path d="M12 6a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6z"/></svg>
          <span>{{ flightOffer.totalEmissionsKg }}kg CO₂</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="ck-fd-actions">
       <button @click="$emit('continue')" class="ck-fd-btn">
          <span>Continue to passenger info</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
       </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  flightOffer: { type: Object, default: null }
})

defineEmits(['continue'])

const expanded = ref(true)

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''

const formatTime = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

const formatDuration = (minutes: number) => {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

const calcLayover = (seg1: any, seg2: any) => {
  if (!seg1?.arrivalTime || !seg2?.departureTime) return '—'
  const diff = new Date(seg2.departureTime).getTime() - new Date(seg1.arrivalTime).getTime()
  return formatDuration(Math.round(diff / 60000))
}
</script>

<style scoped>
.ck-fd { display: flex; flex-direction: column; gap: 24px; font-family: 'Sora', sans-serif; }

.ck-fd-card { background: #fff; border: 1.5px solid #f0f0ea; border-radius: 20px; overflow: hidden; }

.ck-fd-hdr { display: flex; align-items: center; justify-content: space-between; padding: 24px 32px; background: #fafaf8; }
.ck-fd-h { font-size: 18px; font-weight: 700; color: #111; margin-bottom: 4px; letter-spacing: -0.02em; }
.ck-fd-sub { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 500; color: #aaa; }
.ck-fd-dot { width: 3px; height: 3px; border-radius: 50%; background: #ccc; }

.ck-fd-toggle {
  width: 32px; height: 32px; border-radius: 50%; background: #fff; border: 1px solid #eee;
  display: flex; align-items: center; justify-content: center; cursor: pointer; color: #888;
}

.ck-fd-body { padding: 32px; border-top: 1px solid #f0f0ea; }

.ck-fd-seg-group { margin-bottom: 24px; }
.ck-fd-seg { background: #fff; border: 1px solid #eee; border-radius: 16px; padding: 20px; }
.ck-fd-seg-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.ck-fd-airline { display: flex; align-items: center; gap: 10px; }
.ck-fd-logo { width: 24px; height: 24px; object-fit: contain; }
.ck-fd-seg-name { font-size: 11px; font-weight: 700; color: #111; }
.ck-fd-cabin { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; color: #1d7a4f; background: #f0f7f3; padding: 3px 8px; border-radius: 100px; }

.ck-fd-time-grid { display: flex; align-items: center; gap: 24px; }
.ck-fd-point { flex: 1; }
.ck-fd-time { display: block; font-size: 16px; font-weight: 800; color: #111; margin-bottom: 4px; }
.ck-fd-loc { display: flex; flex-direction: column; }
.ck-fd-iata { font-size: 12px; font-weight: 700; color: #555; }
.ck-fd-term { font-size: 10px; color: #aaa; }

.ck-fd-path { flex: 1.2; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ck-fd-path-line { width: 100%; height: 2px; background: #eee; border-radius: 4px; position: relative; }
.ck-fd-path-line::before, .ck-fd-path-line::after { content: ''; position: absolute; top: -2px; width: 6px; height: 6px; border-radius: 50%; background: #eee; }
.ck-fd-path-line::before { left: 0; } .ck-fd-path-line::after { right: 0; }
.ck-fd-path-dur { font-size: 10px; font-weight: 600; color: #bbb; letter-spacing: 0.05em; }

.ck-fd-point--end { text-align: right; }

.ck-fd-layover {
  display: flex; align-items: center; gap: 8px; margin: 12px 20px;
  font-size: 11px; font-weight: 600; color: #c2410c; background: #fff7ed; padding: 6px 12px; border-radius: 100px; width: fit-content;
}

.ck-fd-bags { display: flex; gap: 24px; margin-top: 32px; padding-top: 24px; border-top: 1px dashed #eee; }
.ck-fd-bag-item { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: #555; }
.ck-fd-bag-item svg { color: #aaa; }

.ck-fd-ft { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: #fafaf8; border-top: 1px solid #f0f0ea; }
.ck-fd-tags { display: flex; gap: 12px; }
.ck-fd-tags span { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 4px; }
.ck-tag--pos { background: #f0fdf4; color: #166534; }
.ck-tag--neg { background: #fef2f2; color: #991b1b; }
.ck-tag--neu { background: #f3f4f6; color: #4b5563; }

.ck-fd-co2 { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; color: #059669; }

.ck-fd-actions { display: flex; justify-content: flex-end; }
.ck-fd-btn {
  background: #111; color: #fff; border: none; border-radius: 12px; height: 52px; padding: 0 32px;
  display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.ck-fd-btn:hover { background: #1d7a4f; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
.ck-fd-btn:active { transform: scale(0.98); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
