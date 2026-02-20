import { ref } from 'vue';
import { bookingsApi } from '@/api_factory/modules/bookings';

export const useFetchMyBookings = () => {
    const loading = ref(false);
    const bookings = ref<any[]>([]);

    const fetchMyBookings = async (params: any = {}) => {
        loading.value = true;
        try {
            const { data } = await bookingsApi.getMyBookings(params);
            bookings.value = data.data;
            return data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        bookings,
        fetchMyBookings,
    };
};
