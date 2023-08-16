import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface SelectionState {
  branchIndex: number | null;
  pointIndex: number | null;
  layer: string;
}

const initialState: SelectionState = {
  branchIndex: null,
  pointIndex: null,
  layer: "sky",
};

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setBranchIndex: (state, action) => {
      state.branchIndex = action.payload;
    },
    setPointIndex: (state, action) => {
      state.pointIndex = action.payload;
    },
    setLayer: (state, action) => {
      state.layer = action.payload;
    },
  },
});

export const { setBranchIndex, setPointIndex, setLayer } = selectionSlice.actions;

export const selectSelection = (state: RootState) => state.selection;

export default selectionSlice.reducer;
