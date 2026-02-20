import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const voice_agent_api = {
    /**
     * Initialize Session: Creates a new session and returns sessionId and a temporary streamingToken for AssemblyAI.
     */
    initSession: () => {
        const url = "/voice-agent/session";
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url);
    },

    /**
     * Text Fallback: Send a text message to the AI.
     */
    sendTextFallback: (id: string, text: string) => {
        const url = `/voice-agent/session/${id}/text`;
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { text });
    },

    /**
     * Batch Processing: Upload a recorded audio file (buffer) for transcription and processing.
     */
    uploadAudio: (id: string, audioBuffer: Blob) => {
        const url = `/voice-agent/session/${id}/audio`;
        const formData = new FormData();
        formData.append("audio", audioBuffer);
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    /**
     * Status: Get the current state of the conversation and booking draft.
     */
    getStatus: (id: string) => {
        const url = `/voice-agent/session/${id}`;
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url);
    },

    /**
     * STT Token: Refresh or retrieve a dedicated AssemblyAI token for real-time streaming.
     */
    getStreamingToken: () => {
        const url = "/voice-agent/streaming-token";
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url);
    },

    /**
     * Resume Draft: Re-activates an abandoned booking draft within a new session.
     */
    resumeDraft: (id: string) => {
        const url = `/voice-agent/session/${id}/resume`;
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url);
    },

    /**
     * End Session: Gracefully closes the AI session.
     */
    endSession: (id: string) => {
        const url = `/voice-agent/session/${id}`;
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url);
    },
};
