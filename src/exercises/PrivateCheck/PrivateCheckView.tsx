import React from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseSelectionRow } from "@/src/components/exercise/CourseExerciseSelectionRow";
import type { PrivateCheckData } from "@/src/exercises/PrivateCheck/data";

interface PrivateCheckViewProps extends PrivateCheckData {
  selectedIndexes: number[];
  noneIndex: number;
  showingFeedback: boolean;
  onToggle: (index: number) => void;
}

export function PrivateCheckView({
  title,
  instruction,
  items,
  revealItems,
  noneOptionLabel,
  privacyLabel,
  revealTitle,
  revealBody,
  noneRevealTitle,
  noneRevealBody,
  selectedIndexes,
  noneIndex,
  showingFeedback,
  onToggle,
}: PrivateCheckViewProps) {
  const noneSelected = selectedIndexes.includes(noneIndex);

  return (
    <View className="px-2 pb-3 pt-1.5">
      {title ? <CourseExerciseHeading title={title} instruction={instruction} /> : null}
      <View accessibilityRole="list" className="gap-2">
        {items.map((item, index) => (
          <CourseExerciseSelectionRow
            key={item}
            label={item}
            selected={selectedIndexes.includes(index)}
            disabled={showingFeedback}
            role="checkbox"
            onPress={() => onToggle(index)}
          />
        ))}
        {noneOptionLabel ? (
          <CourseExerciseSelectionRow
            label={noneOptionLabel}
            selected={noneSelected}
            disabled={showingFeedback}
            role="checkbox"
            onPress={() => onToggle(noneIndex)}
          />
        ) : null}
      </View>
      {privacyLabel ? <PrivacyLabel label={privacyLabel} /> : null}
      {showingFeedback ? (
        <PrivateCheckReveal
          labels={revealItems.filter((_, index) => selectedIndexes.includes(index))}
          noneSelected={noneSelected}
          revealTitle={revealTitle}
          revealBody={revealBody}
          noneRevealTitle={noneRevealTitle}
          noneRevealBody={noneRevealBody}
        />
      ) : null}
    </View>
  );
}

function PrivacyLabel({ label }: { label: string }) {
  return (
    <View className="mt-4 items-start">
      <Text className="happy-font-body text-[12.5px] text-[#82796A]">{label}</Text>
    </View>
  );
}

function PrivateCheckReveal({
  labels,
  noneSelected,
  revealTitle,
  revealBody,
  noneRevealTitle,
  noneRevealBody,
}: {
  labels: string[];
  noneSelected: boolean;
  revealTitle: string | null;
  revealBody: string | null;
  noneRevealTitle: string | null;
  noneRevealBody: string | null;
}) {
  const title = noneSelected ? noneRevealTitle : revealTitle;
  const body = noneSelected ? noneRevealBody : revealBody;

  return (
    <View className="mt-5 border-t border-[#ABC0A2] pt-4">
      {title ? (
        <Text className="happy-font-heading-bold text-[13px] text-[#29452A]">{title}</Text>
      ) : null}
      {!noneSelected ? (
        <View className="mt-2 gap-1">
          {labels.map((label) => (
            <Text key={label} className="happy-font-body text-[15px] leading-5 text-[#201E1D]">
              {label}
            </Text>
          ))}
        </View>
      ) : null}
      {body ? (
        <Text className="happy-font-body mt-3 text-[14px] leading-5 text-[#3F4A31]">{body}</Text>
      ) : null}
    </View>
  );
}
