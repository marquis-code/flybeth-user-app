<template>
  <BrandedLoader 
    :visible="showBrandedLoader" 
    :statusText="loaderStatus"
    subtitle="Please wait while we prepare your booking"
  />

  <CurrencyConversionLoader :visible="isConversionLoading" />

  <ManualPaymentDetailsModal
    v-model="isManualDetailsVisible"
    :accounts="bankAccounts"
    @confirm="handleManualConfirm"
  />

  <BookingExpiredModal :visible="isBookingExpired" :title="bookingErrorTitle" :message="bookingErrorMsg" />

  
  <!-- Cash App Widget Modal -->
  <div v-if="showCashAppWidget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-white/50">
        <h3 class="text-xl font-bold text-black flex items-center gap-2">
           <span class="text-green-500 italic text-2xl">Cash App</span> Pay
        </h3>
        <button @click="closeCashAppWidget" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <XIcon class="w-5 h-5 text-black" />
        </button>
      </div>
      <div class="p-12 overflow-y-auto flex flex-col items-center justify-center">
        <p class="text-center text-gray-500 mb-8 font-medium">Click the button below to authorize the payment via Cash App.</p>
        <div id="cash-app-pay" class="w-full max-w-[280px]"></div>
      </div>
    </div>
  </div>

  <!-- Klarna Widget Modal -->
  <div v-if="showKlarnaWidget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div class="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-white/50">
        <h3 class="text-xl font-bold text-black">Complete with Klarna</h3>
        <button @click="closeKlarnaWidget" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <XIcon class="w-5 h-5 text-black" />
        </button>
      </div>
      <div class="p-6 overflow-y-auto">
        <div id="klarna-payments-container"></div>
      </div>
      <div class="p-6 border-t border-gray-200 bg-white/50 flex justify-end">
        <button @click="authorizeKlarnaPayment" class="btn-primary" :disabled="isAuthorizingKlarna">
          {{ isAuthorizingKlarna ? 'Authorizing...' : 'Confirm Order' }}
        </button>
      </div>
    </div>
  </div>


  <div v-if="!showBrandedLoader" class="ck-root min-h-screen bg-white/30 overflow-x-clip">
    
    <!-- Premium Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 py-3.5 sm:py-4 shadow-xs transition-all">
      <div class="ck-wrap mx-auto relative z-10 flex flex-wrap xl:flex-nowrap items-center justify-between gap-4 xl:gap-8">
        <!-- Left: Flight Details -->
        <div class="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          <button @click="handleGoBack" class="flex-shrink-0 flex items-center justify-center hover:bg-gray-100 rounded-full w-10 h-10 transition-colors">
            <ChevronLeft class="h-6 w-6 text-gray-700" />
          </button>
          
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-2 truncate">
              <span class="text-[14px] lg:text-[15px] font-bold text-gray-900 truncate">
                <template v-if="bookingDetails.type === 'flight' && priceDetailed">
                  <span v-if="priceDetailed.tripType === 'Multi-city'">Multi-city Itinerary</span>
                  <!-- Airport codes keep the compact header readable; city
                       names were being truncated to "Lagos → L…". -->
                  <span v-else class="whitespace-nowrap">
                    {{ priceDetailed.origin }}
                    <span class="text-gray-400 font-normal">→</span>
                    {{ priceDetailed.destination }}
                    <span v-if="priceDetailed.originName || priceDetailed.destinationName" class="ml-1.5 hidden text-[12px] font-medium text-gray-500 sm:inline">
                      {{ priceDetailed.originName }} to {{ priceDetailed.destinationName }}
                    </span>
                  </span>
                </template>
                <template v-else>
                  {{ bookingDetails.name }}
                </template>
              </span>
            </div>
            <span class="text-[12px] lg:text-[13px] text-gray-600 font-medium mt-0.5 flex items-center gap-1.5 truncate">
              <Calendar class="w-3.5 h-3.5 text-[#0D1DAD] flex-shrink-0" />
              <span>{{ tripDates.fullRange || 'Travel Dates' }}</span>
            </span>
          </div>
        </div>

        <!-- Center: Stepper -->
        <div class="flex items-center justify-center w-full xl:w-auto order-last xl:order-none mt-2 xl:mt-0 flex-shrink-0">
          <CheckoutStepper :currentStep="currentStep" :steps="stepsList" />
        </div>

        <!-- Right: Price & Actions -->
        <div class="flex items-center justify-end gap-3 sm:gap-4 lg:gap-6 flex-1 flex-shrink-0 min-w-max">
          <div class="flex flex-col items-end flex-shrink-0">
             <span class="text-[15px] lg:text-[16px] font-black text-[#0D1DAD]">{{ currencySymbol }}{{ displayPrices.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
             <span class="text-[11px] lg:text-[12px] text-gray-400 font-bold uppercase tracking-wider">Total price</span>
          </div>
          
          <button @click="goToStep(summaryStepIndex)" class="px-4 py-2 lg:px-5 lg:py-2 bg-[#0D1DAD]/10 text-[#0D1DAD] rounded-full text-xs lg:text-sm font-bold hover:bg-[#0D1DAD]/15 transition-colors hidden md:block whitespace-nowrap">
            View Summary
          </button>

          <div class="flex flex-shrink-0 items-center justify-center">
            <LanguageSelector 
              :current-currency="currentCurrency.code"
              @change-currency="handleCurrencySelect"
            />
          </div>
        </div>
      </div>
    </header>

   <main class="ck-main">
  <div class="ck-wrap mx-auto">
      <!-- Main column: aligned with header back button and full ck-wrap width -->
      <div class="w-full space-y-8 pb-32 pt-0">
        <!-- Persistent Trip Context & Dates Banner (Shown across all steps) -->
        <div v-if="tripDates.hasDates || priceDetailed" class="bg-white rounded-2xl sm:rounded-[22px] border border-gray-200/90 p-4 sm:p-5 shadow-sm transition-all duration-300">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <!-- Route & Booking Info -->
            <div class="flex items-center gap-3.5 min-w-0">
              <div v-if="priceDetailed?.airlineLogo" class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 p-1.5 flex items-center justify-center flex-shrink-0">
                <img :src="priceDetailed.airlineLogo" :alt="priceDetailed.airline" class="h-full w-full object-contain" />
              </div>
              <div v-else class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <component :is="tripTypeIcon" class="w-5 h-5 text-[#0D1DAD]" />
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-base font-bold text-gray-900 tracking-tight">
                    <template v-if="bookingDetails.type === 'flight' && priceDetailed">
                      {{ priceDetailed.origin }} ➔ {{ priceDetailed.destination }}
                    </template>
                    <template v-else>
                      {{ bookingDetails.name }}
                    </template>
                  </span>
                  <span v-if="bookingDetails.type === 'flight'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100/80">
                    {{ tripDates.isRoundTrip ? 'Round Trip' : 'One Way' }}
                  </span>
                  <span v-else-if="bookingDetails.type === 'stay'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100/80">
                    Hotel Stay
                  </span>
                  <span v-else-if="bookingDetails.type === 'activity'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100/80">
                    Experience
                  </span>
                  <span v-else-if="bookingDetails.type === 'car'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100/80">
                    Car Rental
                  </span>
                  <span v-else-if="bookingDetails.type === 'transfer'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                    Airport Transfer
                  </span>
                  <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100/80">
                    {{ bookingDetails.type }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 font-medium truncate mt-0.5">
                  <span v-if="bookingDetails.type === 'flight' && priceDetailed?.originName && priceDetailed?.destinationName">
                    {{ priceDetailed.originName }} to {{ priceDetailed.destinationName }} • 
                  </span>
                  <span v-if="bookingDetails.type === 'flight'">{{ priceDetailed?.airline || bookingDetails.name }}</span>
                  <span v-else-if="bookingDetails.type === 'stay'">{{ priceDetailed?.roomType || priceDetailed?.hotelName || bookingDetails.name }}</span>
                  <span v-else-if="bookingDetails.type === 'activity'">{{ bookingDetails.duration ? `${bookingDetails.duration} duration` : (priceDetailed?.city || 'Instant Confirmation') }}</span>
                  <span v-else-if="bookingDetails.type === 'car'">{{ priceDetailed?.vendor || 'Car Rental' }}</span>
                  <span v-else-if="bookingDetails.type === 'transfer'">{{ priceDetailed?.provider || 'Transfer Service' }}</span>
                  <span v-else>{{ bookingDetails.name }}</span>
                  <span v-if="priceDetailed?.cabinClass" class="capitalize"> • {{ priceDetailed.cabinClass }}</span>
                </p>
              </div>
            </div>

            <!-- Date Badges (Consistently Visible at Every Step) -->
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <!-- Outbound / Departure Date -->
              <div v-if="tripDates.departure" class="flex items-center gap-2.5 bg-blue-50/70 border border-blue-100 rounded-xl px-3.5 py-2 flex-1 sm:flex-initial">
                <Calendar class="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider text-blue-600 block leading-tight">
                    {{ departureDateBadgeLabel }}
                  </span>
                  <span class="text-xs font-bold text-gray-900 leading-tight block whitespace-nowrap">
                    {{ tripDates.departure }}
                  </span>
                </div>
              </div>

              <!-- Return / Check-out Date -->
              <div v-if="tripDates.return" class="flex items-center gap-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl px-3.5 py-2 flex-1 sm:flex-initial">
                <Calendar class="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider text-indigo-600 block leading-tight">
                    {{ returnDateBadgeLabel }}
                  </span>
                  <span class="text-xs font-bold text-gray-900 leading-tight block whitespace-nowrap">
                    {{ tripDates.return }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Step 0: Details (Flight Details + Contact Details + Passenger Details) -->
        <div v-if="currentStep === 0" class="space-y-6 animate-in">
          
          <div class="bg-white rounded-3xl sm:rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-3 sm:p-4 md:p-6">
              <CheckoutFlightDetails
                v-if="bookingDetails.type === 'flight'"
                :flightOffer="priceDetailed"
                hideContinue
              />
              <CheckoutStayDetails
                v-if="bookingDetails.type === 'stay'"
                :stay="priceDetailed"
                :currency-symbol="currencySymbol"
                hideContinue
              />
              <CheckoutTransferDetails
                v-if="bookingDetails.type === 'transfer'"
                :name="priceDetailed?.name"
                :provider="priceDetailed?.provider"
                :hideContinue="true"
              />
              <template v-if="bookingDetails.type === 'package'">
                <CheckoutPackageDetails
                  v-if="!priceDetailed?.flightDetails && !priceDetailed?.stayDetails"
                  :name="bookingDetails.name"
                  :packageDetails="priceDetailed"
                />
                <CheckoutFlightDetails
                  v-if="priceDetailed?.flightDetails"
                  :flightOffer="priceDetailed.flightDetails"
                  hideContinue
                />
                <hr v-if="priceDetailed?.flightDetails && priceDetailed?.stayDetails" class="my-6 border-gray-200" />
                <CheckoutStayDetails
                  v-if="priceDetailed?.stayDetails"
                  :stay="priceDetailed.stayDetails"
                  :currency-symbol="currencySymbol"
                  hideContinue
                />
              </template>

              <!-- Car rental summary -->
              <div v-if="bookingDetails.type === 'car'" class="space-y-3">
                <div>
                  <span class="inline-block text-[11px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 rounded-full px-3 py-1">Car rental</span>
                  <h3 class="mt-2 text-[18px] font-bold text-gray-900">{{ priceDetailed?.name || bookingDetails.name }}</h3>
                  <p v-if="priceDetailed?.vendor" class="text-[13px] text-gray-500">{{ priceDetailed.vendor }}</p>
                </div>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div v-if="bookingDetails.pickUpDate" class="bg-gray-50 rounded-xl p-3">
                    <dt class="text-gray-500">Pick-up</dt>
                    <dd class="font-semibold text-gray-900">{{ bookingDetails.pickUpDate }}<span v-if="bookingDetails.pickUpLocation"> · {{ bookingDetails.pickUpLocation }}</span></dd>
                  </div>
                  <div v-if="bookingDetails.dropOffDate" class="bg-gray-50 rounded-xl p-3">
                    <dt class="text-gray-500">Drop-off</dt>
                    <dd class="font-semibold text-gray-900">{{ bookingDetails.dropOffDate }}<span v-if="bookingDetails.dropOffLocation"> · {{ bookingDetails.dropOffLocation }}</span></dd>
                  </div>
                </dl>
              </div>

              <!-- Activity / experience summary -->
              <div v-if="bookingDetails.type === 'activity'" class="space-y-3">
                <div>
                  <span class="inline-block text-[11px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">Activity</span>
                  <h3 class="mt-2 text-[18px] font-bold text-gray-900">{{ priceDetailed?.name || bookingDetails.name }}</h3>
                  <p v-if="priceDetailed?.city" class="text-[13px] text-gray-500">{{ priceDetailed.city }}</p>
                </div>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div v-if="bookingDetails.date" class="bg-gray-50 rounded-xl p-3">
                    <dt class="text-gray-500">Date</dt>
                    <dd class="font-semibold text-gray-900">{{ bookingDetails.date }}</dd>
                  </div>
                  <div v-if="priceDetailed?.minimumDuration" class="bg-gray-50 rounded-xl p-3">
                    <dt class="text-gray-500">Duration</dt>
                    <dd class="font-semibold text-gray-900">{{ priceDetailed.minimumDuration }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <CheckoutTravellerForm 
            v-model="travellerData" 
            :bookingType="bookingDetails.type"
            @email-blur="handleEmailBlur"
            @continue="handleStep0Continue"
          />
        </div>

        <!-- Step 1: Customise (Seats & Baggage) - For flights or packages with flight segments -->
        <div v-if="(bookingDetails.type === 'flight' || (bookingDetails.type === 'package' && priceDetailed?.flightDetails)) && currentStep === 1" class="animate-in space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
            <div>
              <h2 class="text-[20px] font-bold text-[#111827]">Customise your booking</h2>
              <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Select seats and baggage for your journey ({{ tripDates.fullRange }})</p>
            </div>
          </div>
          <CheckoutTripCustomization
            :flightOffer="bookingDetails.type === 'flight' ? priceDetailed : (priceDetailed?.flightDetails || null)"
            :stay="bookingDetails.type === 'stay' ? priceDetailed : null"
            :traveller="travellerData"
            :totalPrice="displayPrices.total"
            v-model:selectedAddOns="selectedAddOns"
            v-model:selectedSeats="selectedSeats"
            @update:seatPrice="val => seatPrice = val"
            @continue="goToStep(bookingDetails.type === 'flight' ? 2 : summaryStepIndex)"
            @back="goToStep(0)"
          />
        </div>

        <!-- Step 2: Protect (Cancellation & Baggage Protection) - Only for flights -->
        <div v-if="bookingDetails.type === 'flight' && currentStep === 2" class="animate-in space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
            <div>
              <h2 class="text-[20px] font-bold text-[#111827]">Protect your booking</h2>
              <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Coverage for your trip from {{ tripDates.fullRange }}</p>
            </div>
          </div>
          <CheckoutProtection 
            :flightOffer="priceDetailed"
            :currencySymbol="currencySymbol"
            v-model:selectedAddOns="selectedAddOns"
            @continue="goToStep(summaryStepIndex)"
            @back="goToStep(1)"
          />
        </div>

        <!-- Step: Summary & Payment (Review & Pay) -->
        <div v-if="currentStep === summaryStepIndex" class="animate-in space-y-6">
          
          <!-- Summary Modules (Read-only views) -->
          <CheckoutSummary 
            :bookingType="bookingDetails.type"
            :flightOffer="priceDetailed"
            :travellerData="travellerData"
            :selectedSeats="selectedSeats"
            :seatPrice="seatPrice"
            :selectedAddOns="selectedAddOns"
            :currencySymbol="currencySymbol"
            @edit="goToStep"
          />

          <div class="flex flex-col gap-8 mt-6">
            <!-- Payment Section -->
            <div class="w-full bg-white rounded-3xl sm:rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8">
              <CheckoutPayment 
                ref="paymentRef"
                :total-amount="displayPrices.total" 
                :currency-symbol="currencySymbol"
                :currency="currentCurrency.code"
                :processing="paymentProcessing"
                :flight-offer="priceDetailed"
                :traveller-email="travellerData?.email || ''"
                @complete-payment="handlePayment"
                @wallet-authorize="handleWalletAuthorize"
                @change-currency="handleCurrencySelect"
              />
            </div>

            <!-- Mandatory Booking Rules & Non-Refundable Agreement Section -->
            <div 
              id="booking-rules-section"
              class="w-full rounded-3xl sm:rounded-[24px] border transition-all duration-300 overflow-hidden p-5 sm:p-7 md:p-8"
              :class="[
                bookingRulesAccepted
                  ? 'bg-gradient-to-b from-blue-50/20 to-white border-blue-200 shadow-sm'
                  : rulesValidationTriggered
                    ? 'bg-amber-50/40 border-amber-500 ring-4 ring-amber-400/20 shadow-md'
                    : 'bg-white border-gray-200 shadow-sm'
              ]"
            >
              <!-- Card Header -->
              <div class="flex items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
                    :class="bookingRulesAccepted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-[#0D1DAD]'"
                  >
                    <Scale class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-base sm:text-lg font-black text-gray-900 tracking-tight">Booking Rules &amp; Non-Refundable Policy</h3>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                        Strict Agreement
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 font-medium mt-0.5">Please review each mandatory travel condition below before confirming your booking.</p>
                  </div>
                </div>

                <button 
                  type="button" 
                  @click="showDetailedRulesModal = true"
                  class="text-xs font-bold text-[#0D1DAD] hover:text-blue-800 flex items-center gap-1 shrink-0 py-1.5 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 transition-colors"
                >
                  <FileText class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">View Full Terms</span>
                </button>
              </div>

              <!-- Rules Grid / List -->
              <div class="space-y-3 mb-6">
                <!-- Rule 1: Non-Refundable Agency & Ticketing Fee -->
                <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <div class="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    <Ban class="w-4 h-4 text-amber-700" />
                  </div>
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h4 class="text-xs font-black uppercase text-amber-950 tracking-wider">100% Non-Refundable Agency &amp; Service Fee</h4>
                      <span class="text-[9px] font-extrabold uppercase text-amber-800 bg-amber-100/90 border border-amber-300 px-1.5 py-0.2 rounded">Strict Policy</span>
                    </div>
                    <p class="text-xs text-amber-900 leading-relaxed font-medium">
                      The <strong>{{ agencyFeeLabel || 'Agency Booking & Service Fee' }}</strong> covers reservation technology, global ticketing infrastructure, and 24/7 dedicated passenger assistance. It is <strong>strictly 100% non-refundable under all circumstances</strong>, including voluntary cancellations by the traveler, missed flights, or airline-initiated schedule changes.
                    </p>
                  </div>
                </div>

                <!-- Rule 2: Airline Fare Rules & Cancellation Penalties -->
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div class="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Plane class="w-4 h-4" />
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-black uppercase text-slate-800 tracking-wider">Airline Fare Conditions &amp; Carrier Penalties</h4>
                    <p class="text-xs text-slate-600 leading-relaxed font-medium">
                      Airline base fares and government taxes are governed solely by the issuing airline's fare rules. If an airline authorizes a cancellation refund, only the refundable carrier portion will be returned to the customer, minus applicable airline cancellation penalties. Non-refundable tickets cannot be refunded.
                    </p>
                  </div>
                </div>

                <!-- Rule 3: Name Matching & Passports -->
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div class="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <UserCheck class="w-4 h-4" />
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-black uppercase text-slate-800 tracking-wider">Name Accuracy &amp; Identity Verification</h4>
                    <p class="text-xs text-slate-600 leading-relaxed font-medium">
                      All traveler first, middle, and last names must match original government passports character-for-character. Airlines strictly prohibit name changes or ticket re-assignment after ticketing. Inaccurate names will result in denied boarding with zero airline refund eligibility.
                    </p>
                  </div>
                </div>

                <!-- Rule 4: Passport Validity, Visas & Entry Health Requirements -->
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div class="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 class="w-4 h-4" />
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-black uppercase text-slate-800 tracking-wider">Passport Validity &amp; Visa Responsibility</h4>
                    <p class="text-xs text-slate-600 leading-relaxed font-medium">
                      Passports must have at least 6 months of validity beyond the return date. Travelers bear sole legal responsibility for holding all valid destination visas, transit visas, electronic authorizations (e.g. ESTA, ETA), and required health/vaccination documents.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Interactive Mandatory Agreement Checkbox -->
              <label 
                class="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none group"
                :class="[
                  bookingRulesAccepted 
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-sm' 
                    : rulesValidationTriggered 
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300' 
                      : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-300 hover:border-slate-400'
                ]"
              >
                <div class="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input 
                    type="checkbox" 
                    v-model="bookingRulesAccepted" 
                    @change="rulesValidationTriggered = false"
                    class="sr-only" 
                  />
                  <div 
                    class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200"
                    :class="[
                      bookingRulesAccepted 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm scale-105' 
                        : rulesValidationTriggered 
                          ? 'border-amber-500 bg-white ring-2 ring-amber-300' 
                          : 'border-slate-400 bg-white group-hover:border-slate-500'
                    ]"
                  >
                    <svg v-if="bookingRulesAccepted" class="w-4 h-4 stroke-current stroke-[3] fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>

                <div class="space-y-1">
                  <span class="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-black leading-snug block">
                    I have read, understood, and strictly accept all the Flybeth Booking Rules, the Carrier Fare Conditions, and the 100% Non-Refundable Agency Fee Policy.
                  </span>
                  <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
                    By ticking this mandatory checkbox, you enter into a legally binding contract with Flybeth LLC and confirm that all passenger information, passport data, and travel conditions have been verified.
                  </p>
                </div>
              </label>

              <!-- Warning Alert if user attempted to proceed without checking -->
              <div v-if="rulesValidationTriggered && !bookingRulesAccepted" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle class="w-4 h-4 text-red-600 shrink-0" />
                <span>You must tick the checkbox above to confirm you accept the booking rules &amp; non-refundable fee policy before proceeding.</span>
              </div>
            </div>

            <!-- Price Breakdown (Full Width Redesign) -->
            <div class="w-full bg-white rounded-3xl sm:rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-6">Price breakdown</h3>
                  <div class="space-y-4 text-sm text-gray-600">
                    <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span class="font-medium text-gray-500">{{ baseFareLabel }}</span>
                      <span class="font-bold text-gray-900">{{ currencySymbol }}{{ displayPrices.base.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>
                    <div v-if="displayPrices.tax > 0" class="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span class="font-medium text-gray-500">Taxes & Mandatory Fees</span>
                      <span class="font-bold text-gray-900">{{ currencySymbol }}{{ displayPrices.tax.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>
                    <div v-if="displayPrices.serviceCharge > 0" class="flex justify-between items-center pb-3 border-b border-gray-100">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="font-medium text-gray-500">{{ agencyFeeLabel || 'Agency Booking & Service Fee' }}</span>
                        <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">Non-Refundable</span>
                      </div>
                      <span class="font-bold text-gray-900">{{ currencySymbol }}{{ displayPrices.serviceCharge.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>
                    
                    <div v-if="seatPrice > 0" class="flex justify-between items-center pb-3 border-b border-gray-100 text-blue-600">
                      <span class="font-medium">Seat Selection</span>
                      <span class="font-bold">+{{ currencySymbol }}{{ (seatPrice * (currentCurrency.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>

                    <template v-if="selectedAddOns.length > 0">
                      <div v-for="addon in selectedAddOns.filter(a => a.id !== 'seat-selection')" :key="addon.id" class="flex justify-between items-center pb-3 border-b border-gray-100 text-blue-600">
                        <span class="font-medium">{{ addon.name }}</span>
                        <span class="font-bold">+{{ currencySymbol }}{{ (addon.price * (currentCurrency.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Total & Action Area -->
                <div class="flex flex-col justify-end">
                  <div class="bg-gray-50 rounded-2xl p-6">
                    <div class="flex justify-between items-end mb-2">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount</span>
                        <p class="text-xs text-gray-400">Includes all taxes &amp; agency service fees</p>
                      </div>
                      <span class="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">{{ currencySymbol }}{{ displayPrices.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                    </div>

                    <div class="mt-3 pt-3 border-t border-gray-200/80">
                      <p class="text-[11px] leading-relaxed text-amber-900 bg-amber-50/90 border border-amber-200/80 p-2.5 rounded-xl font-medium">
                        <strong class="font-bold">Cancellation Policy:</strong> Airline base fares and government taxes are subject to airline fare rules. Agency booking &amp; ticketing fees are 100% non-refundable under all circumstances.
                      </p>
                    </div>
                    
                    <!-- Agreement Warning Banner above Button if not checked -->
                    <div 
                      v-if="!bookingRulesAccepted" 
                      class="mt-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all"
                      :class="rulesValidationTriggered ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'"
                    >
                      <AlertCircle class="w-4 h-4 shrink-0" :class="rulesValidationTriggered ? 'text-red-600' : 'text-amber-600'" />
                      <span>Please tick the mandatory rules checkbox above to enable checkout.</span>
                    </div>

                    <div class="mt-4" v-show="!paymentRef || paymentRef.requiresExternalSubmit">
                      <button 
                        @click="handlePayNow" 
                        :disabled="paymentProcessing || !bookingRulesAccepted" 
                        class="w-full h-12 bg-[#0D1DAD] hover:bg-[#0A1485] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                      >
                        <template v-if="!paymentProcessing">
                          <Lock class="w-5 h-5 opacity-80" />
                          <span>{{ bookingRulesAccepted ? 'Complete Booking' : 'Accept Rules to Complete Booking' }}</span>
                        </template>
                        <span v-else class="animate-pulse flex items-center gap-2">
                          <span class="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                          Processing Securely...
                        </span>
                      </button>
                      <div class="flex items-center justify-center gap-2 mt-4 text-gray-400">
                        <ShieldCheck class="w-4 h-4" />
                        <span class="text-xs font-semibold uppercase tracking-wider">AES-256 Bank-Level Encryption</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>

  <!-- Detailed Booking Rules & Legal Terms Modal -->
  <div v-if="showDetailedRulesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
      <!-- Modal Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-blue-100 text-[#0D1DAD] flex items-center justify-center">
            <Scale class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900">Flybeth LLC &bull; Official Booking Rules</h3>
            <p class="text-xs text-slate-500 font-medium">Terms of carriage, fare conditions, and non-refundable policy</p>
          </div>
        </div>
        <button @click="showDetailedRulesModal = false" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Content Body -->
      <div class="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed font-normal">
        <section class="space-y-1.5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
          <h4 class="font-black text-sm text-amber-950 flex items-center gap-2">
            <Ban class="w-4 h-4 text-amber-700" />
            1. Agency Booking &amp; Ticketing Fee (100% Non-Refundable)
          </h4>
          <p class="text-amber-900 font-medium">
            The <strong>{{ agencyFeeLabel || 'Flybeth Agency Booking & Service Fee' }}</strong> is charged for platform technology, global reservation system inventory access, automated e-ticketing issuance, and 24/7 passenger assistance. <strong>This fee is strictly 100% non-refundable under all circumstances</strong>, including but not limited to voluntary passenger cancellations, failure to board, medical emergencies, schedule changes initiated by the carrier, flight cancellations, or force majeure events.
          </p>
        </section>

        <section class="space-y-1.5">
          <h4 class="font-black text-sm text-slate-900 flex items-center gap-2">
            <Plane class="w-4 h-4 text-blue-600" />
            2. Carrier Fare Rules &amp; Cancellation Penalties
          </h4>
          <p>
            Airline base fares and mandatory government taxes are subject exclusively to the operating airline's fare rules and contract of carriage. If an airline approves an involuntary or voluntary cancellation refund, only the refundable carrier fare component will be remitted to the customer, minus any applicable airline cancellation penalties. Non-refundable tickets cannot be refunded.
          </p>
        </section>

        <section class="space-y-1.5">
          <h4 class="font-black text-sm text-slate-900 flex items-center gap-2">
            <UserCheck class="w-4 h-4 text-indigo-600" />
            3. Passenger Identity &amp; Strict Non-Transferability
          </h4>
          <p>
            All traveler names (first, middle, last) and dates of birth must match the traveler's valid passport or photo ID character-for-character. Airlines strictly prohibit name changes, name transfers, or ticket re-assignment to another person once a ticket is issued. Flybeth LLC cannot alter names on issued airline tickets.
          </p>
        </section>

        <section class="space-y-1.5">
          <h4 class="font-black text-sm text-slate-900 flex items-center gap-2">
            <FileCheck2 class="w-4 h-4 text-emerald-600" />
            4. Passports, Visas &amp; Entry Documentation
          </h4>
          <p>
            Passports must possess at least 6 months of validity beyond the scheduled return date. Travelers bear sole and exclusive legal responsibility for holding all valid visas, transit visas, electronic travel authorizations (e.g. US ESTA, Canada eTA, UK ETA), and required health/vaccine certificates. Flybeth LLC is not liable for entry refusals or deportation.
          </p>
        </section>

        <section class="space-y-1.5">
          <h4 class="font-black text-sm text-slate-900 flex items-center gap-2">
            <Building class="w-4 h-4 text-slate-600" />
            5. Independent Agency Status &amp; Jurisdiction
          </h4>
          <p>
            Flybeth LLC acts solely as an independent travel reservation agent between passengers and travel suppliers (airlines, transfer companies, hotels). All bookings are governed by the laws of the State of Texas, United States.
          </p>
        </section>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
        <span class="text-[11px] font-bold text-slate-500">Flybeth LLC &bull; Corporate Compliance</span>
        <button 
          type="button" 
          @click="bookingRulesAccepted = true; showDetailedRulesModal = false; rulesValidationTriggered = false;"
          class="px-5 py-2.5 bg-[#0D1DAD] hover:bg-[#0A1485] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          Accept Rules &amp; Close
        </button>
      </div>
    </div>
  </div>
</main>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  X as XIcon, 
  Calendar, 
  Plane, 
  Building, 
  Compass, 
  Car, 
  CarTaxiFront, 
  Ship,
  AlertCircle,
  CheckCircle2,
  Ban,
  UserCheck,
  FileText,
  Scale,
  FileCheck2,
  Info,
  ExternalLink
} from 'lucide-vue-next'
import { useRoute, useRouter, navigateTo, useRuntimeConfig } from '#app'
import { staysApi } from '~/api_factory/modules/stays'
import { paymentsApi } from '~/api_factory/modules/payments'
import { useFlightCheckout } from '~/composables/modules/flights/useFlightCheckout'
import BrandedLoader from '~/components/BrandedLoader.vue'
import CheckoutStepper from '~/components/checkout/CheckoutStepper.vue'
import CheckoutFlightDetails from '~/components/checkout/CheckoutFlightDetails.vue'
import CheckoutTransferDetails from '~/components/checkout/CheckoutTransferDetails.vue'
import CheckoutTravellerForm from '~/components/checkout/CheckoutTravellerForm.vue'
import CheckoutTripCustomization from '~/components/checkout/CheckoutTripCustomization.vue'
import CheckoutProtection from '~/components/checkout/CheckoutProtection.vue'
import CheckoutSummary from '~/components/checkout/CheckoutSummary.vue'
import CheckoutPayment from '~/components/checkout/CheckoutPayment.vue'
import CurrencySelectorModal from '~/components/checkout/CurrencySelectorModal.vue'
import CurrencyConversionLoader from '~/components/checkout/CurrencyConversionLoader.vue'
import ManualPaymentDetailsModal from '~/components/checkout/ManualPaymentDetailsModal.vue'
import CheckoutSidebar from '~/components/checkout/CheckoutSidebar.vue'
import SeatSelection from '~/components/checkout/SeatSelection.vue'
import CheckoutStayDetails from '~/components/checkout/CheckoutStayDetails.vue'
import CheckoutPackageDetails from '~/components/checkout/CheckoutPackageDetails.vue'
import BookingExpiredModal from '~/components/checkout/BookingExpiredModal.vue'
import { flightsApi } from '~/api_factory/modules/flights'
import { transfersApi } from '~/api_factory/modules/transfers'
import { bookingsApi } from '~/api_factory/modules/bookings'
import { useTracking } from '~/composables/core/useTracking'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useUser } from '~/composables/modules/auth/user'
import { useCustomToast } from '~/composables/core/useCustomToast'
import { useSettings } from '~/composables/useSettings'

const { token, isLoggedIn, openAuthModal } = useAuth()
const { showToast } = useCustomToast()
const { currentCurrency, setCurrency, agencyFeeLabel, nonRefundableDisclaimer } = useSettings()

definePageMeta({
  layout: 'checkout'
})
const { trackAction } = useTracking()
const route = useRoute()
const router = useRouter()

// State
const currentStep = ref(0)
const showBrandedLoader = ref(true)
const isBookingExpired = ref(false)
const bookingErrorTitle = ref('Booking expired')
const bookingErrorMsg = ref('This booking has expired. Please start a new search to continue.')
const loaderStatus = ref('Confirming best fare with airline...')
const paymentProcessing = ref(false)
const bookingRulesAccepted = ref(false)
const rulesValidationTriggered = ref(false)
const showDetailedRulesModal = ref(false)
const selectedAddOns = ref<{ id: string; name: string; price: number }[]>([])
const selectedSeats = ref<any[]>([])
const seatPrice = ref(0)



// Afterpay Integration State
const isAuthorizingAfterpay = ref(false)
const afterpayOrderId = ref('')
const afterpayPnr = ref('')
const userCountryCode = ref('US')

const loadAfterpaySdk = (token) => {
  return new Promise((resolve, reject) => {
    if ((window as any).AfterPay) {
      initAfterpay(token)
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://portal.sandbox.afterpay.com/afterpay.js'
    script.async = true
    script.onload = () => {
      initAfterpay(token)
      resolve(true)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initAfterpay = (token) => {
  const AfterPay = (window as any).AfterPay
  if (!AfterPay) {
    showToast({ title: 'Error', message: 'Afterpay SDK not found', toastType: 'error' })
    return
  }
  
  // Dynamically set country code based on browser locale
  const locale = navigator.language
  if (locale && locale.includes('-')) {
    userCountryCode.value = locale.split('-')[1].toUpperCase()
  }

  AfterPay.initialize({ countryCode: userCountryCode.value })
  
  AfterPay.onComplete = async (event) => {
    if (event.data.status === "SUCCESS") {
      isAuthorizingAfterpay.value = true
      try {
        await paymentsApi.authorizeBnpl({
          bookingId: afterpayOrderId.value,
          provider: 'afterpay',
          checkoutToken: token,
        })
        router.push(`/confirmation?pnr=${afterpayPnr.value}&status=success`)
      } catch (err) {
        showToast({ title: 'Payment Failed', message: 'Afterpay authorization failed on backend', toastType: 'error' })
        isAuthorizingAfterpay.value = false
      }
    } else {
      isAuthorizingAfterpay.value = false
      showToast({ title: 'Payment Cancelled', message: 'Afterpay checkout was cancelled', toastType: 'error' })
    }
  }

  AfterPay.open()
  AfterPay.transfer({ token: token })
}

// Cash App Integration State
const showCashAppWidget = ref(false)
const isAuthorizingCashApp = ref(false)
const cashAppOrderId = ref('')
const cashAppPnr = ref('')
const cashAppAmount = ref(0)
const cashAppCurrency = ref('USD')
const cashAppClientId = 'client_id_placeholder'

const closeCashAppWidget = () => {
  showCashAppWidget.value = false
}

const loadCashAppSdk = () => {
  return new Promise((resolve, reject) => {
    if ((window as any).CashApp) {
      initCashApp()
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://sandbox.paykit.cash.app/paykit.js'
    script.async = true
    script.onload = () => {
      initCashApp()
      resolve(true)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initCashApp = async () => {
  try {
    const PayKit = (window as any).CashApp.PayKit
    const paykit = await PayKit(cashAppClientId, { environment: 'sandbox' })
    const elements = paykit.elements({ button: { theme: 'dark', shape: 'semicircle' } })
    await elements.mount('#cash-app-pay')
    
    // Create customer request
    paykit.customerRequest({
      actions: {
        payment: {
          amount: Math.round(cashAppAmount.value * 100),
          currency: cashAppCurrency.value,
          scope_id: 'merchant_id_placeholder' 
        }
      },
      redirect_url: window.location.href
    }).addEventListener('DELEGATE_REQUEST_APPROVED', async (event) => {
      const grantId = event.detail.grant.id
      isAuthorizingCashApp.value = true
      try {
        await paymentsApi.processCashAppPayment({
          bookingId: cashAppOrderId.value,
          grantId: grantId
        })
        router.push(`/confirmation?pnr=${cashAppPnr.value}&status=success`)
      } catch (err) {
        showToast({ title: 'Payment Failed', message: 'Cash App authorization failed on backend', toastType: 'error' })
        isAuthorizingCashApp.value = false
      }
    }).addEventListener('DELEGATE_REQUEST_DECLINED', () => {
      showToast({ title: 'Payment Declined', message: 'Cash App declined the payment', toastType: 'error' })
    })
  } catch(e) {
    console.error('PayKit Initialization Error', e)
  }
}

// Klarna Integration State
const showKlarnaWidget = ref(false)
const isAuthorizingKlarna = ref(false)
const klarnaClientToken = ref('')
const klarnaOrderId = ref('')
const klarnaPnr = ref('')

const closeKlarnaWidget = () => {
  showKlarnaWidget.value = false
}

const loadKlarnaSdk = (client_token: string) => {
  return new Promise((resolve, reject) => {
    if ((window as any).Klarna) {
      initKlarna(client_token)
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js'
    script.async = true
    script.onload = () => {
      initKlarna(client_token)
      resolve(true)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initKlarna = (client_token: string) => {
  const Klarna = (window as any).Klarna
  Klarna.Payments.init({ client_token })
  Klarna.Payments.load({ container: '#klarna-payments-container', payment_method_category: 'pay_over_time' }, (res: any) => {
    console.log('Klarna widget loaded', res)
  })
}

const authorizeKlarnaPayment = () => {
  isAuthorizingKlarna.value = true
  const Klarna = (window as any).Klarna
  if (!Klarna) {
    showToast({ title: 'Error', message: 'Klarna SDK not found', toastType: 'error' })
    isAuthorizingKlarna.value = false
    return
  }

  Klarna.Payments.authorize({ payment_method_category: 'pay_over_time' }, async (res: any) => {
    if (res.approved && res.authorization_token) {
      try {
         await paymentsApi.authorizeBnpl({
           bookingId: klarnaOrderId.value,
           provider: 'klarna',
           checkoutToken: res.authorization_token
         })
         router.push(`/confirmation?pnr=${klarnaPnr.value}&status=success`)
      } catch (err) {
         showToast({ title: 'Payment Failed', message: 'Klarna authorization failed on backend', toastType: 'error' })
         isAuthorizingKlarna.value = false
      }
    } else {
      isAuthorizingKlarna.value = false
      showToast({ title: 'Payment Not Approved', message: res.error?.message || 'Klarna declined the payment', toastType: 'error' })
    }
  })
}

const { loading: pricingLoading, pricingDetails, priceFlightOffer } = useFlightCheckout()
const selectedFlight = ref<any>(null)
const priceDetailed = ref<any>(null)
const bundledStay = ref<any>(null)

const travellerData = ref({
  travelers: [{
    title: 'Mr',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    nationality: 'Nigeria',
    passportNumber: '',
    passportExpiry: '',
  }],
  contact: {
    email: '',
    phone: '',
    phoneCountryCode: '+234',
  }
})

// Persistence Key
const PERSISTENCE_KEY = computed(() => `flybeth_checkout_${bookingDetails.value.id}`)

const saveCheckoutState = () => {
    const state = {
        currentStep: currentStep.value,
        travellerData: travellerData.value,
        selectedSeats: selectedSeats.value,
        seatPrice: seatPrice.value,
        selectedAddOns: selectedAddOns.value
    }
    localStorage.setItem(PERSISTENCE_KEY.value, JSON.stringify(state))
}

const loadCheckoutState = () => {
    const saved = localStorage.getItem(PERSISTENCE_KEY.value)
    if (saved) {
        try {
            const state = JSON.parse(saved)
            currentStep.value = Math.min(state.currentStep || 0, summaryStepIndex.value)
            travellerData.value = { ...travellerData.value, ...state.travellerData }
            selectedSeats.value = state.selectedSeats || []
            seatPrice.value = state.seatPrice || 0
            selectedAddOns.value = state.selectedAddOns || []
        } catch (e) {
            console.warn('Failed to load checkout state', e)
        }
    }
}

const clearCheckoutState = () => {
    localStorage.removeItem(PERSISTENCE_KEY.value)
    // Clear the parked hotel from the "add a flight to my hotel" bundle so a
    // later, unrelated flight booking cannot silently re-attach it.
    try {
        sessionStorage.removeItem('pendingStayBooking')
        sessionStorage.removeItem('flybeth_checkout_payload')
    } catch {}
}

/**
 * "Add a flight to my hotel" bundle.
 *
 * `SecuredHotelModal` parks the chosen room in `pendingStayBooking`, then sends
 * the traveller to the flight search. When they reach checkout with a flight we
 * merge that stay back in so both products are booked and charged together.
 */
const loadBundledStay = () => {
    if (!import.meta.client) return
    if (bookingDetails.value.type !== 'flight') return

    try {
        const raw = sessionStorage.getItem('pendingStayBooking')
        if (!raw) return
        const stay = JSON.parse(raw)
        if (!stay || (!stay.roomId && !stay.id)) return

        bundledStay.value = {
            ...stay,
            // `price` must be the customer-facing total so the summary matches
            // the amount the backend will charge for the stay.
            price: Number(stay.priceWithCommission ?? stay.price ?? 0),
            provider: stay.provider || 'flybeth',
        }
    } catch (e) {
        console.warn('Could not restore the bundled hotel', e)
    }
}

// Prefill from user profile if logged in and empty
const prefillFromUser = () => {
    const u = useUser().user.value
    if (u && travellerData.value.travelers.length === 1 && !travellerData.value.travelers[0].firstName) {
        travellerData.value.travelers[0].firstName = u.firstName || ''
        travellerData.value.travelers[0].lastName = u.lastName || ''
        travellerData.value.contact.email = u.email || ''
        travellerData.value.contact.phone = u.phone || ''
    }
}

// Booking details from secure session storage instead of URL
const checkoutPayload = ref<any>({})
onMounted(() => {
  if (import.meta.client) {
    const payloadStr = sessionStorage.getItem('flybeth_checkout_payload')
    if (payloadStr) {
      try {
        checkoutPayload.value = JSON.parse(payloadStr)
      } catch (e) {
        console.error('Failed to parse checkout payload', e)
      }
    }
  }
})

const bookingDetails = computed(() => {
  const p = checkoutPayload.value || {}
  return {
    type: p.type as string,
    id: p.id as string,
    roomId: p.roomId as string,
    name: p.hotelName || p.name || 'Selected trip',
    provider: p.provider as string,
    price: p.price ? Number(p.price) : 0,
    priceWithCommission: p.priceWithCommission
      ? Number(p.priceWithCommission)
      : (p.price ? Number(p.price) : 0),
    currency: p.currency || 'USD',
    quoteId: p.quoteId as string,
    checkIn: p.checkIn as string,
    checkOut: p.checkOut as string,
    adults: p.adults ? Number(p.adults) : 2,
    children: p.children ? Number(p.children) : 0,
    rooms: p.rooms ? Number(p.rooms) : 1,
    returnId: p.returnId as string,
    returnName: p.returnName as string,
    returnPrice: p.returnPrice ? Number(p.returnPrice) : 0,
    returnProvider: (p.returnProvider || p.provider) as string,
    returnPriceWithCommission: p.returnPriceWithCommission
      ? Number(p.returnPriceWithCommission)
      : (p.returnPrice ? Number(p.returnPrice) : 0),
    // Car rentals
    carId: (p.carId || p.id) as string,
    rateKey: p.rateKey as string,
    vendor: p.vendor as string,
    pickUpDate: p.pickUpDate as string,
    dropOffDate: p.dropOffDate as string,
    pickUpLocation: p.pickUpLocation as string,
    dropOffLocation: p.dropOffLocation as string,
    // Activities / experiences
    experienceId: (p.experienceId || p.id) as string,
    date: p.date as string,
    dateTo: p.dateTo as string,
    duration: p.duration as string,
  }
})

const stepsList = computed(() => {
  switch (bookingDetails.value.type) {
    case 'flight':
      return ['Details', 'Customise', 'Protect', 'Summary']
    case 'stay':
      return ['Guest Details', 'Review & Pay']
    case 'activity':
      return ['Guest Details', 'Review & Pay']
    case 'transfer':
      return ['Passenger Details', 'Review & Pay']
    case 'car':
      return ['Driver Details', 'Review & Pay']
    case 'package':
      if (priceDetailed.value?.flightDetails) {
        return ['Traveller Details', 'Customise', 'Review & Pay']
      }
      return ['Traveller Details', 'Review & Pay']
    case 'cruise':
      return ['Passenger Details', 'Review & Pay']
    default:
      return ['Details', 'Review & Pay']
  }
})

const summaryStepIndex = computed(() => Math.max(1, stepsList.value.length - 1))

const tripTypeIcon = computed(() => {
  switch (bookingDetails.value.type) {
    case 'stay': return Building
    case 'activity': return Compass
    case 'car': return Car
    case 'transfer': return CarTaxiFront
    case 'cruise': return Ship
    default: return Plane
  }
})

const baseFareLabel = computed(() => {
  switch (bookingDetails.value.type) {
    case 'stay': return 'Room Rate'
    case 'activity': return 'Experience / Tour Rate'
    case 'car': return 'Car Rental Fare'
    case 'transfer': return 'Transfer Fare'
    case 'package': return 'Package Base Fare'
    case 'cruise': return 'Cruise Fare'
    default: return 'Flight Fare'
  }
})

const departureDateBadgeLabel = computed(() => {
  if (bookingDetails.value.type === 'stay') return 'Check-in'
  if (bookingDetails.value.type === 'car') return 'Pick-up'
  if (bookingDetails.value.type === 'activity') return 'Activity Date'
  if (bookingDetails.value.type === 'transfer') return 'Pickup Date'
  return 'Depart'
})

const returnDateBadgeLabel = computed(() => {
  if (bookingDetails.value.type === 'stay') return 'Check-out'
  if (bookingDetails.value.type === 'car') return 'Drop-off'
  if (bookingDetails.value.type === 'transfer') return 'Return Transfer'
  return 'Return'
})

const handleStep0Continue = () => {
  if (bookingDetails.value.type === 'flight') {
    goToStep(1)
  } else if (bookingDetails.value.type === 'package' && priceDetailed.value?.flightDetails) {
    goToStep(1)
  } else {
    goToStep(summaryStepIndex.value)
  }
}

/**
 * Minimum number of travellers for the vertical being booked. Stays, transfers,
 * cars and activities do not ask for a full passenger manifest, so the
 * traveller form is pre-seeded with the party size the user already chose.
 */
const requiredTravelers = computed(() => {
  const t = bookingDetails.value
  if (t.type === 'stay') return Math.max(1, (t.adults || 1) + (t.children || 0))
  if (t.type === 'transfer') return Math.max(1, t.adults || 1)
  return 1
})

/** Makes sure the traveller form has a row for every guest in the party. */
const ensureTravelers = () => {
  const needed = requiredTravelers.value
  const seed = travellerData.value.travelers[0]
  while (travellerData.value.travelers.length < needed) {
    travellerData.value.travelers.push({
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      nationality: seed?.nationality || 'Nigeria',
      passportNumber: '',
      passportExpiry: '',
    } as any)
  }
}

const currencySymbol = computed(() => {
  return currentCurrency.value.symbol || '$'
})

const addOnsTotal = computed(() => selectedAddOns.value.reduce((sum, a) => sum + (a.price * (currentCurrency.value.rate || 1)), 0))

// Price display
const displayPrices = computed(() => {
  let base = 0
  let total = 0
  let tax = 0
  let serviceCharge = 0
  const rate = currentCurrency.value.rate || 1

  if (priceDetailed.value) {
    const raw = priceDetailed.value.rawOffer || priceDetailed.value
    const gross = Number(
      priceDetailed.value.priceWithCommission ??
        priceDetailed.value.total_amount ??
        priceDetailed.value.price ??
        0,
    )
    
    // Check if authentic supplier base and tax amounts exist
    const rawBase = Number(priceDetailed.value.baseAmount ?? raw.base_amount ?? priceDetailed.value.price ?? 0)
    const rawTax = Number(priceDetailed.value.taxAmount ?? raw.tax_amount ?? priceDetailed.value.tax ?? 0)

    if (rawBase > 0) {
      base = rawBase
      tax = rawTax
      // Agency service fee is the explicit difference between customer gross and supplier net
      serviceCharge = Math.max(0, Math.round((gross - (rawBase + rawTax)) * 100) / 100)
      total = gross
    } else {
      base = gross
      total = gross
      tax = 0
      serviceCharge = 0
    }
  }

  if (bundledStay.value) {
    const stayPrice = bundledStay.value.price || 0
    base += stayPrice
    total += stayPrice
  }

  // Calculate final aggregated total once
  let finalTotal = total + (seatPrice.value) + (selectedAddOns.value.reduce((sum, a) => sum + a.price, 0))

  return {
    base: base * rate,
    tax: tax * rate,
    serviceCharge: serviceCharge * rate,
    fees: (seatPrice.value + selectedAddOns.value.reduce((sum, a) => sum + a.price, 0)) * rate,
    total: finalTotal * rate
  }
})

// Unified Trip Dates computed across all steps
const tripDates = computed(() => {
  if (bookingDetails.value.type === 'flight') {
    const flight = priceDetailed.value || selectedFlight.value
    if (!flight) return { hasDates: false, departure: '', return: '', fullRange: '', isRoundTrip: false, type: 'flight' }

    let departureIso = flight.departureTime || flight.departureDate
    let returnIso = flight.returnTime || flight.returnDate

    if (flight.slices && flight.slices.length > 0) {
      const firstSlice = flight.slices[0]
      const lastSlice = flight.slices.length > 1 ? flight.slices[1] : null
      departureIso = departureIso || firstSlice?.segments?.[0]?.departing_at
      if (lastSlice) {
        returnIso = returnIso || lastSlice?.segments?.[0]?.departing_at
      }
    }

    if (flight.itineraries && flight.itineraries.length > 0) {
      departureIso = departureIso || flight.itineraries[0]?.departureTime || flight.itineraries[0]?.segments?.[0]?.departureTime
      if (flight.itineraries.length > 1) {
        returnIso = returnIso || flight.itineraries[1]?.departureTime || flight.itineraries[1]?.segments?.[0]?.departureTime
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

    const formatTime = (iso?: string) => {
      if (!iso) return ''
      const d = new Date(iso)
      if (isNaN(d.getTime())) return ''
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    const depFormatted = formatFull(departureIso)
    const depTime = formatTime(departureIso)
    const retFormatted = formatFull(returnIso)
    const retTime = formatTime(returnIso)

    const isRound = Boolean(returnIso || flight.isRoundTrip || flight.tripType === 'Round Trip' || flight.slices?.length > 1 || flight.itineraries?.length > 1)

    return {
      hasDates: Boolean(depFormatted),
      departure: depFormatted ? `${depFormatted}${depTime ? ` • ${depTime}` : ''}` : '',
      departureDateOnly: depFormatted,
      departureTimeOnly: depTime,
      return: retFormatted ? `${retFormatted}${retTime ? ` • ${retTime}` : ''}` : '',
      returnDateOnly: retFormatted,
      returnTimeOnly: retTime,
      fullRange: retFormatted ? `${depFormatted} ➔ ${retFormatted}` : depFormatted,
      isRoundTrip: isRound,
      type: 'flight'
    }
  } else if (bookingDetails.value.type === 'stay') {
    const checkIn = priceDetailed.value?.checkInDate || bookingDetails.value.checkIn
    const checkOut = priceDetailed.value?.checkOutDate || bookingDetails.value.checkOut
    const formatFull = (iso?: string) => {
      if (!iso) return ''
      const d = new Date(iso)
      if (isNaN(d.getTime())) return String(iso)
      return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    }
    const inFmt = formatFull(checkIn)
    const outFmt = formatFull(checkOut)
    return {
      hasDates: Boolean(inFmt),
      departure: inFmt,
      departureDateOnly: inFmt,
      departureTimeOnly: '',
      return: outFmt,
      returnDateOnly: outFmt,
      returnTimeOnly: '',
      fullRange: outFmt ? `${inFmt} – ${outFmt}` : inFmt,
      isRoundTrip: Boolean(outFmt),
      type: 'stay'
    }
  }

  const d = bookingDetails.value.pickUpDate || bookingDetails.value.date || bookingDetails.value.departureDate
  const r = bookingDetails.value.dropOffDate || bookingDetails.value.returnDate
  return {
    hasDates: Boolean(d),
    departure: d || '',
    departureDateOnly: d || '',
    departureTimeOnly: '',
    return: r || '',
    returnDateOnly: r || '',
    returnTimeOnly: '',
    fullRange: r ? `${d} – ${r}` : (d || ''),
    isRoundTrip: Boolean(r),
    type: bookingDetails.value.type
  }
})

// Currency & Manual Payment State
const isCurrencyModalVisible = ref(false)
const isConversionLoading = ref(false)
const isManualDetailsVisible = ref(false)
const bankAccounts = ref([])

/**
 * Confirms the manual bank-transfer instructions.
 *
 * The booking and its payment record already exist by this point; the transfer
 * stays in `awaiting_transfer` until finance reconciles it, so we simply close
 * the modal and move the traveller to the confirmation page.
 */
const handleManualConfirm = () => {
  isManualDetailsVisible.value = false
  const pnr = sessionStorage.getItem('walletBookingPnr')
  const bookingId = sessionStorage.getItem('walletBookingId')
  if (pnr) {
    router.push(
      `/confirmation?pnr=${pnr}${bookingId ? `&orderId=${bookingId}` : ''}&status=pending_payment`,
    )
  }
}
// Normalization Helpers
const parseDuration = (durationStr: string) => {
  if (!durationStr) return 0
  if (typeof durationStr === 'number') return durationStr
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  return hours * 60 + minutes
}

const normalizeFlightData = (rawFlight: any) => {
  if (!rawFlight) return null
  if (rawFlight.origin && rawFlight.destination && typeof rawFlight.price === 'number' && rawFlight.segments) {
    return rawFlight
  }

  if (rawFlight.slices && rawFlight.slices.length > 0) {
    const basePrice = Number(rawFlight.base_amount || 0)
    const totalPrice = Number(rawFlight.total_amount || 0)
    const taxPrice = Number(rawFlight.tax_amount || 0)
    
    const itineraries = rawFlight.slices.map((slice: any) => {
      const segments = slice.segments || []
      const normalizedSegments = segments.map((s: any) => ({
        flightNumber: s.marketing_carrier_flight_number || s.operating_carrier_flight_number || 'N/A',
        airline: s.marketing_carrier?.name || s.operating_carrier?.name || 'Airline',
        airlineLogo: s.marketing_carrier?.logo_symbol_url || s.operating_carrier?.logo_symbol_url || `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${s.marketing_carrier?.iata_code || s.operating_carrier?.iata_code}.svg`,
        origin: s.origin?.iata_code || s.origin?.iata_city_code || 'N/A',
        originName: s.origin?.name || s.origin?.city_name || 'N/A',
        destination: s.destination?.iata_code || s.destination?.iata_city_code || 'N/A',
        destinationName: s.destination?.name || s.destination?.city_name || 'N/A',
        departureTime: s.departing_at,
        arrivalTime: s.arriving_at,
        duration: parseDuration(s.duration),
        originTerminal: s.origin_terminal,
        destinationTerminal: s.destination_terminal,
        aircraft: s.aircraft?.name || s.aircraft?.code || 'Aircraft',
      }))
      const totalDuration = normalizedSegments.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
      return {
        origin: normalizedSegments[0]?.origin || 'N/A',
        destination: normalizedSegments[normalizedSegments.length - 1]?.destination || 'N/A',
        departureTime: normalizedSegments[0]?.departureTime,
        arrivalTime: normalizedSegments[normalizedSegments.length - 1]?.arrivalTime,
        duration: totalDuration,
        stops: segments.length - 1,
        segments: normalizedSegments,
        cabinClass: (slice.fare_brand_name || segments[0]?.passengers?.[0]?.cabin_class || 'Economy').toLowerCase(),
      }
    })

    const firstSegment = rawFlight.slices[0]?.segments?.[0]
    const lastSegment = rawFlight.slices[rawFlight.slices.length - 1]?.segments?.slice(-1)[0]
    
    let tripType = 'One Way'
    if (rawFlight.slices.length > 2) {
      tripType = 'Multi-city'
    } else if (rawFlight.slices.length === 2) {
      tripType = 'Round Trip'
    }

    const canChange = rawFlight.conditions?.change_before_departure?.allowed || false
    const canRefund = rawFlight.conditions?.refund_before_departure?.allowed || false

    return {
      ...rawFlight,
      origin: firstSegment?.origin?.iata_code || firstSegment?.origin?.iata_city_code || 'N/A',
      originName: firstSegment?.origin?.city_name || 'N/A',
      destination: lastSegment?.destination?.iata_code || lastSegment?.destination?.iata_city_code || 'N/A',
      destinationName: lastSegment?.destination?.city_name || 'N/A',
      departureTime: firstSegment?.departing_at,
      arrivalTime: lastSegment?.arriving_at,
      duration: itineraries.reduce((sum: number, it: any) => sum + it.duration, 0),
      price: basePrice,
      tax: taxPrice,
      priceWithCommission: totalPrice,
      currency: rawFlight.total_currency || 'USD',
      itineraries,
      segments: itineraries[0].segments, // Keep for backward compatibility with simple views
      cabinClass: itineraries[0].cabinClass,
      airline: rawFlight.owner?.name || firstSegment?.marketing_carrier?.name || 'Airline',
      airlineLogo: rawFlight.owner?.logo_symbol_url || firstSegment?.marketing_carrier?.logo_symbol_url,
      totalEmissionsKg: rawFlight.total_emissions_kg,
      conditions: { refundable: canRefund, changeable: canChange },
      isRoundTrip: rawFlight.slices ? rawFlight.slices.length > 1 : false,
      tripType,
      rawOffer: rawFlight,
    }
  }

  if (rawFlight.itineraries && rawFlight.itineraries.length > 0) {
    const basePrice = Number(rawFlight.price?.base || rawFlight.price?.total || 0)
    const totalPrice = Number(rawFlight.price?.total || rawFlight.price?.grandTotal || 0)
    const cabin = (rawFlight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY').toLowerCase()

    const itineraries = rawFlight.itineraries.map((itinerary: any) => {
      const segments = itinerary.segments || []
      const normalizedSegments = segments.map((s: any) => ({
        flightNumber: `${s.carrierCode}${s.number}`,
        airline: s.carrierCode,
        airlineLogo: `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${s.carrierCode}.svg`,
        origin: s.departure?.iataCode,
        destination: s.arrival?.iataCode,
        departureTime: s.departure?.at,
        arrivalTime: s.arrival?.at,
        duration: parseDuration(s.duration),
        originTerminal: s.departure?.terminal,
        destinationTerminal: s.arrival?.terminal,
        aircraft: s.aircraft?.code,
      }))
      const totalDuration = normalizedSegments.reduce((sum: number, s: any) => sum + s.duration, 0)
      return {
        origin: normalizedSegments[0]?.origin || 'N/A',
        destination: normalizedSegments[normalizedSegments.length - 1]?.destination || 'N/A',
        departureTime: normalizedSegments[0]?.departureTime,
        arrivalTime: normalizedSegments[normalizedSegments.length - 1]?.arrivalTime,
        duration: totalDuration,
        stops: segments.length - 1,
        segments: normalizedSegments,
        cabinClass: cabin,
      }
    })

    const firstSegment = rawFlight.itineraries[0]?.segments?.[0]
    const lastSegment = rawFlight.itineraries[rawFlight.itineraries.length - 1]?.segments?.slice(-1)[0]
    
    let tripType = 'One Way'
    if (rawFlight.itineraries.length > 2) {
      tripType = 'Multi-city'
    } else if (rawFlight.itineraries.length === 2) {
      tripType = 'Round Trip'
    }

    return {
      ...rawFlight,
      origin: firstSegment?.departure?.iataCode || 'N/A',
      destination: lastSegment?.arrival?.iataCode || 'N/A',
      departureTime: firstSegment?.departure?.at,
      arrivalTime: lastSegment?.arrival?.at,
      duration: itineraries.reduce((sum: number, it: any) => sum + it.duration, 0),
      price: basePrice,
      priceWithCommission: totalPrice,
      currency: rawFlight.price?.currency || 'USD',
      itineraries,
      segments: itineraries[0].segments, // Keep for backward compatibility
      cabinClass: cabin,
      airline: rawFlight.validatingAirlineCodes?.[0] || firstSegment?.carrierCode || 'Airline',
      airlineLogo: `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${rawFlight.validatingAirlineCodes?.[0] || firstSegment?.carrierCode}.svg`,
      tripType,
      isRoundTrip: rawFlight.itineraries.length > 1,
      rawOffer: rawFlight,
    }
  }
  return rawFlight
}

const goToStep = (step: number) => {
  currentStep.value = Math.min(Math.max(0, step), summaryStepIndex.value)
  saveCheckoutState()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const stepName = stepsList.value[step] || `step_${step}`
  trackAction(`booking_step_${stepName.toLowerCase().replace(/\s+/g, '_')}`, { type: bookingDetails.value.type, item: bookingDetails.value.name, price: displayPrices.value.total })
}

const handleGoBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    saveCheckoutState()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.back()
  }
}

const handleTravellerContinue = async () => {
  // Guest booking enabled: we don't block if not logged in.
  // We just proceed to the next step.
  
  // Duffel Identity is ONLY required if using the official @duffel/components Card Payment flow 
  // which requires a component client token. Since we are using our custom checkout UI and paying 
  // directly via the backend using Duffel Balance, we can entirely skip this 500-error prone step!
  goToStep(2)
}

const handleEmailBlur = async () => {
  if (!travellerData.value.contact.email) return
  try {
    await bookingsApi.emailCapture({
      email: travellerData.value.contact.email,
      firstName: travellerData.value.travelers[0]?.firstName || 'Guest',
      destination: bookingDetails.value.name,
      checkoutUrl: window.location.href,
      tenantId: bookingDetails.value.provider === 'duffel' ? undefined : undefined
    })
  } catch (err) {
    console.warn('Email capture failed (silent):', err)
  }
}

const paymentRef = ref<any>(null)

const handleHold = () => {
  if (!bookingRulesAccepted.value) {
    rulesValidationTriggered.value = true
    showToast({
      title: 'Mandatory Agreement Required',
      message: 'You must review and accept the Booking Rules & Non-Refundable Policy before proceeding.',
      toastType: 'error'
    })
    const el = document.getElementById('booking-rules-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  if (paymentRef.value) {
    paymentRef.value.handleHold()
  } else {
    handlePayment({ provider: 'manual', paymentModel: 'on_hold' })
  }
}

const handlePayNow = () => {
  if (!bookingRulesAccepted.value) {
    rulesValidationTriggered.value = true
    showToast({
      title: 'Mandatory Agreement Required',
      message: 'You must review and accept the Booking Rules & Non-Refundable Policy before proceeding.',
      toastType: 'error'
    })
    const el = document.getElementById('booking-rules-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  if (paymentRef.value) {
    paymentRef.value.handlePay()
  }
}

/**
 * Builds the POST /bookings payload for every product type.
 *
 * Both the wallet (Apple/Google Pay) handler and the standard payment handler
 * must produce an identical payload, so the logic lives here exactly once.
 */
const buildBookingPayload = (paymentInfo: any) => {
  const details = bookingDetails.value
  const travelers = travellerData.value.travelers || []
  const lead = travelers[0] || {}
  const contact = travellerData.value.contact || {}

  const payload: any = {
    contactDetails: {
      email: contact.email,
      phone: contact.phone,
      name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Guest',
      state: lead.nationality,
    },
    currency: currentCurrency.value.code,
    paymentModel: paymentInfo?.paymentModel || 'pay_now',
    paymentProvider: paymentInfo?.provider,
    paymentMetadata: paymentInfo,
    passengerDetails: travelers.map((t: any) => ({
      ...t,
      email: contact.email || '',
      phone: contact.phone || '',
      gender: (t.gender || 'male').toLowerCase(),
      title: (t.title || 'mr').toLowerCase(),
      type: t.type || 'adult',
    })),
    pricing: {
      baseFare: bundledStay.value
        ? Number(priceDetailed.value?.price || 0)
        : displayPrices.value.base,
      taxes: displayPrices.value.tax,
      agentServiceFee: displayPrices.value.serviceCharge,
      fees: displayPrices.value.fees,
      totalAmount: displayPrices.value.total,
      feeLabel: agencyFeeLabel.value || 'Agency Booking & Service Fee',
    },
    hasInsurance: selectedAddOns.value.some((a) => a.id === 'insurance'),
    hasVipSupport: selectedAddOns.value.some((a) => a.id === 'vip-support'),
    extraBaggageCount: selectedAddOns.value.filter((a) => a.id.startsWith('bag-')).length,
    premiumSeatCount: selectedSeats.value.length,
    rulesAccepted: true,
    rulesAcceptedAt: new Date().toISOString(),
  }

  if (details.type === 'flight') {
    payload.isRoundTrip = priceDetailed.value?.isRoundTrip || false
    payload.flights = [
      {
        flightId: details.id,
        class: (priceDetailed.value?.cabinClass || 'economy').toLowerCase(),
        offerId:
          priceDetailed.value?.offerId ||
          details.quoteId ||
          priceDetailed.value?.id ||
          details.id,
        provider: details.provider,
        passengerIds: [],
        metadata: {
          origin: priceDetailed.value?.origin || priceDetailed.value?.originName,
          destination: priceDetailed.value?.destination || priceDetailed.value?.destinationName,
          airline: priceDetailed.value?.airline,
          departureTime: priceDetailed.value?.departureTime,
          slices: priceDetailed.value?.slices || priceDetailed.value?.segments || [],
        },
      },
    ]

    // Bundle: book the parked hotel alongside the flight.
    const stay = bundledStay.value
    if (stay && (stay.roomId || stay.id)) {
      payload.stays = [
        {
          hotelId: stay.id || stay.hotelId,
          roomId: stay.roomId || stay.id,
          provider: stay.provider || 'flybeth',
          quoteId: stay.quoteId,
          checkIn: stay.checkIn,
          checkOut: stay.checkOut,
          occupancy: {
            rooms: Number(stay.rooms) || 1,
            adults: Number(stay.adults) || 1,
            children: Number(stay.children) || 0,
          },
        },
      ]
    }
  } else if (details.type === 'stay') {
    payload.stays = [
      {
        hotelId: details.id,
        roomId: details.roomId,
        provider: details.provider,
        quoteId: details.quoteId,
        checkIn: details.checkIn,
        checkOut: details.checkOut,
        occupancy: {
          rooms: details.rooms || 1,
          adults: details.adults || 2,
          children: details.children || 0,
        },
      },
    ]
  } else if (details.type === 'transfer') {
    payload.transfers = [
      {
        offerId: details.id,
        provider: details.provider,
        name: details.name,
        // NET price — the backend adds the platform commission.
        price: details.price,
        priceWithCommission: details.priceWithCommission,
        currency: details.currency,
      },
    ]
    if (details.returnId) {
      payload.transfers.push({
        offerId: details.returnId,
        provider: details.returnProvider || details.provider,
        name: details.returnName,
        price: details.returnPrice,
        priceWithCommission: details.returnPriceWithCommission,
        currency: details.currency,
      })
    }
  } else if (details.type === 'car') {
    payload.cars = [
      {
        carId: details.carId,
        pickUpDate: details.pickUpDate,
        dropOffDate: details.dropOffDate,
        pickUpLocation: details.pickUpLocation,
        dropOffLocation: details.dropOffLocation,
      },
    ]
  } else if (details.type === 'activity') {
    payload.experiences = [
      {
        experienceId: details.experienceId,
        provider: details.provider,
        name: details.name,
        // NET price — the backend adds the platform commission.
        price: details.price,
        priceWithCommission: details.priceWithCommission,
        currency: details.currency,
        date: details.date,
      },
    ]
  } else if (details.type === 'package') {
    payload.packageId = details.id
    const pkgDetails = priceDetailed.value
    if (pkgDetails?.flightDetails) {
      payload.flights = [
        {
          flightId: pkgDetails.flightDetails.id,
          class: (pkgDetails.flightDetails.cabinClass || 'economy').toLowerCase(),
          offerId: pkgDetails.flightDetails.id,
          provider: 'duffel',
          passengerIds: [],
        },
      ]
    }
    if (pkgDetails?.stayDetails) {
      payload.stays = [
        {
          hotelId: pkgDetails.stayDetails.id || pkgDetails.stayDetails.hotelId,
          roomId: pkgDetails.stayDetails.roomId || pkgDetails.stayDetails.rateId,
          provider: pkgDetails.stayDetails.provider,
          quoteId: pkgDetails.stayDetails.quoteId,
          checkIn: pkgDetails.stayDetails.checkIn || details.checkIn,
          checkOut: pkgDetails.stayDetails.checkOut || details.checkOut,
          occupancy: {
            rooms: 1,
            adults: details.adults,
            children: details.children,
          },
        },
      ]
    }
  }

  return payload
}

/**
 * Confirms the reservation with third-party suppliers when the booking was not
 * fulfilled against our own inventory.
 */
const syncSupplierBooking = async () => {
  const details = bookingDetails.value
  if (details.type !== 'transfer') return

  const contact = travellerData.value.contact || {}
  const lead = (travellerData.value.travelers || [])[0] || {}
  const passengerDetails = {
    firstName: lead.firstName || 'Guest',
    lastName: lead.lastName || 'Traveller',
    email: contact.email || 'guest@flybeth.com',
    phone: contact.phone || '+10000000000',
    remarks: 'Booked via Flybeth',
  }

  const offers = [
    { id: details.id, provider: details.provider },
    ...(details.returnId
      ? [{ id: details.returnId, provider: details.returnProvider || details.provider }]
      : []),
  ].filter((o) => o.id && o.provider && o.provider !== 'flybeth-transfers')

  for (const offer of offers) {
    try {
      await transfersApi.book({
        offerId: offer.id,
        provider: offer.provider,
        passengerDetails,
      })
    } catch (e) {
      console.error('Failed to book transfer with provider', e)
      showToast({
        title: 'Warning',
        message: 'Transfer booking recorded but provider sync failed.',
        toastType: 'warning',
      })
    }
  }
}

const handleWalletAuthorize = async (paymentInfo: any) => {
  if (!bookingRulesAccepted.value) {
    rulesValidationTriggered.value = true
    showToast({
      title: 'Mandatory Agreement Required',
      message: 'You must review and accept the Booking Rules & Non-Refundable Policy before proceeding.',
      toastType: 'error'
    })
    const el = document.getElementById('booking-rules-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  if (paymentInfo.channel === 'applepay' || paymentInfo.channel === 'googlepay') {
    // 1. We create the booking silently
    paymentProcessing.value = true
    showBrandedLoader.value = true
    loaderStatus.value = 'Preparing secure wallet...'

    try {
      const payload = buildBookingPayload({
        provider: 'paypal',
        paymentModel: 'pay_now',
        channel: paymentInfo.channel,
      })

      const { data: rawData } = await bookingsApi.create(payload)
      const booking = rawData?.data || rawData;

      if (booking && booking.pnr) {
        // Save these for the capture step
        sessionStorage.setItem('walletBookingId', booking._id)
        sessionStorage.setItem('walletBookingPnr', booking.pnr)

        const initResponse = await paymentsApi.initialize({
          bookingId: booking._id,
          provider: 'paypal',
          callbackUrl: `${window.location.origin}/confirmation?pnr=${booking.pnr}&orderId=${booking._id}&status=success&provider=paypal`,
        });

        const responseData = initResponse.data?.data || initResponse.data;
        if (responseData && responseData.orderId) {
          // Resolve the orderId back to PayPal SDK
          paymentInfo.resolveOrder(responseData.orderId)
          showBrandedLoader.value = false;
        } else {
          throw new Error('No order ID returned from payment init')
        }
      }
    } catch (err: any) {
      if (paymentInfo.rejectOrder) {
        paymentInfo.rejectOrder(err)
      }
      const errMsg = err.response?.data?.message || err.message || "Failed to complete booking";
      if (errMsg.toLowerCase().includes('no longer available') || errMsg.toLowerCase().includes('booking failed')) {
        bookingErrorTitle.value = "Offer Unavailable";
        bookingErrorMsg.value = "The requested offer is no longer available. Prices and availability can change quickly.";
        isBookingExpired.value = true;
      } else {
        showToast({ title: "Booking Error", message: errMsg, toastType: "error" })
      }
    } finally {
      paymentProcessing.value = false
      showBrandedLoader.value = false
    }

  } else if (paymentInfo.channel.endsWith('_approve')) {
    // 2. Capture the authorized order
    paymentProcessing.value = true
    showBrandedLoader.value = true
    loaderStatus.value = 'Capturing payment...'

    try {
      const orderId = paymentInfo.data.orderID
      const bookingId = sessionStorage.getItem('walletBookingId')
      const pnr = sessionStorage.getItem('walletBookingPnr')

      if (!bookingId) throw new Error('Booking ID lost in session')

      await paymentsApi.verifyPayment({
        bookingId: bookingId,
        provider: 'paypal',
        checkoutToken: orderId
      })

      clearCheckoutState()
      router.push(`/confirmation?pnr=${pnr}&status=success`)

    } catch (err: any) {
      showToast({ title: "Capture Failed", message: err.message || "Failed to capture payment", toastType: "error" })
    } finally {
      paymentProcessing.value = false
      showBrandedLoader.value = false
    }
  }
}

const handlePayment = async (paymentInfo: any) => {
  if (!bookingRulesAccepted.value) {
    rulesValidationTriggered.value = true
    showToast({
      title: 'Mandatory Agreement Required',
      message: 'You must review and accept the Booking Rules & Non-Refundable Policy before proceeding.',
      toastType: 'error'
    })
    const el = document.getElementById('booking-rules-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  paymentProcessing.value = true
  showBrandedLoader.value = true
  loaderStatus.value = paymentInfo.paymentModel === 'on_hold' ? 'Securing reservation...' : 'Finalizing booking...'
  
  try {
    const payload = buildBookingPayload(paymentInfo)

    const { data: rawData } = await bookingsApi.create(payload)
    const booking = rawData?.data || rawData;

    // Third-party suppliers that are not fulfilled by our own inventory are
    // confirmed separately (platform inventory is fulfilled by POST /bookings).
    await syncSupplierBooking()

    if (booking && booking.pnr) {
      // Handle BNPL or any payment that requires redirection
      if (
        [
          "credpal",
          "affirm",
          "klarna",
          "paypal_four",
          "afterpay",
          "paypal",
          "paystack",
          "stripe",
          "cashapp"
        ].includes(paymentInfo.provider)
      ) {
        loaderStatus.value = "Redirecting to payment gateway...";
        try {
          const initResponse = await paymentsApi.initialize({
            bookingId: booking._id,
            provider: paymentInfo.provider,
            callbackUrl: `${window.location.origin}/confirmation?pnr=${booking.pnr}&orderId=${booking._id}&status=success&provider=${paymentInfo.provider}`,
          });
          
          const responseData = initResponse.data?.data || initResponse.data;
          
          if (responseData && responseData.url) {
            clearCheckoutState(); // Only clear state when initialization succeeds
            if (paymentInfo.provider === 'cashapp') {
              showBrandedLoader.value = false;
              cashAppOrderId.value = booking._id;
              cashAppPnr.value = booking.pnr;
              cashAppAmount.value = booking.pricing.totalAmount;
              cashAppCurrency.value = booking.pricing.currency || 'USD';
              showCashAppWidget.value = true;
              
              await loadCashAppSdk();
              return;
            } else if (responseData.url === 'afterpay_sdk' && responseData.reference) {
              showBrandedLoader.value = false;
              afterpayOrderId.value = booking._id;
              afterpayPnr.value = booking.pnr;
              await loadAfterpaySdk(responseData.reference);
              return;
            } else if (responseData.url === 'klarna_sdk' && responseData.reference) {
              // Handle Klarna SDK flow
              showBrandedLoader.value = false;
              klarnaClientToken.value = responseData.reference;
              klarnaOrderId.value = booking._id;
              klarnaPnr.value = booking.pnr;
              showKlarnaWidget.value = true;
              
              await loadKlarnaSdk(klarnaClientToken.value);
              return;
            } else {
              // Standard redirect flow
              window.location.href = responseData.url;
              return;
            }
          }
        } catch (initErr: any) {
          console.error("Payment initialization failed:", initErr);
          showToast({
            title: "Payment Error",
            message: initErr.response?.data?.message || "Failed to initialize payment gateway. Please try again.",
            toastType: "error",
          });
          // DO NOT redirect to confirmation page on payment init failure
          // User stays on checkout page with cart intact to try again
          return;
        }
      }

      // For payments that don't require redirection
      clearCheckoutState();
      const finalStatus = (booking.payment?.status === 'success' || booking.status === 'ticketed') ? 'success' : 'booked';
      router.push(`/confirmation?pnr=${booking.pnr}&status=${finalStatus}`);
    } else {
      throw new Error('Booking response was invalid')
    }
  } catch (err: any) {
    console.error('Payment/Booking error:', err)
    
    // Aggressive session recovery: automatically show auth modal if unauthorized
    if (err.response?.status === 401) {
      showToast({ 
        title: "Session Expired", 
        message: "Please sign in again to complete your booking.", 
        toastType: "info" 
      })
      openAuthModal()
      return
    }

    const errorMessage = err.response?.data?.message || err.message || "Failed to process booking";
    const lowerMsg = errorMessage.toLowerCase();
    
    // Trigger the existing BookingExpiredModal if the offer expired, was already booked, or is no longer available
    if (lowerMsg.includes('expired') || lowerMsg.includes('already been booked') || lowerMsg.includes('no longer available') || lowerMsg.includes('booking failed')) {
      bookingErrorTitle.value = lowerMsg.includes('no longer available') || lowerMsg.includes('booking failed') ? "Offer Unavailable" : "Booking Expired";
      bookingErrorMsg.value = lowerMsg.includes('no longer available') || lowerMsg.includes('booking failed')
        ? "The requested offer is no longer available. Prices and availability can change quickly."
        : "This booking has expired. Please start a new search to continue.";
      isBookingExpired.value = true;
      return;
    }

    showToast({ 
      title: "Booking Error", 
      message: errorMessage, 
      toastType: "error" 
    })
  } finally {
    paymentProcessing.value = false
    showBrandedLoader.value = false
  }
}

const handleCurrencySelect = (newCurrency: string) => {
  if (!newCurrency) return
  setCurrency(newCurrency)
  if (priceDetailed.value) {
    priceDetailed.value.currency = newCurrency
  }
}

onMounted(async () => {
  trackAction('booking_step_review', { type: bookingDetails.value.type, item: bookingDetails.value.name })
  if (bookingDetails.value.type === 'flight') {
    const saved = sessionStorage.getItem('selectedFlight')
    if (saved) {
      selectedFlight.value = JSON.parse(saved)
      try {
        const pricedData = await priceFlightOffer(selectedFlight.value, bookingDetails.value.provider)
        priceDetailed.value = { ...normalizeFlightData(pricedData?.flightOffers?.[0] || selectedFlight.value), provider: bookingDetails.value.provider }
      } catch (err: any) { 
        console.error('Pricing failed:', err)
        if (err.response?.status === 404) {
          isBookingExpired.value = true
        } else {
          showToast({ 
            title: "Pricing Error", 
            message: "We couldn't confirm the latest price. Please try again.", 
            toastType: "error" 
          })
        }
        priceDetailed.value = { ...selectedFlight.value, provider: bookingDetails.value.provider } 
      }
    }
  } else if (bookingDetails.value.type === 'stay') {
    // Populate priceDetailed from URL query parameters so the Stay Summary renders
    priceDetailed.value = {
      ...bookingDetails.value,
      hotelName: bookingDetails.value.name,
      checkInDate: bookingDetails.value.checkIn,
      checkOutDate: bookingDetails.value.checkOut,
      priceWithCommission: bookingDetails.value.price,
      price: bookingDetails.value.price
    }

    // Attempt to merge more detailed data if available in session storage (e.g. from bundle flow)
    const pendingStayStr = sessionStorage.getItem('pendingStayBooking')
    if (pendingStayStr) {
      try {
        const pendingStay = JSON.parse(pendingStayStr)
        if (pendingStay.id === bookingDetails.value.id) {
          priceDetailed.value = { ...priceDetailed.value, ...pendingStay }
          if (pendingStay.stay?.name) {
             priceDetailed.value.hotelName = pendingStay.stay.name
          }
        }
      } catch (e) {
        console.error('Failed to parse pendingStayBooking', e)
      }
    }
  } else if (bookingDetails.value.type === 'transfer') {
    const totalTransferNet = bookingDetails.value.price + (bookingDetails.value.returnPrice || 0)
    const totalTransferGross =
      bookingDetails.value.priceWithCommission +
      (bookingDetails.value.returnPriceWithCommission || 0)
    priceDetailed.value = {
      ...bookingDetails.value,
      name: bookingDetails.value.name + (bookingDetails.value.returnName ? ` + ${bookingDetails.value.returnName}` : ''),
      provider: bookingDetails.value.provider,
      price: totalTransferNet,
      priceWithCommission: totalTransferGross,
      currency: bookingDetails.value.currency
    }
  } else if (bookingDetails.value.type === 'package') {
    const saved = sessionStorage.getItem('selectedPackage')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        priceDetailed.value = {
          ...parsed,
          priceWithCommission: parsed.totalPrice || parsed.basePrice || 0,
          price: parsed.totalPrice || parsed.basePrice || 0,
          currency: 'USD'
        }
      } catch (e) {
        console.error('Failed to parse selectedPackage', e)
      }
    } else if (bookingDetails.value.price) {
      // Fall back to the stored payload so the summary still renders.
      priceDetailed.value = {
        ...bookingDetails.value,
        priceWithCommission: bookingDetails.value.price,
        price: bookingDetails.value.price,
      }
    }
  } else if (bookingDetails.value.type === 'activity') {
    const saved = sessionStorage.getItem('selectedActivity')
    let parsed: any = null
    if (saved) {
      try {
        parsed = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse selectedActivity', e)
      }
    }
    priceDetailed.value = {
      ...(parsed || {}),
      ...bookingDetails.value,
      name: parsed?.name || bookingDetails.value.name,
      provider: parsed?.provider || bookingDetails.value.provider,
      price: bookingDetails.value.price || parsed?.price || 0,
      priceWithCommission:
        bookingDetails.value.priceWithCommission ||
        parsed?.priceWithCommission ||
        bookingDetails.value.price ||
        parsed?.price ||
        0,
      currency: bookingDetails.value.currency || parsed?.currency || 'USD',
    }
  } else if (bookingDetails.value.type === 'car') {
    const saved = sessionStorage.getItem('selectedCar')
    let parsed: any = null
    if (saved) {
      try {
        parsed = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse selectedCar', e)
      }
    }
    // Customer-facing total for the whole rental period.
    const carPrice =
      bookingDetails.value.priceWithCommission ||
      bookingDetails.value.price ||
      (typeof parsed?.priceWithCommission === 'number' ? parsed.priceWithCommission : 0) ||
      (typeof parsed?.price === 'number' ? parsed.price : 0) ||
      parsed?.pricing?.total ||
      0
    priceDetailed.value = {
      ...(parsed || {}),
      ...bookingDetails.value,
      name: parsed?.name || bookingDetails.value.name,
      provider: parsed?.provider || bookingDetails.value.provider || 'flybeth',
      priceWithCommission: carPrice,
      price: carPrice,
      currency: parsed?.pricing?.currency || bookingDetails.value.currency || 'USD',
    }
  }
  loadCheckoutState()
  loadBundledStay()
  ensureTravelers()
  showBrandedLoader.value = false
})

watch([currentStep, travellerData, selectedSeats, selectedAddOns], () => { saveCheckoutState() }, { deep: true })
</script>

<style scoped>
.ck-wrap {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

@media (min-width: 1024px) {
  .ck-wrap {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (max-width: 640px) {
  .ck-wrap {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}


/* ADD these to <style scoped> */
.ck-main {
  width: 100%;
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

/* Ensure the inner flex row is fully constrained */
.ck-content-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  width: 100%;
}

@media (min-width: 1024px) {
  .ck-content-row {
    flex-direction: row;
  }
}

.ck-main-col {
  flex: 1 1 0%;
  min-width: 0;          /* ← THE critical fix: prevents flex child overflow */
  width: 100%;
}

.ck-sidebar-col {
  width: 100%;
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .ck-sidebar-col {
    width: 340px;        /* ← slightly narrower so main content breathes */
  }
}
</style>
