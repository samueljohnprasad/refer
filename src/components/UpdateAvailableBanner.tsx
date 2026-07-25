// ponytail: minimal expo-updates in-app banner for seamless OTA reloads
import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import * as Updates from "expo-updates";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticManager } from "@/lib/haptics/HapticManager";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SparklesIcon } from "@hugeicons/core-free-icons";

export const UpdateAvailableBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  // Auto-check and listen for updates silently when app loads
  useEffect(() => {
    if (__DEV__) return;
    
    // 1. Active check on mount
    async function checkOTA() {
      try {
        if (typeof Updates.checkForUpdateAsync === "function") {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            setShowBanner(true);
          }
        }
      } catch (e) {
        // Silently catch network/dev errors
      }
    }
    checkOTA();

    // 2. Passive listener for background/push updates
    let subscription: any;
    try {
      if (typeof Updates.addListener === "function") {
        subscription = Updates.addListener((event) => {
          if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
            setShowBanner(true);
          }
        });
      }
    } catch (e) {
      // Catch native module errors if any
    }
    
    return () => {
      if (subscription?.remove) subscription.remove();
    };
  }, []);

  if (!showBanner) return null;

  const handleReload = async () => {
    try {
      setIsReloading(true);
      HapticManager.triggerSystem("notificationSuccess");
      if (typeof Updates.reloadAsync === "function") {
        await Updates.reloadAsync();
      }
    } catch (e) {
      setIsReloading(false);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(200)}
      className="z-50 w-full bg-sage-700 shadow-md"
    >
      <SafeAreaView edges={["top"]} className="w-full">
        <View className="flex-row items-center justify-between px-5 py-2.5">
          <View className="flex-row items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={18} color="#FFFFFF" />
            <Text className="happy-font-body-medium text-[15px] font-semibold text-white">
              Update available
            </Text>
          </View>
          <Pressable
            onPress={handleReload}
            disabled={isReloading}
            className="rounded-full bg-white/20 px-4 py-1.5 active:bg-white/30"
          >
            <Text className="happy-font-body-bold text-[13px] text-white">
              {isReloading ? "Reloading..." : "Reload"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default UpdateAvailableBanner;

