import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { DynamicSummary } from "@/src/components/exercise/DynamicSummary";
import { EXERCISE_LINKING_MAP } from "@/src/data/exerciseLinkingMap";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import type { ExerciseType, StepProps } from "@/src/types/exerciseFlow";

interface DynamicSummaryStepOpts {
  title: string;
  celebrationEmoji?: string;
  preScoreKey?: string;
  postScoreKey?: string;
  scoreLabel?: string;
  scoreMax?: number;
  keyTakeawayKey?: string;
  keyTakeawayLabel?: string;
  exerciseType: ExerciseType;
}

/**
 * Factory: creates a DynamicSummary step bound to specific response fields.
 * Automatically wires exercise linking from EXERCISE_LINKING_MAP.
 */
export function createDynamicSummaryStep(
  opts: DynamicSummaryStepOpts,
): React.ComponentType<StepProps<any>> {
  const link = EXERCISE_LINKING_MAP[opts.exerciseType];

  const Wrapped: React.FC<StepProps<any>> = ({
    response,
    onNext,
    onBack,
    isSaving,
    readOnly,
  }) => {
    const router = useRouter();
    const { saveCard } = useCopingCards();
    const [cardSaved, setCardSaved] = useState(false);

    const preScore =
      opts.preScoreKey != null
        ? (response as any)[opts.preScoreKey]
        : undefined;
    const postScore =
      opts.postScoreKey != null
        ? (response as any)[opts.postScoreKey]
        : undefined;
    const rawTakeaway =
      opts.keyTakeawayKey != null
        ? (response as any)[opts.keyTakeawayKey]
        : undefined;
    const keyTakeaway: string | undefined = Array.isArray(rawTakeaway)
      ? rawTakeaway[0]
      : rawTakeaway;

    const handleNavigateToExercise = useCallback(
      (type: ExerciseType) => {
        onNext();
        router.push({
          pathname: "/tabs/screens/exercise-flow",
          params: { type },
        });
      },
      [onNext, router],
    );

    const handleSaveCopingCard = useCallback(async () => {
      if (cardSaved || !keyTakeaway?.trim()) return;
      await saveCard({
        exercise_type: opts.exerciseType,
        reframe_text: keyTakeaway,
        reframe_label: opts.keyTakeawayLabel ?? "Your reframe",
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCardSaved(true);
    }, [cardSaved, keyTakeaway, saveCard]);

    // Only show the save button for exercises that produce a text takeaway
    const showSaveButton =
      !readOnly && !!opts.keyTakeawayKey && !!keyTakeaway?.trim();

    return (
      <DynamicSummary
        title={opts.title}
        celebrationEmoji={opts.celebrationEmoji}
        preScore={preScore}
        postScore={postScore}
        scoreLabel={opts.scoreLabel ?? "Intensity"}
        scoreMax={opts.scoreMax ?? 10}
        keyTakeaway={keyTakeaway}
        keyTakeawayLabel={opts.keyTakeawayLabel}
        nextExerciseType={link?.exerciseType}
        nextExerciseLabel={link?.label}
        onNavigateToExercise={handleNavigateToExercise}
        onSaveCopingCard={showSaveButton ? handleSaveCopingCard : undefined}
        cardSaved={cardSaved}
        onComplete={onNext}
        onEdit={onBack}
        isSaving={isSaving}
        readOnly={readOnly}
      />
    );
  };

  Wrapped.displayName = `DynamicSummaryStep(${opts.exerciseType})`;
  return React.memo(Wrapped) as React.ComponentType<StepProps<any>>;
}
