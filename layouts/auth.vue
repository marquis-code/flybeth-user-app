<template>
  <div class="min-h-screen flex font-body">
    <!-- Left: Fixed Image Panel -->
    <div class="hidden lg:block lg:w-[45%] fixed inset-y-0 left-0 overflow-hidden">
      <div class="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
          alt="Travel Destination" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-brand-blue/80 via-brand-blue/60 to-brand-green/30"></div>
      </div>

      <!-- Overlay Content -->
      <div class="relative z-10 h-full flex flex-col justify-end p-16">
        <div class="space-y-6">
          <span class="text-brand-green font-black uppercase tracking-[0.3em] text-[10px]">{{ $t('authLayout.journeyStarts') }}</span>
          <h2 class="text-5xl font-black text-white font-header tracking-tighter leading-tight">
            {{ $t('authLayout.discover') }}<br/>{{ $t('authLayout.worldsMost') }}<br/>
            <span class="text-brand-green/80">{{ $t('authLayout.breathtaking') }}</span><br/>{{ $t('authLayout.layoutDestinations') }}
          </h2>
          <p class="text-white/60 font-bold text-sm max-w-sm leading-relaxed">
            {{ $t('authLayout.socialProof') }}
          </p>

          <!-- Social Proof -->
          <div class="flex items-center gap-6 pt-4">
            <div class="flex -space-x-3">
              <div class="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white text-xs font-black">JD</div>
              <div class="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white text-xs font-black">AM</div>
              <div class="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white text-xs font-black">SK</div>
              <div class="h-10 w-10 rounded-full bg-brand-green/40 backdrop-blur-md border-2 border-brand-green/30 flex items-center justify-center text-white text-xs font-black">+5K</div>
            </div>
            <div>
              <p class="text-white font-black text-sm">{{ $t('authLayout.trustedWorldwide') }}</p>
              <p class="text-white/40 text-[10px] font-black uppercase tracking-widest">{{ $t('authLayout.averageRating') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Scrollable Form Area -->
    <div class="w-full lg:w-[55%] lg:ml-[45%] min-h-screen overflow-y-auto bg-white">
      <div class="px-6 sm:px-12 lg:px-20 py-12 flex flex-col min-h-screen">
        <!-- Logo -->
        <div class="mb-10">
          <NuxtLink to="/" class="inline-flex items-center group">
            <img src="@/assets/img/logo.png" class="h-10 w-auto mr-3 drop-shadow-lg group-hover:scale-110 transition-transform duration-500" alt="Flybeth Logo" />
          </NuxtLink>
        </div>

        <!-- Page Content (form slot) -->
        <div class="flex-grow flex flex-col justify-center w-full max-w-xl">
          <slot />
        </div>

        <!-- Footer -->
        <div class="mt-10 pt-6 border-t border-gray-100">
          <p class="text-[10px] text-brand-gray/40 font-black uppercase tracking-[0.2em]">
            © {{ new Date().getFullYear() }} Flybeth &nbsp;•&nbsp; {{ $t('authLayout.travelIntelligence') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
