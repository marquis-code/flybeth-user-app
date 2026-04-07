<template>
  <div class="min-h-screen bg-gray-50/30">
    <!-- Premium Header -->
    <div class="bg-brand-blue pt-32 pb-20 px-6 overflow-hidden relative">
      <div class="max-w-4xl mx-auto relative z-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-[10px] font-bold text-white/50 hover:text-white transition-all tracking-[0.2em] uppercase mb-8 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7 7-7" /></svg>
          Back to home
        </NuxtLink>
        <h1 class="text-5xl md:text-6xl font-header text-white mb-6 tracking-tight">Terms & conditions</h1>
        <p class="text-sm font-bold text-white/40 tracking-widest italic">Last updated: April 2026</p>
      </div>
      <!-- Abstract Background -->
      <div class="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
    </div>

    <!-- Content Body -->
    <div class="max-w-4xl mx-auto px-6 py-20">
      <div class="bg-white rounded-[3rem] p-12 shadow-xl shadow-brand-blue/5 border border-gray-100/50">
        <div class="prose prose-slate max-w-none space-y-16">
          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">01</span>
              <h2 class="text-2xl font-header text-gray-900">Introduction</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-14">
              Welcome to Flybeth. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before making any bookings. Our mission is to provide you with a seamless and transparent booking experience.
            </p>
          </section>

          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">02</span>
              <h2 class="text-2xl font-header text-gray-900">Booking policy</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-14">
              All bookings made through Flybeth are subject to availability and the specific terms of the airline or accommodation provider. Prices are dynamic and may change until the booking is confirmed and paid in full. We act as an intermediary between you and the travel service providers.
            </p>
          </section>

          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">03</span>
              <h2 class="text-2xl font-header text-gray-900">Cancellation & refunds</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-14">
              Cancellation policies vary by provider. Flybeth acts as an intermediary, and as such, any refund requests are subject to the policies of the respective airlines or hotels. Service charges paid to Flybeth are generally non-refundable unless otherwise stated.
            </p>
          </section>

          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">04</span>
              <h2 class="text-2xl font-header text-gray-900">Liability</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-14">
              Flybeth is not liable for any delays, cancellations, or disruptions caused by the travel providers. We strongly recommend that all travellers obtain comprehensive travel insurance to cover unexpected changes to their itinerary.
            </p>
          </section>

          <div class="pt-12 border-t border-gray-100 mt-12">
            <div class="bg-gray-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p class="text-sm text-gray-900 font-bold mb-1">Have questions about our terms?</p>
                <p class="text-xs text-gray-500">Our support team is here to help you 24/7.</p>
              </div>
              <a href="mailto:support@flybeth.com" class="px-8 py-3 bg-brand-blue text-white rounded-xl text-xs font-bold tracking-widest hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20">
                Contact support
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer navigation -->
      <div class="mt-12 flex justify-center">
        <NuxtLink to="/" class="px-10 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm">
          Return to booking
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Terms and Conditions Page
</script>

<style scoped>
.font-header {
  font-family: 'Spectral', serif;
}
</style>
