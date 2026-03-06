<template>
  <div class="relative w-full lg:w-56" ref="pickerRef">
    <!-- Trigger -->
    <div 
      @click="isOpen = !isOpen"
      class="bg-white px-6 py-3 hover:bg-gray-50 transition-all cursor-pointer border-r border-gray-100 h-full flex flex-col justify-center"
    >
      <div class="flex items-center text-[10px] font-black text-brand-blue uppercase tracking-widest mb-1.5">
        Rooms & Guests
        <svg class="w-3.5 h-3.5 ml-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" :class="{'rotate-180': isOpen}"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="font-black text-gray-900 leading-none truncate">
        {{ rooms }} Room{{ rooms > 1 ? 's' : '' }}, {{ adults + children }} Guest{{ (adults + children) > 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Dropdown -->
    <Transition name="fade-up">
      <div v-if="isOpen" class="absolute top-full left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 mt-3 z-[99999] bg-white rounded-2xl shadow-[0_30px_90px_-20px_rgba(13,29,173,0.2)] border border-gray-50 w-[92vw] sm:w-[320px] p-6 animate-fade-in">
        <!-- Mobile Close Button -->
        <button @click="isOpen = false" class="md:hidden absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-gray-400 bg-gray-50 rounded-full z-10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest border-b border-gray-100 pb-3">Rooms & Guests</h3>
        
        <div class="space-y-6">
          <!-- Rooms -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-black text-gray-700">Rooms</span>
            <select v-model="rooms" class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none w-24">
              <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>

          <!-- Adults -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-black text-gray-700">Adults</span>
            <select v-model="adults" class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none w-24">
              <option v-for="i in 20" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>

          <!-- Children -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-black text-gray-700">Children</span>
              <select v-model="children" class="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none w-24">
                <option v-for="i in 11" :key="i-1" :value="i-1">{{ i-1 }}</option>
              </select>
            </div>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">0y - 17y</p>
          </div>
        </div>

        <p class="text-[10px] text-gray-400 font-medium leading-relaxed mt-4 italic">
          Please provide right number of children along with their right age for best options and prices.
        </p>

        <button 
          @click="apply"
          class="w-full mt-6 bg-brand-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-orange-100 active:scale-[0.98] uppercase tracking-widest text-xs"
        >
          Apply
        </button>
      </div>
    </Transition>
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
.bg-brand-orange { background-color: #ff8a00; }
.text-brand-blue { color: #0084ff; }
</style>
