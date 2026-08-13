import { readRecord, readString } from "@/src/components/exercise/courseExerciseContent";
import type { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";

export interface DiscoveryOption {
  id: string;
  label: string;
  response: string;
}

export interface DiscoveryQuestion {
  id: string;
  prompt: string;
  summary: string;
  options: DiscoveryOption[];
}

export interface GuidedDiscoveryTrailContent {
  questions: DiscoveryQuestion[];
  stamp: string;
}

export function readGuidedDiscoveryTrailContent(
  value: unknown,
): GuidedDiscoveryTrailContent | null {
  const content = readRecord(value);
  const questions = readDiscoveryQuestions(content?.questions);
  const stamp = readString(content?.stamp);
  return questions.length > 0 && stamp ? { questions, stamp } : null;
}

export function readDiscoveryQuestions(value: unknown): DiscoveryQuestion[] {
  const issues: MicrolearningContentIssue[] = [];
  validateDiscoveryQuestions(value, issues);
  if (issues.length > 0 || !Array.isArray(value)) return [];
  return value.map((question) => {
    const record = question as Record<string, unknown>;
    return {
      id: record.id as string,
      prompt: record.prompt as string,
      summary: record.summary as string,
      options: (record.options as Record<string, unknown>[]).map((option) => ({
        id: option.id as string,
        label: option.label as string,
        response: option.response as string,
      })),
    };
  });
}

export function validateGuidedDiscoveryTrailContent(
  content: Record<string, unknown>,
  issues: MicrolearningContentIssue[],
): void {
  validateDiscoveryQuestions(content.questions, issues);
  validateText(content.stamp, "stamp", 24, issues);
}

export function validateDiscoveryQuestions(
  value: unknown,
  issues: MicrolearningContentIssue[],
): void {
  if (!Array.isArray(value)) {
    issues.push({ path: "questions", message: "Must be an array." });
    return;
  }
  if (value.length < 3 || value.length > 4) {
    issues.push({
      path: "questions",
      message: `Must contain 3–4 items; found ${value.length}.`,
    });
  }

  const ids = new Set<string>();
  value.forEach((item, questionIndex) => {
    const path = `questions[${questionIndex}]`;
    const question = readRecord(item);
    if (!question || !hasOnlyKeys(question, ["id", "prompt", "summary", "options"])) {
      issues.push({ path, message: "Must use only id, prompt, summary, and options." });
      return;
    }
    validateId(question.id, `${path}.id`, ids, issues);
    validateText(question.prompt, `${path}.prompt`, 24, issues);
    validateText(question.summary, `${path}.summary`, 12, issues);
    validateOptions(question.options, `${path}.options`, ids, issues);
  });
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
    if (!option || !hasOnlyKeys(option, ["id", "label", "response"])) {
      issues.push({ path: optionPath, message: "Must use only id, label, and response." });
      return;
    }
    validateId(option.id, `${optionPath}.id`, ids, issues);
    validateText(option.label, `${optionPath}.label`, 12, issues);
    validateText(option.response, `${optionPath}.response`, 24, issues);
    if (typeof option.response === "string" && !isSingleSentence(option.response)) {
      issues.push({ path: `${optionPath}.response`, message: "Must be one sentence." });
    }
  });
}

function validateId(
  value: unknown,
  path: string,
  ids: Set<string>,
  issues: MicrolearningContentIssue[],
): void {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "Must be a non-empty string." });
  } else if (ids.has(value)) {
    issues.push({ path, message: `Duplicate id \"${value}\".` });
  } else {
    ids.add(value);
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

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => key in value);
}

function isSingleSentence(value: string): boolean {
  return value.trim().split(/[.!?]+/u).filter(Boolean).length === 1;
}
