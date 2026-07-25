import React, { useEffect } from "react";
import { View } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";

interface CircularProgressTimerProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export const CircularProgressTimer: React.FC<CircularProgressTimerProps> = ({
  progress,
  size = 208,
  strokeWidth = 6,
  color = "#5f7f58", // sage-500
  trackColor = "rgba(0,0,0,0.05)", // subtle track
  children,
}) => {
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    // Smoothly animate to the new progress value
    animatedProgress.value = withTiming(progress, {
      duration: 150,
      easing: Easing.linear,
    });
  }, [progress, animatedProgress]);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  const path = Skia.Path.Make();
  // Start from top (angle 0 corresponds to right, so we'll rotate the Canvas)
  path.addCircle(center, center, radius);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Canvas style={{ width: size, height: size, position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Path
          path={path}
          style="stroke"
          strokeWidth={strokeWidth}
          color={trackColor}
        />
        <Path
          path={path}
          style="stroke"
          strokeWidth={strokeWidth}
          color={color}
          start={0}
          end={animatedProgress}
          strokeCap="round"
        />
      </Canvas>
      {children}
    </View>
  );
};
