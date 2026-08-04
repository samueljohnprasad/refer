// store/store.ts
// Redux store with normalized journey state + RTK Query middleware.

import { configureStore } from "@reduxjs/toolkit";
import journeyReducer from "@/src/domains/journey/state/journeySlice";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import happyAssistantReducer from "@/src/store/slices/happyAssistantSlice";
import { timelineReducer } from "@/src/domains/timeline/state/timeline.slice";
import { v1LearningSessionReducer } from "@/src/domains/journey/learning/v1LearningSessionSlice";

export const store = configureStore({
  reducer: {
    journey: journeyReducer,
    happyAssistant: happyAssistantReducer,
    timeline: timelineReducer,
    v1LearningSessions: v1LearningSessionReducer,
    [journeyApi.reducerPath]: journeyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(journeyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
