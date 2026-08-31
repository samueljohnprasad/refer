import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { Card } from "@/src/components/ui/Card";
import { useLocalAI, LocalAIStatus } from "@/src/hooks/useAppleIntelligence";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  SparklesIcon,
  ArrowRight01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_INPUT_LENGTH = 500;
const KEYBOARD_VERTICAL_OFFSET = 100;
const MIN_BOTTOM_PADDING = 12;

const ERROR_COLOR = "#e7000b";
const CURSOR_COLOR = SEMANTIC_COLORS.brand.primary;
const SEND_ACTIVE_COLOR = SEMANTIC_COLORS.brand.pressed;
const SEND_INACTIVE_BG = SEMANTIC_COLORS.brand.soft;
const INPUT_BORDER_COLOR = SEMANTIC_COLORS.brand.soft;
const SEND_BTN_SIZE = 36;

// ─── Preset Prompts ──────────────────────────────────────────────────────────

interface PresetPrompt {
  readonly id: string;
  readonly label: string;
  readonly prompt: string;
  readonly emoji: string;
}

const PRESET_PROMPTS: readonly PresetPrompt[] = [
  {
    id: "reframe",
    label: "Reframe a thought",
    prompt:
      "Help me reframe a negative thought into something more balanced and constructive. Ask me what thought I want to reframe.",
    emoji: "🔄",
  },
  {
    id: "gratitude",
    label: "Gratitude boost",
    prompt:
      "Give me 3 unique and specific gratitude prompts that go beyond the obvious, tailored for someone focused on personal growth.",
    emoji: "🌟",
  },
  {
    id: "breathe",
    label: "Breathing guide",
    prompt:
      "Guide me through a simple 2-minute box breathing exercise step by step. Be calm and supportive.",
    emoji: "🌿",
  },
  {
    id: "journal",
    label: "Journal prompt",
    prompt:
      "Give me a deep, reflective journal prompt for today that helps me understand my emotions better.",
    emoji: "📝",
  },
  {
    id: "affirm",
    label: "Daily affirmation",
    prompt:
      "Create a powerful, personalized daily affirmation about self-compassion and growth. Make it feel genuine, not generic.",
    emoji: "💪",
  },
] as const;

// ─── Status Indicator ────────────────────────────────────────────────────────

const STATUS_LABELS: Record<LocalAIStatus, string> = {
  [LocalAIStatus.IDLE]: "",
  [LocalAIStatus.DOWNLOADING]: "Downloading AI model (first time only)…",
  [LocalAIStatus.LOADING]: "Thinking…",
  [LocalAIStatus.STREAMING]: "Writing…",
  [LocalAIStatus.DONE]: "Complete",
  [LocalAIStatus.ERROR]: "Something went wrong",
  [LocalAIStatus.UNAVAILABLE]: "Not available",
};

function resolveStatusDotColor(status: LocalAIStatus): string {
  if (status === LocalAIStatus.ERROR || status === LocalAIStatus.UNAVAILABLE)
    return ERROR_COLOR;
  if (status === LocalAIStatus.DOWNLOADING) return SEMANTIC_COLORS.brand.primary;
  if (status === LocalAIStatus.DONE) return SEMANTIC_COLORS.brand.primary;
  return SEMANTIC_COLORS.brand.primary;
}

const StatusIndicator: React.FC<{
  readonly status: LocalAIStatus;
  readonly downloadProgress?: number;
}> = React.memo(({ status, downloadProgress = 0 }) => {
  const label = useMemo(() => {
    if (status === LocalAIStatus.DOWNLOADING) {
      const pct =
        downloadProgress > 1 ? downloadProgress / 100 : downloadProgress;
      const totalGB = 1.72;
      const downloadedGB = (pct * totalGB).toFixed(2);
      return `Downloading AI model (first time only) • ${downloadedGB}GB / ${totalGB}GB`;
    }
    return STATUS_LABELS[status];
  }, [status, downloadProgress]);

  if (status === LocalAIStatus.IDLE) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      className="flex-row items-center gap-2 px-1 mb-2"
    >
      <View
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: resolveStatusDotColor(status) }}
      />
      <Text
        className="happy-font-body text-[12px]"
        style={{ color: SEMANTIC_COLORS.text.tertiary }}
      >
        {label}
      </Text>
    </Animated.View>
  );
});

