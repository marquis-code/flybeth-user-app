import { ref } from 'vue';
import { staysApi } from '@/api_factory/modules/stays';

export const useGetRoomById = () => {
    const loading = ref(false);
    const selectedRoom = ref<any>(null);

    const getRoomById = async (id: string) => {
        loading.value = true;
        try {
            const { data } = await staysApi.getRoomById(id);
            // Unwrap the { success, data } gateway envelope.
            selectedRoom.value = data?.data || data;
            return selectedRoom.value;
        } catch (error) {
            console.error('Error fetching room details:', error);
            selectedRoom.value = null;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        selectedRoom,
        getRoomById,
    };
};
