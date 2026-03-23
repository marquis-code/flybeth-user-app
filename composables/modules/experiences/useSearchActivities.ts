import { ref } from 'vue'
import { activitiesApi } from '@/api_factory/modules/activities'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useSearchActivities = () => {
    const { showToast } = useCustomToast()
    const loading = ref(false)
    const activitiesList = ref<any[]>([])

    const searchActivities = async (payload: { latitude: number, longitude: number, date?: string, radius?: number }) => {
        loading.value = true
        activitiesList.value = []
        try {
            const { data } = await activitiesApi.searchLive(payload)
            activitiesList.value = data?.results || data?.data || data || []
        } catch (error: any) {
            showToast({
                title: 'Search Failed',
                message: error.response?.data?.message || 'Failed to fetch things to do. Please try again.',
                toastType: 'error',
                duration: 4000
            })
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        activitiesList,
        searchActivities
    }
}
