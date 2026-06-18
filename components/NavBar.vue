<template>
  <div class="navbar-wrapper">
    <nav
      :class="[
        'fixed top-0 left-1/2 -translate-x-1/2 z-[99999] transition-all duration-300 w-full',
        isScrolled
          ? 'bg-white border-b border-gray-200 py-3'
          : 'bg-white border-b border-gray-200 py-4 lg:py-5'
      ]"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="flex justify-between items-center">

          <!-- Logo & Mobile Hamburger -->
          <div class="flex items-center gap-4">
            <button @click="isMobileMenuOpen = true" class="lg:hidden p-2 rounded-md text-black hover:bg-gray-100 transition-colors">
              <Menu class="h-5 w-5" />
            </button>

            <NuxtLink to="/" class="flex items-center">
              <img src="@/assets/img/logo.png" class="h-8 lg:h-10 w-auto" alt="Flybeth Logo" />
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center gap-1">
            <!-- Explore Dropdown -->
            <div class="relative group">
              <!-- <button class="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-black hover:text-black hover:bg-white rounded-md transition-colors">
                Explore Travel
                <ChevronDown class="h-3.5 w-3.5 text-black transition-transform duration-200 group-hover:rotate-180" />
              </button> -->

              <div class="absolute left-0 top-[calc(100%+6px)] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-[100000]">
                <div class="bg-white border border-gray-200 rounded-xl p-2 w-52 shadow-lg">
                  <NuxtLink
                    v-for="item in exploreLinks"
                    :key="item.name"
                    :to="item.path"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white transition-colors group/item"
                  >
                    <component :is="item.icon" class="h-4 w-4 text-black group-hover/item:text-black transition-colors" />
                    <span class="text-[13px] font-medium text-black">{{ item.name }}</span>
                    <ChevronRight v-if="item.hasArrow" class="h-3 w-3 ml-auto text-black" />
                  </NuxtLink>
                </div>
              </div>
            </div>

            <NuxtLink to="/help" class="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-black hover:text-black hover:bg-white rounded-md transition-colors">
              <HelpCircle class="h-3.5 w-3.5 text-black" />
              Help center
            </NuxtLink>

            <button @click="handleManageBookingClick" class="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-black hover:text-black hover:bg-white rounded-md transition-colors">
              <Briefcase class="h-3.5 w-3.5 text-black" />
              Manage Bookings
            </button>
          </div>

          <!-- Desktop Actions -->
          <div class="hidden lg:flex items-center gap-2">

            <!-- Regional Settings Trigger -->
            <div>
              <button @click="showSettings = true" class="flex items-center gap-2 px-3 py-2 border border-blue-50 bg-blue-50/20 rounded-lg hover:border-blue-100 hover:bg-blue-50 transition-all duration-300">
                <img :src="getFlag(locale)" class="h-3 w-4.5 object-cover rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-white/50" />
                <span class="text-sm text-black ">{{ locale }} · {{ currentCurrency.code }}</span>
                <ChevronDown class="h-3 w-3 text-black" />
              </button>
            </div>

            <!-- Divider -->
            <div class="h-5 w-px bg-black mx-1"></div>

            <!-- Call Support -->
            <div class="relative group">
              <button class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-black hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-center w-8 h-8 bg-brand-blue text-white rounded-full">
                  <Phone class="h-3.5 w-3.5" />
                </div>
                <div class="flex flex-col items-start">
                  <span class="text-sm font-bold text-gray-500  leading-none">Call 24/7 Support</span>
                  <span class="text-[13px] font-bold text-brand-blue leading-none mt-1 whitespace-nowrap">1-844-FLYBETH</span>
                </div>
                <ChevronDown class="h-3.5 w-3.5 text-gray-400 ml-1 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <!-- Support Panel — Redesigned -->
              <div class="absolute right-0 top-[calc(100%+8px)] w-80 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-[100000]">
                <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <!-- Header Strip -->
                  <div class="px-5 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-[13px] font-bold text-black">Support</p>
                        <p class="text-[11px] text-black mt-0.5 font-medium">Available 24 hours, 7 days a week</p>
                      </div>
                      <span class="inline-flex items-center gap-1.5 text-sm font-bold   text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        Online
                      </span>
                    </div>
                  </div>

                  <!-- Contact Options -->
                  <div class="p-4 space-y-2">
                    <a
                      href="tel:+18443592384"
                      class="flex items-center gap-4 p-3.5 rounded-lg border border-gray-200 hover:border-gray-200 hover:bg-white transition-colors group/link"
                    >
                      <div class="w-9 h-9 rounded-lg bg-black flex items-center justify-center flex-shrink-0 group-hover/link:bg-black transition-colors">
                        <Phone class="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p class="text-[12px] font-bold text-black">+1 844 FLYBETH</p>
                        <p class="text-[11px] text-black mt-0.5 font-medium">359-2384</p>
                      </div>
                      <ArrowRight class="h-3.5 w-3.5 text-black ml-auto group-hover/link:text-black transition-colors" />
                    </a>

                    <a
                      href="mailto:Hello@flybeth.com"
                      class="flex items-center gap-4 p-3.5 rounded-lg border border-gray-200 hover:border-gray-200 hover:bg-white transition-colors group/link"
                    >
                      <div class="w-9 h-9 rounded-lg bg-black flex items-center justify-center flex-shrink-0 group-hover/link:bg-black transition-colors">
                        <Mail class="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p class="text-[12px] font-bold text-black">Hello@flybeth.com</p>
                        <p class="text-[11px] text-black mt-0.5 font-medium">Email support</p>
                      </div>
                      <ArrowRight class="h-3.5 w-3.5 text-black ml-auto group-hover/link:text-black transition-colors" />
                    </a>
                  </div>

                  <!-- Promo Footer -->
                  <!-- <div class="px-4 pb-4">
                    <div class="flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg">
                      <div class="flex items-center gap-2">
                        <Tag class="h-3.5 w-3.5 text-black" />
                        <span class="text-[11px] font-semibold text-black">Use code</span>
                      </div>
                      <span class="text-[11px] font-bold  text-black  bg-white border border-gray-200 px-2.5 py-1 rounded-md">DIAL10</span>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>

            <!-- Notifications -->
            <div class="relative">
              <button 
                @click="showNotifications = !showNotifications"
                class="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg text-black hover:text-black hover:bg-white hover:border-gray-200 transition-colors relative"
              >
                <Bell class="h-4 w-4" />
                <span v-if="notifications.length > 0" class="absolute top-2 right-2 h-2 w-2 bg-red-500 border border-white rounded-full"></span>
              </button>
            </div>

            <!-- Divider -->
            <div class="h-5 w-px bg-black mx-1"></div>

            <!-- User Section -->
            <template v-if="user">
              <div class="flex items-center gap-2 pl-2 relative group">
                <div class="flex items-center gap-3 py-1 px-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                  <div class="flex flex-col text-right">
                    <p class="text-[13px] font-bold text-black leading-none">{{ user?.firstName }} {{ user?.lastName }}</p>
                    <p class="text-sm font-bold text-black mt-1">{{ user?.role?.name || 'Explorer' }}</p>
                  </div>
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white text-[13px] border-2 border-white shadow-sm overflow-hidden">
                    <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full object-cover" />
                    <span v-else>{{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}</span>
                  </div>
                </div>

                <!-- Dropdown -->
                <div class="absolute right-0 top-[calc(100%+6px)] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-[100000]">
                  <div class="bg-white border border-gray-200 rounded-xl p-2 w-52 shadow-lg flex flex-col">
                    <NuxtLink to="/profile" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                      <span class="text-[13px] font-medium text-black">Profile</span>
                    </NuxtLink>
                    <NuxtLink to="/profile/bookings" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                      <span class="text-[13px] font-medium text-black">My Bookings</span>
                    </NuxtLink>
                    <div class="h-px w-full bg-gray-100 my-1"></div>
                    <button @click="showLogoutModal = true" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-red-500 w-full text-left">
                      <span class="text-[13px] font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <button @click="openAuthModal" class="bg-black text-white px-5 py-2 rounded-md text-[13px] font-semibold hover:bg-black active:bg-black transition-colors">
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
                class="relative w-9 h-9 flex items-center justify-center border border-gray-200 rounded-md text-black"
              >
                <Bell class="h-4 w-4" />
                <span v-if="notifications.length > 0" class="absolute top-2 right-2 h-2 w-2 bg-red-500 border border-white rounded-full"></span>
              </button>
            </div>
            <button v-if="!user" @click="openAuthModal" class="bg-black text-white px-4 py-2 rounded-md text-[12px] font-semibold active:scale-95 transition-all">
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
      <div :class="['fixed inset-0 z-[999999] lg:hidden transition-all duration-300', isMobileMenuOpen ? 'visible' : 'invisible']">
        <div
          :class="['absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300', isMobileMenuOpen ? 'opacity-100' : 'opacity-0']"
          @click="isMobileMenuOpen = false"
        ></div>

        <div :class="['absolute right-3 top-3 bottom-3 w-[340px] max-w-[calc(100%-1.5rem)] bg-white rounded-3xl flex flex-col shadow-2xl transition-transform duration-300', isMobileMenuOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]']">
          <!-- Drawer Header -->
          <div class="flex justify-between items-center px-6 py-6 pb-2">
            <!-- Icon resembling the logo in the image -->
            <div class="h-10 w-auto rounded-full flex items-center justify-center">
              <!-- <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 11l19-9-9 19-2-8-8-2z" />
              </svg> -->
              <img src="@/assets/img/logo.png" alt="" class="h-10 w-auto">
            </div>
            <button @click="isMobileMenuOpen = false" class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto px-6 py-2">
            <div class="flex flex-col">
              <NuxtLink
                v-for="item in exploreLinks"
                :key="item.name"
                :to="item.path"
                @click="isMobileMenuOpen = false"
                class="flex items-center justify-between py-4 border-b border-gray-100 group"
              >
                <span class="text-[15px] font-semibold text-gray-900">{{ item.name }}</span>
                <ChevronRight class="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
              </NuxtLink>

              <button @click="[showSettings = true, isMobileMenuOpen = false]" class="flex items-center justify-between py-4 border-b border-gray-100 group w-full text-left">
                <div class="flex items-center gap-2">
                  <span class="text-[15px] font-semibold text-gray-900">Regional Settings</span>
                  <div class="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md">
                    <img :src="getFlag(locale)" class="h-2.5 w-3.5 object-cover rounded-sm" />
                    <span class="text-[11px] font-medium text-gray-600">{{ locale.toUpperCase() }}</span>
                  </div>
                </div>
                <ChevronRight class="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
              </button>

              <a href="tel:+18443592384" class="flex items-center justify-between py-4 border-b border-gray-100 group">
                <span class="text-[15px] font-semibold text-gray-900">Call us</span>
                <ChevronRight class="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
              </a>

              <NuxtLink to="/help" @click="isMobileMenuOpen = false" class="flex items-center justify-between py-4 border-b border-gray-100 group">
                <span class="text-[15px] font-semibold text-gray-900">Help center</span>
                <ChevronRight class="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
              </NuxtLink>

              <button @click="[handleManageBookingClick(), isMobileMenuOpen = false]" class="flex items-center justify-between py-4 border-b border-gray-100 group text-left">
                <span class="text-[15px] font-semibold text-gray-900">Manage Bookings</span>
                <ChevronRight class="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
              </button>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="px-6 py-6 flex flex-col items-center">
            <button v-if="!user" @click="[openAuthModal(), isMobileMenuOpen = false]" class="w-full bg-[#f3f0ff] text-[#1A2ED4] py-3.5 rounded-2xl font-semibold text-[15px] hover:bg-[#ebe6ff] transition-colors mb-6">
              Get Started / Sign In
            </button>
            <button v-else @click="[showLogoutModal = true, isMobileMenuOpen = false]" class="w-full bg-[#fff0f0] text-[#ef4444] py-3.5 rounded-2xl font-semibold text-[15px] hover:bg-[#ffe6e6] transition-colors mb-6">
              Sign Out ({{ user?.firstName }})
            </button>

            <p class="text-[10px] font-bold text-gray-400   mb-4">Stay in touch</p>
            <div class="flex items-center justify-center gap-3">
              <!-- Mock Social Icons -->
              <a href="#" class="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white hover:opacity-90"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="#" class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:opacity-90"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white hover:opacity-90"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg></a>
              <a href="#" class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:opacity-90"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.155c-5.46 0-9.845 4.385-9.845 9.845 0 5.46 4.385 9.845 9.845 9.845 5.46 0 9.845-4.385 9.845-9.845 0-5.46-4.385-9.845-9.845-9.845zm-1.39 15.65c-3.14 0-4.14-1.37-4.14-2.81 0-1.4 1.16-2.58 3.51-2.58h1.87v-1.15c0-1.22-.64-1.92-2.12-1.92-1.09 0-1.89.37-2.32.55v-1.63c.52-.25 1.57-.59 2.92-.59 2.51 0 3.3 1.25 3.3 3.32v4.8h-1.66v-1.18c-.46.77-1.4 1.19-2.36 1.19zm1.39-4.04h-1.68c-1.27 0-1.91.56-1.91 1.34 0 .66.49 1.19 1.48 1.19.82 0 1.53-.41 1.93-1.02v-1.51zm5.22 4.04h-1.74v-7.14h1.74v7.14zm-.87-8.24c-.58 0-1.06-.48-1.06-1.06 0-.58.48-1.06 1.06-1.06.58 0 1.06.48 1.06 1.06 0 .58-.48 1.06-1.06 1.06z"/></svg></a>
              <a href="#" class="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center text-white hover:opacity-90"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            </div>
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

    <!-- Notification Side Drawer -->
    <NotificationPanel :visible="showNotifications" @close="showNotifications = false" />

    <!-- Regional Settings Side Drawer -->
    <RegionalSettingsPanel :visible="showSettings" @close="showSettings = false" />

    <!-- Manage Booking Flow -->
    <ManageBookingModal 
      v-model:visible="showManageBookingModal" 
      @success="handleManageBookingSuccess" 
    />
    <BookingDetailsDrawer 
      :visible="showBookingDetailsDrawer" 
      :pnr="managedBookingPnr" 
      @close="showBookingDetailsDrawer = false" 
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
  Percent,
  Briefcase
} from 'lucide-vue-next'

import { useSettings } from '@/composables/useSettings'
import RegionalSettingsPanel from './RegionalSettingsPanel.vue'
import NotificationPanel from './NotificationPanel.vue'
import ManageBookingModal from '@/components/checkout/ManageBookingModal.vue'
import BookingDetailsDrawer from '@/components/checkout/BookingDetailsDrawer.vue'
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

const showManageBookingModal = ref(false)
const showBookingDetailsDrawer = ref(false)
const managedBookingPnr = ref('')

const handleManageBookingSuccess = (booking: any) => {
  managedBookingPnr.value = booking.pnr || booking?.data?.pnr
  showManageBookingModal.value = false
  showBookingDetailsDrawer.value = true
}

const handleManageBookingClick = () => {
  if (user.value) {
    router.push('/profile/bookings')
  } else {
    showManageBookingModal.value = true
  }
}

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