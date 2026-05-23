import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

import ProgressBar from "../ProgressBar";
import type {
  CourseHeaderSummary,
  EnrolledCourseListItem,
} from "@/src/types/journeyV5";
import {
  getCourseMonogram,
  resolveCourseAccentColor,
} from "./courseVisuals";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const PALETTE = {
  warmWhite: "#FFFFFF",
  sage100: "#E5EDE1",
  sage300: "#ABC0A2",
  sage500: "#5F7F58",
  sage600: "#44633F",
} as const;

const FONTS = {
  body: "GeistRegular",
  bodyMedium: "GeistMedium",
  bodyBold: "GeistBold",
  heading: "FrauncesSemiBold",
} as const;

type HeaderOverlayContentProps = {
  translateY: SharedValue<number>;
  enrolledCourses?: EnrolledCourseListItem[];
  activeCourseId?: string | null;
  activeCourseSummary?: CourseHeaderSummary | null;
  onAddCoursePress?: () => void;
  onCourseSelect?: (courseId: string) => void;
};

function CourseAvatar({
  course,
  isActive,
}: {
  course: EnrolledCourseListItem;
  isActive: boolean;
}): React.JSX.Element {
  const courseAccentColor = resolveCourseAccentColor(course.colorHex);

  return (
    <View
      className="h-[78px] w-[92px] items-center justify-center rounded-[24px] border-2 border-b-4 bg-warm-white"
      style={{
        borderColor: isActive ? courseAccentColor : PALETTE.sage100,
        borderBottomColor: isActive ? PALETTE.sage600 : PALETTE.sage100,
        backgroundColor: isActive ? `${courseAccentColor}12` : PALETTE.warmWhite,
      }}
    >
      <View
        className="h-[56px] w-[56px] items-center justify-center rounded-[18px]"
        style={{ backgroundColor: `${courseAccentColor}1A` }}
      >
        {course.iconUrl ? (
          <Image
            source={course.iconUrl}
            className="h-[38px] w-[38px] rounded-[12px]"
            cachePolicy="memory-disk"
            contentFit="contain"
            transition={150}
          />
        ) : (
          <Text
            style={{
              color: courseAccentColor,
              fontFamily: FONTS.heading,
              fontSize: 29,
            }}
          >
            {getCourseMonogram(course.title)}
          </Text>
        )}
      </View>
    </View>
  );
}

function formatProgressPercent(progress: number): string {
  return `${Math.round(progress * 100)}%`;
}

