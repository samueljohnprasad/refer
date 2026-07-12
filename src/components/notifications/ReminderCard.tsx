import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Sun03Icon,
  Moon02Icon,
  SunsetIcon,
  SleepingIcon,
  Tick02Icon,
  Clock04Icon,
} from "@hugeicons/core-free-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import dayjs from "dayjs";
import { Host, DatePicker } from "@expo/ui/swift-ui";
import type { ReminderItem } from "./types";
import { BRAND_SURFACE, INK, INK_MUTED, SAGE, TRANSPARENT } from "@/lib/tokens";
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

const iconMap: Record<string, any> = {
  morning: Sun03Icon,
  afternoon: Sun03Icon,
  evening: SunsetIcon,
  night: Moon02Icon,
  bedtime: SleepingIcon,
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

    const icon = iconMap[item.id] || Clock04Icon;

    const handlePress = () => {
      Haptics.selectionAsync();
      onToggle();
    };

    return (
      <Pressable
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${item.title} reminder, ${
          isSelected ? "enabled" : "disabled"
        }`}
        className="active:bg-muted/50 bg-background"
      >
        <View className="flex-row items-center pl-5 gap-4">
          <View
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: isSelected ? SAGE.pill : "#f4f4f5" }}
          >
            <HugeiconsIcon
              icon={icon}
              size={18}
              color={isSelected ? SAGE[600] : INK_MUTED}
              strokeWidth={2}
            />
          </View>
          
          <View
            className={`flex-1 flex-row items-center py-3.5 pr-5 ${
              !isLast ? "border-b border-border/50" : ""
            }`}
          >
            <Text
              className="text-[17px] text-foreground flex-1"
            >
              {item.title}
            </Text>

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
            <View
              className="w-7 h-7 rounded-full items-center justify-center border-2 ml-4"
              style={{
                borderColor: isSelected ? SAGE[500] : "#e4e4e7",
                backgroundColor: isSelected ? SAGE[500] : TRANSPARENT,
              }}
            >
              {isSelected && (
                <Animated.View
                  style={toggleAnimatedStyle}
                  className="items-center justify-center"
                >
                  <HugeiconsIcon icon={Tick02Icon} size={14} color={BRAND_SURFACE} />
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    );
  }
);

ReminderCard.displayName = "ReminderCard";
