<template>
  <div class="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans text-slate-900">
    
    <!-- ═══════════════ HERO SECTION ═══════════════ -->
    <section class="relative z-30 bg-[#0D1DAD] overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-28">
      <!-- Ambient Brand Gradient & Dot Grid -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(125%_120%_at_50%_-25%,#1A2ED4_0%,#0D1DAD_46%,#0A1485_100%)]"></div>
        <div
          class="absolute inset-0 opacity-20"
          style="background-image: radial-gradient(rgba(255, 255, 255, 0.45) 1.5px, transparent 1.5px); background-size: 22px 22px;"
        ></div>
        <div class="absolute -right-24 top-0 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div class="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl"></div>
      </div>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        <!-- Top Navigation Link -->
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm"
        >
          <div class="bg-white/10 p-1 rounded-full group-hover:-translate-x-1 transition-transform">
            <ChevronRight class="w-3 h-3 rotate-180" />
          </div>
          <span>Back to Home</span>
        </NuxtLink>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12">
          
          <!-- Headline & Description -->
          <div class="max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-[11px] font-bold tracking-widest uppercase mb-3.5 shadow-sm">
              <Sparkles class="w-3.5 h-3.5 text-blue-300" />
              <span>Flybeth Self-Service Portal</span>
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Manage Your <span class="text-sky-300">Booking</span>
            </h1>
            <p class="text-blue-100/90 text-sm sm:text-base font-medium mt-3 leading-relaxed">
              Retrieve real-time itineraries, download verified tax receipts & e-tickets, and manage all your travel reservations.
            </p>
          </div>

          <!-- Elevated Search Card -->
          <div class="w-full lg:w-[420px] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/80 backdrop-blur-md">
            <div class="flex items-center justify-between mb-3">
              <label class="text-[11px] font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Search class="w-3.5 h-3.5 text-[#0D1DAD]" />
                <span>Booking Reference</span>
              </label>
              <span class="text-[10px] font-semibold text-slate-400">PNR / Order Ref</span>
            </div>

            <div class="space-y-3">
              <div class="relative">
                <input
                  v-model="pnrInput"
                  type="text"
                  class="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl py-3.5 pl-4 pr-11 text-base font-black uppercase tracking-wider font-mono focus:outline-none focus:border-[#0D1DAD] focus:ring-4 focus:ring-[#0D1DAD]/10 transition-all"
                  placeholder="e.g. MXT1Q9"
                  @keyup.enter="searchByPnr"
                />
                <button
                  v-if="pnrInput"
                  @click="pnrInput = ''"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Clear input"
                >
                  <XCircle class="w-4 h-4" />
                </button>
              </div>

              <button 
                @click="searchByPnr"
                :disabled="loading || !pnrInput.trim()"
                class="w-full h-12 bg-[#0D1DAD] hover:bg-[#002a66] active:scale-[0.99] text-white rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
                <template v-else>
                  <Search class="w-4 h-4" />
                  <span>Find My Booking</span>
                </template>
              </button>
            </div>

            <p class="text-[11px] font-medium text-slate-500 mt-3 text-center">
              Enter the 6-character code found on your confirmation email or SMS.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- ═══════════════ MAIN CONTENT ═══════════════ -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-20 pb-24">
      
      <!-- ── 1. LOADING STATE ── -->
      <div v-if="loading" class="bg-white rounded-3xl p-12 sm:p-16 shadow-xl border border-slate-200/90 text-center flex flex-col items-center justify-center">
        <div class="relative w-16 h-16 mb-5">
          <div class="w-16 h-16 rounded-full border-4 border-slate-100"></div>
          <div class="w-16 h-16 rounded-full border-4 border-[#0D1DAD] border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <h3 class="text-lg font-bold text-slate-900">Retrieving Your Reservation</h3>
        <p class="text-sm font-medium text-slate-500 mt-1 max-w-sm">
          Please wait while we fetch the latest itinerary and e-ticket status from the global reservation network.
        </p>
      </div>

      <!-- ── 2. NOT FOUND STATE ── -->
      <div v-else-if="notFound" class="bg-white rounded-3xl p-10 sm:p-14 shadow-xl border border-slate-200/90 text-center">
        <div class="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-rose-600 shadow-sm">
          <AlertCircle class="w-8 h-8" />
        </div>
        <h2 class="text-2xl font-black text-slate-900 mb-2">Booking Not Found</h2>
        <p class="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          We could not find any active booking matching reference <span class="font-mono font-bold text-[#0D1DAD] bg-blue-50 px-2 py-0.5 rounded-md">{{ route.query.pnr || pnrInput }}</span>.
        </p>
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            @click="resetSearch"
            class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Clear & Try Again
          </button>
          <a
            href="tel:1-844-FLYBETH"
            class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0D1DAD] hover:bg-[#002a66] text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
          >
            <Phone class="w-3.5 h-3.5" />
            <span>Call 24/7 Concierge</span>
          </a>
        </div>
      </div>

      <!-- ── 3. BOOKING DETAILS FOUND ── -->
      <div v-else-if="booking" class="space-y-6">
        
        <!-- Status Banner & PNR Header -->
        <div class="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4 w-full md:w-auto">
            <div :class="[
              'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border',
              booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              booking.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
              'bg-amber-50 text-amber-600 border-amber-100'
            ]">
              <CheckCircle2 v-if="booking.status === 'confirmed'" class="w-6 h-6" />
              <XCircle v-else-if="booking.status === 'cancelled'" class="w-6 h-6" />
              <RefreshCw v-else class="w-6 h-6 animate-spin" />
            </div>
            <div>
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reservation Status</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span :class="[
                  'text-lg font-bold capitalize',
                  booking.status === 'confirmed' ? 'text-emerald-700' :
                  booking.status === 'cancelled' ? 'text-rose-700' :
                  'text-amber-700'
                ]">
                  {{ booking.status || 'Active' }}
                </span>
                <span v-if="booking.status === 'confirmed'" class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div class="text-left sm:text-right w-full sm:w-auto bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-100 flex sm:flex-col items-center sm:items-end justify-between">
              <div>
                <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Booking Reference</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <p class="text-xl font-black text-slate-900 tracking-wider font-mono">{{ booking.pnr }}</p>
                  <button 
                    @click="copyPnr" 
                    class="p-1 rounded-md text-slate-400 hover:text-[#0D1DAD] hover:bg-blue-50 transition-colors"
                    title="Copy PNR"
                  >
                    <Check v-if="copied" class="w-4 h-4 text-emerald-600" />
                    <Copy v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              @click="downloadReceipt" 
              :disabled="downloadingReceipt" 
              class="w-full sm:w-auto h-11 px-5 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-blue-900/15 flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <RefreshCw v-if="downloadingReceipt" class="w-4 h-4 animate-spin" />
              <Download v-else class="w-4 h-4" />
              <span>{{ downloadingReceipt ? 'Generating...' : 'Download E-Ticket & Receipt' }}</span>
            </button>
          </div>
        </div>

        <!-- 2-Column Itinerary & Fare Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left Column (Flight / Transfer Itinerary) -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Flight Itinerary Card -->
            <div v-if="booking.flights?.length" class="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden relative">
              <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-xl bg-blue-50 text-[#0D1DAD] flex items-center justify-center">
                    <Plane class="w-4 h-4" />
                  </div>
                  <div>
                    <h3 class="text-sm font-black uppercase text-slate-900 tracking-wider">Flight Itinerary</h3>
                    <p class="text-xs text-slate-500 font-medium">{{ flightSlices.length }} {{ flightSlices.length === 1 ? 'Flight Segment' : 'Flight Segments' }}</p>
                  </div>
                </div>

                <div v-if="tripType" class="bg-[#0D1DAD] text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                  {{ tripType }}
                </div>
              </div>

              <div class="p-5 sm:p-6 space-y-4">
                <div 
                  v-for="(slice, idx) in flightSlices" 
                  :key="idx" 
                  class="p-5 bg-slate-50/70 hover:bg-blue-50/40 rounded-2xl border border-slate-200/80 transition-colors"
                >
                  <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/60 text-xs font-bold text-slate-500">
                    <span class="text-[#0D1DAD] uppercase tracking-wider">Segment {{ idx + 1 }}</span>
                    <span>{{ getSliceAirline(slice) || 'Airline Carrier' }} • {{ getSliceClass(slice) }}</span>
                  </div>

                  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <!-- Origin -->
                    <div class="text-center sm:text-left w-full sm:w-1/3">
                      <p class="text-3xl font-black text-slate-900 tracking-tight font-mono">{{ getSliceOrigin(slice) }}</p>
                      <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Departure Airport</p>
                      <p v-if="getSliceDepartureTime(slice)" class="text-xs font-bold text-[#0D1DAD] mt-1">
                        {{ new Date(getSliceDepartureTime(slice)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                      </p>
                    </div>

                    <!-- Visual Flight Line -->
                    <div class="flex-1 flex flex-col items-center px-4 w-full sm:min-w-[140px]">
                      <div class="w-full flex items-center justify-center relative">
                        <div class="w-full h-0.5 bg-slate-200"></div>
                        <div class="absolute bg-white px-2 text-[#0D1DAD] border border-slate-200 rounded-full py-1 shadow-sm">
                          <Plane class="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span class="text-[10px] font-extrabold uppercase text-slate-400 mt-2 tracking-wider">Non-Stop Flight</span>
                    </div>

                    <!-- Destination -->
                    <div class="text-center sm:text-right w-full sm:w-1/3">
                      <p class="text-3xl font-black text-slate-900 tracking-tight font-mono">{{ getSliceDestination(slice) }}</p>
                      <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Arrival Airport</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transfer Reservation Card (if applicable) -->
            <div v-if="booking.type === 'transfer' && booking.status !== 'cancelled'" class="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div class="w-8 h-8 rounded-xl bg-blue-50 text-[#0D1DAD] flex items-center justify-center">
                  <ShieldCheck class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-black uppercase text-slate-900 tracking-wider">Airport Transfer Details</h3>
                  <p class="text-xs text-slate-500 font-medium">Meet & Greet transfer confirmed with local partner</p>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p class="text-sm font-bold text-slate-900">Need to cancel your transfer?</p>
                  <p class="text-xs text-slate-500 mt-0.5">Free cancellation available according to partner policy.</p>
                </div>
                <button
                  @click="handleCancelTransfer(booking)"
                  :disabled="cancelling"
                  class="w-full sm:w-auto px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shrink-0"
                >
                  {{ cancelling ? 'Cancelling...' : 'Cancel Transfer' }}
                </button>
              </div>
            </div>

            <!-- Pending Payment CTA Banner -->
            <div v-if="booking.payment?.status === 'pending' || booking.status === 'pending'" class="bg-gradient-to-r from-[#0D1DAD] to-blue-700 rounded-3xl shadow-lg p-6 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5">
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
                  <Clock class="w-3.5 h-3.5" />
                  <span>Action Required</span>
                </div>
                <h3 class="text-xl font-black">Payment Pending</h3>
                <p class="text-blue-100 text-xs sm:text-sm mt-0.5">Your seat reservation is held securely. Please complete checkout to finalize your ticket.</p>
              </div>
              <button
                @click="handlePayment"
                class="w-full md:w-auto h-11 px-7 bg-white hover:bg-blue-50 active:scale-95 text-[#0D1DAD] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
              >
                Complete Payment Now
              </button>
            </div>

          </div>

          <!-- Right Column (Contact & Fare Breakdown) -->
          <div class="space-y-6">
            
            <!-- Contact Info Card -->
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-6">
              <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <FileText class="w-4 h-4 text-[#0D1DAD]" />
                <h3 class="text-xs font-black uppercase text-slate-900 tracking-wider">Lead Traveler & Contact</h3>
              </div>
              
              <div class="space-y-3.5">
                <div class="flex items-start gap-3">
                  <div class="bg-slate-100 p-2 rounded-xl text-slate-500 shrink-0">
                    <UserIcon class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                    <p class="text-sm font-bold text-slate-900 mt-0.5 truncate">
                      {{ booking.contactDetails?.firstName }} {{ booking.contactDetails?.lastName }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="bg-slate-100 p-2 rounded-xl text-slate-500 shrink-0">
                    <Mail class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p class="text-sm font-bold text-slate-900 mt-0.5 truncate">{{ booking.contactDetails?.email }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="bg-slate-100 p-2 rounded-xl text-slate-500 shrink-0">
                    <Phone class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Phone</p>
                    <p class="text-sm font-bold text-slate-900 mt-0.5">{{ booking.contactDetails?.phone }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <div class="bg-slate-100 p-2 rounded-xl text-slate-500 shrink-0">
                    <Calendar class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reservation Date</p>
                    <p class="text-sm font-bold text-slate-900 mt-0.5">{{ formatDate(booking.bookedAt || booking.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fare Summary Card -->
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-6">
              <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <CreditCard class="w-4 h-4 text-[#0D1DAD]" />
                <h3 class="text-xs font-black uppercase text-slate-900 tracking-wider">Payment Summary</h3>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-500 font-medium">Base Fare</span>
                  <span class="font-bold text-slate-900">{{ formatPrice(booking.pricing?.baseFare) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-500 font-medium">Taxes & Mandatory Fees</span>
                  <span class="font-bold text-slate-900">{{ formatPrice(booking.pricing?.taxes) }}</span>
                </div>
                
                <div class="pt-3.5 mt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span class="text-xs font-black uppercase tracking-wider text-slate-900">Total Paid</span>
                    <p class="text-[10px] font-medium text-slate-400">All taxes included</p>
                  </div>
                  <span class="text-2xl font-black text-[#0D1DAD] tracking-tight">
                    {{ formatPrice(booking.pricing?.totalAmount) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Support Card -->
            <div class="rounded-3xl bg-blue-50/70 border border-blue-100 p-5">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-full bg-[#0D1DAD] text-white flex items-center justify-center text-xs font-bold">
                  24/7
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-900">Need Live Assistance?</h4>
                  <p class="text-[11px] text-slate-500">Flybeth Priority Concierge is ready to help.</p>
                </div>
              </div>
              <div class="mt-3 flex gap-2">
                <a 
                  href="tel:1-844-FLYBETH"
                  class="flex-1 text-center py-2 bg-white hover:bg-slate-50 border border-blue-200 text-[#0D1DAD] font-bold text-xs rounded-xl transition-colors"
                >
                  1-844-FLYBETH
                </a>
                <NuxtLink 
                  to="/help"
                  class="flex-1 text-center py-2 bg-[#0D1DAD] hover:bg-[#002a66] text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Help Center
                </NuxtLink>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- ── 4. INITIAL PORTAL HUB (WHEN NO SEARCH PERFORMED YET) ── -->
      <div v-else class="space-y-12">
        
        <!-- Feature Highlights Grid -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/90">
          <div class="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Self-Service Travel Management
            </h2>
            <p class="text-slate-500 text-sm mt-1.5 font-medium">
              Everything you need to view, download, and manage your Flybeth journey with ease.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div class="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
              <div class="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0D1DAD] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Plane class="w-5 h-5" />
              </div>
              <h3 class="text-sm font-bold text-slate-900 mb-1">Live Itineraries</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Check terminal gates, flight status, connection routes, and baggage allowances.
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
              <div class="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0D1DAD] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Download class="w-5 h-5" />
              </div>
              <h3 class="text-sm font-bold text-slate-900 mb-1">Verified Receipts</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Download official PDF e-tickets, VAT tax invoices, and confirmed booking vouchers.
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
              <div class="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0D1DAD] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <h3 class="text-sm font-bold text-slate-900 mb-1">Protected Bookings</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Review your traveler insurance, refund terms, and verified supplier credentials.
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
              <div class="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0D1DAD] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Phone class="w-5 h-5" />
              </div>
              <h3 class="text-sm font-bold text-slate-900 mb-1">24/7 Concierge</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Direct phone and chat support for rebooking, date changes, and passenger updates.
              </p>
            </div>

          </div>
        </div>

        <!-- 3-Step "How to Find Your Reference" Guide -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex items-start gap-4">
            <div class="w-9 h-9 rounded-2xl bg-[#0D1DAD] text-white flex items-center justify-center text-sm font-black shrink-0">
              1
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Check Your Email</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Search your inbox for "Flybeth Confirmation" sent immediately after booking.
              </p>
            </div>
          </div>

          <div class="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex items-start gap-4">
            <div class="w-9 h-9 rounded-2xl bg-[#0D1DAD] text-white flex items-center justify-center text-sm font-black shrink-0">
              2
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Locate the 6-Digit Code</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Find the reference code (e.g. <span class="font-mono font-bold text-slate-800">MXT1Q9</span>) on your e-ticket voucher.
              </p>
            </div>
          </div>

          <div class="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex items-start gap-4">
            <div class="w-9 h-9 rounded-2xl bg-[#0D1DAD] text-white flex items-center justify-center text-sm font-black shrink-0">
              3
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Enter & Manage</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Type your reference into the search bar above to view complete details.
              </p>
            </div>
          </div>
        </div>

      </div>

    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, navigateTo } from '#app'
import { bookingsApi } from '@/api_factory/modules/bookings'
import { transfersApi } from '@/api_factory/modules/transfers'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useConfirmation } from '@/composables/core/useConfirmation'
import { useSettings } from '~/composables/useSettings'

import { 
  Search, 
  Download, 
  Plane, 
  Info, 
  Phone, 
  Calendar, 
  Mail, 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Clock,
  FileText,
  Copy,
  Check,
  User as UserIcon
} from 'lucide-vue-next'

const { confirm } = useConfirmation()
const { showToast } = useCustomToast()
const route = useRoute()

const loading = ref(false)
const notFound = ref(false)
const cancelling = ref(false)
const downloadingReceipt = ref(false)
const copied = ref(false)
const booking = ref<any>(null)
const pnrInput = ref('')

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'
const { formatPrice } = useSettings()

const flightSlices = computed(() => {
  if (!booking.value?.flights?.length) return []
  const firstFlight = booking.value.flights[0]
  if (firstFlight?.metadata?.slices?.length) {
    return firstFlight.metadata.slices
  }
  if (firstFlight?.metadata?.itineraries?.length) {
    return firstFlight.metadata.itineraries
  }
  return booking.value.flights
})

const tripType = computed(() => {
  if (!flightSlices.value || flightSlices.value.length === 0) return ''
  if (booking.value?.isRoundTrip) return 'Round Trip'
  if (flightSlices.value.length === 1) return 'One Way'
  if (flightSlices.value.length === 2) return 'Round Trip'
  return 'Multi City'
})

const getSliceOrigin = (slice: any) => {
  const getCode = (val: any) => typeof val === 'object' ? (val?.iata_code || val?.iataCode || val?.code || val?.name || '') : val
  if (slice.origin) return getCode(slice.origin)
  if (slice.segments && slice.segments.length > 0) return getCode(slice.segments[0].departure?.iataCode || slice.segments[0].origin)
  if (slice.flight?.departure?.iataCode) return getCode(slice.flight.departure.iataCode)
  return getCode(slice.metadata?.origin) || '—'
}

const getSliceDestination = (slice: any) => {
  const getCode = (val: any) => typeof val === 'object' ? (val?.iata_code || val?.iataCode || val?.code || val?.name || '') : val
  if (slice.destination) return getCode(slice.destination)
  if (slice.segments && slice.segments.length > 0) return getCode(slice.segments[slice.segments.length - 1].arrival?.iataCode || slice.segments[slice.segments.length - 1].destination)
  if (slice.flight?.arrival?.iataCode) return getCode(slice.flight.arrival.iataCode)
  return getCode(slice.metadata?.destination) || '—'
}

const getSliceAirline = (slice: any) => {
  const getName = (val: any) => typeof val === 'object' ? (val?.name || val?.iata_code || val?.iataCode || val?.code || '') : val
  if (slice.airline) return getName(slice.airline)
  if (slice.segments && slice.segments.length > 0) return getName(slice.segments[0].airline || slice.segments[0].carrierCode)
  return getName(slice.metadata?.airline || slice.flight?.airline) || ''
}

const getSliceClass = (slice: any) => {
  if (slice.class) return slice.class
  return booking.value?.flights?.[0]?.class || 'Economy'
}

const getSliceDepartureTime = (slice: any) => {
  if (slice.departureTime) return slice.departureTime
  if (slice.segments && slice.segments.length > 0) return slice.segments[0].departure?.at || slice.segments[0].departureTime
  return slice.metadata?.departureTime || slice.flight?.departureTime
}

const copyPnr = () => {
  if (!booking.value?.pnr) return
  navigator.clipboard.writeText(booking.value.pnr)
  copied.value = true
  showToast({ title: 'Copied', message: 'Booking reference copied to clipboard', toastType: 'success' })
  setTimeout(() => { copied.value = false }, 2500)
}

const resetSearch = () => {
  pnrInput.value = ''
  notFound.value = false
  booking.value = null
  navigateTo({ query: {} }, { replace: true })
}

const downloadReceipt = async () => {
  if (typeof window === 'undefined' || !booking.value?.pnr) return;
  downloadingReceipt.value = true;
  
  try {
    const response = await bookingsApi.downloadReceipt(booking.value.pnr);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Receipt_${booking.value.pnr}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast({ title: 'Success', message: 'Receipt downloaded successfully', toastType: 'success' });
  } catch (error: any) {
    showToast({ title: 'Error', message: 'Failed to download receipt', toastType: 'error' });
  } finally {
    downloadingReceipt.value = false;
  }
}

const searchByPnr = async () => {
  if (!pnrInput.value.trim()) return
  loading.value = true
  notFound.value = false
  booking.value = null
  try {
    const { data } = await bookingsApi.getByPnr(pnrInput.value.toUpperCase().trim())
    booking.value = data.data || data
    navigateTo({ query: { pnr: pnrInput.value.toUpperCase().trim() } }, { replace: true })
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

const handlePayment = () => {
  if (!booking.value) return
  navigateTo({
    path: '/checkout',
    query: {
      type: booking.value.type || 'flight',
      id: booking.value._id,
      provider: booking.value.provider || 'duffel',
    }
  })
}

const handleCancelTransfer = async (bkg: any) => {
  const confirmed = await confirm({
    title: 'Cancel Booking',
    message: 'Are you sure you want to permanently cancel this transfer booking? This action is irreversible and may be subject to cancellation fees.',
    confirmText: 'Yes, Cancel Booking',
    variant: 'danger'
  })
  if (!confirmed) return
  
  cancelling.value = true
  try {
    const payload = {
      orderId: bkg.metadata?.orderId || bkg.orderId || bkg.id || bkg._id,
      confirmNbr: bkg.pnr || bkg.metadata?.confirmationNumber,
      provider: bkg.provider || 'duffel'
    }
    
    await transfersApi.cancel(payload)
    showToast({
      title: "Transfer Cancelled",
      message: "Your transfer booking has been successfully cancelled.",
      toastType: "success",
    });
    booking.value.status = 'cancelled'
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to cancel transfer'
    showToast({
      title: "Cancellation Error",
      message: msg,
      toastType: "error",
    });
  } finally {
    cancelling.value = false
  }
}

onMounted(async () => {
  if (route.query.pnr) {
    pnrInput.value = route.query.pnr as string
    await searchByPnr()
  }
})
</script>
