import React from "react";
import { View } from "react-native";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import { SaveButtonProps } from "../types";

/**
 * // ponytail: presentational sticky footer save button with tactile 3D styling
 */
export const SaveButton = React.memo<SaveButtonProps>(
  ({
    saving,
    keyboardHeight,
    bottomInset,
    onSave,
    onLayout,
  }: SaveButtonProps) => {
    return (
      <View
        style={[{ bottom: keyboardHeight, paddingBottom: 16 + bottomInset }]}
        className="absolute left-0 right-0 bg-background-light dark:bg-background-dark p-5 border-t border-outline-100 dark:border-outline-800 shadow-soft-2"
        onLayout={({ nativeEvent }): void =>
          onLayout(nativeEvent.layout.height)
        }
      >
        <CourseExercisePrimaryButton
          label={saving ? "Saving…" : "Continue"}
          disabled={saving}
          loading={saving}
          onPress={onSave}
          height={56}
          fontSize={18}
        />
      </View>
    );
  }
);

SaveButton.displayName = "SaveButton";
