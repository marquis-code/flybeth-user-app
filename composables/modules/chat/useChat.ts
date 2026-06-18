import { ref } from 'vue';
import { chatApiFactory } from '@/api_factory/modules/chat';
import { uploadApiFactory } from '@/api_factory/modules/upload';

export const useChat = () => {
    const loading = ref(false);
    const isInitializing = ref(false);
    const rooms = ref<any[]>([]);
    const messages = ref<any[]>([]);
    const activeRoom = ref<any>(null);

    const fetchRooms = async () => {
        loading.value = true;
        try {
            const res = await chatApiFactory.getRooms({ page: 1, limit: 50 });
            rooms.value = res.data?.data || [];
            return res;
        } catch (err) {
            console.error('Failed to fetch rooms:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchMessages = async (roomId: string, isSupport = false) => {
        loading.value = true;
        try {
            let res;
            if (isSupport) {
                res = await chatApiFactory.getSupportMessages(roomId, { limit: 100 });
            } else {
                res = await chatApiFactory.getMessages(roomId, { limit: 100 });
            }
            const dataArr = res?.data?.data || res?.data || [];
            messages.value = Array.isArray(dataArr) ? dataArr.reverse() : [];
            return res;
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            messages.value = [];
        } finally {
            loading.value = false;
        }
    };

    const findAdminAndStartChat = async (guestData?: { email: string, name: string }, userData?: { userId: string, name: string, email: string }) => {
        if (isInitializing.value) return activeRoom.value;
        isInitializing.value = true;
        loading.value = true;
        try {
            // Support room creation — works for both guests and logged-in users
            const initData: any = {};
            if (userData) {
                initData.userId = userData.userId;
                initData.name = userData.name;
                initData.email = userData.email;
            } else if (guestData) {
                initData.name = guestData.name;
                initData.email = guestData.email;
            }

            const res = await chatApiFactory.initSupport(initData);
            const room = res?.data?.data || res?.data;
            if (!room || !room._id) throw new Error("Invalid room data received");
            
            activeRoom.value = room;
            await fetchMessages(room._id, true);
            return room;
        } catch (err) {
            console.error('Failed to start support chat:', err);
            throw err;
        } finally {
            loading.value = false;
            isInitializing.value = false;
        }
    };

    const uploadChatImage = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'chat_images');
            
            const res = await uploadApiFactory.uploadImage(formData);
            return res.data?.data?.url || res.data?.url;
        } catch (err) {
            console.error('Failed to upload chat image:', err);
            throw err;
        }
    };

    return {
        loading,
        rooms,
        messages,
        activeRoom,
        fetchRooms,
        fetchMessages,
        findAdminAndStartChat,
        uploadChatImage,
    };
};
