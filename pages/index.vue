<template>
  <div class="min-h-screen bg-white">
    <!-- ══════════════════════ HERO — search only ══════════════════════ -->
    <!-- Decorations are clipped by their own wrapper rather than by the section:
         `overflow-hidden` here also clipped the open date picker. -->
    <section class="relative bg-[#0D1DAD]">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(125%_120%_at_50%_-25%,#1A2ED4_0%,#0D1DAD_46%,#0A1485_100%)]"></div>
        <div
          class="absolute inset-0 opacity-[0.07]"
          style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:56px 56px;"
        ></div>
        <div class="absolute -right-24 top-6 h-72 w-72 rounded-full bg-[#EB4405]/25 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-5 pt-[92px] pb-14 sm:pt-[112px] sm:pb-20">
        <div class="mb-8 text-center">
          <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">Flights · Hotels · Cars · Experiences</p>
          <h1 class="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
            Book cheap flights from hundreds of airlines
          </h1>
          <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
            Compare live fares, then book in one secure checkout.
          </p>
        </div>
        <div class="relative z-20">
          <SearchWidget theme="cheapoair" />
        </div>
      </div>
    </section>

    <!-- ══════════════════════ LIVE DEALS (API) ══════════════════════ -->
    <DealsRail origin="LOS" :limit="6" />

    <!-- ══════════════════════ REWARDS (System config) ══════════════════════ -->
    <RewardsBanner />

    <!-- ══════════════════════ PROMO CODE (API) ══════════════════════ -->
    <PromoBanner />

    <!-- ══════════════════════ TRAVEL VERTICALS ══════════════════════ -->
    <section class="mx-auto max-w-7xl px-5 py-8 sm:py-10">
      <div class="mx-auto max-w-2xl text-center mb-6">
        <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D1DAD]">Book every part of the trip</p>
        <h2 class="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#0B1B33]">One platform. Every way to travel.</h2>
        <p class="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#5F7185]">
          Book a single trip or build the whole itinerary — every product shares the same secure checkout.
        </p>
      </div>

      <div class="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="v in verticals"
          :key="v.to"
          :to="v.to"
          class="group relative h-[175px] sm:h-[185px] overflow-hidden rounded-xl border border-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0D1DAD]/50"
        >
          <!-- Background image of what it stands for -->
          <img
            :src="v.image"
            :alt="v.title"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <!-- Dark rich gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#060D24]/95 via-[#060D24]/65 to-[#060D24]/25 transition-opacity group-hover:opacity-90"></div>

          <!-- Card Content -->
          <div class="relative z-10 flex h-full flex-col justify-between p-4">
            <!-- Top: Badge + Arrow -->
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                <svg class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="v.path" />
                </svg>
                {{ v.badge }}
              </span>
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white transition-all duration-300 group-hover:bg-[#0D1DAD] group-hover:translate-x-0.5">
                →
              </span>
            </div>

            <!-- Bottom: Title & Blurb -->
            <div>
              <h3 class="text-base font-black text-white leading-tight group-hover:text-blue-200 transition-colors">{{ v.title }}</h3>
              <p class="mt-1 text-[11px] leading-snug text-white/80 line-clamp-2">{{ v.blurb }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ══════════════════════ DESTINATIONS ══════════════════════ -->
    <section class="border-y border-[#E6EBF2] bg-[#F4F7FB]">
      <div class="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <SectionHeading accent="#0D1DAD" eyebrow="Where to next" title="Popular destinations" link-to="/destinations" link-label="All destinations" />
        <CityDealsGrid />
      </div>
    </section>

    <!-- ══════════════════════ HOTELS ══════════════════════ -->
    <section class="mx-auto max-w-7xl px-5 py-8 sm:py-10">
      <SectionHeading accent="#0D1DAD" eyebrow="Stays" title="Hand-picked places to stay" link-to="/stays" link-label="Browse all hotels" />
      <TopHotelDeals destination-name="London" :lat="51.5074" :lng="-0.1278" />
    </section>

    <!-- ══════════════════════ ACTIVITIES ══════════════════════ -->
    <section class="border-y border-[#E6EBF2] bg-[#F4F7FB]">
      <div class="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <SectionHeading accent="#0D1DAD" eyebrow="Things to do" title="Experiences worth travelling for" link-to="/things-to-do" link-label="Explore activities" />
        <TrendingActivities />
      </div>
    </section>

    <!-- ══════════════════════ WHY US ══════════════════════ -->
    <section class="mx-auto max-w-7xl px-5 py-16">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="relative">
          <img
            :src="lifestyleImg"
            alt="Travellers planning a trip"
            class="h-[22rem] w-full rounded-xl object-cover ring-1 ring-[#DBE2EA]"
            loading="lazy"
          />
          <div class="absolute -right-3 -bottom-4 rounded-lg bg-[#0450A0] px-5 py-4 text-white shadow-xl">
            <p class="text-[10px] font-bold uppercase tracking-wider text-white/60">Support</p>
            <p class="mt-0.5 text-base font-black">24/7 human help</p>
          </div>
        </div>

        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0450A0]">Why book with us</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-[#0B1B33] sm:text-4xl">
            The price you see is the price you pay.
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-[#44546A]">
            We confirm fare and availability with the supplier before your card is charged,
            so there are no last-minute surprises when you reach the payment step.
          </p>

          <div class="mt-8 space-y-5">
            <div v-for="f in features" :key="f.title" class="flex gap-4">
              <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#0450A0]/[0.08] text-[#0450A0]">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
              <div>
                <h3 class="text-sm font-bold text-[#0B1B33]">{{ f.title }}</h3>
                <p class="mt-0.5 text-[13px] leading-relaxed text-[#5F7185]">{{ f.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════ HOW IT WORKS ══════════════════════ -->
    <section class="border-y border-[#E6EBF2] bg-[#0450A0]">
      <div class="mx-auto max-w-7xl px-5 py-16">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFB38A]">Simple by design</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Book in three steps</h2>
        </div>
        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <div v-for="(s, i) in steps" :key="s.title" class="relative rounded-lg border border-white/15 bg-white/[0.07] p-7">
            <span class="text-3xl font-black text-white/20">0{{ i + 1 }}</span>
            <h3 class="mt-2 text-base font-bold text-white">{{ s.title }}</h3>
            <p class="mt-1.5 text-[13px] leading-relaxed text-white/65">{{ s.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════ NEAR YOU (geolocation + API) ══════════════════════ -->
    <NearYouRail />

    <!-- ══════════════════════ REVIEWS (API) ══════════════════════ -->
    <ReviewsSection />

    <!-- ══════════════════════ NEWSLETTER (was a popup) ══════════════════════ -->
    <section class="mx-auto max-w-7xl px-5 py-16">
      <div class="overflow-hidden rounded-lg border border-[#DBE2EA] bg-[#F4F7FB] p-8 sm:p-12">
        <div class="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0450A0]">Fare alerts</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-[#0B1B33] sm:text-3xl">Get the best fares in your inbox.</h2>
            <p class="mt-2 text-sm leading-relaxed text-[#5F7185]">
              Occasional deal alerts and price drops. No spam, unsubscribe any time.
            </p>
          </div>

          <div>
            <form v-if="!subscribed" class="flex flex-col gap-3 sm:flex-row" @submit.prevent="subscribe">
              <input
                v-model="email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full rounded-md border border-[#DBE2EA] bg-white px-4 py-3 text-sm text-[#0B1B33] outline-none transition focus:border-[#0450A0] focus:ring-2 focus:ring-[#0450A0]/15"
              />
              <button
                type="submit"
                :disabled="loading"
                class="shrink-0 rounded-md bg-[#0D1DAD] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#081485] disabled:opacity-60"
              >
                {{ loading ? 'Signing up…' : 'Notify me' }}
              </button>
            </form>

            <div v-else class="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
              <svg class="h-5 w-5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              <p class="text-sm font-semibold text-emerald-800">You're on the list — watch your inbox.</p>
            </div>

            <p v-if="error" class="mt-2 text-[12px] font-medium text-rose-600">{{ error }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════ PARTNERS + CTA ══════════════════════ -->
    <section class="border-t border-[#E6EBF2] bg-white py-12">
      <div class="mx-auto max-w-7xl px-5">
        <p class="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A97A8]">Powered by trusted travel partners</p>
        <PartnerCarousel />
      </div>
    </section>

    <section class="relative overflow-hidden bg-[#0D1DAD]">
      <div class="pointer-events-none absolute -bottom-32 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#1A2ED4]/30 blur-3xl"></div>
      <div class="relative mx-auto max-w-4xl px-5 py-16 text-center">
        <h2 class="text-3xl font-black tracking-tight text-white sm:text-4xl">Ready when you are.</h2>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70">
          Start with a flight, a room, or the whole itinerary — and pay in your own currency.
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/flights" class="rounded-md bg-white text-[#0D1DAD] px-7 py-3 text-sm font-black transition-colors hover:bg-white/90 shadow-lg">Search flights</NuxtLink>
          <NuxtLink to="/packages" class="rounded-md border border-white/30 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">Browse packages</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// `TopHotelDeals` lives in components/stays/, so its auto-import name would be
// `StaysTopHotelDeals` — import it explicitly to keep the short tag name.
import TopHotelDeals from '~/components/stays/TopHotelDeals.vue'
// `DealsRail` lives in components/home/, so its auto-import name would be
// `HomeDealsRail` — import it explicitly to keep the short tag name.
import DealsRail from '~/components/home/DealsRail.vue'
import PromoBanner from '~/components/home/PromoBanner.vue'
import ReviewsSection from '~/components/home/ReviewsSection.vue'
import RewardsBanner from '~/components/home/RewardsBanner.vue'
import NearYouRail from '~/components/home/NearYouRail.vue'

import lifestyleImg from '@/assets/img/travel-lifestyle.webp'

const verticals = [
  {
    to: '/flights', title: 'Flights',
    badge: 'Airlines',
    blurb: 'Live fares from 100+ airlines — one-way, return or multi-city.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
    path: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
  },
  {
    to: '/stays', title: 'Hotels & Stays',
    badge: 'Accommodations',
    blurb: 'City hotels, boutique apartments, luxury resorts and villas.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    path: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  },
  {
    to: '/transfers', title: 'Airport Transfers',
    badge: 'Chauffeur',
    blurb: 'Private & shared airport pickups and drop-offs, door to door.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    path: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  },
  {
    to: '/things-to-do', title: 'Activities & Tours',
    badge: 'Experiences',
    blurb: 'Curated tours, museum passes, and outdoor adventures in top cities.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    path: 'M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z',
  },
  {
    to: '/cars', title: 'Car Rentals',
    badge: 'Vehicles',
    blurb: 'Economy hatchbacks to luxury SUVs with flexible pickup & drop-off.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    path: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z',
  },
  {
    to: '/packages', title: 'Holiday Packages',
    badge: 'Bundle & Save',
    blurb: 'Flight + hotel deals bundled together for maximum travel savings.',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800',
    path: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18 15 15 0 010-18z',
  },
  {
    to: '/cruises', title: 'Luxury Cruises',
    badge: 'Sailings',
    blurb: 'Elite ocean cruises, island sailings, and scenic river expeditions.',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800',
    path: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3',
  },
]

const features = [
  { title: 'Live availability', body: 'Fares and rooms are re-confirmed with the supplier before you pay.' },
  { title: 'No hidden extras', body: 'Taxes and fees are shown up front, so the total is the total.' },
  { title: 'Pay in your currency', body: 'Prices are shown and charged in your local currency at the live rate.' },
  { title: 'Secure by default', body: 'Card details go straight to Stripe and never touch our servers.' },
]

const steps = [
  { title: 'Search', body: 'Tell us where and when. We compare live fares and rates in seconds.' },
  { title: 'Choose', body: 'Compare options side by side and pick the fare or room that suits you.' },
  { title: 'Pay securely', body: 'Enter your details, pay by card, and your confirmation lands in your inbox.' },
]

// ── Inline newsletter (replaces the old auto-opening popup) ───────────────
const config = useRuntimeConfig()
const email = ref('')
const loading = ref(false)
const subscribed = ref(false)
const error = ref('')

onMounted(() => {
  try {
    if (localStorage.getItem('flybeth_newsletter_subscribed') === 'true') subscribed.value = true
  } catch { /* private mode */ }
})

const subscribe = async () => {
  if (!email.value) return
  loading.value = true
  error.value = ''
  try {
    await $fetch(`${config.public.apiBase}/marketing/subscribe`, {
      method: 'POST',
      body: { email: email.value, source: 'landing' },
    })
    subscribed.value = true
    try { localStorage.setItem('flybeth_newsletter_subscribed', 'true') } catch { /* private mode */ }
  } catch (e: any) {
    error.value = e?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
