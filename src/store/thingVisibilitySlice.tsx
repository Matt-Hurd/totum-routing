import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface ThingVisibilityState {
  thingVisibility: Record<string, boolean>;
  hideThingsInBranch: boolean;
}

const initialState: ThingVisibilityState = {
  thingVisibility: {},
  hideThingsInBranch: false,
};

export const thingVisibilitySlice = createSlice({
  name: "thingVisibility",
  initialState,
  reducers: {
    setThingVisibility: (state, action: PayloadAction<{ type: string; visible: boolean }>) => {
      state.thingVisibility[action.payload.type] = action.payload.visible;
    },
    toggleHideThingsInBranch: (state) => {
      state.hideThingsInBranch = !state.hideThingsInBranch;
    },
  },
});

export const { setThingVisibility, toggleHideThingsInBranch } = thingVisibilitySlice.actions;
export const selectThingVisibility = (state: RootState) => state.thingVisibility;
export default thingVisibilitySlice.reducer;
