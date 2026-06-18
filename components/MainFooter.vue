<template>
  <footer class="bg-[#0b1686] text-white font-sans">
    
    <!-- 2. Expert Planner Banner -->
    <div class="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-4">
        <div class="relative w-full rounded-[4rem] sm:rounded-full bg-white border border-gray-200 overflow-hidden flex flex-col sm:flex-row items-center shadow-sm hover:shadow-md transition-shadow pr-4 sm:pr-8 group">
          <!-- Left Image (Pill shaped constraint) -->
          <div class="relative w-full sm:w-[40%] h-48 sm:h-32 shrink-0 rounded-[4rem] sm:rounded-l-full sm:rounded-r-none overflow-hidden">
             <img src="https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Kayaking" />
          </div>
          
          <!-- Overlapping Circular Avatar -->
          <div class="absolute top-1/2 left-1/2 sm:left-[40%] transform -translate-x-1/2 sm:-translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-20">
             <div class="w-16 h-16 rounded-full overflow-hidden bg-[#0b1686] flex items-center justify-center">
               <!-- Placeholder for agent face -->
               <img src="https://i.pravatar.cc/150?img=47" class="w-full h-full object-cover" />
             </div>
          </div>

          <!-- Content Right -->
          <div class="flex-1 py-8 sm:py-0 pl-4 pr-4 sm:pl-16 sm:pr-4 flex flex-col sm:flex-row items-center justify-between w-full gap-6 text-center sm:text-left z-10">
             <div class="flex flex-col gap-1.5">
               <h3 class="text-xl font-bold text-black">Your trip. Designed by our 24/7 travel experts</h3>
               <p class="text-sm text-gray-500 font-medium">Enjoy personalized planning with real human support. Call Our Travel Experts 24/7 at <span class="font-bold text-brand-blue">1-844-FLYBETH</span>.</p>
             </div>
             <a href="tel:18443592384" class="bg-[#1e1e96] hover:bg-[#15156a] text-white px-8 py-3 rounded-full text-sm font-bold transition-colors shadow-md shrink-0">Call us</a>
          </div>
        </div>
    </div>

    <!-- ── Top bar ──────────────────────────────────────── -->
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center py-6 border-b border-white/10">
        <h2 class="text-[1.35rem] font-bold mb-4 md:mb-0">Easy Access</h2>
        <div class="flex items-center gap-4">
          <span class="font-bold text-[1.1rem]">Connect with Us</span>
          <div class="flex gap-3">
            <a v-for="icon in socialIcons" :key="icon.alt" href="#"
              class="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors">
              <img :src="icon.src" :alt="icon.alt" class="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <!-- ── Questions ──────────────────────────────────── -->
      <div class="py-5 border-b border-white/10">
        <p class="text-[1.05rem] font-bold">
          Have Questions?
          <span class="font-normal text-white/80"> Call us 24/7 </span>
          <a href="tel:18443592384" class="hover:underline">1-844-FLYBETH</a>
        </p>
      </div>

      <!-- ── Quick Links Accordion Panel ───────────────── -->
      <div class="flex flex-col lg:flex-row py-8 border-b border-white/10 gap-6 lg:gap-0">

        <!-- Left sidebar -->
        <nav class="w-full lg:w-64 shrink-0 lg:border-r border-white/10 lg:pr-0 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 custom-scrollbar">
          <div class="flex flex-row lg:flex-col gap-2 lg:gap-0 min-w-max lg:min-w-0 px-1 lg:px-0">
            <!-- Tab items -->
            <button
              v-for="tab in quickLinkTabs"
              :key="tab.id"
              @click="tab.id === 'privacy' ? openPrivacyDrawer() : setTab(tab.id)"
              class="flex items-center justify-between px-4 py-3 lg:mb-0.5 rounded-lg text-[13px] font-semibold transition-all text-left shrink-0"
              :class="activeTab === tab.id ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'"
            >
              <span>{{ tab.label }}</span>
              <component
                :is="tab.id === 'privacy' ? ShieldCheck : ChevronRight"
                class="h-4 w-4 shrink-0 ml-3 hidden lg:block"
                :class="tab.id === 'privacy' ? 'text-blue-300' : ''"
              />
            </button>
          </div>
        </nav>

        <!-- Right content panel -->
        <div class="flex-1 lg:pl-10 min-h-[200px]">
          <!-- Active tab content -->
          <template v-if="activeTab && tabContent[activeTab]">
            <p class="text-[12px] text-white/60 mb-5 italic">{{ tabContent[activeTab].description }}</p>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2.5">
              <NuxtLink
                v-for="(link, i) in tabContent[activeTab].links"
                :key="i"
                :to="link.path"
                class="text-[12px] font-medium text-white/75 hover:text-white hover:underline truncate transition-colors"
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>

      <!-- ── Main link columns ───────────────────────────── -->
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
        <div v-for="col in linkColumns" :key="col.title">
          <h4 class="font-bold text-[13px] mb-4  uppercase text-white/50">{{ col.title }}</h4>
          <ul class="space-y-2.5">
            <li v-for="item in col.links" :key="item.label">
              <NuxtLink
                v-if="item.to"
                :to="item.to"
                class="text-[12px] text-white/75 font-medium hover:text-white hover:underline transition-colors"
              >{{ item.label }}</NuxtLink>
              <a v-else href="#" class="text-[12px] text-white/75 font-medium hover:text-white hover:underline transition-colors">{{ item.label }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ── White bottom bar ─────────────────────────────── -->
    <div class="bg-white w-full border-t border-gray-200">
      <div class="py-8 border-b border-gray-100">
        <FooterPartners />
      </div>
      <div class="text-center text-[12px] text-gray-500 py-6 pb-16 md:pb-6 max-w-7xl mx-auto px-6">
        <p>
          © {{ new Date().getFullYear() }} FLYBETH LLC. All rights reserved.
          <NuxtLink to="/privacy-policy" class="underline text-gray-600 hover:text-black transition-colors">Privacy Policy</NuxtLink>
          and agree to our
          <NuxtLink to="/terms" class="underline text-gray-600 hover:text-black transition-colors">Terms and Conditions</NuxtLink>.
        </p>
      </div>
    </div>

    <!-- ── Privacy / Cookie Drawer ─────────────────────── -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition name="fade">
        <div
          v-if="privacyOpen"
          class="fixed inset-0 bg-black/50 z-40"
          @click="privacyOpen = false"
        />
      </Transition>

      <!-- Drawer -->
      <Transition name="slide">
        <div
          v-if="privacyOpen"
          class="fixed right-3 top-3 bottom-3 w-[340px] max-w-[calc(100%-1.5rem)] bg-white text-gray-800 z-50 shadow-2xl overflow-hidden rounded-3xl flex flex-col"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 class="font-bold text-[15px]">Cookie Preferences / Opt-Out Rights</h2>
            <button @click="privacyOpen = false" class="text-gray-400 hover:text-gray-700 transition-colors">
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-5 py-4 flex-1 overflow-y-auto text-[12.5px] leading-relaxed">
            <p class="text-gray-600 mb-4">
              Must slide "right" to opt-out under each toggle, then click "Save" at the bottom.
              Cookie opt-outs are stored per-browser and per-website.
            </p>
            <div class="flex gap-3 mb-5 text-[11.5px] text-[#0b1686] font-semibold flex-wrap">
              <a href="#" class="hover:underline">Privacy Policy</a>
              <span class="text-gray-300">|</span>
              <a href="#" class="hover:underline">Subject Rights Request</a>
              <span class="text-gray-300">|</span>
              <a href="#" class="hover:underline">Do Not Sell or Share My Personal Information</a>
            </div>

            <!-- Cookie toggles -->
            <div v-for="cookie in cookieCategories" :key="cookie.id" class="mb-6 pb-6 border-b border-gray-100 last:border-0">
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-[13px]">{{ cookie.label }}</span>
                <!-- Toggle -->
                <button
                  @click="cookie.enabled = !cookie.enabled"
                  class="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                  :class="cookie.enabled ? 'bg-green-500' : 'bg-gray-300'"
                  :aria-checked="cookie.enabled"
                  role="switch"
                >
                  <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200"
                    :class="cookie.enabled ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </div>
              <p class="text-gray-500 text-[11.5px] leading-relaxed mb-2">{{ cookie.description }}</p>
              <button class="text-[11.5px] text-[#0b1686] font-semibold hover:underline">View Disclosures</button>
            </div>
          </div>

          <!-- Footer save -->
          <div class="px-5 pb-6 pt-3 border-t border-gray-100 sticky bottom-0 bg-white">
            <button
              @click="savePrivacyChoices"
              class="w-full bg-[#0b1686] text-white py-3 rounded-lg font-bold text-[14px] hover:bg-[#0a1270] transition-colors"
            >
              Save
            </button>
            <p class="text-center text-[11px] text-gray-400 mt-2">Powered by Osano</p>
          </div>
        </div>
      </Transition>
    </Teleport>

  </footer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ShieldCheck, ChevronRight, X } from 'lucide-vue-next';
