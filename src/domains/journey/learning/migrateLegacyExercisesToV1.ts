import type { Exercise, GetCourseTreeResponse } from "@/src/types/journeyV5";
import {
  V1ExerciseCategoryEnum,
  V1LearningFormatEnum,
} from "@/src/types/journeyLearning";

type LegacyOption = {
  id: string;
  label: string;
  correct: boolean;
  feedback?: string;
};

type V1Content = Record<string, unknown>;

const SUPPORTED_V1_TYPES = new Set<string>([
  V1LearningFormatEnum.GuidedRecall,
  V1LearningFormatEnum.ScenarioWhy,
  V1LearningFormatEnum.CloseDiscrimination,
]);

// ponytail: mock-only bridge until authored courses are stored as v1 content.
export function migrateLegacyCourseTreeToV1(
  courseTree: GetCourseTreeResponse,
): GetCourseTreeResponse {
  return {
    ...courseTree,
    exercises: courseTree.exercises.map(migrateLegacyExerciseToV1),
  };
}

export function migrateLegacyExerciseToV1(exercise: Exercise): Exercise {
  if (SUPPORTED_V1_TYPES.has(exercise.type)) {
    return exercise;
  }

  switch (exercise.type) {
    case "multiple_choice":
    case "scenario":
      return toCloseDiscrimination(exercise, readLegacyOptions(exercise));
    case "true_false":
      return toCloseDiscrimination(exercise, readTrueFalseOptions(exercise));
    case "fill_in_the_blank":
      return toGuidedRecall(exercise, readFillBlankChips(exercise));
    case "ordering":
      return toGuidedRecall(exercise, readOrderingChips(exercise));
    case "matching":
      return toGuidedRecall(exercise, readMatchingChips(exercise));
    case "learn_cards":
      return toTakeawayCheck(exercise, readLearnCardPrompt(exercise));
    case "guided_response":
    case "free_text":
      return toTakeawayCheck(exercise, readReflectionPrompt(exercise));
    case "rating_check":
    case "slider_rating":
      return toTakeawayCheck(exercise, readString(exercise.content?.prompt));
    default:
      return toTakeawayCheck(exercise, readString(exercise.content?.prompt));
  }
}

function toCloseDiscrimination(
  exercise: Exercise,
  options: LegacyOption[],
): Exercise {
  const safeOptions = options.length > 0 ? options : defaultOptions();
  const correctOption = safeOptions.find((option) => option.correct) ?? safeOptions[0];
  const feedbackCorrect =
    readString(exercise.content?.feedback_correct) ??
    correctOption.feedback ??
    "Yes. That matches the main idea.";
  const feedbackIncorrect =
    readString(exercise.content?.feedback_incorrect) ??
    firstIncorrectFeedback(safeOptions) ??
    readString(exercise.content?.explanation) ??
    "Try the option that matches the lesson idea.";

  return withV1Content(exercise, V1LearningFormatEnum.CloseDiscrimination, {
    title: readTitle(exercise, "Choose the best answer"),
    prompt: readPrompt(exercise),
    options: safeOptions.map((option) => ({
      id: option.id,
      label: option.label,
      misconceptionCode: option.correct ? undefined : `${exercise.type}_${option.id}`,
    })),
    correctOptionId: correctOption.id,
    easierOptionIds: safeOptions
      .filter((option) => option.correct)
      .map((option) => option.id),
    feedback_correct: feedbackCorrect,
    feedback_incorrect: feedbackIncorrect,
    support: buildSupport(exercise, feedbackIncorrect, feedbackCorrect),
    maxAttempts: 3,
  });
}

