import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

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
    // Use Animated.Value for smooth progress updates without wrapping Circle in Animated component
  const progressAnim = useRef(new Animated.Value(progress)).current;
  const [internalProgress, setInternalProgress] = useState(progress);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

    // Animate on prop changes
  useEffect(() => {
    const animation = Animated.timing(progressAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    });
    animation.start();
    const id = progressAnim.addListener(({ value }) => {
      setInternalProgress(value);
    });
    return () => {
      progressAnim.removeListener(id);
    };
  }, [progress, progressAnim]);

  const strokeDashoffset = circumference * (1 - internalProgress);

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
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
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
