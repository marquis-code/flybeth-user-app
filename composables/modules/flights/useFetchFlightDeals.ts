import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export const useFetchFlightDeals = () => {
    const loading = ref(false);
    const flightDeals = ref<any[]>([]);

    const fetchFlightDeals = async (limit = 10) => {
        loading.value = true;
        try {
            const { data } = await flightsApi.getDeals({ limit });
            flightDeals.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching flight deals:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        flightDeals,
        fetchFlightDeals,
    };
};
