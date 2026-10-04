import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";

interface ContinueButtonProps {
  onPress: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

/**
 * // ponytail: standardize to tactile 3D button used across the app
 */
export const ContinueButton = React.memo<ContinueButtonProps>(({
  onPress,
  loading = false,
  isEditing = false,
}: ContinueButtonProps) => {
  const { t } = useTranslation("journal");
  // HIDDEN completely when not editing so it doesn't pollute view mode hierarchy
  if (!isEditing) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-transparent px-6 pb-8 pt-2">
      <CourseExercisePrimaryButton
        label={t("entryDetail.header.save")}
        disabled={loading}
        loading={loading}
        onPress={onPress}
        height={60}
      />
    </View>
  );
});

ContinueButton.displayName = "ContinueButton";
