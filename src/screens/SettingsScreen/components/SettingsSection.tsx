import React from "react";
import { View, Text } from "react-native";

interface SettingsSectionProps {
  children: React.ReactNode;
  // FIX #14: Remove className prop — callers should not control layout via className. Use `style` instead.
  // FIX #15: Added optional section title label (e.g. "Account", "About")
  title?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  children,
  title,
}) => {
  return (
    <View className="mb-5">
      {/* FIX #15: Optional overline section title */}
      {title && (
        <Text className="happy-brand-eyebrow px-1 mb-2">
          {title}
        </Text>
      )}
      {/* FIX #16: Added soft shadow for section card depth */}
      <View className="happy-brand-raised-panel overflow-hidden rounded-[28px]">
        {children}
      </View>
    </View>
  );
};
