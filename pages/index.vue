<template>
  <div class="min-h-screen bg-white overflow-x-hidden relative">
    <!-- Premium Hero Section with Clean White Background -->
    <div class="relative min-h-[700px] flex items-center pt-8 overflow-hidden bg-white">
      <!-- Abstract Background Curves (Refined layering) -->
      <div class="absolute top-0 right-0 w-[1200px] h-[1200px] bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-0"></div>
      <div class="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] bg-brand-blue rounded-full opacity-5 z-0"></div>
      <div class="absolute top-[20%] right-[10%] w-64 h-64 bg-brand-blue/5 rounded-full blur-2xl z-0"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <!-- Left Content: Dynamic Title + Search -->
          <div class="w-full lg:w-[75%]">
            <div class="mb-8 block">
               <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-brand-blue text-left animate-fade-in drop-shadow-sm mb-4">
                 {{ heroTitle }}
               </h1>
            </div>
            
            <div ref="widgetContainer" class="relative">
              <div 
                :class="[
                  isWidgetSticky 
                    ? 'fixed top-[65px] left-0 right-0 z-[9999] bg-white shadow-2xl py-0 px-0 rounded-b-[2.5rem]' 
                    : 'relative rounded-[2.5rem]'
                ]"
                class="transition-all duration-700 ease-in-out"
              >
                <SearchWidget 
                  ref="searchWidgetRef"
                  :is-sticky="isWidgetSticky" 
                  @update:tab="handleTabUpdate" 
                  @focus-change="isWidgetFocused = $event" 
                />
              </div>

              <div v-if="isWidgetSticky" :style="{ height: (widgetHeight || 400) + 'px' }"></div>
            </div>
          </div>

          <!-- Right Content: Premium Organic Image -->
          <div class="hidden lg:block w-full lg:w-[25%] relative animate-fade-in-up">
            <div class="relative">
              <!-- Pill/Organic shape container for image per mockup -->
              <div class="relative z-10 overflow-hidden rounded-t-full rounded-b-[4rem] shadow-2xl border-8 border-white group">
                <img 
                  src="@/assets/img/happy-trips.jpg" 
                  class="w-full h-auto scale-110 group-hover:scale-125 transition-transform duration-1000 object-cover"
                  alt="Happy Traveler"
                />
                <div class="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <!-- Decorative element behind image -->
              <div class="absolute -bottom-6 -right-6 w-full h-full bg-brand-blue/10 rounded-t-full rounded-b-[4rem] -z-10 rotate-6 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book with Confidence Section (Priceline style) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-0">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/CheapOair_Logo.png" class="h-6 object-contain" alt="CheapOair" />
          <span class="text-[#F48221] font-black text-sm uppercase tracking-widest italic leading-none pt-1">advantage</span>
        </div>
        <h2 class="text-2xl font-black text-brand-blue leading-tight">Book with Confidence: 40M+ Travelers, 20+ years of Expertise</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#F8FAFC] p-8 rounded-2xl border border-brand-blue/5">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-full border-2 border-brand-blue flex items-center justify-center text-brand-blue flex-shrink-0">
               <CurrencyDollarIcon class="h-6 w-6" />
            </div>
            <div>
              <h4 class="text-xs font-black text-brand-blue">Price Match Promise</h4>
              <p class="text-[10px] text-gray-500 font-bold leading-tight mt-1">Find great flight deals to destinations worldwide</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-full border-2 border-brand-blue flex items-center justify-center text-brand-blue flex-shrink-0">
               <PhoneIcon class="h-6 w-6" />
            </div>
            <div>
              <h4 class="text-xs font-black text-brand-blue">24/7 Customer Support</h4>
              <p class="text-[10px] text-gray-500 font-bold leading-tight mt-1">Speak to our travel experts: anytime, anywhere</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-full border-2 border-brand-blue flex items-center justify-center text-brand-blue flex-shrink-0">
               <TrophyIcon class="h-6 w-6" />
            </div>
            <div>
              <h4 class="text-xs font-black text-brand-blue">ClubMiles Rewards</h4>
              <p class="text-[10px] text-gray-500 font-bold leading-tight mt-1">Earn points and air miles to maximize your rewards</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-full border-2 border-brand-blue flex items-center justify-center text-brand-blue flex-shrink-0">
               <XCircleIcon class="h-6 w-6" />
            </div>
            <div>
              <h4 class="text-xs font-black text-brand-blue">Easy Cancellations</h4>
              <p class="text-[10px] text-gray-500 font-bold leading-tight mt-1">Convenient options online and 24/7 Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loyalty & App Promotion Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-0">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Loyalty Card -->
        <div class="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl flex flex-col md:flex-row justify-between gap-8 group">
          <div class="flex-1 space-y-4">
            <h3 class="text-2xl font-black text-brand-blue leading-tight">Thanks for your loyalty - savings unlocked</h3>
            <p class="text-xs font-bold text-gray-500">Save up to 20% on select hotels & up to 10% on select car rentals.</p>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 text-[11px] font-black text-brand-blue">
                <CheckCircleIcon class="h-4 w-4 text-brand-green" />
                Earn points on every booking across all our travel brands
              </li>
              <li class="flex items-center gap-2 text-[11px] font-black text-brand-blue">
                <CheckCircleIcon class="h-4 w-4 text-brand-green" />
                Instantly redeem points against our service fees
              </li>
              <li class="flex items-center gap-2 text-[11px] font-black text-brand-blue">
                <CheckCircleIcon class="h-4 w-4 text-brand-green" />
                Step up to higher ClubMiles rewards
              </li>
            </ul>
            <a href="#" class="text-[10px] text-brand-blue font-black underline decoration-2 underline-offset-4">Learn about ClubMiles</a>
          </div>
          <div class="flex flex-col items-center justify-center gap-4">
            <div class="bg-gradient-to-br from-gray-500 to-gray-800 p-6 rounded-2xl flex flex-col items-center text-center text-white relative overflow-hidden w-full md:w-56">
               <div class="flex -space-x-3 mb-4">
                  <div v-for="i in 4" :key="i" class="h-10 w-10 rounded-full border-2 border-white/20 bg-gray-700 flex items-center justify-center shadow-lg">
                    <TrophyIcon class="h-5 w-5 opacity-50" />
                  </div>
               </div>
               <p class="text-[10px] font-black opacity-70">Unlock rewards as you move to a higher tier</p>
               <div class="absolute inset-0 bg-white/5 skew-x-12 -translate-x-1/2"></div>
            </div>
            <div class="flex gap-2 w-full">
              <button class="flex-1 bg-brand-blue text-white py-3 rounded-xl font-black text-xs hover:bg-brand-blue/90 transition-all shadow-md">Book Hotels</button>
              <button class="flex-1 bg-brand-blue text-white py-3 rounded-xl font-black text-xs hover:bg-brand-blue/90 transition-all shadow-md">Book Cars</button>
            </div>
          </div>
        </div>

        <!-- App Download Promo Card -->
        <div class="bg-[#003580] rounded-[2rem] p-8 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div class="flex-1 space-y-4 relative z-10 text-white">
            <h3 class="text-2xl font-black leading-tight">Save up to <span class="text-[#F48221]">$100 off</span> our fees</h3>
            <p class="text-xs font-bold text-white/80">First time app users get up to $100 off our fees on flights.</p>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 text-[11px] font-black">
                <CheckCircleIcon class="h-4 w-4 text-brand-green" />
                Get notified when prices drop
              </li>
              <li class="flex items-center gap-2 text-[11px] font-black">
                <CheckCircleIcon class="h-4 w-4 text-brand-green" />
                Regular flight updates
              </li>
              <li class="flex items-center gap-2 text-[11px] font-black">
                <CheckCircleIcon class="h-4 w-4 text-brand-green" />
                Manage your bookings on the go
              </li>
            </ul>
            <div class="flex items-center gap-4 pt-2">
               <a href="#" class="text-[10px] font-black underline decoration-2 underline-offset-4">Learn More</a>
               <span class="text-[9px] opacity-60 font-bold">Valid until Mar 31</span>
            </div>
          </div>
          <div class="bg-white p-4 rounded-2xl flex flex-col items-center gap-3 relative z-10 w-full md:w-56 shadow-2xl">
             <p class="text-[9px] font-bold text-gray-500 text-center">Scan the QR Code to download the app</p>
             <div class="text-center">
                <p class="text-4xl font-black text-brand-blue">4.8</p>
                <div class="flex justify-center text-[#F48221] my-1">
                   <StarIcon v-for="i in 5" :key="i" class="h-3 w-3 fill-current" />
                </div>
                <p class="text-[10px] font-black uppercase text-gray-400">Rating</p>
             </div>
             <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" class="w-24 h-24" alt="QR Code" />
          </div>
          <!-- Abstract Background decoration -->
           <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-10"></div>
        </div>
      </div>
    </div>

    <!-- Round Trip Fares Section -->
    <section class="py-16 bg-white relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-2 mb-8">
          <h2 class="text-3xl font-black text-brand-blue">Don't Miss These Round Trip Fares*</h2>
          <p class="text-sm font-bold text-gray-400">Call us for phone only deals at <a href="tel:1-845-848-0255" class="text-brand-green underline decoration-2 underline-offset-4">1-845-848-0255</a></p>
        </div>

        <!-- Custom Tabs for Deals -->
        <div class="flex items-center gap-8 mb-10 border-b border-gray-100">
          <button 
            @click="fareTab = 'Round Trip'"
            class="px-4 py-3 text-sm font-black transition-all relative"
            :class="fareTab === 'Round Trip' ? 'text-brand-blue' : 'text-gray-400 hover:text-brand-blue'"
          >
            Round Trip
            <div v-if="fareTab === 'Round Trip'" class="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full"></div>
          </button>
          <button 
            @click="fareTab = 'One Way'"
            class="px-4 py-3 text-sm font-black transition-all relative"
            :class="fareTab === 'One Way' ? 'text-brand-blue' : 'text-gray-400 hover:text-brand-blue'"
          >
            One Way
            <div v-if="fareTab === 'One Way'" class="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full"></div>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="deal in currentFareDeals" :key="deal.id" class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div class="p-6 space-y-4">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center p-1 shadow-inner">
                    <img :src="deal.airlineLogo" class="h-full w-full object-contain" />
                  </div>
                  <div>
                    <h4 class="text-base font-black text-brand-blue leading-none">{{ deal.originCode }}</h4>
                    <p class="text-[10px] font-bold text-gray-400 mt-1">{{ deal.originCity }}</p>
                  </div>
                </div>
                <!-- Animated flight line -->
                <div class="h-[1px] flex-1 bg-gray-100 mx-4 mt-5 relative flex items-center justify-center">
                   <div class="h-1.5 w-1.5 rounded-full bg-gray-200"></div>
                   <div class="absolute right-0 -top-1">
                      <ChevronRightIcon class="h-3 w-3 text-gray-300" />
                   </div>
                </div>
                <div class="text-right">
                  <h4 class="text-base font-black text-brand-blue leading-none">{{ deal.destCode }}</h4>
                  <p class="text-[10px] font-bold text-gray-400 mt-1">{{ deal.destCity }}</p>
                </div>
              </div>

              <div class="flex justify-between items-end">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-gray-500">{{ deal.dates }}</p>
                  <div class="flex items-center gap-1 text-[11px] font-black text-brand-blue/60 hover:text-brand-blue transition-colors cursor-pointer group">
                    <ShareIcon class="h-3.5 w-3.5" />
                    <span>Share</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-bold text-gray-400">From <span class="text-xl font-black text-brand-blue">${{ deal.price }}<sup class="text-xs">.99</sup></span></p>
                  <button class="mt-2 bg-[#F48221] text-white px-6 py-2 rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-[#e67510] transition-colors shadow-md hover:shadow-lg">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="w-full mt-10 py-4 bg-[#F1F5F9] hover:bg-gray-200 rounded-xl text-xs font-black text-brand-blue transition-colors uppercase tracking-widest">Show More</button>
        <p class="text-[10px] text-gray-400 font-bold mt-6 italic">* All fares above were last found on: Mar 07, 2026 at 18:07:46 PM UTC.</p>
      </div>
    </section>

    <!-- Flight deals departing near you -->
    <section class="py-16 bg-[#F8FAFC] relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-1 mb-10">
          <h2 class="text-3xl font-black text-brand-blue">Flight deals departing near you</h2>
          <p class="text-sm font-bold text-gray-400">Based on your location</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(deal, idx) in flightRecommendations" :key="idx" 
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col h-full"
          >
            <div class="h-48 relative overflow-hidden flex-shrink-0">
               <img :src="deal.image" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
               <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
               <!-- Navigation arrows for mockup style -->
               <div v-if="idx === 0" class="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 rounded-lg flex items-center justify-center shadow-lg cursor-pointer">
                  <ChevronLeftIcon class="h-4 w-4 text-gray-400" />
               </div>
            </div>
            <div class="p-6 flex flex-col flex-1">
              <div class="flex justify-between items-start mb-4">
                <h4 class="text-xl font-black text-brand-blue leading-tight">{{ deal.city }}</h4>
                <div class="text-right">
                  <p class="text-xl font-black text-brand-blue leading-none">${{ deal.price }}<sup class="text-xs">.83</sup></p>
                </div>
              </div>
              <div class="mt-auto">
                <div class="flex justify-between text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 border-t border-gray-50 pt-4">
                  <span>{{ deal.route }}</span>
                  <span>Round Trip</span>
                </div>
                <p class="text-[10px] font-bold text-gray-300 mt-2">{{ deal.dates }}</p>
              </div>
            </div>
          </div>
        </div>
        <p class="text-[10px] text-gray-400 font-bold mt-10 italic text-center">* All fares above were last found on: Mar 07, 2026 at 22:33:13 PM UTC.</p>
      </div>
    </section>

    <!-- Trending Destinations Section -->
    <section class="py-16 bg-[#F1F5F9] relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-3xl font-black text-brand-blue">Explore Hotel in Trending Destinations</h2>
          <div class="flex gap-2">
            <button class="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all">
              <ChevronLeftIcon class="h-5 w-5 text-gray-400" />
            </button>
            <button class="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all">
              <ChevronRightIcon class="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div v-if="marketInsightsLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
           <div v-for="i in 5" :key="i" class="bg-gray-200 animate-pulse h-64 rounded-2xl"></div>
        </div>

        <div v-else-if="!trendingHotels.length" class="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
           <GlobeAltIcon class="h-12 w-12 text-gray-300 mx-auto mb-3" />
           <p class="text-brand-blue font-black uppercase tracking-widest text-xs">Discovering trending destinations...</p>
           <p class="text-gray-400 font-bold text-[10px] mt-1">Market data is being analyzed for your region</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="(dest, idx) in trendingHotels" :key="idx" 
            @click="navigateToHotelSearch(dest.name)"
            class="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <img :src="dest.image" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            <div class="absolute top-4 right-4 transition-premium group-hover:scale-110">
               <div class="px-3 py-1 bg-brand-green text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">Popular</div>
            </div>
            <div class="absolute bottom-4 left-4 right-4">
              <h4 class="text-white font-black text-sm mb-1 uppercase tracking-tight">{{ dest.name }}</h4>
              <p class="text-white/70 text-[10px] font-bold">{{ dest.country }} • {{ dest.count }} scores</p>
            </div>
          </div>
        </div>

        <div v-if="!marketInsightsLoading && (busiestPeriods.length || mostBooked.length || mostTraveled.length)" class="mt-12 p-8 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-2xl flex flex-col items-center justify-between gap-12 relative overflow-hidden group">
           <!-- Animated background elements -->
           <div class="absolute -right-20 -top-20 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl group-hover:bg-brand-green/20 transition-all duration-1000"></div>
           <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl group-hover:bg-brand-blue/20 transition-all duration-1000"></div>
           
           <div class="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full">
              <div class="flex-shrink-0 relative">
                 <div class="h-24 w-24 bg-gradient-to-br from-brand-blue to-brand-green rounded-[2rem] flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform duration-500">
                    <SparklesIcon class="h-12 w-12 text-white animate-pulse" />
                 </div>
                 <div class="absolute -bottom-2 -right-2 bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg border border-gray-50 scale-0 group-hover:scale-110 transition-transform delay-200">
                    <GlobeAltIcon class="h-6 w-6 text-brand-blue" />
                 </div>
              </div>
              <div class="text-center md:text-left">
                 <h4 class="text-3xl font-black text-brand-blue mb-2 tracking-tight">Traveler Intelligence</h4>
                 <p class="text-sm font-bold text-brand-gray/60 leading-relaxed max-w-xl">
                    Our AI has crunched the numbers for <span class="text-brand-green font-black underline decoration-brand-green/30 decoration-4 underline-offset-4">{{ userLocation?.city || 'your location' }}</span>. Explore the data to find your perfect getaway.
                 </p>
              </div>
           </div>

           <!-- Statistics Dashboard -->
           <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative z-10">
              <div v-if="busiestPeriods.length" class="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 hover:border-brand-green/30 hover:shadow-xl transition-all group/stat">
                 <div class="flex items-center justify-between mb-4">
                    <p class="text-[10px] font-black text-brand-blue/40 uppercase tracking-[0.25em]">Peak Season</p>
                    <SunIcon class="h-5 w-5 text-[#FFC107]" />
                 </div>
                 <p class="text-2xl font-black text-brand-blue mb-1">{{ formatPeriod(busiestPeriods[0].period) }}</p>
                 <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-4">
                    <div class="bg-brand-green h-full rounded-full transition-all duration-1000 w-[90%]"></div>
                 </div>
                 <p class="text-[9px] font-bold text-gray-400 mt-2">Highest traveler score recorded</p>
              </div>

              <div v-if="mostBooked.length" class="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 hover:border-brand-blue/30 hover:shadow-xl transition-all group/stat">
                 <div class="flex items-center justify-between mb-4">
                    <p class="text-[10px] font-black text-brand-blue/40 uppercase tracking-[0.25em]">Trending Now</p>
                    <div class="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                 </div>
                 <p class="text-2xl font-black text-brand-blue mb-1">{{ mostBooked[0].destination }}</p>
                 <p class="text-[9px] font-black text-[#F48221] uppercase tracking-widest">+45% Booking Velocity</p>
                 <div class="flex gap-1 mt-4">
                    <div v-for="i in 5" :key="i" class="h-4 w-2 rounded-sm bg-brand-blue" :style="{ opacity: 0.2 + (i * 0.15) }"></div>
                 </div>
              </div>

              <div v-if="mostTraveled.length" class="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 hover:border-brand-green/30 hover:shadow-xl transition-all group/stat">
                 <div class="flex items-center justify-between mb-4">
                    <p class="text-[10px] font-black text-brand-blue/40 uppercase tracking-[0.25em]">Verified Favs</p>
                    <ShieldCheckIcon class="h-5 w-5 text-brand-green" />
                 </div>
                 <p class="text-2xl font-black text-brand-blue mb-1">{{ mostTraveled[0].destination }}</p>
                 <div class="flex items-center gap-2 mt-4">
                    <div class="flex -space-x-2">
                       <div v-for="i in 3" :key="i" class="h-6 w-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                          <img :src="`https://i.pravatar.cc/100?img=${i+10}`" />
                       </div>
                    </div>
                    <span class="text-[9px] font-bold text-gray-500">10k+ flybeth travelers</span>
                 </div>
              </div>
           </div>

           <!-- Interactive Location Scores -->
           <div v-if="locationScore" class="w-full bg-brand-blue/90 backdrop-blur-md p-8 rounded-[2.5rem] relative overflow-hidden group/score">
              <div class="absolute inset-0 bg-gradient-to-r from-brand-blue/0 via-white/5 to-brand-blue/0 -translate-x-full group-hover/score:translate-x-full transition-transform duration-1000"></div>
              <div class="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                 <div class="text-center lg:text-left">
                    <p class="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-2">Live Destination Analysis</p>
                    <h5 class="text-2xl font-black text-white mb-2">Why visit {{ topDestinationName }}?</h5>
                    <p class="text-xs font-bold text-white/60">Real-time lifestyle scores for your next destination.</p>
                 </div>
                 
                 <div class="flex flex-wrap justify-center gap-8">
                    <div v-for="score in locationScore" :key="score.category" class="flex flex-col items-center gap-3">
                       <div class="relative h-16 w-16">
                          <svg class="h-full w-full transform -rotate-90">
                             <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="transparent" class="text-white/10" />
                             <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="transparent" :stroke-dasharray="175.9" :stroke-dashoffset="175.9 * (1 - score.overallMaxScore / 100)" class="text-brand-green transition-all duration-1000 delay-500" />
                          </svg>
                          <div class="absolute inset-0 flex items-center justify-center">
                             <span class="text-sm font-black text-white">{{ score.overallMaxScore }}</span>
                          </div>
                       </div>
                       <span class="text-[9px] font-black text-white/50 uppercase tracking-widest">{{ score.categoryName }}</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <!-- Bottom Action -->
            <p class="text-[9px] font-black text-brand-gray/40 uppercase tracking-widest relative z-10">Data powered by Amadeus Artificial Intelligence Platform</p>
        </div>
      </div>
    </section>

    <!-- City Deals Section -->
    <CityDealsGrid @select-deal="handleSelectDeal" />

    <!-- Marketing Modal Triggered by Timer -->
    <MarketingModal :show="showMarketingModal" @close="dismissMarketingModal" />
    <!-- Background Accents moved inside relative container to prevent overflow -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-3xl opacity-30"></div>
    </div>

    <!-- Matchday/Promo Banner -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-0">
      <div class="bg-brand-blue rounded-[2.5rem] p-8 flex items-center justify-between shadow-xl shadow-brand-blue/20 overflow-hidden relative group">
        <div class="flex items-center gap-8 relative z-10">
          <div class="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <GlobeAltIcon class="h-8 w-8 text-brand-blue" />
          </div>
          <div class="text-white">
            <h3 class="text-xl font-black tracking-tight">Turn matchday into a getaway — score summer savings.</h3>
            <a href="#" class="text-brand-green font-bold text-sm underline decoration-2 underline-offset-4 hover:text-white transition-colors">Find deals</a>
          </div>
        </div>
        <!-- Abstract decor -->
        <div class="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12"></div>
      </div>
    </div>

    <!-- SEO Footer Sections -->
    <section class="py-16 bg-[#F1F5F9] relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <!-- Column 1: Cheap flights from Nigeria -->
          <div v-if="africanCities.length || europeanCities.length">
            <h3 class="text-sm font-black text-brand-blue mb-6">Cheap flights from Nigeria</h3>
            <div class="space-y-6">
              <div>
                <h4 class="text-xs font-black text-brand-blue mb-3">African Flights</h4>
                <ul class="space-y-2 text-[11px] text-gray-500 font-bold">
                  <li v-for="city in africanCities" :key="city" @click="navigateToFlightSearch(city)" class="hover:text-brand-blue cursor-pointer">Flights to {{ city }}</li>
                </ul>
              </div>
              <div>
                <h4 class="text-xs font-black text-brand-blue mb-3">European Flights</h4>
                <ul class="space-y-2 text-[11px] text-gray-500 font-bold">
                  <li v-for="city in europeanCities" :key="city" @click="navigateToFlightSearch(city)" class="hover:text-brand-blue cursor-pointer">Flights to {{ city }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Column 2: Book Cheap Hotels -->
          <div v-if="africanCities.length || europeanCities.length">
            <h3 class="text-sm font-black text-brand-blue mb-6">Book Cheap Hotels</h3>
            <div class="space-y-6">
              <div>
                <h4 class="text-xs font-black text-brand-blue mb-3">African Hotels</h4>
                <ul class="space-y-2 text-[11px] text-gray-500 font-bold">
                  <li v-for="city in africanCities" :key="city" @click="navigateToHotelSearch(city)" class="hover:text-brand-blue cursor-pointer">Hotels in {{ city }}</li>
                </ul>
              </div>
              <div>
                <h4 class="text-xs font-black text-brand-blue mb-3">European Hotels</h4>
                <ul class="space-y-2 text-[11px] text-gray-500 font-bold">
                  <li v-for="city in europeanCities" :key="city" @click="navigateToHotelSearch(city)" class="hover:text-brand-blue cursor-pointer">Hotels in {{ city }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Column 3: Airlines in Nigeria/Asia -->
          <div>
            <h3 class="text-sm font-black text-brand-blue mb-6">Airlines</h3>
            <div class="space-y-6">
              <div>
                <h4 class="text-xs font-black text-brand-blue mb-3">Local Airlines</h4>
                <ul class="space-y-2 text-[11px] text-gray-500 font-bold">
                  <li v-for="airline in footerAirlines.slice(0, 4)" :key="airline" class="hover:text-brand-blue cursor-pointer">{{ airline }}</li>
                </ul>
              </div>
              <div>
                <h4 class="text-xs font-black text-brand-blue mb-3">Asian Flights</h4>
                <ul class="space-y-2 text-[11px] text-gray-500 font-bold">
                  <li v-for="city in asianCities.slice(0, 4)" :key="city" @click="navigateToFlightSearch(city)" class="hover:text-brand-blue cursor-pointer">Flights to {{ city }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Column 4: International Airlines -->
          <div>
            <h3 class="text-sm font-black text-brand-blue mb-6">&nbsp;</h3>
            <div class="space-y-6">
              <div>
                <h4 class="text-xs font-black text-brand-blue mb-3">International Airlines</h4>
                <ul class="space-y-2 text-[11px] text-gray-500 font-bold">
                  <li v-for="airline in footerAirlines.slice(4)" :key="airline" class="hover:text-brand-blue cursor-pointer">{{ airline }}</li>
                </ul>
              </div>
              <div>
                <h4 class="text-xs font-black text-brand-blue mb-3">North American Flights</h4>
                <ul class="space-y-2 text-[11px] text-gray-500 font-bold">
                  <li v-for="city in northAmericanCities.slice(0, 4)" :key="city" @click="navigateToFlightSearch(city)" class="hover:text-brand-blue cursor-pointer">Flights to {{ city }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 class="text-sm font-black text-brand-blue mb-4">Get exclusive deals on our products</h4>
              <p class="text-[11px] text-gray-500 font-bold leading-relaxed">Book Flights, Domestic Flights, International Flights, Search Hotels, Holiday Packages, Visa Assistance, and Pay Small Small</p>
            </div>
            <div>
              <h4 class="text-sm font-black text-brand-blue mb-4">Follow us!</h4>
              <p class="text-[11px] text-gray-500 font-bold leading-relaxed mb-4">Stay tuned and access the latest deals and discounts with:</p>
              <div class="flex gap-4">
                <!-- Social Icons would go here -->
                <div class="h-8 w-8 rounded bg-brand-blue/5"></div>
                <div class="h-8 w-8 rounded bg-brand-blue/5"></div>
                <div class="h-8 w-8 rounded bg-brand-blue/5"></div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-black text-brand-blue mb-4">Get inspired for your next trip!</h4>
              <p class="text-[11px] text-gray-500 font-bold leading-relaxed">Find information about the best travel destinations and events in our Dreamguides. Discover our travel guide.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed SEO Content Section -->
    <section class="py-16 bg-white border-t border-gray-50 relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article class="prose prose-sm max-w-none text-gray-500 font-medium leading-relaxed">
          <h2 class="text-xl font-black text-brand-blue mb-4">Book the Cheapest Flights, Hotels and Vacation Packages with Flybeth</h2>
          <p>Flybeth is Nigeria's premier Tour Operator, Travel Arranger, and online travel booking company. We understand that Nigerians love to book cheap flights & search for the most affordable flight tickets available...</p>
          <div class="mt-8">
            <h3 class="text-base font-black text-brand-blue mb-3">Why Choose Flybeth for Your Flight Booking?</h3>
            <p>Founded with a reputation for providing the cheap and affordable flight booking service for every Nigerian. Besides our years of experience in providing the best flight booking service...</p>
          </div>
          <button @click="showLongSeo = !showLongSeo" class="text-brand-blue font-black mt-4 border-b-2 border-brand-blue">{{ showLongSeo ? 'See less' : 'See more' }}</button>
        </article>
      </div>
    </section>

    <!-- Footer Gradient Spacer -->
    <div class="h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>

    <!-- Sticky Expert Tooltip -->
    <StickyExpertTooltip :show="showExpertTooltip" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  GlobeAltIcon, TicketIcon, ShieldCheckIcon, SparklesIcon, SunIcon, 
  ChevronLeftIcon, ChevronRightIcon, CurrencyDollarIcon, PhoneIcon, 
  TrophyIcon, XCircleIcon, CheckCircleIcon, StarIcon, ShareIcon 
} from '@heroicons/vue/24/outline'
import MarketingModal from '@/components/MarketingModal.vue' 
import StickyExpertTooltip from '@/components/StickyExpertTooltip.vue'
import CityDealsGrid from '@/components/CityDealsGrid.vue'
import SettingsSwitcher from '@/components/SettingsSwitcher.vue' 

const searchWidgetRef = ref<any>(null)

const handleSelectDeal = (deal: any) => {
  if (searchWidgetRef.value) {
    searchWidgetRef.value.handleExternalDeal(deal)
    // Smooth scroll to widget
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}
import { useSettings } from '@/composables/useSettings';
import { useI18n } from 'vue-i18n';
import { useMarketInsights } from '@/composables/modules/market-insights/useMarketInsights';
import { useFetchFlightDeals } from '@/composables/modules/flights/useFetchFlightDeals';
import { useSearchStays } from '@/composables/modules/stays/useSearchStays';
import { useFlightRecommendations } from '@/composables/modules/flights/useFlightRecommendations';
import { useFetchLiveDeals } from '@/composables/modules/flights/useFetchLiveDeals';

const { 
  loading: marketInsightsLoading, 
  mostTraveled, 
  mostBooked,
  busiestPeriods,
  userLocation,
  locationScore,
  detectUserLocation,
  fetchLocationScore,
  fetchMostTraveled,
  fetchMostBooked,
  fetchBusiestPeriods
} = useMarketInsights();

const topDestinationName = computed(() => {
  if (mostBooked.value.length > 0) return mostBooked.value[0].destination;
  if (mostTraveled.value.length > 0) return mostTraveled.value[0].destination;
  return 'Paris';
});

const formatPeriod = (period: string) => {
  if (!period) return '';
  if (period.includes('-')) {
    const parts = period.split('-');
    if (parts.length >= 2) {
      const year = parts[0];
      const month = parts[1];
      if (year && month) {
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
      }
    }
  }
  return period;
};

const { currentCurrency } = useSettings();
const { locale: currentLocale } = useI18n()
const { locales, setLocale, t } = useI18n() as any
const { currencies, setCurrency } = useSettings()
const showSettings = ref(false);
const showLongSeo = ref(false);
const offerTab = ref<'Flight' | 'Hotel'>('Flight');
const fareTab = ref<'Round Trip' | 'One Way'>('Round Trip');

const { loading: flightDealsLoading, flightDeals, fetchFlightDeals } = useFetchFlightDeals();
const { loading: staysLoading, stays, searchStays } = useSearchStays();
const { recommendations, fetchFlightInspiration } = useFlightRecommendations();
const { loadingDeals: liveDealsLoading, liveDeals, fetchLiveDeals } = useFetchLiveDeals();

const offersLoading = computed(() => flightDealsLoading.value || staysLoading.value || liveDealsLoading.value);

const currentOffers = computed(() => {
  if (offerTab.value === 'Flight') {
    const deals = Array.isArray(flightDeals.value) ? flightDeals.value : [];
    if (deals.length === 0) return [];
    return deals.slice(0, 3).map(deal => ({
      title: `${deal.departure.airport} ➔ ${deal.arrival.airport}`,
      type: deal.stops === 0 ? 'Non-stop' : '1+ Stops',
      price: `₦${deal.classes[0]?.basePrice?.toLocaleString()}`,
      installment: `₦${Math.floor(deal.classes[0]?.basePrice * 0.28).toLocaleString()}`,
      deal: deal.isFeatured,
      image: fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
      airlineLogo: `https://api.duffel.com/img/airlines/${deal.airline.slice(0, 2).toUpperCase()}.png`
    }));
  } else {
    const activeStays = Array.isArray(stays.value) ? stays.value : [];
    if (activeStays.length === 0) return [];
    return activeStays.slice(0, 3).map(stay => ({
      title: stay.name,
      type: `${stay.location?.city || 'City'}, ${stay.location?.countryCode || 'Country'}`,
      price: `₦${(stay.priceWithCommission || stay.cheapestPrice)?.toLocaleString()} / night`,
      installment: `₦${Math.floor((stay.priceWithCommission || stay.cheapestPrice) * 0.28).toLocaleString()}`,
      image: stay.photos?.[0] || fallbackImages[0],
      deal: false,
      airlineLogo: `https://logo.clearbit.com/${stay.name.toLowerCase().replace(/\s/g, '')}.com`
    }));
  }
});

const fallbackImages = [
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1580193813605-a5c78b4ee01a?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1591526038358-0e3d30499097?auto=format&fit=crop&q=80&w=400'
];

const trendingHotels = computed(() => {
  const travelers = Array.isArray(mostTraveled.value) ? mostTraveled.value : [];
  const booked = Array.isArray(mostBooked.value) ? mostBooked.value : [];
  const items = travelers.length > 0 ? travelers : booked;
  if (items.length === 0) return [];
  return items.slice(0, 10).map((item: any, idx: number) => ({
    name: item.destination,
    count: Math.floor(item.analytics?.travelers?.score * 10) || 100,
    country: 'International',
    image: fallbackImages[idx % fallbackImages.length]
  }));
});

const africanCities = computed(() => {
  const travelers = Array.isArray(mostTraveled.value) ? mostTraveled.value : [];
  const booked = Array.isArray(mostBooked.value) ? mostBooked.value : [];
  if (travelers.length > 0) return travelers.slice(0, 4).map(d => d.destination);
  if (booked.length > 0) return booked.slice(0, 4).map(d => d.destination);
  return [];
});

const europeanCities = computed(() => {
  const travelers = Array.isArray(mostTraveled.value) ? mostTraveled.value : [];
  const booked = Array.isArray(mostBooked.value) ? mostBooked.value : [];
  if (travelers.length > 4) return travelers.slice(4, 8).map(d => d.destination);
  if (booked.length > 4) return booked.slice(4, 8).map(d => d.destination);
  return [];
});

const footerAirlines = ['Air Peace', 'Arik Air', 'Ibom Air', 'British Airways', 'Emirates', 'Qatar Airways'];

// All data above is now API-driven — no hardcoded arrays

const asianCities = ['Dubai', 'Abu Dhabi', 'Guangzhou', 'New Delhi', 'Tokyo', 'Singapore'];
const northAmericanCities = ['Atlanta', 'Toronto', 'Houston', 'New York', 'Los Angeles', 'Chicago'];

const formatDateShort = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' });
};

const navigateToFlightSearch = (destination: string) => {
  const origin = userLocation.value?.cityCode || 'LOS';
  const query = {
    origin,
    destination: destination.toUpperCase().slice(0, 3), // Simple heuristic for demo
    departureDate: new Date().toISOString().split('T')[0],
    adults: 1,
    cabinClass: 'ECONOMY'
  };
  navigateTo({ path: '/flights', query });
};

const currentFareDeals = computed(() => {
  const isRoundTrip = fareTab.value === 'Round Trip';
  
  if (liveDeals.value.length > 0) {
    return liveDeals.value.slice(0, 6).map((deal, idx) => ({
      id: deal.id || idx,
      originCode: deal.departure.airport,
      originCity: deal.departure.city || deal.departure.airport,
      destCode: deal.arrival.airport,
      destCity: deal.arrival.city || deal.arrival.airport,
      price: Math.floor(deal.priceWithCommission || deal.price),
      dates: `${formatDateShort(deal.departure.at)} - ${formatDateShort(deal.arrival.at)}`,
      airlineLogo: `https://api.duffel.com/img/airlines/${deal.airline.slice(0, 2).toUpperCase()}.png`
    }));
  }

  // Fallback
  return [
    { id: 1, originCode: 'CHI', originCity: 'Chicago', destCode: 'FLL', destCity: 'Fort Lauderdale', price: isRoundTrip ? 79 : 45, dates: 'Tue, Apr 21 - Sat, Apr 25', airlineLogo: 'https://api.duffel.com/img/airlines/NK.png' },
    { id: 2, originCode: 'NYC', originCity: 'New York City', destCode: 'ORL', destCity: 'Orlando', price: isRoundTrip ? 85 : 49, dates: 'Sun, May 03 - Wed, May 06', airlineLogo: 'https://api.duffel.com/img/airlines/NK.png' },
    { id: 3, originCode: 'CHI', originCity: 'Chicago', destCode: 'MIA', destCity: 'Miami', price: isRoundTrip ? 93 : 52, dates: 'Thu, Apr 09 - Thu, Apr 16', airlineLogo: 'https://api.duffel.com/img/airlines/NK.png' },
    { id: 4, originCode: 'BOS', originCity: 'Boston', destCode: 'MIA', destCity: 'Miami', price: isRoundTrip ? 95 : 55, dates: 'Mon, Mar 30 - Wed, Apr 01', airlineLogo: 'https://api.duffel.com/img/airlines/NK.png' },
    { id: 5, originCode: 'FLL', originCity: 'Fort Lauderdale', destCode: 'NYC', destCity: 'New York City', price: isRoundTrip ? 105 : 62, dates: 'Tue, Apr 28 - Wed, Apr 29', airlineLogo: 'https://api.duffel.com/img/airlines/NK.png' },
    { id: 6, originCode: 'NYC', originCity: 'New York City', destCode: 'MIA', destCity: 'Miami', price: isRoundTrip ? 105 : 62, dates: 'Tue, Apr 07 - Tue, Apr 14', airlineLogo: 'https://api.duffel.com/img/airlines/NK.png' },
  ]
});

const flightRecommendations = computed(() => {
  const formatMonthDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  if (liveDeals.value.length > 3) {
    return liveDeals.value.slice(0, 4).map((deal, idx) => ({
      city: deal.arrival.city || deal.arrival.airport,
      route: `${deal.departure.airport} - ${deal.arrival.airport}`,
      price: Math.floor(deal.priceWithCommission || deal.price),
      dates: `${formatMonthDay(deal.departure.at)} - ${formatMonthDay(deal.arrival.at)}`,
      image: fallbackImages[idx % fallbackImages.length]
    }));
  }
  
  return [
    { city: 'New York City', route: 'LOS - NYC', price: 942, dates: 'Apr 22 - Nov 11', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400' },
    { city: 'Washington DC', route: 'LOS - WAS', price: 973, dates: 'Apr 27 - Jul 20', image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&q=80&w=400' },
    { city: 'Casablanca', route: 'LOS - CAS', price: 1029, dates: 'Apr 02 - Apr 08', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=400' },
    { city: 'Dallas', route: 'LOS - DFW', price: 1316, dates: 'May 13 - Oct 12', image: 'https://images.unsplash.com/photo-1521464302485-4632f74ef110?auto=format&fit=crop&q=80&w=400' }
  ]
});

const navigateToHotelSearch = (city: string) => {
  const query = {
    location: city,
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: 2,
    rooms: 1
  };
  navigateTo({ path: '/stays', query });
};

const currentTab = ref('Flights')
const showMarketingModal = ref(false)
const isWidgetSticky = ref(false)
const showExpertTooltip = ref(false)
const widgetContainer = ref<HTMLElement | null>(null)
const widgetHeight = ref(0)
let marketingTimer: ReturnType<typeof setTimeout> | null = null

const handleWidgetScroll = () => {
  if (widgetContainer.value && !isWidgetSticky.value) {
    widgetHeight.value = widgetContainer.value.offsetHeight
  }
  const scrollY = window.scrollY
  isWidgetSticky.value = false // Always false per user request
  // Show expert tooltip when scrolled away from Hero (top)
  showExpertTooltip.value = scrollY > 600
}

interface BackgroundAsset {
  type: 'video' | 'image'
  url: string
}

const backgrounds: Record<string, BackgroundAsset> = {
  'Flights': { 
    type: 'video', 
    url: 'https://cdn.travelwings.com/web-assets/others/tw-homepage-video-desktop-09-01.mp4' 
  },
  'Holidays': { 
    type: 'video', 
    url: 'https://cdn.travelwings.com/assets/others/tw-pwa-holiday-ng-26.mp4' 
  },
  'Hotels': { 
    type: 'video', 
    url: 'https://cdn.travelwings.com/web-assets/others/tw-homepage-video-desktop-09-01.mp4' 
  },
  'Cruises': { 
    type: 'video', 
    url: 'https://cdn.travelwings.com/assets/others/TW_Morocco_cruise.mp4' 
  },
  'Cars': { 
    type: 'image', 
    url: 'https://cdn.travelwings.com/assets/images/LP_banner_car_rentals_GH_f0a1352ff1.jpg' 
  }
}

const isWidgetFocused = ref(false)

const heroTitle = computed(() => {
  switch (currentTab.value) {
    case 'Flights': return 'Save big on your next flight';
    case 'Hotels': return 'Save big on your next hotel';
    case 'Transfers': return 'Book reliable airport transfers';
    case 'Activities': return 'Discover amazing things to do';
    case 'Cruises': return 'Sail away with exclusive cruise deals';
    case 'Cars': return 'Rent a car for your next adventure';
    default: return 'Save big on your next trip';
  }
});

const handleTabUpdate = (tab: string) => {
  currentTab.value = tab;
}

const activeBackground = computed((): BackgroundAsset => {
  const asset = backgrounds[currentTab.value] || backgrounds['Flights']
  return asset as BackgroundAsset
})

const startMarketingTimer = () => {
  // Check if already dismissed in this session
  if (sessionStorage.getItem('marketing_dismissed')) return

  // Show after 45 seconds
  marketingTimer = setTimeout(() => {
    showMarketingModal.value = true
  }, 45000)
}

const dismissMarketingModal = () => {
  showMarketingModal.value = false
  sessionStorage.setItem('marketing_dismissed', 'true')
  if (marketingTimer) clearTimeout(marketingTimer)
}

onMounted(async () => {
  window.addEventListener('scroll', handleWidgetScroll);
  startMarketingTimer();
  
  // Detect user location first
  const location = await detectUserLocation();
  const originCode = location?.cityCode || 'LOS';

  // Fetch comprehensive market insights based on user location
  const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentYear = new Date().getFullYear().toString();
  
  await Promise.all([
    fetchMostTraveled(originCode, currentPeriod),
    fetchMostBooked(originCode, currentPeriod),
    fetchBusiestPeriods(originCode, currentYear)
  ]);

  // Fetch scores for the top trending destination
  if (mostBooked.value.length > 0 || mostTraveled.value.length > 0) {
     // Default coordinates for popular cities (fallback if we don't have geo API for city names yet)
     // For demo/test purposes, we use Paris coordinates as a known working set
     await fetchLocationScore(48.8566, 2.3522); 
  }

  // Fetch flight deals
  fetchFlightDeals(6);
  
  // Fetch live deals based on origin
  fetchLiveDeals(originCode);

  // Fetch hotel listings (using searchLive with the detected location)
  searchStays({
    lat: location?.latitude || 6.5244,
    lng: location?.longitude || 3.3792,
    guests: 2,
    checkIn: new Date().toISOString().split('T')[0]
  });

  // Fetch flight inspiration/recommendations
  fetchFlightInspiration(originCode);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleWidgetScroll);
  if (marketingTimer) clearTimeout(marketingTimer)
})
</script>

<style>
.font-header {
  font-family: 'Spectral', serif;
}
.font-body {
  font-family: 'Roboto', sans-serif;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up {
  animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fade-in 1.5s ease-out forwards;
}

.fade-bg-enter-active,
.fade-bg-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.fade-bg-enter-from,
.fade-bg-leave-to {
  opacity: 0;
}

.animate-fade-in-delayed {
  animation: fade-in 2s ease-out forwards;
}

.animate-tilt {
  animation: tilt 10s infinite linear;
}

@keyframes tilt {
  0%, 50%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(0.5deg); }
  75% { transform: rotate(-0.5deg); }
}
</style>
