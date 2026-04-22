<template>
  <transition
    enter-active-class="transition-opacity duration-700"
    leave-active-class="transition-opacity duration-700"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="branded-loader-overlay">
      <div class="loader-content animate-in">
        <!-- Minimalist Pulse -->
        <div class="loader-visual">
          <div class="visual-pulse pulse-primary"></div>
          <div class="visual-pulse pulse-secondary"></div>
          <div class="logo-wrapper">
             <img src="@/assets/img/logo.png" alt="Flybeth" class="brand-logo" />
          </div>
          <!-- Orbiting ring -->
          <svg class="orbit-svg" viewBox="0 0 100 100">
            <circle class="orbit-path" cx="50" cy="50" r="48" fill="none" />
            <circle class="orbit-dot" cx="50" cy="50" r="48" fill="none" />
          </svg>
        </div>

        <!-- Professional Text -->
        <div class="status-container">
          <h2 class="status-title">{{ statusText }}</h2>
          <p v-if="subtitle" class="status-subtitle">{{ subtitle }}</p>
          <div class="loading-bar">
            <div class="bar-progress"></div>
          </div>
        </div>
      </div>

      <!-- Corner Accents -->
      <div class="accent accent-top"></div>
      <div class="accent accent-bottom"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps({
  visible: { type: Boolean, default: true },
  statusText: { type: String, default: 'Confirming best fare with airline...' },
  subtitle: { type: String, default: 'One moment while we secure your journey' }
})
</script>

<style scoped>
.branded-loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  overflow: hidden;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3rem;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.loader-visual {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-wrapper {
  position: relative;
  z-index: 10;
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
}

.brand-logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
  animation: logo-float 3s ease-in-out infinite;
}

.visual-pulse {
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  background: #0D1DAD;
  opacity: 0.1;
}

.pulse-primary { animation: pulse-wave 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
.pulse-secondary { animation: pulse-wave 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite 1.25s; }

.orbit-svg {
  position: absolute;
  inset: -15px;
  width: 150px;
  height: 150px;
  transform: rotate(-90deg);
}

.orbit-path {
  stroke: #f3f3f3;
  stroke-width: 0.5px;
}

.orbit-dot {
  stroke: #0D1DAD;
  stroke-width: 2px;
  stroke-dasharray: 1, 300;
  stroke-linecap: round;
  animation: orbit-rotation 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.status-title {
  color: #1a1a1b;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.status-subtitle {
  color: #a1a1a5;
  font-size: 0.75rem;
  font-weight: 500;
}

.loading-bar {
  width: 60px;
  height: 2px;
  background: #f0f0f2;
  border-radius: 10px;
  margin-top: 1rem;
  overflow: hidden;
}

.bar-progress {
  width: 40%;
  height: 100%;
  background: #0D1DAD;
  border-radius: 10px;
  animation: bar-slide 1.5s ease-in-out infinite;
}

.accent {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(50, 180, 4, 0.03) 0%, transparent 70%);
  pointer-events: none;
}
.accent-top { top: -200px; left: -100px; }
.accent-bottom { bottom: -200px; right: -100px; }

@keyframes orbit-rotation {
  0% { stroke-dasharray: 1, 300; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 120, 300; stroke-dashoffset: -40; }
  100% { stroke-dasharray: 1, 300; stroke-dashoffset: -300; }
}

@keyframes pulse-wave {
  0% { transform: scale(1); opacity: 0.15; }
  100% { transform: scale(2.2); opacity: 0; }
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes bar-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}

.animate-in {
  animation: content-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes content-in {
  from { opacity: 0; transform: scale(0.98) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
