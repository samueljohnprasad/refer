import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useCallback, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { BookmarkAdd01Icon, BookmarkCheck01Icon } from "@hugeicons/core-free-icons";

import {
  ReflectionScoreShift,
  ReflectionTimeline,
  ReflectionTimelineItem,
} from "@/src/components/exercise/ReflectionTimeline";
import { Text } from "@/src/components/ui/Text";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import type { DecatastrophizingResponse, StepProps } from "@/src/types/exerciseFlow";

function getShiftCopy(pre: number, post: number): { label: string; detail: string; color: string; } {
  const change = pre - post;
  if (change < 0) {
    return {
      label: `${Math.abs(change)} point${Math.abs(change) === 1 ? "" : "s"} stronger`,
      detail: "Anxiety can sometimes temporarily increase when we focus closely on it.",
      color: SEMANTIC_COLORS.text.primary,
    };
  }
  if (change === 0) {
    return {
      label: "No score change",
      detail: "The score stayed steady, but you still practiced putting the fear in perspective.",
      color: SEMANTIC_COLORS.text.primary,
    };
  }
  return {
    label: `${change} point${change === 1 ? "" : "s"} lighter`,
    detail: "The feared catastrophe became less overwhelming after exploring it objectively.",
    color: SEMANTIC_COLORS.brand.onSoft,
  };
}

export const DecatastrophizingSummary: React.FC<StepProps<DecatastrophizingResponse>> = ({
  response,
  readOnly,
}) => {
  const { saveCard } = useCopingCards();
  const [cardSaved, setCardSaved] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [cardSaveError, setCardSaveError] = useState<string | null>(null);

  const preScore = response.anxietyBefore ?? 5;
  const postScore = response.anxietyAfter;
  const hasScores = postScore !== null && postScore !== undefined;
  const shift = hasScores ? getShiftCopy(preScore, postScore) : null;

  const hasCatastrophe = Boolean(response.fearedCatastrophe?.trim());
  const hasProbability = typeof response.probability === "number";
  const hasMostLikely = Boolean(response.mostLikelyOutcome?.trim());
  const hasCoping = Boolean(response.copingPlan?.trim());
  const has1Week = Boolean(response.perspective1Week?.trim());
  const has1Month = Boolean(response.perspective1Month?.trim());
  const has1Year = Boolean(response.perspective1Year?.trim());

  const hasTimeline =
    hasCatastrophe ||
    hasProbability ||
    hasMostLikely ||
    hasCoping ||
    has1Week ||
    has1Month ||
    has1Year ||
    hasScores;

  const handleSaveCopingCard = useCallback(async () => {
    if (cardSaved || isSavingCard || !response.copingPlan?.trim()) return;
    setIsSavingCard(true);
    setCardSaveError(null);
    try {
      await saveCard({
        exercise_type: "decatastrophizing",
        reframe_text: response.copingPlan,
        reframe_label: "Your coping plan",
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCardSaved(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The coping card could not be saved.";
      setCardSaveError("Could not save this coping card. Try again.");
      Alert.alert("Save failed", message);
    } finally {
      setIsSavingCard(false);
    }
  }, [cardSaved, isSavingCard, response.copingPlan, saveCard]);

  return (
    <View className="px-3" style={{ paddingBottom: 40 }}>
      <View className="pb-6 pt-2">
        <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }} className="text-[34px] leading-[37px] tracking-[-0.01em]">
          Fear put in perspective!
        </Text>
        <Text style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }} className="mt-2 max-w-[330px] text-[15px] leading-[22px]">
          You carefully examined your worry and built a plan for it.
        </Text>
      </View>

      {response.copingPlan?.trim() ? (
        <View className="py-8" style={{ marginHorizontal: -28, paddingHorizontal: 28, backgroundColor: SEMANTIC_COLORS.selection.surface }}>
          <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.pressed }} className="text-[13px] leading-[18px]">
            Your coping plan
          </Text>
          <Text accessibilityRole="summary" style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }} className="mt-1.5 text-[25px] leading-[33px]">
            {response.copingPlan}
          </Text>
          {!readOnly ? (
            <Pressable
              onPress={handleSaveCopingCard}
              disabled={cardSaved || isSavingCard}
              accessibilityRole="button"
              className="mt-5 min-h-11 flex-row items-center self-start py-2 active:opacity-60"
            >
              <HugeiconsIcon icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon} size={18} color={SEMANTIC_COLORS.brand.onSoft} strokeWidth={2} />
              <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.onSoft }} className="ml-2 text-[14px] leading-[20px]">
                {cardSaved ? "Saved to coping cards" : isSavingCard ? "Saving..." : "Save for a difficult moment"}
              </Text>
            </Pressable>
          ) : null}
          {cardSaveError ? (
            <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.error.indicator }} className="mt-2 text-[13px] leading-[18px]">
              {cardSaveError}
            </Text>
          ) : null}
        </View>
      ) : null}

      {hasTimeline ? (
        <View className="mt-7">
          <ReflectionTimeline>
            {hasCatastrophe ? (
              <ReflectionTimelineItem label="Feared catastrophe">
                <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBoldItalic, color: SEMANTIC_COLORS.text.primary }} className="text-[21px] leading-[28px]">
                  {response.fearedCatastrophe}
                </Text>
              </ReflectionTimelineItem>
            ) : null}

            {hasProbability ? (
              <ReflectionTimelineItem label="Probability">
                <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }} className="text-[16px] leading-[24px]">
                  {response.probability}% chance of happening
                </Text>
              </ReflectionTimelineItem>
            ) : null}

            {hasMostLikely ? (
              <ReflectionTimelineItem label="Most likely outcome">
                <Text style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.primary }} className="text-[16px] leading-[24px]">
                  {response.mostLikelyOutcome}
                </Text>
              </ReflectionTimelineItem>
            ) : null}
            
            {has1Week || has1Month || has1Year ? (
              <ReflectionTimelineItem label="Time perspective">
                <View className="gap-3">
                  {has1Week && (
                    <View>
                      <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }} className="text-[14px]">In 1 week</Text>
                      <Text style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }} className="text-[14px]">{response.perspective1Week}</Text>
                    </View>
                  )}
                  {has1Month && (
                    <View>
                      <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }} className="text-[14px]">In 1 month</Text>
                      <Text style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }} className="text-[14px]">{response.perspective1Month}</Text>
                    </View>
                  )}
                  {has1Year && (
                    <View>
                      <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }} className="text-[14px]">In 1 year</Text>
                      <Text style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }} className="text-[14px]">{response.perspective1Year}</Text>
                    </View>
                  )}
                </View>
              </ReflectionTimelineItem>
            ) : null}

            {hasScores && shift ? (
              <ReflectionTimelineItem label="How anxious you felt" isLast>
                <ReflectionScoreShift
                  before={preScore}
                  after={postScore}
                  label={shift.label}
                  detail={shift.detail}
                  accentColor={shift.color}
                />
              </ReflectionTimelineItem>
            ) : null}
          </ReflectionTimeline>
        </View>
      ) : null}

      <Text style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }} className="mb-2 mt-10 px-5 text-center text-[13px] leading-[20px]">
        Completing saves this reflection to your exercise history.
      </Text>
    </View>
  );
};

DecatastrophizingSummary.displayName = "DecatastrophizingSummary";
