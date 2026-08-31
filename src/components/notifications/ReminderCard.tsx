import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SymbolView, SymbolViewProps } from "expo-symbols";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import dayjs from "dayjs";
import { Host, DatePicker } from "@expo/ui/swift-ui";
import type { ReminderItem } from "./types";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
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
 * Flat edge-to-edge reminder item
 */
export const ReminderCard: React.FC<ReminderCardProps> = React.memo(
  ({ item, isSelected = false, onToggle, onEditTime, onTimeChange, isLast = false }) => {
    const toggleScale = useSharedValue(isSelected ? 1 : 0);

    React.useEffect(() => {
      toggleScale.value = withSpring(isSelected ? 1 : 0, {
        damping: 20,
        stiffness: 100,
        overshootClamping: true,
      });
    }, [isSelected]);

    const toggleAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: toggleScale.value }],
      };
    });

    const icon = iconMap[item.id] || "clock";

    const handlePress = () => {
      Haptics.selectionAsync();
      onToggle();
    };

    return (
      <View className="flex-row items-center pl-5 gap-4 bg-transparent">
        <Pressable onPress={handlePress} hitSlop={8} accessibilityRole="checkbox" accessibilityState={{ checked: isSelected }}>
          <View className="w-8 items-center justify-center">
            <SymbolView
              name={icon as SymbolViewProps["name"]}
              size={22}
              tintColor={isSelected ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.text.tertiary}
              type="hierarchical"
            />
          </View>
        </Pressable>
        
        <View
          className={`flex-1 flex-row items-center py-3.5 pr-5 ${
            !isLast ? "border-b border-border/50" : ""
          }`}
        >
          <Pressable 
            className="flex-1 justify-center py-2 -my-2"
            onPress={handlePress}
            accessibilityRole="none"
          >
            <Text
              className="text-[17px] text-foreground"
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

          {/* Toggle Switch */}
          <Pressable onPress={handlePress} hitSlop={8} className="ml-4" accessibilityRole="none">
            <View
              className="w-7 h-7 rounded-full items-center justify-center border-2"
              style={{
                borderColor: isSelected ? SEMANTIC_COLORS.brand.primary : "#e4e4e7",
                backgroundColor: isSelected ? SEMANTIC_COLORS.brand.primary : "transparent",
              }}
            >
              {isSelected && (
                <Animated.View
                  style={toggleAnimatedStyle}
                  className="items-center justify-center"
                >
                  <SymbolView name="checkmark" size={14} tintColor={SEMANTIC_COLORS.surface.primary} weight="bold" />
                </Animated.View>
              )}
            </View>
          </Pressable>
        </View>
      </View>
    );
  }
);

ReminderCard.displayName = "ReminderCard";
