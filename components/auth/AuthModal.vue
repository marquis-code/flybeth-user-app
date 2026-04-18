<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-gray-100">
          <!-- Header -->
          <div class="p-8 pb-4 flex justify-between items-start">
            <div v-if="step !== 'otp'">
              <h2 class="text-3xl text-gray-900 tracking-tight font-spectral">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
                {{ isLogin ? 'Sign in to continue your booking' : 'Join Flybeth for exclusive travel deals' }}
              </p>
            </div>
            <div v-else>
              <h2 class="text-3xl text-gray-900 tracking-tight font-spectral">Verify Identity</h2>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
                Secure authentication protocol active
              </p>
            </div>
            <button @click="close" class="p-2 hover:bg-gray-100 rounded-full transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Tabs -->
          <div v-if="step !== 'otp'" class="px-8 flex gap-8 border-b border-gray-50">
            <button @click="switchToLogin" class="pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative" :class="isLogin ? 'text-brand-blue' : 'text-gray-400'">
              Login
              <div v-if="isLogin" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></div>
            </button>
            <button @click="switchToRegister" class="pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative" :class="!isLogin ? 'text-brand-blue' : 'text-gray-400'">
              Register
              <div v-if="!isLogin" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></div>
            </button>
          </div>

          <!-- Form Area -->
          <div class="p-8 pt-6">
            <!-- Login Step -->
            <form v-if="step === 'login'" @submit.prevent="handleLogin" class="space-y-5">
              <div class="space-y-1.5">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
                <input v-model="loginData.email" type="email" required placeholder="name@example.com" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 outline-none text-sm font-medium transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Password</label>
                <input v-model="loginData.password" type="password" required placeholder="••••••••" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 outline-none text-sm font-medium transition-all" />
              </div>
              <button :disabled="loading" type="submit" class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all transform active:scale-[0.98] mt-4 shadow-xl shadow-gray-200 flex items-center justify-center gap-3">
                <span v-if="!loading">{{ isLogin ? 'Authenticate' : 'Complete Registration' }}</span>
                <svg v-else class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </button>
            </form>

            <!-- Register Step -->
            <form v-else-if="step === 'register'" @submit.prevent="handleRegister" class="space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">First Name</label>
                  <input v-model="regData.firstName" type="text" required placeholder="John" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 outline-none text-sm font-medium transition-all" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Last Name</label>
                  <input v-model="regData.lastName" type="text" required placeholder="Doe" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 outline-none text-sm font-medium transition-all" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
                <input v-model="regData.email" type="email" required placeholder="name@example.com" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 outline-none text-sm font-medium transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Password</label>
                <input v-model="regData.password" type="password" required placeholder="••••••••" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 outline-none text-sm font-medium transition-all" />
              </div>
              <button :disabled="loading" type="submit" class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all transform active:scale-[0.98] mt-4 shadow-xl shadow-gray-200">
                {{ loading ? 'Securing Account...' : 'Initialize Account' }}
              </button>
            </form>

            <!-- OTP Step -->
            <div v-else-if="step === 'otp'" class="space-y-8 py-2">
              <div class="text-center space-y-2">
                <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Code sent to mail</p>
                <p class="text-sm font-black text-gray-900 font-mono">{{ otpEmail }}</p>
              </div>
              
              <div class="flex justify-between gap-2 px-1 max-w-[320px] mx-auto">
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
                  class="w-10 h-14 text-center text-2xl font-black bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 outline-none text-gray-900 transition-all font-mono"
                />
              </div>

              <div class="space-y-4 pt-2">
                <button 
                  :disabled="loading || combinedOtp.length !== 6" 
                  @click="handleVerifyOtp"
                  class="w-full py-5 bg-[#FF4500] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-700 transition-all transform active:scale-[0.98] shadow-xl shadow-orange-100 disabled:opacity-50"
                >
                  <span v-if="!loading">Authorize Access</span>
                  <svg v-else class="animate-spin h-4 w-4 text-white mx-auto" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </button>
                <button 
                  @click="step = isLogin ? 'login' : 'register'" 
                  class="w-full text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors"
                >
                  Change Account Details
                </button>
              </div>
            </div>

            <!-- Social Auth (Hidden on OTP) -->
            <div v-if="step !== 'otp'">
              <div class="relative py-8">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-50"></div></div>
                <div class="relative flex justify-center text-[9px] uppercase tracking-[0.4em]"><span class="bg-white px-6 text-gray-300 font-black">Secure Connect</span></div>
              </div>

              <button type="button" @click="loginWithGoogle" class="w-full flex items-center justify-center gap-4 px-5 py-4 border border-gray-100 rounded-2xl bg-white hover:bg-gray-50 transition-all font-black text-[9px] uppercase tracking-[0.2em] text-gray-900 shadow-sm group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" class="h-4 w-4" />
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { useAuth } from '@/composables/modules/auth/useAuth'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const { login, register, verifyOtp, loginWithGoogle, loading } = useAuth()
const isLogin = ref(true)
const step = ref<'login' | 'register' | 'otp'>('login')
const otpEmail = ref('')
const otpParts = ref(['', '', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([])

const combinedOtp = computed(() => otpParts.value.join(''))

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

const close = () => {
  emit('close')
  setTimeout(() => {
    step.value = isLogin.value ? 'login' : 'register'
    otpParts.value = ['', '', '', '', '', '']
  }, 300)
}

const switchToLogin = () => {
  isLogin.value = true
  step.value = 'login'
}

const switchToRegister = () => {
  isLogin.value = false
  step.value = 'register'
}

const onOtpInput = (idx: number, event: any) => {
  const val = event.target.value
  if (!/^\d*$/.test(val)) {
    otpParts.value[idx] = ''
    return
  }
  
  if (val && idx < 5) {
    otpInputs.value[idx + 1].focus()
  }
  
  if (combinedOtp.value.length === 6) {
    handleVerifyOtp()
  }
}

const onOtpDelete = (idx: number, event: any) => {
  if (!otpParts.value[idx] && idx > 0) {
    otpInputs.value[idx - 1].focus()
  }
}

const onOtpPaste = (event: ClipboardEvent) => {
  const data = event.clipboardData?.getData('text')
  if (data && /^\d{6}$/.test(data)) {
    otpParts.value = data.split('')
    nextTick(() => {
      handleVerifyOtp()
    })
  }
}

const handleLogin = async () => {
  const res = await login(loginData)
  if (res && res.requiresOtp) {
    otpEmail.value = res.email
    step.value = 'otp'
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
    return
  }
  if (res && (res.status === 200 || res.status === 201)) {
    emit('success')
  }
}

const handleRegister = async () => {
  const res = await register({
    ...regData,
    confirmPassword: regData.password
  })
  if (res && res.requiresOtp) {
    otpEmail.value = res.email
    step.value = 'otp'
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
    return
  }
  if (res && (res.status === 200 || res.status === 201)) {
    emit('success')
  }
}

const handleVerifyOtp = async () => {
  if (combinedOtp.value.length !== 6) return
  const res = await verifyOtp({
    email: otpEmail.value,
    otp: combinedOtp.value
  })
  if (res && (res.status === 200 || res.status === 201)) {
    emit('success')
  }
}
</script>

<style scoped>
.font-spectral {
  
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

.text-brand-blue {
  color: #0D1DAD;
}
.bg-brand-blue {
  background-color: #0D1DAD;
}
</style>
