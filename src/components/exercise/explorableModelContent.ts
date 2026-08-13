import type { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";

export type ExplorableInputKey = "load" | "walk" | "replay" | "coffee";

export interface ExplorableValues {
  load: number;
  walk: boolean;
  replay: boolean;
  coffee: boolean;
}

export type ExplorableControl =
  | {
      type: "slider";
      input: "load";
      label: string;
      accessibilityLabel: string;
      min: number;
      max: number;
      step: number;
    }
  | {
      type: "toggle";
      input: Exclude<ExplorableInputKey, "load">;
      label: string;
      accessibilityLabel: string;
      onLabel: string;
      offLabel: string;
    };

export interface ExplorableStage {
  id: string;
  prompt: string;
  summaryLabel: string;
  control: ExplorableControl;
}

export interface ExplorableModelContent {
  title: string;
  instruction: string;
  setup: string;
  model: "maya_alarm";
  chartAccessibilityLabel: string;
  initialValues: ExplorableValues;
  stages: ExplorableStage[];
  sandboxPrompt: string;
}

export function readExplorableModelContent(
  value: unknown,
): ExplorableModelContent | null {
  if (validateExplorableModelContent(value).length > 0 || !isRecord(value)) {
    return null;
  }
  const initialValues = value.initialValues as Record<string, unknown>;
  return {
    title: value.title as string,
    instruction: value.instruction as string,
    setup: value.setup as string,
    model: "maya_alarm",
    chartAccessibilityLabel: value.chartAccessibilityLabel as string,
    initialValues: {
      load: initialValues.load as number,
      walk: initialValues.walk as boolean,
      replay: initialValues.replay as boolean,
      coffee: initialValues.coffee as boolean,
    },
    stages: (value.stages as Record<string, unknown>[]).map(readStage),
    sandboxPrompt: value.sandboxPrompt as string,
  };
}

function readStage(value: Record<string, unknown>): ExplorableStage {
  const control = value.control as Record<string, unknown>;
  return {
    id: value.id as string,
    prompt: value.prompt as string,
    summaryLabel: value.summaryLabel as string,
    control: control.type === "slider"
      ? {
          type: "slider",
          input: "load",
          label: control.label as string,
          accessibilityLabel: control.accessibilityLabel as string,
          min: control.min as number,
          max: control.max as number,
          step: control.step as number,
        }
      : {
          type: "toggle",
          input: control.input as Exclude<ExplorableInputKey, "load">,
          label: control.label as string,
          accessibilityLabel: control.accessibilityLabel as string,
          onLabel: control.onLabel as string,
          offLabel: control.offLabel as string,
        },
  };
}

const ROOT_KEYS = ["title", "instruction", "setup", "model", "chartAccessibilityLabel", "initialValues", "stages", "sandboxPrompt"];
const VALUE_KEYS = ["load", "walk", "replay", "coffee"];
const STAGE_KEYS = ["id", "prompt", "summaryLabel", "control"];
const SLIDER_KEYS = ["type", "input", "label", "accessibilityLabel", "min", "max", "step"];
const TOGGLE_KEYS = ["type", "input", "label", "accessibilityLabel", "onLabel", "offLabel"];
const TOGGLE_INPUTS = new Set(["walk", "replay", "coffee"]);

export function validateExplorableModelContent(
  value: unknown,
): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  if (!isRecord(value)) return [{ path: "content", message: "Must be an object." }];
  validateExactKeys(value, ROOT_KEYS, "content", issues);
  validateText(value.title, "title", 7, issues);
  validateText(value.instruction, "instruction", 12, issues);
  validateText(value.setup, "setup", 40, issues);
  validateText(value.chartAccessibilityLabel, "chartAccessibilityLabel", 12, issues);
  validateText(value.sandboxPrompt, "sandboxPrompt", 24, issues);
  if (value.model !== "maya_alarm") issues.push({ path: "model", message: "Must be maya_alarm." });

  const initialValues = validateInitialValues(value.initialValues, issues);
  if (!Array.isArray(value.stages)) {
    issues.push({ path: "stages", message: "Must be an array." });
    return issues;
  }
  if (value.stages.length < 2 || value.stages.length > 3) {
    issues.push({ path: "stages", message: `Must contain 2–3 items; found ${value.stages.length}.` });
  }
  const stageIds = new Set<string>();
  const inputs = new Set<string>();
  let slider: Record<string, unknown> | null = null;
  value.stages.forEach((stageValue, index) => {
    const path = `stages[${index}]`;
    if (!isRecord(stageValue)) {
      issues.push({ path, message: "Must be an object." });
      return;
    }
    validateExactKeys(stageValue, STAGE_KEYS, path, issues);
    validateStableId(stageValue.id, `${path}.id`, stageIds, issues);
    validateText(stageValue.prompt, `${path}.prompt`, 24, issues);
    validateText(stageValue.summaryLabel, `${path}.summaryLabel`, 12, issues);
    const control = validateControl(stageValue.control, `${path}.control`, inputs, issues);
    if (control?.type === "slider") slider = control;
  });
  validateInitialSliderValue(initialValues, slider, issues);
  return issues;
}

