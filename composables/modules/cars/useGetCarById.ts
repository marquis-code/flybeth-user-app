import { ref } from 'vue';
import { carsApi } from '@/api_factory/modules/cars';

export const useGetCarById = () => {
    const loading = ref(false);
    const selectedCar = ref<any>(null);

    const getCarById = async (id: string) => {
        loading.value = true;
        try {
            const { data } = await carsApi.getById(id);
            selectedCar.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching car details:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        selectedCar,
        getCarById,
    };
};
