// store/store.ts
// Redux store with normalized journey state + RTK Query middleware.

import {
  configureStore,
  createAction,
  combineReducers,
} from "@reduxjs/toolkit";
import journeyReducer from "@/src/domains/journey/state/journeySlice";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import happyAssistantReducer from "@/src/store/slices/happyAssistantSlice";
import { timelineReducer } from "@/src/domains/timeline/state/timeline.slice";
import { v1LearningSessionReducer } from "@/src/domains/journey/learning/v1LearningSessionSlice";

// ponytail: single action resets all slices to initialState on sign-out/delete
export const resetStore = createAction("app/resetStore");

const appReducer = combineReducers({
  journey: journeyReducer,
  happyAssistant: happyAssistantReducer,
  timeline: timelineReducer,
  v1LearningSessions: v1LearningSessionReducer,
  [journeyApi.reducerPath]: journeyApi.reducer,
});

type AppReducerState = ReturnType<typeof appReducer>;

const rootReducer = (
  state: AppReducerState | undefined,
  action: { type: string },
): AppReducerState => {
  // On sign-out / account deletion, wipe all Redux state
  if (action.type === resetStore.type) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(journeyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
