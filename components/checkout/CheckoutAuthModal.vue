<template>
  <SideDrawer :visible="true" title="Secure Booking" @close="$emit('guest')">
    <div class="flex flex-col h-full bg-white relative">
      <!-- Decorative Orbs -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div class="relative p-8 sm:p-10 flex flex-col h-full">
        <!-- Icon -->
        <div class="w-16 h-16 rounded-2xl bg-[#0D1DAD]/10 flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
          <Ticket class="w-8 h-8 text-[#0D1DAD]" />
        </div>

        <h2 class="text-2xl sm:text-3xl font-black text-neutral-900 mb-4 leading-tight">
          How would you like to <br/>
          <span class="text-primary">secure your booking?</span>
        </h2>
        
        <p class="text-neutral-500 font-medium text-sm mb-10">
          Sign in to track your trips and earn rewards, or proceed as a guest to finish quickly.
        </p>

        <div class="flex flex-col gap-4 mt-auto">
          <!-- Premium Login Button -->
          <button 
            @click="$emit('login')"
            class="group relative w-full py-4 bg-[#0D1DAD] rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0D1DAD]/20"
          >
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <User class="w-5 h-5 text-white" />
            <span class="text-white text-sm font-bold">Sign in to your account</span>
          </button>

          <!-- Glassmorphism Guest Button -->
          <button 
            @click="$emit('guest')"
            class="group w-full py-4 bg-neutral-100 border-2 border-neutral-100 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-neutral-200 hover:border-neutral-200"
          >
            <Zap class="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
            <span class="text-neutral-600 font-bold text-sm">Continue as guest</span>
          </button>
        </div>

        <!-- Trust Badges -->
        <div class="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-neutral-100">
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
  </SideDrawer>
</template>

<script setup lang="ts">
import { Ticket, User, Zap, Lock, ShieldCheck } from 'lucide-vue-next'
import SideDrawer from '@/components/ui/SideDrawer.vue'

defineEmits(['guest', 'login'])
</script>

<style scoped>
</style>
