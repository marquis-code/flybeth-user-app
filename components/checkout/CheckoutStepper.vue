<template>
  <div class="ck-steps">
    <template v-for="(step, idx) in steps" :key="idx">
      <div 
        class="ck-step" 
        :class="{ 
          'ck-step--active': idx === currentStep, 
          'ck-step--done': idx < currentStep, 
          'ck-step--hide-mob': idx !== currentStep 
        }"
      >
        <div class="ck-step-circ">
          <svg v-if="idx < currentStep" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 6L9 17l-5-5"/></svg>
          <span v-else>{{ idx + 1 }}</span>
        </div>
        <span class="ck-step-txt">{{ step }}</span>
      </div>
      <div v-if="idx < steps.length - 1" class="ck-step-line" :class="{ 'ck-step-line--done': idx < currentStep }"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentStep: { type: Number, default: 0 },
  steps: {
    type: Array as () => string[],
    default: () => ['Review', 'Traveler', 'Extras', 'Payment']
  }
})
</script>

<style scoped>
.ck-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.ck-step {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.ck-step-circ {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  background: #fff;
  border: 1.5px solid #eaeaef;
  color: #aaa;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.ck-step--active .ck-step-circ {
  background: #111;
  border-color: #111;
  color: #fff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.ck-step--done .ck-step-circ {
  background: #1d7a4f;
  border-color: #1d7a4f;
  color: #fff;
}

.ck-step-txt {
  font-size: 11px;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.ck-step--active .ck-step-txt { color: #111; }
.ck-step--done .ck-step-txt { color: #555; }

.ck-step-line {
  width: 40px;
  height: 2px;
  background: #eaeaef;
  border-radius: 100px;
}

.ck-step-line--done {
  background: #1d7a4f;
}

@media (max-width: 640px) {
  .ck-step--hide-mob { display: none; }
  .ck-step-line { width: 24px; }
}
</style>
