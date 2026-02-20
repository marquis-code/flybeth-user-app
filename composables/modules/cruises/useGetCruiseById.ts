import { ref } from 'vue';
import { cruisesApi } from '@/api_factory/modules/cruises';

export const useGetCruiseById = () => {
    const loading = ref(false);
    const selectedCruise = ref<any>(null);

    const getCruiseById = async (id: string) => {
        loading.value = true;
        try {
            const { data } = await cruisesApi.getById(id);
            selectedCruise.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching cruise details:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        selectedCruise,
        getCruiseById,
    };
};
