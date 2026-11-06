<template>
  <div class="min-h-screen bg-white">
    <!-- ══════════════════ HERO ══════════════════ -->
    <section class="relative overflow-hidden bg-[#070B2A]">
      <div class="pointer-events-none absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-[#0D1DAD]/40 blur-3xl"></div>
      <div class="pointer-events-none absolute top-10 right-0 h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-3xl"></div>
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.07]"
        style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:56px 56px;"
      ></div>

      <div class="relative mx-auto max-w-6xl px-5 pt-14 pb-10 sm:pt-20">
        <div class="mx-auto max-w-3xl text-center">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
            Flights · Hotels · Transfers · Activities · Cars · Packages
          </span>

          <h1 class="mt-6 text-[2.5rem] font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
            The whole trip,
            <span class="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">booked in one place.</span>
          </h1>

          <p class="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:text-base">
            Search live fares and real availability across flights, stays, airport transfers,
            things to do, car hire and complete packages — then pay securely in your own currency.
          </p>
        </div>

        <div class="mx-auto mt-9 max-w-4xl">
          <div class="rounded-[28px] bg-white p-3 shadow-2xl shadow-black/30 ring-1 ring-white/10 sm:p-4">
            <SearchWidget />
          </div>
        </div>

        <div class="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[12px] font-semibold text-white/55">
          <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Live supplier inventory</span>
          <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Secure card payments</span>
          <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Price you see is the price you pay</span>
          <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>24/7 human support</span>
        </div>
      </div>
    </section>

    <!-- ══════════════════ SIX WAYS TO TRAVEL ══════════════════ -->
    <section class="mx-auto max-w-6xl px-5 py-16">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D1DAD]">Every part of the journey</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Six ways to travel. One checkout.</h2>
        </div>
        <p class="max-w-sm text-sm leading-relaxed text-slate-500">
          Book a single flight or the entire trip. Everything shares the same secure checkout.
        </p>
      </div>

      <div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="v in verticals"
          :key="v.to"
          :to="v.to"
          class="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
        >
          <div class="flex items-start justify-between">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" :class="v.tint">
              {{ v.icon }}
            </div>
            <span class="text-slate-300 transition-transform group-hover:translate-x-1">→</span>
          </div>
          <h3 class="mt-5 text-lg font-bold text-slate-900">{{ v.title }}</h3>
          <p class="mt-1.5 text-[13px] leading-relaxed text-slate-500">{{ v.blurb }}</p>
          <p class="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#0D1DAD] opacity-0 transition-opacity group-hover:opacity-100">
            Search {{ v.title.toLowerCase() }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- ══════════════════ WHY FLYBETH ══════════════════ -->
    <section class="border-y border-slate-100 bg-slate-50/70">
      <div class="mx-auto max-w-6xl px-5 py-16">
        <div class="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D1DAD]">Why travellers choose us</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Real prices. Real availability. No surprises at checkout.
            </h2>
            <p class="mt-4 text-sm leading-relaxed text-slate-600">
              We aggregate live inventory and re-price every fare before you pay, so the total on the
              summary is exactly what reaches your card — taxes, fees and extras included.
            </p>
            <NuxtLink to="/deals" class="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0D1DAD] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0A1485]">
              See today's deals <span>→</span>
            </NuxtLink>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="f in features" :key="f.title" class="rounded-2xl border border-slate-200 bg-white p-5">
              <div class="text-xl">{{ f.icon }}</div>
              <h3 class="mt-3 text-sm font-bold text-slate-900">{{ f.title }}</h3>
              <p class="mt-1 text-[12.5px] leading-relaxed text-slate-500">{{ f.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════ DESTINATIONS ══════════════════ -->
    <section class="mx-auto max-w-6xl px-5 py-16">
      <div class="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D1DAD]">Where to next</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Popular right now</h2>
        </div>
      </div>
      <CityDealsGrid />
    </section>

    <!-- ══════════════════ HOTELS ══════════════════ -->
    <section class="border-t border-slate-100 bg-white">
      <div class="mx-auto max-w-6xl px-5 py-16">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D1DAD]">Stays</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Hand-picked places to stay</h2>
          </div>
          <NuxtLink to="/stays" class="text-sm font-bold text-[#0D1DAD] hover:underline">Browse all hotels →</NuxtLink>
        </div>
        <TopHotelDeals destination-name="London" :lat="51.5074" :lng="-0.1278" />
      </div>
    </section>

    <!-- ══════════════════ ACTIVITIES ══════════════════ -->
    <section class="border-t border-slate-100 bg-slate-50/70">
      <div class="mx-auto max-w-6xl px-5 py-16">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D1DAD]">Things to do</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Experiences worth the trip</h2>
          </div>
          <NuxtLink to="/things-to-do" class="text-sm font-bold text-[#0D1DAD] hover:underline">Explore activities →</NuxtLink>
        </div>
        <TrendingActivities />
      </div>
    </section>

    <!-- ══════════════════ HOW IT WORKS ══════════════════ -->
    <section class="mx-auto max-w-6xl px-5 py-16">
      <p class="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D1DAD]">Simple by design</p>
      <h2 class="mt-2 text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Book in three steps</h2>
      <div class="mt-10 grid gap-4 md:grid-cols-3">
        <div v-for="(s, i) in steps" :key="s.title" class="relative rounded-3xl border border-slate-200 bg-white p-7">
          <span class="text-4xl font-black text-slate-100">0{{ i + 1 }}</span>
          <h3 class="mt-2 text-base font-bold text-slate-900">{{ s.title }}</h3>
          <p class="mt-1.5 text-[13px] leading-relaxed text-slate-500">{{ s.body }}</p>
        </div>
      </div>
    </section>

    <!-- ══════════════════ PARTNERS ══════════════════ -->
    <section class="border-y border-slate-100 bg-white py-12">
      <div class="mx-auto max-w-6xl px-5">
        <p class="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Powered by trusted travel partners</p>
        <PartnerCarousel />
      </div>
    </section>

    <!-- ══════════════════ CTA ══════════════════ -->
    <section class="relative overflow-hidden bg-[#070B2A]">
      <div class="pointer-events-none absolute -bottom-32 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#0D1DAD]/40 blur-3xl"></div>
      <div class="relative mx-auto max-w-4xl px-5 py-16 text-center">
        <h2 class="text-3xl font-black tracking-tight text-white sm:text-4xl">Ready when you are.</h2>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65">
          Start with a flight, a room, or the whole itinerary — and pay in your own currency.
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/flights" class="rounded-full bg-white px-7 py-3 text-sm font-bold text-[#070B2A] transition-transform hover:scale-[1.02]">
            Search flights
          </NuxtLink>
          <NuxtLink to="/packages" class="rounded-full border border-white/25 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
            Browse packages
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// `TopHotelDeals` lives in components/stays/, so its auto-import name is
// `StaysTopHotelDeals` — import it explicitly to keep the short tag name.
import TopHotelDeals from '~/components/stays/TopHotelDeals.vue'

const verticals = [
  { to: '/flights',      icon: '✈️', title: 'Flights',      blurb: 'Live fares from 100+ airlines, one-way, return or multi-city.', tint: 'bg-sky-50' },
  { to: '/stays',        icon: '🏨', title: 'Hotels',       blurb: 'City hotels, apartments, resorts and villas with real rates.',   tint: 'bg-amber-50' },
  { to: '/transfers',    icon: '🚕', title: 'Transfers',    blurb: 'Private and shared airport pickups and drop-offs.',              tint: 'bg-emerald-50' },
  { to: '/things-to-do', icon: '🎟️', title: 'Activities',  blurb: 'Tours, tickets and experiences in hundreds of cities.',          tint: 'bg-rose-50' },
  { to: '/cars',         icon: '🚗', title: 'Car Rentals',  blurb: 'Economy to luxury, with flexible pickup and drop-off.',          tint: 'bg-indigo-50' },
  { to: '/packages',     icon: '🌴', title: 'Packages',     blurb: 'Flights, hotel and extras bundled at a lower total.',            tint: 'bg-teal-50' },
]

const features = [
  { icon: '🔒', title: 'Secure payments', body: 'Card payments processed by Stripe. Your card details never touch our servers.' },
  { icon: '💱', title: 'Pay in your currency', body: 'Prices shown and charged in your local currency at the live exchange rate.' },
  { icon: '⚡', title: 'Live availability', body: 'We re-confirm the fare and availability with the airline before you pay.' },
  { icon: '🎧', title: 'Real humans', body: 'Flight disrupted or plans changed? Our support team is reachable 24/7.' },
]

const steps = [
  { title: 'Search', body: 'Tell us where and when. We compare live fares and rates in seconds.' },
  { title: 'Choose', body: 'Compare options side by side, then pick the fare or room that suits you.' },
  { title: 'Pay securely', body: 'Enter your details and pay by card. Your confirmation lands in your inbox.' },
]
</script>
