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
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useTranslation } from "react-i18next";
import {
  EMOTION_OPTIONS,
  type EmotionOption,
} from "@/src/screens/ThoughtReframingScreen/data/emotions";
import { COGNITIVE_DISTORTIONS } from "@/src/screens/ThoughtReframingScreen/data/cognitiveDistortions";
import { Feather } from "@expo/vector-icons";
import { ThoughtSky } from "@/src/domains/exercises/ui/presentation/components/ReframingArt";
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
      color: "#29452a",
    };
  }

  if (change === 0) {
    return {
      label: "No score change",
      detail:
        "The score stayed steady, but you still practiced testing the thought instead of accepting it automatically.",
      color: "#29452a",
    };
  }

  return {
      labelKey: "flow.ui.scoreShiftLighter",
      labelCount: change,
    detail:
      change >= 4
        ? "The thought became meaningfully less believable after you reviewed the evidence."
        : "Even a small shift matters. You made room for a more balanced interpretation.",
    color: "#44633f",
  };
}

// honest copy: only call it lighter if the number actually went down (.agents/thought-reframing.html)
function getVerdict(pre: number, post: number, hadEvidence: boolean): { title: string; line: string } {
  const diff = pre - post;
  if (diff > 0) return { title: "It weighs less than it did.", line: `From ${pre} to ${post} out of 10${hadEvidence ? ", once the facts were on the table" : ""}.` };
  if (diff === 0) return { title: "It feels about the same, and that’s okay.", line: "Some thoughts take more than one look. You still tested it instead of taking it on trust." };
  return { title: "It feels heavier right now.", line: "Looking closely can stir a thought up before it settles. Coming back to it later can help." };
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
  const [answersOpen, setAnswersOpen] = useState(false);
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

  const balanced = response.balancedThought?.trim() ?? "";
  const verdict = getVerdict(preScore, postScore ?? preScore, evidenceFor.length + evidenceAgainst.length > 0);

  return (
    <View className="px-3" style={{ paddingBottom: 40 }}>
      <View className="pb-4 pt-2">
        <Text className="font-display text-t-h leading-[28px] tracking-tight text-happy-label">{verdict.title}</Text>
        <Text className="mt-2 text-t-sub font-semibold leading-[22px] text-happy-label-2">{verdict.line}</Text>
      </View>

      <View className="rounded-3xl bg-[#f6ecd8] px-3 pt-3 pb-6" accessibilityLabel="Your reframe">
        <View className="flex-row items-center gap-1">
          <View className="flex-1 overflow-hidden rounded-2xl">
            <ThoughtSky value={preScore} />
            <Text className="text-center text-t-foot font-bold text-happy-label-2 pt-1">Before <Text className="font-display text-t-h text-happy-label">{preScore}</Text></Text>
          </View>
          <Feather name="arrow-right" size={20} color="#4b4b4b" />
          <View className="flex-1 overflow-hidden rounded-2xl">
            <ThoughtSky value={postScore ?? preScore} />
            <Text className="text-center text-t-foot font-bold text-happy-label-2 pt-1">Now <Text className="font-display text-t-h text-happy-label">{postScore ?? preScore}</Text></Text>
          </View>
        </View>
        <Text className="mx-2 mt-6 text-t-foot font-bold text-happy-label-2">
          {balanced ? "A fairer way to see it" : "Your fairer version"}
        </Text>
        {balanced ? (
          <Text accessibilityRole="summary" className="mx-2 mt-1 font-display text-t-title leading-[32px] tracking-tight text-happy-label">
            {balanced}
          </Text>
        ) : (
          <Text className="mx-2 mt-1 text-t-body font-bold text-happy-label-2">
            Not written yet. You can add it with “Edit answers”.
          </Text>
        )}
        {response.automaticThought?.trim() ? (
          <Text className="mx-2 mt-3 text-t-sub font-semibold text-happy-label-2">
            Instead of: “{response.automaticThought.trim()}”
          </Text>
        ) : null}

        {balanced && !readOnly ? (
          <Pressable
            onPress={handleSaveCopingCard}
            disabled={cardSaved || isSavingCard}
            accessibilityRole="button"
            accessibilityLabel={translateCopy(cardSaved ? "Saved to coping cards" : isSavingCard ? "Saving coping card" : "Save as coping card")}
            accessibilityState={{ disabled: cardSaved || isSavingCard, busy: isSavingCard }}
            className="mx-2 mt-4 min-h-11 flex-row items-center self-start py-2 active:opacity-60"
          >
            <HugeiconsIcon icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon} size={18} color="#44633f" strokeWidth={2} />
            <Text className="ml-2 text-t-sub font-bold text-happy-accent">
              {cardSaved ? "Saved to coping cards" : isSavingCard ? "Saving..." : "Save for a difficult moment"}
            </Text>
          </Pressable>
        ) : null}
        {cardSaveError ? <Text className="mx-2 mt-2 text-t-foot font-semibold text-happy-label-2">{cardSaveError}</Text> : null}
      </View>

      <Pressable
        onPress={() => setAnswersOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: answersOpen }}
        className="mt-6 min-h-[52px] flex-row items-center justify-between rounded-2xl bg-happy-surface-2 px-4"
      >
        <Text className="text-t-body font-extrabold text-happy-label">See your answers</Text>
        <Feather name={answersOpen ? "chevron-up" : "chevron-down"} size={20} color="#142414" />
      </Pressable>
      {answersOpen ? (
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
      ) : null}
      <Text className="mt-6 px-5 text-center text-t-foot font-semibold text-happy-label-2">
        Saving keeps this in your exercise history, in your own words.
      </Text>
    </View>
  );
};

ThoughtReframingSummary.displayName = "ThoughtReframingSummary";
