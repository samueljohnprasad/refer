import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import type { MicrolearningContentIssue, MicrolearningChoice, MicrolearningResponseBase } from "@/src/components/exercise/microlearning/microlearningTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const TRAY_KEYS = ["id", "slotLabel", "options"] as const;
const OPTION_KEYS = ["id", "label"] as const;
const SPACE_JOIN_KEYS = ["type"] as const;
const TEMPLATE_JOIN_KEYS = ["type", "template"] as const;
const ROOT_KEYS = [
  "title",
  "instruction",
  "hotThought",
  "trays",
  "joinStrategy",
  "comparisonFeedback",
] as const;

export interface ReframeTray {
  id: string;
  slotLabel: string;
  options: MicrolearningChoice[];
}

export type ReframeJoinStrategy =
  | { type: "space" }
  | { type: "template"; template: string };

export interface ReframeBuilderContent {
  hotThought: string;
  trays: ReframeTray[];
  joinStrategy: ReframeJoinStrategy;
  comparisonFeedback: string;
}

export interface ReframeBuilderResponse extends MicrolearningResponseBase {
  format: CourseExerciseCategoryEnum.ReframeBuilder;
  selectedByTrayId: Record<string, string>;
  editingTrayId: string | null;
}

export function readReframeBuilderContent(
  value: unknown,
): ReframeBuilderContent | null {
  const content = readRecord(value);
  if (!content) return null;
  const issues: MicrolearningContentIssue[] = [];
  validateReframeBuilderContent(content, issues);
  if (issues.length > 0) return null;
  return {
    hotThought: content.hotThought as string,
    trays: (content.trays as Record<string, unknown>[]).map((tray) => ({
      id: tray.id as string,
      slotLabel: tray.slotLabel as string,
      options: (tray.options as Record<string, unknown>[]).map((option) => ({
        id: option.id as string,
        label: option.label as string,
      })),
    })),
    joinStrategy: content.joinStrategy as ReframeJoinStrategy,
    comparisonFeedback: content.comparisonFeedback as string,
  };
}

export function validateReframeBuilderContent(
  content: Record<string, unknown>,
  issues: MicrolearningContentIssue[],
): void {
  if (!hasOnlyAllowedKeys(content, ROOT_KEYS)) {
    issues.push({ path: "content", message: "Contains unsupported Reframe Builder fields." });
  }
  validateText(content.hotThought, "hotThought", 24, issues);
  validateText(content.comparisonFeedback, "comparisonFeedback", 24, issues);
  if (
    typeof content.comparisonFeedback === "string" &&
    !isSingleSentence(content.comparisonFeedback)
  ) {
    issues.push({ path: "comparisonFeedback", message: "Must be one sentence." });
  }

  const trays = content.trays;
  if (!Array.isArray(trays)) {
    issues.push({ path: "trays", message: "Must be an array." });
    return;
  }
  if (trays.length < 2 || trays.length > 3) {
    issues.push({ path: "trays", message: `Must contain 2–3 items; found ${trays.length}.` });
  }

  const ids = new Set<string>();
  trays.forEach((value, trayIndex) => {
    const path = `trays[${trayIndex}]`;
    const tray = readRecord(value);
    if (!tray || !hasOnlyKeys(tray, TRAY_KEYS)) {
      issues.push({ path, message: "Must use only id, slotLabel, and options." });
      return;
    }
    validateId(tray.id, `${path}.id`, ids, issues);
    validateText(tray.slotLabel, `${path}.slotLabel`, 6, issues);
    validateOptions(tray.options, `${path}.options`, ids, issues);
  });
  validateJoinStrategy(content.joinStrategy, trays, issues);
}

export function sanitizeReframeSelections(
  value: unknown,
  content: ReframeBuilderContent,
): Record<string, string> {
  const selections = readRecord(value);
  if (!selections) return {};
  const sanitized: Record<string, string> = {};
  content.trays.forEach((tray) => {
    const optionId = selections[tray.id];
    if (typeof optionId === "string" && tray.options.some((option) => option.id === optionId)) {
      sanitized[tray.id] = optionId;
    }
  });
  return sanitized;
}

export function hasCompleteReframeSelection(
  content: ReframeBuilderContent,
  selections: Record<string, string>,
): boolean {
  return content.trays.every((tray) =>
    tray.options.some((option) => option.id === selections[tray.id]),
  );
}

export function buildReframeThought(
  content: ReframeBuilderContent,
  selections: Record<string, string>,
): string | null {
  if (!hasCompleteReframeSelection(content, selections)) return null;
  const labelsByTrayId = Object.fromEntries(
    content.trays.map((tray) => [
      tray.id,
      tray.options.find((option) => option.id === selections[tray.id])?.label,
    ]),
  ) as Record<string, string>;
  if (content.joinStrategy.type === "space") {
    return content.trays.map((tray) => labelsByTrayId[tray.id]).join(" ");
  }
  return content.joinStrategy.template.replace(
    /\{([^{}]+)\}/gu,
    (_, trayId: string) => labelsByTrayId[trayId],
  );
}

