import type { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";

const ROOT_KEYS = ["title", "instruction", "fields", "examples", "completionInsight"];
const FIELD_KEYS = ["id", "label"];
const EXAMPLE_KEYS = ["id", "label", "context", "prefills", "tasks", "activeFieldOrder"];
const PREFILL_KEYS = ["fieldId", "value"];
const TASK_KEYS = ["fieldId", "prompt", "clue", "options"];
const OPTION_KEYS = ["id", "label", "isSupported", "feedback"];

export interface ThoughtRecordField { id: string; label: string }
export interface ThoughtRecordPrefill { fieldId: string; value: string }
export interface ThoughtRecordOption {
  id: string;
  label: string;
  isSupported: boolean;
  feedback: string;
}
export interface ThoughtRecordTask {
  fieldId: string;
  prompt: string;
  clue: string;
  options: ThoughtRecordOption[];
}
export interface ThoughtRecordExample {
  id: string;
  label: string;
  context: string;
  prefills: ThoughtRecordPrefill[];
  tasks: ThoughtRecordTask[];
  activeFieldOrder: string[];
}
export interface FadedThoughtRecordContent {
  title: string;
  instruction: string;
  fields: ThoughtRecordField[];
  examples: [ThoughtRecordExample, ThoughtRecordExample];
  completionInsight: string;
}

export function readFadedThoughtRecordContent(
  value: unknown,
): FadedThoughtRecordContent | null {
  if (!isRecord(value) || validateFadedThoughtRecordContent(value).length > 0) {
    return null;
  }
  return value as unknown as FadedThoughtRecordContent;
}

export function validateFadedThoughtRecordContent(
  value: unknown,
): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  if (!isRecord(value)) return [{ path: "content", message: "Must be an object." }];
  validateExactKeys(value, ROOT_KEYS, "content", issues);
  validateText(value.title, "title", 7, issues);
  validateText(value.instruction, "instruction", 12, issues);
  validateSentence(value.completionInsight, "completionInsight", issues);

  const fields = readExactArray(value.fields, "fields", 3, 5, issues);
  const examples = readExactArray(value.examples, "examples", 2, 2, issues);
  const ids = new Set<string>();
  const fieldIds = new Set<string>();
  fields?.forEach((field, index) => {
    const path = `fields[${index}]`;
    if (!isRecord(field)) return pushObjectIssue(path, issues);
    validateExactKeys(field, FIELD_KEYS, path, issues);
    if (validateId(field.id, `${path}.id`, ids, issues)) fieldIds.add(field.id as string);
    validateText(field.label, `${path}.label`, 6, issues);
  });
  examples?.forEach((example, index) => {
    validateExample(example, index, fieldIds, ids, issues);
  });
  return issues;
}

function validateExample(
  value: unknown,
  index: number,
  fieldIds: ReadonlySet<string>,
  ids: Set<string>,
  issues: MicrolearningContentIssue[],
): void {
  const path = `examples[${index}]`;
  if (!isRecord(value)) return pushObjectIssue(path, issues);
  validateExactKeys(value, EXAMPLE_KEYS, path, issues);
  validateId(value.id, `${path}.id`, ids, issues);
  validateText(value.label, `${path}.label`, 6, issues);
  validateText(value.context, `${path}.context`, 40, issues);
  const taskCount = index === 0 ? 1 : 2;
  const prefillCount = Math.max(fieldIds.size - taskCount, 0);
  const prefills = readExactArray(value.prefills, `${path}.prefills`, prefillCount, prefillCount, issues);
  const tasks = readExactArray(value.tasks, `${path}.tasks`, taskCount, taskCount, issues);
  const order = readExactArray(value.activeFieldOrder, `${path}.activeFieldOrder`, taskCount, taskCount, issues);
  const coverage = new Map<string, number>();
  prefills?.forEach((prefill, prefillIndex) => {
    const prefillPath = `${path}.prefills[${prefillIndex}]`;
    if (!isRecord(prefill)) return pushObjectIssue(prefillPath, issues);
    validateExactKeys(prefill, PREFILL_KEYS, prefillPath, issues);
    validateFieldReference(prefill.fieldId, `${prefillPath}.fieldId`, fieldIds, issues);
    addCoverage(prefill.fieldId, coverage);
    validateText(prefill.value, `${prefillPath}.value`, 24, issues);
  });
  const taskFieldIds: string[] = [];
  tasks?.forEach((task, taskIndex) => {
    const taskPath = `${path}.tasks[${taskIndex}]`;
    if (!isRecord(task)) return pushObjectIssue(taskPath, issues);
    validateExactKeys(task, TASK_KEYS, taskPath, issues);
    validateFieldReference(task.fieldId, `${taskPath}.fieldId`, fieldIds, issues);
    addCoverage(task.fieldId, coverage);
    if (typeof task.fieldId === "string") taskFieldIds.push(task.fieldId);
    validateText(task.prompt, `${taskPath}.prompt`, 24, issues);
    validateSentence(task.clue, `${taskPath}.clue`, issues);
    validateOptions(task.options, `${taskPath}.options`, ids, issues);
  });
  validateCoverage(fieldIds, coverage, path, issues);
  validateActiveOrder(order, taskFieldIds, prefills, path, issues);
}

