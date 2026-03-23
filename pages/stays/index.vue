<template>
  <div class="stays-index-page bg-[#f0f2f5] min-h-screen">
    <!-- Secondary Search Header (Horizontal) -->
    <div class="bg-[#1a2b33] pt-6 pb-12 relative z-[60]">
      <div class="container mx-auto px-4">
        <div class="flex items-center text-gray-400 text-sm mb-4">
          <NuxtLink to="/" class="hover:text-white transition-all">Home</NuxtLink>
          <span class="mx-2 font-bold opacity-30">></span>
          <span class="text-white font-bold opacity-60">Hotels and more in {{ searchQuery.location || 'Your Selected Area' }}</span>
        </div>
        
        <h1 class="text-3xl font-black text-white mb-8">
          {{ loading ? 'Searching...' : `${stays.length} Properties Found` }}
        </h1>

        <div class="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-2xl flex flex-wrap lg:flex-nowrap gap-px relative">
          <StaySearchLocation 
            v-model="searchQuery.location" 
            @select="(loc: any) => { 
                searchQuery.location = loc.name;
                searchQuery.lat = loc.lat;
                searchQuery.lng = loc.lng;
                handleSearch();
            }"
          />

          <StaySearchCalendar 
            v-model:checkIn="searchQuery.checkIn"
            v-model:checkOut="searchQuery.checkOut"
          />

          <StaySearchGuests 
            v-model:rooms="searchQuery.rooms"
            v-model:adults="searchQuery.adults"
            v-model:children="searchQuery.children"
            @apply="handleSearch"
          />

          <button 
            @click="handleSearch"
            class="w-full lg:w-32 bg-white flex items-center justify-center p-2 rounded-r-lg group"
          >
            <div class="w-full h-full bg-brand-orange hover:bg-orange-600 transition-all rounded-lg flex items-center justify-center text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-200 active:scale-[0.98]">
              Search
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="container mx-auto px-4 mt-8 pb-20">
      <div class="flex flex-col lg:flex-row gap-6 relative items-start">
        
        <!-- Sidebar (Sticky) -->
        <div class="w-full lg:w-[28%] shrink-0 lg:sticky lg:top-4 space-y-6">
          <!-- My Cart (Fixed context) -->
          <div v-if="pendingBooking" class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
             <div class="bg-brand-blue p-4 flex justify-between items-center">
                <span class="text-sm font-black text-white uppercase tracking-widest italic">My Cart</span>
                <button @click="clearPendingBooking" class="text-white/60 hover:text-white">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
             </div>
             <div class="p-4 space-y-4">
                <div class="flex gap-3">
                   <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img :src="pendingBooking.stay?.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'" class="w-full h-full object-cover" />
                   </div>
                   <div class="flex-1">
                      <div class="text-sm font-black text-gray-400 uppercase tracking-widest mb-0.5">Hotel</div>
                      <div class="text-xs font-black text-gray-900 leading-tight">{{ pendingBooking.stay?.name }}</div>
                      <div class="text-[9px] font-bold text-gray-500">{{ pendingBooking.selectedRoom?.name }}</div>
                   </div>
                </div>
                <div class="pt-3 border-t border-dashed border-gray-100 flex justify-between items-end">
                   <div>
                      <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cumulative Price</div>
                      <div class="text-lg font-black text-brand-blue tracking-tighter">${{ pendingBooking.price }}</div>
                   </div>
                   <button @click="goToCheckout(pendingBooking)" class="bg-brand-orange text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-lg shadow-orange-100">Checkout</button>
                </div>
             </div>
          </div>

          <!-- Map Preview Card -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 p-2 cursor-pointer group" @click="showFullMap = true">
             <div class="h-32 rounded-xl bg-gray-100 overflow-hidden relative">
                <div id="sidebar-map" class="w-full h-full"></div>
                <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all z-[5]"></div>
                <div class="absolute inset-0 flex items-center justify-center z-[10]">
                   <div class="bg-white px-3 py-1.5 rounded-lg shadow-xl text-[9px] font-black uppercase tracking-widest text-brand-blue group-hover:scale-110 transition-transform">Enlarge Map</div>
                </div>
             </div>
          </div>

          <!-- Filters -->
          <StaysFilterSidebar 
            :minPrice="minPriceLimit" 
            :maxPrice="maxPriceLimit"
            v-model:filters="filters"
          />
        </div>

        <!-- Results Column (Scrollable Map/List) -->
        <div class="flex-1 min-w-0">
          <!-- List View -->
          <div v-if="!showFullMap" class="space-y-6">
            <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
               <h2 class="text-xl font-black text-gray-900">
                Properties in {{ searchQuery.location || 'Your Selected Area' }}
               </h2>
               <div class="flex gap-2">
                  <button v-for="opt in sortOptions" :key="opt.id" 
                          @click="sortBy = opt.id"
                          :class="sortBy === opt.id ? 'bg-brand-blue text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
                          class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                      {{ opt.labelShort || opt.label }}
                  </button>
               </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="space-y-6">
              <div v-for="i in 3" :key="i" class="h-[280px] bg-white rounded-2xl animate-pulse border border-gray-100 overflow-hidden flex">
                <div class="w-[35%] bg-gray-100"></div>
                <div class="flex-1 p-6 space-y-4">
                  <div class="h-6 bg-gray-100 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div class="h-20 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="stays.length === 0" class="bg-white rounded-2xl p-20 text-center border border-gray-100 shadow-sm">
              <div class="w-20 h-20 bg-brand-blue/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <h3 class="text-xl font-black text-gray-900 mb-2 uppercase">No Properties Found</h3>
              <p class="text-gray-500 font-bold text-xs uppercase tracking-widest max-w-xs mx-auto mb-8 opacity-60">Try adjusting your filters or price range to find matching stays.</p>
              <button @click="resetFilters" class="bg-brand-blue text-white font-black px-8 py-4 rounded-xl hover:bg-brand-blue/90 transition-all uppercase tracking-widest text-sm">
                Reset All Filters
              </button>
            </div>

            <!-- Stay Cards -->
            <div v-else class="space-y-6">
              <StayCard 
                v-for="stay in stays" 
                :key="stay.id || stay.accommodationId"
                :stay="stay"
                @select="goToDetails"
              />
            </div>
          </div>

          <!-- Map View (Large) -->
          <div v-else class="h-[calc(100vh-120px)] bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden relative">
             <div id="full-map" class="w-full h-full"></div>
             <button @click="showFullMap = false" class="absolute top-6 right-6 z-[1000] bg-[#1a2b33] text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
                Return to List
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStays } from '@/composables/modules/stays/useSearchStays';
import StayCard from '@/components/stays/StayCard.vue';
import StaysFilterSidebar from '@/components/stays/StaysFilterSidebar.vue';
import StaySearchLocation from '@/components/stays/StaySearchLocation.vue';
import StaySearchCalendar from '@/components/stays/StaySearchCalendar.vue';
import StaySearchGuests from '@/components/stays/StaySearchGuests.vue';

