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
import { DANGER, INK, INK_SOFT, SAGE } from "@/lib/tokens";
import {
  EMOTION_OPTIONS,
  type EmotionOption,
} from "@/src/screens/ThoughtReframingScreen/data/emotions";
import { COGNITIVE_DISTORTIONS } from "@/src/screens/ThoughtReframingScreen/data/cognitiveDistortions";
import { useCopingCards } from "@/src/hooks/useCopingCards";
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
  label: string;
  detail: string;
  color: string;
} {
  const change = pre - post;

  if (change < 0) {
    return {
      label: `${Math.abs(change)} point${Math.abs(change) === 1 ? "" : "s"} stronger`,
      detail:
        "The thought feels more believable right now. Looking closely can sometimes make a difficult thought feel sharper before it settles.",
      color: INK,
    };
  }

  if (change === 0) {
    return {
      label: "No score change",
      detail:
        "The score stayed steady, but you still practiced testing the thought instead of accepting it automatically.",
      color: INK,
    };
  }

  return {
    label: `${change} point${change === 1 ? "" : "s"} lighter`,
    detail:
      change >= 4
        ? "The thought became meaningfully less believable after you reviewed the evidence."
        : "Even a small shift matters. You made room for a more balanced interpretation.",
    color: SAGE[700],
  };
}

export const ThoughtReframingSummary: React.FC<
  StepProps<ThoughtReframingResponse>
