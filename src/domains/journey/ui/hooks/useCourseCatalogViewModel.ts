import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import {
  useGetCourseCatalogQuery,
  useGetCourseTreeQuery,
  useStartCourseMutation,
} from "@/src/domains/journey/data/journeyApi";
import { buildCourseJourneyPreview } from "@/src/domains/journey/model/courseCatalogPreview";
import type {
  CourseCatalogListItem,
  CourseJourneyPreviewSection,
  EnrolledCourseListItem,
} from "@/src/types/journeyV5";
import { resolveCourseAccentColor } from "@/src/domains/journey/model/courseVisuals";

export interface CourseCatalogSheetProps {
  isPresented: boolean;
  activeCourseId?: string | null;
  enrolledCourses?: EnrolledCourseListItem[];
  onClose: () => void;
  onCourseSelect?: (courseId: string) => void;
}

function resolveInitialCourseId(
  courses: CourseCatalogListItem[],
  enrolledCourseIds: Set<string>,
  activeCourseId?: string | null,
): string | null {
  if (courses.length === 0) return null;
  const firstNotEnrolledCourse = courses.find(
    (course) => !enrolledCourseIds.has(course.id),
  );
  if (firstNotEnrolledCourse) return firstNotEnrolledCourse.id;
  const activeCourse = courses.find((course) => course.id === activeCourseId);
  if (activeCourse) return activeCourse.id;
  return courses[0]?.id ?? null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "error" in error) {
    const value = (error as { error?: unknown }).error;
    if (typeof value === "string") return value;
  }
  return "Something went wrong while opening this course.";
}

export function useCourseAccordionViewModel(course: CourseCatalogListItem, isExpanded: boolean) {
  const courseAccentColor = resolveCourseAccentColor(course.colorHex);
  const { data: selectedCourseTree, isFetching: isPreviewLoading } =
    useGetCourseTreeQuery(course.id, { skip: !isExpanded });

  const preview = useMemo(
    () => (selectedCourseTree ? buildCourseJourneyPreview(selectedCourseTree) : null),
    [selectedCourseTree],
  );

  const expansionProgress = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    expansionProgress.value = withTiming(isExpanded ? 1 : 0, {
      duration: 350,
      easing: Easing.out(Easing.exp),
    });
  }, [isExpanded, expansionProgress]);

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(expansionProgress.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  return { courseAccentColor, isPreviewLoading, preview, animatedChevronStyle };
}

export function useCourseCatalogViewModel(props: CourseCatalogSheetProps) {
  const { activeCourseId, enrolledCourses, isPresented, onClose, onCourseSelect } = props;
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [expandedCourseIds, setExpandedCourseIds] = useState<Set<string>>(new Set());
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(isPresented);

  useEffect(() => {
    if (isPresented) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isPresented]);

  const { data: catalogCourses = [], isFetching: isCatalogLoading } =
    useGetCourseCatalogQuery(undefined, {
      skip: !isPresented,
      refetchOnMountOrArgChange: true,
    });

  const enrolledCourseIds = useMemo(
    () => new Set((enrolledCourses ?? []).map((course) => course.id)),
    [enrolledCourses],
  );

  useEffect(() => {
    if (!isPresented || catalogCourses.length === 0) return;
    const hasValidExpanded = Array.from(expandedCourseIds).some((id) =>
      catalogCourses.some((c) => c.id === id),
    );
    if (hasValidExpanded) return;

    const initialId = resolveInitialCourseId(
      catalogCourses,
      enrolledCourseIds,
      activeCourseId,
    );
    if (initialId) {
      setExpandedCourseIds(new Set([initialId]));
    }
  }, [activeCourseId, catalogCourses, enrolledCourseIds, isPresented, expandedCourseIds]);

  const [startCourse, { isLoading: isStartingCourse }] = useStartCourseMutation();

  const handleToggle = useCallback(
    (id: string) => {
      setExpandedCourseIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          const idx = catalogCourses.findIndex((c) => c.id === id);
          if (idx !== -1 && listRef.current) {
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index: idx,
                animated: true,
                viewPosition: 0,
              });
            }, 150);
          }
        }
        return next;
      });
      setEnrollmentError(null);
    },
    [catalogCourses],
  );

  const handlePrimaryActionPress = useCallback(
    async (courseId: string) => {
      setEnrollmentError(null);
      const course = catalogCourses.find((c) => c.id === courseId);
      if (!course) return;
      const isEnrolled = enrolledCourseIds.has(courseId);

      try {
        if (!isEnrolled) {
          await startCourse(courseId).unwrap();
        }
        onCourseSelect?.(courseId);
        onClose();
      } catch (error) {
        setEnrollmentError(getErrorMessage(error));
      }
    },
    [catalogCourses, enrolledCourseIds, startCourse, onCourseSelect, onClose],
  );

  return {
    model: {
      insets,
      listRef,
      expandedCourseIds,
      enrollmentError,
      shouldRender,
      catalogCourses,
      isCatalogLoading,
      enrolledCourseIds,
      isStartingCourse,
      isPresented,
    },
    actions: {
      handleToggle,
      handlePrimaryActionPress,
      onClose,
    },
  };
}
