<template>
  <div class="min-h-screen bg-gray-50/30">
    <!-- Premium Header -->
    <div class="bg-brand-blue pt-20 pb-12 px-6 overflow-hidden relative">
      <div class="max-w-4xl mx-auto relative z-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-[10px] font-bold text-white/50 hover:text-white transition-all tracking-[0.2em] uppercase mb-8 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7 7-7" /></svg>
          Back to home
        </NuxtLink>
        <h1 class="text-3xl md:text-4xl text-white mb-6 tracking-tight">Privacy Policy</h1>
        <p class="text-sm font-bold text-white/40 tracking-widest">Last updated: April 19, 2026</p>
      </div>
      <!-- Abstract Background -->
      <div class="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
    </div>

    <!-- Content Body -->
    <div class="max-w-4xl mx-auto px-6 py-20">
      <div class="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-brand-blue/5 border border-gray-100/50">
        <div class="prose prose-slate max-w-none space-y-16">
          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">01</span>
              <h2 class="text-2xl text-gray-900">Introduction</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-0 md:pl-14">
              At Flybeth, we value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">02</span>
              <h2 class="text-2xl text-gray-900">Information We Collect</h2>
            </div>
            <div class="text-gray-600 leading-relaxed pl-0 md:pl-14 space-y-4">
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul class="list-disc pl-5 space-y-2">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, and title.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Financial Data:</strong> includes bank account and payment card details (processed securely via our partners).</li>
                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, and device information.</li>
              </ul>
            </div>
          </section>

          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">03</span>
              <h2 class="text-2xl text-gray-900">How We Use Your Data</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-0 md:pl-14">
              We use your data to facilitate your bookings, manage your account, provide customer support, and, where permitted, send you marketing communications about our latest travel deals. We only process your personal data when we have a legal basis to do so, such as the performance of a contract or your explicit consent.
            </p>
          </section>

          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">04</span>
              <h2 class="text-2xl text-gray-900">Third-Party Service Providers</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-0 md:pl-14">
              To provide our services, we share your data with trusted partners including airlines (Duffel, Amadeus), hotel providers (Hotelbeds), and payment processors (Paystack, Stripe). These third parties are only allowed to process your data for specified purposes and in accordance with our instructions.
            </p>
          </section>

          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">05</span>
              <h2 class="text-2xl text-gray-900">Data Security</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-0 md:pl-14">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-10 w-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">06</span>
              <h2 class="text-2xl text-gray-900">Your Legal Rights</h2>
            </div>
            <p class="text-gray-600 leading-relaxed pl-0 md:pl-14">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
            </p>
          </section>

          <div class="pt-12 border-t border-gray-100 mt-12">
            <div class="bg-gray-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p class="text-sm text-gray-900 font-bold mb-1">Questions about your privacy?</p>
                <p class="text-xs text-gray-500">Contact our data protection team for any queries.</p>
              </div>
              <a href="mailto:privacy@flybeth.com" class="px-8 py-3 bg-brand-blue text-white rounded-xl text-xs font-bold tracking-widest hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20">
                Email Privacy Team
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
// Privacy Policy Page
</script>

<style scoped>
/* Scoped styles matched with terms.vue */
</style>