const route = useRoute();
const router = useRouter();
const { loading, stays, filters, sortBy, minPriceLimit, maxPriceLimit, searchStays } = useSearchStays();
const config = useRuntimeConfig();

const showFullMap = ref(false);
const pendingBooking = ref<any>(null);

const searchQuery = ref({
  location: '',
  lat: null as number | null,
  lng: null as number | null,
  checkIn: '',
  checkOut: '',
  guests: 2,
  adults: 2,
  children: 0,
  rooms: 1,
  countryCode: ''
});

const sortOptions = [
  { id: 'popular', label: 'Popular', labelShort: 'Popular' },
  { id: 'rating', label: 'User Rating', labelShort: 'Highest Rating' },
  { id: 'price-low', label: 'Price Low', labelShort: 'Cheapest' },
];

const handleSearch = async () => {
  await searchStays(searchQuery.value);
  initMaps();
};

const resetFilters = () => {
  filters.name = '';
  filters.maxPrice = maxPriceLimit.value;
  filters.ratings = [];
  filters.amenities = [];
  filters.types = [];
};

const goToDetails = (stay: any) => {
  const id = stay._id || stay.id || stay.accommodationId;
  const provider = stay.provider || 'duffel';
  router.push(`/stays/${id}?provider=${provider}&checkIn=${searchQuery.value.checkIn}&checkOut=${searchQuery.value.checkOut}&adults=${searchQuery.value.adults}&children=${searchQuery.value.children}&rooms=${searchQuery.value.rooms}`);
};

const goToCheckout = (booking: any) => {
    router.push({
      path: '/checkout',
      query: {
        type: 'stay',
        roomId: booking.roomId,
        provider: booking.provider,
        id: booking.id
      }
    });
};

const clearPendingBooking = () => {
    sessionStorage.removeItem('pendingStayBooking');
    pendingBooking.value = null;
};

