import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Mascot } from "@/src/components/ui/Mascot";

export function EmptyDiscoverState() {
  const { t } = useTranslation("exercises");

  return (
    <View className="items-center justify-center px-8 py-16" accessibilityLiveRegion="polite">
      {/* ponytail: growth mindset mascot replaces raw emoji */}
      <View className="happy-mascot-stage mb-4 h-20 w-20 items-center justify-center rounded-[28px]">
        <Mascot state="panda-sprout" size={60} />
      </View>
      <Text variant="h3" className="mb-2 text-center">{t("library.emptyTitle")}</Text>
      <Text variant="body" className="text-center">{t("library.emptyBody")}</Text>
    </View>
  );
}
