<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <NavBar />
    
    <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 mt-[80px]">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-32">
            
            <!-- User Summary -->
            <div class="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
              <div class="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white text-lg font-bold shadow-sm">
                {{ userInitials }}
              </div>
              <div>
                <h3 class="text-[15px] font-bold text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</h3>
                <p class="text-[13px] font-medium text-gray-500">{{ user?.email }}</p>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="p-3 space-y-1">
              <NuxtLink 
                to="/profile" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors"
                exact-active-class="bg-brand-blue/10 text-brand-blue"
                inactive-class="text-gray-700 hover:bg-gray-100"
              >
                <User class="w-5 h-5" />
                Profile Settings
              </NuxtLink>

              <NuxtLink 
                to="/profile/bookings" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors"
                active-class="bg-brand-blue/10 text-brand-blue"
                inactive-class="text-gray-700 hover:bg-gray-100"
              >
                <Briefcase class="w-5 h-5" />
                My Bookings
              </NuxtLink>
            </nav>

            <!-- Actions -->
            <div class="p-3 border-t border-gray-100">
              <button 
                @click="showLogoutModal = true"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut class="w-5 h-5" />
                Sign Out
              </button>
            </div>

          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 min-h-[500px]">
            <slot />
          </div>
        </main>

      </div>
    </div>
    
    <MainFooter />
    
    <ConfirmModal
      v-model:visible="showLogoutModal"
      title="Sign Out"
      message="Are you sure you want to sign out? You will need to sign in again to access your bookings."
      confirmText="Sign Out"
      cancelText="Cancel"
      variant="logout"
      @confirm="handleLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/modules/auth/useAuth'
import NavBar from '@/components/NavBar.vue'
import MainFooter from '@/components/MainFooter.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { User, Briefcase, LogOut } from 'lucide-vue-next'

const { user, logout } = useAuth()
const router = useRouter()

const showLogoutModal = ref(false)

const userInitials = computed(() => {
  if (!user.value) return 'U'
  const first = user.value.firstName ? user.value.firstName.charAt(0) : ''
  const last = user.value.lastName ? user.value.lastName.charAt(0) : ''
  return (first + last).toUpperCase() || 'U'
})

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
  window.location.href = '/'
}
</script>

<style scoped>
/* Optional specific overrides if needed */
</style>
