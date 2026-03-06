// user/composables/modules/market-insights/useMarketInsights.ts
import { ref } from 'vue';
import { marketInsightsApi } from '@/api_factory/modules/market-insights';

export const useMarketInsights = () => {
    const loading = ref(false);
    const busiestPeriods = ref<any[]>([]);
    const mostTraveled = ref<any[]>([]);
    const mostBooked = ref<any[]>([]);
    const tripPurpose = ref<any>(null);
    const userLocation = ref<any>(null);
    const locationScore = ref<any>(null);

    const detectUserLocation = async () => {
        try {
            const { data } = await marketInsightsApi.detectLocation();
            userLocation.value = data;
            return data;
        } catch (error) {
            console.error('Error detecting user location:', error);
            // Default to Lagos if detection fails
            userLocation.value = { city: 'Lagos', cityCode: 'LOS', country: 'Nigeria', countryCode: 'NG' };
            return userLocation.value;
        }
    };

    const fetchLocationScore = async (latitude: number, longitude: number) => {
        loading.value = true;
        try {
            const { data: res } = await marketInsightsApi.getLocationScore({ latitude, longitude });
            const data = res.data || res; // Handle both direct array and {success, data}

            if (Array.isArray(data) && data.length > 0 && data[0].categoryScores) {
                const scores = data[0].categoryScores;
                locationScore.value = Object.entries(scores).map(([key, value]) => ({
                    category: key,
                    categoryName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                    overallMaxScore: value
                }));
            } else {
                locationScore.value = [];
            }
            return locationScore.value;
        } catch (error) {
            console.error('Error fetching location score:', error);
            locationScore.value = [];
        } finally {
            loading.value = false;
        }
    };

    const fetchBusiestPeriods = async (cityCode: string, period: string, direction?: string) => {
        loading.value = true;
        try {
            const { data } = await marketInsightsApi.getBusiestPeriods({ cityCode, period, direction });
            busiestPeriods.value = data.data || data || [];
            return busiestPeriods.value;
        } catch (error) {
            console.error('Error fetching busiest periods:', error);
            busiestPeriods.value = [];
            return [];
        } finally {
            loading.value = false;
        }
    };

    const fetchMostTraveled = async (originCityCode: string, period: string) => {
        loading.value = true;
        try {
            const { data } = await marketInsightsApi.getMostTraveled({ originCityCode, period });
            let result = data.data || data || [];

            // Amadeus test API has limited data — fallback to a known working origin if empty
            if ((!Array.isArray(result) || result.length === 0) && originCityCode !== 'MAD') {
                const { data: fallbackRes } = await marketInsightsApi.getMostTraveled({ originCityCode: 'MAD', period: '2019-11' });
                result = fallbackRes.data || fallbackRes || [];
            }

            mostTraveled.value = Array.isArray(result) ? result : [];
            return mostTraveled.value;
        } catch (error) {
            console.error('Error fetching most traveled destinations:', error);
            mostTraveled.value = [];
            return [];
        } finally {
            loading.value = false;
        }
    };

    const fetchMostBooked = async (originCityCode: string, period: string) => {
        loading.value = true;
        try {
            const { data } = await marketInsightsApi.getMostBooked({ originCityCode, period });
            let result = data.data || data || [];

            // Amadeus test API fallback
            if ((!Array.isArray(result) || result.length === 0) && originCityCode !== 'NCE') {
                const { data: fallbackRes } = await marketInsightsApi.getMostBooked({ originCityCode: 'NCE', period: '2017-11' });
                result = fallbackRes.data || fallbackRes || [];
            }

            mostBooked.value = Array.isArray(result) ? result : [];
            return mostBooked.value;
        } catch (error) {
            console.error('Error fetching most booked destinations:', error);
            mostBooked.value = [];
            return [];
        } finally {
            loading.value = false;
        }
    };

    const fetchTripPurpose = async (params: {
        originLocationCode: string;
        destinationLocationCode: string;
        departureDate: string;
        returnDate: string
    }) => {
        loading.value = true;
        try {
            const { data } = await marketInsightsApi.getTripPurpose(params);
            tripPurpose.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching trip purpose prediction:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        busiestPeriods,
        mostTraveled,
        mostBooked,
        tripPurpose,
        userLocation,
        locationScore,
        detectUserLocation,
        fetchLocationScore,
        fetchBusiestPeriods,
        fetchMostTraveled,
        fetchMostBooked,
        fetchTripPurpose
    };
};
