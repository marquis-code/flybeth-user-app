<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-sm  text-brand-green uppercase tracking-[0.3em] mb-4">Verification</h2>
      <h3 class="text-4xl  text-gray-900  tracking-tighter">Verify Email</h3>
      <p class="mt-3 text-sm text-brand-gray/60 font-bold">
        Enter the 6-digit code sent to 
        <span class="text-gray-900 ">{{ otpData.email }}</span>
      </p>
    </div>

    <form class="space-y-10" @submit.prevent="handleVerifyOtp">
      <div class="flex justify-between gap-2 px-1">
        <input 
          v-for="(digit, idx) in 6" 
          :key="idx"
          ref="otpInputs"
          v-model="otpParts[idx]"
          type="text" 
          maxlength="1" 
          @input="onOtpInput(idx, $event)"
          @keydown.delete="onOtpDelete(idx, $event)"
          @paste="onOtpPaste"
          class="w-16 h-16 text-center text-2xl font-black bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 outline-none text-gray-900 transition-all font-mono"
        />
      </div>

      <button
        type="submit"
        :disabled="loading || combinedOtp.length !== 6"
        class="w-full py-3 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        <span v-if="loading">Validating Secure Protocol...</span>
        <span v-else>Verify Identity</span>
      </button>
      
      <p class="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        Didn't receive the code?
        <button type="button" @click="handleResend" class="text-brand-green hover:underline ml-1">Resend</button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, nextTick, onMounted } from 'vue';
import { useAuth } from '@/composables/modules/auth/useAuth';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({
  layout: 'auth'
});

const { verifyOtp, resendOtp, loading } = useAuth();
const route = useRoute();
const router = useRouter();

const otpData = reactive({
  email: (route.query.email as string) || '',
});

const otpParts = ref(['', '', '', '', '', '']);
const otpInputs = ref<HTMLInputElement[]>([]);

const combinedOtp = computed(() => otpParts.value.join(''));

const onOtpInput = (idx: number, event: any) => {
  const val = event.target.value;
  if (!/^\d*$/.test(val)) {
    otpParts.value[idx] = '';
    return;
  }
  
  if (val && idx < 5) {
    otpInputs.value[idx + 1].focus();
  }
  
  if (combinedOtp.value.length === 6) {
    handleVerifyOtp();
  }
}

const onOtpDelete = (idx: number, event: any) => {
  if (!otpParts.value[idx] && idx > 0) {
    otpInputs.value[idx - 1].focus();
  }
}

const onOtpPaste = (event: ClipboardEvent) => {
  const data = event.clipboardData?.getData('text');
  if (data && /^\d{6}$/.test(data)) {
    otpParts.value = data.split('');
    nextTick(() => {
      handleVerifyOtp();
    });
  }
}

const handleVerifyOtp = async () => {
  if (combinedOtp.value.length !== 6) return;
  const res = await verifyOtp({
    email: otpData.email,
    otp: combinedOtp.value
  });
  if (res && (res.status === 200 || res.status === 201)) {
    router.push('/');
  }
};

const handleResend = async () => {
  if (!otpData.email) return;
  await resendOtp({ email: otpData.email });
  otpParts.value = ['', '', '', '', '', ''];
  nextTick(() => {
    otpInputs.value[0]?.focus();
  });
};

onMounted(() => {
  otpInputs.value[0]?.focus();
});
</script>
