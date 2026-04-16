import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Idea01Icon } from "@hugeicons/core-free-icons";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

interface TextInputStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  tipText?: string;
  /** @deprecated Replaced by Hugeicons Idea01Icon */
  tipEmoji?: string;
}

export const TextInputStep: React.FC<TextInputStepProps> = React.memo(
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
    placeholder = "Type here...",
    maxLength = 500,
    multiline = true,
    tipText,
    tipEmoji,
    isSaving,
  }) => {
    const value = (response as Record<string, any>)[fieldKey] ?? "";

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
        {tipText && (
          <View
            className="rounded-2xl p-3.5 mb-4 flex-row items-start"
            style={{
              backgroundColor: "#EFF6FF",
              borderWidth: 2,
              borderColor: "#BFDBFE",
            }}
          >
            <View className="h-8 w-8 rounded-lg bg-blue-100 items-center justify-center mr-3 mt-0.5">
              <HugeiconsIcon
                icon={Idea01Icon}
                size={18}
                color="#3B82F6"
                strokeWidth={1.6}
              />
            </View>
            <Text className="text-sm text-blue-800 leading-relaxed flex-1 font-medium">
              {tipText}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <TextInput
            value={value}
            onChangeText={(text) => onUpdate({ [fieldKey]: text } as any)}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            maxLength={maxLength}
            multiline={multiline}
            textAlignVertical="top"
            accessibilityLabel={title}
            className="flex-1 text-base text-slate-800 bg-slate-50 rounded-2xl p-4 min-h-[120px]"
            style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
          />
          {maxLength && (
            <Text className="text-xs text-slate-400 text-right mt-1">
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      </StepLayout>
    );
  },
);

TextInputStep.displayName = "TextInputStep";
