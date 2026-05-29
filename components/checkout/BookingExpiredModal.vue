<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col p-8 text-center relative animate-in zoom-in-95 duration-200">
      
      <!-- Icon Container -->
      <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
        <Clock class="w-8 h-8 text-red-500" />
      </div>

      <!-- Content -->
      <h3 class="text-xl font-bold text-gray-900 mb-2">Booking expired</h3>
      <p class="text-gray-500 text-sm mb-8 leading-relaxed">
        This booking has expired. Please start a new search to continue.
      </p>

      <!-- Action -->
      <button 
        @click="handleRestart" 
        class="w-full bg-[#0D1DAD] hover:bg-[#0a1682] text-white font-medium py-3.5 px-6 rounded-xl transition-all active:scale-[0.98]"
      >
        Start again
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { useRouter } from '#app'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const router = useRouter()

const handleRestart = () => {
  router.push('/flights')
}
</script>
