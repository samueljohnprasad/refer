import React from "react";

import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import {
  MultiChoiceStep,
  type MultiChoiceOption,
} from "@/src/components/exercise/steps/MultiChoiceStep";
import type {
  ABCAnalysisResponse,
  StepProps,
} from "@/src/types/exerciseFlow";
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

const ABC_EMOTION_OPTIONS: MultiChoiceOption[] = EMOTION_OPTIONS.filter(
  (emotion) =>
    ["anxious", "sad", "angry", "frustrated", "overwhelmed", "lonely"].includes(
      emotion.name,
    ),
).map((emotion) => ({
  value: emotion.name,
  label: emotion.label,
  emoji: emotion.emoji,
}));

const emotionSelectionStorage = {
  deserialize(value: unknown): string[] {
    if (typeof value !== "string") return [];

    return value
      .split(",")
      .map((emotion) => emotion.trim())
      .filter(Boolean);
  },
  serialize(values: string[]): string {
    return values.join(", ");
  },
};

const SHARED_TEXT_STEP_PROPS = {
  showVoice: true,
  alwaysShowVoice: true,
  composerGlow: false,
  showExamplesInitially: true,
  suggestionsTitle: "Example starters",
} as const;

export function ABCActivatingEventStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <TextInputStep
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="What happened?"
      subtitle="Start with the moment, not what it meant."
      tipText="Write what a camera could have seen or heard."
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
    <TextInputStep
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
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiChoiceStep
      {...stepProps}
      title="How did you feel?"
      subtitle="Name the emotion that followed the thought."
      fieldKey="consequenceEmotion"
      options={ABC_EMOTION_OPTIONS}
      maxSelections={3}
      layoutVariant="cbt_reflection"
      selectionStorageAdapter={emotionSelectionStorage}
    />
  );
}

export function ABCConsequenceBehaviorStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <TextInputStep
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
    <TextInputStep
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
    <TextInputStep
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
