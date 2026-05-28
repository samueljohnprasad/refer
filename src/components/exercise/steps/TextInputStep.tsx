import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Idea01Icon } from "@hugeicons/core-free-icons";
import { StepLayout } from "./StepLayout";
import { SAGE } from "@/lib/tokens";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import type { StepProps } from "@/src/types/exerciseFlow";

interface TextInputStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  tipText?: string;
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
    isSaving,
  }) => {
    const value: string = (response as Record<string, any>)[fieldKey] ?? "";
    const [isFocused, setIsFocused] = useState<boolean>(false);

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
          <FadeInItem index={0}>
            <View className="rounded-2xl p-4 mb-5 flex-row items-start bg-sage-pill border border-sage-200/50">
              <View className="h-8.5 w-8.5 rounded-xl bg-sage-50 items-center justify-center mr-3 mt-0.5 shadow-sm">
                <HugeiconsIcon
                  icon={Idea01Icon}
                  size={18}
                  color={SAGE[500]}
                  strokeWidth={2}
                />
              </View>
              <Text variant="body" color="soft" className="text-[14.5px] leading-relaxed flex-1 font-medium text-sage-800">
                {tipText}
              </Text>
            </View>
          </FadeInItem>
        )}

        <FadeInItem index={tipText ? 1 : 0} className="flex-1">
          <View className="flex-1 mb-4">
            <TextInput
              value={value}
              onChangeText={(text: string) => onUpdate({ [fieldKey]: text } as any)}
              placeholder={placeholder}
              placeholderTextColor="#AFAFAF"
              maxLength={maxLength}
              multiline={multiline}
              textAlignVertical="top"
              accessibilityLabel={title}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`flex-1 text-[17px] happy-font-body text-ink bg-brand-surface rounded-2xl p-4 min-h-[140px] border-2 ${
                isFocused ? "border-sage-500 shadow-md" : "border-brand-border/80"
              }`}
              style={{
                shadowColor: SAGE[500],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isFocused ? 0.08 : 0,
                shadowRadius: 4,
                elevation: isFocused ? 2 : 0,
              }}
            />
            {maxLength && (
              <Text variant="caption-muted" className="text-right mt-1.5">
                {value.length} / {maxLength}
              </Text>
            )}
          </View>
        </FadeInItem>
      </StepLayout>
    );
  },
);

TextInputStep.displayName = "TextInputStep";