function validateInitialValues(value: unknown, issues: MicrolearningContentIssue[]): ExplorableValues | null {
  if (!isRecord(value)) {
    issues.push({ path: "initialValues", message: "Must be an object." });
    return null;
  }
  validateExactKeys(value, VALUE_KEYS, "initialValues", issues);
  if (!isDomainInteger(value.load)) {
    issues.push({ path: "initialValues.load", message: "Must be an integer from 0 to 100." });
  }
  for (const input of ["walk", "replay", "coffee"] as const) {
    if (typeof value[input] !== "boolean") {
      issues.push({ path: `initialValues.${input}`, message: "Must be a boolean." });
    }
  }
  return isDomainInteger(value.load) && typeof value.walk === "boolean" &&
    typeof value.replay === "boolean" && typeof value.coffee === "boolean"
    ? (value as unknown as ExplorableValues)
    : null;
}

function validateControl(
  value: unknown,
  path: string,
  inputs: Set<string>,
  issues: MicrolearningContentIssue[],
): Record<string, unknown> | null {
  if (!isRecord(value)) {
    issues.push({ path, message: "Must be an object." });
    return null;
  }
  if (value.type === "slider") {
    validateExactKeys(value, SLIDER_KEYS, path, issues);
    if (value.input !== "load") issues.push({ path: `${path}.input`, message: "Slider input must be load." });
    validateSliderNumbers(value, path, issues);
  } else if (value.type === "toggle") {
    validateExactKeys(value, TOGGLE_KEYS, path, issues);
    if (typeof value.input !== "string" || !TOGGLE_INPUTS.has(value.input)) {
      issues.push({ path: `${path}.input`, message: "Toggle input must be walk, replay, or coffee." });
    }
    validateText(value.onLabel, `${path}.onLabel`, 12, issues);
    validateText(value.offLabel, `${path}.offLabel`, 12, issues);
  } else issues.push({ path: `${path}.type`, message: "Must be slider or toggle." });
  validateText(value.label, `${path}.label`, 12, issues);
  validateText(value.accessibilityLabel, `${path}.accessibilityLabel`, 12, issues);
  if (typeof value.input === "string") {
    if (inputs.has(value.input)) issues.push({ path: `${path}.input`, message: `Duplicate control input "${value.input}".` });
    else inputs.add(value.input);
  }
  return value;
}

function validateSliderNumbers(value: Record<string, unknown>, path: string, issues: MicrolearningContentIssue[]): void {
  for (const key of ["min", "max", "step"] as const) {
    if (!Number.isInteger(value[key])) issues.push({ path: `${path}.${key}`, message: "Must be a finite integer." });
  }
  if (!(Number.isInteger(value.min) && Number.isInteger(value.max) &&
    (value.min as number) >= 0 && (value.max as number) <= 100 && (value.min as number) < (value.max as number))) {
    issues.push({ path, message: "Slider range must satisfy 0 <= min < max <= 100." });
  }
  if (!Number.isInteger(value.step) || (value.step as number) <= 0) {
    issues.push({ path: `${path}.step`, message: "Must be positive." });
  }
}

function validateInitialSliderValue(
  initialValues: ExplorableValues | null,
  slider: Record<string, unknown> | null,
  issues: MicrolearningContentIssue[],
): void {
  if (!initialValues || !slider || !Number.isInteger(slider.min) || !Number.isInteger(slider.max) ||
    !Number.isInteger(slider.step) || (slider.step as number) <= 0) return;
  const min = slider.min as number;
  const max = slider.max as number;
  const step = slider.step as number;
  if (initialValues.load < min || initialValues.load > max || !isStepAligned(initialValues.load, min, step)) {
    issues.push({ path: "initialValues.load", message: "Must be inside and aligned to the authored slider range." });
  }
}

function validateExactKeys(value: Record<string, unknown>, keys: readonly string[], path: string, issues: MicrolearningContentIssue[]): void {
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) {
    issues.push({ path, message: "Has unsupported or missing fields." });
  }
}

function validateStableId(value: unknown, path: string, ids: Set<string>, issues: MicrolearningContentIssue[]): void {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/u.test(value)) {
    issues.push({ path, message: "Must be a stable id." });
  } else if (ids.has(value)) issues.push({ path, message: `Duplicate id "${value}".` });
  else ids.add(value);
}

function validateText(value: unknown, path: string, maxWords: number, issues: MicrolearningContentIssue[]): void {
  if (typeof value !== "string" || !value.trim()) issues.push({ path, message: "Must be a non-empty string." });
  else if (value.trim().split(/\s+/u).filter(Boolean).length > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer.` });
  }
}

function isDomainInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 100;
}

function isStepAligned(value: number, min: number, step: number): boolean {
  return Math.abs((value - min) / step - Math.round((value - min) / step)) < 1e-9;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
