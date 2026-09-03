import React from "react";
import { Pressable, Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

interface CourseExerciseSelectionRowProps {
  label: string;
  selected: boolean;
  disabled: boolean;
  role: "checkbox" | "radio";
  onPress: () => void;
}

export function CourseExerciseSelectionRow({
  label,
  selected,
  disabled,
  role,
  onPress,
}: CourseExerciseSelectionRowProps) {
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-[52px] flex-row items-center gap-3 rounded-2xl border px-4 py-2.5 active:scale-[0.99] active:opacity-70 ${selected ? "happy-course-selection-active" : "happy-course-selection"}`}
    >
      {role === "checkbox" ? <Checkbox selected={selected} /> : null}
      <Text className="happy-font-body-medium flex-1 text-base leading-[22px] text-ink">
        {label}
      </Text>
      {role === "radio" && selected ? <SelectedIndicator /> : null}
    </Pressable>
  );
}

function Checkbox({ selected }: { selected: boolean }) {
  return (
    <View
      className={`h-[22px] w-[22px] items-center justify-center rounded-lg border-2 ${selected ? "border-sage-500 bg-sage-500" : "border-brand-border-strong"}`}
    >
      {selected ? (
        <HugeiconsIcon
          icon={Tick01Icon}
          size={12}
          color={SEMANTIC_COLORS.brand.onPrimary}
        />
      ) : null}
    </View>
  );
}

function SelectedIndicator() {
  return (
    <View className="h-6 w-6 items-center justify-center rounded-full bg-sage-500">
      <HugeiconsIcon
        icon={Tick01Icon}
        size={13}
        color={SEMANTIC_COLORS.brand.onPrimary}
      />
    </View>
  );
}
