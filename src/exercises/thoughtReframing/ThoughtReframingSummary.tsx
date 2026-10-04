import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
} from "@hugeicons/core-free-icons";

import {
  ReflectionBulletList,
  ReflectionScoreShift,
  ReflectionTimeline,
  ReflectionTimelineItem,
} from "@/src/components/exercise/ReflectionTimeline";
import { Text } from "@/src/components/ui/Text";
import { ExerciseCopyText } from "@/src/components/exercise/ExerciseCopyText";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useTranslation } from "react-i18next";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import {
  EMOTION_OPTIONS,
  type EmotionOption,
} from "@/src/screens/ThoughtReframingScreen/data/emotions";
import { COGNITIVE_DISTORTIONS } from "@/src/screens/ThoughtReframingScreen/data/cognitiveDistortions";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import { ThoughtReframingTimeline } from "./ThoughtReframingTimeline";
import type {
  ThoughtReframingResponse,
  StepProps,
  CognitiveDistortionKey,
} from "@/src/types/exerciseFlow";
import type {
  CognitiveDistortion,
  EmotionRating,
} from "@/src/screens/ThoughtReframingScreen/types";

function getShiftCopy(pre: number, post: number): {
  label?: string;
  labelKey?: "flow.ui.scoreShiftStronger" | "flow.ui.scoreShiftLighter";
  labelCount?: number;
  detail: string;
  color: string;
} {
  const change = pre - post;

  if (change < 0) {
    return {
      labelKey: "flow.ui.scoreShiftStronger",
      labelCount: Math.abs(change),
      detail:
        "The thought feels more believable right now. Looking closely can sometimes make a difficult thought feel sharper before it settles.",
      color: SEMANTIC_COLORS.text.primary,
    };
  }

  if (change === 0) {
    return {
      label: "No score change",
      detail:
        "The score stayed steady, but you still practiced testing the thought instead of accepting it automatically.",
      color: SEMANTIC_COLORS.text.primary,
    };
  }

  return {
      labelKey: "flow.ui.scoreShiftLighter",
      labelCount: change,
    detail:
      change >= 4
        ? "The thought became meaningfully less believable after you reviewed the evidence."
        : "Even a small shift matters. You made room for a more balanced interpretation.",
    color: SEMANTIC_COLORS.brand.onSoft,
  };
}

export const ThoughtReframingSummary: React.FC<
  StepProps<ThoughtReframingResponse>
