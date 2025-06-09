import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: any;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialAuthState: AuthState = {
  user: (() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  })(),
  token: localStorage.getItem("token") || sessionStorage.getItem("token"),
  refreshToken: localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token"),
  isAuthenticated: !!(localStorage.getItem("token") || sessionStorage.getItem("token")),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; refreshToken: string; user: any; persistent?: boolean }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      
      // Don't store in Redux - let the calling component handle storage
      // This prevents double storage and conflicts
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
