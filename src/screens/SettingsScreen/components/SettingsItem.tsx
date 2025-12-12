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
      className={`flex-row items-center py-4 px-4 ${
        !isLast ? "border-b border-[#F0F0F3]" : ""
      }`}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <View
        className={`w-10 h-10 rounded-full justify-center items-center mr-4`}
        style={{ backgroundColor: iconBgColor }}
      >
        <HugeiconsIcon icon={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-xl font-cormorantBold text-[#1f2937] leading-6">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5 font-medium">
            {subtitle}
          </Text>
        )}
      </View>
      {showArrow && (
        <HugeiconsIcon icon={ArrowRight01Icon} size={24} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );
};
