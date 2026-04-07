<template>
  <div class="stays-index-page bg-[#f0f2f5] min-h-screen">
    <!-- Search Header (V3 Professional) -->
    <div class="bg-white pt-12 pb-24 relative z-[100]">
      <div class="container mx-auto px-4 relative z-10">
        <!-- Breadcrumbs -->
        <div class="flex items-center text-gray-400 text-sm tracking-wide font-bold mb-8">
          <NuxtLink to="/" class="hover:text-gray-900 transition-all">Home</NuxtLink>
          <svg class="w-3 h-3 mx-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-900">Hotels in {{ searchQuery.location || 'Your Selected Area' }}</span>
        </div>
        
        <!-- Header Info -->
        <div class="max-w-3xl mb-12">
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            {{ loading ? 'Searching stays' : `${stays.length} Properties` }}
          </h1>
          <p class="text-base text-gray-500 font-medium">Explore hand-picked hotels and exclusive apartments for your next trip.</p>
        </div>
 
        <!-- Redesigned Search Bar -->
        <div class="bg-white rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.08)] border border-gray-100 p-2 md:p-2.5 flex flex-col lg:flex-row items-stretch gap-1.5 relative z-[110]">
          <StaySearchLocation 
            v-model="searchQuery.location" 
            @select="(loc: any) => { 
                searchQuery.location = loc.name;
                searchQuery.lat = loc.lat;
                searchQuery.lng = loc.lng;
                handleSearch();
            }"
            class="flex-1"
          />
 
          <div class="hidden lg:block w-px bg-gray-100 h-10 self-center"></div>
 
          <StaySearchCalendar 
            v-model:checkIn="searchQuery.checkIn"
            v-model:checkOut="searchQuery.checkOut"
            class="lg:w-auto"
          />
 
          <div class="hidden lg:block w-px bg-gray-100 h-10 self-center"></div>
 
          <StaySearchGuests 
            v-model:rooms="searchQuery.rooms"
            v-model:adults="searchQuery.adults"
            v-model:children="searchQuery.children"
            @apply="handleSearch"
            class="lg:w-auto"
          />
 
          <button 
            @click="handleSearch"
            class="lg:ml-2"
          >
            <div class="w-full lg:w-44 h-16 bg-gray-900 hover:bg-gray-700 transition-all duration-300 rounded-2xl flex items-center justify-center text-white font-black text-sm tracking-wide shadow-lg shadow-gray-900/15 active:scale-[0.98] gap-3 px-8">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Search
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="container mx-auto px-4 mt-4 pb-20 relative z-10">
      <div class="flex flex-col lg:flex-row gap-6 relative items-start">
        
        <!-- Sidebar (Sticky) -->
        <div class="w-full lg:w-[28%] shrink-0 lg:sticky lg:top-4 space-y-6">
          <!-- My Cart -->
          <div v-if="pendingBooking" class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
             <div class="bg-gray-900 p-4 flex justify-between items-center">
                <span class="text-sm font-bold text-white tracking-wide">My cart</span>
                <button @click="clearPendingBooking" class="text-white/60 hover:text-white transition-colors">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
             </div>
             <div class="p-5 space-y-4">
                <div class="flex gap-3">
                   <div class="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      <img :src="pendingBooking.stay?.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'" class="w-full h-full object-cover" />
                   </div>
                   <div class="flex-1">
                      <div class="text-sm font-bold text-gray-500 tracking-wide mb-0.5">Hotel</div>
                      <div class="text-sm font-bold text-gray-900 leading-tight">{{ pendingBooking.stay?.name }}</div>
                      <div class="text-sm font-medium text-gray-500 mt-0.5">{{ pendingBooking.selectedRoom?.name }}</div>
                   </div>
                </div>
                <div class="pt-3 border-t border-dashed border-gray-100 flex justify-between items-end">
                   <div>
                      <div class="text-sm font-bold text-gray-400 tracking-wide">Total price</div>
                      <div class="text-xl font-bold text-gray-900 tracking-tight">${{ pendingBooking.price }}</div>
                   </div>
                   <button @click="goToCheckout(pendingBooking)" class="bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold tracking-wide px-5 py-2.5 rounded-lg shadow-lg shadow-gray-200/50 transition-all active:scale-95">Checkout</button>
                </div>
             </div>
          </div>

          <!-- Map Preview Card -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 p-2 cursor-pointer group" @click="showFullMap = true">
             <div class="h-36 rounded-xl bg-gray-100 overflow-hidden relative">
                <div id="sidebar-map" class="w-full h-full"></div>
                <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all z-[5]"></div>
                <div class="absolute inset-0 flex items-center justify-center z-[10]">
                   <div class="bg-white px-4 py-2 rounded-lg shadow-xl text-xs font-bold tracking-wide text-gray-800 group-hover:scale-105 transition-transform flex items-center gap-1.5">
                     <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                     Show on map
                  </div>
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

        <!-- Results Column -->
        <div class="flex-1 min-w-0">
          <!-- List View -->
          <div v-if="!showFullMap" class="space-y-5">
            <!-- Sort Bar -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 gap-4">
               <h2 class="text-sm font-black text-gray-900 tracking-wide">
                Properties in {{ searchQuery.location || 'Your Selected Area' }}
               </h2>
               <div class="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
                  <button v-for="opt in sortOptions" :key="opt.id" 
                          @click="sortBy = opt.id"
                          :class="sortBy === opt.id ? 'bg-white text-gray-900 shadow-xl shadow-black/5' : 'text-gray-400 hover:text-gray-900'"
                          class="px-5 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all">
                      {{ opt.labelShort || opt.label }}
                  </button>
               </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="space-y-5">
              <div v-for="i in 3" :key="i" class="h-[280px] bg-white rounded-2xl animate-pulse border border-gray-100 overflow-hidden flex">
                <div class="w-[35%] bg-gray-100"></div>
                <div class="flex-1 p-6 space-y-4">
                  <div class="h-6 bg-gray-100 rounded-lg w-3/4"></div>
                  <div class="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                  <div class="h-20 bg-gray-100 rounded-lg w-full"></div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="stays.length === 0" class="bg-white rounded-[3rem] p-32 text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div class="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                <svg class="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <h3 class="text-2xl font-black text-gray-900 mb-4 tracking-tight">No properties found</h3>
              <p class="text-gray-500 text-sm max-w-sm mx-auto mb-12 font-medium">We couldn't find any properties matching your criteria. Try adjusting your filters or price range for better results.</p>
              <button @click="resetFilters" class="bg-gray-900 hover:bg-gray-700 text-white font-black px-12 py-5 rounded-2xl transition-all tracking-wide text-xs shadow-xl shadow-gray-900/20 active:scale-[0.98]">
                Clear filters
              </button>
            </div>

            <!-- Stay Cards -->
            <div v-else class="space-y-5">
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
             <button @click="showFullMap = false" class="absolute top-6 right-6 z-[1000] bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-2xl flex items-center gap-2 border border-gray-100 hover:shadow-lg transition-all active:scale-95">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
                Return to list
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
  checkIn: new Date().toISOString().split('T')[0],
  checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  guests: 2,
  adults: 2,
  children: 0,
  rooms: 1,
  countryCode: ''
});

