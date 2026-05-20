import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { SvgProps } from "react-native-svg";

import { Battery, Fire, Flag, Gem } from "@/assets/icons";
import { useCallback, useEffect, useRef, useState } from "react";
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
const HeaderButton = ({
  Icon,
  onPress,
  title,
  textColor,
}: {
  Icon: React.FC<SvgProps>;
  onPress: () => void;
  title: string;
  textColor: string;
}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon width={30} height={30} />
        <Text style={{ color: textColor, fontWeight: "bold", fontSize: 16 }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};
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

  const handleFlagPress = (name: string) => {
    if (name === "Flag") {
      setShowCourseOverlay(true);
      translateY.value = withTiming(0, { duration: 400 });
    }
  };
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

  // Build buttons from stats or use defaults
  const buttons = [
    {
      name: "Flag",
      Icon: Flag,
      title: String(stats?.xp ?? 0),
      textColor: "#4B4B4B",
    },
    {
      name: "Fire",
      Icon: Fire,
      title: String(stats?.streak ?? 0),
      textColor: "#FF9600",
    },
    {
      name: "Gem",
      Icon: Gem,
      title: String(stats?.gems ?? 0),
      textColor: "#1cb0f6",
    },
    {
      name: "Battery",
      Icon: Battery,
      title: String(stats?.hearts ?? 5),
      textColor: "#A993C5",
    },
  ];

  return (
    <View
      style={[styles.headerContainer]}
      onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
    >
      {buttons.map((button) => (
        <HeaderButton
          onPress={() => handleFlagPress(button.name)}
          key={button.name}
          Icon={button.Icon}
          title={button.title}
          textColor={button.textColor}
        />
      ))}

      {showCourseOverlay && (
        <FullWindowOverlay>
          <Animated.View
            exiting={FadeOut.duration(50)}
            pointerEvents="box-none"
            style={[
              styles.overlay,

              {
                top: headerHeight + insets.top,
                height: Math.max(0, windowHeight - headerHeight - insets.top),
              },
            ]}
          >
            <AnimatedPressable
              style={[
                {
                  backgroundColor: "rgba(0,0,0,0.5)",
                  ...StyleSheet.absoluteFillObject,
                },
                animatedOverlayStyle,
              ]}
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
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    gap: 12,
    paddingBottom: 12,
    paddingTop: 10,
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  subTitle: {
    color: "#585c5c",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    overflow: "hidden",
  },
});
