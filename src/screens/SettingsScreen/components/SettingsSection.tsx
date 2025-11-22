import React from "react";
import { View } from "react-native";

interface SettingsSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  children,
  className,
}) => {
  return (
    <View className={`bg-white rounded-2xl overflow-hidden ${className || ""}`}>
      {children}
    </View>
  );
};
