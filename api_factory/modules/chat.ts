import { GATEWAY_ENDPOINT_WITH_AUTH, GATEWAY_ENDPOINT } from "../axios.config";

export const chatApiFactory = {
    getRooms(params?: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/chat/rooms", { params });
    },
    getMessages(roomId: string, params?: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get(`/chat/rooms/${roomId}/messages`, { params });
    },
    getSupportMessages(roomId: string, params?: any) {
        // Public endpoint — no auth needed for support chat history
        return GATEWAY_ENDPOINT.get(`/chat/support/rooms/${roomId}/messages`, { params });
    },
    createRoom(participantId: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/chat/rooms", { participantId });
    },
    createGroup(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/chat/rooms/group", data);
    },
    initSupport(data: { email: string, name: string, userId?: string }) {
        // Public endpoint — no auth needed for support chat init
        return GATEWAY_ENDPOINT.post("/chat/support/init", data);
    }
};
