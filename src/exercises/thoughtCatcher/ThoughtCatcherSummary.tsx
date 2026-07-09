/**
 * ThoughtCatcherSummary
 *
 * Professional reflective summary for the Thought Catcher exercise.
 * Shows the full journey: situation → automatic thought → intensity shift →
 * reality check → balanced thought — in one clean, cohesive card.
 */

import React, { useState, useCallback, useEffect } from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { Mascot } from "@/src/components/ui/Mascot";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
} from "@hugeicons/core-free-icons";
import {
  SAGE,
  BRAND_SURFACE,
  TERRACOTTA,
  TERRACOTTA_TINT,
  GOLD_TINT,
  PARROT_ORANGE,
  BRAND_BORDER,
  TERRACOTTA_LIGHT,
} from "@/lib/tokens";
import { EXERCISE_LINKING_MAP } from "@/src/data/exerciseLinkingMap";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import type {
  ThoughtCatcherResponse,
  StepProps,
  ExerciseType,
} from "@/src/types/exerciseFlow";

// ─── Staggered fade-up ───────────────────────────────────────────────────────

function FadeUp({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
    );
    ty.value = withDelay(
      delay,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

// ─── Animated score bar ──────────────────────────────────────────────────────

function ScoreBar({
  value,
  max,
  fillColor,
  delay,
  label = "Belief score",
}: {
  value: number;
  max: number;
  fillColor: string;
  delay: number;
  label?: string;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(Math.min(Math.max(value / max, 0), 1), {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [delay, max, progress, value]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      className="w-full h-2 rounded-full overflow-hidden"
      style={{ backgroundColor: BRAND_BORDER }}
      accessibilityRole="progressbar"
      accessibilityLabel={`${label}: ${value} out of ${max}`}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: fillColor }, barStyle]}
      />
    </View>
  );
}

// ─── Reality-check pill ──────────────────────────────────────────────────────

const REALITY_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  YES: { label: "Yes, it felt true", bg: TERRACOTTA_TINT, color: TERRACOTTA },
  "NOT SURE": { label: "Not sure", bg: GOLD_TINT, color: "#8C5E0A" },
  NO: { label: "No, it wasn't true", bg: SAGE[50], color: SAGE[700] },
};

// ─── Insight copy ─────────────────────────────────────────────────────────────

function getShiftLabel(pre: number, post: number): string {
  const drop = pre - post;
  if (drop <= 0) return "You sat with a difficult thought. That takes courage.";
  const pct = pre > 0 ? Math.round((drop / pre) * 100) : 0;
  if (pct >= 50) return `Belief dropped ${pct}% — your rational mind stepped in.`;
  if (pct >= 20) return "A real shift. Small drops build new thought patterns over time.";
  return "Progress is rarely linear. Showing up is what counts.";
}

// ─── Main component ──────────────────────────────────────────────────────────

export const ThoughtCatcherSummary: React.FC<
  StepProps<ThoughtCatcherResponse>
