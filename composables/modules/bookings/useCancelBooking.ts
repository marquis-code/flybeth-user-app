import { ref } from 'vue';
import { bookingsApi } from '@/api_factory/modules/bookings';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useCancelBooking = () => {
    const { showToast } = useCustomToast();
    const loading = ref(false);

    const cancelBooking = async (id: string, reason: string) => {
        loading.value = true;
        try {
            const { data } = await bookingsApi.cancel(id, { reason });
            showToast({
                title: 'Success',
                message: 'Booking cancelled successfully',
                toastType: 'success'
            });
            return data;
        } catch (error) {
            console.error('Error cancelling booking:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        cancelBooking,
    };
};
