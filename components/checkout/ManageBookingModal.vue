<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="visible" class="fixed inset-0" style="z-index: 99999999;">
        <!-- Backdrop -->
      <transition name="fade">
        <div 
          v-if="visible"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          @click="$emit('update:visible', false)"
        ></div>
      </transition>

      <!-- Modal Content -->
      <div class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <transition name="modal">
          <div 
            v-if="visible"
            class="relative w-full max-w-[900px] max-h-[90vh] bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-2xl pointer-events-auto"
          >
          
          <!-- Close Button -->
          <button 
            @click="$emit('update:visible', false)" 
            class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 text-gray-800 rounded-full transition-colors backdrop-blur-md"
          >
            <X class="w-5 h-5" />
          </button>

        <!-- Left Side: Form -->
        <div class="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
          <div class="max-w-sm mx-auto w-full">
            <h2 class="text-2xl font-black text-[#1e293b] mb-2 tracking-tight">Manage your booking</h2>
            <p class="text-[13px] text-gray-500 font-medium leading-relaxed mb-8">
              If you have an existing booking with us please enter your booking details below to get tailored advice
            </p>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Booking Reference Input -->
              <div>
                <div class="relative group">
                  <input 
                    v-model="form.pnr" 
                    type="text" 
                    required
                    placeholder="Booking reference" 
                    class="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  />
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-help">
                    <Info class="w-4 h-4" />
                  </div>
                  <!-- Tooltip -->
                  <div class="absolute right-0 bottom-[calc(100%+8px)] w-64 bg-gray-900 text-white text-xs p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl pointer-events-none">
                    You can find your 6-character booking reference (PNR) in the confirmation email sent to you after booking.
                    <div class="absolute -bottom-1.5 right-4 w-3 h-3 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>

              <!-- Email Address Input -->
              <div>
                <input 
                  v-model="form.email" 
                  type="email" 
                  required
                  placeholder="Email address" 
                  class="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>

              <!-- Error Message -->
              <p v-if="error" class="text-xs font-bold text-red-500 mt-2">{{ error }}</p>

              <!-- Submit Button -->
              <div class="pt-4">
                <button 
                  type="submit" 
                  :disabled="loading"
                  class="w-full h-14 bg-[#1A2ED4] hover:bg-[#0D1DAD] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span v-if="!loading">Login</span>
                  <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right Side: Banner -->
        <div class="hidden md:flex w-1/2 relative bg-gradient-to-br from-[#6a719c] to-[#464c76] items-center justify-center p-12 overflow-hidden">
          <!-- Background Image (Beautiful travel destination from Unsplash) -->
          <div class="absolute inset-0 opacity-50 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000" class="w-full h-full object-cover" alt="Travel Destination" />
          </div>
          
          <div class="relative z-10 w-full flex flex-col items-center">
            <p class="text-white/90 text-[11px] uppercase tracking-[0.2em] font-bold text-center mb-6 drop-shadow-md">Benefits of manage my booking</p>
            
            <!-- Carousel Content -->
            <div class="relative w-full h-[140px]">
              <transition-group name="carousel" tag="div">
                <div 
                  v-for="(slide, index) in slides" 
                  :key="slide.title"
                  v-show="currentSlide === index"
                  class="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
                >
                  <h3 class="text-xl font-black text-[#1e293b] mb-2 tracking-tight text-center">{{ slide.title }}</h3>
                  <p class="text-sm text-gray-600 font-medium text-center leading-snug">{{ slide.description }}</p>
                </div>
              </transition-group>
            </div>
            
            <!-- Carousel Dots -->
            <div class="flex justify-center gap-1.5 mt-8">
              <button 
                v-for="(slide, index) in slides" 
                :key="index"
                @click="currentSlide = index"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="currentSlide === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'"
              ></button>
            </div>
          </div>
        </div>
          </div>
        </transition>
      </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { X, Info } from 'lucide-vue-next'
import { bookingsApi } from '@/api_factory/modules/bookings'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success', booking: any): void
}>()

const form = reactive({
  pnr: '',
  email: ''
})

const loading = ref(false)
const error = ref('')

// Carousel Logic
const currentSlide = ref(0)
let carouselInterval: any

const slides = [
  {
    title: 'Your itinerary',
    description: 'Review, download and print your live itinerary at any time.'
  },
  {
    title: 'Instant updates',
    description: 'Get real-time status changes and pricing breakdowns.'
  },
  {
    title: 'Add extras',
    description: 'Easily purchase additional baggage, meals, and upgrades.'
  },
  {
    title: 'Support on the go',
    description: 'Quickly access 24/7 dedicated customer support.'
  }
]

const startCarousel = () => {
  carouselInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 4000)
}

const stopCarousel = () => {
  if (carouselInterval) clearInterval(carouselInterval)
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    startCarousel()
  } else {
    stopCarousel()
    form.pnr = ''
    form.email = ''
    error.value = ''
  }
})

onUnmounted(() => {
  stopCarousel()
})

const handleSubmit = async () => {
  if (!form.pnr || !form.email) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await bookingsApi.manageBooking({
      pnr: form.pnr,
      email: form.email,
      sendEmail: true
    })
    
    // Pass booking to parent so it can open the Drawer
    emit('success', response.data || response)
    emit('update:visible', false)
    
    // Reset form
    form.pnr = ''
    form.email = ''
  } catch (err: any) {
    error.value = err.response?.data?.message || 'We could not find a booking with these details.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.5s ease;
}
.carousel-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
.carousel-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
