import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";

interface SpeechBubbleProps {
  text: string;
  delay?: number;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, delay = 300 }) => {
  const progress = useSharedValue(0);
  const scaleX = useSharedValue(0.9);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withSpring(1, { damping: 14, stiffness: 180 }),
    );
    scaleX.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 200 }),
    );
  }, []);

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0.8, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [15, 0]) },
      { scale: interpolate(progress.value, [0, 0.6, 1], [0.92, 1.02, 1]) },
    ],
  }));

  const triangleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]),
    transform: [{ scale: interpolate(progress.value, [0.5, 1], [0, 1]) }],
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
        style={{ fontFamily: "CormorantMedium" }}
        className="text-[17px] leading-[1.4] text-ink"
      >
        {text}
      </Text>
    </Animated.View>
  );
};

export default React.memo(SpeechBubble);
