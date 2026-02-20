<template>
  <div class="bg-white min-h-screen font-body overflow-x-hidden">
    <!-- Hero Section -->
    <div class="relative min-h-[90vh] flex items-center justify-center overflow-hidden -mt-20">
      <!-- Background Video -->
      <div class="absolute inset-0 z-0">
        <video 
          autoplay 
          muted 
          loop 
          playsinline 
          class="w-full h-full object-cover scale-105"
        >
          <source src="https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-gradient-to-b from-brand-blue/60 via-brand-blue/40 to-white/10 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-black/20"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div class="space-y-8 animate-fade-in-up">
          <h1 class="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white font-header leading-[0.85]">
            Elevate Your <br/>
            <span class="text-brand-green italic">Perspective</span>
          </h1>
          <p class="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-bold tracking-tight leading-relaxed drop-shadow-lg">
            Experience the future of travel booking. Seamlessly integrated, elegantly designed, and powered by global intelligence.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <UiBaseButton variant="green" size="lg" class="shadow-2xl shadow-brand-green/30 min-w-[200px]">Plan Your Escape</UiBaseButton>
            <UiBaseButton variant="outline" size="lg" class="!border-white/30 hover:!bg-white/10 min-w-[200px]">Live Flights</UiBaseButton>
          </div>
        </div>
      </div>

      <!-- Scrolling Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer">
        <div class="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div class="w-1 h-2 bg-brand-green rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>

    <!-- Search Widget Section -->
    <div class="relative z-20 -mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      <div class="animate-fade-in delay-500">
        <SearchWidget />
      </div>
    </div>

    <!-- Popular Destinations Section -->
    <section class="py-32 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div class="space-y-4">
            <span class="text-brand-green font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Global Exploration</span>
            <h2 class="text-5xl md:text-6xl font-black text-brand-blue font-header tracking-tighter leading-none">
              Most Loved <br/>
              <span class="text-brand-green/70">Destinations.</span>
            </h2>
          </div>
          <p class="text-brand-gray/60 font-bold max-w-md text-sm leading-relaxed">
            Curated by our expert travel intelligence, discover the world's most breathtaking locations with exclusive member benefits.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div v-for="(dest, idx) in destinations" :key="idx" 
            class="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl hover:shadow-brand-blue/20 transition-all duration-700 hover:-translate-y-4"
          >
            <img :src="dest.image" :alt="dest.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            
            <div class="absolute bottom-10 left-10 right-10">
              <span class="inline-block px-4 py-1 rounded-full bg-brand-green/20 backdrop-blur-md text-brand-green text-[10px] font-black uppercase tracking-widest mb-4">Starting from {{ dest.price }}</span>
              <h3 class="text-3xl font-black text-white mb-2 tracking-tight">{{ dest.name }}</h3>
              <p class="text-white/70 text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">{{ dest.desc }}</p>
            </div>

            <div class="absolute top-10 right-10 h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500">
              <ArrowRightIcon class="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Travel Inspiration Section -->
    <section class="py-32 bg-white relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-3xl"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center space-y-4 mb-20">
          <span class="text-brand-blue font-black uppercase tracking-[0.3em] text-[10px]">Lifestyle Travel</span>
          <h2 class="text-5xl font-black text-brand-blue font-header tracking-tighter">Inspiration for your next story.</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="(cat, idx) in categories" :key="idx" 
            class="flex flex-col items-center p-12 bg-white border border-gray-100 rounded-[3rem] hover:border-brand-blue/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group text-center"
          >
            <div class="h-24 w-24 rounded-[2rem] bg-brand-blue/5 flex items-center justify-center mb-8 group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:rotate-6 shadow-xl shadow-brand-blue/5 group-hover:shadow-brand-blue/20">
              <component :is="cat.icon" class="h-10 w-10" />
            </div>
            <h4 class="text-xl font-black text-brand-blue mb-3 tracking-tight">{{ cat.title }}</h4>
            <p class="text-brand-gray/40 text-[10px] font-black uppercase tracking-widest">{{ cat.count }} Experiences</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      <div class="relative bg-brand-blue rounded-[4rem] overflow-hidden p-16 md:p-24 text-center">
        <!-- Decor -->
        <div class="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-gray-950 to-transparent opacity-40"></div>
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/4"></div>

        <div class="relative z-10 max-w-2xl mx-auto space-y-10">
          <div class="space-y-4">
            <h2 class="text-4xl md:text-5xl font-black text-white font-header tracking-tighter">Get exclusive travel intel.</h2>
            <p class="text-white/60 font-bold tracking-tight">Join 50,000+ elite travelers receiving weekly bespoke deals and hidden gems.</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              class="flex-grow bg-white/10 border border-white/20 rounded-full px-10 py-5 text-white placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-brand-green/20 transition-all font-bold"
            />
            <UiBaseButton variant="green" size="lg" class="px-12 whitespace-nowrap">Subscribe Free</UiBaseButton>
          </div>
          
          <p class="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Join the Flybeth Inner Circle &nbsp;•&nbsp; No Spam Ever</p>
        </div>
      </div>
    </section>

    <!-- Featured Stats/Value Props -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div v-for="(stat, idx) in stats" :key="idx" class="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
            <div class="h-14 w-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all">
              <component :is="stat.icon" class="h-6 w-6" />
            </div>
            <h4 class="text-3xl font-black text-brand-blue mb-2 font-header italic">{{ stat.value }}</h4>
            <p class="text-brand-gray/60 font-bold uppercase tracking-widest text-[10px]">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Gradient Spacer -->
    <div class="h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
import { GlobeAltIcon, TicketIcon, ShieldCheckIcon, ArrowRightIcon, SparklesIcon, SunIcon, BuildingOfficeIcon, MapIcon } from '@heroicons/vue/24/outline'

const stats = [
  { label: 'Global Destinations', value: '1,200+', icon: GlobeAltIcon },
  { label: 'Flights Filtered Daily', value: '150k+', icon: TicketIcon },
  { label: 'Secure Bookings', value: '100%', icon: ShieldCheckIcon },
]

const destinations = [
  { 
    name: 'Paris, France', 
    price: '$450', 
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    desc: 'The city of light awaits with its iconic landmarks and world-class cuisine.'
  },
  { 
    name: 'Dubai, UAE', 
    price: '$620', 
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    desc: 'Experience the pinnacle of luxury and futuristic architecture in the desert.'
  },
  { 
    name: 'Maldives', 
    price: '$1,200', 
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
    desc: 'Escape to a tropical paradise with crystal clear waters and overwater villas.'
  }
]

const categories = [
  { title: 'Adventure', icon: SparklesIcon, count: '120+' },
  { title: 'Relaxation', icon: SunIcon, count: '85+' },
  { title: 'City Life', icon: BuildingOfficeIcon, count: '240+' },
  { title: 'Nature', icon: MapIcon, count: '150+' },
]
</script>

<style>
.font-header {
  font-family: 'Spectral', serif;
}
.font-body {
  font-family: 'Roboto', sans-serif;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scroll {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(4px); opacity: 0; }
}

.animate-fade-in-up {
  animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fade-in 1.5s ease-out forwards;
}

.animate-scroll {
  animation: scroll 1.5s infinite;
}

.delay-500 {
  animation-delay: 0.5s;
}
</style>

<style>
.font-header {
  font-family: 'Spectral', serif;
}
.font-body {
  font-family: 'Roboto', sans-serif;
}
</style>
