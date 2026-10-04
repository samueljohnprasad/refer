import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";
import { View } from "@/components/Themed";
import { useTranslation } from "react-i18next";

export function LifeDomainBalanceLocked() {
  const { t } = useTranslation("insights");

  return (
    <LinearGradient colors={["#7B61FF", "#9C7CFF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-2xl p-8 shadow-lg">
      <View className="items-center">
        <View className="w-20 h-20 bg-white/30 rounded-full items-center justify-center mb-5">
          <MaterialIcons name="donut-large" size={36} color="#FFF" />
        </View>
        <Text variant="h2" className="text-white mb-3">{t("lifeBalance.title")}</Text>
        <Text variant="body" className="text-white/90 text-center mb-5 font-medium">{t("lifeBalance.lockedDescription")}</Text>
        <View className="bg-white/30 px-5 py-2.5 rounded-full">
          <Text variant="label-bold" className="text-white">🔒 {t("chart.premiumFeature")}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