import { flightsApi } from '@/api_factory/modules/flights';
import facebook from "@/assets/img/socials/facebook.png"
import instagram from "@/assets/img/socials/instagram.avif"
import twitter from "@/assets/img/socials/twitter.webp"
import tiktok from "@/assets/img/socials/tiktok.avif"

// ── State ─────────────────────────────────────────────────
const activeTab = ref<string | null>('airlines');
const privacyOpen = ref(false);

function setTab(id: string | null) {
  activeTab.value = activeTab.value === id ? null : id;
}

function openPrivacyDrawer() {
  privacyOpen.value = true;
}

function savePrivacyChoices() {
  // persist choices here
  privacyOpen.value = false;
}

// ── Social icons ──────────────────────────────────────────
const socialIcons = [
  { src: facebook, alt: 'Facebook' },
  { src: twitter, alt: 'X (Twitter)' },
  { src: instagram, alt: 'Instagram' },
  { src: tiktok, alt: 'TikTok' },
];

// ── Quick Links sidebar tabs ──────────────────────────────
const quickLinkTabs = [
  { id: 'airlines',         label: 'Popular Airlines' },
  { id: 'routes',           label: 'Popular Flight Routes' },
  { id: 'us-destinations',  label: 'Top U.S. Destinations' },
  { id: 'intl-destinations',label: 'Top International Destinations' },
  { id: 'privacy',          label: 'Your Privacy Choices' },
];

