import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const analyticsApi = {
    getBookings(params: { tenantId?: string; days?: number } = {}) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/analytics/bookings", { params });
    },
    getRevenue(params: { tenantId?: string; days?: number } = {}) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/analytics/revenue", { params });
    },
    getPopularRoutes(params: { limit?: number; tenantId?: string } = {}) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/analytics/popular-routes", { params });
    }
};
