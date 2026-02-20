import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export const useSearchFlights = () => {
    const loading = ref(false);
    const flights = ref<any[]>([]);
    const searchMeta = ref<any>(null);

    const searchFlights = async (searchData: any) => {
        loading.value = true;
        try {
            const { data, status } = await flightsApi.searchLocal(searchData);
            if (status === 200 || status === 201) {
                flights.value = data.data;
                searchMeta.value = data.meta;
            }
            return data;
        } catch (error) {
            console.error('Error searching flights:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        flights,
        searchMeta,
        searchFlights,
    };
};
