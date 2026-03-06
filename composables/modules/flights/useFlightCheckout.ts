import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export const useFlightCheckout = () => {
    const loading = ref(false);
    const pricingDetails = ref<any>(null);
    const seatmapDetails = ref<any>(null);
    const error = ref<string | null>(null);

    const priceFlightOffer = async (offer: any, provider: string) => {
        loading.value = true;
        error.value = null;
        try {
            // Frontend sends flightOffer and provider to the backend wrapper
            const payload = {
                flightOffer: offer,
                provider: provider
            };
            const { data } = await flightsApi.priceOffer(payload);
            console.log(data, 'price data here')
            pricingDetails.value = data?.data || data;
            return pricingDetails.value;
        } catch (err: any) {
            console.error('Error pricing flight offer:', err);
            error.value = err.response?.data?.message || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const fetchSeatmaps = async (flightOffer: any, provider: string) => {
        loading.value = true;
        error.value = null;
        try {
            const payload = {
                flightOffer: flightOffer.rawOffer || flightOffer,
                provider
            };
            const { data } = await flightsApi.getSeatmaps(payload);
            console.log(data, 'seatmap data here')
            seatmapDetails.value = data?.data || data;
            return seatmapDetails.value;
        } catch (err: any) {
            console.error('Error fetching seatmaps:', err);
            error.value = err.response?.data?.message || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        pricingDetails,
        seatmapDetails,
        error,
        priceFlightOffer,
        fetchSeatmaps
    };
};
