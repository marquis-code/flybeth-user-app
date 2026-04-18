<template>
  <div class="min-h-screen bg-[#FDFDFE] font-sans text-neutral-900 selection:bg-brand-blue/10">
    <!-- User Help Nav -->
    <nav class="bg-white border-b border-neutral-100 py-6 sticky top-0 z-[100] backdrop-blur-md bg-white/95">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <img src="@/assets/img/logo.png" class="w-auto h-10 transition-transform group-hover:scale-105" alt="logo" />
        </NuxtLink>
        <div class="flex items-center space-x-8">
           <NuxtLink to="/help" class="text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-brand-blue transition-colors" exact-active-class="text-brand-blue">Center</NuxtLink>
           <NuxtLink to="/help/knowledgebase" class="text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-brand-blue transition-colors" active-class="text-brand-blue">Knowledgebase</NuxtLink>
           <NuxtLink to="/help/tickets" class="text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-brand-blue transition-colors" active-class="text-brand-blue">My Support</NuxtLink>
           <button class="px-6 py-2.5 bg-brand-blue text-white rounded-full text-xs font-bold shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all">Live Chat</button>
        </div>
      </div>
    </nav>

    <NuxtPage />

    <!-- Footer -->
    <!-- <footer class="pt-20 pb-12 border-t border-neutral-100 bg-neutral-50/50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-neutral-400 gap-8 uppercase tracking-[0.2em]">
           <div class="flex items-center space-x-3">
              <img src="@/assets/img/logo.png" class="h-6 w-auto grayscale opacity-50" />
              <p>© 2026 Flybeth Travel. All rights reserved.</p>
           </div>
           <div class="flex items-center space-x-8">
              <a href="#" class="hover:text-brand-blue transition-colors">Privacy</a>
              <a href="#" class="hover:text-brand-blue transition-colors">Terms</a>
              <a href="#" class="hover:text-brand-blue transition-colors">Sitemap</a>
           </div>
        </div>
      </div>
    </footer> -->
  </div>
</template>

<script setup lang="ts">
// Parent layout for help section
</script>
