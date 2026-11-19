import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";

const ABC_EMOTION_OPTIONS = EMOTION_OPTIONS;

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

/** "anxious, sad and lonely": the feelings as they read inside the sentence. */
export function abcFeelPhrase(value: string): string {
  const labels = splitABCEmotionTokens(value).map((token) => (normalizeABCEmotion(token)?.label ?? token).toLowerCase());
  return labels.length < 2 ? (labels[0] ?? '') : `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
}

export { ABC_EMOTION_OPTIONS, getABCEmotionTokenState, createEmotionSelectionStorage };
