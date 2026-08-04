import { GATEWAY_ENDPOINT_WITH_AUTH, GATEWAY_ENDPOINT } from "../axios.config";

export const esimsApi = {
  getPackages(params?: any) {
    return GATEWAY_ENDPOINT.get("/esims/packages", { params });
  },

  submitOrder(data: { packageId: string; quantity: number }) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post("/esims/orders", data);
  },

  getInstructions(iccid: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/esims/sims/${iccid}/instructions`);
  },
};
