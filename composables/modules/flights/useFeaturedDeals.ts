import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export interface FeaturedDeal {
  origin: string;
  destination: string;
  city: string;
  price: number;
  currency: string;
  airline: string;
  airlineLogo?: string;
  departureDate: string;
  returnDate?: string;
  provider: string;
  offerId: string;
  lastFoundAt: string;
}

/**
 * Landing-page deal rail data.
 *
 * Every card is a real supplier offer: the API searches the routes server-side,
 * keeps the cheapest result per route, caches for 3h and resolves city names from
 * our airport reference data. Nothing here is mocked.
 */
export const useFeaturedDeals = () => {
  const deals = ref<FeaturedDeal[]>([]);
  const loading = ref(false);
  const error = ref('');
  const lastFoundAt = ref<string | null>(null);

  const fetchFeaturedDeals = async (
    origin = 'LOS',
    tripType: 'all' | 'round-trip' | 'one-way' = 'all',
    limit = 8,
  ) => {
    loading.value = true;
    error.value = '';
    try {
      const apiTripType = tripType === 'all' ? 'round-trip' : tripType;
      const res: any = await flightsApi.getFeaturedDeals({ origin, tripType: apiTripType, limit });
      const payload = res?.data?.data ?? res?.data ?? [];
      deals.value = Array.isArray(payload) ? payload : [];
      const newest = deals.value
        .map((d) => d.lastFoundAt)
        .filter(Boolean)
        .sort()
        .pop();
      lastFoundAt.value = newest || null;
      return deals.value;
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Could not load deals';
      deals.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };

  return { deals, loading, error, lastFoundAt, fetchFeaturedDeals };
};
