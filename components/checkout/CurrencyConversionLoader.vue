<template>
  <Transition name="fade">
    <div v-if="visible" class="loader-overlay">
      <div class="loader-content">
        <p class="loader-title text-center font-bold mb-2 text-sm text-gray-800">Just a moment...</p>
        <h4 class="loader-text text-center  text-xl mb-4 text-gray-900 leading-tight">
          Currency<br />conversion...ongoing
        </h4>
        <div class="progress-container">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  visible: Boolean
})
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.loader-content {
  background: white;
  padding: 2.5rem 3rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.progress-container {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  width: 40%;
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  animation: slide 1.5s infinite ease-in-out;
}

@keyframes slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
