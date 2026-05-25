import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SAGE } from "@/lib/tokens";

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
          className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-sage-50"
        >
          <HugeiconsIcon icon={icon} size={22} color={SAGE[600]} />
        </View>
        <Text className="happy-font-body-bold text-[17px] text-ink">{title}</Text>
        {count !== undefined && (
          <View className="ml-2 rounded-full bg-sage-pill px-2.5 py-1">
            <Text className="happy-font-body-bold text-xs text-sage-600">
              {count}
            </Text>
          </View>
        )}
      </View>

      {rightElement && (
        <View className="flex-row items-center gap-2">
          {rightElement}
        </View>
      )}
    </View>
  );
};
