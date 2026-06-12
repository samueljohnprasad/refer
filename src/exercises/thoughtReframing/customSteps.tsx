/**
 * Custom step components for Thought Reframing exercise.
 *
 * Each component adapts StepProps<ThoughtReframingResponse> into the rich
 * legacy step components from ThoughtReframingScreen, giving the exercise
 * full visual parity with ABC Analysis.
 */

import React, { useMemo } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/src/components/ui/Text";

// ── Reused legacy components ─────────────────────────────────────────────────
import { EmotionChip } from "@/src/screens/ThoughtReframingScreen/components/EmotionChip";
import { DistortionCard } from "@/src/screens/ThoughtReframingScreen/components/DistortionCard";
import { BulletListInput } from "@/src/screens/ThoughtReframingScreen/components/BulletListInput";
import { VoiceTextInput } from "@/src/screens/ThoughtReframingScreen/components/VoiceTextInput";
import { StepNavigation } from "@/src/screens/ThoughtReframingScreen/components/StepNavigation";
import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import { COGNITIVE_DISTORTIONS } from "@/src/screens/ThoughtReframingScreen/data/cognitiveDistortions";

// ── Local components ──────────────────────────────────────────────────────────
import { ValidationMessage } from "@/src/components/exercise/ValidationMessage";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";

import { SAGE, INK_MUTED } from "@/lib/tokens";
import type {
  ThoughtReframingResponse,
  StepProps,
  CognitiveDistortionKey,
} from "@/src/types/exerciseFlow";
import type {
  EmotionName,
  EmotionRating,
} from "@/src/screens/ThoughtReframingScreen/types";

// ─── Helper: shared scrollable step shell ────────────────────────────────────

function StepShell({
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  nextLabel,
  children,
}: {
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  isSaving?: boolean;
  nextLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <StepNavigation
        canGoBack={canGoBack}
        canGoNext={isValid}
        onBack={onBack}
        onNext={onNext}
        nextLabel={nextLabel}
        isLoading={isSaving}
      />
    </KeyboardAvoidingView>
  );
}

// ─── Step title + subtitle block ─────────────────────────────────────────────

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="mb-5">
      <Text className="text-[24px] font-extrabold text-ink mb-1.5 leading-tight">
        {title}
      </Text>
      <Text className="text-[15px] text-ink-soft font-medium leading-relaxed">
        {subtitle}
      </Text>
    </View>
  );
}

// ─── Helper card (blue) ───────────────────────────────────────────────────────

function HelperCard({ text }: { text: string }) {
  return (
    <View
      className="rounded-2xl p-3.5 mb-5 flex-row items-start"
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
        {text}
      </Text>
    </View>
  );
}

// ─── Quick-pick suggestion cards ─────────────────────────────────────────────

