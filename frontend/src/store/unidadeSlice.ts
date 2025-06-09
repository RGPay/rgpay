import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UnidadeState {
  selectedUnidade: number | null;
}

const initialState: UnidadeState = {
  selectedUnidade: null,
};

const unidadeSlice = createSlice({
  name: "unidade",
  initialState,
  reducers: {
    setSelectedUnidade: (state, action: PayloadAction<number | null>) => {
      state.selectedUnidade = action.payload;
    },
  },
});

export const { setSelectedUnidade } = unidadeSlice.actions;
export default unidadeSlice.reducer;
