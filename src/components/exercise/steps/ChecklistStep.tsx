import React, { useState } from "react";
import { View, Pressable, TextInput } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

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
    allowCustom = true,
    minChecked = 1,
    isSaving,
  }) => {
    const checked: string[] = (response as Record<string, any>)[fieldKey] ?? [];
    const [customDraft, setCustomDraft] = useState("");

    const toggle = (value: string) => {
      if (checked.includes(value)) {
        onUpdate({ [fieldKey]: checked.filter((v) => v !== value) } as any);
      } else {
        onUpdate({ [fieldKey]: [...checked, value] } as any);
      }
    };

    const addCustom = () => {
      const trimmed = customDraft.trim();
      if (!trimmed) return;
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
              className="flex-row items-center py-3 px-2"
              style={{ borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}
            >
              <View
                className="w-6 h-6 rounded-lg items-center justify-center mr-3"
                style={{
                  backgroundColor: isChecked ? "#58CC02" : "#F8FAFC",
                  borderWidth: 2,
                  borderColor: isChecked ? "#58CC02" : "#E2E8F0",
                }}
              >
                {isChecked && (
                  <Text className="text-white text-xs font-bold">✓</Text>
                )}
              </View>
              <Text
                className="text-sm flex-1"
                style={{ color: isChecked ? "#15803D" : "#475569" }}
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
              placeholderTextColor="#94A3B8"
              returnKeyType="done"
              accessibilityLabel="Add custom checklist item"
              className="flex-1 text-sm text-slate-800 bg-white rounded-xl p-3 mr-2"
              style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
            />
            <Pressable
              onPress={addCustom}
              disabled={!customDraft.trim()}
              accessibilityRole="button"
              className="h-11 w-11 rounded-xl items-center justify-center"
              style={{
                backgroundColor: customDraft.trim() ? "#58CC02" : "#E2E8F0",
              }}
            >
              <Text className="text-white font-bold text-lg">+</Text>
            </Pressable>
          </View>
        )}

        <Text className="text-xs text-slate-400 mt-2">
          {checked.length} checked{minChecked > 0 ? ` (min ${minChecked})` : ""}
        </Text>
      </StepLayout>
    );
  },
);

ChecklistStep.displayName = "ChecklistStep";
