/**
 * ABCSummaryStep
 *
 * Professional reflective summary for the ABC Analysis exercise.
 * Shows the full A→B→C→B′→C′ chain in one cohesive card with
 * before/after emotional intensity bars.
 *
 * Extracted to its own file so Reanimated's Babel worklet plugin
 * can correctly transform `useAnimatedStyle` by its exact name.
 */

import React, { useEffect, useCallback, useState } from "react";
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
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { SAGE, BRAND_SURFACE } from "@/lib/tokens";
import { EXERCISE_LINKING_MAP } from "@/src/data/exerciseLinkingMap";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import type {
  ABCAnalysisResponse,
  StepProps,
  ExerciseType,
} from "@/src/types/exerciseFlow";

// ─── Staggered fade-up ──────────────────────────────────────────────────────

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
}: {
  value: number;
  max: number;
  fillColor: string;
  delay: number;
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
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      className="w-full h-2 rounded-full overflow-hidden"
      style={{ backgroundColor: "#EBEBEB" }}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: fillColor }, barStyle]}
      />
    </View>
  );
}

// ─── Thin divider ────────────────────────────────────────────────────────────

function Divider() {
  return <View style={{ height: 1, backgroundColor: "#F0F0F0" }} />;
}

// ─── Insight copy ────────────────────────────────────────────────────────────

function getShiftLabel(pre: number, post: number): string {
  const scaledPre = Math.round((pre / 10) * 100);
  const scaledPost = Math.round((post / 10) * 100);
  const drop = scaledPre - scaledPost;
  if (drop <= 0) return "You examined something difficult. That takes honesty.";
  const pct = scaledPre > 0 ? Math.round((drop / scaledPre) * 100) : 0;
  if (pct >= 50) return `Emotional intensity dropped ${pct}% — perspective is shifting.`;
  if (pct >= 20) return "A real shift. Challenging one belief builds this skill for the next.";
  return "Even a small drop matters. You're training a new way of thinking.";
}

// ─── Main component ──────────────────────────────────────────────────────────

