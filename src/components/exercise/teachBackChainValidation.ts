import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import type { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";

const ROOT_KEYS = ["title", "instruction", "message", "steps", "transfer"];
const STEP_KEYS = ["id", "label", "order"];
const TRANSFER_KEYS = ["prompt", "options"];
const OPTION_KEYS = ["id", "label", "isSupported", "response", "takeaway"];

export function validateTeachBackChainContent(
  value: unknown,
): MicrolearningContentIssue[] {
  const content = readRecord(value);
  if (!content) return [{ path: "content", message: "must be an object" }];

  const issues: MicrolearningContentIssue[] = [];
  validateExactKeys(content, ROOT_KEYS, "content", issues);
  validateString(content.title, "content.title", 7, issues);
  validateString(content.instruction, "content.instruction", 12, issues);
  validateString(content.message, "content.message", 40, issues);

  const steps = Array.isArray(content.steps) ? content.steps : null;
  if (!steps || steps.length < 3 || steps.length > 4) {
    issues.push({ path: "content.steps", message: "must contain 3–4 steps" });
  } else {
    const ids = new Set<string>();
    const orders: number[] = [];
    steps.forEach((value, index) => {
      const step = readRecord(value);
      const path = `content.steps[${index}]`;
      if (!step) {
        issues.push({ path, message: "must be an object" });
        return;
      }
      validateExactKeys(step, STEP_KEYS, path, issues);
      const id = validateStableId(step.id, `${path}.id`, issues);
      if (id) ids.add(id);
      validateString(step.label, `${path}.label`, 12, issues);
      if (!Number.isInteger(step.order)) {
        issues.push({ path: `${path}.order`, message: "must be an integer" });
      } else {
        orders.push(step.order as number);
      }
    });
    if (ids.size !== steps.length) {
      issues.push({ path: "content.steps", message: "ids must be unique" });
    }
    if (!hasContiguousOrders(orders, steps.length)) {
      issues.push({ path: "content.steps", message: "order must be contiguous from 1" });
    }
  }

  const transfer = readRecord(content.transfer);
  if (!transfer) {
    issues.push({ path: "content.transfer", message: "must be an object" });
    return issues;
  }
  validateExactKeys(transfer, TRANSFER_KEYS, "content.transfer", issues);
  validateString(transfer.prompt, "content.transfer.prompt", 24, issues);
  const options = Array.isArray(transfer.options) ? transfer.options : null;
  if (!options || options.length < 2 || options.length > 3) {
    issues.push({ path: "content.transfer.options", message: "must contain 2–3 options" });
    return issues;
  }

  const allIds = new Set<string>();
  const stepValues = Array.isArray(content.steps) ? content.steps : [];
  stepValues.forEach((value) => {
    const step = readRecord(value);
    if (typeof step?.id === "string") allIds.add(step.id);
  });
  let supportedCount = 0;
  options.forEach((value, index) => {
    const option = readRecord(value);
    const path = `content.transfer.options[${index}]`;
    if (!option) {
      issues.push({ path, message: "must be an object" });
      return;
    }
    validateExactKeys(option, OPTION_KEYS, path, issues);
    const id = validateStableId(option.id, `${path}.id`, issues);
    if (id && allIds.has(id)) {
      issues.push({ path: `${path}.id`, message: "must be globally unique" });
    }
    if (id) allIds.add(id);
    validateString(option.label, `${path}.label`, 12, issues);
    if (typeof option.isSupported !== "boolean") {
      issues.push({ path: `${path}.isSupported`, message: "must be a boolean" });
    } else if (option.isSupported) {
      supportedCount += 1;
    }
    validateSentence(option.response, `${path}.response`, issues);
    validateSentence(option.takeaway, `${path}.takeaway`, issues);
  });
  if (supportedCount !== 1) {
    issues.push({ path: "content.transfer.options", message: "must have exactly one supported option" });
  }
  return issues;
}

function validateExactKeys(
  value: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: MicrolearningContentIssue[],
): void {
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) {
    issues.push({ path, message: "has unsupported or missing fields" });
  }
}

function validateStableId(
  value: unknown,
  path: string,
  issues: MicrolearningContentIssue[],
): string | null {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/.test(value)) {
    issues.push({ path, message: "must be a stable id" });
    return null;
  }
  return value;
}

function validateString(
  value: unknown,
  path: string,
  maxWords: number,
  issues: MicrolearningContentIssue[],
): void {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "must be a non-empty string" });
  } else if (countWords(value) > maxWords) {
    issues.push({ path, message: `must be ${maxWords} words or fewer` });
  }
}

function validateSentence(
  value: unknown,
  path: string,
  issues: MicrolearningContentIssue[],
): void {
  validateString(value, path, 24, issues);
  if (typeof value === "string" && !isSingleSentence(value)) {
    issues.push({ path, message: "must be one sentence" });
  }
}

function hasContiguousOrders(orders: number[], count: number): boolean {
  if (orders.length !== count) return false;
  return orders.sort((left, right) => left - right).every((order, index) => order === index + 1);
}

function isSingleSentence(value: string): boolean {
  return value.trim().split(/[.!?]+/).filter(Boolean).length === 1;
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}
