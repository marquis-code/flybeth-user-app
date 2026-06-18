import { GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA } from '../axios.config';

export const uploadApiFactory = {
  uploadImage: (formData: FormData) => {
    return GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post('/upload/image', formData);
  },
  uploadDocument: (formData: FormData) => {
    return GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post('/upload/document', formData);
  }
};
