import React from "react";
import { View, Text } from "react-native";
import { Card } from "@/src/components/ui/Card";

interface SettingsSectionProps {
  // FIX #14: Remove className prop — callers should not control layout via className. Use `style` instead.
  // FIX #15: Added optional section title label (e.g. "Account", "About")
  title?: string;
  children: React.ReactNode;
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
      {/* Use premium interactive-style depth card but non-interactive */}
      <Card
        variant="tile"
        radius="xl"
        showDepth={true}
        contentClassName="p-0 overflow-hidden"
      >
        {children}
      </Card>
    </View>
  );
};
