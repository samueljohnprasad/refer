import React from "react";
import { View, Pressable, Switch } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SymbolView, SymbolViewProps } from "expo-symbols";
import { Host, DatePicker } from "@expo/ui/swift-ui";
import type { ReminderItem } from "./types";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import * as Haptics from "expo-haptics";

type ReminderCardProps = {
  item: ReminderItem;
  index: number;
  isSelected?: boolean;
  onToggle: () => void;
  onEditTime?: () => void;
  onTimeChange?: (hour: number, minute: number) => void;
  isLast?: boolean;
};

const iconMap: Record<string, SymbolViewProps["name"]> = {
  "1": "sun.and.horizon",
  "2": "sun.max",
  "3": "moon.stars",
};

/**
 * Flat edge-to-edge reminder item with native Switch
 */
export const ReminderCard: React.FC<ReminderCardProps> = React.memo(
  ({ item, isSelected = false, onToggle, onTimeChange, isLast = false }) => {
    const icon = iconMap[item.id] || "clock";

    const handlePress = () => {
      Haptics.selectionAsync();
      onToggle();
    };

    return (
      <View className="flex-row items-center pl-4 gap-3.5 bg-transparent">
        <Pressable onPress={handlePress} hitSlop={8} accessibilityRole="checkbox" accessibilityState={{ checked: isSelected }}>
          <View className="w-7 items-center justify-center">
            <SymbolView
              name={icon as SymbolViewProps["name"]}
              size={20}
              tintColor={isSelected ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.text.tertiary}
              type="hierarchical"
            />
          </View>
        </Pressable>
        
        <View
          className={`flex-1 flex-row items-center py-2.5 pr-4 ${
            !isLast ? "border-b border-border/40" : ""
          }`}
        >
          <Pressable 
            className="flex-1 justify-center py-1.5 -my-1.5"
            onPress={handlePress}
            accessibilityRole="none"
          >
            <Text
              className="text-[16px] font-medium text-ink"
            >
              {item.title}
            </Text>
          </Pressable>

          {/* Time Picker Button (SwiftUI) */}
          <Host matchContents>
            <DatePicker
              selection={
                new Date(new Date().setHours(item.hour, item.minute, 0, 0))
              }
              displayedComponents={["hourAndMinute"]}
              onDateChange={(date: Date) => {
                if (onTimeChange) {
                  onTimeChange(date.getHours(), date.getMinutes());
                }
              }}
            />
          </Host>

          {/* Native Toggle Switch */}
          <View className="ml-3">
            <Switch
              value={isSelected}
              onValueChange={handlePress}
              trackColor={{
                true: SEMANTIC_COLORS.brand.primary,
                false: "#E5E5EA",
              }}
              ios_backgroundColor="#E5E5EA"
              accessibilityRole="switch"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${item.title} reminder`}
            />
          </View>
        </View>
      </View>
    );
  }
);

ReminderCard.displayName = "ReminderCard";
