import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
}

const initialAuthState: AuthState = {
  user: (() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  })(),
  token: sessionStorage.getItem('token'),
  isAuthenticated: !!sessionStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;

const reducer = authSlice.reducer;

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
