// AnimatedFloatingInput.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const AnimatedView = Animated.View;
const AnimatedText = Animated.Text;

interface AnimatedFloatingInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
  inputStyle?: any;
  caretHidden?: boolean;
}

const AnimatedFloatingInput: React.FC<AnimatedFloatingInputProps> = ({
  value: propValue,
  onChangeText,
  placeholder = "Placeholder",
  style,
  inputStyle,
  caretHidden = false,
  ...rest
}) => {
  const [value, setValue] = useState<string>(propValue);

  const focused = useSharedValue<number>(0);
  const hasValue = useSharedValue<number>(propValue.length > 0 ? 1 : 0);

  useEffect(() => {
    setValue(propValue);
    hasValue.value = propValue.length > 0 ? 1 : 0;
  }, [propValue, hasValue]);

  const onFocus = useCallback(() => {
    focused.value = withTiming(1, { duration: 220 });
  }, [focused]);

  const onBlur = useCallback(() => {
    focused.value = withTiming(0, { duration: 220 });
  }, [focused]);

  const handleChange = (text: string) => {
    setValue(text);
    onChangeText(text);
    hasValue.value = text.length > 0 ? withTiming(1) : withTiming(0);
  };

  const labelStyle = useAnimatedStyle(() => {
    const progress = Math.max(focused.value, hasValue.value);
    const translateY = interpolate(
      progress,
      [0, 1],
      [0, -22],
      Extrapolate.CLAMP
    );
    const scale = interpolate(progress, [0, 1], [1, 0.86], Extrapolate.CLAMP);

    return {
      transform: [{ translateY }, { scale }],
      color: progress === 1 ? "#0b84ff" : "#666",
      opacity: withTiming(progress ? 1 : 0.9, { duration: 200 }),
    };
  });

  const underlineStyle = useAnimatedStyle(() => {
    const prog = focused.value;
    return {
      transform: [
        {
          scaleX: withTiming(prog ? 1 : 0.35, { duration: 240 }),
        },
      ],
      backgroundColor: withTiming(prog ? "#0b84ff" : "#ccc", { duration: 200 }),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    const prog = focused.value;
    const translateY = interpolate(prog, [0, 1], [0, -2], Extrapolate.CLAMP);
    const shadowOpacity = interpolate(
      prog,
      [0, 1],
      [0.08, 0.18],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
      shadowOpacity,
      elevation: prog ? 3 : 1,
    };
  });

  return (
    <AnimatedView style={[styles.wrapper, style, containerStyle]}>
      <View style={styles.row} pointerEvents="none">
        <AnimatedText style={[styles.label, labelStyle]} numberOfLines={1}>
          {placeholder}
        </AnimatedText>
      </View>

      <TextInput
        value={value}
        onChangeText={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={[styles.input, inputStyle]}
        placeholder={focused.value ? "" : ""}
        underlineColorAndroid="transparent"
        caretHidden={caretHidden}
        {...rest}
      />

      <View style={styles.underlineContainer}>
        <View style={styles.underlineBase} />
        <AnimatedView style={[styles.underlineActive, underlineStyle]} />
      </View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  row: {
    position: "absolute",
    left: 12,
    top: 12,
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    backgroundColor: "transparent",
    paddingHorizontal: 4,
  },
  input: {
    height: 48,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "ios" ? 18 : 16,
    color: "#111",
  },
  underlineContainer: {
    height: 2,
    marginTop: 6,
    overflow: "hidden",
    justifyContent: "center",
  },
  underlineBase: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#e6e6e6",
  },
  underlineActive: {
    height: 2,
    width: "100%",
    transform: [{ scaleX: 0 }],
    alignSelf: "flex-start",
  },
});

export default AnimatedFloatingInput;
