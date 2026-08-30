import { APP_FONT_FAMILIES } from "@/src/theme/typography";
/**
 * Custom step components for Thought Reframing exercise.
 *
 * Each component adapts StepProps<ThoughtReframingResponse> into the rich
 * legacy step components from ThoughtReframingScreen, giving the exercise
 * full visual parity with ABC Analysis.
 */

import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { Text } from "@/src/components/ui/Text";
import {
  SuggestionCards,
  SuggestionItem,
} from "@/src/components/exercise/SuggestionCards";
import {
  ReflectionContextBlock,
  ReflectionDisclosure,
  ReflectionExampleRow,
  ReflectionHint,
} from "@/src/components/exercise/ReflectionStepSections";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";
import { Feather } from "@expo/vector-icons";

// ── Reused legacy components ─────────────────────────────────────────────────
import { EmotionChip } from "@/src/screens/ThoughtReframingScreen/components/EmotionChip";
import { DistortionCard } from "@/src/screens/ThoughtReframingScreen/components/DistortionCard";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";
import * as Haptics from "expo-haptics";
import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import { COGNITIVE_DISTORTIONS } from "@/src/screens/ThoughtReframingScreen/data/cognitiveDistortions";

import {
  BRAND_BORDER,
  BRAND_SURFACE_SOFT,
  INK,
  INK_MUTED,
  SAGE,
} from "@/lib/tokens";
import type {
  ThoughtReframingResponse,
  StepProps,
  CognitiveDistortionKey,
} from "@/src/types/exerciseFlow";
import type {
  EmotionName,
  EmotionRating,
} from "@/src/screens/ThoughtReframingScreen/types";

const COLLAPSED_EMOTION_COUNT = 6;
const COLLAPSED_DISTORTION_COUNT = 4;
const CBT_COMPOSER_MIN_HEIGHT = 100;

function useCompactExerciseViewport(): boolean {
  const { width, height } = useWindowDimensions();
  return width < 390 || height < 880;
}

// ─── Helper: shared scrollable step shell ────────────────────────────────────

function StepShell({
  children,
}: {
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  isSaving?: boolean;
  nextLabel?: string;
  progress: number;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return <View className="flex-1">{children}</View>;
}

// ─── Step title + subtitle block ─────────────────────────────────────────────

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="mb-4">
      <Text variant="h1" className="mb-1.5">
        {title}
      </Text>
      <Text variant="body" className="text-[15px] leading-[21px]">
        {subtitle}
      </Text>
    </View>
  );
}

function InlineFactHint({ text }: { text: string }) {
  return (
    <View className="mb-5 flex-row items-start px-1">
      <View className="mr-3 mt-[2px]">
        <Feather name="camera" size={15} color={SAGE[600]} />
      </View>
      <Text
        variant="caption"
        className="text-[13px] leading-[19px] flex-1 text-sage-800"
      >
        {text}
      </Text>
    </View>
  );
}

function InlineThoughtHint({ text }: { text: string }) {
  return (
    <View className="mb-4 flex-row items-start px-1">
      <View className="mr-3 mt-[2px]">
        <Feather name="edit-3" size={15} color={SAGE[600]} />
      </View>
      <Text
        variant="caption"
        className="text-[13px] leading-[19px] flex-1 text-sage-800"
      >
        {text}
      </Text>
    </View>
  );
}

function ExampleDetailRow({
  scenario,
  thought,
  onUse,
}: {
  scenario: string;
  thought: string;
  onUse?: (thought: string) => void;
}) {
  return (
    <View
      className="py-3"
      style={{ borderTopWidth: 1, borderTopColor: BRAND_BORDER }}
    >
      <Text
        variant="caption"
        className="mb-0.5 text-[11px] uppercase tracking-wider text-ink-muted"
      >
        Scenario
      </Text>
      <Text className="text-[14px] leading-[20px] text-ink-soft">
        {scenario}
      </Text>

      <Text
        variant="caption"
        className="mb-0.5 mt-2 text-[11px] uppercase tracking-wider text-sage-500"
      >
        Thought
      </Text>

      <Pressable
        onPress={
          onUse
            ? () => {
                triggerSelectionHaptic();
                onUse(thought);
              }
            : undefined
        }
        disabled={!onUse}
        accessibilityRole={onUse ? "button" : undefined}
        accessibilityLabel={onUse ? `Use example thought: ${thought}` : undefined}
        className={onUse ? "active:opacity-70" : undefined}
      >
        <Text className="text-[15px] leading-[22px] font-medium text-ink">
          {thought}
        </Text>
      </Pressable>
    </View>
  );
}

function LoadingRow({ message }: { message: string }) {
  return (
    <View
      className="flex-row items-center mb-4 rounded-xl px-3 py-2 border"
      style={{ backgroundColor: BRAND_SURFACE_SOFT, borderColor: BRAND_BORDER }}
    >
      <ActivityIndicator size="small" color={INK_MUTED} />
      <Text className="text-[13px] text-ink-soft ml-2 font-medium">
        {message}
      </Text>
    </View>
  );
}

