import { ref, computed } from 'vue'
import { activitiesApi } from '@/api_factory/modules/activities'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useSearchActivities = () => {
    const { showToast } = useCustomToast()
    const loading = ref(false)
    const activitiesList = ref<any[]>([])

    // Filter states
    const filters = ref({
        categories: [] as string[],
        priceRange: [0, 500] as [number, number],
        rating: 0 as number,
        duration: [] as string[]
    })

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

    const filteredActivitiesList = computed(() => {
        if (!activitiesList.value.length) return []
        
        return activitiesList.value.filter(activity => {
            // Price Filter
            const price = parseFloat(activity.price) || 0
            if (price < filters.value.priceRange[0] || price > filters.value.priceRange[1]) return false
            
            // Rating Filter
            if (filters.value.rating > 0 && (activity.rating || 0) < filters.value.rating) return false
            
            // Category Filter (Mock check if backend doesn't provide explicit tags)
            if (filters.value.categories.length > 0) {
               const name = activity.name?.toLowerCase() || ''
               const desc = activity.description?.toLowerCase() || ''
               const matches = filters.value.categories.some(cat => 
                 name.includes(cat.toLowerCase()) || desc.includes(cat.toLowerCase())
               )
               if (!matches) return false
            }

            return true
        })
    })

    return {
        loading,
        activitiesList,
        filteredActivitiesList,
        filters,
        searchActivities
    }
}
