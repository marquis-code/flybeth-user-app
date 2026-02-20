import { ref } from 'vue';
import { cruisesApi } from '@/api_factory/modules/cruises';

export const useSearchCruises = () => {
    const loading = ref(false);
    const cruises = ref<any[]>([]);

    const searchCruises = async (params: any) => {
        loading.value = true;
        try {
            const { data } = await cruisesApi.search(params);
            cruises.value = data;
            return data;
        } catch (error) {
            console.error('Error searching cruises:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        cruises,
        searchCruises,
    };
};