export function ABCSummaryStep({
  response,
  onNext,
  onBack,
  isSaving,
  readOnly,
  onNavigateDeeper,
}: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const router = useRouter();
  const link = EXERCISE_LINKING_MAP["abc_analysis"];
  const { saveCard } = useCopingCards();
  const [cardSaved, setCardSaved] = useState<boolean>(false);

  const preScore = response.preEmotionalIntensity ?? 5;
  const postScore = response.postEmotionalIntensity ?? null;
  const hasScores = postScore !== null && postScore !== undefined;

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
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [8, 0]) }],
  }));

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (cardSaved || !response.alternativeBelief?.trim()) return;
    await saveCard({
      exercise_type: "abc_analysis",
      reframe_text: response.alternativeBelief,
      reframe_label: "Alternative belief",
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCardSaved(true);
  }, [cardSaved, response.alternativeBelief, saveCard]);

  const handleNavigate = useCallback(
    (type: ExerciseType) => {
      if (onNavigateDeeper) {
        onNavigateDeeper(type);
      } else {
        onNext();
        router.push({ pathname: "/tabs/screens/exercise-flow", params: { type } });
      }
    },
    [onNext, onNavigateDeeper, router],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View className="flex-1 pb-32">
      {/* Header */}
      <View className="items-start pt-2 pb-6 px-1">
        <Animated.View style={mascotStyle}>
          <Mascot state="panda-happy" size={72} />
        </Animated.View>
        <Animated.View style={headerStyle} className="items-start mt-3">
          <Text variant="h1" className="text-left tracking-tight">
            ABC complete
          </Text>
          <Text variant="body" className="text-left mt-1 text-base leading-snug text-ink-soft">
            Here's the full chain you worked through
          </Text>
        </Animated.View>
      </View>

      {/* ── Climactic Outcome (Hero Card) ──────────── */}
      {(!!response.alternativeBelief?.trim() || !!response.newConsequence?.trim()) && (
        <FadeUp delay={300}>
          <View
            className="rounded-3xl p-5 mx-1 mb-6 border border-sage-200/80"
            style={{ backgroundColor: SAGE[50] }}
          >
            {!!response.alternativeBelief?.trim() && (
              <View className="mb-4">
                <Text variant="label-bold" className="text-sm text-sage-800 mb-2">
                  Alternative belief
                </Text>
                <Text variant="body-bold" className="text-base leading-relaxed text-ink">
                  {response.alternativeBelief}
                </Text>
              </View>
            )}

            {!!response.newConsequence?.trim() && (
              <View className="mb-5">
                <Text variant="label-bold" className="text-sm text-sage-800 mb-2">
                  New consequence
                </Text>
                <Text variant="body-bold" className="text-base leading-relaxed text-ink">
                  {response.newConsequence}
                </Text>
              </View>
            )}

            {!readOnly && !!response.alternativeBelief?.trim() && (
              <Pressable
                onPress={cardSaved ? undefined : handleSave}
                disabled={cardSaved}
                accessibilityRole="button"
                accessibilityLabel={cardSaved ? "Saved" : "Save as coping card"}
                className="flex-row items-center self-start gap-1.5 rounded-full px-4 py-2 active:opacity-70"
                style={{ backgroundColor: cardSaved ? SAGE[100] : SAGE.pill }}
              >
                <HugeiconsIcon
                  icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon}
                  size={14}
                  color={SAGE[600]}
                  strokeWidth={2}
                />
                <Text variant="label-bold" className="text-sm text-sage-700">
                  {cardSaved ? "Saved" : "Save as coping card"}
                </Text>
              </Pressable>
            )}
          </View>
        </FadeUp>
      )}

      {/* ── Reflection Context ──────────────────────────────── */}
      <FadeUp delay={450}>
        <View className="mx-2 mb-4 gap-10">
          {/* A — Activating Event */}
          {!!response.activatingEvent?.trim() && (
            <View>
              <Text variant="label" className="text-sm font-semibold text-ink-soft mb-1.5">
                What happened
              </Text>
              <Text variant="body" className="text-base leading-relaxed text-ink">
                {response.activatingEvent}
              </Text>
            </View>
          )}

          {/* B — Belief */}
          {!!response.belief?.trim() && (
            <View>
              <Text variant="label" className="text-sm font-semibold text-ink-soft mb-1.5">
                Your belief
              </Text>
              <View className="pl-3 py-1 border-l-2" style={{ borderColor: "#FFCBBB" }}>
                <Text variant="body-bold" className="text-base leading-relaxed text-ink italic">
                  "{response.belief}"
                </Text>
              </View>
            </View>
          )}

          {/* C — Consequence */}
          {(!!response.consequenceEmotion?.trim() || !!response.consequenceBehavior?.trim()) && (
            <View>
              <Text variant="label" className="text-sm font-semibold text-ink-soft mb-2.5">
                The consequence
              </Text>
              <View className="gap-3">
                {!!response.consequenceEmotion?.trim() && (
                  <View className="flex-row items-start">
                    <Text variant="label" className="text-ink-soft text-sm w-20 mt-0.5">
                      Emotion
                    </Text>
                    <Text variant="body" className="text-base leading-relaxed text-ink flex-1">
                      {response.consequenceEmotion}
                    </Text>
                  </View>
                )}
                {!!response.consequenceBehavior?.trim() && (
                  <View className="flex-row items-start">
                    <Text variant="label" className="text-ink-soft text-sm w-20 mt-0.5">
                      Behavior
                    </Text>
                    <Text variant="body" className="text-base leading-relaxed text-ink flex-1">
                      {response.consequenceBehavior}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Emotional intensity before/after */}
          {hasScores && (
            <View>
              <Text variant="label" className="text-sm font-semibold text-ink-soft mb-2.5">
                Emotional intensity
              </Text>
              <View className="flex-row items-center justify-between mt-1">
                <View className="flex-row items-center gap-3.5">
                  <View>
                    <Text variant="caption" className="text-ink-soft">
                      Before
                    </Text>
                    <Text variant="display" className="text-ink mt-0 text-3xl tracking-tight">
                      {preScore}/10
                    </Text>
                  </View>
                  <Text className="text-ink-soft font-medium text-lg mx-1">→</Text>
                  <View>
                    <Text variant="caption" className="text-ink-soft">
                      After
                    </Text>
                    <Text variant="display" className={`mt-0 text-3xl tracking-tight ${preScore - postScore! >= 0 ? 'text-sage-700' : 'text-ink'}`}>
                      {postScore}/10
                    </Text>
                  </View>
                </View>
                <View className={`px-3 py-1.5 rounded-full ${preScore - postScore! >= 0 ? 'bg-sage-100/90' : 'bg-gray-100'}`}>
                  <Text
                    variant="label-bold"
                    className={`text-xs ${preScore - postScore! >= 0 ? 'text-sage-800' : 'text-ink-soft'}`}
                  >
                    {preScore - postScore! >= 0
                      ? `-${preScore - postScore!} intensity`
                      : `+${postScore! - preScore} intensity`}
                  </Text>
                </View>
              </View>
              <Text variant="caption" className="mt-3 text-ink-soft leading-relaxed">
                {getShiftLabel(preScore, postScore!)}
              </Text>
            </View>
          )}
        </View>
      </FadeUp>

      {/* Go deeper */}
      {link && !readOnly && (
        <FadeUp delay={550}>
          <Pressable
            onPress={() => handleNavigate(link.exerciseType)}
            accessibilityRole="button"
            accessibilityLabel={link.label}
            className="flex-row items-center justify-between rounded-2xl px-4 py-3.5 mx-1 mt-3 active:opacity-70"
            style={{ backgroundColor: SAGE[50], borderWidth: 1, borderColor: SAGE[100] }}
          >
            <View className="flex-1 mr-3">
              <Text variant="caption" className="text-sage-600 font-semibold mb-0.5">
                Keep the momentum going
              </Text>
              <Text variant="label-bold" className="text-[14px]" style={{ color: SAGE[700] }}>
                {link.label}
              </Text>
            </View>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={SAGE[500]} strokeWidth={2.5} />
          </Pressable>
        </FadeUp>
      )}

      {/* Edit Entry */}
      {!readOnly && (
        <FadeUp delay={600}>
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            className="mt-6 items-center"
          >
            <Text variant="label-bold" className="text-[14px] text-ink-soft">
              Wait, I want to edit this
            </Text>
          </Pressable>
        </FadeUp>
      )}
    </View>
  );
}

ABCSummaryStep.displayName = "ABCSummaryStep";
