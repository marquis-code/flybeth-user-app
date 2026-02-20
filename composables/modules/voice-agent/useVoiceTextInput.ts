import { useVoiceSocket } from "./useVoiceSocket";

export const useVoiceTextInput = () => {
    const { socket } = useVoiceSocket();

    const emitTextInput = (text: string, sessionId: string) => {
        if (socket.value) {
            socket.value.emit("textInput", { text, sessionId });
        }
    };

    return { emitTextInput };
};
