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
  (error: AxiosError) => {
    // Handle session expiration - redirect to login
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
