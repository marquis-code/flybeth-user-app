import { useVoiceSocket } from "./useVoiceSocket";

export const useVoiceStartStream = () => {
    const { socket } = useVoiceSocket();

    const emitStartVoiceStream = () => {
        if (socket.value) {
            socket.value.emit("startVoiceStream", {});
        }
    };

    return { emitStartVoiceStream };
};
