import { StateSwitchConfig } from "@/src/exercises/StateSwitch/config";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { CourseCheckpointCategoryEngine } from "@/src/components/exercise/CourseCheckpointCategoryEngine";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { IfThenPlanConfig } from "@/src/exercises/IfThenPlan/config";
import { SectionMilestoneConfig } from "@/src/exercises/SectionMilestone/config";
import { TimelineRewindConfig } from "@/src/exercises/TimelineRewind/config";
import type { Exercise } from "@/src/types/journeyV5";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

function getCheckpointLabel(response: Record<string, unknown>, exercise?: Exercise): string | null {
  const phase = response.phase;
  if (phase === "intro") return "Start review";
  if (phase === "summary") return "Continue";
  if (phase === "feedback") {
    const itemIndex = readNumber(response.itemIndex);
    const itemCount = readArray(exercise?.content?.items).length;
    return itemIndex >= itemCount - 1 ? "See results" : "Next question";
  }
  return null;
}

function getCheckpointTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (response.phase === "intro") {
    return {
      kind: "response",
      ready: false,
      response: { ...response, phase: "question" },
      };
  }
  if (response.phase === "feedback") {
    return advanceCheckpoint(exercise, response);
  }
  if (response.phase === "summary") {
    return {
      kind: "response",
      ready: true,
      response: { ...response, phase: "complete" },
    };
  }
  return undefined;
}

function advanceCheckpoint(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition {
  const itemIndex = readNumber(response.itemIndex);
  const itemCount = readArray(exercise.content?.items).length;
  const results = readBooleanArray(response.results);
  results[itemIndex] = response.isCorrect === true;
  const isLastItem = itemIndex >= itemCount - 1;
  return {
    kind: "response",
    ready: isLastItem,
    response: {
      ...response,
      phase: isLastItem ? "summary" : "question",
      itemIndex: isLastItem ? itemIndex : itemIndex + 1,
      selectedOptionIndex: null,
      attempts: 0,
      results,
      isCorrect: false,
    },
  };
}

function isIndex(value: unknown): boolean {
  return typeof value === "number" && value >= 0;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readBooleanArray(value: unknown): boolean[] {
  return Array.isArray(value) ? value.map((item) => item === true) : [];
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export const FINAL_BATCH_CATEGORY_CONFIGS: Partial<Record<CourseExerciseCategoryEnum, CourseExerciseCategoryConfig>> = {
  [CourseExerciseCategoryEnum.IfThenPlan]: IfThenPlanConfig,
  [CourseExerciseCategoryEnum.TimelineRewind]: TimelineRewindConfig,
  [CourseExerciseCategoryEnum.CourseCheckpoint]: {
    ...createConfig(
      CourseExerciseCategoryEnum.CourseCheckpoint,
      CourseCheckpointCategoryEngine,
      "Review the alarm system and coping loops without score pressure.",
      "This checkpoint is not available yet."
    ),
    presentation: {
      hideFooter: (exercise, response) => {
        // Hide footer only before answer selection (in question phase)
        return response?.phase === "question";
      },
      hideSkip: (exercise, response) => {
        // Suppress "Skip for now" once review has started
        return response?.phase === "question" || response?.phase === "feedback" || response?.phase === "summary";
      },
    },
    interaction: {
      submissionMode: "explicit",
      getPrimaryLabel: (exercise, response) => getCheckpointLabel(response, exercise),
      getPrimaryTransition: (exercise, response) => getCheckpointTransition(exercise, response) ?? null,
    }
  },
  [CourseExerciseCategoryEnum.SectionMilestone]: SectionMilestoneConfig,
  [CourseExerciseCategoryEnum.StateSwitch]: StateSwitchConfig,
};

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
