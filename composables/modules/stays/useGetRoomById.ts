import { ref } from 'vue';
import { staysApi } from '@/api_factory/modules/stays';

export const useGetRoomById = () => {
    const loading = ref(false);
    const selectedRoom = ref<any>(null);

    const getRoomById = async (id: string) => {
        loading.value = true;
        try {
            const { data } = await staysApi.getRoomById(id);
            selectedRoom.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching room details:', error);
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
