<template>
  <div class="checkout-stepper-bar">
    <div class="stepper-inner">
      <!-- Go Back Button -->
      <button @click="$emit('go-back')" class="go-back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        <span>Go Back</span>
      </button>

      <h1 class="stepper-title">Complete your booking</h1>

      <!-- Steps -->
      <div class="steps-container">
        <template v-for="(step, idx) in steps" :key="idx">
          <div class="step-item" :class="{ active: idx === currentStep, completed: idx < currentStep, upcoming: idx > currentStep }">
            <div class="step-circle">
              <svg v-if="idx < currentStep" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              <span v-else class="step-number">{{ idx + 1 }}</span>
            </div>
            <span class="step-label">{{ step }}</span>
          </div>
          <div v-if="idx < steps.length - 1" class="step-connector" :class="{ completed: idx < currentStep }"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentStep: { type: Number, default: 0 },
  steps: {
    type: Array as () => string[],
    default: () => ['Search Flight', 'Traveller Info', 'Trip Customization', 'Overview & Payment']
  }
})

defineEmits(['go-back'])
</script>

<style scoped>
.checkout-stepper-bar {
  background: #ffffff;
  padding: 1.25rem 0;
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #f1f5f9;
}

.stepper-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.go-back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  color: #64748b;
  padding: 0.6rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s;
}

.go-back-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.stepper-title {
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 900;
  white-space: nowrap;
}

.steps-container {
  display: flex;
  align-items: center;
  gap: 0;
  margin-left: auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 900;
  transition: all 0.3s;
}

.step-item.upcoming .step-circle {
  background: #f1f5f9;
  color: #94a3b8;
}

.step-item.active .step-circle {
  background: #32B404;
  color: white;
}

.step-item.completed .step-circle {
  background: #1e293b;
  color: white;
}

.step-label {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.step-item.upcoming .step-label {
  color: #94a3b8;
}

.step-item.active .step-label {
  color: #0f172a;
}

.step-item.completed .step-label {
  color: #64748b;
}

.step-connector {
  width: 30px;
  height: 1px;
  background: #f1f5f9;
}

.step-connector.completed {
  background: #32B404;
}

@media (max-width: 1024px) {
  .stepper-inner {
    flex-wrap: wrap;
    gap: 1rem;
  }
  .stepper-title {
    display: none;
  }
  .steps-container {
    margin-left: 0;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  .step-label {
    display: none;
  }
  .step-connector {
    width: 16px;
  }
}
</style>
