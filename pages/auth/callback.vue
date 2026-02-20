<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center p-6">
    <div class="space-y-6 text-center">
      <div class="relative">
        <div class="h-24 w-24 rounded-full border-4 border-brand-blue/10 border-t-brand-blue animate-spin mx-auto"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="h-8 w-8 text-brand-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        </div>
      </div>
      <div>
        <h2 class="text-2xl font-black text-brand-blue font-header tracking-tighter">Authenticating</h2>
        <p class="text-brand-gray/60 font-bold mt-2">Completing your secure sign-in...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from '@/composables/modules/auth/user';
import { useCustomToast } from '@/composables/core/useCustomToast';

const route = useRoute();
const router = useRouter();
const { setToken, setRefreshToken, setUser } = useUser();
const { showToast } = useCustomToast();

onMounted(() => {
  const { accessToken, refreshToken, user } = route.query;

  if (accessToken && user) {
    try {
      const userData = typeof user === 'string' ? JSON.parse(decodeURIComponent(user)) : user;
      
      setToken(accessToken as string);
      if (refreshToken) setRefreshToken(refreshToken as string);
      setUser(userData);

      showToast({
        title: "Success",
        message: "Logged in successfully",
        toastType: "success",
      });

      router.push('/');
    } catch (e) {
      console.error('Failed to parse user data from callback', e);
      showToast({
        title: "Error",
        message: "Failed to complete authentication",
        toastType: "error",
      });
      router.push('/auth/login');
    }
  } else {
    // If we land here without query params, we might be in the popup flow
    // or something went wrong with the redirect
    setTimeout(() => {
      if (!accessToken) {
        showToast({
           title: "Error",
           message: "Authentication tokens missing",
           toastType: "error"
        });
        router.push('/auth/login');
      }
    }, 2000);
  }
});
</script>

<style scoped>
.font-header {
  font-family: 'Spectral', serif;
}
</style>
