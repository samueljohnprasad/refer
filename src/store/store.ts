// store/store.ts
// Redux store with normalized journey state + RTK Query middleware.

import { configureStore } from "@reduxjs/toolkit";
import journeyReducer from "@/src/features/journey/journeySlice";
import { journeyApi } from "@/src/features/journey/journeyApi";

export const store = configureStore({
  reducer: {
    journey: journeyReducer,
    [journeyApi.reducerPath]: journeyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(journeyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
