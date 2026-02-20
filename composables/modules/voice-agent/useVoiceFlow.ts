import { ref, watch } from "vue";
import { useVoiceSocket } from "./useVoiceSocket";

export const useVoiceFlow = () => {
    const { socket } = useVoiceSocket();
    const flowUpdate = ref<any>(null);

    const initListener = () => {
        if (socket.value) {
            // Remove existing listener if any
            socket.value.off("flowUpdate");
            socket.value.on("flowUpdate", (data: any) => {
                flowUpdate.value = data;
            });
        }
    };

    watch(socket, (newSocket) => {
        if (newSocket) initListener();
    }, { immediate: true });

    return { flowUpdate };
};
