import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSettings } from "../services/settings.service";

export interface ThemeState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: ThemeState = {
  settings: null,
  loading: false,
  error: null,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeSettings: (state, action: PayloadAction<UserSettings>) => {
      state.settings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setThemeLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setThemeError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearThemeError: (state) => {
      state.error = null;
    },
    updateThemeSettings: (
      state,
      action: PayloadAction<Partial<UserSettings>>
    ) => {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      }
    },
  },
});

export const {
  setThemeSettings,
  setThemeLoading,
  setThemeError,
  clearThemeError,
  updateThemeSettings,
} = themeSlice.actions;

export default themeSlice.reducer;
