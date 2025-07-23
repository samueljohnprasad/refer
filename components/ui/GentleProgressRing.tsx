import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface GentleProgressRingProps {
  /** Progress value between 0 and 1 */
  progress: number;
  /** Size of the progress ring */
  size: number;
  /** Width of the progress stroke */
  strokeWidth?: number;
  /** Background ring color */
  backgroundColor?: string;
  /** Progress ring color */
  progressColor?: string;
  /** Overall opacity */
  opacity?: number;
  /** Children to render in the center */
  children?: React.ReactNode;
}

/**
 * Gentle, therapeutic progress ring with soft colors and smooth animations.
 * Designed for mental health journaling apps to provide calming time indicators.
 */
export const GentleProgressRing: React.FC<GentleProgressRingProps> = ({
  progress,
  size,
  strokeWidth = 3,
  backgroundColor = "rgba(232, 213, 255, 0.3)",
  progressColor = "#E8D5FF",
  opacity = 0.8,
  children,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedProgress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset as unknown as number}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center content */}
      {children && (
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default GentleProgressRing;
