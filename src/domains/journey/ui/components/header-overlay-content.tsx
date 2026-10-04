import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Svg, {
  Path,
  Defs,
  RadialGradient,
  Rect,
  Stop,
  Mask,
} from "react-native-svg";
import Animated from "react-native-reanimated";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Card } from "@/src/components/ui/Card";
import StageProgressBar from "@/src/components/ui/StageProgressBar";
import { CourseAvatar } from "./CourseAvatar";
import {
  useHeaderOverlayContentViewModel,
  PALETTE,
  FONTS,
  type HeaderOverlayContentProps,
} from "../hooks/useHeaderOverlayContentViewModel";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface HeaderOverlayContentViewProps extends ReturnType<
  typeof useHeaderOverlayContentViewModel
> {
  activeCourseSummaryTitle?: string;
}

/**
 * Presentational view for HeaderOverlayContent.
 * Contains purely JSX code without hooks.
 */
export const HeaderOverlayContentView = React.memo(
  function HeaderOverlayContentView({
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
    onAddCoursePress,
    onCourseSelect,
    activeCourseSummaryTitle,
  }: HeaderOverlayContentViewProps): React.JSX.Element {
    const { t } = useTranslation("journeys");
    return (
      <Animated.View
        className="w-full happy-brand-screen pb-4 rounded-b-[32px] shadow-xl"
        style={animatedStyle}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
          className="overflow-hidden rounded-b-[32px]"
        >
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
              opacity={0.1}
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
            contentContainerClassName="gap-3.5 px-1 pb-1 pe-6"
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
                    className={`w-full text-center text-sm ${
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
                  className="text-base text-ink-muted"
                  style={{ fontFamily: FONTS.body }}
                >
                  {t("emptyEnrolledCourses")}
                </Text>
              </View>
            ) : null}

            {/* ponytail: add course card parity & exact footprint */}
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
                faceStyle={{
                  borderWidth: 1,
                  borderColor: PALETTE.sage100,
                  backgroundColor: PALETTE.warmWhite,
                }}
              >
                <View className="h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-sage-50">
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    size={22}
                    color={PALETTE.sage500}
                  />
                </View>
              </Card>
              <Text
                className="w-full text-center text-sm text-ink"
                style={{ fontFamily: FONTS.bodyBold }}
                numberOfLines={1}
              >
                {t("addCourse")}
              </Text>
            </Pressable>
          </ScrollView>

          {/* ponytail: main course anchor & progress */}
          <View className="mt-4 w-full px-1 gap-3">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1 gap-1">
                <Text
                  className="text-3xl leading-tight text-ink"
                  style={{ fontFamily: FONTS.heading }}
                  numberOfLines={2}
                >
                  {activeCourseSummaryTitle ?? t("course")}
                </Text>
              </View>
            </View>

            <View className="gap-2.5 mt-1">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-sm text-ink"
                  style={{ fontFamily: FONTS.bodyMedium }}
                >
                  {t("sessionsCompleted", { completed: completedNodes, total: totalNodes })}
                </Text>
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

            {/* ponytail: section line consolidated */}
            <View className="flex-row items-center justify-between gap-3 mt-3">
              <Text
                className="text-sm text-ink opacity-70"
                style={{ fontFamily: FONTS.bodyMedium }}
              >
                {t("sectionPosition", { current: sectionNumber, total: sectionCount })}
              </Text>
            </View>
          </View>
        </View>

        <View
          className="h-1.5 w-12 rounded-full mt-4 self-center"
          style={{ backgroundColor: PALETTE.sage300, opacity: 0.5 }}
        />
      </Animated.View>
    );
  },
);

/**
 * Container component for HeaderOverlayContent.
 */
const HeaderOverlayContent = (
  props: HeaderOverlayContentProps,
): React.JSX.Element => {
  const viewModel = useHeaderOverlayContentViewModel(props);
  return (
    <HeaderOverlayContentView
      {...viewModel}
      activeCourseSummaryTitle={props.activeCourseSummary?.title}
    />
  );
};

export default HeaderOverlayContent;