> = ({ response, readOnly }) => {
  const { saveCard } = useCopingCards();
  const translateCopy = useExerciseCopy();
  const { t: rawTranslateUi } = useTranslation("exercises");
  const translateUi = rawTranslateUi as unknown as (
    key: string,
    options: { count: number },
  ) => string;
  const [cardSaved, setCardSaved] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [cardSaveError, setCardSaveError] = useState<string | null>(null);

  const emotions = useMemo<EmotionOption[]>(
    () =>
      (response.selectedEmotions ?? [])
        .map((emotion: EmotionRating | string) => {
          const name = typeof emotion === "string" ? emotion : emotion.name;
          return EMOTION_OPTIONS.find((option) => option.name === name);
        })
        .filter((emotion): emotion is EmotionOption => Boolean(emotion)),
    [response.selectedEmotions],
  );

  const distortions = useMemo<CognitiveDistortion[]>(
    () =>
      (response.selectedDistortions ?? [])
        .map((key: CognitiveDistortionKey) =>
          COGNITIVE_DISTORTIONS.find((distortion) => distortion.key === key),
        )
        .filter(
          (distortion): distortion is CognitiveDistortion =>
            Boolean(distortion),
        ),
    [response.selectedDistortions],
  );

  const preScore = response.intensity ?? 5;
  const postScore = response.postIntensity;
  const hasScores = postScore !== null && postScore !== undefined;
  const rawShift = hasScores ? getShiftCopy(preScore, postScore) : null;
  const shift = rawShift
    ? {
        ...rawShift,
        label: rawShift.labelKey
          ? translateUi(rawShift.labelKey, { count: rawShift.labelCount ?? 0 })
          : translateCopy(rawShift.label ?? ""),
        detail: translateCopy(rawShift.detail),
      }
    : null;
  const evidenceFor = response.evidenceFor ?? [];
  const evidenceAgainst = response.evidenceAgainst ?? [];

  const hasSituation = Boolean(response.situation?.trim());
  const hasAutomaticThought = Boolean(response.automaticThought?.trim());
  const hasEmotions = emotions.length > 0;
  const hasDistortions = distortions.length > 0;
  const hasEvidenceFor = evidenceFor.length > 0;
  const hasEvidenceAgainst = evidenceAgainst.length > 0;
  const hasEvidence = hasEvidenceFor || hasEvidenceAgainst;
  const hasTimeline =
    hasSituation ||
    hasAutomaticThought ||
    hasEmotions ||
    hasDistortions ||
    hasScores ||
    hasEvidence;

  const handleSaveCopingCard = useCallback(async () => {
    if (cardSaved || isSavingCard || !response.balancedThought?.trim()) return;

    setIsSavingCard(true);
    setCardSaveError(null);

    try {
      await saveCard({
        exercise_type: "thought_reframing",
        reframe_text: response.balancedThought,
        reframe_label: translateCopy("Balanced thought"),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCardSaved(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : translateCopy("The coping card could not be saved.");
      setCardSaveError(translateCopy("Could not save this coping card. Try again."));
      Alert.alert(translateCopy("Save failed"), message);
    } finally {
      setIsSavingCard(false);
    }
  }, [cardSaved, isSavingCard, response.balancedThought, saveCard, translateCopy]);

  return (
    <View className="px-3" style={{ paddingBottom: 40 }}>
      <View className="pb-6 pt-2">
        <ExerciseCopyText
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }}
          className="text-[34px] leading-[37px] tracking-[-0.01em]"
        >
          Thought reframed
        </ExerciseCopyText>
        <ExerciseCopyText
          style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }}
          className="mt-2 max-w-[330px] text-[15px] leading-[22px]"
        >
          You separated what happened from what the thought predicted.
        </ExerciseCopyText>
      </View>

      {response.balancedThought?.trim() ? (
        <View
          className="py-8"
          style={{
            marginHorizontal: -28,
            paddingHorizontal: 28,
            backgroundColor: SEMANTIC_COLORS.selection.surface,
          }}
        >
          <ExerciseCopyText
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.pressed }}
            className="text-[13px] leading-[18px]"
          >
            The reframe you are carrying forward
          </ExerciseCopyText>
          <Text
            accessibilityRole="summary"
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }}
            className="mt-1.5 text-[25px] leading-[33px]"
          >
            {response.balancedThought}
          </Text>

          {!readOnly ? (
            <Pressable
              onPress={handleSaveCopingCard}
              disabled={cardSaved || isSavingCard}
              accessibilityRole="button"
              accessibilityLabel={translateCopy(
                cardSaved
                  ? "Saved to coping cards"
                  : isSavingCard
                    ? "Saving coping card"
                    : "Save as coping card"
              )}
              accessibilityState={{
                disabled: cardSaved || isSavingCard,
                busy: isSavingCard,
              }}
              className="mt-5 min-h-11 flex-row items-center self-start py-2 active:opacity-60"
            >
              <HugeiconsIcon
                icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon}
                size={18}
                color={SEMANTIC_COLORS.brand.onSoft}
                strokeWidth={2}
              />
              <ExerciseCopyText
                style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.onSoft }}
                className="ml-2 text-[14px] leading-[20px]"
              >
                {cardSaved
                  ? "Saved to coping cards"
                  : isSavingCard
                    ? "Saving..."
                    : "Save for a difficult moment"}
              </ExerciseCopyText>
            </Pressable>
          ) : null}

          {cardSaveError ? (
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.error.indicator }}
              className="mt-2 text-[13px] leading-[18px]"
            >
              {cardSaveError}
            </Text>
          ) : null}
        </View>
      ) : null}

      <ThoughtReframingTimeline
        response={response}
        emotions={emotions}
        distortions={distortions}
        preScore={preScore}
        postScore={postScore ?? preScore}
        hasTimeline={hasTimeline}
        hasSituation={hasSituation}
        hasAutomaticThought={hasAutomaticThought}
        hasEmotions={hasEmotions}
        hasDistortions={hasDistortions}
        hasScores={hasScores}
        hasEvidence={hasEvidence}
        hasEvidenceFor={hasEvidenceFor}
        hasEvidenceAgainst={hasEvidenceAgainst}
        evidenceFor={evidenceFor}
        evidenceAgainst={evidenceAgainst}
        shift={shift}
      />
      <ExerciseCopyText
        style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }}
        className="mb-2 mt-10 px-5 text-center text-[13px] leading-[20px]"
      >
        Completing saves this reflection to your exercise history.
      </ExerciseCopyText>
    </View>
  );
};

ThoughtReframingSummary.displayName = "ThoughtReframingSummary";
