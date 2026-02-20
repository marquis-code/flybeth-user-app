import { ref } from 'vue';
import { bookingsApi } from '@/api_factory/modules/bookings';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useCreateBooking = () => {
    const { showToast } = useCustomToast();
    const loading = ref(false);

    const createBooking = async (bookingData: any) => {
        loading.value = true;
        try {
            const { data, status } = await bookingsApi.create(bookingData);
            if (status === 200 || status === 201) {
                showToast({
                    title: 'Success',
                    message: 'Booking created successfully',
                    toastType: 'success'
                });
                return data;
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        createBooking,
    };
};
