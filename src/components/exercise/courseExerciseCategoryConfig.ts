import type { ComponentType } from "react";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import type { RenderableExerciseCategory } from "@/src/types/courseExercises";

export interface ExerciseResponseRequirement {
  fields: readonly string[];
  values?: Readonly<Record<string, unknown>>;
}


import type { Exercise } from "@/src/types/journeyV5";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

export type ExerciseInteractionConfig = (
  | { submissionMode: "explicit" }
  | {
      submissionMode: "immediate";
      submissionRequirement?: ExerciseResponseRequirement;
    }
) & {
  getPrimaryLabel?: (exercise: Exercise, response: Record<string, unknown>) => string | null;
  getPrimaryTransition?: (exercise: Exercise, response: Record<string, unknown>) => CoursePrimaryTransition | null;
  buildRetryResponse?: (exercise: Exercise, response: Record<string, unknown>) => Record<string, unknown> | null;
};


export interface CourseExerciseCategoryConfig<TContent = unknown> {
  category: RenderableExerciseCategory;
  formats: string[];
  engine: ComponentType<V1CategoryEngineProps>;
  goalLabel: string;
  unavailableCopy: string;
  interaction?: ExerciseInteractionConfig;

  // Semantic configuration properties
  presentation?: {
    showSubtitle?: boolean;
    showInstruction?: boolean;
    hideFooter?: (exercise: Exercise, response: Record<string, unknown> | null, ready?: boolean) => boolean;
    hideSkip?: (exercise: Exercise, response: Record<string, unknown> | null) => boolean;
    showsFeedbackInline?: (exercise: Exercise, response: Record<string, unknown> | null) => boolean;
  };
  layout?: Record<string, unknown>;
  progress?: Record<string, unknown>;
  feedback?: {
    getSelectedOptionFeedback?: (exercise: Exercise, response?: Record<string, unknown> | null) => string | null;
  };
  actions?: Record<string, unknown>;
  capabilities?: Record<string, unknown>;

  // Dynamic behavior
  validation?: (content: TContent) => import("./microlearning/microlearningTypes").MicrolearningContentIssue[];
}

export const DEFAULT_COURSE_EXERCISE_CONFIG = {
  presentation: {
    showSubtitle: true,
    showInstruction: true,
  },
  validation: (content: unknown): import("./microlearning/microlearningTypes").MicrolearningContentIssue[] => {
    const issues: import("./microlearning/microlearningTypes").MicrolearningContentIssue[] = [];
    if (!isRecord(content)) {
      return [{ path: "content", message: "content must be an object." }];
    }
    validateStringBudget(content, "title", 7, issues);
    validateStringBudget(content, "instruction", 12, issues);
    return issues;
  },
} as const;

export function resolveCourseExerciseConfig<TContent = unknown>(
  config: Partial<CourseExerciseCategoryConfig<TContent>> & Pick<CourseExerciseCategoryConfig<TContent>, 'category' | 'engine'>
): CourseExerciseCategoryConfig<TContent> {
  return {
    ...config,
    presentation: {
      ...DEFAULT_COURSE_EXERCISE_CONFIG.presentation,
      ...config.presentation,
    },
    validation: config.validation ?? (DEFAULT_COURSE_EXERCISE_CONFIG.validation as any),
  } as CourseExerciseCategoryConfig<TContent>;
}

// Validation helpers moved from microlearningContentValidation.ts
function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validateStringBudget(
  root: unknown,
  path: string,
  maxWords: number,
  issues: import("./microlearning/microlearningTypes").MicrolearningContentIssue[],
): void {
  const value = readRequiredPath(root, path, issues);
  if (value === undefined) return;
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({ path, message: "Must be a non-empty string." });
    return;
  }
  const count = value.trim().split(/\s+/u).filter(Boolean).length;
  if (count > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer; found ${count}.` });
  }
}

export function readRequiredPath(
  root: unknown,
  path: string,
  issues: import("./microlearning/microlearningTypes").MicrolearningContentIssue[],
): unknown {
  let current = root;
  for (const segment of path.split(".")) {
    if (!isRecord(current) || !(segment in current)) {
      issues.push({ path, message: "Required value is missing." });
      return undefined;
    }
    current = current[segment];
  }
  return current;
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
