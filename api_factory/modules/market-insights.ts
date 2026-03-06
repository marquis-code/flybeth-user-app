// user/api_factory/modules/market-insights.ts
import { GATEWAY_ENDPOINT } from "../axios.config";

export const marketInsightsApi = {
    getBusiestPeriods(params: { cityCode: string; period: string; direction?: string }) {
        return GATEWAY_ENDPOINT.get("/market-insights/busiest-period", { params });
    },
    getMostTraveled(params: { originCityCode: string; period: string }) {
        return GATEWAY_ENDPOINT.get("/market-insights/most-traveled", { params });
    },
    getMostBooked(params: { originCityCode: string; period: string }) {
        return GATEWAY_ENDPOINT.get("/market-insights/most-booked", { params });
    },
    getTripPurpose(params: {
        originLocationCode: string;
        destinationLocationCode: string;
        departureDate: string;
        returnDate: string
    }) {
        return GATEWAY_ENDPOINT.get("/market-insights/trip-purpose", { params });
    },
    detectLocation() {
        return GATEWAY_ENDPOINT.get("/market-insights/detect-location");
    },
    getLocationScore(params: { latitude: number; longitude: number }) {
        return GATEWAY_ENDPOINT.get("/market-insights/location-score", { params });
    }
};
