<template>
  <div class="min-h-screen bg-[#F5F7FA] font-body pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Travel Alert Banner -->
      <div class="mb-8 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-gray-900" />
        </div>
        <div>
          <h3 class="text-xs  text-gray-900 uppercase tracking-widest">Global Travel Alert</h3>
          <p class="text-[11px] font-bold text-brand-gray/60">Check the latest travel requirements and COVID-19 updates for your destination.</p>
        </div>
        <button class="ml-auto text-sm  text-gray-900 underline decoration-2 underline-offset-4">Learn More</button>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-72 flex-shrink-0 space-y-4">
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 class="text-xs  text-brand-gray/40 uppercase tracking-widest mb-6">Help Categories</h2>
            <nav class="space-y-2">
              <div v-for="category in categories" :key="category.name" class="group">
                <button 
                  @click="category.isOpen = !category.isOpen"
                  class="w-full flex items-center justify-between p-3 rounded-2xl transition-all"
                  :class="category.isOpen ? 'bg-brand-blue/5 text-gray-900' : 'hover:bg-gray-50 text-brand-gray/80'"
                >
                  <div class="flex items-center gap-3">
                    <component :is="category.icon" class="h-4 w-4" />
                    <span class="text-xs font-bold">{{ category.name }}</span>
                  </div>
                  <ChevronRightIcon 
                    class="h-3 w-3 transition-transform duration-300"
                    :class="category.isOpen ? 'rotate-90' : ''"
                  />
                </button>
                
                <div v-if="category.isOpen" class="pl-10 pr-4 py-2 space-y-2">
                  <a v-for="sub in category.sub" :key="sub" href="#" class="block text-sm font-bold text-brand-gray/60 hover:text-gray-900 transition-colors">
                    {{ sub }}
                  </a>
                </div>
              </div>
            </nav>
          </div>

          <!-- Quick Actions Card -->
          <div class="bg-brand-blue rounded-3xl p-6 shadow-xl shadow-brand-blue/20 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <h3 class="text-sm  uppercase tracking-widest mb-2 relative z-10">Need Live Help?</h3>
            <p class="text-sm font-bold opacity-80 mb-6 relative z-10">Our travel experts are available 24/7 to assist you.</p>
            <button class="w-full bg-white text-gray-900 py-3 rounded-2xl  text-xs hover:scale-[1.02] active:scale-95 transition-all">
              Start Live Chat
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 space-y-8">
          <!-- Header / Search -->
          <div class="text-center md:text-left">
            <h1 class="text-4xl  text-gray-900 mb-4">What can we help you with?</h1>
            <div class="relative max-w-2xl">
              <input 
                type="text" 
                placeholder="Search for articles, topics, or FAQs..." 
                class="w-full bg-white border-2 border-gray-100 focus:border-brand-blue rounded-3xl px-12 py-5 text-sm font-bold shadow-sm transition-all outline-none"
              />
              <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray/40" />
              <button class="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-blue text-white px-6 py-2.5 rounded-2xl  text-xs shadow-lg hover:shadow-brand-blue/20 transition-all">
                Search
              </button>
            </div>
          </div>

          <!-- Top Support Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all">
                <div class="w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center animate-pulse">
                   <ChatBubbleLeftRightIcon class="h-8 w-8 text-green-500" />
                </div>
                <div>
                   <h3 class="text-lg  text-gray-900">Chat Now</h3>
                   <p class="text-[11px] font-bold text-brand-gray/60 mb-2 italic">Connect with an agent in seconds</p>
                   <button class="text-[11px]  text-gray-900 underline decoration-2 underline-offset-4">Open Messenger</button>
                </div>
             </div>

             <div class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all">
                <div class="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center">
                   <PhoneIcon class="h-8 w-8 text-gray-900" />
                </div>
                <div>
                   <h3 class="text-lg  text-gray-900">Call Us</h3>
                   <p class="text-[11px] font-bold text-brand-gray/60 mb-2 italic">24/7 Priority Support Line</p>
                   <a href="tel:+16462376851" class="text-lg  text-gray-900">+1-646-237-6851</a>
                </div>
             </div>
          </div>

          <!-- Popular Topics Grid -->
          <section>
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl  text-gray-900">Popular Topics</h2>
              <button class="text-xs  text-gray-900 hover:underline uppercase tracking-widest">View All Articles</button>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <div v-for="topic in popularTopics" :key="topic.title" class="bg-white p-6 rounded-[32px] border border-gray-50 hover:border-brand-blue/30 hover:shadow-xl transition-all group cursor-pointer text-center flex flex-col items-center">
                <div class="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500">
                  <component :is="topic.icon" class="h-6 w-6 text-gray-900" />
                </div>
                <h3 class="text-sm  text-gray-900 mb-2">{{ topic.title }}</h3>
                <p class="text-[11px] font-bold text-brand-gray/40 leading-relaxed">{{ topic.desc }}</p>
              </div>
            </div>
          </section>

          <!-- Manage Bookings Section -->
          <div class="bg-white rounded-[40px] p-10 border border-gray-100 flex flex-col md:flex-row items-center gap-10">
            <div class="flex-1 text-center md:text-left">
              <h2 class="text-3xl  text-gray-900 mb-4">Check Your Booking Status</h2>
              <p class="text-sm font-bold text-brand-gray/60 mb-8 max-w-md">Instantly retrieve your itinerary, request a refund, or make changes to your flight and hotel bookings.</p>
              <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                <button class="bg-brand-blue text-white px-8 py-4 rounded-2xl  text-xs shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">
                  Manage My Booking
                </button>
                <button class="bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl  text-xs hover:bg-gray-100 transition-all">
                  Check Refund Status
                </button>
              </div>
            </div>
            <div class="w-full md:w-64 aspect-square bg-brand-blue/5 rounded-[40px] flex items-center justify-center relative group">
               <TicketIcon class="h-32 w-32 text-gray-900 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
               <div class="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-[40px]"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  MagnifyingGlassIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  TicketIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  InboxStackIcon,
  IdentificationIcon,
  CreditCardIcon,
  GlobeAltIcon,
  UserGroupIcon,
  LifebuoyIcon
} from '@heroicons/vue/24/solid'

