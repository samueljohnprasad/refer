import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
} from "@hugeicons/core-free-icons";
import {
  ReflectionTimeline,
  ReflectionTimelineItem,
  ReflectionScoreShift,
} from "@/src/components/exercise/ReflectionTimeline";
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
  children?: React.ReactNode;
}

function getShiftCopy(pre: number, post: number): {
  label: string;
  detail: string;
  color: string;
} {
  const change = pre - post;

  if (change < 0) {
    return {
      label: `${Math.abs(change)} point${Math.abs(change) === 1 ? "" : "s"} stronger`,
      detail:
        "Looking closely can sometimes make a difficult feeling sharper before it settles.",
      color: SEMANTIC_COLORS.text.primary,
    };
  }

  if (change === 0) {
    return {
      label: "No score change",
      detail:
        "Sometimes naming something difficult is enough for today.",
      color: SEMANTIC_COLORS.text.primary,
    };
  }

  return {
    label: `${change} point${change === 1 ? "" : "s"} lighter`,
    detail:
      change >= 4
        ? "The feeling became meaningfully less intense after you practiced."
        : "Even a small shift matters. You made room for a more balanced state.",
    color: SEMANTIC_COLORS.brand.pressed,
  };
}

export const DynamicSummary: React.FC<DynamicSummaryProps> = ({
  title,
  preScore,
  postScore,
  scoreLabel = "Intensity",
  keyTakeaway,
  keyTakeawayLabel = "Your takeaway",
  nextExerciseType,
  nextExerciseLabel,
  onSaveCopingCard,
  cardSaved = false,
  onNavigateToExercise,
  readOnly,
  children,
}) => {
  const hasScores =
    preScore !== undefined &&
    postScore !== undefined &&
    preScore !== null &&
    postScore !== null;

  const shift = hasScores ? getShiftCopy(preScore!, postScore!) : null;

  return (
    <View className="px-3" style={{ paddingBottom: 40 }}>
      <View className="pb-6 pt-2">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }}
          className="text-[34px] leading-[37px] tracking-[-0.01em]"
        >
          {title}
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }}
          className="mt-2 max-w-[330px] text-[15px] leading-[22px]"
        >
          You took a moment to check in with yourself.
        </Text>
      </View>

      {keyTakeaway?.trim() ? (
        <View
          className="py-8 mb-6"
          style={{
            marginHorizontal: -28,
            paddingHorizontal: 28,
            backgroundColor: SEMANTIC_COLORS.surface.elevated,
          }}
        >
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.secondary }}
            className="text-[13px] leading-[18px]"
          >
            {keyTakeawayLabel}
          </Text>
          <Text
            accessibilityRole="summary"
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }}
            className="mt-1.5 text-[25px] leading-[33px]"
          >
            {keyTakeaway}
          </Text>

          {!readOnly && onSaveCopingCard ? (
            <Pressable
              onPress={cardSaved ? undefined : onSaveCopingCard}
              disabled={cardSaved}
              accessibilityRole="button"
              accessibilityLabel={
                cardSaved ? "Saved to coping cards" : "Save as coping card"
              }
              accessibilityState={{
                disabled: cardSaved,
              }}
              className="mt-5 min-h-11 flex-row items-center self-start py-2 active:opacity-60"
            >
              <HugeiconsIcon
                icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon}
                size={18}
                color={SEMANTIC_COLORS.brand.pressed}
                strokeWidth={2}
              />
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.pressed }}
                className="ml-2 text-[14px] leading-[20px]"
              >
                {cardSaved
                  ? "Saved to coping cards"
                  : "Save for a difficult moment"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {(hasScores || children || nextExerciseType) ? (
        <View className="mt-2">
          <ReflectionTimeline>
            {hasScores && shift ? (
              <ReflectionTimelineItem
                label={scoreLabel}
                isLast={!children && !nextExerciseType}
              >
                <ReflectionScoreShift
                  before={preScore!}
                  after={postScore!}
                  label={shift.label}
                  detail={shift.detail}
                  accentColor={shift.color}
                />
              </ReflectionTimelineItem>
            ) : null}
            
            {children ? (
              <ReflectionTimelineItem
                label="Insights"
                isLast={!nextExerciseType}
              >
                {children}
              </ReflectionTimelineItem>
            ) : null}

            {nextExerciseType && nextExerciseLabel && onNavigateToExercise && !readOnly ? (
              <ReflectionTimelineItem
                label="Want to go deeper?"
                isLast={true}
              >
                <Pressable
                  onPress={() => onNavigateToExercise(nextExerciseType)}
                  accessibilityRole="button"
                  accessibilityLabel={nextExerciseLabel}
                  className="flex-row items-center justify-between rounded-xl px-4 py-3.5 mt-1 active:opacity-70 border border-sage-200/50"
                  style={{ backgroundColor: SEMANTIC_COLORS.surface.elevated }}
                >
                  <Text
                    style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.pressed }}
                    className="text-[14px] leading-[20px]"
                  >
                    Apply it → {nextExerciseLabel}
                  </Text>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    color={SEMANTIC_COLORS.brand.primary}
                    strokeWidth={2}
                  />
                </Pressable>
              </ReflectionTimelineItem>
            ) : null}
          </ReflectionTimeline>
        </View>
      ) : null}

      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }}
        className="mb-2 mt-10 px-5 text-center text-[13px] leading-[20px]"
      >
        Completing saves this to your history.
      </Text>
    </View>
  );
};

DynamicSummary.displayName = "DynamicSummary";
