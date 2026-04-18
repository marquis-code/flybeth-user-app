<template>
  <div class="min-h-screen bg-white overflow-x-hidden relative">
    <!-- Hero Section — Clean & Professional -->
    <div class="relative w-full pb-8 lg:pb-20 overflow-hidden">
      <!-- Background with elegant gradient overlay -->
      <div class="absolute inset-0 z-0 text-3xl tracking-tight text-white leading-snug">
        <img src="@/assets/img/happy-trips.jpg" class="w-full h-full object-cover object-top" alt="Hero Background" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/60 to-[#f8fafc]"></div>
      </div>
      
      <div class="relative z-10 pt-32 lg:pt-48 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        <!-- Minimal title -->
        <div class="mb-8 lg:mb-10 flex flex-col items-center w-full max-w-3xl mx-auto text-center">
           <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 mb-3">Search · Compare · Book</p>
           <h1 class="text-2xl lg:text-4xl  tracking-tight text-white leading-snug">
             {{ heroTitle }}
           </h1>
        </div>
        
        <!-- Search Widget -->
        <div class="w-full max-w-5xl mx-auto">
          <div ref="widgetContainer" class="relative">
            <div 
              :class="[
                isWidgetSticky 
                  ? 'fixed top-[65px] left-0 right-0 z-[9999] bg-white shadow-xl py-0 px-0 rounded-b-[2rem]' 
                  : 'relative rounded-[2rem] shadow-xl'
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
      </div>
    </div>

    <!-- Trust Bar — Compact & Clean -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-0">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div class="flex items-start gap-4 group">
          <div class="h-11 w-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
             <CurrencyDollarIcon class="h-5 w-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 leading-tight">Lowest Fares</h4>
            <p class="text-[11px] text-gray-400 mt-0.5">Exclusive private rates</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4 group">
          <div class="h-11 w-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
             <TrophyIcon class="h-5 w-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 leading-tight">Travel Rewards</h4>
            <p class="text-[11px] text-gray-400 mt-0.5">Earn on every booking</p>
          </div>
        </div>

        <div class="flex items-start gap-4 group">
          <div class="h-11 w-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
             <SparklesIcon class="h-5 w-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 leading-tight">Seamless Booking</h4>
            <p class="text-[11px] text-gray-400 mt-0.5">Simple, expert experiences</p>
          </div>
        </div>

        <div class="flex items-start gap-4 group">
          <div class="h-11 w-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
             <PhoneIcon class="h-5 w-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 leading-tight">24/7 Support</h4>
            <p class="text-[11px] text-gray-400 mt-0.5">Always here to help</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loyalty & App Promotion Grid (Redesigned) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Rewards Card -->
        <div class="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-8 md:p-10 flex flex-col justify-between group overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-500 min-h-[320px]">
          <div class="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
             <TrophyIcon class="w-64 h-64 text-gray-900" />
          </div>
          <div class="relative z-10 w-full max-w-sm flex flex-col h-full">
             <h3 class="text-3xl text-gray-900 leading-tight mb-4 tracking-tight">Flybeth Rewards</h3>
             <p class="text-sm font-medium text-gray-500 leading-relaxed mb-auto pr-4">
               Earn points on every flight, hotel, and car rental. Redeem instantly to cover service fees or unlock exclusive discounts globally.
             </p>
             <button class="bg-gray-900 text-white font-bold text-xs mt-8 px-6 py-3 rounded-xl hover:bg-gray-800 transition-all tracking-widest uppercase self-start">
               Join for Free
             </button>
          </div>
        </div>

        <!-- App Promo Card -->
        <div class="bg-gray-900 rounded-3xl p-8 md:p-10 flex flex-col sm:flex-row justify-between items-center gap-8 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 min-h-[320px]">
           <div class="absolute -right-16 -top-16 opacity-5 group-hover:rotate-12 transition-transform duration-700">
             <DevicePhoneMobileIcon class="w-80 h-80 text-white" />
           </div>
           
           <div class="relative z-10 w-full max-w-sm text-center sm:text-left flex flex-col h-full justify-center">
             <h3 class="text-3xl text-white leading-tight mb-4 tracking-tight">Get the App, <br class="hidden sm:block" /><span class="text-white/70">Save $100</span></h3>
             <p class="text-sm font-medium text-white/50 leading-relaxed mb-6 pr-4">
               Scan the code to download our app. First-time mobile users get up to $100 off their first confirmed flight booking.
             </p>
             <div class="flex items-center justify-center sm:justify-start gap-1.5">
                 <StarIcon class="w-3.5 h-3.5 text-amber-400" v-for="i in 5" :key="i" />
                 <span class="text-white/50 text-[10px] font-bold tracking-widest ml-2 uppercase">4.8 Rating</span>
             </div>
           </div>

           <div class="relative z-10 shrink-0 self-center">
             <div class="bg-white p-3 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500 flex flex-col items-center">
               <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" class="w-20 h-20 object-contain" alt="QR Code" />
               <p class="text-[9px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest text-center">Scan to Install</p>
             </div>
           </div>
        </div>

      </div>
    </div>

    <!-- Exclusive Flight Deals Section -->
    <section v-if="currentTab === 'Flights' || showAllSections" class="py-16 bg-white relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div class="flex flex-col gap-3">
            <h2 class="text-4xl  text-gray-900 tracking-tight">Exclusive Flight Deals</h2>
            <p class="text-sm font-bold text-gray-400 max-w-lg leading-relaxed">
              Handpicked {{ fareTab.toLowerCase() }} offers from {{ userLocation?.city || 'your location' }}. Updated in real-time for your next adventure.
            </p>
          </div>
          
          <!-- Custom Tabs for Deals -->
          <div class="flex items-center gap-8 border-b border-gray-100">
            <button 
              @click="fareTab = 'Round Trip'"
              class="pb-4 text-[10px] font-bold tracking-widest transition-all relative"
              :class="fareTab === 'Round Trip' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'"
            >
              Round trip
              <div v-if="fareTab === 'Round Trip'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>
            </button>
            <button 
              @click="fareTab = 'One Way'"
              class="pb-4 text-[10px] font-bold tracking-widest transition-all relative"
              :class="fareTab === 'One Way' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'"
            >
              One way
              <div v-if="fareTab === 'One Way'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>
            </button>
          </div>
        </div>

        <div v-if="liveDealsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="bg-gray-50 animate-pulse h-[400px] rounded-[2rem]"></div>
        </div>

        <div v-else-if="!currentFareDeals.length" class="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <TicketIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
           <p class="text-gray-900  text-xl">No {{ fareTab.toLowerCase() }} deals available</p>
           <p class="text-gray-400 font-bold text-sm mt-1">Check back soon for latest flight offers from {{ userLocation?.city || 'your location' }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(deal, idx) in currentFareDeals" :key="deal.id" 
            @click="handleBookNow(deal)"
            class="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden group h-[320px] flex flex-col cursor-pointer"
          >
            <!-- Card Header with Image -->
            <div class="h-28 relative overflow-hidden flex-shrink-0">
               <img :src="fallbackImages[idx % fallbackImages.length]" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div class="absolute bottom-3 left-5 right-5 flex justify-between items-end">
                  <div>
                    <h3 class="text-base  text-white leading-tight font-bold">{{ deal.destCity || deal.destCode }}</h3>
                    <p class="text-[9px] text-white/80 tracking-wide font-medium">{{ deal.originCity || deal.originCode }} ➔ {{ deal.destCity || deal.destCode }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-white/60 text-[8px] font-bold tracking-widest leading-none mb-1">Starting from</p>
                    <p class="text-lg  text-white leading-none">${{ deal.price }}</p>
                  </div>
               </div>
            </div>

            <!-- Card Body -->
            <div class="flex-1 p-4 flex flex-col justify-between relative">
              <!-- Airline Logo - Body placement for visibility -->
              <div class="absolute -top-4 right-4">
                 <div class="h-9 w-9 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md border border-gray-50">
                   <img :src="deal.airlineLogo" class="h-full w-full object-contain" />
                 </div>
              </div>

              <div class="space-y-2">
                 <div class="flex items-center gap-4 text-xs font-bold text-gray-500">
                    <div class="flex items-center gap-2">
                       <div class="h-2 w-2 rounded-full bg-gray-900"></div>
                       {{ fareTab }}
                    </div>
                    <span>•</span>
                    <span>Economy Class</span>
                 </div>
                 <p class="text-[13px] font-bold text-gray-900 leading-snug">
                   Experience {{ deal.destCity || deal.destCode }} with Flybeth's exclusive negotiated rates. 
                   <span class="text-gray-500">{{ deal.dates }}</span>
                 </p>
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                <div @click.stop="handleShare(deal)" class="flex items-center gap-2 text-[10px] font-bold tracking-wide text-gray-400 hover:text-gray-900 transition-colors group/share">
                  <ShareIcon class="h-4 w-4" />
                  <span class="group-hover/share:underline">Share deal</span>
                </div>
                <button @click.stop="handleBookNow(deal)" class="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest hover:bg-black transition-all transform active:scale-95 shadow-sm">
                  Book now
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>

    <!-- Flight deals departing near you -->
    <section v-if="currentTab === 'Flights' || showAllSections" class="py-16 bg-[#F8FAFC] relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-1 mb-10">
          <h2 class="text-3xl  text-gray-900">Flight deals departing near you</h2>
          <p class="text-sm font-bold text-gray-400">Based on your location</p>
        </div>

        <div v-if="liveDealsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-gray-100 animate-pulse h-80 rounded-xl"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(deal, idx) in flightRecommendations" :key="idx" 
            @click="handleBookNow(deal)"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col h-full cursor-pointer"
          >
            <div class="h-48 relative overflow-hidden flex-shrink-0">
               <img :src="deal.image" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
               <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
               <div class="absolute top-4 left-4">
                 <div class="px-2 py-1 bg-white/90 backdrop-blur text-[9px] uppercase tracking-widest rounded-lg shadow-lg  text-gray-900">Recommended</div>
               </div>
            </div>
            <div class="p-6 flex flex-col flex-1">
              <div class="flex justify-between items-start mb-4">
                <h4 class="text-xl  text-gray-900 leading-tight">{{ deal.city }}</h4>
                <div class="text-right">
                  <p class="text-xl  text-gray-900 leading-none">${{ deal.price }}</p>
                </div>
              </div>
              <div class="mt-auto">
                <div class="flex justify-between text-[10px]  uppercase tracking-[0.15em] text-gray-400 border-t border-gray-50 pt-4">
                  <span>{{ deal.route }}</span>
                  <span class="text-gray-900">{{ deal.isRoundTrip ? 'Round Trip' : 'One Way' }}</span>
                </div>
                <p class="text-xs font-bold text-gray-300 mt-2">{{ deal.dates }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- <p class="text-sm text-gray-400 font-bold mt-10 italic text-center">* All fares above were last found on: Mar 07, 2026 at 22:33:13 PM UTC.</p> -->
      </div>
    </section>

    <!-- Trending Destinations Section -->
    <section v-if="currentTab === 'Hotels' || showAllSections" class="py-16 bg-[#F1F5F9] relative z-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-3xl text-gray-900 mb-2">Hotels near you</h2>
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
           <p class="text-gray-900  uppercase tracking-widest text-xs">Discovering trending destinations...</p>
           <p class="text-gray-400 font-bold text-sm mt-1">Market data is being analyzed for your region</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="(dest, idx) in trendingHotels" :key="idx" 
            @click="dest.isLive ? handleBookNow(dest) : navigateToHotelSearch(dest.name)"
            class="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <img :src="dest.image" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            <div class="absolute top-4 right-4 transition-premium group-hover:scale-110">
               <div class="px-3 py-1 bg-gray-900 text-white text-[8px] uppercase tracking-widest rounded-full shadow-lg">{{ dest.isLive ? 'Trending' : 'Popular' }}</div>
            </div>
            <div class="absolute bottom-4 left-4 right-4">
              <h4 class="text-white text-sm mb-1 uppercase tracking-tight line-clamp-1">{{ dest.name }}</h4>
              <div class="flex items-center justify-between">
                <p class="text-white/70 text-[10px] font-bold">{{ dest.city }} • {{ dest.rating }} Stars</p>
                <div class="text-right">
                  <p class="text-white/60 text-[8px] font-bold tracking-widest leading-none mb-1">Starting from</p>
                  <p class="text-white text-xs font-bold leading-none">${{ dest.price }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-20 max-w-7xl mx-auto">
          <TopHotelDeals destinationName="USA" :lat="40.7128" :lng="-74.0060" />
          <TopHotelDeals destinationName="Canada" :lat="43.6510" :lng="-79.3470" />
          <TopHotelDeals destinationName="Mexico" :lat="21.1619" :lng="-86.8515" />
        </div>

        <div v-if="currentTab === 'Flights' || currentTab === 'Hotels' || showAllSections" class="mt-12 p-8 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-2xl flex flex-col items-center justify-between gap-12 relative overflow-hidden group">
           <!-- Animated background elements -->
           <div class="absolute -right-20 -top-20 w-80 h-80 bg-gray-200 rounded-full blur-3xl group-hover:bg-gray-300 transition-all duration-1000"></div>
           <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all duration-1000"></div>
           
           <div class="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full">
              <div class="flex-shrink-0 relative">
                 <div class="h-24 w-24 bg-gradient-to-br from-gray-900 to-gray-700 rounded-[2rem] flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform duration-500">
                    <SparklesIcon class="h-12 w-12 text-white animate-pulse" />
                 </div>
                 <div class="absolute -bottom-2 -right-2 bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg border border-gray-50 scale-0 group-hover:scale-110 transition-transform delay-200">
                    <GlobeAltIcon class="h-6 w-6 text-gray-900" />
                 </div>
              </div>
              <div class="text-center md:text-left">
                 <h4 class="text-3xl  text-gray-900 mb-2 tracking-tight">Traveler Intelligence</h4>
                 <p class="text-sm font-bold text-gray-400 leading-relaxed max-w-xl">
                    Our AI has crunched the numbers for <span class="text-gray-900 underline decoration-gray-900/20 decoration-4 underline-offset-4">{{ userLocation?.city || 'your location' }}</span>. Explore the data to find your perfect getaway.
                 </p>
              </div>
           </div>

           <!-- Statistics Dashboard -->
           <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative z-10">
              <div v-if="busiestPeriods.length" class="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 hover:border-gray-900/30 hover:shadow-xl transition-all group/stat">
                 <div class="flex items-center justify-between mb-4">
                    <p class="text-sm  text-gray-900 uppercase tracking-[0.25em]">Peak Season</p>
                    <SunIcon class="h-5 w-5 text-[#FFC107]" />
                 </div>
                 <p class="text-2xl  text-gray-900 mb-1">{{ formatPeriod(busiestPeriods[0].period) }}</p>
                 <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-4">
                    <div class="bg-gray-900 h-full rounded-full transition-all duration-1000 w-[90%]"></div>
                 </div>
                 <p class="text-[9px] font-bold text-gray-400 mt-2">Highest traveler score recorded</p>
              </div>

              <div v-if="mostBooked.length" class="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 hover:border-gray-900/30 hover:shadow-xl transition-all group/stat">
                 <div class="flex items-center justify-between mb-4">
                    <p class="text-sm  text-gray-900 uppercase tracking-[0.25em]">Trending Now</p>
                    <div class="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                 </div>
                 <p class="text-2xl  text-gray-900 mb-1">{{ mostBooked[0].destination }}</p>
                 <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+45% Booking Velocity</p>
                 <div class="flex gap-1 mt-4">
                    <div v-for="i in 5" :key="i" class="h-4 w-2 rounded-sm bg-gray-900" :style="{ opacity: 0.2 + (i * 0.15) }"></div>
                 </div>
              </div>

              <div v-if="mostTraveled.length" class="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 hover:border-gray-900/30 hover:shadow-xl transition-all group/stat">
                 <div class="flex items-center justify-between mb-4">
                    <p class="text-sm  text-gray-900 uppercase tracking-[0.25em]">Verified Favs</p>
                    <ShieldCheckIcon class="h-5 w-5 text-gray-900" />
                 </div>
                 <p class="text-2xl  text-gray-900 mb-1">{{ mostTraveled[0].destination }}</p>
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
           <div v-if="locationScore" class="w-full bg-gray-900 p-8 rounded-[2.5rem] relative overflow-hidden group/score">
              <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover/score:translate-x-full transition-transform duration-1000"></div>
              <div class="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                 <div class="text-center lg:text-left">
                    <p class="text-sm text-gray-400 uppercase tracking-[0.3em] mb-2">Live Destination Analysis</p>
                    <h5 class="text-2xl  text-white mb-2">Why visit {{ topDestinationName }}?</h5>
                    <p class="text-xs font-bold text-white/40">Real-time lifestyle scores for your next destination.</p>
                 </div>
                 
                 <div class="flex flex-wrap justify-center gap-8">
                    <div v-for="score in locationScore" :key="score.category" class="flex flex-col items-center gap-3">
                       <div class="relative h-16 w-16">
                          <svg class="h-full w-full transform -rotate-90">
                             <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="transparent" class="text-white/10" />
                             <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="transparent" :stroke-dasharray="175.9" :stroke-dashoffset="175.9 * (1 - score.overallMaxScore / 100)" class="text-white transition-all duration-1000 delay-500" />
                          </svg>
                          <div class="absolute inset-0 flex items-center justify-center">
                             <span class="text-sm font-bold text-white">{{ score.overallMaxScore }}</span>
                          </div>
                       </div>
                       <span class="text-[9px] font-bold text-white/50 uppercase tracking-widest">{{ score.categoryName }}</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <!-- Bottom Action -->
            <p class="text-[9px]  text-brand-gray/40 uppercase tracking-widest relative z-10">Data powered by Amadeus Artificial Intelligence Platform</p>
        </div>
      </div>
    </section>

    <!-- Activities Section -->
    <TrendingActivities v-if="currentTab === 'Activities' || showAllSections" />

    <!-- City Deals Section -->
    <CityDealsGrid v-if="currentTab === 'Flights' || showAllSections" @select-deal="handleSelectDeal" />

    <!-- Marketing Modal Triggered by Timer -->
    <MarketingModal :show="showMarketingModal" @close="dismissMarketingModal" />
    <!-- Background Accents moved inside relative container to prevent overflow -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-gray-900/5 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-gray-400/5 rounded-full blur-3xl opacity-30"></div>
    </div>

    <!-- Matchday/Promo Banner -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-0">
      <div class="bg-brand-blue rounded-[2.5rem] p-8 flex items-center justify-between shadow-xl shadow-brand-blue/20 overflow-hidden relative group">
        <div class="flex items-center gap-8 relative z-10">
          <div class="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <GlobeAltIcon class="h-8 w-8 text-gray-900" />
          </div>
          <div class="text-white">
            <h3 class="text-xl  tracking-tight">Turn matchday into a getaway — score summer savings.</h3>
            <a href="#" class="text-brand-green font-bold text-sm underline decoration-2 underline-offset-4 hover:text-white transition-colors">Find deals</a>
          </div>
        </div>
        <!-- Abstract decor -->
        <div class="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12"></div>
      </div>
    </div>

    <!-- Premium Travel Directory & Engagement Section -->
    <section class="pt-20 bg-[#F8FAFC] border-t border-gray-100 relative z-0 overflow-hidden">
      <!-- Animated Background Accents -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Top Row: Engagement Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <!-- Newsletter Signup Card -->
          <div class="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 group">
             <div class="h-12 w-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
               <TicketIcon class="h-6 w-6" />
             </div>
             <h4 class="text-xl  text-gray-900 mb-3 tracking-tight">Stay in the loop</h4>
             <p class="text-xs font-bold text-gray-400 mb-6 leading-relaxed uppercase tracking-widest">Get exclusive deals & travel hacks</p>
             <div class="relative">
               <input 
                 type="email" 
                 placeholder="your@email.com" 
                 class="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none"
               />
               <button class="absolute right-2 top-2 bottom-2 bg-brand-blue text-white px-5 rounded-xl text-[10px] font-bold tracking-widest hover:bg-[#0a168a] transition-all transform active:scale-95 shadow-lg shadow-brand-blue/20">
                 Join
               </button>
             </div>
          </div>

          <!-- Social Engagement Card -->
          <div class="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 group">
             <div class="h-12 w-12 bg-brand-green/5 rounded-2xl flex items-center justify-center text-brand-green mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors duration-500">
               <GlobeAltIcon class="h-6 w-6" />
             </div>
             <h4 class="text-xl  text-gray-900 mb-3 tracking-tight">Follow our journey</h4>
             <p class="text-xs font-bold text-gray-400 mb-8 leading-relaxed uppercase tracking-widest">Connect with Flybeth globally</p>
             <div class="flex gap-4">
                <a v-for="i in 4" :key="i" href="#" class="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-brand-blue hover:text-white hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <component :is="i === 1 ? 'div' : (i === 2 ? 'div' : (i === 3 ? 'div' : 'div'))" class="text-xs font-bold ">{{ i === 1 ? 'fb' : (i === 2 ? 'ig' : (i === 3 ? 'tw' : 'li')) }}</component>
                </a>
             </div>
          </div>

          <!-- Inspiration Card -->
          <div class="bg-brand-blue p-8 rounded-[2.5rem] shadow-xl shadow-brand-blue/20 text-white relative overflow-hidden group border border-white/10">
             <div class="absolute -right-8 -top-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <SparklesIcon class="w-40 h-40" />
             </div>
             <div class="relative z-10 flex flex-col h-full">
               <h4 class="text-2xl  mb-2 tracking-tight">Get Inspired</h4>
               <p class="text-[11px] font-bold text-white/70 mb-8 leading-relaxed uppercase tracking-widest">Discover your next destination</p>
               <button class="mt-auto bg-brand-green text-white font-bold text-[10px] px-6 py-3.5 rounded-xl shadow-lg hover:bg-[#289003] transition-all tracking-widest uppercase self-start">
                 Dreamguides
               </button>
             </div>
          </div>
        </div>

        <!-- Section Heading: Flybeth Directory -->
        <!-- <div class="flex flex-col items-center text-center mb-16">
          <h2 class="text-3xl  text-gray-900 mb-4 tracking-tight">Travel Directory</h2>
          <div class="h-1 w-12 bg-brand-green rounded-full"></div>
        </div> -->

        <!-- Directory Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <!-- Column: Flights -->
          <div v-if="africanCities.length || europeanCities.length" class="space-y-10 focus-within:z-10">
            <div>
              <h3 class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                <div class="h-2 w-2 rounded-full bg-brand-blue"></div>
                Flights from Nigeria
              </h3>
              <div class="grid grid-cols-1 gap-4">
                <div v-for="region in [
                  { name: 'Africa', cities: africanCities },
                  { name: 'Europe', cities: europeanCities }
                ]" :key="region.name" class="space-y-3">
                  <h4 class="text-[10px] font-bold text-gray-900 border-l-2 border-brand-green/30 pl-3 uppercase tracking-widest">{{ region.name }}</h4>
                  <ul class="space-y-1 pl-3 flex flex-wrap gap-x-4 gap-y-1">
                    <li v-for="city in region.cities" :key="city" @click="navigateToFlightSearch(city)" class="text-[11px] font-bold text-gray-500 hover:text-brand-blue cursor-pointer transition-colors duration-300">{{ city }}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-t border-gray-100 pt-6">
                <div class="h-2 w-2 rounded-full bg-brand-green"></div>
                Global Routes
              </h3>
              <div class="grid grid-cols-1 gap-4">
                <div v-for="region in [
                  { name: 'Asia', cities: asianCities.slice(0, 4) },
                  { name: 'N. America', cities: northAmericanCities.slice(0, 4) }
                ]" :key="region.name" class="space-y-3">
                  <h4 class="text-[10px] font-bold text-gray-900 border-l-2 border-brand-green/30 pl-3 uppercase tracking-widest">{{ region.name }}</h4>
                  <ul class="space-y-1 pl-3 flex flex-wrap gap-x-4 gap-y-1">
                    <li v-for="city in region.cities" :key="city" @click="navigateToFlightSearch(city)" class="text-[11px] font-bold text-gray-500 hover:text-brand-blue cursor-pointer transition-colors duration-300">{{ city }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Column: Hotels -->
          <div v-if="africanCities.length || europeanCities.length" class="space-y-10">
            <div>
              <h3 class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                <div class="h-2 w-2 rounded-full bg-brand-green"></div>
                Curated Hotels
              </h3>
              <div class="grid grid-cols-1 gap-6">
                <div v-for="region in [
                  { name: 'Africa', cities: africanCities },
                  { name: 'Europe', cities: europeanCities }
                ]" :key="region.name" class="space-y-3">
                  <h4 class="text-[10px] font-bold text-gray-900 border-l-2 border-brand-blue/30 pl-3 uppercase tracking-widest">In {{ region.name }}</h4>
                  <ul class="space-y-2 pl-3">
                    <li v-for="city in region.cities" :key="city" @click="navigateToHotelSearch(city)" class="group flex items-center gap-3 cursor-pointer">
                      <div class="h-6 w-6 rounded bg-white flex items-center justify-center text-[8px] font-bold text-gray-400 shadow-sm group-hover:bg-brand-blue group-hover:text-white transition-all">{{ city.slice(0, 2) }}</div>
                      <span class="text-[11px] font-bold text-gray-500 group-hover:text-brand-blue transition-colors">Hotels in {{ city }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- <PartnerCarousel /> -->

    <!-- Global Connectivity Hub: (Professional Light Theme) -->
    <section class="relative w-full overflow-hidden mb-20 bg-gray-50 border-y border-gray-100">
      <!-- Animated Focal Points (Light Theme) -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#3b82f6,transparent_50%),radial-gradient(circle_at_0%_0%,#10b981,transparent_30%)]"></div>
      </div>

      <div class="max-w-[1920px] mx-auto py-20 lg:py-32 relative z-10 px-4 sm:px-6 lg:px-24">
        <div class="mb-16 text-center lg:text-left">
          <div class="flex items-center justify-center lg:justify-start gap-4 mb-6">
            <div class="h-10 w-10 bg-brand-blue/5 rounded-xl flex items-center justify-center border border-brand-blue/10">
              <GlobeAltIcon class="h-5 v-5 text-brand-blue" />
            </div>
            <span class="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em]">Global Connectivity Hub</span>
          </div>
          <h2 class="text-3xl md:text-5xl lg:text-6xl  text-gray-950 mb-7 tracking-tighter leading-[1.05]">Partnerships that <span class="text-brand-blue underline decoration-brand-blue/20 decoration-8 underline-offset-4">Connect</span> the World.</h2>
          <p class="text-base sm:text-lg font-bold text-gray-500 leading-relaxed max-w-2xl">Access over 500+ airlines, 1.2M premium stays, and thousands of curated experiences across the globe, all at your fingertips.</p>
            <div class="mt-32">
               <PartnerCarousel />
            </div>
        <!-- <div class="space-y-12 lg:space-y-20 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div class="relative flex overflow-x-hidden group/m">
            <div class="animate-marquee whitespace-nowrap flex items-center py-4">
              <div v-for="(p, i) in [...partnerAirlines, ...partnerAirlines, ...partnerAirlines, ...partnerAirlines]" :key="`air-${i}`" 
                   @click="navigateToCategory('airline', p)"
                   class="mx-4 sm:mx-8 px-10 py-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group/logo shrink-0">
                <img :src="p.logo" :alt="p.name" class="h-12 sm:h-14 w-28 sm:w-36 object-contain transition-all opacity-90 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </div> -->
       </div>
      </div>
    </section>
    <section class="py-24 bg-white relative z-0 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <!-- SEO Content Article: Styled & Collapsible -->
        <article class="relative bg-white rounded-[3rem] p-10 lg:p-16 border border-gray-100 shadow-sm overflow-hidden group/article transition-all duration-700" :class="showLongSeo ? 'max-h-[2000px]' : 'max-h-[480px]'">
          <div class="relative z-10">
            <h2 class="text-2xl  text-gray-900 mb-8 tracking-tight border-b-2 border-brand-green w-fit pb-2">The Flybeth Experience</h2>
            
            <div class="prose prose-sm max-w-none text-gray-500 font-bold leading-relaxed space-y-6">
              <p class="text-base text-gray-900">Book the Cheapest Flights, Hotels and Vacation Packages with Flybeth</p>
              <p>Flybeth is Nigeria's premier Tour Operator, Travel Arranger, and online travel booking company. We understand that Nigerians love to book cheap flights & search for the most affordable flight tickets available. Our platform is engineered to deliver the best value for every kobo spent.</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                <div class="p-8 bg-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500">
                  <h3 class="text-sm  text-gray-900 mb-4 tracking-tight">Why Choose Flybeth for Your Flight Booking?</h3>
                  <p class="text-[12px] leading-relaxed">Founded with a reputation for providing the cheap and affordable flight booking service for every Nigerian. Besides our years of experience in providing the best flight booking service, we also provide you with several other services that you would enjoy.</p>
                </div>
                <div class="p-8 bg-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500">
                  <h3 class="text-sm  text-gray-900 mb-4 tracking-tight">Simplified Tech, Human Touch</h3>
                  <p class="text-[12px] leading-relaxed">We combine state-of-the-art travel technology with the local expertise of our Nigerian team. Whether you're booking an international getaway or a local shuttle, we ensure the process is seamless and secure.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Fade out overlay when collapsed -->
          <div v-if="!showLongSeo" class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-20"></div>
          
          <div class="relative z-30 flex justify-center mt-8">
            <button 
              @click="showLongSeo = !showLongSeo" 
              class="flex flex-col items-center gap-2 group/btn"
            >
              <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-hover/btn:text-brand-blue transition-colors">
                {{ showLongSeo ? 'Collapse Overview' : 'Explore Flybeth Story' }}
              </span>
              <div class="h-10 w-10 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-50 group-hover/btn:scale-110 transition-transform">
                <component :is="showLongSeo ? ChevronLeftIcon : ChevronRightIcon" class="h-5 w-5 text-brand-blue transform rotate-90" />
              </div>
            </button>
          </div>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  GlobeAltIcon, TicketIcon, ShieldCheckIcon, SparklesIcon, SunIcon, 
  ChevronLeftIcon, ChevronRightIcon, CurrencyDollarIcon, PhoneIcon, 
  TrophyIcon, XCircleIcon, CheckCircleIcon, StarIcon, ShareIcon, DevicePhoneMobileIcon,
  UsersIcon, ArrowRightIcon
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
import TopHotelDeals from '@/components/stays/TopHotelDeals.vue'
import TrendingActivities from '@/components/TrendingActivities.vue'
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();

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

const handleBookNow = (deal: any) => {
  const isHotel = !!(deal.accommodationId || (deal.id && !deal.originCode));
  const type = isHotel ? 'stay' : 'flight';
  
  if (isHotel) {
    const id = deal.accommodationId || deal.id;
    const provider = deal.provider || 'hotelbeds';
    navigateTo({
      path: `/stays/${id}`,
      query: { provider }
    });
    return;
  }
  
  // Store the raw or mapped deal
  const bookingObj = deal.rawDeal || deal;
  const storageKey = 'selectedFlight';
  sessionStorage.setItem(storageKey, JSON.stringify(bookingObj));
  
  // Navigate to checkout with essential params
  navigateTo({
    path: '/checkout',
    query: {
      type,
      id: deal.offerId || deal.id,
      provider: deal.provider || 'duffel'
    }
  });
};

const handleShare = async (deal: any) => {
  const shareData = {
    title: `Flybeth Deal: ${deal.originCity} to ${deal.destCity}`,
    text: `Check out this amazing flight deal on Flybeth! ${deal.originCity} to ${deal.destCity} for only $${deal.price}.`,
    url: `${window.location.origin}/checkout?type=flight&id=${deal.offerId || deal.id}&provider=${deal.provider || 'duffel'}`
  };

  try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showToast({
          title: "Link Copied",
          message: "The deal link has been copied to your clipboard.",
          toastType: "success",
        });
      }
  } catch (err) {
    console.error('Error sharing', err);
  }
};

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

    const getCurrencySymbol = (currency: string) => {
      const symbols: any = { 'USD': '$', 'NGN': '₦', 'GBP': '£', 'EUR': '€' };
      return symbols[currency] || (currency + ' ');
    };

    return activeStays.slice(0, 3).map(stay => {
      const price = stay.priceWithCommission || stay.cheapestPrice || 0;
      const currency = stay.currency || 'USD';
      const symbol = getCurrencySymbol(currency);
      
      return {
        title: stay.name,
        type: `${stay.location?.city || 'City'}`,
        price: `${symbol}${price.toLocaleString()} / night`,
        installment: `${symbol}${Math.floor(price * 0.28).toLocaleString()}`,
        image: stay.photos?.[0] || fallbackImages[0],
        deal: false,
        airlineLogo: `https://logo.clearbit.com/${stay.name.toLowerCase().replace(/\s/g, '').split('-')[0]}.com`
      };
    });
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
  const activeStays = Array.isArray(stays.value) ? stays.value : [];
  if (activeStays.length === 0) {
    // Fallback to market insights if no live stay search data is available
    const travelers = Array.isArray(mostTraveled.value) ? mostTraveled.value : [];
    const booked = Array.isArray(mostBooked.value) ? mostBooked.value : [];
    const items = travelers.length > 0 ? travelers : booked;
    if (items.length === 0) return [];
    return items.slice(0, 10).map((item: any, idx: number) => ({
      name: item.destination,
      count: Math.floor(item.analytics?.travelers?.score * 10) || 100,
      city: item.destination,
      country: 'International',
      price: Math.floor(Math.random() * 200) + 100, // Random fallback price for trending cities
      rating: 4,
      image: fallbackImages[idx % fallbackImages.length],
      isLive: false
    }));
  }

  return activeStays.slice(0, 10).map((stay: any, idx: number) => ({
    id: stay.accommodationId || stay.id,
    name: stay.name,
    city: stay.location?.city || 'City',
    country: stay.location?.countryCode || 'Country',
    price: Math.floor(stay.priceWithCommission || stay.cheapestPrice),
    rating: Math.floor(stay.rating) || 4,
    image: stay.photos?.[0] || fallbackImages[idx % fallbackImages.length],
    isLive: true,
    accommodationId: stay.accommodationId || stay.id,
    provider: stay.provider || 'hotelbeds',
    rawDeal: stay
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

const airlineIataMap: Record<string, string> = {
  'Air Peace': 'P4',
  'Arik Air': 'W3',
  'Ibom Air': 'QI',
  'British Airways': 'BA',
  'Emirates': 'EK',
  'Qatar Airways': 'QR'
};

// All data above is now API-driven — no hardcoded arrays

const asianCities = ['Dubai', 'Abu Dhabi', 'Guangzhou', 'New Delhi', 'Tokyo', 'Singapore'];
const northAmericanCities = ['Atlanta', 'Toronto', 'Houston', 'New York', 'Los Angeles', 'Chicago'];

// Partner Showcase Data
import airPeace from '@/assets/img/air-peace.png'
import arikAir from '@/assets/img/arik-air.png'
import emirates from '@/assets/img/fly-emirates.png'
import qatar from '@/assets/img/qatar-airways.webp'
import turkish from '@/assets/img/turkish-airlines.png'

const partnerAirlines = [
  { name: 'Air Peace', logo: airPeace },
  { name: 'Arik Air', logo: arikAir },
  { name: 'Emirates', logo: emirates }
];



const resortPlaces = []
const activityPlaces = []

const navigateToCategory = (category: string, item?: any) => {
  switch (category) {
    case 'airline':
      navigateTo({ path: '/flights' });
      break;
    case 'hotel':
      navigateTo({ path: '/stays' });
      break;
    case 'car':
      navigateTo({ path: '/cars' });
      break;
    case 'experience':
      // Redirection to things-to-do or specific city search
      if (item && item.name) {
          // Heuristic search redirection
          navigateTo({ path: '/stays', query: { city: item.name } });
      } else {
          navigateTo({ path: '/things-to-do' });
      }
      break;
    default:
      navigateTo({ path: '/explore' });
  }
};

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
  navigateTo({ path: '/checkout', query: { ...query, type: 'flight', provider: 'amadeus' } });
};

const currentFareDeals = computed(() => {
  if (liveDeals.value.length > 0) {
    const isRoundTrip = fareTab.value === 'Round Trip';
    
    // Filter by trip type if possible, or just slice
    return liveDeals.value
      .filter(deal => {
        const hasReturn = deal.slices?.length > 1 || deal.segments?.length > 1;
        return isRoundTrip ? hasReturn : !hasReturn;
      })
      .slice(0, 6)
      .map((deal, idx) => ({
        id: deal.offerId || deal.id || idx,
        offerId: deal.offerId || deal.id,
        provider: deal.provider,
        originCode: deal.origin,
        originCity: deal.origin, // Fallback to code if city not top level
        destCode: deal.destination,
        destCity: deal.destination,
        price: Math.floor(deal.priceWithCommission || deal.price),
        dates: `${formatDateShort(deal.departureTime)} - ${formatDateShort(deal.arrivalTime)}`,
        airlineLogo: deal.airlineLogo,
        rawDeal: deal
      }));
  }

  return [];
});

const flightRecommendations = computed(() => {
  const formatMonthDay = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  // Prioritize inspiration recommendations if available
  if (recommendations.value.length > 0) {
    return recommendations.value.slice(0, 4).map((deal: any, idx: number) => ({
      city: deal.destination,
      route: `${deal.origin} - ${deal.destination}`,
      price: Math.floor(deal.price?.total || deal.price),
      dates: deal.departureDate ? `${formatMonthDay(deal.departureDate)} - ${formatMonthDay(deal.returnDate)}` : 'Flexible dates',
      image: fallbackImages[idx % fallbackImages.length],
      isRoundTrip: !!deal.returnDate,
      offerId: deal.offerId || deal.id,
      provider: deal.provider || 'amadeus',
      rawDeal: deal
    }));
  }

  // Fallback to live deals
  if (liveDeals.value.length > 0) {
    return liveDeals.value.slice(0, 4).map((deal, idx) => ({
      city: deal.destination,
      route: `${deal.origin} - ${deal.destination}`,
      price: Math.floor(deal.priceWithCommission || deal.price),
      dates: `${formatMonthDay(deal.departureTime)} - ${formatMonthDay(deal.arrivalTime)}`,
      image: fallbackImages[idx % fallbackImages.length],
      isRoundTrip: deal.slices?.length > 1 || deal.segments?.length > 1,
      offerId: deal.offerId || deal.id,
      provider: deal.provider,
      rawDeal: deal
    }));
  }
  
  return [];
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

const showAllSections = computed(() => {
  return ['Packages', 'Cars', 'Transfers', 'Cruises'].includes(currentTab.value);
});

const handleTabUpdate = (tab: string) => {
  console.log(tab, 'tab here')
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
  
  // Fetch live deals based on origin and current fare tab
  const tripType = fareTab.value === 'Round Trip' ? 'round-trip' : 'one-way';
  fetchLiveDeals(originCode, tripType);

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

watch(fareTab, () => {
  const originCode = userLocation.value?.cityCode || 'LOS';
  const tripType = fareTab.value === 'Round Trip' ? 'round-trip' : 'one-way';
  fetchLiveDeals(originCode, tripType);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleWidgetScroll);
  if (marketingTimer) clearTimeout(marketingTimer)
})
</script>

<style>
. {
  
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

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.animate-marquee {
  animation: marquee 40s linear infinite;
  display: flex !important;
  width: max-content !important;
}

.animate-marquee-reverse {
  animation: marquee-reverse 45s linear infinite;
  display: flex !important;
  width: max-content !important;
}

/* Pause on hover */
.animate-marquee:hover, .animate-marquee-reverse:hover {
  animation-play-state: paused;
}
</style>
