import { tva } from "@gluestack-ui/utils/nativewind-utils";
import React, { memo, useMemo, useRef } from "react";
import {
  Pressable,
  Text,
  Animated,
  Platform,
  AccessibilityState,
} from "react-native";

export interface TimePillProps {
  label: string;
  selected: boolean;
  accessibilityLabel?: string;
  onPress: () => void;
  testID?: string;
}

const pillStyle = tva({
  base: "h-11 w-14 items-center justify-center rounded-2xl bg-[#F6F6F7] border border-[#ECECEC] m-2",
  variants: {
    selected: {
      true: "bg-[#0F172A] border-[#0F172A]",
      false: "",
    },
  },
});

const pillTextStyle = tva({
  base: "text-[#0F172A] font-semibold",
  variants: {
    selected: {
      true: "text-white",
      false: "",
    },
  },
});

const TimePillComponent: React.FC<TimePillProps> = ({
  label,
  selected,
  accessibilityLabel,
  onPress,
  testID,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
      tension: 150,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 150,
    }).start();
  };

  const a11yState: AccessibilityState = useMemo(
    () => ({ selected }),
    [selected]
  );

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={a11yState}
        accessibilityLabel={accessibilityLabel}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        testID={testID}
        android_ripple={
          Platform.OS === "android" ? { color: "#E5E7EB" } : undefined
        }
        className={pillStyle({ selected })}
      >
        <Text className={pillTextStyle({ selected })}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const TimePill = memo(TimePillComponent, (prev, next) => {
  return (
    prev.label === next.label &&
    prev.selected === next.selected &&
    prev.onPress === next.onPress
  );
});

export default TimePill;
