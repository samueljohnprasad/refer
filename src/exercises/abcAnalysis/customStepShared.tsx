import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import { useTranslation } from "react-i18next";

export function useABCCopy() {
  const { t } = useTranslation("exercises");
  const translate = t as unknown as (key: string) => string;
  const suggestions = (group: string, emojis: string[]) =>
    emojis.map((emoji, index) => ({
      label: translate(`flow.ui.abc.suggestions.${group}.${index}`),
      emoji,
    }));

  return {
    t,
    sharedProps: {
      showVoice: true,
      alwaysShowVoice: true,
      composerGlow: false,
      showExamplesInitially: true,
      suggestionsTitle: translate("flow.ui.engine.exampleStarters"),
      showStepCount: false,
    },
    eventSuggestions: suggestions("event", ["🗣️", "📱", "📆"]),
    beliefSuggestions: suggestions("belief", ["😣", "😟", "😰"]),
    behaviorSuggestions: suggestions("behavior", ["🫥", "🏃", "🔁"]),
    balancedThoughtSuggestions: suggestions("balancedThought", ["🌿", "🧭", "👣"]),
    newConsequenceSuggestions: suggestions("newConsequence", ["🌤️", "⏸️", "✅"]),
  };
}

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

export { ABC_EMOTION_OPTIONS, emotionOptionByNormalizedValue, normalizeABCEmotion, splitABCEmotionTokens, getABCEmotionTokenState, createEmotionSelectionStorage };
