<template>
  <section class="py-20 bg-white relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0084ff]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div class="h-8 w-8 bg-[#0084ff]/10 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-[#0084ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span class="text-[10px] font-bold text-[#0084ff] uppercase tracking-[0.2em]">Things to do</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight mb-2">Discover Activities & Experiences</h2>
          <p class="text-sm text-gray-500 max-w-lg">Unforgettable tours, excursions, and things to do at your destination — powered by local experts.</p>
        </div>
        <NuxtLink to="/things-to-do" class="flex items-center gap-2 text-[#0084ff] text-xs font-bold uppercase tracking-widest hover:underline transition-all group shrink-0">
          View all activities
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="rounded-2xl bg-gray-100 animate-pulse h-[380px]"></div>
      </div>

      <!-- Activities Grid -->
      <div v-else-if="activities.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(activity, idx) in activities.slice(0, 4)"
          :key="activity.experienceId || idx"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer flex flex-col"
          @click="goToActivity(activity)"
        >
          <!-- Image -->
          <div class="h-48 bg-gray-100 overflow-hidden relative">
            <img 
              v-if="activity.photos?.[0]" 
              :src="activity.photos[0]" 
              :alt="activity.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <svg class="w-12 h-12 text-[#0084ff]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <!-- Provider badge -->
            <div class="absolute top-3 left-3">
              <span class="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[8px] font-bold text-gray-700 uppercase tracking-wider border border-white/30 shadow-sm">
                {{ activity.provider === 'hotelbeds-activities' ? 'Hotelbeds' : activity.provider }}
              </span>
            </div>
            <!-- Duration badge -->
            <div v-if="activity.minimumDuration" class="absolute bottom-3 right-3">
              <span class="px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[8px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ activity.minimumDuration }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 flex-1 flex flex-col">
            <h4 class="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#0084ff] transition-colors">{{ activity.name }}</h4>
            
            <p v-if="activity.shortDescription" class="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-4">{{ activity.shortDescription }}</p>

            <!-- Rating -->
            <div v-if="activity.rating" class="flex items-center gap-1.5 mb-4">
              <div class="flex">
                <svg v-for="s in 5" :key="s" class="w-3.5 h-3.5" :class="s <= Math.round(activity.rating) ? 'text-amber-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <span class="text-[10px] font-bold text-gray-500">{{ activity.rating.toFixed(1) }}</span>
            </div>

            <!-- Price & CTA -->
            <div class="mt-auto flex items-end justify-between pt-3 border-t border-gray-50">
              <div>
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">From</span>
                <span class="text-lg font-bold text-gray-900">${{ Math.round(activity.price || 0) }}</span>
                <span class="text-[10px] text-gray-400 font-medium"> / person</span>
              </div>
              <button 
                @click.stop="goToActivity(activity)"
                class="px-3 py-2 bg-[#0084ff]/10 text-[#0084ff] text-[10px] font-bold rounded-lg hover:bg-[#0084ff] hover:text-white transition-all uppercase tracking-wider"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
        </div>

        <!-- View More Button -->
        <div class="text-center mt-10">
          <NuxtLink 
            to="/things-to-do"
            class="inline-flex items-center gap-2.5 bg-[#0084ff] hover:bg-blue-600 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-blue-200/50 active:scale-[0.98] uppercase tracking-widest text-sm group"
          >
            View {{ totalCount > 4 ? totalCount - 4 : '' }} More Experiences
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </NuxtLink>
          <p class="text-xs text-gray-400 mt-3">Discover tours, excursions and more at your destination</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
        <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-[#0084ff]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Discovering activities...</p>
        <p class="text-xs text-gray-400 max-w-sm mx-auto">We're finding the best tours and experiences near your location.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { activitiesApi } from '@/api_factory/modules/activities';

const router = useRouter();
const loading = ref(true);
const activities = ref<any[]>([]);
const totalCount = ref(0);

const goToActivity = (activity: any) => {
  sessionStorage.setItem('selectedActivity', JSON.stringify(activity));
  router.push({
    path: `/things-to-do/${activity.experienceId}`,
    query: { provider: activity.provider }
  });
};

const fetchActivities = async () => {
  loading.value = true;
  try {
    // Try fetching with popular coordinates (Paris - rich in activities)
    const payload = {
      latitude: 48.8566,
      longitude: 2.3522,
      radius: 30
    };

    const { data: response } = await activitiesApi.searchLive(payload);
    const responseData = response?.data || response;
    const results = responseData?.results || (Array.isArray(responseData) ? responseData : []);
    totalCount.value = results.length;
    activities.value = results;
    // Save all results so the listing page can use them immediately
    sessionStorage.setItem('trendingActivities', JSON.stringify(results));

    // If no results, try with another location
    if (activities.value.length === 0) {
      const fallbackPayload = {
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 30
      };
      const { data: fallbackResponse } = await activitiesApi.searchLive(fallbackPayload);
      const fallbackData = fallbackResponse?.data || fallbackResponse;
      const fallbackResults = fallbackData?.results || (Array.isArray(fallbackData) ? fallbackData : []);
      totalCount.value = fallbackResults.length;
      activities.value = fallbackResults;
      sessionStorage.setItem('trendingActivities', JSON.stringify(fallbackResults));
    }
  } catch (error) {
    console.error('Error fetching activities:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchActivities();
});
</script>
