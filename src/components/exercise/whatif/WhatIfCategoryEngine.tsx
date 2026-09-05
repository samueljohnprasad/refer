import React from "react";
import { View, Text, ScrollView } from "react-native";
import type { WhatIfContent } from "./whatIfContent";
import type { WhatIfResponse } from "./whatIfResponse";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";

export const WhatIfCategoryEngine: React.FC<V1CategoryEngineProps> = ({ exercise, savedResponse, onInteraction, locked }) => {
  const content = exercise.content as WhatIfContent;
  const response = (savedResponse as WhatIfResponse) || { phase: "prediction", consequenceIndex: 0 };
  const { phase, selectedPredictionId, consequenceIndex } = response;
  const onResponse = (newResponse: WhatIfResponse) => onInteraction(newResponse as unknown as Record<string, unknown>, true);

  // Complete phase (final comparison)
  const normalizedOptions = content.options?.map((opt, i) => 
    typeof opt === 'string' ? { id: `opt-${i}`, label: opt } : { ...opt, label: opt.label || opt.text }
  ) || [];
  
  const normalizedSteps = content.steps?.map(step => 
    typeof step === 'string' ? { body: step } : step
  ) || [];

  const handleSelectPrediction = (id: string) => {
    if (phase !== "prediction" || locked) return;
    onResponse({ ...response, selectedPredictionId: id });
  };

  // Manual progression is handled by the primary button via config.ts getPrimaryTransition

  if (phase === "prediction") {
    return (
      <View className="flex-1 px-2 pb-3 pt-1.5">
        <CourseExerciseHeading title={content.title} instruction={content.instruction || "What do you think will happen?"} />
        <View accessibilityRole="radiogroup" className="gap-2.5 mt-2">
          {normalizedOptions.map((p) => {
            const isSelected = selectedPredictionId === p.id;
            return (
              <CourseExerciseOptionButton
                key={p.id}
                label={p.label || ""}
                selected={isSelected}
                role="radio"
                disabled={locked}
                onPress={() => handleSelectPrediction(p.id)}
              />
            );
          })}
        </View>
      </View>
    );
  }

  if (phase === "running") {
    return (
      <ScrollView className="flex-1 px-2 pb-3 pt-1.5">
        <CourseExerciseHeading title={content.title} instruction="Watch what happens..." />
        <View className="gap-4 mt-2 pb-20">
          {normalizedSteps.slice(0, consequenceIndex).map((c, idx) => {
            const isLatest = idx === consequenceIndex - 1;
            const containerClass = isLatest ? "p-4 bg-brand-surface rounded-2xl border border-brand-border" : "p-3 bg-brand-surface-soft rounded-2xl border border-brand-border opacity-70";
            const labelClass = isLatest ? "happy-font-label text-brand-ink-muted uppercase tracking-wider mb-1 text-xs" : "happy-font-label text-brand-ink-muted uppercase tracking-wider mb-1 text-[10px]";
            const textClass = isLatest ? "happy-font-body-bold text-brand-ink text-[17px] leading-6" : "happy-font-body text-brand-ink text-[15px] leading-5";
            
            return (
              <View key={`step-${idx}`} className={containerClass}>
                <Text className={labelClass}>
                  {c.title || `Step ${idx + 1}`}
                </Text>
                <Text className={textClass}>{c.body}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  // Complete phase (final comparison)
  const userPrediction = normalizedOptions.find((p) => p.id === selectedPredictionId);
  const finalConsequence = normalizedSteps[normalizedSteps.length - 1];

  return (
    <ScrollView className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading title={content.takeaway || "Review"} instruction={content.rule || "Here is how reality compared to your prediction."} />
      <View className="gap-4 mt-2">
        <View className="p-4 rounded-2xl bg-brand-surface-soft border border-brand-border">
          <Text className="happy-font-label text-brand-ink-muted uppercase tracking-wider mb-2 text-xs">You Predicted</Text>
          <Text className="happy-font-body text-brand-ink text-[17px] leading-6">{userPrediction?.label}</Text>
        </View>
        <View className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
          <Text className="happy-font-label text-brand-ink-muted uppercase tracking-wider mb-2 text-xs">Actual Outcome</Text>
          <Text className="happy-font-body-bold text-brand-ink text-[17px] leading-6">{finalConsequence?.body}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
