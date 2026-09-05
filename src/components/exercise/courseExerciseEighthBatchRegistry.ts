import { BreathingRoundCategoryEngine } from "@/src/components/exercise/BreathingRoundCategoryEngine";
import { ConceptInsightCategoryEngine } from "@/src/components/exercise/ConceptInsightCategoryEngine";
import { EvidenceBiteCategoryEngine } from "@/src/components/exercise/EvidenceBiteCategoryEngine";
import { SurgeTimerCategoryEngine } from "@/src/components/exercise/SurgeTimerCategoryEngine";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export const EIGHTH_BATCH_CATEGORY_CONFIGS = {
  [CourseExerciseCategoryEnum.EvidenceBite]: {
    category: CourseExerciseCategoryEnum.EvidenceBite,
    formats: [CourseExerciseCategoryEnum.EvidenceBite],
    engine: EvidenceBiteCategoryEngine,
    goalLabel: "Build evidence step by step to find a pattern.",
    unavailableCopy: "This evidence builder is not available yet.",
    presentation: {
      hideSkip: () => true,
    },
    interaction: {
      submissionMode: "explicit",
      getPrimaryLabel: (exercise, response) => {
        const defaultSteps = [
          { actionLabel: "WATCH ANOTHER NIGHT" },
          { actionLabel: "WHAT DOES THAT TELL ME?" }
        ];
        
        if (!response?.stepIndex) return "WATCH ANOTHER NIGHT";
        const idx = typeof response.stepIndex === "number" ? response.stepIndex : 0;
        const steps = Array.isArray(exercise.content?.steps) ? exercise.content?.steps : defaultSteps;
        const step = steps[idx];
        if (step?.actionLabel) return step.actionLabel as string;
        if (idx >= steps.length) return "CONTINUE";
        return "CONTINUE";
      },
      getPrimaryTransition: (exercise, response) => {
        const defaultSteps = [{}, {}];
        const idx = typeof response?.stepIndex === "number" ? response.stepIndex : 0;
        const steps = Array.isArray(exercise.content?.steps) ? exercise.content?.steps : defaultSteps;
        if (idx < steps.length) {
          return {
            kind: "response",
            ready: true,
            response: { ...response, stepIndex: idx + 1 },
          };
        }
        return null;
      },
    },
  },
  [CourseExerciseCategoryEnum.SurgeTimer]: {
    category: CourseExerciseCategoryEnum.SurgeTimer,
    formats: [CourseExerciseCategoryEnum.SurgeTimer],
    engine: SurgeTimerCategoryEngine,
    goalLabel: "Explore how the surge chemistry clears with time.",
    unavailableCopy: "This surge timer is not available yet.",
    interaction: {
      submissionMode: "explicit",
      getPrimaryLabel: (exercise, response) => {
        const maxReached = response.maxProgressReached;
        return typeof maxReached === 'number' && maxReached >= 80 ? "Continue" : "Drag slider to explore";
      }
    }
  },
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
      submissionMode: "explicit",
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
