import { ref } from 'vue';
import { analyticsApi } from '@/api_factory/modules/analytics';

export const useFetchRevenueAnalytics = () => {
    const loading = ref(false);
    const revenueStats = ref<any>(null);

    const fetchRevenueAnalytics = async (params: any = {}) => {
        loading.value = true;
        try {
            const { data } = await analyticsApi.getRevenue(params);
            revenueStats.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching revenue analytics:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        revenueStats,
        fetchRevenueAnalytics,
    };
};
