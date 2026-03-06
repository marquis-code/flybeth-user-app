import { GATEWAY_ENDPOINT } from "../axios.config";

export const staysApi = {
    // Live Integration Endpoints (Unified Duffel Stays)
    searchLive(data: any) {
        return GATEWAY_ENDPOINT.post("/stays/search/live", data);
    },
    fetchRates(searchResultId: string, provider: string, query?: any) {
        return GATEWAY_ENDPOINT.post("/stays/rates", { searchResultId, provider, ...query });
    },
    createQuote(rateId: string, provider: string) {
        return GATEWAY_ENDPOINT.post("/stays/quote", { rateId, provider });
    },
    book(data: any) {
        return GATEWAY_ENDPOINT.post("/stays/book", data);
    },
    cancel(data: any) {
        return GATEWAY_ENDPOINT.post("/stays/cancel", data);
    },

    // Local DB Endpoints
    search(params: any) {
        return GATEWAY_ENDPOINT.get("/stays/search", { params });
    },
    getStay(id: string, params: any) {
        return GATEWAY_ENDPOINT.get(`/stays/${id}`, { params });
    },
    getRoomById(id: string) {
        return GATEWAY_ENDPOINT.get(`/stays/rooms/${id}`);
    },
    /** @deprecated Use searchLive */
    searchAmadeusHotels(params: any) {
        return GATEWAY_ENDPOINT.get("/amadeus/hotels/by-city", { params });
    }
};
