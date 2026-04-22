<template>
  <div class="navbar-wrapper">
    <nav
      :class="[
        'fixed top-0 left-1/2 -translate-x-1/2 z-[99999] transition-all duration-300 w-full',
        isScrolled
          ? 'bg-white border-b border-gray-200 py-3'
          : 'bg-white border-b border-gray-100 py-4 lg:py-5'
      ]"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="flex justify-between items-center">

          <!-- Logo & Mobile Hamburger -->
          <div class="flex items-center gap-4">
            <button @click="isMobileMenuOpen = true" class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Menu class="h-5 w-5" />
            </button>

            <NuxtLink to="/" class="flex items-center">
              <img src="@/assets/img/logo.png" class="h-8 lg:h-9 w-auto" alt="Flybeth Logo" />
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center gap-1">
            <!-- Explore Dropdown -->
            <div class="relative group">
              <button class="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                Explore travel
                <ChevronDown class="h-3.5 w-3.5 text-gray-400 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div class="absolute left-0 top-[calc(100%+6px)] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-[100000]">
                <div class="bg-white border border-gray-200 rounded-xl p-2 w-52 shadow-lg">
                  <NuxtLink
                    v-for="item in exploreLinks"
                    :key="item.name"
                    :to="item.path"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group/item"
                  >
                    <component :is="item.icon" class="h-4 w-4 text-gray-400 group-hover/item:text-gray-700 transition-colors" />
                    <span class="text-[13px] font-medium text-gray-700">{{ item.name }}</span>
                    <ChevronRight v-if="item.hasArrow" class="h-3 w-3 ml-auto text-gray-300" />
                  </NuxtLink>
                </div>
              </div>
            </div>

            <NuxtLink to="/help" class="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
              <HelpCircle class="h-3.5 w-3.5 text-gray-400" />
              Help center
            </NuxtLink>
          </div>

          <!-- Desktop Actions -->
          <div class="hidden lg:flex items-center gap-2">

            <!-- Regional Settings Dropdown -->
            <div class="relative group">
              <button class="flex items-center gap-2 px-3 py-2 border border-blue-50 bg-blue-50/20 rounded-lg hover:border-blue-100 hover:bg-blue-50 transition-all duration-300">
                <img :src="getFlag(locale)" class="h-3 w-4.5 object-cover rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-white/50" />
                <span class="text-[10px]  tracking-[0.15em] text-gray-500 uppercase">{{ locale }} · {{ currentCurrency.code }}</span>
                <ChevronDown class="h-3 w-3 text-gray-300 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div class="absolute right-0 top-[calc(100%+6px)] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-[100000]">
                <RegionalSettingsPanel />
              </div>
            </div>

            <!-- Divider -->
            <div class="h-5 w-px bg-gray-200 mx-1"></div>

            <!-- Call Support -->
            <div class="relative group">
              <button class="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                <Phone class="h-4 w-4" />
              </button>

              <!-- Support Panel — Redesigned -->
              <div class="absolute right-0 top-[calc(100%+8px)] w-80 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-[100000]">
                <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <!-- Header Strip -->
                  <div class="px-5 py-4 border-b border-gray-100">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-[13px] font-bold text-gray-900">Support</p>
                        <p class="text-[11px] text-gray-400 mt-0.5 font-medium">Available 24 hours, 7 days a week</p>
                      </div>
                      <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        Online
                      </span>
                    </div>
                  </div>

                  <!-- Contact Options -->
                  <div class="p-4 space-y-2">
                    <a
                      href="tel:+18443592384"
                      class="flex items-center gap-4 p-3.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group/link"
                    >
                      <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/link:bg-gray-200 transition-colors">
                        <Phone class="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p class="text-[12px] font-bold text-gray-900">+1 844 FLYBETH</p>
                        <p class="text-[11px] text-gray-400 mt-0.5 font-medium">359-2384</p>
                      </div>
                      <ArrowRight class="h-3.5 w-3.5 text-gray-300 ml-auto group-hover/link:text-gray-500 transition-colors" />
                    </a>

                    <a
                      href="mailto:Hello@flybeth.com"
                      class="flex items-center gap-4 p-3.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group/link"
                    >
                      <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/link:bg-gray-200 transition-colors">
                        <Mail class="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p class="text-[12px] font-bold text-gray-900">Hello@flybeth.com</p>
                        <p class="text-[11px] text-gray-400 mt-0.5 font-medium">Email support</p>
                      </div>
                      <ArrowRight class="h-3.5 w-3.5 text-gray-300 ml-auto group-hover/link:text-gray-500 transition-colors" />
                    </a>
                  </div>

                  <!-- Promo Footer -->
                  <!-- <div class="px-4 pb-4">
                    <div class="flex items-center justify-between px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                      <div class="flex items-center gap-2">
                        <Tag class="h-3.5 w-3.5 text-gray-400" />
                        <span class="text-[11px] font-semibold text-gray-500">Use code</span>
                      </div>
                      <span class="text-[11px] font-bold tracking-widest text-gray-800 uppercase bg-white border border-gray-200 px-2.5 py-1 rounded-md">DIAL10</span>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>

            <!-- Notifications -->
            <div class="relative">
              <button 
                @click="showNotifications = !showNotifications"
                class="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors relative"
              >
                <Bell class="h-4 w-4" />
                <span v-if="notifications.length > 0" class="absolute top-2 right-2 h-2 w-2 bg-red-500 border border-white rounded-full"></span>
              </button>

              <div v-if="showNotifications" class="absolute right-0 top-[calc(100%+8px)] z-[100000]">
                <NotificationPanel @click.stop />
                <div class="fixed inset-0 bg-transparent -z-1" @click="showNotifications = false"></div>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-5 w-px bg-gray-200 mx-1"></div>

            <!-- User Section -->
            <template v-if="user">
              <div class="flex items-center gap-4 pl-2">
                <div class="flex items-center gap-3 py-1 px-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                  <div class="flex flex-col text-right">
                    <p class="text-[13px] font-bold text-gray-900 leading-none">{{ user?.firstName }} {{ user?.lastName }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{{ user?.role?.name || 'Explorer' }}</p>
                  </div>
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white text-[13px]  border-2 border-white shadow-sm overflow-hidden">
                    <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full object-cover" />
                    <span v-else>{{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}</span>
                  </div>
                </div>
                <button
                  @click="showLogoutModal = true"
                  class="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut class="h-4 w-4" />
                </button>
              </div>
            </template>
            <template v-else>
              <button @click="openAuthModal" class="bg-gray-900 text-white px-5 py-2 rounded-md text-[13px] font-semibold hover:bg-gray-800 active:bg-gray-950 transition-colors">
                Join Flybeth
              </button>
            </template>
          </div>

          <!-- Mobile Right Actions -->
          <div class="flex lg:hidden items-center gap-2">
            <div class="relative">
              <button 
                type="button" 
                @click="showNotifications = !showNotifications"
                class="relative w-9 h-9 flex items-center justify-center border border-gray-200 rounded-md text-gray-500"
              >
                <Bell class="h-4 w-4" />
                <span v-if="notifications.length > 0" class="absolute top-2 right-2 h-2 w-2 bg-red-500 border border-white rounded-full"></span>
              </button>
              
              <div v-if="showNotifications" class="fixed inset-x-4 top-20 z-[100000] flex justify-center">
                <NotificationPanel class="w-full" />
                <div class="fixed inset-0 bg-black/10 -z-1" @click="showNotifications = false"></div>
              </div>
            </div>
            <button v-if="!user" @click="openAuthModal" class="bg-gray-900 text-white px-4 py-2 rounded-md text-[12px] font-semibold active:scale-95 transition-all">
              Sign in
            </button>
            <button v-else @click="showLogoutModal = true" class="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-md text-red-500">
              <LogOut class="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </nav>

    <!-- Mobile Drawer -->
    <Teleport to="body">
      <div :class="['fixed inset-0 z-[999] lg:hidden transition-all duration-300', isMobileMenuOpen ? 'visible' : 'invisible']">
        <div
          :class="['absolute inset-0 bg-black/30 transition-opacity duration-300', isMobileMenuOpen ? 'opacity-100' : 'opacity-0']"
          @click="isMobileMenuOpen = false"
        ></div>

        <div :class="['absolute inset-y-0 left-0 w-[280px] bg-white flex flex-col transition-transform duration-300', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full']">
          <!-- Drawer Header -->
          <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <img src="@/assets/img/logo.png" class="h-7 object-contain" alt="Flybeth Logo" />
            <button @click="isMobileMenuOpen = false" class="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto py-4">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-5 mb-2">Explore</p>
            <NuxtLink
              v-for="item in exploreLinks"
              :key="item.name"
              :to="item.path"
              @click="isMobileMenuOpen = false"
              class="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <component :is="item.icon" class="h-4 w-4 text-gray-400" />
              <span class="text-[14px] font-medium text-gray-800">{{ item.name }}</span>
            </NuxtLink>

            <div class="mx-5 my-4 border-t border-gray-100"></div>

            <button @click="[showSettings = true, isMobileMenuOpen = false]" class="flex items-center gap-3.5 px-5 py-3 w-full hover:bg-gray-50 transition-colors text-left">
              <img :src="getFlag(locale)" class="h-3 w-4 object-cover rounded-sm" />
              <span class="text-[13px] font-medium text-gray-700">{{ locale }} · {{ currentCurrency.code }}</span>
            </button>

            <a href="tel:+18443592384" class="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors">
              <Phone class="h-4 w-4 text-gray-400" />
              <span class="text-[14px] font-medium text-gray-800">Call us</span>
            </a>

            <NuxtLink to="/help" @click="isMobileMenuOpen = false" class="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors">
              <HelpCircle class="h-4 w-4 text-gray-400" />
              <span class="text-[14px] font-medium text-gray-800">Help center</span>
            </NuxtLink>
          </div>

          <!-- Drawer Footer -->
          <div class="px-5 py-4 border-t border-gray-100">
            <div v-if="user" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-700">
                  {{ user?.firstName?.charAt(0) }}
                </div>
                <div>
                  <p class="text-[13px] font-semibold text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</p>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ user?.role?.name || 'Explorer' }}</p>
                </div>
              </div>
              <button @click="[showLogoutModal = true, isMobileMenuOpen = false]" class="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                <LogOut class="h-4 w-4" />
              </button>
            </div>
            <button v-else @click="[openAuthModal(), isMobileMenuOpen = false]" class="w-full bg-gray-900 text-white py-3 rounded-md font-semibold text-[13px] hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Logout Modal -->
    <ConfirmModal
      v-model:visible="showLogoutModal"
      variant="logout"
      title="Leaving so soon?"
      message="You're about to sign out of your Flybeth account. Any unsaved changes will be lost."
      confirmText="Sign out"
      cancelText="Stay"
      @confirm="handleLogout"
    />

    <!-- Exit Modal -->
    <ConfirmModal
      v-model:visible="showExitModal"
      variant="exit"
      title="Wait, don't go!"
      message="You have an active session. Are you sure you want to leave Flybeth?"
      confirmText="Leave"
      cancelText="Stay here"
      @confirm="confirmExit"
      @cancel="cancelExit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, type Ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/modules/auth/useAuth'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  HelpCircle,
  LogOut,
  ArrowRight,
  Tag,
  PlaneTakeoff,
  Hotel,
  Car,
  Gift,
  Map,
  Percent
} from 'lucide-vue-next'

import { useSettings } from '@/composables/useSettings'
import RegionalSettingsPanel from './RegionalSettingsPanel.vue'
import NotificationPanel from './NotificationPanel.vue'
import { useI18n } from 'vue-i18n'
import { useRealtime } from '@/composables/core/useRealtime'

const { user, logout, openAuthModal } = useAuth()
const { locale } = useI18n()
const { currentCurrency } = useSettings()
const { notifications, connect } = useRealtime()
const showSettings = inject('showSettings') as Ref<boolean>

const showNotifications = ref(false)

const route = useRoute()
const router = useRouter()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const showLogoutModal = ref(false)
const showExitModal = ref(false)

const exploreLinks = [
  { name: 'Flights',  path: '/flights',  icon: PlaneTakeoff },
  { name: 'Hotels',   path: '/stays',    icon: Hotel },
  { name: 'Cars',     path: '/cars',     icon: Car },
  { name: 'Packages', path: '/packages', icon: Gift },
  { name: 'Explore',  path: '/explore',  icon: Map },
  // { name: 'Deals',    path: '/deals',    icon: Percent, hasArrow: true },
]

const getFlag = (code: string) => {
  const flags: Record<string, string> = {
    en: 'https://flagcdn.com/us.svg',
    es: 'https://flagcdn.com/es.svg',
    fr: 'https://flagcdn.com/fr.svg',
    de: 'https://flagcdn.com/de.svg',
    ar: 'https://flagcdn.com/sa.svg',
    zh: 'https://flagcdn.com/cn.svg',
    ja: 'https://flagcdn.com/jp.svg',
    pt: 'https://flagcdn.com/br.svg',
    it: 'https://flagcdn.com/it.svg',
    ko: 'https://flagcdn.com/kr.svg',
    tr: 'https://flagcdn.com/tr.svg',
    hi: 'https://flagcdn.com/in.svg',
  }
  return flags[code] || flags['en']
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleLogout = () => {
  const userProfile  = useCookie('user_profile')
  const accessToken  = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')
  userProfile.value  = null
  accessToken.value  = null
  refreshToken.value = null

  if (import.meta.client) {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })
  }

  logout()
  showLogoutModal.value = false
  window.location.href = '/'
}

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (user.value) {
    e.preventDefault()
    e.returnValue = 'You have an active session. Are you sure you want to leave?'
    return e.returnValue
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('beforeunload', handleBeforeUnload)
  handleScroll()
  connect() // Ensure real-time connection
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const confirmExit = () => { showExitModal.value = false }
const cancelExit  = () => { showExitModal.value = false }
</script>

<style scoped>
nav {
  box-shadow: 0 1px 0 0 rgb(0 0 0 / 0.06);
}
</style>