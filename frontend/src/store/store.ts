import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import unidadeReducer from "./unidadeSlice";
import themeReducer from "./themeSlice";

const reducer = combineReducers({
  auth: authReducer,
  unidade: unidadeReducer,
  theme: themeReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
