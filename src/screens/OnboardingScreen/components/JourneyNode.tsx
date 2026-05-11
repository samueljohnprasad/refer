import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeInDown,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { JourneyMapNode } from "../types";

interface JourneyNodeProps {
  node: JourneyMapNode;
  isLast: boolean;
  index: number;
}

const JourneyNode: React.FC<JourneyNodeProps> = ({ node, isLast, index }) => {
  const pulseScale = useSharedValue(1);
  const lineHeight = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (node.status === "current") {
      pulseScale.value = withDelay(
        index * 100 + 300,
        withRepeat(
          withSequence(
            withTiming(1.08, {
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
            }),
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          ),
          0,
          true,
        ),
      );
      glowOpacity.value = withDelay(
        index * 100 + 300,
        withRepeat(
          withSequence(
            withTiming(0.6, {
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
            }),
            withTiming(0.2, {
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
            }),
          ),
          0,
          true,
        ),
      );
    }

    if (!isLast) {
      lineHeight.value = withDelay(
        index * 100 + 400,
        withSpring(1, { damping: 20, stiffness: 150 }),
      );
    }
  }, []);

  const circleStyle =
    node.status === "completed"
      ? "bg-sage-500 border-4 border-cream"
      : node.status === "current"
        ? "bg-gold border-4 border-cream"
        : "bg-sage-100 border-4 border-cream";

  const currentPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [
      { scale: interpolate(glowOpacity.value, [0.2, 0.6], [1, 1.3]) },
    ],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: lineHeight.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 100).duration(400)}
      className="relative mb-4 flex-row items-center gap-3.5"
    >
      <View className="items-center justify-center">
        {node.status === "current" && (
          <Animated.View
            style={[
              glowStyle,
              {
                position: "absolute",
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#D4A943",
              },
            ]}
          />
        )}
        <Animated.View
          entering={
            node.status === "completed"
              ? ZoomIn.delay(200 + index * 100).duration(300)
              : undefined
          }
          style={node.status === "current" ? currentPulseStyle : undefined}
          className={`h-16 w-16 items-center justify-center rounded-full ${circleStyle}`}
        >
          <Text className="text-[26px]">{node.emoji}</Text>
        </Animated.View>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-ink">{node.label}</Text>
        <Text className="text-xs text-ink-muted">{node.subtitle}</Text>
      </View>
      {!isLast && (
        <Animated.View
          style={[lineStyle, { transformOrigin: "top" }]}
          className="absolute bottom-0 left-[30px] top-[60px] z-[-1] w-1 rounded bg-sage-200"
        />
      )}
    </Animated.View>
  );
};

export default React.memo(JourneyNode);