function AiUnavailableNote({ visible }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <Text variant="caption" className="mb-4 text-ink-soft leading-relaxed">
      Draft prompts are unavailable right now. You can keep writing in your own
      words.
    </Text>
  );
}

function RequirementNote({
  visible,
  text,
}: {
  visible: boolean;
  text: string;
}) {
  if (!visible) return null;

  return (
    <Text variant="caption" className="mt-3 mb-2 text-ink-soft leading-relaxed">
      {text}
    </Text>
  );
}

function MoreOptionsButton({
  expanded,
  hiddenCount,
  onToggle,
  label,
}: {
  expanded: boolean;
  hiddenCount: number;
  onToggle: () => void;
  label: string;
}) {
  if (!expanded && hiddenCount <= 0) return null;

  return (
    <Pressable
      onPress={() => {
        triggerSelectionHaptic();
        onToggle();
      }}
      accessibilityRole="button"
      accessibilityLabel={
        expanded ? `Hide extra ${label}` : `Show ${hiddenCount} more ${label}`
      }
      accessibilityState={{ expanded }}
      className="mb-4 flex-row items-center justify-between border-t border-sage-100/70 py-2 active:opacity-70"
    >
      <Text variant="label-bold" className="text-[14px] text-ink">
        {expanded ? `Fewer ${label}` : `More ${label}`}
      </Text>
      <Feather
        name={expanded ? "chevron-up" : "chevron-down"}
        size={16}
        color={SAGE[600]}
      />
    </Pressable>
  );
}

// ─── STEP 1: Situation ────────────────────────────────────────────────────────

const SITUATION_SUGGESTIONS: SuggestionItem[] = [
  { label: "I received feedback from my manager this morning" },
  { label: "I have a doctor appointment at 3 PM" },
  { label: "I sent a message and have not received a reply yet" },
];

export function TRSituationStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  readOnly,
  progress,
  onClose,
  aiSuggestions,
  isAiLoading,
  aiError,
}: StepProps<ThoughtReframingResponse>) {
  const isCompactViewport = useCompactExerciseViewport();
  const [showSituationExamples, setShowSituationExamples] = useState(false);
  const { recordingCurrentState, record, stopRecording } = useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const situationText = response.situation.trim();
  const isSituationValid = situationText.length >= 5;
  const suggestions = useMemo<SuggestionItem[]>(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const uniqueLabels = new Set<string>();
      const result: SuggestionItem[] = [];
      for (const s of aiSuggestions as Array<{
        text?: string;
        label?: string;
      }>) {
        const txt = s?.text || s?.label;
        if (txt && typeof txt === "string" && txt.trim()) {
          const normalized = txt.trim();
          if (!uniqueLabels.has(normalized)) {
            uniqueLabels.add(normalized);
            result.push({
              label: normalized,
            });
          }
        }
      }
      if (result.length > 0) {
        return result;
      }
    }
    return SITUATION_SUGGESTIONS;
  }, [aiSuggestions]);
  const exampleSuggestions = useMemo(
    () => suggestions.slice(0, 2),
    [suggestions],
  );
  const isRecording = recordingCurrentState === "recording";
  const canOfferExamples = !readOnly && exampleSuggestions.length > 0;
  const canUseExamples =
    canOfferExamples && showSituationExamples && !isAiLoading;

  const handleToggleRecording = useCallback(async (): Promise<void> => {
    if (readOnly) return;

    setVoiceError(null);
    if (isRecording) {
      try {
        const recorderState = await stopRecording();
        const uri = recorderState?.url;
        if (uri) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result?.transcript) {
            onUpdate({
              situation: `${response.situation}${response.situation.trim() ? " " : ""}${result.transcript}`.trim(),
            });
          }
        }
      } catch {
        setVoiceError("Voice input unavailable. You can type this instead.");
      }
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await record();
    } catch {
      setVoiceError("Voice input unavailable. You can type this instead.");
    }
  }, [isRecording, onUpdate, readOnly, record, response.situation, stopRecording, transcribeAudio]);

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="What happened?"
        subtitle="Start with the moment, not what it meant."
      />
      <InlineFactHint text="Write what a camera could have seen or heard." />

      <ExerciseTextComposer
        value={response.situation}
        onChange={(nextValue) => onUpdate({ situation: nextValue })}
        placeholder="What happened..."
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
        maxLength={400}
        requirementVisible={!readOnly && !isSituationValid}
        requirementText="Write a few words to start."
        statusVisible={isSituationValid}
        statusText="This stays with what happened."
        onWavePress={handleToggleRecording}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        showVoice={!readOnly}
      />

      {voiceError ? (
        <Text className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          {voiceError}
        </Text>
      ) : null}

      <AiUnavailableNote
        visible={showSituationExamples && !!aiError && !isAiLoading}
      />

      {canOfferExamples ? (
        <ReflectionDisclosure
          expanded={showSituationExamples}
          onToggle={() => setShowSituationExamples((current) => !current)}
        >
          {showSituationExamples && isAiLoading ? (
            <LoadingRow message="Finding relevant examples..." />
          ) : null}

          {canUseExamples ? (
            <View className="mb-4">
              <SuggestionCards
                title=""
                helperText="Borrow the structure, then make the words yours."
                actionLabel="Use"
                suggestions={exampleSuggestions}
                currentValue={response.situation}
                onSelect={(v) => {
                  onUpdate({ situation: v });
                  setShowSituationExamples(false);
                }}
              />
            </View>
          ) : null}
        </ReflectionDisclosure>
      ) : null}
    </StepShell>
  );
}

