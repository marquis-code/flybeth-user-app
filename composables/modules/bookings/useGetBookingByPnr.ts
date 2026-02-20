import { ref } from 'vue';
import { bookingsApi } from '@/api_factory/modules/bookings';

export const useGetBookingByPnr = () => {
    const loading = ref(false);
    const bookingDetails = ref<any>(null);

    const getBookingByPnr = async (pnr: string) => {
        loading.value = true;
        try {
            const { data } = await bookingsApi.getByPnr(pnr);
            bookingDetails.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching booking by PNR:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        bookingDetails,
        getBookingByPnr,
    };
};
