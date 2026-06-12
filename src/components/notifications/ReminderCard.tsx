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
import { BRAND_SURFACE, INK, INK_MUTED, SAGE, TRANSPARENT } from "@/lib/tokens";

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
  ({ item, isSelected = false, onToggle, onEditTime }) => {
    const toggleScale = useSharedValue(isSelected ? 1 : 0);

    React.useEffect(() => {
      toggleScale.value = withSpring(isSelected ? 1 : 0, { damping: 20, stiffness: 100, overshootClamping: true });
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
          backgroundColor: isSelected ? SAGE.selected : BRAND_SURFACE,
          borderWidth: 2,
          borderColor: isSelected ? SAGE[500] : SAGE[100],
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* Left side - Icon and Title */}
          <View className="flex-row items-center flex-1">
            <View
              className="w-12 h-12 rounded-[14px] items-center justify-center mr-4"
              style={{
                backgroundColor: SAGE.pill,
              }}
            >
              <HugeiconsIcon
                icon={icon}
                size={24}
                color={isSelected ? SAGE[600] : INK_MUTED}
                strokeWidth={1.8}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-[17px] font-bold tracking-tight mb-1"
                style={{
                  color: isSelected ? SAGE[700] : INK,
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
                  backgroundColor: SAGE[50],
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: SAGE[100],
                }}
              >
                <Text
                  className="text-[13px] font-bold tracking-wide"
                  style={{
                    color: isSelected ? SAGE[700] : INK_MUTED,
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
              borderColor: isSelected ? SAGE[500] : SAGE[200],
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
      </Pressable>
    );
  }
);

ReminderCard.displayName = "ReminderCard";
