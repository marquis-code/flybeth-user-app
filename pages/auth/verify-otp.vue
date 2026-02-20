<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-4">Verification</h2>
      <h3 class="text-4xl font-black text-brand-blue font-header tracking-tighter">Verify Email</h3>
      <p class="mt-3 text-sm text-brand-gray/60 font-bold">
        Enter the 6-digit code sent to 
        <span class="text-brand-blue font-black">{{ otpData.email }}</span>
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleVerifyOtp">
      <UiBaseInput
        label="OTP Code"
        type="text"
        placeholder="123456"
        v-model="otpData.otp"
        required
        maxlength="6"
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase tracking-[0.15em] shadow-[0_10px_30px_-5px_rgba(13,29,173,0.3)] hover:shadow-brand-blue/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-blue/20 disabled:opacity-50"
      >
        <span v-if="loading">Verifying...</span>
        <span v-else>Verify OTP</span>
      </button>
      
      <p class="text-center text-sm text-brand-gray/60 font-bold mt-4">
        Didn't receive the code?
        <button type="button" @click="handleResend" class="text-brand-green hover:underline font-black">Resend</button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuth } from '@/composables/modules/auth/useAuth';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({
  layout: 'auth'
});

const { verifyOtp, loading } = useAuth();
const route = useRoute();
const router = useRouter();

const otpData = reactive({
  email: (route.query.email as string) || '',
  otp: ''
});

const handleVerifyOtp = async () => {
  const res = await verifyOtp(otpData);
  if (res && (res.status === 200 || res.status === 201)) {
    router.push('/auth/login');
  }
};

const handleResend = () => {
  console.log('Resending OTP to', otpData.email);
};
</script>
