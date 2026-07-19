import React, { useMemo } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { StepLayout } from "@/src/components/exercise/steps/StepLayout";
import {MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type {
  ABCAnalysisResponse,
  StepProps,
} from "@/src/types/exerciseFlow";
import { EmotionChip } from "@/src/screens/ThoughtReframingScreen/components/EmotionChip";
import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import type { EmotionName } from "@/src/screens/ThoughtReframingScreen/types";
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

export function ABCActivatingEventStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="What happened?"
      subtitle="Start with the moment, not what it meant."
      tipText="Write what a camera could have seen or heard."
      tipIcon="camera"
      fieldKey="activatingEvent"
      placeholder="Describe what happened..."
      suggestions={EVENT_SUGGESTIONS}
    />
  );
}

export function ABCBeliefStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="Automatic thought"
      subtitle="Write the sentence your mind added."
      tipText="Do not make it fair yet. Just catch it."
      fieldKey="belief"
      placeholder="The thought was..."
      suggestions={BELIEF_SUGGESTIONS}
    />
  );
}

export function ABCConsequenceEmotionStep(
  {
    response,
    onUpdate,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    isSaving,
    readOnly,
    onClose,
  }: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  const MAX_EMOTIONS = 3;
  const selectedEmotions = useMemo(
    () => getABCEmotionTokenState(response.consequenceEmotion).recognized,
    [response.consequenceEmotion],
  );
  const selectedNames = useMemo(
    () => new Set(selectedEmotions),
    [selectedEmotions],
  );
  const atLimit = selectedEmotions.length >= MAX_EMOTIONS;

  const handleToggle = (name: EmotionName) => {
    const nextSelected = selectedNames.has(name)
      ? selectedEmotions.filter((emotion) => emotion !== name)
      : atLimit
        ? selectedEmotions
        : [...selectedEmotions, name];

    if (nextSelected === selectedEmotions) return;

    const nextValue = createEmotionSelectionStorage(
      response.consequenceEmotion,
    ).serialize(nextSelected);

    onUpdate({ consequenceEmotion: nextValue });
  };

  return (
    <StepLayout
      title="How did you feel?"
      subtitle="Choose what feels closest."
      progress={progress}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      canGoBack={canGoBack}
      isValid={isValid}
      onBack={onBack}
      onClose={onClose}
      onNext={onNext}
      isLoading={isSaving}
      showStepCount={false}
      scrollable
    >
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-[14px] leading-[20px] text-ink-soft">
          Pick up to {MAX_EMOTIONS}
        </Text>
        <Text
          className={
            selectedEmotions.length > 0
              ? "text-[13px] leading-[19px] text-sage-700"
              : "text-[13px] leading-[19px] text-ink-muted"
          }
          accessibilityLabel={`${selectedEmotions.length} of ${MAX_EMOTIONS} emotions selected`}
        >
          {selectedEmotions.length}/{MAX_EMOTIONS} selected
        </Text>
      </View>

      <View className="-mx-1 mb-4 flex-row flex-wrap">
        {ABC_EMOTION_OPTIONS.map((emotion) => {
          const isSelected = selectedNames.has(emotion.name);
          return (
            <View key={emotion.name} className="w-1/2 px-1 pb-2">
              <EmotionChip
                emotion={emotion}
                isSelected={isSelected}
                onToggle={() => !readOnly && handleToggle(emotion.name)}
                disabled={atLimit && !isSelected}
                locked={readOnly}
              />
            </View>
          );
        })}
      </View>
    </StepLayout>
  );
}

export function ABCConsequenceBehaviorStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="What did you do next?"
      subtitle="Name the reaction that followed."
      tipText="What did you do, avoid, say, or repeat?"
      fieldKey="consequenceBehavior"
      placeholder="I responded by..."
      suggestions={BEHAVIOR_SUGGESTIONS}
    />
  );
}

export function ABCAlternativeBeliefStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="More balanced thought"
      subtitle="Write a fairer version that still feels believable."
      fieldKey="alternativeBelief"
      placeholder="A fairer thought could be..."
      suggestions={BALANCED_THOUGHT_SUGGESTIONS}
      referenceQuote={{
        label: "Automatic thought",
        text: stepProps.response.belief,
      }}
    />
  );
}

export function ABCNewConsequenceStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="What might change now?"
      subtitle="If you held that thought, what might feel or go differently?"
      fieldKey="newConsequence"
      placeholder="With that thought, I might..."
      suggestions={NEW_CONSEQUENCE_SUGGESTIONS}
    />
  );
}
