import type {
  V1CloseDiscriminationItem,
  V1ExerciseCategory,
  V1GuidedRecallItem,
  V1LearningFormat,
  V1LearningItem,
  V1ScenarioWhyItem,
} from "@/src/types/journeyLearning";
import {
  V1ExerciseCategoryEnum,
  V1LearningFormatEnum,
} from "@/src/types/journeyLearning";

export interface V1LearningItemValidation {
  ok: boolean;
  errors: string[];
}

const formatCategory: Record<V1LearningFormat, V1ExerciseCategory> = {
  [V1LearningFormatEnum.GuidedRecall]: V1ExerciseCategoryEnum.Recall,
  [V1LearningFormatEnum.ScenarioWhy]: V1ExerciseCategoryEnum.Scenario,
  [V1LearningFormatEnum.CloseDiscrimination]: V1ExerciseCategoryEnum.Discrimination,
};

export function getV1ExerciseCategory(
  format: V1LearningFormat,
): V1ExerciseCategory {
  return formatCategory[format];
}

export function validateV1LearningItem(
  item: V1LearningItem,
): V1LearningItemValidation {
  const errors: string[] = [];

  requireText(errors, item.skillId, "skillId");
  requireText(errors, item.itemId, "itemId");
  requireText(errors, item.variantFamilyId, "variantFamilyId");
  requireText(errors, item.variantId, "variantId");
  requireText(errors, item.prompt, "prompt");

  if (!Number.isInteger(item.itemVersion) || item.itemVersion < 1) {
    errors.push("itemVersion must be a positive integer");
  }

  if (item.category !== formatCategory[item.format]) {
    errors.push("category must match format");
  }

  if (![1, 2, 3].includes(item.difficulty)) {
    errors.push("difficulty must be 1, 2, or 3");
  }

  requireText(errors, item.feedback.correct, "feedback.correct");
  requireText(errors, item.feedback.incorrect, "feedback.incorrect");
  requireText(errors, item.feedback.workedAnswer, "feedback.workedAnswer");
  requireText(errors, item.support.clue, "support.clue");
  requireText(errors, item.support.easier, "support.easier");
  requireText(errors, item.support.workedAnswer, "support.workedAnswer");

  switch (item.format) {
    case V1LearningFormatEnum.GuidedRecall:
      validateGuidedRecall(errors, item);
      break;
    case V1LearningFormatEnum.ScenarioWhy:
      validateScenarioWhy(errors, item);
      break;
    case V1LearningFormatEnum.CloseDiscrimination:
      validateCloseDiscrimination(errors, item);
      break;
  }

  return { ok: errors.length === 0, errors };
}

function validateGuidedRecall(
  errors: string[],
  item: V1GuidedRecallItem,
): void {
  const chipIds = new Set(item.chips.map((chip) => chip.id));

  if (item.chips.length < 2) {
    errors.push("guided_recall needs at least two chips");
  }

  item.chips.forEach((chip, index) => {
    requireText(errors, chip.id, `chips.${index}.id`);
    requireText(errors, chip.text, `chips.${index}.text`);
  });

  if (item.answerChipIds.length === 0) {
    errors.push("guided_recall needs answerChipIds");
  }

  item.answerChipIds.forEach((chipId) => {
    if (!chipIds.has(chipId)) {
      errors.push(`answerChipIds contains unknown chip '${chipId}'`);
    }
  });
}

function validateScenarioWhy(
  errors: string[],
  item: V1ScenarioWhyItem,
): void {
  const situationIds = new Set(item.situationOptions.map((option) => option.id));
  const reasonIds = new Set(item.reasonOptions.map((option) => option.id));

  if (item.situationOptions.length < 2 || item.situationOptions.length > 3) {
    errors.push("scenario_why needs two or three situation options");
  }

  if (item.reasonOptions.length < 2 || item.reasonOptions.length > 3) {
    errors.push("scenario_why needs two or three reason options");
  }

  if (!situationIds.has(item.correctSituationId)) {
    errors.push("correctSituationId must reference a situation option");
  }

  if (!reasonIds.has(item.correctReasonId)) {
    errors.push("correctReasonId must reference a reason option");
  }
}

function validateCloseDiscrimination(
  errors: string[],
  item: V1CloseDiscriminationItem,
): void {
  const optionIds = new Set(item.options.map((option) => option.id));

  if (item.options.length < 2 || item.options.length > 3) {
    errors.push("close_discrimination needs two or three options");
  }

  if (!optionIds.has(item.correctOptionId)) {
    errors.push("correctOptionId must reference an option");
  }

  item.options.forEach((option) => {
    if (option.id !== item.correctOptionId && !option.misconceptionCode) {
      errors.push("each distractor needs a misconceptionCode");
    }
  });
}

function requireText(errors: string[], value: string, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${field} is required`);
  }
}
