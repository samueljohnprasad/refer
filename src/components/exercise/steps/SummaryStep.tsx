import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { getExerciseIcon, getCategoryTint } from "@/src/data/exerciseIconRegistry";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";
import { PostExerciseInsight } from "@/src/components/insights/PostExerciseInsight";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { SAGE } from "@/lib/tokens";
import type { StepProps, ExerciseType } from "@/src/types/exerciseFlow";
import { LessonScreen } from "@/src/components/ui/LessonScreen";

interface SummaryField {
  label: string;
  value: string | number | string[] | boolean | null | undefined;
}

interface SummaryStepProps extends StepProps {
  title?: string;
  exerciseType?: string;
  icon?: string;
  fields: SummaryField[];
  onSave: () => void;
  saveLabel?: string;
}

export const SummaryStep: React.FC<SummaryStepProps> = React.memo(
  ({
    title = "Great work!",
    exerciseType,
    fields,
    onSave,
    saveLabel = "Save & Finish",
    isSaving,
    response,
  }) => {
    const config = exerciseType ? getExerciseConfig(exerciseType as any) : null;
    const category = config?.category ?? "cbt_core";
    const tint = getCategoryTint(category);

    const iconObj = exerciseType
      ? getExerciseIcon(exerciseType)
      : CheckmarkCircle01Icon;

    const formatValue = (val: SummaryField["value"]): string => {
      if (val === null || val === undefined) return "—";
      if (typeof val === "boolean") return val ? "Yes" : "No";
      if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "—";
      return String(val);
    };

    return (
      <View className="w-full px-1">
          <View className="items-center mb-6 pt-2">
            <FadeInItem index={0}>
              <View
                className={`h-16 w-16 rounded-full items-center justify-center mb-3.5 shadow-sm ${tint.iconBg}`}
              >
                {exerciseType ? (
                  <ExerciseIcon type={exerciseType as ExerciseType} size={32} color={tint.iconColor} />
                ) : (
                  <HugeiconsIcon icon={iconObj} size={32} color={tint.iconColor} strokeWidth={2} />
                )}
              </View>
            </FadeInItem>
            <FadeInItem index={1}>
              <Text variant="display" className="text-center leading-none">
                {title}
              </Text>
            </FadeInItem>
          </View>

          {exerciseType && response && (
            <FadeInItem index={2} className="mb-4">
              <PostExerciseInsight
                exerciseType={exerciseType as ExerciseType}
                response={response}
              />
            </FadeInItem>
          )}
          <FadeInItem index={3}>
            <Card
              variant="tile"
              radius="xl"
              showDepth={false}
              className="mb-8"
              contentClassName="p-4"
            >
              {fields.map((field, i) => {
                const display = formatValue(field.value);
                if (display === "—" || !display.trim()) return null;
                const isLast = i === fields.length - 1;

                return (
                  <View
                    key={i}
                    className={`py-3.5 ${
                      !isLast ? "border-b border-brand-border/40" : ""
                    }`}
                  >
                    <Text variant="overline" className="mb-1 text-sage-600 font-bold">
                      {field.label}
                    </Text>
                    <Text variant="body-bold" color="ink" className="leading-relaxed">
                      {display}
                    </Text>
                  </View>
                );
              })}
            </Card>
          </FadeInItem>
      </View>
    );
  },
);

SummaryStep.displayName = "SummaryStep";
