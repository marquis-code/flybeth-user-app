<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-4">Account Recovery</h2>
      <h3 class="text-4xl font-black text-brand-blue font-header tracking-tighter">Reset Password</h3>
      <p class="mt-3 text-sm text-brand-gray/60 font-bold">
        Enter your new password below.
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleResetPassword">
      <div class="space-y-5">
        <UiBaseInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          v-model="resetData.newPassword"
          required
        />
        <UiBaseInput
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          v-model="confirmPassword"
          required
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase tracking-[0.15em] shadow-[0_10px_30px_-5px_rgba(13,29,173,0.3)] hover:shadow-brand-blue/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-blue/20 disabled:opacity-50"
      >
        <span v-if="loading">Resetting...</span>
        <span v-else>Reset Password</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuth } from '@/composables/modules/auth/useAuth';
import { useRoute, useRouter } from 'vue-router';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'auth'
});

const { resetPassword, loading } = useAuth();
const route = useRoute();
const router = useRouter();
const { showToast } = useCustomToast();

const resetData = reactive({
  token: (route.query.token as string) || '',
  newPassword: ''
});

const confirmPassword = ref('');

const handleResetPassword = async () => {
  if (resetData.newPassword !== confirmPassword.value) {
    showToast({
      title: "Error",
      message: "Passwords do not match",
      toastType: "error",
    });
    return;
  }
  
  const res = await resetPassword(resetData);
  if (res && (res.status === 200 || res.status === 201)) {
    router.push('/auth/login');
  }
};
</script>
