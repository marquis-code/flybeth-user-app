import { ref, computed } from 'vue';
import { cruisesApi } from '@/api_factory/modules/cruises';

export const useSearchCruises = () => {
    const loading = ref(false);
    const cruises = ref<any[]>([]);

    // Filter states
    const filters = ref({
        lines: [] as string[],
        lengths: [] as string[],
        priceRange: [0, 5000] as [number, number]
    });

    const searchCruises = async (searchParams: any) => {
        loading.value = true;
        cruises.value = [];
        
        // Ensure we don't send illegal property like departureDate
        const { departureDate, destinationLabel, departingLabel, lengthLabel, lineLabel, ...cleanParams } = searchParams;
        
        try {
            const { data } = await cruisesApi.search(cleanParams);
            // Handle different data shapes
            cruises.value = data?.results || data?.data || (Array.isArray(data) ? data : []);
            return data;
        } catch (error) {
            console.error('Error searching cruises:', error);
            cruises.value = []; // Reset on error
        } finally {
            loading.value = false;
        }
    };

    const filteredCruises = computed(() => {
        if (!cruises.value.length) return [];

        return cruises.value.filter(cruise => {
            // Cruise Line Filter
            if (filters.value.lines.length > 0 && !filters.value.lines.includes(cruise.cruiseLineId)) {
                return false;
            }

            // Length Filter (Duration in nights)
            if (filters.value.lengths.length > 0) {
               // Map length values (1=1-2, 2=3-5, 3=6-8, 4=9-11, 5=12+)
               const duration = parseInt(cruise.duration) || 0;
               const matches = filters.value.lengths.some(l => {
                  if (l === '1') return duration >= 1 && duration <= 2;
                  if (l === '2') return duration >= 3 && duration <= 5;
                  if (l === '3') return duration >= 6 && duration <= 8;
                  if (l === '4') return duration >= 9 && duration <= 11;
                  if (l === '5') return duration >= 12;
                  return false;
               });
               if (!matches) return false;
            }

            // Price Filter
            const price = parseFloat(cruise.pricing?.startingPrice || cruise.price) || 0;
            if (price < filters.value.priceRange[0] || price > filters.value.priceRange[1]) {
                return false;
            }

            return true;
        });
    });

    return {
        loading,
        cruises,
        filteredCruises,
        filters,
        searchCruises,
    };
};
