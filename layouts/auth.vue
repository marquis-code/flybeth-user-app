<template>
  <div class="min-h-screen flex font-sans bg-white selection:bg-[#0D1DAD] selection:text-white">
    
    <!-- ═══════════════ LEFT: FIXED HERO VISUAL (DESKTOP) ═══════════════ -->
    <div class="hidden lg:block lg:w-[48%] xl:w-[45%] fixed inset-y-0 left-0 overflow-hidden bg-[#0A1485] select-none">
      
      <!-- Breathtaking Commercial Airliner & Global Travel Photography -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=85" 
          alt="Flybeth LLC Aviation & Flight Booking" 
          class="w-full h-full object-cover scale-105 transition-transform duration-[10000ms] ease-out hover:scale-100"
        />
        
        <!-- Multi-Stop Brand Gradient (Deep Navy, Indigo, Gold Glow) -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#091157] via-[#0D1DAD]/75 to-[#0A1485]/40 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#0D1DAD]/80 via-[#0D1DAD]/30 to-transparent"></div>
        
        <!-- Subtle Grid Pattern -->
        <div 
          class="absolute inset-0 opacity-15"
          style="background-image: radial-gradient(rgba(255, 255, 255, 0.4) 1.5px, transparent 1.5px); background-size: 24px 24px;"
        ></div>

        <!-- Ambient Glow Spheres -->
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <!-- Top Brand Accent -->
      <div class="absolute top-10 left-12 z-20">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 group">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Plane class="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <span class="text-white font-black text-lg tracking-tight block leading-none">Flybeth</span>
            <span class="text-sky-200/80 text-[10px] font-bold uppercase tracking-widest block mt-0.5">Travel Intelligence</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Hero Overlay Typography & Floating Travel Cards -->
      <div class="relative z-10 h-full flex flex-col justify-end p-10 xl:p-14 pb-14 text-white">
        
        <div class="space-y-6 max-w-lg">
          
          <!-- Category Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-bold tracking-widest uppercase shadow-sm">
            <Sparkles class="w-3.5 h-3.5 text-sky-300" />
            <span>Official Flight Booking Portal</span>
          </div>

          <!-- Main Catchy Title -->
          <h2 class="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Elevate the Way You <span class="text-sky-300">Travel the World.</span>
          </h2>

          <p class="text-blue-100/90 text-sm xl:text-base font-medium leading-relaxed max-w-md">
            Unlock real-time airline inventories, instant e-ticketing across 500+ global carriers, and 24/7 dedicated concierge assistance.
          </p>

          <!-- 3-Pill Feature Strip -->
          <div class="grid grid-cols-3 gap-2.5 pt-2">
            <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
              <span class="text-lg font-black text-white block">500+</span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-sky-200/80 block mt-0.5">Airlines</span>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
              <span class="text-lg font-black text-white block">Instant</span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-sky-200/80 block mt-0.5">E-Tickets</span>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
              <span class="text-lg font-black text-white block">24/7</span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-sky-200/80 block mt-0.5">Concierge</span>
            </div>
          </div>

          <!-- Verified Social Proof -->
          <div class="pt-4 flex items-center gap-4 border-t border-white/15">
            <div class="flex -space-x-2.5">
              <div class="h-9 w-9 rounded-full bg-sky-400/30 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-xs font-black shadow-sm">JD</div>
              <div class="h-9 w-9 rounded-full bg-indigo-500/40 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-xs font-black shadow-sm">AM</div>
              <div class="h-9 w-9 rounded-full bg-blue-600/40 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-xs font-black shadow-sm">SK</div>
              <div class="h-9 w-9 rounded-full bg-emerald-500/50 backdrop-blur-md border-2 border-emerald-300/60 flex items-center justify-center text-white text-xs font-black shadow-sm">+50K</div>
            </div>
            <div>
              <div class="flex items-center gap-1 text-amber-300 text-xs font-black">
                <span>★ 4.9</span>
                <span class="text-white/80 font-medium">/ 5.0</span>
              </div>
              <p class="text-blue-100/80 text-xs font-semibold">Trusted by 50,000+ travelers worldwide</p>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- ═══════════════ RIGHT: SCROLLABLE FORM AREA (RESPONSIVE) ═══════════════ -->
    <div class="w-full lg:w-[52%] xl:w-[55%] lg:ml-[48%] xl:ml-[45%] min-h-screen overflow-y-auto bg-[#F8FAFC] lg:bg-white flex flex-col justify-between">
      
      <div class="px-5 sm:px-10 lg:px-14 xl:px-20 py-8 sm:py-12 flex flex-col min-h-screen justify-between max-w-xl mx-auto w-full">
        
        <!-- Header: Logo & Back Link -->
        <div class="flex items-center justify-between mb-8 sm:mb-10 pb-4 border-b border-slate-100">
          <NuxtLink to="/" class="inline-flex items-center group">
            <img 
              src="https://res.cloudinary.com/dlnjbkoju/image/upload/v1794986834/logo_qeatej.png" 
              class="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              alt="Flybeth Logo" 
            />
          </NuxtLink>

          <NuxtLink 
            to="/" 
            class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D1DAD] bg-slate-100/80 hover:bg-blue-50 px-3.5 py-1.5 rounded-full transition-colors border border-slate-200/60"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
            <span>Home</span>
          </NuxtLink>
        </div>

        <!-- Form Slot (Cleanly Centered) -->
        <div class="flex-grow flex flex-col justify-center w-full py-2">
          <slot />
        </div>

        <!-- Security & Legal Footer -->
        <div class="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div class="flex items-center gap-1.5 font-semibold">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted & Protected</span>
          </div>
          <p class="font-medium text-center sm:text-right">
            © {{ new Date().getFullYear() }} Flybeth LLC
          </p>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { Plane, Sparkles, ChevronLeft, ShieldCheck } from 'lucide-vue-next'
</script>
