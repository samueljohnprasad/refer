import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Pressable } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { SymbolView } from "expo-symbols";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface PromoCardProps {
  onLayout: (event: any) => void;
  onPromoPress: () => Promise<boolean>;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  onLayout,
  onPromoPress,
}) => {
  const { t } = useTranslation("settings");
  return (
    <Pressable
      onPress={onPromoPress}
      onLayout={onLayout}
      className="mx-5 mb-5 min-h-[64px] flex-row items-center border-b border-sage-200 px-1 py-3 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={t("premium.unlockAccessibility")}
    >
      <View className="mr-3.5 h-8 w-8 items-center justify-center">
        <HugeiconsIcon
          icon={CrownIcon}
          size={24}
          color={String(SEMANTIC_COLORS.brand.pressed)}
          strokeWidth={1.8}
        />
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-[17px] font-bold leading-snug text-ink">
          {t("premium.unlockTitle")}
        </Text>
        <Text className="mt-0.5 text-[14px] leading-snug text-ink-soft">
          {t("premium.unlockSubtitle")}
        </Text>
      </View>
      <View className="h-11 w-11 items-end justify-center">
        <SymbolView
          name="chevron.right"
          size={16}
          tintColor={String(SEMANTIC_COLORS.brand.pressed)}
          weight="semibold"
        />
      </View>
    </Pressable>
  );
};
