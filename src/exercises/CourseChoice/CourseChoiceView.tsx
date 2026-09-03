import React from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseInlineFeedback } from "@/src/components/exercise/CourseExerciseInlineFeedback";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import type { CourseExerciseOption } from "@/src/components/exercise/courseExerciseContent";
import type { CourseChoiceData } from "@/src/exercises/CourseChoice/data";

interface CourseChoiceViewProps extends CourseChoiceData {
  selectedOptionId: string | null;
  locked: boolean;
  onSelect: (optionId: string) => void;
}

export function CourseChoiceView({
  title,
  instruction,
  context,
  prompt,
  options,
  selectedOptionId,
  locked,
  onSelect,
}: CourseChoiceViewProps) {
  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading title={title} instruction={instruction} />
      {context ? <ContextCard context={context} /> : null}
      {prompt ? (
        <Text className="happy-font-body-bold mb-3 text-[17px] leading-6 text-ink">
          {prompt}
        </Text>
      ) : null}
      <View accessibilityRole="radiogroup" className="gap-2.5">
        {options.map((option) => (
          <ChoiceOption
            key={option.id}
            option={option}
            selected={selectedOptionId === option.id}
            locked={locked}
            onSelect={onSelect}
          />
        ))}
      </View>
    </View>
  );
}

function ContextCard({ context }: { context: string }) {
  return (
    <View className="mb-3.5 rounded-2xl border border-brand-border bg-brand-surface-soft px-[18px] py-4">
      <Text className="happy-font-body text-[14.5px] leading-[22px] text-ink">
        {context}
      </Text>
    </View>
  );
}

function ChoiceOption({
  option,
  selected,
  locked,
  onSelect,
}: {
  option: CourseExerciseOption;
  selected: boolean;
  locked: boolean;
  onSelect: (optionId: string) => void;
}) {
  const result =
    locked && selected
      ? option.isCorrect
        ? ("correct" as const)
        : ("incorrect" as const)
      : undefined;
  const showsFeedback = locked && selected && option.feedback;

  return (
    <View>
      <CourseExerciseOptionButton
        label={option.label}
        selected={selected}
        showConfirmationIcon={false}
        result={result}
        role="radio"
        disabled={locked}
        onPress={() => onSelect(option.id)}
      />
      {showsFeedback ? (
        <CourseExerciseInlineFeedback
          correct={option.isCorrect === true}
          message={option.feedback ?? ""}
        />
      ) : null}
    </View>
  );
}
