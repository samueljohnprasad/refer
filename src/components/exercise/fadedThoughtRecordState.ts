import type {
  FadedThoughtRecordContent,
  ThoughtRecordExample,
  ThoughtRecordOption,
  ThoughtRecordTask,
} from "@/src/components/exercise/fadedThoughtRecordContent";
import type {
  MicrolearningPhase,
  MicrolearningResponseBase,
} from "@/src/components/exercise/microlearning/microlearningTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const FORMAT = CourseExerciseCategoryEnum.FadedThoughtRecord;
export interface FadedThoughtRecordResponse
  extends MicrolearningResponseBase,
    Record<string, unknown> {
  format: CourseExerciseCategoryEnum.FadedThoughtRecord;
  exampleId: string;
  activeFieldId: string | null;
  answersByExampleId: Record<string, Record<string, string>>;
  selectedOptionId: string | null;
  attemptCount: number;
}

export interface FadedThoughtRecordStep {
  example: ThoughtRecordExample;
  task: ThoughtRecordTask;
}

interface FadedThoughtRecordResponseFields {
  phase: MicrolearningPhase;
  stageIndex: number;
  isCorrect: boolean;
  exampleId: string;
  activeFieldId: string | null;
  answersByExampleId: Record<string, Record<string, string>>;
  selectedOptionId: string | null;
  attemptCount: number;
}

export function getFadedThoughtRecordSteps(
  content: FadedThoughtRecordContent,
): FadedThoughtRecordStep[] {
  return content.examples.flatMap((example) =>
    example.activeFieldOrder.map((fieldId) => ({
      example,
      task: example.tasks.find((task) => task.fieldId === fieldId) as ThoughtRecordTask,
    })),
  );
}

export function createFadedThoughtRecordResponse(
  content: FadedThoughtRecordContent,
  saved: Record<string, unknown> | null = null,
): FadedThoughtRecordResponse {
  const source = saved?.format === FORMAT ? saved : null;
  const steps = getFadedThoughtRecordSteps(content);
  const answersByExampleId = readSupportedAnswerPrefix(
    source?.answersByExampleId,
    steps,
  );
  const prefixLength = countAnswers(answersByExampleId);
  const lastIndex = steps.length - 1;
  const attemptCount = clampAttemptCount(source?.attemptCount);
  if (prefixLength === steps.length && source?.phase === "complete") {
    return buildResponse({
      phase: "complete",
      stageIndex: lastIndex,
      isCorrect: true,
      exampleId: steps[lastIndex].example.id,
      activeFieldId: null,
      answersByExampleId,
      selectedOptionId: null,
      attemptCount,
    });
  }
  if (prefixLength === steps.length) {
    return supportedFeedback(steps[lastIndex], lastIndex, answersByExampleId, attemptCount);
  }

  const current = steps[prefixLength];
  const selectedId = source?.selectedOptionId;
  const requestedFeedback = source?.phase === "feedback" || source?.phase === "complete";
  const selectedCurrent = requestedFeedback
    ? current.task.options.find((option) => option.id === selectedId)
    : null;
  if (selectedCurrent && !selectedCurrent.isSupported) {
    return feedbackResponse(
      current,
      prefixLength,
      answersByExampleId,
      selectedCurrent,
      attemptCount,
    );
  }
  const previous = prefixLength > 0 ? steps[prefixLength - 1] : null;
  const previousSupported = previous && requestedFeedback
    ? getSupportedOption(previous.task)
    : null;
  if (previous && previousSupported?.id === selectedId) {
    return supportedFeedback(
      previous,
      prefixLength - 1,
      answersByExampleId,
      attemptCount,
    );
  }
  return buildResponse({
    phase: "active",
    stageIndex: prefixLength,
    isCorrect: false,
    exampleId: current.example.id,
    activeFieldId: current.task.fieldId,
    answersByExampleId,
    selectedOptionId: null,
    attemptCount,
  });
}

export function selectFadedThoughtRecordOption(
  content: FadedThoughtRecordContent,
  response: FadedThoughtRecordResponse,
  optionId: string,
): FadedThoughtRecordResponse {
  if (response.phase !== "active") return response;
  const step = getFadedThoughtRecordSteps(content)[response.stageIndex];
  const option = step?.task.options.find((item) => item.id === optionId);
  if (!step || !option) return response;
  const answersByExampleId = option.isSupported
    ? addAnswer(response.answersByExampleId, step, option.id)
    : response.answersByExampleId;
  return createFadedThoughtRecordResponse(content, {
    ...response,
    phase: "feedback",
    answersByExampleId,
    selectedOptionId: option.id,
    attemptCount: option.isSupported
      ? response.attemptCount
      : response.attemptCount + 1,
  });
}

