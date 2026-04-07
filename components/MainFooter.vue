<template>
  <footer class="bg-white border-t border-gray-100 pt-24 pb-12 font-body">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <!-- Brand Info -->
        <div class="space-y-6">
          <NuxtLink to="/" class="inline-block">
            <img src="@/assets/img/logo.png" class="h-10 w-auto" alt="Flybeth Logo" />
          </NuxtLink>
          <p class="text-sm text-gray-500 leading-relaxed max-w-xs">
            <strong>FLYBETH LLC</strong><br>
            1880 S Dairy Ashford Rd, Suite 207, Houston, TX 77077 United States.<br>
            <span class="block mt-2 font-bold text-brand-blue">+1 844 FLYBETH (359-2384)</span>
            <span class="block text-brand-orange font-medium">Hello@flybeth.com</span>
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-blue/10 hover:text-brand-blue transition-all">
              <span class="sr-only">Facebook</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-blue/10 hover:text-brand-blue transition-all">
              <span class="sr-only">Instagram</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.715.013 3.68.057 1.05.048 1.767.216 2.391.459a4.803 4.803 0 011.696 1.104 4.803 4.803 0 011.104 1.696c.243.624.411 1.341.459 2.391.044.965.057 1.25.057 3.68s-.013 2.715-.057 3.68c-.048 1.05-.216 1.767-.459 2.391a4.803 4.803 0 01-1.104 1.696 4.803 4.803 0 01-1.696 1.104c-.624.243-1.341.411-2.391.459-.965.044-1.25.057-3.68.057s-2.715-.013-3.68-.057c-1.05-.048-1.767-.216-2.391-.459a4.803 4.803 0 01-1.696-1.104 4.803 4.803 0 01-1.104-1.696c-.243-.624-.411-1.341-.459-2.391-.044-.965-.057-1.25-.057-3.68s.013-2.715.057-3.68c.048-1.05.216-1.767.459-2.391a4.803 4.803 0 011.104-1.696 4.803 4.803 0 011.696-1.104c.624-.243 1.341-.411 2.391-.459.965-.044 1.25-.057 3.68-.057H12.315zM12 2c-2.43 0-2.715.013-3.68.057-1.05.048-1.767.216-2.391.459a4.803 4.803 0 00-1.696 1.104A4.803 4.803 0 003.328 5.61c-.243.624-.411 1.341-.459 2.391C2.825 8.965 2.812 9.25 2.812 11.685s.013 2.715.057 3.68c.048 1.05.216 1.767.459 2.391a4.803 4.803 0 001.104 1.696 4.803 4.803 0 001.696 1.104c.624.243 1.341.411 2.391.459.965.044 1.25.057 3.68.057s2.715-.013 3.68-.057c1.05-.048 1.767-.216 2.391-.459a4.803 4.803 0 001.696-1.104 4.803 4.803 0 001.104-1.696c.243-.624.411-1.341.459-2.391.044-.965.057-1.25.057-3.68s-.013-2.715-.057-3.68c-.048-1.05-.216-1.767-.459-2.391a4.803 4.803 0 00-1.104-1.696 4.803 4.803 0 00-1.696-1.104c-.624-.243-1.341-.411-2.391-.459C15.03 2.013 14.745 2 12.315 2H12z"/><path d="M12 5.865a5.82 5.82 0 100 11.64 5.82 5.82 0 000-11.64zm0 9.64a3.82 3.82 0 110-7.64 3.82 3.82 0 010 7.64z"/><path d="M18.056 4.545a1.36 1.36 0 11-2.72 0 1.36 1.36 0 012.72 0z"/></svg>
            </a>
          </div>
        </div>

        <!-- Links Grid -->
        <div class="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 class="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Explore</h4>
            <ul class="space-y-4">
              <li><NuxtLink to="/flights" class="text-sm text-gray-500 hover:text-brand-blue transition-colors">Flights</NuxtLink></li>
              <li><NuxtLink to="/stays" class="text-sm text-gray-500 hover:text-brand-blue transition-colors">Hotels</NuxtLink></li>
              <li><NuxtLink to="/cars" class="text-sm text-gray-500 hover:text-brand-blue transition-colors">Car Rentals</NuxtLink></li>
              <li><NuxtLink to="/packages" class="text-sm text-gray-500 hover:text-brand-blue transition-colors">Vacation Packages</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Support</h4>
            <ul class="space-y-4">
              <li><NuxtLink to="/help" class="text-sm text-gray-500 hover:text-brand-blue transition-colors">Help Center</NuxtLink></li>
              <li><NuxtLink to="/terms" class="text-sm text-gray-500 hover:text-brand-blue transition-colors">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-sm text-gray-500 hover:text-brand-blue transition-colors">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-sm text-gray-500 hover:text-brand-blue transition-colors">Contact Us</NuxtLink></li>
            </ul>
          </div>
          <div class="col-span-2 md:col-span-1">
            <h4 class="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Newsletter</h4>
            <p class="text-sm text-gray-500 mb-4">Get the latest deals and travel tips delivered to your inbox.</p>
            <form @submit.prevent class="relative">
              <input type="email" placeholder="Your email address" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm" />
              <button class="absolute right-2 top-2 bottom-2 px-4 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-[#0a168a] transition-all">Join</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          © 2026 FLYBETH LLC. All rights reserved.
        </p>
        <div class="flex gap-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" class="h-4 w-auto grayscale opacity-40" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-6 w-auto grayscale opacity-40" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" class="h-4 w-auto grayscale opacity-40" />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Professional Footer
</script>

<style scoped>
/* Minimalist Premium Footer Styles */
</style>
