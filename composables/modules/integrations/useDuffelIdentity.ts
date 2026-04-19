// user/composables/modules/integrations/useDuffelIdentity.ts
import { ref } from 'vue'
import { flightsApi } from '@/api_factory/modules/flights'
import { useUser } from '@/composables/modules/auth/user'

export const useDuffelIdentity = () => {
    const loading = ref(false)
    const duffelData = ref<{ customerId: string, clientKey: string } | null>(null)
    const { user } = useUser()

    const ensureDuffelIdentity = async (providedData?: any) => {
        loading.value = true
        try {
            // Aggressively prioritize providedData (from form) over user profile
            const identData = {
                email: providedData?.email || user.value?.email,
                given_name: providedData?.firstName || user.value?.firstName,
                family_name: providedData?.lastName || user.value?.lastName,
                phone_number: providedData?.phone || user.value?.phone
            }

            if (!identData.email || !identData.phone_number) {
                console.warn('Insufficient identity data provided for Duffel setup', identData)
            }

            const payload = { data: identData }
            const { data } = await flightsApi.setupDuffelIdentity(payload)
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
