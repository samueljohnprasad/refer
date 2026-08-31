import { BreathingRoundCategoryEngine } from "@/src/components/exercise/BreathingRoundCategoryEngine";
import { ConceptInsightCategoryEngine } from "@/src/components/exercise/ConceptInsightCategoryEngine";
import { EvidenceBiteCategoryEngine } from "@/src/components/exercise/EvidenceBiteCategoryEngine";
import { SurgeTimerCategoryEngine } from "@/src/components/exercise/SurgeTimerCategoryEngine";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export const EIGHTH_BATCH_CATEGORY_CONFIGS = {
  [CourseExerciseCategoryEnum.EvidenceBite]: createConfig(
    CourseExerciseCategoryEnum.EvidenceBite,
    EvidenceBiteCategoryEngine,
    "Read one evidence claim and inspect its confidence.",
    "This evidence bite is not available yet.",
  ),
  [CourseExerciseCategoryEnum.SurgeTimer]: createConfig(
    CourseExerciseCategoryEnum.SurgeTimer,
    SurgeTimerCategoryEngine,
    "Explore how the surge chemistry clears with time.",
    "This surge timer is not available yet.",
  ),
  [CourseExerciseCategoryEnum.WhyItMatters]: createConfig(
    CourseExerciseCategoryEnum.WhyItMatters,
    ConceptInsightCategoryEngine,
    "Turn the wave model into one usable instruction.",
    "This concept card is not available yet.",
  ),
  [CourseExerciseCategoryEnum.BreathingRound]: {
    category: CourseExerciseCategoryEnum.BreathingRound,
    formats: [CourseExerciseCategoryEnum.BreathingRound],
    engine: BreathingRoundCategoryEngine,
    goalLabel: "Practise one long-exhale breathing round.",
    unavailableCopy: "This breathing round is not available yet.",
    interaction: {
      getPrimaryLabel: (exercise, response) => {
        if (response.completedRound) return "Continue";
        if (response.running) return "Breathe...";
        return "Start one round";
      },
      getPrimaryTransition: (exercise, response) => {
        if (!response.completedRound && !response.running) {
          return {
            kind: "response",
            ready: false,
            response: { ...response, running: true },
          };
        }
        return null;
      },
    },
  },
  [CourseExerciseCategoryEnum.WaveFaq]: createConfig(
    CourseExerciseCategoryEnum.WaveFaq,
    ConceptInsightCategoryEngine,
    "Recognize a fresh worry as a re-trigger, not a failed fade.",
    "This wave answer is not available yet.",
  ),
} satisfies Partial<
  Record<CourseExerciseCategoryEnum, CourseExerciseCategoryConfig>
>;

function createConfig(
  category: CourseExerciseCategoryEnum,
  engine: CourseExerciseCategoryConfig["engine"],
  goalLabel: string,
  unavailableCopy: string,
): CourseExerciseCategoryConfig {
  return {
    category,
    formats: [category],
    engine,
    goalLabel,
    unavailableCopy,
  };
}
