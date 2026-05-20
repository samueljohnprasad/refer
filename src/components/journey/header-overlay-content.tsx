import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Text,
  useWindowDimensions,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Image } from "expo-image";

import Svg, { Path, SvgProps } from "react-native-svg";

import { Flag } from "@/assets/icons";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import ProgressBar from "../ProgressBar";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type {
  CourseHeaderSummary,
  EnrolledCourseListItem,
} from "@/src/types/journeyV5";
const AnimatedPath = Animated.createAnimatedComponent(Path);

type HeaderOverlayContentProps = {
  translateY: SharedValue<number>;
  enrolledCourses?: EnrolledCourseListItem[];
  activeCourseId?: string | null;
  activeCourseSummary?: CourseHeaderSummary | null;
  onCourseSelect?: (courseId: string) => void;
};

type NewCourse = {
  id: number;
  title: string;
  description: string;
  image: React.FC<SvgProps>;
  color: string;
  isNew: boolean;
};

const newCourses: NewCourse[] = [
  {
    id: 1,
    title: "Coding",
    description: "New Course Description",
    image: Flag,
    color: "#CE82FF",
    isNew: false,
  },
  {
    id: 2,
    title: "Maths",
    description: "New Course 2 Description",
    image: Flag,
    color: "#1CB0F6",
    isNew: false,
  },
  {
    id: 3,
    title: "Chess",
    description: "New Course 3 Description",
    image: Flag,
    color: "#e6e6bc",
    isNew: true,
  },
];

function resolveCourseAccentColor(colorHex: string | null | undefined): string {
  if (!colorHex) {
    return "#1CB0F6";
  }

  return colorHex.startsWith("#") ? colorHex : `#${colorHex}`;
}

function CourseAvatar({
  course,
  isActive,
}: {
  course: EnrolledCourseListItem;
  isActive: boolean;
}): React.JSX.Element {
  const accentColor = resolveCourseAccentColor(course.colorHex);

  return (
    <View
      className="h-[70px] w-[85px] items-center justify-center rounded-[14px] bg-slate-50"
      style={{
        borderWidth: isActive ? 3 : 2,
        borderColor: isActive ? accentColor : "#E5E7EB",
      }}
    >
      {course.iconUrl ? (
        <Image
          source={course.iconUrl}
          style={{ width: 44, height: 44, borderRadius: 12 }}
          contentFit="contain"
        />
      ) : (
        <Text
          style={{
            color: accentColor,
            fontFamily: "DINNextRoundedBold",
            fontSize: 28,
          }}
        >
          {course.title.charAt(0).toUpperCase()}
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
  onCourseSelect,
}: HeaderOverlayContentProps) => {
  const { width } = useWindowDimensions();
  const [scoreBarWidth, setScoreBarWidth] = useState(180);

  const handleAddCoursePress = () => {
    Alert.alert(
      "Add Course",
      "Course addition feature coming soon! You'll be able to browse and add new courses.",
      [{ text: "OK", onPress: () => {} }],
    );
  };

  const handleScoreBarLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && Math.abs(nextWidth - scoreBarWidth) > 1) {
      setScoreBarWidth(nextWidth);
    }
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const courses = enrolledCourses ?? [];
  const progress = activeCourseSummary
    ? activeCourseSummary.completedNodes / Math.max(activeCourseSummary.totalNodes, 1)
    : 0;

  return (
    <Animated.View className="bg-white w-full  pb-3" style={[animatedStyle]}>
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
          stroke="#E5E5E5"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
      <View className="px-4 pt-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-3"
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {courses.map((course) => {
            const isActive = course.id === activeCourseId;
            return (
              <Pressable
                key={course.id}
                className="items-center gap-1"
                onPress={() => onCourseSelect?.(course.id)}
              >
                <CourseAvatar course={course} isActive={isActive} />
                <Text
                  className="text-base font-bold"
                  style={{
                    fontFamily: "DINNextRoundedBold",
                    color: isActive ? "#4B4B4B" : "#AFAFAF",
                  }}
                  numberOfLines={1}
                >
                  {course.title}
                </Text>
              </Pressable>
            );
          })}
          {courses.length === 0 ? (
            <View className="justify-center px-3">
              <Text
                style={{
                  color: "#94A3B8",
                  fontFamily: "DINNextRoundedRegular",
                  fontSize: 15,
                }}
              >
                No enrolled courses yet.
              </Text>
            </View>
          ) : null}
          <Pressable
            className="items-center gap-1 ml-3"
            onPress={handleAddCoursePress}
          >
            <View className="h-[70px] w-[85px] items-center justify-center rounded-[14px] border-[2px] border-[#AFAFAF] bg-gray-50">
              <HugeiconsIcon icon={PlusSignIcon} size={24} color="#AFAFAF" />
            </View>
            <Text
              className="text-base font-bold"
              style={{
                fontFamily: "DINNextRoundedBold",
                color: "#AFAFAF",
              }}
            >
              Course
            </Text>
          </Pressable>
        </ScrollView>
        <View className="mt-3 w-full items-center gap-3 rounded-[10px] border border-[#E5E5E5] py-4">
          <View className="w-full flex-row items-center px-5">
            <Text className="text-lg font-bold text-text-primary font-rd-bold">
              {activeCourseSummary?.completedNodes ?? 0}
            </Text>
            <View className="mx-3 flex-1" onLayout={handleScoreBarLayout}>
              <ProgressBar progress={progress} width={scoreBarWidth} />
            </View>
            <Text
              className="text-lg font-bold text-text-primary font-rd-bold"
              style={{ fontFamily: "DINNextRoundedBold" }}
            >
              {activeCourseSummary?.totalNodes ?? 0}
            </Text>
          </View>
          <Text className="text-xl  text-text-secondary font-rd-regular">
            Your {activeCourseSummary?.title ?? "Course"} Score{" "}
            {activeCourseSummary?.completedNodes ?? 0}
          </Text>
          <Text className="text-base text-text-secondary font-rd-regular">
            Section {activeCourseSummary?.activeSectionNumber ?? 1} of{" "}
            {activeCourseSummary?.sectionCount ?? 0}
          </Text>
          <Text
            className="text-base uppercase text-[#1CB0F6]"
            style={{
              fontFamily: "DINNextRoundedBold",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            More About score
          </Text>
        </View>
        <View className="mt-3 gap-3 ">
          <Text
            className="text-[24px] font-bold text-text-primary"
            style={{ fontFamily: "DINNextRoundedBold" }}
          >
            New Course
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {newCourses.map((course) => (
              <View key={course.id} className="items-center gap-3">
                <View
                  className="relative h-[55px] w-[75px] items-center justify-center rounded-[10px]"
                  style={[{ backgroundColor: course.color }]}
                >
                  {course.isNew ? (
                    <View className="absolute -right-5 -top-4 z-2 rounded-[8] border-white border-[3] bg-[#FF4B4B] px-[6] py-[6]">
                      <Text className="text-xs font-bold leading-3 text-white">
                        NEW
                      </Text>
                    </View>
                  ) : null}
                  <course.image color={"white"} width={40} height={40} />
                </View>
                <Text
                  className="text-base font-bold text-text-primary"
                  style={{ fontFamily: "DINNextRoundedBold" }}
                >
                  {course.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default HeaderOverlayContent;
