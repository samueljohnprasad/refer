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
    completesDirectly: true,
    getPrimaryLabel: (_exercise, response) => {
      const phase = (response?.phase as string) || "trap";
      if (phase === "trap") return "AND THEN WHAT HAPPENS?";
      if (phase === "payoff") return "SEE WHAT IT TURNS INTO";
      if (phase === "cost") return "WHAT CAN I DO INSTEAD?";
      return "CONTINUE";
    },
    getPrimaryTransition: (_exercise, response) => {
      const phase = (response?.phase as string) || "trap";
      
      if (phase === "trap") return { kind: "response", ready: true, response: { ...response, phase: "payoff" } };
      if (phase === "payoff") return { kind: "response", ready: true, response: { ...response, phase: "cost" } };
      if (phase === "cost") return { kind: "response", ready: true, response: { ...response, phase: "complete" } };
      
      return null;
    },
  },
};
