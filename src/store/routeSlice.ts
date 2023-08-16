import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Branch, Game, Point, Route } from "../models";
import { RootState } from ".";

interface RouteState {
  route: Route;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RouteState = {
  route: new Route('', '', new Game('', '')),
  status: 'idle',
  error: null
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    uploadRoute: (state, action: PayloadAction<Route>) => {
      console.log(action.payload);
      state.route = action.payload;
      state.status = 'succeeded';
    },
    addBranch: (state, action: PayloadAction<Branch>) => {
      state.route.branches.push(action.payload);
    },
    updateBranch: (state, action: PayloadAction<{branch: Branch, index: number}>) => {
      state.route.branches[action.payload.index] = action.payload.branch;
    },
    updateBranches: (state, action: PayloadAction<{branches: Branch[]}>) => {
      state.route.branches= action.payload.branches;
    },
    deleteBranch: (state, action: PayloadAction<number>) => {
      state.route.branches.splice(action.payload, 1);
    },
    addPoint: (state, action: PayloadAction<{branchIndex: number, point: Point, pointIndex: number}>) => {
      state.route.branches[action.payload.branchIndex].points.splice(action.payload.pointIndex, 0, action.payload.point);
    },
    updatePoint: (state, action: PayloadAction<{branchIndex: number, point: Point, pointIndex: number}>) => {
      state.route.branches[action.payload.branchIndex].points[action.payload.pointIndex] = action.payload.point;
    },
    deletePoint: (state, action: PayloadAction<{branchIndex: number, pointIndex: number}>) => {
      state.route.branches[action.payload.branchIndex].points.splice(action.payload.pointIndex, 1);
    },
  }
});

export const { uploadRoute, addBranch, updateBranch, updateBranches, deleteBranch, addPoint, updatePoint, deletePoint } = routeSlice.actions;

export const selectRouteStatus = (state: RootState) => state.route.status;
export const selectRouteData = (state: RootState) => state.route.route;
export const selectRouteError = (state: RootState) => state.route.error;

export default routeSlice.reducer;
