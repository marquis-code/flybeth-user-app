import { ref } from 'vue'
import { flightsApi } from '@/api_factory/modules/flights'

const INSPIRATION_DESTS = ['ACC', 'CPT', 'ZRH', 'FRA', 'YYZ', 'MAD'];

export const useFlightRecommendations = () => {
    const recommendations = ref<any[]>([])
    const loadingRecommendations = ref(false)
    const error = ref<string | null>(null)

    const fetchRecommendations = async (cityCodes: string, travelerCountryCode?: string) => {
        loadingRecommendations.value = true
        error.value = null
        try {
            const { data } = await flightsApi.getRecommendedLocations(cityCodes, travelerCountryCode)
            recommendations.value = data.data || data || []
            return recommendations.value
        } catch (err: any) {
            console.error('Error fetching flight recommendations:', err)
            error.value = err.message || 'Failed to fetch recommendations'
            recommendations.value = []
        } finally {
            loadingRecommendations.value = false
        }
    }

    const fetchFlightInspiration = async (origin: string, departureDate?: string) => {
        loadingRecommendations.value = true
        error.value = null
        
        const possibleDests = INSPIRATION_DESTS.filter(d => d !== origin);
        const selectedDests = possibleDests.sort(() => 0.5 - Math.random()).slice(0, 4);

        const depDate = departureDate ? new Date(departureDate) : new Date();
        if (!departureDate) {
            depDate.setDate(depDate.getDate() + 30); // 1 month from now
        }
        const depDateStr = depDate.toISOString().split('T')[0];

        try {
            const promises = selectedDests.map(dest => {
                return flightsApi.searchLive({
                    origin,
                    destination: dest,
                    departureDate: depDateStr,
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

            recommendations.value = deals;
            return recommendations.value;
        } catch (err: any) {
            console.error('Error fetching flight inspiration:', err)
            error.value = err.message || 'Failed to fetch inspiration'
            recommendations.value = []
        } finally {
            loadingRecommendations.value = false
        }
    }

    return {
        recommendations,
        loadingRecommendations,
        error,
        fetchRecommendations,
        fetchFlightInspiration
    }
}
