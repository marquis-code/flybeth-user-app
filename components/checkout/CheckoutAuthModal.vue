<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
    <!-- Backdrop with dynamic blur -->
    <div class="absolute inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity duration-700 animate-in fade-in"></div>

    <!-- Modal Content -->
    <div class="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500">
      
      <!-- Decorative Orbs -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div class="relative p-8 sm:p-12 text-center">
        <!-- Icon -->
        <div class="mx-auto w-20 h-20 rounded-3xl bg-[#0D1DAD]/10 flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
          <Ticket class="w-10 h-10 text-[#0D1DAD]" />
        </div>

        <h2 class="text-3xl font-black text-neutral-900 mb-4  leading-tight">
          How would you like to <br/>
          <span class="text-primary">secure your booking?</span>
        </h2>
        
        <p class="text-neutral-500 font-medium text-sm mb-10 px-4">
          Sign in to track your trips and earn rewards, or proceed as a guest to finish quickly.
        </p>

        <div class="flex flex-col gap-4">
          <!-- Premium Login Button -->
          <button 
            @click="$emit('login')"
            class="group relative w-full py-3.5 bg-[#0D1DAD] rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0D1DAD]/20"
          >
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <User class="w-5 h-5 text-white" />
            <span class="text-white  text-sm ">Sign in to your account</span>
          </button>

          <!-- Glassmorphism Guest Button -->
          <button 
            @click="$emit('guest')"
            class="group w-full py-3.5 bg-neutral-200 border-2 border-neutral-200 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-neutral-100 hover:border-neutral-200"
          >
            <Zap class="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
            <span class="text-neutral-600 font-bold text-sm ">Continue as guest</span>
          </button>
        </div>

        <!-- Trust Badges -->
        <div class="mt-10 flex items-center justify-center gap-6 pt-8 border-t border-neutral-100">
          <div class="flex flex-col items-center gap-1.5">
            <Lock class="w-4 h-4 text-neutral-300" />
            <span class="text-[9px] font-black text-neutral-300">Secure SSL</span>
          </div>
          <div class="w-px h-6 bg-neutral-100"></div>
          <div class="flex flex-col items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-neutral-300" />
            <span class="text-[9px] font-black text-neutral-300">Identity Protected</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ticket, User, Zap, Lock, ShieldCheck } from 'lucide-vue-next'

defineEmits(['guest', 'login'])
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes animate-in {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-in {
  animation: fade-in 0.7s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
