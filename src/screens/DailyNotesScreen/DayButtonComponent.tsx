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

  const getFontColor = () => {
    if (disabled) return "text-black/30";
    if (isSelected) return "text-theme-purple-deep";
    return "text-theme-text-primary";
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${dayName} ${format(day, "d")}`}
    >
      <View
        className={`items-center py-1.5 px-1 rounded-xl ${
          isSelected
            ? "bg-theme-purple-light"
            : isToday && !isSelected
            ? "bg-gray-100"
            : ""
        }`}
      >
        <View className="flex flex-col items-center">
          <Text
            className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${getFontColor()}`}
            style={{ opacity: isSelected ? 1 : 0.6 }}
          >
            {dayName}
          </Text>
          <Text 
            className={`text-[20px] ${isSelected ? 'font-semibold' : 'font-regular'} ${getFontColor()}`}
            style={{ opacity: isSelected ? 1 : 0.8 }}
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
