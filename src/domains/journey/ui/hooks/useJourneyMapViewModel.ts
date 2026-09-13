import { useState, useMemo, useEffect } from "react";
import { useFocusTunneling } from "@/src/hooks/ui/useFocusTunneling";
import {
  useGetCourseCatalogQuery,
  useGetEnrolledCoursesQuery,
} from "@/src/domains/journey/data/journeyApi";
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
    xp: number;
  };
  enrolledCourses?: EnrolledCourseListItem[];
  activeCourseSummary: any;
  animatedStyle: any;
  controller: ReturnType<typeof useJourneyMapController>;
  completedNodeId?: string;
}

export interface JourneyMapActions {
  setActiveCourseId: (courseId: string) => void;
  onAddCoursePress: () => void;
  onCloseCatalogSheet: () => void;
  retry: () => void;
}

export interface UseJourneyMapViewModelOptions {
  courseId?: string;
  slug?: string;
  completedNodeId?: string;
}

export function useJourneyMapViewModel(
  options?: UseJourneyMapViewModelOptions,
): {
  model: JourneyMapViewModel;
  actions: JourneyMapActions;
} {
  const [isCourseCatalogPresented, setIsCourseCatalogPresented] =
    useState(false);

  const activeCourse = useActiveCourse(options?.courseId);
  const { courseId, setActiveCourseId } = activeCourse;

  useEffect(() => {
    if (options?.courseId && options.courseId !== courseId) {
      setActiveCourseId(options.courseId);
    }
  }, [options?.courseId, courseId, setActiveCourseId]);

  const journeyMap = useJourneyMap(courseId);
  const { isLoading, isLoaded } = journeyMap;
  const { data: enrolledCourses } = useGetEnrolledCoursesQuery();
  const { data: catalogCourses } = useGetCourseCatalogQuery();

  useEffect(() => {
    if (!options?.slug || options?.courseId) return;
    if (courseId === options.slug) return;
    const match =
      enrolledCourses?.find(
        (c) =>
          c.id === options.slug ||
          c.title.toLowerCase().replace(/\s+/g, "-") ===
            options.slug?.toLowerCase(),
      ) ??
      catalogCourses?.find(
        (c) =>
          c.id === options.slug ||
          c.title.toLowerCase().replace(/\s+/g, "-") ===
            options.slug?.toLowerCase(),
      );
    if (match && match.id !== courseId) {
      setActiveCourseId(match.id);
    }
  }, [
    options?.slug,
    options?.courseId,
    enrolledCourses,
    catalogCourses,
    courseId,
    setActiveCourseId,
  ]);

  const activeCourseSummary = useAppSelector((state) =>
    courseId ? selectCourseHeaderSummaryForCourse(state, courseId) : null,
  );

  const activeNodeId = useAppSelector((state) =>
    courseId ? selectActiveNodeModalIdForCourse(state, courseId) : null,
  );

  const controller = useJourneyMapController(courseId || "", options?.completedNodeId);

  const isAnyOverlayActive =
    activeNodeId !== null ||
    isCourseCatalogPresented ||
    controller.isOverlayOpen;
  const animatedStyle = useFocusTunneling(isAnyOverlayActive);

  const { currentStreak } = useStreak();
  const { totalIP } = useInsightPoints();

  const userStats = useMemo(
    () => ({
      streak: currentStreak,
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
    completedNodeId: options?.completedNodeId,
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
