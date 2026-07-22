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
}

export function useJourneyMapViewModel(): {
  model: JourneyMapViewModel;
  actions: JourneyMapActions;
} {
  const [isCourseCatalogPresented, setIsCourseCatalogPresented] = useState(false);

  const { courseId, setActiveCourseId } = useActiveCourse();
  const { isLoading, isLoaded } = useJourneyMap(courseId);
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

  const userStats = useMemo(() => ({
    streak: currentStreak,
    gems: 0,
    hearts: 5,
    xp: totalIP,
  }), [currentStreak, totalIP]);

  const isPreparing = !courseId || (isLoading && !isLoaded);

  const model: JourneyMapViewModel = {
    courseId,
    isPreparing,
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
  };

  return { model, actions };
}
