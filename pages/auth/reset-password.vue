<template>
  <div class="space-y-7 sm:space-y-8 font-sans">
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0D1DAD] text-[11px] font-black uppercase tracking-widest mb-3.5 shadow-sm">
        <Sparkles class="w-3 h-3 text-[#0D1DAD]" />
        <span>Account Recovery</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
        Reset Password
      </h1>
      <p class="mt-2 text-sm text-slate-500 font-medium">
        Enter your new secure password below.
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleResetPassword">
      <div class="space-y-4">
        <UiBaseInput
          label="New Password"
          type="password"
          v-model="resetData.newPassword"
          required
        />
        <UiBaseInput
          label="Confirm New Password"
          type="password"
          v-model="confirmPassword"
          required
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full h-12 sm:h-13 bg-[#0D1DAD] hover:bg-[#002a66] active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
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
import { Sparkles, RefreshCw } from 'lucide-vue-next';

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
