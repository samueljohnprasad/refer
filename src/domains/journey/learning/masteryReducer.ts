import { scheduleNextV1Review } from "@/src/domains/journey/learning/reviewScheduler";
import {
  V1LearningFormatEnum,
  V1ReadinessStageEnum,
} from "@/src/types/journeyLearning";
import type {
  V1SkillEvidence,
  V1SkillMastery,
} from "@/src/types/journeyLearning";

const READY_SEPARATION_HOURS = 20;

export function createV1SkillMastery(skillId: string): V1SkillMastery {
  return {
    skillId,
    stage: V1ReadinessStageEnum.Introduced,
    needsReview: false,
    qualifyingAttempts: [],
    readyAt: null,
    nextReviewAt: null,
  };
}

export function reduceV1SkillMastery(
  mastery: V1SkillMastery,
  evidence: V1SkillEvidence,
): V1SkillMastery {
  if (mastery.skillId !== evidence.skillId) {
    return mastery;
  }

  if (!evidence.isCorrect) {
    return {
      ...mastery,
      needsReview: mastery.stage !== V1ReadinessStageEnum.Introduced,
      nextReviewAt: scheduleNextV1Review(evidence.occurredAt, 1),
    };
  }

  if (!evidence.isQualifying) {
    return {
      ...mastery,
      stage:
        mastery.stage === V1ReadinessStageEnum.Introduced
          ? V1ReadinessStageEnum.Practising
          : mastery.stage,
    };
  }

  const qualifyingAttempts = addUniqueEvidence(
    mastery.qualifyingAttempts,
    evidence,
  );
  const ready = qualifiesForReady(qualifyingAttempts);

  return {
    ...mastery,
    stage: ready ? V1ReadinessStageEnum.Ready : V1ReadinessStageEnum.Practising,
    needsReview: ready ? false : mastery.needsReview,
    qualifyingAttempts,
    readyAt: ready ? mastery.readyAt ?? evidence.occurredAt : mastery.readyAt,
    nextReviewAt: ready
      ? scheduleNextV1Review(evidence.occurredAt, 1)
      : mastery.nextReviewAt,
  };
}

function addUniqueEvidence(
  attempts: V1SkillEvidence[],
  evidence: V1SkillEvidence,
): V1SkillEvidence[] {
  const exists = attempts.some(
    (attempt) =>
      attempt.variantFamilyId === evidence.variantFamilyId &&
      attempt.variantId === evidence.variantId &&
      attempt.occurredAt === evidence.occurredAt,
  );

  return exists ? attempts : [...attempts, evidence];
}

function qualifiesForReady(attempts: V1SkillEvidence[]): boolean {
  if (attempts.length < 2) {
    return false;
  }

  const sorted = [...attempts].sort(
    (left, right) =>
      Date.parse(left.occurredAt) - Date.parse(right.occurredAt),
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const elapsedHours =
    (Date.parse(last.occurredAt) - Date.parse(first.occurredAt)) /
    (1000 * 60 * 60);
  const hasChangedScenario = attempts.some(
    (attempt) => attempt.format === V1LearningFormatEnum.ScenarioWhy,
  );

  return elapsedHours >= READY_SEPARATION_HOURS && hasChangedScenario;
}