const sortOptions = [
  { id: 'popular', label: 'Popular', labelShort: 'Popular' },
  { id: 'rating', label: 'User Rating', labelShort: 'Top rated' },
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
        id: booking.id,
        price: booking.price,
        currency: booking.currency || 'USD',
        hotelName: booking.stay?.name
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
                       fillColor: '#111827',
                       fillOpacity: 1,
                       strokeWeight: 2,
                       strokeColor: '#ffffff',
                       scale: 5
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
                        fillColor: '#111827',
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
                          <img src="${stay.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 12px 12px 0 0;" />
                          <div style="padding: 12px;">
                             <div style="font-size: 9px; font-weight: 900; color: #6b7280;">${stay.provider || 'Property'}</div>
                             <div style="font-size: 12px; font-weight: 700; color: #1a2332; margin-bottom: 8px;">${stay.name}</div>
                             <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="font-size: 16px; font-weight: 900; color: #111827;">$${price}</div>
                                <div style="font-size: 10px; font-weight: 900; color: #111827; text-decoration: underline; cursor: pointer;">View</div>
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
  if (route.query.adults) searchQuery.value.adults = parseInt(String(route.query.adults)) || 2;
  if (route.query.children) searchQuery.value.children = parseInt(String(route.query.children)) || 0;
  if (route.query.rooms) searchQuery.value.rooms = parseInt(String(route.query.rooms)) || 1;

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