// ── Tab panel content ─────────────────────────────────────
const tabContent: Record<string, { description: string; links: { name: string; path: string }[] }> = reactive({
  airlines: {
    description: 'Explore our cheap airfare options by carrier, with over 500 options to choose from. (Loading...)',
    links: [],
  },
  routes: {
    description: 'Book one of our most popular flight routes with three easy clicks.',
    links: [
      { name: 'Atlanta to Ft Lauderdale',     path: '/routes/atl-to-fll' },
      { name: 'Chicago to Las Vegas',         path: '/routes/ord-to-las' },
      { name: 'Ft Lauderdale to New York',    path: '/routes/fll-to-nyc' },
      { name: 'Los Angeles to Las Vegas',     path: '/routes/lax-to-las' },
      { name: 'New York to Ft Lauderdale',    path: '/routes/nyc-to-fll' },
      { name: 'New York to London',           path: '/routes/nyc-to-lon' },
      { name: 'New York to Los Angeles',      path: '/routes/nyc-to-lax' },
      { name: 'New York to Miami',            path: '/routes/nyc-to-mia' },
      { name: 'Philadelphia to Orlando',      path: '/routes/phl-to-mco' },
      { name: 'San Francisco to Los Angeles', path: '/routes/sfo-to-lax' },
      { name: 'Los Angeles to Tokyo',         path: '/routes/lax-to-tyo' },
      { name: 'London to Dubai',              path: '/routes/lon-to-dxb' },
    ],
  },
  'us-destinations': {
    description: 'Find cheap airline tickets to popular U.S. destinations from coast to coast.',
    links: [
      { name: 'Atlanta',      path: '/destinations/atlanta' },
      { name: 'Baltimore',    path: '/destinations/baltimore' },
      { name: 'Boston',       path: '/destinations/boston' },
      { name: 'Chicago',      path: '/destinations/chicago' },
      { name: 'Dallas',       path: '/destinations/dallas' },
      { name: 'Denver',       path: '/destinations/denver' },
      { name: 'Ft Lauderdale',path: '/destinations/ft-lauderdale' },
      { name: 'Honolulu',     path: '/destinations/honolulu' },
      { name: 'Houston',      path: '/destinations/houston' },
      { name: 'Las Vegas',    path: '/destinations/las-vegas' },
      { name: 'Los Angeles',  path: '/destinations/los-angeles' },
      { name: 'Miami',        path: '/destinations/miami' },
      { name: 'New York',     path: '/destinations/new-york' },
      { name: 'Orlando',      path: '/destinations/orlando' },
      { name: 'Philadelphia', path: '/destinations/philadelphia' },
      { name: 'Phoenix',      path: '/destinations/phoenix' },
      { name: 'San Diego',    path: '/destinations/san-diego' },
      { name: 'San Francisco',path: '/destinations/san-francisco' },
      { name: 'Seattle',      path: '/destinations/seattle' },
      { name: 'Tampa',        path: '/destinations/tampa' },
    ],
  },
  'intl-destinations': {
    description: 'Get cheap air travel to global destinations in Europe, Asia and beyond.',
    links: [
      { name: 'Amsterdam',    path: '/destinations/amsterdam' },
      { name: 'Bangkok',      path: '/destinations/bangkok' },
      { name: 'Barcelona',    path: '/destinations/barcelona' },
      { name: 'Cancun',       path: '/destinations/cancun' },
      { name: 'Dublin',       path: '/destinations/dublin' },
      { name: 'Frankfurt',    path: '/destinations/frankfurt' },
      { name: 'Guadalajara',  path: '/destinations/guadalajara' },
      { name: 'Lima',         path: '/destinations/lima' },
      { name: 'London',       path: '/destinations/london' },
      { name: 'Madrid',       path: '/destinations/madrid' },
      { name: 'Mexico City',  path: '/destinations/mexico-city' },
      { name: 'Nassau',       path: '/destinations/nassau' },
      { name: 'Paris',        path: '/destinations/paris' },
      { name: 'Puerto Vallarta',path: '/destinations/puerto-vallarta' },
      { name: 'Rome',         path: '/destinations/rome' },
      { name: 'San Jose',     path: '/destinations/san-jose' },
      { name: 'Sydney',       path: '/destinations/sydney' },
      { name: 'Toronto',      path: '/destinations/toronto' },
      { name: 'Vancouver',    path: '/destinations/vancouver' },
      { name: 'Manila',       path: '/destinations/manila' },
    ],
  },
});

