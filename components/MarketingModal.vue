<template>
  <Transition name="modal-scale">
    <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="$emit('close')">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      <!-- Modal Card -->
      <div class="relative w-full max-w-[820px] rounded-[2rem] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,53,128,0.4)] animate-modal-enter">
        
        <!-- Close Button -->
        <button 
          @click="$emit('close')" 
          class="absolute top-5 right-5 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 group"
        >
          <XMarkIcon class="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div class="flex flex-col md:flex-row min-h-[420px]">
          
          <!-- Left Gradient Panel -->
          <div class="relative md:w-[45%] bg-gradient-to-br from-[#003580] via-[#0046a8] to-[#002a66] p-8 md:p-10 flex flex-col justify-between overflow-hidden">
            <!-- Animated decorative elements -->
            <div class="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-pulse-slow"></div>
            <div class="absolute -bottom-16 -left-16 w-48 h-48 bg-[#F48221]/10 rounded-full blur-2xl animate-pulse-slow delay-1000"></div>
            
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer"></div>

            <div class="relative z-10">
              <!-- Badge -->
              <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-6 border border-white/10">
                <div class="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse"></div>
                <span class="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em]">Live Support</span>
              </div>

              <h3 class="text-2xl md:text-[28px] font-bold text-white leading-[1.2] mb-4 tracking-tight">
                Need help<br/>finding the<br/>
                <span class="text-[#F48221]">perfect deal?</span>
              </h3>
              <p class="text-sm text-white/60 leading-relaxed max-w-[260px]">
                Our expert travel advisors are standing by 24/7 to help you save more on your next trip.
              </p>
            </div>

            <!-- Trust indicators -->
            <div class="relative z-10 flex items-center gap-4 mt-8">
              <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i" class="h-8 w-8 rounded-full border-2 border-[#003580] overflow-hidden bg-white/20">
                  <img :src="`https://i.pravatar.cc/80?img=${i + 20}`" class="w-full h-full object-cover" :alt="`Agent ${i}`" />
                </div>
              </div>
              <div>
                <p class="text-[10px] font-bold text-white/80 uppercase tracking-wider">Trusted by</p>
                <p class="text-xs font-bold text-white">40,000+ travelers</p>
              </div>
            </div>
          </div>

          <!-- Right Content Panel -->
          <div class="md:w-[55%] bg-white p-8 md:p-10 flex flex-col justify-between">
            
            <!-- Benefits List -->
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Why call us?</p>
              <div class="space-y-4">
                <div 
                  v-for="(benefit, idx) in benefits" 
                  :key="idx" 
                  class="flex items-start gap-3.5 group benefit-item"
                  :style="{ animationDelay: `${300 + idx * 120}ms` }"
                >
                  <div class="h-9 w-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-500"
                    :class="benefit.color">
                    <component :is="benefit.icon" class="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900 leading-snug">{{ benefit.title }}</p>
                    <p class="text-[11px] text-gray-400 mt-0.5">{{ benefit.subtitle }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Section -->
            <div class="mt-8 space-y-3">
              <!-- Call Button -->
              <a 
                href="tel:1-845-848-0154" 
                class="w-full flex items-center justify-between bg-gradient-to-r from-[#003580] to-[#0046a8] rounded-2xl px-5 py-4 group hover:shadow-xl hover:shadow-brand-blue/20 transition-all duration-500 active:scale-[0.98]"
              >
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 group-hover:scale-110 transition-all duration-500">
                    <PhoneIcon class="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p class="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em] mb-0.5">Call us now</p>
                    <p class="text-lg font-bold text-white tabular-nums tracking-wide">1-845-848-0154</p>
                  </div>
                </div>
                <div class="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </div>
              </a>

              <!-- Secondary Chat CTA -->
              <button 
                @click="$emit('close')"
                class="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-2xl px-5 py-3.5 transition-all duration-300 group"
              >
                <ChatBubbleLeftEllipsisIcon class="h-4 w-4 text-gray-400 group-hover:text-[#003580] transition-colors" />
                <span class="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Or chat with us online</span>
              </button>

              <p class="text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.15em] pt-1">
                Available 24/7 · No booking fees · Price match guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { XMarkIcon, PhoneIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/solid'
import { 
  TicketIcon, 
  UserGroupIcon, 
  ArrowPathIcon, 
  SparklesIcon 
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

defineProps({
  show: Boolean
})

defineEmits(['close'])

const benefits = computed(() => [
  { 
    title: 'Phone-only exclusive deals', 
    subtitle: 'Access rates not available online',
    icon: TicketIcon,
    color: 'bg-blue-50 text-[#003580]'
  },
  { 
    title: 'Personalized travel planning', 
    subtitle: 'Expert advisors tailor your perfect trip',
    icon: UserGroupIcon,
    color: 'bg-emerald-50 text-emerald-600'
  },
  { 
    title: '24-hour free cancellation', 
    subtitle: 'Flexible booking with full refund',
    icon: ArrowPathIcon,
    color: 'bg-amber-50 text-amber-600'
  },
  { 
    title: '2× Flybeth reward points', 
    subtitle: 'Double miles on phone bookings',
    icon: SparklesIcon,
    color: 'bg-purple-50 text-purple-600'
  }
])
</script>

<style scoped>
.modal-scale-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-scale-leave-active {
  transition: all 0.35s cubic-bezier(0.55, 0, 1, 0.45);
}
.modal-scale-enter-from {
  opacity: 0;
}
.modal-scale-leave-to {
  opacity: 0;
}

.animate-modal-enter {
  animation: modal-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modal-enter {
  0% { 
    opacity: 0; 
    transform: scale(0.92) translateY(30px); 
  }
  100% { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.animate-shimmer {
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

.benefit-item {
  animation: benefit-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes benefit-enter {
  0% { 
    opacity: 0; 
    transform: translateX(-12px); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
