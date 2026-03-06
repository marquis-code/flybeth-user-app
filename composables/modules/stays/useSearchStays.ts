import { ref, computed, reactive } from 'vue';
import { staysApi } from '@/api_factory/modules/stays';

export const useSearchStays = () => {
    const loading = ref(false);
    const stays = ref<any[]>([]);
    const sortBy = ref('price-low'); // price-low, price-high, rating

    const filters = reactive({
        name: '',
        maxPrice: 2000,
        ratings: [] as number[],
        amenities: [] as string[],
        types: [] as string[]
    });

    const minPriceLimit = computed(() => {
        if (!stays.value.length) return 0;
        return Math.floor(Math.min(...stays.value.map(s => s.priceWithCommission)));
    });

    const maxPriceLimit = computed(() => {
        if (!stays.value.length) return 2000;
        return Math.ceil(Math.max(...stays.value.map(s => s.priceWithCommission)));
    });

    const filteredStays = computed(() => {
        let result = [...stays.value];

        // Filter by name
        if (filters.name) {
            const search = filters.name.toLowerCase();
            result = result.filter(s => s.name.toLowerCase().includes(search));
        }

        // Filter by price
        result = result.filter(s => s.priceWithCommission <= filters.maxPrice);

        // Filter by rating
        if (filters.ratings.length) {
            result = result.filter(s => {
                const stayRating = Math.floor(s.rating || 0);
                return filters.ratings.includes(stayRating);
            });
        }

        // Filter by Amenities
        if (filters.amenities.length) {
            result = result.filter(s => {
                if (!s.amenities || !Array.isArray(s.amenities)) return false;
                // Check if all selected amenities are present in the stay's amenities
                return filters.amenities.every(a =>
                    s.amenities.some((sa: any) =>
                        sa.code === a ||
                        sa.name?.toUpperCase() === a ||
                        sa.type === a
                    )
                );
            });
        }

        // Filter by Type
        if (filters.types.length) {
            result = result.filter(s => {
                const type = (s.type || (s.amenities?.some((a: any) => a.type === 'HOTEL') ? 'Hotel' : 'Apartment'));
                return filters.types.includes(type);
            });
        }

        // Sort
        if (sortBy.value === 'price-low') {
            result.sort((a, b) => a.priceWithCommission - b.priceWithCommission);
        } else if (sortBy.value === 'price-high') {
            result.sort((a, b) => b.priceWithCommission - a.priceWithCommission);
        } else if (sortBy.value === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        return result;
    });

    const searchStays = async (searchData: any) => {
        loading.value = true;
        try {
            const adultsCount = searchData.adults || 2;
            const childrenCount = searchData.children || 0;

            const guests = [
                ...Array.from({ length: adultsCount }).map(() => ({ type: 'adult' })),
                ...Array.from({ length: childrenCount }).map(() => ({ type: 'child', age: 7 }))
            ];

            const payload: any = {
                checkInDate: searchData.checkIn,
                checkOutDate: searchData.checkOut,
                guests: guests,
                rooms: searchData.rooms || 1
            };

            if (searchData.locationId) {
                payload.accommodationId = searchData.locationId;
            } else if (searchData.lat && searchData.lng) {
                payload.location = {
                    latitude: Number(searchData.lat),
                    longitude: Number(searchData.lng)
                };
            }

            if (!payload.checkOutDate && payload.checkInDate) {
                const checkIn = new Date(payload.checkInDate);
                checkIn.setDate(checkIn.getDate() + 1);
                payload.checkOutDate = checkIn.toISOString().split('T')[0];
            }

            const { data: response } = await staysApi.searchLive(payload);
            const responseData = response?.data || response;
            const results = responseData?.results || (Array.isArray(responseData) ? responseData : []);
            stays.value = Array.isArray(results) ? results : [];

            // Auto-update max price filter on new search
            if (results.length) {
                filters.maxPrice = maxPriceLimit.value;
            }

            return responseData;
        } catch (error) {
            console.error('Error searching stays:', error);
            stays.value = [];
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        stays: filteredStays,
        rawStays: stays,
        filters,
        sortBy,
        minPriceLimit,
        maxPriceLimit,
        searchStays,
    };
};