> = ({ response, readOnly }) => {
  const { saveCard } = useCopingCards();
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
  const shift = hasScores ? getShiftCopy(preScore, postScore) : null;
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
        reframe_label: "Balanced thought",
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCardSaved(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The coping card could not be saved.";
      setCardSaveError("Could not save this coping card. Try again.");
      Alert.alert("Save failed", message);
    } finally {
      setIsSavingCard(false);
    }
  }, [cardSaved, isSavingCard, response.balancedThought, saveCard]);

  return (
    <View className="px-3" style={{ paddingBottom: 40 }}>
      <View className="pb-6 pt-2">
        <Text
          style={{ fontFamily: "CormorantSemiBold", color: INK }}
          className="text-[34px] leading-[37px] tracking-[-0.01em]"
        >
          Thought reframed
        </Text>
        <Text
          style={{ fontFamily: "GeistRegular", color: INK_SOFT }}
          className="mt-2 max-w-[330px] text-[15px] leading-[22px]"
        >
          You separated what happened from what the thought predicted.
        </Text>
      </View>

      {response.balancedThought?.trim() ? (
        <View
          className="py-8"
          style={{
            marginHorizontal: -28,
            paddingHorizontal: 28,
            backgroundColor: SAGE[50],
          }}
        >
          <Text
            style={{ fontFamily: "GeistMedium", color: SAGE[600] }}
            className="text-[13px] leading-[18px]"
          >
            The reframe you are carrying forward
          </Text>
          <Text
            accessibilityRole="summary"
            style={{ fontFamily: "CormorantMedium", color: INK }}
            className="mt-1.5 text-[25px] leading-[33px]"
          >
            {response.balancedThought}
          </Text>

          {!readOnly ? (
            <Pressable
              onPress={handleSaveCopingCard}
              disabled={cardSaved || isSavingCard}
              accessibilityRole="button"
              accessibilityLabel={
                cardSaved
                  ? "Saved to coping cards"
                  : isSavingCard
                    ? "Saving coping card"
                    : "Save as coping card"
              }
              accessibilityState={{
                disabled: cardSaved || isSavingCard,
                busy: isSavingCard,
              }}
              className="mt-5 min-h-11 flex-row items-center self-start py-2 active:opacity-60"
            >
              <HugeiconsIcon
                icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon}
                size={18}
                color={SAGE[700]}
                strokeWidth={2}
              />
              <Text
                style={{ fontFamily: "GeistSemiBold", color: SAGE[700] }}
                className="ml-2 text-[14px] leading-[20px]"
              >
                {cardSaved
                  ? "Saved to coping cards"
                  : isSavingCard
                    ? "Saving..."
                    : "Save for a difficult moment"}
              </Text>
            </Pressable>
          ) : null}

          {cardSaveError ? (
            <Text
              style={{ fontFamily: "GeistMedium", color: DANGER }}
              className="mt-2 text-[13px] leading-[18px]"
            >
              {cardSaveError}
            </Text>
          ) : null}
        </View>
      ) : null}

      {hasTimeline ? (
        <View className="mt-7">
          <ReflectionTimeline>
            {hasSituation ? (
              <ReflectionTimelineItem
                label="What happened"
                isLast={
                  !hasAutomaticThought &&
                  !hasEmotions &&
                  !hasDistortions &&
                  !hasScores &&
                  !hasEvidence
                }
              >
                <Text
                  style={{ fontFamily: "GeistRegular", color: INK }}
                  className="text-[16px] leading-[24px]"
                >
                  {response.situation}
                </Text>
              </ReflectionTimelineItem>
            ) : null}

            {hasAutomaticThought ? (
              <ReflectionTimelineItem
                label="The first thought"
                isLast={
                  !hasEmotions &&
                  !hasDistortions &&
                  !hasScores &&
                  !hasEvidence
                }
              >
                <Text
                  style={{ fontFamily: "CormorantMediumItalic", color: INK }}
                  className="text-[21px] leading-[28px]"
                >
                  {response.automaticThought}
                </Text>
              </ReflectionTimelineItem>
            ) : null}

            {hasEmotions ? (
              <ReflectionTimelineItem
                label="What you felt"
                isLast={!hasDistortions && !hasScores && !hasEvidence}
              >
                <View className="flex-row flex-wrap gap-x-4 gap-y-1.5">
                  {emotions.map((emotion) => (
                    <View key={emotion.name} className="flex-row items-center">
                      <Text className="mr-1.5 text-[17px]">
                        {emotion.emoji}
                      </Text>
                      <Text
                        style={{ fontFamily: "GeistMedium", color: INK }}
                        className="text-[14px] leading-[20px]"
                      >
                        {emotion.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </ReflectionTimelineItem>
            ) : null}

            {hasDistortions ? (
              <ReflectionTimelineItem
                label="Patterns you noticed"
                isLast={!hasScores && !hasEvidence}
              >
                <View className="gap-4">
                  {distortions.map((distortion) => (
                    <View key={distortion.key}>
                      <Text
                        style={{ fontFamily: "GeistSemiBold", color: INK }}
                        className="text-[15px] leading-[21px]"
                      >
                        {distortion.label}
                      </Text>
                      <Text
                        style={{ fontFamily: "GeistRegular", color: INK_SOFT }}
                        className="mt-0.5 text-[13px] leading-[19px]"
                      >
                        {distortion.description}
                      </Text>
                    </View>
                  ))}
                </View>
              </ReflectionTimelineItem>
            ) : null}

            {hasScores && shift ? (
              <ReflectionTimelineItem
                label="How believable it felt"
                isLast={!hasEvidence}
              >
                <ReflectionScoreShift
                  before={preScore}
                  after={postScore}
                  label={shift.label}
                  detail={shift.detail}
                  accentColor={shift.color}
                />
              </ReflectionTimelineItem>
            ) : null}

            {hasEvidenceFor ? (
              <ReflectionTimelineItem
                label="Evidence that supported it"
                isLast={!hasEvidenceAgainst}
              >
                <ReflectionBulletList
                  items={evidenceFor}
                  accentColor="#8A948A"
                />
              </ReflectionTimelineItem>
            ) : null}

            {hasEvidenceAgainst ? (
              <ReflectionTimelineItem
                label="Evidence that challenged it"
                isLast
              >
                <ReflectionBulletList items={evidenceAgainst} />
              </ReflectionTimelineItem>
            ) : null}
          </ReflectionTimeline>
        </View>
      ) : null}

      <Text
        style={{ fontFamily: "GeistRegular", color: INK_SOFT }}
        className="mb-2 mt-10 px-5 text-center text-[13px] leading-[20px]"
      >
        Completing saves this reflection to your exercise history.
      </Text>
    </View>
  );
};

ThoughtReframingSummary.displayName = "ThoughtReframingSummary";
