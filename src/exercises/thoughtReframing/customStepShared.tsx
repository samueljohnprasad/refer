import React from "react";
import { ActivityIndicator, Pressable, useWindowDimensions, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";
import { Feather } from "@expo/vector-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useTranslation } from "react-i18next";
import { ExerciseCopyText } from "@/src/components/exercise/ExerciseCopyText";

const COLLAPSED_EMOTION_COUNT = 6;

const COLLAPSED_DISTORTION_COUNT = 4;
const MAX_DISTORTIONS = 2;

const CBT_COMPOSER_MIN_HEIGHT = 100;

function useCompactExerciseViewport(): boolean {
  const { width, height } = useWindowDimensions();
  return width < 390 || height < 880;
}

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

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  const translateCopy = useExerciseCopy();
  return (
    <View className="mb-4">
      <Text variant="h1" className="mb-1.5">
        {translateCopy(title)}
      </Text>
      <Text variant="body" className="text-[15px] leading-[21px]">
        {translateCopy(subtitle)}
      </Text>
    </View>
  );
}

function InlineFactHint({ text }: { text: string }) {
  const translateCopy = useExerciseCopy();
  return (
    <View className="mb-5 flex-row items-start px-1">
      <View className="mr-3 mt-[2px]">
        <Feather name="camera" size={15} color={SEMANTIC_COLORS.brand.pressed} />
      </View>
      <Text
        variant="caption"
        className="text-[13px] leading-[19px] flex-1 text-sage-800"
      >
        {translateCopy(text)}
      </Text>
    </View>
  );
}

function InlineThoughtHint({ text }: { text: string }) {
  const translateCopy = useExerciseCopy();
  return (
    <View className="mb-4 flex-row items-start px-1">
      <View className="mr-3 mt-[2px]">
        <Feather name="edit-3" size={15} color={SEMANTIC_COLORS.brand.pressed} />
      </View>
      <Text
        variant="caption"
        className="text-[13px] leading-[19px] flex-1 text-sage-800"
      >
        {translateCopy(text)}
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
  const translateCopy = useExerciseCopy();
  const { t: translateUi } = useTranslation("exercises");
  return (
    <View
      className="py-3"
      style={{ borderTopWidth: 1, borderTopColor: SEMANTIC_COLORS.border.default }}
    >
      <ExerciseCopyText
        variant="caption"
        className="mb-0.5 text-[11px] uppercase tracking-wider text-ink-muted"
      >
        Scenario
      </ExerciseCopyText>
      <Text className="text-[14px] leading-[20px] text-ink-soft">
        {translateCopy(scenario)}
      </Text>

      <ExerciseCopyText
        variant="caption"
        className="mb-0.5 mt-2 text-[11px] uppercase tracking-wider text-sage-500"
      >
        Thought
      </ExerciseCopyText>

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
        accessibilityLabel={
          onUse
            ? translateUi("flow.ui.useExampleThought", {
                thought: translateCopy(thought),
              })
            : undefined
        }
        className={onUse ? "active:opacity-70" : undefined}
      >
        <Text className="text-[15px] leading-[22px] font-medium text-ink">
          {translateCopy(thought)}
        </Text>
      </Pressable>
    </View>
  );
}

function LoadingRow({ message }: { message: string }) {
  const translateCopy = useExerciseCopy();
  return (
    <View
      className="flex-row items-center mb-4 rounded-xl px-3 py-2 border"
      style={{ backgroundColor: SEMANTIC_COLORS.surface.secondary, borderColor: SEMANTIC_COLORS.border.default }}
    >
      <ActivityIndicator size="small" color={SEMANTIC_COLORS.text.disabled} />
      <Text className="text-[13px] text-ink-soft ml-2 font-medium">
        {translateCopy(message)}
      </Text>
    </View>
  );
}

function AiUnavailableNote({ visible }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <ExerciseCopyText variant="caption" className="mb-4 text-ink-soft leading-relaxed">
      Draft prompts are unavailable right now. You can keep writing in your own
      words.
    </ExerciseCopyText>
  );
}

function RequirementNote({
  visible,
  text,
}: {
  visible: boolean;
  text: string;
}) {
  const translateCopy = useExerciseCopy();
  if (!visible) return null;

  return (
    <Text variant="caption" className="mt-3 mb-2 text-ink-soft leading-relaxed">
      {translateCopy(text)}
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
  const translateCopy = useExerciseCopy();
  const { t } = useTranslation("exercises");
  const translatedLabel = translateCopy(label);
  if (!expanded && hiddenCount <= 0) return null;

  return (
    <Pressable
      onPress={() => {
        triggerSelectionHaptic();
        onToggle();
      }}
      accessibilityRole="button"
      accessibilityLabel={
        expanded
          ? t("flow.ui.hideExtra", { label: translatedLabel })
          : t("flow.ui.showMoreItems", { count: hiddenCount, label: translatedLabel })
      }
      accessibilityState={{ expanded }}
      className="mb-4 flex-row items-center justify-between border-t border-sage-100/70 py-2 active:opacity-70"
    >
      <Text variant="label-bold" className="text-[14px] text-ink">
        {expanded
          ? t("flow.ui.fewerItems", { label: translatedLabel })
          : t("flow.ui.moreItems", { label: translatedLabel })}
      </Text>
      <Feather
        name={expanded ? "chevron-up" : "chevron-down"}
        size={16}
        color={SEMANTIC_COLORS.brand.pressed}
      />
    </Pressable>
  );
}

const SITUATION_SUGGESTIONS: SuggestionItem[] = [
  { label: "I received feedback from my manager this morning" },
  { label: "I have a doctor appointment at 3 PM" },
  { label: "I sent a message and have not received a reply yet" },
];

const THOUGHT_SUGGESTIONS: SuggestionItem[] = [
  { label: "I'm not ready for this" },
  { label: "This might go badly" },
  { label: "They may be upset with me" },
];

export { COLLAPSED_EMOTION_COUNT, COLLAPSED_DISTORTION_COUNT, MAX_DISTORTIONS, CBT_COMPOSER_MIN_HEIGHT, useCompactExerciseViewport, StepShell, StepTitle, InlineFactHint, InlineThoughtHint, ExampleDetailRow, LoadingRow, AiUnavailableNote, RequirementNote, MoreOptionsButton, SITUATION_SUGGESTIONS, THOUGHT_SUGGESTIONS };
