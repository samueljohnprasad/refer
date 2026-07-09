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
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  if (drop < 0) return "It's normal for distress to increase when facing hard thoughts. You sat with it, and that takes courage.";
  if (drop === 0) return "You sat with a difficult thought. That takes courage.";
  const pct = pre > 0 ? Math.round((drop / pre) * 100) : 0;
  if (pct >= 50) return `Distress dropped ${pct}% — your rational mind got louder.`;
  if (pct >= 20) return `A real shift. Small drops build new patterns over time.`;
  return "Progress is rarely linear. Showing up is what counts.";
}

// ─── Main component ──────────────────────────────────────────────────────────

export const ThoughtReframingSummary: React.FC<
  StepProps<ThoughtReframingResponse>
> = ({ response, onNext, onBack, isSaving, readOnly, onNavigateDeeper }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      if (onNavigateDeeper) {
        onNavigateDeeper(type);
      } else {
        // Fallback for previews or standalone mode
        onNext();
        router.push({ pathname: "/tabs/screens/exercise-flow", params: { type } });
      }
    },
    [onNext, onNavigateDeeper, router],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View className="flex-1 pb-32" style={{ paddingTop: Math.max(insets.top, 16) }}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View className="items-start pt-2 pb-6 px-1">
        <Animated.View style={mascotStyle}>
          <Mascot state="panda-happy" size={72} />
        </Animated.View>
        <Animated.View style={headerStyle} className="items-start mt-3">
          <Text variant="h1" className="text-left tracking-tight">
            Thought reframed
          </Text>
          <Text
            variant="body"
            className="text-left mt-1 text-base leading-snug text-ink-soft"
          >
            Here's everything you worked through
          </Text>
        </Animated.View>
      </View>

      {/* ── 7. Balanced Thought Hero Card (Climactic Outcome) ──────────── */}
      {!!response.balancedThought?.trim() && (
        <FadeUp delay={300}>
          <View
            className="rounded-3xl p-5 mx-1 mb-6 border border-sage-200/80"
            style={{ backgroundColor: SAGE[50] }}
          >
            <Text
              variant="label-bold"
              className="text-sm text-sage-800 mb-2"
            >
              Your balanced thought
            </Text>
            <Text
              variant="body-bold"
              className="text-base leading-relaxed text-ink mb-4"
            >
              {response.balancedThought}
            </Text>

            {!readOnly && (
              <Pressable
                onPress={cardSaved ? undefined : handleSaveCopingCard}
                disabled={cardSaved}
                accessibilityRole="button"
                accessibilityLabel={cardSaved ? "Saved" : "Save as coping card"}
                className="flex-row items-center self-start gap-1.5 rounded-full px-4 py-2 active:opacity-70"
                style={{
                  backgroundColor: cardSaved ? SAGE[100] : SAGE.pill,
                }}
              >
                <HugeiconsIcon
                  icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon}
                  size={14}
                  color={SAGE[600]}
                  strokeWidth={2}
                />
                <Text
                  variant="label-bold"
                  className="text-sm text-sage-700"
                >
                  {cardSaved ? "Saved" : "Save as coping card"}
                </Text>
              </Pressable>
            )}
          </View>
        </FadeUp>
      )}

      {/* ── Reflection Context Card ──────────────────────────────── */}
      <FadeUp delay={450}>
        <View className="mx-2 mb-4 gap-10">
          {/* ── 1. What happened ───────────────────────────── */}
          {!!response.situation?.trim() && (
            <View >
              <Text
                variant="label"
                className="text-sm font-semibold text-ink-soft mb-1.5"
              >
                What happened
              </Text>
              <Text
                variant="body"
                className="text-base leading-relaxed text-ink"
              >
                {response.situation}
              </Text>
            </View>
          )}

          

          {/* ── 2. Automatic thought ───────────────────────── */}
          {!!response.automaticThought?.trim() && (
            <View >
              <Text
                variant="label"
                className="text-sm font-semibold text-ink-soft mb-1.5"
              >
                Automatic thought
              </Text>
              <View className="pl-3 py-1 border-l-2" style={{ borderColor: TERRACOTTA_TINT }}>
                <Text
                  variant="body-bold"
                  className="text-base leading-relaxed text-ink italic"
                >
                  "{response.automaticThought}"
                </Text>
              </View>
            </View>
          )}

          {/* ── Belief shift delta ─────────────────────────── */}
          {hasScores && (
            <>
              <View >
                <Text
                  variant="label"
                  className="text-sm font-semibold text-ink-soft mb-2.5"
                >
                  How your distress changed
                </Text>
                <View className="flex-row items-center justify-between mt-1">
                  <View className="flex-row items-center gap-3.5">
                    <View>
                      <Text variant="caption" className="text-ink-soft">
                        Before
                      </Text>
                      <Text variant="display" className="text-ink mt-0 text-3xl tracking-tight">
                        {preScore}%
                      </Text>
                    </View>
                    <Text className="text-ink-soft font-medium text-lg mx-1">→</Text>
                    <View>
                      <Text variant="caption" className="text-ink-soft">
                        After
                      </Text>
                      <Text variant="display" className={`mt-0 text-3xl tracking-tight ${preScore - postScore! >= 0 ? 'text-sage-700' : 'text-ink'}`}>
                        {postScore}%
                      </Text>
                    </View>
                  </View>
                  <View className={`px-3 py-1.5 rounded-full ${preScore - postScore! >= 0 ? 'bg-sage-100/90' : 'bg-gray-100'}`}>
                    <Text
                      variant="label-bold"
                      className={`text-xs ${preScore - postScore! >= 0 ? 'text-sage-800' : 'text-ink-soft'}`}
                    >
                      {preScore - postScore! >= 0
                        ? `-${preScore - postScore!}% distress`
                        : `+${postScore! - preScore}% distress`}
                    </Text>
                  </View>
                </View>
                <Text
                  variant="caption"
                  className="mt-2.5 text-ink-soft leading-relaxed"
                >
                  {getShiftLabel(preScore, postScore!)}
                </Text>
              </View>
            </>
          )}

          {/* ── 3. Emotions felt ───────────────────────────── */}
          {emotions.length > 0 && (
            <>
              <View >
                <Text
                  variant="label"
                  className="text-sm font-semibold text-ink-soft mb-2.5"
                >
                  How you felt
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {emotions.map((emotion: any, i: number) => (
                    <FadeUp key={i} delay={550 + i * 60}>
                      <View
                        className="flex-row items-center rounded-full px-3 py-1.5 border border-gray-200"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <Text className="text-sm mr-1.5">{emotion.emoji}</Text>
                        <Text
                          variant="label-bold"
                          className="text-sm text-ink-soft"
                        >
                          {emotion.label}
                        </Text>
                      </View>
                    </FadeUp>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* ── 4. Thinking traps ──────────────────────────── */}
          {distortions.length > 0 && (
            <>
              <View >
                <Text
                  variant="label"
                  className="text-sm font-semibold text-ink-soft mb-2.5"
                >
                  Thinking traps spotted
                </Text>
                <View className="gap-3">
                  {distortions.map((d: any, i: number) => (
                    <View key={i} className="flex-row items-start py-0.5">
                      <Text className="text-lg mr-3 mt-0.5">{d.icon}</Text>
                      <View className="flex-1 justify-center">
                        <Text variant="label-bold" className="text-sm text-ink">
                          {d.label}
                        </Text>
                        <Text
                          variant="caption"
                          className="text-xs text-ink-soft mt-0.5 leading-snug"
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
              <View >
                <Text
                  variant="label"
                  className="text-sm font-semibold text-ink-soft mb-3"
                >
                  Evidence reviewed
                </Text>
                {/* For */}
                {response.evidenceFor?.length > 0 && (
                  <View className="mb-3">
                     <Text
                      variant="label-bold"
                      className="text-xs mb-2"
                      style={{ color: "#D97706" }}
                    >
                      Evidence supporting the thought
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
                          className="text-sm text-ink flex-1 leading-relaxed"
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
                      variant="label-bold"
                      className="text-xs mb-2"
                      style={{ color: SAGE[600] }}
                    >
                      Evidence against the thought
                    </Text>
                    {response.evidenceAgainst.map((item: string, i: number) => (
                      <View key={i} className="flex-row items-start mb-1.5">
                        <View
                          className="w-1.5 h-1.5 rounded-full mt-[7px] mr-2.5 flex-shrink-0"
                          style={{ backgroundColor: SAGE[500] }}
                        />
                        <Text
                          variant="body"
                          className="text-sm text-ink flex-1 leading-relaxed"
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
              borderWidth: 1,
              borderColor: SAGE[100],
            }}
          >
            <View className="flex-1 mr-3">
              <Text variant="caption" className="text-sage-600 font-semibold mb-0.5">
                Keep the momentum going
              </Text>
              <Text
                variant="label-bold"
                className="text-sm"
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
