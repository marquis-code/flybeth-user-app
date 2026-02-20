import { ref } from "vue";
import { voice_agent_api } from "@/api_factory/modules/voice-agent";

export const useStartVoiceSession = () => {
    const loading = ref(false);
    const sessionId = ref<string | null>(null);
    const streamingToken = ref<string | null>(null);

    const startSession = async () => {
        loading.value = true;
        try {
            const res = (await voice_agent_api.initSession()) as any;
            if (res.type !== "ERROR") {
                sessionId.value = res.data._id || res.data.sessionId;
                streamingToken.value = res.data.streamingToken;
                return { sessionId: sessionId.value, streamingToken: streamingToken.value };
            }
        } finally {
            loading.value = false;
        }
    };

    return { loading, sessionId, streamingToken, startSession };
};
