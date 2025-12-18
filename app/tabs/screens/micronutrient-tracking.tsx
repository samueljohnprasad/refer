import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MicronutrientTrackingScreen from "@/src/screens/MicronutrientTrackingScreen/MicronutrientTrackingScreen";
import { MICRONUTRIENTS_CONFIG } from "@/src/config/micronutrients";

const STORAGE_KEY = "tracked_micronutrients";

const MicronutrientHeader: React.FC = () => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const isLiquidGlass = isLiquidGlassAvailable();
  const [trackedCount, setTrackedCount] = useState<number>(
    MICRONUTRIENTS_CONFIG.length
  );

  useEffect(() => {
    const loadCount = async (): Promise<void> => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setTrackedCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      } catch (error) {
        console.error("Failed to load tracked count:", error);
      }
    };
    loadCount();

    // Listen for changes
    const interval = setInterval(loadCount, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <BlurView
      intensity={50}
      tint="light"
      className="flex-row items-end justify-between"
      style={{
        height: height * 0.14,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      {!isLiquidGlass && (
        <TouchableOpacity
          className="w-10 h-10 rounded-full justify-center items-center bg-[#7C5CFF]"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={20} color="#FFF" />
        </TouchableOpacity>
      )}
      {isLiquidGlass && (
        <Host matchContents>
          <Button
            onPress={() => router.back()}
            color="#7B61FF"
            variant="glassProminent"
            controlSize="regular"
            systemImage="chevron.left"
          />
        </Host>
      )}

      <View className="items-center">
        <Text className="text-[28px] font-extrabold text-[#0F172A] font-cormorantBold">
          Micronutrients
        </Text>
        <View className="bg-purple-100 px-3 py-1 rounded-full mt-1">
          <Text className="text-sm font-semibold text-purple-700">
            {trackedCount} of {MICRONUTRIENTS_CONFIG.length} tracked
          </Text>
        </View>
      </View>

      <View style={{ width: 40 }} />
    </BlurView>
  );
};

export default function MicronutrientTracking() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          header: () => <MicronutrientHeader />,
        }}
      />
      <MicronutrientTrackingScreen />
    </>
  );
}
