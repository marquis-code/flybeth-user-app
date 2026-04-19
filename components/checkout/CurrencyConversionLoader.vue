<template>
  <Transition name="fade-blur">
    <div v-if="visible" class="loader-overlay">
      <div class="loader-card animate-scale-up">
        <div class="loader-visual">
          <div class="pulse-ring"></div>
          <div class="icon-wrap">
            <Coins class="w-6 h-6 text-emerald-500" />
          </div>
        </div>
        
        <div class="loader-text-wrap">
          <h3 class="loader-heading">Currency Optimization</h3>
          <p class="loader-sub">One moment while we update live pricing for your selection</p>
        </div>

        <div class="loading-track">
          <div class="loading-fill"></div>
        </div>
        
        <div class="security-tag">
           <ShieldCheck class="w-3 h-3" />
           <span>Secured by Flybeth Engine</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Coins, ShieldCheck } from 'lucide-vue-next'

defineProps({
  visible: Boolean
})
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
}

.loader-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 2rem;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 40px 100px -20px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.03);
}

.loader-visual {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.icon-wrap {
  position: relative;
  z-index: 2;
  width: 56px;
  height: 56px;
  background: #f0fdf4;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #10b981;
  opacity: 0.1;
  animation: pulse-out 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.loader-text-wrap {
  margin-bottom: 2rem;
}

.loader-heading {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
}

.loader-sub {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.5;
}

.loading-track {
  width: 120px;
  height: 3px;
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.loading-fill {
  width: 30%;
  height: 100%;
  background: #10b981;
  border-radius: 10px;
  animation: slide-fill 1.5s ease-in-out infinite;
}

.security-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.65rem;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@keyframes pulse-out {
  0% { transform: scale(0.8); opacity: 0.2; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes slide-fill {
  0% { transform: translateX(-100%); width: 10%; }
  50% { width: 40%; }
  100% { transform: translateX(300%); width: 10%; }
}

@keyframes scale-up {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-scale-up {
  animation: scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: all 0.5s;
}

.fade-blur-enter-from,
.fade-blur-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}
</style>
