import React, { useEffect } from "react";
import { View, ScrollView, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { SAGE, INK_SOFT, TERRACOTTA_TINT, BRAND_SURFACE } from "@/lib/tokens";
import type { ExerciseType } from "@/src/types/exerciseFlow";


interface DynamicSummaryProps {
  title: string;
  celebrationEmoji?: string;
  preScore?: number;
  postScore?: number;
  scoreLabel?: string;
  scoreMax?: number;
  keyTakeaway?: string;
  keyTakeawayLabel?: string;
  nextExerciseType?: ExerciseType;
  nextExerciseLabel?: string;
  onSaveCopingCard?: () => void;
  cardSaved?: boolean;
  onNavigateToExercise?: (type: ExerciseType) => void;
  onComplete: () => void;
  onEdit?: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
  /** Optional extra content rendered below the takeaway card */
  children?: React.ReactNode;
}

function getInsightMessage(
  pre: number,
  post: number,
  scoreLabel: string,
): string {
  const drop = pre - post;
  const pct = pre > 0 ? Math.round((drop / pre) * 100) : 0;

  if (drop > 0 && pct >= 50) {
    return `Your ${scoreLabel.toLowerCase()} dropped by ${pct}%. That's your rational mind at work.`;
  }
  if (drop > 0 && pct >= 20) {
    return `A real shift. Every small drop builds a new pattern over time.`;
  }
  if (drop > 0) {
    return `Change is often gradual. Showing up is what matters most.`;
  }
  if (drop === 0) {
    return `Sometimes naming something difficult is enough for today.`;
  }
  return `Sometimes looking at hard things closely makes them feel bigger first. It gets easier.`;
}

function AnimatedScoreBar({
  label,
  value,
  max,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  delay?: number;
}) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const barProgress = useSharedValue(0);

  useEffect(() => {
    barProgress.value = withDelay(
      delay,
      withTiming(pct, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, [pct, delay]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barProgress.value * 100}%`,
  }));

  return (
    <View className="flex-1 items-center">
      <Text
        variant="caption-muted"
        className="text-[11px] font-bold uppercase tracking-wider mb-2"
      >
        {label}
      </Text>
      <View className="w-full h-3 rounded-full bg-brand-border overflow-hidden mb-1.5">
        <Animated.View
          className="h-full rounded-full"
          style={[{ backgroundColor: color }, barStyle]}
        />
      </View>
      <Text variant="h3" className="text-[22px] font-extrabold text-ink">
        {value}
        <Text variant="caption-muted" className="text-[13px]">
          /{max}
        </Text>
      </Text>
    </View>
  );
}

export const DynamicSummary: React.FC<DynamicSummaryProps> = ({
  title,
  celebrationEmoji = "✨",
  preScore,
  postScore,
  scoreLabel = "Intensity",
  scoreMax = 10,
  keyTakeaway,
  keyTakeawayLabel = "Your takeaway",
  nextExerciseType,
  nextExerciseLabel,
  onSaveCopingCard,
  cardSaved = false,
  onNavigateToExercise,
  onComplete,
  onEdit,
  isSaving,
  readOnly,
  children,
}) => {
  const hasScores =
    preScore !== undefined &&
    postScore !== undefined &&
    preScore !== null &&
    postScore !== null;

  const insightMessage = hasScores
    ? getInsightMessage(preScore!, postScore!, scoreLabel)
    : null;

  // ── Mount animations ─────────────────────────────────────────────────────
  const emojiScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    emojiScale.value = withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true });
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    contentOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, []);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
    opacity: interpolate(emojiScale.value, [0, 0.5, 1], [0, 0.8, 1]),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      { translateY: interpolate(titleOpacity.value, [0, 1], [10, 0]) },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <View className="flex-1 pb-10">
      <View className="flex-1 px-1">
        {/* Header — animated */}
        <View className="items-center pt-6 pb-4 px-2">
          <Animated.View
            className="h-24 w-24 rounded-full items-center justify-center mb-5 bg-sage-50"
            style={emojiStyle}
          >
            <Text className="text-[52px]" accessible={false}>
              {celebrationEmoji}
            </Text>
          </Animated.View>
          <Animated.View style={titleStyle}>
            <Text
              variant="h2"
              className="text-[26px] font-extrabold text-ink text-center mb-1"
            >
              {title}
            </Text>
          </Animated.View>
        </View>

        {/* Before / After score bars — animated */}
        {hasScores && (
          <Animated.View
            className="mx-1 rounded-xl p-4 mb-4 border border-sage-200/50"
            style={[{ backgroundColor: SAGE[50] }, contentStyle]}
          >
            <View className="flex-row gap-4 mb-3">
              <AnimatedScoreBar
                label="Before"
                value={preScore!}
                max={scoreMax}
                color={TERRACOTTA_TINT}
                delay={600}
              />
              <View className="w-px bg-brand-border self-stretch" />
              <AnimatedScoreBar
                label="After"
                value={postScore!}
                max={scoreMax}
                color={SAGE[400]}
                delay={900}
              />
            </View>
            {insightMessage && (
              <Text
                variant="body"
                className="text-[13.5px] text-sage-700 font-medium text-center leading-relaxed"
              >
                {insightMessage}
              </Text>
            )}
          </Animated.View>
        )}

        {/* Key takeaway card — fades in with content */}
        <Animated.View style={contentStyle}>
          {keyTakeaway && keyTakeaway.trim().length > 0 && (
            <View
              className="mx-1 rounded-xl p-4 mb-4 border border-sage-200/60"
              style={{ backgroundColor: BRAND_SURFACE }}
            >
              <Text
                variant="caption-muted"
                className="text-[11px] font-bold uppercase tracking-wider mb-2"
              >
                {keyTakeawayLabel}
              </Text>
              <Text
                variant="body"
                className="text-[15px] text-ink leading-relaxed mb-3"
              >
                {keyTakeaway}
              </Text>
              {onSaveCopingCard && !readOnly && (
                <Pressable
                  onPress={cardSaved ? undefined : onSaveCopingCard}
                  disabled={cardSaved}
                  accessibilityRole="button"
                  accessibilityLabel={
                    cardSaved ? "Saved" : "Save as coping card"
                  }
                  accessibilityState={{ disabled: cardSaved }}
                  className="flex-row items-center self-start gap-1.5 px-3 py-2 rounded-full active:opacity-70"
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
                  <Text className="text-[13px] font-bold text-sage-700">
                    {cardSaved ? "Saved ✓" : "Save as coping card"}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Exercise-specific extra content */}
          {children}

          {/* Next exercise suggestion */}
          {nextExerciseType &&
            nextExerciseLabel &&
            onNavigateToExercise &&
            !readOnly && (
              <Pressable
                onPress={() => onNavigateToExercise(nextExerciseType)}
                accessibilityRole="button"
                accessibilityLabel={nextExerciseLabel}
                className="mx-1 flex-row items-center justify-between rounded-xl px-4 py-3.5 mb-4 active:opacity-70 border border-sage-200/50"
                style={{ backgroundColor: SAGE[50] }}
              >
                <View className="flex-1 mr-3">
                  <Text
                    variant="caption-muted"
                    className="text-[11px] font-bold uppercase tracking-wider mb-0.5"
                  >
                    Want to go deeper?
                  </Text>
                  <Text
                    variant="body"
                    className="text-[14px] font-bold text-sage-700"
                  >
                    {nextExerciseLabel}
                  </Text>
                </View>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={18}
                  color={SAGE[500]}
                  strokeWidth={2}
                />
              </Pressable>
            )}
        </Animated.View>
      </View>
    </View>
  );
};

DynamicSummary.displayName = "DynamicSummary";
