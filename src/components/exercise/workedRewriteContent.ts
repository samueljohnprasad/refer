import type { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";

const ROOT_KEYS = ["title", "instruction", "original", "moves", "recognition"];
const MOVE_KEYS = ["id", "stepLabel", "result", "changedPhrase", "rationale"];
const RECOGNITION_KEYS = ["prompt", "options"];
const OPTION_KEYS = ["id", "label", "isSupported", "feedback"];

export interface WorkedRewriteMove {
  id: string;
  stepLabel: string;
  result: string;
  changedPhrase: string;
  rationale: string;
}

export interface WorkedRewriteOption {
  id: string;
  label: string;
  isSupported: boolean;
  feedback: string;
}

export interface WorkedRewriteRecognition {
  prompt: string;
  options: WorkedRewriteOption[];
}

export interface WorkedRewriteContent {
  title: string;
  instruction: string;
  original: string;
  moves: WorkedRewriteMove[];
  recognition: WorkedRewriteRecognition;
}

export function readWorkedRewriteContent(value: unknown): WorkedRewriteContent | null {
  return isRecord(value) && validateWorkedRewriteContent(value).length === 0
    ? value as unknown as WorkedRewriteContent
    : null;
}

export function validateWorkedRewriteContent(value: unknown): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  if (!isRecord(value)) return [{ path: "content", message: "Must be an object." }];
  validateExactKeys(value, ROOT_KEYS, "content", issues);
  validateText(value.title, "title", 7, issues);
  validateText(value.instruction, "instruction", 12, issues);
  validateText(value.original, "original", 40, issues);
  const ids = new Set<string>();
  const moves = validateArray(value.moves, "moves", 2, 3, issues);
  let preceding = value.original;
  moves?.forEach((move, index) => {
    const path = `moves[${index}]`;
    if (!isRecord(move)) return pushObjectIssue(path, issues);
    validateExactKeys(move, MOVE_KEYS, path, issues);
    validateId(move.id, `${path}.id`, ids, issues);
    validateText(move.stepLabel, `${path}.stepLabel`, 6, issues);
    validateText(move.result, `${path}.result`, 40, issues);
    validateText(move.changedPhrase, `${path}.changedPhrase`, 12, issues);
    validateSentence(move.rationale, `${path}.rationale`, issues);
    if (typeof move.result === "string" && move.result === preceding) {
      issues.push({ path: `${path}.result`, message: "Must differ from the preceding sentence." });
    }
    if (typeof move.result === "string" && typeof move.changedPhrase === "string" &&
      countOccurrences(move.result, move.changedPhrase) !== 1) {
      issues.push({ path: `${path}.changedPhrase`, message: "Must occur exactly once in its result." });
    }
    if (typeof move.result === "string") preceding = move.result;
  });
  validateRecognition(value.recognition, ids, issues);
  return issues;
}

function validateRecognition(value: unknown, ids: Set<string>, issues: MicrolearningContentIssue[]): void {
  if (!isRecord(value)) return pushObjectIssue("recognition", issues);
  validateExactKeys(value, RECOGNITION_KEYS, "recognition", issues);
  validateText(value.prompt, "recognition.prompt", 24, issues);
  const options = validateArray(value.options, "recognition.options", 2, 3, issues);
  let supportedCount = 0;
  options?.forEach((option, index) => {
    const path = `recognition.options[${index}]`;
    if (!isRecord(option)) return pushObjectIssue(path, issues);
    validateExactKeys(option, OPTION_KEYS, path, issues);
    validateId(option.id, `${path}.id`, ids, issues);
    validateText(option.label, `${path}.label`, 12, issues);
    if (typeof option.isSupported !== "boolean") {
      issues.push({ path: `${path}.isSupported`, message: "Must be a boolean." });
    } else if (option.isSupported) supportedCount += 1;
    validateSentence(option.feedback, `${path}.feedback`, issues);
  });
  if (options && supportedCount !== 1) {
    issues.push({ path: "recognition.options", message: "Must have exactly one supported option." });
  }
}

function validateArray(value: unknown, path: string, minimum: number, maximum: number, issues: MicrolearningContentIssue[]): readonly unknown[] | null {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "Must be an array." });
    return null;
  }
  if (value.length < minimum || value.length > maximum) {
    issues.push({ path, message: `Must contain ${minimum}–${maximum} items; found ${value.length}.` });
  }
  return value;
}

function validateExactKeys(value: Record<string, unknown>, keys: readonly string[], path: string, issues: MicrolearningContentIssue[]): void {
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) {
    issues.push({ path, message: "Has unsupported or missing fields." });
  }
}

function validateId(value: unknown, path: string, ids: Set<string>, issues: MicrolearningContentIssue[]): void {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/u.test(value)) {
    issues.push({ path, message: "Must be a stable id." });
  } else if (ids.has(value)) {
    issues.push({ path, message: `Duplicate id "${value}".` });
  } else ids.add(value);
}

function validateSentence(value: unknown, path: string, issues: MicrolearningContentIssue[]): void {
  validateText(value, path, 24, issues);
  if (typeof value === "string" && value.trim().split(/[.!?]+/u).filter(Boolean).length !== 1) {
    issues.push({ path, message: "Must be one sentence." });
  }
}

function validateText(value: unknown, path: string, maxWords: number, issues: MicrolearningContentIssue[]): void {
  if (typeof value !== "string" || !value.trim()) issues.push({ path, message: "Must be a non-empty string." });
  else if (value.trim().split(/\s+/u).filter(Boolean).length > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer.` });
  }
}

function countOccurrences(value: string, phrase: string): number {
  if (!phrase) return 0;
  return value.split(phrase).length - 1;
}

function pushObjectIssue(path: string, issues: MicrolearningContentIssue[]): void {
  issues.push({ path, message: "Must be an object." });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