// ── Main link columns ─────────────────────────────────────
const linkColumns = [
  {
    title: 'Book',
    links: [
      { label: 'Cheap Flights',       to: '/flights' },
      { label: 'Cheap Hotels',        to: '/stays' },
      { label: 'Car Rentals',         to: '/cars' },
      { label: 'Vacation Packages',   to: '/packages' },
      { label: 'Group Travel',        to: '/group-travel' },
      { label: 'Save & Earn $',       to: '/rewards' },
    ],
  },
  {
    title: 'Traveler Tools',
    links: [
      { label: 'Check My Booking',    to: '/bookings' },
      { label: 'Customer Support',    to: '/help' },
      { label: 'Online Check-in',     to: '/online-check-in' },
      { label: 'Airline Baggage Fees',to: '/baggage-fees' },
      { label: 'Check Flight Status', to: '/flight-status' },
      { label: 'Travel Blog',         to: '/travel-blog' },
    ],
  },
  {
    title: 'About Flybeth',
    links: [
      { label: 'About Us',            to: '/about' },
      { label: 'Press Room',          to: null },
      { label: 'Careers',             to: null },
      { label: 'Affiliate Program',   to: null },
      { label: 'Client Testimonial',  to: null },
      { label: 'Advertise with Us',   to: null },
      { label: 'Newsletter',          to: null },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',             to: '/privacy-policy' },
      { label: 'Cookie Policy',              to: null },
      { label: 'Price Match Promise',        to: null },
      { label: 'Terms & Conditions',         to: '/terms' },
      { label: 'Taxes & Fees',               to: null },
      { label: 'Our Service Fees',           to: null },
      { label: 'Post-Ticketing Fees',        to: null },
      { label: 'Consumer Health Data Notice',to: null },
    ],
  },
];

// ── Cookie categories (drawer) ────────────────────────────
const cookieCategories = reactive([
  {
    id: 'essential',
    label: 'Essential',
    enabled: true,
    description: 'Strictly necessary for our website to function properly — login, load balancing, fraud detection, navigation, and form filling. You can block these in your browser but some site features will break.',
  },
  {
    id: 'advertising',
    label: 'Targeted Advertising',
    enabled: true,
    description: 'Help us serve relevant ads on third-party properties, limit ad frequency, track ad performance, and prevent fraud. Processes device identifiers, IP address, geolocation, and browsing activity.',
  },
  {
    id: 'personalization',
    label: 'Personalization',
    enabled: true,
    description: 'Enable us to personalise your experience by building a user profile from your searches, bookings, demographics, and preferences so we can surface the most relevant deals.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    enabled: true,
    description: 'Provide insight into visit counts, page popularity, traffic sources, A/B testing, and session recordings — used solely to optimise our digital properties.',
  },
]);

// ── Fetch dynamic data ────────────────────────────────────
const fetchAirlines = async () => {
  try {
    const { data } = await flightsApi.getDuffelAirlines({ limit: 20 });
    if (data?.data && Array.isArray(data.data)) {
      tabContent.airlines.description = 'Explore our cheap airfare options by carrier, with over 500 options to choose from.';
      tabContent.airlines.links = data.data.map((airline: any) => ({
        name: airline.name,
        path: `/airlines/${airline.iata_code || airline.id}`
      }));
    }
  } catch (err) {
    console.error('Failed to fetch airlines for footer:', err);
    tabContent.airlines.description = 'Explore our cheap airfare options by carrier, with over 500 options to choose from.';
    tabContent.airlines.links = [
      { name: 'American Airlines',    path: '/airlines/aa' },
      { name: 'Delta Air Lines',      path: '/airlines/dl' },
      { name: 'United Airlines',      path: '/airlines/ua' },
      { name: 'Emirates',             path: '/airlines/ek' },
      { name: 'Lufthansa',            path: '/airlines/lh' },
      { name: 'Air France',           path: '/airlines/af' },
    ];
  }
};

onMounted(() => {
  fetchAirlines();
});
</script>

<style scoped>
/* Drawer slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(calc(100% + 1.5rem));
}

/* Scrollbar hiding for horizontal scroll */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Backdrop fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>