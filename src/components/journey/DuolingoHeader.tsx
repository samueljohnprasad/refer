import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { SvgProps } from "react-native-svg";

import { Battery, Fire, Flag, Gem } from "@/assets/icons";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay } from "react-native-screens";
import { scheduleOnRN } from "react-native-worklets";
import HeaderOverlayContent from "./header-overlay-content";
import type {
  CourseHeaderSummary,
  EnrolledCourseListItem,
} from "@/src/types/journeyV5";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface DuolingoHeaderStats {
  streak: number;
  gems: number;
  hearts: number;
  xp: number;
}

interface DuolingoHeaderProps {
  stats?: DuolingoHeaderStats;
  enrolledCourses?: EnrolledCourseListItem[];
  activeCourseId?: string | null;
  activeCourseSummary?: CourseHeaderSummary | null;
  onAddCoursePress?: () => void;
  onCourseSelect?: (courseId: string) => void;
}

type HeaderButtonProps = {
  Icon: React.FC<SvgProps>;
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
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={accessibilityLabel}
      className="min-h-11 flex-row items-center gap-1.5 bg-warm-white px-2.5"
    >
      <Icon width={28} height={28} />
      <Text
        className={`text-base ${textClassName}`}
        style={{ fontFamily: "GeistBold" }}
      >
        {title}
      </Text>
    </Pressable>
  );
});

export const DuolingoHeader = ({
  stats,
  enrolledCourses,
  activeCourseId,
  activeCourseSummary,
  onAddCoursePress,
  onCourseSelect,
}: DuolingoHeaderProps) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const [showCourseOverlay, setShowCourseOverlay] = useState(false);
  const previousActiveCourseIdRef = useRef(activeCourseId);

  const openCourseOverlay = useCallback((): void => {
    setShowCourseOverlay(true);
    translateY.value = withTiming(0, { duration: 400 });
  }, [translateY]);

  const handleTouchStart = useCallback(() => {
    translateY.value = withTiming(
      -windowHeight / 2,
      { duration: 400 },
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

  // Build buttons from stats or use defaults
  const buttons = [
    {
      accessibilityLabel: `${enrolledCourseCount} enrolled courses`,
      name: "Flag",
      Icon: Flag,
      onPress: openCourseOverlay,
      title: String(enrolledCourseCount),
      textClassName: "text-ink",
    },
    {
      accessibilityLabel: `${stats?.streak ?? 0} day streak`,
      name: "Fire",
      Icon: Fire,
      title: String(stats?.streak ?? 0),
      textClassName: "text-gold",
    },
    {
      accessibilityLabel: `${stats?.gems ?? 0} gems`,
      name: "Gem",
      Icon: Gem,
      title: String(stats?.gems ?? 0),
      textClassName: "text-sage-500",
    },
    {
      accessibilityLabel: `${stats?.hearts ?? 5} hearts`,
      name: "Battery",
      Icon: Battery,
      title: String(stats?.hearts ?? 5),
      textClassName: "text-sage-400",
    },
  ];

  return (
    <View
      className="flex-row items-center justify-between gap-2 px-6 pb-3 pt-2.5"
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
            exiting={FadeOut.duration(50)}
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
};
