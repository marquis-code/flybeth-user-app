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

    /**
     * Customer-facing price. `priceWithCommission` is what the traveller pays
     * (the backend applies the customer commission); `cheapestPrice` is NET.
     */
    const customerPrice = (s: any) => Number(s?.priceWithCommission || 0);

    const minPriceLimit = computed(() => {
        if (!stays.value.length) return 0;
        return Math.floor(Math.min(...stays.value.map(s => customerPrice(s))));
    });

    const maxPriceLimit = computed(() => {
        if (!stays.value.length) return 2000;
        return Math.ceil(Math.max(...stays.value.map(s => customerPrice(s))));
    });

    const filteredStays = computed(() => {
        let result = [...stays.value];

        // Filter by name
        if (filters.name) {
            const search = filters.name.toLowerCase();
            result = result.filter(s => s.name.toLowerCase().includes(search));
        }

        // Filter by price (customer-facing total)
        result = result.filter(s => customerPrice(s) <= filters.maxPrice);

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
            // The backend exposes the property type directly on each result
            // ('hotel' | 'apartment' | 'villa' | 'resort' | 'cabin'). Amenity
            // `type` values are upper-cased amenity names (WIFI, POOL, ...), so
            // they must never be used to infer the property type.
            const wanted = filters.types.map((t: any) => String(t).toLowerCase().trim())
            result = result.filter(s => {
                const stayType = String(s.type || s.propertyType || '').toLowerCase().trim()
                return !!stayType && wanted.includes(stayType)
            })
        }

        // Sort
        if (sortBy.value === 'price-low') {
            result.sort((a, b) => customerPrice(a) - customerPrice(b));
        } else if (sortBy.value === 'price-high') {
            result.sort((a, b) => customerPrice(b) - customerPrice(a));
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
                    longitude: Number(searchData.lng),
                    radius: 20
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
