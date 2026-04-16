import React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { getExerciseIcon } from "@/src/data/exerciseIconRegistry";
import type { StepProps, ExerciseType } from "@/src/types/exerciseFlow";

interface SummaryField {
  label: string;
  value: string | number | string[] | boolean | null | undefined;
}

interface SummaryStepProps extends StepProps {
  title?: string;
  /** Exercise type key — resolved to a Hugeicon from the registry */
  exerciseType?: string;
  /** @deprecated Use exerciseType instead. Kept for backward compat. */
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
  }) => {
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
      <View className="flex-1">
        <View className="items-center mb-6 pt-4">
          <View
            className="h-16 w-16 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: "#ECFDF5" }}
          >
            <HugeiconsIcon
              icon={iconObj}
              size={32}
              color="#22C55E"
              strokeWidth={1.6}
            />
          </View>
          <Text className="text-[26px] font-extrabold text-slate-900 text-center">
            {title}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="bg-slate-50 rounded-2xl p-4 mb-6"
            style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            {fields.map((field, i) => {
              const display = formatValue(field.value);
              if (display === "—") return null;
              return (
                <View
                  key={i}
                  className="py-3"
                  style={
                    i < fields.length - 1
                      ? { borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }
                      : undefined
                  }
                >
                  <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {field.label}
                  </Text>
                  <Text className="text-sm text-slate-700 leading-relaxed">
                    {display}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View className="pt-4 pb-2">
          <Pressable
            onPress={onSave}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel={saveLabel}
            className="h-14 rounded-2xl items-center justify-center active:opacity-90"
            style={{
              backgroundColor: "#58CC02",
              shadowColor: "#58CC02",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 0,
              elevation: 4,
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text className="text-base font-extrabold text-white uppercase tracking-wider">
              {isSaving ? "Saving..." : saveLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

SummaryStep.displayName = "SummaryStep";
