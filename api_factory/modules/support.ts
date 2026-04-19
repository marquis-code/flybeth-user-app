import { GATEWAY_ENDPOINT } from '../axios.config';

export const supportApi = {
  subscribeNewsletter(email: string, source: string = 'footer') {
    return GATEWAY_ENDPOINT.post('/support/newsletter/subscribe', { email, source });
  },

  submitInquiry(data: { name: string; email: string; subject: string; message: string }) {
    return GATEWAY_ENDPOINT.post('/support/contact/submit', data);
  },

  // Admin routes (if used in user app by any chance, but mostly for completeness)
  getInquiries() {
    return GATEWAY_ENDPOINT.get('/support/contact');
  },

  getSubscriptions() {
    return GATEWAY_ENDPOINT.get('/support/newsletter');
  }
};
