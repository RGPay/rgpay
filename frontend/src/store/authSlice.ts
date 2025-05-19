import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: any;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

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
    login: (state, action: PayloadAction<{ token: string; refreshToken: string; user: any }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("refresh_token", action.payload.refreshToken);
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
