import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

interface RecordMapStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  keys: string[];
  keyLabels?: Record<string, string>;
  placeholder?: string;
  maxLength?: number;
}

export const RecordMapStep: React.FC<RecordMapStepProps> = React.memo(
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
    keys,
    keyLabels = {},
    placeholder = "Type here...",
    maxLength = 300,
    isSaving,
    readOnly,
    autoFocus = true,
  }) => {
    const record: Record<string, string> =
      (response as Record<string, any>)[fieldKey] ?? {};

    const handleChange = (key: string, value: string) => {
      onUpdate({ [fieldKey]: { ...record, [key]: value } } as any);
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
        {keys.map((key, index) => (
          <View key={key} className="mb-4">
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {keyLabels[key] ?? key}
            </Text>
            <TextInput
              value={record[key] ?? ""}
              onChangeText={(text) => handleChange(key, text)}
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              maxLength={maxLength}
              multiline
              textAlignVertical="top"
              accessibilityLabel={keyLabels[key] ?? key}
              className="text-sm text-slate-800 bg-slate-50 rounded-xl p-3 min-h-[60px]"
              style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
              editable={!readOnly}
              autoFocus={!readOnly && autoFocus && index === 0}
            />
          </View>
        ))}
      </StepLayout>
    );
  },
);

RecordMapStep.displayName = "RecordMapStep";
