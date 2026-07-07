<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
    
    <!-- Modal Content -->
    <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Top Accent Banner -->
      <div class="h-2 w-full bg-[#0D1DAD]"></div>

        <div v-if="!isSuccess" class="p-8 text-center">
        <!-- Logo / Icon -->
        <div class="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0D1DAD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7V4h16v3" />
            <path d="M9 20h6" />
            <path d="M12 14v6" />
            <path d="M4 11l8-4 8 4-8-4z" />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-2 font-[Onest]">Get the Cheapest Flights</h2>
        <p class="text-gray-500 mb-6 text-sm leading-relaxed">
          Join thousands of travelers getting insider access. Subscribe now and get our top flight deals delivered straight to your inbox daily!
        </p>

        <form @submit.prevent="handleSubscribe" class="space-y-4">
          <div class="relative">
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="Your best email" 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D1DAD] focus:border-transparent transition-all outline-none"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-[#0D1DAD] hover:bg-[#0a15a0] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center disabled:opacity-70"
          >
            <span v-if="isLoading" class="mr-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span>{{ isLoading ? 'Subscribing...' : 'Subscribe and Get Deals' }}</span>
          </button>
          
          <div v-if="errorMsg" class="text-red-500 text-sm font-medium mt-2">{{ errorMsg }}</div>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-100">
          <p class="text-xs text-gray-400 flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            100% Secure. Unsubscribe anytime.
          </p>
          <div class="mt-4 flex items-center justify-center text-sm font-semibold text-gray-700 bg-gray-50 py-2 rounded-lg">
            <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D1DAD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Call Toll-Free: 1-800-FLYBETH
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div v-else class="p-10 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
        <div class="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-500">
          <svg class="text-green-500 w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-900 mb-2 font-[Onest]">Woohoo! 🎉</h2>
        <p class="text-gray-500 text-sm leading-relaxed mb-6">
          Congratulations! You're officially on the list. We'll be sending you the best flight deals and updates regularly so you never miss out.
        </p>

        <button 
          @click="closeModal" 
          class="w-full py-3 px-4 bg-[#0D1DAD] hover:bg-[#0a15a0] text-white font-semibold rounded-xl shadow-md transition-all mt-4"
        >
          Awesome, Thanks!
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const email = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMsg = ref('')

const config = useRuntimeConfig()

onMounted(() => {
  // Check if user has already seen or subscribed
  const hasSeen = localStorage.getItem('flybeth_newsletter_seen')
  const hasSubscribed = localStorage.getItem('flybeth_newsletter_subscribed')
  
  if (!hasSubscribed && !hasSeen) {
    // Show after 10 seconds
    setTimeout(() => {
      isVisible.value = true
    }, 10000)
  }
})

const closeModal = () => {
  isVisible.value = false
  localStorage.setItem('flybeth_newsletter_seen', 'true')
}

const handleSubscribe = async () => {
  if (!email.value) return
  
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const res = await $fetch(`${config.public.apiBase}/marketing/subscribe`, {
      method: 'POST',
      body: { email: email.value, source: 'popup' }
    })
    
    isSuccess.value = true
    localStorage.setItem('flybeth_newsletter_subscribed', 'true')
    
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoom-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
.animate-in.fade-in { animation: fade-in 0.3s ease-out; }
.animate-in.zoom-in { animation: zoom-in 0.3s ease-out forwards; }
</style>
