import { ref } from 'vue';
import { carsApi } from '@/api_factory/modules/cars';

export const useFetchAllCars = () => {
    const loading = ref(false);
    const cars = ref<any[]>([]);

    const fetchAllCars = async () => {
        loading.value = true;
        try {
            const { data } = await carsApi.getAll();
            cars.value = data;
        } catch (error) {
            console.error('Error fetching all cars:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        cars,
        fetchAllCars,
    };
};
