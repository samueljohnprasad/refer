import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { Exercise } from "@/src/types/journeyV5";

export function readTimelineRewindContent(exercise: Exercise) {
  const content = readRecord(exercise.content) ?? {};
  const finalInsight = readRecord(content.finalInsight);

  return {
    title: readString(content.title) ?? "",
    setupText: readString(content.setup) ?? "",
    promptText: readString(content.prompt) ?? "",
    timelineEvents: readTimelineEvents(content.timelineEvents),
    paths: readTimelinePaths(content.paths),
    reflectionQuestion:
      readString(content.reflectionQuestion) ?? "Reflection question?",
    reflectionOptions: readReflectionOptions(content.reflectionOptions),
    finalInsight: {
      headline: readString(finalInsight?.headline) ?? "",
      body: readString(finalInsight?.body) ?? "",
    },
  };
}

function readTimelineEvents(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const event = readRecord(item);
    return {
      time: readString(event?.time) ?? "",
      description: readString(event?.description) ?? "",
    };
  });
}

function readTimelinePaths(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const path = readRecord(item);
    return {
      id: readString(path?.id) ?? "",
      choiceLabel: readString(path?.choiceLabel) ?? "",
      visibleEventCount: readNumber(path?.visibleEventCount) ?? 0,
      interpretation: readString(path?.interpretation) ?? "",
      revealMoreButton: readString(path?.revealMoreButton) ?? undefined,
      postRevealText: readString(path?.postRevealText) ?? undefined,
      switchPathButton: readString(path?.switchPathButton) ?? undefined,
    };
  });
}

function readReflectionOptions(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const option = readRecord(item);
    return {
      id: readString(option?.id) ?? "",
      label: readString(option?.label) ?? "",
      isCorrect: option?.isCorrect === true,
    };
  });
}
