import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import unidadeReducer from "./unidadeSlice";

const reducer = combineReducers({
  auth: authReducer,
  unidade: unidadeReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