// ─── STEP 2: Automatic Thought ────────────────────────────────────────────────

const THOUGHT_SUGGESTIONS: SuggestionItem[] = [
  { label: "I'm not ready for this" },
  { label: "This might go badly" },
  { label: "They may be upset with me" },
];

export function TRAutomaticThoughtStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  readOnly,
  progress,
  onClose,
  aiSuggestions,
  isAiLoading,
  aiError,
}: StepProps<ThoughtReframingResponse>) {
  const isCompactViewport = useCompactExerciseViewport();
  const [showThoughtSuggestions, setShowThoughtSuggestions] = useState(false);
  const { recordingCurrentState, record, stopRecording } = useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const thoughtText = response.automaticThought.trim();
  const isThoughtValid = thoughtText.length >= 5;
  const suggestions = useMemo<SuggestionItem[]>(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const uniqueLabels = new Set<string>();
      const result: SuggestionItem[] = [];
      for (const s of aiSuggestions as Array<{
        text?: string;
        label?: string;
      }>) {
        const txt = s?.text || s?.label;
        if (txt && typeof txt === "string" && txt.trim()) {
          const normalized = txt.trim();
          if (!uniqueLabels.has(normalized)) {
            uniqueLabels.add(normalized);
            result.push({
              label: normalized,
            });
          }
        }
      }
      if (result.length > 0) {
        return result;
      }
    }
    return THOUGHT_SUGGESTIONS;
  }, [aiSuggestions]);
  const visibleThoughtSuggestions = useMemo(
    () => suggestions.slice(0, 2),
    [suggestions],
  );
  const canUseThoughtSuggestions =
    !readOnly &&
    showThoughtSuggestions &&
    !isAiLoading &&
    visibleThoughtSuggestions.length > 0;
  const isRecording = recordingCurrentState === "recording";
  const useThoughtExample = useCallback(
    (value: string) => {
      onUpdate({ automaticThought: value });
      setShowThoughtSuggestions(false);
    },
    [onUpdate],
  );

  const handleToggleRecording = useCallback(async (): Promise<void> => {
    if (readOnly) return;

    setVoiceError(null);
    if (isRecording) {
      try {
        const recorderState = await stopRecording();
        const uri = recorderState?.url;
        if (uri) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result?.transcript) {
            onUpdate({
              automaticThought: `${response.automaticThought}${response.automaticThought.trim() ? " " : ""}${result.transcript}`.trim(),
            });
          }
        }
      } catch {
        setVoiceError("Voice input unavailable. You can type this instead.");
      }
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await record();
    } catch {
      setVoiceError("Voice input unavailable. You can type this instead.");
    }
  }, [isRecording, onUpdate, readOnly, record, response.automaticThought, stopRecording, transcribeAudio]);

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      progress={progress}
      onClose={onClose}
    >
      <View className="mb-6 mt-2">
        <Text variant="h1" className="mb-3">
          What thought ran through your mind?
        </Text>
      </View>

      {!!response.situation.trim() && (
        <View className="mb-8 flex-row items-start gap-3 opacity-60">
          <Feather name="calendar" size={16} color={SAGE[600]} style={{ marginTop: 2 }} />
          <View className="flex-1">
            <Text
              variant="caption"
              className="mb-0.5 text-[12px] uppercase tracking-wider text-ink"
            >
              What happened
            </Text>
            <Text className="text-[15px] leading-[22px] italic text-ink-soft">
              "{response.situation.trim()}"
            </Text>
          </View>
        </View>
      )}

      <View className="mb-4">
        <Text className="text-[16px] leading-[23px] text-ink-soft">
          Try to capture the thought exactly as it occurred, even if it feels
          irrational or raw.
        </Text>
      </View>

      <ExerciseTextComposer
        value={response.automaticThought}
        onChange={(nextValue) => onUpdate({ automaticThought: nextValue })}
        placeholder="e.g., 'They're all judging me because I'm quiet.'"
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
        maxLength={300}
        requirementVisible={!readOnly && !isThoughtValid}
        requirementText="Write a few words to continue."
        statusVisible={isThoughtValid}
        statusText="Keep the thought exactly as it showed up."
        onWavePress={handleToggleRecording}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        showVoice={!readOnly}
      />

      {voiceError ? (
        <Text className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          {voiceError}
        </Text>
      ) : null}

      {!readOnly && visibleThoughtSuggestions.length > 0 && (
        <Pressable
          onPress={() => setShowThoughtSuggestions((current) => !current)}
          accessibilityRole="button"
          accessibilityLabel={
            showThoughtSuggestions ? "Hide examples" : "Show optional examples"
          }
          accessibilityState={{ expanded: showThoughtSuggestions }}
          className="mb-2 mt-1 flex-row items-center justify-between border-t border-sage-100/70 py-3 active:opacity-70"
        >
          <Text variant="label-bold" className="text-[14px] text-sage-700">
            {showThoughtSuggestions ? "Hide examples" : "Need an example?"}
          </Text>
          <Feather
            name={showThoughtSuggestions ? "chevron-up" : "chevron-down"}
            size={18}
            color={SAGE[600]}
          />
        </Pressable>
      )}

      {showThoughtSuggestions && isAiLoading && (
        <LoadingRow message="Finding starting points..." />
      )}
      {showThoughtSuggestions && (
        <AiUnavailableNote visible={!!aiError && !isAiLoading} />
      )}

      {showThoughtSuggestions && (
        <View>
          <ExampleDetailRow
            scenario="I made a small mistake at work..."
            thought="I'm going to get fired and lose everything."
            onUse={readOnly ? undefined : useThoughtExample}
          />
          <ExampleDetailRow
            scenario="A friend didn't reply to my text..."
            thought="They're bored of me and are ignoring me on purpose."
            onUse={readOnly ? undefined : useThoughtExample}
          />

          {canUseThoughtSuggestions ? (
            <View className="pt-3">
              <Text
                variant="label-bold"
                className="mb-2 text-[14px] text-sage-700"
              >
                Optional starters
              </Text>
              <SuggestionCards
                title=""
                actionLabel="Use"
                suggestions={visibleThoughtSuggestions}
                currentValue={response.automaticThought}
                onSelect={useThoughtExample}
              />
            </View>
          ) : null}
        </View>
      )}
    </StepShell>
  );
}

