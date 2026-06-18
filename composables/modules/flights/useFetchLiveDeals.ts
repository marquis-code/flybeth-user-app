import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

const POPULAR_DESTINATIONS = ['LHR', 'JFK', 'DXB', 'CDG', 'JNB', 'NBO'];

export const useFetchLiveDeals = () => {
    const loadingDeals = ref(false);
    const liveDeals = ref<any[]>([]);

    const fetchLiveDeals = async (origin: string, tripType = 'round-trip') => {
        loadingDeals.value = true;
        liveDeals.value = []; // Clear out previous to show skeleton

        const possibleDests = POPULAR_DESTINATIONS.filter(d => d !== origin);
        const selectedDests = possibleDests.sort(() => 0.5 - Math.random()).slice(0, 3);

        const departureDate = new Date();
        departureDate.setDate(departureDate.getDate() + 14); // 2 weeks ahead
        const depDateStr = departureDate.toISOString().split('T')[0];

        let retDateStr = undefined;
        if (tripType === 'round-trip' || tripType === 'Round Trip') {
            const returnDate = new Date(departureDate);
            returnDate.setDate(returnDate.getDate() + 7);
            retDateStr = returnDate.toISOString().split('T')[0];
        }

        try {
            const promises = selectedDests.map(dest => {
                return flightsApi.searchLive({
                    origin,
                    destination: dest,
                    departureDate: depDateStr,
                    returnDate: retDateStr,
                    adults: 1,
                    cabinClass: 'ECONOMY',
                    provider: 'duffel'
                }).catch(() => null);
            });

            const results = await Promise.all(promises);
            
            const deals: any[] = [];
            for (let i = 0; i < results.length; i++) {
                const res = results[i] as any;
                // API returns { success, data: { results: [...], meta } }
                // Axios wraps it: res.data = { success, data: { results: [...] } }
                const offers = res?.data?.data?.results || res?.data?.data || res?.data?.results || [];
                const offerList = Array.isArray(offers) ? offers : [];
                if (offerList.length > 0) {
                    const sorted = offerList.sort((a: any, b: any) => (a.priceWithCommission || a.price) - (b.priceWithCommission || b.price));
                    deals.push(sorted[0]);
                }
            }

            liveDeals.value = deals;
            return liveDeals.value;
        } catch (error) {
            console.error('Error fetching live flight deals:', error);
            liveDeals.value = [];
        } finally {
            loadingDeals.value = false;
        }
    };

    return {
        loadingDeals,
        liveDeals,
        fetchLiveDeals,
    };
};
