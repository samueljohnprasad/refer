import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TeachBackChainCategoryEngine } from "@/src/components/exercise/TeachBackChainCategoryEngine";
import { validateTeachBackChainContent } from "@/src/components/exercise/teachBackChainValidation";

// ponytail: TeachBackChainConfig with dynamic footer hiding until completion
export const TeachBackChainConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.TeachBackChain,
  formats: [CourseExerciseCategoryEnum.TeachBackChain],
  engine: TeachBackChainCategoryEngine,
  goalLabel: "Put the worry loop together, then break it.",
  unavailableCopy: "This exercise is not available yet.",
  presentation: {
    hideFooter: (_exercise, response) => {
      const res = response as { mode?: string; phase?: string } | null;
      return res?.mode !== "transfer" || res?.phase !== "complete";
    },
    hideSkip: (_exercise, response) => {
      const res = response as { mode?: string; orderedStepIds?: string[] } | null;
      return (res?.orderedStepIds?.length ?? 0) > 0 || res?.mode === "transfer";
    },
  },
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: () => "Try it on a real example",
    getPrimaryTransition: () => null,
  },
  validation: validateTeachBackChainContent,
};
