import { ref } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export const useTripPurpose = () => {
    const loading = ref(false)
    const prediction = ref<any>(null)

    const predictTripPurpose = async (payload: { origin: string, destination: string, departureDate: string, returnDate?: string }) => {
        if (!payload.origin || !payload.destination || !payload.departureDate) {
            prediction.value = null
            return
        }

        loading.value = true
        prediction.value = null

        try {
            const params: any = {
                origin: payload.origin,
                destination: payload.destination,
                departureDate: payload.departureDate
            }
            if (payload.returnDate) params.returnDate = payload.returnDate

            const { data } = await GATEWAY_ENDPOINT.get('/flights/predict-purpose', { params })

            if (data?.data) {
                prediction.value = data.data
            }
        } catch (err) {
            console.error('Failed to predict trip purpose:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        prediction,
        predictTripPurpose
    }
}