// Maps Logic
let sidebarMap: any = null;
let fullMap: any = null;
let markers: any[] = [];

const initMaps = () => {
    if (typeof window === 'undefined') return;
    const google = (window as any).google;
    if (!google || !google.maps) return;

    const mapCenter = {
        lat: searchQuery.value.lat || (stays.value[0]?.location?.latitude || 0),
        lng: searchQuery.value.lng || (stays.value[0]?.location?.longitude || 0)
    };

    if (mapCenter.lat && mapCenter.lng) {
        // Sidebar Mini Map
        sidebarMap = new google.maps.Map(document.getElementById('sidebar-map'), {
            center: mapCenter,
            zoom: 12,
            disableDefaultUI: true,
            styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#7c93a3"}]}]
        });
       
       stays.value.slice(0, 5).forEach((stay: any) => {
           if (stay.location?.latitude && stay.location?.longitude) {
               new google.maps.Marker({
                   position: { lat: stay.location.latitude, lng: stay.location.longitude },
                   map: sidebarMap,
                   icon: {
                       path: google.maps.SymbolPath.CIRCLE,
                       fillColor: '#0084ff',
                       fillOpacity: 1,
                       strokeWeight: 1,
                       strokeColor: '#ffffff',
                       scale: 4
                   }
               });
           }
       });
    }

    // Full Map
    if (showFullMap.value) {
        nextTick(() => {
            fullMap = new google.maps.Map(document.getElementById('full-map'), {
                center: mapCenter,
                zoom: 14,
                styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#1a2b33"}]}]
            });

            stays.value.forEach((stay: any) => {
                const lat = stay.location?.latitude;
                const lng = stay.location?.longitude;
                if (!lat || !lng) return;

                const price = Math.round(stay.cheapestPrice || stay.priceWithCommission || 0);
                
                // Create custom price pin using Marker and Label
                const marker = new google.maps.Marker({
                    position: { lat, lng },
                    map: fullMap,
                    label: {
                        text: `$${price}`,
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '900'
                    },
                    icon: {
                        path: 'M 0,0 L 60,0 L 60,25 L 35,25 L 30,32 L 25,25 L 0,25 Z',
                        fillColor: '#1a2b33',
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: '#ffffff40',
                        anchor: new google.maps.Point(30, 32),
                        labelOrigin: new google.maps.Point(30, 12)
                    }
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                       <div style="width: 200px; font-family: 'Inter', sans-serif; padding: 0;">
                          <img src="${stay.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}" style="width: 100%; height: 100px; object-cover; border-radius: 12px 12px 0 0;" />
                          <div style="padding: 12px;">
                             <div style="font-size: 9px; font-weight: 900; color: #9ca3af; text-transform: uppercase;">${stay.provider || 'Property'}</div>
                             <div style="font-size: 12px; font-weight: 900; color: #1a2332; margin-bottom: 8px;">${stay.name}</div>
                             <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="font-size: 14px; font-weight: 900; color: #0084ff;">$${price}</div>
                                <div style="font-size: 10px; font-weight: 900; color: #f27c22; text-decoration: underline;">VIEW</div>
                          </div>
                       </div>
                    `
                });

                marker.addListener('click', () => {
                    infoWindow.open(fullMap, marker);
                });

                markers.push(marker);
            });
        });
    }
};

watch(showFullMap, (val) => {
    if (val) {
        setTimeout(initMaps, 100);
    }
});

onMounted(() => {
  if (route.query.location) searchQuery.value.location = String(route.query.location);
  if (route.query.lat) searchQuery.value.lat = parseFloat(String(route.query.lat));
  if (route.query.lng) searchQuery.value.lng = parseFloat(String(route.query.lng));
  if (route.query.checkIn) searchQuery.value.checkIn = String(route.query.checkIn);
  if (route.query.checkOut) searchQuery.value.checkOut = String(route.query.checkOut);
  if (route.query.guests) searchQuery.value.guests = parseInt(String(route.query.guests)) || 2;

  handleSearch();

  const saved = sessionStorage.getItem('pendingStayBooking');
  if (saved) {
      pendingBooking.value = JSON.parse(saved);
  }
});

const googleMapsApiKey = 'AIzaSyCa0Rx0TJ9BGkQ9NC23BZc51zCql_Xrhs0';

useHead({
  script: [
    { 
      src: `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`, 
      async: true, 
      defer: true,
      onload: () => {
        if (typeof window !== 'undefined') {
          setTimeout(initMaps, 500);
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
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
