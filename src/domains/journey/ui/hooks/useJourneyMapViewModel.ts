import { useState, useMemo } from "react";
import { useFocusTunneling } from "@/src/hooks/ui/useFocusTunneling";
import { useGetEnrolledCoursesQuery } from "@/src/domains/journey/data/journeyApi";
import {
  selectCourseHeaderSummaryForCourse,
  selectActiveNodeModalIdForCourse,
} from "@/src/domains/journey/state/journeySelectors";
import { useAppSelector } from "@/src/store/hooks";
import { useActiveCourse } from "@/hooks/journey/useActiveCourse";
import { useJourneyMap } from "@/hooks/journey/useJourneyMap";
import { useJourneyMapController } from "./useJourneyMapController";
import { useStreak } from "@/src/hooks/useStreak";
import { useInsightPoints } from "@/src/hooks/useInsightPoints";
import type { EnrolledCourseListItem } from "@/src/types/journeyV5";

export interface JourneyMapViewModel {
  courseId: string | null;
  isPreparing: boolean;
  loadError?: string;
  hasNoCourses: boolean;
  isCourseCatalogPresented: boolean;
  userStats: {
    streak: number;
    gems: number;
    hearts: number;
    xp: number;
  };
  enrolledCourses?: EnrolledCourseListItem[];
  activeCourseSummary: any;
  animatedStyle: any;
  controller: ReturnType<typeof useJourneyMapController>;
}

export interface JourneyMapActions {
  setActiveCourseId: (courseId: string) => void;
  onAddCoursePress: () => void;
  onCloseCatalogSheet: () => void;
  retry: () => void;
}

export function useJourneyMapViewModel(): {
  model: JourneyMapViewModel;
  actions: JourneyMapActions;
} {
  const [isCourseCatalogPresented, setIsCourseCatalogPresented] =
    useState(false);

  const activeCourse = useActiveCourse();
  const { courseId, setActiveCourseId } = activeCourse;
  const journeyMap = useJourneyMap(courseId);
  const { isLoading, isLoaded } = journeyMap;
  const { data: enrolledCourses } = useGetEnrolledCoursesQuery();
  const activeCourseSummary = useAppSelector((state) =>
    courseId ? selectCourseHeaderSummaryForCourse(state, courseId) : null,
  );

  const activeNodeId = useAppSelector((state) =>
    courseId ? selectActiveNodeModalIdForCourse(state, courseId) : null,
  );
  const isModalOpen = activeNodeId !== null;

  const controller = useJourneyMapController(courseId || "");
  const animatedStyle = useFocusTunneling(isModalOpen);

  const { currentStreak } = useStreak();
  const { totalIP } = useInsightPoints();

  const userStats = useMemo(
    () => ({
      streak: currentStreak,
      gems: 0,
      hearts: 5,
      xp: totalIP,
    }),
    [currentStreak, totalIP],
  );

  const activeCourseError = activeCourse.isLoading
    ? undefined
    : activeCourse.error;
  const loadError =
    journeyMap.error ?? (!courseId ? activeCourseError : undefined);
  const hasNoCourses =
    !activeCourse.isLoading && !loadError && courseId === null;
  const isPreparing =
    !loadError &&
    !hasNoCourses &&
    (activeCourse.isLoading || (isLoading && !isLoaded));

  const model: JourneyMapViewModel = {
    courseId,
    isPreparing,
    loadError,
    hasNoCourses,
    isCourseCatalogPresented,
    userStats,
    enrolledCourses,
    activeCourseSummary,
    animatedStyle,
    controller,
  };

  const actions: JourneyMapActions = {
    setActiveCourseId,
    onAddCoursePress: () => setIsCourseCatalogPresented(true),
    onCloseCatalogSheet: () => setIsCourseCatalogPresented(false),
    retry: () => {
      activeCourse.retry();
      journeyMap.retry();
    },
  };

  return { model, actions };
}
