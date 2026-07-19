import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
}

interface MultiFieldStepProps extends StepProps {
  title: string;
  subtitle: string;
  fields: FieldDef[];
}

export const MultiFieldStep: React.FC<MultiFieldStepProps> = React.memo(
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
    fields,
    isSaving,
    readOnly,
    autoFocus = true,
  }) => {
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
        {fields.map((field, index) => {
          const value = (response as Record<string, any>)[field.key] ?? "";
          return (
            <View key={field.key} className="mb-4">
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {field.label}
              </Text>
              <TextInput
                value={value}
                onChangeText={(text) => onUpdate({ [field.key]: text } as any)}
                placeholder={field.placeholder ?? "Type here..."}
                placeholderTextColor="#94A3B8"
                maxLength={field.maxLength ?? 300}
                multiline={field.multiline ?? true}
                textAlignVertical="top"
                accessibilityLabel={field.label}
                className="text-sm text-slate-800 bg-slate-50 rounded-xl p-3 min-h-[60px]"
                style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
                editable={!readOnly}
                autoFocus={!readOnly && autoFocus && index === 0}
              />
            </View>
          );
        })}
      </StepLayout>
    );
  },
);

MultiFieldStep.displayName = "MultiFieldStep";
