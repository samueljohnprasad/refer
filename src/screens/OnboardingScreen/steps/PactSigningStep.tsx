import React from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useHoldToCommit } from "../hooks/useHoldToCommit";
import MochiMascot from "../components/MochiMascot";
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
    const borderWidth = interpolate(progress.value, [0, 1], [3, 5]);
    const opacity = interpolate(progress.value, [0, 0.1, 1], [0.7, 1, 1]);
    const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.01, 1.02]);
    return { borderWidth, opacity, transform: [{ scale }] };
  });

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.96, 1.08]) }],
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 0.22, 0.34]),
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center">
        <Animated.View entering={FadeIn.duration(180).delay(80)}>
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
          entering={FadeIn.duration(180).delay(160)}
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
          entering={FadeIn.duration(180).delay(240)}
          className="mt-8 items-center"
        >
          {committed ? (
            <View className="items-center">
              <MochiMascot expression="celebrating" size={120} delay={0} />
              <Animated.Text
                entering={FadeIn.duration(180).delay(120)}
                style={{ fontFamily: "CormorantSemiBold" }}
                className="mt-4 text-xl text-sage-600"
              >
                Pact sealed!
              </Animated.Text>
              <Animated.Text
                entering={FadeIn.duration(180).delay(200)}
                className="mt-2 text-center text-xs text-ink-muted"
              >
                Small promises, kept gently, become real change.
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
