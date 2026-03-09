<template>
  <nav 
    :class="[
      isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3 border-b border-gray-100' : 'bg-white/60 backdrop-blur-sm py-5',
      'fixed w-full top-0 z-[100] transition-all duration-500 font-body'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center transition-all duration-500">
        <!-- Logo Area -->
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-center group">
            <img src="@/assets/img/logo.png" class="h-10 w-auto mr-3 drop-shadow-lg group-hover:scale-110 transition-transform duration-500" alt="Flybeth Logo" />
          </NuxtLink>
          
          <!-- Explore Travel Dropdown -->
          <div class="relative group">
            <button class="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-blue bg-white border border-brand-blue/20 hover:border-brand-blue/40 shadow-sm transition-all group">
              Explore Travel
              <ChevronDownIcon class="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            
            <div class="absolute left-0 top-full mt-2 flex invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-[200]">
              <!-- Main Categories -->
              <div class="bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 py-3 w-56 overflow-visible relative">
                <NuxtLink 
                  v-for="item in exploreLinks" 
                  :key="item.name" 
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-brand-blue/5 rounded-xl transition-colors group/item relative"
                  @mouseenter="activeSubMenu = item.name === 'Deals' ? 'Deals' : null"
                >
                  <component :is="item.icon" class="h-4 w-4 text-brand-blue/60 group-hover/item:text-brand-blue" />
                  <span class="text-xs font-black text-brand-blue/80 group-hover/item:text-brand-blue">{{ item.name }}</span>
                  <ChevronRightIcon v-if="item.hasArrow" class="h-3 w-3 ml-auto text-gray-300" />
                  
                  <!-- Deals Mega Menu Expansion (Persistent on hover) -->
                  <div 
                    v-if="item.name === 'Deals'"
                    class="absolute left-full top-[-12px] h-fit w-[640px] bg-white border border-gray-100 border-l-0 rounded-r-2xl shadow-2xl p-8 flex gap-8 invisible group-hover/item:visible opacity-0 group-hover/item:opacity-100 transition-all duration-300 z-[210] ml-[-1px]"
                  >
                    <div v-for="col in megaDeals" :key="col.title" class="flex-1">
                      <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue mb-6 border-b border-gray-50 pb-2">{{ col.title }}</h4>
                      <ul class="space-y-4">
                        <li v-for="link in col.links" :key="link">
                          <NuxtLink to="/explore" class="text-xs font-bold text-brand-gray/60 hover:text-brand-blue transition-colors block">
                            {{ link }}
                          </NuxtLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <NuxtLink to="/help" class="hidden sm:flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-blue bg-white border border-brand-blue/20 hover:border-brand-blue/40 shadow-sm transition-all">
             <QuestionMarkCircleIcon class="h-3 w-3" />
             Help
          </NuxtLink>
        </div>

        <!-- Desktop Navigation Hidden as requested -->
        <div class="hidden lg:flex items-center space-x-1">
          <!-- Separator or spacer if needed -->
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-6">
          <!-- Language & Currency Switcher -->
          <button 
            @click="showSettings = true"
            class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-100 hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all group"
          >
            <img :src="getFlag(locale)" class="h-3 w-5 object-cover rounded shadow-sm" />
            <span class="text-[10px] font-black uppercase tracking-widest text-brand-blue">{{ locale }} | {{ currentCurrency.code }}</span>
            <ChevronDownIcon class="h-3 w-3 text-brand-gray group-hover:text-brand-blue transition-colors" />
          </button>

          <!-- Call Us Popover -->
          <div class="relative group hidden sm:block">
            <button class="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/10 hover:border-brand-blue/30 bg-white hover:bg-brand-blue/5 transition-all group-hover:scale-105">
              <PhoneIcon class="h-3 w-3 text-brand-blue" />
              <span class="text-[10px] font-black uppercase tracking-widest text-brand-blue">Call Us</span>
            </button>
            
            <!-- Popover -->
            <div class="absolute right-0 top-full mt-3 w-72 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[110]">
              <div class="bg-white/95 backdrop-blur-xl border border-gray-100 p-6 rounded-3xl shadow-2xl overflow-hidden relative">
                <div class="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full -mr-12 -mt-12"></div>
                
                <div class="flex items-center gap-3 mb-5">
                  <div class="w-10 h-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
                    <PhoneIcon class="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-brand-blue uppercase tracking-widest leading-tight">24/7 Expert Support</p>
                    <p class="text-[11px] font-bold text-brand-gray/60 italic leading-tight">Get Exclusive Phone Rates</p>
                  </div>
                </div>
                
                <a href="tel:+16462376851" class="block w-full text-center bg-brand-blue text-white py-3.5 rounded-2xl font-black text-lg shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:scale-[1.02] transition-all mb-2">
                  +1-646-237-6851
                </a>
                <p class="text-center text-[10px] font-bold text-brand-gray/40 mb-5 uppercase tracking-tighter">Mention "DIAL10" for $10 Credit</p>
                
                <div class="space-y-2.5 pt-4 border-t border-gray-50">
                  <div v-for="prop in ['Private Unlisted Fares', 'Free Cancellation Help', 'Priority Rebooking']" :key="prop" class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckIcon class="h-2.5 w-2.5 text-green-600" />
                    </div>
                    <span class="text-[10px] font-bold text-brand-blue">{{ prop }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            :class="[isScrolled ? 'text-brand-blue' : 'text-brand-blue/70', 'p-2 rounded-full hover:bg-brand-blue/5 transition-colors relative']"
          >
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" />
            <span class="absolute top-2 right-2 h-2 w-2 bg-brand-green rounded-full ring-2 ring-white"></span>
          </button>
          
          <template v-if="token">
             <div class="flex items-center gap-4">
               <div class="hidden sm:flex flex-col items-end">
                 <span class="text-brand-blue text-sm font-black transition-colors duration-500">{{ user?.firstName }} {{ user?.lastName }}</span>
                 <span class="text-brand-gray/40 text-[10px] uppercase font-black tracking-widest">Explorer</span>
               </div>
               <div @click="showLogoutModal = true" class="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center cursor-pointer hover:bg-red-500 group transition-all duration-500">
                 <ArrowRightOnRectangleIcon class="h-5 w-5 text-brand-blue group-hover:text-white" />
               </div>
             </div>
          </template>
          <template v-else>
            <button 
              @click="openAuthModal" 
              class="relative bg-brand-green px-8 py-3 rounded-full text-brand-blue text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-green/20 overflow-hidden group"
            >
               <span class="relative z-10 transition-colors group-hover:text-white">Sign In</span>
               <div class="absolute inset-0 bg-brand-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <!-- Logout Confirmation Modal -->
  <ConfirmModal
    v-model:visible="showLogoutModal"
    variant="logout"
    title="Leaving so soon?"
    message="You're about to sign out of your Flybeth account. Any unsaved changes will be lost. We'll be here when you get back! ✈️"
    confirmText="Sign Out"
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
    cancelText="Stay Here"
    @confirm="confirmExit"
    @cancel="cancelExit"
  />
</template>

<script setup lang="ts">
import { ref, inject, type Ref } from 'vue'
import { useAuth } from '@/composables/modules/auth/useAuth';
import { 
  BellIcon, 
  ArrowRightOnRectangleIcon, 
  ChevronDownIcon,
  ChevronRightIcon,
  PhoneIcon,
  CheckIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  HomeModernIcon as HotelIcon,
  KeyIcon as CarIcon,
  GiftIcon,
  MapIcon,
  TagIcon
} from '@heroicons/vue/24/outline'

const exploreLinks = [
  { name: 'Flights', path: '/flights', icon: PaperAirplaneIcon },
  { name: 'Hotels', path: '/stays', icon: HotelIcon },
  { name: 'Cars', path: '/cars', icon: CarIcon },
  { name: 'Packages', path: '/packages', icon: GiftIcon },
  { name: 'Explore', path: '/explore', icon: MapIcon },
  { name: 'Deals', path: '/deals', icon: TagIcon, hasArrow: true },
]

const activeSubMenu = ref<string | null>(null)

const megaDeals = [
  {
    title: 'Top Deals',
    links: ['Domestic Flights', 'International Flights', 'One Way Flights', 'Round Trip Flights', 'First Class Flights', 'Business Class Flights', 'Last Minute Flights', 'Flights to London']
  },
  {
    title: 'Travel by Region',
    links: ['Flights to Europe', 'Flights to India', 'Flights to Australia', 'Flights to France', 'Flights to Canada', 'Flights to Spain', 'Flights to Mexico', 'Flights to Paris']
  },
  {
    title: 'Travel by Price',
    links: ['Flights Under $199', 'Flights Under $99', 'Flights Under $49', 'Flights Under $29', 'Multi City Flights', 'Hotels Under $100', 'Vacation Under $500', 'Flights to Madrid']
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
let pendingExitEvent: BeforeUnloadEvent | null = null;

const navLinks = [
  { name: 'nav.stays', path: '/stays' },
  { name: 'nav.flights', path: '/flights' },
  { name: 'nav.cars', path: '/cars' },
  { name: 'nav.packages', path: '/packages' },
  { name: 'nav.cruises', path: '/cruises' },
]

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
    // Browser standard: setting returnValue triggers the native dialog
    e.preventDefault();
    e.returnValue = 'You have an active session. Are you sure you want to leave?';
    return e.returnValue;
  }
}

// Watch for route changes (in-app navigation away from important pages)
const handleRouteLeave = () => {
  // This could be extended to watch for unsaved form data
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('beforeunload', handleBeforeUnload);
  handleScroll(); // Initial check
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
