import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import { validateTeachBackChainContent } from "@/src/components/exercise/teachBackChainValidation";
import type { MicrolearningResponseBase } from "@/src/components/exercise/microlearning/microlearningTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export interface TeachBackStep {
  id: string;
  label: string;
  order: number;
}

export interface TeachBackOption {
  id: string;
  label: string;
  isSupported: boolean;
  response: string;
  takeaway: string;
}

export interface TeachBackTransfer {
  prompt: string;
  options: TeachBackOption[];
}

export interface TeachBackChainContent {
  title: string;
  instruction: string;
  message: string;
  steps: TeachBackStep[];
  transfer: TeachBackTransfer;
}

export interface TeachBackChainResponse
  extends MicrolearningResponseBase,
    Record<string, unknown> {
  format: CourseExerciseCategoryEnum.TeachBackChain;
  orderedStepIds: string[];
  selectedStepId: string | null;
  mode: "chain" | "transfer";
  selectedTransferOptionId: string | null;
  attemptCount: number;
  feedbackText: string | null;
}

export function readTeachBackChainContent(
  value: unknown,
): TeachBackChainContent | null {
  const content = readRecord(value);
  if (!content || validateTeachBackChainContent(content).length > 0) return null;
  const transfer = content.transfer as Record<string, unknown>;
  return {
    title: content.title as string,
    instruction: content.instruction as string,
    message: content.message as string,
    steps: (content.steps as Record<string, unknown>[]).map((step) => ({
      id: step.id as string,
      label: step.label as string,
      order: step.order as number,
    })),
    transfer: {
      prompt: transfer.prompt as string,
      options: (transfer.options as Record<string, unknown>[]).map((option) => ({
        id: option.id as string,
        label: option.label as string,
        isSupported: option.isSupported as boolean,
        response: option.response as string,
        takeaway: option.takeaway as string,
      })),
    },
  };
}

export function createTeachBackChainResponse(
  content: TeachBackChainContent,
  saved: Record<string, unknown> | null = null,
): TeachBackChainResponse {
  const source = saved?.format === CourseExerciseCategoryEnum.TeachBackChain
    ? saved
    : null;
  const orderedStepIds = sanitizeOrderedStepIds(source?.orderedStepIds, content.steps);
  if (orderedStepIds.length !== content.steps.length) {
    return createChainResponse(content, source, orderedStepIds);
  }
  return source?.mode === "transfer"
    ? createTransferResponse(content, source, orderedStepIds)
    : createChainCompleteResponse(content, orderedStepIds);
}

export function getOrderedTeachBackSteps(
  content: TeachBackChainContent,
): TeachBackStep[] {
  return [...content.steps].sort((left, right) => left.order - right.order);
}

export function getTeachBackTransferFeedback(
  content: TeachBackChainContent,
  response: TeachBackChainResponse,
): TeachBackOption | null {
  const option = content.transfer.options.find(
    (item) => item.id === response.selectedTransferOptionId,
  );
  if (!option) return null;
  if (!option.isSupported && response.phase === "complete" && response.attemptCount === 2) {
    return content.transfer.options.find((item) => item.isSupported) ?? null;
  }
  return option;
}

export function hasSameTeachBackChainResponse(
  saved: Record<string, unknown>,
  response: TeachBackChainResponse,
): boolean {
  return (
    saved.format === response.format &&
    saved.phase === response.phase &&
    saved.stageIndex === response.stageIndex &&
    saved.isCorrect === response.isCorrect &&
    saved.mode === response.mode &&
    saved.selectedStepId === response.selectedStepId &&
    saved.selectedTransferOptionId === response.selectedTransferOptionId &&
    saved.attemptCount === response.attemptCount &&
    saved.feedbackText === response.feedbackText &&
    Array.isArray(saved.orderedStepIds) &&
    saved.orderedStepIds.length === response.orderedStepIds.length &&
    saved.orderedStepIds.every((id, index) => id === response.orderedStepIds[index])
  );
}

