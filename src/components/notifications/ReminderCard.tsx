import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
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
import type { ReminderItem } from "./types";
import { getColorForReminder } from "./utils";

type ReminderCardProps = {
  item: ReminderItem;
  index: number;
  isSelected?: boolean;
  onToggle: () => void;
  onEditTime: () => void;
};

const iconMap: Record<string, any> = {
  morning: Sun03Icon,
  afternoon: Sun03Icon,
  evening: SunsetIcon,
  night: Moon02Icon,
  bedtime: SleepingIcon,
};

/**
 * Individual reminder card component with animations and color theming
 */
export const ReminderCard: React.FC<ReminderCardProps> = React.memo(
  ({ item, index, isSelected = false, onToggle, onEditTime }) => {
    const toggleScale = useSharedValue(isSelected ? 1 : 0);
    const colors = getColorForReminder(item.id);

    React.useEffect(() => {
      toggleScale.value = withSpring(isSelected ? 1 : 0, {
        damping: 15,
        stiffness: 100,
      });
    }, [isSelected]);

    const toggleAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: toggleScale.value }],
      };
    });

    const icon = iconMap[item.id] || Clock04Icon;

    return (
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${item.title} reminder, ${
          isSelected ? "enabled" : "disabled"
        }`}
        className="active:opacity-80"
        style={{
          paddingHorizontal: 24,
          paddingVertical: 20,
          borderRadius: 24,
          marginBottom: 16,
          backgroundColor: isSelected ? colors.bg : "#FFFFFF",
          borderWidth: 1.5,
          borderColor: isSelected ? colors.border : "#F3F4F6",
          shadowColor: isSelected ? colors.border : "#000",
          shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
          shadowOpacity: isSelected ? 0.15 : 0.03,
          shadowRadius: isSelected ? 12 : 8,
          elevation: isSelected ? 4 : 1,
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* Left side - Icon and Title */}
          <View className="flex-row items-center flex-1">
            <View
              className="w-12 h-12 rounded-[14px] items-center justify-center mr-4"
              style={{
                backgroundColor: isSelected ? `${colors.border}25` : "#F3F4F6",
              }}
            >
              <HugeiconsIcon
                icon={icon}
                size={24}
                color={isSelected ? colors.icon : "#9CA3AF"}
                strokeWidth={1.8}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-[17px] font-bold tracking-tight mb-1"
                style={{
                  color: isSelected ? colors.text : "#111827",
                }}
              >
                {item.title}
              </Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  onEditTime();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Change time for ${item.title}`}
                className="flex-row items-center active:opacity-70"
                style={{
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  backgroundColor: isSelected
                    ? `${colors.border}20`
                    : "#F3F4F6",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: isSelected ? `${colors.border}35` : "#E5E7EB",
                }}
              >
                <Text
                  className="text-[13px] font-bold tracking-wide"
                  style={{
                    color: isSelected ? colors.text : "#4B5563",
                  }}
                >
                  {dayjs().hour(item.hour).minute(item.minute).format("h:mm A")}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Right side - Toggle */}
          <View
            className="w-7 h-7 rounded-full items-center justify-center border-2 ml-3"
            style={{
              borderColor: isSelected ? colors.border : "#E5E7EB",
              backgroundColor: isSelected ? colors.border : "transparent",
            }}
          >
            {isSelected && (
              <Animated.View
                style={toggleAnimatedStyle}
                className="items-center justify-center"
              >
                <HugeiconsIcon icon={Tick02Icon} size={14} color="white" />
              </Animated.View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }
);

ReminderCard.displayName = "ReminderCard";
