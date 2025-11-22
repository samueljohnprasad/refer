import { format } from "date-fns/format";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

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
    if (isSelected) return "text-black/90";
    return "text-black/80";
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <View
        className={`items-center py-1.5 px-1 rounded-xl ${
          isSelected
            ? "bg-[#7B61FF]"
            : isToday && !isSelected
            ? "bg-white/10"
            : ""
        }`}
      >
        <View className="flex flex-col items-center">
          <Text
            className={`text-xs font-medium tracking-wider mb-0.5 ${getFontColor()}`}
          >
            {dayName}
          </Text>
          <Text className={`text-base font-semibold ${getFontColor()}`}>
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
