import { format } from "date-fns/format";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/Themed";

// Simplified Animated Day Button Component - Performance Optimized
export interface DayButtonProps {
  day: Date;
  dayName: string;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const DAY_BUTTON_COLORS = {
  text: "#1F2937",
  muted: "#64748B",
  disabled: "rgba(31, 41, 55, 0.35)",
  selectedText: "#5F46E8",
  selectedBackground: "#EEE9FF",
  todayBackground: "#FFFFFF",
};

// Simplified version without individual shared values - much more performant
const DayButtonComponent: React.FC<DayButtonProps> = ({
  day,
  dayName,
  isSelected,
  isToday,
  onPress,
  disabled = false,
}) => {
  const handlePress = (): void => {
    if (disabled) return;
    onPress();
  };

  const getTextColor = () => {
    if (disabled) return DAY_BUTTON_COLORS.disabled;
    if (isSelected) return DAY_BUTTON_COLORS.selectedText;
    return DAY_BUTTON_COLORS.text;
  };

  const backgroundColor = isSelected
    ? DAY_BUTTON_COLORS.selectedBackground
    : isToday && !isSelected
    ? DAY_BUTTON_COLORS.todayBackground
    : "transparent";

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${dayName} ${format(day, "d")}`}
    >
      <View
        className="items-center py-1.5 px-1 rounded-xl"
        style={{ backgroundColor }}
      >
        <View className="flex flex-col items-center">
          <Text
            className="text-[10px] uppercase font-bold tracking-widest mb-1"
            style={{
              color: disabled ? DAY_BUTTON_COLORS.disabled : DAY_BUTTON_COLORS.muted,
              opacity: isSelected || disabled ? 1 : 0.78,
            }}
          >
            {dayName}
          </Text>
          <Text 
            className={`text-[20px] ${isSelected ? "font-semibold" : "font-regular"}`}
            style={{
              color: getTextColor(),
              opacity: isSelected || disabled ? 1 : 0.92,
            }}
          >
            {format(day, "d")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const areDayButtonPropsEqual = (
  prev: Readonly<DayButtonProps>,
  next: Readonly<DayButtonProps>
): boolean => {
  return (
    prev.isSelected === next.isSelected &&
    prev.isToday === next.isToday &&
    prev.day.getTime() === next.day.getTime() &&
    prev.dayName === next.dayName &&
    (prev.disabled ?? false) === (next.disabled ?? false)
    // Intentionally ignoring onPress reference to avoid re-renders due to new function identity
  );
};

export const DayButton = memo(DayButtonComponent, areDayButtonPropsEqual);
