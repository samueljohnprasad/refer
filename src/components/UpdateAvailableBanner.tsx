// ponytail: minimal expo-updates in-app banner for seamless OTA reloads
import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import * as Updates from "expo-updates";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { SafeAreaView } from "@/src/components/tw";
import { HapticManager } from "@/lib/haptics/HapticManager";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SparklesIcon } from "@hugeicons/core-free-icons";

export const UpdateAvailableBanner: React.FC = () => {
  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleAction = async () => {
    if (isUpdatePending) {
      HapticManager.triggerSystem("notificationSuccess");
      await Updates.reloadAsync();
      return;
    }
    setIsDownloading(true);
    try {
      await Updates.fetchUpdateAsync();
    } catch (e) {
      console.warn("[Updates] Failed to fetch update:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isUpdateAvailable && !isUpdatePending) return null;

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutUp} className="z-50 w-full bg-sage-700 shadow-md">
      <SafeAreaView edges={["top"]} className="w-full">
        <View className="flex-row items-center justify-between px-5 py-2.5">
          <View className="flex-row items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={18} color="#FFFFFF" />
            <Text className="happy-font-body-medium text-[15px] font-semibold text-white">
              {isUpdatePending ? "Update downloaded" : "Update available"}
            </Text>
          </View>
          <Pressable
            onPress={handleAction}
            disabled={isDownloading}
            className="rounded-full bg-white/20 px-4 py-1.5 active:bg-white/30"
          >
            <Text className="happy-font-body-bold text-[13px] text-white">
              {isDownloading ? "Downloading..." : isUpdatePending ? "Restart" : "Download"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default UpdateAvailableBanner;
