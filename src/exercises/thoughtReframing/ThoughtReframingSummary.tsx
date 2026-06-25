/**
 * ThoughtReframingSummary
 *
 * Professional, minimal reflection summary — shows every user entry
 * in a clean, readable layout that feels like it belongs in a top-tier
 * wellness app, not a generated template.
 */

import React, { useState, useCallback, useEffect, useMemo } from "react";
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
  TERRACOTTA_TINT,
  INK_MUTED,
  INK_SOFT,
} from "@/lib/tokens";
import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import { COGNITIVE_DISTORTIONS } from "@/src/screens/ThoughtReframingScreen/data/cognitiveDistortions";
import { EXERCISE_LINKING_MAP } from "@/src/data/exerciseLinkingMap";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import type {
  ThoughtReframingResponse,
  StepProps,
  ExerciseType,
  CognitiveDistortionKey,
} from "@/src/types/exerciseFlow";
import type { EmotionRating } from "@/src/screens/ThoughtReframingScreen/types";

// ─── Staggered section fade ──────────────────────────────────────────────────

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

// ─── Section divider ─────────────────────────────────────────────────────────

function Divider() {
  return (
    <View
      className="mx-0 my-0"
      style={{ height: 1, backgroundColor: "#F0F0F0" }}
    />
  );
}

// ─── Belief shift insight ────────────────────────────────────────────────────

function getShiftLabel(pre: number, post: number): string {
  const drop = pre - post;
  if (drop <= 0) return "You sat with a difficult thought. That takes courage.";
  const pct = pre > 0 ? Math.round((drop / pre) * 100) : 0;
  if (pct >= 50) return `Belief dropped ${pct}% — your rational mind got louder.`;
  if (pct >= 20) return `A real shift. Small drops build new patterns over time.`;
  return "Progress is rarely linear. Showing up is what counts.";
}

// ─── Main component ──────────────────────────────────────────────────────────

export const ThoughtReframingSummary: React.FC<
  StepProps<ThoughtReframingResponse>
