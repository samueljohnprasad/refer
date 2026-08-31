import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
} from "@hugeicons/core-free-icons";

import { ThoughtRecordRecap } from "@/src/components/exercise/ThoughtRecordRecap";
import { Text } from "@/src/components/ui/Text";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import { EXERCISE_LINKING_MAP } from "@/src/data/exerciseLinkingMap";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import type {
  ExerciseType,
  StepProps,
  ThoughtCatcherResponse,
} from "@/src/types/exerciseFlow";

const REALITY_LABELS: Record<NonNullable<ThoughtCatcherResponse["isTrue"]>, string> =
  {
    YES: "Yes, it still feels true",
    "NOT SURE": "Not sure yet",
    NO: "No, it does not fully hold up",
  };

function getShiftCopy(pre: number, post: number): string {
  const change = pre - post;

  if (change < 0) {
    return "The thought feels stronger right now. Looking at it still counts.";
  }

  if (change === 0) {
    return "The score stayed steady, but you still paused and checked it.";
  }

  if (change >= 4) {
    return "The thought feels meaningfully less believable now.";
  }

  return "Even a small shift matters. You made room for another view.";
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
      className="min-h-11 flex-row items-center justify-center py-2 active:opacity-70"
    >
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.pressed }}
        className="text-[14px] leading-[20px]"
      >
        {label}
      </Text>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        color={SEMANTIC_COLORS.brand.primary}
        strokeWidth={2}
      />
    </Pressable>
  );
}

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
        className="mt-5 min-h-11 flex-row items-center self-start py-2 active:opacity-60"
      >
        <HugeiconsIcon
          icon={cardSaved ? BookmarkCheck01Icon : BookmarkAdd01Icon}
          size={18}
          color={SEMANTIC_COLORS.brand.onSoft}
          strokeWidth={2}
        />
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.onSoft }}
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
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.error.indicator }}
          className="mt-2 text-[13px] leading-[18px]"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export const ThoughtCatcherCheckpointSummary: React.FC<
  StepProps<ThoughtCatcherResponse>
> = ({ response }) => {
  return (
    <ThoughtRecordRecap
      title="Thought caught"
      subtitle="Here is what you have so far."
      showMascot={false}
      situation={response.situation}
      automaticThought={response.automaticThought}
      preScore={response.intensity}
      scoreLabel="Belief intensity"
    />
  );
};

export const ThoughtCatcherSummary: React.FC<
  StepProps<ThoughtCatcherResponse>
> = ({ response, readOnly, onNavigateDeeper }) => {
  const { saveCard } = useCopingCards();
  const [cardSaved, setCardSaved] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [cardSaveError, setCardSaveError] = useState<string | null>(null);

  const link = EXERCISE_LINKING_MAP["thought_catcher"];
  const realityCheckLabel = response.isTrue ? REALITY_LABELS[response.isTrue] : undefined;
  const scoreDetail =
    typeof response.postIntensity === "number"
      ? getShiftCopy(response.intensity, response.postIntensity)
      : undefined;

  const handleSaveCopingCard = useCallback(async () => {
    if (cardSaved || isSavingCard || !response.balancedThought?.trim()) return;

    setIsSavingCard(true);
    setCardSaveError(null);

    try {
      await saveCard({
        exercise_type: "thought_catcher",
        reframe_text: response.balancedThought,
        reframe_label: "Balanced thought",
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCardSaved(true);
    } catch {
      setCardSaveError("Could not save this coping card. Try again.");
    } finally {
      setIsSavingCard(false);
    }
  }, [cardSaved, isSavingCard, response.balancedThought, saveCard]);

  const handleNavigateDeeper = useCallback(
    (type: ExerciseType) => {
      onNavigateDeeper?.(type);
    },
    [onNavigateDeeper],
  );

  const highlightAction = useMemo(() => {
    if (readOnly || !response.balancedThought?.trim()) return undefined;

    return (
      <SaveCopingCardAction
        cardSaved={cardSaved}
        isSavingCard={isSavingCard}
        onPress={handleSaveCopingCard}
        error={cardSaveError}
      />
    );
  }, [
    cardSaved,
    cardSaveError,
    handleSaveCopingCard,
    isSavingCard,
    readOnly,
    response.balancedThought,
  ]);

  const afterTimeline = useMemo(() => {
    if (!link || readOnly || !onNavigateDeeper) return undefined;

    return (
      <FollowupLink
        label={`Go deeper: ${link.label}`}
        onPress={() => handleNavigateDeeper(link.exerciseType)}
      />
    );
  }, [handleNavigateDeeper, link, onNavigateDeeper, readOnly]);

  return (
    <ThoughtRecordRecap
      title="Thought checked"
      subtitle="Here is what you worked through."
      showMascot={false}
      highlightLabel="The thought you are carrying forward"
      highlightText={response.balancedThought}
      highlightAction={highlightAction}
      situation={response.situation}
      automaticThought={response.automaticThought}
      preScore={response.intensity}
      postScore={response.postIntensity}
      scoreLabel="Belief intensity"
      scoreDetail={scoreDetail}
      realityCheckLabel={realityCheckLabel}
      balancedThought={response.balancedThought}
      afterTimeline={afterTimeline}
    />
  );
};

ThoughtCatcherCheckpointSummary.displayName = "ThoughtCatcherCheckpointSummary";
ThoughtCatcherSummary.displayName = "ThoughtCatcherSummary";
