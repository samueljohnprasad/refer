import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React, { useState } from "react";
import { View, Pressable, TextInput } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

interface TimePickerStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  mode?: "time" | "date" | "datetime";
  presets?: { label: string; value: string }[];
}

export const TimePickerStep: React.FC<TimePickerStepProps> = React.memo(
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
    presets,
    isSaving,
    readOnly,
    autoFocus = true,
  }) => {
    const value = (response as Record<string, any>)[fieldKey] ?? "";
    const [customValue, setCustomValue] = useState(value);

    const handlePreset = (preset: string) => {
      onUpdate({ [fieldKey]: preset } as any);
      setCustomValue(preset);
    };

    const handleCustom = (text: string) => {
      setCustomValue(text);
      onUpdate({ [fieldKey]: text } as any);
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
      >
        {presets && presets.length > 0 && (
          <View className="gap-2 mb-4">
            {presets.map((preset) => {
              const selected = value === preset.value;
              return (
                <Pressable
                  key={preset.value}
                  onPress={() => handlePreset(preset.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  className="rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: selected ? SEMANTIC_COLORS.brand.soft : SEMANTIC_COLORS.surface.primary,
                    borderWidth: 2,
                    borderColor: selected ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.border.default,
                  }}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: selected ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.text.primary }}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <TextInput
          value={customValue}
          onChangeText={handleCustom}
          placeholder="e.g., 10:30 PM or Tomorrow 3pm"
          placeholderTextColor={SEMANTIC_COLORS.text.disabled}
          accessibilityLabel={title}
          className="text-base text-ink bg-white rounded-xl p-4"
          style={{ borderWidth: 2, borderColor: SEMANTIC_COLORS.border.default }}
          editable={!readOnly}
          autoFocus={!readOnly && autoFocus && (!presets || presets.length === 0)}
        />
      </StepLayout>
    );
  },
);

TimePickerStep.displayName = "TimePickerStep";
