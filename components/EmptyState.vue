<template>
  <div class="es-wrap">

    <!-- Left: Icon -->
    <div class="es-icon-col">
      <div class="es-icon-ring">
        <Transition name="icon-swap" mode="out-in">
          <div :key="variant" class="es-icon-inner">
            <component :is="computedIcon" class="es-icon" />
          </div>
        </Transition>
      </div>
      <!-- animated dots -->
      <span class="dot dot-1" />
      <span class="dot dot-2" />
      <span class="dot dot-3" />
    </div>

    <!-- Divider -->
    <div class="es-divider" />

    <!-- Right: Content -->
    <div class="es-content">
      <Transition name="fade-up" mode="out-in">
        <div :key="variant" class="es-text-block">
          <p class="es-eyebrow">{{ variantLabel }}</p>
          <h3 class="es-title">{{ title || 'No results found' }}</h3>
          <p class="es-message">{{ message || 'Try adjusting your filters or search to uncover new deals.' }}</p>
        </div>
      </Transition>

      <Transition name="fade-up" mode="out-in">
        <ul :key="variant + '-pills'" class="es-pills">
          <li v-for="tip in tips" :key="tip" class="es-pill">{{ tip }}</li>
        </ul>
      </Transition>

      <button v-if="actionLabel" @click="$emit('action')" class="es-btn">
        {{ actionLabel }}
        <ArrowRightIcon class="es-btn-icon" />
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  MagnifyingGlassIcon, PaperAirplaneIcon, BuildingOfficeIcon,
  TruckIcon, GlobeAltIcon, SparklesIcon, ArrowRightIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: String,
  message: String,
  actionLabel: String,
  variant: {
    type: String,
    default: 'search',
    validator: (v: string) => ['search','flights','stays','cars','cruises','packages'].includes(v),
  },
})

defineEmits(['action'])

const iconMap: Record<string, any> = {
  search: MagnifyingGlassIcon, flights: PaperAirplaneIcon,
  stays: BuildingOfficeIcon,   cars: TruckIcon,
  cruises: GlobeAltIcon,       packages: SparklesIcon,
}
const labelMap: Record<string, string> = {
  search: 'Search', flights: 'Flights', stays: 'Stays',
  cars: 'Car Rentals', cruises: 'Cruises', packages: 'Packages',
}
const tipsMap: Record<string, string[]> = {
  search:   ['Broaden your dates', 'Try nearby airports', 'Clear active filters'],
  flights:  ['Flexible dates', 'Nearby airports', 'Remove cabin filter'],
  stays:    ['Expand radius', 'Adjust price range', 'Remove star rating'],
  cars:     ['Different pickup', 'Expand car category', 'Nearby locations'],
  cruises:  ['Change departure port', 'Different duration', 'Adjust sail dates'],
  packages: ['Different region', 'Adjust budget', 'Change travel dates'],
}

const computedIcon  = computed(() => iconMap[props.variant]  ?? MagnifyingGlassIcon)
const variantLabel  = computed(() => labelMap[props.variant]  ?? 'Search')
const tips          = computed(() => tipsMap[props.variant]   ?? tipsMap.search)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lora:ital,wght@1,400&display=swap');

/* ── Wrapper ─────────────────────────────────────────── */
.es-wrap {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background: #ffffff;
  border: 1.5px solid #e9eaec;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1.75rem;
  padding: 1.75rem 2rem;
  position: relative;
  overflow: hidden;
}

/* subtle blue edge accent */
.es-wrap::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: #1a6cf0;
  border-radius: 16px 0 0 16px;
}

/* ── Icon Column ────────────────────────────────────── */
.es-icon-col {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.es-icon-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f0f5ff;
  border: 1.5px solid #dbe8fe;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { box-shadow: 0 0 0 0 rgba(26,108,240,0.12); }
  50%       { box-shadow: 0 0 0 8px rgba(26,108,240,0); }
}

.es-icon-inner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  border: 1.5px solid #dbe8fe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(26,108,240,0.12);
}
.es-icon {
  width: 20px; height: 20px;
  color: #1a6cf0;
  stroke-width: 1.75;
}

/* floating dots */
.dot {
  position: absolute;
  border-radius: 50%;
  background: #1a6cf0;
  opacity: 0.18;
  animation: float-dot 2.4s ease-in-out infinite;
}
.dot-1 { width: 5px; height: 5px; top: 2px;  right: 2px;  animation-delay: 0s;    }
.dot-2 { width: 4px; height: 4px; bottom: 4px; left: 0px; animation-delay: 0.6s;  }
.dot-3 { width: 3px; height: 3px; top: 12px; left: -4px;  animation-delay: 1.2s;  }

@keyframes float-dot {
  0%, 100% { transform: translateY(0);  opacity: 0.18; }
  50%       { transform: translateY(-4px); opacity: 0.35; }
}

/* ── Divider ─────────────────────────────────────────── */
.es-divider {
  width: 1px;
  align-self: stretch;
  background: #e9eaec;
  flex-shrink: 0;
}

/* ── Content ─────────────────────────────────────────── */
.es-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.es-text-block { display: flex; flex-direction: column; gap: 0.2rem; }

.es-eyebrow {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #1a6cf0;
  margin: 0;
}
.es-title {
  font-family: 'Lora', serif;
  font-size: 1.0625rem;
  font-weight: 400;
  font-style: italic;
  color: #0d0d12;
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1.3;
}
.es-message {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Pills */
.es-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  list-style: none;
  margin: 0; padding: 0;
}
.es-pill {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #374151;
  background: #f4f5f7;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  cursor: default;
}
.es-pill:hover {
  background: #f0f5ff;
  border-color: #dbe8fe;
  color: #1a6cf0;
}

/* Button */
.es-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  border: none;
  background: #1a6cf0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(26,108,240,0.25);
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  letter-spacing: 0.01em;
}
.es-btn:hover {
  background: #1559cc;
  box-shadow: 0 4px 14px rgba(26,108,240,0.35);
  transform: translateY(-1px);
}
.es-btn:active { transform: scale(0.98); }
.es-btn-icon { width: 13px; height: 13px; transition: transform 0.2s; }
.es-btn:hover .es-btn-icon { transform: translateX(3px); }

/* ── Transitions ─────────────────────────────────────── */
.icon-swap-enter-active, .icon-swap-leave-active { transition: opacity 0.2s, transform 0.2s; }
.icon-swap-enter-from { opacity: 0; transform: scale(0.8) rotate(-8deg); }
.icon-swap-leave-to  { opacity: 0; transform: scale(1.1) rotate(8deg); }

.fade-up-enter-active { transition: opacity 0.28s ease, transform 0.28s ease; }
.fade-up-leave-active { transition: opacity 0.15s ease; }
.fade-up-enter-from   { opacity: 0; transform: translateY(6px); }
.fade-up-leave-to     { opacity: 0; }

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 480px) {
  .es-wrap { flex-direction: column; align-items: flex-start; padding: 1.5rem; }
  .es-divider { width: 100%; height: 1px; align-self: auto; }
  .es-wrap::before { width: 100%; height: 3px; bottom: auto; right: 0; border-radius: 16px 16px 0 0; }
}
</style>