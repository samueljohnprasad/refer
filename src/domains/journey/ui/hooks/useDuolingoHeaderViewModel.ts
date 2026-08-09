import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { AnimatedFireIcon, GrayFireIcon } from "@/src/components/ui/AnimatedStatIcon";
import { CourseHeaderIcon } from "@/src/domains/journey/ui/components/CourseHeaderIcon";
import type { CourseHeaderSummary, EnrolledCourseListItem } from "@/src/types/journeyV5";

const SHEET_SPRING = { damping: 14, stiffness: 50, mass: 1 } as const;

export interface DuolingoHeaderStats {
  streak: number;
  gems: number;
  hearts: number;
  xp: number;
}

export interface DuolingoHeaderProps {
  stats?: DuolingoHeaderStats;
  enrolledCourses?: EnrolledCourseListItem[];
  activeCourseId?: string | null;
  activeCourseSummary?: CourseHeaderSummary | null;
onAddCoursePress?: () => void;
  onCourseSelect?: (courseId: string) => void;
}

export function useDuolingoHeaderViewModel({
  stats,
  enrolledCourses,
  activeCourseId,
  activeCourseSummary,
  onAddCoursePress,
  onCourseSelect,
}: DuolingoHeaderProps) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const [showCourseOverlay, setShowCourseOverlay] = useState(false);
  const [showStreakOverlay, setShowStreakOverlay] = useState(false);
  const previousActiveCourseIdRef = useRef(activeCourseId);

  const openCourseOverlay = useCallback((): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCourseOverlay(true);
    setShowStreakOverlay(false);
    translateY.value = withSpring(0, SHEET_SPRING);
  }, [translateY]);

  const openStreakOverlay = useCallback((): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowStreakOverlay(true);
  }, []);

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

    if (!showCourseOverlay) {
      return;
    }

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
    return {
      opacity: opacity,
    };
  });

  const insets = useSafeAreaInsets();
  const enrolledCourseCount = enrolledCourses?.length ?? 0;

  const streak = stats?.streak ?? 0;
  const isStreakActive = streak > 0;

  const buttons = [
    {
      accessibilityLabel: `${enrolledCourseCount} enrolled courses`,
      name: "Courses",
      Icon: CourseHeaderIcon,
      onPress: openCourseOverlay,
      title: String(enrolledCourseCount),
      textClassName: "text-ink",
    },
    {
      accessibilityLabel: `${streak} day streak`,
      name: "Fire",
      Icon: isStreakActive ? AnimatedFireIcon : GrayFireIcon,
      onPress: openStreakOverlay,
      title: String(streak),
      textClassName: isStreakActive ? "text-gold" : "text-ink-muted",
    },
  ];

  return {
    buttons,
    showCourseOverlay,
    headerHeight,
    insets,
    windowHeight,
    animatedOverlayStyle,
    handleTouchStart,
    translateY,
    enrolledCourses,
    activeCourseId,
    activeCourseSummary,
    onAddCoursePress,
    handleCourseSelect,
    setHeaderHeight,
    showStreakOverlay,
    setShowStreakOverlay,
  };
}
