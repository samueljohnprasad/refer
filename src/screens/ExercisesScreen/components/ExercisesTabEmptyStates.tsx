import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";

export function EmptyDiscoverState() {
  const { t } = useTranslation("exercises");

  return (
    <View className="items-center justify-center px-8 py-16" accessibilityLiveRegion="polite">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-sage-50">
        <Text className="text-[36px]" accessibilityLabel={t("library.emptyIcon")} accessibilityRole="image">
          🌱
        </Text>
      </View>
      <Text variant="h3" className="mb-2 text-center">{t("library.emptyTitle")}</Text>
      <Text variant="body" className="text-center">{t("library.emptyBody")}</Text>
    </View>
  );
}
