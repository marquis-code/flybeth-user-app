<template>
  <div class="space-y-7 sm:space-y-8 font-sans">
    
    <!-- Title & Welcome Subtitle -->
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0D1DAD] text-[11px] font-black uppercase tracking-widest mb-3.5 shadow-sm">
        <Sparkles class="w-3 h-3 text-[#0D1DAD]" />
        <span>{{ $t('auth.authentication') || 'Authentication' }}</span>
      </div>
      
      <h1 class="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
        {{ $t('auth.welcomeBack') || 'Welcome Back' }}
      </h1>
      
      <p class="mt-2 text-sm text-slate-500 font-medium">
        {{ $t('auth.noAccount') || "Don't have an account?" }}
        <NuxtLink to="/auth/register" class="text-[#0D1DAD] hover:text-[#002a66] font-bold hover:underline transition-colors ml-1">
          {{ $t('auth.registerHere') || 'Register here' }}
        </NuxtLink>
      </p>
    </div>

    <!-- Login Form -->
    <form class="space-y-5" @submit.prevent="handleLogin">
      
      <!-- Email Address Input (No placeholder) -->
      <UiBaseInput
        :label="$t('auth.emailAddress') || 'Email Address'"
        type="email"
        v-model="loginData.email"
        required
      />

      <!-- Password Input (No placeholder, with show/hide toggle) -->
      <div>
        <UiBaseInput
          :label="$t('auth.password') || 'Password'"
          type="password"
          v-model="loginData.password"
          required
        />
        
        <div class="flex justify-end mt-2">
          <NuxtLink 
            to="/auth/forgot-password" 
            class="text-xs font-bold text-slate-600 hover:text-[#0D1DAD] transition-colors"
          >
            {{ $t('auth.forgotPassword') || 'Forgot your password?' }}
          </NuxtLink>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full h-12 sm:h-13 bg-[#0D1DAD] hover:bg-[#002a66] active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
        <span v-else>{{ $t('auth.signIn') || 'Sign In' }}</span>
      </button>

      <!-- Divider -->
      <div class="relative py-2.5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200"></div>
        </div>
        <div class="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span class="bg-[#F8FAFC] lg:bg-white px-4">
            {{ $t('auth.orContinueWith') || 'Or continue with' }}
          </span>
        </div>
      </div>

      <!-- Google OAuth -->
      <button
        type="button"
        @click="loginWithGoogle"
        class="w-full h-12 sm:h-13 flex items-center justify-center gap-3 px-4 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.99] transition-all font-bold text-xs sm:text-sm text-slate-800 shadow-sm hover:shadow"
      >
        <svg class="w-5 h-5 shrink-0" width="20" height="20" viewBox="0 0 24 24" style="width: 20px; height: 20px; min-width: 20px; min-height: 20px; max-width: 20px; max-height: 20px;">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span>{{ $t('auth.signInGoogle') || 'Sign in with Google' }}</span>
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

const { login, loginWithGoogle, loading } = useAuth();
const router = useRouter();

const loginData = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  const res: any = await login(loginData);
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
