import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Text } from "@/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { SAGE } from "@/lib/tokens";
import { ValidationMessage } from "@/src/components/exercise/ValidationMessage";
import { DynamicSummary } from "@/src/components/exercise/DynamicSummary";
import { useRouter } from "expo-router";
import type {
  ABCAnalysisResponse,
  ExerciseType,
  StepProps,
} from "@/src/types/exerciseFlow";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { EXERCISE_LINKING_MAP } from "@/src/data/exerciseLinkingMap";

const ACCENT = "#58CC02";
const PROMPT_STEP_COUNT = 5;
const XP_EARNED = 15;

import { SuggestionCards, SuggestionItem } from "@/src/components/exercise/SuggestionCards";

const EVENT_SUGGESTIONS: SuggestionItem[] = [
  { label: "I got difficult feedback", emoji: "🗣️" },
  { label: "Someone seemed distant", emoji: "📱" },
  { label: "My plans changed suddenly", emoji: "📆" },
];

const BELIEF_SUGGESTIONS: SuggestionItem[] = [
  { label: "I always mess things up", emoji: "😣" },
  { label: "They must be upset with me", emoji: "😟" },
  { label: "I can't handle this", emoji: "😰" },
];

const EMOTION_SUGGESTIONS: SuggestionItem[] = [
  { label: "Anxious", emoji: "😬" },
  { label: "Sad", emoji: "😔" },
  { label: "Frustrated", emoji: "😤" },
];

const BEHAVIOR_SUGGESTIONS: SuggestionItem[] = [
  { label: "I shut down", emoji: "🫥" },
  { label: "I avoided it", emoji: "🏃" },
  { label: "I kept replaying it", emoji: "🔁" },
];

const NEW_CONSEQUENCE_SUGGESTIONS: SuggestionItem[] = [
  { label: "I'd feel calmer and respond more clearly", emoji: "🌤️" },
  { label: "I'd pause instead of spiraling", emoji: "⏸️" },
  { label: "I'd take one useful next step", emoji: "✅" },
];

import { StepLayout } from "@/src/components/exercise/steps/StepLayout";

function TextQuestionStep({
  title,
  subtitle,
  placeholder,
  value,
  onChange,
  helper,
  suggestionTitle,
  suggestions,
  stepProps,
  validationMessage,
  psychoeducationText,
}: {
  title: string;
  subtitle?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  suggestionTitle: string;
  suggestions: SuggestionItem[];
  stepProps: StepProps<ABCAnalysisResponse>;
  validationMessage?: string;
  psychoeducationText?: string;
}): React.JSX.Element {
  const {
    onNext,
    onBack,
    onClose,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    readOnly,
    aiSuggestions,
    isAiLoading,
  } = stepProps;

  const combinedSuggestions = React.useMemo<SuggestionItem[]>(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const uniqueLabels = new Set<string>();
      const result: SuggestionItem[] = [];
      for (const s of (aiSuggestions as Array<{ text?: string; label?: string }>)) {
        const txt = s?.text || s?.label;
        if (txt && typeof txt === "string" && txt.trim()) {
          const normalized = txt.trim();
          if (!uniqueLabels.has(normalized)) {
            uniqueLabels.add(normalized);
            result.push({
              label: normalized,
              emoji: "✨",
            });
          }
        }
      }
      if (result.length > 0) {
        return result;
      }
    }
    return suggestions;
  }, [aiSuggestions, suggestions]);

  return (
    <StepLayout
      title={title}
      subtitle={subtitle ?? ""}
      progress={progress}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      canGoBack={canGoBack}
      isValid={isValid || !!readOnly}
      onBack={onBack}
      onNext={readOnly ? onClose : onNext}
      onClose={onClose}
      nextLabel={readOnly ? "Done" : "Continue"}
      scrollable
    >
      <View className="px-1">
        <ValidationMessage
          message={validationMessage ?? ""}
          visible={!!validationMessage && value.trim().length > 0}
        />

        <PsychoeducationCard content={psychoeducationText ?? ""} />

        {helper ? (
          <View
            className="rounded-2xl p-3.5 mb-6 flex-row items-start"
            style={{
              backgroundColor: "#EFF6FF",
              borderWidth: 2,
              borderColor: "#BFDBFE",
            }}
          >
            <View className="h-8 w-8 rounded-lg bg-blue-100 items-center justify-center mr-3 mt-0.5">
              <Text className="text-base">💡</Text>
            </View>
            <Text className="text-sm text-blue-800 leading-relaxed flex-1 font-medium">
              {helper}
            </Text>
          </View>
        ) : null}

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          autoFocus={!readOnly}
          editable={!readOnly}
          multiline
          className="bg-white rounded-2xl p-4 text-base text-slate-700 mb-6"
          style={{
            borderWidth: 2,
            borderColor: "#E2E8F0",
            minHeight: 112,
            textAlignVertical: "top",
            opacity: readOnly ? 0.7 : 1,
          }}
          placeholderTextColor="#94A3B8"
        />

        {isAiLoading && (
          <View className="flex-row items-center mb-4">
            <ActivityIndicator size="small" color="#64748B" />
            <Text className="text-[11px] text-slate-500 ml-2 uppercase tracking-wider">
              Generating ideas…
            </Text>
          </View>
        )}

        {!readOnly && (!isAiLoading) ? (
          <SuggestionCards
            title={aiSuggestions?.length ? "AI Suggestions" : suggestionTitle}
            suggestions={combinedSuggestions}
            currentValue={value}
            onSelect={onChange}
          />
        ) : null}
      </View>
    </StepLayout>
  );
}

