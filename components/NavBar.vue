<template>
  <nav 
    :class="[
      isScrolled ? 'bg-white/90 backdrop-blur-xl py-3 border-b border-gray-100' : 'bg-white/95 backdrop-blur-sm py-3 lg:py-5',
      'fixed w-full top-0 z-[100] transition-all duration-500 font-body'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center transition-all duration-500">
        <!-- Logo Area & Mobile Toggle -->
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="isMobileMenuOpen = true" class="lg:hidden p-2 -ml-2 text-gray-900 rounded-md hover:bg-brand-blue/5">
            <Bars3Icon class="h-6 w-6" />
          </button>
          
          <NuxtLink to="/" class="flex items-center group">
            <img src="@/assets/img/logo.png" class="h-8 lg:h-10 w-auto mr-1 lg:mr-3 group-hover:scale-105 transition-transform duration-500" alt="Flybeth Logo" />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation Hidden on Mobile -->
        <div class="hidden lg:flex items-center gap-6">
          <div class="relative group">
            <button class="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide text-gray-900 bg-white border border-brand-blue/10 hover:border-brand-blue/40 transition-all group">
              Explore travel
              <ChevronDownIcon class="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            <div class="absolute left-0 top-full mt-2 flex invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-[200]">
              <div class="bg-white border border-gray-100 rounded-2xl p-2 py-3 w-56 overflow-visible relative shadow-2xl">
                <NuxtLink v-for="item in exploreLinks" :key="item.name" :to="item.path" class="flex items-center gap-3 px-4 py-3 hover:bg-brand-blue/5 rounded-xl transition-colors group/item relative">
                  <component :is="item.icon" class="h-4 w-4 text-gray-900 group-hover/item:text-brand-blue" />
                  <span class="text-xs font-medium text-gray-900 group-hover/item:text-brand-blue">{{ item.name }}</span>
                  <ChevronRightIcon v-if="item.hasArrow" class="h-3 w-3 ml-auto text-gray-300" />
                  
                  <div v-if="item.name === 'Deals'" class="absolute left-full top-[-12px] h-fit w-[640px] bg-white border border-gray-100 border-l-0 rounded-r-2xl p-8 flex gap-8 invisible group-hover/item:visible opacity-0 group-hover/item:opacity-100 transition-all duration-300 z-[210] ml-[-1px] shadow-2xl">
                    <div v-for="col in megaDeals" :key="col.title" class="flex-1">
                      <h4 class="text-xs font-bold tracking-widest text-gray-400 mb-6 border-b border-gray-50 pb-2 italic">{{ col.title }}</h4>
                      <ul class="space-y-4">
                        <li v-for="link in col.links" :key="link">
                          <NuxtLink to="/explore" class="text-xs font-semibold text-brand-gray/60 hover:text-brand-blue transition-colors block">{{ link }}</NuxtLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <NuxtLink to="/help" class="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide text-gray-900 bg-white border border-brand-blue/10 hover:border-brand-blue/40 transition-all">
             <QuestionMarkCircleIcon class="h-4 w-4 text-brand-blue/60" />
             Help center
          </NuxtLink>
        </div>

        <!-- Desktop User Actions-->
        <div class="hidden lg:flex items-center space-x-6">
          <button @click="showSettings = true" class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-100 hover:border-brand-blue/40 hover:bg-brand-blue/5 transition-all group">
            <img :src="getFlag(locale)" class="h-3 w-5 object-cover rounded shadow-sm" />
            <span class="text-xs font-bold tracking-wider text-gray-900 uppercase">{{ locale }} | {{ currentCurrency.code }}</span>
            <ChevronDownIcon class="h-3 w-3 text-brand-gray group-hover:text-gray-900 transition-colors" />
          </button>

          <div class="relative group">
            <button class="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/10 hover:border-brand-blue/30 bg-white hover:bg-brand-blue/5 transition-all group-hover:scale-105 shadow-sm">
              <PhoneIcon class="h-3 w-3 text-brand-blue" />
              <span class="text-sm font-semibold text-gray-900">Call us</span>
            </button>
            <div class="absolute right-0 top-full mt-3 w-72 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[110]">
              <div class="bg-white border border-gray-100 p-6 rounded-3xl shadow-2xl relative">
                <div class="flex items-center gap-3 mb-5">
                  <div class="w-10 h-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center">
                    <PhoneIcon class="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900 leading-tight">24/7 Support</p>
                    <p class="text-[11px] font-bold text-brand-blue/60 italic leading-tight">Exclusive rates</p>
                  </div>
                </div>
                <a href="tel:+16462376851" class="block w-full text-center bg-brand-blue text-white py-3.5 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all mb-2 shadow-lg shadow-brand-blue/20">+1-646-237-6851</a>
                <p class="text-center text-[10px] font-bold text-gray-400 mb-5 tracking-widest italic uppercase">Mention "DIAL10"</p>
              </div>
            </div>
          </div>

          <button type="button" :class="[isScrolled ? 'text-gray-900' : 'text-gray-900', 'p-2 rounded-full hover:bg-brand-blue/5 transition-colors relative']">
            <BellIcon class="h-6 w-6" />
            <span class="absolute top-2 right-2 h-2.5 w-2.5 bg-brand-green rounded-full ring-2 ring-white"></span>
          </button>
          
          <template v-if="token">
             <div class="flex items-center gap-4">
               <div class="flex flex-col items-end">
                 <span class="text-gray-900 text-sm font-bold">{{ user?.firstName }} {{ user?.lastName }}</span>
                 <span class="text-brand-blue/60 text-[10px] font-bold tracking-widest italic uppercase">Explorer</span>
               </div>
               <div @click="showLogoutModal = true" class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-red-50 hover:text-red-500 group transition-all duration-500 border border-gray-100 p-1">
                 <ArrowRightOnRectangleIcon class="h-5 w-5 group-hover:rotate-12 transition-transform" />
               </div>
             </div>
          </template>
          <template v-else>
            <button @click="openAuthModal" class="relative bg-brand-green px-8 py-3 rounded-full text-white text-xs font-bold tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-green/20 overflow-hidden group">
               <span class="relative z-10">Sign in</span>
               <div class="absolute inset-0 bg-brand-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </template>
        </div>
        
        <!-- Mobile Right Actions -->
        <div class="flex lg:hidden items-center space-x-3">
          <button type="button" class="p-1.5 text-gray-900 rounded-full relative hover:bg-brand-blue/5">
            <BellIcon class="h-6 w-6" />
            <span class="absolute top-2 right-2 h-2 w-2 bg-brand-green rounded-full ring-2 ring-white"></span>
          </button>
          <button v-if="!token" @click="openAuthModal" class="bg-brand-green px-5 py-2 rounded-full text-white text-[10px] font-bold tracking-widest whitespace-nowrap shadow-md">
            Sign in
          </button>
          <div v-else @click="showLogoutModal = true" class="h-9 w-9 rounded-full bg-brand-blue/10 flex items-center justify-center cursor-pointer text-gray-900 border border-brand-blue/10">
            <ArrowRightOnRectangleIcon class="h-4 w-4" />
          </div>
        </div>
      </div>
      
    </div>
  </nav>

  <Teleport to="body">
      <!-- Mobile Slideout Overlay (End-to-End Fix) -->
      <div :class="['fixed inset-0 z-[999] lg:hidden transition-all duration-300', isMobileMenuOpen ? 'visible' : 'invisible']">
          <!-- Dark Backdrop -->
          <div :class="['absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300', isMobileMenuOpen ? 'opacity-100' : 'opacity-0']" @click="isMobileMenuOpen = false"></div>
          
          <!-- Side Drawer -->
          <div :class="['absolute inset-y-0 left-0 w-[85%] max-w-[340px] bg-white flex flex-col transition-transform duration-300 shadow-2xl', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full']">
             <!-- Header -->
             <div class="p-6 flex justify-between items-center border-b border-gray-50">
                <img src="@/assets/img/logo.png" class="h-8 object-contain" alt="Flybeth Logo" />
                <button @click="isMobileMenuOpen = false" class="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
                   <XMarkIcon class="h-5 w-5" />
                </button>
             </div>
             
             <!-- Body Links -->
             <div class="flex-1 overflow-y-auto px-6 py-8 space-y-8">
                <!-- Main Nav -->
                <div class="space-y-1">
                   <h3 class="text-[10px] font-bold uppercase text-gray-400 tracking-widest pl-3 mb-4 italic">Explore</h3>
                   <NuxtLink 
                     v-for="item in exploreLinks" 
                     :key="item.name" 
                     :to="item.path" 
                     @click="isMobileMenuOpen = false" 
                     class="flex items-center gap-4 p-3 rounded-2xl hover:bg-brand-blue/5 transition-colors group/link"
                   >
                      <div class="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center group-hover/link:bg-brand-blue/10 group-hover/link:text-brand-blue transition-all">
                        <component :is="item.icon" class="h-5 w-5" />
                      </div>
                      <span class="text-[15px] font-bold text-gray-900">{{ item.name }}</span>
                   </NuxtLink>
                </div>
                
                <!-- Utilities -->
                <div class="border-t border-gray-50 pt-8 space-y-1">
                   <h3 class="text-[10px] font-bold uppercase text-gray-400 tracking-widest pl-3 mb-4 italic">Support</h3>
                   <button @click="[showSettings = true, isMobileMenuOpen = false]" class="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-brand-blue/5 transition-colors group/util">
                      <div class="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover/util:border-brand-blue/20">
                        <img :src="getFlag(locale)" class="h-4 w-6 rounded shadow-sm object-cover" />
                      </div>
                      <div class="text-left">
                        <p class="text-[15px] font-bold text-gray-900 leading-tight">{{ locale }} | {{ currentCurrency.code }}</p>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Region settings</p>
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
             
             <!-- Footer Auth Panel -->
             <div class="p-6 border-t border-gray-100 bg-gray-50/50">
                <div v-if="token" class="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                   <div>
                     <p class="text-sm font-bold text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</p>
                     <p class="text-[10px] font-bold text-brand-blue uppercase tracking-widest italic">Explorer</p>
                   </div>
                   <button @click="[showLogoutModal = true, isMobileMenuOpen = false]" class="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <ArrowRightOnRectangleIcon class="h-5 w-5" />
                   </button>
                </div>
                <button v-else @click="[openAuthModal(), isMobileMenuOpen = false]" class="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-sm tracking-widest transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-3">
                   <ArrowRightOnRectangleIcon class="h-5 w-5" />
                   Sign in / Register
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

const { token, user, logout, openAuthModal } = useAuth();
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
  logout();
  showLogoutModal.value = false;
  router.push('/');
}

// Exit app confirmation (beforeunload)
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (token.value) {
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
.font-body {
  font-family: 'Inter', sans-serif;
}
</style>
