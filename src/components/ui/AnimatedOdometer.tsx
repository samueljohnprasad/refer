import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface TickProps {
  digit: string;
  textClassName: string;
}

const LINE_HEIGHT = 22; // Hardcoded based on text-base

function Tick({ digit, textClassName }: TickProps) {
  const parsed = parseInt(digit, 10);
  const isNumber = !isNaN(parsed);
  
  const animatedValue = useSharedValue(isNumber ? parsed : 0);

  useEffect(() => {
    if (isNumber) {
      animatedValue.value = withSpring(parsed, { damping: 20, stiffness: 100, overshootClamping: true });
    }
  }, [parsed, isNumber, animatedValue]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -animatedValue.value * LINE_HEIGHT,
        },
      ],
    };
  });

  if (!isNumber) {
    return (
      <Text
        className={`text-base ${textClassName}`}
        style={{ fontFamily: "GeistBold", height: LINE_HEIGHT, lineHeight: LINE_HEIGHT }}
      >
        {digit}
      </Text>
    );
  }

  return (
    <View style={{ height: LINE_HEIGHT, overflow: "hidden" }}>
      <Animated.View style={style}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={num}
            className={`text-base ${textClassName}`}
            style={{ fontFamily: "GeistBold", height: LINE_HEIGHT, lineHeight: LINE_HEIGHT }}
          >
            {num}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

interface AnimatedOdometerProps {
  value: string;
  textClassName: string;
}

export function AnimatedOdometer({ value, textClassName }: AnimatedOdometerProps) {
  const chars = value.split("");

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {chars.map((char, index) => (
        <Tick
          key={`${chars.length}-${index}`}
          digit={char}
          textClassName={textClassName}
        />
      ))}
    </View>
  );
}
