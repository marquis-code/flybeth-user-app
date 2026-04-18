<template>
  <nav 
    :class="[
      'fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 w-[calc(100%-32px)] max-w-7xl',
      isScrolled 
        ? 'bg-white/70 backdrop-blur-2xl border border-white/20 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[24px]' 
        : 'bg-white/40 backdrop-blur-md border border-white/10 py-4 lg:py-5 rounded-[28px]'
    ]"
  >
    <div class="px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <!-- Logo Area & Mobile Toggle -->
        <div class="flex items-center gap-4">
          <button @click="isMobileMenuOpen = true" class="lg:hidden p-3 bg-white/50 backdrop-blur-sm rounded-full border border-black/5 active:scale-90 transition-all">
            <Bars3Icon class="h-6 w-6 text-gray-900" />
          </button>
          
          <NuxtLink to="/" class="flex items-center group transition-all duration-500 hover:scale-105 active:scale-95">
            <div class="relative">
              <img src="@/assets/img/logo.png" class="h-8 lg:h-10 w-auto relative z-10" alt="Flybeth Logo" />
              <div class="absolute -inset-2 bg-secondary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center bg-neutral-900/5 px-2 py-1.5 rounded-full border border-black/5">
          <!-- Explore Travel Dropdown -->
          <div class="relative group">
            <button class="px-6 py-2.5 text-[14px] font-bold text-primary-dark tracking-tight hover:text-white hover:bg-neutral-900 rounded-full transition-all duration-500 flex items-center gap-2">
              Explore travel
              <ChevronDownIcon class="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            <div class="absolute left-0 top-[calc(100%+12px)] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-[200]">
              <div class="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[28px] p-3 w-64 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)]">
                <NuxtLink v-for="item in exploreLinks" :key="item.name" :to="item.path" class="flex items-center gap-4 px-4 py-3 hover:bg-neutral-900 hover:text-white rounded-[20px] transition-all group/item">
                  <div class="w-8 h-8 rounded-xl bg-gray-50 group-hover/item:bg-white/10 flex items-center justify-center transition-colors">
                    <component :is="item.icon" class="h-4 w-4" />
                  </div>
                  <span class="text-[13px] font-bold">{{ item.name }}</span>
                  <ChevronRightIcon v-if="item.hasArrow" class="h-3 w-3 ml-auto opacity-40" />
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <NuxtLink to="/help" class="px-6 py-2.5 text-[14px] font-bold text-primary-dark tracking-tight hover:text-white hover:bg-neutral-900 rounded-full transition-all duration-500 flex items-center gap-2">
             <QuestionMarkCircleIcon class="h-4 w-4 opacity-60" />
             Help center
          </NuxtLink>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden lg:flex items-center space-x-3">
          <!-- Regional Settings -->
          <button @click="showSettings = true" class="flex items-center gap-3 px-4 py-2 bg-white/50 border border-white rounded-full hover:bg-white transition-all group shadow-sm">
            <img :src="getFlag(locale)" class="h-3 w-5 object-cover rounded-sm shadow-sm" />
            <span class="text-[11px] font-black tracking-widest text-gray-900 uppercase opacity-80">{{ locale }} | {{ currentCurrency.code }}</span>
          </button>

          <!-- Call Support -->
          <div class="relative group">
            <button class="w-10 h-10 flex items-center justify-center bg-white/50 border border-white rounded-full hover:bg-primary hover:text-white transition-all group shadow-sm overflow-hidden">
              <PhoneIcon class="h-4 w-4" />
            </button>
            <div class="absolute right-0 top-[calc(100%+12px)] w-72 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-[110]">
              <div class="bg-white/90 backdrop-blur-2xl border border-white/20 p-8 rounded-[32px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)]">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <PhoneIcon class="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900 leading-tight">24/7 Priority Support</p>
                    <p class="text-[10px] font-black text-secondary tracking-widest uppercase mt-1">Global Concierge</p>
                  </div>
                </div>
                <a href="tel:+16462376851" class="block w-full text-center bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mb-4 shadow-lg shadow-primary/20">+1-646-237-6851</a>
                <div class="text-center p-3 bg-secondary/5 rounded-xl">
                    <p class="text-[10px] font-black text-secondary tracking-[0.2em] italic uppercase">PROMO: "DIAL10"</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-6 w-px bg-black/5 mx-2"></div>

          <!-- User Section -->
          <template v-if="user">
             <div class="flex items-center bg-white/50 border border-white p-1 rounded-full shadow-sm pl-4">
                <div class="flex flex-col items-end mr-3">
                   <span class="text-[13px] font-bold text-primary-dark leading-tight">{{ user?.firstName }} {{ user?.lastName }}</span>
                   <span class="text-[9px] font-black text-secondary tracking-[0.2em] uppercase opacity-70 italic">{{ user?.role?.name || 'Explorer' }}</span>
                </div>
                <div @click="showLogoutModal = true" class="h-8 w-8 rounded-full bg-white border border-black/5 flex items-center justify-center cursor-pointer hover:bg-red-50 hover:text-red-500 transition-all group">
                  <ArrowRightOnRectangleIcon class="h-4 w-4 group-hover:rotate-12 transition-transform" />
                </div>
             </div>
          </template>
          <template v-else>
            <button @click="openAuthModal" class="bg-gradient-to-r from-primary to-primary-dark px-8 py-3 rounded-full text-white text-[12px] font-bold tracking-tight transition-all hover:shadow-[0_10px_20px_-5px_rgba(25,33,81,0.3)] hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-primary/20">
               Join Flybeth
            </button>
          </template>
        </div>
        
        <!-- Mobile Right Actions -->
        <div class="flex lg:hidden items-center space-x-3">
          <button type="button" class="w-10 h-10 flex items-center justify-center bg-white border border-black/5 rounded-full relative active:scale-90 transition-all">
            <BellIcon class="h-5 w-5 text-gray-900" />
            <span class="absolute top-2 right-2 h-2.5 w-2.5 bg-secondary border-2 border-white rounded-full"></span>
          </button>
          <button v-if="!user" @click="openAuthModal" class="bg-primary px-6 py-2.5 rounded-full text-white text-[11px] font-bold tracking-tight shadow-lg shadow-primary/20 active:scale-95 transition-all">
            Sign in
          </button>
          <div v-else @click="showLogoutModal = true" class="h-10 w-10 rounded-full bg-white border border-black/5 flex items-center justify-center cursor-pointer active:scale-90 transition-all">
            <ArrowRightOnRectangleIcon class="h-4 w-4 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  </nav>

  <Teleport to="body">
      <!-- Mobile Slideout Overlay -->
      <div :class="['fixed inset-0 z-[999] lg:hidden transition-all duration-300', isMobileMenuOpen ? 'visible' : 'invisible']">
          <!-- Backdrop -->
          <div :class="['absolute inset-0 bg-neutral-900/20 backdrop-blur-sm transition-opacity duration-500', isMobileMenuOpen ? 'opacity-100' : 'opacity-0']" @click="isMobileMenuOpen = false"></div>
          
          <!-- Drawer -->
          <div :class="['absolute inset-y-4 left-4 w-[calc(100%-32px)] max-w-[360px] bg-white border border-white/20 flex flex-col transition-all duration-500 rounded-[32px] shadow-2xl', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[110%]']">
             <!-- Header -->
             <div class="p-8 flex justify-between items-center bg-white border-b border-black/5 rounded-t-[32px]">
                <img src="@/assets/img/logo.png" class="h-7 object-contain" alt="Flybeth Logo" />
                <button @click="isMobileMenuOpen = false" class="p-3 rounded-full bg-white border border-black/5 text-gray-400 hover:text-gray-900 transition-all active:scale-90">
                   <XMarkIcon class="h-5 w-5" />
                </button>
             </div>
             
             <!-- Body -->
             <div class="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
                <div class="space-y-2">
                   <p class="text-[10px] font-black uppercase text-secondary tracking-[0.3em] pl-4 mb-4 opacity-60">Adventure awaits</p>
                   <NuxtLink 
                     v-for="(item, idx) in exploreLinks" 
                     :key="item.name" 
                     :to="item.path" 
                     @click="isMobileMenuOpen = false" 
                     class="flex items-center gap-5 p-4 rounded-[24px] hover:bg-secondary/5 transition-all group"
                     :style="{ transitionDelay: `${idx * 50}ms`, transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)', opacity: isMobileMenuOpen ? 1 : 0 }"
                   >
                      <div class="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <component :is="item.icon" class="h-5 w-5 text-primary" />
                      </div>
                      <span class="text-base font-bold text-primary-dark group-hover:translate-x-1 transition-transform">{{ item.name }}</span>
                      <ChevronRightIcon class="h-4 w-4 ml-auto opacity-20" />
                   </NuxtLink>
                </div>
                
                <div class="pt-8 border-t border-black/5 space-y-3">
                   <button @click="[showSettings = true, isMobileMenuOpen = false]" class="flex items-center gap-5 w-full p-4 rounded-[24px] bg-neutral-50/50 border border-black/5 active:scale-95 transition-all">
                      <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-black/5 shadow-sm overflow-hidden">
                        <img :src="getFlag(locale)" class="h-full w-full object-cover" />
                      </div>
                      <div class="text-left">
                        <p class="text-[15px] font-bold text-primary-dark leading-tight">{{ locale }} | {{ currentCurrency.code }}</p>
                        <p class="text-[10px] font-black text-secondary uppercase tracking-widest mt-1 opacity-60">Preferences</p>
                      </div>
                   </button>
                   
                   <a href="tel:+16462376851" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-brand-blue/5 transition-colors group/util">
                      <div class="w-11 h-11 rounded-xl bg-brand-blue/5 flex items-center justify-center">
                        <PhoneIcon class="h-5 w-5 text-brand-blue" />
                      </div>
                      <div class="text-left">
                        <p class="text-[15px] font-bold text-gray-900 leading-tight">Call us</p>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">24/7 Support</p>
                      </div>
                   </a>
                </div>
             </div>
             
             <!-- Footer -->
             <div class="p-8 border-t border-black/5 bg-white rounded-b-[32px]">
                <div v-if="user" class="flex items-center justify-between p-5 bg-white rounded-[24px] border border-black/5 shadow-sm">
                   <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary/10 to-primary/10 flex items-center justify-center border border-black/5 font-bold text-secondary text-sm">
                        {{ user?.firstName?.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-bold text-primary-dark">{{ user?.firstName }} {{ user?.lastName }}</p>
                        <p class="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60 italic">{{ user?.role?.name || 'Explorer' }}</p>
                      </div>
                   </div>
                   <button @click="[showLogoutModal = true, isMobileMenuOpen = false]" class="p-3 text-red-500 bg-red-50/50 rounded-xl transition-all active:scale-90">
                      <ArrowRightOnRectangleIcon class="h-5 w-5" />
                   </button>
                </div>
                <button v-else @click="[openAuthModal(), isMobileMenuOpen = false]" class="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-5 rounded-[24px] font-bold text-sm tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-95">
                   Get Started Now
                </button>
             </div>
          </div>
      </div>
  </Teleport>

  <!-- Logout Confirmation Modal -->
  <ConfirmModal
    v-model:visible="showLogoutModal"
    variant="logout"
    title="Leaving so soon?"
    message="You're about to sign out of your Flybeth account. Any unsaved changes will be lost. We'll be here when you get back! ✈️"
    confirmText="Sign out"
    cancelText="Stay"
    @confirm="handleLogout"
  />

  <!-- Exit App Confirmation Modal -->
  <ConfirmModal
    v-model:visible="showExitModal"
    variant="exit"
    title="Wait, don't go!"
    message="You have an active session. Are you sure you want to leave Flybeth? Any unsaved searches or bookings in progress may be lost."
    confirmText="Leave"
    cancelText="Stay here"
    @confirm="confirmExit"
    @cancel="cancelExit"
  />
</template>

<script setup lang="ts">
import { ref, inject, type Ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/modules/auth/useAuth';
import { useRoute, useRouter } from 'vue-router'
import { 
  BellIcon, 
  ArrowRightOnRectangleIcon, 
  ChevronDownIcon,
  ChevronRightIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  HomeModernIcon as HotelIcon,
  KeyIcon as CarIcon,
  GiftIcon,
  MapIcon,
  TagIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const isMobileMenuOpen = ref(false)

const exploreLinks = [
  { name: 'Flights', path: '/flights', icon: PaperAirplaneIcon },
  { name: 'Hotels', path: '/stays', icon: HotelIcon },
  { name: 'Cars', path: '/cars', icon: CarIcon },
  { name: 'Packages', path: '/packages', icon: GiftIcon },
  { name: 'Explore', path: '/explore', icon: MapIcon },
  { name: 'Deals', path: '/deals', icon: TagIcon, hasArrow: true },
]

const megaDeals = [
  {
    title: 'Top Deals',
    links: ['Domestic flights', 'International flights', 'One way flights', 'Round trip flights', 'First class flights', 'Business class flights', 'Last minute flights', 'Flights to London']
  },
  {
    title: 'Travel by Region',
    links: ['Flights to Europe', 'Flights to India', 'Flights to Australia', 'Flights to France', 'Flights to Canada', 'Flights to Spain', 'Flights to Mexico', 'Flights to Paris']
  },
  {
    title: 'Travel by Price',
    links: ['Flights under $199', 'Flights under $99', 'Flights under $49', 'Flights under $29', 'Multi city flights', 'Hotels under $100', 'Vacations under $500', 'Flights to Madrid']
  }
]
import { useSettings } from '@/composables/useSettings'
import { useI18n } from 'vue-i18n'

const { user, logout, openAuthModal } = useAuth();
const { locale } = useI18n();
const { currentCurrency } = useSettings();
const showSettings = inject('showSettings') as Ref<boolean>;

const route = useRoute();
const router = useRouter();
const isScrolled = ref(false);
const showLogoutModal = ref(false);
const showExitModal = ref(false);

const getFlag = (code: string) => {
  const flags: Record<string, string> = {
    'en': 'https://flagcdn.com/us.svg',
    'es': 'https://flagcdn.com/es.svg',
    'fr': 'https://flagcdn.com/fr.svg',
    'de': 'https://flagcdn.com/de.svg',
    'ar': 'https://flagcdn.com/sa.svg',
    'zh': 'https://flagcdn.com/cn.svg',
    'ja': 'https://flagcdn.com/jp.svg',
    'pt': 'https://flagcdn.com/br.svg',
    'it': 'https://flagcdn.com/it.svg',
    'ko': 'https://flagcdn.com/kr.svg',
    'tr': 'https://flagcdn.com/tr.svg',
    'hi': 'https://flagcdn.com/in.svg'
  }
  return flags[code] || flags['en']
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
}

const handleLogout = () => {
  // Aggressively clear session cookies manually
  const userProfile = useCookie('user_profile')
  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')
  
  userProfile.value = null
  accessToken.value = null
  refreshToken.value = null

  // Even more aggressive: Clear all cookies for the current domain
  if (import.meta.client) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
       const cookie = cookies[i];
       const eqPos = cookie.indexOf("=");
       const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
       document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }

  logout();
  showLogoutModal.value = false;
  window.location.href = '/';
}

// Exit app confirmation (beforeunload)
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (user.value) {
    e.preventDefault();
    e.returnValue = 'You have an active session. Are you sure you want to leave?';
    return e.returnValue;
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('beforeunload', handleBeforeUnload);
  handleScroll(); 
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const confirmExit = () => {
  showExitModal.value = false;
}

const cancelExit = () => {
  showExitModal.value = false;
}
</script>

<style scoped>
/* Override shadow removal */
nav {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05) !important;
}

.isScrolled {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05) !important;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
