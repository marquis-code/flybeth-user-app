<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="close">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
          <!-- Header -->
          <div class="p-8 pb-4 flex justify-between items-start">
            <div>
              <h2 class="text-3xl font-header text-gray-900 tracking-tight">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 italic">
                {{ isLogin ? 'Sign in to continue your booking' : 'Join Flybeth for exclusive travel deals' }}
              </p>
            </div>
            <button @click="close" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Tabs -->
          <div class="px-8 flex gap-8 border-b border-gray-50">
            <button @click="isLogin = true" class="pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative" :class="isLogin ? 'text-brand-blue' : 'text-gray-400'">
              Login
              <div v-if="isLogin" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></div>
            </button>
            <button @click="isLogin = false" class="pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative" :class="!isLogin ? 'text-brand-blue' : 'text-gray-400'">
              Register
              <div v-if="!isLogin" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></div>
            </button>
          </div>

          <!-- Form Area -->
          <div class="p-8">
            <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input v-model="loginData.email" type="email" required placeholder="name@example.com" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input v-model="loginData.password" type="password" required placeholder="••••••••" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium" />
              </div>
              <button :disabled="loading" type="submit" class="w-full py-4 bg-brand-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#0a168a] transition-all transform active:scale-[0.98] mt-4 shadow-lg shadow-brand-blue/20">
                {{ loading ? 'Signing In...' : 'Sign In' }}
              </button>
            </form>

            <form v-else @submit.prevent="handleRegister" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                  <input v-model="regData.firstName" type="text" required placeholder="John" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input v-model="regData.lastName" type="text" required placeholder="Doe" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input v-model="regData.email" type="email" required placeholder="name@example.com" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input v-model="regData.password" type="password" required placeholder="••••••••" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium" />
              </div>
              <button :disabled="loading" type="submit" class="w-full py-4 bg-brand-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#0a168a] transition-all transform active:scale-[0.98] mt-4 shadow-lg shadow-brand-blue/20">
                {{ loading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </form>

            <!-- Social Auth -->
            <div class="relative py-6">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
              <div class="relative flex justify-center text-[10px] uppercase tracking-widest"><span class="bg-white px-4 text-gray-400 font-bold">Or continue with</span></div>
            </div>

            <button type="button" @click="loginWithGoogle" class="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest text-gray-900 shadow-sm">
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/modules/auth/useAuth'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const { login, register, loginWithGoogle, loading } = useAuth()
const isLogin = ref(true)

const loginData = reactive({
  email: '',
  password: ''
})

const regData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const close = () => emit('close')

const handleLogin = async () => {
  const res = await login(loginData)
  if (res && (res.status === 200 || res.status === 201)) {
    emit('success')
  }
}

const handleRegister = async () => {
  const res = await register({
    ...regData,
    confirmPassword: regData.password
  })
  if (res && (res.status === 200 || res.status === 201)) {
    emit('success')
  }
}
</script>

<style scoped>
.font-header {
  font-family: 'Spectral', serif;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes scale-up {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-up {
  animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
