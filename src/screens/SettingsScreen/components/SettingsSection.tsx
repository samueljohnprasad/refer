import React from "react";
import { View, Text } from "react-native";
import { Card } from "@/src/components/ui/Card";

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  children,
  title,
}) => {
  return (
    <View className="mb-5">
      {title && (
        <Text className="happy-brand-eyebrow px-1 mb-2">
          {title}
        </Text>
      )}
      <Card
        variant="tile"
        radius="lg"
        showDepth={false}
        className="border border-sage-100"
        contentClassName="p-0 overflow-hidden"
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isLast: index === React.Children.count(children) - 1,
            });
          }
          return child;
        })}
      </Card>
    </View>
  );
};
