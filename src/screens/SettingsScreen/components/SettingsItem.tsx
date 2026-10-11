import React from "react";
import { View, Text, Pressable } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SymbolView } from "expo-symbols";
import * as Haptics from "expo-haptics";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface SettingsItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  isLast?: boolean;
  danger?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  isLast = false,
  danger = false,
}) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  const iconColor = danger
    ? "#EF4444"
    : String(SEMANTIC_COLORS.brand.pressed);

  return (
    <Pressable
      className="min-h-[64px] flex-row items-center px-1 active:bg-sage-50/70"
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
    >
      <View className="w-7 h-7 items-center justify-center mr-3.5">
        <HugeiconsIcon
          icon={icon}
          size={22}
          color={iconColor}
          strokeWidth={1.75}
        />
      </View>
      <View
        className={`min-h-[64px] flex-1 flex-row items-center py-3 pr-1 ${
          !isLast ? "border-b border-sage-100" : ""
        }`}
      >
        <View className="flex-1 justify-center pr-2">
          <Text
            className={`text-[16px] font-semibold ${
              danger ? "text-red-500" : "text-ink"
            }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="mt-0.5 text-[14px] leading-snug text-ink-soft">
              {subtitle}
            </Text>
          )}
        </View>
        {showArrow && !danger && (
          <View className="h-11 w-11 items-end justify-center">
            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={String(SEMANTIC_COLORS.brand.pressed)}
              weight="semibold"
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};