interface SuggestionItem {
  label: string;
  emoji: string;
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
}) {
  return (
    <View className="mb-6">
      <Text className="text-xs font-extrabold text-ink-muted uppercase tracking-wider mb-3">
        {title}
      </Text>
      {suggestions.map((s) => {
        const isSelected = currentValue === s.label;
        return (
          <Pressable
            key={s.label}
            onPress={() => onSelect(s.label)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className="rounded-2xl p-4 mb-3 active:opacity-80"
            style={{
              borderWidth: 2,
              borderColor: isSelected ? SAGE[500] : "#E2E8F0",
              backgroundColor: isSelected ? SAGE.selected : "#FFFFFF",
              borderBottomWidth: isSelected ? 2 : 4,
              borderBottomColor: isSelected ? SAGE[500] : "#CBD5E1",
            }}
          >
            <View className="flex-row items-center">
              <View className="h-9 w-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                <Text className="text-lg">{s.emoji}</Text>
              </View>
              <Text
                className="text-[15px] font-bold flex-1"
                style={{ color: isSelected ? SAGE[700] : "#334155" }}
              >
                {s.label}
              </Text>
              {isSelected && (
                <View
                  className="h-6 w-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: SAGE[500] }}
                >
                  <Text className="text-white text-xs font-extrabold">✓</Text>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── STEP 1: Situation ────────────────────────────────────────────────────────

const SITUATION_SUGGESTIONS: SuggestionItem[] = [
  { label: "I got difficult feedback at work", emoji: "🗣️" },
  { label: "Someone seemed distant or upset with me", emoji: "📱" },
  { label: "I made a mistake I keep thinking about", emoji: "😔" },
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
}: StepProps<ThoughtReframingResponse>) {
  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
    >
      <StepTitle
        title="What happened?"
        subtitle="Describe the situation that triggered this thought."
      />
      <HelperCard text="Stick to facts a camera could capture — no interpretations yet." />

      {!readOnly && (
        <SuggestionCards
          title="Quick picks"
          suggestions={SITUATION_SUGGESTIONS}
          currentValue={response.situation}
          onSelect={(v) => onUpdate({ situation: v })}
        />
      )}

      <VoiceTextInput
        value={response.situation}
        onChangeText={(t) => onUpdate({ situation: t })}
        placeholder="Describe the event or situation..."
        maxLength={400}
        showCharCount
      />

      <ValidationMessage
        message="It takes courage to look closely at what's going on. Let's do this step by step."
        visible={response.situation.trim().length >= 5}
      />
    </StepShell>
  );
}

// ─── STEP 2: Automatic Thought ────────────────────────────────────────────────

const THOUGHT_SUGGESTIONS: SuggestionItem[] = [
  { label: "I'm not good enough", emoji: "😔" },
  { label: "This is going to go badly", emoji: "😟" },
  { label: "They don't like me", emoji: "😞" },
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
}: StepProps<ThoughtReframingResponse>) {
  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
    >
      <StepTitle
        title="Automatic Thought"
        subtitle="What thought popped into your head? Write it exactly."
      />
      <HelperCard text="Write the exact thought, word for word. Even if it sounds dramatic — especially then." />

      {!readOnly && (
        <SuggestionCards
          title="Common thoughts"
          suggestions={THOUGHT_SUGGESTIONS}
          currentValue={response.automaticThought}
          onSelect={(v) => onUpdate({ automaticThought: v })}
        />
      )}

      <VoiceTextInput
        value={response.automaticThought}
        onChangeText={(t) => onUpdate({ automaticThought: t })}
        placeholder="Write the exact thought..."
        maxLength={300}
        showCharCount
      />

      <ValidationMessage
        message="That thought makes complete sense given how you felt. Now let's examine it."
        visible={response.automaticThought.trim().length >= 5}
      />
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
  aiSuggestions,
  isAiLoading,
  readOnly,
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

  const aiSuggestedNames = useMemo(() => {
    const suggestions = (aiSuggestions ?? []) as Array<{ name?: string }>;
    return new Set(suggestions.map((s) => s.name).filter(Boolean) as string[]);
  }, [aiSuggestions]);

  const atLimit = selectedEmotions.length >= MAX_EMOTIONS;

  const handleToggle = (name: EmotionName) => {
    if (selectedNames.has(name)) {
      onUpdate({
        selectedEmotions: selectedEmotions.filter(
          (e) => e.name !== name,
        ) as any,
      });
    } else if (!atLimit) {
      const newEmotion: EmotionRating = {
        name,
        initial_intensity: 5,
        final_intensity: 5,
      };
      onUpdate({ selectedEmotions: [...selectedEmotions, newEmotion] as any });
    }
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
    >
      <StepTitle
        title="How did it make you feel?"
        subtitle={`Select up to ${MAX_EMOTIONS} emotions.`}
      />

      {isAiLoading && (
        <View className="flex-row items-center mb-4">
          <ActivityIndicator size="small" color={INK_MUTED} />
          <Text className="text-[11px] text-ink-muted ml-2 uppercase tracking-wider">
            Analysing emotions…
          </Text>
        </View>
      )}

      {aiSuggestedNames.size > 0 && !isAiLoading && (
        <Text className="text-[11px] text-ink-muted mb-4 uppercase tracking-wider">
          AI highlighted — tap to confirm
        </Text>
      )}

      <View className="flex-row flex-wrap mb-4">
        {EMOTION_OPTIONS.map((emotion) => {
          const isAISuggested = aiSuggestedNames.has(emotion.name);
          const isSelected = selectedNames.has(emotion.name);
          return (
            <View key={emotion.name} className="relative">
              <EmotionChip
                emotion={emotion}
                isSelected={isSelected}
                onToggle={() => !readOnly && handleToggle(emotion.name)}
                disabled={atLimit && !isSelected}
              />
              {isAISuggested && !isSelected && (
                <View
                  className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: SAGE[400] }}
                />
              )}
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
  readOnly,
}: StepProps<ThoughtReframingResponse>) {
  const MAX_DISTORTIONS = 2;

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

  const sortedDistortions = useMemo(() => {
    if (aiSuggestedKeys.size === 0) return COGNITIVE_DISTORTIONS;
    const suggested = COGNITIVE_DISTORTIONS.filter((d) =>
      aiSuggestedKeys.has(d.key),
    );
    const rest = COGNITIVE_DISTORTIONS.filter(
      (d) => !aiSuggestedKeys.has(d.key),
    );
    return [...suggested, ...rest];
  }, [aiSuggestedKeys]);

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

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
    >
      <StepTitle
        title="Spot the thinking trap"
        subtitle={`Which pattern might be at play? Pick up to ${MAX_DISTORTIONS}.`}
      />

      <PsychoeducationCard content="Naming your thinking traps makes them easier to spot next time. Like learning to recognise a magician's tricks." />

      {isAiLoading && (
        <View className="flex-row items-center mb-4">
          <ActivityIndicator size="small" color={INK_MUTED} />
          <Text className="text-[11px] text-ink-muted ml-2 uppercase tracking-wider">
            Analysing patterns…
          </Text>
        </View>
      )}

      {aiSuggestedKeys.size > 0 && !isAiLoading && (
        <Text className="text-[11px] text-ink-muted mb-4 uppercase tracking-wider">
          AI suggestions shown first
        </Text>
      )}

      {sortedDistortions.map((distortion) => {
        const explanation = aiSuggestedKeys.get(distortion.key);
        return (
          <View key={distortion.key}>
            {explanation && (
              <Text
                className="text-[11px] text-ink-muted mb-1 ml-1"
                numberOfLines={2}
              >
                {explanation}
              </Text>
            )}
            <DistortionCard
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
            />
          </View>
        );
      })}
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
}: StepProps<ThoughtReframingResponse>) {
  const items = response.evidenceFor ?? [];

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      nextLabel={items.length === 0 ? "Skip" : "Continue"}
    >
      <StepTitle
        title="Evidence for this thought"
        subtitle="What facts support this thought? Stick to evidence, not feelings."
      />
      <HelperCard text="Even if the evidence feels flimsy, write it. We're looking at ALL the data." />

      {!readOnly && (
        <BulletListInput
          items={items}
          onAdd={(item) => onUpdate({ evidenceFor: [...items, item] })}
          onRemove={(i) =>
            onUpdate({ evidenceFor: items.filter((_, idx) => idx !== i) })
          }
          maxItems={5}
          placeholder="Add a fact that supports the thought..."
        />
      )}

      {items.length === 0 && !readOnly && (
        <View
          className="mt-4 rounded-2xl p-3.5 flex-row items-start"
          style={{
            backgroundColor: "#FFF7ED",
            borderWidth: 2,
            borderColor: "#FED7AA",
          }}
        >
          <View className="h-8 w-8 rounded-lg bg-orange-100 items-center justify-center mr-3 mt-0.5">
            <Text className="text-base">🔍</Text>
          </View>
          <Text className="text-sm text-orange-800 flex-1 leading-relaxed font-medium">
            It's okay if you can't find much evidence — that's a clue!
          </Text>
        </View>
      )}
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
}: StepProps<ThoughtReframingResponse>) {
  const items = response.evidenceAgainst ?? [];
  const forItems = response.evidenceFor ?? [];

  const showBiasNote = items.length < forItems.length && items.length > 0;

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      nextLabel={items.length === 0 ? "Skip" : "Continue"}
    >
      <StepTitle
        title="Evidence against this thought"
        subtitle="What facts contradict or challenge this thought?"
      />

      <PsychoeducationCard content="Your brain's threat system actively ignores positive evidence. This step forces it to look at the full picture." />

      {!readOnly && (
        <BulletListInput
          items={items}
          onAdd={(item) => onUpdate({ evidenceAgainst: [...items, item] })}
          onRemove={(i) =>
            onUpdate({ evidenceAgainst: items.filter((_, idx) => idx !== i) })
          }
          maxItems={5}
          placeholder="Add counter-evidence..."
        />
      )}

      {showBiasNote && (
        <View
          className="mt-4 rounded-2xl p-3.5 flex-row items-start"
          style={{
            backgroundColor: SAGE[50],
            borderWidth: 2,
            borderColor: "#D3E0CD",
          }}
        >
          <Text className="text-base mr-3">🌿</Text>
          <Text className="text-sm flex-1 leading-relaxed font-medium text-sage-800">
            Our anxious minds often see more evidence against us than for us.
            That's the bias at work.
          </Text>
        </View>
      )}
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
  readOnly,
}: StepProps<ThoughtReframingResponse>) {
  const suggestions = (aiSuggestions ?? []) as Array<{
    text?: string;
    rationale?: string;
  }>;

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
    >
      <StepTitle
        title="Write a balanced thought"
        subtitle="Replace the original with something realistic and fair."
      />

      {/* Original thought */}
      <View className="mb-5">
        <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">
          Original thought
        </Text>
        <View
          className="rounded-2xl p-3.5"
          style={{
            backgroundColor: "#FEF2F2",
            borderWidth: 2,
            borderColor: "#FECACA",
          }}
        >
          <Text className="text-sm text-red-700 italic leading-relaxed">
            "{response.automaticThought}"
          </Text>
        </View>
      </View>

      <HelperCard text="A balanced thought doesn't have to be positive. It just needs to be more fair and accurate than the original." />

      {/* AI suggestions */}
      {isAiLoading && (
        <View className="flex-row items-center mb-4">
          <ActivityIndicator size="small" color={INK_MUTED} />
          <Text className="text-[11px] text-ink-muted ml-2 uppercase tracking-wider">
            Crafting options…
          </Text>
        </View>
      )}

      {suggestions.length > 0 && !isAiLoading && (
        <View className="mb-5">
          <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">
            Tap a suggestion to use it
          </Text>
          {suggestions.map((s, i) => {
            const isSelected = response.balancedThought === s.text;
            return (
              <Pressable
                key={i}
                onPress={() =>
                  !readOnly && onUpdate({ balancedThought: s.text ?? "" })
                }
                accessibilityRole="button"
                className="rounded-2xl p-4 mb-3 active:opacity-80"
                style={{
                  borderWidth: 2,
                  borderColor: isSelected ? SAGE[500] : "#E2E8F0",
                  backgroundColor: isSelected ? SAGE.selected : "#FFFFFF",
                  borderBottomWidth: isSelected ? 2 : 4,
                  borderBottomColor: isSelected ? SAGE[500] : "#CBD5E1",
                }}
              >
                <Text
                  className="text-sm leading-relaxed mb-1 font-medium"
                  style={{ color: isSelected ? SAGE[800] : "#334155" }}
                >
                  "{s.text}"
                </Text>
                {s.rationale ? (
                  <Text className="text-xs text-ink-muted">{s.rationale}</Text>
                ) : null}
                {isSelected && (
                  <View
                    className="absolute top-3 right-3 h-5 w-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: SAGE[500] }}
                  >
                    <Text className="text-white text-[10px] font-extrabold">
                      ✓
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      <VoiceTextInput
        value={response.balancedThought}
        onChangeText={(t) => !readOnly && onUpdate({ balancedThought: t })}
        placeholder="e.g. 'My manager is busy. Not responding doesn't mean they dislike my work.'"
        maxLength={300}
        showCharCount
      />
    </StepShell>
  );
}
