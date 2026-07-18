/**
 * GratitudeReframeSummary
 *
 * Professional reflective summary for the Gratitude Reframe exercise.
 * Shows the mood shift alongside the user's gratitude reflections.
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
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
  ArrowRight01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { SAGE, BRAND_SURFACE } from "@/lib/tokens";
import { EXERCISE_LINKING_MAP } from "@/src/data/exerciseLinkingMap";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import type {
  GratitudeReframeResponse,
  StepProps,
  ExerciseType,
} from "@/src/types/exerciseFlow";

// ─── Constants ──────────────────────────────────────────────────────────────

const PROMPT_MAP: Record<string, string> = {
  people: "Someone who helped me recently",
  growth: "Something I learned this week",
  simple: "A small thing that made me smile",
};

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
  const drop = post - pre;
  if (drop <= 0) return "Not every reflection brings a shift, but the practice itself builds resilience.";
  if (drop >= 2) return "A significant shift. Noticing the good is a powerful tool.";
  return "Even a subtle lift in mood shows the value of shifting perspective.";
}

// ─── Main component ──────────────────────────────────────────────────────────

export function GratitudeReframeSummary({
  response,
  onNext,
  onBack,
  isSaving,
  readOnly,
  onNavigateDeeper,
}: StepProps<GratitudeReframeResponse>): React.JSX.Element {
  const router = useRouter();
  // Using another exercise link if appropriate, or a hardcoded one for Gratitude
  // We'll fall back to deep breathing if we don't have a specific map
  const link = EXERCISE_LINKING_MAP["gratitude_reframe"] ?? EXERCISE_LINKING_MAP["thought_catcher"];
  const { saveCard } = useCopingCards();
  const [cardSaved, setCardSaved] = useState<boolean>(false);

  const preScore = response.moodIntensity ?? 5;
  const postScore = response.finalMoodIntensity ?? 5;
  const hasScores = response.finalMoodIntensity !== undefined;
  
  const promptLabel = response.selectedPrompt ? PROMPT_MAP[response.selectedPrompt] || "Reflection" : "Reflection";

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
    if (cardSaved || !response.gratitudeEntries || response.gratitudeEntries.length === 0) return;
    
    // Combine entries into one card
    const entriesText = response.gratitudeEntries.map(e => `• ${e}`).join("\n");
    
    await saveCard({
      exercise_type: "gratitude_reframe",
      reframe_text: entriesText,
      reframe_label: "Gratitude Reflection",
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCardSaved(true);
  }, [cardSaved, response.gratitudeEntries, saveCard]);

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
    <View className="flex-1">
      {/* Header */}
      <View className="items-center pt-2 pb-6">
        <Animated.View style={mascotStyle}>
          <Text className="text-[64px]" accessible={false}>🌿</Text>
        </Animated.View>
        <Animated.View style={headerStyle} className="items-center mt-2">
          <Text variant="h1" className="text-center tracking-[-0.5px]">
            Perspective shifted
          </Text>
          <Text variant="body" className="text-center mt-1 text-[15px] leading-snug">
            Here's what you captured today
          </Text>
        </Animated.View>
      </View>

      {/* Main card */}
      <FadeUp delay={300}>
        <View
          className="rounded-3xl mx-1"
          style={{ backgroundColor: BRAND_SURFACE, borderWidth: 1.5, borderColor: "#EBEBEB" }}
        >
          {/* Entries */}
          {!!response.gratitudeEntries?.length && (
            <View className="px-4 py-4 rounded-t-3xl" style={{ backgroundColor: "#FFF7F5" }}>
              <Text variant="overline" className="mb-3">
                {promptLabel}
              </Text>
              <View className="gap-2.5">
                {response.gratitudeEntries.map((entry, idx) => (
                  <View key={idx} className="flex-row items-start gap-2">
                    <HugeiconsIcon icon={SparklesIcon} size={16} color="#FF7E56" style={{ marginTop: 2 }} />
                    <Text variant="body-bold" className="text-[15px] leading-relaxed text-ink flex-1">
                      {entry}
                    </Text>
                  </View>
                ))}
              </View>
              
              {!readOnly && (
                <Pressable
                  onPress={cardSaved ? undefined : handleSave}
                  disabled={cardSaved}
                  accessibilityRole="button"
                  accessibilityLabel={cardSaved ? "Saved" : "Save as coping card"}
                  className="flex-row items-center self-start gap-1.5 rounded-full px-3.5 py-2 mt-4 active:opacity-70"
                  style={{ backgroundColor: cardSaved ? SAGE[100] : SAGE.pill }}
                >
                  <HugeiconsIcon
                    icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon}
                    size={13}
                    color={SAGE[600]}
                    strokeWidth={2}
                  />
                  <Text variant="label-bold" className="text-[13px] text-sage-700">
                    {cardSaved ? "Saved" : "Save as coping card"}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Emotional shift */}
          {hasScores && (
            <>
              {!!response.gratitudeEntries?.length && <Divider />}
              <View className="px-4 py-4 rounded-b-3xl">
                <Text variant="overline" className="mb-3">
                  Mood shift
                </Text>
                <View className="gap-3">
                  <View>
                    <View className="flex-row justify-between mb-1.5">
                      <Text variant="label" className="text-ink-soft text-[13px]">Before</Text>
                      <Text variant="label-bold" className="text-[13px]">{preScore}/10</Text>
                    </View>
                    <ScoreBar value={preScore} max={10} fillColor="#FFCBBB" delay={600} />
                  </View>
                  <View>
                    <View className="flex-row justify-between mb-1.5">
                      <Text variant="label" className="text-ink-soft text-[13px]">After</Text>
                      <Text variant="label-bold" className="text-[13px]">{postScore}/10</Text>
                    </View>
                    <ScoreBar value={postScore} max={10} fillColor={SAGE[400]} delay={900} />
                  </View>
                </View>
                <Text variant="caption" className="mt-3 text-ink-soft leading-relaxed">
                  {getShiftLabel(preScore, postScore)}
                </Text>
              </View>
            </>
          )}

        </View>
      </FadeUp>

      {/* Go deeper */}
      {link && !readOnly && (
        <FadeUp delay={500}>
          <Pressable
            onPress={() => handleNavigate(link.exerciseType)}
            accessibilityRole="button"
            accessibilityLabel={link.label}
            className="flex-row items-center justify-between rounded-2xl px-4 py-3.5 mx-1 mt-3 active:opacity-70"
            style={{ backgroundColor: SAGE[50], borderWidth: 1.5, borderColor: SAGE[100] }}
          >
            <View className="flex-1 mr-3">
              <Text variant="overline" className="mb-0.5">Keep the momentum going</Text>
              <Text variant="label-bold" className="text-[14px]" style={{ color: SAGE[700] }}>
                {link.label}
              </Text>
            </View>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={SAGE[500]} strokeWidth={2.5} />
          </Pressable>
        </FadeUp>
      )}
    </View>
  );
}

GratitudeReframeSummary.displayName = "GratitudeReframeSummary";