// ─── Preset Chip ─────────────────────────────────────────────────────────────

const PresetChip: React.FC<{
  readonly preset: PresetPrompt;
  readonly onPress: (preset: PresetPrompt) => void;
  readonly disabled: boolean;
}> = React.memo(({ preset, onPress, disabled }) => {
  const handlePress = useCallback(() => onPress(preset), [onPress, preset]);

  return (
    <PressableScale
      onPress={handlePress}
      disabled={disabled}
      scale={0.96}
      hapticStyle="light"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <View className="flex-row items-center gap-3 px-4 py-3.5 rounded-2xl bg-sage-50 border border-sage-100">
        <View className="h-8 w-8 rounded-full bg-sage-pill items-center justify-center">
          <Text className="text-[14px]">{preset.emoji}</Text>
        </View>
        <Text
          className="happy-font-body-bold text-[15px] flex-1"
          style={{ color: SEMANTIC_COLORS.brand.onSoft }}
        >
          {preset.label}
        </Text>
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={SEMANTIC_COLORS.brand.primary} />
      </View>
    </PressableScale>
  );
});

// ─── Unavailable Banner ───────────────────────────────────────────────────────

const UnavailableBanner: React.FC = React.memo(() => (
  <Card variant="tile" radius="xl" haptic="none" className="mt-4">
    <View className="p-5 items-center gap-3">
      <Text className="text-[40px]">🍎</Text>
      <Text
        className="happy-font-body-bold text-[16px] text-center"
        style={{ color: SEMANTIC_COLORS.text.primary }}
      >
        Apple Intelligence Required
      </Text>
      <Text
        className="happy-font-body text-[14px] text-center leading-5"
        style={{ color: SEMANTIC_COLORS.text.secondary }}
      >
        This feature requires an iPhone with Apple Intelligence enabled and iOS
        26 or later.
      </Text>
    </View>
  </Card>
));

// ─── Response Card ────────────────────────────────────────────────────────────

const ResponseCard: React.FC<{
  readonly response: string;
  readonly status: LocalAIStatus;
  readonly downloadProgress?: number;
  readonly onReset: () => void;
}> = React.memo(({ response, status, downloadProgress, onReset }) => (
  <Animated.View entering={FadeIn.duration(300)}>
    <View className="mb-4 rounded-3xl bg-sage-50 p-5 border border-sage-100">
      <StatusIndicator status={status} downloadProgress={downloadProgress} />
      <Text
        className="happy-font-body text-[16px] leading-7 mt-1"
        style={{ color: SEMANTIC_COLORS.brand.onSoft }}
        selectable
      >
        {response}
        {status === LocalAIStatus.STREAMING && (
          <Text style={{ color: CURSOR_COLOR }}> ▌</Text>
        )}
      </Text>
    </View>

    {status === LocalAIStatus.DONE && (
      <Animated.View
        entering={FadeIn.duration(200)}
        className="items-center mb-4"
      >
        <PressableScale onPress={onReset} scale={0.96} hapticStyle="light">
          <View className="rounded-full bg-sage-pill px-6 py-3 border border-sage-200">
            <Text
              className="happy-font-body-bold text-[14px]"
              style={{ color: SEMANTIC_COLORS.brand.onSoft }}
            >
              New conversation
            </Text>
          </View>
        </PressableScale>
      </Animated.View>
    )}
  </Animated.View>
));

// ─── Error Card ───────────────────────────────────────────────────────────────

const ErrorCard: React.FC<{ readonly message: string }> = React.memo(
  ({ message }) => (
    <Animated.View entering={FadeIn.duration(200)}>
      <Card variant="tile" radius="xl" haptic="none" className="mt-3">
        <View className="p-4">
          <Text
            className="happy-font-body text-[14px]"
            style={{ color: ERROR_COLOR }}
          >
            {message}
          </Text>
        </View>
      </Card>
    </Animated.View>
  ),
);

