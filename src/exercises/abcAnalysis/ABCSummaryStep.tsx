import React, { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
} from "@hugeicons/core-free-icons";

import {
  ThoughtRecordRecap,
  type RecapSection,
} from "@/src/components/exercise/ThoughtRecordRecap";
import { Text } from "@/src/components/ui/Text";
import { EXERCISE_LINKING_MAP } from "@/src/data/exerciseLinkingMap";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import { DANGER, SAGE } from "@/lib/tokens";
import { getABCEmotionDisplayLabels } from "./customSteps";
import type {
  ABCAnalysisResponse,
  ExerciseType,
  StepProps,
} from "@/src/types/exerciseFlow";

function SaveCopingCardAction({
  cardSaved,
  isSavingCard,
  onPress,
  error,
}: {
  cardSaved: boolean;
  isSavingCard: boolean;
  onPress: () => void;
  error: string | null;
}) {
  return (
    <View>
      <Pressable
        onPress={onPress}
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
        className="min-h-11 flex-row items-center self-start py-2 active:opacity-60"
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

      {error ? (
        <Text
          style={{ fontFamily: "GeistMedium", color: DANGER }}
          className="mt-2 text-[13px] leading-[18px]"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function FollowupLink({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="mt-2 min-h-11 flex-row items-center self-start py-2 active:opacity-60"
    >
      <Text
        style={{ fontFamily: "GeistSemiBold", color: SAGE[600] }}
        className="text-[14px] leading-[20px]"
      >
        {label}
      </Text>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        color={SAGE[500]}
        strokeWidth={2}
      />
    </Pressable>
  );
}

function getIntensityShiftCopy(pre: number, post: number): string {
  if (post === pre) {
    return "The intensity did not move much, but you worked through the full chain.";
  }

  return post < pre
    ? "The intensity was lower after you examined the chain."
    : "The intensity was higher after you examined the chain. That can still be useful to notice.";
}

export function ABCSummaryStep({
  response,
  onNext,
  readOnly,
  onNavigateDeeper,
}: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const router = useRouter();
  const { saveCard } = useCopingCards();
  const [cardSaved, setCardSaved] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [cardSaveError, setCardSaveError] = useState<string | null>(null);

  const sections = useMemo<readonly RecapSection[]>(
    () => [
      { label: "What happened", value: response.activatingEvent },
      { label: "Automatic thought", value: response.belief, tone: "serif" },
      {
        label: "How you felt",
        value: getABCEmotionDisplayLabels(response.consequenceEmotion),
      },
      { label: "What you did next", value: response.consequenceBehavior },
      {
        label: "More balanced thought",
        value: response.alternativeBelief,
      },
      { label: "What might change now", value: response.newConsequence },
    ],
    [
      response.activatingEvent,
      response.alternativeBelief,
      response.belief,
      response.consequenceBehavior,
      response.consequenceEmotion,
      response.newConsequence,
    ],
  );

  const handleSaveCopingCard = useCallback(async () => {
    if (
      cardSaved ||
      isSavingCard ||
      !response.alternativeBelief.trim()
    ) {
      return;
    }

    setIsSavingCard(true);
    setCardSaveError(null);

    try {
      await saveCard({
        exercise_type: "abc_analysis",
        reframe_text: response.alternativeBelief,
        reframe_label: "More balanced thought",
      });
      setCardSaved(true);
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      ).catch(() => undefined);
    } catch {
      setCardSaveError("Could not save this coping card. Try again.");
    } finally {
      setIsSavingCard(false);
    }
  }, [cardSaved, isSavingCard, response.alternativeBelief, saveCard]);

  const handleNavigateDeeper = useCallback(
    (type: ExerciseType) => {
      if (onNavigateDeeper) {
        onNavigateDeeper(type);
        return;
      }

      onNext();
      router.push({ pathname: "/tabs/screens/exercise-flow", params: { type } });
    },
    [onNavigateDeeper, onNext, router],
  );

  const afterTimeline = useMemo(() => {
    const link = EXERCISE_LINKING_MAP.abc_analysis;

    return (
      <View>
        {!readOnly ? (
          <SaveCopingCardAction
            cardSaved={cardSaved}
            isSavingCard={isSavingCard}
            onPress={handleSaveCopingCard}
            error={cardSaveError}
          />
        ) : null}

        {link && !readOnly ? (
          <FollowupLink
            label={`Go deeper: ${link.label}`}
            onPress={() => handleNavigateDeeper(link.exerciseType)}
          />
        ) : null}
      </View>
    );
  }, [
    cardSaveError,
    cardSaved,
    handleNavigateDeeper,
    handleSaveCopingCard,
    isSavingCard,
    readOnly,
  ]);

  const preScore = response.preEmotionalIntensity ?? 5;
  const postScore = response.postEmotionalIntensity;

  return (
    <ThoughtRecordRecap
      title="ABC complete"
      subtitle="Here’s the chain you worked through."
      showMascot={false}
      sections={sections}
      preScore={preScore}
      postScore={postScore}
      scoreLabel="Intensity"
      scoreDetail={
        typeof postScore === "number"
          ? getIntensityShiftCopy(preScore, postScore)
          : undefined
      }
      afterTimeline={afterTimeline}
    />
  );
}

ABCSummaryStep.displayName = "ABCSummaryStep";
