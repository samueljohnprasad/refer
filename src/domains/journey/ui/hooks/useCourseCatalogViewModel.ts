import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useGetCourseCatalogQuery,
  useGetCourseTreeQuery,
  useStartCourseMutation,
} from "@/src/domains/journey/data/journeyApi";
import { buildCourseOverview } from "@/src/domains/journey/model/courseOverview";
import type {
  CourseCatalogListItem,
  EnrolledCourseListItem,
} from "@/src/types/journeyV5";

export interface CourseCatalogSheetProps {
  isPresented: boolean;
  enrolledCourses?: EnrolledCourseListItem[];
  onClose: () => void;
  onCourseSelect?: (courseId: string) => void;
}

export function useCourseCatalogViewModel(props: CourseCatalogSheetProps) {
  const { enrolledCourses, isPresented, onClose, onCourseSelect } = props;
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<CourseCatalogListItem> | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(isPresented);

  useCourseCatalogPresentation(isPresented, setShouldRender, setSelectedCourseId);

  const { data: catalogCourses = [], isFetching: isCatalogLoading } =
    useGetCourseCatalogQuery(undefined, {
      skip: !isPresented,
      refetchOnMountOrArgChange: true,
    });

  const selectedCourse = useMemo(
    () => catalogCourses.find((course) => course.id === selectedCourseId) ?? null,
    [catalogCourses, selectedCourseId],
  );
  const enrolledCourseIds = useMemo(
    () => new Set((enrolledCourses ?? []).map((course) => course.id)),
    [enrolledCourses],
  );

  // ponytail: keep the catalog light; load the full published tree on selection.
  const courseTreeQuery = useGetCourseTreeQuery(selectedCourseId ?? "", {
    skip: !isPresented || !selectedCourseId,
  });
  const courseOverview = useMemo(
    () =>
      courseTreeQuery.data ? buildCourseOverview(courseTreeQuery.data) : null,
    [courseTreeQuery.data],
  );

  const [startCourse, { isLoading: isStartingCourse }] =
    useStartCourseMutation();

  const handleCoursePress = useCallback((courseId: string) => {
    setEnrollmentError(null);
    setSelectedCourseId(courseId);
  }, []);

  const handleCourseBack = useCallback(() => {
    setEnrollmentError(null);
    setSelectedCourseId(null);
  }, []);

  const handlePrimaryActionPress = useCallback(
    async (courseId: string) => {
      setEnrollmentError(null);
      const course = catalogCourses.find((item) => item.id === courseId);
      if (!course) return;

      try {
        if (!enrolledCourseIds.has(courseId)) {
          await startCourse(courseId).unwrap();
        }
        onCourseSelect?.(courseId);
        onClose();
      } catch (error) {
        setEnrollmentError(getErrorMessage(error));
      }
    },
    [catalogCourses, enrolledCourseIds, onClose, onCourseSelect, startCourse],
  );

  return {
    model: {
      insets,
      listRef,
      shouldRender,
      isPresented,
      catalogCourses,
      isCatalogLoading,
      enrolledCourseIds,
      selectedCourseId,
      selectedCourse,
      courseOverview,
      isCourseTreeLoading: courseTreeQuery.isFetching,
      hasCourseTreeError: courseTreeQuery.isError,
      isStartingCourse,
      enrollmentError,
    },
    actions: {
      handleCoursePress,
      handleCourseBack,
      handlePrimaryActionPress,
      retryCourseTree: courseTreeQuery.refetch,
      onClose,
    },
  };
}

function useCourseCatalogPresentation(
  isPresented: boolean,
  setShouldRender: (value: boolean) => void,
  setSelectedCourseId: (value: string | null) => void,
): void {
  useEffect(() => {
    if (isPresented) {
      setShouldRender(true);
      return;
    }

    const timer = setTimeout(() => {
      setShouldRender(false);
      setSelectedCourseId(null);
    }, 250);
    return () => clearTimeout(timer);
  }, [isPresented, setSelectedCourseId, setShouldRender]);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "error" in error) {
    const value = (error as { error?: unknown }).error;
    if (typeof value === "string") return value;
  }
  return "Something went wrong while opening this course.";
}
