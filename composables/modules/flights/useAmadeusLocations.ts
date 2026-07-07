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
            // LAYER 1: Primary search using Duffel places/suggestions
            console.log(`${LOG_PREFIX} ➡️ Attempt 1: GET Duffel places suggestions for "${keyword}"`);
            const response = await flightsApi.getDuffelPlacesSuggestions({ query: keyword });
            
            const rawData = response.data?.data || response.data || [];
            const results = Array.isArray(rawData) ? rawData : [];

            console.log(`${LOG_PREFIX} Raw Duffel results count: ${results.length}`);

            // Flatten: extract nested airports from city results AND include direct airport results
            const flatResults: any[] = [];
            const seenCodes = new Set<string>();

            for (const item of results) {
                const iata = item.iata_code || item.iataCode || item.code || '';
                const itemType = item.type || '';

                // If this is a direct airport result, add it
                if (itemType === 'airport' && iata && !seenCodes.has(iata)) {
                    seenCodes.add(iata);
                    flatResults.push({
                        ...item,
                        iataCode: iata,
                        name: item.name || '',
                        address: {
                            cityName: item.city_name || item.cityName || item.city?.name || item.name || ''
                        },
                        subType: 'AIRPORT'
                    });
                }

                // If this is a city with nested airports, flatten them out
                if (itemType === 'city' && Array.isArray(item.airports) && item.airports.length > 0) {
                    // First add the city itself as a selectable option
                    const cityIata = item.iata_city_code || item.iata_code || iata;
                    if (cityIata && !seenCodes.has(cityIata)) {
                        seenCodes.add(cityIata);
                        flatResults.push({
                            ...item,
                            iataCode: cityIata,
                            name: `${item.name || ''} (All Airports)`,
                            address: {
                                cityName: item.name || item.city_name || ''
                            },
                            subType: 'CITY'
                        });
                    }

                    // Then add each nested airport
                    for (const airport of item.airports) {
                        const apIata = airport.iata_code || airport.iataCode || '';
                        if (apIata && !seenCodes.has(apIata)) {
                            seenCodes.add(apIata);
                            flatResults.push({
                                ...airport,
                                iataCode: apIata,
                                name: airport.name || '',
                                address: {
                                    cityName: airport.city_name || airport.cityName || item.name || ''
                                },
                                subType: 'AIRPORT'
                            });
                        }
                    }
                } else if (itemType === 'city' && iata && !seenCodes.has(iata)) {
                    // City without nested airports — still selectable
                    seenCodes.add(iata);
                    flatResults.push({
                        ...item,
                        iataCode: iata,
                        name: item.name || '',
                        address: {
                            cityName: item.name || item.city_name || ''
                        },
                        subType: 'CITY'
                    });
                }
            }

            console.log(`${LOG_PREFIX} Flattened results count: ${flatResults.length}`);

            if (flatResults.length > 0) {
                locations.value = flatResults;
                return;
            }

            // LAYER 2: Fallback to Amadeus location search if Duffel returned nothing
            console.log(`${LOG_PREFIX} ➡️ Attempt 2: Amadeus location search for "${keyword}"`);
            try {
                const amadeusResponse = await flightsApi.searchAirports(keyword, countryCode);
                const amadeusData = amadeusResponse.data?.data || amadeusResponse.data || [];
                const amadeusResults = Array.isArray(amadeusData) ? amadeusData : [];

                if (amadeusResults.length > 0) {
                    console.log(`${LOG_PREFIX} ✅ Amadeus fallback returned ${amadeusResults.length} results`);
                    locations.value = amadeusResults.map((item: any) => ({
                        ...item,
                        iataCode: item.iataCode || item.iata_code || item.code || '',
                        name: item.name || item.detailedName || '',
                        address: {
                            cityName: item.address?.cityName || item.city_name || item.name || ''
                        },
                        subType: item.subType || 'AIRPORT'
                    })).filter((item: any) => item.iataCode);
                    return;
                }
            } catch (amadeusErr: any) {
                console.warn(`${LOG_PREFIX} Amadeus fallback failed:`, amadeusErr?.message);
            }

            // LAYER 3: If the keyword looks like an IATA code (2-4 uppercase letters),
            // try fetching the airport directly by ID
            const isLikelyIataCode = /^[A-Z]{2,4}$/i.test(keyword.trim());
            if (isLikelyIataCode) {
                console.log(`${LOG_PREFIX} ➡️ Attempt 3: Direct Duffel airport lookup for code "${keyword.toUpperCase()}"`);
                try {
                    const directResponse = await flightsApi.getDuffelAirport(`arp_${keyword.toLowerCase()}_`);
                    const directData = directResponse.data?.data || directResponse.data;
                    if (directData && (directData.iata_code || directData.iataCode)) {
                        const ap = directData;
                        locations.value = [{
                            ...ap,
                            iataCode: ap.iata_code || ap.iataCode,
                            name: ap.name || '',
                            address: {
                                cityName: ap.city_name || ap.cityName || ap.name || ''
                            },
                            subType: 'AIRPORT'
                        }];
                        console.log(`${LOG_PREFIX} ✅ Direct lookup found: ${ap.name}`);
                        return;
                    }
                } catch {
                    // Direct lookup didn't work — that's ok
                }
            }

            // Nothing found anywhere
            console.log(`${LOG_PREFIX} ❌ No results found for "${keyword}" across all sources`);
            locations.value = [];
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