import { ref, computed } from 'vue';
import { carsApi } from '@/api_factory/modules/cars';
import {
    carTotalPrice,
    carCategory,
    carTransmission,
    carFuelType,
    carMatchesAny,
} from './carFields';

export const useSearchCars = () => {
    const loading = ref(false);
    const cars = ref<any[]>([]);

    // Filter states
    const filters = ref({
        categories: [] as string[],
        transmission: [] as string[],
        fuelTypes: [] as string[],
        // Unbounded by default: the page owns the price slider. A finite default
        // silently dropped every car whose rental total exceeded it.
        priceRange: [0, Number.POSITIVE_INFINITY] as [number, number]
    });

    const searchCars = async (searchParams: any) => {
        loading.value = true;
        cars.value = [];
        try {
            const { data } = await carsApi.search(searchParams);
            
            // The backend returns { data: { dbResults: [], liveResults: [] } }
            let results: any[] = [];
            if (data?.data && Array.isArray(data.data.dbResults)) {
                results = [...data.data.dbResults, ...(data.data.liveResults || [])];
            } else if (Array.isArray(data?.data)) {
                results = data.data;
            } else {
                results = data?.results || data || [];
            }
            
            cars.value = results;
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
            if (!carMatchesAny(carCategory(car), filters.value.categories)) {
                return false;
            }

            // Transmission Filter
            if (!carMatchesAny(carTransmission(car), filters.value.transmission)) {
                return false;
            }

            // Fuel Type Filter
            if (!carMatchesAny(carFuelType(car), filters.value.fuelTypes)) {
                return false;
            }

            // Price Filter — normalised total for the rental period so both the
            // platform shape (`price` / `pricing.total`) and the live provider
            // shape (`price.totalAmount`) are understood.
            const price = carTotalPrice(car);
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
