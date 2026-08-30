import type { ComponentType } from "react";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import type { RenderableExerciseCategory } from "@/src/types/courseExercises";

export interface ExerciseResponseRequirement {
  fields: readonly string[];
  values?: Readonly<Record<string, unknown>>;
}

export type ExerciseInteractionConfig =
  | { submissionMode: "explicit" }
  | {
      submissionMode: "immediate";
      submissionRequirement?: ExerciseResponseRequirement;
    };

export interface CourseExerciseCategoryConfig {
  category: RenderableExerciseCategory;
  formats: string[];
  engine: ComponentType<V1CategoryEngineProps>;
  goalLabel: string;
  unavailableCopy: string;
  interaction?: ExerciseInteractionConfig;
}

export const IMMEDIATE_OPTION_SELECTION = {
  submissionMode: "immediate",
  submissionRequirement: { fields: ["selectedOptionId"] },
} satisfies ExerciseInteractionConfig;

const DEFAULT_INTERACTION_CONFIG: ExerciseInteractionConfig = {
  submissionMode: "explicit",
};

export function shouldSubmitExerciseResponseImmediately(
  interaction: CourseExerciseCategoryConfig["interaction"],
  response: Record<string, unknown>,
): boolean {
  const resolvedInteraction = interaction ?? DEFAULT_INTERACTION_CONFIG;

  return (
    resolvedInteraction.submissionMode === "immediate" &&
    matchesRequirement(response, resolvedInteraction.submissionRequirement)
  );
}

function matchesRequirement(
  response: Record<string, unknown>,
  requirement?: ExerciseResponseRequirement,
): boolean {
  if (!requirement) {
    return true;
  }

  return (
    requirement.fields.every((field) => hasValue(response[field])) &&
    Object.entries(requirement.values ?? {}).every(
      ([field, value]) => response[field] === value,
    )
  );
}

function hasValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== "";
}
