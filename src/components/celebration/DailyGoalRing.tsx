import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface DailyGoalRingProps {
  size?: number;
  strokeWidth?: number;
  /** Progress before this lesson, 0..1 */
  from: number;
  /** Progress after this lesson, 0..1 */
  to: number;
  color: string;
  trackColor: string;
  /** Delay (ms) before the fill animates. */
  delay?: number;
  duration?: number;
  children?: React.ReactNode;
}

export function DailyGoalRing({
  size = 64,
  strokeWidth = 7,
  from,
  to,
  color,
  trackColor,
  delay = 0,
  duration = 900,
  children,
}: DailyGoalRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(Math.min(Math.max(from, 0), 1));

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(Math.min(Math.max(to, 0), 1), {
        duration,
        easing: Easing.out(Easing.cubic),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DailyGoalRing;
