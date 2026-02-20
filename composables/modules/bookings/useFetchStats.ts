import { ref } from 'vue';
import { bookingsApi } from '@/api_factory/modules/bookings';

export const useFetchStats = () => {
    const loading = ref(false);
    const stats = ref<any>(null);

    const fetchStats = async (tenantId?: string) => {
        loading.value = true;
        try {
            const { data } = await bookingsApi.getStats(tenantId);
            stats.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching booking stats:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        stats,
        fetchStats,
    };
};
