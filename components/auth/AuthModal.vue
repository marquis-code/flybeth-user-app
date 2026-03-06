<template>
  <Transition name="fade-modal">
    <div v-if="isAuthModalVisible" class="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-brand-blue/40 backdrop-blur-md" @click="closeAuthModal"></div>
      
      <!-- Modal Container -->
      <div class="relative bg-white w-full max-w-5xl h-[min(800px,90vh)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
        <!-- Close Button -->
        <button 
          @click="closeAuthModal"
          class="absolute top-6 right-6 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white md:text-brand-blue transition-all"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>

        <!-- Left Side: Carousel (Fixed on desktop) -->
        <div class="hidden md:block w-1/2 relative overflow-hidden bg-brand-blue">
          <div class="absolute inset-0">
            <TransitionGroup name="fade-slide">
              <div 
                v-for="(slide, idx) in slides" 
                :key="slide.title"
                v-show="currentSlide === idx"
                class="absolute inset-0"
              >
                <img :src="slide.image" class="w-full h-full object-cover opacity-60 ml-[-20%] min-w-[140%]" />
                <div class="absolute inset-0 bg-gradient-to-t from-brand-blue via-transparent to-transparent"></div>
                
                <div class="absolute bottom-16 left-12 right-12 text-white space-y-4">
                  <span class="text-brand-green font-black uppercase tracking-[0.3em] text-[10px]">Flybeth Travel Intelligence</span>
                  <h2 class="text-4xl font-black font-header tracking-tighter leading-tight">{{ slide.title }}</h2>
                  <p class="text-white/60 font-bold text-sm max-w-xs">{{ slide.description }}</p>
                </div>
              </div>
            </TransitionGroup>
          </div>
          
          <!-- Slide Indicators -->
          <div class="absolute bottom-8 left-12 flex gap-2">
            <div 
              v-for="(_, idx) in slides" 
              :key="idx"
              @click="currentSlide = idx"
              :class="[currentSlide === idx ? 'w-8 bg-brand-green' : 'w-2 bg-white/20']"
              class="h-1.5 rounded-full cursor-pointer transition-all duration-500"
            ></div>
          </div>
        </div>

        <!-- Right Side: Auth Form -->
        <div class="flex-1 bg-white p-8 sm:p-12 overflow-y-auto">
          <div class="h-full flex flex-col max-w-md mx-auto">
            <!-- Logo (Mobile only) -->
            <div class="md:hidden mb-8">
              <img src="@/assets/img/logo.png" class="h-8 w-auto" alt="Flybeth Logo" />
            </div>

            <!-- Form Content -->
            <div class="flex-grow flex flex-col justify-center py-8">
              <Transition name="fade-form" mode="out-in">
                <!-- Step 1: Email Input -->
                <div v-if="step === 'email'" key="email" class="space-y-8">
                  <div class="space-y-2">
                    <h3 class="text-3xl font-black text-brand-blue tracking-tighter">Sign in to Flybeth</h3>
                    <p class="text-brand-gray/60 font-bold text-sm">Enter your email to get started with your next journey.</p>
                  </div>

                  <form @submit.prevent="proceedToStep2" class="space-y-6">
                    <UiBaseInput
                      label="Email Address"
                      type="email"
                      placeholder="e.g. josh@flybeth.com"
                      v-model="authData.email"
                      required
                    />
                    
                    <button
                      type="submit"
                      class="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Continue
                    </button>
                  </form>

                  <div class="relative py-2">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-100"></div>
                    </div>
                    <div class="relative flex justify-center text-[10px] uppercase">
                      <span class="bg-white px-4 text-brand-gray/30 font-black tracking-widest">Or continue with</span>
                    </div>
                  </div>

                  <button
                    @click="loginWithGoogle"
                    class="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-brand-blue"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google Account
                  </button>
                </div>

                <!-- Step 2: Password (Login) -->
                <div v-else-if="step === 'login'" key="login" class="space-y-8">
                   <div class="space-y-2">
                    <button @click="step = 'email'" class="text-brand-blue/40 text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4 hover:text-brand-blue">
                      <ChevronLeftIcon class="h-4 w-4" /> Go Back
                    </button>
                    <h3 class="text-3xl font-black text-brand-blue tracking-tighter">Welcome Back</h3>
                    <p class="text-brand-gray/60 font-bold text-sm">Enter your password for <span class="text-brand-blue">{{ authData.email }}</span></p>
                  </div>

                  <form @submit.prevent="handleLoginSubmit" class="space-y-6">
                    <UiBaseInput
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      v-model="authData.password"
                      required
                    />
                    
                    <button
                      type="submit"
                      :disabled="loading"
                      class="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {{ loading ? 'Signing in...' : 'Sign In' }}
                    </button>
                  </form>

                  <p class="text-center text-xs font-bold text-brand-gray/40">
                    <button class="hover:text-brand-blue transition-colors">Forgot Password?</button>
                  </p>
                </div>

                <!-- Step 3: Register -->
                <div v-else-if="step === 'register'" key="register" class="space-y-8">
                   <div class="space-y-2">
                    <button @click="step = 'email'" class="text-brand-blue/40 text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4 hover:text-brand-blue">
                      <ChevronLeftIcon class="h-4 w-4" /> Go Back
                    </button>
                    <h3 class="text-3xl font-black text-brand-blue tracking-tighter">Create Account</h3>
                    <p class="text-brand-gray/60 font-bold text-sm">Join Flybeth and start exploring the world.</p>
                  </div>

                  <form @submit.prevent="handleRegisterSubmit" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <UiBaseInput label="First Name" v-model="authData.firstName" required />
                      <UiBaseInput label="Last Name" v-model="authData.lastName" required />
                    </div>
                    <UiBaseInput label="Phone Number" type="tel" v-model="authData.phone" required />
                    <UiBaseInput label="Password" type="password" v-model="authData.password" required />
                    
                    <button
                      type="submit"
                      :disabled="loading"
                      class="w-full py-4 bg-brand-green text-brand-blue rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-green/20 mt-6 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {{ loading ? 'Creating Account...' : 'Create Account' }}
                    </button>
                  </form>
                </div>
              </Transition>
            </div>

            <!-- Footer Info -->
            <p class="text-[9px] text-brand-gray/30 font-black uppercase tracking-widest text-center leading-relaxed">
              By continuing, you agree to Flybeth's <br/>
              <span class="text-brand-blue/40 border-b border-brand-blue/10">Terms of Service</span> & <span class="text-brand-blue/40 border-b border-brand-blue/10">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '@/composables/modules/auth/useAuth';