function validateOptions(
  value: unknown,
  path: string,
  ids: Set<string>,
  issues: MicrolearningContentIssue[],
): void {
  const options = readExactArray(value, path, 2, 3, issues);
  let supportedCount = 0;
  options?.forEach((option, index) => {
    const optionPath = `${path}[${index}]`;
    if (!isRecord(option)) return pushObjectIssue(optionPath, issues);
    validateExactKeys(option, OPTION_KEYS, optionPath, issues);
    validateId(option.id, `${optionPath}.id`, ids, issues);
    validateText(option.label, `${optionPath}.label`, 12, issues);
    if (typeof option.isSupported !== "boolean") {
      issues.push({ path: `${optionPath}.isSupported`, message: "Must be a boolean." });
    } else if (option.isSupported) supportedCount += 1;
    validateSentence(option.feedback, `${optionPath}.feedback`, issues);
  });
  if (options && supportedCount !== 1) {
    issues.push({ path, message: "Must have exactly one supported option." });
  }
}

function validateActiveOrder(
  order: readonly unknown[] | null,
  taskFieldIds: readonly string[],
  prefills: readonly unknown[] | null,
  path: string,
  issues: MicrolearningContentIssue[],
): void {
  if (!order) return;
  const prefilled = new Set((prefills ?? []).map((item) => isRecord(item) ? item.fieldId : null));
  const seen = new Set<string>();
  order.forEach((fieldId, index) => {
    const itemPath = `${path}.activeFieldOrder[${index}]`;
    if (typeof fieldId !== "string" || !taskFieldIds.includes(fieldId)) {
      issues.push({ path: itemPath, message: "Must reference a task field." });
    } else if (seen.has(fieldId)) {
      issues.push({ path: itemPath, message: `Duplicate field reference "${fieldId}".` });
    } else seen.add(fieldId);
    if (prefilled.has(fieldId)) {
      issues.push({ path: itemPath, message: "Must not reference a prefilled field." });
    }
  });
  taskFieldIds.forEach((fieldId) => {
    if (!seen.has(fieldId)) {
      issues.push({ path: `${path}.activeFieldOrder`, message: `Missing task field "${fieldId}".` });
    }
  });
}

function validateCoverage(
  fieldIds: ReadonlySet<string>,
  coverage: ReadonlyMap<string, number>,
  path: string,
  issues: MicrolearningContentIssue[],
): void {
  fieldIds.forEach((fieldId) => {
    const count = coverage.get(fieldId) ?? 0;
    if (count !== 1) {
      issues.push({ path, message: `Field "${fieldId}" must appear exactly once; found ${count}.` });
    }
  });
}

function validateFieldReference(
  value: unknown,
  path: string,
  fieldIds: ReadonlySet<string>,
  issues: MicrolearningContentIssue[],
): void {
  if (typeof value !== "string" || !fieldIds.has(value)) {
    issues.push({ path, message: "Must reference a root field id." });
  }
}

function addCoverage(value: unknown, coverage: Map<string, number>): void {
  if (typeof value === "string") coverage.set(value, (coverage.get(value) ?? 0) + 1);
}

function readExactArray(
  value: unknown,
  path: string,
  minimum: number,
  maximum: number,
  issues: MicrolearningContentIssue[],
): readonly unknown[] | null {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "Must be an array." });
    return null;
  }
  if (value.length < minimum || value.length > maximum) {
    const range = minimum === maximum ? `${minimum}` : `${minimum}–${maximum}`;
    issues.push({ path, message: `Must contain ${range} items; found ${value.length}.` });
  }
  return value;
}

function validateExactKeys(
  value: Record<string, unknown>,
  keys: readonly string[],
  path: string,
  issues: MicrolearningContentIssue[],
): void {
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) {
    issues.push({ path, message: "Has unsupported or missing fields." });
  }
}

function validateId(
  value: unknown,
  path: string,
  ids: Set<string>,
  issues: MicrolearningContentIssue[],
): boolean {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/u.test(value)) {
    issues.push({ path, message: "Must be a stable id." });
    return false;
  }
  if (ids.has(value)) {
    issues.push({ path, message: `Duplicate id "${value}".` });
    return false;
  }
  ids.add(value);
  return true;
}

function validateSentence(
  value: unknown,
  path: string,
  issues: MicrolearningContentIssue[],
): void {
  validateText(value, path, 24, issues);
  if (typeof value === "string" && value.trim().split(/[.!?]+/u).filter(Boolean).length !== 1) {
    issues.push({ path, message: "Must be one sentence." });
  }
}

function validateText(
  value: unknown,
  path: string,
  maxWords: number,
  issues: MicrolearningContentIssue[],
): void {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "Must be a non-empty string." });
  } else if (value.trim().split(/\s+/u).filter(Boolean).length > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer.` });
  }
}

function pushObjectIssue(path: string, issues: MicrolearningContentIssue[]): void {
  issues.push({ path, message: "Must be an object." });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
