<template>
  <div class="space-y-7 sm:space-y-8 font-sans">
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0D1DAD] text-[11px] font-black uppercase tracking-widest mb-3.5 shadow-sm">
        <Sparkles class="w-3 h-3 text-[#0D1DAD]" />
        <span>{{ $t('auth.accountRecovery') || 'Account Recovery' }}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
        {{ $t('auth.forgotPasswordTitle') || 'Forgot Password' }}
      </h1>
      <p class="mt-2 text-sm text-slate-500 font-medium">
        {{ $t('auth.rememberedPassword') || 'Remembered your password?' }}
        <NuxtLink to="/auth/login" class="text-[#0D1DAD] hover:text-[#002a66] font-bold hover:underline transition-colors ml-1">
          {{ $t('auth.loginHere') || 'Login here' }}
        </NuxtLink>
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleForgotPassword">
      <UiBaseInput
        :label="$t('auth.emailAddress') || 'Email Address'"
        type="email"
        v-model="email"
        required
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full h-12 sm:h-13 bg-[#0D1DAD] hover:bg-[#002a66] active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
        <span v-else>{{ $t('auth.sendResetLink') || 'Send Reset Link' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/modules/auth/useAuth';
import { Sparkles, RefreshCw } from 'lucide-vue-next';

definePageMeta({
  layout: 'auth'
});

const { forgotPassword, loading } = useAuth();
const email = ref('');

const handleForgotPassword = async () => {
  await forgotPassword({ email: email.value });
};
</script>
