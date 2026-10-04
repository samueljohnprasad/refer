import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import type { SuggestionItem } from "@/src/components/exercise/SuggestionCards";

const EVENT_SUGGESTIONS: SuggestionItem[] = [
  { label: "My manager gave me difficult feedback.", emoji: "🗣️" },
  { label: "I sent a message and did not get a reply.", emoji: "📱" },
  { label: "My plans changed at the last minute.", emoji: "📆" },
];

const BELIEF_SUGGESTIONS: SuggestionItem[] = [
  { label: "I always mess things up.", emoji: "😣" },
  { label: "They must be upset with me.", emoji: "😟" },
  { label: "I cannot handle this.", emoji: "😰" },
];

const BEHAVIOR_SUGGESTIONS: SuggestionItem[] = [
  { label: "I shut down and stopped replying.", emoji: "🫥" },
  { label: "I avoided dealing with it.", emoji: "🏃" },
  { label: "I kept replaying it in my mind.", emoji: "🔁" },
];

const BALANCED_THOUGHT_SUGGESTIONS: SuggestionItem[] = [
  { label: "This is hard, but one moment does not define me.", emoji: "🌿" },
  { label: "I do not know the full story yet.", emoji: "🧭" },
  { label: "I can take this one useful step at a time.", emoji: "👣" },
];

const NEW_CONSEQUENCE_SUGGESTIONS: SuggestionItem[] = [
  { label: "I might feel calmer and respond more clearly.", emoji: "🌤️" },
  { label: "I might pause instead of spiraling.", emoji: "⏸️" },
  { label: "I might take one useful next step.", emoji: "✅" },
];

const ABC_EMOTION_OPTIONS = EMOTION_OPTIONS.filter(
  (emotion) =>
    ["anxious", "sad", "angry", "frustrated", "overwhelmed", "lonely"].includes(
      emotion.name,
    ),
);

const emotionOptionByNormalizedValue = new Map(
  ABC_EMOTION_OPTIONS.flatMap((option) => [
    [option.name.toLocaleLowerCase(), option],
    [option.label.toLocaleLowerCase(), option],
  ]),
);

function normalizeABCEmotion(value: string) {
  return emotionOptionByNormalizedValue.get(value.trim().toLocaleLowerCase());
}

function splitABCEmotionTokens(value: unknown): string[] {
  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((emotion) => emotion.trim())
    .filter(Boolean);
}

function getABCEmotionTokenState(value: unknown) {
  const tokens = splitABCEmotionTokens(value);
  const recognized: string[] = [];
  const unrecognized: string[] = [];

  tokens.forEach((token) => {
    const normalized = normalizeABCEmotion(token);
    if (normalized) {
      recognized.push(normalized.name);
      return;
    }

    unrecognized.push(token);
  });

  return { recognized, unrecognized };
}

function createEmotionSelectionStorage(value: string) {
  const { unrecognized } = getABCEmotionTokenState(value);

  return {
    deserialize(rawValue: unknown): string[] {
      return getABCEmotionTokenState(rawValue).recognized;
    },
    serialize(values: string[]): string {
      return [...values, ...unrecognized].join(", ");
    },
  };
}

export function hasSelectedABCEmotion(value: string): boolean {
  return splitABCEmotionTokens(value).length > 0;
}

export function getABCEmotionDisplayLabels(value: string): string {
  const normalizedLabels = splitABCEmotionTokens(value)
    .map((emotion) => normalizeABCEmotion(emotion)?.label ?? emotion);

  if (normalizedLabels.length > 0) {
    return normalizedLabels.join(", ");
  }

  return value.trim();
}

const SHARED_TEXT_STEP_PROPS = {
  showVoice: true,
  alwaysShowVoice: true,
  composerGlow: false,
  showExamplesInitially: true,
  suggestionsTitle: "Example starters",
  showStepCount: false,
} as const;

export { EVENT_SUGGESTIONS, BELIEF_SUGGESTIONS, BEHAVIOR_SUGGESTIONS, BALANCED_THOUGHT_SUGGESTIONS, NEW_CONSEQUENCE_SUGGESTIONS, ABC_EMOTION_OPTIONS, emotionOptionByNormalizedValue, normalizeABCEmotion, splitABCEmotionTokens, getABCEmotionTokenState, createEmotionSelectionStorage, SHARED_TEXT_STEP_PROPS };
