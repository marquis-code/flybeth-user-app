<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center overflow-hidden z-10">
        <!-- Close Button -->
        <button 
          @click="closeModal"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Logo -->
        <div class="flex justify-start mb-6">
          <img src="@/assets/img/logo.png" class="h-8 w-auto" alt="Flybeth Logo" />
        </div>

        <!-- Avatar -->
        <div class="relative inline-block mb-6 mt-2">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
            alt="Agent" 
            class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto"
          />
          <div class="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        <!-- Text Content -->
        <h2 class="text-xl font-bold text-gray-900 mb-2">
          Better deals are one call away
        </h2>
        <div class="flex items-center justify-center gap-1.5 mb-8 text-sm text-gray-600">
          <span>Say <span class="font-bold text-[#1E40AF]">HELLO50</span> and save</span>
          <InformationCircleIcon class="w-4 h-4 text-gray-400" />
        </div>

        <!-- Phone Button -->
        <a 
          href="tel:+18443592384"
          class="inline-flex items-center justify-center gap-3 w-full py-3 px-6 bg-white border border-[#1E40AF] text-[#1E40AF] rounded-full hover:bg-blue-50 transition-all group"
        >
          <div class="bg-[#1E40AF] rounded-full p-1.5 text-white">
            <PhoneIcon class="w-4 h-4" />
          </div>
          <span class="text-lg font-semibold tracking-wide">+1-844-359-2384</span>
        </a>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PhoneIcon, InformationCircleIcon } from '@heroicons/vue/24/solid'
import { X } from 'lucide-vue-next'

const isOpen = ref(false)

const closeModal = () => {
  isOpen.value = false
}

onMounted(() => {
  // Show after a delay of 5 seconds
  setTimeout(() => {
    isOpen.value = true
  }, 5000)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-leave-active .relative {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
