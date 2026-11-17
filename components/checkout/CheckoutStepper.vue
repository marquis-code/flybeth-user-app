<template>
  <div class="ck-stepper-container">
    <!-- Desktop & Tablet Stepper -->
    <div class="hidden sm:flex items-center justify-center gap-2 lg:gap-3">
      <template v-for="(step, idx) in steps" :key="idx">
        <div 
          class="flex items-center gap-2 cursor-default transition-all duration-200"
          :class="{
            'opacity-100': idx <= currentStep,
            'opacity-40': idx > currentStep
          }"
        >
          <!-- Step indicator badge -->
          <div 
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300"
            :class="[
              idx === currentStep 
                ? 'bg-[#0D1DAD] text-white shadow-md shadow-[#0D1DAD]/30 scale-105' 
                : (idx < currentStep 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-500 border border-gray-200')
            ]"
          >
            <svg v-if="idx < currentStep" class="w-3.5 h-3.5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ idx + 1 }}</span>
          </div>

          <!-- Step label -->
          <span 
            class="text-[12px] tracking-wide transition-colors whitespace-nowrap"
            :class="[
              idx === currentStep 
                ? 'font-black text-[#0D1DAD]' 
                : (idx < currentStep ? 'font-bold text-gray-800' : 'font-medium text-gray-400')
            ]"
          >
            {{ step }}
          </span>
        </div>

        <!-- Connecting Line -->
        <div 
          v-if="idx < steps.length - 1" 
          class="w-8 lg:w-12 h-[2px] rounded-full transition-all duration-300"
          :class="idx < currentStep ? 'bg-emerald-600' : 'bg-gray-200'"
        ></div>
      </template>
    </div>

    <!-- Mobile Stepper: Compact & Elegant -->
    <div class="sm:hidden flex items-center justify-between w-full bg-blue-50/70 border border-blue-100/80 rounded-xl px-3 py-1.5">
      <div class="flex items-center gap-2">
        <span class="flex items-center justify-center w-5 h-5 rounded-full bg-[#0D1DAD] text-white text-[10px] font-black">
          {{ currentStep + 1 }}
        </span>
        <span class="text-xs font-bold text-gray-900">
          {{ steps[currentStep] || 'Step' }}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <div 
          v-for="(s, idx) in steps" 
          :key="idx" 
          class="h-1.5 rounded-full transition-all duration-300"
          :class="[
            idx === currentStep 
              ? 'w-5 bg-[#0D1DAD]' 
              : (idx < currentStep ? 'w-2 bg-emerald-500' : 'w-2 bg-gray-200')
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentStep: { type: Number, default: 0 },
  steps: {
    type: Array as () => string[],
    default: () => ['Details', 'Customise', 'Protect', 'Summary']
  }
})
</script>

<style scoped>
.ck-stepper-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
