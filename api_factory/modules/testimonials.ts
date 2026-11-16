import { GATEWAY_ENDPOINT } from "../axios.config";

export const testimonialsApi = {
  /** Approved + featured reviews, plus the aggregate rating. */
  getFeatured(limit = 4) {
    return GATEWAY_ENDPOINT.get("/testimonials/featured", { params: { limit } });
  },
};
