import { ref } from 'vue'
import { flightsApi } from '@/api_factory/modules/flights'

export const useCitySearch = () => {
    const locations = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const searchCities = async (query: string) => {
        if (!query || query.length < 2) {
            locations.value = []
            return
        }

        loading.value = true
        error.value = null

        try {
            // LAYER 1: Standard Search (Unified Locations)
            const response = await flightsApi.searchAirports(query)
            const results = response.data?.data || response.data || []
            
            // Map results to Amadeus-like shape if needed
            locations.value = results.map((item: any) => ({
                ...item,
                iataCode: item.iataCode || item.address?.cityCode || item.code || item.id,
                name: item.name || item.address?.cityName || item.description,
                subType: item.subType || (item.type === 'airport' ? 'AIRPORT' : 'CITY')
            }))
        } catch (err: any) {
            if (err?.name !== 'CanceledError' && err?.code !== 'ERR_CANCELED') {
                console.error('Error searching cities:', err)
                error.value = err.message || 'Failed to search cities'
            }
            locations.value = []
        } finally {
            loading.value = false
        }
    }

    return {
        locations,
        loading,
        error,
        searchCities
    }
}
