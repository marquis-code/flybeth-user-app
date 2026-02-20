import { ref } from 'vue';
import { carsApi } from '@/api_factory/modules/cars';

export const useSearchCars = () => {
    const loading = ref(false);
    const cars = ref<any[]>([]);

    const searchCars = async (searchParams: any) => {
        loading.value = true;
        try {
            const { data } = await carsApi.search(searchParams);
            cars.value = data;
            return data;
        } catch (error) {
            console.error('Error searching cars:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        cars,
        searchCars,
    };
};
