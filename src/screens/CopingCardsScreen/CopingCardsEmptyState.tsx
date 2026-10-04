import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { BookmarkAdd01Icon } from "@hugeicons/core-free-icons";
import { Text } from "@/src/components/ui/Text";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export function CopingCardsEmptyState() {
  const { t } = useTranslation("exercises");

  return (
    <View className="items-center justify-center pt-10 pb-20 px-6 mt-20">
      <View className="h-20 w-20 rounded-full bg-sage-50 items-center justify-center mb-5">
        <HugeiconsIcon
          icon={BookmarkAdd01Icon}
          size={36}
          color={SEMANTIC_COLORS.brand.primary}
          strokeWidth={1.5}
        />
      </View>
      <Text
        variant="h2"
        className="text-[20px] font-extrabold text-ink text-center mb-2"
      >
        {t("copingCards.emptyTitle")}
      </Text>
      <Text
        variant="body"
        color="soft"
        className="text-[15px] text-center leading-relaxed"
      >
        {t("copingCards.emptyBeforeAction")}{" "}
        <Text className="font-bold text-sage-700">
          {t("copingCards.saveAction")}
        </Text>{" "}
        {t("copingCards.emptyAfterAction")}
      </Text>
    </View>
  );
}
