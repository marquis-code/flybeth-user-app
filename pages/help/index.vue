<template>
  <div>
    <!-- Support Hero Section -->
    <section class="relative bg-brand-blue/5 pt-12 pb-24 overflow-hidden">
      <!-- Decorative Bubbles -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div class="absolute top-1/4 left-1/4 w-32 h-12 bg-brand-blue/60 rounded-full blur-xl animate-pulse"></div>
        <div class="absolute top-1/2 right-1/4 w-48 h-16 bg-brand-blue/40 rounded-full blur-2xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
         <div class="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 class="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-[1.1]">
               We're here to help you<br/>
               <span class="text-brand-blue">travel with confidence.</span>
            </h1>
            <p class="text-lg text-neutral-500 font-medium max-w-xl mx-auto leading-relaxed">
               Search our help center for quick answers to common questions about bookings, refunds, and travel protocols.
            </p>
            <div class="relative max-w-2xl mx-auto group group-focus-within:scale-[1.02] transition-all duration-300">
               <MagnifyingGlassIcon class="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-300 group-focus-within:text-brand-blue transition-colors" />
               <input 
                 v-model="searchQuery"
                 type="text" 
                 placeholder="Search flights, hotels, or payment help..." 
                 class="w-full pl-16 pr-8 py-6 bg-white border-0 rounded-[32px] shadow-2xl shadow-neutral-200/60 focus:ring-4 focus:ring-brand-blue/5 outline-none text-base font-bold transition-all placeholder:text-neutral-300"
               />
               <button class="absolute right-3 top-1/2 -translate-y-1/2 h-12 px-8 bg-brand-blue text-white rounded-[24px] font-bold text-xs shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">Search</button>
            </div>
         </div>
      </div>
    </section>

    <!-- Support Hub Grid -->
    <section class="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Knowledgebase -->
        <NuxtLink to="/help/knowledgebase" class="bg-white p-8 rounded-[40px] shadow-xl shadow-neutral-200/50 border border-neutral-100 hover:border-brand-blue/30 group transition-all duration-500 hover:-translate-y-2">
           <div class="w-16 h-16 rounded-3xl bg-neutral-50 flex items-center justify-center mb-10 group-hover:bg-brand-blue/5 transition-colors">
              <BookOpenIcon class="h-8 w-8 text-neutral-400 group-hover:text-brand-blue transition-colors" />
           </div>
           <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-black text-neutral-900 group-hover:text-brand-blue transition-colors">Knowledgebase</h3>
              <ArrowLongRightIcon class="h-6 w-6 text-neutral-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
           </div>
           <p class="text-[13px] font-semibold text-neutral-400 group-hover:text-neutral-500 transition-colors leading-relaxed">Step-by-step guides for all Flybeth travel products and services.</p>
        </NuxtLink>

        <!-- Submit support ticket -->
        <NuxtLink to="/help/tickets" class="bg-white p-8 rounded-[40px] shadow-xl shadow-neutral-200/50 border border-neutral-100 hover:border-brand-blue/30 group transition-all duration-500 hover:-translate-y-2">
           <div class="w-16 h-16 rounded-3xl bg-neutral-50 flex items-center justify-center mb-10 group-hover:bg-brand-blue/5 transition-colors">
              <TicketIcon class="h-8 w-8 text-neutral-400 group-hover:text-brand-blue transition-colors" />
           </div>
           <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-black text-neutral-900 group-hover:text-brand-blue transition-colors">Support ticket</h3>
              <ArrowLongRightIcon class="h-6 w-6 text-neutral-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
           </div>
           <p class="text-[13px] font-semibold text-neutral-400 group-hover:text-neutral-500 transition-colors leading-relaxed">Reach our 24/7 support desk for personalized travel assistance.</p>
        </NuxtLink>

        <!-- Leave feedback -->
        <a href="mailto:support@flybeth.com" class="bg-white p-8 rounded-[40px] shadow-xl shadow-neutral-200/50 border border-neutral-100 hover:border-brand-blue/30 group transition-all duration-500 hover:-translate-y-2">
           <div class="w-16 h-16 rounded-3xl bg-neutral-50 flex items-center justify-center mb-10 group-hover:bg-brand-blue/5 transition-colors">
              <ChatBubbleOvalLeftEllipsisIcon class="h-8 w-8 text-neutral-400 group-hover:text-brand-blue transition-colors" />
           </div>
           <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-black text-neutral-900 group-hover:text-brand-blue transition-colors">Leave feedback</h3>
              <ArrowLongRightIcon class="h-6 w-6 text-neutral-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
           </div>
           <p class="text-[13px] font-semibold text-neutral-400 group-hover:text-neutral-500 transition-colors leading-relaxed">Love our platform? Have suggestions? We'd love to hear them.</p>
        </a>

        <!-- Reporting abuse -->
        <a href="mailto:abuse@flybeth.com" class="bg-white p-8 rounded-[40px] shadow-xl shadow-neutral-200/50 border border-neutral-100 hover:border-brand-blue/30 group transition-all duration-500 hover:-translate-y-2">
           <div class="w-16 h-16 rounded-3xl bg-neutral-50 flex items-center justify-center mb-10 group-hover:bg-brand-blue/5 transition-colors">
              <ExclamationTriangleIcon class="h-8 w-8 text-neutral-400 group-hover:text-brand-blue transition-colors" />
           </div>
           <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-black text-neutral-900 group-hover:text-brand-blue transition-colors">Reporting abuse</h3>
              <ArrowLongRightIcon class="h-6 w-6 text-neutral-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
           </div>
           <p class="text-[13px] font-semibold text-neutral-400 group-hover:text-neutral-500 transition-colors leading-relaxed">Report phishing, prohibited content, or illegal platform behavior.</p>
        </a>
      </div>
    </section>

    <!-- Popular FAQ Section -->
    <section class="max-w-5xl mx-auto px-6 py-20 bg-white">
       <div class="text-center mb-20 space-y-4">
          <h2 class="text-4xl font-black text-neutral-900">Frequently Asked Questions</h2>
          <p class="text-neutral-400 font-bold tracking-widest uppercase text-xs">Quick answers to your travel needs</p>
       </div>
       <div class="space-y-6">
          <div v-for="faq in faqs" :key="faq.q" class="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-500 group cursor-pointer">
             <div class="flex items-center justify-between">
                <h4 class="text-lg font-black text-neutral-900">{{ faq.q }}</h4>
                <div class="h-8 w-8 bg-white border border-neutral-100 rounded-full flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                   <ChevronDownIcon class="h-4 w-4" />
                </div>
             </div>
             <p class="hidden group-hover:block mt-6 text-sm text-neutral-500 font-medium leading-relaxed animate-in fade-in duration-500">{{ faq.a }}</p>
          </div>
       </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  MagnifyingGlassIcon, 
  ArrowLongRightIcon, 
  BookOpenIcon, 
  TicketIcon, 
  ChatBubbleOvalLeftEllipsisIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'Help Center | Flybeth Support',
  meta: [
    { name: 'description', content: '24/7 dedicated travel support. Manage your bookings, request refunds, and get expert travel assistance instantly.' }
  ]
})

const searchQuery = ref('')

const faqs = [
  { q: "How do I request a refund for my flight?", a: "You can request a refund directly through the 'Manage My Booking' section on your dashboard. Refund processing typically takes 7-10 business days depending on your bank and the airline's policy." },
  { q: "Can I change my hotel dates after booking?", a: "Most bookings are flexible, depending on the hotel's cancellation policy. Check your confirmation email for specific terms or go to your active bookings to request a date change." },
  { q: "What should I do if my flight is delayed?", a: "In case of delay, stay in touch with the airline at the airport. You can also contact our 24/7 priority support line for assistance with rebooking or accommodation if required." },
  { q: "Do I need a visa for my destination?", a: "Visa requirements vary by nationality and destination. We recommend checking your destination's official embassy website or using our integrated 'Travel Requirements' tool in the dashboard." }
]
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slide-in-from-bottom {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-in {
  animation-fill-mode: both;
}
.fade-in {
  animation-name: fade-in;
}
.slide-in-from-bottom-8 {
  animation-name: slide-in-from-bottom;
}
</style>