function toGuidedRecall(
  exercise: Exercise,
  chips: Array<{ id: string; text: string; correct: boolean }>,
): Exercise {
  const safeChips =
    chips.length > 0
      ? chips
      : [
          { id: "main", text: "main idea", correct: true },
          { id: "detail", text: "one detail", correct: true },
        ];
  const answerChipIds = safeChips
    .filter((chip) => chip.correct)
    .map((chip) => chip.id);
  const feedbackCorrect =
    readString(exercise.content?.feedback_correct) ??
    "Yes. You rebuilt the idea.";
  const feedbackIncorrect =
    readString(exercise.content?.feedback_incorrect) ??
    "Use the words that make the lesson rule true.";

  return withV1Content(exercise, V1LearningFormatEnum.GuidedRecall, {
    title: readTitle(exercise, "Build the idea"),
    prompt: readPrompt(exercise),
    chips: safeChips.map((chip) => ({ id: chip.id, text: chip.text })),
    answerChipIds,
    easierOptionIds: answerChipIds,
    feedback_correct: feedbackCorrect,
    feedback_incorrect: feedbackIncorrect,
    support: buildSupport(exercise, feedbackIncorrect, feedbackCorrect),
    maxAttempts: 3,
  });
}

function toTakeawayCheck(exercise: Exercise, prompt: string | null): Exercise {
  return toCloseDiscrimination(
    {
      ...exercise,
      content: {
        ...exercise.content,
        prompt: prompt ?? "What is the useful takeaway?",
        feedback_correct:
          readString(exercise.content?.feedback_correct) ??
          "Good. Keep this as one simple takeaway.",
        feedback_incorrect:
          readString(exercise.content?.feedback_incorrect) ??
          "This lesson is for learning one useful idea, not diagnosing yourself.",
      },
    },
    [
      {
        id: "useful_takeaway",
        label: "I can name one useful takeaway.",
        correct: true,
      },
      {
        id: "self_diagnose",
        label: "I need to diagnose myself now.",
        correct: false,
      },
      {
        id: "ignore_context",
        label: "This idea never depends on context.",
        correct: false,
      },
    ],
  );
}

function withV1Content(
  exercise: Exercise,
  format: V1LearningFormatEnum,
  content: V1Content,
): Exercise {
  const category =
    format === V1LearningFormatEnum.GuidedRecall
      ? V1ExerciseCategoryEnum.Recall
      : format === V1LearningFormatEnum.ScenarioWhy
        ? V1ExerciseCategoryEnum.Scenario
        : V1ExerciseCategoryEnum.Discrimination;

  return {
    ...exercise,
    type: format,
    content: {
      ...content,
      format,
      category,
      sourceLegacyType: exercise.type,
    },
  };
}

function readLegacyOptions(exercise: Exercise): LegacyOption[] {
  const content = readRecord(exercise.content);
  const options = readArray(content?.options);

  return options
    .map(readRecord)
    .filter((option): option is Record<string, unknown> => Boolean(option))
    .map((option, index) => ({
      id: readString(option.id) ?? `option_${index + 1}`,
      label: readString(option.text) ?? readString(option.label) ?? "",
      correct: option.correct === true,
      feedback: readString(option.feedback) ?? undefined,
    }))
    .filter((option) => option.label.length > 0)
    .slice(0, 3);
}

function readTrueFalseOptions(exercise: Exercise): LegacyOption[] {
  const correct = exercise.content?.correct === true;
  const explanation = readString(exercise.content?.explanation);

  return [
    {
      id: "true",
      label: "True",
      correct,
      feedback: correct ? explanation ?? undefined : undefined,
    },
    {
      id: "false",
      label: "False",
      correct: !correct,
      feedback: !correct ? explanation ?? undefined : undefined,
    },
  ];
}

function readFillBlankChips(
  exercise: Exercise,
): Array<{ id: string; text: string; correct: boolean }> {
  const options = readArray(exercise.content?.options)
    .map(readRecord)
    .filter((option): option is Record<string, unknown> => Boolean(option));
  const sortedOptions = [...options].sort((left, right) =>
    compareTarget(left.target, right.target),
  );

  return sortedOptions.map((option, index) => ({
    id: readString(option.id) ?? `blank_${index + 1}`,
    text: readString(option.text) ?? "",
    correct: true,
  })).filter((chip) => chip.text.length > 0);
}

