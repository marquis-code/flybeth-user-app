import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";
import { useCustomToast } from "@/composables/core/useCustomToast";

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
  GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA,
  IMAGE_UPLOAD_ENDPOINT
];

const { showToast } = useCustomToast();
const { token } = useUser();

// Request Interceptor: Attach Token to Auth Instances
const authInstanceArray = [
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
  IMAGE_UPLOAD_ENDPOINT
];

authInstanceArray.forEach((instance) => {
  instance.interceptors.request.use(
    (config: any) => {
      const accessToken = token.value || useCookie('accessToken').value;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
});

// Response Interceptor: Error Handling & Toasts
instanceArray.forEach((instance) => {
  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => response,
    (err: any) => {
      const { logOut, isLoggedIn } = useUser();
      
      if (!err.response) {
        showToast({
          title: "Connection Error",
          message: "Unable to reach the server. Please check your internet connection.",
          toastType: "error"
        });
        return Promise.reject(err);
      }

      const isAuthOrChatFlow = err.config.url?.match(/\/auth\//) || err.config.url?.match(/\/chat\/support/);
      const isCheckoutFlow = typeof window !== 'undefined' && window.location.pathname.includes('/checkout');
      const errorMessage = err.response.data?.message || err.response.data?.errors?.[0]?.message || "Something went wrong";

      if (err.response.status === 401 && !isAuthOrChatFlow) {
        if (isLoggedIn.value) {
          logOut(!isCheckoutFlow);
        }
      } else if (err.response.status === 401 && isAuthOrChatFlow) {
        console.warn(`[AxiosInterceptor] 401 ignored for ${err.config.url} (Auth/Chat Flow)`);
      } else {
        showToast({
          title: "Request Error",
          message: errorMessage,
          toastType: "error"
        });
      }
      return Promise.reject(err);
    }
  );
});
