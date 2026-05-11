import React from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { useHoldToCommit } from "../hooks/useHoldToCommit";
import MochiMascot from "../components/MochiMascot";
import ConfettiBurst from "../components/ConfettiBurst";
import { DailyGoalMinutes } from "../types";

interface PactSigningStepProps {
  dailyGoal: DailyGoalMinutes;
  onCommit: () => void;
}

const PactSigningStep: React.FC<PactSigningStepProps> = ({
  dailyGoal,
  onCommit,
}) => {
  const { progress, isHolding, committed, onPressIn, onPressOut } =
    useHoldToCommit(onCommit);

  const ringStyle = useAnimatedStyle(() => {
    const borderWidth = interpolate(progress.value, [0, 1], [3, 7]);
    const opacity = interpolate(progress.value, [0, 0.1, 1], [0.7, 1, 1]);
    const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.03, 1.06]);
    return { borderWidth, opacity, transform: [{ scale }] };
  });

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1.15]) }],
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 0.3, 0.5]),
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center">
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <Text className="text-center text-xs font-semibold uppercase tracking-widest text-sage-500">
            Step 6 of 7
          </Text>
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className="mt-2 text-center text-[26px] leading-[1.15] text-ink"
          >
            Your commitment
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          className="mt-6 w-full rounded-[20px] border-2 border-sage-200 bg-warm-white px-6 py-6"
        >
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="text-center text-[17px] italic leading-[1.5] text-ink"
          >
            I commit to showing up for myself — even on the days I don't feel
            like it. Just{" "}
            <Text className="font-semibold not-italic text-sage-600">
              {dailyGoal} minutes
            </Text>
            . That's all it takes.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          className="mt-8 items-center"
        >
          {committed ? (
            <View className="items-center">
              <View className="items-center justify-center">
                <ConfettiBurst />
                <Animated.View entering={BounceIn.duration(600)}>
                  <MochiMascot
                    expression="celebrating"
                    size={120}
                    animate={false}
                  />
                </Animated.View>
              </View>
              <Animated.Text
                entering={FadeInUp.delay(300).duration(400)}
                style={{ fontFamily: "CormorantSemiBold" }}
                className="mt-4 text-xl text-sage-600"
              >
                Pact sealed!
              </Animated.Text>
            </View>
          ) : (
            <View className="items-center">
              <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
                <View className="items-center justify-center">
                  {/* Outer glow ring */}
                  <Animated.View
                    style={[
                      glowStyle,
                      {
                        position: "absolute",
                        width: 110,
                        height: 110,
                        borderRadius: 55,
                        backgroundColor: "#5A7A56",
                      },
                    ]}
                  />
                  {/* Progress ring */}
                  <Animated.View
                    style={ringStyle}
                    className="h-24 w-24 items-center justify-center rounded-full border-sage-500 bg-sage-500"
                  >
                    <Text className="text-center text-xs font-bold uppercase tracking-wider text-white">
                      {isHolding ? "Keep\nholding..." : "Hold to\ncommit"}
                    </Text>
                  </Animated.View>
                </View>
              </Pressable>
              <Text className="mt-3 text-xs text-ink-muted">
                Press and hold for 1.5 seconds
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(PactSigningStep);
