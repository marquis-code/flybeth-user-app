<template>
  <div class="stay-details-page bg-gray-50 min-h-screen pb-20">
    <!-- Top Nav / Breadcrumbs -->
    <div class="bg-white border-b border-gray-100 py-4">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <button @click="router.back()" class="flex items-center text-sm tracking-wide text-gray-500 hover:text-gray-900 transition-all">
          <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Go back
        </button>
        <div class="flex items-center text-sm font-bold text-gray-400 tracking-wide">
          <NuxtLink to="/" class="hover:text-gray-900">Home</NuxtLink>
          <span class="mx-2 opacity-30">&gt;</span>
          <NuxtLink to="/stays" class="hover:text-gray-900">Hotels in {{ (stayDetails as any)?.location?.city || 'Selected Area' }}</NuxtLink>
          <span class="mx-2 opacity-30">&gt;</span>
          <span class="text-gray-900">{{ (stayDetails as any)?.name || 'Loading...' }}</span>
        </div>
      </div>
    </div>

    <!-- Title & Rating Header -->
    <div class="container mx-auto px-4 pt-10 pb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ stayDetails?.name || 'Stay Details' }}</h1>
          <div class="flex items-center text-sm font-bold text-gray-900">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {{ stayDetails?.location?.address }}{{ stayDetails?.location?.city ? `, ${stayDetails.location.city}` : '' }} - Excellent location - <button @click="showFullMap = true" class="underline ml-1 hover:text-gray-600">show map</button>
          </div>
        </div>
        <div v-if="stayDetails?.rating" class="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg self-start md:self-center">
          <span class="text-xl font-bold mr-3">{{ stayDetails.rating.toFixed(1) }}</span>
          <span class="text-sm font-bold tracking-wider">Excellent</span>
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
          <div v-if="idx === 3 && stayPhotos.length > 5" class="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide border border-white/20">
            +{{ stayPhotos.length - 4 }} photos
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Nav -->
    <div class="container mx-auto px-4 mb-8">
      <div class="border-b border-gray-200 flex space-x-10">
        <button 
          v-for="tab in ['Overview', 'Apartment info and price', 'Hotel amenities']" 
          :key="tab"
          @click="activeTab = tab"
          class="relative py-4 text-xs font-bold tracking-wide transition-all"
          :class="activeTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-700'"
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
             <h2 class="text-2xl font-bold text-gray-900 mb-6">About the property</h2>
             <p class="text-sm font-bold text-gray-500 leading-relaxed">
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
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Hotel amenities</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-4">
            <div v-for="amenity in stayAmenities" :key="amenity.label" class="flex items-center text-[11px] font-bold text-gray-600">
              <svg class="w-3.5 h-3.5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              {{ amenity.label }}
            </div>
          </div>
        </div>

        <!-- Availability Banner (Sleek Redesign) -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative z-[20] flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex-shrink-0">
             <h3 class="text-gray-900 font-bold text-lg tracking-tight mb-0.5">Availability</h3>
             <p class="text-gray-500 text-xs font-medium">Change dates & guests to see prices</p>
          </div>
          
          <div class="flex flex-wrap md:flex-nowrap items-center gap-3 flex-1 w-full md:w-auto overflow-hidden bg-gray-50 rounded-xl p-1.5 border border-gray-100">
             <!-- Check-in -->
             <div class="bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm flex-1 min-w-[120px]">
                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Check-in</div>
                <input 
                  type="date" 
                  v-model="searchQuery.checkIn" 
                  :min="todayStr"
                  class="text-sm font-bold text-gray-900 bg-transparent border-none outline-none w-full cursor-pointer p-0"
                />
             </div>
             <!-- Check-out -->
             <div class="bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm flex-1 min-w-[120px]">
                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Check-out</div>
                <input 
                  type="date" 
                  v-model="searchQuery.checkOut" 
                  :min="searchQuery.checkIn || todayStr"
                  class="text-sm font-bold text-gray-900 bg-transparent border-none outline-none w-full cursor-pointer p-0"
                />
             </div>
             <!-- Rooms & Guests -->
             <div class="bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm flex-1 min-w-[140px] relative">
                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Guests</div>
                <button @click="showGuestPicker = !showGuestPicker" class="text-sm font-bold text-gray-900 w-full text-left truncate">
                  {{ searchQuery.rooms }} Room, {{ searchQuery.adults + searchQuery.children }} Guest{{ (searchQuery.adults + searchQuery.children) > 1 ? 's' : '' }}
                </button>
                <!-- Guest Picker Dropdown -->
                <div v-if="showGuestPicker" class="absolute top-full left-0 mt-3 z-[100] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-[260px] transform transition-all">
                  <div class="space-y-5">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-bold text-gray-800">Rooms</span>
                      <div class="flex items-center gap-3">
                        <button @click="searchQuery.rooms > 1 && searchQuery.rooms--" class="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">−</button>
                        <span class="text-sm font-bold w-4 text-center">{{ searchQuery.rooms }}</span>
                        <button @click="searchQuery.rooms++" class="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">+</button>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-bold text-gray-800">Adults</span>
                      <div class="flex items-center gap-3">
                        <button @click="searchQuery.adults > 1 && searchQuery.adults--" class="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">−</button>
                        <span class="text-sm font-bold w-4 text-center">{{ searchQuery.adults }}</span>
                        <button @click="searchQuery.adults++" class="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">+</button>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-bold text-gray-800">Children</span>
                      <div class="flex items-center gap-3">
                        <button @click="searchQuery.children > 0 && searchQuery.children--" class="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">−</button>
                        <span class="text-sm font-bold w-4 text-center">{{ searchQuery.children }}</span>
                        <button @click="searchQuery.children++" class="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                  <button @click="showGuestPicker = false" class="w-full mt-6 bg-gray-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 transition-all">Apply</button>
                </div>
             </div>
             
             <button 
                @click="handleUpdateSearch"
                :disabled="updatingSearch"
                class="bg-gray-900 text-white font-bold h-full px-6 py-2.5 rounded-lg text-sm tracking-wide hover:bg-gray-800 transition-all shadow-md active:scale-95 whitespace-nowrap disabled:opacity-50 h-[52px]"
             >
                {{ updatingSearch ? 'Loading...' : 'Update' }}
             </button>
          </div>
        </div>

        <!-- Room Type Table -->
        <div class="space-y-4">
          <div class="flex items-center mb-4 pl-2">
            <input type="checkbox" id="refundable" class="custom-checkbox" />
            <label for="refundable" class="text-xs font-bold tracking-wide text-gray-700 cursor-pointer ml-2">Show deals with refundable</label>
          </div>

          <!-- Loading rooms state -->
          <div v-if="updatingSearch" class="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div class="inline-block animate-spin h-8 w-8 border-4 border-gray-100 border-t-gray-900 rounded-full mb-4"></div>
            <p class="text-sm font-bold text-gray-500">Loading available rooms...</p>
          </div>

          <div v-else-if="rooms.length > 0" class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead class="bg-gray-900 text-white">
                <tr>
                  <th class="px-6 py-4 text-[11px] font-bold tracking-wide border-r border-white/10">Room type</th>
                  <th class="px-6 py-4 text-[11px] font-bold tracking-wide border-r border-white/10">No. of guests</th>
                  <th class="px-6 py-4 text-[11px] font-bold tracking-wide border-r border-white/10">Price for {{ diffDays }} nights</th>
                  <th class="px-6 py-4 text-[11px] font-bold tracking-wide">Your choices</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="room in rooms" :key="room.name" 
                    class="hover:bg-gray-50/50 transition-colors group cursor-pointer" 
                    :class="selectedRoom === room ? 'bg-green-50/30 ring-1 ring-green-200' : ''"
                    @click="selectedRoom = room">
                  <td class="px-6 py-8 align-top border-r border-gray-50 w-1/3">
                    <h4 class="text-gray-900 font-bold text-base mb-3 tracking-tight underline">{{ room.name }}</h4>
                    <div class="space-y-2">
                      <div v-for="(amenity, aIdx) in room.amenities?.slice(0, 5)" :key="aIdx" class="flex items-center text-sm font-bold text-gray-600">
                        <svg class="w-3.5 h-3.5 mr-2 text-green-600 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        {{ typeof amenity === 'string' ? amenity : (amenity as any).description }}
                      </div>
                    </div>
                    <button class="text-gray-500 text-[9px] font-bold tracking-wide mt-4 underline">See more details</button>
                  </td>
                  <td class="px-6 py-8 align-top border-r border-gray-50 text-center">
                    <svg class="w-6 h-6 text-gray-900 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                  </td>
                  <td class="px-6 py-8 align-top border-r border-gray-50">
                    <div class="text-xl font-bold text-gray-900 tracking-tighter mb-1">${{ Math.round(room.rates?.[0]?.priceWithCommission || 0) }}</div>
                    <div class="text-[9px] font-bold text-gray-400">Includes taxes and charges</div>
                  </td>
                  <td class="px-6 py-8 align-top space-y-3">
                    <div class="flex items-center text-sm font-bold text-gray-700">
                       <svg class="w-3.5 h-3.5 mr-2 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Non refundable
                    </div>
                    <div class="flex items-center text-sm font-bold text-gray-700">
                       <svg class="w-3.5 h-3.5 mr-2 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       No discount
                    </div>
                    <button 
                      v-if="selectedRoom === room"
                      class="mt-2 bg-green-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg"
                    >
                      ✓ Selected
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No rooms available -->
          <div v-else class="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <svg class="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            <p class="text-sm font-bold text-gray-500">No rooms available for these dates. Try changing your search.</p>
          </div>
        </div>
      </div>

      <!-- Right Summary Column -->
      <div class="space-y-6 lg:sticky lg:top-24">
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div class="bg-gray-900 px-6 py-4 border-b border-gray-900">
             <div class="text-base font-bold text-white tracking-wide">Booking Summary</div>
          </div>
          <div class="p-6">
            <div v-if="!selectedRoom" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <p class="text-sm font-bold text-gray-500">Please select a room to proceed</p>
            </div>
            <div v-else class="space-y-6">
              <div class="border-b border-gray-100 pb-6">
                <!-- <div class="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">{{ searchQuery.rooms }} Room Selection</div> -->
                <div class="text-sm font-bold text-gray-500 mb-1">{{ searchQuery.rooms }} {{ searchQuery.rooms > 1 ? 'rooms' : 'room' }} for {{ diffDays }} night{{ diffDays > 1 ? 's' : '' }}</div>
                <div class="text-[40px] leading-none font-bold text-gray-900 tracking-tighter mb-2">${{ Math.round((selectedRoom as any).rates?.[0]?.priceWithCommission || 0) }}</div>
                <div class="inline-flex items-center bg-gray-50 text-gray-600 text-[11px] font-bold px-2 py-1 rounded max-w-max border border-gray-100">
                  Includes taxes & charges
                </div>
              </div>
              
              <!-- Booking details summary -->
              <div class="space-y-4 pt-2 pb-4">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500 font-bold">Check-in</span>
                  <span class="font-bold text-gray-900 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">{{ formatDateShort(searchQuery.checkIn) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500 font-bold">Check-out</span>
                  <span class="font-bold text-gray-900 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">{{ formatDateShort(searchQuery.checkOut) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm mt-4 pt-4 border-t border-gray-50">
                  <span class="text-gray-500 font-bold">Guests</span>
                  <span class="font-bold text-gray-900">{{ searchQuery.adults }} adult{{ searchQuery.adults > 1 ? 's' : '' }}{{ searchQuery.children > 0 ? `, ${searchQuery.children} child${searchQuery.children > 1 ? 'ren' : ''}` : '' }}</span>
                </div>
              </div>

              <button 
                @click="handleReserve"
                :disabled="bookingInProgress"
                class="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-900/20 active:scale-[0.98] tracking-wide text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 border border-gray-800"
              >
                <div v-if="bookingInProgress" class="flex items-center gap-2">
                  <div class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  <span>Processing...</span>
                </div>
                <template v-else>
                  <span>Proceed to book</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </template>
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 border-dashed">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-gray-900 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p class="text-[11px] font-bold text-gray-700 leading-relaxed">Need help with your booking? Our 24/7 concierge is available to assist you with special requests.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bundle Modal -->
    <SecuredHotelModal 
      v-if="showBundleModal" 
      :stay="stayDetails" 
      :selectedRoom="selectedRoom"
      :quoteData="quoteData"
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
const showGuestPicker = ref(false);
const bookingInProgress = ref(false);
const updatingSearch = ref(false);
const quoteData = ref<any>(null);

const { loading, rooms, fetchStayRates, selectedRoom, stayDetails, fetchStayDetails, createQuote } = useStayDetails();

const stayId = route.params.id as string;
const provider = route.query.provider as string || 'duffel';

const todayStr = computed(() => new Date().toISOString().split('T')[0]);

const searchQuery = reactive({
  checkIn: (route.query.checkIn as string) || new Date().toISOString().split('T')[0],
  checkOut: (route.query.checkOut as string) || new Date(Date.now() + 86400000).toISOString().split('T')[0],
  rooms: Number(route.query.rooms) || 1,
  adults: Number(route.query.adults) || 2,
  children: Number(route.query.children) || 0,
});

const diffDays = computed(() => {
    const checkIn = (searchQuery.checkIn as string) || new Date().toISOString().split('T')[0];
    const checkOut = (searchQuery.checkOut as string) || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const start = new Date(String(checkIn));
    const end = new Date(String(checkOut));
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

const formatDateShort = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit' }).replace(',', '');
};

const handleUpdateSearch = async () => {
    updatingSearch.value = true;
    selectedRoom.value = null;
    try {
      await fetchStayRates(stayId, provider, searchQuery);
      if (rooms.value.length > 0) {
          selectedRoom.value = rooms.value[0];
      }
    } catch (err) {
      console.error('Failed to update search:', err);
    } finally {
      updatingSearch.value = false;
    }
};

const handleReserve = async () => {
    if (!selectedRoom.value) return;
    bookingInProgress.value = true;

    try {
      // Get the rate ID from the selected room
      const rateId = selectedRoom.value.rates?.[0]?.rateId || selectedRoom.value.id || selectedRoom.value.rateId;
      
      if (rateId) {
        // Try to create a quote first
        try {
          const quote = await createQuote(rateId, provider);
          quoteData.value = quote;
        } catch (quoteErr) {
          console.warn('Quote creation failed, proceeding without quote:', quoteErr);
          quoteData.value = null;
        }
      }

      // Show the bundle modal (flight upsell)
      showBundleModal.value = true;
    } catch (err) {
      console.error('Error during reservation:', err);
    } finally {
      bookingInProgress.value = false;
    }
};

// Close guest picker when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (showGuestPicker.value && !target.closest('.relative')) {
    showGuestPicker.value = false;
  }
};

// Map implementation
let map: any = null;

const initMap = () => {
    if (typeof window === 'undefined') return;
    const lat = stayDetails.value?.location?.latitude || 0;
    const lng = stayDetails.value?.location?.longitude || 0;

    if (!lat || !lng) return;

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
            fillColor: '#16a34a',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 10
        }
    });
};

onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
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
/* No blue overrides - text-gray-900 stays as actual dark gray/black */
input[type="date"] {
  -webkit-appearance: none;
  font-family: inherit;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.5;
}
</style>
