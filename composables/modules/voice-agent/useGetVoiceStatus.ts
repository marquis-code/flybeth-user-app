import { ref } from "vue";
import { voice_agent_api } from "@/api_factory/modules/voice-agent";

export const useGetVoiceStatus = () => {
    const loading = ref(false);
    const status = ref<any>(null);

    const getStatus = async (id: string) => {
        loading.value = true;
        try {
            const res = (await voice_agent_api.getStatus(id)) as any;
            if (res.type !== "ERROR") {
                status.value = res.data;
                return res.data;
            }
        } finally {
            loading.value = false;
        }
    };

    return { loading, status, getStatus };
};
