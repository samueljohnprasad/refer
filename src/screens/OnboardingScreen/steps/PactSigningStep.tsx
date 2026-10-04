// ponytail: Duolingo-style unified ceremonial pact card + zero nested boxes + static display surface
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated, { FadeIn, useAnimatedStyle } from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { AnimatedFireIcon } from "@/src/components/ui/AnimatedStatIcon";
import MochiMascot from "../components/MochiMascot";
import { useHoldToCommit } from "../hooks/useHoldToCommit";
import { DailyGoalMinutes } from "../types";
import { useTranslation } from "react-i18next";

interface PactSigningStepProps {
  dailyGoal: DailyGoalMinutes;
  onCommit: () => void;
}

const PactSigningStep: React.FC<PactSigningStepProps> = ({
  dailyGoal,
  onCommit,
}) => {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation("onboarding");
  const headerHeight = useHeaderHeight();
  const { progress, isHolding, committed, onPressIn, onPressOut } =
    useHoldToCommit(onCommit);

  // ponytail: calculate 7 consecutive calendar days starting from today
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        index: i + 1,
        weekday: i === 0 ? t("pact_signing.today") : new Intl.DateTimeFormat(i18n.language, { weekday: "short" }).format(d),
        isToday: i === 0,
        isLast: i === 6,
      };
    });
  }, [i18n.language, t]);

  const commitFillStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, Math.max(0, progress.value * 100))}%`,
  }));

  return (
    <View
      className="flex-1 px-6 justify-between"
      style={{
        paddingTop: Math.max(headerHeight + 8, insets.top + 54),
        paddingBottom: Math.max(insets.bottom, 24),
      }}
    >
      {/* Top Hero Section */}
      <View className="items-center pt-1">
        <MochiMascot expression="notes" size={100} delay={0} />

        <Animated.View entering={FadeIn.duration(180).delay(40)} className="mt-2 items-center">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
            className="text-center text-[28px] leading-[34px] text-ink happy-font-body-extrabold"
          >
            {t("pact_signing.step_label")}
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular }}
            className="mt-1 text-center text-[15px] text-ink-soft"
          >
            {t("pact_signing.subtitle", { minutes: dailyGoal })}
          </Text>
        </Animated.View>
      </View>

      {/* Center Hero Object: Non-tactile Static Display Card (ZERO nested boxes, NOT clickable) */}
      <Animated.View
        entering={FadeIn.duration(200).delay(100)}
        className="w-full my-auto"
      >
        <View
          style={{ borderCurve: "continuous" }}
          className="w-full rounded-2xl bg-surface-primary border border-border-default shadow-sm p-5 gap-4"
        >
          {/* Header row: Streak Goal + Day 1 starts today */}
          <View className="flex-row items-center justify-between px-1">
            <View className="flex-row items-center gap-1.5">
              <AnimatedFireIcon width={18} height={18} viewBox="11 5 21 24" />
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                className="text-[12px] uppercase tracking-wider text-sage-800"
              >
                {t("pact_signing.streak_goal")}
              </Text>
            </View>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.bold }}
              className="text-[12px] text-amber-700"
            >
              {t("pact_signing.day_1_today")}
            </Text>
          </View>

          {/* 7-Day Embedded Streak Track - directly on card surface (no inner box) */}
          <View className="flex-row items-center justify-between px-0.5">
            {days.map((d) => (
              <View key={d.index} className="items-center gap-1.5">
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                  className={`text-[10px] ${d.isToday ? "text-amber-800 font-extrabold" : "text-ink-muted"}`}
                >
                  {d.weekday}
                </Text>
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full border-2 ${
                    d.isToday
                      ? "bg-amber-100/90 border-amber-400 shadow-sm"
                      : d.isLast
                        ? "bg-amber-50/70 border-amber-300/80"
                        : "bg-surface-secondary/70 border-border-default/80"
                  }`}
                >
                  {d.isToday ? (
                    <AnimatedFireIcon width={22} height={22} viewBox="11 5 21 24" />
                  ) : d.isLast ? (
                    <SymbolView name="flag.fill" size={14} tintColor="#B45309" />
                  ) : (
                    <Text
                      style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                      className="text-[13px] text-ink-muted"
                    >
                      {d.index}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Subtle Hairline Divider */}
          <View className="h-px w-full bg-border-default/40 my-0.5" />

          {/* The Vow - directly on card surface (no inner box) */}
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-center text-[16px] leading-[24px] text-ink px-2"
          >
            {t("pact_signing.vow", { minutes: dailyGoal })}
          </Text>

          {/* Reassurance Seal */}
          <View className="flex-row items-center justify-center gap-1.5 pt-0.5">
            <SymbolView
              name="lock.fill"
              size={12}
              tintColor="#44633F"
            />
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[12px] text-sage-700"
            >
              {t("pact_signing.private")}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Hold-to-Commit Action */}
      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="w-full gap-2.5"
      >
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-center text-[13px] text-ink-soft happy-font-body-semibold"
        >
          {committed
            ? t("pact_signing.hint_done")
            : isHolding
              ? t("pact_signing.hint_holding")
              : t("pact_signing.hint_idle")}
        </Text>

        {/* 3D Tactile Hold-to-Commit Button with visible fill */}
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={committed}
          accessibilityRole="button"
          accessibilityLabel={committed ? t("pact_signing.button_done") : t("pact_signing.button_idle")}
          className="h-14 w-full justify-center active:scale-[0.98]"
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
              backgroundColor: "#3A5734",
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
                backgroundColor: committed ? "#3A5734" : "#587C51",
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
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
                  backgroundColor: "#2E472A",
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

            {/* Centered Button Content with Hold Affordance */}
            <View
              pointerEvents="none"
              style={StyleSheet.absoluteFill}
              className="flex-row items-center justify-center gap-2"
            >
              <SymbolView
                name={
                  committed
                    ? "checkmark.circle.fill"
                    : isHolding
                      ? "lock.fill"
                      : "hand.tap.fill"
                }
                size={18}
                tintColor="#FFFFFF"
              />
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                className="text-center text-[16px] font-bold uppercase tracking-[0.03em] text-white"
              >
                {committed
                  ? t("pact_signing.button_done")
                  : isHolding
                    ? t("pact_signing.button_holding")
                    : t("pact_signing.button_idle")}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default React.memo(PactSigningStep);