// ─── STEP 3: Emotions ─────────────────────────────────────────────────────────

export function TREmotionsStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  readOnly,
  progress,
  onClose,
}: StepProps<ThoughtReframingResponse>) {
  const MAX_EMOTIONS = 3;

  // Normalise selectedEmotions — config stores EmotionRating[] but could be string[] from old data
  const selectedEmotions: EmotionRating[] = useMemo(() => {
    return (response.selectedEmotions ?? []).map((e) =>
      typeof e === "string"
        ? ({
            name: e,
            initial_intensity: 5,
            final_intensity: 5,
          } as EmotionRating)
        : e,
    );
  }, [response.selectedEmotions]);

  const selectedNames = useMemo(
    () => new Set(selectedEmotions.map((e) => e.name)),
    [selectedEmotions],
  );

  const atLimit = selectedEmotions.length >= MAX_EMOTIONS;

  const handleToggle = (name: EmotionName) => {
    if (selectedNames.has(name)) {
      onUpdate({
        selectedEmotions: selectedEmotions.filter((e) => e.name !== name),
      });
    } else if (!atLimit) {
      const newEmotion: EmotionRating = {
        name,
        initial_intensity: 5,
        final_intensity: 5,
      };
      onUpdate({ selectedEmotions: [...selectedEmotions, newEmotion] });
    }
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="How did it make you feel?"
        subtitle="Choose what feels closest."
      />

      <View className="mb-4 flex-row items-center justify-between">
        <Text variant="label" className="text-ink-soft">
          Pick up to {MAX_EMOTIONS}
        </Text>
        <Text
          variant="caption"
          className={
            selectedEmotions.length > 0 ? "text-sage-700" : "text-ink-muted"
          }
          accessibilityLabel={`${selectedEmotions.length} of ${MAX_EMOTIONS} emotions selected`}
        >
          {selectedEmotions.length}/{MAX_EMOTIONS} selected
        </Text>
      </View>

      <View className="-mx-1 flex-row flex-wrap mb-4">
        {EMOTION_OPTIONS.map((emotion) => {
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
    </StepShell>
  );
}

// ─── STEP 4: Cognitive Distortions ───────────────────────────────────────────

export function TRDistortionsStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  aiSuggestions,
  isAiLoading,
  aiError,
  readOnly,
  progress,
  onClose,
}: StepProps<ThoughtReframingResponse>) {
  const MAX_DISTORTIONS = 2;
  const [showAllDistortions, setShowAllDistortions] = useState(false);
  const [showPatternHelp, setShowPatternHelp] = useState(false);
  const [expandedExplanationKey, setExpandedExplanationKey] = useState<
    string | null
  >(null);

  const selectedSet = useMemo(
    () => new Set(response.selectedDistortions),
    [response.selectedDistortions],
  );

  const aiSuggestedKeys = useMemo(() => {
    const suggestions = (aiSuggestions ?? []) as Array<{
      key?: string;
      explanation?: string;
    }>;
    return new Map(suggestions.map((s) => [s.key, s.explanation]));
  }, [aiSuggestions]);

  const atLimit = response.selectedDistortions.length >= MAX_DISTORTIONS;
  const aiSuggestedDistortions = useMemo(() => {
    if (aiSuggestedKeys.size === 0) return [];

    return COGNITIVE_DISTORTIONS.filter((d) => aiSuggestedKeys.has(d.key))
      .slice(0, 2)
      .map((d) => ({
        ...d,
        explanation: aiSuggestedKeys.get(d.key) ?? "",
      }));
  }, [aiSuggestedKeys]);
  const visibleDistortions = useMemo(() => {
    if (showAllDistortions) return COGNITIVE_DISTORTIONS;

    const selected = COGNITIVE_DISTORTIONS.filter((distortion) =>
      selectedSet.has(distortion.key as CognitiveDistortionKey),
    );
    const remainingSlots = Math.max(
      COLLAPSED_DISTORTION_COUNT - selected.length,
      0,
    );
    const collapsed = COGNITIVE_DISTORTIONS
      .filter(
        (distortion) =>
          !selectedSet.has(distortion.key as CognitiveDistortionKey),
      )
      .slice(0, remainingSlots);

    return [...selected, ...collapsed];
  }, [selectedSet, showAllDistortions]);

  const hiddenDistortionCount = Math.max(
    COGNITIVE_DISTORTIONS.length - visibleDistortions.length,
    0,
  );

  const handleToggle = (key: CognitiveDistortionKey) => {
    if (selectedSet.has(key)) {
      onUpdate({
        selectedDistortions: response.selectedDistortions.filter(
          (k) => k !== key,
        ),
      });
    } else if (!atLimit) {
      onUpdate({
        selectedDistortions: [...response.selectedDistortions, key],
      });
    }
  };

  const handleTogglePatternHelp = () => {
    triggerSelectionHaptic();
    if (showPatternHelp) {
      setExpandedExplanationKey(null);
    }
    setShowPatternHelp((current) => !current);
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="Notice the thought pattern"
        subtitle={`Pick 1-${MAX_DISTORTIONS}.`}
      />

      <View className="mb-1 border-t border-sage-100/70">
        {visibleDistortions.map((distortion) => {
          return (
            <DistortionCard
              key={distortion.key}
              distortion={distortion}
              isSelected={selectedSet.has(
                distortion.key as CognitiveDistortionKey,
              )}
              onToggle={() =>
                !readOnly &&
                handleToggle(distortion.key as CognitiveDistortionKey)
              }
              disabled={
                atLimit &&
                !selectedSet.has(distortion.key as CognitiveDistortionKey)
              }
              locked={readOnly}
            />
          );
        })}
      </View>

      <MoreOptionsButton
        expanded={showAllDistortions}
        hiddenCount={hiddenDistortionCount}
        onToggle={() => setShowAllDistortions((current) => !current)}
        label="patterns"
      />

      {!readOnly && (
        <Pressable
          onPress={handleTogglePatternHelp}
          accessibilityRole="button"
          accessibilityLabel={
            showPatternHelp
              ? "Hide help spotting a thought pattern"
              : "Show help spotting a thought pattern"
          }
          accessibilityState={{ expanded: showPatternHelp }}
          className="mb-2 flex-row items-center justify-between border-t border-sage-100/70 py-3 active:opacity-70"
        >
          <Text variant="label-bold" className="text-[14px] text-sage-700">
            {showPatternHelp
              ? "Hide possible matches"
              : "Need help spotting a pattern?"}
          </Text>
          <Feather
            name={showPatternHelp ? "chevron-up" : "chevron-down"}
            size={18}
            color={SAGE[600]}
          />
        </Pressable>
      )}

      {showPatternHelp && (
        <View className="mb-4">
          {isAiLoading && (
            <LoadingRow message="Looking for possible matches..." />
          )}

          {!!aiError && !isAiLoading && (
            <Text variant="caption" className="mb-3 text-ink-soft">
              Possible matches are unavailable. You can still choose from the
              list above.
            </Text>
          )}

          {!isAiLoading &&
            !aiError &&
            aiSuggestedDistortions.length === 0 && (
              <Text variant="caption" className="mb-3 text-ink-soft">
                No possible matches are available. Choose what feels closest
                from the list above.
              </Text>
            )}

          {!isAiLoading &&
            !aiError &&
            aiSuggestedDistortions.map((distortion) => {
              const key = distortion.key as CognitiveDistortionKey;
              const isSelected = selectedSet.has(key);
              const isUseDisabled = atLimit && !isSelected;
              const isExplanationExpanded =
                expandedExplanationKey === distortion.key;

              return (
                <View
                  key={distortion.key}
                  className="border-t border-sage-100/70 py-3"
                >
                  <View className="flex-row items-center">
                    <Text className="mr-3 text-[17px] leading-[20px]">
                      {distortion.icon}
                    </Text>
                    <View className="flex-1 pr-3">
                      <Text
                        variant="caption"
                        className="mb-0.5 text-[12px] text-ink-muted"
                      >
                        Possible match
                      </Text>
                      <Text
                        variant="label-bold"
                        className="text-[14px] text-ink"
                      >
                        {distortion.label}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        triggerSelectionHaptic();
                        handleToggle(key);
                      }}
                      disabled={isUseDisabled}
                      accessibilityRole="checkbox"
                      accessibilityLabel={`${
                        isSelected ? "Remove" : "Use"
                      } ${distortion.label}`}
                      accessibilityState={{
                        checked: isSelected,
                        disabled: isUseDisabled,
                      }}
                      className={`min-h-11 min-w-11 items-center justify-center active:opacity-70 ${
                        isUseDisabled ? "opacity-40" : ""
                      }`}
                    >
                      {isSelected ? (
                        <Feather name="check" size={18} color={SAGE[600]} />
                      ) : (
                        <Text variant="label-bold" className="text-sage-700">
                          Use
                        </Text>
                      )}
                    </Pressable>
                  </View>

                  {!!distortion.explanation && (
                    <View className="ml-8 mt-2">
                      <Pressable
                        onPress={() =>
                          {
                            triggerSelectionHaptic();
                            setExpandedExplanationKey((current) =>
                              current === distortion.key ? null : distortion.key,
                            );
                          }
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`${
                          isExplanationExpanded ? "Hide" : "Show"
                        } why ${distortion.label} may fit`}
                        accessibilityState={{
                          expanded: isExplanationExpanded,
                        }}
                        className="min-h-11 self-start justify-center active:opacity-70"
                      >
                        <Text variant="label-bold" className="text-sage-700">
                          {isExplanationExpanded ? "Hide why" : "Why?"}
                        </Text>
                      </Pressable>

                      {isExplanationExpanded && (
                        <Text
                          variant="caption"
                          className="pb-1 pr-2 text-[13px] leading-[19px] text-ink-soft"
                        >
                          {distortion.explanation}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      )}
    </StepShell>
  );
}

// ─── STEP 5: Evidence For ─────────────────────────────────────────────────────

export function TREvidenceForStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  readOnly,
  progress,
  onClose,
  aiSuggestions,
  isAiLoading,
  aiError,
}: StepProps<ThoughtReframingResponse>) {
  const items = response.evidenceFor ?? [];
  const [showEvidenceSuggestions, setShowEvidenceSuggestions] = useState(false);
  const aiGeneratedSuggestions = useMemo<SuggestionItem[]>(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const uniqueLabels = new Set<string>();
      const result: SuggestionItem[] = [];
      for (const s of aiSuggestions as Array<{
        text?: string;
        label?: string;
      }>) {
        const txt = s?.text || s?.label;
        if (txt && typeof txt === "string" && txt.trim()) {
          const normalized = txt.trim();
          if (!uniqueLabels.has(normalized)) {
            uniqueLabels.add(normalized);
            result.push({
              label: normalized,
            });
          }
        }
      }
      return result;
    }
    return [];
  }, [aiSuggestions]);
  const visibleEvidenceSuggestions = useMemo(
    () => aiGeneratedSuggestions.slice(0, 2),
    [aiGeneratedSuggestions],
  );
  const addEvidenceItem = (text: string) => {
    const normalized = text.trim();
    if (!normalized || items.includes(normalized)) return;
    onUpdate({ evidenceFor: [...items, normalized] });
  };
  const toggleSuggestionItem = (text: string) => {
    const normalized = text.trim();
    if (!normalized) return;
    setShowEvidenceSuggestions(false);

    if (items.includes(normalized)) {
      onUpdate({ evidenceFor: items.filter((item) => item !== normalized) });
      return;
    }

    onUpdate({ evidenceFor: [...items, normalized] });
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      nextLabel={items.length === 0 ? "Skip" : "Continue"}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="Evidence For"
        subtitle="Add only what actually happened."
      />

      <ExerciseTextComposer
        mode="list"
        items={items}
        onAdd={addEvidenceItem}
        onRemove={(i) =>
          onUpdate({ evidenceFor: items.filter((_, idx) => idx !== i) })
        }
        placeholder="Type a fact here..."
        readOnly={readOnly}
        addLabel="Add"
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
      />

      {!readOnly ? (
        <ReflectionDisclosure
          expanded={showEvidenceSuggestions}
          onToggle={() => setShowEvidenceSuggestions((current) => !current)}
        >
          {isAiLoading ? <LoadingRow message="Finding starting points..." /> : null}
          <AiUnavailableNote visible={!!aiError && !isAiLoading} />

          <ReflectionExampleRow
            title="A Fact"
            body={`"My partner said 'I'm busy right now' when I asked to talk."`}
            icon="check-circle"
            iconColor={SAGE[500]}
          />
          <ReflectionExampleRow
            title="A Feeling/Opinion"
            body={`"I feel like they are avoiding me because they are mad."`}
            icon="x-circle"
            iconColor="#D88D8D"
          />

          {!isAiLoading && visibleEvidenceSuggestions.length > 0 ? (
            <View className="pt-3">
              <Text
                variant="label-bold"
                className="mb-2 text-[14px] text-sage-700"
              >
                Optional starters
              </Text>
              <SuggestionCards
                title=""
                actionLabel="Use"
                suggestions={visibleEvidenceSuggestions}
                currentValue={items}
                onSelect={toggleSuggestionItem}
              />
            </View>
          ) : null}
        </ReflectionDisclosure>
      ) : null}
    </StepShell>
  );
}

// ─── STEP 6: Evidence Against ─────────────────────────────────────────────────

export function TREvidenceAgainstStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  readOnly,
  progress,
  onClose,
  aiSuggestions,
  isAiLoading,
  aiError,
}: StepProps<ThoughtReframingResponse>) {
  const items = response.evidenceAgainst ?? [];
  const forItems = response.evidenceFor ?? [];
  const showBiasNote = items.length < forItems.length && items.length > 0;
  const [showEvidenceSuggestions, setShowEvidenceSuggestions] = useState(false);

  const aiGeneratedSuggestions = useMemo<SuggestionItem[]>(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const uniqueLabels = new Set<string>();
      const result: SuggestionItem[] = [];
      for (const s of aiSuggestions as Array<{
        text?: string;
        label?: string;
      }>) {
        const txt = s?.text || s?.label;
        if (txt && typeof txt === "string" && txt.trim()) {
          const normalized = txt.trim();
          if (!uniqueLabels.has(normalized)) {
            uniqueLabels.add(normalized);
            result.push({
              label: normalized,
            });
          }
        }
      }
      return result;
    }
    return [];
  }, [aiSuggestions]);
  const visibleEvidenceSuggestions = useMemo(
    () => aiGeneratedSuggestions.slice(0, 2),
    [aiGeneratedSuggestions],
  );
  const addEvidenceItem = (text: string) => {
    const normalized = text.trim();
    if (!normalized || items.includes(normalized)) return;
    onUpdate({ evidenceAgainst: [...items, normalized] });
  };
  const toggleSuggestionItem = (text: string) => {
    const normalized = text.trim();
    if (!normalized) return;
    setShowEvidenceSuggestions(false);

    if (items.includes(normalized)) {
      onUpdate({
        evidenceAgainst: items.filter((item) => item !== normalized),
      });
      return;
    }

    onUpdate({ evidenceAgainst: [...items, normalized] });
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      nextLabel={items.length === 0 ? "Skip" : "Continue"}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="Evidence Against"
        subtitle="What facts do not fit the prediction?"
      />

      <ReflectionContextBlock
        label="The Thought"
        text={response.automaticThought}
        variant="quote"
      />

      <ExerciseTextComposer
        mode="list"
        items={items}
        onAdd={addEvidenceItem}
        onRemove={(i) =>
          onUpdate({ evidenceAgainst: items.filter((_, idx) => idx !== i) })
        }
        placeholder="Add a fact that contradicts the thought..."
        readOnly={readOnly}
        addLabel="Add"
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
      />

      {!readOnly ? (
        <ReflectionDisclosure
          expanded={showEvidenceSuggestions}
          onToggle={() => setShowEvidenceSuggestions((current) => !current)}
        >
          {isAiLoading ? <LoadingRow message="Finding starting points..." /> : null}
          <AiUnavailableNote visible={!!aiError && !isAiLoading} />

          <ReflectionExampleRow
            title="Contradicting fact"
            body={`"I've been nervous before and it turned out okay."`}
            icon="check-circle"
            iconColor={SAGE[500]}
          />
          <ReflectionExampleRow
            title="Another fact"
            body={`"Nobody has ever actually called me incompetent."`}
            icon="check-circle"
            iconColor={SAGE[500]}
          />

          {!isAiLoading && visibleEvidenceSuggestions.length > 0 ? (
            <View className="pt-3">
              <Text
                variant="label-bold"
                className="mb-2 text-[14px] text-sage-700"
              >
                Optional starters
              </Text>
              <SuggestionCards
                title=""
                actionLabel="Use"
                suggestions={visibleEvidenceSuggestions}
                currentValue={items}
                onSelect={toggleSuggestionItem}
              />
            </View>
          ) : null}
        </ReflectionDisclosure>
      ) : null}

      {showBiasNote ? (
        <ReflectionHint text="Threat can show up faster than safety. Keep looking for the full picture." />
      ) : null}
    </StepShell>
  );
}

