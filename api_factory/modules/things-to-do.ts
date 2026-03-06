import { GATEWAY_ENDPOINT } from "../axios.config";

export const thingsToDoApi = {
    searchLive(data: any) {
        return GATEWAY_ENDPOINT.post("/experiences/search/live", data);
    },
    getDetails(id: string, provider: string) {
        return GATEWAY_ENDPOINT.get(`/experiences/${id}`, { params: { provider } });
    },
    book(data: any) {
        return GATEWAY_ENDPOINT.post("/experiences/book", data);
    }
};
