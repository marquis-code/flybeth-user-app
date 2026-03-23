import { ref } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

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
            const { data } = await GATEWAY_ENDPOINT.get('/airports/cities/search', {
                params: {
                    q: query,
                    limit: 15
                }
            })

            locations.value = data || []
        } catch (err: any) {
            console.error('Error searching cities:', err)
            error.value = err.message || 'Failed to search cities'
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