// ─── STEP 7: Balanced Thought ─────────────────────────────────────────────────

export function TRBalancedThoughtStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  aiSuggestions,
  isAiLoading,
  aiError,
  readOnly,
  progress,
  onClose,
}: StepProps<ThoughtReframingResponse>) {
  const isCompactViewport = useCompactExerciseViewport();
  const { recordingCurrentState, record, stopRecording } = useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showBalancedOptions, setShowBalancedOptions] = useState(false);
  const suggestions = useMemo(() => {
    const automaticThought = response.automaticThought.trim().toLowerCase();
    const seen = new Set<string>();

    return (
      aiSuggestions as
        | Array<{ text?: string; rationale?: string }>
        | undefined
    )
      ?.flatMap((suggestion) => {
        const text = suggestion.text?.trim();
        if (!text) return [];

        const normalized = text.toLowerCase();
        if (normalized === automaticThought || seen.has(normalized)) return [];

        seen.add(normalized);
        return [{ text, rationale: suggestion.rationale?.trim() }];
      })
      .slice(0, 2) ?? [];
  }, [aiSuggestions, response.automaticThought]);
  const isRecording = recordingCurrentState === "recording";

  const handleUseBalancedOption = useCallback(
    (text: string): void => {
      if (readOnly) return;
      void Haptics.selectionAsync();
      onUpdate({ balancedThought: text });
      setShowBalancedOptions(false);
    },
    [onUpdate, readOnly],
  );

  const handleToggleRecording = useCallback(async (): Promise<void> => {
    if (readOnly) return;

    setVoiceError(null);
    if (isRecording) {
      try {
        const recorderState = await stopRecording();
        const uri = recorderState?.url;
        if (uri) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result?.transcript) {
            const current = response.balancedThought;
            const separator = current.trim().length > 0 ? "\n" : "";
            onUpdate({
              balancedThought:
                `${current}${separator}${result.transcript}`.slice(0, 300),
            });
          }
        }
      } catch {
        setVoiceError("Voice input unavailable. Type your answer here.");
      }
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await record();
    } catch {
      setVoiceError("Voice input unavailable. Type your answer here.");
    }
  }, [
    isRecording,
    onUpdate,
    readOnly,
    record,
    response.balancedThought,
    stopRecording,
    transcribeAudio,
  ]);

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="Write a balanced thought"
        subtitle="Aim for something fair and believable, not forced positive."
      />

      <View
        className="mb-6 pb-5"
        style={{ borderBottomWidth: 1, borderBottomColor: BRAND_BORDER }}
      >
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="mb-2 text-[13px] leading-[18px] text-sage-700"
        >
          The thought you are testing
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBoldItalic }}
          className="text-[20px] leading-[27px] text-ink"
        >
          {response.automaticThought}
        </Text>
      </View>

      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
        className="mb-2 text-[14px] leading-[20px] text-ink"
      >
        Your balanced thought
      </Text>
      <ExerciseTextComposer
        value={response.balancedThought}
        onChange={(nextValue) => {
          if (!readOnly) onUpdate({ balancedThought: nextValue });
        }}
        placeholder="What is a fairer way to understand this?"
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
        maxLength={300}
        helperText="Type your first fairer thought before using voice or AI support."
        requirementVisible={!readOnly && response.balancedThought.trim().length < 5}
        requirementText="Write at least a few words for a fairer thought to continue."
        onWavePress={handleToggleRecording}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        showVoice={!readOnly}
      />

      {voiceError ? (
        <Text className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          {voiceError}
        </Text>
      ) : null}

      {!readOnly && (isAiLoading || suggestions.length > 0 || !!aiError) ? (
        <View
          className="mt-5 pt-2"
          style={{ borderTopWidth: 1, borderTopColor: BRAND_BORDER }}
        >
          <Pressable
            onPress={() => {
              triggerSelectionHaptic();
              setShowBalancedOptions((current) => !current);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              showBalancedOptions
                ? "Hide balanced thought starting points"
                : "Show balanced thought starting points"
            }
            accessibilityState={{ expanded: showBalancedOptions }}
            className="min-h-12 flex-row items-center justify-between py-3 active:opacity-60"
          >
            <View className="flex-1 pr-4">
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                className="text-[14px] leading-[20px] text-sage-700"
              >
                Need a starting point?
              </Text>
              <Text className="mt-0.5 text-[12px] leading-[17px] text-ink-soft">
                Optional drafts based on the evidence you added
              </Text>
            </View>
            <Feather
              name={showBalancedOptions ? "chevron-up" : "chevron-down"}
              size={18}
              color={SAGE[600]}
            />
          </Pressable>

          {showBalancedOptions ? (
            <View className="pb-2">
              {isAiLoading ? (
                <LoadingRow message="Building starting points..." />
              ) : null}
              <AiUnavailableNote visible={!!aiError && !isAiLoading} />

              {!isAiLoading && suggestions.length > 0 ? (
                <View>
                  {suggestions.map((suggestion, index) => (
                    <Pressable
                      key={suggestion.text}
                      onPress={() => handleUseBalancedOption(suggestion.text)}
                      accessibilityRole="button"
                      accessibilityLabel={`Use balanced thought draft ${index + 1}`}
                      className="py-4 active:opacity-60"
                      style={{
                        borderTopWidth: 1,
                        borderTopColor: BRAND_BORDER,
                      }}
                    >
                      <View className="flex-row items-start">
                        <Text
                          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                          className="flex-1 pr-4 text-[18px] leading-[25px] text-ink"
                        >
                          {suggestion.text}
                        </Text>
                        <Text
                          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                          className="text-[13px] leading-[20px] text-sage-700"
                        >
                          Use
                        </Text>
                      </View>
                      {suggestion.rationale ? (
                        <Text className="mt-2 pr-10 text-[13px] leading-[19px] text-ink-soft">
                          {suggestion.rationale}
                        </Text>
                      ) : null}
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </StepShell>
  );
}
