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
import { LinearGradient } from "expo-linear-gradient";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize, labelStyle, tint } from "@expo/ui/swift-ui/modifiers";

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
            label="Back"
            modifiers={[
              labelStyle('iconOnly'),
              buttonStyle('glassProminent'),
              controlSize('regular'),
              tint('#7B61FF')
            ]}
            systemImage="chevron.left"
          />
        </Host>
      )}

      <Text className="text-[28px] font-extrabold text-[#0F172A] font-cormorantBold">
        Settings
      </Text>
      {/* </View> */}
      {upgradeY !== null && (
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
            android_ripple={{ color: "#6D4AFF" }}
            onPress={() => router.push("/tabs/screens/paywall")}
            style={{ borderRadius: 24, overflow: "hidden" }}
          >
            <LinearGradient
              colors={["#7C5CFF", "#9C7CFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="self-start rounded-[28px]"
              style={{ paddingVertical: 8, paddingHorizontal: 14 }}
            >
              <Text className="text-white font-bold text-[15px]">Upgrade</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      <View style={{ width: 36 }} />
    </BlurView>
  );
};
