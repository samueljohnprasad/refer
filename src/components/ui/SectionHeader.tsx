import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";

interface SectionHeaderProps {
  title: string;
  icon: any; // Hugeicons icon
  count?: ReactNode;
  rightElement?: ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  count,
  rightElement,
  className = "",
}) => {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <View className="flex-row items-center">
        <View
          className="p-2 rounded-xl mr-2"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <HugeiconsIcon icon={icon} size={22} color="#6B7280" />
        </View>
        <Text className="text-gray-900 font-semibold text-base">{title}</Text>
        {count !== undefined && (
          <View className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full">
            <Text className="text-xs font-medium text-gray-500">{count}</Text>
          </View>
        )}
      </View>

      {rightElement && (
        <View className="flex-row items-center" style={{ gap: 8 }}>
          {rightElement}
        </View>
      )}
    </View>
  );
};