> = ({ response, onNext, onBack, isSaving, readOnly }) => {
  const router = useRouter();
  const { saveCard } = useCopingCards();
  const [cardSaved, setCardSaved] = useState<boolean>(false);
  const link = EXERCISE_LINKING_MAP["thought_reframing"];

  // ── Derived data ───────────────────────────────────────────────────────────

  const emotions = useMemo(() => {
    return (response.selectedEmotions ?? []).map((e: EmotionRating | string) => {
      const name = typeof e === "string" ? e : e.name;
      return EMOTION_OPTIONS.find((o) => o.name === name) ?? null;
    }).filter(Boolean);
  }, [response.selectedEmotions]);

  const distortions = useMemo(() => {
    return (response.selectedDistortions ?? []).map((key: CognitiveDistortionKey) =>
      COGNITIVE_DISTORTIONS.find((d) => d.key === key) ?? null,
    ).filter(Boolean);
  }, [response.selectedDistortions]);

  const preScore = response.intensity ?? 0;
  const postScore = response.postIntensity ?? null;
  const hasScores = postScore !== null && postScore !== undefined;

  // ── Header animation ───────────────────────────────────────────────────────

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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveCopingCard = useCallback(async () => {
    if (cardSaved || !response.balancedThought?.trim()) return;
    await saveCard({
      exercise_type: "thought_reframing",
      reframe_text: response.balancedThought,
      reframe_label: "Balanced thought",
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCardSaved(true);
  }, [cardSaved, response.balancedThought, saveCard]);

  const handleNavigateDeeper = useCallback(
    (type: ExerciseType) => {
      onNext();
      router.push({ pathname: "/tabs/screens/exercise-flow", params: { type } });
    },
    [onNext, router],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View className="flex-1">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View className="items-center pt-2 pb-6">
        <Animated.View style={mascotStyle}>
          <Mascot state="panda-happy" size={72} />
        </Animated.View>
        <Animated.View style={headerStyle} className="items-center mt-3">
          <Text variant="h1" className="text-center tracking-[-0.5px]">
            Thought reframed
          </Text>
          <Text
            variant="body"
            className="text-center mt-1 text-[15px] leading-snug"
          >
            Here's everything you worked through
          </Text>
        </Animated.View>
      </View>

      {/* ── Card — all sections grouped ────────────────────────────── */}
      <FadeUp delay={300}>
        <View
          className="rounded-3xl overflow-hidden mx-1"
          style={{
            backgroundColor: BRAND_SURFACE,
            borderWidth: 1.5,
            borderColor: "#EBEBEB",
          }}
        >
          {/* ── 1. What happened ───────────────────────────── */}
          {!!response.situation?.trim() && (
            <View className="px-4 py-4">
              <Text variant="overline" className="mb-1.5">
                What happened
              </Text>
              <Text
                variant="body"
                className="text-[15px] leading-relaxed text-ink"
              >
                {response.situation}
              </Text>
            </View>
          )}

          {!!response.situation?.trim() && !!response.automaticThought?.trim() && (
            <Divider />
          )}

          {/* ── 2. Automatic thought ───────────────────────── */}
          {!!response.automaticThought?.trim() && (
            <View className="px-4 py-4">
              <Text variant="overline" className="mb-1.5">
                Automatic thought
              </Text>
              <View
                className="rounded-xl px-3.5 py-3"
                style={{ backgroundColor: "#FFF7F5" }}
              >
                <Text
                  variant="body-bold"
                  className="text-[15px] leading-relaxed text-ink"
                >
                  "{response.automaticThought}"
                </Text>
              </View>
            </View>
          )}

          {/* ── Belief scores ──────────────────────────────── */}
          {hasScores && (
            <>
              <Divider />
              <View className="px-4 py-4">
                <Text variant="overline" className="mb-3">
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
                      fillColor="#FFCBBB"
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
                >
                  {getShiftLabel(preScore, postScore!)}
                </Text>
              </View>
            </>
          )}

          {/* ── 3. Emotions felt ───────────────────────────── */}
          {emotions.length > 0 && (
            <>
              <Divider />
              <View className="px-4 py-4">
                <Text variant="overline" className="mb-2.5">
                  How you felt
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {emotions.map((emotion: any, i: number) => (
                    <View
                      key={i}
                      className="flex-row items-center rounded-full px-3 py-1.5"
                      style={{ backgroundColor: emotion.bgColor ?? "#F5F5F5" }}
                    >
                      <Text className="text-[13px] mr-1.5">{emotion.emoji}</Text>
                      <Text
                        variant="label-bold"
                        className="text-[13px]"
                        style={{ color: emotion.color }}
                      >
                        {emotion.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* ── 4. Thinking traps ──────────────────────────── */}
          {distortions.length > 0 && (
            <>
              <Divider />
              <View className="px-4 py-4">
                <Text variant="overline" className="mb-2.5">
                  Thinking traps spotted
                </Text>
                <View className="gap-2">
                  {distortions.map((d: any, i: number) => (
                    <View
                      key={i}
                      className="flex-row items-start rounded-xl px-3 py-2.5"
                      style={{ backgroundColor: "#F8F8F8" }}
                    >
                      <Text className="text-[16px] mr-2.5 mt-0.5">{d.icon}</Text>
                      <View className="flex-1">
                        <Text variant="label-bold" className="text-[13.5px] text-ink">
                          {d.label}
                        </Text>
                        <Text
                          variant="caption"
                          className="text-[12px] text-ink-soft mt-0.5 leading-snug"
                        >
                          {d.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* ── 5 & 6. Evidence ────────────────────────────── */}
          {(response.evidenceFor?.length > 0 ||
            response.evidenceAgainst?.length > 0) && (
            <>
              <Divider />
              <View className="px-4 py-4">
                <Text variant="overline" className="mb-3">
                  Evidence reviewed
                </Text>
                {/* For */}
                {response.evidenceFor?.length > 0 && (
                  <View className="mb-3">
                    <Text
                      variant="caption"
                      className="text-[11px] font-bold uppercase tracking-widest mb-2"
                      style={{ color: "#D97706" }}
                    >
                      Supported it
                    </Text>
                    {response.evidenceFor.map((item: string, i: number) => (
                      <View
                        key={i}
                        className="flex-row items-start mb-1.5"
                      >
                        <View
                          className="w-1.5 h-1.5 rounded-full mt-[7px] mr-2.5 flex-shrink-0"
                          style={{ backgroundColor: "#D97706" }}
                        />
                        <Text
                          variant="body"
                          className="text-[14px] text-ink flex-1 leading-relaxed"
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {/* Against */}
                {response.evidenceAgainst?.length > 0 && (
                  <View>
                    <Text
                      variant="caption"
                      className="text-[11px] font-bold uppercase tracking-widest mb-2"
                      style={{ color: SAGE[600] }}
                    >
                      Challenged it
                    </Text>
                    {response.evidenceAgainst.map((item: string, i: number) => (
                      <View key={i} className="flex-row items-start mb-1.5">
                        <View
                          className="w-1.5 h-1.5 rounded-full mt-[7px] mr-2.5 flex-shrink-0"
                          style={{ backgroundColor: SAGE[500] }}
                        />
                        <Text
                          variant="body"
                          className="text-[14px] text-ink flex-1 leading-relaxed"
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}

          {/* ── 7. Balanced thought ────────────────────────── */}
          {!!response.balancedThought?.trim() && (
            <>
              <Divider />
              <View
                className="px-4 py-4"
                style={{ backgroundColor: SAGE[50] }}
              >
                <Text variant="overline" className="mb-2">
                  Your balanced thought
                </Text>
                <Text
                  variant="body-bold"
                  className="text-[15px] leading-relaxed text-ink mb-3"
                >
                  {response.balancedThought}
                </Text>

                {!readOnly && (
                  <Pressable
                    onPress={cardSaved ? undefined : handleSaveCopingCard}
                    disabled={cardSaved}
                    accessibilityRole="button"
                    accessibilityLabel={cardSaved ? "Saved" : "Save as coping card"}
                    className="flex-row items-center self-start gap-1.5 rounded-full px-3.5 py-2 active:opacity-70"
                    style={{
                      backgroundColor: cardSaved ? SAGE[100] : SAGE.pill,
                    }}
                  >
                    <HugeiconsIcon
                      icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon}
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
            </>
          )}
        </View>
      </FadeUp>

      {/* ── Go deeper row ─────────────────────────────────────────── */}
      {link && !readOnly && (
        <FadeUp delay={550}>
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

ThoughtReframingSummary.displayName = "ThoughtReframingSummary";
