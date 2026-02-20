import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export const useFetchPopularFlights = () => {
    const loading = ref(false);
    const popularFlights = ref<any[]>([]);

    const fetchPopularFlights = async (limit = 10) => {
        loading.value = true;
        try {
            const { data } = await flightsApi.getPopular({ limit });
            popularFlights.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching popular flights:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        popularFlights,
        fetchPopularFlights,
    };
};
