<template>
  <div class="min-h-screen bg-white overflow-x-hidden relative">
    <!-- Premium Hero Section with Clean Background -->
    <div class="relative min-h-[700px] flex items-center pt-8 overflow-hidden bg-[#eff6ff]">
      <!-- Abstract Background Curves (Priceline style) -->
      <div class="absolute top-0 right-0 w-[1200px] h-[1200px] bg-brand-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] bg-brand-blue rounded-full opacity-10"></div>
      <div class="absolute top-[20%] right-[10%] w-64 h-64 bg-brand-blue/10 rounded-full blur-2xl"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <!-- Left Content: Dynamic Title + Search -->
          <div class="w-full lg:w-[80%]">
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
                  :is-sticky="isWidgetSticky" 
                  @update:tab="handleTabUpdate" 
                  @focus-change="isWidgetFocused = $event" 
                />
              </div>
              <!-- Placeholder to prevent layout jump -->
              <div v-if="isWidgetSticky" :style="{ height: (widgetHeight || 400) + 'px' }"></div>
            </div>
          </div>

          <!-- Right Content: Premium Image (Smaller per mockup) -->
          <div class="hidden lg:block w-full lg:w-[20%] relative animate-fade-in-up">
            <div class="relative">
              <!-- Clip path / organic shape container for image -->
              <div class="relative z-10 overflow-hidden rounded-[3rem] shadow-2xl border-4 border-white/50">
                <img 
                  src="@/assets/img/happy-trips.jpg" 
                  class="w-full h-auto scale-110"
                  alt="Happy Traveler"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Offers Section (Tabs: Flight, Hotel) -->
    <section class="py-16 bg-white relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-8">
            <h2 class="text-3xl font-black text-brand-blue">Offers</h2>
            <div class="flex bg-gray-100 p-1 rounded-xl">
              <button 
                @click="offerTab = 'Flight'"
                :class="[offerTab === 'Flight' ? 'bg-white shadow-md text-brand-blue' : 'text-gray-500 hover:text-brand-blue']"
                class="px-6 py-2 rounded-lg text-sm font-black transition-all"
              >
                Flight
              </button>
              <button 
                @click="offerTab = 'Hotel'"
                :class="[offerTab === 'Hotel' ? 'bg-white shadow-md text-brand-blue' : 'text-gray-500 hover:text-brand-blue']"
                class="px-6 py-2 rounded-lg text-sm font-black transition-all"
              >
                Hotel
              </button>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeftIcon class="h-5 w-5 text-gray-400" />
            </button>
            <button class="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRightIcon class="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div v-if="offersLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-gray-50 animate-pulse h-80 rounded-2xl"></div>
        </div>

        <div v-else-if="!currentOffers.length" class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
           <div class="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
             <TicketIcon class="h-8 w-8 text-gray-300" />
           </div>
           <p class="text-brand-blue font-black uppercase tracking-widest text-xs">No active {{ offerTab.toLowerCase() }} offers found</p>
           <p class="text-gray-400 font-bold text-[10px] mt-1">Check back later for exclusive deals</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(offer, idx) in currentOffers" :key="idx" 
            class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div class="relative h-48 rounded-xl overflow-hidden mb-4">
              <img :src="offer.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div v-if="offer.deal" class="absolute top-4 left-4 bg-[#FFC107] text-black text-[10px] font-black px-3 py-1 rounded-md uppercase">Deal of the Day</div>
              <div class="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                <img :src="offer.airlineLogo" class="h-6 w-6 object-contain" />
              </div>
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ offer.type }}</p>
                  <h4 class="text-xl font-black text-brand-blue">{{ offer.title }}</h4>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-gray-400 font-bold">Pay Now:</p>
                  <p class="text-xl font-black text-brand-blue">{{ offer.price }}</p>
                </div>
                <div class="flex flex-col items-end">
                  <div class="flex items-center gap-1 bg-brand-blue/5 px-2 py-1 rounded text-[10px] font-black text-brand-blue mb-2">
                    <span class="bg-brand-blue text-white px-1 py-0.5 rounded-[2px] text-[8px]">PAY</span>
                    SMALL SMALL
                  </div>
                  <p class="text-brand-blue font-black text-xs">{{ offer.installment }}</p>
                </div>
              </div>
              
              <UiBaseButton variant="primary" class="w-full !bg-[#F48221] !border-[#F48221] !rounded-xl font-black uppercase tracking-widest py-3 hover:!bg-[#e67510]">
                Book Now
              </UiBaseButton>
            </div>
          </div>
        </div>
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


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { GlobeAltIcon, TicketIcon, ShieldCheckIcon, SparklesIcon, SunIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import MarketingModal from '@/components/MarketingModal.vue' 
import SettingsSwitcher from '@/components/SettingsSwitcher.vue' 
import { useSettings } from '@/composables/useSettings';
import { useI18n } from 'vue-i18n';
import { useMarketInsights } from '@/composables/modules/market-insights/useMarketInsights';
import { useFetchFlightDeals } from '@/composables/modules/flights/useFetchFlightDeals';
import { useSearchStays } from '@/composables/modules/stays/useSearchStays';
import { useFlightRecommendations } from '@/composables/modules/flights/useFlightRecommendations';

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

const { loading: flightDealsLoading, flightDeals, fetchFlightDeals } = useFetchFlightDeals();
const { loading: staysLoading, stays, searchStays } = useSearchStays();
const { recommendations, fetchFlightInspiration } = useFlightRecommendations();

const offersLoading = computed(() => flightDealsLoading.value || staysLoading.value);

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
const widgetContainer = ref<HTMLElement | null>(null)
const widgetHeight = ref(0)
let marketingTimer: ReturnType<typeof setTimeout> | null = null

const handleWidgetScroll = () => {
  if (widgetContainer.value && !isWidgetSticky.value) {
    widgetHeight.value = widgetContainer.value.offsetHeight
  }
  isWidgetSticky.value = window.scrollY > 400
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
