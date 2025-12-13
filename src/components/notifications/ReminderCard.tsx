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
        style={{
          paddingHorizontal: 24,
          paddingVertical: 20,
          borderRadius: 24,
          marginBottom: 16,
          backgroundColor: isSelected ? colors.bg : "#FFFFFF",
          borderColor: isSelected ? colors.border : "#F3F4F6",
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* Left side - Icon and Title */}
          <View className="flex-row items-center flex-1">
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
                backgroundColor: isSelected ? `${colors.border}20` : "#F9FAFB",
              }}
            >
              <HugeiconsIcon
                icon={icon}
                size={28}
                color={isSelected ? colors.icon : "#6B7280"}
              />
            </View>
            <View className="flex-1">
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "CormorantSemiBold",
                  marginBottom: 6,
                  color: isSelected ? colors.text : "#1F2937",
                }}
              >
                {item.title}
              </Text>
              <Pressable
                onPress={onEditTime}
                className="flex-row items-center active:opacity-70"
                style={{
                  alignSelf: "flex-start",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: isSelected
                    ? `${colors.border}15`
                    : "#F3F4F6",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isSelected ? `${colors.border}30` : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: isSelected ? colors.text : "#4B5563",
                    fontWeight: "700",
                    letterSpacing: 0.3,
                  }}
                >
                  {dayjs().hour(item.hour).minute(item.minute).format("h:mm A")}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Right side - Toggle */}
          <Pressable
            onPress={onToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 2,
              alignItems: "center",
              justifyContent: "center",
              borderColor: isSelected ? colors.border : "#D1D5DB",
              backgroundColor: isSelected ? colors.border : "#FFFFFF",
            }}
            accessibilityLabel={`${item.title} reminder`}
          >
            {isSelected && (
              <Animated.View
                style={toggleAnimatedStyle}
                className="items-center justify-center"
              >
                <HugeiconsIcon icon={Tick02Icon} size={14} color="white" />
              </Animated.View>
            )}
          </Pressable>
        </View>
      </Pressable>
    );
  }
);

ReminderCard.displayName = "ReminderCard";
