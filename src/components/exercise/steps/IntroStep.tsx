import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Timer01Icon } from "@hugeicons/core-free-icons";
import { getExerciseIcon } from "@/src/data/exerciseIconRegistry";
import type { StepProps, ExerciseType } from "@/src/types/exerciseFlow";

interface IntroStepProps extends StepProps {
  title: string;
  subtitle: string;
  /** Exercise type key — resolved to a Hugeicon from the registry */
  exerciseType?: string;
  /** @deprecated Use exerciseType instead. Kept for backward compat. */
  icon?: string;
  duration: string;
  bulletPoints?: string[];
}

export const IntroStep: React.FC<IntroStepProps> = React.memo(
  ({ title, subtitle, exerciseType, duration, bulletPoints, onNext }) => {
    const iconObj = exerciseType ? getExerciseIcon(exerciseType) : null;

    return (
      <View className="flex-1 items-center px-6">
        {/* Top spacer — shrinks to 0 when content is tall */}
        <View style={{ flex: 1, maxHeight: 80 }} />

        {iconObj ? (
          <View
            className="h-20 w-20 rounded-3xl items-center justify-center mb-6"
            style={{ backgroundColor: "#EEF6FF" }}
          >
            <HugeiconsIcon
              icon={iconObj}
              size={40}
              color="#4F8CFF"
              strokeWidth={1.6}
            />
          </View>
        ) : (
          <View
            className="h-20 w-20 rounded-3xl items-center justify-center mb-6"
            style={{ backgroundColor: "#EEF6FF" }}
          >
            <HugeiconsIcon
              icon={Timer01Icon}
              size={40}
              color="#4F8CFF"
              strokeWidth={1.6}
            />
          </View>
        )}
        <Text className="text-[28px] font-extrabold text-slate-900 text-center mb-2">
          {title}
        </Text>
        <Text className="text-[15px] text-slate-500 text-center mb-6 leading-relaxed">
          {subtitle}
        </Text>
        <View className="bg-slate-100 rounded-xl px-4 py-2 mb-6 flex-row items-center">
          <HugeiconsIcon
            icon={Timer01Icon}
            size={14}
            color="#64748B"
            strokeWidth={1.6}
          />
          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1.5">
            {duration}
          </Text>
        </View>

        {bulletPoints && bulletPoints.length > 0 && (
          <View className="w-full mb-8">
            {bulletPoints.map((point, i) => (
              <View key={i} className="flex-row items-start mb-2 px-2">
                <Text className="text-slate-400 mr-2">•</Text>
                <Text className="text-sm text-slate-600 flex-1 leading-relaxed">
                  {point}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Bottom spacer — pushes button toward bottom */}
        <View style={{ flex: 1, maxHeight: 40 }} />

        <Pressable
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel="Begin exercise"
          className="h-14 w-full rounded-2xl items-center justify-center active:opacity-90 mb-4"
          style={{
            backgroundColor: "#58CC02",
            shadowColor: "#58CC02",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-base font-extrabold text-white uppercase tracking-wider">
            Let's Go
          </Text>
        </Pressable>
      </View>
    );
  },
);

IntroStep.displayName = "IntroStep";