export function ABCActivatingEventStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <TextQuestionStep
      title="What happened?"
      subtitle="Start with the activating event, just the facts."
      placeholder="Describe the triggering event..."
      value={stepProps.response.activatingEvent}
      onChange={(value) => stepProps.onUpdate({ activatingEvent: value })}
      helper="Keep this part observable and concrete, like a camera could have seen it."
      suggestionTitle="Quick picks"
      suggestions={EVENT_SUGGESTIONS}
      stepProps={stepProps}
      validationMessage="That's the raw event. Now let's look at the story your mind told about it."
    />
  );
}

export function ABCBeliefStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <TextQuestionStep
      title="What did you tell yourself?"
      subtitle="This is the belief or interpretation you gave the event."
      placeholder="The thought or belief was..."
      value={stepProps.response.belief}
      onChange={(value) => stepProps.onUpdate({ belief: value })}
      helper="This is the meaning your mind made, not necessarily the only truth."
      suggestionTitle="Common beliefs"
      suggestions={BELIEF_SUGGESTIONS}
      stepProps={stepProps}
      validationMessage="That belief makes sense given how things felt in that moment."
      psychoeducationText="The same event can trigger completely different emotions depending on the belief attached to it. Beliefs are changeable."
    />
  );
}

export function ABCConsequenceStep({
  response,
  onUpdate,
  onNext,
  onBack,
  onClose,
  canGoBack,
  isValid,
  progress,
  stepIndex,
  readOnly,
  totalSteps,
  aiSuggestions,
  isAiLoading,
}: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const combinedEmotions = React.useMemo(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const result: SuggestionItem[] = [];
      for (const s of (aiSuggestions as Array<{ emotion?: string }>)) {
        if (s?.emotion?.trim()) {
          result.push({ label: s.emotion.trim(), emoji: "✨" });
        }
      }
      if (result.length > 0) return result;
    }
    return EMOTION_SUGGESTIONS;
  }, [aiSuggestions]);

  const combinedBehaviors = React.useMemo(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const result: SuggestionItem[] = [];
      for (const s of (aiSuggestions as Array<{ behavior?: string }>)) {
        if (s?.behavior?.trim()) {
          result.push({ label: s.behavior.trim(), emoji: "✨" });
        }
      }
      if (result.length > 0) return result;
    }
    return BEHAVIOR_SUGGESTIONS;
  }, [aiSuggestions]);
  return (
    <StepLayout
      title="What happened next?"
      subtitle="Name the feeling and what you did right after that belief."
      progress={progress}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      canGoBack={canGoBack}
      isValid={isValid || !!readOnly}
      onBack={onBack}
      onNext={readOnly ? onClose : onNext}
      onClose={onClose}
      nextLabel={readOnly ? "Done" : "Continue"}
      scrollable
    >
      <View className="px-1">
        <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
          Emotion
        </Text>
        <TextInput
          placeholder="I felt..."
          value={response.consequenceEmotion}
          onChangeText={(value) => onUpdate({ consequenceEmotion: value })}
          autoFocus={!readOnly}
          editable={!readOnly}
          className="bg-white rounded-2xl p-4 text-base text-slate-700 mb-4"
          style={{ borderWidth: 2, borderColor: "#E2E8F0", minHeight: 52 }}
          placeholderTextColor="#94A3B8"
        />

        {isAiLoading && (
          <View className="flex-row items-center mb-4">
            <ActivityIndicator size="small" color="#64748B" />
            <Text className="text-[11px] text-slate-500 ml-2 uppercase tracking-wider">
              Generating ideas…
            </Text>
          </View>
        )}

        {!readOnly && (!isAiLoading) ? (
          <SuggestionCards
            title={aiSuggestions?.length ? "AI Emotion Suggestions" : "Quick emotions"}
            suggestions={combinedEmotions}
            currentValue={response.consequenceEmotion}
            onSelect={(value) => onUpdate({ consequenceEmotion: value })}
          />
        ) : null}

        <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2 mt-4">
          Behavior
        </Text>
        <TextInput
          placeholder="I responded by..."
          value={response.consequenceBehavior}
          onChangeText={(value) => onUpdate({ consequenceBehavior: value })}
          editable={!readOnly}
          multiline
          className="bg-white rounded-2xl p-4 text-base text-slate-700 mb-4"
          style={{
            borderWidth: 2,
            borderColor: "#E2E8F0",
            minHeight: 96,
            textAlignVertical: "top",
            opacity: readOnly ? 0.7 : 1,
          }}
          placeholderTextColor="#94A3B8"
        />

        {!readOnly && (!isAiLoading) ? (
          <SuggestionCards
            title={aiSuggestions?.length ? "AI Behavior Suggestions" : "Common reactions"}
            suggestions={combinedBehaviors}
            currentValue={response.consequenceBehavior}
            onSelect={(value) => onUpdate({ consequenceBehavior: value })}
          />
        ) : null}
      </View>
    </StepLayout>
  );
}

