import { GATEWAY_ENDPOINT } from "../axios.config";

export const couponsApi = {
  /** Public promo codes that may be shown on the landing page. */
  getActive(limit = 3) {
    return GATEWAY_ENDPOINT.get("/coupons/active", { params: { limit } });
  },
  validate(params: { code: string; amount?: number; product?: string }) {
    return GATEWAY_ENDPOINT.get("/coupons/validate", { params });
  },
};
