import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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

    return (
      <Pressable
        onPress={onToggle}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 18,
          borderRadius: 20,
          marginBottom: 14,
          backgroundColor: isSelected
            ? colors.bg
            : "rgba(255, 255, 255, 0.95)",
          shadowColor: isSelected ? colors.border : "#000",
          shadowOffset: { width: 0, height: isSelected ? 6 : 2 },
          shadowOpacity: isSelected ? 0.25 : 0.08,
          shadowRadius: isSelected ? 16 : 8,
          elevation: isSelected ? 6 : 2,
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* Left side - Icon and Title */}
          <View className="flex-row items-center flex-1">
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
                backgroundColor: isSelected
                  ? `${colors.border}30`
                  : "#F9FAFB",
              }}
            >
              {item.iconLib === "fe" ? (
                <Feather
                  name={item.icon}
                  size={24}
                  color={isSelected ? colors.icon : "#6B7280"}
                />
              ) : (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={isSelected ? colors.icon : "#6B7280"}
                />
              )}
            </View>
            <View className="flex-1">
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  marginBottom: 2,
                  color: isSelected ? colors.text : "#1F2937",
                }}
              >
                {item.title}
              </Text>
            </View>
          </View>

          {/* Right side - Time and Toggle */}
          <View className="flex-row items-center">
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                marginRight: 12,
                backgroundColor: isSelected
                  ? `${colors.border}25`
                  : "#F3F4F6",
              }}
              onPress={onEditTime}
            >
              <Feather
                name="clock"
                size={14}
                color="#9CA3AF"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  letterSpacing: 0.2,
                  color: isSelected ? colors.text : "#4B5563",
                }}
              >
                {dayjs().hour(item.hour).minute(item.minute).format("h:mm A")}
              </Text>
            </Pressable>

            <Pressable
              onPress={onToggle}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
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
                  <Feather name="check" size={16} color="white" strokeWidth={3} />
                </Animated.View>
              )}
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }
);

ReminderCard.displayName = "ReminderCard";
