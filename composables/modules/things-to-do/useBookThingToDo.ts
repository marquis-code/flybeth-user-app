import { ref } from 'vue';
import { thingsToDoApi } from '@/api_factory/modules/things-to-do';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useBookThingToDo = () => {
    const loading = ref(false);
    const { showToast } = useCustomToast();

    const book = async (bookingData: any) => {
        loading.value = true;
        try {
            const { data } = await thingsToDoApi.book(bookingData);
            showToast({
                title: 'Success',
                message: 'Your activity has been booked successfully.',
                toastType: 'success'
            });
            return data;
        } catch (error: any) {
            console.error('Error booking activity:', error);
            showToast({
                title: 'Error',
                message: error?.response?.data?.message || 'Failed to book activity.',
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
