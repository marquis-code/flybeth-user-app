import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const bookingsApi = {
    create(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/bookings", data);
    },
    getMyBookings(params: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/bookings", { params });
    },
    getByPnr(pnr: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get(`/bookings/reference/${pnr}`);
    },
    getById(id: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get(`/bookings/${id}`);
    },
    cancel(id: string, data: { reason: string }) {
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/bookings/${id}/cancel`, data);
    },
    getStats(tenantId?: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/bookings/stats", { params: { tenantId } });
    }
};
