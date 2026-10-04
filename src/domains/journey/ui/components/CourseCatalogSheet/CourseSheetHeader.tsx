import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Text } from "@/src/components/ui/Text";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

interface CourseSheetHeaderProps {
  onBack?: () => void;
  onClose: () => void;
}

export function CourseSheetHeader({
  onBack,
  onClose,
}: CourseSheetHeaderProps): React.JSX.Element {
  const { t } = useTranslation("journeys");
  return (
    <View className="h-14 flex-row items-center justify-between px-5">
      {onBack ? (
        <Pressable
          onPress={onBack}
          className="min-h-11 flex-row items-center gap-1 pr-3"
          accessibilityRole="button"
          accessibilityLabel={t("backToJourneys")}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={SEMANTIC_COLORS.brand.pressed} />
          <Text variant="label-bold" color="sage">
            {t("explore")}
          </Text>
        </Pressable>
      ) : (
        <View className="h-11 w-11" />
      )}

      <Pressable
        onPress={onClose}
        className="h-11 w-11 items-center justify-center"
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t("closeCatalog")}
      >
        <View className="h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] active:bg-black/[0.08]">
          <HugeiconsIcon icon={Cancel01Icon} size={16} color={SEMANTIC_COLORS.text.secondary} />
        </View>
      </Pressable>
    </View>
  );
}