> = ({ response, onNext, readOnly, onNavigateDeeper }) => {
  const router = useRouter();
  const { saveCard } = useCopingCards();
  const [cardSaved, setCardSaved] = useState<boolean>(false);
  const link = EXERCISE_LINKING_MAP["thought_catcher"];

  const preScore = response.intensity ?? 0;
  const postScore = response.postIntensity ?? null;
  const hasScores = postScore !== null && postScore !== undefined;
  const hasBalancedThought = !!response.balancedThought?.trim();
  const realityConfig =
    response.isTrue && REALITY_CONFIG[response.isTrue]
      ? REALITY_CONFIG[response.isTrue]
      : null;

  // ── Header animation ──────────────────────────────────────────────────────

  const mascotScale = useSharedValue(0.7);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    mascotScale.value = withSpring(1, { damping: 14, stiffness: 120 });
    headerOpacity.value = withDelay(160, withTiming(1, { duration: 350 }));
  }, []);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotScale.value }],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [8, 0]) },
    ],
  }));

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSaveCopingCard = useCallback(async () => {
    if (cardSaved || !response.balancedThought?.trim()) return;
    await saveCard({
      exercise_type: "thought_catcher",
      reframe_text: response.balancedThought,
      reframe_label: "Balanced thought",
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCardSaved(true);
  }, [cardSaved, response.balancedThought, saveCard]);

  const handleNavigateDeeper = useCallback(
    (type: ExerciseType) => {
      if (onNavigateDeeper) {
        onNavigateDeeper(type);
      } else {
        onNext();
        router.push({
          pathname: "/tabs/screens/exercise-flow",
          params: { type },
        });
      }
    },
    [onNext, onNavigateDeeper, router],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View className="flex-1">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View className="items-center pt-2 pb-6">
        <Animated.View style={mascotStyle}>
          <Mascot state="panda-happy" size={72} />
        </Animated.View>
        <Animated.View style={headerStyle} className="items-center mt-3">
          <Text variant="h1" className="text-center tracking-[-0.5px]">
            Thought checked
          </Text>
          <Text
            variant="body"
            className="text-center mt-1 text-[15px] leading-snug"
          >
            Here's what you worked through
          </Text>
        </Animated.View>
      </View>

      {/* ── Main content flow ──────────────────────────────────────── */}
      <FadeUp delay={300}>
        <View className="gap-8 mx-4">
          {/* 1. Situation */}
          {!!response.situation?.trim() && (
            <View className="px-2">
              <Text
                variant="label"
                className="text-sm font-semibold text-ink-soft mb-1.5"
              >
                What happened
              </Text>
              <View
                className="pl-4 py-1 border-l-2"
                style={{ borderColor: SAGE[200] }}
              >
                <Text
                  variant="display"
                  className="text-lg tracking-tight leading-relaxed text-ink"
                >
                  {response.situation}
                </Text>
              </View>
            </View>
          )}

          {/* 2. Automatic thought */}
          {!!response.automaticThought?.trim() && (
            <View className="px-2">
              <Text
                variant="label"
                className="text-sm font-semibold text-ink-soft mb-1.5"
              >
                Automatic thought
              </Text>
              <View
                className="pl-4 py-1 border-l-2"
                style={{ borderColor: SAGE[200] }}
              >
                <Text
                  variant="display"
                  className="text-lg tracking-tight leading-relaxed text-ink"
                >
                  "{response.automaticThought}"
                </Text>
              </View>
            </View>
          )}

          {/* 3. Belief scores */}
          {hasScores && (
            <View className="px-2">
              <Text
                variant="label"
                className="text-sm font-semibold text-ink-soft mb-3"
              >
                Belief intensity
              </Text>
              <View className="gap-3">
                <View>
                  <View className="flex-row justify-between mb-1.5">
                    <Text variant="label" className="text-ink-soft text-[13px]">
                      Before
                    </Text>
                    <Text variant="label-bold" className="text-[13px]">
                      {preScore}%
                    </Text>
                  </View>
                  <ScoreBar
                    value={preScore}
                    max={100}
                    fillColor={TERRACOTTA_LIGHT}
                    delay={600}
                  />
                </View>
                <View>
                  <View className="flex-row justify-between mb-1.5">
                    <Text variant="label" className="text-ink-soft text-[13px]">
                      After
                    </Text>
                    <Text variant="label-bold" className="text-[13px]">
                      {postScore}%
                    </Text>
                  </View>
                  <ScoreBar
                    value={postScore!}
                    max={100}
                    fillColor={SAGE[400]}
                    delay={900}
                  />
                </View>
              </View>
              <Text
                variant="caption"
                className="mt-3 text-ink-soft leading-relaxed"
                accessibilityLiveRegion="polite"
              >
                {getShiftLabel(preScore, postScore!)}
              </Text>
            </View>
          )}

          {/* 4. Reality check */}
          {realityConfig && (
            <View className="px-2">
              <Text
                variant="label"
                className="text-sm font-semibold text-ink-soft mb-2"
              >
                Reality check
              </Text>
              <View
                className="self-start rounded-full px-4 py-2"
                style={{ backgroundColor: realityConfig.bg }}
              >
                <Text
                  variant="label-bold"
                  className="text-[13px]"
                  style={{ color: realityConfig.color }}
                >
                  {realityConfig.label}
                </Text>
              </View>
            </View>
          )}

          {/* 5. Balanced thought */}
          {hasBalancedThought && (
            <View className="px-2">
              <Text
                variant="label"
                className="text-sm font-semibold text-ink-soft mb-1.5"
              >
                Balanced thought
              </Text>
              <View
                className="pl-4 py-1 border-l-2 mb-4"
                style={{ borderColor: SAGE[200] }}
              >
                <Text
                  variant="display"
                  className="text-lg tracking-tight leading-relaxed text-ink"
                >
                  {response.balancedThought}
                </Text>
              </View>

              {!readOnly && (
                <Pressable
                  onPress={cardSaved ? undefined : handleSaveCopingCard}
                  disabled={cardSaved}
                  accessibilityRole="button"
                  accessibilityLabel={
                    cardSaved ? "Saved" : "Save as coping card"
                  }
                  accessibilityState={{ disabled: cardSaved }}
                  className="flex-row items-center self-start gap-1.5 rounded-full px-4 py-2.5 min-h-[44px] active:opacity-70"
                  style={{
                    backgroundColor: cardSaved ? SAGE[100] : SAGE.pill,
                  }}
                >
                  <HugeiconsIcon
                    icon={
                      cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon
                    }
                    size={13}
                    color={SAGE[600]}
                    strokeWidth={2}
                  />
                  <Text
                    variant="label-bold"
                    className="text-[13px] text-sage-700"
                  >
                    {cardSaved ? "Saved" : "Save as coping card"}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </FadeUp>

      {/* ── Go deeper row ─────────────────────────────────────────── */}
      {link && !readOnly && (
        <FadeUp delay={500}>
          <Pressable
            onPress={() => handleNavigateDeeper(link.exerciseType)}
            accessibilityRole="button"
            accessibilityLabel={link.label}
            className="flex-row items-center justify-between rounded-2xl px-4 py-3.5 mx-1 mt-3 active:opacity-70"
            style={{
              backgroundColor: SAGE[50],
              borderWidth: 1.5,
              borderColor: SAGE[100],
            }}
          >
            <View className="flex-1 mr-3">
              <Text variant="overline" className="mb-0.5">
                Want to go deeper?
              </Text>
              <Text
                variant="label-bold"
                className="text-[14px]"
                style={{ color: SAGE[700] }}
              >
                {link.label}
              </Text>
            </View>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              color={SAGE[500]}
              strokeWidth={2.5}
            />
          </Pressable>
        </FadeUp>
      )}
    </View>
  );
};

ThoughtCatcherSummary.displayName = "ThoughtCatcherSummary";
