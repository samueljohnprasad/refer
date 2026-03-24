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
    <View className="mb-4">
      {/* FIX #15: Optional overline section title */}
      {title && (
        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] px-1 mb-2">
          {title}
        </Text>
      )}
      {/* FIX #16: Added soft shadow for section card depth */}
      <View
        className="bg-white rounded-2xl overflow-hidden border border-gray-100/60"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 1,
        }}
      >
        {children}
      </View>
    </View>
  );
};
