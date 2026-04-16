import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Text } from "@/components/ui/text";
import type { AngerThermometerResponse, StepProps } from "@/src/types/exerciseFlow";

const ACCENT = "#58CC02";
const PROMPT_STEP_COUNT = 6;
const XP_EARNED = 10;
const TECHNIQUE_DURATION_SECONDS = 60;

interface SuggestionItem {
  label: string;
  emoji: string;
}

interface SkillItem {
  value: string;
  label: string;
  emoji: string;
  description: string;
}

const TRIGGER_SUGGESTIONS: SuggestionItem[] = [
  { label: "Someone spoke disrespectfully", emoji: "🗣️" },
  { label: "I felt ignored", emoji: "🙄" },
  { label: "Something felt unfair", emoji: "⚖️" },
];

const THOUGHT_SUGGESTIONS: SuggestionItem[] = [
  { label: "This is not okay", emoji: "😤" },
  { label: "They always do this", emoji: "🔥" },
  { label: "I need to react right now", emoji: "⚡" },
];

const COPING_SKILLS: SkillItem[] = [
  {
    value: "deep_breathing",
    label: "Deep breathing",
    emoji: "🌬️",
    description: "Slow your body down before you respond.",
  },
  {
    value: "count_to_10",
    label: "Count to 10",
    emoji: "🔟",
    description: "Create a little space between the feeling and the action.",
  },
  {
    value: "walk_away",
    label: "Walk away briefly",
    emoji: "🚶",
    description: "Take distance so the anger can come down a notch.",
  },
  {
    value: "cold_water",
    label: "Cold water on face",
    emoji: "💧",
    description: "Use your body to interrupt the escalation.",
  },
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
                {isSelected ? (
                  <View
                    className="h-6 w-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <Text className="text-white text-xs font-extrabold">✓</Text>
                  </View>
                ) : null}
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
  helper,
  value,
  onChange,
  suggestionTitle,
  suggestions,
  stepProps,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  helper?: string;
  value: string;
  onChange: (value: string) => void;
  suggestionTitle: string;
  suggestions: SuggestionItem[];
  stepProps: StepProps<AngerThermometerResponse>;
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
              backgroundColor: "#FFF7ED",
              borderWidth: 2,
              borderColor: "#FED7AA",
            }}
          >
            <View className="h-8 w-8 rounded-lg bg-orange-100 items-center justify-center mr-3 mt-0.5">
              <Text className="text-base">🔥</Text>
            </View>
            <Text className="text-sm text-orange-800 leading-relaxed flex-1 font-medium">
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

function getAngerMood(value: number): { label: string; color: string; bg: string } {
  if (value >= 8) {
    return { label: "Boiling", color: "#DC2626", bg: "#FEE2E2" };
  }
  if (value >= 5) {
    return { label: "Heated", color: "#D97706", bg: "#FEF3C7" };
  }
  return { label: "Manageable", color: "#16A34A", bg: "#F0FDF4" };
}

