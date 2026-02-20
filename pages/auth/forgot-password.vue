<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-4">Account Recovery</h2>
      <h3 class="text-4xl font-black text-brand-blue font-header tracking-tighter">Forgot Password</h3>
      <p class="mt-3 text-sm text-brand-gray/60 font-bold">
        Remembered your password?
        <NuxtLink to="/auth/login" class="text-brand-green hover:underline font-black">Login here</NuxtLink>
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleForgotPassword">
      <UiBaseInput
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        v-model="email"
        required
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase tracking-[0.15em] shadow-[0_10px_30px_-5px_rgba(13,29,173,0.3)] hover:shadow-brand-blue/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-blue/20 disabled:opacity-50"
      >
        <span v-if="loading">Sending...</span>
        <span v-else>Send Reset Link</span>
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
