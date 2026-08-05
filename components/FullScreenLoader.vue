<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
    <div class="flex flex-col items-center justify-center p-8 bg-white shadow-2xl rounded-3xl max-w-sm w-full mx-4 text-center transform scale-100 animate-fade-in-up">
      <!-- Animated Icon (Lottie or CSS) -->
      <div class="relative w-24 h-24 mb-6">
        <div class="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        <div class="absolute inset-0 rounded-full border-4 border-[#0D1DAD] border-t-transparent animate-spin"></div>
        <!-- You can place an icon in the center if needed -->
        <div class="absolute inset-0 flex items-center justify-center text-[#0D1DAD]">
          <svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </div>
      </div>
      
      <h3 class="text-xl font-bold text-gray-900 mb-2 font-display">Hold on tight! 🚀</h3>
      <p class="text-sm text-gray-500 font-sans leading-relaxed">
        We're fetching the very best <span class="font-bold text-[#0D1DAD]">{{ moduleName }}</span> just for you. This will only take a moment...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  moduleName: {
    type: String,
    default: 'deals' // Flights, Hotels, Transfers, Activities, Car rentals, Packages, Cruises
  }
})
</script>

<style scoped>
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}
</style>
