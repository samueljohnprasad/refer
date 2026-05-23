import React from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useHoldToCommit } from "../hooks/useHoldToCommit";
import { DailyGoalMinutes } from "../types";

const DIVIDER_SEGMENTS = Array.from({ length: 28 }, (_, index) => index);

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
  const [buttonWidth, setButtonWidth] = React.useState(0);

  const commitFillStyle = useAnimatedStyle(() => ({
    width: buttonWidth * progress.value,
    opacity: interpolate(progress.value, [0, 0.02, 1], [0, 1, 1]),
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-3"
    >
      <View className="flex-1 justify-between">
        <View>
          <Animated.View
            entering={FadeIn.duration(180).delay(80)}
            className="items-center"
          >
            <Text
              style={{ fontFamily: "GeistSemiBold" }}
              className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-sage-500"
            >
              Step 6 of 6 — Final commitment
            </Text>
            <Text
              style={{ fontFamily: "FrauncesSemiBold" }}
              className="mt-3 text-center text-[30px] leading-[1.05] text-ink"
            >
              A small{" "}
              <Text
                style={{
                  fontFamily: "FrauncesRegularItalic",
                  color: "#5F7F58",
                }}
              >
                pact.
              </Text>
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(180).delay(160)}
            style={{ borderCurve: "continuous" }}
            className="mt-4 w-full rounded-[24px] border-2 border-sage-100 bg-warm-white px-6 py-7"
          >
            <Text
              style={{ fontFamily: "FrauncesRegularItalic" }}
              className="text-left text-[16px] leading-[25px] text-ink"
            >
              For the next 7 days, I&apos;ll show up for myself — even if
              it&apos;s just for {dailyGoal} minutes.
            </Text>
            <Text
              style={{ fontFamily: "FrauncesRegularItalic" }}
              className="mt-7 text-left text-[16px] leading-[25px] text-ink"
            >
              I&apos;ll be honest. I&apos;ll be patient. I&apos;m worth the
              effort.
            </Text>

            <View className="mt-[18px] items-center pt-4">
              <View className="mb-6 w-full flex-row justify-between">
                {DIVIDER_SEGMENTS.map((segment) => (
                  <View
                    key={segment}
                    style={{
                      width: 8,
                      height: 1,
                      backgroundColor: "#E5EDE1",
                      opacity: 0.9,
                    }}
                  />
                ))}
              </View>
              <Text
                style={{ fontFamily: "GeistMedium" }}
                className="text-[11px] uppercase tracking-[0.1em] text-ink-muted"
              >
                Signed
              </Text>
              <Text
                style={{ fontFamily: "FrauncesRegularItalic" }}
                className="mt-1 text-[22px] tracking-[-0.01em] text-sage-600"
              >
                — You, today
              </Text>
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeIn.duration(180).delay(240)}
            style={{ fontFamily: "GeistRegular" }}
            className="mt-8 text-center text-[13px] text-ink-muted"
          >
            Hold to make it official.
          </Animated.Text>
        </View>

        <Animated.View
          entering={FadeIn.duration(180).delay(300)}
          className="pb-2"
        >
          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={committed}
            accessibilityRole="button"
            accessibilityLabel="Hold to commit"
          >
            <View
              onLayout={(event) => {
                setButtonWidth(event.nativeEvent.layout.width);
              }}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 16,
                borderCurve: "continuous",
              }}
              className="w-full border-b-4 border-b-sage-700 bg-sage-500 px-6 py-[18px]"
            >
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: "#29452A",
                  },
                  commitFillStyle,
                ]}
              />
              <Text
                style={{ fontFamily: "GeistBold" }}
                className="text-center text-base font-bold uppercase tracking-[0.02em] text-white"
              >
                {committed
                  ? "Pact sealed"
                  : isHolding
                    ? "Keep holding..."
                    : "Hold to commit"}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(PactSigningStep);
