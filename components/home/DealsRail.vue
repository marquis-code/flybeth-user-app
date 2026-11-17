<template>
  <section class="mx-auto max-w-7xl px-5 py-14">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black tracking-tight text-[#0B1B33] sm:text-3xl">
          {{ heading }}
        </h2>
        <p v-if="caption || lastFoundLabel" class="mt-1 text-[12px] text-[#8A97A8]">{{ caption || lastFoundLabel }}</p>
      </div>

      <div class="flex items-center gap-1 rounded-md border border-[#DBE2EA] bg-white p-1">
        <button
          v-for="t in tabs"
          :key="t.value"
          type="button"
          class="rounded px-3 py-1.5 text-[12px] font-bold transition-colors"
          :class="tab === t.value ? 'bg-[#0450A0] text-white' : 'text-[#5F7185] hover:bg-[#F4F7FB]'"
          @click="selectTab(t.value)"
        >{{ t.label }}</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="n in 4" :key="n" class="animate-pulse overflow-hidden rounded-lg border border-[#DBE2EA] bg-white">
        <div class="h-24 bg-[#EEF2F7]" />
        <div class="space-y-2 p-4">
          <div class="h-3 w-2/3 rounded bg-[#EEF2F7]" />
          <div class="h-3 w-1/2 rounded bg-[#F4F7FB]" />
        </div>
      </div>
    </div>

    <!-- Empty: we never invent fares, so say so plainly -->
    <p v-else-if="!deals.length" class="mt-6 rounded-lg border border-dashed border-[#DBE2EA] bg-[#F4F7FB] px-5 py-8 text-center text-sm text-[#5F7185]">
      {{ emptyMessage }}
    </p>

    <!-- Deals -->
    <div v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="deal in deals"
        :key="`${deal.origin}-${deal.destination}-${deal.provider}-${deal.offerId}`"
        :to="dealLink(deal)"
        class="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0D1DAD]/40 hover:shadow-xl flex flex-col"
      >
        <div class="relative h-28 overflow-hidden bg-[#0D1DAD]">
          <img
            :src="getCityImage(deal.destination, deal.city)"
            :alt="deal.city || deal.destination"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0D1DAD] via-[#0D1DAD]/40 to-black/20"></div>

          <span class="absolute bottom-2.5 left-3 text-[11px] font-black uppercase tracking-[0.14em] text-white/90 drop-shadow-sm flex items-center gap-1.5">
            <span>{{ deal.origin }}</span>
            <span class="text-white/60">→</span>
            <span>{{ deal.destination }}</span>
          </span>
          <img
            v-if="deal.airlineLogo"
            :src="deal.airlineLogo"
            :alt="deal.airline"
            class="absolute right-2.5 top-2.5 h-6 w-6 rounded-md bg-white/95 object-contain p-0.5 shadow-sm"
            loading="lazy"
          />
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-baseline justify-between gap-2">
              <h3 class="truncate text-[15px] font-extrabold text-[#0B1B33] group-hover:text-[#0D1DAD] transition-colors">
                {{ deal.city || deal.destination }}
              </h3>
              <p class="shrink-0 text-[16px] font-black text-[#0D1DAD]">
                {{ formatPrice(deal.price) }}<sup class="text-[9px]">*</sup>
              </p>
            </div>
            <p class="mt-0.5 text-[12px] font-semibold text-[#5F7185]">{{ deal.airline }}</p>
          </div>
          <p class="mt-2.5 text-[11px] font-bold text-gray-400 flex items-center justify-between border-t border-gray-100 pt-2">
            <span>{{ dateLabel(deal) }}</span>
            <span class="text-[#0D1DAD] font-bold group-hover:translate-x-0.5 transition-transform">Book →</span>
          </p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFeaturedDeals, type FeaturedDeal } from '@/composables/modules/flights/useFeaturedDeals';
import { useSettings } from '@/composables/useSettings';

const props = defineProps<{
  origin?: string;
  limit?: number;
  /** Override for the rail title (e.g. "Flight deals departing near you"). */
  title?: string;
  /** Optional line under the title instead of the rates timestamp. */
  caption?: string;
}>();

const { formatPrice } = useSettings();
const { deals, loading, error, lastFoundAt, fetchFeaturedDeals } = useFeaturedDeals();

const origin = computed(() => (props.origin || 'LOS').toUpperCase());

const cityImages: Record<string, string> = {
  ABV: 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?auto=format&fit=crop&q=80&w=600', // Abuja
  LOS: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=600', // Lagos
  PHC: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=600', // Port Harcourt
  ACC: 'https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?auto=format&fit=crop&q=80&w=600', // Accra
  LHR: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600', // London
  LON: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600', // London
  DXB: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600', // Dubai
  JFK: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600', // New York
  NYC: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600', // New York
  CDG: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600', // Paris
  PAR: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600', // Paris
  NBO: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600', // Nairobi
  JNB: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&q=80&w=600', // Johannesburg
}
const defaultCityImage = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600'

const getCityImage = (code?: string, city?: string) => {
  if (code && cityImages[code.toUpperCase()]) return cityImages[code.toUpperCase()]
  return defaultCityImage
}
const limit = computed(() => props.limit || 8);

const tabs = [
  { label: 'Round trip', value: 'round-trip' as const },
  { label: 'One way', value: 'one-way' as const },
];
const tab = ref<'round-trip' | 'one-way'>('round-trip');

const heading = computed(() => {
  if (props.title) return props.title;
  if (!deals.value.length) return 'Travel deals';
  const top = Math.ceil(Math.max(...deals.value.map((d) => d.price)));
  // formatPrice includes cents; a headline reads better without them.
  return `Travel deals under ${formatPrice(top).replace(/[.,]00$/, '')}`;
});

const caption = computed(() => props.caption || '');
const lastFoundLabel = computed(() => {
  if (!lastFoundAt.value) return '';
  const d = new Date(lastFoundAt.value);
  if (Number.isNaN(d.getTime())) return '';
  return `Rates last found on ${d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  })}`;
});

const shortDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y!, m! - 1, d!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const dateLabel = (deal: FeaturedDeal) =>
  deal.returnDate ? `${shortDate(deal.departureDate)} – ${shortDate(deal.returnDate)}` : shortDate(deal.departureDate);

const dealLink = (deal: FeaturedDeal) => ({
  path: '/flights',
  query: {
    origin: deal.origin,
    destination: deal.destination,
    departureDate: deal.departureDate,
    ...(deal.returnDate ? { returnDate: deal.returnDate } : {}),
  },
});

const emptyMessage = computed(() =>
  error.value
    ? 'Live deals are unavailable right now — search above for today\'s fares.'
    : 'No live deals for this origin right now — search above for today\'s fares.',
);

const selectTab = (value: 'round-trip' | 'one-way') => {
  if (tab.value === value) return;
  tab.value = value;
  fetchFeaturedDeals(origin.value, value, limit.value);
};

onMounted(() => fetchFeaturedDeals(origin.value, tab.value, limit.value));
</script>
