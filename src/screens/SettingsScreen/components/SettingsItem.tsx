import React from "react";
import { View, Text, Pressable } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Feather } from "@expo/vector-icons";
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

  const iconColor = danger ? "#EF4444" : String(SEMANTIC_COLORS.text.primary ?? "#243323");

  return (
    // ponytail: standard 70pt list-row with quiet disclosure chevron and inset divider
    <Pressable
      className="active:bg-black/[0.03] dark:active:bg-white/[0.05] min-h-[70px] flex-row items-center px-4"
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
        className={`flex-1 flex-row items-center py-3.5 pr-1 min-h-[70px] ${
          !isLast ? "border-b border-black/[0.04] dark:border-white/[0.06]" : ""
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
            <Text className="text-[14px] text-ink-muted mt-0.5 leading-snug">
              {subtitle}
            </Text>
          )}
        </View>
        {showArrow && !danger && (
          <Feather name="chevron-right" size={16} color="#A1A1AA" />
        )}
      </View>
    </Pressable>
  );
};
