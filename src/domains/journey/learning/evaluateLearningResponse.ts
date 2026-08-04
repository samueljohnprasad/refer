import type {
  V1EvaluationResult,
  V1LearningItem,
  V1LearningResponse,
} from "@/src/types/journeyLearning";
import {
  V1EvidenceStrengthEnum,
  V1LearningFormatEnum,
  V1ScenarioMissingPartEnum,
  V1SupportLevelEnum,
} from "@/src/types/journeyLearning";

export function evaluateV1LearningResponse(
  item: V1LearningItem,
  response: V1LearningResponse,
): V1EvaluationResult {
  assertMatchingFormat(item, response);

  const result = evaluateCorrectness(item, response);
  const isQualifying =
    result.isCorrect && response.supportLevel === V1SupportLevelEnum.None;

  return {
    itemId: item.itemId,
    itemVersion: item.itemVersion,
    variantFamilyId: item.variantFamilyId,
    variantId: item.variantId,
    skillId: item.skillId,
    format: item.format,
    category: item.category,
    responseMode: response.responseMode,
    supportLevel: response.supportLevel,
    isCorrect: result.isCorrect,
    isQualifying,
    evidenceStrength: result.isCorrect
      ? isQualifying
        ? V1EvidenceStrengthEnum.Qualifying
        : V1EvidenceStrengthEnum.Supported
      : V1EvidenceStrengthEnum.Incorrect,
    feedbackText: result.isCorrect ? item.feedback.correct : item.feedback.incorrect,
    misconceptionCode: result.misconceptionCode,
    missingPart: result.missingPart,
  };
}

function evaluateCorrectness(
  item: V1LearningItem,
  response: V1LearningResponse,
): Pick<V1EvaluationResult, "isCorrect" | "misconceptionCode" | "missingPart"> {
  switch (item.format) {
    case V1LearningFormatEnum.GuidedRecall:
      return {
        isCorrect:
          response.format === V1LearningFormatEnum.GuidedRecall &&
          sameOrderedIds(response.selectedChipIds, item.answerChipIds),
      };
    case V1LearningFormatEnum.ScenarioWhy: {
      if (response.format !== V1LearningFormatEnum.ScenarioWhy) {
        return { isCorrect: false, missingPart: V1ScenarioMissingPartEnum.Both };
      }

      const situationCorrect =
        response.selectedSituationId === item.correctSituationId;
      const reasonCorrect = response.selectedReasonId === item.correctReasonId;

      return {
        isCorrect: situationCorrect && reasonCorrect,
        missingPart: getMissingScenarioPart(situationCorrect, reasonCorrect),
      };
    }
    case V1LearningFormatEnum.CloseDiscrimination: {
      if (response.format !== V1LearningFormatEnum.CloseDiscrimination) {
        return { isCorrect: false };
      }

      const selected = item.options.find(
        (option) => option.id === response.selectedOptionId,
      );

      return {
        isCorrect: response.selectedOptionId === item.correctOptionId,
        misconceptionCode:
          response.selectedOptionId === item.correctOptionId
            ? undefined
            : selected?.misconceptionCode,
      };
    }
  }
}

function assertMatchingFormat(
  item: V1LearningItem,
  response: V1LearningResponse,
): void {
  if (item.format !== response.format) {
    throw new Error("Response format does not match item format");
  }
}

function sameOrderedIds(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function getMissingScenarioPart(
  situationCorrect: boolean,
  reasonCorrect: boolean,
): V1ScenarioMissingPartEnum | undefined {
  if (situationCorrect && reasonCorrect) {
    return undefined;
  }

  if (!situationCorrect && !reasonCorrect) {
    return V1ScenarioMissingPartEnum.Both;
  }

  return situationCorrect
    ? V1ScenarioMissingPartEnum.Reason
    : V1ScenarioMissingPartEnum.Situation;
}
