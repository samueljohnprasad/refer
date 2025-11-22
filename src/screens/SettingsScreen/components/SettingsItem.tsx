import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";

interface SettingsItemProps {
  icon: any;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  isLast?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconColor,
  iconBgColor,
  title,
  subtitle,
  onPress,
  showArrow = true,
  isLast = false,
}) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center py-3.5 px-4 ${
        !isLast ? "border-b border-[#F0F0F3]" : ""
      }`}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <View
        className={`w-9 h-9 rounded-[18px] justify-center items-center mr-3`}
        style={{ backgroundColor: iconBgColor }}
      >
        <HugeiconsIcon icon={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-[17px] font-bold text-[#0F172A]">{title}</Text>
        {subtitle && (
          <Text className="text-[13px] text-[#6B7280] mt-0.5">{subtitle}</Text>
        )}
      </View>
      {showArrow && (
        <HugeiconsIcon icon={ArrowRight01Icon} size={22} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
};
