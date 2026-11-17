<template>
  <div class="min-h-screen bg-[#F8FAFC]">
    
    <!-- Loading State -->
    <div v-if="loading" class="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-[#0D1DAD] rounded-full animate-spin mb-4"></div>
      <p class="text-sm font-bold text-gray-700 uppercase tracking-wider">Loading experience...</p>
    </div>

    <!-- Loaded Experience -->
    <template v-else-if="activity">
      
      <!-- ── 1. Top Sub-Navigation & Breadcrumbs ── -->
      <nav class="bg-white border-b border-gray-200 sticky top-[57px] lg:top-[65px] z-30 shadow-2xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <!-- Left: Back Button & Breadcrumbs -->
          <div class="flex items-center gap-3 min-w-0">
            <button 
              @click="router.back()" 
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700 font-bold text-xs transition-colors shrink-0"
              title="Go back"
            >
              <ChevronLeft class="w-4 h-4 text-gray-600" />
              <span>Back</span>
            </button>

            <div class="h-4 w-px bg-gray-200 shrink-0"></div>

            <!-- Clear, High-Contrast Breadcrumbs -->
            <div class="flex items-center gap-1.5 text-xs font-medium text-gray-500 truncate">
              <NuxtLink to="/" class="hover:text-[#0D1DAD] transition-colors shrink-0">Home</NuxtLink>
              <ChevronRight class="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <NuxtLink to="/things-to-do" class="hover:text-[#0D1DAD] transition-colors shrink-0">Things to do</NuxtLink>
              <ChevronRight class="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span class="text-gray-900 font-semibold truncate">{{ activity.name }}</span>
            </div>
          </div>

          <!-- Right: Share Action -->
          <div class="flex items-center gap-2 shrink-0">
            <button 
              @click="handleShare"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all shadow-2xs"
            >
              <Share2 class="w-3.5 h-3.5 text-gray-500" />
              <span class="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- ── 2. Experience Header & Title (Above the Gallery) ── -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div class="flex flex-col gap-2">
          
          <!-- Badges -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1 px-3 py-1 bg-[#0D1DAD]/10 border border-[#0D1DAD]/20 rounded-full text-[11px] font-bold text-[#0D1DAD] uppercase tracking-wider">
              <Sparkles class="w-3 h-3 text-[#0D1DAD]" />
              <span>Flybeth Verified Experience</span>
            </span>
            <span v-if="activity.category" class="px-2.5 py-1 bg-gray-100 rounded-full text-[11px] font-semibold text-gray-600">
              {{ activity.category }}
            </span>
          </div>

          <!-- Main Title -->
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mt-1">
            {{ activity.name }}
          </h1>

          <!-- Meta Row: Rating, Duration, Confirmation -->
          <div class="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-600 font-medium pt-1">
            <!-- Rating -->
            <div v-if="activity.rating" class="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
              <div class="flex items-center text-amber-500">
                <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span class="font-bold text-gray-900">{{ activity.rating.toFixed(1) }}</span>
              <span class="text-gray-500 text-xs">rating</span>
            </div>

            <!-- Duration -->
            <div v-if="activity.minimumDuration || activity.duration" class="flex items-center gap-1.5 text-gray-700">
              <Clock class="w-4 h-4 text-[#0D1DAD]" />
              <span>{{ activity.minimumDuration || activity.duration }}</span>
            </div>

            <!-- Instant Confirmation -->
            <div class="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>Instant Confirmation</span>
            </div>

            <!-- Mobile Ticket -->
            <div class="flex items-center gap-1.5 text-blue-700">
              <Smartphone class="w-4 h-4 text-blue-600" />
              <span>Mobile Ticket</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ── 3. Modern Multi-Photo Gallery ── -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <!-- Multi-photo layout -->
        <div v-if="activity.photos?.length > 1" class="grid grid-cols-1 md:grid-cols-4 gap-3.5 h-[340px] sm:h-[420px] lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 shadow-sm relative group">
          <!-- Main Large Photo (Left 2.5 cols) -->
          <div 
            class="md:col-span-2 lg:col-span-3 h-full relative cursor-pointer overflow-hidden bg-gray-100"
            @click="openLightbox(0)"
          >
            <img 
              :src="activity.photos[0]" 
              :alt="activity.name" 
              class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          <!-- Secondary Photos Stack (Right col) -->
          <div class="hidden md:grid md:grid-rows-2 gap-3.5 md:col-span-2 lg:col-span-1 h-full">
            <div 
              v-for="(photo, idx) in activity.photos.slice(1, 3)" 
              :key="idx"
              class="h-full relative cursor-pointer overflow-hidden bg-gray-100 rounded-xl"
              @click="openLightbox(idx + 1)"
            >
              <img 
                :src="photo" 
                :alt="`${activity.name} photo ${idx + 2}`" 
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              />
              <div class="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>
            </div>
          </div>

          <!-- View all photos badge button -->
          <button 
            @click="openLightbox(0)"
            class="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/95 hover:bg-white text-gray-900 font-bold text-xs rounded-xl shadow-lg border border-gray-200 backdrop-blur-md transition-all active:scale-95"
          >
            <Camera class="w-4 h-4 text-[#0D1DAD]" />
            <span>View all {{ activity.photos.length }} photos</span>
          </button>
        </div>

        <!-- Single Photo Fallback -->
        <div v-else-if="currentPhoto" class="h-[320px] sm:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 shadow-sm relative">
          <img :src="currentPhoto" :alt="activity.name" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- ── 4. Main Content & Booking Layout Grid ── -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- LEFT COLUMN: Experience Details (2 cols) -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Quick Highlights Strip -->
            <div class="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs">
              <h3 class="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-4">
                Experience Highlights
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div class="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                  <div class="w-9 h-9 rounded-lg bg-blue-50 text-[#0D1DAD] flex items-center justify-center shrink-0">
                    <Clock class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900">Duration</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ activity.minimumDuration || activity.duration || 'Flexible' }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                  <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900">Instant Confirmation</p>
                    <p class="text-xs text-gray-500 mt-0.5">Tickets delivered immediately</p>
                  </div>
                </div>

                <div class="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                  <div class="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Smartphone class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900">Mobile Ticket</p>
                    <p class="text-xs text-gray-500 mt-0.5">Show voucher on your smartphone</p>
                  </div>
                </div>

                <div class="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                  <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <ShieldCheck class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900">Free Cancellation</p>
                    <p class="text-xs text-gray-500 mt-0.5">Available on most experiences</p>
                  </div>
                </div>

              </div>
            </div>

            <!-- About This Experience Card -->
            <div class="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <span class="w-2 h-5 bg-[#0D1DAD] rounded-full"></span>
                <span>About this experience</span>
              </h2>
              
              <div 
                v-if="activity.description" 
                class="text-sm text-gray-600 leading-relaxed space-y-4 prose prose-sm max-w-none"
                v-html="sanitizedDescription"
              ></div>
              <p v-else class="text-sm text-gray-500 italic">
                No description available for this experience.
              </p>
            </div>

            <!-- What's Included Card -->
            <div class="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <span class="w-2 h-5 bg-[#0D1DAD] rounded-full"></span>
                <span>What to expect</span>
              </h2>

              <ul class="space-y-3 text-sm text-gray-600">
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-4 h-4 text-[#0D1DAD] shrink-0 mt-0.5" />
                  <span>Direct skip-the-line entrance to maximize your visit</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-4 h-4 text-[#0D1DAD] shrink-0 mt-0.5" />
                  <span>Verified local guide providing expert historical & cultural commentary</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-4 h-4 text-[#0D1DAD] shrink-0 mt-0.5" />
                  <span>Access to world-renowned exhibits and permanent collections</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-4 h-4 text-[#0D1DAD] shrink-0 mt-0.5" />
                  <span>24/7 Flybeth traveller customer care support</span>
                </li>
              </ul>
            </div>

            <!-- Additional Gallery Thumbnails (if > 3 photos) -->
            <div v-if="activity.photos?.length > 3" class="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <span class="w-2 h-5 bg-[#0D1DAD] rounded-full"></span>
                <span>Experience Gallery</span>
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div 
                  v-for="(photo, idx) in activity.photos.slice(0, 8)" 
                  :key="idx" 
                  class="h-28 rounded-xl overflow-hidden cursor-pointer group bg-gray-100"
                  @click="openLightbox(Number(idx))"
                >
                  <img :src="photo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Sticky Reserve Card (1 col) -->
          <div class="lg:col-span-1">
            <div class="sticky top-28 lg:top-32 bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-lg overflow-hidden">
              
              <!-- Clean Price Header -->
              <div class="p-6 pb-5 border-b border-gray-100 bg-gray-50/70">
                <p class="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-1">
                  Starting from
                </p>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-3xl sm:text-4xl font-black text-[#0D1DAD] tracking-tight">
                    {{ formatPrice(activity.priceWithCommission ?? activity.price ?? 0) }}
                  </span>
                  <span class="text-xs text-gray-500 font-bold">/ person</span>
                </div>
                <p class="text-[11px] text-gray-400 mt-1 font-medium">All taxes & fees included</p>
              </div>

              <!-- Card Body & Action -->
              <div class="p-6 space-y-5">
                
                <!-- Quick Guarantees -->
                <div class="space-y-2.5 text-xs text-gray-600 font-medium">
                  <div class="flex items-center gap-2">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free cancellation up to 24 hours prior</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant confirmation & e-voucher</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Best price guarantee</span>
                  </div>
                </div>

                <div class="h-px bg-gray-100"></div>

                <!-- Reserve Button in Brand Color #0D1DAD -->
                <button 
                  v-if="activity.bookingLink"
                  @click="handleBook"
                  class="w-full bg-[#0D1DAD] hover:bg-[#1A2ED4] text-white font-extrabold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#0D1DAD]/20 active:scale-[0.98] text-sm flex items-center justify-center gap-2 group"
                >
                  <span>Book on Partner Site</span>
                  <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  v-else
                  @click="handleBookInternal"
                  class="w-full bg-[#0D1DAD] hover:bg-[#1A2ED4] text-white font-extrabold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#0D1DAD]/20 active:scale-[0.98] text-sm flex items-center justify-center gap-2 group"
                >
                  <span>Reserve Experience</span>
                  <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <!-- Secure Guarantee -->
                <div class="flex items-center justify-center gap-2 pt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Secure Checkout</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- ── 5. Mobile Sticky Bottom Bar ── -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-xl">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Price</p>
            <p class="text-xl font-black text-[#0D1DAD]">
              {{ formatPrice(activity.priceWithCommission ?? activity.price ?? 0) }}
            </p>
          </div>
          <button 
            @click="activity.bookingLink ? handleBook() : handleBookInternal()"
            class="bg-[#0D1DAD] hover:bg-[#1A2ED4] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-[#0D1DAD]/20 active:scale-95"
          >
            {{ activity.bookingLink ? 'Book Now' : 'Reserve' }}
          </button>
        </div>
      </div>

      <!-- ── 6. Fullscreen Lightbox Modal ── -->
      <Transition name="fade">
        <div 
          v-if="lightboxOpen" 
          class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
          @click.self="lightboxOpen = false"
        >
          <!-- Close button -->
          <button 
            @click="lightboxOpen = false"
            class="absolute top-5 right-5 z-50 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X class="w-6 h-6" />
          </button>

          <!-- Prev button -->
          <button 
            v-if="activity.photos?.length > 1"
            @click="prevPhoto"
            class="absolute left-4 sm:left-8 z-50 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>

          <!-- Image Container -->
          <div class="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img 
              :src="activity.photos[lightboxIndex]" 
              :alt="activity.name" 
              class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
            <div class="mt-4 text-white/80 text-xs font-semibold">
              {{ lightboxIndex + 1 }} / {{ activity.photos.length }}
            </div>
          </div>

          <!-- Next button -->
          <button 
            v-if="activity.photos?.length > 1"
            @click="nextPhoto"
            class="absolute right-4 sm:right-8 z-50 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors"
          >
            <ChevronRight class="w-6 h-6" />
          </button>
        </div>
      </Transition>

    </template>

    <!-- Error / Not Found State -->
    <div v-else class="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div class="w-16 h-16 bg-blue-50 text-[#0D1DAD] rounded-2xl flex items-center justify-center mb-4">
        <Sparkles class="w-8 h-8" />
      </div>
      <h2 class="text-xl font-extrabold text-gray-900 mb-1">Experience not found</h2>
      <p class="text-sm text-gray-500 mb-6 max-w-sm">
        This activity may no longer be available or has changed.
      </p>
      <NuxtLink 
        to="/things-to-do" 
        class="bg-[#0D1DAD] hover:bg-[#1A2ED4] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-[#0D1DAD]/20"
      >
        Browse All Activities
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Clock, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  Share2, 
  Sparkles, 
  ArrowRight, 
  Camera, 
  X 
} from 'lucide-vue-next';
import { activitiesApi } from '@/api_factory/modules/activities';
import { useSettings } from '@/composables/useSettings';
import { useCustomToast } from '@/composables/core/useCustomToast';

const { formatPrice } = useSettings();
const { showToast } = useCustomToast();

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const activity = ref<any>(null);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const currentPhoto = computed(() => {
  return activity.value?.photos?.[0] || null;
});

const sanitizedDescription = computed(() => {
  const desc = activity.value?.description || '';
  return desc.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
});

const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const nextPhoto = () => {
  if (!activity.value?.photos?.length) return;
  lightboxIndex.value = (lightboxIndex.value + 1) % activity.value.photos.length;
};

const prevPhoto = () => {
  if (!activity.value?.photos?.length) return;
  lightboxIndex.value = (lightboxIndex.value - 1 + activity.value.photos.length) % activity.value.photos.length;
};

const handleShare = () => {
  if (typeof window !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    showToast({
      title: 'Link Copied',
      message: 'Experience link copied to your clipboard!',
      toastType: 'success'
    });
  }
};

const handleBook = () => {
  if (activity.value?.bookingLink) {
    window.open(activity.value.bookingLink, '_blank');
  }
};

/** Providers registered on the experiences endpoint */
const KNOWN_PROVIDERS = ['amadeus', 'hotelbeds-activities', 'viator', 'flybeth-activities'];
const DEFAULT_PROVIDER = 'flybeth-activities';

const normalizeProvider = (value: any): string => {
  const provider = typeof value === 'string' ? value.trim() : '';
  return KNOWN_PROVIDERS.includes(provider) ? provider : '';
};

const handleBookInternal = () => {
  const current = activity.value;
  if (!current) return;
  if (import.meta.client) {
    sessionStorage.setItem('flybeth_checkout_payload', JSON.stringify({
      type: 'activity',
      id: current.experienceId || current.id,
      experienceId: current.experienceId || current.id,
      provider: current.provider || DEFAULT_PROVIDER,
      name: current.name,
      price: Number(current.price) || 0,
      priceWithCommission: Number(current.priceWithCommission ?? current.price) || 0,
      currency: 'USD',
      ...(current.date ? { date: current.date } : {}),
      ...(current.minimumDuration || current.duration
        ? { duration: current.minimumDuration || current.duration }
        : {})
    }));
    sessionStorage.setItem('selectedActivity', JSON.stringify(current));
  }
  router.push({ path: '/checkout' });
};

const readSelectedActivity = (): any => {
  if (!import.meta.client) return null;
  try {
    const saved = sessionStorage.getItem('selectedActivity');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (e) {
    console.error('Failed to parse selectedActivity', e);
    return null;
  }
};

const fetchDetails = async (id: string, provider: string) => {
  const { data: response } = await activitiesApi.getDetails(id, provider);
  const details = (response as any)?.data ?? response;
  return details && typeof details === 'object' ? details : null;
};

const recoverPriceWithCommission = async (record: any) => {
  if (!record || record.priceWithCommission != null) return;
  const lat = record.latitude ?? record.geoCode?.latitude;
  const lon = record.longitude ?? record.geoCode?.longitude;
  if (typeof lat !== 'number' || typeof lon !== 'number') return;
  try {
    const { data } = await activitiesApi.searchLive({ latitude: lat, longitude: lon, radius: 50 });
    const payload = (data as any)?.data ?? data;
    const list = Array.isArray(payload)
      ? payload
      : (Array.isArray(payload?.results) ? payload.results : []);
    const match = list.find((item: any) => item?.experienceId === record.experienceId && item?.priceWithCommission != null)
      || list.find((item: any) => item?.name === record.name && item?.priceWithCommission != null);
    if (match?.priceWithCommission != null) {
      record.priceWithCommission = match.priceWithCommission;
    }
  } catch (e) {
    console.warn('Could not resolve customer-facing price', e);
  }
};

onMounted(async () => {
  const id = route.params.id as string;

  const stored = readSelectedActivity();
  if (stored) {
    activity.value = stored;
  }

  const routeProvider = normalizeProvider(
    Array.isArray(route.query.provider) ? route.query.provider[0] : route.query.provider
  );
  const provider = routeProvider || normalizeProvider(stored?.provider) || DEFAULT_PROVIDER;

  loading.value = true;
  let details: any = null;
  try {
    details = await fetchDetails(id, provider);
  } catch (error) {
    console.error('Error fetching activity details:', error);
    if (provider !== DEFAULT_PROVIDER) {
      try {
        details = await fetchDetails(id, DEFAULT_PROVIDER);
      } catch (retryError) {
        console.error('Retry against flybeth-activities failed:', retryError);
      }
    }
  } finally {
    loading.value = false;
  }

  if (details && (details.experienceId || details.name)) {
    const merged: any = { ...(stored || {}), ...details };
    if (merged.priceWithCommission == null && stored?.priceWithCommission != null) {
      merged.priceWithCommission = stored.priceWithCommission;
    }
    activity.value = merged;
    recoverPriceWithCommission(merged);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
