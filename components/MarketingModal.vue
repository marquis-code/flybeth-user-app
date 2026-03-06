<template>
  <Transition name="fade-scale">
    <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-[480px] overflow-hidden relative animate-float">
        <!-- Close Button -->
        <button 
          @click="$emit('close')" 
          class="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <XMarkIcon class="h-6 w-6 text-gray-400" />
        </button>

        <div class="p-10 pt-16 text-center">
          <!-- Agent Avatar -->
          <div class="relative inline-block mb-8">
            <div class="h-24 w-24 rounded-full border-4 border-brand-green/20 p-1 relative z-10 overflow-hidden bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200" 
                alt="Agent" 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="absolute -bottom-1 -right-1 h-6 w-6 bg-brand-green border-4 border-white rounded-full z-20"></div>
          </div>

          <!-- Header -->
          <h3 class="text-2xl font-black text-brand-blue mb-2 leading-tight">{{ $t('marketing.helpTitle') }}</h3>
          <p class="text-brand-gray/60 font-bold mb-8 italic">{{ $t('marketing.helpSub') }}</p>

          <!-- Divider -->
          <div class="h-px bg-gray-100 w-full mb-8"></div>

          <!-- Benefits List -->
          <div class="space-y-4 mb-10 text-left px-4">
            <div v-for="(benefit, idx) in benefits" :key="idx" class="flex items-center gap-4 group">
              <div class="h-6 w-6 rounded-full bg-brand-green/10 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all">
                <CheckIcon class="h-4 w-4 text-brand-green group-hover:text-white" />
              </div>
              <span class="text-sm font-bold text-brand-blue/80">{{ benefit }}</span>
            </div>
          </div>

          <!-- Call Button -->
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-brand-green to-brand-green/50 blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
            <a 
              href="tel:1-845-848-0154" 
              class="relative w-full flex items-center justify-between bg-white border-2 border-brand-green rounded-full px-4 py-3 group-hover:bg-brand-green transition-all duration-300"
            >
              <div class="h-12 w-12 rounded-full bg-brand-green flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform shadow-lg">
                <PhoneIcon class="h-6 w-6" />
              </div>
              <span class="text-[20px] font-black text-brand-green group-hover:text-white transition-colors mr-10 tabular-nums">
                1-845-848-0154
              </span>
            </a>
          </div>

          <p class="mt-6 text-[10px] text-brand-gray/30 font-black uppercase tracking-widest">Speak with our expert travel advisors</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { XMarkIcon, CheckIcon, PhoneIcon } from '@heroicons/vue/24/solid'

defineProps({
  show: Boolean
})

defineEmits(['close'])

const { t } = useI18n() as any

const benefits = computed(() => [
  t('marketing.benefits.deals'),
  t('marketing.benefits.assist'),
  t('marketing.benefits.cancel'),
  t('marketing.benefits.rewards')
])
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
