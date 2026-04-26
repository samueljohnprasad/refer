import { configureStore } from "@reduxjs/toolkit";
import sectionMapReducer from "./slices/sectionMapSlice";
import enrolledCoursesReducer from "./slices/enrolledCoursesSlice";

export const store = configureStore({
  reducer: {
    sectionMap: sectionMapReducer,
    enrolledCourses: enrolledCoursesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["sectionMap/setSectionUnits"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
