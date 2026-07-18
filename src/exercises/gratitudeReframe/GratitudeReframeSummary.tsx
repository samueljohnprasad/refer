import React, { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
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
import { DANGER, INK_SOFT, SAGE } from "@/lib/tokens";
import { getGratitudePromptLabel } from "./promptMetadata";
import type {
  GratitudeReframeResponse,
  StepProps,
} from "@/src/types/exerciseFlow";

export function getMoodShiftInterpretation(
  pre: number,
  post: number,
): string {
  if (post === pre) {
    return "The feeling did not move much, but the record still matters.";
  }

  return post > pre
    ? "Your mood intensity was higher after naming what mattered."
    : "Your mood intensity was lower after naming what mattered.";
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

export function GratitudeReframeSummary({
  response,
  readOnly,
  onNavigateDeeper,
}: StepProps<GratitudeReframeResponse>): React.JSX.Element {
  const { saveCard } = useCopingCards();
  const [cardSaved, setCardSaved] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [cardSaveError, setCardSaveError] = useState<string | null>(null);

  const promptLabel = response.selectedPrompt
    ? getGratitudePromptLabel(response.selectedPrompt)
    : "Reflection";
  const sections = useMemo<readonly RecapSection[]>(
    () => [
      { label: "Gratitude direction", value: promptLabel, tone: "serif" },
      { label: "What you named", value: response.gratitudeEntries },
      {
        label: "Mood intensity",
        value: [
          `Before ${response.moodIntensity}/10`,
          `After ${response.finalMoodIntensity}/10`,
        ],
      },
    ],
    [promptLabel, response.finalMoodIntensity, response.gratitudeEntries, response.moodIntensity],
  );

  const handleSaveCopingCard = useCallback(async () => {
    if (
      cardSaved ||
      isSavingCard ||
      response.gratitudeEntries.length === 0
    ) {
      return;
    }

    setIsSavingCard(true);
    setCardSaveError(null);

    try {
      await saveCard({
        exercise_type: "gratitude_reframe",
        reframe_text: response.gratitudeEntries.join("\n"),
        reframe_label: "Gratitude reflection",
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
  }, [cardSaved, isSavingCard, response.gratitudeEntries, saveCard]);

  const afterTimeline = useMemo(() => {
    const link = EXERCISE_LINKING_MAP.gratitude_reframe;

    return (
      <View>
        <Text
          style={{ fontFamily: "GeistRegular", color: INK_SOFT }}
          className="text-[14px] leading-[20px]"
        >
          {getMoodShiftInterpretation(
            response.moodIntensity,
            response.finalMoodIntensity,
          )}
        </Text>

        {!readOnly ? (
          <SaveCopingCardAction
            cardSaved={cardSaved}
            isSavingCard={isSavingCard}
            onPress={handleSaveCopingCard}
            error={cardSaveError}
          />
        ) : null}

        {link && !readOnly && onNavigateDeeper ? (
          <FollowupLink
            label={`Go deeper: ${link.label}`}
            onPress={() => onNavigateDeeper(link.exerciseType)}
          />
        ) : null}
      </View>
    );
  }, [
    cardSaveError,
    cardSaved,
    handleSaveCopingCard,
    isSavingCard,
    onNavigateDeeper,
    readOnly,
    response.finalMoodIntensity,
    response.moodIntensity,
  ]);

  return (
    <ThoughtRecordRecap
      title="Gratitude noted"
      subtitle="Here is what you named and how your mood changed."
      showMascot={false}
      sections={sections}
      afterTimeline={afterTimeline}
    />
  );
}

GratitudeReframeSummary.displayName = "GratitudeReframeSummary";
