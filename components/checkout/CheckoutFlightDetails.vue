<template>
  <div class="flight-details-step">
    <!-- Flight Itinerary -->
    <div v-if="flightOffer" class="itinerary-card">
      <div class="itinerary-header">
        <h2 class="itinerary-route">{{ flightOffer.origin }} → {{ flightOffer.destination }}</h2>
        <button @click="expanded = !expanded" class="expand-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="{ 'rotate-180': expanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      <!-- Date & summary bar -->
      <div class="date-bar">
        <span class="date-badge">{{ formatDate(flightOffer.departureTime) }}</span>
        <span class="stops-badge">{{ flightOffer.stops === 0 ? 'Non stop' : `${flightOffer.stops} Stop${flightOffer.stops > 1 ? 's' : ''}` }}</span>
        <span class="duration-badge">{{ formatDuration(flightOffer.duration) }}</span>
      </div>

      <div v-show="expanded" class="segments-list">
        <template v-for="(segment, idx) in flightOffer.segments" :key="idx">
          <!-- Segment -->
          <div class="segment-card">
            <div class="segment-header">
              <div class="airline-info">
                <img v-if="segment.airlineLogo" :src="segment.airlineLogo" :alt="segment.airline" class="airline-logo" />
                <div>
                  <span class="airline-name">{{ segment.airline }} {{ segment.flightNumber }}</span>
                </div>
              </div>
              <span class="cabin-badge">{{ capitalize(flightOffer.cabinClass || 'economy') }}</span>
            </div>

            <div class="segment-timeline">
              <!-- Departure -->
              <div class="timeline-point">
                <span class="time">{{ formatTime(segment.departureTime) }}</span>
                <div class="timeline-dot-container">
                  <div class="timeline-dot"></div>
                </div>
                <div class="location-info">
                  <span class="airport">{{ segment.origin }}{{ segment.originTerminal ? `, Terminal ${segment.originTerminal}` : '' }}</span>
                </div>
              </div>

              <!-- Duration line -->
              <div class="timeline-line">
                <span class="seg-duration">{{ formatDuration(segment.duration) }}</span>
              </div>

              <!-- Arrival -->
              <div class="timeline-point">
                <span class="time">{{ formatTime(segment.arrivalTime) }}</span>
                <div class="timeline-dot-container">
                  <div class="timeline-dot"></div>
                </div>
                <div class="location-info">
                  <span class="airport">{{ segment.destination }}{{ segment.destinationTerminal ? `, Terminal ${segment.destinationTerminal}` : '' }}</span>
                </div>
              </div>
            </div>

            <!-- Segment meta -->
            <div class="segment-meta">
              <div class="meta-item">
                <span class="meta-label">BAGGAGE</span>
                <span class="meta-value">2 × 23kg</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">CHECK IN</span>
                <span class="meta-value">Online</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">CABIN</span>
                <span class="meta-value">1 × 7kg</span>
              </div>
            </div>
          </div>

          <!-- Layover -->
          <div v-if="idx < flightOffer.segments.length - 1" class="layover-card">
            <div class="layover-icon">⏱</div>
            <div>
              <span class="layover-title">Layover</span>
              <span class="layover-info">{{ calcLayover(segment, flightOffer.segments[idx + 1]) }} Layover in {{ segment.destination }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- Conditions & Emissions -->
      <div class="conditions-bar">
        <div class="condition-tags">
          <span v-if="flightOffer.conditions?.refundable" class="tag tag-green">Refundable</span>
          <span v-else class="tag tag-red">Non-refundable</span>
          <span v-if="flightOffer.conditions?.changeable" class="tag tag-green">Changeable</span>
          <span v-else class="tag tag-gray">Non-changeable</span>
        </div>
        <div v-if="flightOffer.totalEmissionsKg" class="emissions">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
          <span>{{ flightOffer.totalEmissionsKg }}kg CO₂</span>
        </div>
      </div>
    </div>

    <!-- Important Information -->
    <div class="important-info-card">
      <h3 class="info-title">Important Information</h3>
      <div class="info-notice">
        <span class="notice-icon">🟡</span>
        <div>
          <strong>Important Notice</strong>
          <p>We recommend double-checking your route and itinerary before continuing. This helps avoid any issues, as Flybeth cannot be held responsible for errors resulting from an incorrect route selection.</p>
        </div>
      </div>
    </div>

    <!-- Continue Button -->
    <div class="step-actions">
      <button @click="$emit('continue')" class="continue-btn">
        Continue
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
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

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

const formatTime = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const formatDate = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
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
  const mins = Math.round(diff / 60000)
  return formatDuration(mins)
}
</script>

<style scoped>
.flight-details-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.itinerary-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.itinerary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.itinerary-route {
  font-size: 1.15rem;
  font-weight: 900;
  color: #1a2332;
}

.expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
}

.date-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}

.date-badge {
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.stops-badge, .duration-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
}

.segments-list {
  padding: 1rem 1.5rem;
}

.segment-card {
  padding: 1rem 0;
}

.segment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.airline-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.airline-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.airline-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
}

.cabin-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: #0D1DAD;
  background: rgba(13, 29, 173, 0.08);
  padding: 0.2rem 0.6rem;
  border-radius: 0.25rem;
}

.segment-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 1rem;
}

.timeline-point {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time {
  font-size: 1rem;
  font-weight: 900;
  color: #1a2332;
  min-width: 48px;
}

.timeline-dot-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #0D1DAD;
  background: white;
}

.location-info {
  flex: 1;
}

.airport {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.timeline-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0 0.3rem calc(48px + 0.75rem);
  position: relative;
}

.timeline-line::before {
  content: '';
  position: absolute;
  left: calc(1rem + 48px + 0.75rem + 4px);
  top: 0;
  bottom: 0;
  width: 2px;
  background: #d1d5db;
}

.seg-duration {
  font-size: 0.72rem;
  font-weight: 600;
  color: #9ca3af;
  padding-left: 1.5rem;
}

.segment-meta {
  display: flex;
  gap: 2rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #e5e7eb;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.meta-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.meta-value {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}

.layover-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fef3c7;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  border-left: 4px solid #f59e0b;
}

.layover-icon {
  font-size: 1.2rem;
}

.layover-title {
  display: block;
  font-size: 0.78rem;
  font-weight: 800;
  color: #92400e;
}

.layover-info {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #a16207;
}

.conditions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #f3f4f6;
}

.condition-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tag-green { background: #d1fae5; color: #065f46; }
.tag-red { background: #fee2e2; color: #991b1b; }
.tag-gray { background: #f3f4f6; color: #6b7280; }

.emissions {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #059669;
}

.important-info-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.info-title {
  font-size: 1rem;
  font-weight: 900;
  color: #1a2332;
  margin-bottom: 1rem;
}

.info-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.notice-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.info-notice strong {
  display: block;
  font-size: 0.85rem;
  font-weight: 800;
  color: #374151;
  margin-bottom: 0.25rem;
}

.info-notice p {
  font-size: 0.78rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
}

.continue-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f97316;
  color: white;
  border: none;
  padding: 0.85rem 2.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s;
}

.continue-btn:hover {
  background: #ea580c;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
}
</style>
