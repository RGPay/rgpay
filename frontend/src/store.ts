import { configureStore } from "@reduxjs/toolkit";

// Placeholder reducer
const reducer = (state = {}) => state;

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
