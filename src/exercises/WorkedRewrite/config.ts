import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WorkedRewriteCategoryEngine } from "@/src/components/exercise/WorkedRewriteCategoryEngine";
import {
  getNextWorkedRewriteState,
  getWorkedRewritePrimaryLabel,
} from "@/src/domains/journey/learning/workedRewriteTransition";

export const WorkedRewriteConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.WorkedRewrite,
  formats: [CourseExerciseCategoryEnum.WorkedRewrite],
  engine: WorkedRewriteCategoryEngine,
  goalLabel: "Follow one rewrite move at a time.",
  unavailableCopy: "This worked rewrite is not available yet.",
  interaction: {
    submissionMode: "immediate",
    getPrimaryLabel: getWorkedRewritePrimaryLabel,
    getPrimaryTransition: getNextWorkedRewriteState,
  },
};
