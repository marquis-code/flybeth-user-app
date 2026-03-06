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

        console.log(`${LOG_PREFIX} ➡️  Calling API: GET /flights/locations?keyword=${keyword}`);

        try {
            const response = await flightsApi.searchAirports(keyword, countryCode);

            console.log(`${LOG_PREFIX} Raw API response:`, response);
            console.log(`${LOG_PREFIX} response.data:`, response?.data);
            console.log(`${LOG_PREFIX} response.data?.data:`, response?.data?.data);
            console.log(`${LOG_PREFIX} Is array (response.data.data):`, Array.isArray(response?.data?.data));
            console.log(`${LOG_PREFIX} Is array (response.data):`, Array.isArray(response?.data));

            // Handle multiple possible response shapes gracefully
            let results: any[] = [];

            if (Array.isArray(response?.data?.data)) {
                // Shape: { success: true, data: [...] }
                results = response.data.data;
                console.log(`${LOG_PREFIX} ✅ Shape matched: response.data.data — ${results.length} results`);
            } else if (Array.isArray(response?.data)) {
                // Shape: direct array returned
                results = response.data;
                console.log(`${LOG_PREFIX} ✅ Shape matched: response.data (direct array) — ${results.length} results`);
            } else if (Array.isArray(response?.data?.data?.data)) {
                // Shape: triple-nested { data: { data: [...] } }
                results = response.data.data.data;
                console.log(`${LOG_PREFIX} ✅ Shape matched: response.data.data.data — ${results.length} results`);
            } else {
                console.error(`${LOG_PREFIX} ❌ Unknown response shape. Inspect below:`);
                console.error(`${LOG_PREFIX} Full response.data:`, JSON.stringify(response?.data, null, 2));
            }

            if (results.length > 0) {
                console.log(`${LOG_PREFIX} Sample result[0]:`, results[0]);
            } else {
                console.warn(`${LOG_PREFIX} ⚠️  0 results returned for keyword="${keyword}"`);
            }

            locations.value = results;
        } catch (err: any) {
            if (err?.name !== 'CanceledError' && err?.code !== 'ERR_CANCELED') {
                console.error(`${LOG_PREFIX} ❌ API error:`, err?.message);
                console.error(`${LOG_PREFIX} HTTP status:`, err?.response?.status);
                console.error(`${LOG_PREFIX} Response body:`, err?.response?.data);
                console.error(`${LOG_PREFIX} Full error:`, err);
                error.value = err.message || 'Failed to fetch locations';
            } else {
                console.log(`${LOG_PREFIX} Request cancelled — skipping`);
            }
            locations.value = [];
        } finally {
            loading.value = false;
            console.log(`${LOG_PREFIX} Done. loading=false | locations.length=${locations.value.length}`);
        }
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