import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const flightsApi = {
    // Amadeus Endpoints
    searchAmadeus(params: any) {
        return GATEWAY_ENDPOINT.get("/flights/amadeus/search", { params });
    },
    searchAmadeusPost(data: any) {
        return GATEWAY_ENDPOINT.post("/flights/amadeus/search", data);
    },
    priceAmadeus(data: any) {
        return GATEWAY_ENDPOINT.post("/flights/amadeus/price", data);
    },
    createAmadeusOrder(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/flights/amadeus/order", data);
    },
    getAmadeusOrder(orderId: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get(`/flights/amadeus/order/${orderId}`);
    },
    deleteAmadeusOrder(orderId: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/flights/amadeus/order/${orderId}`);
    },
    getSeatmapByOrder(flightOrderId: string) {
        return GATEWAY_ENDPOINT.get("/flights/amadeus/seatmap", { params: { flightOrderId } });
    },
    getSeatmapByOffer(data: any) {
        return GATEWAY_ENDPOINT.post("/flights/amadeus/seatmap", data);
    },

    // Local DB Endpoints
    searchLocal(data: any) {
        return GATEWAY_ENDPOINT.post("/flights/search", data);
    },
    getPopular(params: { limit?: number } = {}) {
        return GATEWAY_ENDPOINT.get("/flights/popular", { params });
    },
    getDeals(params: { limit?: number } = {}) {
        return GATEWAY_ENDPOINT.get("/flights/deals", { params });
    },
    getById(id: string) {
        return GATEWAY_ENDPOINT.get(`/flights/${id}`);
    },
    searchAirports(keyword: string) {
        return GATEWAY_ENDPOINT.get("/flights/amadeus/airports", {
            params: { keyword, subType: 'CITY,AIRPORT' }
        });
    },
    airlineLookup(airlineCodes: string) {
        return GATEWAY_ENDPOINT.get("/flights/amadeus/airlines/lookup", {
            params: { airlineCodes }
        });
    }
};