function readOrderingChips(
  exercise: Exercise,
): Array<{ id: string; text: string; correct: boolean }> {
  const items = readArray(exercise.content?.items)
    .map(readRecord)
    .filter((item): item is Record<string, unknown> => Boolean(item));
  const itemById = new Map(
    items.map((item, index) => [String(item.id ?? index), item]),
  );
  const order = readArray(exercise.content?.correct_order).map((id) => String(id));
  const orderedItems =
    order.length > 0
      ? order.map((id) => itemById.get(id)).filter(Boolean)
      : items;

  return orderedItems
    .map((item, index) => ({
      id: String(item?.id ?? index),
      text: readString(item?.text) ?? "",
      correct: true,
    }))
    .filter((chip) => chip.text.length > 0);
}

function readMatchingChips(
  exercise: Exercise,
): Array<{ id: string; text: string; correct: boolean }> {
  return readArray(exercise.content?.pairs)
    .map(readRecord)
    .filter((pair): pair is Record<string, unknown> => Boolean(pair))
    .map((pair, index) => ({
      id: `pair_${index + 1}`,
      text: `${readString(pair.left) ?? "Item"} → ${
        readString(pair.right) ?? "match"
      }`,
      correct: true,
    }));
}

function readLearnCardPrompt(exercise: Exercise): string | null {
  const cards = readArray(exercise.content?.cards)
    .map(readRecord)
    .filter((card): card is Record<string, unknown> => Boolean(card))
    .map((card) => readString(card.text))
    .filter((text): text is string => Boolean(text));

  if (cards.length === 0) {
    return null;
  }

  return firstSentence(cards[0]);
}

function readReflectionPrompt(exercise: Exercise): string | null {
  const prompt = readString(exercise.content?.prompt);
  const subPrompts = readArray(exercise.content?.sub_prompts)
    .map((item) => (typeof item === "string" ? item : null))
    .filter((item): item is string => Boolean(item));

  return firstSentence([prompt, ...subPrompts].find(Boolean) ?? null);
}

function readPrompt(exercise: Exercise): string {
  const scenario = readString(exercise.content?.scenario);
  const question = readString(exercise.content?.question);
  if (scenario && question) {
    return `${scenario}\n\n${question}`;
  }

  return (
    readString(exercise.content?.prompt) ??
    question ??
    readString(exercise.content?.statement) ??
    scenario ??
    "Choose the best answer."
  );
}

function readTitle(exercise: Exercise, fallback: string): string {
  return readString(exercise.content?.title) ?? fallback;
}

function buildSupport(
  exercise: Exercise,
  incorrect: string,
  correct: string,
): Record<string, string> {
  const support = readRecord(exercise.content?.support);

  return {
    clue:
      readString(support?.clue) ??
      readString(exercise.content?.explanation) ??
      incorrect,
    easier:
      readString(support?.easier) ??
      "Remove one wrong answer. Pick the option that matches the main idea.",
    workedAnswer:
      readString(support?.workedAnswer) ??
      readString(exercise.content?.workedExample) ??
      correct,
  };
}

function defaultOptions(): LegacyOption[] {
  return [
    { id: "yes", label: "This matches the lesson idea.", correct: true },
    { id: "no", label: "This means something is broken.", correct: false },
  ];
}

function firstIncorrectFeedback(options: LegacyOption[]): string | null {
  return options.find((option) => !option.correct && option.feedback)?.feedback ?? null;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function firstSentence(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const sentence = value.split(/(?<=[.!?])\s+/)[0]?.trim();
  return sentence && sentence.length > 0 ? sentence : value;
}

function compareTarget(left: unknown, right: unknown): number {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return leftNumber - rightNumber;
  }

  return String(left ?? "").localeCompare(String(right ?? ""));
}
