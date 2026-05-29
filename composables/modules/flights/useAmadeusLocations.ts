// import { ref } from 'vue';
// import { flightsApi } from '@/api_factory/modules/flights';

// export const useAmadeusLocations = () => {
//     const locations = ref<any[]>([]);
//     const loading = ref(false);
//     const error = ref<string | null>(null);

//     const searchLocations = async (keyword: string, countryCode?: string) => {
//         if (!keyword || keyword.length < 2) {
//             locations.value = [];
//             return;
//         }

//         loading.value = true;
//         error.value = null;

//         try {
//             const response = await flightsApi.searchAirports(keyword, countryCode);
//             // The API returns { success: true, data: [...] }
//             locations.value = response.data?.data || [];
//         } catch (err: any) {
//             if (err?.name !== 'CanceledError' && err?.code !== 'ERR_CANCELED') {
//                 console.error('Error fetching locations:', err);
//                 error.value = err.message || 'Failed to fetch locations';
//             }
//             locations.value = [];
//         } finally {
//             loading.value = false;
//         }
//     };

//     const detectNearestAirports = async (lat: number, lng: number) => {
//         loading.value = true;
//         error.value = null;

//         try {
//             const response = await flightsApi.getNearestAirports(lat, lng);
//             const data = response.data?.data || [];
//             locations.value = data;
//             return data;
//         } catch (err: any) {
//             console.error('Error detecting nearest airports:', err);
//             error.value = err.message || 'Failed to detect nearest airports';
//             return [];
//         } finally {
//             loading.value = false;
//         }
//     };

//     return {
//         locations,
//         loading,
//         error,
//         searchLocations,
//         detectNearestAirports
//     };
// };


import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

const LOG_PREFIX = '[useAmadeusLocations]';

export const useAmadeusLocations = () => {
    const locations = ref<any[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const searchLocations = async (keyword: string, countryCode?: string) => {
        console.log(`${LOG_PREFIX} searchLocations called`, { keyword, countryCode });

        if (!keyword || keyword.length < 2) {
            console.warn(`${LOG_PREFIX} Keyword too short (< 2 chars), clearing. keyword="${keyword}"`);
            locations.value = [];
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            // LAYER 1: Primary search using Duffel
            console.log(`${LOG_PREFIX} ➡️ Attempt 1: GET Duffel places suggestions`);
            const response = await flightsApi.getDuffelPlacesSuggestions({ query: keyword });
            
            const rawData = response.data?.data || response.data || [];
            const results = Array.isArray(rawData) ? rawData : [];

            // Map Duffel places to expected shape
            const mappedResults = results.map((item: any) => ({
                ...item,
                iataCode: item.iata_code || item.iataCode || item.code || item.id,
                name: item.name || item.city_name || item.cityName,
                address: {
                   cityName: item.city_name || item.cityName || item.name
                },
                subType: item.type === 'airport' ? 'AIRPORT' : 'CITY'
            })).filter((item: any) => item.iataCode); // Ensure we only return locations with an IATA code

            console.log(`${LOG_PREFIX} Found ${mappedResults.length} results after Duffel search.`);
            locations.value = mappedResults;
        } catch (err: any) {
            if (err?.name !== 'CanceledError' && err?.code !== 'ERR_CANCELED') {
                console.error(`${LOG_PREFIX} ❌ API error:`, err?.message);
                error.value = err.message || 'Failed to fetch locations';
            }
            locations.value = [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * Helper to extract results from various response shapes
     */
    const extractResults = (response: any): any[] => {
        if (Array.isArray(response?.data?.data)) return response.data.data;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.data?.data?.data)) return response.data.data.data;
        return [];
    };

    const detectNearestAirports = async (lat: number, lng: number) => {
        console.log(`${LOG_PREFIX} detectNearestAirports called`, { lat, lng });
        loading.value = true;
        error.value = null;

        try {
            console.log(`${LOG_PREFIX} ➡️  Calling API: GET /flights/airports/nearest?lat=${lat}&lng=${lng}`);
            const response = await flightsApi.getNearestAirports(lat, lng);

            console.log(`${LOG_PREFIX} Nearest airports raw response:`, response);
            console.log(`${LOG_PREFIX} response.data:`, response?.data);

            let data: any[] = [];
            if (Array.isArray(response?.data?.data)) {
                data = response.data.data;
                console.log(`${LOG_PREFIX} ✅ Nearest: shape=response.data.data, count=${data.length}`);
            } else if (Array.isArray(response?.data)) {
                data = response.data;
                console.log(`${LOG_PREFIX} ✅ Nearest: shape=response.data direct, count=${data.length}`);
            } else {
                console.error(`${LOG_PREFIX} ❌ Unexpected nearest airports shape:`, response?.data);
            }

            if (data.length > 0) {
                console.log(`${LOG_PREFIX} Nearest airport sample:`, data[0]);
            }

            locations.value = data;
            return data;
        } catch (err: any) {
            console.error(`${LOG_PREFIX} ❌ detectNearestAirports failed:`, err?.message);
            console.error(`${LOG_PREFIX} Status:`, err?.response?.status);
            error.value = err.message || 'Failed to detect nearest airports';
            return [];
        } finally {
            loading.value = false;
        }
    };

    return {
        locations,
        loading,
        error,
        searchLocations,
        detectNearestAirports
    };
};