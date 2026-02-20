import { GATEWAY_ENDPOINT } from "../axios.config";

export const carsApi = {
    search(params: any) {
        return GATEWAY_ENDPOINT.get("/cars/search", { params });
    },
    getById(id: string) {
        return GATEWAY_ENDPOINT.get(`/cars/${id}`);
    },
    getAll() {
        return GATEWAY_ENDPOINT.get("/cars");
    }
};
