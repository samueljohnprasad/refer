import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView, Pressable } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, interpolate } from "react-native-reanimated";
import { SvgAppButton } from "@/src/domains/journey/ui/components/svg-app-button";
import { SAGE } from "@/lib/tokens";
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
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { progress, isHolding, committed, onPressIn, onPressOut } =
    useHoldToCommit(onCommit);
  const [buttonWidth, setButtonWidth] = React.useState(0);

  const commitFillStyle = useAnimatedStyle(() => ({
    width: buttonWidth * progress.value,
    opacity: interpolate(progress.value, [0, 0.02, 1], [0, 1, 1]),
  }));

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1, paddingTop: headerHeight - insets.top }}
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 px-6"
      >
        <View className="flex-1">
          <Animated.Text
            entering={FadeIn.duration(160).delay(80)}
            className="text-xs font-semibold uppercase tracking-widest text-sage-500"
          >
            Step 6 of 6
          </Animated.Text>

          <Animated.View entering={FadeIn.duration(180).delay(140)}>
            <Text
              style={{ fontFamily: "CormorantSemiBold" }}
              className="mt-2 text-[30px] leading-[1.1] text-ink"
            >
              A small{" "}
              <Text
                style={{
                  fontFamily: "CormorantRegularItalic",
                  color: SAGE[500],
                }}
              >
                pact.
              </Text>
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(180).delay(160)}
            style={{ borderCurve: "continuous" }}
            className="mt-5 w-full rounded-[24px] border-2 border-sage-100 bg-warm-white px-6 py-7"
          >
            <Text
              style={{ fontFamily: "CormorantMedium" }}
              className="text-left text-[18px] leading-[26px] text-ink"
            >
              For the next 7 days, I&apos;ll show up for myself, even if
              it&apos;s just for {dailyGoal} minutes.
            </Text>
            <Text
              style={{ fontFamily: "CormorantMedium" }}
              className="mt-6 text-left text-[18px] leading-[26px] text-ink"
            >
              I&apos;ll be honest. I&apos;ll be patient. I&apos;m worth the
              effort.
            </Text>

            <View className="mt-7 pt-2">
              <View
                style={{
                  width: "100%",
                  height: 1,
                  borderTopWidth: 1,
                  borderColor: SAGE[200],
                  borderStyle: "dashed",
                  opacity: 0.8,
                }}
              />
              <View className="mt-5 flex-row items-baseline justify-between">
                <Text
                  style={{ fontFamily: "GeistMedium" }}
                  className="text-[11px] uppercase tracking-[0.1em] text-ink-muted"
                >
                  Signed
                </Text>
                <Text
                  style={{ fontFamily: "CormorantRegularItalic" }}
                  className="text-[22px] tracking-[-0.01em] text-sage-600"
                >
                  You, today
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <Animated.View
        entering={FadeIn.duration(180).delay(300)}
        className="px-6 pb-8 pt-2 bg-transparent"
        style={{ paddingBottom: Math.max(insets.bottom + 8, 32) }}
      >
        <Text
          style={{ fontFamily: "GeistRegular" }}
          className="mb-3 text-center text-[13px] text-ink-muted"
        >
          Hold to make it official.
        </Text>
        <SvgAppButton
          width="100%"
          height={56}
          color={SAGE[500]}
          backgroundColor={SAGE[700]}
          leftRadius={22}
          rightRadius={22}
          pressDepth={4}
          onPress={() => {}}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={committed}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            borderRadius: 22,
          }}
        >
          <View
            onLayout={(event) => {
              setButtonWidth(event.nativeEvent.layout.width);
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "100%",
              borderRadius: 22,
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={[
                {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: SAGE[700],
                },
                commitFillStyle,
              ]}
            />
          </View>
          <Text
            style={{ fontFamily: "GeistBold" }}
            className="text-center text-[17px] font-bold uppercase tracking-[0.02em] text-white z-10"
          >
            {committed
              ? "Pact sealed"
              : isHolding
                ? "Sealing pact..."
                : "Hold to commit"}
          </Text>
        </SvgAppButton>
      </Animated.View>
    </View>
  );
};

export default React.memo(PactSigningStep);
