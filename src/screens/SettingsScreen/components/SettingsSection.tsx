import React from "react";
import { View, Text } from "react-native";

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  children,
  title,
}) => {
  return (
    <View className="mb-10">
      {title && (
        <Text className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider mb-2 ml-5">
          {title}
        </Text>
      )}
      <View>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isLast: index === React.Children.count(children) - 1,
            });
          }
          return child;
        })}
      </View>
    </View>
  );
};
