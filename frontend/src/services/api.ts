import axios, { AxiosError, AxiosResponse } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Create an axios instance with base settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Backend URL from .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token in every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle session expiration - try refresh token
    if (error.response && error.response.status === 401) {
      const refreshToken = sessionStorage.getItem("refresh_token") || localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { default: AuthService } = await import("./auth.service");
          const newTokens = await AuthService.refreshToken(refreshToken);
          if (newTokens && error.config) {
            // Retry original request with new access token
            error.config.headers = error.config.headers || {};
            error.config.headers["Authorization"] = `Bearer ${newTokens.access_token}`;
            // Update storage
            if (localStorage.getItem("refresh_token")) {
              localStorage.setItem("token", newTokens.access_token);
              localStorage.setItem("refresh_token", newTokens.refresh_token);
              localStorage.setItem("user", JSON.stringify(newTokens.user));
            } else {
              sessionStorage.setItem("token", newTokens.access_token);
              sessionStorage.setItem("refresh_token", newTokens.refresh_token);
              sessionStorage.setItem("user", JSON.stringify(newTokens.user));
            }
            return api(error.config);
          }
        } catch (refreshError) {
          // If refresh fails, clear storage and redirect
        }
      }
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      const hadToken = !!(sessionStorage.getItem("token") || localStorage.getItem("token"));
      if (hadToken && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
