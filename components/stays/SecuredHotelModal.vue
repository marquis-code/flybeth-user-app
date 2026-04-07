<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full transform transition-all animate-in fade-in zoom-in duration-300">
      <!-- Image Header -->
      <div class="h-64 relative">
        <img :src="stayPhotos[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'" 
             class="w-full h-full object-cover" />
        <button @click="$emit('close')" class="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-10 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">We have secured your selected hotel</h2>
        
        <!-- Price summary -->
        <div v-if="selectedRoom?.rates?.[0]?.priceWithCommission" class="mb-6">
          <div class="text-sm text-gray-500 font-medium">Total price</div>
          <div class="text-3xl font-bold text-gray-900">${{ Math.round(selectedRoom.rates[0].priceWithCommission) }}</div>
        </div>

        <div class="flex items-center justify-center text-gray-600 mb-10 gap-2">
           <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
           <span class="text-sm font-bold opacity-80 tracking-wide">Add flight to get bundle discount and earn Flybeth points</span>
        </div>

        <div class="space-y-4">
            <button 
              @click="handleContinueWithoutFlight" 
              class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-xl transition-all shadow-xl shadow-green-100 active:scale-[0.98] tracking-wide text-sm"
            >
              Continue without flight
            </button>
            <button 
              @click="handleAddFlight"
              class="w-full text-gray-900 font-bold py-4 hover:underline transition-all tracking-wide text-xs"
            >
              Add flight to booking
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  stay: { type: Object, required: true },
  selectedRoom: { type: Object, required: true },
  quoteData: { type: Object, default: null }
});

const emit = defineEmits(['close']);
const router = useRouter();
const route = useRoute();

const stayPhotos = computed(() => props.stay?.photos || []);

const handleContinueWithoutFlight = () => {
    emit('close');
    
    // Build the checkout query with all necessary data
    const checkoutQuery: any = {
      type: 'stay',
      roomId: props.selectedRoom.id || props.selectedRoom.rateId || props.selectedRoom.rates?.[0]?.rateId,
      provider: props.stay.provider || route.query.provider,
      id: props.stay.id || props.stay.accommodationId || route.params.id,
      checkIn: route.query.checkIn,
      checkOut: route.query.checkOut,
      adults: route.query.adults,
      children: route.query.children,
      rooms: route.query.rooms,
      price: Math.round(props.selectedRoom.rates?.[0]?.priceWithCommission || 0),
      currency: props.selectedRoom.rates?.[0]?.currency || 'USD',
      hotelName: props.stay.name
    };

    // Include the quote ID if we got one
    if (props.quoteData?.id) {
      checkoutQuery.quoteId = props.quoteData.id;
    }

    router.push({
      path: '/checkout',
      query: checkoutQuery
    });
};

const handleAddFlight = () => {
    // Cache the stay data for later checkout
    const stayData = {
        type: 'stay',
        stay: props.stay,
        selectedRoom: props.selectedRoom,
        roomId: props.selectedRoom.id || props.selectedRoom.rateId || props.selectedRoom.rates?.[0]?.rateId,
        provider: props.stay.provider || route.query.provider,
        id: props.stay.id || props.stay.accommodationId || route.params.id,
        price: props.selectedRoom.rates?.[0]?.priceWithCommission || 0,
        currency: props.selectedRoom.rates?.[0]?.currency || 'USD',
        quoteId: props.quoteData?.id || null
    };
    sessionStorage.setItem('pendingStayBooking', JSON.stringify(stayData));
    
    emit('close');
    router.push('/?tab=flights');
};
</script>

<style scoped>
.animate-in {
  animation: modal-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
