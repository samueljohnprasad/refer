import type { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";

const ROOT_KEYS = ["title", "instruction", "layers", "insight", "image"];
const ROOT_REQUIRED_KEYS = ["title", "instruction", "layers", "insight"];
const LAYER_KEYS = ["id", "label", "title", "body"];
const IMAGE_KEYS = ["uri", "accessibilityDescription", "caption"];

export interface LayerZoomLayer { id: string; label: string; title: string; body: string }
export interface LayerZoomImage { uri: string; accessibilityDescription: string; caption?: string }
export interface LayerZoomContent {
  title: string;
  instruction: string;
  layers: LayerZoomLayer[];
  insight: string;
  image?: LayerZoomImage;
}

export function readLayerZoomContent(value: unknown): LayerZoomContent | null {
  return isRecord(value) && validateLayerZoomContent(value).length === 0
    ? value as unknown as LayerZoomContent
    : null;
}

export function validateLayerZoomContent(value: unknown): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  if (!isRecord(value)) return [{ path: "content", message: "Must be an object." }];
  validateExactKeys(value, ROOT_KEYS, ROOT_REQUIRED_KEYS, "content", issues);
  validateText(value.title, "title", 7, issues);
  validateText(value.instruction, "instruction", 12, issues);
  validateSentence(value.insight, "insight", issues);
  const layers = validateArray(value.layers, "layers", 2, 4, issues);
  const ids = new Set<string>();
  layers?.forEach((layer, index) => validateLayer(layer, index, ids, issues));
  if (value.image !== undefined) validateImage(value.image, issues);
  return issues;
}

function validateLayer(value: unknown, index: number, ids: Set<string>, issues: MicrolearningContentIssue[]): void {
  const path = `layers[${index}]`;
  if (!isRecord(value)) return pushObjectIssue(path, issues);
  validateExactKeys(value, LAYER_KEYS, LAYER_KEYS, path, issues);
  validateId(value.id, `${path}.id`, ids, issues);
  validateText(value.label, `${path}.label`, 6, issues);
  validateText(value.title, `${path}.title`, 12, issues);
  validateText(value.body, `${path}.body`, 40, issues);
}

function validateImage(value: unknown, issues: MicrolearningContentIssue[]): void {
  if (!isRecord(value)) return pushObjectIssue("image", issues);
  validateExactKeys(value, IMAGE_KEYS, ["uri", "accessibilityDescription"], "image", issues);
  validateText(value.uri, "image.uri", Number.POSITIVE_INFINITY, issues);
  validateText(value.accessibilityDescription, "image.accessibilityDescription", 24, issues);
  if (value.caption !== undefined) validateText(value.caption, "image.caption", 12, issues);
}

function validateArray(value: unknown, path: string, minimum: number, maximum: number, issues: MicrolearningContentIssue[]): unknown[] | null {
  if (!Array.isArray(value)) { issues.push({ path, message: "Must be an array." }); return null; }
  if (value.length < minimum || value.length > maximum) issues.push({ path, message: `Must contain ${minimum}–${maximum} items; found ${value.length}.` });
  return value;
}

function validateExactKeys(value: Record<string, unknown>, allowed: readonly string[], required: readonly string[], path: string, issues: MicrolearningContentIssue[]): void {
  const keys = Object.keys(value);
  if (keys.some((key) => !allowed.includes(key)) || required.some((key) => !keys.includes(key))) issues.push({ path, message: "Has unsupported or missing fields." });
}

function validateId(value: unknown, path: string, ids: Set<string>, issues: MicrolearningContentIssue[]): void {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/u.test(value)) issues.push({ path, message: "Must be a stable id." });
  else if (ids.has(value)) issues.push({ path, message: `Duplicate id \"${value}\".` });
  else ids.add(value);
}

function validateSentence(value: unknown, path: string, issues: MicrolearningContentIssue[]): void {
  validateText(value, path, 24, issues);
  if (typeof value === "string" && value.trim().split(/[.!?]+/u).filter(Boolean).length !== 1) issues.push({ path, message: "Must be one sentence." });
}

function validateText(value: unknown, path: string, maxWords: number, issues: MicrolearningContentIssue[]): void {
  if (typeof value !== "string" || !value.trim()) issues.push({ path, message: "Must be a non-empty string." });
  else if (value.trim().split(/\s+/u).filter(Boolean).length > maxWords) issues.push({ path, message: `Must be ${maxWords} words or fewer.` });
}

function pushObjectIssue(path: string, issues: MicrolearningContentIssue[]): void { issues.push({ path, message: "Must be an object." }); }
function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
