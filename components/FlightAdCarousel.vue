<template>
  <div class="bg-gradient-to-r from-[#002a66] to-[#003580] rounded-2xl  p-6 mb-4 relative overflow-hidden flex items-center shadow-sm border border-[#0046a8]">
    <!-- Decorative background elements -->
    <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
    <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-[#F48221]/10 rounded-full blur-xl"></div>
    
    <div class="flex items-center gap-5 relative px-6 z-10 w-full">
      <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
        <component :is="currentAd.icon" class="w-6 h-6 text-[#F48221]" />
      </div>
      
      <div class="flex-grow">
        <transition name="fade" mode="out-in">
          <div :key="currentIndex">
            <h4 class="text-white font-bold text-lg leading-tight">{{ currentAd.title }}</h4>
            <p class="text-white/80 text-sm mt-1">{{ currentAd.description }}</p>
          </div>
        </transition>
      </div>
      
      <button class="bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-bold py-2 px-4 rounded-lg backdrop-blur-sm border border-white/20 flex-shrink-0 whitespace-nowrap">
        {{ currentAd.cta }}
      </button>
    </div>
    
    <!-- Progress bar indicator -->
    <div class="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
      <div 
        class="h-full bg-[#F48221] transition-all duration-[5000ms] ease-linear"
        :style="{ width: progress + '%' }"
        @transitionend="handleTransitionEnd"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ShieldCheck, Luggage, Clock, CheckCircle } from 'lucide-vue-next'
import { useSettings } from '@/composables/useSettings'

const { formatPrice } = useSettings()

const ads = [
  {
    icon: ShieldCheck,
    title: 'Cancellation Protection Available',
    description: 'Add peace of mind to your booking. Get a full refund if you need to cancel.',
    cta: 'Learn more'
  },
  {
    icon: Luggage,
    title: 'Extra Baggage Allowance',
    description: 'Save up to 30% by adding extra bags now rather than at the airport.',
    cta: 'Add bags'
  },
  {
    icon: Clock,
    title: 'Price Drop Guarantee',
    description: `Book now. If the price drops before you fly, we'll refund the difference up to ${formatPrice(100)}.`,
    cta: 'Get protected'
  }
]

const currentIndex = ref(0)
const progress = ref(0)
let intervalId: any = null
let timeoutId: any = null

const currentAd = computed(() => ads[currentIndex.value])

const startTimer = () => {
  progress.value = 0
  // Small delay to ensure CSS transition restarts from 0
  setTimeout(() => {
    progress.value = 100
  }, 50)
  
  timeoutId = setTimeout(() => {
    nextAd()
  }, 5000)
}

const nextAd = () => {
  currentIndex.value = (currentIndex.value + 1) % ads.length
  startTimer()
}

const handleTransitionEnd = () => {
  // Controlled via timeout instead
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearTimeout(timeoutId)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
