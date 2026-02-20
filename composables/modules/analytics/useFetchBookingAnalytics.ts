import { ref } from 'vue';
import { analyticsApi } from '@/api_factory/modules/analytics';

export const useFetchBookingAnalytics = () => {
    const loading = ref(false);
    const bookingStats = ref<any>(null);

    const fetchBookingAnalytics = async (params: any = {}) => {
        loading.value = true;
        try {
            const { data } = await analyticsApi.getBookings(params);
            bookingStats.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching booking analytics:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        bookingStats,
        fetchBookingAnalytics,
    };
};
