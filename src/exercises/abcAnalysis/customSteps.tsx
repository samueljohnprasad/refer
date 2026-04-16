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

import { Text } from "@/components/ui/text";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";

const ACCENT = "#58CC02";
const PROMPT_STEP_COUNT = 5;
const XP_EARNED = 15;

interface SuggestionItem {
  label: string;
  emoji: string;
}

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

function clampStepNumber(stepIndex: number): number {
  return Math.min(stepIndex + 1, PROMPT_STEP_COUNT);
}

function Header({
  stepIndex,
  canGoBack,
  onBack,
  onClose,
  progress,
}: {
  stepIndex: number;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
  progress: number;
}): React.JSX.Element {
  const stepNumber = clampStepNumber(stepIndex);

  return (
    <>
      <View className="flex-row items-center mb-6">
        {canGoBack ? (
          <Pressable
            onPress={onBack}
            className="p-2 -ml-2 rounded-full active:bg-slate-100 mr-3"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text className="text-lg text-slate-400">←</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onClose}
            className="p-2 -ml-2 rounded-full active:bg-slate-100 mr-3"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={20}
              color="#94A3B8"
            />
          </Pressable>
        )}

        <View className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{ width: `${progress * 100}%`, backgroundColor: ACCENT }}
          />
        </View>
        <Text className="text-xs font-extrabold text-slate-400 ml-3">
          {Math.round(progress * 100)}%
        </Text>
      </View>

      <View className="flex-row items-center justify-center gap-1.5 mb-6">
        {Array.from({ length: PROMPT_STEP_COUNT }, (_: unknown, index: number) => (
          <View
            key={index}
            className={`rounded-full ${index === stepNumber - 1 ? "h-2.5 w-2.5" : "h-2 w-2"}`}
            style={{
              backgroundColor: index < stepNumber ? ACCENT : "#E2E8F0",
            }}
          />
        ))}
      </View>
    </>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled = false,
  isLoading = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="w-full rounded-2xl h-14 items-center justify-center active:opacity-90"
      style={{
        backgroundColor: disabled || isLoading ? "#E2E8F0" : ACCENT,
        shadowColor: disabled || isLoading ? "#000" : ACCENT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: disabled || isLoading ? 0 : 0.3,
        shadowRadius: 0,
        elevation: disabled || isLoading ? 0 : 4,
      }}
    >
      <Text
        className="text-base font-extrabold uppercase tracking-wider"
        style={{ color: disabled || isLoading ? "#94A3B8" : "#FFFFFF" }}
      >
        {isLoading ? "Saving..." : label}
      </Text>
    </Pressable>
  );
}

