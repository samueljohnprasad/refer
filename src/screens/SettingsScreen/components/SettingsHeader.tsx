import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize, labelStyle, tint } from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import { SAGE } from "@/lib/tokens";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";

interface SettingsHeaderProps {
  scrollY: Animated.Value;
  upgradeY: number | null;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  scrollY,
  upgradeY,
}) => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const isLiquidGlass = isLiquidGlassAvailable();
  const { hasPro, presentPaywall } = useRevenueCat();

  return (
    <BlurView
      intensity={50}
      tint="light"
      className="flex-row items-end  justify-between "
      style={{
        height: height * 0.14,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      {/* <View className="flex-row items-center bg-red-300"> */}
      {!isLiquidGlass && (
        <TouchableOpacity
          className="h-11 w-11 items-center justify-center rounded-full bg-sage-pill"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={21} color={SAGE[600]} />
        </TouchableOpacity>
      )}
      {isLiquidGlass && (
        <Host matchContents>
          <Button
            onPress={() => router.back()}
            label="Back"
            modifiers={[
              labelStyle('iconOnly'),
              buttonStyle('glassProminent'),
              controlSize('regular'),
              tint(SAGE[600])
            ]}
            systemImage="chevron.left"
          />
        </Host>
      )}

      <Text className="happy-font-heading-bold text-[34px] text-ink">
        Settings
      </Text>
      {/* </View> */}
      {upgradeY !== null && !hasPro && (
        <Animated.View
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            opacity: scrollY.interpolate({
              inputRange: [upgradeY + 20, upgradeY + 20 + 40],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
          }}
        >
          <Pressable
            android_ripple={{ color: SAGE[700] }}
            onPress={() => {
              void Haptics.selectionAsync().catch(() => {});
              router.push('/paywall');
            }}
            className="bg-sage-400 rounded-full px-4 py-1.5 border border-sage-500/20"
          >
            <Text className="happy-font-body-bold text-[15px] text-brand-surface">
              Upgrade
            </Text>
          </Pressable>
        </Animated.View>
      )}

      <View style={{ width: 44 }} />
    </BlurView>
  );
};