// ─── Input Bar ────────────────────────────────────────────────────────────────

interface InputBarProps {
  readonly value: string;
  readonly isProcessing: boolean;
  readonly bottomInset: number;
  readonly onChangeText: (text: string) => void;
  readonly onSubmit: () => void;
}

const InputBar: React.FC<InputBarProps> = React.memo(
  ({ value, isProcessing, bottomInset, onChangeText, onSubmit }) => {
    const isEmpty = value.trim().length === 0;
    const isDisabled = isProcessing || isEmpty;

    return (
      <Animated.View
        entering={FadeInDown.duration(300).delay(200)}
        className="px-4"
        style={{ paddingBottom: Math.max(bottomInset, MIN_BOTTOM_PADDING) }}
      >
        <View
          className="flex-row items-end gap-2 rounded-[24px] px-4 py-2 bg-white"
          style={{
            borderWidth: 1.5,
            borderColor: SEMANTIC_COLORS.selection.foreground,
            shadowColor: SEMANTIC_COLORS.brand.onSoft,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Ask Sage anything…"
            placeholderTextColor={SEMANTIC_COLORS.brand.primary}
            multiline
            maxLength={MAX_INPUT_LENGTH}
            editable={!isProcessing}
            className="flex-1 happy-font-body text-[16px] py-2.5 max-h-24"
            style={{ color: SEMANTIC_COLORS.brand.onSoft }}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={onSubmit}
          />
          <PressableScale
            onPress={onSubmit}
            disabled={isDisabled}
            scale={0.9}
            hapticStyle="medium"
            className="mb-1.5"
          >
            <View
              className="rounded-full items-center justify-center"
              style={{
                width: SEND_BTN_SIZE,
                height: SEND_BTN_SIZE,
                backgroundColor: isDisabled ? SEMANTIC_COLORS.brand.soft : SEMANTIC_COLORS.brand.pressed,
              }}
            >
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                size={20}
                color={isDisabled ? SEMANTIC_COLORS.border.selected : "#ffffff"}
              />
            </View>
          </PressableScale>
        </View>
      </Animated.View>
    );
  },
);

// ─── Presentation Component ───────────────────────────────────────────────────

interface AppleIntelligencePresentationProps {
  readonly response: string;
  readonly status: LocalAIStatus;
  readonly downloadProgress: number;
  readonly error: string | null;
  readonly isAvailable: boolean;
  readonly inputValue: string;
  readonly presets: readonly PresetPrompt[];
  readonly onInputChange: (text: string) => void;
  readonly onSubmit: () => void;
  readonly onPresetPress: (prompt: PresetPrompt) => void;
  readonly onReset: () => void;
}

const AppleIntelligencePresentation: React.FC<AppleIntelligencePresentationProps> =
  React.memo(
    ({
      response,
      status,
      downloadProgress,
      error,
      isAvailable,
      inputValue,
      presets,
      onInputChange,
      onSubmit,
      onPresetPress,
      onReset,
    }) => {
      const insets = useSafeAreaInsets();
      const isProcessing =
        status === LocalAIStatus.DOWNLOADING ||
        status === LocalAIStatus.LOADING ||
        status === LocalAIStatus.STREAMING;
      const hasResponse =
        response.length > 0 ||
        status === LocalAIStatus.DOWNLOADING ||
        status === LocalAIStatus.LOADING;

      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
        >
          <View className="flex-1 happy-brand-screen">
            <ScrollView
              className="flex-1"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 24,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Hero */}
              <Animated.View
                entering={FadeInDown.duration(300)}
                className="items-center mb-6 mt-4"
              >
                <View
                  className="h-16 w-16 rounded-full items-center justify-center mb-4"
                  style={{
                    backgroundColor: SEMANTIC_COLORS.brand.soft,
                    borderWidth: 4,
                    borderColor: SEMANTIC_COLORS.selection.surface,
                  }}
                >
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    size={32}
                    color={SEMANTIC_COLORS.brand.pressed}
                  />
                </View>
                <Text
                  className="happy-font-body-bold text-[24px] text-center tracking-tight"
                  style={{ color: SEMANTIC_COLORS.brand.onSoft }}
                >
                  Hi, I'm Sage.
                </Text>
                <Text
                  className="happy-font-body text-[15px] text-center mt-2 px-6 leading-6"
                  style={{ color: SEMANTIC_COLORS.brand.pressed }}
                >
                  I'm your on-device intelligence companion. Private, secure,
                  and ready to help.
                </Text>
              </Animated.View>

              {/* Preset prompts — shown when no response yet */}
              {isAvailable && !hasResponse && (
                <Animated.View entering={FadeInDown.duration(300).delay(100)}>
                  <Text className="happy-brand-eyebrow mb-3 px-1">
                    Try a prompt
                  </Text>
                  <View className="gap-2">
                    {presets.map((preset, index) => (
                      <Animated.View
                        key={preset.id}
                        entering={FadeInDown.duration(250).delay(
                          150 + index * 50,
                        )}
                      >
                        <PresetChip
                          preset={preset}
                          onPress={onPresetPress}
                          disabled={isProcessing}
                        />
                      </Animated.View>
                    ))}
                  </View>
                </Animated.View>
              )}

              {hasResponse && (
                <ResponseCard
                  response={response}
                  status={status}
                  downloadProgress={downloadProgress}
                  onReset={onReset}
                />
              )}

              {error && status === LocalAIStatus.ERROR && (
                <ErrorCard message={error} />
              )}
            </ScrollView>

            {isAvailable && (
              <InputBar
                value={inputValue}
                isProcessing={isProcessing}
                bottomInset={insets.bottom}
                onChangeText={onInputChange}
                onSubmit={onSubmit}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      );
    },
  );

import { llama, downloadModel } from "@react-native-ai/llama";
import { LOCAL_MODELS } from "@/src/constants/models";
import { createAIProvider } from "@/src/services/ai";

let isTesting = false;

// ─── Container Component ──────────────────────────────────────────────────────

export default function AppleIntelligenceScreen(): React.ReactElement {
  const ai = useLocalAI();

  useEffect(() => {
    const testProvider = async (): Promise<void> => {
      if (isTesting) return;
      isTesting = true;
      try {
        console.log("Provider Test: Starting...");

        // 1. Download and prepare the model
        const modelPath: string = await downloadModel(LOCAL_MODELS.LFM_2_5_VL_450M);
        const model = llama.languageModel(modelPath);
        await model.prepare();
        console.log("Provider Test: Model ready");

        // 2. Use the new provider layer
        const provider = createAIProvider('local-llm');

        // 3. Test with a Thought Catcher–style schema (array of objects)
        const items = await provider.generateStructured({
          model,
          prompt: 'You are a CBT therapist assistant. The user just described a stressful situation: "I dropped my coffee on my lap during a meeting". Generate 3 highly varied, distinct automatic negative thoughts they might be having right now. Make them sound like natural, spontaneous human fears. Each thought should be written in first person and be concise (1 sentence).',
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
              },
              required: ["text"],
            },
          },
          maxResults: 3,
        });

        console.log("Provider Test: Success!", JSON.stringify(items, null, 2));
      } catch (error) {
        console.error("Provider Test: Error", error);
      } finally {
        isTesting = false;
      }
    };
    testProvider();
  }, []);
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = useCallback(async (): Promise<void> => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setInputValue("");
    await ai.generate(trimmed);
  }, [inputValue, ai]);

  const handlePresetPress = useCallback(
    async (preset: PresetPrompt): Promise<void> => {
      setInputValue("");
      await ai.generate(preset.prompt);
    },
    [ai],
  );

  const handleReset = useCallback((): void => {
    ai.reset();
    setInputValue("");
  }, [ai]);

  return (
    <AppleIntelligencePresentation
      response={ai.response}
      status={ai.status}
      downloadProgress={ai.downloadProgress}
      error={ai.error}
      isAvailable={ai.isAvailable}
      inputValue={inputValue}
      presets={PRESET_PROMPTS}
      onInputChange={setInputValue}
      onSubmit={handleSubmit}
      onPresetPress={handlePresetPress}
      onReset={handleReset}
    />
  );
}
