import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

interface WaveBarProps {
  delay: number;
  isActive: boolean;
  isPaused: boolean;
  baseHeight: number;
  maxHeight: number;
  color: string;
}

const WaveBar = React.memo<WaveBarProps>(({
  delay,
  isActive,
  isPaused,
  baseHeight,
  maxHeight,
  color,
}) => {
  const animatedHeight = useSharedValue(baseHeight);

  useEffect(() => {
    if (isActive) {
      animatedHeight.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(maxHeight, {
              duration: 280 + Math.random() * 220,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            withTiming(Math.max(10, baseHeight * 0.45), {
              duration: 280 + Math.random() * 220,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
          ),
          -1,
          true
        )
      );
    } else if (isPaused) {
      cancelAnimation(animatedHeight);
      // ponytail: keep elegant 8-18px resting baseline when paused so bars don't collapse to dots
      animatedHeight.value = withTiming(Math.max(8, baseHeight * 0.75), { duration: 250 });
    } else {
      cancelAnimation(animatedHeight);
      animatedHeight.value = withTiming(Math.max(8, baseHeight * 0.4), { duration: 200 });
    }
  }, [isActive, isPaused, baseHeight, maxHeight, delay, animatedHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 3.5,
          borderRadius: 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
});

export interface VoiceWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
  color?: string;
}

// ponytail: 25-bar wide symmetrical soundwave (~240px) inspired by Apple Journal & ABY Journal
export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isRecording,
  isPaused,
  color = "#587C51",
}) => {
  // Symmetrical 25-bar curve heights from edge to center (index 12 is peak)
  const heights = [
    10, 14, 18, 24, 30, 36, 42, 48, 54, 60, 64, 68, 70, 68, 64, 60, 54, 48, 42, 36, 30, 24, 18, 14, 10,
  ];

  return (
    <View
      className="flex-row items-center justify-center gap-1.5 h-20 w-full px-4"
      accessibilityRole="progressbar"
      accessibilityLabel={
        isRecording ? "Recording audio" : isPaused ? "Recording paused" : "Idle"
      }
    >
      {heights.map((maxH, index) => {
        const distFromCenter = Math.abs(index - 12);
        const delay = distFromCenter * 35;
        const baseH = Math.max(8, maxH * 0.38);

        return (
          <WaveBar
            key={index}
            delay={delay}
            isActive={isRecording}
            isPaused={isPaused}
            baseHeight={baseH}
            maxHeight={maxH}
            color={isRecording ? color : "#9CA3AF"}
          />
        );
      })}
    </View>
  );
};

export default React.memo(VoiceWaveform);
