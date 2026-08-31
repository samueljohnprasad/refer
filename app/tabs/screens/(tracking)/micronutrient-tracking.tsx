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
import {
  buttonStyle,
  controlSize,
  labelStyle,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MicronutrientTrackingScreen from "@/src/screens/MicronutrientTrackingScreen/MicronutrientTrackingScreen";
import { MICRONUTRIENTS_CONFIG } from "@/src/config/micronutrients";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Mascot } from "@/src/components/ui/Mascot";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

const STORAGE_KEY = "tracked_micronutrients";

const MicronutrientHeader: React.FC = () => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const isLiquidGlass = isLiquidGlassAvailable();
  const [trackedCount, setTrackedCount] = useState<number>(
    MICRONUTRIENTS_CONFIG.length
  );

  const breathe = useSharedValue<number>(1);
  const reducedMotion: boolean = useReducedMotion();

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

  useEffect(() => {
    if (reducedMotion) return;
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.025, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [reducedMotion]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

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
          className="h-11 w-11 items-center justify-center rounded-full bg-sage-pill"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={21} color={SEMANTIC_COLORS.brand.pressed} />
        </TouchableOpacity>
      )}
      {isLiquidGlass && (
        <Host matchContents>
          <Button
            onPress={() => router.back()}
            modifiers={[
              labelStyle("iconOnly"),
              buttonStyle("glassProminent"),
              controlSize("regular"),
              tint(SEMANTIC_COLORS.brand.pressed),
            ]}
            systemImage="chevron.left"
          />
        </Host>
      )}

      <View className="items-center">
        <Text className="happy-font-heading-bold text-[32px] text-ink">
          Micronutrients
        </Text>
        <View className="mt-1 rounded-full bg-sage-pill px-3 py-1">
          <Text className="happy-font-body-bold text-sm text-sage-600">
            {trackedCount} of {MICRONUTRIENTS_CONFIG.length} tracked
          </Text>
        </View>
      </View>

      <Animated.View style={[mascotStyle, { width: 44, height: 44, alignItems: "center", justifyContent: "center" }]}>
        <Mascot state="panda-plant" size={40} />
      </Animated.View>
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
