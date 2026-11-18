<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative overflow-hidden">
    
    <!-- Ambient Background Elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <!-- Header with Official Logo -->
    <header class="w-full py-4 sm:py-6 px-4 sm:px-8 flex items-center justify-between z-10 relative max-w-5xl mx-auto">
      <img 
        src="https://res.cloudinary.com/dlnjbkoju/image/upload/v1794986834/logo_qeatej.png" 
        alt="Flybeth" 
        class="h-8 sm:h-9 cursor-pointer object-contain" 
        @click="goHome" 
      />
      <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-sm">
        <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
        <span>Secure Checkout</span>
      </div>
    </header>

    <main class="flex-1 flex items-center justify-center px-3 sm:px-6 py-4 sm:py-8 z-10 relative">
      
      <!-- ─── AUTHORIZING STATE ─── -->
      <div v-if="isAuthorizing" class="bg-white/90 backdrop-blur-xl border border-white p-8 sm:p-12 rounded-3xl shadow-xl w-full max-w-lg text-center">
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div class="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-[#0D1DAD] border-t-transparent rounded-full animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
             <Clock class="h-7 w-7 text-[#0D1DAD] animate-pulse" />
          </div>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-gray-900 mb-2 tracking-tight">Verifying Payment...</h1>
        <p class="text-xs sm:text-sm text-gray-500 font-medium">Please hold on while we confirm your reservation with the global travel exchange.</p>
      </div>

      <!-- ─── SUCCESS STATE (BOOKING CONFIRMED & TICKETED) ─── -->
      <div v-else-if="paymentStatus === 'success'" class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 w-full max-w-xl shadow-xl text-center">
        
        <!-- Animated Success Badge -->
        <div class="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-5 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-emerald-100/80 animate-ping opacity-30"></div>
          <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white">
            <Check class="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
          </div>
        </div>

        <h1 class="text-xl sm:text-2xl font-black text-gray-950 tracking-tight mb-1.5">Booking Confirmed!</h1>
        <p class="text-xs sm:text-sm text-gray-500 font-medium mb-6">Your transaction has been approved and your e-ticket is issued.</p>

        <!-- Reference & Status Pill -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5 flex items-center justify-between">
          <div class="text-left">
            <span class="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Booking Reference (PNR)</span>
            <span class="font-mono text-lg font-black text-[#0D1DAD] tracking-wide">{{ bookingRef }}</span>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Confirmed & Ticketed
            </span>
          </div>
        </div>

        <!-- Confirmed Flight Summary -->
        <div v-if="confirmedFlightSummary" class="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 mb-6 text-left flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 p-1 flex items-center justify-center shrink-0">
              <img v-if="confirmedFlightSummary.airlineLogo" :src="confirmedFlightSummary.airlineLogo" class="h-full w-full object-contain" />
              <Plane v-else class="w-5 h-5 text-blue-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-bold text-gray-900 truncate">{{ confirmedFlightSummary.route }}</p>
              <p class="text-[11px] text-gray-500 font-medium truncate">{{ confirmedFlightSummary.airline }}</p>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Travel Date</span>
            <span class="text-xs font-bold text-gray-900">{{ confirmedFlightSummary.dates }}</span>
          </div>
        </div>

        <!-- What's Next List -->
        <div class="text-left bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-6 space-y-2.5">
          <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Next Steps</span>
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed">• We have delivered your e-ticket receipt and confirmation to your email.</p>
          <p class="text-xs text-slate-600 leading-relaxed">• Use reference <strong class="font-mono text-slate-900">{{ bookingRef }}</strong> to check in online or manage your seats.</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            type="button" 
            @click="goToManageBookings" 
            class="w-full sm:flex-1 py-3 px-6 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
          >
            Manage Booking
          </button>
          <button 
            type="button" 
            @click="goHome" 
            class="w-full sm:flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-bold text-xs sm:text-sm transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>

      <!-- ─── RESERVED / BANK TRANSFER (STEPPED REDESIGN) ─── -->
      <div v-else class="bg-white rounded-3xl border border-slate-200/90 w-full max-w-xl shadow-xl overflow-hidden">
        
        <!-- Stepped Header / Navigation Indicator -->
        <div class="bg-slate-50/90 border-b border-slate-200/80 px-4 sm:px-6 pt-5 pb-4">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-[10px] font-black uppercase tracking-widest text-[#0D1DAD] bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                Seats Reserved on Hold
              </span>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1">
                Booking Reference: <span class="text-[#0D1DAD] font-mono">{{ bookingRef }}</span>
              </h2>
            </div>
            <button 
              type="button"
              @click="copyReference"
              class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0"
              title="Copy Reference"
            >
              <Copy v-if="!copiedRef" class="w-3.5 h-3.5" />
              <Check v-else class="w-3.5 h-3.5 text-emerald-600" />
              <span>{{ copiedRef ? 'Copied' : 'Copy PNR' }}</span>
            </button>
          </div>

          <!-- Progress Stepper -->
          <div class="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <button 
              type="button"
              @click="currentStep = 1"
              class="py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-1"
              :class="currentStep === 1 ? 'bg-white shadow-sm border border-slate-200 text-[#0D1DAD]' : 'text-slate-400 hover:text-slate-600'"
            >
              <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" :class="currentStep === 1 ? 'bg-[#0D1DAD] text-white' : 'bg-slate-200 text-slate-600'">1</div>
              <span class="text-[11px] truncate">1. Reservation</span>
            </button>

            <button 
              type="button"
              @click="currentStep = 2"
              class="py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-1"
              :class="currentStep === 2 ? 'bg-white shadow-sm border border-slate-200 text-[#0D1DAD]' : 'text-slate-400 hover:text-slate-600'"
            >
              <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" :class="currentStep === 2 ? 'bg-[#0D1DAD] text-white' : 'bg-slate-200 text-slate-600'">2</div>
              <span class="text-[11px] truncate">2. Payment</span>
            </button>

            <button 
              type="button"
              @click="currentStep = 3"
              class="py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-1"
              :class="currentStep === 3 ? 'bg-white shadow-sm border border-slate-200 text-[#0D1DAD]' : 'text-slate-400 hover:text-slate-600'"
            >
              <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" :class="currentStep === 3 ? 'bg-[#0D1DAD] text-white' : 'bg-slate-200 text-slate-600'">3</div>
              <span class="text-[11px] truncate">3. Verification</span>
            </button>
          </div>
        </div>

        <!-- ── STEP 1: RESERVATION SUMMARY ── -->
        <div v-if="currentStep === 1" class="p-4 sm:p-7 space-y-5">
          <!-- Hold Advisory Notice -->
          <div class="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
            <Clock class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div class="text-xs text-amber-900 leading-relaxed">
              <strong class="font-bold">Your reservation is active.</strong> Your seats are secured on hold. Please complete bank settlement within 24 hours to finalize ticket issuance.
            </div>
          </div>

          <!-- Ticket Pass Card -->
          <div class="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 relative overflow-hidden">
            <div class="flex items-center justify-between pb-3.5 border-b border-dashed border-slate-300">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center">
                  <img v-if="confirmedFlightSummary?.airlineLogo" :src="confirmedFlightSummary.airlineLogo" class="h-full w-full object-contain" />
                  <Plane v-else class="w-5 h-5 text-[#0D1DAD]" />
                </div>
                <div>
                  <span class="text-[10px] font-bold uppercase text-slate-400">Carrier</span>
                  <p class="text-xs font-black text-slate-900">{{ confirmedFlightSummary?.airline || 'Verified Airline Partner' }}</p>
                </div>
              </div>

              <div class="text-right">
                <span class="text-[10px] font-bold uppercase text-slate-400">Status</span>
                <span class="block text-xs font-black text-amber-600">Pending Settlement</span>
              </div>
            </div>

            <!-- Route & Date Row -->
            <div class="pt-3.5 flex items-center justify-between gap-4">
              <div>
                <span class="text-[10px] font-bold uppercase text-slate-400">Flight Route</span>
                <p class="text-sm font-black text-slate-900">{{ confirmedFlightSummary?.route || 'Confirmed Itinerary' }}</p>
              </div>

              <div class="text-right">
                <span class="text-[10px] font-bold uppercase text-slate-400">Travel Date</span>
                <p class="text-xs font-black text-slate-900">{{ confirmedFlightSummary?.dates || 'Pending Confirmation' }}</p>
              </div>
            </div>
          </div>

          <!-- Step 1 Actions -->
          <div class="pt-2 flex flex-col sm:flex-row gap-3">
            <button 
              type="button" 
              @click="currentStep = 2" 
              class="w-full sm:flex-1 py-3.5 px-6 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>View Payment Details</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            <button 
              type="button" 
              @click="goToManageBookings" 
              class="w-full sm:w-auto py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs sm:text-sm transition-all"
            >
              Manage Booking
            </button>
          </div>
        </div>

        <!-- ── STEP 2: BANK SETTLEMENT (TABBED BY CURRENCY) ── -->
        <div v-else-if="currentStep === 2" class="p-4 sm:p-7 space-y-5">
          
          <!-- Instructions header -->
          <div class="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Building2 class="w-5 h-5 text-[#0D1DAD] shrink-0 mt-0.5" />
            <div class="text-xs text-blue-950 leading-relaxed">
              <strong class="font-bold">Official Bank Settlement Accounts.</strong> Transfer the total to any of the accounts below using reference <strong class="font-mono text-[#0D1DAD] bg-blue-100 px-1.5 py-0.5 rounded">{{ bookingRef }}</strong> as the transaction memo.
            </div>
          </div>

          <!-- Currency Selector Tabs (avoids massive vertical page scroll) -->
          <div v-if="bankAccounts.length > 1" class="flex p-1 bg-slate-100 rounded-2xl gap-1">
            <button 
              v-for="(acc, i) in bankAccounts" 
              :key="i"
              type="button"
              @click="selectedBankIdx = i"
              class="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center"
              :class="selectedBankIdx === i ? 'bg-white shadow-sm text-[#0D1DAD] font-extrabold' : 'text-slate-500 hover:text-slate-800'"
            >
              {{ acc.currency }} Transfer ({{ acc.bankName }})
            </button>
          </div>

          <!-- Active Bank Account Details Box -->
          <div v-if="loadingBankAccounts" class="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
            Loading settlement credentials...
          </div>

          <div v-else-if="activeBank" class="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3.5">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div>
                <span class="text-[10px] font-bold uppercase text-slate-400 block">Bank Name</span>
                <span class="text-sm font-black text-slate-900">{{ activeBank.bankName }}</span>
              </div>
              <span class="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-md">
                {{ activeBank.currency }} Settlement
              </span>
            </div>

            <!-- Account Number Row with Copy -->
            <div class="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase text-slate-400 block">Account Number</span>
                <span class="font-mono text-base sm:text-lg font-black text-slate-950 tracking-wider">{{ activeBank.accountNumber }}</span>
              </div>
              <button 
                type="button"
                @click="copyAccount(activeBank.accountNumber)"
                class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0D1DAD] text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Copy v-if="!copiedAccount" class="w-3.5 h-3.5" />
                <Check v-else class="w-3.5 h-3.5 text-emerald-600" />
                <span>{{ copiedAccount ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>

            <div class="text-xs text-slate-700">
              <span class="text-slate-400 font-semibold block text-[10px] uppercase">Beneficiary Name</span>
              <span class="font-bold text-slate-900">{{ activeBank.accountName }}</span>
            </div>

            <div v-if="activeBank.routingNumber || activeBank.swiftCode" class="grid grid-cols-2 gap-2 text-xs pt-1">
              <div v-if="activeBank.routingNumber" class="bg-white p-2.5 rounded-xl border border-slate-100">
                <span class="text-slate-400 font-bold block text-[10px] uppercase">Routing / Sort</span>
                <span class="font-mono font-bold text-slate-900">{{ activeBank.routingNumber }}</span>
              </div>
              <div v-if="activeBank.swiftCode" class="bg-white p-2.5 rounded-xl border border-slate-100">
                <span class="text-slate-400 font-bold block text-[10px] uppercase">SWIFT / BIC</span>
                <span class="font-mono font-bold text-slate-900">{{ activeBank.swiftCode }}</span>
              </div>
            </div>

            <div class="p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
              <strong class="font-bold">Required Payment Memo:</strong> Please write your booking reference <strong class="font-mono font-bold text-amber-950">{{ bookingRef }}</strong> in your bank transfer narration/memo.
            </div>
          </div>

          <!-- Email Delivery Feature -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mail class="w-4 h-4 text-[#0D1DAD]" />
                <span>Receive Details in Your Email</span>
              </span>
              <span v-if="emailSent" class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Check class="w-3 h-3" /> Sent!
              </span>
            </div>

            <div class="flex gap-2">
              <input 
                v-model="customerEmail" 
                type="email" 
                placeholder="Enter email address" 
                class="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-[#0D1DAD] transition-all"
              />
              <button 
                type="button" 
                @click="sendBankDetailsToEmail"
                :disabled="isSendingEmail || !customerEmail"
                class="px-4 py-2 bg-slate-900 hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>{{ isSendingEmail ? 'Sending...' : 'Send to Email' }}</span>
              </button>
            </div>
          </div>

          <!-- Step 2 Navigation Buttons -->
          <div class="pt-2 flex flex-col sm:flex-row gap-3">
            <button 
              type="button" 
              @click="currentStep = 3" 
              class="w-full sm:flex-1 py-3.5 px-6 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>I've Sent the Payment</span>
              <CheckCircle2 class="w-4 h-4" />
            </button>
            <button 
              type="button" 
              @click="currentStep = 1" 
              class="w-full sm:w-auto py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        <!-- ── STEP 3: PAYMENT VERIFICATION & CONCIERGE ── -->
        <div v-else class="p-4 sm:p-7 space-y-5 text-center">
          
          <div class="w-16 h-16 rounded-full bg-blue-50 text-[#0D1DAD] flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
            <Clock class="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900">Settlement Under Verification</h3>
            <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Thank you for initiating your bank transfer. Our finance department automatically reconciles incoming deposits using reference <strong class="font-mono text-slate-900">{{ bookingRef }}</strong>.
            </p>
          </div>

          <!-- Timeline status -->
          <div class="text-left bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
              <div>
                <h5 class="text-xs font-bold text-slate-900">1. Booking Reserved</h5>
                <p class="text-[11px] text-slate-500">Seats held on the global travel reservation system.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-blue-100 text-[#0D1DAD] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
              <div>
                <h5 class="text-xs font-bold text-slate-900">2. Bank Verification</h5>
                <p class="text-[11px] text-slate-500">Deposit is reconciled (usually within 15–30 minutes during banking hours).</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
              <div>
                <h5 class="text-xs font-bold text-slate-900">3. E-Ticket Issuance</h5>
                <p class="text-[11px] text-slate-500">Official airline e-ticket and invoice dispatched to your inbox.</p>
              </div>
            </div>
          </div>

          <!-- Concierge Support Card -->
          <div class="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex items-center justify-between text-left">
            <div>
              <span class="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">Priority Support</span>
              <span class="text-xs text-blue-700">Call 1-844-FLYBETH or reach out via 24/7 Live Chat.</span>
            </div>
            <a 
              href="tel:1-844-FLYBETH" 
              class="px-3.5 py-1.5 bg-white border border-blue-200 text-[#0D1DAD] text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
            >
              Call Concierge
            </a>
          </div>

          <!-- Step 3 Final Buttons -->
          <div class="pt-2 flex flex-col sm:flex-row gap-3">
            <button 
              type="button" 
              @click="goToManageBookings" 
              class="w-full sm:flex-1 py-3.5 px-6 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              Track in Self-Service Portal
            </button>
            <button 
              type="button" 
              @click="goHome" 
              class="w-full sm:flex-1 py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-bold text-xs sm:text-sm transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>

      </div>

    </main>

    <!-- Slide-out Drawer for PNR Details -->
    <BookingDetailsDrawer 
      :visible="showDrawer" 
      :pnr="bookingRef" 
      @close="showDrawer = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTracking } from '@/composables/core/useTracking'
import { paymentsApi } from '@/api_factory/modules/payments'
import { bookingsApi } from '@/api_factory/modules/bookings'
import BookingDetailsDrawer from '@/components/checkout/BookingDetailsDrawer.vue'
import { 
  Check, 
  Copy, 
  Clock, 
  Plane, 
  Mail, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-vue-next'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const { trackAction } = useTracking()

const bookingRef = computed(() => (route.query.pnr as string) || '')
const orderId = computed(() => (route.query.orderId as string) || '')
const paymentStatus = ref((route.query.status as string) || 'booked')
const checkoutToken = computed(() => (route.query.checkout_token as string) || (route.query.token as string) || (route.query.reference as string) || '')
const provider = computed(() => (route.query.provider as string) || '')
const isAuthorizing = ref(false)

// Stepped flow state
const currentStep = ref(1)

// Bank accounts state
const bankAccounts = ref<any[]>([])
const selectedBankIdx = ref(0)
const loadingBankAccounts = ref(false)
const copiedAccount = ref(false)
const copiedRef = ref(false)

// Email sending state
const customerEmail = ref('')
const isSendingEmail = ref(false)
const emailSent = ref(false)

const activeBank = computed(() => {
  if (!bankAccounts.value.length) return null
  return bankAccounts.value[selectedBankIdx.value] || bankAccounts.value[0]
})

const fetchBankAccounts = async () => {
  loadingBankAccounts.value = true
  try {
    const { data } = await paymentsApi.getBankAccounts()
    const list = data?.data || data || []
    bankAccounts.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.warn('Failed to load bank accounts on confirmation:', e)
  } finally {
    loadingBankAccounts.value = false
  }
}

const copyAccount = (accNum: string) => {
  if (!accNum) return
  navigator.clipboard?.writeText(accNum)
  copiedAccount.value = true
  const { $toast } = useNuxtApp() as any
  $toast?.success?.('Account number copied!')
  setTimeout(() => { copiedAccount.value = false }, 2000)
}

const copyReference = () => {
  if (!bookingRef.value) return
  navigator.clipboard?.writeText(bookingRef.value)
  copiedRef.value = true
  const { $toast } = useNuxtApp() as any
  $toast?.success?.('Booking Reference copied!')
  setTimeout(() => { copiedRef.value = false }, 2000)
}

const sendBankDetailsToEmail = async () => {
  if (!customerEmail.value || isSendingEmail.value) return
  isSendingEmail.value = true
  emailSent.value = false
  const { $toast } = useNuxtApp() as any
  try {
    await paymentsApi.sendBankDetailsEmail({
      email: customerEmail.value,
      currency: activeBank.value?.currency,
      bookingRef: bookingRef.value,
    })
    emailSent.value = true
    $toast?.success?.('Bank credentials sent to your email!')
  } catch (err: any) {
    $toast?.error?.(err?.response?.data?.message || 'Failed to send bank details email')
  } finally {
    isSendingEmail.value = false
  }
}

const showDrawer = ref(false)
const confirmedFlight = ref<any>(null)

const confirmedFlightSummary = computed(() => {
  if (!confirmedFlight.value) return null
  const f = confirmedFlight.value

  let departureIso = f.departureTime || f.departureDate
  let returnIso = f.returnTime || f.returnDate

  if (f.slices && f.slices.length > 0) {
    departureIso = departureIso || f.slices[0]?.segments?.[0]?.departing_at
    if (f.slices.length > 1) {
      returnIso = returnIso || f.slices[1]?.segments?.[0]?.departing_at
    }
  }

  if (f.itineraries && f.itineraries.length > 0) {
    departureIso = departureIso || f.itineraries[0]?.departureTime || f.itineraries[0]?.segments?.[0]?.departureTime
    if (f.itineraries.length > 1) {
      returnIso = returnIso || f.itineraries[1]?.departureTime || f.itineraries[1]?.segments?.[0]?.departureTime
    }
  }

  const formatFull = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return String(iso)
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const depFmt = formatFull(departureIso)
  const retFmt = formatFull(returnIso)

  return {
    route: `${f.origin || 'Origin'} ➔ ${f.destination || 'Destination'}`,
    airline: f.airline || 'Flight',
    airlineLogo: f.airlineLogo,
    dates: retFmt ? `${depFmt} – ${retFmt}` : depFmt
  }
})

onMounted(async () => {
  if (import.meta.client) {
    try {
      const saved = sessionStorage.getItem('selectedFlight')
      if (saved) confirmedFlight.value = JSON.parse(saved)
      
      const savedEmail = sessionStorage.getItem('customerEmail') || sessionStorage.getItem('checkoutEmail')
      if (savedEmail) customerEmail.value = savedEmail
    } catch {
      // ignore
    }
  }

  // Fallback: If not in sessionStorage, load directly from PNR
  if (bookingRef.value && !confirmedFlight.value) {
    try {
      const { data } = await bookingsApi.getByPnr(bookingRef.value)
      const bkg = data.data || data
      if (bkg) {
        if (bkg.flights?.[0]) {
          confirmedFlight.value = bkg.flights[0]
        }
        if (bkg.contactDetails?.email && !customerEmail.value) {
          customerEmail.value = bkg.contactDetails.email
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (paymentStatus.value === 'success' && checkoutToken.value && provider.value) {
    isAuthorizing.value = true
    try {
      await paymentsApi.verifyPayment({
        bookingId: orderId.value,
        provider: provider.value,
        checkoutToken: checkoutToken.value
      })
      paymentStatus.value = 'success'
    } catch (error) {
      console.error('Failed to verify payment:', error)
      paymentStatus.value = 'pending_payment'
    } finally {
      isAuthorizing.value = false
    }
  }

  trackAction('booking_completed', {
    pnr: bookingRef.value,
    orderId: orderId.value,
    status: paymentStatus.value
  })

  if (paymentStatus.value !== 'success') {
    fetchBankAccounts()
  }
})

const goHome = () => {
  router.push('/')
}

const goToManageBookings = () => {
  router.push({ path: '/bookings', query: { pnr: bookingRef.value } })
}
</script>
