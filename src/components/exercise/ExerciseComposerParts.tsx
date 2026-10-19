import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEvent,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { Text } from "@/src/components/ui/Text";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

const borderRadius = 24;

export function ComposerShell({
  value,
  onChange,
  placeholder,
  minHeight,
  readOnly = false,
  blurOnSubmit = false,
  onSubmitEditing,
  footer,
  isRecording = false,
  isTranscribing = false,
  maxLength,
  submitBehavior,
  autoFocus = true,
  accessibilityLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight: number;
  readOnly?: boolean;
  blurOnSubmit?: boolean;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  footer?: React.ReactNode;
  isRecording?: boolean;
  isTranscribing?: boolean;
  maxLength?: number;
  submitBehavior?: "submit" | "newline";
  autoFocus?: boolean;
  accessibilityLabel?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!autoFocus || readOnly || isTranscribing) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 450);
    return () => clearTimeout(timer);
  }, [autoFocus, readOnly, isTranscribing]);

  return (
    <View style={composerStyles.container}>
      <View
        style={[
          composerStyles.inputWrapper,
          isFocused && composerStyles.inputWrapperFocused,
          isRecording && composerStyles.inputWrapperRecording,
        ]}
      >
        <View style={composerStyles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[composerStyles.input, { minHeight }]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            accessibilityLabel={accessibilityLabel ?? placeholder ?? "Response"}
            accessibilityRole="text"
            placeholderTextColor={SEMANTIC_COLORS.text.secondary}
            onSubmitEditing={onSubmitEditing}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="send"
            multiline
            editable={!readOnly && !isTranscribing}
            autoFocus={false}
            blurOnSubmit={blurOnSubmit}
            maxLength={maxLength}
            submitBehavior={submitBehavior}
          />
          {footer ? (
            <View style={composerStyles.footerContainer}>{footer}</View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export function ComposerMeta({
  helperText,
  requirementText,
  requirementVisible,
  statusText,
  statusVisible,
  count,
  maxLength,
}: {
  helperText?: string;
  requirementText?: string;
  requirementVisible?: boolean;
  statusText?: string;
  statusVisible?: boolean;
  count?: number;
  maxLength?: number;
}) {
  const showCount =
    typeof count === "number" &&
    typeof maxLength === "number" &&
    count > Math.floor(maxLength * 0.8);
  return (
    <>
      <View className="mt-2 min-h-[24px] flex-row items-start justify-between gap-3">
        {helperText ? (
          <Text className="flex-1 text-[12px] leading-[18px] text-ink-soft">
            {helperText}
          </Text>
        ) : (
          <View className="flex-1" />
        )}
        {showCount ? (
          <Text
            className={`text-right text-[13px] ${count > maxLength * 0.9 ? "text-amber-500" : "text-ink-soft"}`}
          >
            {count} / {maxLength}
          </Text>
        ) : null}
      </View>
      {requirementVisible && requirementText ? (
        <Text
          variant="caption"
          className="mt-1 mb-2 text-ink-soft leading-relaxed"
        >
          {requirementText}
        </Text>
      ) : null}
      {statusVisible && statusText ? (
        <View className="mt-2 mb-4 flex-row items-start px-1">
          <View className="mr-3 mt-[1px] h-5 w-5 rounded-full bg-sage-100 items-center justify-center">
            <Text className="text-[12px] text-sage-700">✓</Text>
          </View>
          <Text
            variant="caption"
            className="flex-1 text-[13px] leading-[19px] text-sage-800"
          >
            {statusText}
          </Text>
        </View>
      ) : null}
    </>
  );
}

export function WaveBar({ delay }: { delay: number }) {
  const height = useSharedValue(4);
  useEffect(() => {
    height.value = withDelay(
      delay,
      withRepeat(
        withTiming(12, {
          duration: 400 + Math.random() * 200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, [delay, height]);
  const style = useAnimatedStyle(() => ({ height: height.value }));
  return (
    <Animated.View
      style={[
        {
          width: 2.5,
          backgroundColor: SEMANTIC_COLORS.text.primary,
          borderRadius: 2,
          marginHorizontal: 1,
        },
        style,
      ]}
    />
  );
}

export const composerStyles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    borderRadius,
    borderCurve: "continuous",
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: "#E5E9E2",
    borderBottomColor: "#D0D7CC",
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  inputWrapperFocused: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    borderBottomColor: SEMANTIC_COLORS.brand.pressed,
  },
  inputWrapperRecording: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    borderBottomColor: SEMANTIC_COLORS.brand.pressed,
    backgroundColor: "#F4F7F2",
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderRadius,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
  },
  input: {
    fontFamily: APP_FONT_FAMILIES.regular,
    fontSize: 17,
    lineHeight: 25,
    color: SEMANTIC_COLORS.text.primary,
    textAlignVertical: "top",
    paddingTop: 0,
    paddingBottom: 0,
  },
  footerContainer: { minHeight: 44, marginTop: 10, position: "relative" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  absoluteFooter: { position: "absolute", bottom: 0, left: 0, right: 0 },
  leftActions: { flexDirection: "row", gap: 12 },
  rightActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  waveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAF7",
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: "#E5E9E2",
    borderBottomColor: "#D0D7CC",
    justifyContent: "center",
    alignItems: "center",
  },
  waveButtonRecording: {
    backgroundColor: "#EBF2E8",
    borderColor: SEMANTIC_COLORS.brand.primary,
    borderBottomColor: SEMANTIC_COLORS.brand.pressed,
  },
  inlineActionButton: {
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  pressed: { transform: [{ translateY: 2 }] },
});
