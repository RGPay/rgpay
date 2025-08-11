import axios, {
  AxiosError,
  AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL || baseURL === "http://localhost") {
  console.warn(
    "[RGPay] Atenção: VITE_API_BASE_URL não está configurada para produção. Valor atual:",
    baseURL
  );
}

// Create an axios instance with base settings
const api = axios.create({
  baseURL: baseURL, // Backend URL from .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle session expiration - try refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Skip refresh logic if the failing request is already a refresh request
      if (originalRequest.url?.includes('/auth/refresh')) {
        // Clear storage and redirect for refresh token failures
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true; // Prevent infinite loops
      isRefreshing = true;
      
      const refreshToken = sessionStorage.getItem("refresh_token") || localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { default: AuthService } = await import("./auth.service");
          const newTokens = await AuthService.refreshToken(refreshToken);
          if (newTokens && originalRequest) {
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
            
            // Process queued requests
            processQueue(null, newTokens.access_token);
            
            // Retry original request with new access token
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${newTokens.access_token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, clear storage and redirect
          processQueue(refreshError, null);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refresh_token");
          sessionStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      // Clear storage and redirect if no refresh token
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
