import React, { useCallback, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ColorValue,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export type NameInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  accentColor?: string;
  backgroundColor?: ColorValue;
  containerProps?: ViewProps;
  inputProps?: TextInputProps;
};

const ANIM = { duration: 220, easing: Easing.out(Easing.ease) };

export const NameInput: React.FC<NameInputProps> = ({
  label = "Enter your name",
  placeholder = "",
  value: controlledValue,
  onChangeText,
  accentColor = "#0c86f7",
  backgroundColor = "white",
  containerProps,
  inputProps,
}) => {
  const inputRef = useRef<TextInput>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const value = controlledValue ?? uncontrolledValue;

  const [focused, setFocused] = useState(false);

  const focusP = useSharedValue(0); // 0 -> unfocused, 1 -> focused or has text
  const clearP = useSharedValue(0); // show clear button

  const onLocalChange = useCallback(
    (t: string) => {
      if (onChangeText) onChangeText(t);
      else setUncontrolledValue(t);
      clearP.value = withTiming(t.length > 0 ? 1 : 0, ANIM);
      focusP.value = withTiming(focused || t.length > 0 ? 1 : 0, ANIM);
    },
    [onChangeText, focused]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    focusP.value = withTiming(1, ANIM);
  }, [focusP]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    focusP.value = withTiming(value.length > 0 ? 1 : 0, ANIM);
  }, [focusP, value]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const clearName = useCallback(() => {
    if (onChangeText) onChangeText("");
    else setUncontrolledValue("");
    // keep focus after clearing
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [onChangeText]);

  const onTap = Gesture.Tap().onEnd(() => {
    runOnJS(focusInput)();
  });

  const onClearTap = Gesture.Tap().onEnd(() => {
    clearP.value = withTiming(0, ANIM);
    runOnJS(clearName)();
  });

  // label animation
  const rLabel = useAnimatedStyle(() => {
    const ty = withTiming(focusP.value ? -18 : 0, ANIM);
    const sx = withTiming(focusP.value ? 0.9 : 1, ANIM);
    const sy = withTiming(focusP.value ? 0.9 : 1, ANIM);
    const color = focusP.value ? accentColor : "rgba(15,23,42,0.6)";
    return {
      transform: [{ translateY: ty }, { scaleX: sx }, { scaleY: sy }],
      color,
    } as any;
  }, [accentColor]);

  const rClear = useAnimatedStyle(() => ({
    opacity: withTiming(clearP.value, ANIM),
    transform: [{ scale: withTiming(clearP.value ? 1 : 0.8, ANIM) }],
  }));

  return (
    <GestureDetector gesture={onTap}>
      <View
        style={[styles.container, { backgroundColor }, containerProps?.style]}
        {...containerProps}
      >
        {/* Label */}
        <Animated.Text numberOfLines={1} style={[styles.label, rLabel]}>
          {label}
        </Animated.Text>

        {/* Text input row */}
        <View style={styles.row}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onLocalChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={accentColor}
            autoCapitalize="words"
            autoCorrect
            {...inputProps}
          />
          <GestureDetector gesture={onClearTap}>
            <Animated.View style={[styles.clearBtn, rClear]}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color="rgba(15,23,42,0.6)"
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    borderCurve: "continuous",
  },
  label: {
    position: "absolute",
    left: 26,
    top: 32,
    fontSize: 16,
    color: "rgba(15,23,42,0.6)",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  clearBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NameInput;
