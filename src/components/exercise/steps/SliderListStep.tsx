// ponytail: several labelled 0-10 sliders on one step (rungs, expected/actual feeling). The caller
// maps response → rows and a change back to a response patch, so this knows no exercise.
import React from "react";
import { View } from "react-native";
import Slider from "@react-native-community/slider";
import { Text } from "@/src/components/ui/Text";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

export interface SliderRow {
  id: string;
  label: string;
  value: number;
  /** short line under the label, e.g. "You guessed: Somewhat" */
  hint?: string;
  /** word shown beside the value, e.g. "Somewhat" */
  valueText?: string;
}

interface SliderListStepProps extends StepProps<any> {
  title: string;
  subtitle: string;
  rows: SliderRow[];
  onChange: (id: string, value: number) => void;
  showStepCount?: boolean;
}

export const SliderListStep: React.FC<SliderListStepProps> = React.memo(
  ({ title, subtitle, rows, onChange, showStepCount = false, progress, stepIndex, totalSteps, canGoBack, isValid, onBack, onNext, isSaving }) => (
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
      showStepCount={showStepCount}
    >
      <View className="px-1 pt-2">
        {rows.map((row) => (
          <View key={row.id} className="mb-5">
            <View className="flex-row items-baseline justify-between gap-3">
              <Text className="flex-1 font-bold text-ink">{row.label}</Text>
              <Text className="font-bold text-sage-800">{row.valueText ?? `${row.value}/10`}</Text>
            </View>
            {row.hint ? <Text variant="caption" className="text-ink-soft">{row.hint}</Text> : null}
            <Slider
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={row.value}
              onValueChange={(v: number) => onChange(row.id, v)}
              minimumTrackTintColor={SEMANTIC_COLORS.brand.primary as string}
              maximumTrackTintColor={SEMANTIC_COLORS.surface.secondary as string}
              thumbTintColor={SEMANTIC_COLORS.brand.primary as string}
              accessibilityLabel={row.label}
              accessibilityValue={{ min: 0, max: 10, now: row.value, text: `${row.value} out of 10` }}
              style={{ height: 44 }}
            />
          </View>
        ))}
      </View>
    </StepLayout>
  ),
);
SliderListStep.displayName = "SliderListStep";
