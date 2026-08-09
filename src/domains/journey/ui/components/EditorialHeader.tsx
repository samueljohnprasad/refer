import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { FullWindowOverlay } from "react-native-screens";
import HeaderOverlayContent from "./header-overlay-content";
import { CourseHeaderIcon } from "./CourseHeaderIcon";
import {
  useEditorialHeaderViewModel,
  type EditorialHeaderProps,
  type EditorialHeaderStats,
} from "../hooks/useEditorialHeaderViewModel";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HeaderButtonProps = {
  Icon: React.ComponentType<{
    color?: string;
    height?: number;
    width?: number;
  }>;
  accessibilityLabel: string;
  onPress?: () => void;
  title: string;
};

const HeaderButton = memo(function HeaderButton({
  Icon,
  accessibilityLabel,
  onPress,
  title,
}: HeaderButtonProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={accessibilityLabel}
      className="min-h-11 flex-row items-center gap-2 px-2.5"
    >
      <Icon width={24} height={24} color="#8A9F82" />
      <Text className="text-sm font-medium text-ink-muted">
        {title}
      </Text>
    </Pressable>
  );
});

export interface EditorialHeaderViewProps extends ReturnType<typeof useEditorialHeaderViewModel> {}

/**
 * Presentational View component for EditorialHeader.
 * Consists of JSX code only without internal state or animation hooks.
 */
export const EditorialHeaderView = memo(function EditorialHeaderView({
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
}: EditorialHeaderViewProps): React.JSX.Element {
  return (
    <View
      className="flex-row items-center justify-between gap-2 px-5 pb-3 pt-2.5"
      onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
    >
      <HeaderButton
        accessibilityLabel={`${enrolledCourseCount} enrolled courses`}
        Icon={CourseHeaderIcon}
        onPress={openCourseOverlay}
        title={activeCourseSummary?.title || "Your Journey"}
      />

      <Text className="text-sm text-ink-muted/60 tracking-wider uppercase font-medium">
        {currentDateStr}
      </Text>

      {showCourseOverlay && (
        <FullWindowOverlay>
          <Animated.View
            exiting={FadeOut.duration(150)}
            pointerEvents="box-none"
            className="absolute left-0 right-0 overflow-hidden"
            style={{
              top: headerHeight + insets.top,
              height: Math.max(0, windowHeight - headerHeight - insets.top),
            }}
          >
            <AnimatedPressable
              className="absolute inset-0 bg-black/50"
              style={animatedOverlayStyle}
              onPress={handleTouchStart}
            />
            <HeaderOverlayContent
              translateY={translateY}
              enrolledCourses={enrolledCourses}
              activeCourseId={activeCourseId}
              activeCourseSummary={activeCourseSummary}
              onAddCoursePress={onAddCoursePress}
              onCourseSelect={handleCourseSelect}
            />
          </Animated.View>
        </FullWindowOverlay>
      )}
    </View>
  );
});

/**
 * Container component for EditorialHeader.
 */
export const EditorialHeader = (props: EditorialHeaderProps): React.JSX.Element => {
  const viewModel = useEditorialHeaderViewModel(props);
  return <EditorialHeaderView {...viewModel} />;
};

export type { EditorialHeaderProps, EditorialHeaderStats };
