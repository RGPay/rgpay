import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User, AuthTokens } from "../types/auth.types";

const initialAuthState: AuthState = {
  user: (() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  })(),
  token: sessionStorage.getItem("token"),
  refreshToken: sessionStorage.getItem("refresh_token"),
  isAuthenticated: !!sessionStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action: PayloadAction<AuthTokens>) => {
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      sessionStorage.setItem("token", action.payload.access_token);
      sessionStorage.setItem("refresh_token", action.payload.refresh_token);
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
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
