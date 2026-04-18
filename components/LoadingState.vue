<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center select-none bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 animate-pulse">
    <!-- Sophisticated Loading Animation -->
    <div class="relative mb-10">
      <div class="w-16 h-16 rounded-full border-4 border-gray-100 border-t-brand-blue animate-spin relative z-10"></div>
      <div class="absolute -inset-8 bg-brand-blue/5 rounded-full blur-2xl animate-pulse"></div>
    </div>

    <!-- Text Content -->
    <div class="space-y-3">
      <h3 class="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] animate-pulse">
        Optimizing Flight Routes
      </h3>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
        Our travel intelligence is curating the best fares globally...
      </p>
    </div>

    <!-- Progress indicator -->
    <div class="mt-10 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
      <div class="h-full bg-gray-900 animate-progress"></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
.animate-progress {
  animation: progress 2s infinite linear;
}
</style>
