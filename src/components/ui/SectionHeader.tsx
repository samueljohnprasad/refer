import React, { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

interface SectionHeaderProps {
  title: string;
  icon?: any;
  count?: ReactNode;
  rightElement?: ReactNode;
  className?: string;
  iconBgClass?: string;
  iconColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  count,
  rightElement,
  className = "",
  iconBgClass,
  iconColor,
}) => {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <View className="flex-row items-center">
        {icon && (
          <View className={`mr-3 h-11 w-11 items-center justify-center rounded-full ${iconBgClass || "bg-sage-50"}`}>
            <HugeiconsIcon icon={icon} size={22} color={iconColor || SEMANTIC_COLORS.brand.pressed} />
          </View>
        )}
        <Text variant="h2">{title}</Text>
        {count !== undefined && (
          <View className="ml-2 rounded-full bg-sage-pill px-2.5 py-1.5">
            <Text variant="chip" className="text-sage-700">
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
