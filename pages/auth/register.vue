<template>
  <div class="space-y-6 sm:space-y-7 font-sans">
    
    <!-- Title & Welcome Subtitle -->
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0D1DAD] text-[11px] font-black uppercase tracking-widest mb-3.5 shadow-sm">
        <Sparkles class="w-3 h-3 text-[#0D1DAD]" />
        <span>{{ $t('auth.getStarted') || 'Get Started' }}</span>
      </div>
      
      <h1 class="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
        {{ $t('auth.createAccount') || 'Create Account' }}
      </h1>
      
      <p class="mt-2 text-sm text-slate-500 font-medium">
        {{ $t('auth.alreadyHaveAccount') || 'Already have an account?' }}
        <NuxtLink to="/auth/login" class="text-[#0D1DAD] hover:text-[#002a66] font-bold hover:underline transition-colors ml-1">
          {{ $t('auth.loginHere') || 'Login here' }}
        </NuxtLink>
      </p>
    </div>

    <!-- Registration Form -->
    <form class="space-y-4 sm:space-y-4.5" @submit.prevent="handleRegister">
      
      <!-- First & Last Name (Responsive Grid) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UiBaseInput
          :label="$t('auth.firstNameLabel') || 'First Name'"
          v-model="registerData.firstName"
          required
        />
        <UiBaseInput
          :label="$t('auth.lastNameLabel') || 'Last Name'"
          v-model="registerData.lastName"
          required
        />
      </div>

      <!-- Email Address (No placeholder) -->
      <UiBaseInput
        :label="$t('auth.emailAddress') || 'Email Address'"
        type="email"
        v-model="registerData.email"
        required
      />

      <!-- Phone Number (No placeholder) -->
      <UiPhoneInput
        :label="$t('auth.phoneNumberLabel') || 'Phone Number'"
        v-model="registerData.phone"
        @country-change="onCountryChange"
      />

      <!-- Password (No placeholder, with toggle) -->
      <UiBaseInput
        :label="$t('auth.password') || 'Password'"
        type="password"
        v-model="registerData.password"
        required
      />

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full h-12 sm:h-13 bg-[#0D1DAD] hover:bg-[#002a66] active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
        <span v-else>{{ $t('auth.createAccount') || 'Create Account' }}</span>
      </button>

      <!-- Divider -->
      <div class="relative py-2">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200"></div>
        </div>
        <div class="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span class="bg-[#F8FAFC] lg:bg-white px-4">
            {{ $t('auth.orJoinWith') || 'Or join with' }}
          </span>
        </div>
      </div>

      <!-- Google OAuth -->
      <button
        type="button"
        @click="loginWithGoogle"
        class="w-full h-12 sm:h-13 flex items-center justify-center gap-3 px-4 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.99] transition-all font-bold text-xs sm:text-sm text-slate-800 shadow-sm hover:shadow"
      >
        <svg class="h-4.5 w-4.5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span>{{ $t('auth.signUpGoogle') || 'Sign up with Google' }}</span>
      </button>

    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuth } from '@/composables/modules/auth/useAuth';
import { useRouter } from 'vue-router';
import { Sparkles, RefreshCw } from 'lucide-vue-next';

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
  const res: any = await register(registerData);
  if (res?.requiresOtp) {
    router.push({
      path: '/auth/verify-otp',
      query: { email: res.email }
    });
    return;
  }
  if (res && (res.status === 200 || res.status === 201)) {
    router.push('/');
  }
};
</script>
