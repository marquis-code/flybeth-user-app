<template>
  <div v-if="show" class="fixed inset-0 z-[999999] bg-white animate-in fade-in duration-300 overflow-hidden flex items-center justify-center p-4">
    <!-- Close Button -->
    <button @click="$emit('close')" class="fixed top-6 right-6 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-2xl z-[1000000] hover:scale-110 active:scale-95 transition-all">
      <X class="w-5 h-5" />
    </button>

    <div class="w-full max-w-2xl bg-white flex flex-col items-center">
      <!-- Brand / Logo Icon -->
      <div class="w-20 h-20 rounded-[2rem] bg-gray-900 flex items-center justify-center shadow-2xl mb-8 rotate-2 group hover:rotate-0 transition-transform duration-500">
        <Wallet class="w-8 h-8 text-white" />
      </div>

      <div class="space-y-2 mb-6 text-center">
        <h3 class="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter leading-tight">
          Unlock <span class="text-blue-600">Flybeth</span> <br class="sm:hidden" /> Wallet Benefits
        </h3>
        <p class="text-gray-400 font-bold text-[9px] tracking-[0.2em] uppercase">
          The smartest way to pay for your travels
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div class="p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex flex-col items-center gap-2 text-center">
          <Sparkles class="w-5 h-5 text-blue-600" />
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest mb-1">Exclusive Cashbacks</p>
            <p class="text-[9px] opacity-60 font-bold">Earn up to 5% back</p>
          </div>
        </div>
        
        <div class="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 flex flex-col items-center gap-2 text-center">
          <Zap class="w-5 h-5 text-emerald-600" />
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest mb-1">Instant Ticketing</p>
            <p class="text-[9px] opacity-60 font-bold">Fast-track payments</p>
          </div>
        </div>
      </div>

      <div class="w-full space-y-4 text-center">
        <button 
          @click="$emit('close')"
          class="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-black transition-all"
        >
          I'm Ready to Save
        </button>
        <p class="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">Secure & Encrypted Payments</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wallet, X, Check, Sparkles, Zap } from 'lucide-vue-next'

defineProps({
  show: Boolean
})

defineEmits(['close'])
</script>
