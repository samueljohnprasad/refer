// ponytail: titled sections of single-choice chip rows (minutes per activity, day and time per
// activity). The caller supplies sections and turns a pick into a response patch.
import React from "react";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

export interface ChipRow {
  id: string;
  options: { value: number; label: string; a11y?: string }[];
  value: number | null;
}

export interface ChipSection {
  id: string;
  title: string;
  rows: ChipRow[];
}

interface ChipRowsStepProps extends StepProps<any> {
  title: string;
  subtitle: string;
  sections: ChipSection[];
  onPick: (sectionId: string, rowId: string, value: number) => void;
}

export const ChipRowsStep: React.FC<ChipRowsStepProps> = React.memo(
  ({ title, subtitle, sections, onPick, progress, stepIndex, totalSteps, canGoBack, isValid, onBack, onNext, isSaving }) => (
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
      showStepCount={false}
    >
      <View className="pt-2">
        {sections.map((section) => (
          <View key={section.id} className="mb-5">
            <Text className="mb-2 font-bold text-ink">{section.title}</Text>
            {section.rows.map((row) => (
              <View key={row.id} accessibilityRole="radiogroup" className="flex-row gap-1.5 mb-2">
                {row.options.map((o) => {
                  const on = row.value === o.value;
                  return (
                    <Pressable
                      key={o.value}
                      accessibilityRole="radio"
                      accessibilityLabel={o.a11y ?? o.label}
                      accessibilityState={{ selected: on }}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        onPick(section.id, row.id, o.value);
                      }}
                      className={`flex-1 min-h-11 items-center justify-center rounded-xl border-2 px-1 ${on ? "bg-sage-100 border-sage-600" : "bg-white border-sage-200"}`}
                    >
                      <Text className={`text-center font-bold ${on ? "text-sage-800" : "text-ink-soft"}`}>{o.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        ))}
      </View>
    </StepLayout>
  ),
);
ChipRowsStep.displayName = "ChipRowsStep";
