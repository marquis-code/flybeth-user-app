import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const userApiFactory = {
    getProfile() {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/users/me");
    },
    updateProfile(payload: any) {
        return GATEWAY_ENDPOINT_WITH_AUTH.patch("/users/me", payload);
    }
};
