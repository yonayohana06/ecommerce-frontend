import axios, { AxiosError } from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const TOKEN_KEY = "jwt_token";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Pre-configured Axios instance for E-Commerce API.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: baseURL.replace(/\/+$/, ""), // Trim trailing slash
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Token management helpers
 */
export const tokenStorage = {
  get: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// Request Interceptor: Attach Bearer token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const isLoginRequest = error.config?.url?.includes("/admin/auth/login");

    if (
      error.response?.status === 401 ||
      (error.response?.status === 403 && !isLoginRequest)
    ) {
      // Clear token & stored user on 401 Unauthorized or 403 Forbidden
      tokenStorage.remove();
      localStorage.removeItem("admin_user");

      // Redirect to signin if not already on the signin page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/signin")
      ) {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
