import React from "react";
import { View, Text, Pressable } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import { DANGER, GOLD, SAGE, TERRACOTTA } from "@/lib/tokens";

type SettingsItemTone = "sage" | "gold" | "terracotta" | "danger";

const toneStyles: Record<
  SettingsItemTone,
  { iconColor: string; iconBgClassName: string }
> = {
  sage: {
    iconColor: SAGE[600],
    iconBgClassName: "bg-sage-pill",
  },
  gold: {
    iconColor: GOLD,
    iconBgClassName: "bg-gold/15",
  },
  terracotta: {
    iconColor: TERRACOTTA,
    iconBgClassName: "bg-terracotta/15",
  },
  danger: {
    iconColor: DANGER,
    iconBgClassName: "bg-destructive/10",
  },
};

interface SettingsItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  isLast?: boolean;
  danger?: boolean;
  tone?: SettingsItemTone;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  isLast = false,
  danger = false,
  tone = "sage",
}) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };
  const resolvedTone = danger ? toneStyles.danger : toneStyles[tone];

  return (
    <Pressable
      className={`min-h-[64px] flex-row items-center px-4 py-3.5 active:bg-sage-100/50 ${
        !isLast ? "border-b border-sage-100" : ""
      }`}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
    >
      <View
        className={`mr-3.5 h-11 w-11 items-center justify-center rounded-[18px] ${resolvedTone.iconBgClassName}`}
      >
        <HugeiconsIcon
          icon={icon}
          size={21}
          color={resolvedTone.iconColor}
          strokeWidth={1.8}
        />
      </View>

      <View className="flex-1">
        <Text
          className={`happy-font-body-bold text-[17px] leading-5 ${
            danger ? "text-destructive" : "text-ink"
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="happy-font-body-medium mt-0.5 text-[14px] text-ink-muted">
            {subtitle}
          </Text>
        )}
      </View>

      {showArrow && (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={18}
          color={SAGE[300]}
          strokeWidth={2}
        />
      )}
    </Pressable>
  );
};
