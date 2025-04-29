import axios, { AxiosInstance } from "axios";
// import useCommonStore from "@/store/CommonStore";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const setupInterceptors = (apiClient: AxiosInstance) => {
  apiClient.interceptors.request.use(
    async (config) => {
      const accessToken = null;
      //useCommonStore.getState().accessToken;
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
          const refreshResponse = await axios.get(
            "/api/auth/refreshAccessToken",
            {
              withCredentials: true,
            }
          );

          const newAccessToken = refreshResponse.data.access_token;
          //   useCommonStore.getState().setAccessToken(newAccessToken);

          refreshSubscribers.forEach((cb) => cb(newAccessToken));
          refreshSubscribers = [];

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("Refresh failed. Logging out...");

          // 🔥 Hit logout API
          try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
          } catch (_) {
            // even if logout fails, continue cleanup
          }

          //   useCommonStore.getState().setAccessToken(null);
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
