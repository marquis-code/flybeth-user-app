import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";

const rawBaseUrl = (import.meta.env.VITE_BASE_URL as string) || "http://localhost:3000";
const $GATEWAY_ENDPOINT_WITHOUT_VERSION = rawBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
const $GATEWAY_ENDPOINT = `${$GATEWAY_ENDPOINT_WITHOUT_VERSION}/api/v1`;
const $GATEWAY_ENDPOINT_V2 = `${$GATEWAY_ENDPOINT_WITHOUT_VERSION}/v2`;
const $IMAGE_UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string;

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  withCredentials: true,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2,
  withCredentials: true,
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  withCredentials: true,
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
  withCredentials: true,
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
  withCredentials: true,
});

export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
  withCredentials: true,
});

export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
  GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA
];

instanceArray.forEach((instance) => {
  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => response,
    (err: any) => {
      const { logOut, isLoggedIn } = useUser();
      
      if (!err.response) {
        return Promise.reject(err);
      }

      const isAuthOrChatFlow = err.config.url?.match(/\/auth\//) || err.config.url?.match(/\/chat\/support/);

      if (err.response.status === 401 && !isAuthOrChatFlow) {
        if (isLoggedIn.value) {
          logOut();
        }
      } else if (err.response.status === 401 && isAuthOrChatFlow) {
        console.warn(`[AxiosInterceptor] 401 ignored for ${err.config.url} (Auth/Chat Flow)`);
      }
      return Promise.reject(err);
    }
  );
});
