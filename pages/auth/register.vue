<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-4">Get Started</h2>
      <h3 class="text-4xl font-black text-brand-blue font-header tracking-tighter">Create Account</h3>
      <p class="mt-3 text-sm text-brand-gray/60 font-bold">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-brand-green hover:underline font-black">Login here</NuxtLink>
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleRegister">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <UiBaseInput
          label="First Name"
          placeholder="John"
          v-model="registerData.firstName"
          required
        />
        <UiBaseInput
          label="Last Name"
          placeholder="Doe"
          v-model="registerData.lastName"
          required
        />
      </div>

      <UiBaseInput
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        v-model="registerData.email"
        required
      />

      <UiPhoneInput
        label="Phone Number"
        v-model="registerData.phone"
        @country-change="onCountryChange"
      />

      <UiBaseInput
        label="Password"
        type="password"
        placeholder="••••••••"
        v-model="registerData.password"
        required
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase tracking-[0.15em] shadow-[0_10px_30px_-5px_rgba(13,29,173,0.3)] hover:shadow-brand-blue/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-blue/20 disabled:opacity-50"
      >
        <span v-if="loading">Creating account...</span>
        <span v-else>Create Account</span>
      </button>

      <div class="relative py-2">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-100"></div>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-white px-4 text-brand-gray/40 font-black tracking-widest">Or join with</span>
        </div>
      </div>

      <button
        type="button"
        @click="loginWithGoogle"
        class="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 transition-all font-bold text-brand-blue shadow-sm hover:shadow-md"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign up with Google
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuth } from '@/composables/modules/auth/useAuth';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'auth'
});

const { register, loginWithGoogle, loading } = useAuth();
const router = useRouter();

const registerData = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  role: 'customer',
  currency: 'USD',
  country: ''
});

const onCountryChange = (info: { code: string; currency: string; dialCode: string; name: string }) => {
  registerData.currency = info.currency;
  registerData.country = info.code;
};

const handleRegister = async () => {
  const res = await register(registerData);
  if (res && (res.status === 200 || res.status === 201)) {
    router.push({
      path: '/auth/verify-otp',
      query: { email: registerData.email }
    });
  }
};
</script>
