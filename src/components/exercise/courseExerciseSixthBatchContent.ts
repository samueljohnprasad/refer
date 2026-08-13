import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";

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
