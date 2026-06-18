<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

    <div v-if="fetching" class="flex justify-center items-center py-20">
      <div class="w-10 h-10 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
    </div>

    <form v-else @submit.prevent="saveProfile" class="max-w-2xl space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
          <input 
            v-model="form.firstName"
            type="text" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            placeholder="e.g. John"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
          <input 
            v-model="form.lastName"
            type="text" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            placeholder="e.g. Doe"
          />
        </div>
      </div>

      <!-- Email (Read Only) -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
        <input 
          v-model="form.email"
          type="email" 
          disabled
          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
        />
        <p class="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
      </div>

      <!-- Phone Number -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
        <input 
          v-model="form.phone"
          type="tel" 
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
          placeholder="e.g. +1234567890"
        />
      </div>

      <div class="pt-4 border-t border-gray-100">
        <button 
          type="submit" 
          :disabled="loading"
          class="px-8 py-3 bg-brand-blue text-white rounded-xl font-semibold hover:bg-brand-blue/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApiFactory } from '@/api_factory/modules/user'
import { useAuth } from '@/composables/modules/auth/useAuth'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: 'profile'
})

const { user, setUser } = useAuth()
const { showToast } = useCustomToast()

const fetching = ref(false)
const loading = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const fetchProfile = async () => {
  fetching.value = true
  try {
    const { data } = await userApiFactory.getProfile()
    const profile = data.data || data
    
    // Update local form
    form.value.firstName = profile.firstName || ''
    form.value.lastName = profile.lastName || ''
    form.value.email = profile.email || ''
    form.value.phone = profile.phone || ''
    
    // Update global user state silently
    setUser(profile)
  } catch (err: any) {
    showToast({
      title: "Error",
      message: err.response?.data?.message || "Failed to load profile",
      toastType: "error",
    })
  } finally {
    fetching.value = false
  }
}

const saveProfile = async () => {
  loading.value = true
  try {
    const { data } = await userApiFactory.updateProfile({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone
    })
    
    // Update global state
    setUser(data.data || data)
    
    showToast({
      title: "Success",
      message: "Profile updated successfully",
      toastType: "success",
    })
  } catch (err: any) {
    showToast({
      title: "Error",
      message: err.response?.data?.message || "Failed to update profile",
      toastType: "error",
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>
