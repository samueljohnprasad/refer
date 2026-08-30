import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  Easing,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { CourseHeaderSummary, EnrolledCourseListItem } from "@/src/types/journeyV5";
import { resolveCourseAccentColor } from "@/src/domains/journey/model/courseVisuals";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

export const PALETTE = {
  warmWhite: "#FFFFFF",
  sage100: "#E5EDE1",
  sage300: "#ABC0A2",
  sage500: "#5F7F58",
  sage600: "#44633F",
} as const;

export const FONTS = {
  body: APP_FONT_FAMILIES.regular,
  bodyMedium: APP_FONT_FAMILIES.semiBold,
  bodyBold: APP_FONT_FAMILIES.bold,
  heading: APP_FONT_FAMILIES.extraBold,
} as const;

export type HeaderOverlayContentProps = {
  translateY: SharedValue<number>;
  enrolledCourses?: EnrolledCourseListItem[];
  activeCourseId?: string | null;
  activeCourseSummary?: CourseHeaderSummary | null;
  onAddCoursePress?: () => void;
  onCourseSelect?: (courseId: string) => void;
};

export function formatProgressPercent(progress: number): string {
  return `${Math.round(progress * 100)}%`;
}

export function useHeaderOverlayContentViewModel({
  translateY,
  enrolledCourses,
  activeCourseId,
  activeCourseSummary,
  onAddCoursePress,
  onCourseSelect,
}: HeaderOverlayContentProps) {
  const { width } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const courses = enrolledCourses ?? [];
  const activeCourse = courses.find((c) => c.id === activeCourseId);
  const courseAccentColor = activeCourse
    ? resolveCourseAccentColor(activeCourse.colorHex)
    : PALETTE.sage300;

  const animatedColor = useSharedValue(courseAccentColor);

  useEffect(() => {
    animatedColor.value = withTiming(courseAccentColor, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [courseAccentColor, animatedColor]);

  const animatedRectProps = useAnimatedProps(() => {
    return {
      fill: animatedColor.value,
    };
  });

  const progress = activeCourseSummary
    ? activeCourseSummary.completedNodes /
      Math.max(activeCourseSummary.totalNodes, 1)
    : 0;
  const completedNodes = activeCourseSummary?.completedNodes ?? 0;
  const totalNodes = activeCourseSummary?.totalNodes ?? 0;
  const sectionNumber = activeCourseSummary?.activeSectionNumber ?? 1;
  const sectionCount = activeCourseSummary?.sectionCount ?? 0;
  const progressPercent = formatProgressPercent(progress);

  const animatedProgressNumber = useSharedValue(0);

  useEffect(() => {
    animatedProgressNumber.value = withTiming(progress, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, animatedProgressNumber]);

  const animatedProgressTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(animatedProgressNumber.value * 100)}%`,
    } as any;
  });

  return {
    width,
    animatedStyle,
    courses,
    activeCourseId,
    animatedRectProps,
    progress,
    completedNodes,
    totalNodes,
    sectionNumber,
    sectionCount,
    progressPercent,
    animatedProgressTextProps,
    onAddCoursePress,
    onCourseSelect,
  };
}
