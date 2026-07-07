import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import Svg, { Path, Defs, RadialGradient, Rect, Stop, Mask } from "react-native-svg";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Card } from "@/src/components/ui/Card";
import StageProgressBar from "@/src/components/ui/StageProgressBar";
import type {
  CourseHeaderSummary,
  EnrolledCourseListItem,
} from "@/src/types/journeyV5";
import {
  getCourseMonogram,
  resolveCourseAccentColor,
} from "./courseVisuals";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

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
  heading: "CormorantSemiBold",
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
    <Card
      variant="tile"
      radius="xl"
      showDepth={true}
      className="h-[78px] w-[92px]"
      contentClassName="items-center justify-center h-full w-full"
      faceStyle={{
        borderColor: isActive ? courseAccentColor : PALETTE.sage100,
        backgroundColor: isActive ? `${courseAccentColor}12` : PALETTE.warmWhite,
      }}
      style={{
        shadowColor: isActive ? courseAccentColor : "transparent",
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
    </Card>
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const courses = enrolledCourses ?? [];
  const activeCourse = courses.find((c) => c.id === activeCourseId);
  const courseAccentColor = activeCourse
    ? resolveCourseAccentColor(activeCourse.colorHex)
    : PALETTE.sage300;

  const animatedColor = useSharedValue(courseAccentColor);

  React.useEffect(() => {
    animatedColor.value = withTiming(courseAccentColor, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [courseAccentColor]);

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

  React.useEffect(() => {
    animatedProgressNumber.value = withTiming(progress, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedProgressTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(animatedProgressNumber.value * 100)}%`,
    } as any;
  });

  return (
    <Animated.View
      className="w-full happy-brand-screen pb-4 rounded-b-[32px]"
      style={animatedStyle}
    >
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }} className="overflow-hidden rounded-b-[32px]">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="glowGrad" cx="100%" cy="0%" r="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>
            <Mask id="glowMask">
              <Rect width="100%" height="100%" fill="url(#glowGrad)" />
            </Mask>
          </Defs>
          <AnimatedRect 
            width="100%" 
            height="100%" 
            opacity={0.10} 
            animatedProps={animatedRectProps} 
            mask="url(#glowMask)" 
          />
        </Svg>
      </View>
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
                  className={`w-full text-center text-base ${
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
                      className="text-xs uppercase tracking-widest text-sage-600"
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
                className="text-base text-ink-muted"
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
            <Card
              variant="tile"
              radius="xl"
              showDepth={false}
              className="h-[78px] w-[92px]"
              contentClassName="items-center justify-center h-full w-full"
            >
              <View className="h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-sage-50">
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  size={23}
                  color={PALETTE.sage500}
                />
              </View>
            </Card>
            <Text
              className="w-full text-center text-base text-ink"
              style={{ fontFamily: FONTS.bodyBold }}
            >
              Add course
            </Text>
          </Pressable>
        </ScrollView>

        <View
          className="mt-6 w-full px-1 gap-3"
        >
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-1">
              <Text
                className="text-3xl leading-tight text-ink"
                style={{ fontFamily: FONTS.heading }}
                numberOfLines={2}
              >
                {activeCourseSummary?.title ?? "Course"}
              </Text>
            </View>
          </View>

          <View className="gap-2.5 mt-1">
            <View className="flex-row items-center justify-between">
              <Text
                className="text-sm text-ink"
                style={{ fontFamily: FONTS.bodyMedium }}
              >
                {completedNodes} of {totalNodes} sessions completed
              </Text>
              <AnimatedTextInput
                editable={false}
                animatedProps={animatedProgressTextProps}
                className="text-sm"
                style={{
                  fontFamily: FONTS.bodyBold,
                  padding: 0,
                  margin: 0,
                  color: PALETTE.sage600,
                  borderWidth: 0,
                  textAlign: "right",
                  minWidth: 40,
                }}
              />
            </View>

            <View className="w-full">
              <StageProgressBar
                progress={progress}
                height={12}
                trackColor={PALETTE.sage100}
                fillColor={PALETTE.sage500}
                showGlow={false}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between gap-3 mt-4">
            <View>
              <Text
                className="text-sm text-ink-muted"
                style={{ fontFamily: FONTS.bodyMedium }}
              >
                Current section
              </Text>
              <Text
                className="text-lg text-ink"
                style={{ fontFamily: FONTS.bodyBold }}
              >
                {sectionNumber} of {sectionCount}
              </Text>
            </View>

            {/* <View className="happy-brand-status-chip px-4 py-2">
              <Text
                className="text-xs uppercase tracking-widest text-sage-600"
                style={{ fontFamily: FONTS.bodyBold }}
              >
                Details
              </Text>
            </View> */}
          </View>
        </View>
      </View>

      <View 
        className="h-1.5 w-12 rounded-full mt-4 self-center" 
        style={{ backgroundColor: PALETTE.sage300, opacity: 0.5 }} 
      />
    </Animated.View>
  );
};

export default HeaderOverlayContent;
