import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularGaugeProps {
  score: number;
  maxScore: number;
  size?: number;
  strokeWidth?: number;
  activeColor?: string;
  inactiveColor?: string;
  emoji?: string;
}

export function CircularGauge({
  score,
  maxScore,
  size = 100,
  strokeWidth = 12,
  activeColor = "#16A34A", // SAGE vibrant
  inactiveColor = "#DCFCE7", // SAGE pale
  emoji = "👍",
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Safe calculation to ensure percentage is between 0 and 1
  const targetPercentage = maxScore > 0 ? Math.max(0, Math.min(1, score / maxScore)) : 0;
  const targetOffset = circumference - targetPercentage * circumference;

  const animatedOffset = useSharedValue(circumference);

  useEffect(() => {
    animatedOffset.value = withTiming(targetOffset, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [targetOffset, animatedOffset]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: animatedOffset.value,
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: [{ rotate: "-90deg" }] }}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={inactiveColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Animated Active Stroke */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          fill="none"
        />
      </Svg>
      
      {/* Center Content */}
      <View style={{ position: "absolute", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "800", color: "#22C55E", letterSpacing: -0.5, lineHeight: 40 }}>
          {score.toFixed(1)}
        </Text>
        {emoji && (
          <Text style={{ fontSize: 16, marginTop: -2 }}>
            {emoji}
          </Text>
        )}
      </View>
    </View>
  );
}
