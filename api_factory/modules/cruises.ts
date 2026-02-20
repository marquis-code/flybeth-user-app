import { GATEWAY_ENDPOINT } from "../axios.config";

export const cruisesApi = {
    search(params: any) {
        return GATEWAY_ENDPOINT.get("/cruises/search", { params });
    },
    getById(id: string) {
        return GATEWAY_ENDPOINT.get(`/cruises/${id}`);
    }
};
