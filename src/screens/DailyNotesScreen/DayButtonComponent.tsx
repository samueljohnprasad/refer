import { format } from "date-fns/format";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/Themed";
import {
  BRAND_SURFACE_SOFT,
  INK,
  INK_MUTED,
  SAGE,
  SAGE_OVERLAY,
  TRANSPARENT,
} from "@/lib/tokens";

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

  const getTextColor = () => {
    if (disabled) return SAGE_OVERLAY.disabled;
    if (isSelected) return SAGE[600];
    return INK;
  };

  const backgroundColor = isSelected
    ? SAGE.selected
    : isToday && !isSelected
    ? BRAND_SURFACE_SOFT
    : TRANSPARENT;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${dayName} ${format(day, "d")}`}
    >
      <View
        className="items-center px-1 py-1.5 rounded-xl"
        style={{
          backgroundColor,
          borderColor: isSelected ? SAGE[200] : TRANSPARENT,
          borderWidth: 1,
        }}
      >
        <View className="flex flex-col items-center">
          <Text
            className="happy-font-body-bold text-[10px] uppercase tracking-widest mb-1"
            style={{
              color: disabled
                ? SAGE_OVERLAY.disabled
                : INK_MUTED,
              opacity: isSelected || disabled ? 1 : 0.78,
            }}
          >
            {dayName}
          </Text>
          <Text
            className={`text-[21px] ${
              isSelected ? "happy-font-body-bold" : "happy-font-body-medium"
            }`}
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
