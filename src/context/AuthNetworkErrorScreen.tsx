import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ReloadIcon, WifiOffIcon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";

interface AuthNetworkErrorScreenProps {
  onRetry: () => void;
  retrying: boolean;
}

export default function AuthNetworkErrorScreen({
  onRetry,
  retrying,
}: AuthNetworkErrorScreenProps) {
  const { t } = useTranslation("settings");

  return (
    <View className="flex-1 bg-gradient-to-b from-purple-50 to-white items-center justify-center px-6">
      <View className="items-center">
        <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-6">
          <HugeiconsIcon icon={WifiOffIcon} size={48} color="#DC2626" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
          {t("accountAuth.networkError.title")}
        </Text>
        <Text className="text-base text-gray-600 text-center mb-8 leading-6">
          {t("accountAuth.networkError.description")}
        </Text>
        <TouchableOpacity
          onPress={onRetry}
          disabled={retrying}
          activeOpacity={0.8}
          className="rounded-2xl overflow-hidden"
        >
          <LinearGradient
            colors={retrying ? ["#999", "#777"] : ["#7B61FF", "#9C7CFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-8 py-4 flex-row items-center gap-3"
          >
            {retrying && <ActivityIndicator size="small" color="#FFF" />}
            {!retrying && (
              <HugeiconsIcon icon={ReloadIcon} size={20} color="#FFF" />
            )}
            <Text className="text-white text-lg font-bold">
              {retrying
                ? t("accountAuth.networkError.retrying")
                : t("accountAuth.networkError.retry")}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
