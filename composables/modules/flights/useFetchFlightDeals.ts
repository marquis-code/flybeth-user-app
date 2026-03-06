import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export const useFetchFlightDeals = () => {
    const loading = ref(false);
    const flightDeals = ref<any[]>([]);

    const fetchFlightDeals = async (limit = 10) => {
        loading.value = true;
        try {
            const { data: res } = await flightsApi.getDeals({ limit });
            // API returns { success: true, data: [...] }
            flightDeals.value = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
            return flightDeals.value;
        } catch (error) {
            console.error('Error fetching flight deals:', error);
            flightDeals.value = [];
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
