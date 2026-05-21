import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
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
      style={[
        styles.courseAvatar,
        {
          backgroundColor: isActive ? "#EEF2E8" : PALETTE.warmWhite,
          borderColor: isActive ? PALETTE.sage500 : PALETTE.sage100,
          borderBottomColor: isActive ? PALETTE.sage600 : PALETTE.sage100,
        },
      ]}
    >
      {course.iconUrl ? (
        <Image
          source={course.iconUrl}
          style={styles.courseAvatarImage}
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
    <Animated.View style={[styles.root, animatedStyle]}>
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

      <View style={styles.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.courseListContent}
        >
          {courses.map((course) => {
            const isActive = course.id === activeCourseId;
            return (
              <Pressable
                key={course.id}
                style={styles.courseTab}
                onPress={() => onCourseSelect?.(course.id)}
              >
                <CourseAvatar course={course} isActive={isActive} />
                <Text
                  style={[
                    styles.courseTitle,
                    { color: isActive ? PALETTE.ink : PALETTE.inkMuted },
                  ]}
                  numberOfLines={1}
                >
                  {course.title}
                </Text>
              </Pressable>
            );
          })}

          {courses.length === 0 ? (
            <View style={styles.emptyCourses}>
              <Text style={styles.emptyCoursesText}>
                No enrolled courses yet.
              </Text>
            </View>
          ) : null}

          <Pressable style={styles.courseTab} onPress={onAddCoursePress}>
            <View style={styles.addCourseAvatar}>
              <HugeiconsIcon icon={PlusSignIcon} size={24} color={PALETTE.sage300} />
            </View>
            <Text style={[styles.courseTitle, { color: PALETTE.inkMuted }]}>
              Course
            </Text>
          </Pressable>
        </ScrollView>

        <View style={styles.scoreCard}>
          <View style={styles.scoreBarRow}>
            <Text style={styles.scoreValue}>
              {activeCourseSummary?.completedNodes ?? 0}
            </Text>
            <View style={styles.scoreBarWrap} onLayout={handleScoreBarLayout}>
              <ProgressBar
                progress={progress}
                width={scoreBarWidth}
                height={14}
                trackColor={PALETTE.sage100}
                fillColor={PALETTE.sage500}
                glossColor={PALETTE.sage300}
              />
            </View>
            <Text style={styles.scoreValue}>
              {activeCourseSummary?.totalNodes ?? 0}
            </Text>
          </View>

          <Text style={styles.scoreTitle}>
            Your {activeCourseSummary?.title ?? "Course"} Score{" "}
            {activeCourseSummary?.completedNodes ?? 0}
          </Text>
          <Text style={styles.scoreSubtitle}>
            Section {activeCourseSummary?.activeSectionNumber ?? 1} of{" "}
            {activeCourseSummary?.sectionCount ?? 0}
          </Text>
          <Text style={styles.scoreLink}>
            More About score
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default HeaderOverlayContent;

const styles = StyleSheet.create({
  addCourseAvatar: {
    alignItems: "center",
    backgroundColor: PALETTE.warmWhite,
    borderBottomColor: PALETTE.sage200,
    borderBottomWidth: 4,
    borderColor: PALETTE.sage200,
    borderRadius: 16,
    borderWidth: 2,
    height: 78,
    justifyContent: "center",
    width: 92,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 28,
  },
  courseAvatar: {
    alignItems: "center",
    borderBottomWidth: 4,
    borderRadius: 16,
    borderWidth: 2,
    height: 78,
    justifyContent: "center",
    width: 92,
  },
  courseAvatarImage: {
    borderRadius: 14,
    height: 46,
    width: 46,
  },
  courseListContent: {
    gap: 14,
    paddingHorizontal: 4,
  },
  courseTab: {
    alignItems: "center",
    gap: 8,
    width: 116,
  },
  courseTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    textAlign: "center",
    width: "100%",
  },
  emptyCourses: {
    justifyContent: "center",
    minHeight: 104,
    paddingHorizontal: 12,
  },
  emptyCoursesText: {
    color: PALETTE.inkMuted,
    fontFamily: FONTS.body,
    fontSize: 15,
  },
  root: {
    backgroundColor: PALETTE.cream,
    paddingBottom: 14,
    width: "100%",
  },
  scoreBarRow: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 18,
    width: "100%",
  },
  scoreBarWrap: {
    flex: 1,
    marginHorizontal: 14,
  },
  scoreCard: {
    alignItems: "center",
    backgroundColor: PALETTE.warmWhite,
    borderBottomColor: PALETTE.sage100,
    borderBottomWidth: 4,
    borderColor: PALETTE.sage100,
    borderRadius: 18,
    borderWidth: 2,
    gap: 14,
    marginTop: 16,
    paddingVertical: 20,
    width: "100%",
  },
  scoreLink: {
    color: PALETTE.sage500,
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  scoreSubtitle: {
    color: PALETTE.inkSoft,
    fontFamily: FONTS.bodyMedium,
    fontSize: 16,
  },
  scoreTitle: {
    color: PALETTE.ink,
    fontFamily: FONTS.heading,
    fontSize: 23,
    lineHeight: 29,
    paddingHorizontal: 18,
    textAlign: "center",
  },
  scoreValue: {
    color: PALETTE.ink,
    fontFamily: FONTS.bodyBold,
    fontSize: 20,
    minWidth: 34,
    textAlign: "center",
  },
});
