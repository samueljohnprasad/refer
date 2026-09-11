import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { CommonTrapCategoryEngine } from "@/src/components/exercise/CommonTrapCategoryEngine";

export const CommonTrapConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.CommonTrap,
  formats: [CourseExerciseCategoryEnum.CommonTrap],
  engine: CommonTrapCategoryEngine,
  goalLabel: "See why a tempting coping move rebounds.",
  unavailableCopy: "This common-trap exercise is not available yet.",
  // ponytail: engine drives phase reveals; hide skip once user progresses past trap; hide footer until final phase
  presentation: {
    hideSkip: (_exercise, response) => Boolean(response?.phase && response.phase !== "trap"),
  },
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (_exercise, response) => {
      const phase = (response?.phase as string) || "trap";
      if (phase === "trap") return "AND THEN WHAT HAPPENS?";
      if (phase === "payoff") return "SEE WHAT IT TURNS INTO";
      if (phase === "cost") return "WHAT CAN I DO INSTEAD?";
      return "Continue";
    },
    getPrimaryTransition: (_exercise, response) => {
      const phase = (response?.phase as string) || "trap";
      let nextPhase = "complete";
      
      if (phase === "trap") nextPhase = "payoff";
      else if (phase === "payoff") nextPhase = "cost";
      else if (phase === "cost") nextPhase = "counter";
      else if (phase === "counter") nextPhase = "complete";

      return {
        kind: "response" as const,
        ready: true,
        response: { ...response, phase: nextPhase },
      };
    },
  },
};
