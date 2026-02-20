import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const authApiFactory = {
    register(payload: any) {
        return GATEWAY_ENDPOINT.post("/auth/register", payload);
    },
    login(payload: any) {
        return GATEWAY_ENDPOINT.post("/auth/login", payload);
    },
    refresh() {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/auth/refresh");
    },
    forgotPassword(payload: any) {
        return GATEWAY_ENDPOINT.post("/auth/forgot-password", payload);
    },
    resetPassword(payload: any) {
        return GATEWAY_ENDPOINT.post("/auth/reset-password", payload);
    },
    verifyOtp(payload: any) {
        return GATEWAY_ENDPOINT.post("/auth/verify-otp", payload);
    },
    logout() {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/auth/logout");
    },
    googleLoginUrl() {
        return `${import.meta.env.VITE_BASE_URL}/api/v1/auth/google`;
    }
};
