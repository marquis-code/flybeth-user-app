import { ref, onUnmounted } from "vue";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/composables/modules/auth/user";

const socket = ref<Socket | null>(null);
const isConnected = ref(false);

export const useVoiceSocket = () => {
    const { token } = useUser();

    const connect = () => {
        if (socket.value) return;

        const backendUrl = import.meta.env.VITE_BASE_URL;
        socket.value = io(`${backendUrl}/voice-agent`, {
            auth: { token: token.value },
            transports: ["websocket"],
        });

        socket.value.on("connect", () => {
            isConnected.value = true;
            console.log("Voice Agent connected to Socket.io");
        });

        socket.value.on("disconnect", () => {
            isConnected.value = false;
            console.log("Voice Agent disconnected from Socket.io");
        });
    };

    const disconnect = () => {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
            isConnected.value = false;
        }
    };

    return {
        socket,
        isConnected,
        connect,
        disconnect,
    };
};