const { isAuthModalVisible, closeAuthModal, login, register, loginWithGoogle, loading } = useAuth();

const step = ref<'email' | 'login' | 'register'>('email');
const currentSlide = ref(0);
const authData = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: ''
});

const slides = [
  {
    title: 'Discover Over 500,000 Hotels Worldwide',
    description: 'Flybeth aggregates the best stays from premium providers including HotelBeds and Amadeus.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Fly Anywhere with Intelligent Fares',
    description: 'Real-time optimization across major airlines globally ensures you get the best price, every time.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Curated Experiences for Modern Explorers',
    description: 'From local transfers to unique activities, manage your entire journey with Flybeth Intelligence.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800'
  }
];

let interval: any;
onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 5000);
});

onUnmounted(() => {
  clearInterval(interval);
});

const proceedToStep2 = async () => {
  // Simple check: for now, we'll assume we navigate to login/register based on whether we recognize the email.
  // In a real app, you'd call an API to check if email exists.
  // Let's simulate: if email contains 'new', go to register.
  if (authData.email.includes('new')) {
    step.value = 'register';
  } else {
    step.value = 'login';
  }
};

const handleLoginSubmit = async () => {
  const res = await login({ email: authData.email, password: authData.password });
  if (res) closeAuthModal();
};

const handleRegisterSubmit = async () => {
  const res = await register({
    email: authData.email,
    password: authData.password,
    firstName: authData.firstName,
    lastName: authData.lastName,
    phone: authData.phone
  });
  if (res) step.value = 'login'; // Go to login after registration
};
</script>

<style scoped>
.font-header { font-family: 'Spectral', serif; }

.fade-modal-enter-active, .fade-modal-leave-active { transition: opacity 0.5s ease; }
.fade-modal-enter-from, .fade-modal-leave-to { opacity: 0; }

.scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 1s ease; position: absolute; }
.fade-slide-enter-from { opacity: 0; transform: scale(1.1); }
.fade-slide-leave-to { opacity: 0; transform: scale(0.9); }

.fade-form-enter-active, .fade-form-leave-active { transition: all 0.4s ease; }
.fade-form-enter-from { opacity: 0; transform: translateX(20px); }
.fade-form-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
