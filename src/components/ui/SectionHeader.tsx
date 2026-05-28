import React, { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SAGE } from "@/lib/tokens";

interface SectionHeaderProps {
  title: string;
  icon: any;
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
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-sage-50">
          <HugeiconsIcon icon={icon} size={22} color={SAGE[600]} />
        </View>
        <Text variant="body-bold">{title}</Text>
        {count !== undefined && (
          <View className="ml-2 rounded-full bg-sage-pill px-2.5 py-1">
            <Text variant="chip" color="sage">
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
