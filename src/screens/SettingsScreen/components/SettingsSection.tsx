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
    // ponytail: clean grouped section container with subtle border and zero shadow
    <View className="mb-6 mx-5">
      {title && (
        <Text className="text-[12px] font-semibold text-ink-muted uppercase tracking-wider mb-2 ml-4">
          {title}
        </Text>
      )}
      <View className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/[0.06] dark:border-white/10 overflow-hidden shadow-none">
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
