// user/composables/modules/integrations/useDuffelIdentity.ts
import { ref } from 'vue'
import { flightsApi } from '@/api_factory/modules/flights'

export const useDuffelIdentity = () => {
    const loading = ref(false)
    const duffelData = ref<{ customerId: string, clientKey: string } | null>(null)

    const ensureDuffelIdentity = async () => {
        loading.value = true
        try {
            const { data } = await flightsApi.setupDuffelIdentity()
            if (data.success) {
                duffelData.value = {
                    customerId: data.customerId,
                    clientKey: data.clientKey
                }
                return data
            }
            return data
        } catch (error) {
            console.error('Failed to setup Duffel identity:', error)
            throw error // Throw to allow caller to handle 401
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        duffelData,
        ensureDuffelIdentity
    }
}
