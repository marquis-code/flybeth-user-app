<template>
  <section class="mx-auto max-w-7xl px-5 py-14">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black tracking-tight text-[#0B1B33] sm:text-3xl">
          {{ heading }}
        </h2>
        <p v-if="lastFoundLabel" class="mt-1 text-[12px] text-[#8A97A8]">{{ lastFoundLabel }}</p>
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
        class="group overflow-hidden rounded-lg border border-[#DBE2EA] bg-white transition-all hover:-translate-y-0.5 hover:border-[#0450A0]/40 hover:shadow-lg"
      >
        <div class="relative h-24 bg-gradient-to-br from-[#0450A0] to-[#03396F]">
          <span class="absolute bottom-2 left-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">
            {{ deal.origin }} → {{ deal.destination }}
          </span>
          <img
            v-if="deal.airlineLogo"
            :src="deal.airlineLogo"
            :alt="deal.airline"
            class="absolute right-2 top-2 h-6 w-6 rounded bg-white/95 object-contain p-0.5"
            loading="lazy"
          />
        </div>

        <div class="p-4">
          <div class="flex items-baseline justify-between gap-2">
            <h3 class="truncate text-[15px] font-bold text-[#0B1B33]">{{ deal.city }}</h3>
            <p class="shrink-0 text-[17px] font-black text-[#EB4405]">{{ formatPrice(deal.price) }}<sup class="text-[9px]">*</sup></p>
          </div>
          <p class="mt-0.5 text-[12px] text-[#5F7185]">{{ deal.airline }}</p>
          <p class="mt-2 text-[12px] font-medium text-[#44546A]">{{ dateLabel(deal) }}</p>
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
}>();

const { formatPrice } = useSettings();
const { deals, loading, error, lastFoundAt, fetchFeaturedDeals } = useFeaturedDeals();

const origin = computed(() => (props.origin || 'LOS').toUpperCase());
const limit = computed(() => props.limit || 8);

const tabs = [
  { label: 'Round trip', value: 'round-trip' as const },
  { label: 'One way', value: 'one-way' as const },
];
const tab = ref<'round-trip' | 'one-way'>('round-trip');

const heading = computed(() => {
  if (!deals.value.length) return 'Travel deals';
  const top = Math.ceil(Math.max(...deals.value.map((d) => d.price)));
  // formatPrice includes cents; a headline reads better without them.
  return `Travel deals under ${formatPrice(top).replace(/[.,]00$/, '')}`;
});

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
