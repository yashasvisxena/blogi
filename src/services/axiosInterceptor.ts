import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "@/store/authStore";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const setupInterceptors = (apiClient: AxiosInstance) => {
  apiClient.interceptors.request.use(
    async (config) => {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshSubscribers.push((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await axios.post(
            "/api/auth/refresh",
            {},
            {
              withCredentials: true,
            }
          );

          const newAccessToken = refreshResponse.data.accessToken;
          useAuthStore.getState().setAccessToken(newAccessToken);

          refreshSubscribers.forEach((cb) => cb(newAccessToken));
          refreshSubscribers = [];

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("Refresh failed. Logging out...");

          try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
          } catch (e: unknown) {
            // even if logout fails, continue cleanup
          }

          useAuthStore.getState().logout();
          window.location.href = "/login";

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
