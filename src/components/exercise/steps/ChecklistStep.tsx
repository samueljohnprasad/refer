import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React, { useState } from "react";
import { View, Pressable, TextInput } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

interface ChecklistItem {
  label: string;
  value: string;
}

interface ChecklistStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  presetItems?: ChecklistItem[];
  allowCustom?: boolean;
  minChecked?: number;
}

export const ChecklistStep: React.FC<ChecklistStepProps> = React.memo(
  ({
    response,
    onUpdate,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    title,
    subtitle,
    fieldKey,
    presetItems = [],
    allowCustom = false,
    minChecked = 1,
    isSaving,
    readOnly,
    autoFocus,
  }) => {
    const checked: string[] = (response as Record<string, any>)[fieldKey] ?? [];
    const [customDraft, setCustomDraft] = useState("");

    const toggle = (value: string) => {
      if (readOnly) return;
      triggerSelectionHaptic();
      const next = checked.includes(value)
        ? checked.filter((v) => v !== value)
        : [...checked, value];
      onUpdate({ [fieldKey]: next } as any);
    };

    const addCustom = () => {
      if (readOnly) return;
      const trimmed = customDraft.trim();
      if (!trimmed || checked.includes(trimmed)) return;
      triggerSelectionHaptic();
      onUpdate({ [fieldKey]: [...checked, trimmed] } as any);
      setCustomDraft("");
    };

    return (
      <StepLayout
        title={title}
        subtitle={subtitle}
        progress={progress}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        canGoBack={canGoBack}
        isValid={isValid}
        onBack={onBack}
        onNext={onNext}
        isLoading={isSaving}
        scrollable
      >
        {presetItems.map((item) => {
          const isChecked = checked.includes(item.value);
          return (
            <Pressable
              key={item.value}
              onPress={() => toggle(item.value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              accessibilityLabel={item.label}
              className="flex-row items-center py-3 px-3 mb-1 rounded-xl"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: SEMANTIC_COLORS.border.default,
                backgroundColor: isChecked ? SEMANTIC_COLORS.brand.soft : "transparent",
              }}
            >
              <View
                className="w-6 h-6 rounded-lg items-center justify-center mr-3"
                style={{
                  backgroundColor: isChecked ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.surface.primary,
                  borderWidth: 2,
                  borderColor: isChecked ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.border.default,
                }}
              >
                {isChecked && (
                  <Text className="text-white text-xs font-bold">✓</Text>
                )}
              </View>
              <Text
                className="text-sm flex-1"
                style={{ color: isChecked ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.text.primary }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        {allowCustom && (
          <View className="flex-row items-center mt-3">
            <TextInput
              value={customDraft}
              onChangeText={setCustomDraft}
              onSubmitEditing={addCustom}
              placeholder="Add custom item..."
              placeholderTextColor={SEMANTIC_COLORS.text.disabled}
              returnKeyType="done"
              accessibilityLabel="Add custom checklist item"
              className="flex-1 text-sm text-ink bg-white rounded-xl p-3 mr-2"
              style={{ borderWidth: 2, borderColor: SEMANTIC_COLORS.border.default }}
              editable={!readOnly}
              autoFocus={!readOnly && autoFocus && presetItems.length === 0}
            />
            <Pressable
              onPress={addCustom}
              disabled={!customDraft.trim()}
              accessibilityRole="button"
              className="h-11 w-11 rounded-xl items-center justify-center"
              style={{
                backgroundColor: customDraft.trim() ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.border.default,
              }}
            >
              <Text className="text-white font-bold text-lg">+</Text>
            </Pressable>
          </View>
        )}

        <Text className="text-xs text-ink-muted mt-2">
          {checked.length} checked{minChecked > 0 ? ` (min ${minChecked})` : ""}
        </Text>
      </StepLayout>
    );
  },
);

ChecklistStep.displayName = "ChecklistStep";