useHead({
  title: 'Help Center | Flybeth Support',
  meta: [
    { name: 'description', content: '24/7 dedicated travel support. Manage your bookings, request refunds, and get expert travel assistance instantly.' }
  ]
})

const categories = ref([
  { 
    name: 'Manage Bookings', 
    icon: InboxStackIcon, 
    isOpen: true,
    sub: ['View Itinerary', 'Cancel Booking', 'Change Flights', 'Add Baggage']
  },
  { 
    name: 'Payments & Refunds', 
    icon: CreditCardIcon, 
    isOpen: false,
    sub: ['Refund Status', 'Payment Methods', 'Invoices', 'Vouchers']
  },
  { 
    name: 'Travel Requirements', 
    icon: GlobeAltIcon, 
    isOpen: false,
    sub: ['Visa Info', 'Health Documents', 'Travel Insurance']
  },
  { 
    name: 'Account & Profile', 
    icon: IdentificationIcon, 
    isOpen: false,
    sub: ['Security Settings', 'ClubMiles Rewards', 'Direct Login']
  }
])

const popularTopics = [
  { 
    title: 'Refund Status', 
    desc: 'Check when your money will be back', 
    icon: CreditCardIcon 
  },
  { 
    title: 'Check-in Help', 
    desc: 'How to get your boarding pass online', 
    icon: IdentificationIcon 
  },
  { 
    title: 'Flight Changes', 
    desc: 'Modify your travel dates or route', 
    icon: GlobeAltIcon 
  },
  { 
    title: 'Cancellation', 
    desc: 'Understand the policy and fees', 
    icon: LifebuoyIcon 
  }
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
