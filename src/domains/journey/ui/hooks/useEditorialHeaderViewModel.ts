import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { format } from "date-fns";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import type { CourseHeaderSummary, EnrolledCourseListItem } from "@/src/types/journeyV5";

const SHEET_SPRING = { damping: 14, stiffness: 50, mass: 1 } as const;

export interface EditorialHeaderStats {
  streak: number;
  xp: number;
}

export interface EditorialHeaderProps {
  stats?: EditorialHeaderStats;
  enrolledCourses?: EnrolledCourseListItem[];
  activeCourseId?: string | null;
  activeCourseSummary?: CourseHeaderSummary | null;
  onAddCoursePress?: () => void;
  onCourseSelect?: (courseId: string) => void;
}

export function useEditorialHeaderViewModel({
  stats,
  enrolledCourses,
  activeCourseId,
  activeCourseSummary,
  onAddCoursePress,
  onCourseSelect,
}: EditorialHeaderProps) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const [showCourseOverlay, setShowCourseOverlay] = useState(false);
  const previousActiveCourseIdRef = useRef(activeCourseId);

  const openCourseOverlay = useCallback((): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCourseOverlay(true);
    translateY.value = withSpring(0, SHEET_SPRING);
  }, [translateY]);

  const handleTouchStart = useCallback(() => {
    translateY.value = withSpring(
      -windowHeight / 2,
      { damping: 14, stiffness: 50, mass: 1 },
      (finished) => {
        if (finished) {
          scheduleOnRN(setShowCourseOverlay, false);
        }
      },
    );
  }, [translateY, windowHeight]);

  const handleCourseSelect = (courseId: string) => {
    onCourseSelect?.(courseId);
    handleTouchStart();
  };

  useEffect(() => {
    translateY.value = -windowHeight / 2;
  }, [translateY, windowHeight]);

  useEffect(() => {
    const previousActiveCourseId = previousActiveCourseIdRef.current;
    previousActiveCourseIdRef.current = activeCourseId;

    if (!showCourseOverlay) return;

    if (
      previousActiveCourseId &&
      activeCourseId &&
      previousActiveCourseId !== activeCourseId
    ) {
      handleTouchStart();
    }
  }, [activeCourseId, handleTouchStart, showCourseOverlay]);

  const animatedOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-windowHeight / 2, 0],
      [0, 1],
    );
    return { opacity };
  });

  const insets = useSafeAreaInsets();
  const enrolledCourseCount = enrolledCourses?.length ?? 0;
  const currentDateStr = format(new Date(), "MMMM d");

  return {
    headerHeight,
    setHeaderHeight,
    windowHeight,
    translateY,
    showCourseOverlay,
    openCourseOverlay,
    handleTouchStart,
    handleCourseSelect,
    animatedOverlayStyle,
    insets,
    enrolledCourseCount,
    currentDateStr,
    enrolledCourses,
    activeCourseId,
    activeCourseSummary,
    onAddCoursePress,
  };
}
