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
    <View className="mx-5 mb-7">
      {title && (
        <Text className="mb-1 ml-0 text-[14px] font-bold text-ink">
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
