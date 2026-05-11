import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";

interface SpeechBubbleProps {
  text?: string;
  children?: React.ReactNode;
  delay?: number;
}

const BUBBLE_ENTER_DURATION_MS = 220;

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  children,
  delay = 300,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: BUBBLE_ENTER_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, []);

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }));

  const triangleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.35, 1], [0, 1]),
  }));

  return (
    <Animated.View
      style={bubbleStyle}
      className="relative mx-4 rounded-[20px] border-2 border-sage-200 bg-warm-white px-5 py-4"
    >
      <Animated.View
        style={triangleStyle}
        className="absolute -top-2.5 left-8 h-4 w-4 rotate-45 border-l-2 border-t-2 border-sage-200 bg-warm-white"
      />
      <Text
        style={{ fontFamily: "FrauncesRegular" }}
        className="text-[17px] leading-[1.4] text-ink"
      >
        {children ?? text}
      </Text>
    </Animated.View>
  );
};

export default React.memo(SpeechBubble);
