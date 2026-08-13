import type {
  ExplorableControl,
  ExplorableInputKey,
  ExplorableModelContent,
  ExplorableValues,
} from "@/src/components/exercise/explorableModelContent";
import type { MicrolearningResponseBase } from "@/src/components/exercise/microlearning/microlearningTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const FORMAT = CourseExerciseCategoryEnum.ExplorableModel;
const RESPONSE_KEYS = [
  "format",
  "phase",
  "stageIndex",
  "isCorrect",
  "values",
  "interactedStageIds",
  "sandboxOpen",
];
const VALUE_KEYS = ["load", "walk", "replay", "coffee"];

export interface ExplorableModelResponse
  extends MicrolearningResponseBase,
    Record<string, unknown> {
  format: CourseExerciseCategoryEnum.ExplorableModel;
  values: ExplorableValues;
  interactedStageIds: string[];
  sandboxOpen: boolean;
}

export function createExplorableModelResponse(
  content: ExplorableModelContent,
  saved: Record<string, unknown> | null = null,
): ExplorableModelResponse {
  const source = saved?.format === FORMAT ? saved : null;
  const values = sanitizeExplorableValues(source?.values, content);
  const interactedStageIds = readInteractedPrefix(source?.interactedStageIds, content);
  const allInteracted = interactedStageIds.length === content.stages.length;
  const requestedPhase = source?.phase;
  const phase = allInteracted
    ? "complete"
    : requestedPhase === "active" || interactedStageIds.length === 0
      ? "active"
      : "feedback";
  const stageIndex = phase === "active"
    ? interactedStageIds.length
    : Math.max(interactedStageIds.length - 1, 0);
  return {
    format: FORMAT,
    phase,
    stageIndex,
    isCorrect: true,
    values,
    interactedStageIds,
    sandboxOpen: phase === "complete" && source?.sandboxOpen === true,
  };
}

export function settleExplorableControl(
  content: ExplorableModelContent,
  response: ExplorableModelResponse,
  stageId: string,
  value: number | boolean,
): ExplorableModelResponse {
  const stageIndex = content.stages.findIndex((stage) => stage.id === stageId);
  const stage = content.stages[stageIndex];
  if (!stage || !canAdjustStage(response, stageIndex)) return response;
  const values = sanitizeExplorableValues(
    { ...response.values, [stage.control.input]: value },
    content,
  );
  if (response.phase === "complete") return { ...response, values };

  const interactedStageIds = response.interactedStageIds.includes(stage.id)
    ? response.interactedStageIds
    : [...response.interactedStageIds, stage.id];
  const complete = interactedStageIds.length === content.stages.length;
  return {
    ...response,
    phase: complete ? "complete" : "feedback",
    stageIndex,
    values,
    interactedStageIds,
    sandboxOpen: false,
  };
}

export function advanceExplorableStage(
  content: ExplorableModelContent,
  response: ExplorableModelResponse,
): ExplorableModelResponse {
  if (response.phase !== "feedback") return response;
  if (response.interactedStageIds.length >= content.stages.length) {
    return { ...response, phase: "complete", stageIndex: content.stages.length - 1 };
  }
  return {
    ...response,
    phase: "active",
    stageIndex: response.interactedStageIds.length,
    sandboxOpen: false,
  };
}

export function openExplorableSandbox(
  response: ExplorableModelResponse,
): ExplorableModelResponse {
  return response.phase === "complete"
    ? { ...response, sandboxOpen: true }
    : response;
}

export function resetExplorableSandbox(
  content: ExplorableModelContent,
  response: ExplorableModelResponse,
): ExplorableModelResponse {
  return response.phase === "complete" && response.sandboxOpen
    ? { ...response, values: { ...content.initialValues } }
    : response;
}

export function sanitizeExplorableValues(
  value: unknown,
  content: ExplorableModelContent,
): ExplorableValues {
  const saved = isRecord(value) ? value : {};
  const slider = content.stages.find((stage) => stage.control.type === "slider")
    ?.control as Extract<ExplorableControl, { type: "slider" }> | undefined;
  const load = typeof saved.load === "number" && Number.isFinite(saved.load)
    ? slider
      ? alignSliderValue(saved.load, slider)
      : Math.round(Math.max(0, Math.min(saved.load, 100)))
    : content.initialValues.load;
  return {
    load,
    walk: typeof saved.walk === "boolean" ? saved.walk : content.initialValues.walk,
    replay: typeof saved.replay === "boolean" ? saved.replay : content.initialValues.replay,
    coffee: typeof saved.coffee === "boolean" ? saved.coffee : content.initialValues.coffee,
  };
}

export function getExplorableBaselineValues(
  content: ExplorableModelContent,
  response: ExplorableModelResponse,
): ExplorableValues {
  if (response.sandboxOpen) return { ...content.initialValues };
  const stage = content.stages[response.stageIndex];
  return stage
    ? { ...response.values, [stage.control.input]: content.initialValues[stage.control.input] }
    : { ...content.initialValues };
}

export function getExplorableControlValueLabel(
  control: ExplorableControl,
  values: ExplorableValues,
): string {
  if (control.type === "slider") return `${values.load}%`;
  return values[control.input] ? control.onLabel : control.offLabel;
}

export function hasSameExplorableModelResponse(
  saved: Record<string, unknown>,
  response: ExplorableModelResponse,
): boolean {
  if (!hasExactKeys(saved, RESPONSE_KEYS) || !hasExactKeys(saved.values, VALUE_KEYS)) return false;
  const values = saved.values as Record<string, unknown>;
  return saved.format === response.format && saved.phase === response.phase &&
    saved.stageIndex === response.stageIndex && saved.isCorrect === response.isCorrect &&
    saved.sandboxOpen === response.sandboxOpen &&
    values.load === response.values.load && values.walk === response.values.walk &&
    values.replay === response.values.replay && values.coffee === response.values.coffee &&
    Array.isArray(saved.interactedStageIds) &&
    saved.interactedStageIds.length === response.interactedStageIds.length &&
    saved.interactedStageIds.every((id, index) => id === response.interactedStageIds[index]);
}

function readInteractedPrefix(
  value: unknown,
  content: ExplorableModelContent,
): string[] {
  if (!Array.isArray(value)) return [];
  const prefix: string[] = [];
  for (const id of value) {
    if (id !== content.stages[prefix.length]?.id) break;
    prefix.push(id);
  }
  return prefix;
}

function canAdjustStage(response: ExplorableModelResponse, stageIndex: number): boolean {
  if (response.phase === "complete") return response.sandboxOpen;
  return response.stageIndex === stageIndex &&
    (response.phase === "active" || response.phase === "feedback");
}

function alignSliderValue(
  value: number,
  control: Extract<ExplorableControl, { type: "slider" }>,
): number {
  if (
    !Number.isFinite(control.min) ||
    !Number.isFinite(control.max) ||
    control.max <= control.min ||
    !Number.isFinite(control.step) ||
    control.step <= 0
  ) {
    return Number.isFinite(control.min) ? control.min : 0;
  }
  const clamped = Math.max(control.min, Math.min(value, control.max));
  const lastStepIndex = Math.max(
    0,
    Math.floor((control.max - control.min) / control.step),
  );
  const stepIndex = Math.max(
    0,
    Math.min(Math.round((clamped - control.min) / control.step), lastStepIndex),
  );
  return control.min + stepIndex * control.step;
}

function hasExactKeys(value: unknown, keys: readonly string[]): boolean {
  return isRecord(value) && Object.keys(value).length === keys.length &&
    Object.keys(value).every((key) => keys.includes(key));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