function AngerRatingStep({
  title,
  subtitle,
  fieldKey,
  stepProps,
}: {
  title: string;
  subtitle: string;
  fieldKey: "angerRating" | "postAngerRating";
  stepProps: StepProps<AngerThermometerResponse>;
}): React.JSX.Element {
  const { response, onUpdate, onNext, onBack, onClose, canGoBack, progress, stepIndex, isValid, readOnly } =
    stepProps;
  const value = response[fieldKey];
  const mood = getAngerMood(value);

  return (
    <View className="flex-1">
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
        <Text className="text-[15px] text-slate-500 mb-8 font-medium">
          {subtitle}
        </Text>

        <View className="items-center mb-6">
          <View
            className="h-20 w-20 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: mood.bg }}
          >
            <Text
              className="text-[32px] font-extrabold"
              style={{ color: mood.color }}
            >
              {value}
            </Text>
          </View>
          <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            {mood.label}
          </Text>
        </View>

        <View
          className="bg-white rounded-2xl p-5 mb-8"
          style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
        >
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={value}
            onValueChange={(next) => onUpdate({ [fieldKey]: next } as Partial<AngerThermometerResponse>)}
            minimumTrackTintColor={mood.color}
            maximumTrackTintColor="#E2E8F0"
            thumbTintColor="#FFFFFF"
            disabled={readOnly}
          />
          <View className="flex-row justify-between px-1 mt-2">
            <Text className="text-xs font-bold text-slate-400">Calm</Text>
            <Text className="text-xs font-bold text-slate-400">Furious</Text>
          </View>
        </View>

        <View className="mt-auto">
          <PrimaryButton
            label={readOnly ? "Done" : "Continue"}
            onPress={readOnly ? onClose : onNext}
            disabled={!readOnly && !isValid}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export function AngerThermometerRatingStep(
  stepProps: StepProps<AngerThermometerResponse>,
): React.JSX.Element {
  return (
    <AngerRatingStep
      title="How hot is the anger right now?"
      subtitle="Use the thermometer to rate what you're feeling in this moment."
      fieldKey="angerRating"
      stepProps={stepProps}
    />
  );
}

export function AngerThermometerTriggerStep(
  stepProps: StepProps<AngerThermometerResponse>,
): React.JSX.Element {
  return (
    <TextQuestionStep
      title="What set this off?"
      subtitle="Name the trigger before we look at the reaction."
      placeholder="What happened was..."
      helper="Start with the spark, not the whole story."
      value={stepProps.response.trigger}
      onChange={(value) => stepProps.onUpdate({ trigger: value })}
      suggestionTitle="Common triggers"
      suggestions={TRIGGER_SUGGESTIONS}
      stepProps={stepProps}
    />
  );
}

export function AngerThermometerThoughtsStep(
  stepProps: StepProps<AngerThermometerResponse>,
): React.JSX.Element {
  return (
    <TextQuestionStep
      title="What thoughts are fuelling it?"
      subtitle="Catch the inner sentences that are keeping the anger alive."
      placeholder="I keep thinking..."
      helper="Anger often gets louder when our thoughts become absolute or urgent."
      value={stepProps.response.thoughts}
      onChange={(value) => stepProps.onUpdate({ thoughts: value })}
      suggestionTitle="Common anger thoughts"
      suggestions={THOUGHT_SUGGESTIONS}
      stepProps={stepProps}
    />
  );
}

export function AngerThermometerCopingSkillStep({
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
}: StepProps<AngerThermometerResponse>): React.JSX.Element {
  return (
    <View className="flex-1">
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
          Pick a cool-down move
        </Text>
        <Text className="text-[15px] text-slate-500 mb-6 font-medium">
          Choose the skill that feels most doable right now.
        </Text>

        <View className="gap-y-3 mb-8">
          {COPING_SKILLS.map((skill) => {
            const isSelected = response.matchedCopingSkill === skill.value;
            return (
              <Pressable
                key={skill.value}
                onPress={() => onUpdate({ matchedCopingSkill: skill.value })}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className="rounded-2xl p-4 active:opacity-80"
                style={{
                  borderWidth: 2,
                  borderColor: isSelected ? ACCENT : "#E2E8F0",
                  backgroundColor: isSelected ? "#F0FFF0" : "#FFFFFF",
                  borderBottomWidth: isSelected ? 2 : 4,
                  borderBottomColor: isSelected ? ACCENT : "#CBD5E1",
                }}
              >
                <View className="flex-row items-start">
                  <View className="h-10 w-10 rounded-xl bg-slate-100 items-center justify-center mr-3">
                    <Text className="text-lg">{skill.emoji}</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-[15px] font-bold mb-1 ${isSelected ? "text-green-800" : "text-slate-800"}`}
                    >
                      {skill.label}
                    </Text>
                    <Text className="text-sm text-slate-500 leading-relaxed">
                      {skill.description}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-auto">
          <PrimaryButton
            label={readOnly ? "Done" : "Continue"}
            onPress={readOnly ? onClose : onNext}
            disabled={!readOnly && !isValid}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function formatTimer(secondsLeft: number): string {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function AngerThermometerTechniqueStep({
  response,
  onUpdate,
  onNext,
  onBack,
  onClose,
  canGoBack,
  progress,
  stepIndex,
  readOnly,
}: StepProps<AngerThermometerResponse>): React.JSX.Element {
  const [hasStarted, setHasStarted] = useState(response.techniqueCompleted);
  const [secondsLeft, setSecondsLeft] = useState(
    response.techniqueCompleted ? 0 : TECHNIQUE_DURATION_SECONDS,
  );

  useEffect(() => {
    if (readOnly || response.techniqueCompleted || !hasStarted || secondsLeft <= 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          onUpdate({ techniqueCompleted: true });
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [hasStarted, onUpdate, readOnly, response.techniqueCompleted, secondsLeft]);

  const selectedSkill = useMemo(
    () => COPING_SKILLS.find((skill) => skill.value === response.matchedCopingSkill),
    [response.matchedCopingSkill],
  );

  const startTimer = () => {
    if (readOnly) {
      onClose();
      return;
    }

    if (response.techniqueCompleted) {
      onNext();
      return;
    }

    setHasStarted(true);
  };

  const skipAhead = () => {
    onUpdate({ techniqueCompleted: true });
    setHasStarted(true);
    setSecondsLeft(0);
  };

  const primaryLabel = response.techniqueCompleted
    ? readOnly
      ? "Done"
      : "Continue"
    : hasStarted
      ? formatTimer(secondsLeft)
      : "Start 60 seconds";

  return (
    <View className="flex-1">
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
          Cool it down
        </Text>
        <Text className="text-[15px] text-slate-500 mb-6 font-medium">
          Try your chosen technique for one minute before rating the anger again.
        </Text>

        <View
          className="rounded-2xl p-4 mb-6"
          style={{ backgroundColor: "#FFF7ED", borderWidth: 2, borderColor: "#FED7AA" }}
        >
          <Text className="text-xs font-extrabold text-orange-700 uppercase tracking-wider mb-2">
            Chosen skill
          </Text>
          <Text className="text-[16px] font-bold text-slate-900 mb-1">
            {selectedSkill?.label ?? "Take a short pause"}
          </Text>
          <Text className="text-sm text-slate-600 leading-relaxed">
            {selectedSkill?.description ?? "Give yourself a moment to cool down."}
          </Text>
        </View>

        <View className="items-center mb-8">
          <View
            className="h-40 w-40 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: response.techniqueCompleted ? "#F0FDF4" : "#FEF2F2",
              borderWidth: 6,
              borderColor: response.techniqueCompleted ? "#86EFAC" : "#FCA5A5",
            }}
          >
            <Text
              className="text-[36px] font-extrabold"
              style={{ color: response.techniqueCompleted ? "#16A34A" : "#DC2626" }}
            >
              {response.techniqueCompleted ? "Done" : formatTimer(secondsLeft)}
            </Text>
          </View>
          <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            {response.techniqueCompleted
              ? "Technique completed"
              : hasStarted
                ? "Stay with it"
                : "Tap when you're ready"}
          </Text>
        </View>

        <View className="mt-auto">
          <PrimaryButton
            label={primaryLabel}
            onPress={response.techniqueCompleted ? onNext : startTimer}
            disabled={!response.techniqueCompleted && hasStarted && secondsLeft > 0}
          />

          {!readOnly && !response.techniqueCompleted ? (
            <Pressable
              onPress={skipAhead}
              accessibilityRole="button"
              accessibilityLabel="Skip timer"
              className="mt-3 h-11 rounded-2xl items-center justify-center active:bg-slate-100"
            >
              <Text className="text-sm font-bold text-slate-400">
                Skip timer
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

export function AngerThermometerPostRatingStep(
  stepProps: StepProps<AngerThermometerResponse>,
): React.JSX.Element {
  return (
    <AngerRatingStep
      title="Where is the anger now?"
      subtitle="Check the thermometer again after trying the cool-down."
      fieldKey="postAngerRating"
      stepProps={stepProps}
    />
  );
}

export function AngerThermometerSummaryStep({
  response,
  onNext,
  onBack,
  isSaving,
  readOnly,
}: StepProps<AngerThermometerResponse>): React.JSX.Element {
  const selectedSkill = COPING_SKILLS.find(
    (skill) => skill.value === response.matchedCopingSkill,
  );

  const fields = [
    { label: "Anger Before", value: String(response.angerRating) },
    { label: "Trigger", value: response.trigger },
    { label: "Fuelling Thoughts", value: response.thoughts },
    { label: "Technique", value: selectedSkill?.label ?? response.matchedCopingSkill },
    { label: "Anger After", value: String(response.postAngerRating) },
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
            style={{ backgroundColor: "#FFF7ED" }}
          >
            <Text
              className="text-[52px]"
              accessible={false}
            >
              🌡️
            </Text>
          </View>

          <Text className="text-[26px] font-extrabold text-slate-900 text-center mb-2">
            You cooled it down
          </Text>
          <Text className="text-[15px] text-slate-500 text-center leading-relaxed mb-6">
            You tracked the trigger, named the thoughts, and practiced a calmer response.
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
                {field.value?.trim?.() ? field.value : field.value || "Not filled in"}
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
