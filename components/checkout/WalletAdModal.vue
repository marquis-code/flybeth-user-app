<template>
  <SideDrawer :visible="show" title="Flybeth Wallet" @close="$emit('close')">
    <div class="flex flex-col h-full bg-white relative">
      <div class="w-full flex flex-col items-center p-6 h-full justify-center">
        <!-- Brand / Logo Icon -->
        <div class="w-20 h-20 rounded-[2rem] bg-black flex items-center justify-center shadow-2xl mb-8 rotate-2 group hover:rotate-0 transition-transform duration-500">
          <Wallet class="w-8 h-8 text-white" />
        </div>

        <div class="space-y-2 mb-6 text-center">
          <h3 class="text-2xl sm:text-3xl font-black text-black er leading-tight">
            Unlock <span class="text-blue-600">Flybeth</span> <br class="sm:hidden" /> Wallet Benefits
          </h3>
          <p class="text-black font-bold text-[9px] uppercase">
            The smartest way to pay for your travels
          </p>
        </div>

        <!-- Benefits Grid -->
        <div class="w-full grid grid-cols-1 gap-3 mb-8">
          <div class="p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex flex-col items-center gap-2 text-center">
            <Sparkles class="w-5 h-5 text-blue-600" />
            <div>
              <p class="text-sm font-black uppercase mb-1">Exclusive Cashbacks</p>
              <p class="text-[9px] opacity-60 font-bold">Earn up to 5% back</p>
            </div>
          </div>
          
          <div class="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 flex flex-col items-center gap-2 text-center">
            <Zap class="w-5 h-5 text-emerald-600" />
            <div>
              <p class="text-sm font-black uppercase mb-1">Instant Ticketing</p>
              <p class="text-[9px] opacity-60 font-bold">Fast-track payments</p>
            </div>
          </div>
        </div>

        <div class="w-full space-y-4 text-center mt-auto">
          <button 
            @click="$emit('close')"
            class="w-full h-14 bg-black text-white rounded-2xl font-black text-sm uppercase hover:bg-gray-900 transition-all"
          >
            I'm Ready to Save
          </button>
          <p class="text-[8px] font-black text-black uppercase">Secure & Encrypted Payments</p>
        </div>
      </div>
    </div>
  </SideDrawer>
</template>

<script setup lang="ts">
import { Wallet, X, Check, Sparkles, Zap } from 'lucide-vue-next'
import SideDrawer from '@/components/ui/SideDrawer.vue'

defineProps({
  show: Boolean
})

defineEmits(['close'])
</script>
