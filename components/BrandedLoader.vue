<template>
  <transition
    enter-active-class="transition-opacity duration-500"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="branded-loader-overlay">
      <div class="branded-loader-content">
        <!-- Animated rings -->
        <div class="loader-rings">
          <div class="ring ring-outer"></div>
          <div class="ring ring-middle"></div>
          <div class="ring ring-inner"></div>
          <!-- Logo -->
          <div class="logo-container">
            <img src="@/assets/img/logo.png" alt="Flybeth" class="logo-img" />
          </div>
        </div>

        <!-- Status text -->
        <div class="loader-text-area">
          <p class="loader-status">{{ statusText }}</p>
          <div class="loader-dots">
            <span class="dot dot-1"></span>
            <span class="dot dot-2"></span>
            <span class="dot dot-3"></span>
          </div>
        </div>

        <!-- Optional subtitle -->
        <p v-if="subtitle" class="loader-subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps({
  visible: { type: Boolean, default: true },
  statusText: { type: String, default: 'Confirming best fare with airline...' },
  subtitle: { type: String, default: '' }
})
</script>

<style scoped>
.branded-loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0D1DAD 0%, #0a1488 40%, #060d5c 100%);
  backdrop-filter: blur(20px);
}

.branded-loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.loader-rings {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
}

.ring-outer {
  width: 180px;
  height: 180px;
  border-top-color: #32B404;
  border-right-color: rgba(50, 180, 4, 0.3);
  animation: spin-clockwise 2s linear infinite;
}

.ring-middle {
  width: 140px;
  height: 140px;
  border-bottom-color: #fff;
  border-left-color: rgba(255, 255, 255, 0.3);
  animation: spin-counter 1.5s linear infinite;
}

.ring-inner {
  width: 110px;
  height: 110px;
  border-top-color: #32B404;
  border-right-color: rgba(50, 180, 4, 0.2);
  animation: spin-clockwise 2.5s linear infinite;
}

.logo-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(50, 180, 4, 0.3), 0 0 80px rgba(13, 29, 173, 0.2);
  animation: logo-pulse 2s ease-in-out infinite;
  z-index: 2;
}

.logo-img {
  width: 55px;
  height: 55px;
  object-fit: contain;
}

.loader-text-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loader-status {
  color: white;
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.loader-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #32B404;
  animation: dot-bounce 1.4s ease-in-out infinite both;
}

.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: 0.16s; }
.dot-3 { animation-delay: 0.32s; }

.loader-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.25em;
}

@keyframes spin-clockwise {
  to { transform: rotate(360deg); }
}

@keyframes spin-counter {
  to { transform: rotate(-360deg); }
}

@keyframes logo-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(50, 180, 4, 0.3), 0 0 80px rgba(13, 29, 173, 0.2); }
  50% { transform: scale(1.08); box-shadow: 0 0 60px rgba(50, 180, 4, 0.5), 0 0 100px rgba(13, 29, 173, 0.3); }
}

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
