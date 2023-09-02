import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import routeReducer from "./routeSlice";
import userPreferencesReducer from "./preferencesSlice";
import selectionReducer from "./selectionSlice";
import thingVisibilityReducer from "./thingVisibilitySlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["route"],
};

const rootReducer = combineReducers({
  route: routeReducer,
  thingVisibility: thingVisibilityReducer,
  selection: selectionReducer,
  userPreferences: userPreferencesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