const HeaderOverlayContent = ({
  translateY,
  enrolledCourses,
  activeCourseId,
  activeCourseSummary,
  onAddCoursePress,
  onCourseSelect,
}: HeaderOverlayContentProps): React.JSX.Element => {
  const { width } = useWindowDimensions();
  const [scoreBarWidth, setScoreBarWidth] = useState(180);

  const handleScoreBarLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && Math.abs(nextWidth - scoreBarWidth) > 1) {
      setScoreBarWidth(nextWidth);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const courses = enrolledCourses ?? [];
  const progress = activeCourseSummary
    ? activeCourseSummary.completedNodes /
      Math.max(activeCourseSummary.totalNodes, 1)
    : 0;
  const completedNodes = activeCourseSummary?.completedNodes ?? 0;
  const totalNodes = activeCourseSummary?.totalNodes ?? 0;
  const sectionNumber = activeCourseSummary?.activeSectionNumber ?? 1;
  const sectionCount = activeCourseSummary?.sectionCount ?? 0;
  const progressPercent = formatProgressPercent(progress);

  return (
    <Animated.View
      className="w-full happy-brand-screen pb-4"
      style={animatedStyle}
    >
      <Svg
        width={width}
        height={16}
        viewBox={`0 0 ${width} 16`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <AnimatedPath
          d={`M0 8 H40 L51 8 L60 1 L69 8 H${width}`}
          fill="none"
          stroke={PALETTE.sage100}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>

      <View className="px-4 pt-7">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3.5 px-1 pb-1"
        >
          {courses.map((course) => {
            const isActive = course.id === activeCourseId;
            return (
              <Pressable
                key={course.id}
                className="w-[116px] items-center gap-2.5"
                onPress={() => onCourseSelect?.(course.id)}
              >
                <CourseAvatar course={course} isActive={isActive} />
                <Text
                  className={`w-full text-center text-[15px] ${
                    isActive ? "text-ink" : "text-ink-muted"
                  }`}
                  style={{ fontFamily: FONTS.bodyBold }}
                  numberOfLines={1}
                >
                  {course.title}
                </Text>
                {isActive ? (
                  <View className="happy-brand-status-chip px-3 py-1">
                    <Text
                      className="text-[10px] uppercase tracking-[0.8px] text-sage-600"
                      style={{ fontFamily: FONTS.bodyBold }}
                    >
                      Active
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}

          {courses.length === 0 ? (
            <View className="min-h-[104px] justify-center px-3">
              <Text
                className="text-[15px] text-ink-muted"
                style={{ fontFamily: FONTS.body }}
              >
                No enrolled courses yet.
              </Text>
            </View>
          ) : null}

          <Pressable
            className="w-[116px] items-center gap-2.5"
            onPress={onAddCoursePress}
          >
            <View className="h-[78px] w-[92px] items-center justify-center rounded-[24px] border-2 border-dashed border-sage-200 bg-warm-white">
              <View className="h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-sage-50">
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  size={23}
                  color={PALETTE.sage500}
                />
              </View>
            </View>
            <Text
              className="w-full text-center text-[15px] text-ink-muted"
              style={{ fontFamily: FONTS.bodyBold }}
            >
              Add course
            </Text>
          </Pressable>
        </ScrollView>

        <View className="happy-brand-raised-panel mt-5 w-full overflow-hidden rounded-[28px]">
          <View className="gap-5 p-5">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1 gap-1.5">
                <Text
                  className="text-xs uppercase tracking-[1px] text-sage-500"
                  style={{ fontFamily: FONTS.bodyBold }}
                >
                  Current score
                </Text>
                <Text
                  className="text-[25px] leading-[30px] text-ink"
                  style={{ fontFamily: FONTS.heading }}
                  numberOfLines={2}
                >
                  {activeCourseSummary?.title ?? "Course"}
                </Text>
              </View>

              <View className="happy-brand-score-badge items-end px-4 py-3">
                <Text
                  className="text-[28px] leading-[30px] text-ink"
                  style={{ fontFamily: FONTS.bodyBold }}
                >
                  {completedNodes}
                </Text>
                <Text
                  className="text-xs uppercase tracking-[0.8px] text-sage-600"
                  style={{ fontFamily: FONTS.bodyBold }}
                >
                  of {totalNodes}
                </Text>
              </View>
            </View>

            <View className="gap-2.5">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-[14px] text-ink-soft"
                  style={{ fontFamily: FONTS.bodyMedium }}
                >
                  Journey progress
                </Text>
                <Text
                  className="text-[14px] text-sage-600"
                  style={{ fontFamily: FONTS.bodyBold }}
                >
                  {progressPercent}
                </Text>
              </View>

              <View className="w-full" onLayout={handleScoreBarLayout}>
                <ProgressBar
                  progress={progress}
                  width={scoreBarWidth}
                  height={16}
                  trackColor={PALETTE.sage100}
                  fillColor={PALETTE.sage500}
                  glossColor={PALETTE.sage300}
                />
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-3 border-t border-sage-100 pt-4">
              <View>
                <Text
                  className="text-[14px] text-ink-muted"
                  style={{ fontFamily: FONTS.bodyMedium }}
                >
                  Current section
                </Text>
                <Text
                  className="text-[18px] text-ink"
                  style={{ fontFamily: FONTS.bodyBold }}
                >
                  {sectionNumber} of {sectionCount}
                </Text>
              </View>

              <View className="happy-brand-status-chip px-4 py-2">
                <Text
                  className="text-xs uppercase tracking-[0.8px] text-sage-600"
                  style={{ fontFamily: FONTS.bodyBold }}
                >
                  Details
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default HeaderOverlayContent;
