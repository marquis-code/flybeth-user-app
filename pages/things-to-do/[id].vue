<template>
  <div class="min-h-screen bg-[#f0f2f5]">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-[#0084ff] rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading experience...</p>
      </div>
    </div>

    <template v-else-if="activity">
      <!-- Hero Image Gallery -->
      <div class="relative h-[50vh] md:h-[60vh] overflow-hidden bg-gray-900">
        <img 
          v-if="currentPhoto" 
          :src="currentPhoto" 
          :alt="activity.name" 
          class="w-full h-full object-cover opacity-90 transition-all duration-700"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        <!-- Nav arrows for gallery -->
        <div v-if="activity.photos?.length > 1" class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-20">
          <button @click="prevPhoto" class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button @click="nextPhoto" class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Photo counter -->
        <div v-if="activity.photos?.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div class="bg-black/40 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span class="text-white text-xs font-bold">{{ currentPhotoIndex + 1 }} / {{ activity.photos.length }}</span>
          </div>
        </div>

        <!-- Breadcrumbs overlay -->
        <div class="absolute top-6 left-6 z-20">
          <div class="flex items-center text-white/70 text-xs font-medium">
            <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
            <svg class="w-3 h-3 mx-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <NuxtLink to="/things-to-do" class="hover:text-white transition-colors">Activities</NuxtLink>
            <svg class="w-3 h-3 mx-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span class="text-white/90 line-clamp-1 max-w-[200px]">{{ activity.name }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-20">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column - Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Title Card -->
            <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-2.5 py-1 bg-[#0084ff]/10 rounded-md text-[9px] font-bold text-[#0084ff] uppercase tracking-widest">
                  {{ activity.provider === 'hotelbeds-activities' ? 'Hotelbeds' : (activity.provider || 'Amadeus') }}
                </span>
                <span v-if="activity.minimumDuration" class="px-2.5 py-1 bg-gray-100 rounded-md text-[9px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ activity.minimumDuration }}
                </span>
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">{{ activity.name }}</h1>
              
              <!-- Rating -->
              <div v-if="activity.rating" class="flex items-center gap-2">
                <div class="flex">
                  <svg v-for="s in 5" :key="s" class="w-4 h-4" :class="s <= Math.round(activity.rating) ? 'text-amber-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <span class="text-sm font-bold text-gray-700">{{ activity.rating.toFixed(1) }} rating</span>
              </div>
            </div>

            <!-- Description Card -->
            <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#0084ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                About this experience
              </h2>
              <div 
                v-if="activity.description" 
                class="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                v-html="sanitizedDescription"
              ></div>
              <p v-else class="text-sm text-gray-500 italic">No description available for this experience.</p>
            </div>

            <!-- Photo Grid -->
            <div v-if="activity.photos?.length > 1" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#0084ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Gallery
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div 
                  v-for="(photo, idx) in activity.photos.slice(0, 6)" 
                  :key="idx" 
                  class="h-36 rounded-xl overflow-hidden cursor-pointer group"
                  @click="currentPhotoIndex = Number(idx)"
                >
                  <img :src="photo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Booking Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-6 overflow-hidden">
              <!-- Price Header -->
              <div class="bg-gradient-to-br from-[#0a1628] to-[#1a2b3d] p-6 text-white">
                <p class="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Starting from</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-3xl font-bold tracking-tight">${{ Math.round(activity.price || 0) }}</span>
                  <span class="text-sm font-medium text-white/60">{{ activity.currency || 'EUR' }}</span>
                </div>
                <p class="text-[10px] text-white/40 mt-1">per person</p>
              </div>

              <div class="p-6 space-y-5">
                <!-- Quick Info -->
                <div class="space-y-3">
                  <div v-if="activity.minimumDuration" class="flex items-center gap-3 text-sm text-gray-700">
                    <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4 text-[#0084ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">Duration</p>
                      <p class="text-xs text-gray-500">{{ activity.minimumDuration }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-gray-700">
                    <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">Instant Confirmation</p>
                      <p class="text-xs text-gray-500">Your booking is confirmed immediately</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-gray-700">
                    <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">Mobile Ticket</p>
                      <p class="text-xs text-gray-500">Show your ticket on your phone</p>
                    </div>
                  </div>
                </div>

                <!-- Book Button -->
                <button 
                  v-if="activity.bookingLink"
                  @click="handleBook"
                  class="w-full bg-[#0084ff] hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200/50 active:scale-[0.98] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                >
                  <span>Book Now</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
                <button 
                  v-else
                  @click="handleBookInternal"
                  class="w-full bg-[#0084ff] hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200/50 active:scale-[0.98] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                >
                  <span>Reserve Experience</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>

                <p class="text-[10px] text-gray-400 text-center">Free cancellation available on most experiences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Error / Not Found -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-[#0084ff]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Experience not found</h2>
        <p class="text-sm text-gray-500 mb-6">This activity may no longer be available.</p>
        <NuxtLink to="/things-to-do" class="bg-[#0084ff] text-white font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-blue-600 transition-all">
          Browse Activities
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { activitiesApi } from '@/api_factory/modules/activities';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const activity = ref<any>(null);
const currentPhotoIndex = ref(0);

const currentPhoto = computed(() => {
  return activity.value?.photos?.[currentPhotoIndex.value] || activity.value?.photos?.[0] || null;
});

const sanitizedDescription = computed(() => {
  // The API returns HTML descriptions. Strip dangerous tags but keep formatting.
  const desc = activity.value?.description || '';
  return desc.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
});

const nextPhoto = () => {
  if (!activity.value?.photos?.length) return;
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % activity.value.photos.length;
};

const prevPhoto = () => {
  if (!activity.value?.photos?.length) return;
  currentPhotoIndex.value = (currentPhotoIndex.value - 1 + activity.value.photos.length) % activity.value.photos.length;
};

const handleBook = () => {
  if (activity.value?.bookingLink) {
    window.open(activity.value.bookingLink, '_blank');
  }
};

const handleBookInternal = () => {
  router.push({
    path: '/checkout',
    query: {
      type: 'activity',
      id: activity.value?.experienceId,
      name: activity.value?.name,
      price: String(activity.value?.price || 0),
      currency: activity.value?.currency || 'EUR',
      provider: activity.value?.provider
    }
  });
};

onMounted(async () => {
  const id = route.params.id as string;
  const provider = (route.query.provider as string) || 'amadeus';

  loading.value = true;
  try {
    const { data: response } = await activitiesApi.getDetails(id, provider);
    const responseData = response?.data || response;
    activity.value = responseData;
  } catch (error) {
    console.error('Error fetching activity details:', error);
    // Fallback: try to get from session storage if passed from search
    const saved = sessionStorage.getItem('selectedActivity');
    if (saved) {
      activity.value = JSON.parse(saved);
    }
  } finally {
    loading.value = false;
  }
});
</script>
