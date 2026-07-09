import { GATEWAY_ENDPOINT } from "../axios.config";

export const packagesApi = {
    getAll(params: any = {}) {
        return GATEWAY_ENDPOINT.get("/packages", { params });
    },
    getById(id: string) {
        return GATEWAY_ENDPOINT.get(`/packages/${id}`);
    },
    getFeatured() {
        return GATEWAY_ENDPOINT.get("/packages/featured");
    },
    getDynamic(params: any = {}) {
        return GATEWAY_ENDPOINT.get("/packages/dynamic", { params, hideToast: true } as any);
    }
};
