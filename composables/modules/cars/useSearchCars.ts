import { ref, computed } from 'vue';
import { carsApi } from '@/api_factory/modules/cars';

export const useSearchCars = () => {
    const loading = ref(false);
    const cars = ref<any[]>([]);

    // Filter states
    const filters = ref({
        categories: [] as string[],
        transmission: [] as string[],
        fuelTypes: [] as string[],
        priceRange: [0, 1000] as [number, number]
    });

    const searchCars = async (searchParams: any) => {
        loading.value = true;
        cars.value = [];
        try {
            const { data } = await carsApi.search(searchParams);
            cars.value = data?.results || data?.data || data || [];
            return data;
        } catch (error) {
            console.error('Error searching cars:', error);
            cars.value = []; // Reset on error
        } finally {
            loading.value = false;
        }
    };

    const filteredCars = computed(() => {
        if (!cars.value.length) return [];

        return cars.value.filter(car => {
            // Category Filter
            if (filters.value.categories.length > 0 && !filters.value.categories.includes(car.category)) {
                return false;
            }

            // Transmission Filter
            if (filters.value.transmission.length > 0 && !filters.value.transmission.includes(car.transmission)) {
                return false;
            }

            // Fuel Type Filter
            if (filters.value.fuelTypes.length > 0 && !filters.value.fuelTypes.includes(car.fuelType)) {
                return false;
            }

            // Price Filter
            const price = parseFloat(car.pricing?.basePrice || car.price) || 0;
            if (price < filters.value.priceRange[0] || price > filters.value.priceRange[1]) {
                return false;
            }

            return true;
        });
    });

    return {
        loading,
        cars,
        filteredCars,
        filters,
        searchCars,
    };
};
