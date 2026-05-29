import { GATEWAY_ENDPOINT } from '../axios.config';

export const utilitiesApi = {
  $_get_airlines: () => {
    return GATEWAY_ENDPOINT.get('/integrations/duffel/airlines');
  },
  $_get_airports: () => {
    return GATEWAY_ENDPOINT.get('/integrations/duffel/airports');
  },
  $_get_cities: () => {
    return GATEWAY_ENDPOINT.get('/integrations/duffel/cities');
  }
};