function SuggestionCards({
  title,
  suggestions,
  currentValue,
  onSelect,
}: {
  title: string;
  suggestions: SuggestionItem[];
  currentValue: string;
  onSelect: (value: string) => void;
}): React.JSX.Element {
  return (
    <>
      <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
        {title}
      </Text>
      <View className="gap-y-3 mb-8">
        {suggestions.map((suggestion) => {
          const isSelected = currentValue === suggestion.label;

          return (
            <Pressable
              key={suggestion.label}
              onPress={() => onSelect(suggestion.label)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className="rounded-2xl p-4 active:opacity-80"
              style={{
                borderWidth: 2,
                borderColor: isSelected ? ACCENT : "#E2E8F0",
                backgroundColor: isSelected ? "#F0FFF0" : "#FFFFFF",
                borderBottomWidth: isSelected ? 2 : 4,
                borderBottomColor: isSelected ? ACCENT : "#CBD5E1",
                minHeight: 48,
              }}
            >
              <View className="flex-row items-center">
                <View className="h-9 w-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                  <Text className="text-lg">{suggestion.emoji}</Text>
                </View>
                <Text
                  className={`text-[15px] font-bold flex-1 ${isSelected ? "text-green-800" : "text-slate-700"}`}
                >
                  {suggestion.label}
                </Text>
                {isSelected && (
                  <View
                    className="h-6 w-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <Text className="text-white text-xs font-extrabold">✓</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

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
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  suggestionTitle: string;
  suggestions: SuggestionItem[];
  stepProps: StepProps<ABCAnalysisResponse>;
}): React.JSX.Element {
  const { onNext, onBack, onClose, canGoBack, isValid, progress, stepIndex, readOnly } =
    stepProps;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header
          stepIndex={stepIndex}
          canGoBack={canGoBack}
          onBack={onBack}
          onClose={onClose}
          progress={progress}
        />

        <Text className="text-[24px] font-extrabold text-slate-900 mb-2">
          {title}
        </Text>
        <Text className="text-[15px] text-slate-500 mb-6 font-medium">
          {subtitle}
        </Text>

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

        {!readOnly ? (
          <SuggestionCards
            title={suggestionTitle}
            suggestions={suggestions}
            currentValue={value}
            onSelect={onChange}
          />
        ) : null}

        <View className="mt-auto">
          <PrimaryButton
            label={readOnly ? "Done" : "Continue"}
            onPress={readOnly ? onClose : onNext}
            disabled={!readOnly && !isValid}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
}: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header
          stepIndex={stepIndex}
          canGoBack={canGoBack}
          onBack={onBack}
          onClose={onClose}
          progress={progress}
        />

        <Text className="text-[24px] font-extrabold text-slate-900 mb-2">
          What happened next?
        </Text>
        <Text className="text-[15px] text-slate-500 mb-6 font-medium">
          Name the feeling and what you did right after that belief.
        </Text>

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

        {!readOnly ? (
          <SuggestionCards
            title="Quick emotions"
            suggestions={EMOTION_SUGGESTIONS}
            currentValue={response.consequenceEmotion}
            onSelect={(value) => onUpdate({ consequenceEmotion: value })}
          />
        ) : null}

        <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
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

        {!readOnly ? (
          <SuggestionCards
            title="Common reactions"
            suggestions={BEHAVIOR_SUGGESTIONS}
            currentValue={response.consequenceBehavior}
            onSelect={(value) => onUpdate({ consequenceBehavior: value })}
          />
        ) : null}

        <View className="mt-auto">
          <PrimaryButton
            label={readOnly ? "Done" : "Continue"}
            onPress={readOnly ? onClose : onNext}
            disabled={!readOnly && !isValid}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
}: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const suggestions = (aiSuggestions ?? []) as Array<{
    text?: string;
    rationale?: string;
  }>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header
          stepIndex={stepIndex}
          canGoBack={canGoBack}
          onBack={onBack}
          onClose={onClose}
          progress={progress}
        />

        <Text className="text-[24px] font-extrabold text-slate-900 mb-2">
          What's a more balanced belief?
        </Text>
        <Text className="text-[15px] text-slate-500 mb-6 font-medium">
          Keep it believable, kind, and grounded in the facts.
        </Text>

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
                  <ActivityIndicator
                    size="small"
                    color="#94A3B8"
                  />
                  <Text className="text-xs font-bold text-slate-400 ml-2">
                    Thinking...
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="gap-y-3 mb-8">
              {suggestions.map((suggestion, index) => (
                <Pressable
                  key={`${suggestion.text ?? "suggestion"}-${index}`}
                  onPress={() =>
                    onUpdate({ alternativeBelief: suggestion.text ?? "" })
                  }
                  className="rounded-2xl p-4 active:opacity-80"
                  style={{
                    borderWidth: 2,
                    borderColor:
                      response.alternativeBelief === suggestion.text
                        ? ACCENT
                        : "#E2E8F0",
                    backgroundColor:
                      response.alternativeBelief === suggestion.text
                        ? "#F0FFF0"
                        : "#FFFFFF",
                    borderBottomWidth:
                      response.alternativeBelief === suggestion.text ? 2 : 4,
                    borderBottomColor:
                      response.alternativeBelief === suggestion.text
                        ? ACCENT
                        : "#CBD5E1",
                  }}
                >
                  <Text className="text-[15px] font-bold text-slate-800 mb-1.5">
                    {suggestion.text}
                  </Text>
                  {suggestion.rationale ? (
                    <Text className="text-sm text-slate-500 leading-relaxed">
                      {suggestion.rationale}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        <View className="mt-auto">
          <PrimaryButton
            label={readOnly ? "Done" : "Continue"}
            onPress={readOnly ? onClose : onNext}
            disabled={!readOnly && !isValid}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

export function ABCSummaryStep({
  response,
  onNext,
  onBack,
  isSaving,
  readOnly,
}: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const fields: Array<{ label: string; value: string }> = [
    { label: "Activating Event", value: response.activatingEvent },
    { label: "Belief", value: response.belief },
    { label: "Emotion", value: response.consequenceEmotion },
    { label: "Behavior", value: response.consequenceBehavior },
    { label: "Alternative Belief", value: response.alternativeBelief },
    { label: "New Consequence", value: response.newConsequence },
  ];

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center justify-center p-6 pb-4">
          <View
            className="h-24 w-24 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: "#F0FFF0" }}
          >
            <Text
              className="text-[52px]"
              accessible={false}
            >
              🧩
            </Text>
          </View>

          <Text className="text-[26px] font-extrabold text-slate-900 text-center mb-2">
            ABC complete!
          </Text>
          <Text className="text-[15px] text-slate-500 text-center leading-relaxed mb-6">
            You mapped the event, the belief, and a healthier next interpretation.
          </Text>

          {!readOnly ? (
            <View
              className="flex-row items-center px-5 py-2.5 rounded-full mb-6"
              style={{
                backgroundColor: "#FFF3CD",
                borderWidth: 2,
                borderColor: "#FBBF24",
              }}
            >
              <Text className="text-lg mr-1.5">⚡</Text>
              <Text className="text-base font-extrabold text-amber-700">
                +{XP_EARNED} XP earned!
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-y-3 px-1">
          {fields.map((field) => (
            <View
              key={field.label}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: "#FFFFFF",
                borderWidth: 2,
                borderColor: "#E2E8F0",
                borderBottomWidth: 4,
                borderBottomColor: "#CBD5E1",
              }}
            >
              <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                {field.label}
              </Text>
              <Text className="text-[15px] text-slate-800 leading-relaxed">
                {field.value?.trim() || "Not filled in"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="px-2 pb-8 pt-4">
        <PrimaryButton
          label={readOnly ? "Done" : "Finish"}
          onPress={onNext}
          isLoading={isSaving}
        />

        {!readOnly ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Edit answers"
            className="mt-3 h-11 rounded-2xl items-center justify-center active:bg-slate-100"
          >
            <Text className="text-sm font-bold text-slate-400">
              Edit answers
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
