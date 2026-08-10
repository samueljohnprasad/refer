import React from "react";
import { Pressable, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Text } from "@/src/components/ui/Text";
import { SAGE } from "@/lib/tokens";

interface CourseSheetHeaderProps {
  onBack?: () => void;
  onClose: () => void;
}

export function CourseSheetHeader({
  onBack,
  onClose,
}: CourseSheetHeaderProps): React.JSX.Element {
  return (
    <View className="h-14 flex-row items-center justify-between px-5">
      {onBack ? (
        <Pressable
          onPress={onBack}
          className="min-h-11 flex-row items-center gap-1 pr-3"
          accessibilityRole="button"
          accessibilityLabel="Back to journeys"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={SAGE[600]} />
          <Text variant="label-bold" color="sage">
            Journeys
          </Text>
        </Pressable>
      ) : (
        <View className="h-11 w-11" />
      )}

      <Pressable
        onPress={onClose}
        className="h-11 w-11 items-center justify-center rounded-full bg-slate-100/80"
        accessibilityRole="button"
        accessibilityLabel="Close course catalog"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={20} color={SAGE[600]} />
      </Pressable>
    </View>
  );
}
