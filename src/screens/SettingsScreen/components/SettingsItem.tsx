import React from "react";
import { View, Text, Pressable } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

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

  return (
    <Pressable
      className="active:bg-muted/50 bg-background"
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
    >
      <View className="flex-row items-center pl-5 gap-4">
        <HugeiconsIcon
          icon={icon}
          size={22}
          color={danger ? "#EF4444" : "var(--app-foreground)"}
        />
        <View
          className={`flex-1 flex-row items-center py-3.5 pr-5 ${
            !isLast ? "border-b border-border/50" : ""
          }`}
        >
          <View className="flex-1">
            <Text
              className={`text-[17px] ${
                danger ? "text-red-500" : "text-foreground"
              }`}
            >
              {title}
            </Text>
            {subtitle && (
              <Text className="text-[15px] text-muted-foreground mt-0.5">
                {subtitle}
              </Text>
            )}
          </View>
          {showArrow && !danger && (
            <Feather name="chevron-right" size={16} color="#A1A1AA" />
          )}
        </View>
      </View>
    </Pressable>
  );
};
