import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

// ─── Wave Bar ───────────────────────────────────────────────────────────────

interface WaveBarProps {
  delay: number;
  isActive: boolean;
  height: number;
  color: string;
}

const WaveBar = ({ delay, isActive, height, color }: WaveBarProps): React.JSX.Element => {
  const animatedHeight = useSharedValue(height * 0.4);

  useEffect(() => {
    if (isActive) {
      animatedHeight.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(height, {
              duration: 300 + Math.random() * 200,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(height * 0.3, {
              duration: 300 + Math.random() * 200,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          true
        )
      );
    } else {
      cancelAnimation(animatedHeight);
      animatedHeight.value = withTiming(height * 0.4, { duration: 200 });
    }
  }, [isActive, height, delay, animatedHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Animated.View
      style={[
        { width: 3, borderRadius: 2, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

// ─── Sound Wave Icon ────────────────────────────────────────────────────────

export interface SoundWaveIconProps {
  isActive: boolean;
  size?: number;
  color?: string;
}

export const SoundWaveIcon = ({
  isActive,
  size = 18,
  color,
}: SoundWaveIconProps): React.JSX.Element => {
  const barHeights = [size * 0.5, size * 0.8, size, size * 0.8, size * 0.5];
  const delays = [0, 50, 100, 150, 200];
  // ponytail: default to white on active, text secondary on idle
  const barColor =
    color ??
    (isActive
      ? String(SEMANTIC_COLORS.surface.primary)
      : String(SEMANTIC_COLORS.text.secondary));

  return (
    <View
      className="flex-row items-center justify-center gap-[3px]"
      style={{ height: size, width: size * 1.2 }}
    >
      {barHeights.map((height, index) => (
        <WaveBar
          key={index}
          delay={delays[index]}
          isActive={isActive}
          height={height}
          color={barColor}
        />
      ))}
    </View>
  );
};

export default SoundWaveIcon;
