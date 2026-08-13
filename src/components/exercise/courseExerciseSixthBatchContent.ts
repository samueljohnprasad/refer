import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";

export interface TeachBackStep {
  id: string;
  label: string;
  order: number;
}

export interface TeachBackFollowUp {
  label: string;
  reply: string;
  takeaway: string;
}

export interface RecallCard {
  answer: string;
  question: string;
}

export interface FillBlankVariant {
  answers: string[];
  exampleWords: string[];
  post: string;
  pre: string;
  correctFeedback: string;
  incorrectFeedback: string;
  workedExample: string;
}

export function readTeachBackSteps(value: unknown): TeachBackStep[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const step = readRecord(item);
    const id = readString(step?.id);
    const label = readString(step?.label);
    const order = readPositiveNumber(step?.order);
    return id && label && order ? [{ id, label, order }] : [];
  });
}

export function readTeachBackFollowUps(value: unknown): TeachBackFollowUp[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const option = readRecord(item);
    const label = readString(option?.label);
    const reply = readString(option?.reply);
    const takeaway = readString(option?.takeaway);
    return label && reply && takeaway ? [{ label, reply, takeaway }] : [];
  });
}

export function readRecallCards(value: unknown): RecallCard[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const card = readRecord(item);
    const question = readString(card?.question);
    const answer = readString(card?.answer);
    return question && answer ? [{ question, answer }] : [];
  });
}

export function readFillBlankVariants(value: unknown): FillBlankVariant[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const variant = readRecord(item);
    const pre = readString(variant?.pre);
    const post = readString(variant?.post);
    const correctFeedback = readString(variant?.correctFeedback);
    const incorrectFeedback = readString(variant?.incorrectFeedback);
    const workedExample = readString(variant?.workedExample);
    const answers = readStringArray(variant?.answers);
    const exampleWords = readStringArray(variant?.exampleWords);
    return pre &&
      post &&
      correctFeedback &&
      incorrectFeedback &&
      workedExample &&
      answers.length
      ? [
          {
            pre,
            post,
            correctFeedback,
            incorrectFeedback,
            workedExample,
            answers,
            exampleWords,
          },
        ]
      : [];
  });
}

function readPositiveNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null;
}
