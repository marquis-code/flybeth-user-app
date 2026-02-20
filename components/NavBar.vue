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
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center group">
            <img src="@/assets/img/logo.png" class="h-10 w-auto mr-3 drop-shadow-lg group-hover:scale-110 transition-transform duration-500" alt="Flybeth Logo" />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center space-x-1">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.path"
            :to="link.path"
            :class="[
              isScrolled ? 'text-brand-blue hover:bg-brand-blue/5' : 'text-brand-blue/70 hover:bg-brand-blue/5 hover:text-brand-blue',
              route.path === link.path ? 'bg-brand-blue/10 text-brand-blue' : '',
              'px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300'
            ]"
          >
            {{ link.name }}
          </NuxtLink>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-6">
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
            <NuxtLink 
              to="/auth/login" 
              class="relative bg-brand-green px-8 py-3 rounded-full text-brand-blue text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-green/20 overflow-hidden group"
            >
               <span class="relative z-10 transition-colors group-hover:text-white">Sign In</span>
               <div class="absolute inset-0 bg-brand-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </NuxtLink>
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
import { useUser } from '@/composables/modules/auth/user';
import { BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const { token, user, logOut } = useUser();
const route = useRoute();
const router = useRouter();
const isScrolled = ref(false);
const showLogoutModal = ref(false);
const showExitModal = ref(false);
let pendingExitEvent: BeforeUnloadEvent | null = null;

const navLinks = [
  { name: 'Stays', path: '/stays' },
  { name: 'Flights', path: '/flights' },
  { name: 'Cars', path: '/cars' },
  { name: 'Packages', path: '/packages' },
  { name: 'Cruises', path: '/cruises' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
}

const handleLogout = () => {
  logOut();
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
