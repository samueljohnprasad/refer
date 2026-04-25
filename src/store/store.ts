import { configureStore } from "@reduxjs/toolkit";
import sectionMapReducer from "./slices/sectionMapSlice";
import enrolledCoursesReducer from "./slices/enrolledCoursesSlice";
import { enrolledCoursesApi } from "./api/enrolledCoursesApi";
import { sectionMapApi } from "./api/sectionMapApi";

export const store = configureStore({
  reducer: {
    sectionMap: sectionMapReducer,
    enrolledCourses: enrolledCoursesReducer,
    [enrolledCoursesApi.reducerPath]: enrolledCoursesApi.reducer,
    [sectionMapApi.reducerPath]: sectionMapApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["sectionMap/setSectionUnits"],
      },
    }).concat(enrolledCoursesApi.middleware, sectionMapApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
