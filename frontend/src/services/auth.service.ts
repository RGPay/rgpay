import api from "./api";

class AuthService {
  async refreshToken(refreshToken: string) {
    try {
      const response = await api.post("/auth/refresh", { refresh_token: refreshToken });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async revokeRefreshTokens(userId: number) {
    return api.post("/auth/revoke-refresh-tokens", { userId });
  }
}

export default new AuthService(); 