export function getTeachBackChainHint(
  content: TeachBackChainContent,
  orderedStepIds: readonly string[],
): string {
  const steps = getOrderedTeachBackSteps(content);
  const previous = steps[orderedStepIds.length - 1];
  const expected = steps[orderedStepIds.length];
  return previous
    ? `After “${previous.label}”, choose “${expected?.label}”.`
    : `Start with “${expected?.label}”.`;
}

function createChainResponse(
  content: TeachBackChainContent,
  source: Record<string, unknown> | null,
  orderedStepIds: string[],
): TeachBackChainResponse {
  const remainingIds = content.steps
    .filter((step) => !orderedStepIds.includes(step.id))
    .map((step) => step.id);
  const selectedStepId = readSelectedId(source?.selectedStepId, remainingIds);
  const expected = getOrderedTeachBackSteps(content)[orderedStepIds.length];
  const wrongStep = selectedStepId !== null && selectedStepId !== expected?.id;
  return {
    format: CourseExerciseCategoryEnum.TeachBackChain,
    phase: "active",
    stageIndex: orderedStepIds.length,
    isCorrect: !wrongStep,
    orderedStepIds,
    selectedStepId,
    mode: "chain",
    selectedTransferOptionId: null,
    attemptCount: 0,
    feedbackText: wrongStep ? getTeachBackChainHint(content, orderedStepIds) : null,
  };
}

function createChainCompleteResponse(
  content: TeachBackChainContent,
  orderedStepIds: string[],
): TeachBackChainResponse {
  return {
    format: CourseExerciseCategoryEnum.TeachBackChain,
    phase: "active",
    stageIndex: content.steps.length - 1,
    isCorrect: true,
    orderedStepIds,
    selectedStepId: null,
    mode: "chain",
    selectedTransferOptionId: null,
    attemptCount: 0,
    feedbackText: null,
  };
}

function createTransferResponse(
  content: TeachBackChainContent,
  source: Record<string, unknown>,
  orderedStepIds: string[],
): TeachBackChainResponse {
  const selectedTransferOptionId = readSelectedId(
    source.selectedTransferOptionId,
    content.transfer.options.map((option) => option.id),
  );
  const option = content.transfer.options.find(
    (item) => item.id === selectedTransferOptionId,
  );
  const savedAttemptCount = clampAttemptCount(source.attemptCount);
  const attemptCount = !option
    ? Math.min(savedAttemptCount, 1)
    : option.isSupported
      ? savedAttemptCount
      : Math.max(1, savedAttemptCount);
  const complete = Boolean(option?.isSupported) || Boolean(option) && attemptCount === 2;
  const response: TeachBackChainResponse = {
    format: CourseExerciseCategoryEnum.TeachBackChain,
    phase: complete ? "complete" : option ? "feedback" : "active",
    stageIndex: content.steps.length - 1,
    isCorrect: Boolean(option?.isSupported),
    orderedStepIds,
    selectedStepId: null,
    mode: "transfer",
    selectedTransferOptionId,
    attemptCount,
    feedbackText: null,
  };
  return { ...response, feedbackText: getTeachBackTransferFeedback(content, response)?.response ?? null };
}

function sanitizeOrderedStepIds(value: unknown, steps: readonly TeachBackStep[]): string[] {
  if (!Array.isArray(value)) return [];
  const ordered = [...steps].sort((left, right) => left.order - right.order);
  const prefix: string[] = [];
  for (const id of value) {
    if (typeof id !== "string" || ordered[prefix.length]?.id !== id) break;
    prefix.push(id);
  }
  return prefix;
}

function readSelectedId(value: unknown, validIds: readonly string[]): string | null {
  return typeof value === "string" && validIds.includes(value) ? value : null;
}

function clampAttemptCount(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value)
    ? Math.max(0, Math.min(value, 2))
    : 0;
}

export { validateTeachBackChainContent } from "@/src/components/exercise/teachBackChainValidation";
