import { ref } from 'vue';
import { transfersApi } from '@/api_factory/modules/transfers';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useBookTransfer = () => {
    const loading = ref(false);
    const { showToast } = useCustomToast();

    const book = async (bookingData: any) => {
        loading.value = true;
        try {
            const { data } = await transfersApi.book(bookingData);
            showToast({
                title: 'Success',
                message: 'Your transfer has been booked successfully.',
                toastType: 'success'
            });
            return data;
        } catch (error: any) {
            console.error('Error booking transfer:', error);
            showToast({
                title: 'Error',
                message: error?.response?.data?.message || 'Failed to book transfer.',
                toastType: 'error'
            });
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        book,
    };
};
