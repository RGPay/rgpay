import axios from "axios";

// Create a separate axios instance for auth operations to avoid interceptor loops
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class AuthService {
  async refreshToken(refreshToken: string) {
    try {
      const response = await authApi.post("/auth/refresh", { refresh_token: refreshToken });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async revokeRefreshTokens(userId: number) {
    return authApi.post("/auth/revoke-refresh-tokens", { userId });
  }
}

export default new AuthService(); 