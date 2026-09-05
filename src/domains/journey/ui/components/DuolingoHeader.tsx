import React, { memo } from "react";
import { Pressable, View, useColorScheme } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { FullWindowOverlay } from "react-native-screens";
import HeaderOverlayContent from "./header-overlay-content";
import { AnimatedOdometer } from "@/src/components/ui/AnimatedOdometer";
import { StreakDisplay } from "@/src/components/Streak";
import {
  useDuolingoHeaderViewModel,
  type DuolingoHeaderProps,
  type DuolingoHeaderStats,
} from "../hooks/useDuolingoHeaderViewModel";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HeaderButtonProps = {
  Icon: React.ComponentType<any>;
  accessibilityLabel: string;
  onPress?: () => void;
  title: string;
  textClassName: string;
};

const HeaderButton = memo(function HeaderButton({
  Icon,
  accessibilityLabel,
  onPress,
  title,
  textClassName,
}: HeaderButtonProps): React.JSX.Element {
  const isDark = useColorScheme() === "dark";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={accessibilityLabel}
      className="min-h-11 min-w-11 flex-row items-center justify-center gap-1.5 px-2"
    >
      <Icon
        width={28}
        height={28}
        color={String(isDark ? SEMANTIC_COLORS.text.primary : SEMANTIC_COLORS.text.primary)}
      />
      <AnimatedOdometer
        value={title}
        textClassName={textClassName}
        color={String(isDark ? SEMANTIC_COLORS.text.primary : SEMANTIC_COLORS.text.primary)}
      />
    </Pressable>
  );
});

export interface DuolingoHeaderViewProps extends ReturnType<typeof useDuolingoHeaderViewModel> {}

/**
 * Presentational View component for DuolingoHeader.
 * Consists of JSX code only without internal state or animation hooks.
 */
export const DuolingoHeaderView = memo(function DuolingoHeaderView({
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
}: DuolingoHeaderViewProps): React.JSX.Element {
  return (
    <View
      className="flex-row items-center justify-between px-5 pb-1 pt-1"
      onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
    >
      {buttons.map((button) => (
        <HeaderButton
          accessibilityLabel={button.accessibilityLabel}
          onPress={button.onPress}
          key={button.name}
          Icon={button.Icon}
          title={button.title}
          textClassName={button.textClassName}
        />
      ))}

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
              className="absolute inset-0 bg-black/60"
              style={animatedOverlayStyle}
              onPress={handleTouchStart}
            />
            {/* ponytail: dismiss sheet on add course select */}
            <HeaderOverlayContent
              translateY={translateY}
              enrolledCourses={enrolledCourses}
              activeCourseId={activeCourseId}
              activeCourseSummary={activeCourseSummary}
              onAddCoursePress={() => {
                handleTouchStart();
                onAddCoursePress?.();
              }}
              onCourseSelect={handleCourseSelect}
            />
          </Animated.View>
        </FullWindowOverlay>
      )}

      <StreakDisplay
        visible={showStreakOverlay}
        onClose={() => setShowStreakOverlay(false)}
      />
    </View>
  );
});

/**
 * Container component for DuolingoHeader.
 */
export const DuolingoHeader = (props: DuolingoHeaderProps): React.JSX.Element => {
  const viewModel = useDuolingoHeaderViewModel(props);
  return <DuolingoHeaderView {...viewModel} />;
};

export type { DuolingoHeaderProps, DuolingoHeaderStats };
