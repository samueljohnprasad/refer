import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { validateGuidedDiscoveryTrailContent } from "@/src/components/exercise/guidedDiscoveryTrailContent";
import { validateReframeBuilderContent } from "@/src/components/exercise/reframeBuilderContent";
import { validateTeachBackChainContent } from "@/src/components/exercise/teachBackChainValidation";
import { validateExplorableModelContent } from "@/src/components/exercise/explorableModelContent";
import { validateFadedThoughtRecordContent } from "@/src/components/exercise/fadedThoughtRecordContent";
import { validateWorkedRewriteContent } from "@/src/components/exercise/workedRewriteContent";
import { validateLayerZoomContent } from "@/src/components/exercise/layerZoomContent";
import { validateDialogueContent } from "@/src/components/exercise/dialogueContent";

import { validateWhatIfContent } from "@/src/components/exercise/whatif/whatIfContentValidation";
import { validateCheckpointContent } from "@/src/components/exercise/checkpoint/checkpointContentValidation";
import { validateRecallWarmupContent } from "./recallWarmupContentValidation";
import type { MicrolearningContentIssue } from "./microlearningTypes";

export const MICROLEARNING_CATEGORIES = [
  CourseExerciseCategoryEnum.GuidedDiscoveryTrail,
  CourseExerciseCategoryEnum.ReframeBuilder,
  CourseExerciseCategoryEnum.TeachBackChain,
  CourseExerciseCategoryEnum.ExplorableModel,
  CourseExerciseCategoryEnum.FadedThoughtRecord,
  CourseExerciseCategoryEnum.WorkedRewrite,
  CourseExerciseCategoryEnum.LayerZoom,
  CourseExerciseCategoryEnum.Dialogue,
  CourseExerciseCategoryEnum.WhatIfMachine,
  CourseExerciseCategoryEnum.CourseCheckpoint,
  CourseExerciseCategoryEnum.RecallWarmup,
] as const;

const CATEGORY_SET = new Set<string>(MICROLEARNING_CATEGORIES);

export type MicrolearningCategory = (typeof MICROLEARNING_CATEGORIES)[number];

export function isMicrolearningCategory(
  value: unknown,
): value is MicrolearningCategory {
  return typeof value === "string" && CATEGORY_SET.has(value);
}

export function validateMicrolearningContent(
  category: MicrolearningCategory,
  content: unknown,
): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  if (!isRecord(content)) {
    return [{ path: "content", message: `${category} content must be an object.` }];
  }
  if (category === CourseExerciseCategoryEnum.TeachBackChain) {
    return validateTeachBackChainContent(content);
  }
  if (category === CourseExerciseCategoryEnum.ExplorableModel) {
    return validateExplorableModelContent(content);
  }
  if (category === CourseExerciseCategoryEnum.FadedThoughtRecord) {
    return validateFadedThoughtRecordContent(content);
  }
  if (category === CourseExerciseCategoryEnum.WorkedRewrite) {
    return validateWorkedRewriteContent(content);
  }
  if (category === CourseExerciseCategoryEnum.LayerZoom) {
    return validateLayerZoomContent(content);
  }
  if (category === CourseExerciseCategoryEnum.Dialogue) {
    return validateDialogueContent(content);
  }
  if (category === CourseExerciseCategoryEnum.WhatIfMachine) {
    return validateWhatIfContent(content);
  }
  if (category === CourseExerciseCategoryEnum.CourseCheckpoint) {
    return validateCheckpointContent(content);
  }
  if (category === CourseExerciseCategoryEnum.RecallWarmup) {
    return validateRecallWarmupContent(content);
  }


  validateStringBudget(content, "title", 7, issues);
  validateStringBudget(content, "instruction", 12, issues);
  if (category === CourseExerciseCategoryEnum.GuidedDiscoveryTrail) {
    validateGuidedDiscoveryTrailContent(content, issues);
  }
  if (category === CourseExerciseCategoryEnum.ReframeBuilder) {
    validateReframeBuilderContent(content, issues);
  }
  return issues;
}

export function validateStringBudget(
  root: unknown,
  path: string,
  maxWords: number,
  issues: MicrolearningContentIssue[],
): void {
  const value = readRequiredPath(root, path, issues);
  if (value === undefined) return;
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({ path, message: "Must be a non-empty string." });
    return;
  }
  const count = countWords(value);
  if (count > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer; found ${count}.` });
  }
}

export function validateArrayCount(
  root: unknown,
  path: string,
  minimum: number,
  maximum: number,
  issues: MicrolearningContentIssue[],
): readonly unknown[] | null {
  const value = readRequiredPath(root, path, issues);
  if (value === undefined) return null;
  if (!Array.isArray(value)) {
    issues.push({ path, message: "Must be an array." });
    return null;
  }
  if (value.length < minimum || value.length > maximum) {
    issues.push({
      path,
      message: `Must contain ${minimum}–${maximum} items; found ${value.length}.`,
    });
  }
  return value;
}

export function validateUniqueIds(
  items: readonly unknown[],
  path: string,
  issues: MicrolearningContentIssue[],
): ReadonlySet<string> {
  const ids = new Set<string>();
  items.forEach((item, index) => {
    const itemPath = `${path}[${index}].id`;
    if (!isRecord(item) || typeof item.id !== "string" || !item.id.trim()) {
      issues.push({ path: itemPath, message: "Must be a non-empty string." });
    } else if (ids.has(item.id)) {
      issues.push({ path: itemPath, message: `Duplicate id \"${item.id}\".` });
    } else {
      ids.add(item.id);
    }
  });
  return ids;
}

export function validateReferences(
  references: readonly unknown[],
  validIds: ReadonlySet<string>,
  path: string,
  issues: MicrolearningContentIssue[],
): void {
  references.forEach((reference, index) => {
    if (typeof reference !== "string" || !validIds.has(reference)) {
      issues.push({
        path: `${path}[${index}]`,
        message: `Must reference an authored id; found ${JSON.stringify(reference)}.`,
      });
    }
  });
}

export function readRequiredPath(
  root: unknown,
  path: string,
  issues: MicrolearningContentIssue[],
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

export function countWords(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
