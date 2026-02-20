import { GATEWAY_ENDPOINT } from "../axios.config";

export const staysApi = {
    search(params: any) {
        return GATEWAY_ENDPOINT.get("/stays/search", { params });
    },
    getById(id: string) {
        return GATEWAY_ENDPOINT.get(`/stays/${id}`);
    },
    getRoomById(id: string) {
        return GATEWAY_ENDPOINT.get(`/stays/rooms/${id}`);
    },
    // Amadeus Hotel Endpoints
    searchAmadeusHotels(params: any) {
        return GATEWAY_ENDPOINT.get("/amadeus/hotels/by-city", { params });
    }
};