export function createReframeBuilderResponse(
  content: ReframeBuilderContent,
  saved: Record<string, unknown> | null = null,
): ReframeBuilderResponse {
  const selectedByTrayId = sanitizeReframeSelections(
    saved?.selectedByTrayId,
    content,
  );
  const complete =
    saved?.format === CourseExerciseCategoryEnum.ReframeBuilder &&
    saved.phase === "complete" &&
    hasCompleteReframeSelection(content, selectedByTrayId);
  const editingTrayId = complete ? null : readEditingTrayId(saved?.editingTrayId, content);
  const activeTrayId = editingTrayId ?? firstUnfilledTrayId(content, selectedByTrayId);
  return {
    format: CourseExerciseCategoryEnum.ReframeBuilder,
    phase: complete ? "complete" : "active",
    stageIndex: complete
      ? content.trays.length - 1
      : Math.max(content.trays.findIndex((tray) => tray.id === activeTrayId), 0),
    isCorrect: complete,
    selectedByTrayId,
    editingTrayId,
  };
}

export function firstUnfilledTrayId(
  content: ReframeBuilderContent,
  selections: Record<string, string>,
): string | null {
  return content.trays.find((tray) => !selections[tray.id])?.id ?? null;
}

function validateOptions(
  value: unknown,
  path: string,
  ids: Set<string>,
  issues: MicrolearningContentIssue[],
): void {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "Must be an array." });
    return;
  }
  if (value.length < 2 || value.length > 3) {
    issues.push({ path, message: `Must contain 2–3 items; found ${value.length}.` });
  }
  value.forEach((item, optionIndex) => {
    const optionPath = `${path}[${optionIndex}]`;
    const option = readRecord(item);
    if (!option || !hasOnlyKeys(option, OPTION_KEYS)) {
      issues.push({ path: optionPath, message: "Must use only id and label." });
      return;
    }
    validateId(option.id, `${optionPath}.id`, ids, issues);
    validateText(option.label, `${optionPath}.label`, 12, issues);
  });
}

function validateJoinStrategy(
  value: unknown,
  trays: readonly unknown[],
  issues: MicrolearningContentIssue[],
): void {
  const strategy = readRecord(value);
  if (!strategy || typeof strategy.type !== "string") {
    issues.push({ path: "joinStrategy", message: "Must be a valid join strategy." });
    return;
  }
  if (strategy.type === "space") {
    if (!hasOnlyKeys(strategy, SPACE_JOIN_KEYS)) {
      issues.push({ path: "joinStrategy", message: "Space joins use only type." });
    }
    return;
  }
  if (strategy.type !== "template" || !hasOnlyKeys(strategy, TEMPLATE_JOIN_KEYS)) {
    issues.push({ path: "joinStrategy", message: "Must be a space or template join." });
    return;
  }
  if (typeof strategy.template !== "string" || !strategy.template.trim()) {
    issues.push({ path: "joinStrategy.template", message: "Must be a non-empty string." });
    return;
  }
  const trayIds = trays
    .map((tray) => readRecord(tray)?.id)
    .filter((id): id is string => typeof id === "string");
  const placeholders = [...strategy.template.matchAll(/\{([^{}]+)\}/gu)].map((match) => match[1]);
  if (/[{}]/u.test(strategy.template.replace(/\{[^{}]+\}/gu, ""))) {
    issues.push({ path: "joinStrategy.template", message: "Contains a malformed placeholder." });
  }
  placeholders.forEach((placeholder) => {
    if (!trayIds.includes(placeholder)) {
      issues.push({ path: "joinStrategy.template", message: `Unknown placeholder "${placeholder}".` });
    }
  });
  trayIds.forEach((id) => {
    const count = placeholders.filter((placeholder) => placeholder === id).length;
    if (count !== 1) {
      issues.push({ path: "joinStrategy.template", message: `Placeholder "${id}" must appear exactly once.` });
    }
  });
}

function validateId(value: unknown, path: string, ids: Set<string>, issues: MicrolearningContentIssue[]): void {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "Must be a non-empty string." });
  } else if (ids.has(value)) {
    issues.push({ path, message: `Duplicate id "${value}".` });
  } else {
    ids.add(value);
  }
}

function validateText(value: unknown, path: string, maxWords: number, issues: MicrolearningContentIssue[]): void {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "Must be a non-empty string." });
  } else if (value.trim().split(/\s+/u).filter(Boolean).length > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer.` });
  }
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => key in value);
}

function hasOnlyAllowedKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function isSingleSentence(value: string): boolean {
  return value.trim().split(/[.!?]+/u).filter(Boolean).length === 1;
}

function readEditingTrayId(value: unknown, content: ReframeBuilderContent): string | null {
  return typeof value === "string" && content.trays.some((tray) => tray.id === value)
    ? value
    : null;
}
