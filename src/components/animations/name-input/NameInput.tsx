import React, { useCallback, useRef, useState, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ColorValue,
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

// Extract animation config as constant to prevent recreation
const ANIM = { duration: 220, easing: Easing.out(Easing.ease) };

// Static styles that don't change
const LABEL_BASE_STYLE = {
  position: "absolute" as const,
  left: 26,
  top: 32,
};

export const NameInput: React.FC<NameInputProps> = React.memo((props) => {
  const {
    label = "Enter your name",
    placeholder = "",
    value: controlledValue,
    onChangeText,
    accentColor = "#0c86f7",
    backgroundColor = "white",
    containerProps,
    inputProps,
  } = props;

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
    [onChangeText, focused, clearP, focusP]
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

  // Memoize gestures to prevent recreation
  const onTap = useMemo(
    () =>
      Gesture.Tap().onEnd(() => {
        runOnJS(focusInput)();
      }),
    [focusInput]
  );

  const onClearTap = useMemo(
    () =>
      Gesture.Tap().onEnd(() => {
        clearP.value = withTiming(0, ANIM);
        runOnJS(clearName)();
      }),
    [clearName, clearP]
  );

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

  // Memoize container style
  const containerStyle = useMemo(
    () => [{ backgroundColor }, containerProps?.style],
    [backgroundColor, containerProps?.style]
  );

  return (
    <GestureDetector gesture={onTap}>
      <View
        className="w-[90%] self-center rounded-2xl px-4 pt-3.5 pb-[18px]"
        style={containerStyle}
        {...containerProps}
      >
        {/* Label */}
        <Animated.Text
          numberOfLines={1}
          className="text-base font-semibold"
          style={[LABEL_BASE_STYLE, rLabel]}
        >
          {label}
        </Animated.Text>

        {/* Text input row */}
        <View className="flex-row items-center pt-[18px]">
          <TextInput
            ref={inputRef}
            className="flex-1 py-1.5 px-4 text-base text-slate-900"
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
            <Animated.View
              className="w-7 h-7 items-center justify-center"
              style={rClear}
            >
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
});

NameInput.displayName = "NameInput";

export default NameInput;
