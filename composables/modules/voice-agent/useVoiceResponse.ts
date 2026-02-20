import { ref, watch } from "vue";
import { useVoiceSocket } from "./useVoiceSocket";

export const useVoiceResponse = () => {
    const { socket } = useVoiceSocket();
    const aiResponse = ref<any>(null);

    const initListener = () => {
        if (socket.value) {
            // Remove existing listener if any to avoid duplicates
            socket.value.off("aiResponse");
            socket.value.on("aiResponse", (data: any) => {
                aiResponse.value = data;
            });
        }
    };

    watch(socket, (newSocket) => {
        if (newSocket) initListener();
    }, { immediate: true });

    return { aiResponse };
};
