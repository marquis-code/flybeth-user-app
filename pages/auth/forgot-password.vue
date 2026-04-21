<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-sm  text-brand-green uppercase  mb-4">{{ $t('auth.accountRecovery') }}</h2>
      <h3 class="text-4xl  text-gray-900  tracking-tighter">{{ $t('auth.forgotPasswordTitle') }}</h3>
      <p class="mt-3 text-sm text-brand-gray/60 font-bold">
        {{ $t('auth.rememberedPassword') }}
        <NuxtLink to="/auth/login" class="text-brand-green hover:underline ">{{ $t('auth.loginHere') }}</NuxtLink>
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleForgotPassword">
      <UiBaseInput
        :label="$t('auth.emailAddress')"
        type="email"
        placeholder="john@example.com"
        v-model="email"
        required
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm  uppercase tracking-[0.15em] shadow-[0_10px_30px_-5px_rgba(13,29,173,0.3)] hover:shadow-brand-blue/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-blue/20 disabled:opacity-50"
      >
        <span v-if="loading">{{ $t('auth.sending') }}</span>
        <span v-else>{{ $t('auth.sendResetLink') }}</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/modules/auth/useAuth';

definePageMeta({
  layout: 'auth'
});

const { forgotPassword, loading } = useAuth();
const email = ref('');

const handleForgotPassword = async () => {
  await forgotPassword({ email: email.value });
};
</script>
