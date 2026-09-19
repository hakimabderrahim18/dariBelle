import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Robust dynamic resolver for API base URL with auto-healing
export const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "";

  // If in browser and deployed (e.g. *.vercel.app)
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocal && (!url || url.includes("localhost"))) {
      url = "https://daribelle.onrender.com/api/v1";
    }
  }

  // Fallback default
  if (!url) {
    url = "https://daribelle.onrender.com/api/v1";
  }

  // Self-heal: automatically fix daribelle-api.onrender.com -> daribelle.onrender.com
  if (url.includes("daribelle-api.onrender.com")) {
    url = url.replace("daribelle-api.onrender.com", "daribelle.onrender.com");
  }

  return url.replace(/\/+$/, "");
};

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.baseURL && config.baseURL.includes("daribelle-api.onrender.com")) {
      config.baseURL = config.baseURL.replace("daribelle-api.onrender.com", "daribelle.onrender.com");
    }
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.errors?.expired &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${getApiBaseUrl()}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data.data?.accessToken) {
          useAuthStore.getState().login(useAuthStore.getState().user, data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
