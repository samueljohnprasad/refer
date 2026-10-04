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

const borderRadius = 20;

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
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    borderRadius,
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.border.default,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  inputWrapperFocused: { borderColor: SEMANTIC_COLORS.brand.primary },
  inputWrapperRecording: {
    borderColor: SEMANTIC_COLORS.text.secondary,
    backgroundColor: SEMANTIC_COLORS.surface.elevated,
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderRadius,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  input: {
    fontSize: 16,
    lineHeight: 23,
    color: SEMANTIC_COLORS.text.primary,
    textAlignVertical: "top",
    paddingTop: 0,
    paddingBottom: 0,
  },
  footerContainer: { minHeight: 44, marginTop: 8, position: "relative" },
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
    backgroundColor: SEMANTIC_COLORS.surface.elevated,
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.surface.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  waveButtonRecording: {
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
    borderColor: SEMANTIC_COLORS.text.disabled,
  },
  inlineActionButton: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
