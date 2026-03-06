import { GATEWAY_ENDPOINT } from "../axios.config";

export const transfersApi = {
    searchLive(data: any) {
        return GATEWAY_ENDPOINT.post("/transfers/search/live", data);
    },
    book(data: any) {
        return GATEWAY_ENDPOINT.post("/transfers/book", data);
    }
};
