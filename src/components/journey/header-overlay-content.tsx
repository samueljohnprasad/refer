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
  cream: "#FAF6ED",
  warmWhite: "#FFFCF5",
  sage50: "#F4F1EA",
  sage100: "#E8E2D2",
  sage200: "#D4CCB5",
  sage300: "#A8B89A",
  sage500: "#5A7A56",
  sage600: "#3F5A3D",
  sage700: "#2A3F2A",
  ink: "#1A2A1A",
  inkSoft: "#4A5A4A",
  inkMuted: "#7A8A7A",
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
      className={
        isActive
          ? "h-[78px] w-[92px] items-center justify-center rounded-2xl border-2 border-b-4 border-sage-500 border-b-sage-600 bg-[#EEF2E8]"
          : "h-[78px] w-[92px] items-center justify-center rounded-2xl border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white"
      }
    >
      {course.iconUrl ? (
        <Image
          source={course.iconUrl}
          className="h-[46px] w-[46px] rounded-[14px]"
          cachePolicy="memory-disk"
          contentFit="contain"
          transition={150}
        />
      ) : (
        <Text
          style={{
            color: courseAccentColor,
            fontFamily: FONTS.heading,
            fontSize: 30,
          }}
        >
          {getCourseMonogram(course.title)}
        </Text>
      )}
    </View>
  );
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

  return (
    <Animated.View className="w-full bg-cream pb-[14px]" style={animatedStyle}>
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
          contentContainerClassName="gap-3.5 px-1"
        >
          {courses.map((course) => {
            const isActive = course.id === activeCourseId;
            return (
              <Pressable
                key={course.id}
                className="w-[116px] items-center gap-2"
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

          <Pressable className="w-[116px] items-center gap-2" onPress={onAddCoursePress}>
            <View className="h-[78px] w-[92px] items-center justify-center rounded-2xl border-2 border-b-4 border-sage-200 border-b-sage-200 bg-warm-white">
              <HugeiconsIcon icon={PlusSignIcon} size={24} color={PALETTE.sage300} />
            </View>
            <Text
              className="w-full text-center text-[15px] text-ink-muted"
              style={{ fontFamily: FONTS.bodyBold }}
            >
              Course
            </Text>
          </Pressable>
        </ScrollView>

        <View className="mt-4 w-full items-center gap-[14px] rounded-[18px] border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white py-5">
          <View className="w-full flex-row items-center px-[18px]">
            <Text
              className="min-w-[34px] text-center text-xl text-ink"
              style={{ fontFamily: FONTS.bodyBold }}
            >
              {activeCourseSummary?.completedNodes ?? 0}
            </Text>
            <View className="mx-[14px] flex-1" onLayout={handleScoreBarLayout}>
              <ProgressBar
                progress={progress}
                width={scoreBarWidth}
                height={14}
                trackColor={PALETTE.sage100}
                fillColor={PALETTE.sage500}
                glossColor={PALETTE.sage300}
              />
            </View>
            <Text
              className="min-w-[34px] text-center text-xl text-ink"
              style={{ fontFamily: FONTS.bodyBold }}
            >
              {activeCourseSummary?.totalNodes ?? 0}
            </Text>
          </View>

          <Text
            className="px-[18px] text-center text-[23px] leading-[29px] text-ink"
            style={{ fontFamily: FONTS.heading }}
          >
            Your {activeCourseSummary?.title ?? "Course"} Score{" "}
            {activeCourseSummary?.completedNodes ?? 0}
          </Text>
          <Text
            className="text-base text-ink-soft"
            style={{ fontFamily: FONTS.bodyMedium }}
          >
            Section {activeCourseSummary?.activeSectionNumber ?? 1} of{" "}
            {activeCourseSummary?.sectionCount ?? 0}
          </Text>
          <Text
            className="text-sm uppercase tracking-[0.8px] text-sage-500"
            style={{ fontFamily: FONTS.bodyBold }}
          >
            More About score
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default HeaderOverlayContent;
