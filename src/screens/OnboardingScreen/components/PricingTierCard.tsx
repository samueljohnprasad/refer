import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import type { PricingTier } from "../types";

interface PricingTierCardProps {
  tier: PricingTier;
  price: string;
  isSelected: boolean;
  onSelect: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PricingTierCard: React.FC<PricingTierCardProps> = ({
  tier, price, isSelected, onSelect,
}) => {
  const { t } = useTranslation("onboarding");
  const reducedMotion = useReducedMotion();
  const selection = useSharedValue(isSelected ? 1 : 0);
  const scale = useSharedValue(1);
  const label = t(`paywall.plans.${tier}.label`);

  useEffect(() => {
    selection.value = reducedMotion ? Number(isSelected) : withTiming(Number(isSelected), { duration: 180 });
  }, [isSelected, reducedMotion, selection]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(selection.value, [0, 1], ["#D3E0CD", "#44633F"]),
    backgroundColor: interpolateColor(selection.value, [0, 1], ["#FFFFFF", "#E5EDE1"]),
  }));

  const select = () => {
    Haptics.selectionAsync();
    onSelect();
  };

  return (
    <AnimatedPressable
      onPress={select}
      onPressIn={() => { if (!reducedMotion) scale.value = withTiming(0.985, { duration: 90 }); }}
      onPressOut={() => { scale.value = withTiming(1, { duration: 120 }); }}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`${label}, ${price}`}
      style={animatedStyle}
      className="min-h-[68px] flex-row items-center justify-between rounded-2xl border-2 px-4 py-2.5"
    >
      <View className="flex-1">
        <Text style={{ fontFamily: APP_FONT_FAMILIES.bold }} className="text-[17px] text-ink">
          {label}
        </Text>
        <Text className="mt-0.5 text-[13px] text-sage-700">
          {t(`paywall.polish.billing.${tier}`)}
        </Text>
      </View>
      <Text style={{ fontFamily: APP_FONT_FAMILIES.extraBold }} className="text-[18px] text-ink">
        {price}
      </Text>
    </AnimatedPressable>
  );
};

export default React.memo(PricingTierCard);
