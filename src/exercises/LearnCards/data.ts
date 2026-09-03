import {
  readCourseExerciseOptions,
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { Exercise } from "@/src/types/journeyV5";

export interface LearningCard {
  id: string;
  kicker: string | null;
  title: string;
  body: string;
  primaryLabel: string | null;
}

export interface LearnCardsData {
  title: string;
  instruction: string | null;
  cards: LearningCard[];
  recall: {
    instruction: string | null;
    prompt: string | null;
    correctOptionId: string | null;
    options: ReturnType<typeof readCourseExerciseOptions>;
  } | null;
}

export function readLearnCardsData(exercise: Exercise): LearnCardsData {
  const content = exercise.content ?? {};
  const recall = readRecord(content.recall);
  return {
    title: readString(content.title) ?? "Learn the idea",
    instruction: readString(content.instruction),
    cards: readCards(content.cards),
    recall: recall ? {
      instruction: readString(recall.instruction),
      prompt: readString(recall.prompt),
      correctOptionId: readString(recall.correctOptionId),
      options: readCourseExerciseOptions(recall.options),
    } : null,
  };
}

export function readLearnCardsResponse(response: unknown) {
  const saved = readRecord(response);
  return {
    cardIndex: readNumber(saved?.cardIndex) ?? 0,
    phase: readString(saved?.phase) ?? "cards",
    selectedOptionId: readString(saved?.selectedOptionId),
  };
}

export function hasSelectedRecallFeedback(exercise: Exercise, response: unknown) {
  const data = readLearnCardsData(exercise);
  const selectedId = readLearnCardsResponse(response).selectedOptionId;
  return data.recall?.options.some(
    (option) => option.id === selectedId && Boolean(option.feedback),
  ) ?? false;
}

function readCards(value: unknown): LearningCard[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((value, index) => {
    const card = readRecord(value);
    const title = readString(card?.title);
    const body = readString(card?.body);
    if (!card || !title || !body) return [];
    return [{
      id: readString(card.id) ?? `card-${index}`,
      kicker: readString(card.kicker),
      title,
      body,
      primaryLabel: readString(card.primaryLabel),
    }];
  });
}
