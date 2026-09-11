import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ScrollView, Platform, Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn, useAnimatedStyle } from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { useHoldToCommit } from "../hooks/useHoldToCommit";
import { DailyGoalMinutes } from "../types";

interface PactSigningStepProps {
  dailyGoal: DailyGoalMinutes;
  onCommit: () => void;
}

const PactSigningStep: React.FC<PactSigningStepProps> = ({
  dailyGoal,
  onCommit,
}) => {
  const insets = useSafeAreaInsets();
  const { progress, isHolding, committed, onPressIn, onPressOut } =
    useHoldToCommit(onCommit);
  const contentTopPadding = Platform.OS === "ios" ? 100 : insets.top + 100;

  const commitFillStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, Math.max(0, progress.value * 100))}%`,
  }));

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24,
          flexGrow: 1,
          paddingTop: contentTopPadding,
        }}
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 px-6"
      >
        <View className="flex-1">
          <Animated.Text
            entering={FadeIn.duration(160).delay(80)}
            className="text-xs font-semibold uppercase tracking-wider text-sage-600"
          >
            A small commitment
          </Animated.Text>

          <Animated.View entering={FadeIn.duration(180).delay(140)}>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="mt-2 text-[26px] leading-[1.15] text-ink"
            >
              A small pact
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(180).delay(160)}
            style={{ borderCurve: "continuous" }}
            className="mt-4 w-full rounded-[22px] border border-sage-200/80 bg-warm-white px-5 py-4.5 shadow-sm"
          >
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-left text-[17px] leading-[26px] text-ink"
            >
              For the next 7 days, I’ll show up for myself — even if it’s only for {dailyGoal} minutes.
            </Text>
          </Animated.View>
        </View>
      </ScrollView>

      <Animated.View
        entering={FadeIn.duration(180).delay(300)}
        className="px-6 pb-8 pt-2 bg-transparent"
        style={{ paddingBottom: Math.max(insets.bottom + 8, 32) }}
      >
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="mb-3 text-center text-[13px] text-ink-soft"
        >
          {committed
            ? "You’re in. One day at a time."
            : "Hold to make your 7-day commitment."}
        </Text>

        {/* 3D Tactile Hold-to-Commit Button with visible left-to-right fill */}
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={committed}
          accessibilityRole="button"
          accessibilityLabel={committed ? "Pact sealed" : "Hold to commit"}
          className="h-14 w-full justify-center"
        >
          {/* Bottom Rim / 3D Shadow Plate */}
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 4,
              borderRadius: 22,
              backgroundColor: "#182C19",
            }}
          />

          {/* Button Face */}
          <View
            style={[
              {
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 4,
                borderRadius: 22,
                backgroundColor: committed ? "#182C19" : "#243E26",
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(95, 127, 88, 0.35)",
              },
            ]}
          >
            {/* Left-to-Right Animated Fill Progress */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: "#4E7E49",
                },
                commitFillStyle,
              ]}
            >
              {/* Luminous leading edge bar */}
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                }}
              />
            </Animated.View>

            {/* Centered Button Content */}
            <View
              pointerEvents="none"
              style={StyleSheet.absoluteFill}
              className="flex-row items-center justify-center gap-2"
            >
              {committed ? (
                <SymbolView
                  name="checkmark.circle.fill"
                  size={18}
                  tintColor="#FFFFFF"
                />
              ) : null}
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                className="text-center text-[16px] font-bold uppercase tracking-[0.03em] text-white"
              >
                {committed
                  ? "You’re in"
                  : isHolding
                    ? "Committing..."
                    : "Hold to commit"}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default React.memo(PactSigningStep);
