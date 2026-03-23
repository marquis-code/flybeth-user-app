<template>
  <div class="stay-details-page bg-gray-50 min-h-screen pb-20">
    <!-- Top Nav / Breadcrumbs -->
    <div class="bg-white border-b border-gray-100 py-4">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <button @click="router.back()" class="flex items-center text-sm font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all">
          <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Go Back
        </button>
        <div class="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
          <NuxtLink to="/" class="hover:text-gray-900">Home</NuxtLink>
          <span class="mx-2 opacity-30">></span>
          <NuxtLink to="/stays" class="hover:text-gray-900">Hotels in {{ (stayDetails as any)?.location?.city || 'Selected Area' }}</NuxtLink>
          <span class="mx-2 opacity-30">></span>
          <span class="text-gray-900">{{ (stayDetails as any)?.name || 'Loading...' }}</span>
        </div>
      </div>
    </div>

    <!-- Title & Rating Header -->
    <div class="container mx-auto px-4 pt-10 pb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-gray-900 mb-2 uppercase">{{ stayDetails?.name || 'Stay Details' }}</h1>
          <div class="flex items-center text-sm font-bold text-brand-blue">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {{ stayDetails?.location?.address }}{{ stayDetails?.location?.city ? `, ${stayDetails.location.city}` : '' }} - Excellent location - <button @click="showFullMap = true" class="underline ml-1 hover:text-blue-700">show map</button>
          </div>
        </div>
        <div v-if="stayDetails?.rating" class="flex items-center bg-brand-orange text-white px-4 py-2 rounded-lg self-start md:self-center">
          <span class="text-xl font-black italic mr-3">{{ stayDetails.rating.toFixed(1) }}</span>
          <span class="text-sm font-bold uppercase tracking-wider">Excellent</span>
        </div>
      </div>
    </div>

    <!-- Image Gallery Grid -->
    <div class="container mx-auto px-4 mb-10">
      <div v-if="stayPhotos.length > 0" class="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-sm">
        <div v-for="(photo, idx) in stayPhotos.slice(0, 5)" :key="idx" 
             :class="idx === 0 ? 'md:col-span-2 md:row-span-2' : ''"
             class="relative group cursor-pointer overflow-hidden">
          <img :src="photo" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
          <div v-if="idx === 3 && stayPhotos.length > 5" class="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/20">
            +{{ stayPhotos.length - 4 }} Photos
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Nav -->
    <div class="container mx-auto px-4 mb-8">
      <div class="border-b border-gray-200 flex space-x-10">
        <button 
          v-for="tab in ['Overview', 'Apartment Info and price', 'Hotel Amenities']" 
          :key="tab"
          @click="activeTab = tab"
          class="relative py-4 text-xs font-black uppercase tracking-widest transition-all"
          :class="activeTab === tab ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-400 hover:text-gray-700'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
      <div class="lg:col-span-2 space-y-10">
        <!-- About Section -->
        <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8">
          <div class="flex-1">
             <h2 class="text-2xl font-black text-gray-900 mb-6">About the Property</h2>
             <p class="text-sm font-bold text-gray-500 leading-relaxed italic">
                {{ stayDetails?.description || 'This property offers premium services and comfortable accommodation designed for your convenience. Perfect for both business and leisure travellers.' }}
             </p>
          </div>
          <div class="w-full md:w-64 h-48 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
             <div id="mini-map" class="w-full h-full"></div>
             <button @click="showFullMap = true" class="absolute inset-0 bg-transparent cursor-pointer z-[10]"></button>
          </div>
        </div>

        <!-- Amenities Section -->
        <div v-if="stayAmenities.length > 0" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 class="text-2xl font-black text-gray-900 mb-8">Hotel Amenities</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-4">
            <div v-for="amenity in stayAmenities" :key="amenity.label" class="flex items-center text-[11px] font-bold text-gray-600">
              <svg class="w-3.5 h-3.5 mr-2 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              {{ amenity.label }}
            </div>
          </div>
        </div>

        <!-- Availability Banner (Horizontal) -->
        <div class="bg-brand-blue rounded-xl p-8 shadow-2xl flex flex-wrap lg:flex-nowrap items-center gap-6 border border-blue-400/20 relative z-[20]">
          <div class="flex-1 min-w-[200px]">
            <h3 class="text-white font-black text-xl mb-1 uppercase tracking-tight">Change Dates and Guest(s)</h3>
            <p class="text-blue-100 text-sm font-bold opacity-80 uppercase tracking-widest">
              Check-In: 2:00 PM - 4:00 PM | Check-Out: 10:00 AM - 12:00 PM
            </p>
          </div>
          
          <div class="flex flex-wrap lg:flex-nowrap gap-4 flex-1">
             <!-- Check-in -->
             <div class="bg-white rounded-lg p-3 flex-1 min-w-[140px] border border-blue-200">
                <div class="text-[9px] font-black text-brand-blue uppercase mb-1">Check-in</div>
                <div class="text-sm font-black text-gray-900">{{ formatDateShort(searchQuery.checkIn) }}</div>
             </div>
             <!-- Return (Check-out) -->
             <div class="bg-white rounded-lg p-3 flex-1 min-w-[140px] border border-blue-200">
                <div class="text-[9px] font-black text-brand-blue uppercase mb-1">Return</div>
                <div class="text-sm font-black text-gray-900">{{ formatDateShort(searchQuery.checkOut) }}</div>
             </div>
             <!-- Rooms & Guests -->
             <div class="bg-white rounded-lg p-3 flex-1 min-w-[140px] border border-blue-200">
                <div class="text-[9px] font-black text-brand-blue uppercase mb-1">Rooms & Guests</div>
                <div class="text-sm font-black text-gray-900">{{ searchQuery.rooms }} Room, {{ searchQuery.adults }} Guest</div>
             </div>
          </div>

          <button 
            @click="handleUpdateSearch"
            class="bg-white text-brand-blue font-black px-8 py-4 rounded-lg text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
          >
            Update Search
          </button>
        </div>

        <!-- Room Type Table -->
        <div class="space-y-4">
          <div class="flex items-center mb-4 pl-2">
            <input type="checkbox" id="refundable" class="custom-checkbox" />
            <label for="refundable" class="text-xs font-black uppercase tracking-widest text-gray-700 cursor-pointer">Show deals with Refundable</label>
          </div>

          <div v-if="rooms.length > 0" class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead class="bg-[#00a3e0] text-white">
                <tr>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Room Type</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">No. of guests</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Price for {{ diffDays }} nights</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Your choices</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="room in rooms" :key="room.name" class="hover:bg-blue-50/30 transition-colors group cursor-pointer" @click="selectedRoom = room">
                  <td class="px-6 py-8 align-top border-r border-gray-50 w-1/3">
                    <h4 class="text-[#00a3e0] font-black text-base mb-3 tracking-tight underline">{{ room.name }}</h4>
                    <div class="space-y-2">
                      <div v-for="(amenity, aIdx) in room.amenities?.slice(0, 5)" :key="aIdx" class="flex items-center text-sm font-bold text-gray-600">
                        <svg class="w-3.5 h-3.5 mr-2 text-brand-blue opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        {{ typeof amenity === 'string' ? amenity : (amenity as any).description }}
                      </div>
                    </div>
                    <button class="text-brand-blue text-[9px] font-black uppercase tracking-widest mt-4 underline">See More Details</button>
                  </td>
                  <td class="px-6 py-8 align-top border-r border-gray-50 text-center">
                    <svg class="w-6 h-6 text-gray-900 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                  </td>
                  <td class="px-6 py-8 align-top border-r border-gray-50">
                    <div class="text-xl font-black text-gray-900 tracking-tighter mb-1">${{ Math.round(room.rates?.[0]?.priceWithCommission || 0) }}</div>
                    <div class="text-[9px] font-bold text-gray-400">Includes taxes and charges</div>
                  </td>
                  <td class="px-6 py-8 align-top space-y-3">
                    <div class="flex items-center text-sm font-bold text-gray-700">
                       <svg class="w-3.5 h-3.5 mr-2 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Non Refundable
                    </div>
                    <div class="flex items-center text-sm font-bold text-gray-700">
                       <svg class="w-3.5 h-3.5 mr-2 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       No Discount
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Summary Column -->
      <div class="space-y-6 lg:sticky lg:top-24">
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50">
          <div class="bg-brand-blue p-4">
             <div class="text-sm font-black text-white uppercase tracking-widest italic">Summary</div>
          </div>
          <div class="p-6">
            <div v-if="!selectedRoom" class="text-center py-10 opacity-40">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              <p class="text-xs font-black uppercase tracking-widest text-gray-400">Select a room to proceed</p>
            </div>
            <div v-else class="space-y-6">
              <div class="flex flex-col gap-2 border-b border-gray-100 pb-6">
                <div class="text-sm font-black text-gray-900">{{ searchQuery.rooms }} rooms for</div>
                <div class="text-4xl font-black text-gray-900 tracking-tighter">${{ Math.round((selectedRoom as any).rates?.[0]?.priceWithCommission || 0) }}</div>
                <div class="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Includes taxes and charges</div>
              </div>
              
              <button 
                @click="handleReserve"
                class="w-full bg-[#f27c22] hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-orange-100 active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
              >
                Reserve Room
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-[#e7f6ff] rounded-2xl p-6 border border-blue-100 border-dashed">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-brand-blue mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p class="text-[11px] font-bold text-brand-blue leading-relaxed underline">NEED HELP WITH YOUR BOOKING? OUR 24/7 CONCIERGE IS AVAILABLE TO ASSIST YOU WITH SPECIAL REQUESTS.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bundle Modal -->
    <SecuredHotelModal 
      v-if="showBundleModal" 
      :stay="stayDetails" 
      :selectedRoom="selectedRoom"
      @close="showBundleModal = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStayDetails } from '@/composables/modules/stays/useStayDetails';
import SecuredHotelModal from '@/components/stays/SecuredHotelModal.vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const activeTab = ref('Overview');
const showBundleModal = ref(false);
const showFullMap = ref(false);

const { loading, rooms, fetchStayRates, selectedRoom, stayDetails, fetchStayDetails } = useStayDetails();

const stayId = route.params.id as string;
const provider = route.query.provider as string || 'duffel';

const searchQuery = reactive({
  checkIn: (route.query.checkIn as string) || new Date().toISOString().split('T')[0],
  checkOut: (route.query.checkOut as string) || new Date(Date.now() + 86400000).toISOString().split('T')[0],
  rooms: Number(route.query.rooms) || 1,
  adults: Number(route.query.adults) || 2,
  children: Number(route.query.children) || 0,
});

const diffDays = computed(() => {
    const checkIn = searchQuery.checkIn || new Date().toISOString().split('T')[0];
    const checkOut = searchQuery.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const stayPhotos = computed(() => stayDetails.value?.photos || []);

const stayAmenities = computed(() => {
  if (stayDetails.value?.amenities) {
    return stayDetails.value.amenities.map((a: any) => ({
      label: typeof a === 'string' ? a : (a.description || a.type),
    }));
  }
  return [];
});

const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit' }).replace(',', '');
};

const handleUpdateSearch = async () => {
    await fetchStayRates(stayId, provider, searchQuery);
    if (rooms.value.length > 0) {
        selectedRoom.value = rooms.value[0];
    }
};

const handleReserve = () => {
    if (!selectedRoom.value) return;
    showBundleModal.value = true;
};

// Map implementation
let map: any = null;

const initMap = () => {
    if (typeof window === 'undefined') return;
    const lat = stayDetails.value?.location?.latitude || 0;
    const lng = stayDetails.value?.location?.longitude || 0;

    if (!lat || !lng) return;

    // Use Google Maps
    const google = (window as any).google;
    if (!google || !google.maps) return;

    if (!map) {
      map = new google.maps.Map(document.getElementById('mini-map'), {
          center: { lat, lng },
          zoom: 15,
          disableDefaultUI: true,
          styles: [
              {
                  "featureType": "all",
                  "elementType": "labels.text.fill",
                  "stylers": [{ "color": "#7c93a3" }]
              }
          ]
      });
    } else {
      map.setCenter({ lat, lng });
    }

    new google.maps.Marker({
        position: { lat, lng },
        map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#0084ff',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 10
        }
    });
};

onMounted(async () => {
    await Promise.all([
      fetchStayDetails(stayId, provider),
      handleUpdateSearch()
    ]);
    if ((window as any).google?.maps) {
      initMap();
    }
});

watch(() => stayDetails.value, () => {
    setTimeout(initMap, 1000);
}, { deep: true });

const googleMapsApiKey = 'AIzaSyCa0Rx0TJ9BGkQ9NC23BZc51zCql_Xrhs0';

useHead({
  script: [
    { 
      src: `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`, 
      async: true, 
      defer: true,
      onload: () => {
        if (typeof window !== 'undefined') {
          setTimeout(initMap, 500);
        }
      }
    }
  ]
});
</script>

<style scoped>
.bg-brand-orange {
  background-color: #ff8a00;
}
.text-brand-blue {
  color: #0084ff;
}
.bg-brand-blue {
  background-color: #0084ff;
}
</style>
