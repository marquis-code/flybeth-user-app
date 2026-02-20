import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export const useGetFlightById = () => {
    const loading = ref(false);
    const selectedFlight = ref<any>(null);

    const getFlightById = async (id: string) => {
        loading.value = true;
        try {
            const { data } = await flightsApi.getById(id);
            selectedFlight.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching flight details:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        selectedFlight,
        getFlightById,
    };
};
