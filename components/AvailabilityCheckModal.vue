<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Card -->
        <div class="relative bg-white w-full max-w-[560px] rounded-[32px] shadow-2xl flex flex-col z-10 scale-transition p-10 pb-8">
          
          <!-- Top Content: Text -->
          <div class="text-center mb-8 mt-2">
            <h2 class="text-[26px] font-semibold text-[#1a1a1a] mb-2 font-sans ">
              We're checking availability
            </h2>
            <p class="text-[15px] text-gray-500 font-medium">This might take us a minute</p>
          </div>

          <!-- Bottom Half: Promotional Carousel Card -->
          <div class="relative w-full h-[260px] rounded-[24px] bg-[#9B8DFE] overflow-hidden mb-6 shadow-inner">
            <div 
              class="flex h-full transition-transform duration-700 ease-in-out w-full"
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
              <div 
                v-for="(slide, index) in slides" 
                :key="index"
                class="w-full h-full flex-shrink-0 p-8 flex flex-col justify-between relative"
              >
                <!-- Icon top left -->
                <div class="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center shadow-sm relative z-20">
                  <component :is="slide.icon" class="w-5 h-5 text-[#9B8DFE]" />
                </div>

                <!-- Text bottom left -->
                <div class="relative z-20 w-[60%] mt-auto">
                  <h3 class="font-bold text-white text-[18px] mb-1.5">{{ slide.title }}</h3>
                  <p class="text-white/95 text-[14px] leading-relaxed">{{ slide.description }}</p>
                </div>

                <!-- Right Illustration -->
                <div class="absolute right-0 bottom-0 top-0 w-[55%] flex items-center justify-end overflow-hidden pointer-events-none z-10">
                  <div class="relative w-full h-full flex items-center justify-center">
                    
                    <!-- SVG Illustration for Baggage -->
                    <svg v-if="index === 0" class="absolute inset-0 w-full h-full" viewBox="0 0 200 260" fill="none">
                      <path d="M-40,150 C 10,160 50,210 70,160 C 90,110 30,100 50,160 C 70,220 120,180 130,170" stroke="white" stroke-width="1.5" fill="none" />
                      <path d="M-40,150 L-25,145 L-35,160 Z" stroke="white" stroke-width="1.5" fill="white" stroke-linejoin="round"/>
                      <g transform="translate(90, 40)">
                        <rect x="20" y="30" width="70" height="130" rx="10" stroke="white" stroke-width="2"/>
                        <path d="M40 30 V 15 C 40 10 45 8 55 8 C 65 8 70 10 70 15 V 30" stroke="white" stroke-width="2"/>
                        <path d="M45 15 H 65" stroke="white" stroke-width="2"/>
                        <path d="M30 60 L 45 120 L 55 80 L 65 120 L 80 60" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                        <circle cx="35" cy="165" r="4" stroke="white" stroke-width="2" fill="#9B8DFE"/>
                        <circle cx="75" cy="165" r="4" stroke="white" stroke-width="2" fill="#9B8DFE"/>
                      </g>
                    </svg>

                    <!-- SVG Illustration for Expert Support -->
                    <svg v-if="index === 1" class="absolute inset-0 w-full h-full" viewBox="0 0 200 260" fill="none">
                      <path d="M 20 200 Q 80 150 140 220" stroke="white" stroke-width="1.5" stroke-dasharray="4 4" class="opacity-40" fill="none"/>
                      <g transform="translate(60, 50)">
                        <path d="M 20 60 C 20 10, 80 10, 80 60" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                        <rect x="15" y="60" width="10" height="25" rx="5" fill="#9B8DFE" stroke="white" stroke-width="2"/>
                        <rect x="75" y="60" width="10" height="25" rx="5" fill="#9B8DFE" stroke="white" stroke-width="2"/>
                        <path d="M 20 75 Q 40 95 50 85" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
                        <path d="M 70 20 Q 90 0 110 20 Q 130 40 110 60 Q 90 80 70 60 Z" stroke="white" stroke-width="1.5" fill="none" class="opacity-70"/>
                        <circle cx="90" cy="40" r="3" fill="white"/>
                        <circle cx="100" cy="40" r="3" fill="white"/>
                      </g>
                    </svg>

                    <!-- SVG Illustration for Secure Booking -->
                    <svg v-if="index === 2" class="absolute inset-0 w-full h-full" viewBox="0 0 200 260" fill="none">
                      <path d="M 120 200 C 80 220, 40 200, 20 160" stroke="white" stroke-width="1.5" fill="none" class="opacity-50"/>
                      <g transform="translate(60, 30)">
                        <rect x="10" y="40" width="80" height="50" rx="6" stroke="white" stroke-width="2" fill="#9B8DFE" transform="rotate(-15)"/>
                        <line x1="8" y1="58" x2="84" y2="58" stroke="white" stroke-width="6" transform="rotate(-15)"/>
                        <path d="M 60 80 L 60 110 C 60 130, 80 145, 95 155 C 110 145, 130 130, 130 110 L 130 80 L 95 65 Z" fill="#9B8DFE" stroke="white" stroke-width="2"/>
                        <path d="M 85 110 L 92 117 L 105 100" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                      </g>
                    </svg>

                    <!-- SVG Illustration for Price Match Promise -->
                    <svg v-if="index === 3" class="absolute inset-0 w-full h-full" viewBox="0 0 200 260" fill="none">
                      <circle cx="130" cy="120" r="60" stroke="white" stroke-width="1.5" stroke-dasharray="2 4" class="opacity-40" fill="none"/>
                      <g transform="translate(70, 40)">
                        <path d="M 20 60 L 50 15 L 90 15 L 90 55 L 60 100 Z" stroke="white" stroke-width="2" fill="#9B8DFE"/>
                        <circle cx="75" cy="30" r="4" stroke="white" stroke-width="2" fill="#9B8DFE"/>
                        <path d="M 75 26 Q 80 10 100 0" stroke="white" stroke-width="1.5" fill="none"/>
                        <path d="M 10 30 L 15 40 L 25 45 L 15 50 L 10 60 L 5 50 L -5 45 L 5 40 Z" fill="white" class="opacity-80"/>
                        <path d="M 95 80 L 98 86 L 104 89 L 98 92 L 95 98 L 92 92 L 86 89 L 92 86 Z" fill="white" class="opacity-60"/>
                      </g>
                    </svg>

                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Dots -->
          <div class="flex justify-center gap-2 relative z-20">
            <button 
              v-for="(_, index) in slides" 
              :key="index"
              @click="goToSlide(index)"
              class="w-[6px] h-[6px] rounded-full transition-all duration-300"
              :class="index === currentIndex ? 'bg-gray-800 scale-125' : 'bg-gray-300 hover:bg-gray-400'"
              :aria-label="`Go to slide ${index + 1}`"
            ></button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ShieldCheck, Headset, HeartHandshake } from 'lucide-vue-next'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const slides = [
  {
    icon: ShieldCheck,
    title: 'Baggage protection',
    description: 'Receive compensation for any lost baggage'
  },
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

const startCarousel = () => {
  stopCarousel()
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.length
  }, 4000)
}

const stopCarousel = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  startCarousel() // reset timer so it doesn't instantly flip again
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    currentIndex.value = 0
    startCarousel()
  } else {
    stopCarousel()
  }
}, { immediate: true })

onMounted(() => {
  if (props.visible) startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .scale-transition {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-fade-leave-active .scale-transition {
  transition: transform 0.2s ease-in;
}
.modal-fade-enter-from .scale-transition {
  transform: scale(0.92);
}
.modal-fade-leave-to .scale-transition {
  transform: scale(0.96);
}
</style>
