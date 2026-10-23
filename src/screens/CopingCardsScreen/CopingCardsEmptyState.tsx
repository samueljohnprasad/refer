import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { Mascot } from "@/src/components/ui/Mascot";

export function CopingCardsEmptyState() {
  const { t } = useTranslation("exercises");

  return (
    <View className="items-center justify-center pt-8 pb-20 px-6 mt-12">
      {/* ponytail: Duolingo-grade situational mascot replaces generic bookmark icon */}
      <View className="mb-4 items-center justify-center">
        <Mascot state="panda-coping-card" size={130} />
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
