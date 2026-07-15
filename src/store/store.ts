// store/store.ts
// Redux store with normalized journey state + RTK Query middleware.

import { configureStore } from "@reduxjs/toolkit";
import journeyReducer from "@/src/features/journey/journeySlice";
import { journeyApi } from "@/src/features/journey/journeyApi";
import happyAssistantReducer from "@/src/store/slices/happyAssistantSlice";
import { timelineApi } from "@/src/store/api/timelineApi";

export const store = configureStore({
  reducer: {
    journey: journeyReducer,
    happyAssistant: happyAssistantReducer,
    [journeyApi.reducerPath]: journeyApi.reducer,
    [timelineApi.reducerPath]: timelineApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(journeyApi.middleware, timelineApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
