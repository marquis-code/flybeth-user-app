<template>
  <SideDrawer :visible="visible" title="Checking Availability" @close="() => {}">
    <div class="flex flex-col h-full bg-white">
      <!-- Top Half: Loading State -->
      <div class="p-8 pb-6 flex flex-col items-center text-center mt-10">
        <!-- Circular Spinner -->
        <div class="relative w-24 h-24 mb-6">
          <svg class="w-full h-full animate-spin text-[#0D1DAD]" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="8" stroke-dasharray="80 200" stroke-linecap="round" class="opacity-20"></circle>
            <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="8" stroke-dasharray="80 200" stroke-linecap="round" class="animate-[spin_1.5s_ease-in-out_infinite]"></circle>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <Plane class="w-8 h-8 text-[#0D1DAD] transform -rotate-45" />
          </div>
        </div>
        
        <h2 class="text-2xl font-bold text-black mb-2 leading-tight">We're checking<br/>availability</h2>
        <p class="text-gray-500 font-medium">This might take us a minute</p>
      </div>

      <!-- Bottom Half: Promotional Carousel -->
      <div class="mt-auto bg-[#002a66] p-8 text-white relative">
        <div class="absolute inset-0 bg-gradient-to-br from-[#003580] to-[#001f4d] opacity-50"></div>
        
        <div class="relative z-10 min-h-[120px] flex flex-col items-center justify-center text-center">
          <transition name="slide-fade" mode="out-in">
            <div :key="currentIndex" class="w-full">
              <component :is="currentSlide.icon" class="w-8 h-8 text-[#F48221] mx-auto mb-4" />
              <h3 class="font-bold text-lg mb-2">{{ currentSlide.title }}</h3>
              <p class="text-white/80 text-sm leading-relaxed">{{ currentSlide.description }}</p>
            </div>
          </transition>
        </div>
        
        <!-- Dots -->
        <div class="relative z-10 flex justify-center gap-2 mt-6">
          <div 
            v-for="(_, index) in slides" 
            :key="index"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="index === currentIndex ? 'bg-[#F48221] w-6' : 'bg-white/30'"
          ></div>
        </div>
      </div>
    </div>
  </SideDrawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Plane, Headset, ShieldCheck, HeartHandshake } from 'lucide-vue-next'
import SideDrawer from '@/components/ui/SideDrawer.vue'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const slides = [
  {
    icon: Headset,
    title: '24/7 Expert Support',
    description: 'Our travel advisors are always here to help if your plans change or you need assistance.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Booking',
    description: 'Your payment and personal information are protected by industry-leading encryption.'
  },
  {
    icon: HeartHandshake,
    title: 'Price Match Promise',
    description: 'We monitor prices constantly to ensure you get the most competitive rates available.'
  }
]

const currentIndex = ref(0)
let timer: any = null

const currentSlide = computed(() => slides[currentIndex.value])

const startCarousel = () => {
  stopCarousel()
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.length
  }, 4000)
}

const stopCarousel = () => {
  if (timer) clearInterval(timer)
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    currentIndex.value = 0
    startCarousel()
  } else {
    stopCarousel()
  }
})

onMounted(() => {
  if (props.visible) startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
