import React from "react";
import { useTranslation } from "react-i18next";
import { LessonCompleteCelebration } from "@/src/components/celebration/LessonCompleteCelebration";
import {
  LESSON_BASE_XP,
  PERFECT_LESSON_BONUS_XP,
} from "@/src/domains/journey/rewards/lessonStats";
import { CelebrationLevel } from "@/src/types/journeyV5";
import type { JourneyMapViewModel } from "../hooks/useJourneyMapViewModel";

interface JourneyLessonCelebrationProps {
  celebration: JourneyMapViewModel["controller"]["pendingCelebration"];
  onContinue: () => void;
}

export function JourneyLessonCelebration({
  celebration,
  onContinue,
}: JourneyLessonCelebrationProps): React.JSX.Element | null {
  const { t } = useTranslation("journeys");

  if (celebration?.level !== CelebrationLevel.LESSON) return null;

  const takeaway = celebration.content.takeaway === "You showed up for yourself today."
    ? t("defaultLessonTakeaway")
    : celebration.content.takeaway;
  const primaryActionLabel = celebration.content.primaryActionLabel;

  return (
    <LessonCompleteCelebration
      isVisible
      xpEarned={LESSON_BASE_XP}
      bonusXP={PERFECT_LESSON_BONUS_XP}
      isPerfect={celebration.stats?.isPerfect ?? false}
      durationMs={celebration.stats?.durationMs}
      lessonTitle={celebration.content.title}
      title={t("lessonComplete")}
      message={takeaway}
      continueLabel={primaryActionLabel && primaryActionLabel !== "Continue" ? primaryActionLabel : t("continue")}
      onContinue={onContinue}
    />
  );
}
