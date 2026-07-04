import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const flightsApi = {
    // Live Integration Endpoints (Unified Amadeus + Duffel)
    searchLive(data: any) {
        return GATEWAY_ENDPOINT.post("/flights/search/live", data);
    },
    getOfferDetails(id: string, provider: string) {
        return GATEWAY_ENDPOINT.get(`/flights/offers/${id}`, { params: { provider } });
    },
    book(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/flights/book", data);
    },
    priceOffer(data: any) {
        return GATEWAY_ENDPOINT.post("/flights/search/pricing", data);
    },
    getSeatmaps(data: any) {
        return GATEWAY_ENDPOINT.post("/flights/seatmaps", data);
    },
    cancel(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/flights/cancel", data);
    },
    getLiveDeals(origin: string, tripType: string = 'round-trip') {
        return GATEWAY_ENDPOINT.get("/flights/deals/live", { params: { origin, tripType } });
    },
    // Duffel Specific Flows
    setupDuffelIdentity(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/integrations/duffel/identity/setup", data);
    },
    hold(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/flights/hold", data);
    },
    payHold(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/flights/pay-hold", data);
    },
    createDuffelCard(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/flights/payments/cards", data);
    },
    createDuffel3DSSession(data: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/flights/payments/3ds", data);
    },
    getDuffelAirlines(params: any) {
        return GATEWAY_ENDPOINT.get("/integrations/duffel/airlines", { params });
    },
    getDuffelAirline(id: string) {
        return GATEWAY_ENDPOINT.get(`/integrations/duffel/airlines/${id}`);
    },
    getDuffelAircraftList(params: any) {
        return GATEWAY_ENDPOINT.get("/integrations/duffel/aircraft", { params });
    },
    getDuffelAircraft(id: string) {
        return GATEWAY_ENDPOINT.get(`/integrations/duffel/aircraft/${id}`);
    },
    getDuffelAirports(params: any) {
        return GATEWAY_ENDPOINT.get("/integrations/duffel/airports", { params });
    },
    getDuffelAirport(id: string) {
        return GATEWAY_ENDPOINT.get(`/integrations/duffel/airports/${id}`);
    },
    getDuffelCities(params: any) {
        return GATEWAY_ENDPOINT.get("/integrations/duffel/cities", { params });
    },
    getDuffelCity(id: string) {
        return GATEWAY_ENDPOINT.get(`/integrations/duffel/cities/${id}`);
    },
    getDuffelPlacesSuggestions(params: any) {
        return GATEWAY_ENDPOINT.get("/integrations/duffel/places/suggestions", { params });
    },
    createDuffelPaymentIntent(data: { amount: string; currency: string }) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/integrations/duffel/payments/payment-intents", data);
    },
    confirmDuffelPaymentIntent(id: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post(`/integrations/duffel/payments/payment-intents/${id}/actions/confirm`);
    },

    // Legacy/Individual Provider Endpoints (Keep for compatibility if needed, but mark as deprecated)
    /** @deprecated Use searchLive */
    searchAmadeus(params: any) {
        return GATEWAY_ENDPOINT.get("/flights/amadeus/search", { params });
    },
    /** @deprecated Use searchLive */
    searchAmadeusPost(data: any) {
        return GATEWAY_ENDPOINT.post("/flights/amadeus/search", data);
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
    // Airport search can still be Amadeus-driven or generic
    // Live Airport & City Search from Backend (Amadeus driven)
    searchAirports(keyword: string, countryCode?: string) {
        return GATEWAY_ENDPOINT.get("/flights/locations", {
            params: { keyword, countryCode }
        });
    },

    // Location by ID (e.g. CMUC)
    getLocationById(id: string) {
        return GATEWAY_ENDPOINT.get(`/airports/location/${id}`);
    },

    // Nearest relevant airports by geo coordinates
    // Nearest relevant airports by geo coordinates from Backend (Amadeus driven)
    getNearestAirports(lat: number, lng: number) {
        return GATEWAY_ENDPOINT.get("/flights/airports/nearest", {
            params: { lat, lng }
        });
    },

    // Direct destinations from an airport
    getAirportRoutes(departureAirportCode: string, max?: number) {
        return GATEWAY_ENDPOINT.get("/airports/routes", {
            params: { departureAirportCode, max: max || 10 }
        });
    },

    // Airline destinations
    getAirlineDestinations(airlineCode: string, max?: number) {
        return GATEWAY_ENDPOINT.get("/airlines/destinations", {
            params: { airlineCode, max: max || 10 }
        });
    },

    // Airline code lookup
    getAirlineLookup(airlineCodes: string) {
        return GATEWAY_ENDPOINT.get("/airlines/lookup", {
            params: { airlineCodes }
        });
    },

    // Flight check-in links
    getCheckinLinks(airlineCode: string) {
        return GATEWAY_ENDPOINT.get("/airlines/checkin-links", {
            params: { airlineCode }
        });
    },

    // Flight inspiration — cheapest destinations from origin
    getFlightInspiration(origin: string, departureDate?: string) {
        return GATEWAY_ENDPOINT.get("/flights/inspiration", {
            params: { origin, ...(departureDate ? { departureDate } : {}) }
        });
    },

    // Flight cheapest dates between origin and destination
    getFlightCheapestDates(origin: string, destination: string) {
        return GATEWAY_ENDPOINT.get("/flights/cheapest-dates", {
            params: { origin, destination }
        });
    },

    // Travel recommendations
    getRecommendedLocations(cityCodes: string, travelerCountryCode?: string) {
        return GATEWAY_ENDPOINT.get("/flights/recommendations", {
            params: { cityCodes, ...(travelerCountryCode ? { travelerCountryCode } : {}) }
        });
    },
    // Search Sessions
    createSearchSession(criteria: any) {
        return GATEWAY_ENDPOINT.post("/flights/search-session", criteria);
    },
    getSearchSession(id: string) {
        return GATEWAY_ENDPOINT.get(`/flights/search-session/${id}`);
    },
    // Recent Searches
    saveRecentSearch(criteria: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/flights/recent", criteria);
    },
    getRecentSearches() {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/flights/recent");
    },
    removeRecentSearch(id: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/flights/recent/${id}`);
    },
};
