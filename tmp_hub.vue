    <!-- Global Connectivity Hub: (Professional Light Theme) -->
    <section class="relative w-full overflow-hidden mb-20 bg-gray-50 border-y border-gray-100">
      <!-- Animated Focal Points (Light Theme) -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#3b82f6,transparent_50%),radial-gradient(circle_at_0%_0%,#10b981,transparent_30%)]"></div>
      </div>

      <div class="max-w-[1920px] mx-auto py-20 lg:py-32 relative z-10 px-4 sm:px-6 lg:px-24">
        <div class="max-w-4xl mb-16 text-center lg:text-left">
          <div class="flex items-center justify-center lg:justify-start gap-4 mb-6">
            <div class="h-10 w-10 bg-brand-blue/5 rounded-xl flex items-center justify-center border border-brand-blue/10">
              <GlobeAltIcon class="h-5 w-5 text-brand-blue" />
            </div>
            <span class="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em]">Global Connectivity Hub</span>
          </div>
          <h2 class="text-3xl md:text-5xl lg:text-6xl font-header text-gray-950 mb-7 tracking-tighter leading-[1.05]">Partnerships that <span class="text-brand-blue underline decoration-brand-blue/20 decoration-8 underline-offset-4">Connect</span> the World.</h2>
          <p class="text-base sm:text-lg font-bold text-gray-500 leading-relaxed max-w-2xl">Access over 500+ airlines, 1.2M premium stays, and thousands of curated experiences across the globe, all at your fingertips.</p>
        </div>
        
        <!-- Interactive Continuous Marquees -->
        <div class="space-y-12 lg:space-y-20 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <!-- Row 1: Airline Hub (Interactive) -->
          <div class="relative flex overflow-x-hidden group/m">
            <div class="animate-marquee whitespace-nowrap flex items-center py-4">
              <div v-for="(p, i) in [...partnerAirlines, ...partnerAirlines]" :key="`air-${i}`" 
                   @click="navigateToCategory('airline', p)"
                   class="mx-4 sm:mx-8 px-10 py-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group/logo shrink-0">
                <img :src="p.logo" :alt="p.name" class="h-12 sm:h-14 w-28 sm:w-36 object-contain grayscale group-hover/logo:grayscale-0 transition-all opacity-80 group-hover:opacity-100" />
              </div>
            </div>
          </div>

          <!-- Row 2: Resorts & Exotic Activities (Interactive Redirects) -->
          <div class="relative flex overflow-x-hidden group/m">
            <div class="animate-marquee-reverse whitespace-nowrap flex items-center">
              <div v-for="(p, i) in [...resortPlaces, ...activityPlaces, ...resortPlaces, ...activityPlaces]" :key="`place-${i}`" 
                   @click="navigateToCategory('experience', p)"
                   class="mx-4 shrink-0 relative group/item cursor-pointer">
                 <div class="w-72 sm:w-[500px] h-48 sm:h-64 rounded-[3rem] overflow-hidden border border-gray-200 shadow-2xl relative">
                   <img :src="p.image" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-[2000ms] ease-out" />
                   <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent flex flex-col justify-end p-8 sm:p-10">
                      <span v-if="p.type" class="text-[9px] font-black text-brand-green uppercase tracking-widest mb-2 px-3 py-1 bg-brand-green/20 backdrop-blur-md w-fit rounded-full">{{ p.type }}</span>
                      <div class="flex items-center justify-between">
                         <h4 class="text-xl sm:text-2xl font-bold text-white tracking-tighter">{{ p.name }}</h4>
                         <div class="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all transform translate-y-4 group-hover/item:translate-y-0">
                            <ArrowRightIcon class="h-5 v-5 text-white" />
                         </div>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <!-- Row 3: Hotel Brands & Car Hire (Interactive) -->
          <div class="relative flex overflow-x-hidden group/m">
            <div class="animate-marquee whitespace-nowrap flex items-center py-4">
              <div v-for="(p, i) in [...partnerHotels, ...partnerCars, ...partnerHotels, ...partnerCars]" :key="`brand-${i}`" 
                   @click="navigateToCategory(partnerHotels.some(h => h.name === p.name) ? 'hotel' : 'car', p)"
                   class="mx-4 sm:mx-8 px-8 py-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group/logo shrink-0">
                <img :src="p.logo" :alt="p.name" class="h-10 sm:h-12 w-24 sm:w-32 object-contain grayscale group-hover/logo:grayscale-0 transition-all opacity-60 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
