import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { PricingPlanConfig } from "../types";
import { useTranslation } from "react-i18next";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PricingTierCardProps {
  plan: PricingPlanConfig;
  isSelected: boolean;
  onSelect: () => void;
}

const PricingTierCard: React.FC<PricingTierCardProps> = ({
  plan,
  isSelected,
  onSelect,
}) => {
  const { t } = useTranslation("onboarding");
  const scale = useSharedValue(1);
  const selectionProgress = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      selectionProgress.value = withTiming(1, { duration: 180 });
    } else {
      selectionProgress.value = withTiming(0, { duration: 160 });
    }
  }, [isSelected]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ["#E5EDE1", "#5F7F58"],
    ),
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ["#FFFFFF", "#F8FBF6"],
    ),
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.985, { duration: 90 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const handlePress = () => {
    Haptics.selectionAsync();
    onSelect();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        cardStyle,
        { borderCurve: "continuous" },
        plan.isDecoy ? { opacity: 0.92 } : undefined,
      ]}
      className="relative rounded-2xl border-2 px-4 py-3.5"
    >
      {plan.badge && (
        <View className="absolute -top-2.5 right-3 rounded-full bg-gold px-3 py-0.5 shadow-sm">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-[11.5px] tracking-[0.01em] text-sage-900"
          >
            {t(`paywall.plans.${plan.tier}.badge`)}
          </Text>
        </View>
      )}
      {plan.headline ? (
        <>
          <Text
            className="happy-font-heading-italic mb-1 text-[14px] leading-[1.3] text-sage-600"
          >
            {t(`paywall.plans.${plan.tier}.headline`)}
          </Text>

          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <View className="mt-1 flex-row items-center gap-2">
                <Text
                  className="happy-font-body-semibold text-[14px] text-ink"
                >
                  {t(`paywall.plans.${plan.tier}.label`)}
                </Text>
                {plan.savings ? (
                  <View className="rounded bg-terracotta px-1.5 py-0.5">
                    <Text
                      style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                      className="text-[10.5px] tracking-[0.01em] text-white"
                    >
                      {t(`paywall.plans.${plan.tier}.savings`)}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text
                className="happy-font-body mt-1 text-[11px] leading-[1.35] text-ink-muted"
              >
                {t(`paywall.plans.${plan.tier}.detailPrefix`)}
                <Text
                  className="happy-font-body-semibold text-sage-700"
                >
                  {t(`paywall.plans.${plan.tier}.detailEmphasis`)}
                </Text>
                {t(`paywall.plans.${plan.tier}.detailSuffix`)}
              </Text>
            </View>

            <View className="items-end">
              <Text
                className="happy-font-heading text-[20px] leading-[1.1] text-sage-500"
              >
                {plan.price}
              </Text>
              {plan.comparisonPrice ? (
                <Text
                  className="happy-font-body mt-1 text-[11px] text-ink-muted line-through"
                >
                  {plan.comparisonPrice}
                </Text>
              ) : null}
            </View>
          </View>
        </>
      ) : (
        <View className="flex-row items-center justify-between">
          <View>
            <Text
              className={`happy-font-body-semibold text-sm ${plan.isDecoy ? "text-ink-soft" : "text-ink"}`}
            >
              {t(`paywall.plans.${plan.tier}.label`)}
            </Text>
            <Text
              className="happy-font-body mt-0.5 text-[11px] text-ink-muted"
            >
              {t(`paywall.plans.${plan.tier}.detailLabel`)}
            </Text>
          </View>

          <View className="items-end">
            <Text
              className={`happy-font-heading text-lg ${plan.isDecoy ? "text-ink-soft" : "text-sage-500"}`}
            >
              {plan.price}
            </Text>
            <Text
              className="happy-font-body mt-0.5 text-[11px] text-ink-muted"
            >
                {t(`paywall.plans.${plan.tier}.perUnit`)}
            </Text>
          </View>
        </View>
      )}
    </AnimatedPressable>
  );
};

export default React.memo(PricingTierCard);
