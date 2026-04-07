<template>
  <div class="relative w-full lg:w-56" ref="pickerRef">
    <!-- Trigger -->
    <div 
      @click="isOpen = !isOpen"
      class="flex-1 min-w-[200px] bg-white rounded-r-[1.75rem] px-8 py-4 group hover:bg-gray-50 transition-all cursor-pointer"
    >
      <p class="text-[10px] text-gray-500 font-bold tracking-wide mb-2 opacity-50 group-hover:opacity-100 transition-opacity">Travelers</p>
      <div class="flex items-center text-sm font-black text-gray-900 leading-none truncate">
        {{ rooms }} Room, {{ adults + children }} Travelers
      </div>
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen" class="absolute top-full right-0 mt-4 z-[200] bg-white rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.15)] border border-gray-100 w-[92vw] sm:w-[320px] p-8">
        <!-- Mobile Close Button -->
        <button @click="isOpen = false" class="md:hidden absolute top-4 right-4 h-9 w-9 flex items-center justify-center text-gray-400 bg-gray-50 rounded-full hover:text-gray-900 transition-colors">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="space-y-8">
          <!-- Rooms -->
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[11px] font-black text-gray-900 tracking-wide">Rooms</div>
              <div class="text-[10px] text-gray-400 font-bold tracking-wide mt-1">Total rooms</div>
            </div>
            <div class="flex items-center gap-3">
              <button @click="rooms > 1 && rooms--" class="h-9 w-9 rounded-xl border-2 border-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="4"><path d="M20 12H4" stroke-linecap="round"/></svg>
              </button>
              <span class="text-sm font-black w-4 text-center">{{ rooms }}</span>
              <button @click="rooms++" class="h-9 w-9 rounded-xl border-2 border-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="4"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>

          <!-- Adults -->
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[11px] font-black text-gray-900 tracking-wide">Adults</div>
              <div class="text-[10px] text-gray-400 font-bold tracking-wide mt-1">Age 13+</div>
            </div>
            <div class="flex items-center gap-3">
              <button @click="adults > 1 && adults--" class="h-9 w-9 rounded-xl border-2 border-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="4"><path d="M20 12H4" stroke-linecap="round"/></svg>
              </button>
              <span class="text-sm font-black w-4 text-center">{{ adults }}</span>
              <button @click="adults++" class="h-9 w-9 rounded-xl border-2 border-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="4"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>

          <!-- Children -->
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[11px] font-black text-gray-900 tracking-wide">Children</div>
              <div class="text-[10px] text-gray-400 font-bold tracking-wide mt-1">Age 0-12</div>
            </div>
            <div class="flex items-center gap-3">
              <button @click="children > 0 && children--" class="h-9 w-9 rounded-xl border-2 border-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="4"><path d="M20 12H4" stroke-linecap="round"/></svg>
              </button>
              <span class="text-sm font-black w-4 text-center">{{ children }}</span>
              <button @click="children++" class="h-9 w-9 rounded-xl border-2 border-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="4"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>

          <button 
            @click="apply"
            class="w-full bg-gray-900 hover:bg-gray-800 text-white font-black py-4 rounded-2xl transition-all tracking-wide text-[10px] active:scale-[0.98] mt-4"
          >
            Apply changes
          </button>
        </div>

        <p class="text-[10px] text-gray-400 font-bold leading-relaxed mt-8 opacity-60 tracking-wider">
          Providing the correct age ensures you get the best room rates.
        </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  rooms: { type: Number, default: 1 },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 }
});

const emit = defineEmits(['update:rooms', 'update:adults', 'update:children', 'apply']);

const pickerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const rooms = ref(props.rooms);
const adults = ref(props.adults);
const children = ref(props.children);

const apply = () => {
  emit('update:rooms', rooms.value);
  emit('update:adults', adults.value);
  emit('update:children', children.value);
  emit('apply');
  isOpen.value = false;
};

const closePicker = (e: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener('click', closePicker));
onUnmounted(() => window.removeEventListener('click', closePicker));
</script>

<style scoped>
.fade-up-enter-active, .fade-up-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
