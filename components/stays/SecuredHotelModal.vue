<template>
  <div class="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full transform transition-all animate-in fade-in zoom-in duration-300">
      <!-- Image Header -->
      <div class="h-40 sm:h-48 relative">
        <img :src="stayPhotos[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'" 
             class="w-full h-full object-cover" />
        <button @click="$emit('close')" class="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 sm:p-8 text-center">
        <h2 class="text-xl sm:text-2xl font-bold text-black mb-3">We have secured your selected hotel</h2>
        
        <!-- Price summary -->
        <div v-if="selectedRoom?.rates?.[0]?.priceWithCommission" class="mb-5">
          <div class="text-xs sm:text-sm text-black font-medium">Total price</div>
          <div class="text-2xl sm:text-3xl font-bold text-black">{{ formatPrice(Math.round(selectedRoom.rates[0].priceWithCommission)) }}</div>
        </div>

        <div class="flex items-center justify-center text-black mb-6 gap-2">
           <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
           <span class="text-xs sm:text-sm font-bold opacity-80 leading-tight">Add flight to get bundle discount and earn Flybeth points</span>
        </div>

        <div class="space-y-3 sm:space-y-4">
            <button 
              @click="handleContinueWithoutFlight" 
              class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 sm:py-4 rounded-lg sm:rounded-xl transition-all shadow-lg shadow-green-100 active:scale-[0.98] text-sm"
            >
              Continue without flight
            </button>
            <button 
              @click="handleAddFlight"
              class="w-full text-black font-bold py-3 hover:underline transition-all text-xs sm:text-sm"
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
import { useSettings } from '@/composables/useSettings';

const { formatPrice } = useSettings();

const props = defineProps({
  stay: { type: Object, required: true },
  selectedRoom: { type: Object, required: true },
  quoteData: { type: Object, default: null },
  // Occupancy is owned by the details page (the user can change it there), so
  // it is passed in explicitly instead of being read from the stale URL query.
  checkIn: { type: String, default: '' },
  checkOut: { type: String, default: '' },
  adults: { type: [Number, String], default: null },
  children: { type: [Number, String], default: null },
  rooms: { type: [Number, String], default: null }
});

const emit = defineEmits(['close']);
const router = useRouter();
const route = useRoute();

const stayPhotos = computed(() => props.stay?.photos || []);

/** First value that is actually present (not null / undefined / ''). */
const firstPresent = (...values: any[]) =>
  values.find(v => v !== null && v !== undefined && v !== '');

const toCount = (value: any, fallback: number, min = 1) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= min ? n : fallback;
};

/**
 * The internal Mongo Room id is the ONLY value the backend accepts as `roomId`
 * for platform ('flybeth') inventory. `selectedRoom.rateId` is an opaque
 * `fbr~...` string and must never be sent as a room id.
 */
const resolvedRoomId = computed(() =>
  firstPresent(
    props.selectedRoom?.roomId,
    props.selectedRoom?.id,
    props.selectedRoom?.rates?.[0]?.rateId
  ) || null
);

const resolvedStayId = computed(() =>
  firstPresent(props.stay?.id, props.stay?._id, props.stay?.accommodationId, route.params.id) || null
);

const resolvedProvider = computed(() =>
  firstPresent(props.stay?.provider, props.selectedRoom?.provider, props.quoteData?.provider, route.query.provider) || 'flybeth'
);

const resolvedCheckIn = computed(() => firstPresent(props.checkIn, route.query.checkIn) || '');
const resolvedCheckOut = computed(() => firstPresent(props.checkOut, route.query.checkOut) || '');
const resolvedAdults = computed(() => toCount(firstPresent(props.adults, route.query.adults), 2));
const resolvedChildren = computed(() => toCount(firstPresent(props.children, route.query.children), 0, 0));
const resolvedRooms = computed(() => toCount(firstPresent(props.rooms, route.query.rooms), 1));

/** Single source of truth for the checkout payload contract. */
const buildCheckoutPayload = () => {
  // Customer-facing total for the nights/rooms searched. The rate's `price` is
  // the NET figure - `priceWithCommission` is what the traveller pays.
  const customerTotal = Math.round(props.selectedRoom.rates?.[0]?.priceWithCommission || 0);
  return {
    type: 'stay',
    id: resolvedStayId.value,
    roomId: resolvedRoomId.value,
    provider: resolvedProvider.value,
    quoteId: props.quoteData?.quoteId || props.quoteData?.id || null,
    checkIn: resolvedCheckIn.value,
    checkOut: resolvedCheckOut.value,
    adults: resolvedAdults.value,
    children: resolvedChildren.value,
    rooms: resolvedRooms.value,
    price: customerTotal,
    priceWithCommission: customerTotal,
    currency: props.selectedRoom.rates?.[0]?.currency || 'USD',
    hotelName: props.stay.name
  };
};

const handleContinueWithoutFlight = () => {
    emit('close');

    // `/checkout` reads ONLY this sessionStorage key - it never reads route.query.
    if (import.meta.client) {
      sessionStorage.setItem('flybeth_checkout_payload', JSON.stringify(buildCheckoutPayload()));
    }

    router.push({ path: '/checkout' });
};

const handleAddFlight = () => {
    // Cache the stay data for the bundle flow (checkout merges this back in
    // when the flight payload carries the same stay id).
    const stayData: any = {
        ...buildCheckoutPayload(),
        stay: props.stay,
        selectedRoom: props.selectedRoom
    };
    if (import.meta.client) {
      sessionStorage.setItem('pendingStayBooking', JSON.stringify(stayData));
    }

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