export function ABCAlternativeBeliefStep({
  response,
  onUpdate,
  onNext,
  onBack,
  onClose,
  canGoBack,
  isValid,
  progress,
  stepIndex,
  aiSuggestions,
  isAiLoading,
  readOnly,
  totalSteps,
}: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const suggestions = (aiSuggestions ?? []) as Array<{
    text?: string;
    rationale?: string;
  }>;

  return (
    <StepLayout
      title="What's a more balanced belief?"
      subtitle="Keep it believable, kind, and grounded in the facts."
      progress={progress}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      canGoBack={canGoBack}
      isValid={isValid || !!readOnly}
      onBack={onBack}
      onNext={readOnly ? onClose : onNext}
      onClose={onClose}
      nextLabel={readOnly ? "Done" : "Continue"}
      isLoading={isAiLoading}
      scrollable
    >
      <View className="px-1">
        <PsychoeducationCard content="A balanced belief doesn't have to be positive. It just needs to be more accurate and less absolute than the original." />

        <View
          className="rounded-2xl p-3.5 mb-6 flex-row items-start"
          style={{
            backgroundColor: "#EFF6FF",
            borderWidth: 2,
            borderColor: "#BFDBFE",
          }}
        >
          <View className="h-8 w-8 rounded-lg bg-blue-100 items-center justify-center mr-3 mt-0.5">
            <Text className="text-base">🧭</Text>
          </View>
          <Text className="text-sm text-blue-800 leading-relaxed flex-1 font-medium">
            A balanced belief doesn't have to be super positive. It just needs
            to be more fair and accurate.
          </Text>
        </View>

        <TextInput
          placeholder="A more balanced belief could be..."
          value={response.alternativeBelief}
          onChangeText={(value) => onUpdate({ alternativeBelief: value })}
          autoFocus={!readOnly}
          editable={!readOnly}
          multiline
          className="bg-white rounded-2xl p-4 text-base text-slate-700 mb-6"
          style={{
            borderWidth: 2,
            borderColor: "#E2E8F0",
            minHeight: 112,
            textAlignVertical: "top",
            opacity: readOnly ? 0.7 : 1,
          }}
          placeholderTextColor="#94A3B8"
        />

        {!readOnly ? (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Reframe ideas
              </Text>
              {isAiLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#94A3B8" />
                  <Text className="text-xs font-bold text-slate-400 ml-2">
                    Thinking...
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="gap-y-3 mb-8">
              {suggestions.map((suggestion, index) => {
                const isSelected = response.alternativeBelief === suggestion.text;
                return (
                  <Card
                    key={`${suggestion.text ?? "suggestion"}-${index}`}
                    variant={isSelected ? "answer-selected" : "answer"}
                    onPress={() => onUpdate({ alternativeBelief: suggestion.text ?? "" })}
                    className="mb-3"
                    contentClassName="p-4"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View className="flex-row items-start">
                      <View className="flex-1">
                        <Text
                          className="text-[15px] font-bold mb-1.5"
                          style={{ color: isSelected ? SAGE[700] : "#334155" }}
                        >
                          {suggestion.text}
                        </Text>
                        {suggestion.rationale ? (
                          <Text className="text-sm text-slate-500 leading-relaxed">
                            {suggestion.rationale}
                          </Text>
                        ) : null}
                      </View>
                      {isSelected && (
                        <View
                          className="h-6 w-6 rounded-full items-center justify-center ml-3 mt-0.5"
                          style={{ backgroundColor: SAGE[500] }}
                        >
                          <Text className="text-white text-xs font-extrabold">✓</Text>
                        </View>
                      )}
                    </View>
                  </Card>
                );
              })}
            </View>
          </>
        ) : null}
      </View>
    </StepLayout>
  );
}

export function ABCNewConsequenceStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <TextQuestionStep
      title="What changes with the new belief?"
      subtitle="Imagine how you'd feel or act if you believed the reframe."
      placeholder="With that belief, I would..."
      value={stepProps.response.newConsequence}
      onChange={(value) => stepProps.onUpdate({ newConsequence: value })}
      helper="You're not promising perfection here, just a more helpful direction."
      suggestionTitle="Possible shifts"
      suggestions={NEW_CONSEQUENCE_SUGGESTIONS}
      stepProps={stepProps}
    />
  );
}

