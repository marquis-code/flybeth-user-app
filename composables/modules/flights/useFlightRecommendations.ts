import { ref } from 'vue'
import { flightsApi } from '@/api_factory/modules/flights'

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
        try {
            const { data } = await flightsApi.getFlightInspiration(origin, departureDate)
            recommendations.value = data.data || data || []
            return recommendations.value
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