export function retryFadedThoughtRecord(
  content: FadedThoughtRecordContent,
  response: FadedThoughtRecordResponse,
): FadedThoughtRecordResponse {
  if (response.phase !== "feedback" || response.isCorrect) return response;
  return createFadedThoughtRecordResponse(content, {
    ...response,
    phase: "active",
    selectedOptionId: null,
  });
}

export function advanceFadedThoughtRecord(
  content: FadedThoughtRecordContent,
  response: FadedThoughtRecordResponse,
): FadedThoughtRecordResponse {
  if (response.phase !== "feedback" || !response.isCorrect) return response;
  const steps = getFadedThoughtRecordSteps(content);
  const finalFeedback = response.stageIndex === steps.length - 1;
  return createFadedThoughtRecordResponse(content, {
    ...response,
    phase: finalFeedback ? "complete" : "active",
    selectedOptionId: null,
    attemptCount: finalFeedback ? response.attemptCount : 0,
  });
}

export function getFadedThoughtRecordSelectedOption(
  content: FadedThoughtRecordContent,
  response: FadedThoughtRecordResponse,
): ThoughtRecordOption | null {
  const step = getFadedThoughtRecordSteps(content)[response.stageIndex];
  return step?.task.options.find((option) => option.id === response.selectedOptionId) ?? null;
}

function supportedFeedback(
  step: FadedThoughtRecordStep,
  stageIndex: number,
  answersByExampleId: Record<string, Record<string, string>>,
  attemptCount: number,
): FadedThoughtRecordResponse {
  const option = getSupportedOption(step.task);
  return buildResponse({
    phase: "feedback",
    stageIndex,
    isCorrect: true,
    exampleId: step.example.id,
    activeFieldId: step.task.fieldId,
    answersByExampleId,
    selectedOptionId: option.id,
    attemptCount,
  });
}

function feedbackResponse(
  step: FadedThoughtRecordStep,
  stageIndex: number,
  answersByExampleId: Record<string, Record<string, string>>,
  option: ThoughtRecordOption,
  attemptCount: number,
): FadedThoughtRecordResponse {
  return buildResponse({
    phase: "feedback",
    stageIndex,
    isCorrect: option.isSupported,
    exampleId: step.example.id,
    activeFieldId: step.task.fieldId,
    answersByExampleId,
    selectedOptionId: option.id,
    attemptCount,
  });
}

function readSupportedAnswerPrefix(
  value: unknown,
  steps: readonly FadedThoughtRecordStep[],
): Record<string, Record<string, string>> {
  const source = isRecord(value) ? value : {};
  const answers: Record<string, Record<string, string>> = {};
  for (const step of steps) {
    const savedExample = source[step.example.id];
    const exampleAnswers = isRecord(savedExample) ? savedExample : {};
    const optionId = exampleAnswers[step.task.fieldId];
    const supported = getSupportedOption(step.task);
    if (optionId !== supported.id) break;
    answers[step.example.id] = {
      ...answers[step.example.id],
      [step.task.fieldId]: supported.id,
    };
  }
  return answers;
}

function addAnswer(
  answers: Record<string, Record<string, string>>,
  step: FadedThoughtRecordStep,
  optionId: string,
): Record<string, Record<string, string>> {
  return {
    ...answers,
    [step.example.id]: {
      ...answers[step.example.id],
      [step.task.fieldId]: optionId,
    },
  };
}

function buildResponse(
  value: FadedThoughtRecordResponseFields,
): FadedThoughtRecordResponse {
  return { format: FORMAT, ...value };
}

function getSupportedOption(task: ThoughtRecordTask): ThoughtRecordOption {
  return task.options.find((option) => option.isSupported) as ThoughtRecordOption;
}

function countAnswers(answers: Record<string, Record<string, string>>): number {
  return Object.values(answers).reduce((count, example) => count + Object.keys(example).length, 0);
}

function clampAttemptCount(value: unknown): number {
  return Number.isInteger(value) ? Math.max(0, Math.min(value as number, 99)) : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
